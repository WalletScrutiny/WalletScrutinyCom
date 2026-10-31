---
title: 'Swan Bitcoin: Buy & Save'
date: 2026-10-30
authors:
- danny
website: https://www.swanbitcoin.com
twitter: swan
social:
- https://www.instagram.com/swanbitcoin
- https://www.linkedin.com/company/swanbitcoin
features:
- fingerprint
- multiSig
redirect_from:
- /android/com.swanbitcoin.android/
- /iphone/com.swanbitcoin.app/
android:
  appId: com.swanbitcoin.android
  users: 100000
  appCountry: us
  released: 2022-03-25
  updated: 2026-09-08
  version: 3.30.0
  reviews: 269
  icon: com.swanbitcoin.android.webp
  meta: ok
  verdict: custodial
  developerName: Swan Bitcoin
iphone:
  appId: com.swanbitcoin.app
  idd: '1576287352'
  appCountry: us
  released: 2022-08-25
  updated: 2026-09-09
  version: 3.33.0
  reviews: 4063
  icon: com.swanbitcoin.app.webp
  meta: ok
  verdict: custodial
  developerName: Swan Bitcoin

---

**Update 2026-10-30:** Swan's [security page](https://www.swanbitcoin.com/security/) no longer names Fortress; Bitcoin is now held with a regulated custodian that depends on the account type and location. Swan also offers Swan Vault, a 2-of-3 multisig with the user's own hardware keys, but bitcoin bought in the app sits with the custodian until withdrawn, so the app stays {% include verdictBadge.html verdict="custodial" type='short' %}.

## Android

## App Description from Google Play

> Buy Bitcoin anytime - purchases are instantly added to your Bitcoin balance.
>
> Create a Bitcoin savings plan for set-it-and-forget-it accumulation.

## Analysis

- [Custody](https://www.swanbitcoin.com/security/) is with Swan's partner, Fortress.
- This is a **custodial** provider.

---

## iPhone

The Android analysis above applies to the iPhone app too.

{% include featureEvidence.html feature="multiSig" quote="With features like 72-hour withdrawal holds and multi-signature protection, your Bitcoin stays safe even if you lose your keys." source="Store description" %}

{% include featureEvidence.html feature="fingerprint" quote="Enable biometric authentication and hide balances for extra privacy." source="Store description" %}
