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

The relay answers every rejection with the same short, generic message
on purpose: the OK reply must not tell a spammer which tag or kind
would get an event stored.  The actual rules live only in this file.
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


# One message for every rejection; see the module docstring for why it
# says nothing about the kind or the missing tag.
REJECT_MSG = "blocked: not accepted by this relay"


def is_allowed(event):
    """True when the event may be stored.

    Rules (deliberately not echoed to the client):
    * kind must be in ALLOWED_KINDS;
    * WS_TAGGED_KINDS need ["client", "WalletScrutiny.com"] or ["c", "walletscrutiny"];
    * kind 5 needs a ["k", kind] or ["a", "kind:pubkey:d"] tag naming an allowed kind;
    * kind 30023 needs a ["t", ...] tag from OPINION_T_TAGS.
    """
    kind = event.get("kind")
    if kind not in ALLOWED_KINDS:
        return False

    pairs = tag_pairs(event)

    if kind in WS_TAGGED_KINDS:
        return bool(pairs & WS_CLIENT_TAGS)

    if kind == DELETION_KIND:
        return deletion_targets_allowed_kind(pairs)

    if kind == OPINION_KIND:
        return any(name == "t" and value in OPINION_T_TAGS for name, value in pairs)

    return False


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

    if is_allowed(event):
        return {
            "id": event_id,
            "action": "accept",
            "msg": ""
        }
    return {
        "id": event_id,
        "action": "reject",
        "msg": REJECT_MSG
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
