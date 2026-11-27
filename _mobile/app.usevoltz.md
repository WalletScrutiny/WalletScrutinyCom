---
title: Voltz Wallet
date: 2026-11-27
authors:
- leo
website: https://www.usevoltz.app/
features:
- spark
android:
  appId: app.usevoltz
  users: 10
  appCountry: us
  released: Nov 3, 2026
  updated: 2026-11-21
  version: 1.0.3
  signer: b4beceea306802586aca2e786d87e82cc43815ae2f7fa9f04533335ff5d72ee6
  icon: app.usevoltz.webp
  meta: fewusers
  verdict: sourceavailable
  developerName: Bitwright
  repository: https://github.com/voltzbtc/voltz-wallet

---

## App Description

Voltz Wallet is a Bitcoin wallet published by Bitwright LTDA and built on the Breez SDK Spark. The Play description calls it "a self-custody Bitcoin wallet" whose keys "are created on your phone and are never sent to Voltz or to any server". It sends and receives over Lightning, Spark and on-chain Bitcoin from one balance, gives every wallet a `@usevoltz.app` Lightning address, can keep part of the balance in the USDB token on Spark, and buys bitcoin through MoonPay. Wallets come from 12 or 24 recovery words, optionally from dice rolls and with a passphrase, or are derived on the device from a passkey. Custom Lightning address names and domains are in-app purchases.

## Analysis

- **Bitcoin support.** The app receives and sends over Lightning and to Bitcoin addresses, from a Spark balance.
- **Custody.** The balance is a Spark balance, held through the Breez SDK. Ordinary withdrawals need the Spark operators, and only a unilateral exit moves the funds on-chain without them.
- **Unilateral exit is advertised.** The [README](https://github.com/voltzbtc/voltz-wallet/blob/96f3d6f04a930a1927c2477860325edf11f95ec5/README.md#L36-L38) says that "when the Spark operators stop serving the wallet, the emergency exit moves its bitcoin onto the Bitcoin chain, with the network fees paid from another wallet", and that tokens such as USDB "do not leave this way". The Play description does not mention it.
- **Unilateral exit is in the app.** In the tag [v1.0.3](https://github.com/voltzbtc/voltz-wallet/tree/v1.0.3), which matches the version on Google Play, the switch [`EMERGENCY_EXIT_LIVE`](https://github.com/voltzbtc/voltz-wallet/blob/96f3d6f04a930a1927c2477860325edf11f95ec5/src/wallet/emergencyExit.ts#L6) is on, and the side menu has an ["Emergency exit"](https://github.com/voltzbtc/voltz-wallet/blob/96f3d6f04a930a1927c2477860325edf11f95ec5/src/navigation/DrawerContent.tsx#L253-L258) row. The string is also in the bundle of the APK on GitHub. Its [design notes](https://github.com/voltzbtc/voltz-wallet/blob/96f3d6f04a930a1927c2477860325edf11f95ec5/docs/emergency-exit.md) follow the SDK's recovery guide: the user pays the fees from a confirmed coin sent from another wallet, and the exit runs over days, with the app opened every few hours. The developers say they ran it on the real SDK with real bitcoin on an emulator, not on a phone. We did not test the exit.
- **Source code.** The code is public on [GitHub](https://github.com/voltzbtc/voltz-wallet) under the PolyForm Strict License 1.0.0, a source-available license that allows only noncommercial use and no changes or redistribution. The repository starts with a single commit from 2026-11-20, so the history before the Play release of Nov 3 is not public. The GitHub releases carry an APK with a signed `SHA256SUMS`.

Voltz claims that users can move their bitcoin on-chain without the Spark operators, and the released app contains that exit. Under our [custodial definition](/methodology/#custodial) we therefore do not consider the balance custodial. The source is public, so it is {% include verdictBadge.html verdict="sourceavailable" type='short' %}, and we can look into reproducibility next.
