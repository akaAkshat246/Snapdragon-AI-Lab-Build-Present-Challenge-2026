from io import BytesIO
from pathlib import Path
import hashlib
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from app.ml.gradcam import generate_gradcam
from app.services.preprocessing import preprocess_fundus_image


router = APIRouter(
    prefix="/api/screening",
    tags=["Screening"],
)


# ============================================================
# CONFIGURATION
# ============================================================

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
}

MAX_FILE_SIZE = 10 * 1024 * 1024

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "outputs" / "api" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

from app.services.db_service import save_screening_record


# ============================================================
# ANALYZE IMAGE
# ============================================================

@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...)
):

    # ========================================================
    # 1. CHECK CONTENT TYPE
    # ========================================================

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are allowed.",
        )

    # ========================================================
    # 2. READ EXACT UPLOADED BYTES
    # ========================================================

    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Image size must be less than 10 MB.",
        )

    # ========================================================
    # 3. DEBUG HASH
    # ========================================================

    raw_hash = hashlib.sha256(
        image_bytes
    ).hexdigest()

    print("\n" + "=" * 70)
    print("NEW SCREENING REQUEST")
    print("=" * 70)

    print("Original filename :", file.filename)
    print("Content type      :", file.content_type)
    print("Uploaded bytes    :", len(image_bytes))
    print("RAW SHA256        :", raw_hash)

    # ========================================================
    # 4. VALIDATE IMAGE
    # ========================================================

    try:

        check_image = Image.open(
            BytesIO(image_bytes)
        )

        original_format = check_image.format
        original_width, original_height = (
            check_image.size
        )

        check_image.verify()

    except UnidentifiedImageError:

        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=f"Unable to process uploaded image: {exc}",
        )

    # ========================================================
    # 5. REOPEN IMAGE AFTER verify()
    # ========================================================

    try:

        image = Image.open(
            BytesIO(image_bytes)
        ).convert("RGB")

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=f"Unable to decode uploaded image: {exc}",
        )

    # ========================================================
    # 6. PIXEL HASH
    # ========================================================

    pixel_hash = hashlib.sha256(
        image.tobytes()
    ).hexdigest()

    print("Original dimensions:", image.size)
    print("Pixel SHA256        :", pixel_hash)

    # ========================================================
    # 7. PREPROCESSING CHECK
    # ========================================================

    try:

        processed = preprocess_fundus_image(
            image
        )

        print(
            "Preprocessing completed."
        )

    except Exception as exc:

        print(
            "Preprocessing warning:",
            exc
        )

        # Screening can continue because
        # inference.py performs its own transform.
        processed = {
            "original_width": original_width,
            "original_height": original_height,
            "processed_width": 224,
            "processed_height": 224,
        }

    # ========================================================
    # 8. SAVE EXACT ORIGINAL UPLOAD
    # ========================================================
    #
    # IMPORTANT:
    # Do NOT convert the uploaded image to JPEG here.
    #
    # We save EXACTLY the bytes received from browser.
    # ========================================================

    image_id = uuid.uuid4().hex

    if file.content_type == "image/png":
        extension = ".png"
    else:
        extension = ".jpg"

    input_path = (
        UPLOAD_DIR
        / f"{image_id}{extension}"
    )

    try:

        with open(
            input_path,
            "wb"
        ) as output_file:

            output_file.write(
                image_bytes
            )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to save uploaded image: {exc}",
        )

    # ========================================================
    # 9. VERIFY SAVED FILE
    # ========================================================

    saved_bytes = input_path.read_bytes()

    saved_hash = hashlib.sha256(
        saved_bytes
    ).hexdigest()

    print("Saved file        :", input_path)
    print("Saved bytes       :", len(saved_bytes))
    print("Saved SHA256      :", saved_hash)

    if saved_hash != raw_hash:

        if input_path.exists():
            input_path.unlink()

        raise HTTPException(
            status_code=500,
            detail="Uploaded image changed while being saved.",
        )

    print(
        "UPLOAD INTEGRITY  : OK"
    )

    # ========================================================
    # 10. RUN AI + GRAD-CAM
    # ========================================================

    try:

        result = generate_gradcam(
            str(input_path)
        )

    except Exception as exc:

        if input_path.exists():
            input_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"AI inference failed: {str(exc)}",
        )

    # ========================================================
    # 11. PRINT MODEL RESULT
    # ========================================================

    print(
        "Prediction        :",
        result["prediction"]
    )

    print(
        "Class ID          :",
        result["class_id"]
    )

    print(
        "Confidence        :",
        result["confidence"]
    )

    print("=" * 70)
    print()

    # ========================================================
    # 12. RECOMMENDATION
    # ========================================================

    prediction = result["prediction"]

    if prediction.lower() in {
        "no dr",
        "no diabetic retinopathy",
        "normal",
        "grade 0",
    }:

        recommendation = (
            "No significant diabetic retinopathy indicators "
            "were identified by the AI model. Routine eye "
            "screening is recommended."
        )

    else:

        recommendation = (
            "The AI model identified features associated "
            "with diabetic retinopathy. Clinical evaluation "
            "by a qualified eye-care professional is recommended."
        )

    # ========================================================
    # 13. RESPONSE
    # ========================================================

    response_payload = {

        "success": True,

        "filename": file.filename,

        "content_type": file.content_type,

        "image": {

            "format": original_format,

            "original_width": original_width,

            "original_height": original_height,

            "processed_width": processed.get(
                "processed_width",
                224
            ),

            "processed_height": processed.get(
                "processed_height",
                224
            ),

            "size_bytes": len(image_bytes),

        },

        "message": (
            "Fundus image analyzed successfully."
        ),

        "analysis": {

            "status": "completed",

            "prediction": result["prediction"],

            "class_id": result["class_id"],

            "confidence": result["confidence"],

            "image_quality": "acceptable",

            "xai": {

                "method": "Grad-CAM",

                "regions": result["regions"],

                "original": result["original"],

                "heatmap": result["heatmap"],

                "explained_result": (
                    result["explained_result"]
                ),

            },

            "recommendation": recommendation,

        },

    }

    try:
        save_screening_record(response_payload)
    except Exception as db_err:
        print(f"[MongoDB] Notice: {db_err}")

    return response_payload