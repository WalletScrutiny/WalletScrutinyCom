---
title: Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
- danny
released: 2021-01-01
discontinued: 
updated: 2024-05-09
version: 1.0.30
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
date: 2024-05-15
signer: 
reviewArchive:
- date: 2024-05-06
  version: 1.0.29
  appHash: ed9e949c2fea08ed56d9c842ffc94c5a9698dca78502137376bd0e421afbabf5
  gitRevision: 05794276d43d37b58420a1cb0c75f47d894c26ba
  verdict: reproducible
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
$ scripts/test/hardware/blockstreamjade.sh 1.0.30
...
Results:
d62518df363ceb7002c171baf8149c644dd8dbb57b4f122db0c4b1dc5707328d  jade_1.0.30_10_ble.bin
9ec79bd13e24107bea00c372f7e21ceccf409430d5cba8d7f02184c7290f85f8  jade_1.0.30_10_ble.built.bin
9ec79bd13e24107bea00c372f7e21ceccf409430d5cba8d7f02184c7290f85f8  jade_1.0.30_10_ble_stripped.bin
The Jade firmware version 1.0.30 10_ble is reproducible with above hashes.
0bfbee52e5694dbcfb540fd5aa9ead6dd3acc5b1aa0a68d53a1005cc5bf8bdf6  jade_1.0.30_10_noR.bin
167252882d816641f6f6fcacaf8aaea046a01b6f9be877759f94eeadbdfe1c1c  jade_1.0.30_10_noR.built.bin
167252882d816641f6f6fcacaf8aaea046a01b6f9be877759f94eeadbdfe1c1c  jade_1.0.30_10_noR_stripped.bin
The Jade firmware version 1.0.30 10_noR is reproducible with above hashes.
feec96441572a28d7a80b22e9c65181de1d05b197872a7b10955af349fce7e2f  jade_1.0.30_11_ble.bin
cb84f99175838b433ac6f70795529f52407aab156a167e765ded75d6c832973b  jade_1.0.30_11_ble.built.bin
cb84f99175838b433ac6f70795529f52407aab156a167e765ded75d6c832973b  jade_1.0.30_11_ble_stripped.bin
The Jade firmware version 1.0.30 11_ble is reproducible with above hashes.
9ffaba14ce1390cef7b228a008be3fbc117a7bf5550670565c87dbc70e366156  jade_1.0.30_11_noR.bin
1829cdda459baedd468bfed3f5f009b0a9c922c0ce2281578a55e07b7d3204d5  jade_1.0.30_11_noR.built.bin
1829cdda459baedd468bfed3f5f009b0a9c922c0ce2281578a55e07b7d3204d5  jade_1.0.30_11_noR_stripped.bin
The Jade firmware version 1.0.30 11_noR is reproducible with above hashes.


```

This is what we want to see to give this product the verdict **reproducible**.

{% include asciicast %}
