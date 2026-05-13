---
title: Digital Shield Pro Hardware Wallet
appId: digitalshieldpro
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 82
- 51
- 8
weight: 69
provider: YuhengNetwork Technology Co., Limited
providerWebsite: https://ds.pro
website: https://ds.pro
shop: https://ds.pro/product/detail
country: HK
price: 199USD
repository: 
icon: digitalshieldpro.png
bugbounty: 
meta: ok
verdict: nosource
date: 2026-05-01
signer: 
twitter: DigitShield_HQ
social:
- https://discord.com/invite/digitshield
- https://www.youtube.com/@DigitalShield-s6j
- https://www.facebook.com/profile.php?id=61577514952314
- https://t.me/DigitaShield
builds: 
features:
- camera
- secEl

---

This product has a companion app: {% include walletLink.html wallet='android/com.dswallet.app' verdict='true' %}.

## App Description

The Digital Shield Pro is a hardware signing device priced at $199, featuring a 4.07" LCD touchscreen (480×800), an STM32H747 dual-core processor, a THD89 EAL6+-certified secure element, a GC0308 300K-pixel camera for QR scanning, and a 620mAh battery. The official product page states that all signing data is exchanged solely through QR codes with no Bluetooth, USB, or WiFi connectivity. The device is manufactured and operated by YuhengNetwork Technology Co., Limited (Hong Kong), as stated in the website's copyright notice and terms of use.

## Device Analysis

The product page's claim of "No Bluetooth. No USB. No WiFi." is directly contradicted by the device's own technical specification sheet, which lists an nRF52832 Bluetooth 5 chip; the companion Android app's Play Store description also states the device "supports Bluetooth pairing." No firmware source code or binary releases are publicly available on the official website or the `dswallet` GitHub organization (`github.com/dswallet`), which contains only backend microservice libraries unrelated to device firmware.

## Analysis

The THD89 is a commercially available EAL6+-certified secure element; its presence in the spec sheet is verifiable, but without firmware source code it is not possible to confirm that private key material is generated and stored solely within the chip as claimed. The contradiction between the product page's "no Bluetooth" claim, the hardware spec listing a Bluetooth chip, and the Play Store companion app description referencing Bluetooth pairing, raises questions that cannot be resolved without access to firmware source code or independent hardware analysis.

This device's firmware is **not source-available**.

{% include featureEvidence.html feature="camera" quote="Camera: GC0308 — 300K-pixel fixed-focus, 30FPS scanning" source="[ds.pro product specification sheet](https://ds.pro)" %}

{% include featureEvidence.html feature="secEl" quote="Secure Element: THD89 — EAL6+ certified secure element" source="[ds.pro product specification sheet](https://ds.pro)" %}
