---
title: Trezor Model T
appId: trezorT
authors:
- leo
- Mohammad
- danny
- keraliss
released: 2018-03-01
discontinued: 
updated: 2024-08-04
version: 2.8.9
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
issue: 
icon: trezorT.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 482f6e49e61a85f8e9e9f5bafecccb313eb81efec5f795cca88c36df795e8910
- ec61dba50be195f1cbb78688a0b92fb293c23150b68f5dab3b44420a106fca17
- e5878fa067df9d1256cdcd86f10869930d85e090c39f807c23f8845472e8d995
- 16c98a0ce67a84723f053da98a02cfa79717af85bd73df52acafc6c37aeebe94
- 41264414de602fcf92c60ec8d1111f844080eaec157c4bbc9f1f29172f2afba2
date: 2025-04-01
signer: 
reviewArchive:
- date: 2024-10-10
  version: 2.8.1
  appHashes:
  - 2e4ad54edac5e0a13514c84603e053167142babf5f4d9ed4ec0e72ca748e0051
  - 8f7df375c5c9cf8b923c37378cc1a94992e03836e3ec0df0ab0271340d431903
  gitRevision: 7b6f9b1814b80b05500604ac89a1178c1c77b8e0
  verdict: reproducible
- date: 2024-04-10
  version: 2.7.0
  appHashes:
  - cc4ca65bd7ce6e3af6ddab58346b08fc3331458cd93abc34e8cc1c76532e1f2c
  gitRevision: d32b04cd41664f0cf706661b00871e6b48598db3
  verdict: reproducible
- date: 2024-04-01
  version: 2.6.4
  appHashes:
  - 05db9550eb91093822fad11254be889f6f300c4ab3c4c7394112bca195cb4383
  gitRevision: 4161cc3ff1bce108b0a640df94af315fd435145e
  verdict: reproducible
- date: 2023-05-25
  version: 2.6.0
  appHashes:
  - e5560b40a9fc470fc9f9552baed65241cb0496c5896c6336e2422b50ddf7cada
  gitRevision: 846f3c3185e087139606f352dcdedf2efbec3c13
  verdict: reproducible
- date: 2022-12-05
  version: 2.5.3
  appHashes:
  - 8d742ff5498e3f903125aa6fca44bffeea27e42cc37297aa03f6c1fca51b6004
  gitRevision: 4161cc3ff1bce108b0a640df94af315fd435145e
  verdict: reproducible
- date: 2022-08-07
  version: 2.4.3
  appHashes:
  - 4279e8fbf0bf85b6412c1ab1e1fe16844b42d83d2d8a45aaf6cf68dfb7afabbc
  gitRevision: c27741da56057bd7e525048b7b4f80d5984eb5f2
  verdict: reproducible
- date: 2021-10-16
  version: 2.4.2
  appHashes:
  - 1fa3d062251685dc8bebd0b15ed622441ca3778281a652d601548ed29287e29d
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: 2021-07-18
  version: 2.3.6
  appHashes:
  - 0efa3ba6135caea7693d145d60441eeb46283fe0b8b1fd59a04af33a638ad237
  gitRevision: 3c395a639e29e6fa51468e559fc1e88d6b9f0516
  verdict: reproducible
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
features: 

---

## Updated Review 2025-03-24

We were able to create a script for the Trezor T with the build instruction, that would automate the process.

`./scripts/test/hardware/trezorT.sh 2.8.9`

```
Built from commit fad9682201cf9289bba2adb66e6e07ed1cf78936

Fingerprints:
ec61dba50be195f1cbb78688a0b92fb293c23150b68f5dab3b44420a106fca17 build/core-T2T1/firmware/firmware.bin
e5878fa067df9d1256cdcd86f10869930d85e090c39f807c23f8845472e8d995 build/core-T2T1-bitcoinonly/firmware/firmware.bin

Comparing hashes of zeroed binaries with built firmware:
16c98a0ce67a84723f053da98a02cfa79717af85bd73df52acafc6c37aeebe94 build/core-T2T1/firmware/firmware.bin
16c98a0ce67a84723f053da98a02cfa79717af85bd73df52acafc6c37aeebe94 trezor-core-2.8.9.bin.zeroed
41264414de602fcf92c60ec8d1111f844080eaec157c4bbc9f1f29172f2afba2 build/core-T2T1-bitcoinonly/firmware/firmware.bin
41264414de602fcf92c60ec8d1111f844080eaec157c4bbc9f1f29172f2afba2 trezor-core-2.8.9-bitcoinonly.bin.zeroed
```

In the development of the Trezor T firmware version 2.8.9, we encountered a significant bootloader verification challenge:

## Bootloader Verification Update (April 2025)

The Trezor [firmware changelog](https://github.com/trezor/trezor-firmware/blob/7248bf2a484de1611b906fb7aa915f5d6394d510/core/CHANGELOG.md#L4).

Initially, we encountered discrepancies between bootloader versions when attempting to verify firmware 2.8.9. With guidance from Trezor developers, we identified that version 2.8.9 of the trezor T firmware used bootloader version 2.1.8 - and not 2.1.10 as earlier seen. We verified this in the **[releases.json](https://data.trezor.io/firmware/t2t1/releases.json)** file found on Trezor's website.

We developed an enhanced verification script that:
1. Extracts the exact bootloader version from the firmware's releases.json
2. Clones the repository twice - once for building the bootloader and once for extracting the reference bootloader
3. Utilizes Trezor's `headertool.py` utility to extract detailed fingerprint information from both bootloaders

This approach revealed that for firmware 2.8.9 (using bootloader 2.1.8), the built bootloader's hash (482f6e49e61a85f8e9e9f5bafecccb313eb81efec5f795cca88c36df795e8910) perfectly matches the reference bootloader embedded in the firmware repository. This confirms that the bootloader is indeed reproducible when built with the correct version tag.

```
Comparing bootloaders:
========================================
The fingerprint for bootloader version 2.1.8 is:
Using headertool.py we have the values:
Built Bootloader version:  2.1.8.0
Built Bootloader hash:     482f6e49e61a85f8e9e9f5bafecccb313eb81efec5f795cca88c36df795e8910
Provided Bootloader version: 2.1.8.0
Provided Bootloader hash:    482f6e49e61a85f8e9e9f5bafecccb313eb81efec5f795cca88c36df795e8910
Version MATCH: Both bootloaders have the same version
Hash MATCH: Both bootloaders have the same hash
========================================
```

**Version 2.8.9 of the {{ page.title }} is reproducible**.

{% include asciicast %}


