---
title: BULL
verdict: sourceavailable
meta: ok
date: 2025-01-13
authors:
- danny
website: http://bullbitcoin.com
repository: https://github.com/SatoshiPortal/bullbitcoin-mobile
twitter: bullbitcoin_
social:
- https://www.facebook.com/bullbitcoindotcom
- https://t.me/bullbitcoinofficial
- https://www.linkedin.com/company/bull-bitcoin
features:
- airGapped
- coinCtrl
- customNode
- foss
- hd
- liquid
- ln
- multiAccount
- nfc
- segwit
redirect_from:
- /android/com.bullbitcoin.mobile/
android:
  appId: com.bullbitcoin.mobile
  users: 10000
  released: 2023-10-31
  updated: 2026-05-17
  version: 6.10.1
  reviews: 7
  icon: com.bullbitcoin.mobile.png
  developerName: Bull Bitcoin

---

{% include featureEvidence.html feature="airGapped" source="[README](https://github.com/SatoshiPortal/bullbitcoin-mobile#readme)" quote="Users can create PSBTs from watch-only wallets for offline signing." %}

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/70ce7b498aeab3be2a67c6dea8d300b6ea4b0257/_android/com.bullbitcoin.mobile.md)*

## App Description from Google Play

> Bull Bitcoin Mobile is a self-custodial Bitcoin and Liquid Network which offers non-custodial atomic swaps across Bitcoin, Lightning and Liquid.

### General features

> - Non-custodial: private keys are generated on the device, and never leave the device.
> - Multiple wallets can be created. Users can switch easily from one wallet to the other on the wallet homepage.
> - Walets with BIP39 passphrases can be created.
> - Amounts can be viewed as Bitcoin or Sats.
> - Users can enable RBF for each transaction.
> - Users can send the full wallet balance (sweep a wallet).

## Analysis

1. We were given the 12-word phrase during the wallet creation stage

2. The app has lightning, Bitcoin and liquid wallets.

{% include featureEvidence.html feature="segwit" quote="Secure Bitcoin Wallet: this is a descriptor-based Bitcoin network wallet which uses bech32 segwit addresses." source="GitHub README" %}

{% include featureEvidence.html feature="ln" quote="Both these wallets are able to send and receive Lightning Network payments via the swap provider." source="GitHub README" %}

{% include featureEvidence.html feature="liquid" quote="Instant Payments Wallet: this is a descriptor-based Liquid network wallet which uses bech32 confidential segwit addresses." source="GitHub README" %}

{% include featureEvidence.html feature="hd" quote="Both wallets are created using the same mnemonic seed, so that a single backup is sufficient for both." source="GitHub README" %}

{% include featureEvidence.html feature="multiAccount" quote="Multiple wallets can be created. Users can switch easily from one wallet to the other on the wallet homepage." source="GitHub README" %}

{% include featureEvidence.html feature="coinCtrl" quote="Coin selection: users can select which utxos will be spent for each transaction. The UTXOs will have the labels of the transactions that created them. When enabling coin selection, only the selected utxos will be used to create a transaction." source="GitHub README" %}

{% include featureEvidence.html feature="customNode" quote="Users can connect to their own electrum server." source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2023 Satoshi Portal Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}

{% include featureEvidence.html feature="nfc" quote="Users can import watch-only wallets via QR code, copy-pasting an Xpub/Ypub/Zpub, uploading a Coldcard file or via NFC (for Coldcard)." source="GitHub README" %}

An issue has been opened at [https://github.com/SatoshiPortal/bullbitcoin-mobile/issues/326](https://github.com/SatoshiPortal/bullbitcoin-mobile/issues/326)
