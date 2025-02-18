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
repository: https://github.com/SafePalWallet/safepal-x1
issue: 
icon: safepals1.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-12-08
signer: 
reviewArchive: 
twitter: iSafePal
social: 
features: 

---

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