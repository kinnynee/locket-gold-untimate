"""Predict the most suitable image filter using the exported model."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import joblib
import numpy as np

try:
    from .config import FEATURE_NAMES, MODEL_PATH
    from .feature_extractor import extract_features
except ImportError:  # Allows: python backend/ml/predict_filter.py image.jpg
    from config import FEATURE_NAMES, MODEL_PATH
    from feature_extractor import extract_features


def build_recommendation_message(label: str, features: list[float]) -> str:
    """Build a short explanation based on label and extracted image features."""
    feature_map = dict(zip(FEATURE_NAMES, features))
    brightness = feature_map["brightness_mean"]
    saturation = feature_map["saturation_mean"]
    sharpness = feature_map["sharpness_laplacian_var"]
    warm_ratio = feature_map["warm_ratio"]
    cool_ratio = feature_map["cool_ratio"]

    if label == "warm_gold":
        return "Warm Gold is recommended because the image can benefit from a brighter and warmer tone."
    if label == "vintage":
        return "Vintage is recommended because the image has a color tone suitable for a softer film-like look."
    if label == "black_white":
        return "Black & White is recommended because the image can work well with reduced color emphasis."
    if label == "smooth_skin":
        return "Smooth Skin is recommended because the image may benefit from a softer and cleaner appearance."
    if label == "sharp_gold":
        return "Sharp Gold is recommended because the image can benefit from stronger detail and warm highlights."

    return (
        f"{label} is recommended based on brightness={brightness:.1f}, "
        f"saturation={saturation:.1f}, sharpness={sharpness:.1f}, "
        f"warm_ratio={warm_ratio:.2f}, cool_ratio={cool_ratio:.2f}."
    )


def predict_filter(image_path: str) -> dict:
    """Return recommended_filter, confidence, and a user-friendly message."""
    model_path = Path(MODEL_PATH)
    if not model_path.exists():
        return {
            "success": False,
            "recommended_filter": None,
            "confidence": 0.0,
            "message": f"Model file not found: {model_path}. Train the model first.",
        }

    try:
        bundle = joblib.load(model_path)
        model = bundle["model"] if isinstance(bundle, dict) and "model" in bundle else bundle
        features = extract_features(image_path)
        x = np.array([features], dtype=np.float32)

        predicted_label = str(model.predict(x)[0])
        confidence = 0.0
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(x)[0]
            confidence = float(np.max(probabilities))

        return {
            "success": True,
            "recommended_filter": predicted_label,
            "confidence": round(confidence, 2),
            "message": build_recommendation_message(predicted_label, features),
        }
    except Exception as exc:
        return {
            "success": False,
            "recommended_filter": None,
            "confidence": 0.0,
            "message": f"Prediction failed: {exc}",
        }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python backend/ml/predict_filter.py path/to/image.jpg")
        raise SystemExit(1)

    result = predict_filter(sys.argv[1])
    print(json.dumps(result, indent=2, ensure_ascii=False))

