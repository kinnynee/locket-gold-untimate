"""Download a small open starter dataset from Wikimedia Commons.

This script is meant for early experiments only. The labels are search-query
based, so review and clean the downloaded images before using them for a final
model/report.
"""

from __future__ import annotations

import csv
import html
import json
import re
import time
import argparse
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

try:
    from .config import DATASET_DIR, LABELS, SUPPORTED_IMAGE_EXTENSIONS
except ImportError:  # Allows: python backend/ml/download_starter_dataset.py
    from config import DATASET_DIR, LABELS, SUPPORTED_IMAGE_EXTENSIONS


API_URL = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "LocketGoldUltimateDatasetBuilder/1.0 (student project)"
SOURCES_CSV = DATASET_DIR / "SOURCES.csv"

SEARCH_QUERIES = {
    "warm_gold": [
        "golden hour portrait",
        "warm sunlight landscape",
        "sunset portrait photograph",
        "warm light photography",
    ],
    "vintage": [
        "vintage color photograph",
        "old film photograph",
        "sepia photograph",
        "retro street photograph",
    ],
    "black_white": [
        "black and white portrait photograph",
        "black and white landscape photograph",
        "monochrome street photograph",
        "black and white architecture photograph",
    ],
    "smooth_skin": [
        "portrait face photograph",
        "beauty portrait photograph",
        "studio portrait face",
        "human face close up photograph",
    ],
    "sharp_gold": [
        "gold jewelry macro photograph",
        "golden architecture detail photograph",
        "sharp golden texture photograph",
        "gold ornament close up photograph",
    ],
}


def clean_text(value: str | None) -> str:
    """Remove simple HTML from Wikimedia metadata fields."""
    if not value:
        return ""
    text = re.sub(r"<[^>]+>", " ", value)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def fetch_json(params: dict) -> dict:
    """Call the Wikimedia Commons API and return JSON."""
    url = f"{API_URL}?{urlencode(params)}"
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def search_images(query: str, limit: int = 30) -> list[dict]:
    """Search Commons files and return imageinfo records."""
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrnamespace": 6,
        "gsrsearch": query,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|mime|extmetadata",
        "iiurlwidth": 512,
    }
    data = fetch_json(params)
    pages = data.get("query", {}).get("pages", {})
    results = []
    for page in pages.values():
        imageinfo = page.get("imageinfo", [])
        if not imageinfo:
            continue
        info = imageinfo[0]
        mime = info.get("mime", "")
        if mime not in {"image/jpeg", "image/png"}:
            continue
        results.append(
            {
                "title": page.get("title", ""),
                "url": info.get("thumburl") or info.get("url"),
                "source_url": info.get("descriptionurl") or info.get("url"),
                "mime": mime,
                "metadata": info.get("extmetadata", {}),
            }
        )
    return results


def metadata_value(metadata: dict, key: str) -> str:
    """Read one extmetadata value safely."""
    raw = metadata.get(key, {})
    if isinstance(raw, dict):
        return clean_text(raw.get("value"))
    return clean_text(str(raw))


def download_file(url: str, output_path: Path) -> None:
    """Download one image file."""
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=60) as response:
        output_path.write_bytes(response.read())


def existing_source_rows() -> list[dict]:
    """Load existing source metadata so repeated runs do not wipe history."""
    if not SOURCES_CSV.exists():
        return []
    with SOURCES_CSV.open("r", encoding="utf-8", newline="") as file:
        return list(csv.DictReader(file))


def write_sources(rows: list[dict]) -> None:
    """Write attribution/source metadata for downloaded images."""
    fieldnames = [
        "label",
        "filename",
        "title",
        "source_url",
        "license",
        "license_url",
        "artist",
        "credit",
    ]
    with SOURCES_CSV.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def download_label(label: str, target_count: int, known_titles: set[str]) -> list[dict]:
    """Download images for one label folder."""
    label_dir = DATASET_DIR / label
    label_dir.mkdir(parents=True, exist_ok=True)

    existing_images = [
        path
        for path in label_dir.iterdir()
        if path.is_file() and path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
    ]
    remaining = max(target_count - len(existing_images), 0)
    if remaining == 0:
        print(f"{label}: already has {len(existing_images)} image(s)")
        return []

    print(f"{label}: downloading {remaining} image(s)")
    rows: list[dict] = []
    index = len(existing_images) + 1

    for query in SEARCH_QUERIES[label]:
        if remaining <= 0:
            break
        for result in search_images(query, limit=40):
            if remaining <= 0:
                break
            title = result["title"]
            if not result["url"] or title in known_titles:
                continue

            extension = ".jpg" if result["mime"] == "image/jpeg" else ".png"
            filename = f"{label}_{index:03d}{extension}"
            output_path = label_dir / filename

            try:
                download_file(result["url"], output_path)
            except Exception as exc:
                print(f"  skipped {title}: {exc}")
                continue

            metadata = result["metadata"]
            rows.append(
                {
                    "label": label,
                    "filename": str(output_path.relative_to(DATASET_DIR)),
                    "title": title,
                    "source_url": result["source_url"],
                    "license": metadata_value(metadata, "LicenseShortName"),
                    "license_url": metadata_value(metadata, "LicenseUrl"),
                    "artist": metadata_value(metadata, "Artist"),
                    "credit": metadata_value(metadata, "Credit"),
                }
            )
            known_titles.add(title)
            remaining -= 1
            index += 1
            print(f"  saved {filename}")
            time.sleep(0.2)

    if remaining > 0:
        print(f"  warning: only downloaded {target_count - len(existing_images) - remaining}/{target_count - len(existing_images)} new image(s)")
    return rows


def main(target_per_label: int = 10) -> None:
    """Download a starter dataset for all labels."""
    DATASET_DIR.mkdir(parents=True, exist_ok=True)
    rows = existing_source_rows()
    known_titles = {row.get("title", "") for row in rows if row.get("title")}

    for label in LABELS:
        rows.extend(download_label(label, target_per_label, known_titles))
        write_sources(rows)

    print(f"\nSaved source metadata: {SOURCES_CSV}")
    print("Review the images manually before final training.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download a small Wikimedia Commons starter dataset.")
    parser.add_argument("--per-label", type=int, default=10, help="Target image count per label.")
    args = parser.parse_args()
    main(target_per_label=args.per_label)
