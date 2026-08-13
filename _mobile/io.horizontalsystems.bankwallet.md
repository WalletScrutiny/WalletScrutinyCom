---
wsId: Unstoppable
title: 'Unstoppable: Crypto Wallet'
date: 2020-12-19
authors:
- leo
- danny
- keraliss
website: https://horizontalsystems.io/
twitter: unstoppablebyhs
social:
- https://www.reddit.com/r/UNSTOPPABLEWallet
features:
- TOR
- foss
- hd
- segwit
- taproot
- tradeAlts
- multiAccount
redirect_from:
- /io.horizontalsystems.bankwallet/
- /posts/io.horizontalsystems.bankwallet/
- /android/io.horizontalsystems.bankwallet/
- /iphone/io.horizontalsystems.bank-wallet/
android:
  appId: io.horizontalsystems.bankwallet
  users: 100000
  appCountry: us
  released: 2018-12-18
  updated: 2026-07-27
  version: 0.49.4
  reviews: 142
  icon: io.horizontalsystems.bankwallet.png
  signer: c1899493e440489178b8748851b72cbed50c282aaa8c03ae236a4652f8c4f27b
  alternativeStores:
  - fdroid
  meta: ok
  verdict: sourceavailable
  developerName: Horizontal Systems
  repository: https://github.com/horizontalsystems/unstoppable-wallet-android
iphone:
  appId: io.horizontalsystems.bank-wallet
  idd: 1447619907
  appCountry: us
  released: 2019-01-10
  updated: 2026-07-29
  version: 0.49.3
  reviews: 1341
  icon: io.horizontalsystems.bank-wallet.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Horizontal Systems
  repository: https://github.com/horizontalsystems/unstoppable-wallet-ios

---

## Android

*Legacy Verification [2024](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/bd55de6e6e654c6f9e9e00411b6f6842c6bfc2f7/_android/io.horizontalsystems.bankwallet.md)*

## App Description

Unstoppable Wallet is a non-custodial, privacy-focused crypto wallet that supports Bitcoin, Ethereum, DeFi tokens, NFTs, privacy coins, and over a dozen blockchains including Solana, Avalanche, and Binance Smart Chain. It allows users to manage multiple portfolios, execute cross-chain swaps via THORChain, and interact with decentralized services using WalletConnect. The app includes advanced Bitcoin features (e.g., BIP44/49/84/86, SPV, time locks), fully shielded Zcash transactions, and partial Tor support. No user data or accounts are required, and all private keys are stored locally, ensuring user autonomy. It is fully open-source, with public audits and ongoing updates to UI, blockchain integrations, and privacy tools.

This app is **source available**.

### Thank you to Horizontal Systems for repeat donations

* $200 on [2021-12-23](https://twitter.com/WalletScrutiny/status/1474197063760072704)
* $200 on [2021-04-13](https://twitter.com/WalletScrutiny/status/1382161902399262720)
* $200 on [2020-12-09](https://twitter.com/WalletScrutiny/status/1336651531442155522)

{% include featureEvidence.html feature="foss" quote="This wallet is open source and available under the terms of the MIT License." source="GitHub README" %}

{% include featureEvidence.html feature="segwit" quote="advanced Bitcoin features (e.g., BIP44/49/84/86, SPV, time locks)" source="App Description" %}

{% include featureEvidence.html feature="taproot" quote="advanced Bitcoin features (e.g., BIP44/49/84/86, SPV, time locks)" source="App Description" %}

{% include featureEvidence.html feature="hd" quote="advanced Bitcoin features (e.g., BIP44/49/84/86, SPV, time locks)" source="App Description" %}

{% include featureEvidence.html feature="TOR" quote="partial Tor support" source="App Description" %}

{% include featureEvidence.html feature="tradeAlts" quote="execute cross-chain swaps via THORChain" source="App Description" %}

---

## iPhone

The provider claims:

> A non-custodial wallet without third party risk.

and we found the source code
[here](https://github.com/horizontalsystems/unstoppable-wallet-ios)
but so far nobody reproduced the build, so the claim is **not verifiable**.

{% include featureEvidence.html feature="foss" quote="This wallet is open source and available under the terms of the MIT License." source="GitHub README" %}

{% include featureEvidence.html feature="segwit" quote="BIP 44/49/84/69 compliant" source="Store description" %}

{% include featureEvidence.html feature="hd" quote="BIP 44/49/84/69 compliant" source="Store description" %}

{% include featureEvidence.html feature="TOR" quote="The app is partially TOR enabled" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="DEXes Integrates decentralized exchanges to enable anonymous asset swaps across many blockchains." source="Website" %}

{% include featureEvidence.html feature="multiAccount" quote="Non-Custodial Multi-wallet >> Manage any number of cryptocurrencies across multiple portfolio-style wallets in a non-custodial manner." source="Store description" %}
