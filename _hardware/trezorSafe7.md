---
title: Trezor Safe 7
appId: trezorSafe7
authors:
- danny
released: 2025-10-14
discontinued: 
updated: 2025-10-14
version: 2.9.3.0
binaries: 
dimensions:
- 75
- 45
- 8.3
weight: 45
provider: Trezor
providerWebsite: 
website: https://trezor.io
shop: https://trezor.io/trezor-safe-7
country: CZ
price: 249USD
repository: https://github.com/trezor/trezor-firmware
icon: trezorSafe7.png
bugbounty: https://trezor.io/learn/a/how-to-report-an-issue
meta: ok
verdict: sourceavailable
appHashes: 
date: 2025-10-22
signer: 
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
builds:
- arch: arm
  types:
    btc-only:
    - trezor-t3w1-*-bitcoinonly.bin
    universal:
    - trezor-t3w1-*.bin
features:
- foss
- hd
- secEl

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/EWxAc8wzfFM?si=xisORQGqpq0g3MmO&amp;start=919" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Device Description

The Trezor Safe 7 is a hardware wallet that uses the TROPIC01 secure element chip developed by TropicSquare. The chip uses either the TR01-C2P-T202 or TR01-C2P-T301 variant, both supporting User API version 1.3.0. The chip's RTL design, firmware source code, and technical documentation are publicly available at https://github.com/tropicsquare/tropic01 without NDA restrictions. The device has a 2.5-inch color touchscreen, Bluetooth connectivity, wireless charging, and implements a quantum-resistant bootloader and authentication protocol.

The device contains a 3.2V 330mAh battery with wireless charging capability. The device supports 12-, 20-, and 24-word BIP39 seed phrases and Shamir Secret Sharing (Multi-share Backup). It interfaces with Trezor Suite software for transaction management.

## Firmware Information

**Model Identifier**: T3W1

The firmware source code is available in the [trezor-firmware monorepo](https://github.com/trezor/trezor-firmware) under the T3W1 model configuration. The device has three hardware revisions (A, B, C) with revision C as the production version.

Official firmware binaries will be published at `https://github.com/trezor/data/tree/master/firmware/t3w1/` following the same pattern as other Trezor devices. As of the device's announcement (October 21, 2024), firmware binaries have not yet been released. The device is scheduled to ship on November 23, 2024.

Build configuration is located at:
- `core/site_scons/models/T3W1/` in the trezor-firmware repository
- Uses the "eckhart" UI model (same as {% include walletLink.html wallet='hardware/trezorSafe5' verdict='true' %})

The firmware follows the same reproducible build process as other Trezor Core devices (T2T1, T2B1, T3T1, T3B1).

## Official Documentation and Specifications

- [Trezor Safe 7 Product Page](https://trezor.io/trezor-safe-7)
- [Get Started with Trezor Safe 7 Guide](https://trezor.io/guides/trezor-devices/trezor-safe-7/get-started-with-the-trezor-safe-7)
- [Trezor Safe 7 Knowledge Base](https://trezor.io/guides/trezor-devices/trezor-safe-7)
- [Compare Trezor Hardware Wallets](https://trezor.io/compare)
- [What is the TROPIC01 Chip?](https://trezor.io/guides/trezor-devices/trezor-safe-7/what-is-the-tropic-01-chip)
- [Dual Secure Elements in Trezor Safe 7](https://trezor.io/guides/trezor-devices/trezor-safe-7/dual-secure-elements-in-trezor-safe-7)
- [Trezor Safe 7: Quantum-Ready Hardware Wallet](https://trezor.io/guides/trezor-devices/trezor-safe-7/the-first-quantum-ready-hardware-wallet)
- [TROPIC01 GitHub Repository](https://github.com/tropicsquare/tropic01)
- [Trezor Firmware Repository](https://github.com/trezor/trezor-firmware)

{% include featureEvidence.html feature="hd" quote="The device supports 12-, 20-, and 24-word BIP39 seed phrases and Shamir Secret Sharing (Multi-share Backup)." source="Device Description" %}

{% include featureEvidence.html feature="secEl" quote="The Trezor Safe 7 is a hardware wallet that uses the TROPIC01 secure element chip developed by TropicSquare." source="Device Description" %}


{% include featureEvidence.html feature="foss" quote="The firmware source code is available in the trezor-firmware monorepo under the T3W1 model configuration." source="Firmware Information" %}
{% include featureEvidence.html feature="selfBuild" comment="Not tagged selfBuild: hardware designs for the Safe 7 are not published (trezor-hardware repo only covers One and T). The Safe 7 uses dual secure elements including the TROPIC01 by Tropic Square — open-architecture RISC-V chip, auditable and used across multiple vendors, but not available for individual consumer purchase. No self-build instructions or open PCB designs exist for this model." source="[TROPIC01 GitHub](https://github.com/tropicsquare/tropic01), [trezor-hardware repo](https://github.com/trezor/trezor-hardware)" %}
