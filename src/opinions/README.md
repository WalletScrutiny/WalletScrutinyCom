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
| `nostr.mjs` | Relay reads (`opinionRelayUrls`) and event drafts; publishing goes through `src/nostr-client.mjs`. |
| `content.mjs` | Pure helpers: content wrapper, one-opinion-per-author, NIP-09 deletions, threads, tallies. Unit-tested. |
| `config.mjs` | Parses the data attributes of `_includes/review/nostrOpinion.html`. |
| `auth.mjs` | NIP-07 sign-in state. |
| `modal.mjs`, `icons.mjs`, `constants.mjs`, `opinions.css` | Dialog, inline SVGs, constants, styles. |

Configuration lives in `_data/nostrOpinions.yml` (approved authors, shared
with `scripts/compileAllOpinions.mjs`) and `_data/nostrOpinionBlocklist.yml`
(hidden spam). Relays: reads span the site relays plus the public relays the
old plugin used; writes go to the webapp's relay set, and an opinion must be
accepted by the project relay (`external/configs/strfry/kind-policy.py`
stores kind 30023 with a `WalletScrutiny`/`nostrOpinion` t tag, but no
replies or reactions).

Tests: `test/unit/opinions-*.test.mjs`, `test/e2e/opinions.spec.mjs`.
