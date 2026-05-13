---
title: SafePal S1
appId: safepals1
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 110
- 97
- 32
weight: 119
provider: SafePal
providerWebsite: https://www.safepal.io
website: https://shop.safepal.io/products/safepal-hardware-wallet-s1-bitcoin-wallet
shop: https://shop.safepal.io/products/safepal-hardware-wallet-s1-bitcoin-wallet
country: CH
price: 49.99USD
repository: https://github.com/SafePalWallet/safepal-s1
icon: safepals1.png
bugbounty: 
meta: ok
verdict: nosource
date: 2025-12-23
signer: 
twitter: iSafePal
social: 
builds: 
features:
- airGapped
- camera
- secEl

---

**Update 2025-12-23:** At the prodding of a concerned bitcoiner in our discord channel, we decided to take a look at the repository again.

We cloned the repository and had codex analyze it. These are the results:

> The code in this repository undeniably targets the SafePal S1 hardware wallet, but what you have here is primarily the user interface and workflow logic. You can see the onboarding path checking the secure element and warning “The device is broken, please contact the SafePal team for help” while it generates mnemonics, the QR processing routines decode Wallet.BitcoinSignRequest messages, and the MiniGUI app entry boots the wallet UI. The QR binding code fills in device metadata such as product brand, type, name, and secure-element firmware version, and the OTA routine even formats storage with a SafePal-branded FAT label before sharing it over USB. Device-level code performs secp256k1 handshake verification against the secure element, and the secure API modules expose seed state, account IDs, and mnemonic flags—definitive signs this is actual wallet firmware logic rather than a mock-up.

> Despite that, there is absolutely no guidance on how to compile or reproduce the firmware.  README.md contains only the project name, and there are no Makefiles, CMake files, build scripts, CI configs, or dependency documentation anywhere in the tree. Without toolchain instructions, version pinning, or reproducibility artifacts (hash manifests, deterministic build settings, signing procedures), there is no way to build a binary or confirm it matches official releases. Reproducing vendor firmware would require knowing the exact cross-compiler, miniGUI version, protobuf tooling, QR libraries, and secure-element SDK they used—none of which are provided.

> The repository is also incomplete: it depends on headers and libraries that are missing from this tree. Files across the codebase include <bip39.h>, <bip39_english.h>, and crypto/secp256k1.h, but there are no such files anywhere under firmware/, so compilation would fail immediately. Key product configuration macros like DEVICE_PRODUCT_SERIES and DEVICE_PRODUCT_NAME come from a platform.h that is likewise absent. Because the tree lacks the build system, hardware-abstraction layers, crypto libraries, and Secure Element SDK required to produce firmware images, this folder is only a partial snapshot of the SafePal S1 application layer, not a complete firmware repository.

An incomplete repository with some files missing, coupled with the lack of documentation, **does not qualify this hardware device as source-available**.


**Update 2024-12-08:** Years later, no change to the source availability was found.

The SafePal S1 can generate seed phrases upon setup, display and sign transactions, and claims to have a "100% offline air-gapped signing mechanism."

Video from the official channel explaining [how to set up the wallet](https://www.youtube.com/watch?v=nM8CvdyTFx8). 
Video from a different channel demonstrating how to make [transactions.]((https://www.youtube.com/watch?v=7MGlcmQTCfs))

## Security Flaws found by Kraken Security Labs

Kraken Security Labs tested SafePal for flaws. Their findings are published in [this blogpost.](https://blog.kraken.com/post/7874/kraken-security-labs-finds-flaws-in-safepal-s1-hardware-wallet/)

[SafePal responded to these findings in a blogpost of their own.](https://blog.safepal.io/our-response-to-the-security-findings-from-kraken-security-labs/)

One of Kraken's findings involved open-source licensing violations:

> The wallet contains the GPLv2 licensed U-Boot and Linux Kernel. The use of these GPL-licensed components requires Safepal to distribute the source code for their product so that users can inspect and modify the code running on the user’s device. We requested the source code from Safepal but they refused to provide it, which means that Safepal is violating GPL licensing. Violations like this have resulted in litigation and we have urged Safepal to disclose their source code. 

In turn, SafePal stated that the hardware wallet's firmware "will be open-sourced in 2021."

> As shared in many previous public meetups, speeches, and AMAs, open-source has always been a key milestone on the SafePal roadmap, and SafePal S1 Hardware Wallet will be open-sourced in 2021.
>
> There have been a lot of debates about a wallet being open-sourced. Open-source enables the public to review the codes and inform the companies that own the code if there are any errors. It also allows malicious attempts such as copying and editing the code into a malicious version with a small effort. Considering this, open-source is a double-sided sword. SafePal has always taken this issue seriously and carefully. This year, SafePal will open-source the critical parts in the SafePal S1 Hardware Wallet for users to verify our security. Details will be disclosed when the time comes.

As of 2022-05-27, the SafePal S1's source code is unforunately still **not available for review.**

{% include featureEvidence.html feature="secEl" quote="CC EAL6+ secure element" source="Website" %}

{% include featureEvidence.html feature="camera" quote="Sign transactions via scanning QRcode" source="Website" %}


{% include featureEvidence.html feature="airGapped" quote="Enjoy secure cold storage options with the fully air-gapped SafePal S1 line" source="Website" %}