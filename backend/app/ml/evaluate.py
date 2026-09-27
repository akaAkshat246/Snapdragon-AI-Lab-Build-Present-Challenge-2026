from pathlib import Path

import torch
import torch.nn as nn

from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score,
    accuracy_score,
)

import numpy as np


# ============================================================
# CONFIG
# ============================================================

DATA_DIR = Path("data/dr_dataset")
MODEL_PATH = Path("models/dr_resnet18_best.pth")

BATCH_SIZE = 16

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ============================================================
# TRANSFORM
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
# DATASET
# ============================================================

val_dataset = datasets.ImageFolder(
    DATA_DIR / "val",
    transform=transform,
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0,
)

classes = val_dataset.classes

print("Classes:", classes)
print("Validation images:", len(val_dataset))


# ============================================================
# MODEL
# ============================================================

print("\nLoading trained model...")

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
)

model = models.resnet18(
    weights=None
)

model.fc = nn.Linear(
    model.fc.in_features,
    len(classes),
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(DEVICE)

model.eval()


# ============================================================
# PREDICTION
# ============================================================

all_labels = []
all_predictions = []

print("\nRunning evaluation...")

with torch.no_grad():

    for images, labels in val_loader:

        images = images.to(DEVICE)

        outputs = model(images)

        predictions = torch.argmax(
            outputs,
            dim=1,
        )

        all_labels.extend(
            labels.numpy()
        )

        all_predictions.extend(
            predictions.cpu().numpy()
        )


# ============================================================
# METRICS
# ============================================================

accuracy = accuracy_score(
    all_labels,
    all_predictions,
)

macro_f1 = f1_score(
    all_labels,
    all_predictions,
    average="macro",
)

print("\n" + "=" * 60)

print(
    f"Validation Accuracy: "
    f"{accuracy * 100:.2f}%"
)

print(
    f"Macro F1 Score: "
    f"{macro_f1:.4f}"
)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:")
print()

print(
    classification_report(
        all_labels,
        all_predictions,
        target_names=[
            "No DR",
            "Mild",
            "Moderate",
            "Severe",
            "Proliferative DR",
        ],
        digits=4,
        zero_division=0,
    )
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    all_labels,
    all_predictions,
)

print("\nConfusion Matrix:")
print(cm)


# ============================================================
# SENSITIVITY / RECALL
# ============================================================

print("\nClass-wise Sensitivity:")

for index, class_name in enumerate(classes):

    true_positive = cm[index, index]

    total_actual = cm[index].sum()

    sensitivity = (
        true_positive / total_actual
        if total_actual > 0
        else 0
    )

    print(
        f"{class_name}: "
        f"{sensitivity * 100:.2f}%"
    )


print("\n" + "=" * 60)

print("Evaluation complete!")