---
title: "Trezor One"
appId: trezorOne
authors:
- leo
released: 2014-07-29
discontinued: # date
updated: 2021-12-07
version: 1.10.4
binaries: https://github.com/trezor/webwallet-data/tree/master/firmware/1
dimensions: [60, 30, 6]
weight: 12
website: https://trezor.io
shop: https://shop.trezor.io/product/trezor-one-black
country: CZ
price: 49EUR
repository: https://github.com/trezor/trezor-firmware
issue: https://github.com/trezor/trezor-firmware/issues/1713
icon: trezorOne.png
bugbounty: https://trezor.io/security
meta: ok
verdict: reproducible
date: 2022-01-10
signer: 
reviewArchive:
- date: 2021-10-05
  version: "1.10.3"
  appHash: 50715ae29939575b5577725ae4062ab12514f85ac1bb761e881cc6876ff32055
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: 2021-08-23
  version: "1.10.2"
  appHash: 7ed716b2813f8b81983700e6d286f6ff17a17e830cb85954fe31e9a7ec9388b8
  gitRevision: 6dc6f1b5fb7a04bda310151b15e7d46de1daf49d
  verdict: reproducible
- date: 2021-07-17
  version: "1.9.4"
  appHash: c406a36aa83932f656caa5246e8a4383f426e4f970b11d86cad76ab95778a6ff
  gitRevision: 334cec64b40fc04f8ac0597f27b23e1635136fc1
  verdict: reproducible

providerTwitter: trezor
providerLinkedIn: 
providerFacebook: trezor.io
providerReddit: TREZOR
---


For the latest firmware version, we try the same as last time, wrapped
into [this script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/trezorOne.sh):

```
$ ./scripts/test/hardware/trezorOne.sh 1.10.4
...
Fingerprints:
a07f69d8d2065006a79c6b5636bd046496dbcb3820b41f1d604d8a4605ca4056 build/core/firmware/firmware.bin
1744efccabd479526392b281b7e0fc7aa2b4ecb454007dff7ca8c1f8171fad90 build/core-bitcoinonly/firmware/firmware.bin
3eaf589c54180dce1f8f3726b02d5384de356118bb710519e6137bcb32f52b4c build/legacy/firmware/firmware.bin
21542bba6cdc419460f87e6edbac3af0a19c6a51da46223bfdf7dc7350950e63 build/legacy-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled:
9b7536c467c1f172247c3ef71279b98148e275d3c084e0dfb3045379aa642fa9  -
9b7536c467c1f172247c3ef71279b98148e275d3c084e0dfb3045379aa642fa9  -

Hash of the signed firmware:
8ead447cab0ee12af244edc7a18125e71df133730d9c67d627557804bafc57ee  trezor-1.10.4.bin
```

That is a match. This firmware is **reproducible**.
