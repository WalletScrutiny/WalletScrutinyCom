---
title: Open Ledger Micro
appId: openledger.micro
authors:
- danny
released: 2018-03-22
discontinued: 
updated: 2018-03-25
version: 
binaries: 
dimensions: 
weight: 
provider: Nic Raboy
providerWebsite: 
website: >-
  https://www.thepolyglotdeveloper.com/2018/03/create-bitcoin-hardware-wallet-golang-raspberry-pi-zero/
shop: 
country: US
price: 
repository: https://github.com/nraboy/open-ledger-micro
issue: 
icon: openledger.micro.png
bugbounty: 
meta: ok
verdict: diy
date: 2022-05-19
signer: 
reviewArchive: 
twitter: nraboy
social: 
features: 

---

## Background Information

This is an [Open Source](https://github.com/nraboy/open-ledger-micro) **do-it-yourself** project coded by Nic Raboy, described in [this blog post](https://www.thepolyglotdeveloper.com/2018/03/create-bitcoin-hardware-wallet-golang-raspberry-pi-zero/):

> The Raspberry Pi Zero is a $5.00 computer with no WiFi or Bluetooth and can be configured to emulate Ethernet over USB. The application written in Go and Angular, serves a RESTful API to be consumed with the integrated Angular application.

## Device Specifics

> The point of hardware wallets is that they hold encrypted private keys, never expose the private keys, and operate in an offline environment. We are using a Raspberry Pi Zero because it has neither WiFi or Bluetooth which makes it much more difficult to compromise.
>
> Once configured, software like Bonjour on a host machine will allow the Raspberry Pi Zero to be accessed by its hostname. For example, http://raspberrypi.local would show the Angular web application.
>
> Sensitive information such as private keys are encrypted on the Raspberry Pi and are never exposed through HTTP. Transactions are created and signed directly on the device and returned to the Angular application.

## Analysis 

This is a **do-it-yourself project**. 

