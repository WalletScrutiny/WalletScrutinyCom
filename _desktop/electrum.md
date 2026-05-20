---
title: Electrum
appId: electrum
bitcoinOrgId: electrum
authors:
- danny
released: 2011-11-05
discontinued: 
updated: 2026-04-01
version: 4.7.2
binaries: 
provider: Thomas Voegtlin
providerWebsite: 
website: https://electrum.org/
repository: https://github.com/spesmilo/electrum
icon: electrum.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-08-24
twitter: ElectrumWallet
social: 
builds:
- arch: x86_64-linux-gnu
  types:
    appimage:
    - electrum-*-x86_64.AppImage
    tarball:
    - Electrum-*.tar.gz
- arch: win64
  types:
    setup:
    - electrum-*-setup.exe
    portable:
    - electrum-*-portable.exe
    standalone:
    - electrum-*.exe
features:
- customNode
- foss
- multiSig
- segwit

---

## App Description

Electrum is a lightweight Bitcoin client developed by Thomas Voegtlin in 2011. It is one of the pioneers and considered to be one of the archetypal Bitcoin wallets in existence. It is very [well-documented](https://electrum.readthedocs.io/) and has a high-regard in the space. It supports multisig, 2FA and many other security and privacy integrations. 

They have a guide on [reproducibility](https://github.com/spesmilo/electrum/tree/master/contrib/build-linux/sdist)

This desktop program is **for verification**.

{% include featureEvidence.html feature="foss" quote="Released under the MIT Licence" source="Website" %}

{% include featureEvidence.html feature="multiSig" quote="Multisig Split the permission to spend your coins between several wallets." source="Website" %}

{% include featureEvidence.html feature="customNode" quote="How to run your own Electrum server: Install Guide" source="Website" %}

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}