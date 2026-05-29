#!/usr/bin/env python3

import sys
import json

ALLOWED_KINDS = {
    5,              # event deletion (NIP-09); required for clients to delete events we store
    1267, 1063,     # asset registration (NIP-94)
    9605, 9401,     # asset bundle registration (WalletScrutiny)
    32304, 30301,   # verification
    30901, 30801,   # verification draft
    30902, 30802,   # verification comment
    1337,           # code snippet
    31971, 31871,   # endorsement
    30023           # opinion
}

def process_event(line):
    try:
        data = json.loads(line)
    except json.JSONDecodeError:
        return None

    if data.get("type") != "new":
        return None

    event = data.get("event", {})
    event_id = event.get("id", "")
    kind = event.get("kind")

    if kind in ALLOWED_KINDS:
        return {
            "id": event_id,
            "action": "accept",
            "msg": ""
        }
    else:
        return {
            "id": event_id,
            "action": "reject",
            "msg": f"kind {kind} not permitted in this relay"
        }

def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        result = process_event(line)
        if result:
            print(json.dumps(result), flush=True)

if __name__ == "__main__":
    main()
