---
title: "Bowser DIY Hardware Wallet"
appId: bowser
authors:
- danny
released: 2020-06-07
discontinued: # date
updated: 2021-05-11
version: 1.0
dimensions: 
weight: 
website: https://github.com/arcbtc/bowser-bitcoin-hardware-wallet/blob/master/README.md
shop: 
company: 
companywebsite: 
country: 
price: 
repository: https://github.com/arcbtc/bowser-bitcoin-hardware-wallet/blob/master/README.md
issue:
icon: bowser.png
bugbounty:
verdict: wip
date: 2022-01-20
signer:
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 
---


The Bowser DIY Hardware Wallet comes with a Tetris game to playfully mask its character as a wallet. It uses the following libraries on a M5Stack ESP32:

> - uBitcoin (Arduino library created by Stepan Snigirev)
> - M5Stack Library
> - lvgl GUI for Arduino

Initial options for the Bowser Wallet include:

- Display PubKey
- Sign Transaction
- Export ZPUB
- Show Seed
- Wipe Device
- Restore from Seed

## Can the private keys be created offline?

Yes. The user can [take out the SD card](https://youtu.be/DG1zrlAVdys?t=525), and put it in a laptop to key in the command 'HARD RESET' in the bowser.txt file. Putting the SD card back in the device, allows for the creation of new seed phrase. Once the seed is verified, this information is saved in the SD card. The user is then asked to create a pin is using morse code.

## Are the private keys shared? 

No. Custom-built general purpose hardware ensures that there is no manufacturer with the explicit intent to store or reproduce the private keys.

## Does the device display the receive address for confirmation?

Yes.

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes.

## Is it reproducible?

The device's features are for verification.