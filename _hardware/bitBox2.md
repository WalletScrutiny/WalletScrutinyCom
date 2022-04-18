---
title: BitBox02
appId: bitBox2
authors:
- leo
released: 
discontinued: 
updated: 2022-03-10
version: 9.10.0
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
price: 119EUR
repository: https://github.com/digitalbitbox/bitbox02-firmware
issue: https://github.com/digitalbitbox/bitbox02-firmware/issues/901
icon: bitBox2.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2022-04-18
signer: 
reviewArchive:
- date: 2022-02-17
  version: "9.9.0"
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

We wrapped the findings from prior reviews in a {% include testScript.html %}
which gave us these results:

```
$ scripts/test/hardware/bitBox2.sh 9.10.0
...
Hashes of
signed download             e3cf692d4ef288f27f22af2413acd9a43aa0ee445f83729f7b6c1fce55443293  firmware-btc.v9.10.0.signed.bin
signed download minus sig.  03b4f1c845fbb221109684163d1bd6d3b558b446e283d3217867f76074ef8745  p_firmware.bin
built binary                cd8dc14824a99c7b85be06787562238c5e9330becfa49569352500b385a81611  temp/build/bin/firmware-btc.bin
firmware as shown in device f2a3c20ee64147cff85c5a66e8a466bf9c98de2ea281b8211ce6788ec70a81cb
                            (The latter is a double sha256 over version, firmware and padding)
```

This does not look good. The second and third hash should be the same. Diffing
the respective files using `diffoscope ~/wsTest/bitbox02-firmware/{temp/build/bin/firmware-btc.bin,p_firmware.bin}` yields binary differences all over the place.

The build instructions don't look like they changed substantially:

```
$ git diff firmware-btc-only/v9.9.0 firmware-btc-only/v9.10.0 BUILD.md
diff --git a/BUILD.md b/BUILD.md
index c699881c..bbbd065a 100644
--- a/BUILD.md
+++ b/BUILD.md
@@ -175,6 +175,9 @@ Then you can run the tests by executing
+Rust unit tests, if not invoked via `make run-rust-unit-tests`, must be run with
+`-- --test-threads 1` due to unsafe concurrent access to `SafeData`, `mock_sd()` and `mock_memory()`.
+
```

This version is **not verifiable**.
