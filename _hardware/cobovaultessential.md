---
title: "Keystone"
appId: cobovaultessential
authors:
- kiwilamb
- danny
released: 2018-03-01
discontinued: # date
updated:
version:
dimensions: 
weight: 115 g
website: https://keyst.one/
shop: 
company: Keystone
companywebsite: https://shop.keyst.one/products/keystone-essential
country: CH
price: 119USD
repository: https://github.com/KeystoneHQ
issue:
icon: cobovaultessential.png
bugbounty:
verdict: wip
date: 2021-08-08
signer:
reviewArchive:


providerTwitter: KeystoneWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 
---

**Note:** Cobovault has been renamed to Keystone, previously product were known as Cobovault Essential, Cobovault Pro and Cobovault Ultimate.

This hardware wallet has a companion app: {% include walletLink.html wallet='android/com.keystone.mobile' verdict='true' %}

## Interface - ✔️

Keystone resembles a smartphone and has a 4" touchscreen.

## Private keys can be created offline - ✔️

[From Keystone's article on Medium:](https://blog.keyst.one/keystone-product-design-principles-cd833bc11125)

> Hardware wallets isolate your private keys from the internet because physical attacks cost significantly more than remote attacks. In terms of how air-gapped your hardware wallet is and how costly it is for a hacker to steal your assets, it’s crucial how the hardware wallet connects to a companion app. Using QR codes or microSD cards for data transmission has significant advantages for air-gapping your keys compared to USB and Bluetooth, which have larger attack surfaces because they are interactive connections.

([Guide to creating a wallet](https://support.keyst.one/getting-started/setting-up-keystone-in-5-steps#1.-create-wallet))

## Private keys are not shared - ✔️

Keystone claims to be "Verifiably Air-Gapped" on the frontpage.

Information on EAL 5+ Secure Element:

> A proprietary bank-grade Secure Element ensures your private keys never leave the Keystone. The Secure Element generates a true random number for your private keys and is vital to ensuring your crypto assets are stored in the safest way possible. Our BIP32, BIP39, and BIP44 compliant firmware is also [open source.](https://github.com/KeystoneHQ)

## Device displays receive address for confirmation - ✔️

We found [an article](https://btcguide.github.io/verify-receive-address/keystone) in the user guide that states Keystone will verify receive addresses.

[A video review](https://youtu.be/4KDQqj02KK0?t=1449) about this product confirms that the device displays receive addresses for confirmation. 

## Reproducibility

Keystone claims to be open source, so we checked their Github for relevant repositories. One repository was titled ["Keystone Secure Element Firmware"](https://github.com/KeystoneHQ/keystone-se-firmware/)

This device is for verification.

