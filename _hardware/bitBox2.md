---
title: "BitBox02"
appId: bitBox2
authors:
- leo
released: 
discontinued: # date
updated: 2021-11-15
version: 9.8.0
binaries: https://github.com/digitalbitbox/bitbox02-firmware/releases
dimensions: [54.5, 25.4, 9.6]
weight: 12
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
date: 2021-12-01
signer: 
reviewArchive:
- date: 2021-10-05
  version: "9.7.0"
  appHash: 997fa9ab985d61473cb191d1c3bba2a291fb91861e215c005b133aec1e87d493
  gitRevision: bc4e2359aa619a052c10aeb1c5e5ae3aa4180e52
  verdict: reproducible
- date: 2021-07-10
  version: "9.6.0"
  appHash: e41917450ef6fb80af9fbe8f85478973763fe593c23cdeaec481e5d5395dd3b9
  gitRevision: deced5af364fdbbf7e613ed48f74171bb4093979
  verdict: reproducible
providerTwitter: ShiftCryptoHQ
providerLinkedIn: shift-crypto
providerFacebook: Shiftcrypto
providerReddit: BitBoxWallet
---


We wrapped the findings from prior reviews in a
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/bitBox2.sh)
which gave us these results:

```
$ scripts/test/hardware/bitBox2.sh 9.8.0
...
Hashes of
signed download             51e584b61eaff83fe9e538c0fd47c617c686cd6da1a501acc33f12dab37f627a  firmware-btc.v9.8.0.signed.bin
signed download minus sig.  a397bb27eda4da1b3fb8e7462b26b4fc49afa15c00cf75e3e45983ddd533a7e2  p_firmware.bin
built binary                a397bb27eda4da1b3fb8e7462b26b4fc49afa15c00cf75e3e45983ddd533a7e2  temp/build/bin/firmware-btc.bin
hash as shown in bootloader abd2c1f47d6e5f49e67a51f163de87b83b080a8d65d12a62f21b9d5517a66cd1
                            (The latter is a double sha256 over version, firmware and padding)
```

So, the result looks good. The tested firmware is **reproducible**.
