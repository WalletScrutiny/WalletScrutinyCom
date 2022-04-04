---
title: "SFYL Hardware Wallet"
appId: sfyl
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: "Valerio Vacarro"
providerWebsite: 
website: https://sfyl.info/
shop: 
country: IT
price: 
repository: https://github.com/valerio-vaccaro/SFYL-Wallet
issue: 
icon: sfyl.png
bugbounty: 
meta: ok
verdict: unreleased
date: 2022-03-23
signer: 
reviewArchive: 
twitter: tulipan81
social: 
  - https://t.me/sfylwallet
---

## Product Description

SFYL stands for Sorry For Your Loss. Developed by Valerio Vacarro, it is described as: 

> an open source Bitcoin Hardware Wallet, based on hardware already available on the market, designed to experiment with features and new ways of interacting.

It is meant to be a Do-It-Yourself hardware wallet. Further description reads: 

> Unlike other solutions, communication takes place via the wifi protocol. Just connect your computer or smartphone to the SFYL Wallet access point and navigate to the local site http://sfyl.local to access all the product features.
>
> SFYL Wallet will show the following pages:
>
> - Home, page for general information on the board.
> - Get XPub, page to read the xpub of the selected wallet.
> - Get Address, page to generate an address relating to the active wallet.
> - Sign PSBT, page to sign a PSBT or a message.
> - Settings, page to load, save, modify or delete the wallet used.

## Verdict

The protocol used to communicate with the device - WIFI - is **more susceptible to attacks** than communication via QR-codes for example. Moreover, the SFYL's documentation doesn't contain much information as to how the private keys are generated or secured by the device. In the end, this is - in the provider's own words - a weekend project and **not marketed as a finished product**.

This conversation on their Telegram channel between an entity named "S V" and Valerio Vaccaro is maybe also telling: 

> S V, [3/22/21 7:19 AM]
Neat indeed, but doesn't introduce attack surface if device used to access AP is compromised?
>
> Valerio Vaccaro [I don't ask or send BTC], [3/22/21 7:22 AM]
Agree, Sfyl stands for sorry for your loss ;)



