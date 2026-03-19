---
title: Trezor Safe 5
appId: trezorSafe5
authors:
- danny
- keraliss
released: 2024-06-14
discontinued: 
updated: 2026-03-17
version: 2.11.0
binaries: https://data.trezor.io/firmware/t3t1/trezor-t3t1-2.8.3.bin
dimensions:
- 66
- 40
- 8
weight: 23
provider: Trezor
providerWebsite: 
website: https://trezor.io
shop: https://trezor.io/trezor-safe-5
country: CZ
price: 169USD
repository: https://github.com/trezor/data/tree/master/firmware/t3t1
icon: trezorSafe5.png
bugbounty: https://trezor.io/learn/a/how-to-report-an-issue
meta: ok
verdict: sourceavailable
appHashes:
- 4f6369f2932f017d8960580aec0907b73ebb4feff43fc5c6f697ddebb3a23628
- 14b457d32f979b51482c350d0e33a3c372511010c84810b01031d752135838de
- 01fdef4c3cfbe78d203953c65604d8d406373a0d3b26bbb8f7d3cf2250397777
- 6d932e5200927b6eeebc9b8700effde957a9880774944bcc028b0cbac85e7f6a
- 9e1bc9773194df462a2350108da1cc4f5a70149b93affcb363c5b96c14b30a4d
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
    - trezor-t3t1-*-bitcoinonly.bin
    universal:
    - trezor-t3t1-*.bin
features: 

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/1EVzbNPn6bc?si=vv88okupfrEmtEff" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# [Trezor Safe 5 Official Online Documentation](https://trezor.io/learn/a/get-started-with-the-trezor-safe-5)
# [Trezor Safe 5 Reproducible Build Documentation](https://github.com/trezor/trezor-firmware/blob/d5f2ea48feebeb4c8f7abc98392f64f23b8d9dba/docs/common/reproducible-build.md) (Soon to be merged)

Built on the technology behind the {% include walletLink.html wallet='hardware/trezorSafe3' verdict='true' %}, the trezor Safe 5 features the following: 

- 39 mm touchscreen (240 x 240 pixels)
- NDA-free EAL 6+ Secure Element
- 12-, 20-, 24- wallet backup
- Advanced Multi-share Backup
- Haptic feedback
- Shipped without firmware (can be installed through USB-C using Trezor Suite)  
- Pin and passphrase protection
- Bitcoin-only and Universal (1000 coins and tokens) variants

{% include featureEvidence.html feature="selfBuild" comment="Not tagged selfBuild: unlike Trezor One/T, the Safe 5 hardware designs are not published in the trezor-hardware repo (which only contains One and T). The EAL 6+ Secure Element is the TROPIC01 chip by Tropic Square — open architecture and auditable, but sold to companies rather than individual builders, and no self-build instructions for the Safe 5 PCB exist." %}

An issue has been opened at [https://github.com/trezor/trezor-firmware/issues/4586](https://github.com/trezor/trezor-firmware/issues/4586)
