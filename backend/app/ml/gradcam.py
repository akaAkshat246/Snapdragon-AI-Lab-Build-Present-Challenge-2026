from pathlib import Path
import cv2
import numpy as np
import torch
from PIL import Image
from torchvision import models
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

from app.ml.inference import (
    DEVICE,
    CLASS_NAMES,
    transform,
    MODEL_PATH,
)


# ============================================================
# CONFIGURATION
# ============================================================

OUTPUT_DIR = Path(__file__).resolve().parent.parent.parent / "outputs" / "gradcam"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Minimum Grad-CAM activation
HEATMAP_THRESHOLD = 0.65

# Maximum highlighted regions per image
MAX_REGIONS = 50

# Minimum distance between selected points
MIN_PEAK_DISTANCE = 70

# Circle radius relative to image
CIRCLE_RADIUS_RATIO = 0.025


# ============================================================
# LOAD MODEL
# ============================================================

def load_gradcam_model():

    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE,
    )

    model = models.resnet18(
        weights=None
    )

    model.fc = torch.nn.Linear(
        model.fc.in_features,
        5,
    )

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

    model = model.to(DEVICE)
    model.eval()

    return model


# ============================================================
# CREATE RETINA MASK
# ============================================================

def create_retina_mask(image):
    """
    Removes black/background regions so that
    AI highlights are restricted to the fundus area.
    """

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2GRAY,
    )

    gray = cv2.GaussianBlur(
        gray,
        (21, 21),
        0,
    )

    _, mask = cv2.threshold(
        gray,
        10,
        255,
        cv2.THRESH_BINARY,
    )

    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE,
    )

    retina_mask = np.zeros_like(
        gray,
        dtype=np.uint8,
    )

    if contours:

        largest_contour = max(
            contours,
            key=cv2.contourArea,
        )

        cv2.drawContours(
            retina_mask,
            [largest_contour],
            -1,
            255,
            -1,
        )

    else:

        retina_mask[:] = 255

    # Slightly expand valid region
    kernel = np.ones(
        (15, 15),
        np.uint8,
    )

    retina_mask = cv2.morphologyEx(
        retina_mask,
        cv2.MORPH_CLOSE,
        kernel,
    )

    return retina_mask


# ============================================================
# FIND STRONGEST REGIONS
# ============================================================

def find_important_regions(
    grayscale_cam,
    original_image,
):

    # Normalize CAM
    cam = cv2.normalize(
        grayscale_cam,
        None,
        0.0,
        1.0,
        cv2.NORM_MINMAX,
    )

    # Create retina mask
    retina_mask = create_retina_mask(
        original_image
    )

    retina_mask = (
        retina_mask.astype(np.float32)
        / 255.0
    )

    # Ignore background
    cam = cam * retina_mask

    # Remove weak activations
    cam[cam < HEATMAP_THRESHOLD] = 0

    # Smooth activation map
    smoothed_cam = cv2.GaussianBlur(
        cam,
        (21, 21),
        0,
    )

    height, width = smoothed_cam.shape

    # Circle radius
    circle_radius = max(
        18,
        int(
            min(width, height)
            * CIRCLE_RADIUS_RATIO
        ),
    )

    regions = []

    # ========================================================
    # FIND UP TO 50 STRONGEST PEAKS
    # ========================================================

    for _ in range(MAX_REGIONS):

        _, max_val, _, max_loc = cv2.minMaxLoc(
            smoothed_cam
        )

        # Stop if no sufficiently strong region remains
        if max_val < HEATMAP_THRESHOLD:
            break

        x, y = max_loc

        regions.append(
            {
                "center_x": int(x),
                "center_y": int(y),
                "radius": circle_radius,
                "activation": float(max_val),
            }
        )

        # Suppress nearby region
        cv2.circle(
            smoothed_cam,
            (x, y),
            MIN_PEAK_DISTANCE,
            0,
            -1,
        )

    return regions


# ============================================================
# DRAW HIGHLIGHTS ON ORIGINAL FUNDUS IMAGE
# ============================================================

def draw_highlights(
    image,
    regions,
):

    result = image.copy()

    for index, region in enumerate(
        regions,
        start=1,
    ):

        center = (
            region["center_x"],
            region["center_y"],
        )

        radius = region["radius"]
        activation = region["activation"]

        # ====================================================
        # MAXIMUM ACTIVATION REGION = RED
        # ALL OTHER REGIONS = WHITE
        # ====================================================

        if index == 1:
            circle_color = (0, 0, 255)       # RED
            text_color = (0, 0, 255)         # RED
        else:
            circle_color = (255, 255, 255)   # WHITE
            text_color = (255, 255, 255)     # WHITE

        # ====================================================
        # MAIN CIRCLE
        # ====================================================

        cv2.circle(
            result,
            center,
            radius,
            circle_color,
            3,
            cv2.LINE_AA,
        )

        # ====================================================
        # CENTER POINT
        # ====================================================

        cv2.circle(
            result,
            center,
            4,
            circle_color,
            -1,
            cv2.LINE_AA,
        )

        # ====================================================
        # REGION LABEL
        # ====================================================

        label = (
            f"AI-{index} "
            f"{activation * 100:.0f}%"
        )

        label_x = center[0] + radius + 8
        label_y = center[1]

        # Keep label inside image
        if label_x > image.shape[1] - 130:

            label_x = (
                center[0]
                - radius
                - 105
            )

        label_x = max(
            5,
            label_x,
        )

        label_y = max(
            20,
            min(
                label_y,
                image.shape[0] - 5,
            ),
        )

        cv2.putText(
            result,
            label,
            (
                label_x,
                label_y,
            ),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            text_color,
            2,
            cv2.LINE_AA,
        )

    return result


