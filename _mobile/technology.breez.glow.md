---
title: 'Glow: Lightning-Fast Bitcoin'
date: 2026-10-28
authors:
- leo
website: https://breez.technology
twitter: breez_tech
redirect_from:
- /iphone/technology.breez.glow/
android:
  appId: technology.breez.glow
  users: 1000
  appCountry: us
  released: Jul 4, 2026
  updated: 2026-09-24
  version: 1.3.0
  icon: technology.breez.glow.webp
  meta: ok
  verdict: custodial
  developerName: Breez Development LTD
iphone:
  appId: technology.breez.glow
  idd: '6762465698'
  appCountry: us
  released: '2026-07-30T07:00:00Z'
  updated: 2026-09-24
  version: 1.3.0
  reviews: 4
  icon: technology.breez.glow.webp
  meta: ok
  verdict: custodial
  developerName: BREEZ DEVELOPMENT LTD

---

## App Description

Glow is a Bitcoin and stablecoin app published by Breez Development LTD and built on the Breez SDK. The Play description says it is "an instant, non-custodial bitcoin app" with passkey login and "no recovery phrase necessary", a `@breez.tips` Lightning address, a "Stable Balance" held in USD, and sending of USDT and USDC to "30+ networks". It sends and receives via "Bolt11 invoices, Lightning addresses, LNURL-Pay, bitcoin addresses, and Spark addresses". The app is open source: [breez/glow-app](https://github.com/breez/glow-app) is the native wrapper and [breez/glow-web](https://github.com/breez/glow-web) the wallet itself.

## Analysis

- **Bitcoin support.** The description lists receiving and sending over Lightning and to Bitcoin addresses, and the latest release notes mention "Instant and/or expedited claim for on-chain deposits".
- **Custody.** The balance is a Spark balance, held through the Breez SDK. The [Breez SDK documentation](https://sdk-doc-spark.breez.technology/guide/recover_funds.html) explains that a Spark balance "is held in a tree of pre-signed Bitcoin transactions" and that a unilateral exit lets the user move it on-chain "if the Spark operators stop cooperating with normal withdrawals". Ordinary withdrawals need the operators. A unilateral exit needs a Bitcoin UTXO "of your own" to pay the fees and "can take several days".
- **Unilateral exit is in the app, but hidden.** glow-web has an implementation ([`src/features/unilateral-exit`](https://github.com/breez/glow-web/tree/7acb2c8414387fec68804c92d436bc9ba6746222/src/features/unilateral-exit)). The tag [release-1.3.0](https://github.com/breez/glow-app/tree/release-1.3.0), which matches the version on Google Play, pins glow-web at [`7acb2c8`](https://github.com/breez/glow-web/commit/7acb2c8414387fec68804c92d436bc9ba6746222), "Gate Unilateral Exit behind developer mode". From that commit on, the Settings entry is shown only in developer mode, which the code unlocks with five quick taps. We have not demonstrated a recovery with Glow.
- **Source code.** The app's source is public under the two repositories above. It does not change the custody question, which turns on the Spark exit.

Our [custodial definition](/methodology/#custodial) counts a Spark balance as self-custodial only for the part that a recovery from the app has been demonstrated to bring back on-chain without anyone's help. No such recovery from Glow has been demonstrated yet, and the exit path in version 1.3.0 is hidden behind developer mode. Until that test is done we consider the balance custodial, even though Glow is marketed as non-custodial.

## iOS

There is also an [iOS version on the App Store](https://apps.apple.com/us/app/id6762465698). It is published by Breez Development LTD, the same provider, and it gives access to the same account and service, so the same verdict applies to it. The App Store version is 1.3.0, the same release as on Google Play, so the developer-mode gate on the unilateral exit applies to it too.

**Custodial: The provider holds the keys**
