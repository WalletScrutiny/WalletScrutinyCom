---
title: Thunderhub LND
appId: thunderhub.lnd
authors:
- danny
released: 2020-04-09
discontinued: 
updated: 2026-08-28
version: 0.19.0
binaries: 
provider: Thunderhub
providerWebsite: 
website: https://www.thunderhub.io
repository: https://github.com/apotdevin/thunderhub
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-11-03
twitter: thunderhubio
social: 
builds:
- arch: x86_64-linux
  types:
    standard:
    - thunderhub-standard-*-amd64.tar
    base:
    - thunderhub-base-*-amd64.tar
features:
- foss
- ln
- ownLN

---

{% include featureEvidence.html feature="ln" quote="Send and Receive Send and receive both Lightning and Bitcoin payments in a simple and easy to use interface with both basic and advanced features." source="Website" %}

{% include featureEvidence.html feature="ownLN" quote="Compatible with the latest LND node versions." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Open Source Don't trust anyone. Verify the code yourself." source="Website" %}