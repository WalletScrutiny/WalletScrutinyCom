---
title: "Trezor One"
appId: trezorOne
authors:
- leo
released: 2014-07-29
discontinued: # date
updated: 2021-08-27
version: 1.10.3
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
verdict: reproducible
date: 2021-10-05
signer: 
reviewArchive:
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


For the latest firmware version `v1.10.3`, we try the same as last time, wrapped
into [this script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/trezorOne.sh):

```
$ ./scripts/test/hardware/trezorOne.sh 1.10.3
...
Fingerprints:
54ccf155510b5292bd17ed748409d0d135112e24e62eb74184639460beecb213 build/core/firmware/firmware.bin
60fee3c9775d8ccf71099f6f7d277463efd128414cfb9be45656b1a26eeb7301 build/core-bitcoinonly/firmware/firmware.bin
14438fe4727ddc3153fa3c1aff2ced8867322aa54a0eb0277800e54cda488f50 build/legacy/firmware/firmware.bin
02f112cc2dda68ed19c7dbd71780e8dc7e749c2cadd645be6398c4762a8adf0f build/legacy-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled:
513ba46603dc4bceb4a0c185bd7e8f1660c5615fd48ff8465361c817f7c215d9  -
513ba46603dc4bceb4a0c185bd7e8f1660c5615fd48ff8465361c817f7c215d9  -

Hash of the signed firmware:
50715ae29939575b5577725ae4062ab12514f85ac1bb761e881cc6876ff32055  trezor-1.10.3.bin


$ wget https://data.trezor.io/firmware/1/trezor-1.10.2.bin
$ git clone https://github.com/trezor/trezor-firmware.git
$ cd trezor-firmware/
$ git checkout legacy/v1.10.2
$ bash build-docker.sh legacy/v1.10.2
...
Fingerprints:
84bc47bb197b3ae7bfb096f03d4a528ccf6c9ef4dfee0aac4022971e4ec91d68 build/core/firmware/firmware.bin
fce4503fcadb68dc72144a562ec0a59e7c8d083e403e01bfc4c584161d79f596 build/core-bitcoinonly/firmware/firmware.bin
0d12bc0f3aaa80bfd8a6d801f6ca2ed4a08746faa293d5573edef233264dab03 build/legacy/firmware/firmware.bin
a7a022dea391d3d39ba04ce92b0a3eaf9ea2bdfcfdce955038505c821ea97cc3 build/legacy-bitcoinonly/firmware/firmware.bin
$ tail -c +1281 ../trezor-1.10.2.bin | sha256sum; \
> tail -c +1025 build/legacy/firmware/firmware.bin | sha256sum 
a0d77700aa0e815d1d1d17423139ebddf04a03a689689cba4270e2f163daafac  -
a0d77700aa0e815d1d1d17423139ebddf04a03a689689cba4270e2f163daafac  -
```

That is a match. This firmware is **reproducible**.
