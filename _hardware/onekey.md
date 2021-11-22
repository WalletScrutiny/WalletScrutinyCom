---
title: "OneKey - Limited Edition"
appId: onekey
authors:
- kiwilamb
- danny
released: 
discontinued: # date
updated:
version:
dimensions: 
weight: 
website: https://onekey.so/en-US/hardware
shop: https://onekey.so/en-US/hardware
company: Bixin
companywebsite: https://onekey.so/
country: CN
price: 499CNY
repository: https://github.com/OneKeyHQ/OneKey-Wallet
issue:
icon: onekey.png
bugbounty:
verdict: wip
date: 2021-08-03
signer:
reviewArchive:


providerTwitter: OneKeyHQ
providerLinkedIn: 
providerFacebook: 
providerReddit: OneKeyHQ
---


OneKey is an open source hardware wallet by Bixin. The primary language for the website is Chinese. OneKey, the company claims to be based in Singapore

## Private keys are created offline - ✔️

From the [FAQ](https://shop.onekey.so/pages/faq)

> Number 5. The private keys of OneKey **are all created offline**, avoid cyber attacks completely. The physical buttons and display screen can provide complete protection even if the computer or mobile phone is implanted with malicious viruses, the transaction information needs double check on hardware device then signed for release. Software side cannot tamper it， private key is more secure throughout.

## Private keys are not shared with OneKeyHQ - ✔️

OneKey claims that the private keys are only [controlled by the user](https://help.onekey.so/hc/en-us/articles/360002184256-Why-Use-OneKey-Hardware-Wallets-to-Manage-Private-Keys-)

> Wallet helpers and seeds created with OneKey are **stored locally and encrypted, so only you can decrypt the information, and our servers do not and cannot store any of the user's private data**. No more centralized institutions, you are in full control of your encrypted assets.

## Device displays receive address for confirmation - ✔️

[Tutorial on how to withdraw coins to OneKey](https://help.onekey.so/hc/en-us/articles/4408458838799-How-to-withdraw-coins-from-exchanges-to-OneKey-Mini-hardware-wallet)

OneKey has a 1.54 Inch OLED with 128 x 64 pixels. 

From the renderings provided on this [page](https://help.onekey.so/hc/en-us/articles/360004487195-OneKey-classic-hardware-wallet-activation-tutorial), the OneKey hardware wallet has a confirmation button.

However, this is from the official documentation. We were not able to find third-party content such as pictures or videos on social media or blogs that depicts the actual device.

## Interface 

Activating the wallet starts with the device providing the mnemonics and then securing it with a pin. 

The wallet activation tutorial can be found [here](https://help.onekey.so/hc/en-us/articles/360004487195-OneKey-classic-hardware-wallet-activation-tutorial).

Incorrectly entering the pin code 10 times, resets the wallet.

The wallet can then be connected to the OneKey [Desktop client](https://onekey.so/download?client=desktop) or through a [browser plug-in](https://onekey.so/plugin).

## Reproducibility

OneKey [claims that their software code and firmware codes are open source](https://help.onekey.so/hc/en-us/articles/360002184256-Why-Use-OneKey-Hardware-Wallets-to-Manage-Private-Keys-). 

> Our code is fully and publicly hosted at Github.

Creating an issue for verification.