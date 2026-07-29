---
title: Safle - Web3 Wallet
date: 2026-07-24
website: https://safle.com/
appCountry: us
redirect_from:
- /android/com.safle/
- /iphone/com.safle.safle-mobile/
- /mobile/com.safle.safle-mobile/
android:
  appId: com.safle
  users: 100000
  appCountry: us
  released: 2022-08-07
  updated: 2025-10-21
  version: 1.7.4
  reviews: 14
  icon: com.safle.png
  meta: defunct
  verdict: wip
  developerName: Safle
iphone:
  appId: com.safle.safle-mobile
  idd: '6444435472'
  appCountry: us
  released: 2023-05-09
  updated: 2025-11-12
  version: 1.7.4
  reviews: 4
  icon: com.safle.safle-mobile.jpg
  meta: defunct
  verdict: wip
  developerName: JUPITER INNOVATIONS LIMITED

---

## Update 2026-07-24

**The Safle wallet appears to be abandoned. We could not create an account, and the provider's website and tested service hosts are unreachable.** We observed the following on 2026-07-24, on a fresh install of the Android app:

- **Signup returned unexpected errors.** Creating a new account failed immediately and onboarding could not be completed ([demonstration](https://x.com/BitcoinWalletz/status/2080555535699709999)).
- **The website and every Safle service host we tested were unreachable**, as listed below.
- **The website had already pivoted away from the wallet.** Archived captures of `safle.com` describe a *"Safe & Simple Crypto Wallet"* in [2023](https://web.archive.org/web/20230603090846/https://safle.com/) and a *"Next-Gen identity wallet"* in [2024](https://web.archive.org/web/20240804074014/https://safle.com/), but its [last working capture](https://web.archive.org/web/20260315232248/https://safle.com/) (Wayback, 2026-03-15) presents *"Safle — web3 Growth Engine … the Intelligence and Identity Layer for Web3"*, a business-to-business product with no consumer wallet.

Hosts tested (2026-07-24):

| Host | Result |
|---|---|
| `safle.com` | TLS handshake fails (no HTTP response) |
| `getsafle.com` | no response |
| `api.safle.com` | no response |
| `api.getsafle.com` | DNS no longer resolves |
| `app.safle.com` | DNS no longer resolves |

**What we did not establish.** We did not capture the app's network traffic, so we cannot confirm that the signup failure was caused by the unreachable hosts — the two observations are consistent but the link is not proven. We also did not reach the wallet's own functionality: its custody model, and whether it holds native bitcoin rather than a pegged token, both remain untested.

The apps remain listed and were last updated in October–November 2025, but with the provider's public site gone, its tested hosts unreachable, and new signup failing, we mark the listing **defunct** while leaving the verdict open.
