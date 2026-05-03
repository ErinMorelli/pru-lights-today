#!/usr/bin/env python3
import json
import re
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

from pru_lights import PruLights

OUTPUT_PATH = sys.argv[1] if len(sys.argv) > 1 else "data.json"
TZ = ZoneInfo("America/New_York")

# Matches "for" or any "in <word(s)> of" phrase:
# "in support of", "in Recognition of", "in honor of", etc.
_SEPARATOR = re.compile(r'\s+(?:for|in\s+(?:\w+\s+)*of)\s+', re.IGNORECASE)

# Splits on ",", "&", or the word "and" — handles both Oxford-comma
# ("Red, White & Blue") and non-Oxford-comma ("Red, Black and Green") formats.
_COLOR_SPLIT = re.compile(r'\s*(?:,|&|\band\b)\s*', re.IGNORECASE)


def parse_colors(purpose: str) -> list[str]:
    parts = _SEPARATOR.split(purpose, maxsplit=1)
    color_str = parts[0] if parts else ''
    colors = [c.strip().lower() for c in _COLOR_SPLIT.split(color_str) if c.strip()]
    if not colors:
        print(f'[generate_data] WARNING: no colors parsed from: {purpose!r}', file=sys.stderr)
    return colors


def main():
    pl = PruLights()
    event = pl.get_event()
    generated_at = datetime.now(TZ).isoformat()

    payload = {
        "generated_at": generated_at,
        "has_event": event is not None,
        "event": event.to_dict() if event is not None else None,
        "colors": parse_colors(event.purpose) if event else [],
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    if event:
        print(f"[generate_data] {generated_at} — event found: {event.purpose}")
        print(f"  colors: {payload['colors']}")
        print(f"  start: {event.start.isoformat()}")
        print(f"  end:   {event.end.isoformat()}")
    else:
        print(f"[generate_data] {generated_at} — no event today")


if __name__ == "__main__":
    main()
