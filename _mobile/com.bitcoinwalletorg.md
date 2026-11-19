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

**⚠️ Warning:** The developer's identity, the ratings and the privacy policy of this app do not add up (see below), and its self-custody claim cannot be checked without source code. Do not trust it with funds.

## App Description

Satoshi Wallet is a Bitcoin-only wallet published by CoinLíder Inc under the app ID `com.bitcoinwalletorg`. The Play description calls it "a simple, secure, and non-custodial Bitcoin wallet" that "does not store your coins or your private keys", with seed phrase backup and no registration. Its [privacy policy](https://coinlider.com/bitcoinwalletorg-privacy.html), hosted on the developer's domain, calls the app "Bitcoin Wallet" and says the keys and seed phrase are generated and stored only on the user's device.

## Analysis

- **Bitcoin support.** The description lists "Fast Bitcoin sending and receiving" and "Secure address generation". Bitcoin is the only asset mentioned.
- **Custody.** The description says: "this wallet does not store your coins or your private keys. Everything remains on your device." The privacy policy (in Portuguese) says the private keys and recovery phrases "são geradas e armazenadas exclusivamente no dispositivo do usuário" (are generated and stored only on the user's device). By contrast, the developer's own [website](https://coinlider.com/) describes Coinlider's main product as a custodial wallet ("Carteira Cripto Custodial") and does not mention Satoshi Wallet. We take the app's self-custody claim at face value but could not verify it.
- **Source code.** Neither the Play listing, the privacy policy nor coinlider.com links to source code. The three GitHub accounts matching "coinlider" (Coinlider, coinlider-brasil, coinlider2016-ops) have no public repositories. GitHub searches for repositories named "coinlider" or "bitcoinwalletorg", and for code containing `com.bitcoinwalletorg`, returned nothing.
- **Who is behind it.** "CoinLíder Inc" is only the developer name on Google Play. The listing's developer details name a Brazilian company, "ALTAVERA INNOVATIONS LTDA", at what looks like a residential address in Naviraí, Mato Grosso do Sul. We found no company registration for either name and no web presence for Altavera. The domain coinlider.com was registered in March 2025 and showed a parking page until mid-2025.
- **Ads in a wallet, which the privacy policy denies.** Google Play marks the app "Contains ads", and its [data safety section](https://play.google.com/store/apps/datasafety?id=com.bitcoinwalletorg) declares that it collects "Device or other IDs" for "Advertising or marketing". The privacy policy says the app "não coleta, armazena ou compartilha dados pessoais" (does not collect, store or share personal data).
- **The ratings look bought.** All 63 ratings were 5 stars when we checked, against about 1,500 installs, and the written ones are generic ("nice", "Good wallet").
- **Borrowed names.** The app ID `com.bitcoinwalletorg` and the privacy policy's name for the app, "Bitcoin Wallet", recall bitcoin.org and its long-listed Bitcoin Wallet. The store name recalls Wallet of Satoshi. The same developer account also publishes "Crypto Wallet" (`com.corewalletbrasil`), branded "CoreWallet" in its description, a name that collides with Ava Labs' {% include walletLink.html wallet='android/com.avaxwallet' verdict='true' %}.
- **Unregistered "official site".** The privacy policy names `https://bitcoinwalletorg.com` as the "site oficial". That domain is not registered (DNS returns NXDOMAIN), so anyone could register it and pose as the app's official contact.
- **Not the same as the other "Satoshi Wallet".** Another Android app with the same name, {% include walletLink.html wallet='android/com.satoshiwallet' verdict='true' %}, is published by a different developer.

The app claims self-custody, but we found no source code for it, so a reproducible build cannot be attempted. The app is {% include verdictBadge.html verdict="nosource" type='short' %}.

**No source for current release found**
