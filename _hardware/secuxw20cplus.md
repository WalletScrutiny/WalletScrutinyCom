---
title: SecuX W20 C-Plus
appId: secuxw20cplus
authors:
- danny
released: 2024-12-18
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 126
- 105
- 39
weight: 200
provider: SecuX Technology Inc.
providerWebsite: https://secuxtech.com
website: >-
  https://secuxtech.com/products/secux-w20c-plus
shop: >-
  https://secuxtech.com/products/secux-w20c-plus
country: TW
price: 119USD
repository: https://github.com/secuxtech/SecuXMCU
issue: 
icon: secuxw20cplus.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-03-20
signer: 
reviewArchive: 
twitter: SecuXwallet
social:
- https://www.linkedin.com/company/secuxtech
- https://www.facebook.com/secuxtech
features: 
---

# Device Description

The SecuX W20C Plus is a hardware cryptocurrency wallet designed for cold storage of digital assets. The device features an Infineon Secure Element chip with CC EAL5+ certification for enhanced security. It utilizes a Nordic nRF52840 microcontroller unit (MCU) for processing operations.

The device has a 2.8-inch color LCD touchscreen with a resolution of 360 x 240 pixels, allowing users to view transaction details and account balances directly on the device. For connectivity, it supports Bluetooth 5 BLE and USB 2.0 via a Micro-B port.

The W20C Plus has a built-in rechargeable lithium-ion battery with 600mAh capacity, which according to the manufacturer can last for several months on standby or approximately 7 hours of continuous use. The device is constructed with textured durable plastic and has dimensions of 89 x 59 x 13 mm, weighing 62g.

The wallet supports over 8,000 cryptocurrencies and NFTs across multiple blockchains, including Bitcoin, Ethereum, and various altcoins and tokens.

## Analysis

### Private keys can be created offline

The SecuX W20C Plus allows for private key generation offline. The device is designed as a cold storage solution that generates and stores private keys completely offline, away from internet-connected devices. This helps protect against remote hacking attempts and phishing attacks.

### Private keys are not shared

According to the manufacturer, the private keys are generated and stored within the device's secure element chip and never leave the device. The Infineon Secure Element with CC EAL5+ certification is designed to securely store the private keys and protect them from unauthorized access.

### Device displays receive address for confirmation

The W20C Plus features a 2.8-inch color touchscreen that allows users to verify and confirm receiving addresses directly on the device. This provides an important security feature by enabling users to verify that the address they're sending funds to matches the one displayed on their computer or mobile device, helping to prevent man-in-the-middle attacks.

### Interface

The device uses a touchscreen interface for navigation and interaction. It features a dynamic keypad for PIN entry with automatic reset after 5 unsuccessful PIN attempts. The large touchscreen allows for clear visualization of transaction details, enabling users to verify transaction information before approval. The device can also display portfolio and account balances directly on the hardware wallet.

### Reproducibility

While SecuX has a GitHub repository (https://github.com/secuxtech/SecuXMCU) labeled as "SecuX device firmware," the repository appears to be empty with no releases or source code available for public review. This lack of accessible source code means that users cannot independently verify the firmware running on their devices or build it from source.

Without access to the complete source code and build instructions, it's impossible to reproduce the firmware and verify that the device is running the expected code. This lack of transparency raises concerns about the security and trustworthiness of the device, as users must rely entirely on the manufacturer's claims regarding the security features and implementation.

The verdict is therefore **nosource** as the complete source code necessary to build the firmware is not publicly available.
