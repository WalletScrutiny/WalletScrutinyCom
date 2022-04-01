---
title: HWallet
appId: nemanjan.hwallet
authors:
- danny
released: 2018-11-12
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Nemanja Nikodijević
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://gitlab.com/nemanjan/hwallet
issue: 
icon: nemanjan.hwallet.png
bugbounty: 
meta: ok
verdict: wip
date: 2021-03-25
signer: 
reviewArchive: 
twitter: 
social:
---

## Background

Nemanja Nikodijević is a security researcher who has managed to create an Open Source hardware wallet called hwallet that uses [significantly less lines of code than ColdCard, Trezor, Ledger and KeepKey](https://youtu.be/0sgF5klTcD8?t=657).

He elaborates in this video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/0sgF5klTcD8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The hwallet is not commercially available and is a DIY bitcoin hardware wallet. He built the project in order to prove that there is a simpler and safer way to build bitcoin hardware wallets compared to current commercially available solutions.

## Wallet Description 

From his [repository](https://gitlab.com/nemanjan/hwallet), the required components are:

- FRDM-K82F or FRDM-KL82Z
- Pmod OLED 

## Analysis 

As an Open Source DIY project, it is **not available commercially**. However, researchers might want to verify the reproducibility of the code but it would only be for a device they themselves have built according to Nikodijević's specifications. It is more prudent to do so once it has been released. 
