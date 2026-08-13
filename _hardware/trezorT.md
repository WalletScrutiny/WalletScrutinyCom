---
title: Trezor Model T
appId: trezorT
bitcoinOrgId: trezormodelt
authors:
- leo
- Mohammad
- danny
released: 2018-03-01
discontinued: 
updated: 2026-08-11
version: 2.12.4
binaries: https://github.com/trezor/webwallet-data/tree/master/firmware/2
dimensions:
- 64
- 39
- 10
weight: 22
provider: 
providerWebsite: 
website: https://trezor.io
shop: https://shop.trezor.io/product/trezor-model-t
country: CZ
price: 159EUR
repository: https://github.com/trezor/trezor-firmware
icon: trezorT.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-11
signer: 
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
builds:
- arch: arm
  types:
    btc-only:
    - trezor-t2t1-*-bitcoinonly.bin
    universal:
    - trezor-t2t1-*.bin
features:
- selfBuild
- TOR
- coinCtrl
- segwit

---

*Legacy verification [2024](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/4161cc3ff1bce108b0a640df94af315fd435145e/_hardware/trezorT.md)*

## Device Description

The Trezor Model T is a hardware wallet for securely storing and managing cryptocurrency. It features a touchscreen interface for device PIN, passphrase, and seed entry, and supports 12-word and Shamir (multi-share) backups. The device is initialized and managed via the Trezor Suite app, which enables users to send, receive, stake, and trade various supported coins. The Model T connects via USB and includes firmware verification during setup. Recovery and device reset options are available if needed.

It supports features like FIDO2-based two-factor authentication, Tor for enhanced privacy, and coin control for granular transaction management. The device also allows uploading custom 240x240 pixel wallpapers. All security-sensitive actions, such as backup creation and recovery, must be confirmed directly on the device's touchscreen.

This device is **source available**.

{% include featureEvidence.html feature="segwit" quote="The Trezor Model T is a hardware wallet for securely storing and managing cryptocurrency." source="Device Description" comment="No explicit mention of SegWit in source text — omitting" %}

{% include featureEvidence.html feature="coinCtrl" quote="coin control for granular transaction management" source="Device Description" %}


{% include featureEvidence.html feature="TOR" quote="It supports features like FIDO2-based two-factor authentication, Tor for enhanced privacy, and coin control for granular transaction management." source="Device Description" %}
{% include featureEvidence.html feature="selfBuild" quote="The content of this repo is dual licensed under the GNU Affero General Public License v3 and CERN Open Hardware Licence Version 2 - Strongly Reciprocal. OSHWA UID: CZ000005" source="[trezor-hardware README](https://github.com/trezor/trezor-hardware)" comment="Trezor Model T uses a standard STM32F429 MCU. Hardware schematics and case files (STL) are published under open hardware licenses and OSHWA-certified. The hardware repo contains case/trezor_model_t/ with 3D-printable files." %}
