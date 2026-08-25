---
title: Coldcard Q
appId: coldcardQ1
authors:
- danny
- keraliss
released: 2024-02-08
discontinued: 
updated: 2026-08-20
version: 1.5.1Q
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
icon: coldcardQ1.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-26
signer: d840fa4e83ebc7b0f961f30f68d795bed61271e2314dda4ab0eb0b8bfe7192f4
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
- https://www.linkedin.com/company/coinkite
- https://www.facebook.com/CoinKite
builds: 
features:
- airGapped
- camera
- hd
- multiSig
- nfc
- secEl

---

<div class="alertBox"><div>
⚠️ Warning (2026-08-02): Seeds generated on this device with firmware before 1.5.0Q (Edge 6.6.0QX) have as little as ~72 bits of entropy instead of the intended 128 and may be predictable. Updating the firmware does not repair a seed that was already created — Coinkite advises updating, generating a new seed on the fixed firmware, and moving any funds to it. Seeds are not affected by this issue alone only if at least 50 fair, independent, private dice rolls were added when the seed was created, those rolls were never recorded or otherwise exposed, and the seed words used are the ones shown after adding them. You must roll physical dice yourself and enter each result — the device does not generate the rolls for you. See <a href="https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/">Coinkite's security advisory</a> and the <a href="https://coldcard.com/docs/upgrade/">official firmware update instructions</a>.
</div> </div>

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

{% include featureEvidence.html feature="secEl" quote="The Q uses exactly the same security model as the Mk4 COLDCARD, with dual multi-vendor secure elements." source="Website" %}

{% include featureEvidence.html feature="camera" quote="QR Code scanner done right™, with LED illumination and advanced scanning algorithms and serial interface." source="Website" %}

{% include featureEvidence.html feature="nfc" quote="NFC communication, like Mk4" source="Website" %}

{% include featureEvidence.html feature="airGapped" quote="Battery powered by 3x AAA cells (or USB). Airgapped and/or wireless!" source="Website" %}

{% include featureEvidence.html feature="hd" quote="Specifically, the COLDCARD uses Microchip's ATECC608 and Maxim's DS28C36B, to store the critical master secret: the 24-word seed phrase for your BIP39 wallet." source="Website" %}

{% include featureEvidence.html feature="multiSig" quote="Multisig Features" source="Website" %}