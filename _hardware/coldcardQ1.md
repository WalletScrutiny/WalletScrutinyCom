---
title: Coldcard Q
appId: coldcardQ1
authors:
- danny
- keraliss
released: 2024-02-08
discontinued: 
updated: 2025-11-03
version: 1.3.5Q
binaries: https://coldcard.com/downloads/
dimensions:
- 120
- 75
- 22
weight: 93
provider: Coinkite, Inc.
providerWebsite: https://coinkite.com
website: https://coldcard.com/docs/coldcard-q/
shop: https://store.coinkite.com/store/cc-q1
country: CA
price: 239.99USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coldcardQ1.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 8f53880cde1b58a18e1b3166394a7e19e51866357ed2cbcf0aaa4dbbb9d17edc
- 2e1aad0a7a3ceb84db34322b54855a0c5496699e46e53606bfa443fcc992adec
- b7f961a8dd9a957d532da1e98b411b790fc25187c5d58f72380faaba129ca1b1
date: 2025-09-26
signer: d840fa4e83ebc7b0f961f30f68d795bed61271e2314dda4ab0eb0b8bfe7192f4
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
- https://www.linkedin.com/company/coinkite
- https://www.facebook.com/CoinKite
builds: 
features: 

---

## Product Description 

## [View the Official Documentation](https://coldcard.com/docs/coldcard-q/)
  > - The Q uses exactly the same security model as the Mk4 COLDCARD, with dual multi-vendor secure elements.
  > - QWERTY Keyboard: ideal for long BIP-39 passphrases.
  > - 320x240 pixel LCD screen, 3.2" diagonal size. Four times Mk4 size.
  > - Battery powered by 3x AAA cells (or USB). Airgapped and/or wireless!
  > - Dual MicroSD slots (push-pull type, not spring loaded).
  > - QR Code scanner done right™, with LED illumination and advanced scanning algorithms and serial interface.
  > - NFC communication, like Mk4
  > - Includes internal storage for spare MicroSD cards.
  > - USB data & NFC data can be irreversibly blocked, by cutting a PCB trace: it permanently disable USB data and/or NFC data.
  > - Specifically, the COLDCARD uses Microchip's ATECC608 and Maxim's DS28C36B, to store the critical master secret: the 24-word seed phrase for your BIP39 wallet.
  > - During boot-up, the firmware's signature, and nearly every byte of flash memory, will be verified and the appropriate Green/Red light set.
  > - The PIN code on COLDCARD is divided into two parts, such as 1234-5678. You first enter 1234 and then you will be shown two words on-screen. Those words are unique for all PIN prefixes, and for each COLDCARD ever made.
  > - You may define an optional "duress PIN code". If anyone enters that PIN code, instead of the "real" PIN code, nothing special is shown on the screen and everything operates as normal... However, the bitcoin key generated is not the main key. It is effectively a completely separate wallet 

## Analysis 

It passes all criteria:

### 1. Private keys can be created offline ✅ 

> COLDCARD never needs to touch a computer. It can work entirely from a USB power pack or AC power adapter.

### 2. Private keys are not shared ✅ 

> If you don't trust our random number generator, you can generate the BIP39 seed phrase using dice rolls. We help with this process: you just have to press 1–6 for each roll (99 rolls recommended). At the end of that process, you'll have a properly-encoded seed phrase based solely on the dice rolls.

### 3. Device displays receive address for confirmation ✅

> Yes. See documentation [here](https://coldcard.com/docs/q-quick/).

### 4. Interface ✅

  - 320x240 LCD screen   
  - QWERTY keyboard

This device is **source available.**
