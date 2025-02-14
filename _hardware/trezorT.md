---
title: Trezor Model T
appId: trezorT
authors:
- leo
- Mohammad
- danny
released: '2018-03-01'
discontinued: 
updated: '2024-08-04'
version: '2.8.1'
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
appHashes:
- 2e4ad54edac5e0a13514c84603e053167142babf5f4d9ed4ec0e72ca748e0051
- 8f7df375c5c9cf8b923c37378cc1a94992e03836e3ec0df0ab0271340d431903
date: '2024-10-10'
signer: 
reviewArchive:
- date: '2024-04-10'
  version: '2.7.0'
  appHashes:
  - cc4ca65bd7ce6e3af6ddab58346b08fc3331458cd93abc34e8cc1c76532e1f2c
  gitRevision: d32b04cd41664f0cf706661b00871e6b48598db3
  verdict: reproducible
- date: '2024-04-01'
  version: '2.6.4'
  appHashes:
  - 05db9550eb91093822fad11254be889f6f300c4ab3c4c7394112bca195cb4383
  gitRevision: 4161cc3ff1bce108b0a640df94af315fd435145e
  verdict: reproducible
- date: '2023-05-25'
  version: '2.6.0'
  appHashes:
  - e5560b40a9fc470fc9f9552baed65241cb0496c5896c6336e2422b50ddf7cada
  gitRevision: 846f3c3185e087139606f352dcdedf2efbec3c13
  verdict: reproducible
- date: '2022-12-05'
  version: '2.5.3'
  appHashes:
  - 8d742ff5498e3f903125aa6fca44bffeea27e42cc37297aa03f6c1fca51b6004
  gitRevision: 4161cc3ff1bce108b0a640df94af315fd435145e
  verdict: reproducible
- date: '2022-08-07'
  version: '2.4.3'
  appHashes:
  - 4279e8fbf0bf85b6412c1ab1e1fe16844b42d83d2d8a45aaf6cf68dfb7afabbc
  gitRevision: c27741da56057bd7e525048b7b4f80d5984eb5f2
  verdict: reproducible
- date: '2021-10-16'
  version: '2.4.2'
  appHashes:
  - 1fa3d062251685dc8bebd0b15ed622441ca3778281a652d601548ed29287e29d
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: '2021-07-18'
  version: '2.3.6'
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

There was a change in the directory name containing the binaries so we've had to modify the script itself.
With our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/trezorT.sh)
this is the result:

```
$ ./scripts/test/hardware/trezorT.sh 2.8.1
...
Fingerprints:
394a814e7ad10ae77bd73df485e9eb4234084973031ca25d864dd811f431bf0b build/core-R/bootloader/bootloader.bin
cc4ec6f5904ec0246e83efb6e93aad4365d4269708c6699a8d49e29fdc281104 build/core-R/firmware/firmware.bin
394a814e7ad10ae77bd73df485e9eb4234084973031ca25d864dd811f431bf0b build/core-R-bitcoinonly/bootloader/bootloader.bin
9431a545a8ee2f6b222a23f7ccb910ca69b3e86a253d71719cadd8afb0b8ae2b build/core-R-bitcoinonly/firmware/firmware.bin
2e4ad54edac5e0a13514c84603e053167142babf5f4d9ed4ec0e72ca748e0051 build/core-T/bootloader/bootloader.bin
d3af84a212d32785449ca6575e3cf2a641920b353a82dec9f059083ea5d4b149 build/core-T/firmware/firmware.bin
2e4ad54edac5e0a13514c84603e053167142babf5f4d9ed4ec0e72ca748e0051 build/core-T-bitcoinonly/bootloader/bootloader.bin
38ab127fcf4263a18a3b07593301fdd2c6a1a96360b62c131adb849b5d18fae3 build/core-T-bitcoinonly/firmware/firmware.bin
6ac53b9c78ff620508441714ae8ab07e18129f64c3c001ccd1239ad130bfd46f build/core-T3T1/bootloader/bootloader.bin
6a064df4a928e1264d682a34cc014fc9272f312e0f8a8270ff88d6f1408fe68b build/core-T3T1/firmware/firmware.bin
6ac53b9c78ff620508441714ae8ab07e18129f64c3c001ccd1239ad130bfd46f build/core-T3T1-bitcoinonly/bootloader/bootloader.bin
6b17de0c89c9a7876687d6b9c44673f4aca7f8819237a755090848a3829bc36b build/core-T3T1-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 0.000144499 s, 450 kB/s
8f7df375c5c9cf8b923c37378cc1a94992e03836e3ec0df0ab0271340d431903  trezor-core-2.8.1.bin.zeroed
8f7df375c5c9cf8b923c37378cc1a94992e03836e3ec0df0ab0271340d431903  build/core-T/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.000260148 s, 250 kB/s
e8666de29b3eb0a75fd1673875f5fbc6388147c23d1828f09fd4033b16fb1dfa  trezor-core-2.8.1-bitcoinonly.bin.zeroed
e8666de29b3eb0a75fd1673875f5fbc6388147c23d1828f09fd4033b16fb1dfa  build/core-T-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
5289e1d5476c5097918c1d145d5a2e0a708da11d4cae13771012b8f792941b46  trezor-core-2.8.1.bin
95d4e96c77525998e4d0c9a234e2c808e275ef26505e45cbe503465e69c606c4  trezor-core-2.8.1-bitcoinonly.bin
```

With the correct modifications to the [TrezorT.sh script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/1d8681a3f2a03ef61c79fd08112425e3fcb2e8a9/scripts/test/hardware/trezorT.sh), we were able to determine that the hash `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` is of an empty file. This meant that the binaries weren't being downloaded. We verified the download url manually and found the correct url. 

This resulted in the script properly building and outputting the desired results. 

1. The hashes of the non-signature parts for standard, **match**. (8f7df375c5c9cf8b923c37378cc1a94992e03836e3ec0df0ab0271340d431903)
2. The hashes of the non-signature parts for the downloaded and compiled binary, also **match**. (8f7df375c5c9cf8b923c37378cc1a94992e03836e3ec0df0ab0271340d431903)
3. As expected, the signed firmware for the downloaded (standard) binary do not match with its bitcoin-only counterpart. This is ideal.

We have reached the conclusion that version **2.8.1** is **reproducible.**
