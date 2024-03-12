---
title: Blockstream Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
- danny
released: 2021-01-01
discontinued: 
updated: 2024-01-08
version: 1.0.27
binaries: https://jadefw.blockstream.com/bin/jade/index.json
dimensions:
- 24
- 60
- 17
weight: 21
provider: Blockstream Corporation Inc.
providerWebsite: https://blockstream.com/
website: https://blockstream.com/jade/
shop: https://store.blockstream.com/products/blockstream-jade-hardware-wallet
country: CA
price: 64.99USD
repository: https://github.com/Blockstream/jade
issue: 
icon: blockstreamjade.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2024-03-11
signer: 
reviewArchive:
- date: 2023-11-29
  version: 1.0.26
  appHash: 
  gitRevision: 
  verdict: nonverifiable
- date: 2023-11-08
  version: 1.0.26
  appHash: 3ca3e6758bbf8a971b16c09f51871426fcee4a1681b45f1a892f2a94b725508e
  gitRevision: 4348653c9aff5fac3365bcf45fc4880b2046d619
  verdict: reproducible
- date: 2023-11-07
  version: 1.0.24
  appHash: 
  gitRevision: d95ae2fe9c4fd50ffb947bdbed402de736ad7568
  verdict: reproducible
- date: 2023-10-11
  version: 1.0.23
  appHash: c6124408b51ffe0711ea7dbe02c3cca7a3f317c4d7d137212a2e6a78660f7daa
  gitRevision: 8f74ecbffe3020d502801e7f43c693c4b3fd272e
  verdict: reproducible
- date: 2023-08-07
  version: 1.0.21
  appHash: 
  gitRevision: b164591d0b50c2a0616d8b75f8efee8202fecc8b
  verdict: reproducible
- date: 2023-06-29
  version: 0.1.48
  appHash: d329dbf4fea13c6cde7df9682febae15e162947dc5a747aae98540f69e1a25d3
  gitRevision: e00377473e377b6baa0488479f35cb9307874e97
  verdict: nonverifiable
- date: 2022-08-07
  version: 0.1.33
  appHash: 
  gitRevision: 89390dfa4b632ab1261a523e1988c81ce2e47710
  verdict: nonverifiable
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
- https://t.me/blockstream
- https://www.youtube.com/channel/UCZNt3fZazX9cwWcC9vjDJ4Q
features: 

---

We tested the latest version of {{ page.title }} using our test script, covering
all four build variants:

```
$ scripts/test/hardware/blockstreamjade.sh 1.0.27
...
Results:
db3ea043b891c862401d110923be04b0c2ef9b100c57cad22ca345b032efc448  jade_1.0.27_10_ble.bin
60b78e2b4f04ed982e00002ee54235e87c39128f9dbab0529025ee4eb9950716  jade_1.0.27_10_ble.built.bin
60b78e2b4f04ed982e00002ee54235e87c39128f9dbab0529025ee4eb9950716  jade_1.0.27_10_ble_stripped.bin
The Jade firmware version 1.0.27 10_ble is reproducible with above hashes.
b2b67f5943ca4c1ae0c7fc3733352dbb4b644add5a174111547e5bd7f77d7171  jade_1.0.27_10_noR.bin
ec1ef3e8890d9b6b3be8d7ad2b8261f605e4d6071910073124a595f95f764cbb  jade_1.0.27_10_noR.built.bin
ec1ef3e8890d9b6b3be8d7ad2b8261f605e4d6071910073124a595f95f764cbb  jade_1.0.27_10_noR_stripped.bin
The Jade firmware version 1.0.27 10_noR is reproducible with above hashes.
9cd8a3abc492499468cb4a7bbdd70d20063ca670bf0d0485f7044c1f494c0723  jade_1.0.27_11_ble.bin
3e3569b48248140782be55354e1470a12b2e52d10ff4891953ebee743a96f093  jade_1.0.27_11_ble.built.bin
3e3569b48248140782be55354e1470a12b2e52d10ff4891953ebee743a96f093  jade_1.0.27_11_ble_stripped.bin
The Jade firmware version 1.0.27 11_ble is reproducible with above hashes.
cd5c9439037b1c1b94eb93fc774d146e24918f60cd61cac9bc8c008e80adc9fe  jade_1.0.27_11_noR.bin
470b1f32f788feb021ac07180c96e9d7553aaa0748a6e1cda969bb9220564564  jade_1.0.27_11_noR.built.bin
470b1f32f788feb021ac07180c96e9d7553aaa0748a6e1cda969bb9220564564  jade_1.0.27_11_noR_stripped.bin
The Jade firmware version 1.0.27 11_noR is reproducible with above hashes.
```

This is what we want to see to give this product the verdict **reproducible**.

{% include asciicast %}
