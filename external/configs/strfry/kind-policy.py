#!/usr/bin/env python3
"""strfry write policy for the WalletScrutiny relay.

Only the kinds below are stored, and each one must be recognisable as
WalletScrutiny traffic:

* kinds our clients publish through the site / Android app / build server
  must carry ["client", "WalletScrutiny.com"] or ["c", "walletscrutiny"]
  (getWSClientTags() in src/verifications_utils.mjs adds both);
* deletion requests (kind 5, NIP-09) carry neither tag, so they are
  accepted only when they point at one of our kinds (["k", kind] or an
  ["a", "kind:pubkey:d"] tag);
* opinions (kind 30023) are published by the nostr-opinion plugin without
  a client tag; they are identified by the ["t", ...] tags the plugin sets.

Everything else is rejected.  Rejected events never reach the database,
so this is also the only thing that keeps the public relay from filling
up with other apps' kind-30301 / 1337 / 30023 / 5 traffic.
"""

import sys
import json

WS_TAGGED_KINDS = {
    1267, 1063,     # asset registration (NIP-94)
    9605, 9401,     # asset bundle registration (WalletScrutiny)
    32304, 30301,   # verification
    30901, 30801,   # verification draft
    30902, 30802,   # verification comment
    1337,           # code snippet
    31971, 31871,   # endorsement
    11984, 1984,    # verification report (NIP-56); admin reports hide spam verifications on the site
}

DELETION_KIND = 5       # event deletion (NIP-09); required for clients to delete events we store
OPINION_KIND = 30023    # opinion (NIP-23 long-form), published by the nostr-opinion plugin

ALLOWED_KINDS = WS_TAGGED_KINDS | {DELETION_KIND, OPINION_KIND}

# ["client", "WalletScrutiny.com", ...] or ["c", "walletscrutiny"]
WS_CLIENT_TAGS = {("client", "WalletScrutiny.com"), ("c", "walletscrutiny")}

# ["t", ...] values the opinion widget publishes with (opinionTags in
# _includes/review/nostrOpinion.html); either one marks a WalletScrutiny opinion.
OPINION_T_TAGS = {"nostrOpinion", "WalletScrutiny"}


def tag_pairs(event):
    """(name, value) for every well-formed tag of the event."""
    pairs = set()
    for tag in event.get("tags", []):
        if isinstance(tag, list) and len(tag) >= 2 and isinstance(tag[0], str) and isinstance(tag[1], str):
            pairs.add((tag[0], tag[1]))
    return pairs


def deletion_targets_allowed_kind(pairs):
    """NIP-09: ["k", "<kind>"] names the kind of each deleted event; addressable
    events are also named by ["a", "<kind>:<pubkey>:<d>"]."""
    for name, value in pairs:
        kind = None
        if name == "k":
            kind = value
        elif name == "a":
            kind = value.split(":", 1)[0]
        if kind is not None and kind.isdigit() and int(kind) in ALLOWED_KINDS:
            return True
    return False


def rejection_reason(event):
    """None when the event may be stored, otherwise the message sent to the client."""
    kind = event.get("kind")
    if kind not in ALLOWED_KINDS:
        return f"kind {kind} not permitted in this relay"

    pairs = tag_pairs(event)

    if kind in WS_TAGGED_KINDS:
        if pairs & WS_CLIENT_TAGS:
            return None
        return f"kind {kind} on this relay is reserved for WalletScrutiny.com events (missing client tag)"

    if kind == DELETION_KIND:
        if deletion_targets_allowed_kind(pairs):
            return None
        return "deletion requests must reference a kind permitted in this relay"

    if kind == OPINION_KIND:
        if any(name == "t" and value in OPINION_T_TAGS for name, value in pairs):
            return None
        return f"kind {kind} on this relay is reserved for WalletScrutiny.com opinions (missing t tag)"


def process_event(line):
    try:
        data = json.loads(line)
    except json.JSONDecodeError:
        return None

    if data.get("type") != "new":
        return None

    event = data.get("event")
    if not isinstance(event, dict):
        event = {}
    event_id = event.get("id", "")

    reason = rejection_reason(event)
    if reason is None:
        return {
            "id": event_id,
            "action": "accept",
            "msg": ""
        }
    return {
        "id": event_id,
        "action": "reject",
        "msg": reason
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
