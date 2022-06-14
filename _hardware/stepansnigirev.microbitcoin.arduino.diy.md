---
title: Stepan Snigirev Micro-Bitcoin for Arduino
appId: stepansnigirev.microbitcoin.arduino.diy
authors:
- danny
released: 2021-01-05
discontinued: 
updated: 2021-12-23
version: 0.1.3
binaries: https://github.com/micro-bitcoin/uBitcoin/releases
dimensions: 
weight: 
provider: Stepan Snigirev
providerWebsite: https://stepansnigirev.com/
website: 
shop: 
country: DE
price: 
repository: https://github.com/micro-bitcoin/uBitcoin
issue: 
icon: stepansnigirev.microbitcoin.arduino.diy.png
bugbounty: 
meta: ok
verdict: diy
date: 2022-05-20
signer: 
reviewArchive: 
twitter: stepansnigirev
social:
- https://t.me/arduinoBitcoin

---

## Background 

From the [Arduino Micro-Bitcoin page:](https://www.arduino.cc/reference/en/libraries/ubitcoin/) 

> Brings Bitcoin to embedded devices
>
> Write your own hardware wallet, vending machine or any other bitcoin-powered device. Supports public and private keys, HD wallets, transactions and scripts. Everything required to start working with Bitcoin on microcontrollers.

Taken from Micro-Bitcoin's [GitHub repository:](https://github.com/micro-bitcoin/uBitcoin)

> ## Micro-Bitcoin
>
> C++ Bitcoin library for 32-bit microcontrollers. The library supports Arduino IDE, ARM MBED and bare metal.
> 
> It provides a collection of convenient classes for Bitcoin: private and public keys, HD wallets, generation of the recovery phrases, PSBT transaction formats, scripts — everything required for a hardware wallet or other bitcoin-powered device.
>
> The library should work on any decent 32-bit microcontroller, like esp32, riscV, stm32 series and others. It doesn't work on 8-bit microcontrollers like a classic Arduino as these microcontrollers are not powerful enough to run complicated crypto algorithms.
>
> We use elliptic curve implementation from trezor-crypto. API is inspired by Jimmy Song's Programming Blockchain class and the book.

Snippet from Micro-bitcoin's [tutorial page:](https://micro-bitcoin.github.io/#/tutorial/README)

> In the tutorial we will to the following:
> 
> - Generate a recovery phrase from entropy
> - Derive root key from mnemonic and password
> - Derive an account and print the master public key
> - Print first 5 receiving addresses
> - Parse PSBT transaction and outputs
> - Check if we have a change output and hide it
> - Sign PSBT transaction and print it

## Analysis 

There is an active community on [Telegram](https://t.me/arduinoBitcoin) focusing specifically on Arduino-Bitcoin implementations. The principal author for this project is Stepan Snigirev and he gives out a lot of resources and links to libraries that potential users can use. 

Anyone who's looking to understand Bitcoin better would benefit from partaking in this active **do-it-yourself** project. 

