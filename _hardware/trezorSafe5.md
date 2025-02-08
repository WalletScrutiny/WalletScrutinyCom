---
title: Trezor Safe 5
appId: trezorSafe5
authors:
- danny
- keraliss
released: 2024-06-14
discontinued: 
updated: 2024-09-19
version: 2.8.7
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
issue: https://github.com/trezor/trezor-firmware/issues/4586
icon: trezorSafe5.png
bugbounty: https://trezor.io/learn/a/how-to-report-an-issue
meta: ok
verdict: reproducible
appHashes:
- 4f6369f2932f017d8960580aec0907b73ebb4feff43fc5c6f697ddebb3a23628
- 14b457d32f979b51482c350d0e33a3c372511010c84810b01031d752135838de
- 01fdef4c3cfbe78d203953c65604d8d406373a0d3b26bbb8f7d3cf2250397777
- 6d932e5200927b6eeebc9b8700effde957a9880774944bcc028b0cbac85e7f6a
- 9e1bc9773194df462a2350108da1cc4f5a70149b93affcb363c5b96c14b30a4d
date: 2025-02-06
signer: 
reviewArchive:
- date: 2024-12-13
  version: 2.8.6
  appHashes:
  - 197197aba0f412a74be96a2a6ad1537437cee67e517bd94d1cb776c263a37ffe
  - 78a69afb22d7c0704bd40479bde3ee2d15c390a1819129cf5954643d8d65e0fc
  - 73c8e70fc6785616574cb7d1ac274f3cea596870dff2316d3599adde1b4f2eb2
  - 538515eb83558832356340ef198559ca14fa5a70220b14e2fb06dc3c8fef5d03
  gitRevision: 4458285efc54bd9bc76d74f88e696201a4af4a93
  verdict: reproducible
- date: 2024-10-14
  version: 2.8.3
  appHashes:
  - dfabe8b10368f268cedaa505e284192329f489519dd71feb5fba7d610ef748fc
  - 83677f634f29e0f066153b599c25a8047729608d555f4c289b91df726472fd5d
  gitRevision: 738417cd47c4721457816c5a6a7891cd212a35c6
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

## Reproducible Build Verification for v2.8.7 (2025-01-15)

Initially, we attempted to build manually, but ran into problems when it came to signature zeroing. We filed GitHub issue [4254](https://github.com/trezor/trezor-firmware/issues/4254) so we can be aware of the appropriate values. After several tests, this got resolved and we would be closing the issue after our final test. 

We were able to create a script for the Trezor Safe 5, that would automate the process.

### Build Results

```
Built from commit 6efd33909b0ac2870773d9ef7c62c74cfa74deb9

Fingerprints:
4f6369f2932f017d8960580aec0907b73ebb4feff43fc5c6f697ddebb3a23628 build/core-R/bootloader/bootloader.bin
554c6586df79e1281dd377bfb99d7b2594dbac66d749837c6a78b9c5e0751098 build/core-R/firmware/firmware.bin
4f6369f2932f017d8960580aec0907b73ebb4feff43fc5c6f697ddebb3a23628 build/core-R-bitcoinonly/bootloader/bootloader.bin
6381f8a373f9f91a3cf4000a762b8dbf553d11a4a6d433c8863b2fa9eecfd9f1 build/core-R-bitcoinonly/firmware/firmware.bin
14b457d32f979b51482c350d0e33a3c372511010c84810b01031d752135838de build/core-T/bootloader/bootloader.bin
7f7bae53913c3a339f22adddb16db70b11bcf908af1c7a5986bae09af9d4ab62 build/core-T/firmware/firmware.bin
14b457d32f979b51482c350d0e33a3c372511010c84810b01031d752135838de build/core-T-bitcoinonly/bootloader/bootloader.bin
7bdf5de0c00c5d15c06d526a5b0d22cfd8343eb3e7aa01ee3c4ed60dd063bbf1 build/core-T-bitcoinonly/firmware/firmware.bin
01fdef4c3cfbe78d203953c65604d8d406373a0d3b26bbb8f7d3cf2250397777 build/core-T3T1/bootloader/bootloader.bin
be15ee1f4b7891dc965512455f8d17067ff54a7047e28ed06cec8d56529ab2ef build/core-T3T1/firmware/firmware.bin
01fdef4c3cfbe78d203953c65604d8d406373a0d3b26bbb8f7d3cf2250397777 build/core-T3T1-bitcoinonly/bootloader/bootloader.bin
2f58de2b7c2c29b6a2f14909ad0941e4aa9dd6d3e1416ab66c512a743b5385a9 build/core-T3T1-bitcoinonly/firmware/firmware.bin
Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 0.000296925 s, 219 kB/s
6d932e5200927b6eeebc9b8700effde957a9880774944bcc028b0cbac85e7f6a  trezor-t3t1-2.8.7.bin.zeroed
6d932e5200927b6eeebc9b8700effde957a9880774944bcc028b0cbac85e7f6a  build/core-T3T1/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.0002154 s, 302 kB/s
9e1bc9773194df462a2350108da1cc4f5a70149b93affcb363c5b96c14b30a4d  trezor-t3t1-2.8.7-bitcoinonly.bin.zeroed
9e1bc9773194df462a2350108da1cc4f5a70149b93affcb363c5b96c14b30a4d  build/core-T3T1-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
88eccdabe9085ba49eb60bd72f99d466b0209b4288d9a5963e8c351406b42773  trezor-t3t1-2.8.7.bin
b8c6b6c2187c88d32805b77da4661c65298a30a5f350f1086f888f0854c1f9ec  trezor-t3t1-2.8.7-bitcoinonly.bin
```

The hashes of the zeroed version of v2.8.7 matches with the **signature-less** built binary.
The hashes of the zeroed version of v2.8.7 bitcoin-only matches with the **signature-less** built binary.

**Version 2.8.7 of the {{ page.title }} is reproducible**.


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
