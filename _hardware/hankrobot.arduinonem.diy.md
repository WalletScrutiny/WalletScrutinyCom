---
title: HankRobot Arduino NEM DIY Hardware Wallet
appId: hankrobot.arduinonem.diy
authors:
- danny
released: 2019-07-09
discontinued: 
updated: 2019-10-04
version: 
binaries: 
dimensions: 
weight: 
provider: Chia Tze Hank
providerWebsite: >-
  https://hankrobot.wordpress.com/2019/07/26/creating-your-own-hardware-wallet-to-store-your-private-keys/
website: 
shop: 
country: UK
price: 
repository: https://github.com/HankRobot/HardLet
issue: 
icon: hankrobot.arduinonem.diy.png
bugbounty: 
meta: obsolete
verdict: nobtc
appHashes: 
date: 2022-12-07
signer: 
reviewArchive: 
twitter: 
social: 
features: 

---

## Background 

> This project is focused on deploying NEM Catapult only on Arduino devices via RESTFUL API, the goal is to use NODEMCU to act as a hardware wallet to store private keys and authorize transactions for NEM Blockchain (Kinda like Trezor)

## Device Description 

This was taken from HankRobot's [blog](https://hankrobot.wordpress.com/2019/07/26/creating-your-own-hardware-wallet-to-store-your-private-keys/): 

> We will store our private and public key in our embedded device (Maker Uno in this case) and do a 6 pin entry authentication to retrieve it via serial communication using a C# Desktop Application. Then, we can use our account info to do a mosaic transaction via nodejs on our desktop application by running a shell script.

## Analysis 

This project is a **do-it-yourself non-bitcoin project**. It has also not gotten any recent updates for more than 3 years. 