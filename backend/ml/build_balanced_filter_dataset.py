"""Build a balanced training dataset from downloaded Unsplash Lite images."""

from __future__ import annotations

import argparse
import csv
import shutil
from collections import defaultdict
from pathlib import Path

import cv2
import numpy as np

try:
    from .config import DATASET_DIR, FEATURE_NAMES, LABELS
    from .feature_extractor import extract_features
except ImportError:  # Allows: python backend/ml/build_balanced_filter_dataset.py
    from config import DATASET_DIR, FEATURE_NAMES, LABELS
    from feature_extractor import extract_features


PROJECT_ROOT = Path(__file__).resolve().parents[2]
UNSPLASH_DIR = PROJECT_ROOT / "datasets-master" / "downloads" / "unsplash-lite-1.4.0"
DEFAULT_RAW_DIR = UNSPLASH_DIR / "images_raw"
DEFAULT_PHOTOS_FILE = UNSPLASH_DIR / "photos.csv000"
DEFAULT_KEYWORDS_FILE = UNSPLASH_DIR / "keywords.tsv000"
DEFAULT_SELECTION_MANIFEST = UNSPLASH_DIR / "selected_training_manifest.csv"

HUMAN_KEYWORDS = {
    "adult",
    "baby",
    "boy",
    "child",
    "face",
    "fashion",
    "girl",
    "hair",
    "human",
    "lady",
    "man",
    "model",
    "people",
    "person",
    "portrait",
    "selfie",
    "skin",
    "woman",
}


def read_bgr_image(path: Path) -> np.ndarray:
    data = np.fromfile(path, dtype=np.uint8)
    image = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"OpenCV could not read image: {path}")
    return image


def skin_ratio(bgr_image: np.ndarray) -> float:
    small = cv2.resize(bgr_image, (160, 160), interpolation=cv2.INTER_AREA)
    rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB).astype(np.int16)
    red = rgb[:, :, 0]
    green = rgb[:, :, 1]
    blue = rgb[:, :, 2]
    max_channel = np.max(rgb, axis=2)
    min_channel = np.min(rgb, axis=2)

    skin_mask = (
        (red > 95)
        & (green > 40)
        & (blue > 20)
        & ((max_channel - min_channel) > 15)
        & (np.abs(red - green) > 15)
        & (red > green)
        & (red > blue)
    )
    return float(np.mean(skin_mask))


def face_count(bgr_image: np.ndarray, detector: cv2.CascadeClassifier) -> int:
    gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
    height, width = gray.shape[:2]
    scale = 360 / max(width, height)
    if scale < 1:
        gray = cv2.resize(gray, (int(width * scale), int(height * scale)), interpolation=cv2.INTER_AREA)

    faces = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(28, 28))
    return int(len(faces))


def load_photo_text(photos_file: Path, wanted_ids: set[str]) -> dict[str, str]:
    text_by_id: dict[str, str] = {}
    with photos_file.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file, delimiter="\t")
        for row in reader:
            photo_id = row["photo_id"]
            if photo_id not in wanted_ids:
                continue
            parts = [
                row.get("photo_description", ""),
                row.get("ai_description", ""),
                row.get("photo_location_name", ""),
                row.get("photo_location_country", ""),
                row.get("photo_location_city", ""),
            ]
            text_by_id[photo_id] = " ".join(part for part in parts if part).lower()
    return text_by_id


def load_keywords(keywords_file: Path, wanted_ids: set[str]) -> dict[str, set[str]]:
    keywords_by_id: dict[str, set[str]] = defaultdict(set)
    with keywords_file.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file, delimiter="\t")
        for row in reader:
            photo_id = row["photo_id"]
            if photo_id in wanted_ids:
                keyword = row.get("keyword", "").strip().lower()
                if keyword:
                    keywords_by_id[photo_id].add(keyword)
    return keywords_by_id


def bell(value: float, center: float, width: float) -> float:
    return max(0.0, 1.0 - abs(value - center) / width)


def feature_map(features: list[float]) -> dict[str, float]:
    return dict(zip(FEATURE_NAMES, features))


def score_record(record: dict) -> dict[str, float]:
    features = record["features"]
    keywords = record["keywords"]
    text = record["text"]
    human_keyword_hits = len(keywords & HUMAN_KEYWORDS)
    human_text_bonus = 1.0 if any(word in text for word in HUMAN_KEYWORDS) else 0.0
    pred = record.get("predicted_label", "")
    conf = record.get("confidence", 0.0)

    saturation = features["saturation_mean"]
    brightness = features["brightness_mean"]
    sharpness = min(features["sharpness_laplacian_var"] / 900.0, 3.0)
    edge_density = features["edge_density"]
    colorfulness = features["colorfulness"]
    warm_ratio = features["warm_ratio"]
    cool_ratio = features["cool_ratio"]
    red_blue_delta = (features["red_mean"] - features["blue_mean"]) / 255.0

    return {
        "black_white": (
            bell(saturation, 10, 55) * 3.0
            + bell(colorfulness, 8, 45) * 2.0
            + (1.0 if pred == "black_white" else 0.0) * (1.0 + conf)
        ),
        "vintage": (
            bell(saturation, 60, 75) * 2.2
            + bell(brightness, 135, 90) * 1.2
            + max(0.0, 0.35 - abs(red_blue_delta)) * 1.2
            + (1.0 if pred == "vintage" else 0.0) * (1.0 + conf)
        ),
        "warm_gold": (
            warm_ratio * 4.0
            + max(0.0, red_blue_delta) * 2.0
            + bell(brightness, 160, 100)
            + (saturation / 255.0)
            - cool_ratio
            + (1.0 if pred == "warm_gold" else 0.0) * (1.0 + conf)
        ),
        "smooth_skin": (
            min(record["face_count"], 2) * 3.0
            + min(human_keyword_hits, 4) * 0.9
            + human_text_bonus
            + record["skin_ratio"] * 5.0
            + bell(brightness, 150, 110)
            - edge_density * 2.5
        ),
        "sharp_gold": (
            sharpness * 2.0
            + edge_density * 8.0
            + warm_ratio * 3.0
            + max(0.0, red_blue_delta) * 2.0
            + (saturation / 255.0)
            + (1.0 if pred == "warm_gold" else 0.0) * conf
        ),
    }


