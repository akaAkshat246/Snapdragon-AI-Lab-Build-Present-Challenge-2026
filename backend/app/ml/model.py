import torch
import torch.nn as nn
from torchvision import models


NUM_CLASSES = 5


def create_model():
    """
    Create the DR classification model architecture.

    Classes:
    0 - No DR
    1 - Mild DR
    2 - Moderate DR
    3 - Severe DR
    4 - Proliferative DR
    """

    model = models.resnet18(weights=None)

    model.fc = nn.Linear(
        model.fc.in_features,
        NUM_CLASSES,
    )

    return model


def get_device():
    """
    Select GPU if available, otherwise CPU.
    """

    return torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )