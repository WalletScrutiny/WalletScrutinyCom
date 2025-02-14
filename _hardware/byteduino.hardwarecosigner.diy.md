---
title: Byteduino Hardware Cosigner DIY
appId: byteduino.hardwarecosigner.diy
authors:
- danny
released: '2018-09-21'
discontinued: 
updated: '2020-05-20'
version: '0.1.0'
binaries: https://github.com/Papabyte/Hardware-cosigner/releases/tag/v0.1.0
dimensions: 
weight: 
provider: Papabyte
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/Papabyte/Hardware-cosigner
issue: 
icon: byteduino.hardwarecosigner.diy.png
bugbounty: 
meta: obsolete
verdict: nobtc
appHashes: 
date: '2022-12-07'
signer: 
reviewArchive: 
twitter: 
social: 
features: 

---

## Device Description 

The {{ page.title }} is described as an Arduino-based "cosigner"

> Arduino hardware cosigner compatible with Obyte GUI wallet to secure your bytes.

From the README.md:

> This hardware cosigner allows to securize your funds by being a required device for a multisig wallet. Once set up and connected to internet via Wifi, you pair it with the standard Byteball GUI wallet, add it as cosigner for a multidevice wallet then authorize the signature of a transaction from a webpage on your local network. It works on ESP8266 and ESP32 boards although ESP32 is recommended since it has no practical limit for unit size you can cosign.
>
> Video tutorial by DrSensor: https://steemit.com/utopian-io/@drsensor/byteduino-create-your-own-hardware-cosigner-for-byteball-1543200264366

Below the description, there are instructions on how to use the Arduino IDE, download the appropriate libraries, and upload the sketch to an ESP32 board.

> Create a multidevice wallet
  - From your Byteball wallet, create a multidevice wallet with the hardware device as one of the cosigner. Only single address wallet is supported.
>
> Cosign a transaction
  - Select your multidevice wallet and click on send a transaction, the wallet will ask you to approve the transaction on other devices. Go to the cosigner control webpage and click on confirm.

## Analysis 

This project's last commit was made in 2020. Byteball is an altcoin that does not support Bitcoin.

