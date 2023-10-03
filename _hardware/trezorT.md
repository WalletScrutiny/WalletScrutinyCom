---
title: Trezor Model T
appId: trezorT
authors:
- leo
- Mohammad
released: 2018-03-01
discontinued: 
updated: 2023-04-19
version: 2.6.0
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
date: 2023-05-25
signer: 
reviewArchive:
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
$ ./scripts/test/hardware/trezorT.sh 2.6.0
...
Fingerprints:
1b4845b2d2869eece07c3b287ad0acf036f7ba61efc39acb2cc01ed45490d2c6 build/core/bootloader/bootloader.bin
050526db604b9acceef2a5a8561bc99ecbe337909283ebb927b556d8e9b13872 build/core/firmware/firmware.bin
1b4845b2d2869eece07c3b287ad0acf036f7ba61efc39acb2cc01ed45490d2c6 build/core-bitcoinonly/bootloader/bootloader.bin
54f084dab4be1e64dc2cb970a6de87969407e4d6c48d79acdcf5d374ec0f29d6 build/core-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 0.00025086 s, 259 kB/s
c33e336869964cfb1ef193195894e8b6667955b4ea3044558c380b1787168e38  trezor-2.6.0.bin.zeroed
c33e336869964cfb1ef193195894e8b6667955b4ea3044558c380b1787168e38  build/core/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.000205475 s, 316 kB/s
c0b7696ce45ac9fe593eb9af1eb561f66cdf8be4d6a6bea6e538e252843e8a2f  trezor-2.6.0-bitcoinonly.bin.zeroed
c0b7696ce45ac9fe593eb9af1eb561f66cdf8be4d6a6bea6e538e252843e8a2f  build/core-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
e5560b40a9fc470fc9f9552baed65241cb0496c5896c6336e2422b50ddf7cada  trezor-2.6.0.bin
c6fe574b2348beb45abb62d38bbf09b032a5082900667b6892218903aadf856f  trezor-2.6.0-bitcoinonly.bin
```

This looks good. The compiled versions only differ in 64 bytes - the signature -
from the downloaded version. This firmware is **reproducible**.
