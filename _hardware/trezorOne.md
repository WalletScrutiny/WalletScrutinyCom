---
title: Trezor One
appId: trezorOne
authors:
- leo
- Mohammad
released: 2014-07-29
discontinued: 
updated: 2023-03-06
version: 1.12.1
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
issue: 
icon: trezorOne.png
bugbounty: https://trezor.io/security
meta: ok
verdict: sourceavailable
appHashes:
- 859dff49705fb81e83fe6d2efcf8f739f847081037aacf4f176624009a738ed8
date: 2023-05-25
signer: 
reviewArchive:
- date: 2022-12-05
  version: 1.11.2
  appHashes:
  - 948098e56cf02f1d7b0660d44f02451dfd81b3114af87c962e7c6012f58853bb
  gitRevision: fcb6c11f4f50b25bafda2706c89938daa5c8399e
  verdict: reproducible
- date: 2022-08-07
  version: 1.10.5
  appHashes:
  - dfac7b21f88d3077ebba0928adb8c75040498379a77d5969136a15d1aa7978a9
  gitRevision: c27741da56057bd7e525048b7b4f80d5984eb5f2
  verdict: reproducible
- date: 2022-01-10
  version: 1.10.4
  appHashes:
  - 8ead447cab0ee12af244edc7a18125e71df133730d9c67d627557804bafc57ee
  gitRevision: 49009f7ec76dd42f6117772298d5150bbbe4d3c5
  verdict: reproducible
- date: 2021-10-05
  version: 1.10.3
  appHashes:
  - 50715ae29939575b5577725ae4062ab12514f85ac1bb761e881cc6876ff32055
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: 2021-08-23
  version: 1.10.2
  appHashes:
  - 7ed716b2813f8b81983700e6d286f6ff17a17e830cb85954fe31e9a7ec9388b8
  gitRevision: 6dc6f1b5fb7a04bda310151b15e7d46de1daf49d
  verdict: reproducible
- date: 2021-07-17
  version: 1.9.4
  appHashes:
  - c406a36aa83932f656caa5246e8a4383f426e4f970b11d86cad76ab95778a6ff
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
$ ./scripts/test/hardware/trezorOne.sh 1.12.1
...
Fingerprints:
3c694191f5b66a65cb5bb209adbf113cb40209e644b77162ba996bb7ee8f382b build/legacy/firmware/firmware.bin
985fb6a8c87f7547fb810f6c4a8331ebf19c677445810358778eb21eca78a181 build/legacy-bitcoinonly/firmware/firmware.bin
195+0 records in
195+0 records out
195 bytes copied, 0.00046023 s, 424 kB/s
195+0 records in
195+0 records out
195 bytes copied, 0.000506005 s, 385 kB/s

Hash of non-signature parts downloaded/compiled standard:
859dff49705fb81e83fe6d2efcf8f739f847081037aacf4f176624009a738ed8  trezor-1.12.1-nosig.bin
859dff49705fb81e83fe6d2efcf8f739f847081037aacf4f176624009a738ed8  build/legacy/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
683b51fb68d0b0377f5596d6e75cc5ba2b64b88563dae2ede431031565b977fa  trezor-1.12.1-bitcoinonly-nosig.bin
683b51fb68d0b0377f5596d6e75cc5ba2b64b88563dae2ede431031565b977fa  build/legacy-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
eab18bf870d6096a2dee477a2f032dc3084a1864b6767a8f2f313a12dff2d180  trezor-1.12.1.bin
ce576268ce81d4fa7aa6a80d1c8ee01c49fdab4efaf9e0c703d899a24e168eb4  trezor-1.12.1-bitcoinonly.bin
```

That is a match. This firmware is **reproducible** for both the standard and the
bitcoinonly version.
