---
title: "Sallet One"
appId: salletOne
authors:
- danny
released: 
discontinued: # date
updated:
version:
dimensions: 
weight: 
website: https://salletone.com/
shop: https://salletone.com/?r=front/product&S_ID=20210520114827&ID=994
company: Sallet One
companywebsite: 
country: 
price: $100
repository: https://github.com/SalletOne/
issue:
icon: salletone.png
bugbounty:
verdict: wip # wip noita nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-01-17
signer:
reviewArchive:


providerTwitter: salletone
providerLinkedIn: 
providerFacebook: salletone
providerReddit: Sallet_Atelas
---

The Sallet One hardware wallet has many of the characteristics of a mobile wallet app - except that it is not connected to the Internet. The only means for it to communicate is through its own QR code scanner. This characteristic makes it a true cold wallet.

The 12-word mnemonic phrase is generated after setting the device password.

The hardware wallet requires a companion app: {% include walletLink.html wallet='android/com.yaolian.qoline' verdict='true' %} 

The [user manual](https://salletone.com/?r=front/news&S_ID=20210427140342) describes the procedure once a user unboxes his Sallet One device.

1. Password setting
2. Mnemonic phrase generation
3. Confirmation of mnemonic backup
4. Mnemonic words import
5. Password
6. Home page is the wallet address
7. QR code for receiving
8. The device can generate any number of addresses for multiple currencies
9. The device can scan the QR code from the app
10. The transaction details are confirmed and confirmed through the device itself.

Interestingly, Sallet One seems to be [selling its source code for $35](https://www.salletone.com/cn/?r=front/product&S_ID=20210520114827&ID=1084). We don't know exactly, if that is the page's intent since we had to translate the web page using Google Translate. But if we are correct, the translation to the product page reads as: **'Sallet One GitHub Source Code - $35'**

We were able to locate Sallet One's GitHub repository. 

This Bitcoin hardware wallet's security features should be scrutinized further.


