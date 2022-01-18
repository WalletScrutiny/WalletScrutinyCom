---
title: "Icynote"
appId: icynote
authors:
- danny
released: 
discontinued: # date
updated:
version:
dimensions: 
weight: 
website: https://www.icynote.ch/
shop: 
company: SMD Security Printing Sàrl
companywebsite: https://www.smd-safe.com/
country: CH
price: $9.84 to $54,680
repository: 
issue:
icon: icynote.png
bugbounty:
verdict: nosource # wip noita nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-01-16
signer:
reviewArchive:


providerTwitter: IcynoteOfficial
providerLinkedIn: 
providerFacebook: Icynote-100908298821873
providerReddit: 
---


These 'hardware wallets' are very much akin to paper banknotes. The Icynotes' [security features include](https://www.icynote.ch/security):

> A digital signature is a mathematical scheme for verifying the authenticity of digital messages or documents. All our wallets are signed with our private key, a mobile application with our public key helps our customers to control that the Icynote you are getting was fabricated by us. From another side, it makes it possible to check the validity of the App that is downloaded from the Apple or Android stores.
>
> - A signing algorithm which signs the banknote with a private key
> - A mobile application which checks the authenticity of the signature

This is the Android companion app: {% include walletLink.html wallet='android/ch.smd.icynote' verdict='true' %}

## Private keys can be created offline

The private keys are created by the manufacturer and printed on the note. They are sealed by a holographic sticker.

## Private keys are not shared 

The manufacturer claims that printing is highly secure and performed with the [utmost standards](https://www.icynote.ch/security):

> So, a special protocol for creating the cold wallets, erasing the cold wallets and destroying all hard drives after production exists at the printing company. Supervision by a Swiss notary and a Swiss IT security company, the printer’s 27001 security risk compliance team and SMD security team furnishes proof that files used in the printer are deleted after production. At the end of the process unicity proof is performed and there is absolutely no possible means of replicating it.

## Interface

Since the Icynote is a paper note currency/wallet, it is highly reliant on the Android app for private key verification. It has no buttons nor a screen to display pertinent details for confirmation.

Trust is a key element here and it is apparent that SMD Security Printing Sarl has undergone great lengths to ensure that there is a rigorous process that would not leak the private keys. But is this enough? Should we trust the manufacturer? 

In the world of Bitcoin, trust is never enough. Verifiability is the true operative concept. We were **not able to locate links to any publicly shared source code**. 