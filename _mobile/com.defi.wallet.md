---
wsId: cryptoComDefi
title: 'Crypto.com: Onchain Wallet'
date: 2021-10-24
authors:
- leo
- danny
website: https://www.crypto.com
twitter: cryptocom
social:
- https://www.linkedin.com/company/cryptocom
- https://www.facebook.com/CryptoComOfficial
- https://www.reddit.com/r/Crypto_com
features:
- buyWithCC
- fingerprint
- hd
- secEl
- tradeAlts
redirect_from:
- /com.defi.wallet/
- /posts/com.defi.wallet/
- /android/com.defi.wallet/
- /iphone/com.defi.wallet/
android:
  appId: com.defi.wallet
  users: 5000000
  appCountry: us
  released: 2020-05-11
  updated: 2026-02-11
  version: 2.50.0
  reviews: 3757
  icon: com.defi.wallet.png
  meta: ok
  verdict: nosource
  developerName: Crypto.com Onchain Wallet
iphone:
  appId: com.defi.wallet
  idd: 1512048310
  appCountry: us
  released: 2020-05-20
  updated: 2026-03-16
  version: 2.50.3
  reviews: 21085
  icon: com.defi.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: Onchain Wallet Limited

---

## Android

## Update 2024-07-16

Almost three years after, a search for the app ID "com.defi.wallet" on GitHub only yields a library called "[defi-wallet-core-rs](https://github.com/crypto-com/defi-wallet-core-rs)" and not a buildable Android app. Their policy concerning the public availability of their Android app's source code has not changed.

## Review 2021-10-24

This app's description is promising:

> Decentralized:
> - Gain full control of your crypto and private keys [...]

On their website though we cannot find any links to source code.

Searching their `appId` on GitHub,
[yields nothing](https://github.com/search?q=%22com.defi.wallet%22) neither.

This brings us to the verdict: **not verifiable**.

The provider has a family of three apps that we triple-checked to be linked from
their website:

* {% include walletLink.html wallet='android/com.crypto.exchange' verdict='true' %}
* {% include walletLink.html wallet='android/co.mona.android' verdict='true' %}
* {% include walletLink.html wallet='android/com.defi.wallet' verdict='true' %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="hd" quote="If you have an existing wallet created on other applications, you can easily import it by entering or copying your 12/18/24-word recovery phrase to Crypto.com Onchain." source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Your private keys are encrypted locally on your device with Secure Enclave, protected by biometric and 2-Factor Authentication." source="Website" %}

{% include featureEvidence.html feature="secEl" quote="Your private keys are encrypted locally on your device with Secure Enclave, protected by biometric and 2-Factor Authentication." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Trade thousands of tokens across major chains, including Ethereum, Bitcoin, Solana, and Cronos." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Connect your Crypto.com account to buy tokens using Apple/Google Pay or bank transfers" source="Store" %}
