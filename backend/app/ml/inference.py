from pathlib import Path

import torch
import torch.nn as nn

from PIL import Image
from torchvision import models, transforms


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

MODEL_CANDIDATES = [
    BASE_DIR / "models" / "dr_resnet18_FINAL_FROZEN.pth",
    BASE_DIR / "models" / "dr_resnet18_final.pth",
    BASE_DIR / "models" / "dr_resnet18_best.pth",
    Path("models/dr_resnet18_FINAL_FROZEN.pth"),
]

MODEL_PATH = next((p for p in MODEL_CANDIDATES if p.exists()), MODEL_CANDIDATES[0])

NUM_CLASSES = 5

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ============================================================
# CLASS NAMES
# ============================================================

CLASS_NAMES = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR",
}


# ============================================================
# IMAGE TRANSFORM
# ============================================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[
            0.485,
            0.456,
            0.406,
        ],
        std=[
            0.229,
            0.224,
            0.225,
        ],
    ),
])


# ============================================================
# LOAD MODEL
# ============================================================

def load_model():

    print("Loading DR model...")

    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE,
    )

    model = models.resnet18(
        weights=None
    )

    model.fc = nn.Linear(
        model.fc.in_features,
        NUM_CLASSES,
    )

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

    model = model.to(DEVICE)

    # IMPORTANT:
    # Evaluation mode = no training/update
    model.eval()

    print(
        "Model loaded successfully!"
    )

    print(
        "Device:",
        DEVICE,
    )

    print(
        "Validation accuracy:",
        f"{checkpoint['validation_accuracy']:.2%}"
    )

    return model


# ============================================================
# PREDICTION FUNCTION
# ============================================================

def predict(
    image_path: str,
    model=None,
):

    if model is None:
        model = load_model()

    # --------------------------------------------------------
    # OPEN IMAGE
    # --------------------------------------------------------

    image = Image.open(
        image_path
    ).convert("RGB")

    # --------------------------------------------------------
    # PREPROCESS
    # --------------------------------------------------------

    image_tensor = transform(
        image
    )

    image_tensor = (
        image_tensor
        .unsqueeze(0)
        .to(DEVICE)
    )

    # --------------------------------------------------------
    # PREDICTION
    # --------------------------------------------------------

    with torch.no_grad():

        outputs = model(
            image_tensor
        )

        probabilities = torch.softmax(
            outputs,
            dim=1,
        )

        confidence, prediction = torch.max(
            probabilities,
            dim=1,
        )

    predicted_class = prediction.item()

    confidence_value = (
        confidence.item()
    )

    # --------------------------------------------------------
    # ALL CLASS PROBABILITIES
    # --------------------------------------------------------

    class_probabilities = {}

    for index, probability in enumerate(
        probabilities[0]
    ):

        class_probabilities[
            CLASS_NAMES[index]
        ] = round(
            probability.item() * 100,
            2,
        )

    # --------------------------------------------------------
    # RESULT
    # --------------------------------------------------------

    result = {
        "prediction": CLASS_NAMES[
            predicted_class
        ],

        "class_id": predicted_class,

        "confidence": round(
            confidence_value * 100,
            2,
        ),

        "probabilities": class_probabilities,
    }

    return result


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print("\nDR-XAI Inference Test")
    print("=" * 50)

    model = load_model()

    print("\nModel is ready.")

    print(
        "Use predict(image_path, model)"
        " to run a prediction."
    )