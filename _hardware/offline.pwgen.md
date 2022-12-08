---
title: Offline Paper Wallet Generator
appId: offline.pwgen
authors:
- danny
released: 2021-03-20
discontinued: 
updated: 2021-11-28
version: 
binaries: 
dimensions: 
weight: 
provider: Felix Weichselgartner
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/FelixWeichselgartner/BitcoinOfflinePaperWalletGenerator
issue: 
icon: offline.pwgen.png
bugbounty: 
meta: ok
verdict: diy
date: 2022-05-27
signer: 
reviewArchive: 
twitter: 
social: 

---

## Product Description

The {{ page.title }} is a DIY project and its firmware is available [on GitHub.](https://github.com/FelixWeichselgartner/BitcoinOfflinePaperWalletGenerator) It is a private key generator but other than that has no other wallet features.

> This project aims for a microcontroller-based private key generation. The private key will be generated using rng. Your bitcoin address will then be calculated from your private key. Both will then be displayed on a display, for you to transfer on a piece of paper, which you will keep save. You can now use the address to transfer your bitcoins. Once you need your bitcoins, you simply import your private key in a wallet program and for safety reasons create a new paper wallet with this device. You can then use the bitcoins you need and transfer the rest to your new save bitcoin address.

Additionally, the repository gives instructions on how to flash the firmware to a [printed circuit board (PCB).](https://github.com/FelixWeichselgartner/BitcoinOfflinePaperWalletGenerator/blob/master/documentation/flash_pcb.md)

Here is a link to this project's [RNG tests.](https://github.com/FelixWeichselgartner/BitcoinOfflinePaperWalletGenerator/blob/master/tests/rng_validation/TEST.md)
