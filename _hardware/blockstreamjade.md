---
title: Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
- danny
released: 2021-01-01
discontinued: 
updated: 2024-11-27
version: 1.0.33
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
date: 2024-11-01
signer: 
reviewCurrent:
  date: 2024-11-01
  version: 1.0.32
  appHashes: [2f5bb1939061ff13e5f8a5ca52aa51641558a2b5356219d7a5c4138245f71f11, 619bcb47042bf5f30891f4ada6d18b03e6628a4775f25d3281fa8c3930af1a53, 118ce110a81c5689dd553a42ca3167bffe4457b5382c67a9f774e55f7f9d07b6] 
  verdict: reproducible
reviewArchive:
- date: 2024-08-26
  version: 1.0.31
  appHashes: [26c918f0e7281b9cc8fdfc10baae2e5a8ac6edf0cd08e699a913daea3b97d04e]
  gitRevision: 0e340f881dd801491bb0f70aa3bc4a6850f74654
  verdict: reproducible
- date: 2024-05-15
  version: 1.0.30
  appHashes: [d62518df363ceb7002c171baf8149c644dd8dbb57b4f122db0c4b1dc5707328d]
  gitRevision: ecbebc9a15b23cf32825669dd3ebb1a647f7a332
  verdict: reproducible
- date: 2024-05-06
  version: 1.0.29
  appHashes: [ed9e949c2fea08ed56d9c842ffc94c5a9698dca78502137376bd0e421afbabf5]
  gitRevision: 05794276d43d37b58420a1cb0c75f47d894c26ba
  verdict: reproducible
- date: 2024-03-11
  version: 1.0.27
  appHashes: [db3ea043b891c862401d110923be04b0c2ef9b100c57cad22ca345b032efc448]
  gitRevision: 633cb64f6b6704924bd57b45747de4c7d1c281a7
  verdict: reproducible
- date: 2023-11-29
  version: 1.0.26
  appHashes: []
  gitRevision: 
  verdict: nonverifiable
- date: 2023-11-08
  version: 1.0.26
  appHashes: [3ca3e6758bbf8a971b16c09f51871426fcee4a1681b45f1a892f2a94b725508e]
  gitRevision: 4348653c9aff5fac3365bcf45fc4880b2046d619
  verdict: reproducible
- date: 2023-11-07
  version: 1.0.24
  appHashes: []
  gitRevision: d95ae2fe9c4fd50ffb947bdbed402de736ad7568
  verdict: reproducible
- date: 2023-10-11
  version: 1.0.23
  appHashes: [c6124408b51ffe0711ea7dbe02c3cca7a3f317c4d7d137212a2e6a78660f7daa]
  gitRevision: 8f74ecbffe3020d502801e7f43c693c4b3fd272e
  verdict: reproducible
- date: 2023-08-07
  version: 1.0.21
  appHashes: []
  gitRevision: b164591d0b50c2a0616d8b75f8efee8202fecc8b
  verdict: reproducible
- date: 2023-06-29
  version: 0.1.48
  appHashes: [d329dbf4fea13c6cde7df9682febae15e162947dc5a747aae98540f69e1a25d3]
  gitRevision: e00377473e377b6baa0488479f35cb9307874e97
  verdict: nonverifiable
- date: 2022-08-07
  version: 0.1.33
  appHashes: [] 
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
$ scripts/test/hardware/blockstreamjade.sh 1.0.32
...
Results:
2f5bb1939061ff13e5f8a5ca52aa51641558a2b5356219d7a5c4138245f71f11  jade_1.0.32_10_ble.bin
619bcb47042bf5f30891f4ada6d18b03e6628a4775f25d3281fa8c3930af1a53  jade_1.0.32_10_ble.built.bin
619bcb47042bf5f30891f4ada6d18b03e6628a4775f25d3281fa8c3930af1a53  jade_1.0.32_10_ble_stripped.bin
118ce110a81c5689dd553a42ca3167bffe4457b5382c67a9f774e55f7f9d07b6  jade_1.0.32_10_ble.bin.gz
The Jade firmware version 1.0.32 10_ble is reproducible with above hashes.
52a2dbc6e026965ab3612ab513f5c7fbf2f80e3a2048d5c22a413f243edd4fc0  jade_1.0.32_10_noR.bin
22ed8de6f764c130fe46618916da2130b09347b957cd62c64ae7f36a5ae515b4  jade_1.0.32_10_noR.built.bin
22ed8de6f764c130fe46618916da2130b09347b957cd62c64ae7f36a5ae515b4  jade_1.0.32_10_noR_stripped.bin
b201c4a20629d8246119f87928a13f85d006614236aa070c2635f71413d4e03d  jade_1.0.32_10_noR.bin.gz
The Jade firmware version 1.0.32 10_noR is reproducible with above hashes.
63fe4fae1cfbc6ae82e488c87114ce6f0bc498b354f065fe4ada44917bd19541  jade_1.0.32_11_ble.bin
35a6d3e2d607a23f64cbddbf909a0d3fcafa08ebede39e2c73a6eb96c832dc87  jade_1.0.32_11_ble.built.bin
35a6d3e2d607a23f64cbddbf909a0d3fcafa08ebede39e2c73a6eb96c832dc87  jade_1.0.32_11_ble_stripped.bin
aa2e5e7a794d0ec91e30b113c793c8d901aa5381ca73d6bae352d1f81185bc16  jade_1.0.32_11_ble.bin.gz
The Jade firmware version 1.0.32 11_ble is reproducible with above hashes.
2f63b78676c2b0ddb56bcc9e8bcb851b3be9a3848597b495b8335cf8f7a7f005  jade_1.0.32_11_noR.bin
93f3efda1d0b333dbe6c1b29f4e176f06869e241d423aa091caf7b45cc098b76  jade_1.0.32_11_noR.built.bin
93f3efda1d0b333dbe6c1b29f4e176f06869e241d423aa091caf7b45cc098b76  jade_1.0.32_11_noR_stripped.bin
081345760a695d06783e58710408a2d497d367f54021d14cc49edf939bd22d70  jade_1.0.32_11_noR.bin.gz
The Jade firmware version 1.0.32 11_noR is reproducible with above hashes.
```

Firmware version 1.0.32 of {{ page.title }} is **reproducible**

{% include asciicast %}
