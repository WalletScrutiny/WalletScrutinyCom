---
title: White Wolf Technology Lightning NFC Card
appId: whitewolf.technology.nfc
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: White Wolf Technology
providerWebsite: https://www.whitewolftech.com/
website: https://www.whitewolftech.com/articles/payment-card/
shop: 
country: 
price: 
repository: 
issue: 
icon: whitewolf.technology.nfc.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2023-12-07
signer: 
reviewArchive: 
twitter: 
social: 
features: 

---

## Product Information

With no other information about the company or links to a GitHub repository, this provider outlines the step-by-step process of how to use an NFC card as a payment card on this [page](https://www.whitewolftech.com/articles/payment-card/).

  > Here we describe the steps for making your own, self-sovereign, self-custodial, contactless payment card to pay with Bitcoin over the Lightning Network.
  >
  > The card uses open standards throughout and contains mitigation for replay attacks.
  >
  > With this setup you can use your own server to authenticate a card tap, apply custom checks as required and make payment.

### Requirements

  > **Resources** 
  > - some cards
  >
  > - Either blank NXP DNA 424 NTAG cards/keyfobs/stickers or CoinCorner Bolt cards
  > - A good NFC reader/writer
  > 
  > - Identiv uTrust 3700 F
  >
  > **software**
  >
  > - NXP TagXplorer software
  > - Java Run Time environment
  > 
  > **reference documents**
  > 
  > - NTAG 424 DNA Product Data Sheet
  > - NTAG 424 DNA features and hints

## Analysis 

The product has no product page, and no links to a GitHub repository. The single page on the site describes the process of using the cards. 

[Leo](../../authors/leo):

  > It's an authentication token not able to sign transactions or even hold private bitcoin keys. It can be used in conjunction with a wallet to proof the presence of the device. A TAN generator basically.

This is **not a bitcoin wallet**.