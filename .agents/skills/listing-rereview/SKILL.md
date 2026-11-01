---
name: listing-rereview
description: Re-review existing WalletScrutiny listings (_mobile, _desktop, _hardware, _bearer, _web, _others) to check that the analysis, verdict and meta still hold, and ship the corrections as MRs. Use for any pass over existing listings, from one file to the whole site. Most rules also apply when writing a new analysis.
---

# Re-reviewing WalletScrutiny listings

These rules come from Leo's review of the 2026-10-30 full re-review (!1862, !1870, !1882,
!1895, !1896). Each one was a correction there. Follow them from the first file, not after
the review notes come in.

The verdict and meta definitions are in `_data/verdicts/*.yml`. !1884 adds the
removed/defunct/discontinued rules below to those files. Once it is merged, treat the yml
files as the authority and keep this skill in line with them.

## Per listing

1. Read the whole file: verdicts, metas, what the analysis claims, and how old it is.
2. Check those claims against today:
   - **Store status.** Play: `https://play.google.com/store/apps/details?id=<appId>&hl=en`
     (404 = gone). App Store: `https://itunes.apple.com/lookup?id=<idd>&country=<appCountry>`
     (`resultCount` 0 = gone), and try `country=us` too. Do not hand-edit the fields the refresh
     scripts own (`users`, `released`, `updated`, `version`, `reviews`, `icon`, `developerName`,
     store-driven `meta`). Adding a missing `appCountry` is fine.
   - **Provider.** Does the site still load and offer the same product? Look for a rebrand,
     acquisition, shutdown, withdrawal freeze, bankruptcy or regulator action.
   - **Custody and source.** Did the custody model change? Was a closed app's source published?
     Does the `repository:` still exist, and does it still match the shipped version?
   - **Links central to the argument.** Do they still work?
   - **The other platform.** For an Android-only listing, search the App Store for the same
     app, and the other way round (see Coverage).
3. Set `date:` to the review date, then make the edits below.
4. Before you change a verdict, grep for similar products and match their verdicts. A change
   on one platform does not imply the other.

## What to write

- **No change means only the `date:` bump.** No paragraph, no "we checked and the verdict
  still holds". Removed spam stubs that are still gone get the date bump and nothing else.
