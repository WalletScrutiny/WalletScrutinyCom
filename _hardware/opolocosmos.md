---
title: OPOLO Cosmos
appId: opolocosmos
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 89
- 66
- 9.5
weight: 2.79
provider: OPOLO Limited
providerWebsite: https://www.opolo.io
website: https://www.opolo.io/
shop: https://shop.opolo.io/
country: LU
price: 198EUR
repository: 
issue: 
icon: opolocosmos.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2022-11-09
signer: 
reviewArchive: 
twitter: OpoloWallet
social:
- https://www.linkedin.com/company/opolo-ltd
- https://www.facebook.com/opolo.wallet.3
- https://medium.com/@OPOLOCosmos
features: 

---

This small hardware wallet features a 3.2 inch touchscreen and allows users to set a password on setup. It has a companion app for desktop and mobile.

On [their homepage](https://www.opolo.io/), OPOLO LTD. claims that their product is EAL6+ certified:

> With the OPOLO wallet, we are offering the best cryptocurrency hardware wallet on the market today. We gauge cryptocurrency wallets using EAL Certifications. These certifications can range from 1 to 7, with most of the best cryptocurrency hardware wallets in the market falling between 1 - 5.
>
> Our OPOLO Cosmos best cryptocurrency hardware wallet uses an EAL 6+ secure element. If you are looking for a secure bitcoin hardware wallet, you are in the right place. Our secure bitcoin hardware wallet is easy to backup and recover, simple to use, and comes with an EAL6+ level of security.


[Creating a new wallet](https://opolo.io/wiki/doku.php?id=get-started:create-wallet) requires that the user installs the OPOLO Desk app. The hardware wallet must be connected via USB to an external computer running the app. When pairing the app with the hardware wallet, the user must authenticate by entering the password. To create the wallet, the user must click on a button on the OPOLO Desk app. The hardware wallet then provides the user with a 24-word BIP39 mnemonic phrase.

OPOLO relies on the desktop app to [send and receive assets](https://opolo.io/wiki/doku.php?id=coin-management:use-bitcoin-in-opolo) or import and create new wallets. There is no option to create a new wallet on the device itself. 

## Source code

Searching around on the internet for OPOLO's source code lead to a GitHub user
profile "OPOLO-Ltd" but it lead to a 404 page. This product's reliance on the
desktop app is not bad in and of itself, but unfortunately, **neither the
firmware nor the desktop app have public source code.** This means that the
users have no idea what is going on behind the scenes and will simply have to
trust that manufacturers have not put any malicious code in the firmware or the
desktop app. This product is **not verifiable**.
