---
wsId: WalletofSatoshi
title: Wallet of Satoshi
altTitle: 
authors:
- leo
appId: com.livingroomofsatoshi.wallet
appCountry: jp
idd: 1438599608
released: 2019-05-20
updated: 2026-01-20
version: 3.2.1
reviews: 15
website: https://www.walletofsatoshi.com
repository: 
icon: com.livingroomofsatoshi.wallet.jpg
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2024-10-07
signer: 
twitter: walletofsatoshi
social:
- https://www.facebook.com/walletofsatoshi
features:
- buyWithCC
- ln
- nfc
developerName: Wallet of Satoshi

---

This is a custodial wallet according to their website's FAQ:

> It is a zero-configuration custodial wallet with a focus on simplicity and the
  best possible user experience.

and therefore **not verifiable**.

{% include featureEvidence.html feature="nfc" quote="Pay merchants by scanning a Lightning QR code, tapping an NFC card, or sharing your own custom Lightning Address." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Yes, you can buy Bitcoin directly in the app in many countries. Tap the green &quot;Buy Bitcoin&quot; button on the main screen and follow the prompts. Availability and partners may vary by region." source="Website" %}