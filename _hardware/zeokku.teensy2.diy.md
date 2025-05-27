---
title: Zeokku Teensy 2.0 DIY Hardware Wallet
appId: zeokku.teensy2.diy
authors:
- danny
released: 2022-02-14
discontinued: 
updated: 2022-02-28
version: 
binaries: 
dimensions:
- 150
- 120
- 9.9
weight: 9.07
provider: Zeokku
providerWebsite: https://zeokku.com/
website: 
shop: 
country: 
price: 
repository: https://github.com/zeokku/arduino-hardware-wallet
issue: 
icon: zeokku.teensy2.diy.png
bugbounty: 
meta: ok
verdict: diy
appHashes: 
date: 2022-05-21
signer: 
twitter: zeokku
social: 
features: 

---

## Background 

The Teensy 2.0 is an Arduino compatible breadboard-friendly development board. Zeokku is an informal organization with a lot of projects including the {{ page.title }}. 

This is a recent do-it-yourself project posted on GitHub. Its aim is to use the Teensy into a key storage and signature generation device.

## Product Description 

> ## Building
> 
> You will need Arduino IDE for building the firmware
> 
> ## Cryptography
>
> The wallet uses Ed25519 signature scheme. The key is stored in encrypted form in EEPROM memory along with password seed and IV. The encryption method used is AES-256 with OFB mode. OFB mode is chosen due to the fact it cannot be parallelized for both decryption and encryption meaning to uncover full private key the attacker will have to act sequentially in any case. And because OFB uses exact same scheme for encryption and decryption we have some memory savings.

## Analysis 

This is an active **do-it-yourself project**. 

  
