---
title: Youba Wallet
appId: youba.wallet
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Yooba GmbH
providerWebsite: 
website: https://www.youba.io/
shop: 
country: DE
price: 
repository: 
issue: 
icon: youba.wallet.png
bugbounty: 
meta: ok
verdict: noita
appHashes: 
date: 2024-10-23
signer: 
reviewArchive: 
twitter: yooba_io
social: 
features: 

---

## Update 2024-10-23

Clicking "Get a Wallet" on their website creates an appointment in Calendly. Their website has since been updated, but there are still very few technical information about the NFC card, including what app it uses or is paired with.

This is a part of their FAQ:

> 1. Conception. Discuss your project idea with us to understand how we can assist you.
> 2. Tech Implementation. Choose between using our native iOS and Android app for free or integrating our API into your platform
> 3. Deliver Wallets/Cards. Customize and brand wallets/cards, which will be delivered to your customers
> 4. Your customers. 
>   a. Receive wallet/card
>   b. Download the youba_app or the client app if using the API
>   c. Tap the card to your phone.
>   d. Done! your wallet is generated, and you can mint and receive blockchain assets seamlessly.

This service seems to be B2B and not B2C oriented. With the sparse details available, we're going to assume that this is a Whitelabel service. 

Looking deeper, we find these text on their website:

- One tap customer journey.
- No-Code implementation
- Non-custodial solution
- Multi-Blockchain wallet
- White Label/Co-Branding

"We are the one stop shop for your blockchain project"

Furthermore, they discuss the private key:

> Each youba_wallet contains an intelligent microchip that allows you to store and carry digital assets. The private key being generated when the card is tapped on the cell phone. The additional encryption and read-only protection makes it impossible for third parties to read or rewrite the data afterwards.

The {{ page.title }} would appear to be a general-purpose NFC card that could be configured for Web3 projects and not exclusively for signing Bitcoin transactions. It is a part of the service that the company provides to other Web3 projects. With the few details about the actual device, we can only assume that it is similar with other NFC-enabled cards. The cards could possibly be used to store the private keys and be used to sign transactions via an app on a NFC-enabled mobile device. 

To verify our assumption, we posted on [x.com](https://x.com/dannybuntu/status/1848992456462807531) but give this device a tentative verdict of **blind-signing** until more information is available.

## Product Description 2022-11-09

The device is an NFC-enabled card. 

## Analysis 

It has not yet been released so details are very sparse.

