---
title: "SFYL Hardware Wallet"
appId: sfyl
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: "Valerio Vacarro"
providerWebsite: 
website: https://sfyl.info/
shop: 
country: IT
price: 
repository: https://github.com/valerio-vaccaro/SFYL-Wallet
issue: 
icon: sfyl.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2022-03-23
signer: 
reviewArchive: 
twitter: tulipan81
social: 
  - https://t.me/sfylwallet
---

## Product Description

SFYL stands for Sorry For Your Loss. Developed by Valerio Vacarro, it is described as: 

> an open source Bitcoin Hardware Wallet, based on hardware already available on the market, designed to experiment with features and new ways of interacting.

It is meant to be a Do-It-Yourself hardware wallet. Further description reads: 

> Unlike other solutions, communication takes place via the wifi protocol. Just connect your computer or smartphone to the SFYL Wallet access point and navigate to the local site http://sfyl.local to access all the product features.
>
> SFYL Wallet will show the following pages:
>
> - Home, page for general information on the board.
> - Get XPub, page to read the xpub of the selected wallet.
> - Get Address, page to generate an address relating to the active wallet.
> - Sign PSBT, page to sign a PSBT or a message.
> - Settings, page to load, save, modify or delete the wallet used.

## Build Instructions

> 1. Buy the hardware
> - This project is based on Lilygo T-Block board with Eink display.
> - You can easily find this board on Amazon and AliExpress.
> - Load the firmware
> - Clone the project from github.com/valerio-vaccaro/SFYL-Wallet.
> - Open the project on Platform.io.
> - Build and load the firmware.
> - Load pages, javascript and default wallet with the command pio run --target uploadfs.

The [GitHub repository](https://github.com/valerio-vaccaro/SFYL-Wallet) shows the following directories: 

- data
- include
- lib
- src
- test
- website

The data subdirectory includes various html files which describes the functionalities previously shown above. It appears that accessing the device is indeed done through the WiFi protocol and through webpages. Hardware wallets are ideally air-gapped and therefore offline. One question that is not addressed by the documentation persists. 

1. What if the browser or the WiFi connection is compromised?

## Verdict

The main protocol used for the transmission of data between the device is **more susceptible to attacks** since it is primarily used in connecting to the Internet. Most other hardware wallets that we've reviewed connect through more offline means such as USB cables, NFC, BlueTooth or through QR codes. Moreover, the SFYL's documentation doesn't contain much documentation as to how the private keys are secured by the device or whether it has a secure element or a chip that encrypts the private key data. Without specifications for these, we'd have to assume that **the private key can leak** through the WiFi connection.

Perhaps, what is more telling is a conversation we chanced upon in their Telegram channel between an entity named "S V" and Valerio Vaccaro: 

> S V, [3/22/21 7:19 AM]
Neat indeed, but doesn't introduce attack surface if device used to access AP is compromised?
>
> Valerio Vaccaro [I don't ask or send BTC], [3/22/21 7:22 AM]
Agree, Sfyl stands for sorry for your loss ;)



