---
title: One Key Mini
appId: onekeymini
authors:
- danny
- mohammad
released: 2020-12-08
discontinued: 
updated: 2024-08-12
version: 3.9.0
binaries: 
dimensions: 
weight: 
provider: Bixin
providerWebsite: 
website: https://onekey.so/
shop: >-
  https://shop.onekey.so/products/onekey-mini-hardware-wallet?variant=41169098178722
country: SG
price: 48USD
repository: https://github.com/OneKeyHQ/firmware
issue: https://github.com/OneKeyHQ/firmware/issues/579
icon: onekeymini.png
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes:
- 70134b755f3246621b67029a11c5913c782e698ccf3a36aa736e8a73832f41f0
date: 2025-03-13
signer: 
reviewArchive:
- date: 2023-07-12
  version: 3.0.0
  appHashes:
  - 88b76f05d95e6718d0bf3d4dabb12cf2403cfed91c351008441fe2a33b1cd9ae
  gitRevision: a51dc3d4e00e983c9ec22934df15bc9f09036173
  verdict: nonverifiable
- date: 2022-12-28
  version: 
  appHashes: []
  gitRevision: 
  verdict: nosource
twitter: onekeyhq
social:
- https://discord.gg/onekey
- https://weibo.com/yourKeysyourBitcoin
- https://www.reddit.com/r/OneKeyHQ/
features: 

---

## Initial Findings

We conducted a reproducibility test for OneKey Mini firmware v3.9.0 using a modified hardware-specific script. The test involved building the firmware from source code and comparing it with the official firmware downloaded from GitHub.

### Build and Download Process

We successfully built the firmware from the OneKey GitHub repository using their provided build system. The build process completed without errors, producing a firmware file named `mini.3.9.0-Stable-0321-a8b4519.bin` (where 0321 represents the build date).

We then downloaded the official firmware from GitHub using the URL:
```
https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv3.9.0/mini.3.9.0-Stable-0807-a8b4519.signed.bin
```

### Hash Comparison

We calculated SHA-256 hashes for both firmware files:
```
710186dec742eb0a27ff23a762d257a2cb60e565cc3f6fc8380a5e10f0d882b0  mini.3.9.0-Stable-0321-a8b4519.bin
70134b755f3246621b67029a11c5913c782e698ccf3a36aa736e8a73832f41f0  downloaded-firmware.bin
```

The hashes are different, which indicates that the built firmware is not bit-for-bit identical to the official firmware.

Following OneKey's documentation, we also calculated checksums excluding the first 1024 bytes (which contains the signature):
```
31ffa36ddf6221d02072245d9b7458dac908cc80f307100b2dad1f852c8d7cd0  mini.3.9.0-Stable-0321-a8b4519.bin (excluding signature)
5b506fe9c7ca702b6bf974ef1b386921b90e3825f9273dfbb98fcf0ffb053030  downloaded-firmware.bin (excluding signature)
```

Even after excluding the signature section, the hashes still differ, indicating that there are differences in the actual firmware content beyond just the signature.

### Binary Comparison

We performed a binary comparison using `cmp`, `hexdump`, and other tools. Both firmware files have identical size (979,516 bytes). The file headers and initial binary content are identical for the first 320 bytes, with the first difference occurring at byte 321.

Here's a comparison of the first few bytes of both files:
```
00000000  4d 49 4e 49 1f a4 01 08  00 00 00 00 3c ee 0e 00  |MINI........<...|
00000010  02 63 63 00 02 63 63 00  39 00 00 00 00 00 00 00  |.cc..cc.9.......|
```

The "MINI" identifier at the beginning is present in both files, confirming they are for the same device type.

Analysis of the differences revealed:

1. **First difference at byte 321**: This is within what OneKey documentation describes as the signature section (first 1024 bytes).

2. **Total differing bytes**: 295 bytes out of 979,516 bytes differ between the two firmware files (approximately 0.03% of the total).

