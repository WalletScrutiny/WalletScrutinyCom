---
title: Foundation Devices Passport 2
appId: foundation.passport2
authors:
- danny
released: 2021-05-14
discontinued: 
updated: 2022-04-27
version: 1.0.9
binaries: https://github.com/Foundation-Devices/passport-firmware/releases
dimensions:
- 39
- 110
- 19
weight: 453.59
provider: Foundation Devices, Inc.
providerWebsite: https://foundationdevices.com/
website: https://foundationdevices.com/passport/
shop: https://foundationdevices.com/passport/
country: US
price: 199USD
repository: https://github.com/Foundation-Devices/passport-firmware/releases
issue: 
icon: foundation.passport2.png
bugbounty: https://foundationdevices.com/security/
meta: ok
verdict: wip
date: 2022-05-19
signer: 
reviewArchive: 
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices/
- https://www.facebook.com/foundationdevices/
- https://t.me/foundationdevices

---

## Background 

{{ page.title }} is the next iteration for the {% include walletLink.html wallet='hardware/passport' verdict='true' %}. 

## Product Description 

It features the following specifications: 

> - Supported Cryptocurrencies:	Bitcoin via PSBTs; best-in-class multisig experience.
- Supported Software Wallets:	Bitcoin Core, BlueWallet, BTCPay, Casa (coming soon), Electrum, Nunchuk (coming soon), Simple Bitcoin Wallet, Sparrow, Specter, Wasabi, and other wallets supporting PSBTs via microSD or QR codes.
- Key Components:	STM processor, Microchip 608a secure element, Omnivision Cameracube.
- Communication:	Camera and microSD port. No USB data, no Bluetooth, no wireless communications of any kind.
- Power:	1200 mAh Lithium ion battery in Nokia BL-5C form factor (included with purchase).
- Security Features:	Airgapped, easy passphrase entry, security lights, anti-phishing words, supply chain verification. 

From Foundation's Twitter account: 

> - 20% thinner design
- Standard form factor lithium-ion battery
- High resolution IPS color display bonded to ultra-hard glass
- STM processor, Microchip 608a secure element, Omnivision cameracube, and an avalanche noise source for entropy
- Physical power button 
- Improved microSD slot
- Power only USB-C port
>
> Passport now ships these accessories: 
- Industrial-grade microSD card 
- Removable lithium-ion battery
- microSD adapters for iOS and Android 
- USB-C charging cable.
- Helps you securely and easily set up Passport.
- Keeps you up-to-date with firmware updates, no computer required!
- Provides quick and easy access to support resources.
- Let's you send, receive, and "boost" bitcoin transactions.
>
> Onboarding: Envoy guides the user through unboxing Passport and setting it up securely, no need for a computer
> 
> Security: Envoy primarily communicates with Passport via airgapped QR codes, ensuring that Passport is never directly connected to an online device.
>
> Privacy: Envoy connects to Foundation’s server and Bitcoin node through Tor. Envoy offers the ability to connect to your own Bitcoin node, cutting out Foundation as the middleman.

## Analysis 

[This product is for verification.](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/396)