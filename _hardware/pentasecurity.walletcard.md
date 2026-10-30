---
title: Penta Security Wallet Card
appId: pentasecurity.walletcard
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Penta Security
providerWebsite: 
website: https://www.pentasecurity.com/
shop: 
country: KR
price: 
repository: 
icon: pentasecurity.walletcard.webp
bugbounty: 
meta: discontinued
verdict: noita
date: 2026-10-30
signer: 
twitter: pentasecsystems
social:
- https://www.linkedin.com/company/penta-security-systems-inc-/
- https://www.facebook.com/pentasecsystems
builds: 
features:
- fingerprint
- nfc
- secEl

---

**Update 2026-10-30:** Penta Security no longer offers this card. Its PALLET wallet line was on the [product page archived in December 2019](https://web.archive.org/web/20191206115146/https://www.pentasecurity.com/product/pallet/), but that page now returns 404 and the site menu has no blockchain products. The [brochure](https://www.pentasecurity.com/wp-content/uploads/2018/08/Brochure_Penta-Cryptowallet-pallet_JP_180605.pdf) is still online, and the company itself is active. The companion app {% include walletLink.html wallet='android/com.pentasecurity.pallet' verdict='true' %} is still off Google Play. We mark the card discontinued; it still has no screen or buttons, so the verdict stays {% include verdictBadge.html verdict="noita" type='short' %}.

## Product Description

Penta Security Systems has multiple domains related to their business: pentasecurity.co.kr, pentasecurity.co.jp, and pentasecurity.com. All of these domains host the same [product specification](https://www.pentasecurity.com/wp-content/uploads/2018/08/Brochure_Penta-Cryptowallet-pallet_JP_180605.pdf) sheet which is written in Japanese. Penta Security Systems is Korea-based.

A [website](https://internetofbusiness.com/security-firm-announces-cryptowallets/) described the hardware wallets as an NFC-enabled card and a device. We were not able to locate an actual picture of either, only renderings.

There were also multiple references to a mobile app related to these devices: AMO or D'Amo, Pallet X, or simply Penta Crypto Wallet. Of these, we were only able to locate the application ID of one in Google Play: [Penta Security Pallet](https://play.google.com/store/apps/details?id=com.pentasecurity.pallet). Unfortunately, this is no longer available on Google Play. 

We were able to translate using Google translate a few features: 

> - Connection Method: Blue Tooth 4.0, NFC
> - User authentication / restore: Fingerprints, PINs, smartphones interlocking, 12-word recovery sheet
> - Secure chip: HW Copy Prevention (PUF)

## Verdict 

We were unable to locate an actual picture of the card nor is it commercially available. However, the company that provides it, Penta Security Systems is still active. Most smart cards that are labeled as wallets generally have the same flaw: they must be brought on to another system to transact or access the data within them. In this case, the card uses NFC or Blue Tooth to connect to an app that is no longer available. The product description **does not indicate a screen or buttons the user can interface with**.

{% include featureEvidence.html feature="nfc" quote="Connection Method: Blue Tooth 4.0, NFC" source="Existing WalletScrutiny review" %}

{% include featureEvidence.html feature="fingerprint" quote="User authentication / restore: Fingerprints, PINs, smartphones interlocking, 12-word recovery sheet" source="Existing WalletScrutiny review" %}

{% include featureEvidence.html feature="secEl" quote="Secure chip: HW Copy Prevention (PUF)" source="Existing WalletScrutiny review" %}