---
wsId: ownbit
title: 'Ownbit: MultiSig & Cold Wallet'
date: 2021-10-01
authors:
- leo
- danny
website: https://ownbit.io
features:
- airGapped
- multiSig
redirect_from:
- /com.bitbill.www/
- /posts/com.bitbill.www/
- /android/com.bitbill.www/
- /iphone/com.bitbill.wallet/
android:
  appId: com.bitbill.www
  users: 10000
  appCountry: us
  released: 2018-03-22
  updated: 2026-08-03
  version: 4.66.5
  reviews: 14
  icon: com.bitbill.www.png
  meta: ok
  verdict: nosource
  developerName: ownbit
iphone:
  appId: com.bitbill.wallet
  idd: '1321798216'
  appCountry: us
  released: 2018-02-07
  updated: 2026-07-21
  version: 4.66.1
  reviews: 149
  icon: com.bitbill.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: BITTOOL PTE. LTD.

---

## Android

## Update 2024-07-13

No changes have been noted regarding this app's source-availability.

## Previous Review 2020-04-15

On the Google Play description we read:

> The mnemonics, seeds (used to generate private keys) of Ownbit wallet are
  encrypted and stored on the phone side. The private key is completely under
  your control.

So this is a non-custodial wallet.

This wallet appears to feature a "cold storage" mode where the same app gets
installed on an offline and an online phone and so the private keys never are
connected to the internet. This of course provides very high security if the
private keys are generated with good entropy. An evil provider could limit the
entropy to generate only one out of a million backups to make those guessable
for him but collisions unlikely. Scrutiny is therefore even in this mode of the
essence.

So lets see if this app provides public source code ...

Turns out, [their website](http://www.bitbill.com#deadLink) is currently not. 

On GitHub
[we found](https://github.com/search?o=desc&q=%22com.bitbill.www%22&s=indexed&type=Code)
87 hits but only in localization, html, csv and reStructuredText which don't
look like the app itself but rather lists of apps.

So as we can't find any source code, we assume this app is closed source and
thus **not verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="multiSig" quote="Multisig Security: Manage funds with team or personal multi-signature." source="Store" %}

{% include featureEvidence.html feature="airGapped" quote="Cold Wallet Mode: Go offline for ultimate protection." source="Store" %}
