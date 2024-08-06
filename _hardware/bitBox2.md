---
title: BitBox02
appId: bitBox2
authors:
- leo
- Joko Ono
- Mohammad Rafigh
- danny
released: 2019-09-25
discontinued: 
updated: 2024-06-24
version: 9.19.0-Multi
binaries: https://github.com/digitalbitbox/bitbox02-firmware/releases
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
price: 139EUR
repository: https://github.com/digitalbitbox/bitbox02-firmware
issue: 
icon: bitBox2.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2024-08-06
signer: 
reviewArchive:
- date: 2023-10-10
  version: 9.15.0
  appHash: b2dfdc5413678f663639a34a5082f93ec253fd405313baca93291cab0a91233c
  gitRevision: d66d0fd515637c34a79f6bb06588396047e59a9c
  verdict: reproducible
- date: 2023-05-22
  version: 9.14.0
  appHash: 06d61dffe90f79887567f7cbe34f19dc4c667c2919dab83ae9311a7c5bcbbeea
  gitRevision: cd354fdd1752e9b967f08eb399ecfd7b7e9c2b72
  verdict: reproducible
- data: 2022-11-18
  version: 9.13.1
  appHash: 0f64c9ba01bb25500bfd3c96c133daa7da4a688234facbdd42a4f5e54d58e995
  gitRevision: f122e03466bc36063fc21fa47ba7f08b4731cb38
  verdict: reproducible
- date: 2022-08-07
  version: 9.12.0
  appHash: e3cf692d4ef288f27f22af2413acd9a43aa0ee445f83729f7b6c1fce55443293
  gitRevision: 0b7fec3e080550d57837a9ee6d79594c4e8f3061
  verdict: nonverifiable
- date: 2022-02-17
  version: 9.9.0
  appHash: 93d8e89f6edc7813a34901395a13291a3435bbc21c146e177f77c85095fc1311
  gitRevision: 49009f7ec76dd42f6117772298d5150bbbe4d3c5
  verdict: reproducible
- date: 2021-12-01
  version: 9.8.0
  appHash: 51e584b61eaff83fe9e538c0fd47c617c686cd6da1a501acc33f12dab37f627a
  gitRevision: 234c3a70d821cd52afa883ea3173fde45b2f915d
  verdict: reproducible
- date: 2021-10-05
  version: 9.7.0
  appHash: 997fa9ab985d61473cb191d1c3bba2a291fb91861e215c005b133aec1e87d493
  gitRevision: bc4e2359aa619a052c10aeb1c5e5ae3aa4180e52
  verdict: reproducible
- date: 2021-07-10
  version: 9.6.0
  appHash: e41917450ef6fb80af9fbe8f85478973763fe593c23cdeaec481e5d5395dd3b9
  gitRevision: deced5af364fdbbf7e613ed48f74171bb4093979
  verdict: reproducible
twitter: ShiftCryptoHQ
social:
- https://www.linkedin.com/company/shift-crypto
- https://www.facebook.com/Shiftcrypto
- https://www.reddit.com/r/BitBoxWallet
features: 

---

Our [test script](/scripts/test/hardware/bitBox2.sh) yields this result:

```
$ scripts/test/hardware/bitBox2.sh 9.18.0
...
Generating binary firmware-btc.bin
   text	   data	    bss	    dec	    hex	filename
 548864	  19520	 191064	 759448	  b9698	firmware-btc.elf
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
signed download             13414426ac7f848d1f264059b82f4bb15e6dba03e178cbd46a8bda49ac9123db  firmware-btc.v9.18.0.signed.bin
signed download minus sig.  ab7d70eb83e2f84cf940446ee56de4aec5d3d18f0cf69c2d65e46548ab5f992b  p_firmware-btc.bin
built binary                ab7d70eb83e2f84cf940446ee56de4aec5d3d18f0cf69c2d65e46548ab5f992b  temp/build/bin/firmware-btc.bin
firmware as shown in device 4563ad0cf73df26020989aa811ec326e2a670df25c15104ad0e3d66568aa9126
                            (The latter is a double sha256 over version,
                             firmware and padding)

```

Version 9.18.0 is **reproducible**.
