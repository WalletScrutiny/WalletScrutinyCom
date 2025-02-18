---
title: Ledger Open Source Java Card
appId: ledger.osjavacard
authors:
- danny
released: 2013-11-20
discontinued: 
updated: 2016-01-27
version: v1.0-fidesmo
binaries: https://github.com/LedgerHQ/ledger-javacard/releases/tag/v1.0-fidesmo
dimensions:
- 35
- 15
- 3
weight: 0.75
provider: Ledger
providerWebsite: https://www.ledger.com/
website: >-
  https://web.archive.org/web/20160601075009/https://www.ledgerwallet.com/products/6-ledger-unplugged
shop: 
country: FR
price: 29EUR
repository: https://github.com/LedgerHQ/ledger-javacard
issue: 
icon: ledger.osjavacard.png
bugbounty: 
meta: defunct
verdict: noita
appHashes: 
date: 2022-05-20
signer: 
reviewArchive: 
twitter: ledger
social:
- https://www.facebook.com/Ledger/
- https://www.instagram.com/ledger/
- https://www.linkedin.com/company/ledgerhq
- https://www.tiktok.com/@ledger
- https://www.youtube.com/Ledger
features: 

---

## Background 

The Ledger Open Source Java Card applet is also known as {% include walletLink.html wallet='hardware/ledgerunplugged' verdict='true' %}

> This applet is an implementation of the Ledger Wallet Hardware Wallet specification emulating an NFC Forum Type 4 tag to display the second factor, with specific extensions
>
> It is compatible with the core API with a few limitations if not using a proprietary API to recover public keys - the public key cache needs to be provisioned from the client side.
>
> A demonstration of this application and workaround if no proprietary API is present is provided in the Python API and also in Mycelium
>
> Several other integration examples are provided on Ledger Unplugged product page
>
> Developers can also check if a Java Card platform is supported and its performance with the Eligibility applet

You can still find the product page for the {{ page.title }} on [archive.org](https://web.archive.org/web/20160601075009/https://www.ledgerwallet.com/products/6-ledger-unplugged)

## Discontinued 

The {{ page.title }} was [discontinued](https://support.ledger.com/hc/en-us/articles/360010500620-Discontinued-products?docs=true) sometime at the beginning of 2017. u/murzika (Eric Larchevêque) Chairman and Co-founder of Ledger has this to say on [Reddit:](https://www.reddit.com/r/Bitcoin/comments/5p4oza/comment/dcoc4c5/?utm_source=reddit&utm_medium=web2x&context=3)

> You can buy the a NFC card directly on Fidesmo's website (http://shop.fidesmo.com/) and then buy the Ledger app. It'll be a full equivalent of the Unplugged.
> 
> We stopped selling it (the Ledger Unplugged) directly because there was too much customer support needed: NFC is not working well (generally speaking) and depending of the phone and the environment the communication with the card didn't work well all the time.

Nicolas Bacca had this to [add:](https://www.reddit.com/r/Bitcoin/comments/5p4oza/comment/dcocntn/?utm_source=reddit&utm_medium=web2x&context=3) 

> also Fidesmo provides more form factors for you to choose from (such as directly running it on a yubikey)

## Analysis 

The {{ page.title }} has **no interface** and is **no longer in production**.

