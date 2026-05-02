#!/usr/bin/env python3
import json
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

from pru_lights import PruLights

OUTPUT_PATH = sys.argv[1] if len(sys.argv) > 1 else "data.json"
TZ = ZoneInfo("America/New_York")


def main():
    pl = PruLights()
    event = pl.get_event()
    generated_at = datetime.now(TZ).isoformat()

    payload = {
        "generated_at": generated_at,
        "has_event": event is not None,
        "event": event.to_dict() if event is not None else None,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    if event:
        print(f"[generate_data] {generated_at} — event found: {event.purpose}")
        print(f"  start: {event.start.isoformat()}")
        print(f"  end:   {event.end.isoformat()}")
    else:
        print(f"[generate_data] {generated_at} — no event today")


if __name__ == "__main__":
    main()
