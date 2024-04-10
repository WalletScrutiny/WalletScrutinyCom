---
title: Trezor Model T
appId: trezorT
authors:
- leo
- Mohammad
- danny
released: 2018-03-01
discontinued: 
updated: 2024-03-20
version: 2.7.0
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
verdict: reproducible
date: 2024-04-10
signer: 
reviewArchive:
- date: 2024-04-01
  version: 2.6.4
  appHash: 05db9550eb91093822fad11254be889f6f300c4ab3c4c7394112bca195cb4383
  gitRevision: bc44ed095c19dc354a3537bd612050c6fa8c5c47
  verdict: reproducible
- date: 2023-05-25
  version: 2.6.0
  appHash: e5560b40a9fc470fc9f9552baed65241cb0496c5896c6336e2422b50ddf7cada
  gitRevision: 846f3c3185e087139606f352dcdedf2efbec3c13
  verdict: reproducible
- date: 2022-12-05
  version: 2.5.3
  appHash: 8d742ff5498e3f903125aa6fca44bffeea27e42cc37297aa03f6c1fca51b6004
  gitRevision: 2f03ace311584988d5aeab58fd1acf24ef54711a
  verdict: reproducible
- date: 2022-08-07
  version: 2.4.3
  appHash: 4279e8fbf0bf85b6412c1ab1e1fe16844b42d83d2d8a45aaf6cf68dfb7afabbc
  gitRevision: c27741da56057bd7e525048b7b4f80d5984eb5f2
  verdict: reproducible
- date: 2021-10-16
  version: 2.4.2
  appHash: 1fa3d062251685dc8bebd0b15ed622441ca3778281a652d601548ed29287e29d
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: 2021-07-18
  version: 2.3.6
  appHash: 0efa3ba6135caea7693d145d60441eeb46283fe0b8b1fd59a04af33a638ad237
  gitRevision: 3c395a639e29e6fa51468e559fc1e88d6b9f0516
  verdict: reproducible
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
features: 

---

With our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/trezorT.sh)
this is the result:

```
$ ./scripts/test/hardware/trezorT.sh 2.7.0
...
Fingerprints:
b15ea2aeebc212d86490ab5e95c68982c63075c36e779f811f28d8c03f841feb build/core-R/bootloader/bootloader.bin
522eb5db073c0f039f7164360668e75a43399d0b4e40edfd06f77f4401cd98aa build/core-R/firmware/firmware.bin
b15ea2aeebc212d86490ab5e95c68982c63075c36e779f811f28d8c03f841feb build/core-R-bitcoinonly/bootloader/bootloader.bin
bb91489a4790b3668e2f5d574a729a0f43009510550fecb5e04c0937d355b2cf build/core-R-bitcoinonly/firmware/firmware.bin
d37c4ae71b31e63ba46113eaea4a1465409e5b6605fe800e8f43296c167e79be build/core-T/bootloader/bootloader.bin
53a645218792e413ad06c27320b7d1adc944b690ce831301bbf11c30352d3278 build/core-T/firmware/firmware.bin
d37c4ae71b31e63ba46113eaea4a1465409e5b6605fe800e8f43296c167e79be build/core-T-bitcoinonly/bootloader/bootloader.bin
c94f07150a6f0bb2862d4c31c6059862aab14f0073dea581118eef51a983bc30 build/core-T-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 0.00046644 s, 139 kB/s
d3b92f65af4dfebb69cfc385f8f13602664b7745b76fa5da58d0dca070c71d57  trezor-2.7.0.bin.zeroed
d3b92f65af4dfebb69cfc385f8f13602664b7745b76fa5da58d0dca070c71d57  build/core-T/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.000288168 s, 226 kB/s
f4d780d27b2912b79c73629dfae423c9e636ecb830b0af2562a3066a2373f631  trezor-2.7.0-bitcoinonly.bin.zeroed
f4d780d27b2912b79c73629dfae423c9e636ecb830b0af2562a3066a2373f631  build/core-T-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
cc4ca65bd7ce6e3af6ddab58346b08fc3331458cd93abc34e8cc1c76532e1f2c  trezor-2.7.0.bin
0ffb46e9df4f69d4738dd47b5d735b88edd6facfa68ce119c7614e7e8357a40e  trezor-2.7.0-bitcoinonly.bin
```

This looks good. The compiled versions only differ in 65 bytes - the signature -
from the downloaded version. This firmware is **reproducible**.
