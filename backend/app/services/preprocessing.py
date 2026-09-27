import cv2
import numpy as np
from PIL import Image


TARGET_SIZE = 512


def preprocess_fundus_image(image: Image.Image) -> dict:
    """
    Preprocess a retinal fundus image.

    Steps:
    1. Convert image to RGB
    2. Convert to NumPy array
    3. Resize while preserving a standard input size
    4. Normalize pixel values
    """

    # Convert to RGB
    image = image.convert("RGB")

    # PIL -> NumPy
    image_array = np.array(image)

    # Resize
    resized = cv2.resize(
        image_array,
        (TARGET_SIZE, TARGET_SIZE),
        interpolation=cv2.INTER_AREA,
    )

    # Normalize pixel values from 0-255 to 0-1
    normalized = resized.astype(np.float32) / 255.0

    return {
        "original_width": image.width,
        "original_height": image.height,
        "processed_width": TARGET_SIZE,
        "processed_height": TARGET_SIZE,
        "normalized": normalized,
    }