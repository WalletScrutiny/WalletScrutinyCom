---
title: Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
- danny
released: 2021-01-01
discontinued: 
updated: 2024-03-23
version: 1.0.29
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
date: 2024-05-06
signer: 
reviewArchive:
- date: 2024-03-11
  version: 1.0.27
  appHash: db3ea043b891c862401d110923be04b0c2ef9b100c57cad22ca345b032efc448
  gitRevision: 633cb64f6b6704924bd57b45747de4c7d1c281a7
  verdict: reproducible
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
$ scripts/test/hardware/blockstreamjade.sh 1.0.29
...
Results:
ed9e949c2fea08ed56d9c842ffc94c5a9698dca78502137376bd0e421afbabf5  jade_1.0.29_10_ble.bin
5e7b9ba5082f3459b64d8ed6542d0abec7533801965e3eb1f3d4903c5f403a40  jade_1.0.29_10_ble.built.bin
5e7b9ba5082f3459b64d8ed6542d0abec7533801965e3eb1f3d4903c5f403a40  jade_1.0.29_10_ble_stripped.bin
The Jade firmware version 1.0.29 10_ble is reproducible with above hashes.
01098b6e2c2ff31d124eea163518b38f11d4a58dd5de5c71e35b11f6f41cb7bb  jade_1.0.29_10_noR.bin
37a765f52cd032214b8c57eb8ab381887d3fb40eb6d9c33677945306a4764454  jade_1.0.29_10_noR.built.bin
37a765f52cd032214b8c57eb8ab381887d3fb40eb6d9c33677945306a4764454  jade_1.0.29_10_noR_stripped.bin
The Jade firmware version 1.0.29 10_noR is reproducible with above hashes.
673054922e0e2b6e31680fa1317c4245ae5b941f5c552564798457e455dca62f  jade_1.0.29_11_ble.bin
b80f2e7d5f300af2b7d5d57385e9f7846ae00fb9e67329c3257fb28214d04aaa  jade_1.0.29_11_ble.built.bin
b80f2e7d5f300af2b7d5d57385e9f7846ae00fb9e67329c3257fb28214d04aaa  jade_1.0.29_11_ble_stripped.bin
The Jade firmware version 1.0.29 11_ble is reproducible with above hashes.
aee4feff3ea1ee591ac1ab3f283ac828fcedd38d53f69676254cd23c206ef9be  jade_1.0.29_11_noR.bin
73ff9320747c6d350d2c1bfc2981a142316a67242c31c1f60309f7ee74986c8f  jade_1.0.29_11_noR.built.bin
73ff9320747c6d350d2c1bfc2981a142316a67242c31c1f60309f7ee74986c8f  jade_1.0.29_11_noR_stripped.bin
The Jade firmware version 1.0.29 11_noR is reproducible with above hashes.

```

This is what we want to see to give this product the verdict **reproducible**.

{% include asciicast %}
