---
title: Trezor One
appId: trezorOne
authors:
- leo
released: 2014-07-29
discontinued: 
updated: 2022-05-18
version: 1.11.1
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
meta: outdated
verdict: reproducible
date: 2022-08-07
signer: 
reviewArchive:
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

---

For the latest firmware version, we try the same as last time, wrapped
into [this script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/trezorOne.sh):

```
$ ./scripts/test/hardware/trezorOne.sh 1.10.5
...
Fingerprints:
b589b3a7d605b83094078f775f66d415a27d090abd3a31ccae7912a9d712a684 build/core/firmware/firmware.bin
7b432fe4e5d8fa4f00fe088ef449d63b4bc217c35c49f4d893508dc718aed220 build/core-bitcoinonly/firmware/firmware.bin
3e473d85eadbe6306deadd77f46547e076596507835e9cf6aafbb2ebeec2601b build/legacy/firmware/firmware.bin
61c418684cba2c9dc3db8f752a755feab2dea98df618cce6bf72750ae2ca6e21 build/legacy-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled:
869d959bc3a6d9facdfb1993249cfd21d7657bc08c2b4e370fdac52057f8366c  -
869d959bc3a6d9facdfb1993249cfd21d7657bc08c2b4e370fdac52057f8366c  -

Hash of the signed firmware:
dfac7b21f88d3077ebba0928adb8c75040498379a77d5969136a15d1aa7978a9  trezor-1.10.5.bin
```

That is a match. This firmware is **reproducible**.
