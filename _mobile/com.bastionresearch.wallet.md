---
title: Bastion Wallet
date: 2026-07-23
website: https://bastionwallet.app
appCountry: us
redirect_from:
- /android/com.bastionresearch.wallet/
- /iphone/com.hardwayder.bastionwallet/
- /mobile/com.hardwayder.bastionwallet/
android:
  appId: com.bastionresearch.wallet
  users: 50
  appCountry: us
  released: 2024-05-28
  updated: 2025-12-16
  version: 1.1.163
  icon: com.bastionresearch.wallet.png
  meta: fewusers
  verdict: nosource
  developerName: Bastion Research
iphone:
  appId: com.hardwayder.bastionwallet
  idd: '6475605182'
  appCountry: us
  released: 2024-03-06
  updated: 2026-01-29
  version: 1.0.170
  reviews: 1
  icon: com.hardwayder.bastionwallet.jpg
  meta: ok
  verdict: nosource
  developerName: Bastion Research Ltd.

---

## App Description

Bastion Wallet is a mobile cryptocurrency wallet by Bastion Research Ltd., available on iOS (`com.hardwayder.bastionwallet`) and Android (`com.bastionresearch.wallet`). According to its App Store listing, it lets users store, send and receive Bitcoin and other major cryptocurrencies, with keys "stored encrypted on your device where no one, not even the developers, has access to them." Its [website](https://bastionwallet.app) similarly describes it as self-custodial — "you are the sole owner of your keys" — supporting all major blockchains with an increasing number of coins.

## Testing and Analysis

We were unable to test the app: onboarding requires **two invite codes**, and we could not obtain valid ones — the app has no discoverable community distributing them, and entering arbitrary characters and pressing *Continue* did nothing. This assessment is therefore based on the provider's own claims.

- **Bitcoin support** and **self-custody** are claimed — keys "stored encrypted on your device where no one, not even the developers, has access" — but, blocked at onboarding, we could verify neither.
- **No public source code.** A GitHub code search for the app IDs ([`com.bastionresearch.wallet`](https://github.com/search?q=%22com.bastionresearch.wallet%22&type=code) and [`com.hardwayder.bastionwallet`](https://github.com/search?q=%22com.hardwayder.bastionwallet%22&type=code)) returns no repository, and neither the app nor its [website](https://bastionwallet.app) claims to be open source. The similarly named `bastion-wallet` GitHub org is a separate account-abstraction SDK, not this app.
- The developer is reachable at `support@bastionwallet.app` / `info@bastionresearch.com`, but the app itself stays gated behind invite codes we could not obtain.

**Verdict: nosource.** Regardless of the self-custody claims — which we could neither confirm nor reproduce — the application's source code is not published, so the binary cannot be verified. Per WalletScrutiny policy, a wallet whose current release has no public source is classified **source-unavailable**.
