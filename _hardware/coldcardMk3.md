---
title: Coldcard Mk3
appId: coldcardMk3
bitcoinOrgId: coldcard
authors:
- kiwilamb
- leo
- danny
- mohammad
released: 2018-04-01
discontinued: 
updated: 2023-06-26
version: v4.1.9
binaries: https://coldcard.com/downloads/
dimensions:
- 88
- 51
- 9
weight: 30
provider: Coinkite
providerWebsite: https://coinkite.com/
website: https://coldcard.com/
shop: https://store.coinkite.com/store/coldcard
country: CA
price: 147.94USD
repository: https://github.com/Coldcard/firmware
icon: coldcardMk3.png
bugbounty: https://coinkite.com/responsible-disclosure
meta: discontinued
verdict: sourceavailable
date: 2023-10-08
signer: 
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
builds: 
features:
- hd
- multiSig
- airGapped
- secEl

---

{% include featureEvidence.html feature="hd" source="[Website](https://coldcard.com/)" quote="the 24-word seed phrase for your BIP39 wallet" %}
{% include featureEvidence.html feature="multiSig" source="[Website](https://coldcard.com/)" quote="Advanced users can even setup a multisig wallet between multiple cosigners, entirely on-device, and air gapped" %}
{% include featureEvidence.html feature="airGapped" source="[Website](https://coldcard.com/)" quote="COLDCARD never needs to touch a computer. It can work entirely from a USB power pack or AC power adapter." %}
{% include featureEvidence.html feature="secEl" source="[Website](https://coldcard.com/)" quote="COLDCARD uses two Secure Elements, from different vendors, to protect your Bitcoin." %}

## Device Description

The COLDCARD Mk3 is a Bitcoin-only hardware wallet designed for secure cold storage. It features a secure element for protecting private keys, a MicroSD slot for PSBT workflows, and operates completely offline using MicroSD or USB. Users can verify receive addresses directly on the device, and all critical operations require confirmation on the COLDCARD's physical screen and keypad.

The device supports multi-signature setups, duress PINs, and decoy wallets for added layers of security. Its firmware is open-source, and advanced users can inspect or build it independently. It is ideal for users who prioritize full offline transaction signing, verifiable address display, and robust physical device protections.

This device is **source available.**
