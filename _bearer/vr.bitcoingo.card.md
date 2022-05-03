---
title: Volksbanken Raiffeisenbank BitcoinGo Card
appId: vr.bitcoingo.card
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Volksbanken Raiffeisenbank Bayern Mitte eG
providerWebsite: https://www.vr-bayernmitte.de/
website: 
shop: 
country: DE
price: 
repository: 
issue: 
icon: vr.bitcoingo.card.png
bugbounty: 
meta: ok
verdict: prefilled
date: 2022-05-03
signer: 
reviewArchive: 
twitter: 
social:
---

## Background 

The {{ page.title }} is an initiative of the Volksbanken Raiffeisenbank Bayern Mitte eG which is a German [cooperative bank](https://en.wikipedia.org/wiki/Cooperative_banking). This effort has been referred to from this [article](https://finanzbusiness.de/nachrichten/genossen/article13607985.ece).

We believe this card to be a branded version of this device we previously reviewed: 

- {% include walletLink.html wallet='bearer/chainlock' verdict='true' %}

## Setup and Product Description 

<iframe width="560" height="315" src="https://www.youtube.com/embed/hrOmjsMK-ls" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br /><br />

The companion app can be found on [Google Play](https://play.google.com/store/apps/details?id=com.digiwrecks.bitcoingocard).

> The VR-BitcoinGoCard app checks the most important security features of the VR-BitcoinGoCard with you step by step to protect you from counterfeiting. So you don't have to worry about the security of your bitcoins.
>
> The VR-BitcoinGoCard app will never ask you for your private key! Your private key will never be used, stored or transmitted by the VR-BitcoinGoCard app. Your private key is stored solely on the VR-BitcoinGoCard and has never been seen by anyone - not even by the manufacturer's employees! In this way we ensure maximum security for your private key.
>
> After adding your VR-BitcoinGoCard, you can manage your VR-BitcoinGoCard in the app and view the current value of your Bitcoin investment at any time without removing your physical VR-BitcoinGoCard from its safe custody.

The Android app authenticates the bitcoins on the {{ page.title }} by scanning the QR code. Like the {% include walletLink.html wallet='bearer/chainlock' %}, transacting requires the use of a mobile app. 

## Analysis 

Similar to the {% include walletLink.html wallet='bearer/chainlock' %}, the **private key is printed on the card**. It has to be scanned using the VR-BitcoinGo Card. Although the provider claims that *"not even the manufacturer's employees has seen the private key"*, the risks of an exposed physically printed private key allows a potential thief to exploit this vulnerability. 