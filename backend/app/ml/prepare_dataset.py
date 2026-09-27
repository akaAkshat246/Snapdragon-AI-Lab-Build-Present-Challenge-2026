import shutil
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


SOURCE_DIR = Path("data/aptos")
IMAGE_DIR = SOURCE_DIR / "train_images"

OUTPUT_DIR = Path("data/dr_dataset")

TRAIN_DIR = OUTPUT_DIR / "train"
VAL_DIR = OUTPUT_DIR / "val"


def find_image(image_id: str):
    """
    Find an image regardless of whether the dataset
    uses png, jpg, or jpeg.
    """

    for extension in [".png", ".jpg", ".jpeg"]:
        image_path = IMAGE_DIR / f"{image_id}{extension}"

        if image_path.exists():
            return image_path

    return None


def main():

    csv_path = SOURCE_DIR / "train.csv"

    if not csv_path.exists():
        raise FileNotFoundError(
            f"CSV not found: {csv_path}"
        )

    if not IMAGE_DIR.exists():
        raise FileNotFoundError(
            f"Image directory not found: {IMAGE_DIR}"
        )

    # Load CSV
    df = pd.read_csv(csv_path)

    print("CSV columns:", list(df.columns))
    print("Total samples:", len(df))

    # Check required columns
    if "id_code" not in df.columns:
        raise ValueError("Missing column: id_code")

    if "diagnosis" not in df.columns:
        raise ValueError("Missing column: diagnosis")

    # Remove invalid rows
    df = df.dropna(
        subset=["id_code", "diagnosis"]
    )

    df["diagnosis"] = df["diagnosis"].astype(int)

    print("\nOriginal class distribution:")
    print(
        df["diagnosis"]
        .value_counts()
        .sort_index()
    )

    # Stratified 80/20 split
    train_df, val_df = train_test_split(
        df,
        test_size=0.20,
        random_state=42,
        stratify=df["diagnosis"],
    )

    print("\nTraining samples:", len(train_df))
    print("Validation samples:", len(val_df))

    # Create class folders
    for label in range(5):

        (TRAIN_DIR / str(label)).mkdir(
            parents=True,
            exist_ok=True,
        )

        (VAL_DIR / str(label)).mkdir(
            parents=True,
            exist_ok=True,
        )

    def copy_dataset(dataframe, destination):

        copied = 0
        missing = 0

        for _, row in dataframe.iterrows():

            image_id = str(row["id_code"])
            label = int(row["diagnosis"])

            source = find_image(image_id)

            if source is None:
                missing += 1
                continue

            target = (
                destination
                / str(label)
                / source.name
            )

            shutil.copy2(
                source,
                target,
            )

            copied += 1

        return copied, missing

    # Training
    print("\nCopying training images...")

    train_copied, train_missing = copy_dataset(
        train_df,
        TRAIN_DIR,
    )

    print(
        f"Training copied: {train_copied}"
    )

    print(
        f"Training missing: {train_missing}"
    )

    # Validation
    print("\nCopying validation images...")

    val_copied, val_missing = copy_dataset(
        val_df,
        VAL_DIR,
    )

    print(
        f"Validation copied: {val_copied}"
    )

    print(
        f"Validation missing: {val_missing}"
    )

    print("\nDataset preparation complete!")


if __name__ == "__main__":
    main()