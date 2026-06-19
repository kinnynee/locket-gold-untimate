import os
import sys
import tempfile
from pathlib import Path

from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename


PROJECT_ROOT = Path(__file__).resolve().parents[4]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.ml.config import MODEL_PATH, SUPPORTED_IMAGE_EXTENSIONS
from backend.ml.predict_filter import predict_filter


ai_bp = Blueprint("ai", __name__, url_prefix="/api/v1/ai")


def _error_response(message: str, status_code: int):
    return (
        jsonify(
            {
                "success": False,
                "recommended_filter": None,
                "confidence": 0.0,
                "message": message,
            }
        ),
        status_code,
    )


@ai_bp.route("/recommend-filter", methods=["POST", "OPTIONS"])
def recommend_filter():
    if request.method == "OPTIONS":
        return jsonify({"success": True, "message": "OK"})

    if not Path(MODEL_PATH).exists():
        return _error_response(f"Model file not found: {MODEL_PATH}", 500)

    uploaded_file = request.files.get("image") or request.files.get("file")
    if uploaded_file is None or uploaded_file.filename == "":
        return _error_response("Please upload an image using form field 'image'.", 400)

    original_name = secure_filename(uploaded_file.filename)
    suffix = Path(original_name).suffix.lower()
    if suffix not in SUPPORTED_IMAGE_EXTENSIONS:
        allowed = ", ".join(sorted(SUPPORTED_IMAGE_EXTENSIONS))
        return _error_response(f"Unsupported image type. Allowed extensions: {allowed}.", 400)

    upload_dir = PROJECT_ROOT / "backend" / "storage" / "uploads" / "ai_recommend"
    upload_dir.mkdir(parents=True, exist_ok=True)

    fd, temp_path = tempfile.mkstemp(prefix="ai_filter_", suffix=suffix, dir=upload_dir)
    os.close(fd)

    try:
        uploaded_file.save(temp_path)
        result = predict_filter(temp_path)
        status_code = 200 if result.get("success") else 500
        return jsonify(
            {
                "success": bool(result.get("success")),
                "recommended_filter": result.get("recommended_filter"),
                "confidence": float(result.get("confidence", 0.0)),
                "message": result.get("message", ""),
            }
        ), status_code
    finally:
        Path(temp_path).unlink(missing_ok=True)
