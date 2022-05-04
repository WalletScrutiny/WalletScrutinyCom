---
title: SafeCard
appId: safecard.gridplus
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: GridPlus
providerWebsite: https://gridplus.io/
website: 
shop: 
country: 
price: 40USD
repository: https://github.com/GridPlus
issue: 
icon: safecard.gridplus.png
bugbounty: 
meta: ok
verdict: noita
date: 2022-05-03
signer: 
reviewArchive: 
twitter: 
social:
- https://www.youtube.com/channel/UCJ4yuWlSb0ZbknadhsjjrlQ
- https://www.reddit.com/r/GridPlus/

---

## Background

[Here is an article](https://blog.gridplus.io/understanding-the-safecard-18fdd8722c7d) on Medium explaining how the {{ page.title }} works.

{{ page.title }} is a PIN-protected card meant to backup seeds offline. This card does not have a screen interface as it is meant to be used with {% include walletLink.html wallet='hardware/lattice1' verdict='true' %}, a hardware wallet already hosting those features.

## [Product Description](https://docs.gridplus.io/introduction/introduction-to-safecards)

>  We believe you should take all precautions to protect your funds and prevent someone from getting their hands on your private keys - and one form of an attack that's not talked about often is what we call the "sock drawer" attack, i.e. when someone leaves their written seed phrase in the bottom of their sock drawer and someone else finds it. People inadvertently introduce risk with how they store their seed phrase - cloud storage is a big problem in this area.
>
> This is why we decided to use the PIN protected SafeCards to store/backup your wallets - if someone finds your backup, they still can't use it without the PIN, which adds another layer of security on top of everything else (but if you want to back up with a seed phrase, you still have the option of course).

## Analysis

A paragraph on {{ page.title }}'s product page says that the card can't sign transactions without the Lattice1 wallet. From the [page:](https://gridplus.io/products/safe-cards)

> Put your keys on a secure GridPlus SafeCard. Carry your assets around in your pocket or lock them in an underground vault. Backup your keys on one or multiple SafeCards. Keep the keys offline or transfer funds by inserting them in a Lattice1.

This is also confirmed on GridPlus' [documentation for the wallet.](https://docs.gridplus.io/introduction/introduction-to-safecards)

> When inserted into the Lattice1, the Safe Card “takes over” as the default wallet of the device. This means that any signatures requests are done so on keys held in the card (rather than the device itself). 
>
> When removed, the SafeCard **can no longer make signatures,** so the device’s built-in Lattice1 wallet (the chip of this wallet is exactly the same as a SafeCard chip) returns as the default wallet.

The card doesn't primarily function as a wallet on its own as it **lacks an interface where you can sign transactions** and is designed to be used in conjunction with another hardware wallet.

