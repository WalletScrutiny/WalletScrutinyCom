---
title: eSignus Hashwallet Link
appId: esignus.hashwallet.link
authors:
- danny
released: 2022-10-08
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 86
- 54
- 0.8
weight: 
provider: eSignus Security Solutions, S.L.
providerWebsite: https://www.esignus.com/
website: https://www.gethashwallet.com/
shop: https://www.gethashwallet.com/buy
country: ES
price: 149EUR
repository: 
icon: esignus.hashwallet.link.webp
bugbounty: 
meta: ok
verdict: noita
date: 2026-10-30
signer: 
twitter: esignus
social:
- https://www.linkedin.com/company/esignus/
- https://www.facebook.com/hashwalletofficial/
builds: 
features:
- fingerprint
- nfc
- secEl
- tradeAlts

---

**Update 2026-10-30:** eSignus no longer sells the card under the HashWallet Link name, and its old shop is gone. The same card now appears to be sold as "Hashwallet All in One" for €149 on [gethashwallet.com](https://www.gethashwallet.com/), whose shop still lists the backup card for it.

## Product Description 

The HashWallet Link is included in the latest update for a different product, the {% include walletLink.html wallet='hardware/hashwallet' verdict='true' %} indiegogo project. There are production and shipping delays with the [HashWallet Indiegogo](https://www.indiegogo.com/projects/hashwallet-the-most-secure-hardware-wallet#/updates/all).

The [Hashwallet Link](https://web.archive.org/web/20230930201029/https://shop.esignus.com/products/hashwallet-link-cobalt) has two versions, Silver and Cobalt. Apart from the significant difference in price, they are [technically similar](https://t.me/hashwallet/14077).

- NFC-enabled
- It is claimed that it is BIP-39 compliant, however, **12-24 seed phrases are not provided.**
- Compatible with Simplex and Changelly
- Requires HashWallet Manager App 
- Secure Element: Infineon SLE78

> Although we are compatible with BIP-39, you won't need to worry about writing down 24 words and keeping them safe. If you lose your HASHWallet Link, no one will have access to your keys, and there is no way to perform any transaction. Your assets are always safe.
>
> Just order a duplicate of your HASHWallet Link through your HASHWallet Manager App, and you will receive a new card with one of the recovery elements of your keys that were stored offline. Once you scan the card, you will download the other recovery element from your backup account (encrypted with zero knowledge technology), and the keys will be regenerated inside the secure element.


## Analysis 

The card **does not have a display or interface** which would allow the user to verify or confirm transactions.

{% include featureEvidence.html feature="nfc" quote="NFC-enabled" source="Website" %}

{% include featureEvidence.html feature="secEl" quote="Secure Element: Infineon SLE78" source="Website" %}


{% include featureEvidence.html feature="tradeAlts" quote="Compatible with Simplex and Changelly" source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Hardware Wallet Card Our card simplifies digital asset management with mobile tap transactions and can be activated via a mobile app. It features cutting-edge EAL6+ certified hardware, customizable designs, and biometric options for top security and seamless Web3 asset management" source="Website" %}