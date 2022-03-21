---
title: BitBox02
appId: bitBox2
authors:
- leo
released: 
discontinued: 
updated: 2022-01-12
version: 9.9.0
binaries: https://github.com/digitalbitbox/bitbox02-firmware/releases
dimensions:
- 54.5
- 25.4
- 9.6
weight: 12
provider: 
providerWebsite: 
website: https://shiftcrypto.ch/
shop: https://shiftcrypto.shop/en/products/bitbox02-bitcoin-only-4/
country: CH
price: 119EUR
repository: https://github.com/digitalbitbox/bitbox02-firmware
issue: https://github.com/digitalbitbox/bitbox02-firmware/issues/762
icon: bitBox2.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2022-02-17
signer: 
reviewArchive:
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

We wrapped the findings from prior reviews in a
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/bitBox2.sh)
which gave us these results:

```
$ scripts/test/hardware/bitBox2.sh 9.8.0
...
Hashes of
signed download             93d8e89f6edc7813a34901395a13291a3435bbc21c146e177f77c85095fc1311  firmware-btc.v9.9.0.signed.bin
signed download minus sig.  7bfb6b8e118afd320138dfa7d09d453c73bbab4420caee361dc86a7a7a3ef16e  p_firmware.bin
built binary                7bfb6b8e118afd320138dfa7d09d453c73bbab4420caee361dc86a7a7a3ef16e  temp/build/bin/firmware-btc.bin
firmware as shown in device 3dced69e6fbad587772d26f4ac72c942001466e5a60fb0b8ff5da61798f3226e
                            (The latter is a double sha256 over version, firmware and padding)
```

So, the result looks good. The tested firmware is **reproducible**.
