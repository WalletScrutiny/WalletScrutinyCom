---
title: Blockstream Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
- danny
released: 2021-01-01
discontinued: 
updated: 2023-11-03
version: 1.0.26
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
verdict: nonverifiable
date: 2023-11-29
signer: 
reviewArchive:
- date: 2023-11-08
  version: 1.0.26
  appHash: 3ca3e6758bbf8a971b16c09f51871426fcee4a1681b45f1a892f2a94b725508e
  gitRevision: 4348653c9aff5fac3365bcf45fc4880b2046d619
  verdict: reproducible
- date: 2023-11-07
  version: 1.0.24
  appHash: 20d1ab2b5afba78e6db6be9595dba366432e4f87ed0e6347be5a24082e96e2f6
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

We tested the latest version of {{ page.title }} using our test script, now
covering all four build variants:

```
$ scripts/test/hardware/blockstreamjade.sh 1.0.26
...
Results:
3ca3e6758bbf8a971b16c09f51871426fcee4a1681b45f1a892f2a94b725508e  jade_1.0.26_10_ble.bin
2f65cb54a553b4f15c6bef0f4e3bb60b7e9cb681dc642038f0ac52b207b24144  jade_1.0.26_10_ble.built.bin
2f65cb54a553b4f15c6bef0f4e3bb60b7e9cb681dc642038f0ac52b207b24144  jade_1.0.26_10_ble_stripped.bin
The Jade firmware version 1.0.26 10_ble is reproducible with above hashes.
80a11e27ad5c22dbfd65ff977062bceb9f7f01d17208bd264b77997871d0407f  jade_1.0.26_10_noR.bin
182cacd249be55b4bd6708070b7473c377d16d13a9c1502e9df1f2c811598dd6  jade_1.0.26_10_noR.built.bin
182cacd249be55b4bd6708070b7473c377d16d13a9c1502e9df1f2c811598dd6  jade_1.0.26_10_noR_stripped.bin
The Jade firmware version 1.0.26 10_noR is reproducible with above hashes.
12fa983a656cfae6c5e6f3031912eccb2186ad2ae75a2521c6d3a0835f33c52a  jade_1.0.26_11_ble.bin
b4824aead81aeab7c9b41e7704b55a128e389757826c5b53fe9506143a0cb441  jade_1.0.26_11_ble.built.bin
b4824aead81aeab7c9b41e7704b55a128e389757826c5b53fe9506143a0cb441  jade_1.0.26_11_ble_stripped.bin
The Jade firmware version 1.0.26 11_ble is reproducible with above hashes.
308919e42b843e1feaf1853b6954b2c7d7d51918505bf618d03081f4e1e275a1  jade_1.0.26_11_noR.bin
f5c4f608996a225f57042d5a3dfb3a918ca1b7ce10be0a439e93b9747d3fbe99  jade_1.0.26_11_noR.built.bin
f5c4f608996a225f57042d5a3dfb3a918ca1b7ce10be0a439e93b9747d3fbe99  jade_1.0.26_11_noR_stripped.bin
The Jade firmware version 1.0.26 11_noR is reproducible with above hashes.
```

The firmware with above hashes are **reproducible**.

**Corroborative Analysis by Danny**

Here, the same script, 'blockstreamjade.sh' was run in an Ubuntu 22.04 virtual machine.

```
$ ./scripts/test/hardware/blockstreamjade.sh 1.0.26
...
3ca3e6758bbf8a971b16c09f51871426fcee4a1681b45f1a892f2a94b725508e  jade_1.0.26_10_ble.bin
0d0f68abc5b39e201721e3c47f6b57f421ce69712c3393349b970875b00034f9  jade_1.0.26_10_ble.built.bin
2f65cb54a553b4f15c6bef0f4e3bb60b7e9cb681dc642038f0ac52b207b24144  jade_1.0.26_10_ble_stripped.bin
The Jade firmware version 1.0.26 10_ble is **not** reproducible with above hashes.
80a11e27ad5c22dbfd65ff977062bceb9f7f01d17208bd264b77997871d0407f  jade_1.0.26_10_noR.bin
182cacd249be55b4bd6708070b7473c377d16d13a9c1502e9df1f2c811598dd6  jade_1.0.26_10_noR.built.bin
182cacd249be55b4bd6708070b7473c377d16d13a9c1502e9df1f2c811598dd6  jade_1.0.26_10_noR_stripped.bin
The Jade firmware version 1.0.26 10_noR is reproducible with above hashes.
12fa983a656cfae6c5e6f3031912eccb2186ad2ae75a2521c6d3a0835f33c52a  jade_1.0.26_11_ble.bin
91d31b9d0cf1d307e80f1e28800ebda29123f42e45b0228124e084d45d0d2b3a  jade_1.0.26_11_ble.built.bin
b4824aead81aeab7c9b41e7704b55a128e389757826c5b53fe9506143a0cb441  jade_1.0.26_11_ble_stripped.bin
The Jade firmware version 1.0.26 11_ble is **not** reproducible with above hashes.
308919e42b843e1feaf1853b6954b2c7d7d51918505bf618d03081f4e1e275a1  jade_1.0.26_11_noR.bin
f5c4f608996a225f57042d5a3dfb3a918ca1b7ce10be0a439e93b9747d3fbe99  jade_1.0.26_11_noR.built.bin
f5c4f608996a225f57042d5a3dfb3a918ca1b7ce10be0a439e93b9747d3fbe99  jade_1.0.26_11_noR_stripped.bin
The Jade firmware version 1.0.26 11_noR is reproducible with above hashes.
```

Apparently, this is an ongoing issue, which is [discussed at length](https://github.com/Blockstream/Jade/issues/98) in GitHub.

We had Chat GPT4 analyze the diffs, and here is the assessment: 

> **Strict Reproducibility:** If strict binary reproducibility is required (i.e., byte-for-byte identical), then these binaries are not reproducible, as indicated by the differences in the hex dump.
>
> **Functional Reproducibility:** If the concern is more about functional equivalence (i.e., both binaries behave the same way despite minor differences), further analysis would be needed. This would involve reverse engineering or running both binaries in a controlled environment to compare their behaviors.


<link rel="stylesheet" type="text/css" href="/assets/css/asciinema-player.css" />
<div id="demo"></div>
<script src="/assets/js/asciinema-player.min.js"></script>
<script>
  AsciinemaPlayer.create('/assets/casts/hardware/blockstream_jade_1.0.26_3ca3e6758bbf8a971b16c09f51871426fcee4a1681b45f1a892f2a94b725508e.cast', document.getElementById('demo'));
</script>