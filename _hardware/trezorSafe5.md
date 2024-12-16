---
title: Trezor Safe 5
appId: trezorSafe5
authors:
- danny
- keraliss
released: 2024-06-14
discontinued: 
updated: 2024-09-19
version: 2.8.6
binaries: https://data.trezor.io/firmware/t3t1/trezor-t3t1-2.8.3.bin
dimensions:
- 66
- 40
- 8
weight: 23
provider: Trezor
providerWebsite: 
website: https://trezor.io
shop: https://trezor.io/trezor-safe-5
country: CZ
price: 169USD
repository: https://github.com/trezor/data/tree/master/firmware/t3t1
issue: https://github.com/trezor/trezor-firmware/issues/4254
icon: trezorSafe5.png
bugbounty: https://trezor.io/learn/a/how-to-report-an-issue
meta: ok
verdict: reproducible
date: 2024-12-13
signer: 
reviewArchive: 
- date: 2024-10-14
  version: 2.8.3
  appHash: 9f68696478e09d7bf8b8f5181413d8a5386b37571dc2f5ed8511a24f4c1d35b7
  gitRevision: 5d7b9b51299533649649997ba132ef2bd73f49f5
  verdict: reproducible
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
features: 

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/1EVzbNPn6bc?si=vv88okupfrEmtEff" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# [Trezor Safe 5 Official Online Documentation](https://trezor.io/learn/a/get-started-with-the-trezor-safe-5)
# [Trezor Safe 5 Reproducible Build Documentation](https://github.com/trezor/trezor-firmware/blob/d5f2ea48feebeb4c8f7abc98392f64f23b8d9dba/docs/common/reproducible-build.md) (Soon to be merged)

## Reproducible Build Verification for v2.8.6 (2024-12-13)

Initially, we attempted to build manually, but ran into problems when it came to signature zeroing. We filed GitHub issue [4254](https://github.com/trezor/trezor-firmware/issues/4254) so we can be aware of the appropriate values. After several tests, this got resolved and we would be closing the issue after our final test. 

We were able to create a script for the Trezor Safe 5, that would automate the process.

### Build Results

```
Built from commit 6efd33909b0ac2870773d9ef7c62c74cfa74deb9

Fingerprints:
de3edf542fc9ef58eb447f996992b6164236c120daa47691dd553f89fa0d4002 build/core-R/bootloader/bootloader.bin
fc8e7ee80a168aea0bfc1a58ba1de13db8f4e9e4c85a96d153bead52de74f3bf build/core-R/firmware/firmware.bin
de3edf542fc9ef58eb447f996992b6164236c120daa47691dd553f89fa0d4002 build/core-R-bitcoinonly/bootloader/bootloader.bin
9a1ec57ff51051ef11547b6cd18e43757165e22c21e8279d25d752130d6d2fde build/core-R-bitcoinonly/firmware/firmware.bin
747566d452d8e00467109e685c92f08e4bc6b1743184cdab73a5125676126d90 build/core-T/bootloader/bootloader.bin
3a2714be612d459eae8011616fb2cfa65eed75e1edc2b538bc00282bbc726e1d build/core-T/firmware/firmware.bin
747566d452d8e00467109e685c92f08e4bc6b1743184cdab73a5125676126d90 build/core-T-bitcoinonly/bootloader/bootloader.bin
10f9985bcba444626b45e557a915149e5e962c7d238596aaa860f7968f088945 build/core-T-bitcoinonly/firmware/firmware.bin
79d58942d45700e05cc0cba1b3c96dd98ffbc3e9e8d5dde683698f4b2f2f2666 build/core-T3T1/bootloader/bootloader.bin
da8741ccfb4a328e639351dfa5dba496198016bdbd076ec02a40a52870d85e91 build/core-T3T1/firmware/firmware.bin
79d58942d45700e05cc0cba1b3c96dd98ffbc3e9e8d5dde683698f4b2f2f2666 build/core-T3T1-bitcoinonly/bootloader/bootloader.bin
1ff9b59fb8069e7c2234153f2f6d40a8b8d93a47f26b64f5930db0191a6879e7 build/core-T3T1-bitcoinonly/firmware/firmware.bin
Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 4.1819e-05 s, 1.6 MB/s
73c8e70fc6785616574cb7d1ac274f3cea596870dff2316d3599adde1b4f2eb2  trezor-t3t1-2.8.6.bin.zeroed
73c8e70fc6785616574cb7d1ac274f3cea596870dff2316d3599adde1b4f2eb2  build/core-T3T1/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 4.639e-05 s, 1.4 MB/s
538515eb83558832356340ef198559ca14fa5a70220b14e2fb06dc3c8fef5d03  trezor-t3t1-2.8.6-bitcoinonly.bin.zeroed
538515eb83558832356340ef198559ca14fa5a70220b14e2fb06dc3c8fef5d03  build/core-T3T1-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
197197aba0f412a74be96a2a6ad1537437cee67e517bd94d1cb776c263a37ffe  trezor-t3t1-2.8.6.bin
78a69afb22d7c0704bd40479bde3ee2d15c390a1819129cf5954643d8d65e0fc  trezor-t3t1-2.8.6-bitcoinonly.bin
```

The hashes of the zeroed version of v2.8.6 matches with the **signature-less** built binary.
The hashes of the zeroed version of v2.8.6 bitcoin-only matches with the **signature-less** built binary.

**Version 2.8.6 of the {{ page.title }} is reproducible**.

{% include asciicast %}

## Review 2024-10-08

Built on the technology behind the {% include walletLink.html wallet='hardware/trezorSafe3' verdict='true' %}, the trezor Safe 5 features the following: 

- 39 mm touchscreen (240 x 240 pixels)
- NDA-free EAL 6+ Secure Element
- 12-, 20-, 24- wallet backup
- Advanced Multi-share Backup
- Haptic feedback
- Shipped without firmware (can be installed through USB-C using Trezor Suite)  
- Pin and passphrase protection
- Bitcoin-only and Universal (1000 coins and tokens) variants

