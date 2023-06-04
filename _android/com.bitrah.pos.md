---
wsId: 
title: Bitrah
altTitle: 
authors:
- danny 
users: 1000
appId: com.bitrah.pos
appCountry: 
released: 2020-07-21
updated: 2023-02-07
version: 3.0.1
stars: 
ratings: 
reviews: 
size: 
website: https://bitrah.com/
repository: 
issue: 
icon: com.bitrah.pos.png
bugbounty: 
meta: ok
verdict: custodial
date: 2023-05-12
signer: 
reviewArchive: 
twitter: 
social:
- https://t.me/bitrah_com 
redirect_from: 
features: 

---

## App Description from Google Play 

> - Based on the powerful technology of Blockchain
- Ability to trade with the most common cryptocurrencies
- High security
- International sales and payment in Rials
- Ability to create online gateway and PC POS
- Support 24 hours a day
- Ability to interact financially with the world
- Ability to pay at any time and place
- Easy user interface and application

## App Description from Website 

> BitRah as an Iranian company relying on powerful technology and its creative team in the field of blockchain and cryptocurrency, It has introduced a new way to facilitate the receipt of funds for the sale or provision of services to foreign customers. This collection has made it possible to expand international trade for online and offline trade, thus removing the burden of sanctions from Iranian businesses.

### [Technical Documentation](https://bitrah.com/en/documents) 

> To conduct a cryptocurrency transaction, the customer must be directed towards Bitrah payment page. On this page, the customer selects the amount of Rials and relevant cryptocurrency rate and has a potential for confirming the payment by observing the system's bid price. On the payment confirmation page, the payment destination address is displayed along with the amount. The user makes use of the QR code to transfer money through his wallet. If the customer is not able to scan the QR code, there is a possibility for them to get the payment process completed by entering the address manually. Upon completion of the transaction, the customer will be referred to the specified address by merchant system.
>
> After the payment is completed by the customer, the transaction begins to remain in the pending state until their deposits are confirmed on the crypto network. Once the transaction status in the network is specified, Bitrah platform commences informing the merchant system of the final transaction status.
>
> Ultimately, Bitrah settles the store account on a daily basis by aggregating the store transactions.

## Analysis 

After perusing the documentation, we determine it as some sort of payment gateway and Point-of-Sale system with cryptocurrency payment integration including BTC. 

What we can't determine is this: which party or software generates the private keys?  

From the [demonstration](https://bitrah.com/en/payment-demo), it would appear that the BitRah app generates the QR codes or the public addresses (and thus the private keys). 

From there, we are not sure how the funds are transferred to the merchant/user. Is it through cryptocurrencies as well, or via traditional financial methods. We sent them a clarificatory message via email: support@bitrah.com 

While some details are not yet ironed out, it is commonplace for point-of-sale providers to have initial custody of the coins. That is how they generate revenue after all similar to traditional finance's "transaction fees". In the demo, the fact that the QR code is generated through the app would mean that it is BitRah itself which enabled this. While we wait for some clarification, this is enough to view this app as a **custodial** one.

