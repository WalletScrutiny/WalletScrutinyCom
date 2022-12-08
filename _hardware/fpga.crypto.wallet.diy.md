---
title: FPGA Crypto-wallet DIY 
appId: fpga.crypto.wallet.diy
authors:
- danny
released: 2018-11-26
discontinued: 
updated: 2019-04-28
version: 
binaries: 
dimensions:
- 97
- 94
- 18
weight: 14.17
provider: Joshua Maldonado, Brian Silver
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/jmaldon1/Crypto_wallet
issue: 
icon: fpga.crypto.wallet.diy.png
bugbounty: 
meta: obsolete
verdict: diy
date: 2022-05-25
signer: 
reviewArchive: 
twitter: 
social: 

---

## Description:

> Crypto-Wallet is the hardware for the FPGA (DE-0 Nano) device that integrates with Crypto-Wallet Web.
>
> Crypto-Wallet allows for:
  - Creation of Masterkey
  - Derivation of child keys
  - Storing public/private keys
  - Signing Transactions
> 
> FPGA
DE0-Nano Development and Education Board was the hardware device used to create Crypto-Wallet.
>
> USB Device
The [Cenrykay CP2102 USB to UART TTL485 232 Module Serial Converter Adapter](https://www.amazon.com/Cenrykay-CP2102-Converter-Adapter-Windows/dp/B07H4KMXDK/ref=sr_1_15?keywords=usb+to+uart&qid=1556413280&s=gateway&sr=8-15#customerReviews) was used to transfer data from PC -> Device and Device -> PC.
>
> How to use USB: <br />
Create & Install INF file for DE-0 Nano <br />
VENDOR ID: 0x10c4 <br />
PRODUCT ID: 0xea60 <br />
  1. switch ON
  2. switch OFF

The readme files states that Quartus Prime Lite Edition was used to program the FPGA. It also contains additional instructions on how to setup and run the hardware wallet.

## Verdict

While this wallet is meant to be a **DIY** project, the code has not received an update since 2019, thus qualifying it as **obsolete.**