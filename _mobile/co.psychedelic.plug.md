---
wsId: plugCrypto
title: Plug - Crypto Wallet
date: 2026-01-15
authors:
- danny
website: https://plugwallet.ooo
twitter: plug_wallet
social:
- https://discord.com/invite/mPpzf45qrt
features:
- buyWithCC
- fingerprint
- tradeAlts
redirect_from:
- /android/co.psychedelic.plug/
- /iphone/co.psychedelic.plug/
android:
  appId: co.psychedelic.plug
  users: 100000
  appCountry: us
  released: 2022-07-01
  updated: 2026-08-03
  version: 2.9.1
  reviews: 17
  icon: co.psychedelic.plug.png
  meta: ok
  verdict: custodial
  developerName: Funded Labs
iphone:
  appId: co.psychedelic.plug
  idd: '1599570197'
  appCountry: us
  released: 2022-05-09
  updated: 2026-08-03
  version: 2.9.0
  reviews: 36
  icon: co.psychedelic.plug.jpg
  meta: ok
  verdict: custodial
  developerName: Crowd IC Ltd

---

## Android

## App Description

According to its Play description, Plug is a self-custody wallet and identity app designed for the Internet Computer ecosystem, allowing users to manage digital assets, tokens, and NFTs while carrying a portable Web3 identity across decentralized applications. The app claims support for multiple blockchains, including Bitcoin, Ethereum, Solana, and ICP, and provides features such as transaction history, address book management, and biometric security. Plug positions itself as a unified wallet experience that enables users to interact seamlessly with Web3 services on mobile and desktop.

## Testing and Analysis

The app was [tested](https://x.com/BitcoinWalletz/status/2011763343758147879) to evaluate its Bitcoin wallet implementation and key-derivation behavior. A Bitcoin receiving address(bc1p3f8xyj9n5fqtm9tkc0e3v26entfrqdzhpw2e8xum4xe64juqeccsaxfa7p) was generated, and the recovery phrase was exported and [imported into Electrum Desktop 4.6.2](https://x.com/BitcoinWalletz/status/2011764733909876926) using standard Bitcoin derivation paths, followed by [Sparrow Wallet](https://x.com/BitcoinWalletz/status/2011768406329151999) configured explicitly for Taproot (BIP86, m/86'/0'/0').

In both cases, none of the derived addresses matched the Bitcoin address shown by the app, and no overlap was observed between address sets. This result persisted across native SegWit and Taproot configurations, ruling out derivation-path mismatch.

Although the app advertises Bitcoin support and displays a valid-looking Taproot (bc1p…) address, the observed behavior shows that it does not use standard, interoperable Bitcoin key derivation, and the recovery phrase cannot be used to reproduce the same Bitcoin addresses in independent Bitcoin wallet software.

Thus, we cannot claim true self-custody and have to give a **custodial** assessment.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap across chains directly in-app" source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy crypto with fiat using 25+ providers via Onramper" source="Store" %}

{% include featureEvidence.html feature="fingerprint" quote="Biometric authentication for extra protection" source="Store" %}
