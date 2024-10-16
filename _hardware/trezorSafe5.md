---
title: Trezor Safe 5
appId: trezorSafe5
authors:
- danny
released: 2024-06-14
discontinued: 
updated: 2024-09-19
version: 2.8.3
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
date: 2024-10-14
signer: 
reviewArchive: 
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
features: 

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/1EVzbNPn6bc?si=vv88okupfrEmtEff" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# [Trezor Safe 5 Official Online Documentation](https://trezor.io/learn/a/get-started-with-the-trezor-safe-5)
# [Trezor Safe 5 Reproducible Build Documentation](https://github.com/trezor/trezor-firmware/blob/d5f2ea48feebeb4c8f7abc98392f64f23b8d9dba/docs/common/reproducible-build.md) (Soon to be merged)

## Reproducible Build Verification for v2.8.3 (2024-10-11)

Initially, we attempted to build manually, but ran into problems when it came to signature zeroing. We filed GitHub issue [4254](https://github.com/trezor/trezor-firmware/issues/4254) so we can be aware of the appropriate values. After several tests, this got resolved and we would be closing the issue after our final test. 

We were able to create a script for the Trezor Safe 5, that would automate the process.

### Build Results

```
Built from commit 39565d3970deb9d696217cda793dc467f2a8e3e5

Fingerprints:
02826539b47dd30ce99a769666639e5e92290c58c417f53359ce52c6dc68522b build/core-R/bootloader/bootloader.bin
bb0532e2378196b878eb7b5c50597b563eacbdb950d488409d940252cce450a4 build/core-R/firmware/firmware.bin
02826539b47dd30ce99a769666639e5e92290c58c417f53359ce52c6dc68522b build/core-R-bitcoinonly/bootloader/bootloader.bin
81c6c3a67ca2a04e9b6b0068a96c2db1e77c6cc972188d178f588c7cdb5ffd32 build/core-R-bitcoinonly/firmware/firmware.bin
819445f377568988110fe797f9163a903e48dda21c88054f686a55a5026ce819 build/core-T/bootloader/bootloader.bin
04626fe134c93f072d982c125055f14c47dba4a4671fa1b5e69a08d4a0da55f7 build/core-T/firmware/firmware.bin
819445f377568988110fe797f9163a903e48dda21c88054f686a55a5026ce819 build/core-T-bitcoinonly/bootloader/bootloader.bin
b0160661b3c87886dbb32d9dfa5a6220d7ea6af7c9f46b4d5ce2d37f0c6740d2 build/core-T-bitcoinonly/firmware/firmware.bin
dfabe8b10368f268cedaa505e284192329f489519dd71feb5fba7d610ef748fc build/core-T3T1/bootloader/bootloader.bin
0de51126c17cc0ac623800638dc851c0abd5b787cad5f3aa5843ea2c4cf8248a build/core-T3T1/firmware/firmware.bin
dfabe8b10368f268cedaa505e284192329f489519dd71feb5fba7d610ef748fc build/core-T3T1-bitcoinonly/bootloader/bootloader.bin
9eaf99a9420d2a3b9377102eb06b938f5a1886ecb06cccde7fd3cb7a39e1abd7 build/core-T3T1-bitcoinonly/firmware/firmware.bin
Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 0.000152948 s, 425 kB/s
83677f634f29e0f066153b599c25a8047729608d555f4c289b91df726472fd5d  trezor-t3t1-2.8.3.bin.zeroed
83677f634f29e0f066153b599c25a8047729608d555f4c289b91df726472fd5d  build/core-T3T1/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.000218987 s, 297 kB/s
13273f77e41c92755ab210a28fec9b54dc9df08af96c66caeb552b48028458aa  trezor-t3t1-2.8.3-bitcoinonly.bin.zeroed
13273f77e41c92755ab210a28fec9b54dc9df08af96c66caeb552b48028458aa  build/core-T3T1-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
9f68696478e09d7bf8b8f5181413d8a5386b37571dc2f5ed8511a24f4c1d35b7  trezor-t3t1-2.8.3.bin
49996a1a602f08809427cf3b959f3c70eeef1fcfd45f267bd6d058496a4cc37e  trezor-t3t1-2.8.3-bitcoinonly.bin
```

The hashes of the zeroed version of v2.8.3 matches with the **signature-less** built binary.
The hashes of the zeroed version of v2.8.3 bitcoin-only matches with the **signature-less** built binary.

**Version 2.8.3 of the {{ page.title }} is reproducible**.

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