# ============================================================
# GENERATE GRAD-CAM
# ============================================================

def generate_gradcam(
    image_path: str,
):

    print("\nLoading image...")

    # ========================================================
    # ORIGINAL IMAGE
    # ========================================================

    original = Image.open(
        image_path
    ).convert("RGB")

    original_np = np.array(
        original
    )

    original_height, original_width = (
        original_np.shape[:2]
    )

    print(
        f"Original size: "
        f"{original_width} x "
        f"{original_height}"
    )

    # Float image for Grad-CAM visualization
    display_image = (
        original_np.astype(
            np.float32
        ) / 255.0
    )

    # ========================================================
    # PREPROCESS
    # ========================================================

    input_tensor = transform(
        original
    )

    input_tensor = (
        input_tensor
        .unsqueeze(0)
        .to(DEVICE)
    )

    # ========================================================
    # LOAD MODEL
    # ========================================================

    model = load_gradcam_model()

    target_layers = [
        model.layer4[-1]
    ]

    # ========================================================
    # PREDICTION
    # ========================================================

    with torch.no_grad():

        outputs = model(
            input_tensor
        )

        probabilities = torch.softmax(
            outputs,
            dim=1,
        )

        prediction = torch.argmax(
            probabilities,
            dim=1,
        ).item()

        confidence = (
            probabilities[0][prediction]
            .item()
        )

    predicted_class = CLASS_NAMES[
        prediction
    ]

    print(
        f"Prediction: "
        f"{predicted_class}"
    )

    print(
        f"Confidence: "
        f"{confidence * 100:.2f}%"
    )

    # ========================================================
    # GENERATE GRAD-CAM
    # ========================================================

    print(
        "\nGenerating Grad-CAM..."
    )

    cam = GradCAM(
        model=model,
        target_layers=target_layers,
    )

    grayscale_cam = cam(
        input_tensor=input_tensor,
        targets=None,
    )[0]

    # ========================================================
    # RESIZE CAM TO ORIGINAL IMAGE
    # ========================================================

    grayscale_cam = cv2.resize(
        grayscale_cam,
        (
            original_width,
            original_height,
        ),
        interpolation=cv2.INTER_LINEAR,
    )

    # ========================================================
    # NORMALIZE CAM
    # ========================================================

    grayscale_cam = cv2.normalize(
        grayscale_cam,
        None,
        0.0,
        1.0,
        cv2.NORM_MINMAX,
    )

    # ========================================================
    # GENERATE HEATMAP
    # ========================================================

    heatmap = show_cam_on_image(
        display_image,
        grayscale_cam,
        use_rgb=True,
    )

    heatmap_bgr = cv2.cvtColor(
        heatmap,
        cv2.COLOR_RGB2BGR,
    )

    # ========================================================
    # FIND STRONGEST REGIONS
    # ========================================================

    regions = find_important_regions(
        grayscale_cam,
        original_np,
    )

    print(
        f"\nAI-highlighted regions: "
        f"{len(regions)}"
    )

    for index, region in enumerate(
        regions,
        start=1,
    ):

        print(
            f"Region {index}: "
            f"center=("
            f"{region['center_x']}, "
            f"{region['center_y']}"
            f"), activation="
            f"{region['activation'] * 100:.2f}%"
        )

    # ========================================================
    # DRAW CIRCLES ON ORIGINAL FUNDUS IMAGE
    # ========================================================

    original_bgr = cv2.cvtColor(
        original_np,
        cv2.COLOR_RGB2BGR,
    )

    highlighted = draw_highlights(
        original_bgr,
        regions,
    )

    # ========================================================
    # SAVE ORIGINAL
    # ========================================================

    original_path = (
        OUTPUT_DIR
        / "original.jpg"
    )

    cv2.imwrite(
        str(original_path),
        cv2.cvtColor(
            original_np,
            cv2.COLOR_RGB2BGR,
        ),
        [
            cv2.IMWRITE_JPEG_QUALITY,
            95,
        ],
    )

    # ========================================================
    # SAVE HEATMAP
    # ========================================================

    heatmap_path = (
        OUTPUT_DIR
        / "heatmap.jpg"
    )

    cv2.imwrite(
        str(heatmap_path),
        heatmap_bgr,
        [
            cv2.IMWRITE_JPEG_QUALITY,
            95,
        ],
    )

    # ========================================================
    # SAVE EXPLAINED RESULT
    # ========================================================

    explained_path = (
        OUTPUT_DIR
        / "explained_result.jpg"
    )

    cv2.imwrite(
        str(explained_path),
        highlighted,
        [
            cv2.IMWRITE_JPEG_QUALITY,
            95,
        ],
    )

    # ========================================================
    # RESULT
    # ========================================================

    print("\nFiles saved:")

    print(
        f"Original: "
        f"{original_path}"
    )

    print(
        f"Heatmap: "
        f"{heatmap_path}"
    )

    print(
        f"Explained: "
        f"{explained_path}"
    )

    # Cleanup
    del cam

    return {
        "prediction": predicted_class,
        "class_id": prediction,
        "confidence": round(
            confidence * 100,
            2,
        ),
        "regions": len(regions),
        "original": f"outputs/gradcam/{original_path.name}",
        "heatmap": f"outputs/gradcam/{heatmap_path.name}",
        "explained_result": f"outputs/gradcam/{explained_path.name}",
    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    test_image = (
        "data/aptos/train_images/"
        "000c1434d8d7.png"
    )

    print(
        "DR-XAI Grad-CAM + "
        "50 Strongest Region Detection"
    )

    print("=" * 60)

    result = generate_gradcam(
        test_image
    )

    print("\nResult:")
    print(result)