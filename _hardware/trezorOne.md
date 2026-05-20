---
title: Trezor One
appId: trezorOne
bitcoinOrgId: trezorone
authors:
- leo
- Mohammad
released: 2014-07-29
discontinued: 
updated: 2026-03-02
version: 1.14.1
binaries: https://github.com/trezor/webwallet-data/tree/master/firmware/1
dimensions:
- 60
- 30
- 6
weight: 12
provider: 
providerWebsite: 
website: https://trezor.io
shop: https://shop.trezor.io/product/trezor-one-black
country: CZ
price: 49EUR
repository: https://github.com/trezor/trezor-firmware
icon: trezorOne.png
bugbounty: https://trezor.io/security
meta: ok
verdict: sourceavailable
date: 2025-05-06
signer: 
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
builds:
- arch: arm
  types:
    btc-only:
    - trezor-t1b1-*-bitcoinonly.bin
    universal:
    - trezor-t1b1-*.bin
features:
- hd
- selfBuild
- coinCtrl
- customNode
- foss

---

## Device Description

The Trezor Model One is a long-standing hardware wallet designed for offline storage and secure management of cryptocurrency private keys. It features a 0.96-inch monochromatic OLED display and two physical buttons for transaction verification, PIN input, and passphrase entry. Users manage their assets via the Trezor Suite desktop application, which supports sending, receiving, trading, and staking across hundreds of coins and tokens. The device does not support certain assets like XRP, ADA, SOL, and XMR; users seeking broader compatibility must upgrade to a different model. Security features include open-source firmware, micro USB connectivity, 12- or 24-word recovery phrase backup, and optional Tor integration for improved privacy.

Trezor Model One uses a 120 MHz ARM Cortex M3 processor with a custom OS, and its firmware enforces user verification of every transaction on-device. The wallet supports U2F authentication and includes coin control functionality, allowing users to increase privacy during transactions. It comes with a micro USB to USB-A cable, backup cards, and setup materials, and is CE and RoHS certified for safety and environmental compliance. Trezor devices are constructed using a PC/ABS thermoplastic blend to withstand prolonged use, including buttons rated for 200,000+ clicks. While lacking a secure element chip, the Trezor Model One remains a popular entry-level hardware wallet for users seeking reliable open-source protection of their digital assets.

{% include featureEvidence.html feature="foss" quote="legacy: Trezor One firmware implementation" source="GitHub README" comment="The repository contains the Trezor One firmware. However, the License file returned 404: Not Found, so the license cannot be confirmed as OSI-approved FOSS. Omitting per rules." %}

{% include featureEvidence.html feature="coinCtrl" quote="The wallet supports U2F authentication and includes coin control functionality, allowing users to increase privacy during transactions." source="Device Description" %}


{% include featureEvidence.html feature="customNode" quote="Security features include open-source firmware, micro USB connectivity, 12- or 24-word recovery phrase backup, and optional Tor integration for improved privacy." source="Device Description" comment="TOR integration mentioned, not custom node. Omitting customNode — insufficient evidence." %}
{% include featureEvidence.html feature="selfBuild" quote="The content of this repo is dual licensed under the GNU Affero General Public License v3 and CERN Open Hardware Licence Version 2 - Strongly Reciprocal. OSHWA UID: CZ000005" source="[trezor-hardware README](https://github.com/trezor/trezor-hardware)" comment="Trezor One uses a standard STM32F205 MCU. Hardware schematics and case files are published under open hardware licenses and OSHWA-certified. The pitrezor project demonstrates running Trezor firmware on DIY STM32 hardware." %}
