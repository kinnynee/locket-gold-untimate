"""Download all photos listed in the Unsplash Lite dataset metadata."""

from __future__ import annotations

import argparse
import csv
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATASET_DIR = PROJECT_ROOT / "datasets-master" / "downloads" / "unsplash-lite-1.4.0"
DEFAULT_PHOTOS_FILE = DEFAULT_DATASET_DIR / "photos.csv000"
DEFAULT_OUTPUT_DIR = DEFAULT_DATASET_DIR / "images_raw"


def iter_photo_rows(photos_file: Path, limit: int | None = None) -> Iterable[dict[str, str]]:
    seen_photo_ids: set[str] = set()
    with photos_file.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file, delimiter="\t")
        yielded = 0
        for row in reader:
            photo_id = row["photo_id"]
            if photo_id in seen_photo_ids:
                continue
            seen_photo_ids.add(photo_id)

            if limit is not None and yielded >= limit:
                break
            yielded += 1
            yield row


def resized_image_url(url: str, width: int, quality: int) -> str:
    separator = "&" if "?" in url else "?"
    params = urlencode(
        {
            "w": width,
            "q": quality,
            "fit": "max",
            "fm": "jpg",
        }
    )
    return f"{url}{separator}{params}"


def download_one(row: dict[str, str], output_dir: Path, width: int, quality: int, retries: int) -> tuple[str, bool, str]:
    photo_id = row["photo_id"]
    url = resized_image_url(row["photo_image_url"], width=width, quality=quality)
    target = output_dir / f"{photo_id}.jpg"

    if target.exists() and target.stat().st_size > 0:
        return photo_id, True, "exists"

    request = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; local-unsplash-lite-downloader/1.0)",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
    )

    last_error = ""
    for attempt in range(1, retries + 1):
        try:
            with urlopen(request, timeout=30) as response:
                data = response.read()
            if not data:
                raise ValueError("empty response")
            if target.exists() and target.stat().st_size > 0:
                return photo_id, True, "exists"
            temp_target = output_dir / f"{photo_id}.{time.time_ns()}.jpg.part"
            temp_target.write_bytes(data)
            temp_target.replace(target)
            return photo_id, True, "downloaded"
        except (HTTPError, URLError, TimeoutError, ValueError) as exc:
            last_error = str(exc)
            time.sleep(min(2 * attempt, 10))

    return photo_id, False, last_error


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--photos-file", type=Path, default=DEFAULT_PHOTOS_FILE)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--width", type=int, default=640)
    parser.add_argument("--quality", type=int, default=80)
    parser.add_argument("--retries", type=int, default=3)
    args = parser.parse_args()

    if not args.photos_file.exists():
        raise FileNotFoundError(f"Photos metadata file not found: {args.photos_file}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    rows = list(iter_photo_rows(args.photos_file, limit=args.limit))
    total = len(rows)
    if total == 0:
        raise RuntimeError("No photo rows found.")

    print(f"Photos file: {args.photos_file}")
    print(f"Output folder: {args.output_dir}")
    print(f"Queued images: {total}")
    print(f"Workers: {args.workers}")

    started_at = time.time()
    downloaded = 0
    skipped = 0
    failed: list[tuple[str, str]] = []

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = [
            executor.submit(download_one, row, args.output_dir, args.width, args.quality, args.retries)
            for row in rows
        ]

        for done, future in enumerate(as_completed(futures), start=1):
            photo_id, ok, message = future.result()
            if ok and message == "downloaded":
                downloaded += 1
            elif ok:
                skipped += 1
            else:
                failed.append((photo_id, message))

            if done % 100 == 0 or done == total:
                elapsed = time.time() - started_at
                rate = done / elapsed if elapsed > 0 else 0
                print(
                    f"Progress: {done}/{total} | downloaded={downloaded} "
                    f"skipped={skipped} failed={len(failed)} | {rate:.2f} img/s",
                    flush=True,
                )

    if failed:
        failures_file = args.output_dir / "failed_downloads.csv"
        with failures_file.open("w", encoding="utf-8", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["photo_id", "error"])
            writer.writerows(failed)
        print(f"Failed downloads written to: {failures_file}")

    print(f"Done. downloaded={downloaded}, skipped={skipped}, failed={len(failed)}")
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
