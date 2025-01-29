---
title: Kevin Gislason Abacus DIY Hardware Wallet
appId: kevingislason.abacus.diy
authors:
- danny
released: 2019-10-23
discontinued: 
updated: 2021-03-15
version: 
binaries: 
dimensions: 
weight: 
provider: Kevin Gislason
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/Kevingislason/abacus_wallet
issue: 
icon: kevingislason.abacus.diy.png
bugbounty: 
meta: stale
verdict: diy
appHashes: 
date: 2022-05-24
signer: 
reviewArchive: 
twitter: 
social:
- https://www.youtube.com/channel/UC1ARtCwT4FUZZtJbMvKwl6Q/videos
features: 

---

## Background

This project builds on Stepan Snigirev's Micropython Bitcoin bundle which is focused on a STM32F769DISCO chip. Kevin's project involves the following contributors: 

- Mike Tolkachev
- Justin Moon
- hodlwave
- 6102bitcoin
- Stepan Snigirev

## Device Description

The {{ page.title }} builds on a [STM32F469I-DISCOVERY](https://www.st.com/resource/en/user_manual/um1932-discovery-kit-with-stm32f469ni-mcu-stmicroelectronics.pdf) microcontroller. 

Its features include: 
>
- Easy to use, full color touch display
- BIP39 recovery phrases
- QR code addresses
- Extensive validations to protect against malicious transactions

Build instructions could be found [here.](https://github.com/Kevingislason/abacus_wallet#build)

Further documentation [here.](https://github.com/Kevingislason/abacus_wallet/blob/main/docs)

The device needs a desktop application called the [Abacus Wallet Bridge](https://github.com/Kevingislason/abacus_wallet_bridge).

## Video Demonstration

<iframe width="560" height="315" src="https://www.youtube.com/embed/G7fQn-IfNgs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Analysis 

The {{ page.title }} is a **do-it-yourself** bitcoin project. It was updated on March 15, 2021.


