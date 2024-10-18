---
title: CoinKite Q1
appId: coinkite.q1
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 120
- 75
- 22
weight: 93
provider: CoinKite, Inc.
providerWebsite: https://coinkite.com/
website: https://coldcard.com/docs/coldcard-q/
shop: https://store.coinkite.com/store/cc-q1
country: CA
price: 199.99 USD
repository: https://github.com/Coldcard/firmware/tree/master/stm32/COLDCARD_Q1
issue: 
icon: coinkite.q1.png
bugbounty: 
meta: ok
verdict: wip
date: 2024-10-18
signer: 
reviewArchive: 
twitter: COLDCARDwallet
social:
- https://www.linkedin.com/company/coinkite
- https://www.facebook.com/CoinKite 
features: 

---


<iframe width="560" height="315" src="https://www.youtube.com/embed/bpV-lrXoZao?si=t1LVbNO5BD18jP_s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

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

### 5. Reproducibility

This product is **for verification**