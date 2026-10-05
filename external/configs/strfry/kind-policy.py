#!/usr/bin/env python3
"""strfry write policy for the WalletScrutiny relay.

Only the kinds below are stored, and each one must be recognisable as
WalletScrutiny traffic:

* kinds our clients publish through the site / Android app / build server
  must carry ["client", "WalletScrutiny.com"] or ["c", "walletscrutiny"]
  (getWSClientTags() in src/verifications_utils.mjs adds both);
* deletion requests (kind 5, NIP-09) carry neither tag, so they are
  accepted only when they point at one of our kinds (["k", kind] or an
  ["a", "kind:pubkey:d"] tag) AND their author already has one of our
  events in this database (asked with `strfry scan --count`, see
  author_has_stored_events()): a pubkey may only delete its own events,
  so a deletion from a pubkey we store nothing for cannot delete anything
  here, and other apps' deletions of their own kind-30301 records would
  otherwise pass the kind check;
* opinions (kind 30023) are published by the nostr-opinion plugin without
  a client tag; they are identified by the ["t", ...] tags the plugin sets.

Events arriving through `strfry import` (sourceType "Import") are accepted
as they are: that is the operator restoring a backup from the host, see
cleanup-rejected.py.

Everything else is rejected.  Rejected events never reach the database,
so this is also the only thing that keeps the public relay from filling
up with other apps' kind-30301 / 1337 / 30023 / 5 traffic.

The relay answers every rejection with the same short, generic message
on purpose: the OK reply must not tell a spammer which tag or kind
would get an event stored.  The actual rules live only in this file.
"""

import sys
import json
import os
import subprocess

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


# The relay's own database, asked by author_has_stored_events().  Readers may
# open the LMDB while the relay runs (strfry export/scan are documented for
# that), and the plugin runs as the strfry user, so no extra permissions.
STRFRY_BIN = os.environ.get("STRFRY_BIN", "/usr/local/bin/strfry")
STRFRY_CONFIG = os.environ.get("STRFRY_CONFIG", "/etc/strfry/strfry.conf")
# strfry feeds the plugin one event at a time and waits for the answer, so a
# hanging scan would stall every write; the indexed authors+kinds lookup with
# limit 1 takes milliseconds.
SCAN_TIMEOUT_SECONDS = 5


def author_has_stored_events(pubkey):
    """True when the relay already stores a non-deletion event of this pubkey.

    Runs `strfry scan --count` with an authors+kinds filter limited to one
    result.  Any failure (binary missing, timeout, bad output) counts as
    "no", so a broken setup rejects deletions instead of letting the kind-5
    spam back in; the reason is logged to stderr, which strfry forwards to
    its own log.
    """
    if not (isinstance(pubkey, str) and len(pubkey) == 64 and all(c in "0123456789abcdef" for c in pubkey)):
        return False
    query = {"authors": [pubkey], "kinds": sorted(ALLOWED_KINDS - {DELETION_KIND}), "limit": 1}
    try:
        res = subprocess.run([STRFRY_BIN, "--config", STRFRY_CONFIG, "scan", "--count", json.dumps(query)],
                             capture_output=True, text=True, timeout=SCAN_TIMEOUT_SECONDS)
    except (OSError, subprocess.TimeoutExpired) as e:
        print(f"kind-policy: strfry scan failed: {e}", file=sys.stderr)
        return False
    if res.returncode != 0:
        print(f"kind-policy: strfry scan exited {res.returncode}: {res.stderr.strip()[-200:]}", file=sys.stderr)
        return False
    last = res.stdout.strip().rsplit("\n", 1)[-1]   # the count is the last line
    if not last.isdigit():
        print(f"kind-policy: unexpected strfry scan output: {res.stdout.strip()[-200:]!r}", file=sys.stderr)
        return False
    return int(last) > 0


# One message for every rejection; see the module docstring for why it
# says nothing about the kind or the missing tag.
REJECT_MSG = "blocked: not accepted by this relay"


def is_allowed(event, has_stored_events=author_has_stored_events):
    """True when the event may be stored.

    Rules (deliberately not echoed to the client):
    * kind must be in ALLOWED_KINDS;
    * WS_TAGGED_KINDS need ["client", "WalletScrutiny.com"] or ["c", "walletscrutiny"];
    * kind 5 needs a ["k", kind] or ["a", "kind:pubkey:d"] tag naming an allowed kind,
      and has_stored_events(pubkey) must be true for its author (the live
      database lookup by default; cleanup-rejected.py passes its own check
      built from the dump it is reading);
    * kind 30023 needs a ["t", ...] tag from OPINION_T_TAGS.
    """
    kind = event.get("kind")
    if kind not in ALLOWED_KINDS:
        return False

    pairs = tag_pairs(event)

    if kind in WS_TAGGED_KINDS:
        return bool(pairs & WS_CLIENT_TAGS)

    if kind == DELETION_KIND:
        return deletion_targets_allowed_kind(pairs) and has_stored_events(event.get("pubkey"))

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

    # strfry runs this plugin on `strfry import` as well, as sourceType "Import". An
    # import only happens from a shell on the host (restoring cleanup-rejected.py's
    # drop.events.jsonl backup, or any other dump the operator chose), so it is not
    # subject to the rules below; without this, nothing the cleanup deleted could ever
    # be put back.
    if data.get("sourceType") == "Import" or is_allowed(event):
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