def load_classification_manifest(manifest_path: Path) -> dict[str, tuple[str, float]]:
    predictions: dict[str, tuple[str, float]] = {}
    if not manifest_path.exists():
        return predictions

    with manifest_path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            image_name = Path(row["image"]).name
            try:
                confidence = float(row.get("confidence", 0.0))
            except ValueError:
                confidence = 0.0
            predictions[image_name] = (row.get("predicted_label", ""), confidence)
    return predictions


def remove_previous_unsplash_samples(dataset_dir: Path) -> None:
    for label in LABELS:
        label_dir = dataset_dir / label
        if not label_dir.exists():
            continue
        for path in label_dir.glob("unsplash_*.jpg"):
            path.unlink()


def copy_selection(selections: dict[str, list[dict]], dataset_dir: Path, manifest_path: Path) -> None:
    dataset_dir.mkdir(parents=True, exist_ok=True)
    with manifest_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["label", "source_image", "target_image", "score", "face_count", "skin_ratio", "keywords"])

        for label, records in selections.items():
            label_dir = dataset_dir / label
            label_dir.mkdir(parents=True, exist_ok=True)
            for index, record in enumerate(records, start=1):
                source = record["path"]
                target = label_dir / f"unsplash_{label}_{index:04d}.jpg"
                shutil.copy2(source, target)
                writer.writerow(
                    [
                        label,
                        str(source),
                        str(target),
                        f"{record['scores'][label]:.4f}",
                        record["face_count"],
                        f"{record['skin_ratio']:.4f}",
                        " ".join(sorted(record["keywords"])),
                    ]
                )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw-dir", type=Path, default=DEFAULT_RAW_DIR)
    parser.add_argument("--photos-file", type=Path, default=DEFAULT_PHOTOS_FILE)
    parser.add_argument("--keywords-file", type=Path, default=DEFAULT_KEYWORDS_FILE)
    parser.add_argument("--dataset-dir", type=Path, default=DATASET_DIR)
    parser.add_argument("--target-per-label", type=int, default=200)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_SELECTION_MANIFEST)
    args = parser.parse_args()

    if not args.raw_dir.exists():
        raise FileNotFoundError(f"Raw image folder not found: {args.raw_dir}")

    image_paths = sorted(path for path in args.raw_dir.glob("*.jpg") if path.is_file())
    if not image_paths:
        raise RuntimeError(f"No JPG images found in: {args.raw_dir}")

    photo_ids = {path.stem for path in image_paths}
    print(f"Raw images: {len(image_paths)}")
    print("Loading Unsplash metadata...")
    text_by_id = load_photo_text(args.photos_file, photo_ids)
    keywords_by_id = load_keywords(args.keywords_file, photo_ids)
    predictions = load_classification_manifest(UNSPLASH_DIR / "classified_by_model" / "manifest.csv")

    cascade_path = Path(cv2.data.haarcascades) / "haarcascade_frontalface_default.xml"
    detector = cv2.CascadeClassifier(str(cascade_path))
    if detector.empty():
        raise RuntimeError(f"Could not load OpenCV face detector: {cascade_path}")

    records: list[dict] = []
    for index, image_path in enumerate(image_paths, start=1):
        try:
            bgr_image = read_bgr_image(image_path)
            features = feature_map(extract_features(str(image_path)))
            predicted_label, confidence = predictions.get(image_path.name, ("", 0.0))
            record = {
                "path": image_path,
                "photo_id": image_path.stem,
                "features": features,
                "keywords": keywords_by_id.get(image_path.stem, set()),
                "text": text_by_id.get(image_path.stem, ""),
                "skin_ratio": skin_ratio(bgr_image),
                "face_count": face_count(bgr_image, detector),
                "predicted_label": predicted_label,
                "confidence": confidence,
            }
            record["scores"] = score_record(record)
            records.append(record)
        except Exception as exc:
            print(f"Skipped {image_path.name}: {exc}")

        if index % 250 == 0 or index == len(image_paths):
            print(f"Scored: {index}/{len(image_paths)}", flush=True)

    selections: dict[str, list[dict]] = {}
    used: set[str] = set()
    selection_order = ["smooth_skin", "sharp_gold", "black_white", "warm_gold", "vintage"]
    for label in selection_order:
        ranked = sorted(records, key=lambda record: record["scores"][label], reverse=True)
        selected: list[dict] = []
        for record in ranked:
            if record["photo_id"] in used:
                continue
            selected.append(record)
            used.add(record["photo_id"])
            if len(selected) >= args.target_per_label:
                break
        selections[label] = selected
        print(f"Selected {label}: {len(selected)}")

    print("Removing old unsplash_* samples from dataset folders...")
    remove_previous_unsplash_samples(args.dataset_dir)
    copy_selection(selections, args.dataset_dir, args.manifest)
    print(f"Selection manifest: {args.manifest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
