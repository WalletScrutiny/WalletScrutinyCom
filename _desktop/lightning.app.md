---
title: Lightning Labs Lightning App
appId: lightning.app
authors:
- danny
released: 2018-09-11
discontinued: 
updated: 2019-10-25
version: 0.5.9-alpha
binaries: 
provider: Lightning Labs
providerWebsite: https://lightning.engineering
website: 
repository: https://github.com/lightninglabs/lightning-app
icon: lightning.app.png
bugbounty: 
meta: obsolete
verdict: sourceavailable
date: 2024-04-25
twitter: lightning
social: 
builds: 
features:
- bip158spv
- ownFullNode
- customNode
- ln

---

{% include featureEvidence.html feature="bip158spv" source="[README](https://github.com/lightninglabs/lightning-app#readme)" quote="run in full node mode instead of the default neutrino mode" %}
{% include featureEvidence.html feature="ownFullNode" source="[README](https://github.com/lightninglabs/lightning-app#readme)" quote="Starting the Packaged App (full node)" %}
{% include featureEvidence.html feature="customNode" source="[README](https://github.com/lightninglabs/lightning-app#readme)" quote="btcd --txindex --rpcuser=kek --rpcpass=kek" %}

This app has been archived on Feb. 23, 2021 and is no longer maintained. It is obsolete.
