---
title: SecuX Shield Bio
appId: secuxshieldbio
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 170
- 100
- 28
weight: 8
provider: SecuX
providerWebsite: 
website: https://secuxtech.com
shop: https://secuxtech.com/products/shield-bio
country: TW
price: 149 USD
repository: 
issue: 
icon: secuxshieldbio.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: '2024-09-03'
signer: 
reviewArchive: 
twitter: SecuXwallet
social:
- https://www.facebook.com/secuxtech
- https://www.instagram.com/secuxtechnology
features: 

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/NlMizqYqlpQ?si=qMNQA_2wVTtUAcRP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Product Specifications

- **Secure Element Chip:** Infineon SLE 97
- **Chip certification:** EAL5+
- MCU

- **Screen type:** E-paper
- **Display size:** 1.1"
- **Resolution:** 148 x 70 pixels

- **Bluetooth® 5 BLE**
- **Supported Assets:** 10,000 NFTs, tokens and coins

## Companion Apps:

- **Android:** {% include walletLink.html wallet='android/com.secuxapp' verdict='true' %}
- **IPhone:** {% include walletLink.html wallet='iphone/com.secuxtech.secuxcess2' verdict='true' %}

## Analysis

### Private keys can be created offline

Yes, and they are displayed on the [actual device.](https://secuxtech.com/community/how-it-works/shield-bio/setup-a-new-wallet?srsltid=AfmBOoodaW2E5KQ9EZ95QMYduTpYw9MRh3oLgUI--mzSLErJtoVmj1PE#download-app) 

### Private keys are not shared and the device displays the receive address for confirmation. 

The device connects via bluetooth to the mobile app and the keys are not shared. This is seen in [this guide.](https://secuxtech.com/community/how-it-works/send-and-receive-shield-bio/send-funds-on-mobile)

### The transaction confirmation commences after tapping "confirm" in the fingerprint pad

Despite the existence of [SecuXtech's organization](https://github.com/secuxtech) page on GitHub, the device's firmware is **not source-available** and is proprietary.

