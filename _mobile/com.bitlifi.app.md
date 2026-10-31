---
title: Bitlifi
date: 2026-10-30
authors:
- danny
website: https://www.bitlifi.com
twitter: bitlifi
social:
- https://www.facebook.com/bitlifi
features:
- ln
- spark
redirect_from:
- /android/com.bitlifi.app/
- /iphone/com.bitlifi.app/
android:
  appId: com.bitlifi.app
  users: 5000
  appCountry: us
  released: 2023-05-04
  updated: 2026-08-19
  version: 1.11.22
  icon: com.bitlifi.app.webp
  meta: ok
  verdict: custodial
  developerName: MP Developers s.r.o.
iphone:
  appId: com.bitlifi.app
  idd: '6448746690'
  appCountry: jp
  released: 2023-05-16
  updated: 2026-08-22
  version: 1.11.21
  reviews: 0
  icon: com.bitlifi.app.webp
  meta: ok
  verdict: custodial
  developerName: MP Developers s.r.o.

---

**Update 2026-10-30:** The [terms of 8 September 2026](https://www.bitlifi.com/en/terms/) (Czech, article 4.11) add a self-custody wallet on the Spark protocol whose private key stays on the user's device. The provider still holds coins in the regular in-app wallet, which can only withdraw into that self-custody wallet, so the app stays {% include verdictBadge.html verdict="custodial" type='short' %} for now.

## Android

## App Description from Google Play

> - Innovative Lightning Network wallet with intuitive controls for easy Bitcoin management
> - You can send Bitcoin to phone number directly from the app or from another Lightning Network wallet to an LN address in the format phonenumber@bitlifi.com
> - Recipients do not need to be registered - they will be notified of the incoming payment via SMS notification

## Analysis

In section 3.a.1 of the [terms](https://www.bitlifi.com/en/terms/), it is mentioned that the provider holds BTC on account of the user, this makes it a **custodial** platform.

---

## iPhone

The Android analysis above applies to the iPhone app too.

{% include featureEvidence.html feature="ln" quote="Innovative Lightning Network wallet with intuitive controls for easy Bitcoin management" source="Store" %}
