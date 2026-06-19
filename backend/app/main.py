from flask import Flask, jsonify

try:
    from app.api.v1.ai_routes import ai_bp
except ModuleNotFoundError:
    from .api.v1.ai_routes import ai_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

    app.register_blueprint(ai_bp)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    @app.get("/api/v1/health")
    def health_check():
        return jsonify({"success": True, "message": "Backend is running"})

    return app
