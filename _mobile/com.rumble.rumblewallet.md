---
wsId: rumbleWallet
title: 'Rumble Wallet: Buy Crypto, BTC'
date: 2026-01-12
authors:
- danny
website: https://wallet.rumble.com
twitter: rumblevideo
social:
- https://www.linkedin.com/company/rumblevideo
- https://www.youtube.com/@rumblevideo
features:
- buyWithCC
- hd
redirect_from:
- /android/com.rumble.rumblewallet/
- /iphone/com.rumble.wallet/
android:
  appId: com.rumble.rumblewallet
  users: 10000
  appCountry: us
  released: 2026-01-19
  updated: 2026-07-03
  version: 2.5.0
  reviews: 24
  icon: com.rumble.rumblewallet.png
  meta: ok
  verdict: nosource
  developerName: Rumble Inc
iphone:
  appId: com.rumble.wallet
  idd: '6748149951'
  appCountry: us
  released: 2025-12-15
  updated: 2026-07-06
  version: 2.5.0
  reviews: 63
  icon: com.rumble.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: Rumble Inc.

---

## Android

## App Description 

Rumble Wallet is a non-custodial cryptocurrency wallet designed primarily for Rumble content creators and their audiences, with a strong emphasis on tipping and withdrawals tied to the Rumble ecosystem. The app explicitly claims support for Bitcoin and Tether, positioning Bitcoin less as a general-purpose savings or payments tool and more as a medium for creator tips, earnings, and payouts. 

Functionally, the wallet is oriented around fast in-app transfers, creator tipping, and fiat on-ramps via MoonPay, rather than advanced Bitcoin wallet features such as coin control, custom fee selection, or privacy tooling. As a result, Rumble Wallet appears best suited for users who already participate in the Rumble platform and want a convenient way to receive, tip, and cash out Bitcoin or USDT, rather than for users seeking a standalone, privacy-focused Bitcoin wallet for long-term self-custody or advanced on-chain usage.

## Testing and Analysis

We installed the app but did not manage to initialize it. A bug kept closing the app after it displays the splash screen.

From their [FAQ](https://wallet.rumble.com/support/docs/get-started/set-up-your-rumble-wallet):

> Your secret phrase is a randomly generated set of 12 words... Because you are the sole custodian of your wallet, you need to ensure that only you have access to the secret phrase.

While the underlying framework (Tether's open-source WDK) is publicly available, Rumble Inc. has not made the Rumble Wallet app code itself open-source. 

[No public repository](https://github.com/search?q=%22com.rumble.rumblewallet%22&type=code) (such as GitHub) for the com.rumble.rumblewallet application code is currently linked in official documentation or the Play Store listing.

This app is **not source available**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="hd" quote="Restore access to your crypto wallet and cryptocurrency assets with a 12-word seed phrase. You control your account, no middlemen." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy Crypto with MoonPay Easily purchase Bitcoin and Tether using your debit card through our MoonPay integration." source="Store" %}
