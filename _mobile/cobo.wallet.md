---
wsId: cobowallet
title: Cobo Wallet
date: 2026-10-30
authors:
- leo
website: https://cobo.com
twitter: Cobo_Wallet
social:
- https://www.linkedin.com/company/coboofficial
- https://www.facebook.com/coboOfficial
features:
- hd
- multiSig
redirect_from:
- /cobo/
- /cobo.wallet/
- /posts/2019/11/cobo/
- /posts/cobo.wallet/
- /android/cobo.wallet/
- /iphone/cobo.wallet/
android:
  appId: cobo.wallet
  users: 100000
  released: 2018-07-01
  updated: 2025-09-04
  version: 5.19.17
  reviews: 65
  icon: cobo.wallet.webp
  meta: removed
  verdict: nosource
  developerName: Cobo Global Ltd - Crypto Wallet for BTC, ETH
iphone:
  appId: cobo.wallet
  idd: '1406282615'
  appCountry: us
  released: 2018-08-05
  updated: 2026-07-16
  version: 5.19.19
  reviews: 6
  icon: cobo.wallet.webp
  meta: ok
  verdict: nosource
  developerName: Cobo Global Limited

---

## Android

**Update 2026-10-30:** Cobo is shutting this app down. Its [announcement of 2026-10-15](https://www.cobo.com/zh/post/Cobo-Wallet-2026-10-15-1406) says the personal Cobo Wallet App stops service on 2026-12-01 (UTC+8), and that registration has been closed since 2021. Users must move all assets out before then. From 2027-01-01, Cobo deducts a monthly fee of 2% (at least $100 worth) from assets left in the account, which shows that Cobo controls at least the funds in those accounts. Cobo itself now sells institutional custody and wallet services. The app is back on Google Play, where its description now says it "is available to existing users only". We still found no source code for it, so the verdict stays {% include verdictBadge.html verdict="nosource" type='short' %} until the shutdown.

**Update 2022-05-15**: This app is not available anymore.

**Update:** This wallet was one of the first wallets that was analyzed and back
then the custodial wallet was detrimental to call the full wallet custodial.
As it apparently also has a non-custodial part, this verdict is not accurate
anymore.

This app is at least primarily a custodial wallet:

> **Cloud Wallet**
> 
> Designed for user convenience and worry-free investing
> 
> Generate stable returns on your crypto assets
> 
> Free, instant transfers between Cobo Wallet users

but also has a non-custodial

> **HD Wallet**
> 
> Take full control of your assets and private keys for maximum safety
> 
> Easily import your mnemonic seeds from other wallets you may own
> 
> Support for DApps
> 
> EOS & Tron voting

As there is no source code available, claims cannot be checked, which is why the
verdict has to be: this wallet is **not verifiable**.

---

## iPhone

**Update 2026-10-30:** The iPhone app is still on the App Store and falls under the same [shutdown on 2026-12-01](https://www.cobo.com/zh/post/Cobo-Wallet-2026-10-15-1406) as the Android app. Withdraw any funds before then. The verdict stays {% include verdictBadge.html verdict="nosource" type='short' %}.

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="hd" quote="Hierarchical Deterministic (HD) Wallet Take full control of your digital assets and private keys for maximum safety Easily import your mnemonic seeds from other wallets you may own" source="Store description" %}

{% include featureEvidence.html feature="multiSig" quote="USDT multi-signature" source="Store description" %}
