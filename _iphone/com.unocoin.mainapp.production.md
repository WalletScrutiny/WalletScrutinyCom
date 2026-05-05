---
wsId: Unocoin
title: 'Unocoin: Buy Bitcoin & Crypto'
altTitle: 
authors:
- leo
appId: com.unocoin.mainapp.production
appCountry: in
idd: 1030422972
released: 2016-05-12
updated: 2026-04-15
version: 6.2.75
reviews: 1623
website: https://www.unocoin.com
repository: 
icon: com.unocoin.mainapp.production.jpg
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2024-10-07
signer: 
twitter: Unocoin
social:
- https://www.linkedin.com/company/unocoin
- https://www.facebook.com/unocoin
features:
- buyWithCC
- fingerprint
- tradeAlts
developerName: Unocoin Technologies Private Limited

---

This app appears to be the interface to a trading platform. The description
does not talk about where the keys are stored but it links to their
website and there we read

> AES-256 Encryption<br>
  The address-private key pairs obtained are encrypted using AES-256, sealed in
  envelopes and stored in multiple safe deposit lockers.

which clearly means they have the keys and you don't. As a custodial service,
this app is **not verifiable**.

{% include featureEvidence.html feature="fingerprint" quote="Biometric login & app lock" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Buy, sell & trade Bitcoin, Ethereum, Dogecoin, Shiba Inu and 95+ cryptocurrencies instantly using INR." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="INR Deposit & Withdrawal" source="Store description" %}