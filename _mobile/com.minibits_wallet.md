---
title: Minibits Wallet
date: 2024-11-29
authors:
- danny
website: https://www.minibits.cash
twitter: MinibitsCash
features:
- cashu
- fingerprint
- foss
- ln
redirect_from:
- /android/com.minibits_wallet/
android:
  appId: com.minibits_wallet
  users: 1000
  appCountry: us
  updated: 2026-06-02
  version: VARY
  icon: com.minibits_wallet.png
  meta: ok
  verdict: custodial
  developerName: Bitango Technologies

---

## Google Play Description

> Minibits is an Ecash and Lightning wallet with a focus on performance and usability. Ecash is a bearer token issued by custodians known as mints.

> - Seed based backup and recovery of Ecash and Lightning address in case of device loss
> - Local append-only backup to keep Ecash extra safe from storage failures
> - Storage of keys and seed in secure Android keystore
> - Optional Ecash storage encryption and biometric authentication
> - Retry transaction after recoverable errors

## Analysis 

The wallet app is still in its beta-testing stages, but as it reminds its users: 

> "By using them, you accept known and unknown risks:
>
> Mints are custodial by design,. Run your own or use them only for research and testing.

We created a wallet profile. We discovered that the default mint is the minibits mint. Although there is a feature that allows users to create an ln invoice. 

This app is **custodial**.

{% include featureEvidence.html feature="ln" quote="Minibits is an Ecash and Lightning wallet with a focus on performance and usability." source="Google Play Description" %}

{% include featureEvidence.html feature="cashu" quote="Ecash is issued by mints and backed by Bitcoin via the Cashu protocol and the Lightning Network." source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Optional Ecash storage encryption and biometric authentication" source="Google Play Description" %}

{% include featureEvidence.html feature="foss" quote="GitHub" source="Website" %}
