---
wsId: KeyWalletTouch
title: KeyWallet Touch - CryptoWallet
date: 2024-07-17
authors:
- leo
- danny
website: http://keywallet.co.kr/en/
twitter: quickxprotocol
social:
- https://www.linkedin.com/company/quickx
- https://www.facebook.com/quickxprotocol
- https://www.reddit.com/r/QuickX
features:
- hd
- nfc
- secEl
redirect_from:
- /android/kr.co.keypair.keywalletTouch/
- /iphone/kr.co.keypair.keywalletTouchiOS/
android:
  appId: kr.co.keypair.keywalletTouch
  users: 10000
  released: 2018-05-13
  updated: 2026-01-14
  version: 3.0.60
  reviews: 16
  icon: kr.co.keypair.keywalletTouch.png
  meta: ok
  verdict: nosource
  developerName: Keypair Co., Ltd.
iphone:
  appId: kr.co.keypair.keywalletTouchiOS
  idd: 1473941321
  released: 2019-07-28
  updated: 2025-12-14
  version: 3.0.59
  reviews: 0
  icon: kr.co.keypair.keywalletTouchiOS.jpg
  meta: ok
  verdict: nosource
  developerName: Keypair

---

## Android

**Update 2024-07-17**

No change regarding source-availability is found. 

**Updated Review 2022-01-04**:

The new URL linked to from the Google Play app page is keypair.co.kr. [(Twitter Screenshot)](https://twitter.com/BitcoinWalletz/status/1478331352944898048)

**Previous Review**

The description makes rather vague claims:

> - Fully complied with HD(Hierarchical Deterministic) wallet

which is a standard that makes most sense for self-custodial wallets.

> This application manages crypto wallets for Bitcoin, Ethereum, Ripple, ERC20
  tokens and etc.

Now this might be a language barrier issue but we would hope it is a wallet and
not an application to manage wallets aka "not a wallet"?

Their website appears to be no more and we get forwarded to
[some Korean site](http://html.ugo.kr/servicestop.html) that according to Google
translate reads:

> This is to inform you that the "service period has expired" for this site .

There is another website though: [afinkeywallet.io](https://afinkeywallet.io)

So in the best of cases this is a functioning closed source self-custodial
Bitcoin wallet and thus **not verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="hd" quote="Fully complied with HD(Hierarchical Deterministic) wallet" source="Store" %}

{% include featureEvidence.html feature="secEl" quote="EAL 5+ CC certified smartcard chip embedded(secure element)" source="Store" %}

{% include featureEvidence.html feature="nfc" quote="it communicates with the app using NFC(Near Field Communication)" source="Store" %}
