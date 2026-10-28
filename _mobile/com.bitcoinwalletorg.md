---
title: Satoshi Wallet
date: 2026-10-28
authors:
- leo
website: https://coinlider.com
android:
  appId: com.bitcoinwalletorg
  users: 1000
  appCountry: us
  released: Mar 8, 2026
  updated: 2026-07-22
  version: 1.2.0
  reviews: 1
  icon: com.bitcoinwalletorg.webp
  meta: ok
  verdict: nosource
  developerName: CoinLíder Inc

---

## App Description

Satoshi Wallet is a Bitcoin-only wallet published by CoinLíder Inc under the app ID `com.bitcoinwalletorg`. The Play description calls it "a simple, secure, and non-custodial Bitcoin wallet" that "does not store your coins or your private keys", with seed phrase backup and no registration. Its [privacy policy](https://coinlider.com/bitcoinwalletorg-privacy.html), hosted on the developer's domain, calls the app "Bitcoin Wallet" and says the keys and seed phrase are generated and stored only on the user's device.

## Analysis

- **Bitcoin support.** The description lists "Fast Bitcoin sending and receiving" and "Secure address generation". Bitcoin is the only asset mentioned.
- **Custody.** The description says: "this wallet does not store your coins or your private keys. Everything remains on your device." The privacy policy (in Portuguese) says the private keys and recovery phrases "são geradas e armazenadas exclusivamente no dispositivo do usuário" (are generated and stored only on the user's device). By contrast, the developer's own [website](https://coinlider.com/) describes Coinlider's main product as a custodial wallet ("Carteira Cripto Custodial") and does not mention Satoshi Wallet. We take the app's self-custody claim at face value but could not verify it.
- **Source code.** Neither the Play listing, the privacy policy nor coinlider.com links to source code. The three GitHub accounts matching "coinlider" (Coinlider, coinlider-brasil, coinlider2016-ops) have no public repositories. GitHub searches for repositories named "coinlider" or "bitcoinwalletorg", and for code containing `com.bitcoinwalletorg`, returned nothing.
- **Dead website link.** The privacy policy names `https://bitcoinwalletorg.com` as the "site oficial". That domain does not exist (DNS returns NXDOMAIN).
- **Not the same as the other "Satoshi Wallet".** Another Android app with the same name, `com.satoshiwallet`, is published by a different developer.

The app claims self-custody, but we found no source code for it, so a [reproducible build](/methodology/#nosource) cannot be attempted.

**No source for current release found**
