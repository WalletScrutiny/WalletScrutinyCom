---
title: Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
- danny
- keraliss
released: 2021-01-01
discontinued: 
updated: 2026-04-29
version: 1.0.40
binaries: https://jadefw.blockstream.com/bin/jade/index.json
dimensions:
- 24
- 60
- 17
weight: 21
provider: Blockstream Corporation Inc.
providerWebsite: https://blockstream.com/
website: https://blockstream.com/jade/
shop: https://store.blockstream.com/products/blockstream-jade-hardware-wallet
country: CA
price: 79USD
repository: https://github.com/Blockstream/jade
icon: blockstreamjade.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-08-04
signer: 
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
- https://t.me/blockstream
- https://www.youtube.com/channel/UCZNt3fZazX9cwWcC9vjDJ4Q
builds:
- arch: arm
  types: jade
features:
- camera
- foss

---

*Legacy verification [2024](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/dd1ee7983f62697ed014508e6f7bce1f0245aacb/_hardware/blockstreamjade.md)*

Blockstream Jade (classic) is an open-source hardware wallet specifically designed for secure Bitcoin and Liquid Network key storage, featuring a color screen, physical buttons, and optional air-gapped QR-based signing for fully offline transactions. It includes a secure boot sequence and “virtual Secure Element” architecture that prevents theft of assets from a locked device. Connectivity options include USB-C, Bluetooth, and QR workflows, with a no-radiofirmware variant available for maximum air-gap integrity. Integration is supported through Blockstream App as well as popular third-party wallets such as Sparrow, Specter, Electrum, BlueWallet, and Bitcoin Core. Advanced security features include genuine-device attestation during setup, multisig support, duress PIN, SeedQR stateless signing, and custom entropy generation from onboard sensors.

{% include featureEvidence.html feature="foss" quote="The collection is subject to GPL3 but individual source components can be used under their specific licenses." source="GitHub README" %}


{% include featureEvidence.html feature="camera" quote="to run the qemu emulator with display and camera support, run: main/qemu/run_emulator.sh" source="GitHub README" %}