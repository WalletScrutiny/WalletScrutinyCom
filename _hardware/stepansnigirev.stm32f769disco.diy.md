---
title: Stepan Snigirev STM32F769DISCO DIY Hardware Wallet
appId: stepansnigirev.stm32f769disco.diy
authors:
- danny
released: 2019-04-26
discontinued: 
updated: 2019-09-21
version: 0.0.2_alpha
binaries: 
dimensions:
- 120
- 60
- 2.8
weight: 40
provider: Stepan Snigirev
providerWebsite: https://stepansnigirev.com/
website: 
shop: 
country: DE
price: 
repository: https://github.com/stepansnigirev/hw_class_f769
issue: 
icon: stepansnigirev.stm32f769disco.diy.png
bugbounty: 
meta: obsolete
verdict: diy
appHashes: 
date: 2022-05-20
signer: 
reviewArchive: 
twitter: stepansnigirev
social: 
features: 

---

## Background 

Stepan Snigirev is involved with [Specter Solutions](https://specter.solutions/) and is the CTO of Crypto Advance. 

## Snippet of the repository

> ## Hardware wallet in micro-python on STM32F769-Discovery board
>
> Currently focusing on STM32F769DISCO developer board. Support of other boards comes as soon as this one is stable enough.
>
> ## Project structure
> 
> micropython folder contains a fork of micropython with some temporary workarounds for stm32f769 board. Currently the master branch of micropython fails to build for this target, as soon as it is fixed we will switch to the main micropython repo.
>
> - usermods/mpy-bitcoin folder contains minimal C-modules for micropython with basic crypto algorithms. Interface to optimized C modules allow to use optimized elliptic curve arithmetics and hashing functions:
>
> - usermods/mpy-bitcoin/hashlib.c adds support of sha1, sha256, sha512 and ripemd160 required for Bitcoin to hashlib python module.
>
> - usermods/mpy-display/ folder contains a C-module to work with the display present on the board.
>
> - usermods/mpy-secp256k1/ folder defines bindings to the secp256k1 library

## Verdict 

This **do-it-yourself** project hasn't been updated for more than 2 years.