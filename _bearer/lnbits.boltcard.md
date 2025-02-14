---
title: LNbits Bolt Card
appId: lnbits.boltcard
authors:
- danny
released: 
discontinued: 
updated: '2024-04-15'
version: '0.0.6'
binaries: 
dimensions: 
weight: 
provider: LNBits
providerWebsite: 
website: https://lnbits.com/
shop: https://shop.lnbits.com/product/lnbits-boltcards
country: 
price: 6.50EUR
repository: https://github.com/lnbits/lnbits
issue: 
icon: lnbits.boltcard.png
bugbounty: 
meta: ok
verdict: nowallet
date: '2024-04-26'
signer: 
reviewArchive: 
twitter: lnbits
social: 
features:
- ln

---

"Bolt Cards - LNbits extension" is an extension LNbits created to enhance the security of users' Bolt Cards.

LNbits [page](https://github.com/lnbits/boltcards) on this extension explains:

> This extension allows you to link your Bolt Card on a NXP NTAG424 DNA tag with a LNbits hub that generated new links on each tab which allows a better privacy and security than a static LNURLw that you can also write to a NFC tag (fromon NTAG 213) in the withdraw-extension e.g. for one-time usage as a gift-card.

LNbits sells its own version of this product on its webiste.

To set the bolt card, you need to have the LNbits Bolt Card extension and the [Boltcard NFC Card Creator app](https://github.com/boltcard/bolt-nfc-android-app). 

> Boltcard NFC Card Creator App from the Apple- or Play-Store to write your keys to the tags once they were generated on LNbits

Keys are generated on the LNbits server, not the card, and are then "written" to the tags using the Card Creator app. As the Bolt Card is defined as a contactless card for verifying transactions, it does not truly qualify as a "wallet."