3. **Pattern of differences**: The differences are concentrated in three main areas:
   - Early differences starting at byte 321 (likely signature-related)
   - A section around bytes 788-804 where the built firmware contains zeros
   - Later differences around byte 628694-628696

4. **Embedded version strings**: Both firmware files contain their respective build date strings:
   ```
   mini.3.9.0-Stable-0807-a8b4519  (in downloaded firmware)
   mini.3.9.0-Stable-0321-a8b4519  (in built firmware)
   ```

### Interpretation and Next Steps

Our analysis reveals that while the core firmware code appears largely identical, there are specific differences that prevent bit-for-bit verification. These differences are consistent with what we would expect from:

1. **Signature differences**: The OneKey documentation explicitly mentions that a 1024-byte signature is added to the firmware, which is verified by the bootloader at device startup.

2. **Build-specific metadata**: The build date is embedded in the firmware, causing differences between builds from different times.

3. **Potential non-deterministic build elements**: Some elements of the build process may introduce non-deterministic outputs, such as timestamps or compiler-specific artifacts.

According to OneKey's documentation, the proper verification method is to compare the firmware content excluding the first 1024 bytes (signature section). However, our test shows that even with this approach, the hashes still differ.

To make the firmware fully reproducible, we would need to:

1. Identify all sources of non-determinism in the build process
2. Modify the build environment to use deterministic compilation settings
3. Potentially separate the signature process from the build process
4. Work with OneKey to understand any intentional differences between the public source code and the released firmware

## Conclusion

Based on our testing, the OneKey Mini firmware v3.9.0 is **not verifiable** in the strict sense, as we cannot produce a bit-for-bit identical copy of the official firmware, even when following OneKey's recommended verification process of excluding the signature section.

While the differences are relatively small (295 bytes out of 979,516 bytes, or about 0.03%), they prevent complete verification. These differences are likely related to build environment specifics, timestamps, and the signature process rather than intentional code changes.

This finding is consistent with OneKey's documentation, which acknowledges that the firmware undergoes a signing process after compilation. However, the fact that differences persist even after excluding the signature section suggests additional non-deterministic elements in the build process that affect reproducibility.


## Updated Issue

We [updated the issue](https://github.com/OneKeyHQ/firmware/issues/579#issuecomment-2721075263) for the OneKeyMini reproducible build to inform the developers of our findings.

# Product Description

Not to be confused with the {% include walletLink.html wallet='hardware/onekey' verdict='true' %}, the One Key Mini supports many cryptocurrencies including: BTC, LTC, BCH, ETH, BTG, DASH, USDT, DOGE and more. It supports many DeFi protocols and can connect to Metamask.

It is also compatible with Trezor, Metamask, Exodus, Bitcoin Core + Specter, BTCPayServe, Electrum-LTC, Nano Wallet, Electrum, Mycelium, MyEtherWallet, Bitcoin Core + HWI, Electrum- DASH and EtherWall.

According to the [FAQ](https://shop.onekey.so/pages/faq), even if the device was damaged, it is possible to recover via a mnemonic phrase.

The private keys are created offline, secured and airgapped. The mnemonic phrase is provided during initial device setup.

[One Key Mini User Manual](https://help.onekey.so/hc/en-us/articles/4408289773455-OneKey-Mini-hardware-wallet-activation-tutorial)

OneKey repeatedly claims that their software and firmwares are Open Source. However, the repository linked from their website indicates that it is already [deprecated](https://github.com/OneKeyHQ/wallet-deprecated).

Digging deeper into their User Service Agreement, we find this:

> OneKeyOpen Source Code (“OneKey OSC”): means the partial software code of OneKey that Company has publicized and made open-source. Users may use (include further development) such open source software code in accordance with relevant Open Source License and notices of the Company.

The key word is "partial". Making the **source code only partially available** indicates that certain functions are not made public. This is noted in an [issue on OneKey's Github](https://github.com/OneKeyHQ/firmware/issues/17), but it has not received any attention.

Whether it's a few lines of code that references a script downloaded from another source, users simply would not know.
