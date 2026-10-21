# Community opinions

The "Community Opinions" section at the bottom of every review page: Nostr
long-form events (kind 30023) about a product, with likes, replies and an
editor for visitors who have a NIP-07 browser extension. It replaced the
separately built `nostr-opinion-plugin` web component in October 2026; the
events it reads and writes have the same shape, so older opinions and the
Android app keep working.

| File | Role |
| --- | --- |
| `index.mjs` | Entry of the `opinions_ui` webpack bundle: injects `opinions.css`, mounts a widget on every `[data-opinions]` element. |
| `widget.mjs` | `OpinionsWidget`: loads the events, holds the state (filter, threads, reactions, signed-in user) and renders the section. |
| `card.mjs` | One opinion or reply card (author, sentiment, markdown content, like/dislike, reply, delete/edit). |
| `editor.mjs` | Opinion editor (ToastUI markdown editor, loaded on demand, textarea fallback) and the reply textarea. |
| `nostr.mjs` | Relay reads (`opinionRelayUrls`, Zapstore comments from `zapstoreRelayUrls`) and event drafts; publishing goes through `src/nostr-client.mjs`. |
| `content.mjs` | Pure helpers: content wrapper, one-opinion-per-author, NIP-09 deletions, threads, tallies. Unit-tested. |
| `config.mjs` | Parses the data attributes of `_includes/review/nostrOpinion.html`. |
| `auth.mjs` | NIP-07 identity, read once from the extension when the page loads. |
| `moderation.mjs` | Approve / hide decisions: kind 1984 events from a site admin, newest per opinion id. |
| `moderation-page.mjs`, `moderation-page-boot.mjs` | `/opinions/`: the moderation queue grouped by author, with Approve author / Hide all per author. The list renders only for `siteAdminPubkeys`. |
| `modal.mjs`, `icons.mjs`, `constants.mjs`, `opinions.css` | Dialog, inline SVGs, constants, styles. |

Configuration lives in `_data/nostrOpinions.yml` (approved authors, shared
with `scripts/compileAllOpinions.mjs`) and `_data/nostrOpinionBlocklist.yml`
(hidden spam). Relays: reads span the site relays plus the public relays the
old plugin used; writes go to the webapp's relay set, and an opinion must be
accepted by the project relay (`external/configs/strfry/kind-policy.py`
stores kind 30023 with a `WalletScrutiny`/`nostrOpinion` t tag, but no
replies or reactions).

On Android pages the widget also loads the comments posted on Zapstore for
the app (NIP-22 kind 1111 naming the kind-32267 app event, read from the
Zapstore relay only). They are shown read-only with a Zapstore badge: on their
own when nobody posted an opinion here, otherwise behind a second tab with the
counts of both lists. The tab opens on Zapstore when no approved opinion exists.

Both lists only show authors who have a Nostr profile with a picture or a
name (`hasProfileIdentity` in `src/nostr-profile.mjs`). Opinions, replies and
Zapstore comments from accounts without one are dropped before the first
render and are not counted anywhere; there is no switch to reveal them. An
opinion a site admin has approved is the exception: it is shown even without
a profile. The profiles are fetched in one batch (`getNostrProfiles`) once
the events are in.

The WalletScrutiny list opens on "Approved" (approved authors and opinions a
site admin approved). The "Approved" / "All opinions" filters only appear when
at least one opinion is not approved; "All opinions" then carries "+N", the
number of opinions it adds.

All moderation happens on `/opinions/`; the opinion cards on the wallet
pages have no approve or hide buttons. When the page loads with a Nostr
extension whose account is in `siteAdminPubkeys`, it lists the third-party
opinions that are still undecided, grouped by author: one card per author
(most opinions first) with their opinions indented below it, each linking to
its wallet. It skips opinions written by `siteAdminPubkeys` and any opinion
already approved or hidden.

Approve author publishes one author approval: a kind 1984 event with `k`
`30023`, `r` `opinion-author-approve` and the author in a `p` tag, signed by a
pubkey in `siteAdminPubkeys`. The wallet pages and the queue add that author
to the trusted authors from `_data/nostrOpinions.yml`, so everything they have
published or publish later shows under "Approved" and stays off the queue.
The build-time counts in `scripts/compileAllOpinions.mjs` read only the YAML
list.

Hide all publishes one hide per opinion (`r` `opinion-hide`, with the opinion
address in an `a` tag), so the extension asks for one signature per opinion;
it stops at the first failed publish and keeps the ones done so far. A hide
removes every version of that author's opinion on that wallet from the wallet
page, including later edits, and wins over an author approval.

Approvals of single opinions (`r` `opinion-approve`) published by the earlier
version of the page still count: the wallet page keeps showing that version
under "Approved". The newest decision per opinion wins. The static lists in
`_data/nostrOpinions.yml` and `_data/nostrOpinionBlocklist.yml` still apply.

Tests: `test/unit/opinions-*.test.mjs`, `test/e2e/opinions.spec.mjs`.
