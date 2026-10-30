---
wsId: binance
title: 'Binance: Buy Bitcoin & Crypto'
date: 2026-10-30
authors:
- leo
website: https://www.binance.com/
twitter: binance
social:
- https://www.facebook.com/binance
- https://www.reddit.com/r/binance
redirect_from:
- /binance/
- /com.binance.dev/
- /posts/com.binance.dev/
- /android/com.binance.dev/
- /iphone/com.czzhao.binance/
android:
  appId: com.binance.dev
  users: 100000000
  appCountry: us
  released: 2017-10-25
  updated: 2026-10-12
  version: 3.21.6
  reviews: 17217
  icon: com.binance.dev.webp
  meta: ok
  verdict: custodial
  developerName: Binance Inc.
iphone:
  appId: com.czzhao.binance
  idd: 1436799971
  appCountry: jp
  released: 2018-10-06
  updated: 2026-10-12
  version: 3.22.0
  reviews: 54065
  icon: com.czzhao.binance.webp
  meta: ok
  verdict: custodial
  developerName: Binance Switzerland AG

---

## Android

**Update 2026-10-30:** The exchange account in this app is still custodial. The
app's description today promises "user assets held 1:1" and the SAFU fund, so the
verdict stays {% include verdictBadge.html verdict="custodial" type='short' %}.
Since November 2023 the app also contains a separate "Binance Wallet" (first
called Web3 Wallet). It splits each key into three MPC shares, two of them
controlled by the user, and does not use a seed phrase
([CoinDesk](https://www.coindesk.com/business/2023/11/08/binance-rolls-out-its-first-ever-self-custody-web3-wallet)).
Binance holds the third share
([Coin Bureau](https://coinbureau.com/review/binance-wallet-review)). We found
no source code for the app. In the same month Binance pleaded guilty to US
anti-money-laundering and sanctions charges and agreed to pay $4.3 billion, and
its founder Changpeng Zhao stepped down as CEO
([CNBC](https://www.cnbc.com/2023/11/21/binance-ceo-changpeng-zhao-to-plead-guilty-to-federal-charges-step-down.html)).

This app appears to be an app interface for the Binance exchange and at first we
cannot find anything indicating that there is also a non-custodial feature to
this app.

> The Binance app is regularly updated to provide you with the most up to date
  features and to give you the best experience when trading on the binance
  crypto exchange platform. Whilst all funds are protected by SAFU (Secure Asset
  Fund for Users) so that you can be sure that all your digital assets are
  secure and safe in any situation, we are with you all the way to ensure you
  have the very best in customer service and security.

Doesn't sound like you control the keys.

(*Also Binance does provide a non-custodial wallet on Android which is
[Trustwallet](https://walletscrutiny.com/trust/) which happens to be closed
source.*)

This app being custodial is **not verifiable**.

---

## iPhone

**Update 2026-10-30:** The app is still in the Japanese App Store and, as on
Android, the exchange account is custodial. The verdict stays
{% include verdictBadge.html verdict="custodial" type='short' %}. See the
Android section for the separate in-app Binance Wallet.

In the description the provider claims:

> Your funds are protected by our Secure Asset Fund for Users (SAFU Funds) which
  means we have your back.

which sounds very custodial and as such the app is **not verifiable**.
