"""Feature extraction for classic ML image filter recommendation."""

from pathlib import Path

import cv2
import numpy as np

try:
    from .config import FEATURE_NAMES
except ImportError:  # Allows: python backend/ml/feature_extractor.py
    from config import FEATURE_NAMES


def _dominant_color_simple(rgb_image: np.ndarray) -> tuple[float, float, float]:
    """Estimate dominant RGB color by quantizing pixels into coarse bins."""
    small = cv2.resize(rgb_image, (64, 64), interpolation=cv2.INTER_AREA)
    quantized = (small // 32) * 32
    pixels = quantized.reshape(-1, 3)
    colors, counts = np.unique(pixels, axis=0, return_counts=True)
    dominant = colors[int(np.argmax(counts))]
    return float(dominant[0]), float(dominant[1]), float(dominant[2])


def _colorfulness(rgb_image: np.ndarray) -> float:
    """Compute a simple colorfulness score from RGB channel differences."""
    red = rgb_image[:, :, 0].astype(np.float32)
    green = rgb_image[:, :, 1].astype(np.float32)
    blue = rgb_image[:, :, 2].astype(np.float32)

    rg = np.abs(red - green)
    yb = np.abs(0.5 * (red + green) - blue)
    return float(np.sqrt(np.std(rg) ** 2 + np.std(yb) ** 2) + 0.3 * np.sqrt(np.mean(rg) ** 2 + np.mean(yb) ** 2))


def extract_features(image_path: str) -> list[float]:
    """Read an image and return numeric features in the order of FEATURE_NAMES."""
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image file not found: {path}")
    if not path.is_file():
        raise ValueError(f"Image path is not a file: {path}")

    image_bytes = np.fromfile(path, dtype=np.uint8)
    bgr_image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
    if bgr_image is None:
        raise ValueError(f"OpenCV could not read this image: {path}")

    bgr_image = cv2.resize(bgr_image, (256, 256), interpolation=cv2.INTER_AREA)
    rgb_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)
    hsv_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2HSV)
    gray_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)

    brightness = hsv_image[:, :, 2]
    saturation = hsv_image[:, :, 1]
    red = rgb_image[:, :, 0].astype(np.float32)
    green = rgb_image[:, :, 1].astype(np.float32)
    blue = rgb_image[:, :, 2].astype(np.float32)

    # Brightness and contrast describe whether an image needs a lighter filter.
    brightness_mean = float(np.mean(brightness))
    brightness_std = float(np.std(gray_image))

    # Saturation helps separate black-white, vintage, and warm color filters.
    saturation_mean = float(np.mean(saturation))
    saturation_std = float(np.std(saturation))

    # Laplacian variance is a classic sharpness/blur estimate.
    sharpness = float(cv2.Laplacian(gray_image, cv2.CV_64F).var())

    # Channel means capture overall color tone.
    red_mean = float(np.mean(red))
    green_mean = float(np.mean(green))
    blue_mean = float(np.mean(blue))

    # Warm/cool ratios are simple explainable color-tone indicators.
    warm_ratio = float(np.mean((red > blue + 10) & (red > 80)))
    cool_ratio = float(np.mean((blue > red + 10) & (blue > 80)))

    grayscale_mean = float(np.mean(gray_image))

    # Canny edge density approximates detail amount in the image.
    edges = cv2.Canny(gray_image, 100, 200)
    edge_density = float(np.mean(edges > 0))

    dominant_red, dominant_green, dominant_blue = _dominant_color_simple(rgb_image)
    colorfulness = _colorfulness(rgb_image)

    features = [
        brightness_mean,
        brightness_std,
        saturation_mean,
        saturation_std,
        sharpness,
        red_mean,
        green_mean,
        blue_mean,
        warm_ratio,
        cool_ratio,
        grayscale_mean,
        edge_density,
        dominant_red,
        dominant_green,
        dominant_blue,
        colorfulness,
    ]

    if len(features) != len(FEATURE_NAMES):
        raise RuntimeError("Feature count does not match FEATURE_NAMES.")

    return features
