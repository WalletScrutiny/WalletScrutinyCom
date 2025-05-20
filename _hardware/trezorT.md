---
title: Trezor Model T
appId: trezorT
authors:
- leo
- Mohammad
- danny
released: 2018-03-01
discontinued: 
updated: 2024-08-04
version: 2.8.1
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
- 2e4ad54edac5e0a13514c84603e053167142babf5f4d9ed4ec0e72ca748e0051
- 8f7df375c5c9cf8b923c37378cc1a94992e03836e3ec0df0ab0271340d431903
date: 2024-10-10
signer: 
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
