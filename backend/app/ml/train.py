import copy
from pathlib import Path

import torch
import torch.nn as nn
import torch.optim as optim

from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader


# ============================================================
# CONFIGURATION
# ============================================================

DATA_DIR = Path("data/dr_dataset")
MODEL_DIR = Path("models")

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

NUM_CLASSES = 5
BATCH_SIZE = 16

# We already trained 6 epochs.
START_EPOCH = 6
TOTAL_EPOCHS = 10

LEARNING_RATE = 1e-4

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", DEVICE)


# ============================================================
# IMAGE TRANSFORMS
# ============================================================

train_transform = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.RandomHorizontalFlip(p=0.5),

    transforms.RandomRotation(degrees=10),

    transforms.ColorJitter(
        brightness=0.15,
        contrast=0.15,
    ),

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


val_transform = transforms.Compose([
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
# DATASETS
# ============================================================

train_dataset = datasets.ImageFolder(
    DATA_DIR / "train",
    transform=train_transform,
)

val_dataset = datasets.ImageFolder(
    DATA_DIR / "val",
    transform=val_transform,
)

print("\nClasses:")
print(train_dataset.classes)

print(
    "Training images:",
    len(train_dataset),
)

print(
    "Validation images:",
    len(val_dataset),
)


# ============================================================
# DATALOADERS
# ============================================================

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=0,
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0,
)


# ============================================================
# CLASS WEIGHTS
# ============================================================

class_counts = torch.zeros(
    NUM_CLASSES,
    dtype=torch.float,
)

for _, label in train_dataset.samples:
    class_counts[label] += 1


print("\nClass counts:")
print(class_counts)


class_weights = 1.0 / class_counts

class_weights = (
    class_weights
    / class_weights.sum()
    * NUM_CLASSES
)

class_weights = class_weights.to(DEVICE)

print("\nClass weights:")
print(class_weights)


# ============================================================
# MODEL
# ============================================================

print("\nLoading ResNet18...")

weights = models.ResNet18_Weights.DEFAULT

model = models.resnet18(
    weights=weights
)

model.fc = nn.Linear(
    model.fc.in_features,
    NUM_CLASSES,
)

model = model.to(DEVICE)


# ============================================================
# LOAD EXISTING BEST MODEL
# ============================================================

CHECKPOINT_PATH = (
    MODEL_DIR / "dr_resnet18_best_6epoch.pth"
)

print(
    "\nLoading existing 6-epoch checkpoint..."
)

checkpoint = torch.load(
    CHECKPOINT_PATH,
    map_location=DEVICE,
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

best_accuracy = checkpoint[
    "validation_accuracy"
]

best_model_weights = copy.deepcopy(
    model.state_dict()
)

print(
    f"Existing best validation accuracy: "
    f"{best_accuracy:.4f}"
)


# ============================================================
# LOSS + OPTIMIZER
# ============================================================

criterion = nn.CrossEntropyLoss(
    weight=class_weights
)

optimizer = optim.AdamW(
    model.parameters(),
    lr=LEARNING_RATE,
    weight_decay=1e-4,
)


scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="max",
    factor=0.5,
    patience=1,
)


# ============================================================
# TRAINING FUNCTION
# ============================================================

def train_one_epoch():

    model.train()

    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:

        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(
            outputs,
            labels,
        )

        loss.backward()

        optimizer.step()

        running_loss += (
            loss.item()
            * images.size(0)
        )

        _, predicted = torch.max(
            outputs,
            1,
        )

        total += labels.size(0)

        correct += (
            predicted == labels
        ).sum().item()

    epoch_loss = (
        running_loss / total
    )

    epoch_accuracy = (
        correct / total
    )

    return (
        epoch_loss,
        epoch_accuracy,
    )


# ============================================================
# VALIDATION FUNCTION
# ============================================================

def validate():

    model.eval()

    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            outputs = model(images)

            loss = criterion(
                outputs,
                labels,
            )

            running_loss += (
                loss.item()
                * images.size(0)
            )

            _, predicted = torch.max(
                outputs,
                1,
            )

            total += labels.size(0)

            correct += (
                predicted == labels
            ).sum().item()

    validation_loss = (
        running_loss / total
    )

    validation_accuracy = (
        correct / total
    )

    return (
        validation_loss,
        validation_accuracy,
    )


# ============================================================
# CONTINUED TRAINING
# ============================================================

print("\nContinuing training...")

print("=" * 60)

for epoch in range(
    START_EPOCH,
    TOTAL_EPOCHS,
):

    train_loss, train_accuracy = (
        train_one_epoch()
    )

    (
        val_loss,
        val_accuracy,
    ) = validate()

    scheduler.step(
        val_accuracy
    )

    print(
        f"\nEpoch "
        f"{epoch + 1}/{TOTAL_EPOCHS}"
    )

    print(
        f"Train Loss: "
        f"{train_loss:.4f}"
    )

    print(
        f"Train Accuracy: "
        f"{train_accuracy:.4f}"
    )

    print(
        f"Validation Loss: "
        f"{val_loss:.4f}"
    )

    print(
        f"Validation Accuracy: "
        f"{val_accuracy:.4f}"
    )

    # --------------------------------------------------------
    # SAVE ONLY IF BETTER
    # --------------------------------------------------------

    if val_accuracy > best_accuracy:

        best_accuracy = val_accuracy

        best_model_weights = (
            copy.deepcopy(
                model.state_dict()
            )
        )

        torch.save(
            {
                "model_state_dict":
                    model.state_dict(),

                "classes":
                    train_dataset.classes,

                "validation_accuracy":
                    val_accuracy,
            },

            MODEL_DIR
            / "dr_resnet18_best.pth",
        )

        print(
            "✓ New best model saved!"
        )

    else:

        print(
            "No improvement."
        )


# ============================================================
# RESTORE BEST MODEL
# ============================================================

model.load_state_dict(
    best_model_weights
)


# ============================================================
# SAVE FINAL MODEL
# ============================================================

torch.save(
    {
        "model_state_dict":
            model.state_dict(),

        "classes":
            train_dataset.classes,

        "validation_accuracy":
            best_accuracy,
    },

    MODEL_DIR
    / "dr_resnet18_final.pth",
)


# ============================================================
# COMPLETE
# ============================================================

print("\n" + "=" * 60)

print(
    "Training complete!"
)

print(
    f"Best validation accuracy: "
    f"{best_accuracy:.4f}"
)

print(
    "\nModel saved at:"
)

print(
    MODEL_DIR
    / "dr_resnet18_best.pth"
)

print(
    MODEL_DIR
    / "dr_resnet18_final.pth"
)

print(
    "\nOriginal 6-epoch backup:"
)

print(
    MODEL_DIR
    / "dr_resnet18_best_6epoch.pth"
)