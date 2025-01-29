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
updated: 2025-01-08
version: 2.8.7
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
- 14b457d32f979b51482c350d0e33a3c372511010c84810b01031d752135838de
- 6ad8f49748de258197e0a4ee73cb71bf6e78ac209bda892907dbef763bb5cb1c
date: 2025-01-18
signer: 
reviewArchive:
- date: 2024-10-10
  version: 2.7.0
  appHash: 5289e1d5476c5097918c1d145d5a2e0a708da11d4cae13771012b8f792941b46
  gitRevision: 4458285efc54bd9bc76d74f88e696201a4af4a93
  verdict: reproducible
- date: 2024-04-10
  version: 2.7.0
  appHash: cc4ca65bd7ce6e3af6ddab58346b08fc3331458cd93abc34e8cc1c76532e1f2c
  gitRevision: d32b04cd41664f0cf706661b00871e6b48598db3
  verdict: reproducible
- date: 2024-04-01
  version: 2.6.4
  appHash: 05db9550eb91093822fad11254be889f6f300c4ab3c4c7394112bca195cb4383
  gitRevision: 4161cc3ff1bce108b0a640df94af315fd435145e
  verdict: reproducible
- date: 2023-05-25
  version: 2.6.0
  appHash: e5560b40a9fc470fc9f9552baed65241cb0496c5896c6336e2422b50ddf7cada
  gitRevision: 846f3c3185e087139606f352dcdedf2efbec3c13
  verdict: reproducible
- date: 2022-12-05
  version: 2.5.3
  appHash: 8d742ff5498e3f903125aa6fca44bffeea27e42cc37297aa03f6c1fca51b6004
  gitRevision: 4161cc3ff1bce108b0a640df94af315fd435145e
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
$ ./scripts/test/hardware/trezorT.sh 2.8.7
...
Built from commit 9843afc74a563df546ea78530f642d6969d8f5b7

Fingerprints:
4f6369f2932f017d8960580aec0907b73ebb4feff43fc5c6f697ddebb3a23628 build/core-R/bootloader/bootloader.bin
554c6586df79e1281dd377bfb99d7b2594dbac66d749837c6a78b9c5e0751098 build/core-R/firmware/firmware.bin
4f6369f2932f017d8960580aec0907b73ebb4feff43fc5c6f697ddebb3a23628 build/core-R-bitcoinonly/bootloader/bootloader.bin
6381f8a373f9f91a3cf4000a762b8dbf553d11a4a6d433c8863b2fa9eecfd9f1 build/core-R-bitcoinonly/firmware/firmware.bin
14b457d32f979b51482c350d0e33a3c372511010c84810b01031d752135838de build/core-T/bootloader/bootloader.bin
7f7bae53913c3a339f22adddb16db70b11bcf908af1c7a5986bae09af9d4ab62 build/core-T/firmware/firmware.bin
14b457d32f979b51482c350d0e33a3c372511010c84810b01031d752135838de build/core-T-bitcoinonly/bootloader/bootloader.bin
7bdf5de0c00c5d15c06d526a5b0d22cfd8343eb3e7aa01ee3c4ed60dd063bbf1 build/core-T-bitcoinonly/firmware/firmware.bin
01fdef4c3cfbe78d203953c65604d8d406373a0d3b26bbb8f7d3cf2250397777 build/core-T3T1/bootloader/bootloader.bin
be15ee1f4b7891dc965512455f8d17067ff54a7047e28ed06cec8d56529ab2ef build/core-T3T1/firmware/firmware.bin
01fdef4c3cfbe78d203953c65604d8d406373a0d3b26bbb8f7d3cf2250397777 build/core-T3T1-bitcoinonly/bootloader/bootloader.bin
2f58de2b7c2c29b6a2f14909ad0941e4aa9dd6d3e1416ab66c512a743b5385a9 build/core-T3T1-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 0.000166059 s, 391 kB/s
6ad8f49748de258197e0a4ee73cb71bf6e78ac209bda892907dbef763bb5cb1c  trezor-core-2.8.7.bin.zeroed
6ad8f49748de258197e0a4ee73cb71bf6e78ac209bda892907dbef763bb5cb1c  build/core-T/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.000157514 s, 413 kB/s
e051fea146bc13fdc7590a9b15152e6202eaf5287fc8405c99b3a2e4d3d347ce  trezor-core-2.8.7-bitcoinonly.bin.zeroed
e051fea146bc13fdc7590a9b15152e6202eaf5287fc8405c99b3a2e4d3d347ce  build/core-T-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
29b0cb1877188e0875b8bcf8f36818b63cd7c590c56b140daddb4134e2a82242  trezor-core-2.8.7.bin
d887ce2f9a92c9605ff78fe7440d7b92b51d4989a291b00f3f5c4ca40ca1ceda  trezor-core-2.8.7-bitcoinonly.bin
```

With the correct modifications to the [TrezorT.sh script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/1d8681a3f2a03ef61c79fd08112425e3fcb2e8a9/scripts/test/hardware/trezorT.sh), we were able to determine that the hash `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` is of an empty file. This meant that the binaries weren't being downloaded. We verified the download url manually and found the correct url. 

This resulted in the script properly building and outputting the desired results. 

1. The hashes of the non-signature parts for standard, **match**. (6ad8f49748de258197e0a4ee73cb71bf6e78ac209bda892907dbef763bb5cb1c)
2. The hashes of the non-signature parts for the downloaded and compiled binary, also **match**. (6ad8f49748de258197e0a4ee73cb71bf6e78ac209bda892907dbef763bb5cb1c)
3. As expected, the signed firmware for the downloaded (standard) binary do not match with its bitcoin-only counterpart. This is ideal.

We have reached the conclusion that version **2.8.7** is **reproducible.**
