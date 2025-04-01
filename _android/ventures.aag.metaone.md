---
wsId: metaOneNFT
title: Saakuru  App
altTitle: 
authors:
- danny
users: 100000
appId: ventures.aag.metaone
appCountry: 
released: 2022-12-22
updated: 2025-01-21
version: 6.1.0
stars: 4.2
ratings: 
reviews: 15
website: https://getmeta.one/
repository: 
issue: 
icon: ventures.aag.metaone.png
bugbounty: 
meta: removed
verdict: custodial
appHashes: 
date: 2025-03-29
signer: 
reviewArchive: 
twitter: aag_ventures
social:
- https://www.linkedin.com/company/aag-ventures
- https://blog.aag.ventures
- https://t.me/aagventures
- https://www.linkedin.com/company/aag-ventures
- https://www.facebook.com/aagventures
- https://discord.com/invite/aagventures
redirect_from: 
developerName: ACHIP & ACHAIR GUILD VENTURES PTE. LTD.
features: 

---

## App Description from Google Play

> As of the latest release, we support the following blockchains:
1. Bitcoin
2. Ethereum
3. Binance Smart Chain
>
> Elimination of private keys and seed phrases: While seemingly appealing, private keys and seed phrases are actually the cause of many security breaches. We replace this with a more convenient and user friendly n-Factor authentication.
>
> Multiple layers of app security: Being in control of your assets also requires the ability to protect them. We offer multiple layers of security to assist our users in protecting their assets from malicious players.

## Analysis

- The app starts off by having us register our email address. It then asks us for a 4-digit pin code. Screenshots are disabled but this can later on be enabled.
- It then tells us to 'Create a Signature'. The signature is pretty much a 6-digit pin code.
- We can then create security questions that allow us to reset the signature. We can choose among a list to select 3 security questions. One such example, is "What was your childhood nickname?"
- There is a BTC wallet with a P2SH address that can send/receive.
- We did not find any provision for backing up the private keys for the BTC wallet.
- In its homepage, one of the cards is titled, "Weakness in Security" and describes seed phrases as "mind-numbing"
- Residents from Finland, Germany and Italy are disallowed from accessing several features according to the [Terms and Conditions](https://getmeta.one/terms-conditions)
  - Section 21.1 of the same Terms describes the app as not having custody of the user's assets - but in a carefully-worded manner - admits that they have partial control over it. The private keys, as they describe, are generated through their software using their n-factor authorization mechanism.
  - Section 5.1.3 consists of its Anti-Money Laundering provisions which gives the provider the power to terminate and suspend the access of the user to the services.
- We're in a bit of a quandary here as the platform claims to be non-custodial. Yet the wording on its terms could be interpreted to mean that they have access to a partial private key. Disregarding this play on words, the app does not provide, to the best of our knowledge, a way to backup the private keys.  
- We [asked them on twitter](https://twitter.com/BitcoinWalletz/status/1675323207975415811) about this.
- Two factors bring us to conclude that this is in fact, a **custodial** app. One, the platform disallows users from certain countries and has a termination clause that bars users from accessing their services. Two, the app does not provide the private keys.
