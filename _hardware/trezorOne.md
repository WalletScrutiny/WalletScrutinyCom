---
title: "Trezor One"
appId: trezorOne
authors:
- leo
released: 2014-07-29
discontinued: # date
updated: 2021-07-13
version: 1.10.2
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
bugbounty: 
verdict: reproducible
date: 2021-08-23
signer: 
reviewArchive:
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


For the latest firmware version `v1.10.2`, we try the same as las time:

```
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
