---
title: Pitrezor
appId: pitrezor
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://www.pitrezor.com/2018/02/pitrezor-homemade-trezor-bitcoin-wallet.html
shop: 
country: 
price: 
repository: https://github.com/heneault/trezor-firmware
issue: 
icon: pitrezor.png
bugbounty: 
meta: ok
verdict: diy
date: 2022-03-08
signer: 
reviewArchive: 
twitter: 
social: 

---

Rather than selling a product, this site appears to be a guide on how to make a hardware wallet using a raspberry pi and a fork from the {% include walletLink.html wallet='hardware/trezorOne' verdict='true' %} firmware.

## Private keys can be created offline 

The guide recommends a Raspberry Pi zero as network drivers are not loaded by the platform.

> A raspberry pi zero. You don't need the pi zero W, it cost probably a little bit more than the regular pi zero, but it will work anyway. The difference is that pi zero W has wifi and bluetooth but this project don't use it. The network drivers are not loaded by the platform so the W can be considered as secure. As mentionnend, you can use a pi 4 also if you already have one but it is more expensive than the pi 0

## Private keys are not shared 

From the [site](https://www.pitrezor.com/2018/02/pitrezor-homemade-trezor-bitcoin-wallet.html):

> Is this secure?
  
  The main difference of this device versus the real trezor device is that the pi zero stores everything on the SD card. The equivalent of the flash memory for the trezor is stored in a file on the first partition. That means that anybody that has your SD card can access your seed words and private key.
  
  However, the wallet supports the usage of a passphrase. The passphrase is a kind of an extra seed word that is not stored on SD card. By using a passphrase, you would prevent a thief that could have your SD card to empty your wallet.
  
  Thus, the recommendation is to always use a passphrase!

## Code and Reproducibilty

The website links the Github repository [containing the modified Trezor firmware](https://github.com/heneault/trezor-firmware).

From the step-by-step instructions:

> - If you don't have the software called "etcher" already installed in your computer, download it here : https://etcher.io/ . This software is used to write the program image to the SD card.
> - Download the latest pitrezor SD card image by clicking here and select "save" to save the zip file

Pitrezor's firmware is precompiled. This project is primarily a **diy project**. We have to check if the precompiled firmware can be reproduced from the provided source code. 