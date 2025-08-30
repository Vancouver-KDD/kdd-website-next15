#!/usr/bin/env python3
"""
Convert events.csv to events.json with the expected field structure and sorting.

Input CSV header is expected to be:
id,date,duration,title,location,locationDetails,locationLink,image,description,joinLink,price,quantity

Output JSON is an array of objects sorted by date descending, matching
the shape consumed by the app.
"""

from __future__ import annotations

import argparse
import csv
import json
from collections import OrderedDict
from datetime import datetime
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path
from typing import Any, Dict, List, Optional


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert events CSV to JSON")
    parser.add_argument(
        "--input",
        default="app/events/events.csv",
        help="Path to the input CSV file (default: app/events/events.csv)",
    )
    parser.add_argument(
        "--output",
        default="app/events/events.json",
        help="Path to the output JSON file (default: app/events/events.json)",
    )
    parser.add_argument(
        "--no-sort",
        action="store_true",
        help="Do not sort by date (keeps CSV order)",
    )
    return parser.parse_args()


def normalize_newlines(text: str) -> str:
    if not text:
        return text
    return text.replace("\r\n", "\n").replace("\r", "\n")


def parse_date(date_str: str) -> Optional[datetime]:
    date_str = date_str.strip()
    if not date_str:
        return None
    for fmt in ("%Y-%m-%d %H:%M", "%Y-%m-%d"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None


def format_price(value: str) -> Optional[str]:
    value = value.strip()
    if not value:
        return None
    try:
        # Normalize to 2 decimal places as string
        quantized = Decimal(value).quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
        return f"{quantized:.2f}"
    except (InvalidOperation, ValueError):
        # If it's already a string like "Free" or non-numeric, keep as-is
        return value


def to_int(value: str) -> Optional[int]:
    value = value.strip()
    if not value:
        return None
    try:
        return int(value)
    except ValueError:
        return None


FIELD_ORDER = (
    "id",
    "date",
    "title",
    "location",
    "image",
    "description",
    "locationDetails",
    "locationLink",
    "joinLink",
    "duration",
    "price",
    "quantity",
)


def build_event(row: Dict[str, str]) -> OrderedDict[str, Any]:
    # Pull and trim base fields
    id_ = (row.get("id") or "").strip()
    date = (row.get("date") or "").strip()
    title = (row.get("title") or "").strip()
    location = (row.get("location") or "").strip()
    image = (row.get("image") or "").strip()
    description = normalize_newlines((row.get("description") or "").rstrip())
    location_details = (row.get("locationDetails") or "").strip()
    location_link = (row.get("locationLink") or "").strip()
    join_link = (row.get("joinLink") or "").strip()
    duration = to_int(row.get("duration") or "")
    price = format_price(row.get("price") or "")
    quantity = to_int(row.get("quantity") or "")

    event: "OrderedDict[str, Any]" = OrderedDict()
    event["id"] = id_
    event["date"] = date
    event["title"] = title
    event["location"] = location
    event["image"] = image
    event["description"] = description

    # Optional fields: include only if provided
    if location_details:
        event["locationDetails"] = location_details
    if location_link:
        event["locationLink"] = location_link
    if join_link:
        event["joinLink"] = join_link
    if duration is not None:
        event["duration"] = duration
    if price is not None:
        event["price"] = price
    if quantity is not None:
        event["quantity"] = quantity

    # Reorder to fixed FIELD_ORDER while keeping only present keys
    ordered: "OrderedDict[str, Any]" = OrderedDict()
    for key in FIELD_ORDER:
        if key in event:
            ordered[key] = event[key]
    return ordered


def main() -> None:
    args = parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        raise FileNotFoundError(f"Input CSV not found: {input_path}")

    with input_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    events: List[OrderedDict[str, Any]] = [build_event(row) for row in rows]

    if not args.no_sort:
        # Sort by date descending; non-parsable dates go last
        def sort_key(ev: Dict[str, Any]):
            dt = parse_date(ev.get("date", ""))
            # Use epoch for None so they go last when reversed
            return dt or datetime.fromtimestamp(0)

        events.sort(key=sort_key, reverse=True)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(events, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(events)} events to {output_path}")


if __name__ == "__main__":
    main()


