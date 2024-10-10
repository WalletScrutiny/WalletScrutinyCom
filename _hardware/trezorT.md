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
65 bytes copied, 0.000384774 s, 169 kB/s
07fa8a94dd06b17cdd8a23295f9687cd861be80591e8ab912dafabf21117f264  trezor-core-2.8.1.bin.zeroed
8f7df375c5c9cf8b923c37378cc1a94992e03836e3ec0df0ab0271340d431903  build/core-T/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.000330938 s, 196 kB/s
07fa8a94dd06b17cdd8a23295f9687cd861be80591e8ab912dafabf21117f264  trezor-core-2.8.1-bitcoinonly.bin.zeroed
e8666de29b3eb0a75fd1673875f5fbc6388147c23d1828f09fd4033b16fb1dfa  build/core-T-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  trezor-core-2.8.1.bin
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  trezor-core-2.8.1-bitcoinonly.bin

```

There are hash discrepancies between the non-signature parts of the compiled binary (8f7df3) and the downloaded version (07fa8a) for the standard version.
This is also observed between the hashes for the bitcoin-only version.
Strangely, the hashes of signed firmware for trezor-core-2.8.1.bin and trezor-core-2.8.1-bitcoinonly.bin are similar. 
We will investigate further.

