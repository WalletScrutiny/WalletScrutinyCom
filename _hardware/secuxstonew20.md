---
title: SecuX STONE W20
appId: secuxstonew20
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 59
- 89
- 13
weight: 62
provider: SecuX Technology Inc.
providerWebsite: https://secuxtech.com
website: >-
  https://shop.secuxtech.com/products/w20-hardware-wallet-for-computer-mobile-user/
shop: >-
  https://shop.secuxtech.com/products/w20-hardware-wallet-for-computer-mobile-user/
country: TW
price: 119USD
repository: 
issue: 
icon: secuxstonew20.png
bugbounty: 
meta: ok
verdict: wip
date: 2021-12-08
signer: 
reviewArchive: 
twitter: SecuXwallet
social:
- https://www.linkedin.com/company/secuxtech
- https://www.facebook.com/secuxtech

---

The device can be paired with a mobile phone app via Bluetooth:

{% include walletLink.html wallet='android/com.secux.mobile' verdict='true' %}

## Private keys can be created offline - ✔️

From the [SecuX manual](https://secuxtech.com/secuxtech-download/User-Manual/SecuX-User-Manual-2020.pdf)

> 2. Device Initialization
When the device leaves the factory, there is no private key pre-set in the device. You will be asked to generate your own unique private key or restore an existing private key (using recovery words) during device initialization.

## Private keys are not shared - ✔️

The device has a tamper seal that changes its appearance when the device is first opened. Therefore, when the device is first initialized, the private keys that are generated never leave the device. 

> equipped with an Infineon SLE solid Flash CC EAL5+ Secure Element chip, which is used to securely store your unique PIN and Private Key. It enables zero transaction leakage and your transactions are verified without the private key ever leaving the device. The Infineon Secure Element Chip also comes with a security feature: self-destructive mechanism when exposed to light, in case someone wants to break into your wallet and steal the data inside.

From [Security FAQs](https://secuxtech.com/faq/).

## Device displays receive address for confirmation - ✔️

As shown on this [youtube screengrab](https://twitter.com/BitcoinWalletz/status/1466344015670898693) The display can adequately display the receiving address for confirmation.

## Interface

The SecuX Stone W20 has a 2.8 inch color touchscreen which is wide enough to display confirmation as well as other wallet interface necessities.

## Reproducibility

Secuxtech does not have any text on their page claiming that their hardware wallet is open source. However, they do have a repository named ['SecuX Device Firmware'](https://github.com/secuxtech/SecuXMCU).

It may be worth looking into.

