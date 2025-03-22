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
verdict: nonverifiable
appHashes:
- 7abe5344e816cd9809003273ec90d1d8e5f525e3a809168e1932232550527184
- 3a0228ae58bfd65ba341b33a34138d0d70a9a16f5d2db387f9ee2659d797dedf
- ac995c394f7a7b3ea4cbd9c04977621d6d2fbef30bba856f707f585f34866ac4
- 5e7e45efcdbeac25613048a8ccc7de9a36fd7746325e75ab8d908ebfa723f552
- 899e58b02cc062b0b20d983bc1240321afe0531dc6d8508c56fac8a53d9b0a4d
date: 2025-03-22
signer: 
reviewArchive:
- date: 2025-02-06
  version: 2.8.7
  appHashes:
  - 4f6369f2932f017d8960580aec0907b73ebb4feff43fc5c6f697ddebb3a23628
  - 14b457d32f979b51482c350d0e33a3c372511010c84810b01031d752135838de
  - 01fdef4c3cfbe78d203953c65604d8d406373a0d3b26bbb8f7d3cf2250397777
  - 6d932e5200927b6eeebc9b8700effde957a9880774944bcc028b0cbac85e7f6a
  - 9e1bc9773194df462a2350108da1cc4f5a70149b93affcb363c5b96c14b30a4d
  gitRevision: 31fd1509f85ae00ab0eb986a713784ceb65fb033
  verdict: reproducible
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

## Updated Review 2025-03-20

We were able to create a script for the Trezor Safe 5 with the build instruction, that would automate the process.

`./scripts/test/hardware/trezorSafe5.sh 2.8.9`

```
Built from commit 5dad921af0c300f4adcd7e738b0098bbb1959d4f

Fingerprints:
0d0453057e23070212a7626ab7fd601f72b73e191256c63ddbf2734742a0de04 build/core-T2B1/bootloader/bootloader.bin
f6e03b48ab163f302bb886da197b6a0e7b390efdc5815b419535c5dee5cac1f7 build/core-T2B1/firmware/firmware.bin
0d0453057e23070212a7626ab7fd601f72b73e191256c63ddbf2734742a0de04 build/core-T2B1-bitcoinonly/bootloader/bootloader.bin
bde9c5ef485548746150e07a9c5081c25f2bdf127707a41f3c487ca83a6c0667 build/core-T2B1-bitcoinonly/firmware/firmware.bin
5df0ff6efe28f68dd4411629c8dc9d430bd5996d5a1e5118091c266e46d375a1 build/core-T2T1/bootloader/bootloader.bin
ec61dba50be195f1cbb78688a0b92fb293c23150b68f5dab3b44420a106fca17 build/core-T2T1/firmware/firmware.bin
5df0ff6efe28f68dd4411629c8dc9d430bd5996d5a1e5118091c266e46d375a1 build/core-T2T1-bitcoinonly/bootloader/bootloader.bin
e5878fa067df9d1256cdcd86f10869930d85e090c39f807c23f8845472e8d995 build/core-T2T1-bitcoinonly/firmware/firmware.bin
7abe5344e816cd9809003273ec90d1d8e5f525e3a809168e1932232550527184 build/core-T3T1/bootloader/bootloader.bin
3a0228ae58bfd65ba341b33a34138d0d70a9a16f5d2db387f9ee2659d797dedf build/core-T3T1/firmware/firmware.bin
7abe5344e816cd9809003273ec90d1d8e5f525e3a809168e1932232550527184 build/core-T3T1-bitcoinonly/bootloader/bootloader.bin
ac995c394f7a7b3ea4cbd9c04977621d6d2fbef30bba856f707f585f34866ac4 build/core-T3T1-bitcoinonly/firmware/firmware.bin
c7ad5cec5236e57c334bb32f3db92fc7a6d14d3ffeb61e4b226381c35579e6e1 build/legacy-T1B1/firmware/firmware.bin
dcf72d0d7e4215dced5f2823bd36d83132fece1a561ff50e875163b427e1fbf8 build/legacy-T1B1-bitcoinonly/firmware/firmware.bin
Hash of non-signature parts downloaded/compiled standard:
65+0 records in
65+0 records out
65 bytes copied, 0.000178624 s, 364 kB/s
5e7e45efcdbeac25613048a8ccc7de9a36fd7746325e75ab8d908ebfa723f552  trezor-t3t1-2.8.9.bin.zeroed
5e7e45efcdbeac25613048a8ccc7de9a36fd7746325e75ab8d908ebfa723f552  build/core-T3T1/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
65+0 records in
65+0 records out
65 bytes copied, 0.000192308 s, 338 kB/s
899e58b02cc062b0b20d983bc1240321afe0531dc6d8508c56fac8a53d9b0a4d  trezor-t3t1-2.8.9-bitcoinonly.bin.zeroed
899e58b02cc062b0b20d983bc1240321afe0531dc6d8508c56fac8a53d9b0a4d  build/core-T3T1-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
a511126fd1a10f761a6745a2cb6c0a113c3b37b29ea87d1a724581e6b6624d2e  trezor-t3t1-2.8.9.bin
5763be9adf78ed2a1bcc7781d4fc720dbe2d5905bf9ec4ad12bf81aaaa699ffb  trezor-t3t1-2.8.9-bitcoinonly.bin
```
In the development of the Trezor Safe 5 firmware version 2.8.9, we encountered a significant bootloader verification challenge:

The changelog indicates firmware 2.8.9 includes bootloader version 2.1.10. When building from firmware 2.8.9 (core/v2.8.9), the embedded bootloader produces a hash:
```
0d0453057e23070212a7626ab7fd601f72b73e191256c63ddbf2734742a0de04
```

But when building bootloader 2.1.10 directly (core/bl2.1.10) with the command `./build-docker.sh --models T3T1 --targets bootloader core/bl2.1.10`, we get a different hash:
```
Fingerprints:
ed1b9225088ed0c260318cfc61b8661dceb80eff92f9889b0b93b30be9772bfd build/core-T3T1/bootloader/bootloader.bin
ed1b9225088ed0c260318cfc61b8661dceb80eff92f9889b0b93b30be9772bfd build/core-T3T1-bitcoinonly/bootloader/bootloader.bin
```

The hash mismatch between the firmware-embedded bootloader and our directly built bootloader raises some uncertainties about reproducibility. Without detailed documentation of Trezor's bootloader signing process or access to their signed bootloader binaries, it's challenging to determine whether this difference is due to signing, build parameters, or other factors.  

While the firmware itself appears reproducible (as the zeroed firmware hashes match), verifying the bootloader remains inconclusive. This highlights the potential benefit of more transparency around the bootloader build and signing process.

**Version 2.8.9 of the {{ page.title }} is non-verifiable**.

{% include asciicast %}


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
