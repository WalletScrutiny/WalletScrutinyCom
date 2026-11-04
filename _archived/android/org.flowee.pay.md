---
title: 'Flowee Pay: BitcoinCash Wallet'
appId: org.flowee.pay
meta: ok
verdict: nobtc
archivedFrom: _android/org.flowee.pay.md
archivedCommit: eb694ec6cd8ea934c1f968ab29072b221e2ff813

---

## App Description

Flowee Pay is described as a Bitcoin Cash wallet/payment app. The public source repository is published at `https://codeberg.org/Flowee/pay`.

## Testing and Analysis

The Google Play listing says Flowee Pay is for Bitcoin Cash, and the [Android manifest](https://codeberg.org/Flowee/pay/src/branch/master/android/AndroidManifest.xml) registers `bitcoincash` and `bch-wif` URI schemes. I found no verified source in the Play listing, README, or Android manifest showing BTC support for this app.

This app matches the `nobtc` verdict: it is a wallet, but **not a BTC wallet**.
