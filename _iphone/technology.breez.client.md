---
wsId: breez
title: 'Breez: Lightning Client & POS'
altTitle: 
authors:
- danny
appId: technology.breez.client
appCountry: us
idd: '1463604142'
released: 2022-05-01
updated: 2025-01-14
version: 1.1.21
reviews: 43
website: 
repository: https://github.com/breez/breezmobile
issue: https://github.com/breez/breezmobile/issues/247
icon: technology.breez.client.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: []
date: 2023-12-15
signer: 
twitter: breez_tech
social:
- http://breez.technology
features:
- bip158spv
- buyWithCC
- customNode
- fingerprint
- foss
- ln
- nfc
developerName: BREEZ DEVELOPMENT LTD

---

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Breez is a non-custodial Lightning Network client which makes paying in bitcoin a seamless experience. With Breez, anyone can send or receive small payments in bitcoin." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Adding funds via credit card" source="README" %}

{% include featureEvidence.html feature="fingerprint" quote="Biometric login" source="README" %}

{% include featureEvidence.html feature="bip158spv" quote="Expose Bitcoin Node (BIP157) configuration" source="README" %}

{% include featureEvidence.html feature="foss" quote="https://github.com/breez/breezmobile" source="README" comment="Source code is publicly available on GitHub. However, the License file returned 404: Not Found, so FOSS cannot be confirmed without a verified OSI-approved license file." %}

{% include featureEvidence.html feature="nfc" quote="NFC checkout" source="README" %}

{% include featureEvidence.html feature="customNode" quote="Support 3rd-party LSPs" source="README" %}