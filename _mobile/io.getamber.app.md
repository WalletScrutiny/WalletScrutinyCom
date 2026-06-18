---
wsId: amberAppWallet
title: AmberApp
date: 2023-07-17
authors:
- danny
website: http://amber.app
twitter: theamberapp
social:
- https://www.facebook.com/theamberapp
- https://www.instagram.com/amber.app
- https://t.me/theamberapp
features:
- ln
redirect_from:
- /android/io.getamber.app/
- /iphone/io.getamber.app/
android:
  appId: io.getamber.app
  users: 10000
  appCountry: us
  released: 2021-06-21
  updated: 2026-06-18
  version: 8.0.1
  reviews: 26
  icon: io.getamber.app.png
  meta: ok
  verdict: custodial
  developerName: AmberLabs
iphone:
  appId: io.getamber.app
  idd: '1410639317'
  appCountry: au
  released: 2021-06-21
  updated: 2026-06-17
  version: 8.0.0
  reviews: 286
  icon: io.getamber.app.jpg
  meta: ok
  verdict: custodial
  developerName: Amber Labs

---

## Android

## App Description from Google Play

> The world’s first purpose-built Bitcoin exclusive accumulation app.
>
> With 100% control to configure Bitcoin purchase, sell and withdraw actions to suit your preferences. Whether that’s inline with your payrun, saving or investment strategy – you choose!

### From the Website

> Your account, identity, and bitcoin are all secured using the latest collaborative custody, authentication and encryption standards.

## Analysis

- Amber uses [cold-storage](https://amber.app/faqs/) for storing bitcoin. They also have a "dispute window" or timeframe from the first purchase of bitcoin. The bitcoins can only be sent after this period of time.
- The presence of cold-storage mechanisms is a strong indicator of a **custodial** service.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Then stack for life. Or send on the Lightning Network." source="Website" %}
