---
wsId: ironwallet
title: 'IronWallet: Crypto Wallet'
date: 2024-09-02
authors:
- danny
website: https://ironwallet.io/
features:
- hd
- nfc
- tradeAlts
- buyWithCC
- fingerprint
redirect_from:
- /android/com.wallet.crypto.btc.eth/
- /iphone/com.wallet.crypto.btc.eth/
android:
  appId: com.wallet.crypto.btc.eth
  users: 1000000
  appCountry: us
  released: 2023-09-06
  updated: 2026-06-04
  version: 1.10.7
  reviews: 72
  icon: com.wallet.crypto.btc.eth.png
  meta: ok
  verdict: nosource
  developerName: INWAY AKTIENGESELLSCHAFT
  repository: https://github.com/Ironwallet/IronWallet
iphone:
  appId: com.wallet.crypto.btc.eth
  idd: '6451146325'
  appCountry: us
  released: 2023-10-02
  updated: 2026-06-07
  version: 1.10.7
  reviews: 44
  icon: com.wallet.crypto.btc.eth.jpg
  meta: ok
  verdict: nosource
  developerName: INWAY AKTIENGESELLSCHAFT
  repository: https://github.com/Ironwallet/IronWallet

---

## Android

## Analysis 

- ☑️ Supports Bitcoin
- ☑️ Can send/receive Bitcoin
- ☑️ Provides seed-phrases
- Has a GitHub organization page with a mostly [empty repository](https://github.com/Ironwallet/IronWallet) for the app.

## Other Observations

This app seems to be new but strangely already has 500,000 users.  Social media links seem to have been removed from their homepage, but already exist in platforms such as x.com. Nevertheless, we created an [issue in their Github](https://github.com/Ironwallet/IronWallet/issues/1) just in case they change their minds and decide to make the source available. Tentatively, this app is **not source-available**.

{% include featureEvidence.html feature="hd" quote="Local key generation (BIP‑39)" source="GitHub README" %}

{% include featureEvidence.html feature="tradeAlts" quote="Cross‑chain swap integrations with decentralized liquidity protocols" source="GitHub README" %}

{% include featureEvidence.html feature="nfc" quote="NFC Info" source="Website" %}

An issue has been opened at [https://github.com/Ironwallet/IronWallet/issues/1](https://github.com/Ironwallet/IronWallet/issues/1)

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="Secure your wallet with a PIN or biometric login." source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Buy, sell & swap crypto through our integrated partners." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy, sell & swap crypto through our integrated partners." source="Store description" %}
