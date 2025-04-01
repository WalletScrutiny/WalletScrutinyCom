---
wsId: 
title: Money Storage
altTitle: 
authors:
- danny
users: 10000
appId: ua.money.storage.moneystorage
appCountry: 
released: 2018-02-08
updated: 2024-02-01
version: 2.1.0
stars: 3.4
ratings: 
reviews: 3
website: 
repository: 
issue: 
icon: ua.money.storage.moneystorage.png
bugbounty: 
meta: stale
verdict: custodial
appHashes: 
date: 2025-01-27
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: Bitsofta
features: 

---

## App Description from Google Play

> Money Storage app allows you to securely store and manage your finances easily - you can send money to friends or pay for purchases and services with a single touch of your smartphone screen
>
> Money storage mobile app allows you to:
> - secure your finances;
> - make instant transactions to your friends and acquaintances;
> - make deals with other users;
> - exchange currencies easily;
> - choose the recipient from your mobile contact list;
> - refill your wallet in a convenient method for you;
> - request to refill your wallet from other users;
> - check the exchange rates and currency;
> - refill your wallet without entering the numbers, scanning QR-code;
> - initiate the operation from any application screen;
> - view current history transactions in real time.

## Analysis

Money Storage uses an online id-verification system called [e.id](https://e-id.cards/#/). The service first gets the user's email address, mobile phone number, then Telegram username, Viber, WeChat and WhatsApp. 

Before the user even gets to see the Terms and Conditions, he would have provided several pieces of personally identifiable data to a little-known company. 

Curiously, the privacy policy link in its Google Play page links to ect.money, which is some sort of ICO token platform. The primary language on that website is Russian. They also sell cryptocurrency miners and have a community called Mercury Community.

When we finally found the 'agreement', it was replete with grammatical errors and does not specify details you would normally find in legitimate apps. 

We finally managed to access the app. 

The first screen is 'Create a Wallet'. The mix of currencies to choose from is somewhat perplexing as they are of different types: United States Dollar, Euro, Gold, eCurrency, and Bitcoin. We tapped 'Wallet Creation' and it gave a message 'Wallet successfully created'. It did not provide the seed phrases.

We then chose 'Top Up'. We inputted the amount and the BTC currency. We then tapped, 'Top Up'. The next screen then provided a legacy BTC address with a QR code. This is not easily viewable through the interface. We find it moderately concerning. 

We did not find any option to view, backup or restore the private keys. 

This is sufficient for us to file this app as **custodial**. 

