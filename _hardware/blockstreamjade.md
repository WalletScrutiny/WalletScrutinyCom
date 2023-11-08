---
title: Blockstream Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
released: 2021-01-01
discontinued: 
updated: 2023-10-23
version: 1.0.24
binaries: https://jadefw.blockstream.com/bin/jade/index.json
dimensions:
- 24
- 60
- 17
weight: 
provider: Blockstream Corporation Inc.
providerWebsite: https://blockstream.com/
website: https://blockstream.com/jade/
shop: https://store.blockstream.com/product/blockstream-jade-token/
country: CA
price: 39.99USD
repository: https://github.com/Blockstream/jade
issue: 
icon: blockstreamjade.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2023-11-07
signer: 
reviewArchive:
- date: 2023-10-11
  version: "1.0.23"
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

We tested the latest version of {{ page.title }} using our test script:

```
$ scripts/test/hardware/blockstreamjade.sh 1.0.24
...
Results:
06a64e6826ceae2729d2b3f1eb0b5a8c7619398b9339b166723693ef317b514e  downloaded-firmware.bin
20d1ab2b5afba78e6db6be9595dba366432e4f87ed0e6347be5a24082e96e2f6  downloaded-firmware_stripped.bin
20d1ab2b5afba78e6db6be9595dba366432e4f87ed0e6347be5a24082e96e2f6  build/jade.bin
The Jade firmware version 1.0.24 is reproducible with above hashes.
```

The firmware with above hash was **reproducible**.