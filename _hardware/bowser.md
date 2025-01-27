---
title: Bowser DIY Hardware Wallet
appId: bowser
authors:
- danny
released: 2020-06-07
discontinued: 
updated: 2021-05-11
version: '1'
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://github.com/arcbtc/bowser-bitcoin-hardware-wallet/blob/master/README.md
shop: 
country: 
price: 
repository: https://github.com/arcbtc/bowser-bitcoin-hardware-wallet
issue: https://github.com/arcbtc/bowser-bitcoin-hardware-wallet/issues/13
icon: bowser.png
bugbounty: 
meta: ok
verdict: diy
appHashes: 
date: 2022-04-11
signer: 
reviewArchive: 
twitter: arcbtc
social: 
features: 

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

Yes. The user can [take out the SD card](https://youtu.be/DG1zrlAVdys?t=525), and put it in a laptop to key in the command 'HARD RESET' in the bowser.txt file. Putting the SD card back in the device, allows for the creation of new seed phrase. Once the seed is verified, this information is saved in the SD card. The user is then asked to create a pin using Morse code.

## Are the private keys shared? 

No. Non-custom-built, general purpose hardware ensures that there is no manufacturer with the explicit intent to store or reproduce the private keys.

## Does the device display the receive address for confirmation?

Yes.

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes, but ... as can be seen in their
[tutorial](https://youtu.be/DG1zrlAVdys?t=449), the user is not presented with any useful information during the signing of transactions. State of the art hardware wallets show which amount is leaving the wallet and which amount is being sent back to the same wallet as change. Neither of those is visible on this device.

## Is it reproducible?

Bowser is a **diy-project**. 