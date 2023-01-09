---
title: BitBox02
appId: bitBox2
authors:
- leo
- Joko Ono
released: 
discontinued: 
updated: 2022-11-09
version: 9.13.1
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
issue: https://github.com/digitalbitbox/bitbox02-firmware/issues/901
icon: bitBox2.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2022-11-18
signer: 
reviewArchive:
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

---

The reproducibility of firmware v9.13.1 has been confirmed by
[sutterseba](https://github.com/digitalbitbox/bitbox02-firmware/pull/1019/commits)
and [Joko](https://twitter.com/jokoono/status/1593611834027827200?s=20&t=hXIF4vnz7W6r8RgwLohc8w).

Steps to reproduce on MacOS (Intel):

Install Docker (4.14.1 (91661) used).

```
$ cd releases
$ ./build.sh firmware-btc-only/v9.13.1 "make firmware-btc"
...
firmware.bin created at:
.../bitbox02-firmware-master/releases/temp/build/bin/firmware.bin
or
.../bitbox02-firmware-master/releases/temp/build/bin/firmware-btc.bin

$shasum -a 256 temp/build/bin/firmware-btc.bin
b366dd855d8fb48a9d455275bc4ba0fd80af462d3deaac8c0c5f3a87bf3421f2  temp/build/bin/firmware-btc.bin
```

This matches the signed firmware, which we can verify by downloading the binary, moving it into the release-folder and running:

```
./describe_signed_firmware.py firmware-btc.v9.13.1.signed.bin 
The following information assumes the provided binary was signed correctly; the signatures are not being verified.
This is a Bitcoin-only edition firmware.
The hash of the unsigned firmware binary is (compare with reproducible build):
b366dd855d8fb48a9d455275bc4ba0fd80af462d3deaac8c0c5f3a87bf3421f2
The monotonic firmware version is: 30
The hash of the firmware as verified/shown by the bootloader is:
3b14ac4b65f954d19bb5faf66422838e0647a3a29987fda604fd421575bd4dae
```

The [test script](/scripts/test/hardware/bitBox2.sh) also yields a positive
result:

```
$ scripts/test/hardware/bitBox2.sh 9.13.1
...
firmware.bin created at:
/home/leo/wsTest/bitbox02-firmware/temp/build/bin/firmware.bin
or
/home/leo/wsTest/bitbox02-firmware/temp/build/bin/firmware-btc.bin
Hashes of
signed download             0f64c9ba01bb25500bfd3c96c133daa7da4a688234facbdd42a4f5e54d58e995  firmware-btc.v9.13.1.signed.bin
signed download minus sig.  b366dd855d8fb48a9d455275bc4ba0fd80af462d3deaac8c0c5f3a87bf3421f2  p_firmware-btc.bin
built binary                b366dd855d8fb48a9d455275bc4ba0fd80af462d3deaac8c0c5f3a87bf3421f2  temp/build/bin/firmware-btc.bin
firmware as shown in device 3b14ac4b65f954d19bb5faf66422838e0647a3a29987fda604fd421575bd4dae
                            (The latter is a double sha256 over version,
                             firmware and padding)
```

This version is **reproducible**.
