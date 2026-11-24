---
title: 'Glow: Lightning-Fast Bitcoin'
date: 2026-11-23
authors:
- leo
website: https://breez.technology
twitter: breez_tech
features:
- spark
android:
  appId: technology.breez.glow
  users: 1000
  appCountry: us
  released: Jul 4, 2026
  updated: 2026-11-09
  version: 1.4.1
  icon: technology.breez.glow.webp
  meta: ok
  verdict: sourceavailable
  developerName: Breez Development LTD
  repository: https://github.com/breez/glow-app
iphone:
  appId: technology.breez.glow
  idd: '6762465698'
  appCountry: us
  released: '2026-07-30T07:00:00Z'
  updated: 2026-11-09
  version: 1.4.1
  reviews: 4
  icon: technology.breez.glow.webp
  meta: ok
  verdict: sourceavailable
  developerName: BREEZ DEVELOPMENT LTD
  repository: https://github.com/breez/glow-app

---

## App Description

Glow is a Bitcoin and stablecoin app published by Breez Development LTD and built on the Breez SDK. The Play description says it is "an instant, non-custodial bitcoin app" with passkey login and "no recovery phrase necessary", a `@breez.tips` Lightning address, a "Stable Balance" held in USD, and sending of USDT and USDC to "30+ networks". It sends and receives via "Bolt11 invoices, Lightning addresses, LNURL-Pay, bitcoin addresses, and Spark addresses". The app is open source: [breez/glow-app](https://github.com/breez/glow-app) is the native wrapper and [breez/glow-web](https://github.com/breez/glow-web) the wallet itself.

## Analysis

- **Bitcoin support.** The description lists receiving and sending over Lightning and to Bitcoin addresses, and the latest release notes mention "Instant and/or expedited claim for on-chain deposits".
- **Custody.** The balance is a Spark balance, held through the Breez SDK. The [Breez SDK documentation](https://sdk-doc-spark.breez.technology/guide/recover_funds.html) explains that a Spark balance "is held in a tree of pre-signed Bitcoin transactions" and that a unilateral exit lets the user move it on-chain "if the Spark operators stop cooperating with normal withdrawals". Ordinary withdrawals need the operators. A unilateral exit needs a Bitcoin UTXO "of your own" to pay the fees and "can take several days".
- **Unilateral exit is in the app.** In version 1.4.1, Settings has a "Unilateral Exit" entry with the text ["Move your balance on-chain without Spark operators"](https://github.com/breez/glow-web/blob/c11ac19d20289e2d80c40990864d9429ab57a810/src/pages/SettingsPage.tsx#L461-L465) and the advice to use it "only if Spark stops operating". The tag [release-1.4.1](https://github.com/breez/glow-app/tree/release-1.4.1), which matches the version on Google Play, pins glow-web at [`c11ac19`](https://github.com/breez/glow-web/tree/c11ac19d20289e2d80c40990864d9429ab57a810). Version 1.3.0 showed this entry only in developer mode. We did not test the exit.
- **What the exit needs.** The app's [own notes](https://github.com/breez/glow-web/blob/c11ac19d20289e2d80c40990864d9429ab57a810/src/features/unilateral-exit/README.md) call it "a last resort" that "costs on-chain fees and takes days". The fees are paid from a separate native SegWit coin that the user supplies. The leaf data an exit is built from "dies with the device unless the user holds a copy", so the app offers an export, and the operators cannot serve that data again once they stop answering.
- **Source code.** The app's source is public under the two repositories above.

Glow claims that users can move their balance on-chain without the Spark operators, and the released app contains that exit. Under our [custodial definition](/methodology/#custodial) we therefore do not consider the balance custodial. The source is public and we have not yet tried to build it. For now it is {% include verdictBadge.html verdict="sourceavailable" type='short' %}.

## iPhone

The iOS app is published by Breez Development LTD, the same provider, and it gives access to the same account and service, so the same verdict applies to it. The App Store version is 1.4.1, the same release as on Google Play, so it has the same unilateral exit. We have not tried to build it.

**Source code is available**
