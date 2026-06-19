"""Classify a folder of downloaded Unsplash images with the trained filter model."""

from __future__ import annotations

import argparse
import csv
import shutil
from collections import Counter
from pathlib import Path

import joblib
import numpy as np

try:
    from .config import MODEL_PATH
    from .feature_extractor import extract_features
except ImportError:  # Allows: python backend/ml/classify_unsplash_images.py
    from config import MODEL_PATH
    from feature_extractor import extract_features


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATASET_DIR = PROJECT_ROOT / "datasets-master" / "downloads" / "unsplash-lite-1.4.0"
DEFAULT_INPUT_DIR = DEFAULT_DATASET_DIR / "images_raw"
DEFAULT_OUTPUT_DIR = DEFAULT_DATASET_DIR / "classified_by_model"


def iter_images(input_dir: Path) -> list[Path]:
    extensions = {".jpg", ".jpeg", ".png"}
    return sorted(path for path in input_dir.iterdir() if path.is_file() and path.suffix.lower() in extensions)


def classify_images(input_dir: Path, output_dir: Path, manifest_path: Path) -> Counter[str]:
    if not input_dir.exists():
        raise FileNotFoundError(f"Input folder not found: {input_dir}")
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

    bundle = joblib.load(MODEL_PATH)
    model = bundle["model"] if isinstance(bundle, dict) and "model" in bundle else bundle
    images = iter_images(input_dir)
    if not images:
        raise RuntimeError(f"No images found in: {input_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    counts: Counter[str] = Counter()
    failures: list[tuple[str, str]] = []

    with manifest_path.open("w", encoding="utf-8", newline="") as manifest_file:
        writer = csv.writer(manifest_file)
        writer.writerow(["image", "predicted_label", "confidence", "output_path"])

        for index, image_path in enumerate(images, start=1):
            try:
                features = extract_features(str(image_path))
                x = np.array([features], dtype=np.float32)
                label = str(model.predict(x)[0])
                confidence = 0.0
                if hasattr(model, "predict_proba"):
                    confidence = float(np.max(model.predict_proba(x)[0]))

                label_dir = output_dir / label
                label_dir.mkdir(parents=True, exist_ok=True)
                target = label_dir / image_path.name
                if not target.exists():
                    shutil.copy2(image_path, target)

                counts[label] += 1
                writer.writerow([str(image_path), label, f"{confidence:.4f}", str(target)])
            except Exception as exc:
                failures.append((str(image_path), str(exc)))

            if index % 250 == 0 or index == len(images):
                print(f"Progress: {index}/{len(images)} | counts={dict(counts)} | failed={len(failures)}", flush=True)

    if failures:
        failures_path = output_dir / "classification_failures.csv"
        with failures_path.open("w", encoding="utf-8", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["image", "error"])
            writer.writerows(failures)
        print(f"Failures written to: {failures_path}")

    return counts


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, default=DEFAULT_INPUT_DIR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_OUTPUT_DIR / "manifest.csv")
    args = parser.parse_args()

    print(f"Input folder: {args.input_dir}")
    print(f"Output folder: {args.output_dir}")
    print(f"Manifest: {args.manifest}")

    counts = classify_images(args.input_dir, args.output_dir, args.manifest)
    print("Done.")
    for label, count in sorted(counts.items()):
        print(f"- {label}: {count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
