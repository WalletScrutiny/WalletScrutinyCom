---
title: Byteduino Hardware Cosigner DIY
appId: byteduino.hardwarecosigner.diy
meta: obsolete
verdict: nobtc

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

