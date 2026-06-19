"""Shared configuration for the filter recommendation model."""

from pathlib import Path


ML_DIR = Path(__file__).resolve().parent
DATASET_DIR = ML_DIR / "dataset"
MODELS_DIR = ML_DIR / "models"
MODEL_PATH = MODELS_DIR / "filter_model.pkl"

LABELS = (
    "warm_gold",
    "vintage",
    "black_white",
    "smooth_skin",
    "sharp_gold",
)

SUPPORTED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

# Keep this order stable. The trained model depends on it.
FEATURE_NAMES = (
    "brightness_mean",
    "brightness_std",
    "saturation_mean",
    "saturation_std",
    "sharpness_laplacian_var",
    "red_mean",
    "green_mean",
    "blue_mean",
    "warm_ratio",
    "cool_ratio",
    "grayscale_mean",
    "edge_density",
    "dominant_red",
    "dominant_green",
    "dominant_blue",
    "colorfulness",
)

