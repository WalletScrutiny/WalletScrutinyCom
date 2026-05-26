---
wsId: bizaPayWallet
title: BizaPAY Wallet - 암호화폐 지갑
verdict: custodial
meta: ok
date: 2026-01-16
authors:
- danny
features:
- fingerprint
redirect_from:
- /android/com.amaxg.bizapaywallet/
- /iphone/com.amaxg.bizapaywallet/
android:
  appId: com.amaxg.bizapaywallet
  users: 1000
  released: 2025-01-13
  updated: 2026-02-06
  version: 1.1.1
  icon: com.amaxg.bizapaywallet.png
  developerName: BIZA Project
iphone:
  appId: com.amaxg.bizapaywallet
  idd: '6740513430'
  appCountry: us
  released: 2025-03-23
  updated: 2026-02-10
  version: 1.1.1
  reviews: 1
  icon: com.amaxg.bizapaywallet.jpg
  website: https://iron-sturgeon-db2.notion.site/BizaPAY-Wallet-f7fa49ebb4c64eb3817fe2360b54fa6a?pvs=4
  developerName: AMAXG

---

## Android

## App Description

From the Google Play description:

> easily manage various virtual assets and NFTs such as Bitcoin (BTC), Ethereum (ETH), and BizAuto. Assets from multiple blockchain networks can be integrated and managed in one place, and assets can be transferred easily and quickly...
>
> Visa Pay Wallet is a decentralized wallet service. Asset security is further strengthened because users directly manage their private keys. 

## Testing and Analysis

We managed to [test](https://x.com/BitcoinWalletz/status/2011974369271300352) the app despite the language difficulties.

We did find a screen with the Bitcoin logo, along with other coins and a ticker for the Korean Won (KRW). However, upon tapping it, nothing happened. There was no QR for the address, no text bitcoin wallet address. Instead a KYC box would appear - we assume it is asking us to fulfill KYC procedures before other features (such as displaying the BTC address perhaps) are available. We were also not provided the seed phrases. 

Since this is a stale foreign language app and since its website is no longer available, we are assuming that it is a **custodial** service that limits the wallet features of the app if KYC is not performed. It's also worth noting that it doesn't have a homepage, and the domain listed in its admin email is no longer available.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="사용자는 설정한 비밀번호나 생체인증을 통해 지갑에 안전하게 접근할 수 있으며" source="Store" %}
