---
title: BitBox02
appId: bitBox2
authors:
- leo
- Joko Ono
- Mohammad Rafigh
- danny
- keraliss
released: 2019-09-25
discontinued: 
updated: 2024-09-26
version: 9.21.0-Multi
binaries: https://github.com/BitBoxSwiss/bitbox02-firmware/releases
dimensions:
- 55
- 25
- 9.6
weight: 12
provider: 
providerWebsite: 
website: https://shiftcrypto.ch/
shop: https://shiftcrypto.shop/en/products/bitbox02-bitcoin-only-4/
country: CH
price: 149EUR
repository: https://github.com/BitBoxSwiss/bitbox02-firmware
issue: 
icon: bitBox2.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 36895857c346c1fbd0d206853b7031e985c1a959e9f7f9396a7ae94dfffa9679
date: 2024-11-05
signer: 
reviewArchive:
- date: 2024-08-09
  version: 9.19.0
  appHashes:
  - ecbf8024f59f490110a9cb07c4787da22a6df3733b2d81c8ffd307f4bb0d786e
  gitRevision: df67e48af949af6feceb8818552f44bb4245953a
  verdict: reproducible
- date: 2023-05-03
  version: 9.18.0
  appHashes:
  - 13414426ac7f848d1f264059b82f4bb15e6dba03e178cbd46a8bda49ac9123db
  gitRevision: b0b9c5e36447ee68308bafffe4f4b719ae356088
  verdict: reproducible
- date: 2023-10-10
  version: 9.15.0
  appHashes:
  - b2dfdc5413678f663639a34a5082f93ec253fd405313baca93291cab0a91233c
  gitRevision: d66d0fd515637c34a79f6bb06588396047e59a9c
  verdict: reproducible
- date: 2023-05-22
  version: 9.14.0
  appHashes:
  - 06d61dffe90f79887567f7cbe34f19dc4c667c2919dab83ae9311a7c5bcbbeea
  gitRevision: cd354fdd1752e9b967f08eb399ecfd7b7e9c2b72
  verdict: reproducible
- date: 2022-11-18
  version: 9.13.1
  appHashes:
  - 0f64c9ba01bb25500bfd3c96c133daa7da4a688234facbdd42a4f5e54d58e995
  gitRevision: 6076d21c5df6d19945229d86c013c5d3f8a94d26
  verdict: reproducible
- date: 2022-08-07
  version: 9.12.0
  appHashes:
  - e3cf692d4ef288f27f22af2413acd9a43aa0ee445f83729f7b6c1fce55443293
  gitRevision: 0b7fec3e080550d57837a9ee6d79594c4e8f3061
  verdict: nonverifiable
- date: 2022-02-17
  version: 9.9.0
  appHashes:
  - 93d8e89f6edc7813a34901395a13291a3435bbc21c146e177f77c85095fc1311
  gitRevision: 49009f7ec76dd42f6117772298d5150bbbe4d3c5
  verdict: reproducible
- date: 2021-12-01
  version: 9.8.0
  appHashes:
  - 51e584b61eaff83fe9e538c0fd47c617c686cd6da1a501acc33f12dab37f627a
  gitRevision: 234c3a70d821cd52afa883ea3173fde45b2f915d
  verdict: reproducible
- date: 2021-10-05
  version: 9.7.0
  appHashes:
  - 997fa9ab985d61473cb191d1c3bba2a291fb91861e215c005b133aec1e87d493
  gitRevision: bc4e2359aa619a052c10aeb1c5e5ae3aa4180e52
  verdict: reproducible
- date: 2021-07-10
  version: 9.6.0
  appHashes:
  - e41917450ef6fb80af9fbe8f85478973763fe593c23cdeaec481e5d5395dd3b9
  gitRevision: deced5af364fdbbf7e613ed48f74171bb4093979
  verdict: reproducible
twitter: ShiftCryptoHQ
social:
- https://www.linkedin.com/company/shift-crypto
- https://www.facebook.com/Shiftcrypto
- https://www.reddit.com/r/BitBoxWallet
features: 

---

```
$ scripts/test/hardware/bitBox2.sh 9.21.0
...
[100%] Linking C executable ../bin/firmware-btc.elf

Generating binary firmware-btc.bin
   text	   data	    bss	    dec	    hex	filename
 541768	  19172	 191064	 752004	  b7984	firmware-btc.elf
make[4]: Leaving directory '/bb02/build'
[100%] Built target firmware-btc.elf
make[3]: Leaving directory '/bb02/build'
make[2]: Leaving directory '/bb02/build'
make[1]: Leaving directory '/bb02/build'
firmware.bin created at:
/home/dannybuntu/wsTest/bitbox02-firmware/temp/build/bin/firmware.bin
or
/home/dannybuntu/wsTest/bitbox02-firmware/temp/build/bin/firmware-btc.bin
Hashes of
signed download             ff35982362faa1c6ca5066d1c4b4309eea52a4a14aa31f7a7fa413cbef5ac9a3  firmware-btc.v9.21.0.signed.bin
signed download minus sig.  36895857c346c1fbd0d206853b7031e985c1a959e9f7f9396a7ae94dfffa9679  p_firmware-btc.bin
built binary                36895857c346c1fbd0d206853b7031e985c1a959e9f7f9396a7ae94dfffa9679  temp/build/bin/firmware-btc.bin
firmware as shown in device 4b851096907dbd168f1d3873f7be1adc8c43d779d3015b3f3bbf5038842980b1
                           (The latter is a double sha256 over version,
                            firmware and padding)
```

Version 9.21.0 is **reproducible**.

{% include asciicast %}