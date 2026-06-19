"""Train and export the AI Recommend Filter model."""

from __future__ import annotations

from collections import Counter
from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
import sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

try:
    from .config import DATASET_DIR, FEATURE_NAMES, LABELS, MODEL_PATH, MODELS_DIR, SUPPORTED_IMAGE_EXTENSIONS
    from .feature_extractor import extract_features
except ImportError:  # Allows: python backend/ml/train_model.py
    from config import DATASET_DIR, FEATURE_NAMES, LABELS, MODEL_PATH, MODELS_DIR, SUPPORTED_IMAGE_EXTENSIONS
    from feature_extractor import extract_features


def iter_image_files(label_dir: Path) -> list[Path]:
    """Return supported image files inside one label folder."""
    if not label_dir.exists():
        return []
    return sorted(path for path in label_dir.iterdir() if path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS and path.is_file())


def load_dataset() -> tuple[np.ndarray, np.ndarray]:
    """Load features and labels from backend/ml/dataset/<label_name>/."""
    features: list[list[float]] = []
    labels: list[str] = []

    print(f"Dataset folder: {DATASET_DIR}")
    for label in LABELS:
        label_dir = DATASET_DIR / label
        image_files = iter_image_files(label_dir)
        print(f"- {label}: {len(image_files)} image(s)")

        for image_path in image_files:
            try:
                features.append(extract_features(str(image_path)))
                labels.append(label)
            except Exception as exc:
                print(f"  Skipped {image_path.name}: {exc}")

    return np.array(features, dtype=np.float32), np.array(labels)


def train() -> Path:
    """Train RandomForest and save a model bundle to MODEL_PATH."""
    x, y = load_dataset()
    class_counts = Counter(y)

    if len(y) < 2:
        raise RuntimeError("Need at least 2 valid training images before training.")
    if len(class_counts) < 2:
        raise RuntimeError("Need images from at least 2 different label folders.")

    print("\nClass counts:")
    for label in LABELS:
        print(f"- {label}: {class_counts.get(label, 0)}")

    model = RandomForestClassifier(
        n_estimators=150,
        random_state=42,
        class_weight="balanced",
    )

    min_class_count = min(class_counts.values())
    can_split = len(y) >= 10 and min_class_count >= 2

    if can_split:
        x_train, x_test, y_train, y_test = train_test_split(
            x,
            y,
            test_size=0.2,
            random_state=42,
            stratify=y,
        )
        model.fit(x_train, y_train)
        predictions = model.predict(x_test)
        print("\nEvaluation:")
        print(f"Accuracy: {accuracy_score(y_test, predictions):.4f}")
        print(classification_report(y_test, predictions, zero_division=0))
    else:
        print("\nSmall dataset detected. Training on all images and skipping train/test split.")
        model.fit(x, y)

    bundle = {
        "model": model,
        "labels": list(LABELS),
        "feature_names": list(FEATURE_NAMES),
        "model_type": "RandomForestClassifier",
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "sklearn_version": sklearn.__version__,
    }

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, MODEL_PATH)
    print(f"\nSaved model bundle: {MODEL_PATH}")
    return MODEL_PATH


if __name__ == "__main__":
    train()

