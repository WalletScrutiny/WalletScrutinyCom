---
title: Foundation Passport
appId: passportb2
authors:
- kiwilamb
- leo
- '@sethforprivacy'
- danny
- keraliss
released: 2022-03-10
discontinued: 
updated: 2025-12-12
version: 2.3.11
binaries: https://github.com/Foundation-Devices/passport2/releases
dimensions:
- 39
- 110
- 19
weight: 128
provider: 
providerWebsite: 
website: https://foundationdevices.com/
shop: https://foundationdevices.com/passport/
country: US
price: 199USD
repository: https://github.com/Foundation-Devices/passport2
issue: 
icon: passportb2.png
bugbounty: https://foundationdevices.com/security/
meta: ok
verdict: sourceavailable
appHashes:
- 714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2
date: 2025-08-08
signer: 
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://t.me/foundationdevices
- https://www.reddit.com/r/FoundationDevices/
builds:
- arch: arm
  types:
  - mono
  - color
features:
- airGapped
- camera
- companion
- customNode
- foss
- multiSig
- secEl

---

## Background 

{{ page.title }} is the next iteration for the {% include walletLink.html wallet='hardware/passport' verdict='true' %}. 

## Product Description 

It features the following specifications: 
   
> - Supported Cryptocurrencies:	Bitcoin via PSBTs; best-in-class multisig experience.
- Supported Software Wallets:	Bitcoin Core, BlueWallet, BTCPay, Casa, Electrum, Nunchuk, Simple Bitcoin Wallet, Sparrow, Specter, Wasabi, and other wallets supporting PSBTs via microSD or QR codes.
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

{% include featureEvidence.html feature="foss" quote="GNU General Public License v3.0 (GPLv3) or later" source="GitHub README" %}

{% include featureEvidence.html feature="secEl" quote="Microchip 608a secure element" source="Existing WalletScrutiny review" %}

{% include featureEvidence.html feature="camera" quote="Communication: Camera and microSD port. No USB data, no Bluetooth, no wireless communications of any kind." source="Existing WalletScrutiny review" %}

{% include featureEvidence.html feature="airGapped" quote="Security: Envoy primarily communicates with Passport via airgapped QR codes, ensuring that Passport is never directly connected to an online device." source="Existing WalletScrutiny review" %}

{% include featureEvidence.html feature="multiSig" quote="Supported Cryptocurrencies: Bitcoin via PSBTs; best-in-class multisig experience." source="Existing WalletScrutiny review" %}

{% include featureEvidence.html feature="companion" quote="Onboarding: Envoy guides the user through unboxing Passport and setting it up securely, no need for a computer" source="Existing WalletScrutiny review" %}

{% include featureEvidence.html feature="customNode" quote="Envoy offers the ability to connect to your own Bitcoin node, cutting out Foundation as the middleman." source="Existing WalletScrutiny review" %}