---
title: Trezor One
appId: trezorOne
authors:
- leo
released: 2014-07-29
discontinued: 
updated: 2022-08-17
version: 1.11.2
binaries: https://github.com/trezor/webwallet-data/tree/master/firmware/1
dimensions:
- 60
- 30
- 6
weight: 12
provider: 
providerWebsite: 
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
date: 2022-12-05
signer: 
reviewArchive:
- date: 2022-08-07
  version: 1.10.5
  appHash: dfac7b21f88d3077ebba0928adb8c75040498379a77d5969136a15d1aa7978a9
  gitRevision: c27741da56057bd7e525048b7b4f80d5984eb5f2
  verdict: reproducible
- date: 2022-01-10
  version: 1.10.4
  appHash: 8ead447cab0ee12af244edc7a18125e71df133730d9c67d627557804bafc57ee
  gitRevision: 49009f7ec76dd42f6117772298d5150bbbe4d3c5
  verdict: reproducible
- date: 2021-10-05
  version: 1.10.3
  appHash: 50715ae29939575b5577725ae4062ab12514f85ac1bb761e881cc6876ff32055
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: 2021-08-23
  version: 1.10.2
  appHash: 7ed716b2813f8b81983700e6d286f6ff17a17e830cb85954fe31e9a7ec9388b8
  gitRevision: 6dc6f1b5fb7a04bda310151b15e7d46de1daf49d
  verdict: reproducible
- date: 2021-07-17
  version: 1.9.4
  appHash: c406a36aa83932f656caa5246e8a4383f426e4f970b11d86cad76ab95778a6ff
  gitRevision: 334cec64b40fc04f8ac0597f27b23e1635136fc1
  verdict: reproducible
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
features: 

---

With our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/trezorOne.sh)
this is the result:

```
$ ./scripts/test/hardware/trezorOne.sh 1.11.2
...
Fingerprints:
8f81bea82fdf0d83450cb7299c37b046846b42bd6875becc57de44e8e05e95a4 build/legacy/firmware/firmware.bin
dfae2000d1a8a7c5600dae9b1f53910311e35ce01c771702c4eafb5221ed3fde build/legacy-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled standard:
9996665928ff72e5575412cc6cf2ba825cb3db459cb38caf4922f78b64ce34f9  -
9996665928ff72e5575412cc6cf2ba825cb3db459cb38caf4922f78b64ce34f9  -

Hash of non-signature parts downloaded/compiled bitcoinonly:
8fb3da9003abbe5d1409f24978f6b4abb0de358f61f2c259d0486a1e77c1169c  -
8fb3da9003abbe5d1409f24978f6b4abb0de358f61f2c259d0486a1e77c1169c  -

Hash of the signed firmware:
948098e56cf02f1d7b0660d44f02451dfd81b3114af87c962e7c6012f58853bb  trezor-1.11.2.bin
9f1544dd77483e9d39d1430325ae27574bf3604a463d5a59a03396cfc6cc5ca7  trezor-1.11.2-bitcoinonly.bin
```

That is a match. This firmware is **reproducible** for both the standard and the
bitcoinonly version.
