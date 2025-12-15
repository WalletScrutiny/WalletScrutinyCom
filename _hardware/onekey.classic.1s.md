---
title: OneKey Classic 1S
appId: onekey.classic.1s
authors:
- danny
released: 2024-04-01
discontinued: 
updated: 2025-11-11
version: 3.15.0
binaries: 
dimensions:
- 86
- 52
- 5.2
weight: 20.5
provider: Bixin
providerWebsite: https://onekey.so/
website: https://onekey.so/products/onekey-classic-1s-hardware-wallet/
shop: https://shop.onekey.so/products/onekey-classic-1s
country: SG
price: 99USD
repository: https://github.com/OneKeyHQ/firmware-classic1s
issue: 
icon: onekey.classic.1s.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2025-08-20
signer: 
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
builds: 
features: 

---

## Device Description

The **OneKey Classic 1S** is the upgraded version of the original: {% include walletLink.html wallet='hardware/onekey' verdict='true' %} introduced in 2024 with the addition of a **bank-grade EAL 6+ secure element** for improved hardware-level security ([Cointelegraph](https://cointelegraph.com/press-releases/onekey-unveils-new-crypto-hardware-wallets-with-eal-6-secure-element)).

OneKey’s official product page notes: *“Each transaction, secured by EAL 6+ certified chips”*, highlighting the main difference from the original Classic which lacked this feature ([OneKey Product Page](https://onekey.so/products/onekey-classic-1s-hardware-wallet/)).

The device retains a slim profile at **5.2 mm** thickness and weighs **20.5 g** ([OneKey Shop Listing](https://shop.onekey.so/products/onekey-classic-1s)).

Independent reviewers confirm that the Classic 1S integrates **two secure chips (SE and MCU)**, ensuring keys are generated and stored offline and that all transactions require physical confirmation on the device ([Crypto-Corner Review](https://crypto-corner.com/2025/07/27/hardware-wallets-in-2025-onekey-classic-review/)).

## Verification

### Private keys can be created offline

OneKey states that private keys are generated and stored entirely within the secure element, never leaving the device:  
> “The private keys of OneKey are all created offline, avoid cyber attacks completely.”  
([OneKey FAQ](https://help.onekey.so/hc/en-us/articles/6113121891599))

### Private keys are not shared

According to OneKey’s documentation:  
> “Wallet helpers and seeds created with OneKey are stored locally and encrypted, so only you can decrypt the information, and our servers do not and cannot store any of the user's private data.”  
([OneKey Blog](https://onekey.so/blog/ecosystem/stay-safe-no-hacks-malware-or-phishing/))

### Device displays receive address for confirmation

OneKey’s FAQ states:  
> “The physical buttons and display screen can provide complete protection even if the computer or mobile phone is implanted with malicious viruses, the transaction information needs double check on hardware device then signed for release. Software side cannot tamper it.”  
([OneKey FAQ](https://shop.onekey.so/pages/faq))


### Interface

Yes — the OneKey Classic 1S has both a **screen** (1.3-inch OLED) and **physical buttons** for transaction confirmation ([OneKey Product Page](https://onekey.so/products/onekey-classic-1s-hardware-wallet/), [OneKey FAQ](https://shop.onekey.so/pages/faq)).


### Reproducibility

The firmware for the Classic 1S is maintained in a separate repository: [OneKeyHQ/firmware-classic1s](https://github.com/OneKeyHQ/firmware-classic1s).

According to a OneKey developer in the project’s Discord:  
> “Classic 1S and Classic Pure are the same code, but Classic is different code.”  
(*Source: OneKey Discord, user “loatheb”, Aug 2025*)  

This device is **source-available** and subject **for-verification**