- Only report changes that matter to a user: a new verdict or meta, a shutdown or wind-down,
  a rebrand or acquisition, a successor app, published or removed source, a change in custody,
  an ongoing withdrawal freeze, or a central link that is now dead or misleading. Leave out
  side news (a hack at an exchange that still runs, regulator stories, proof-of-reserve pages,
  one customer's dispute).
- Use `**Update YYYY-MM-DD:**` paragraphs. When the news is the same for both apps, write
  one paragraph above `## Android` (after any warning). Per-platform paragraphs are only for
  real differences.
- Lead with the finding, use short plain sentences, and give each claim a source link.
  Archived pages (web.archive.org) are good evidence. Be ready to say where you found every
  account and link.
- Write the way a wallet user talks. No status codes, DNS, Cloudflare error numbers or "no
  longer resolves". Say "the page is gone" or "the site no longer loads".
- Keep older text as history. Fix it only when it now misleads, for example a dead central
  link or an old product name after a rebrand.
- `wip` is no verdict. Never write "we change the verdict from wip"; just say which verdict
  the app gets.
- Reproducibility does not feed into verdicts. When you find the source, the verdict is
  `sourceavailable`, and the text says "we can look into reproducibility next". Never "we
  have not tried to reproduce it, so ...".
- When a brand has a history that explains the listing (Huobi became HTX, a takeover, a
  past collapse), give it one sentence.

## Warnings

- `**⚠️ Warning:** ...` goes above the first section, for current dangers: the provider is
  gone, withdrawals are frozen, the company is in liquidation, or the product has many red
  flags.
- Do not warn about something long settled. If the app left every store and its last
  release or removal note is more than 2 years old, put the facts in an update paragraph
  instead. Keep a warning only when the old domain now sends visitors to a different crypto
  service.
- A warning backed by an official notice, regulator, court record or press is strong. One that
  rests only on a dead or parked site says what the site shows and nothing more.

## Verdicts

- **Wallet test first: can you put money in AND get it out again?** If not, it is `nowallet`.
  A store credit balance like Bitrefill's, a prepaid card you can top up with crypto but not
  withdraw from (BitFree), and a checkout that never holds a balance (BitPay Checkout) are all
  `nowallet`. If you can, but it holds no bitcoin, it is `nobtc` (a brokerage account like
  TradeStation). Show the evidence for both halves.
- A wallet for other coins that only watches BTC addresses is `nobtc`. `nowallet` is for
  products that hold no coins at all.
- Products that do the same thing get the same verdict. Off-ramps were filed inconsistently
  as `nowallet` and `nosendreceive`, so grep for the neighbours before you choose.
- **Self-custody inside a custodial product.** An exchange with an optional in-app wallet
  stays `custodial` by default. A self-custodial account can qualify when the app clearly
  marks it as such (Bull Bitcoin's self-custody-first design). A Spark "self-custody" wallet
  only counts if the app lets you do the unilateral exit yourself, which few do.
- `wip` stubs with evidence (an archived store page, an archived site, a successor already
  listed) get a real verdict, `fake` included. Without evidence they stay `wip`.
- `sourceavailable` needs a per-platform `repository:` right after `reviews:`. If the
  repository is gone, or archived and far behind the shipped version, the verdict goes to
  `nosource`.

## Metas

- `removed` overrules `defunct`. An app that left the store stays `removed`, and the warning
  says the provider is gone. `defunct` is for apps still listed and for non-store products.
  Check App Store removal yourself in more than one country before you call it listed.
- Keep meta and text in agreement. If the update says a provider is back online, the meta
  goes back to `ok` too (XchangeOn said "back online" but stayed `defunct`).
- **Hardware, bearer and other non-store products.** `defunct` only when the product cannot be
  used any more, because it needs an app, server or redemption service that is gone. A device
  with a standard seed, third-party apps, or keys on the item still works, so it is
  `discontinued`, even if the provider is gone (a Trezor One cannot turn defunct). A provider
  that is alive and only stopped selling the product makes it `discontinued` too (Ledger
  Unplugged).
- `vapor` plus a provider that is gone is `defunct`: the announcement became a broken promise.
  Apply this to every such listing, not just some.
- `meta: discontinued` needs `discontinued: YYYY-MM-DD`. Use the official date if there is one,
  else the earliest date it is known to be gone ("at least since": the first Wayback capture
  showing it sold out or gone), else today.
- **Stale is obsolete lite.** Measured from the last update or release: more than 360 days
  is `stale`, more than 720 days is `obsolete`, anything newer is `ok`. These are the
  thresholds `updateMeta()` in `scripts/helper.mjs` uses for store apps. Apply them by hand to
  desktop and hardware, so a product revived with its last release 13 months ago is `stale`.

## Coverage

- Same app on Android and iPhone in two files: merge it into the Android file, add the
  `iphone:` block, add `redirect_from` entries `/iphone/<iphoneAppId>/` and
  `/mobile/<iphone-file>/`, and delete the iPhone file. The MEXC merge (0042afa190) is the
  model.
- Every Android-only listing: look for the iPhone app and add it. If the provider is gone
  but the app is still in the App Store, add it as `defunct`.
- New wallets you find on the way, such as successor apps or a rebrand's new app ID, get
  added as listings. Do not just mention "an app we do not list yet". Put them in their own
  MR (like !1889).
- Mark dead links in the files you touch with `#deadLink`, or replace them with a Wayback URL
  when one exists. `scripts/checkUrls.mjs` does this at scale, but it still scans
  `_android`/`_iphone`, so it skips `_mobile`.
- Each platform keeps its own icon from its own store. Do not edit icons.

## Markup

- Verdicts in prose: `{% include verdictBadge.html verdict="custodial" type='short' %}`, never a
  methodology link.
- Other listings: `{% include walletLink.html wallet='android/<appId>' verdict='true' %}` (or
  `iphone/<appId>`, `hardware/<file>`; `walletLinkArchived.html` for `_archived`). Check the
  target exists first, for example `grep -l '^  appId: <id>$' _mobile/*.md`.
- No Play or App Store links in prose; the template already shows them.
- The platform heading is `## iPhone`, not `## iOS`.
- Never start a line with `{%` inside a list or quote unless the neighbouring lines do.

## Shipping

- Keep each MR under 300 changed files, since GitLab review breaks above that.
- For a large pass, split by how much review a file needs:
  1. date bump only,
  2. corrections without a warning, verdict or meta change,
  3. warnings backed by a notice, regulator, court record or press,
  4. verdict and meta changes, warnings that rest only on a dead site, and your judgment
     calls. This is where review time goes.

  List every file with its change in the MR description, and name each judgment call
  separately so the reviewer can find it.
- Before pushing, run `npm test` and the Jekyll build for the touched pages.
- After the last MR is merged, report per-platform before/after counts of verdicts and metas
  over the whole pass.
