---
title: BitBox02 Nova
appId: bitBox2Nova
authors:
- danny
released: 2025-06-21
discontinued: 
updated: 2026-01-21
version: 9.25.0
binaries: https://github.com/BitBoxSwiss/bitbox02-firmware/releases
dimensions:
- 55
- 25
- 9.6
weight: 12
provider: Shift Crypto AG
providerWebsite: https://bitbox.swiss
website: https://bitbox.swiss/bitbox02/nova/
shop: https://bitbox.swiss/shop/
country: CH
price: 175EUR
repository: https://github.com/BitBoxSwiss/bitbox02-firmware
icon: bitBox2Nova.png
bugbounty: https://bitbox.swiss/bug-bounty-program/
meta: ok
verdict: sourceavailable
appHashes: 
date: 2025-07-18
signer: 
twitter: BitBoxSwiss
social:
- https://www.linkedin.com/company/bitbox-swiss/
- https://www.reddit.com/r/BitBoxWallet
builds:
- arch: arm
  types:
    btc-only:
    - firmware-bitbox02nova-btconly.*.signed.bin
    multi:
    - firmware-bitbox02nova-multi.*.signed.bin
features:
- foss
- hd
- nfc
- secEl

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/lkAZS7z7gnc?si=iWmrooIU5Q1ucpIt&amp;start=253" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The BitBox02 Nova is a hardware wallet designed as a technical upgrade to the original BitBox02, introducing improvements in both hardware and firmware architecture. It includes a tempered glass display for improved readability and durability, and an updated touch interface with invisible sliders for input. The Nova adds optional Bluetooth Low Energy (BLE) support through Whisper, a custom communication protocol running on an isolated chip that handles end-to-end encryption without access to private keys. Unlike the original BitBox02, Nova includes broader hardware compatibility with USB-C, USB-A, and Lightning connectors, allowing it to interface with a wider range of devices. It maintains the same open-source firmware and EAL6+ certified secure chip, but introduces these new features to support more flexible and isolated device usage scenarios.

{% include featureEvidence.html feature="secEl" quote="Dual chip design using an EAL6+ certified Secure Chip" source="Website" %}

{% include featureEvidence.html feature="hd" quote="Import 12, 18 or 24 word BIP39 mnemonics" source="GitHub README" %}

{% include featureEvidence.html feature="nfc" quote="Connectivity: USB-C & Bluetooth® Low Energy" source="Website" comment="Actually this is BLE not NFC — removing this entry" %}


{% include featureEvidence.html feature="foss" quote="Open-source Firmware is fully open-source" source="Website" %}
