---
title: Trezor Model T
appId: trezorT
authors:
- leo
released: 2018-03-01
discontinued: 
updated: 2022-11-17
version: 2.5.3
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
date: 2022-12-05
signer: 
reviewArchive:
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

---

With our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/trezorT.sh)
this is the result:

```
$ ./scripts/test/hardware/trezorT.sh 2.5.3
...
Fingerprints:
4f57dca1abc1a60d82c4fef7c96e86d784fc7a1e5e3da724dd2ae4d14c6350bf build/core/firmware/firmware.bin
c094c84ba958129885fa725ee6ddb781b580fd2c7851e83aef9054ba4a10526c build/core-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 0.000124131 s, 524 kB/s
07e9053be42873b8fc094205607d2c5624a15c84fdf323bc783217d3a7b7fc24  trezor-2.5.3.bin.zeroed
07e9053be42873b8fc094205607d2c5624a15c84fdf323bc783217d3a7b7fc24  build/core/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.000112391 s, 578 kB/s
b69f1b69819a281f76553e39fed4394f2a5c56eb33f95767b775800282a19f6c  trezor-2.5.3-bitcoinonly.bin.zeroed
b69f1b69819a281f76553e39fed4394f2a5c56eb33f95767b775800282a19f6c  build/core-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
8d742ff5498e3f903125aa6fca44bffeea27e42cc37297aa03f6c1fca51b6004  trezor-2.5.3.bin
93f276caa34e3bd599367089f0274b6691e0fdc00697c252be29b1e3d49e8b6b  trezor-2.5.3-bitcoinonly.bin
```

This looks good. The compiled versions only differ in 64 bytes - the signature -
from the downloaded version. This firmware is **reproducible**.
