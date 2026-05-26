---
wsId: chainUpCustody
title: ChainUp Custody
verdict: custodial
meta: ok
date: 2025-02-28
authors:
- danny
twitter: ChainUPOfficial
social:
- https://www.linkedin.com/company/chainup-technology
- https://www.facebook.com/ChainUpTechnology
- https://t.me/ChainUpOfficial
features:
- fingerprint
- multiSig
redirect_from:
- /android/com.chainup.hicoincloud.android/
- /iphone/com.joycoin.hicoin/
android:
  appId: com.chainup.hicoincloud.android
  users: 1000
  released: 2022-12-09
  updated: 2026-04-07
  version: 6.10.5
  icon: com.chainup.hicoincloud.android.png
  website: https://custody.chainup.com/
  developerName: KeySecure
iphone:
  appId: com.joycoin.hicoin
  idd: '1438831143'
  appCountry: us
  released: 2018-12-13
  updated: 2026-04-17
  version: 6.10.6
  reviews: 3
  icon: com.joycoin.hicoin.jpg
  developerName: YALASO PTE. LTD.

---

## Android

## App Description from Google Play

ChainUp Custody implements Multi-Party Computation (MPC) with hardware isolation, offline signing, link auditing, and multi-layer security to safeguard digital assets. It supports over 200 token types (e.g., BTC, ETH) and maintains node infrastructures for major blockchains. The system adheres to SOC2 compliance standards, incorporates KYC/KYT for anti-money laundering, and allows users to customize deposit, withdrawal, and freezing processes. A tokenization engine manages the full lifecycle of token issuance and transfer. Additional features include a customizable withdrawal approval flow and real-time chain monitoring for security and compliance.

## Analysis 

Since no single party has control over all of the private key shares, together with the fact that it is implicitly stated that this product is targeted towards institutional customers, and finally, its incorporation of offline-signing, we determine this service to be **custodial** and thus nonverifiable.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="Fingerprint and face unlocking, safe and efficient." source="Store" %}

{% include featureEvidence.html feature="multiSig" quote="Co-managed wallet Flexible management of withdrawal and approval of the number of people, limits and a variety of strategies to meet the security of multiple scenarios out of the demand." source="Store" %}
