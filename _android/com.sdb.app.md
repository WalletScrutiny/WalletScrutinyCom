---
wsId: 
title: SDB-Buy Bitcoin,BTC,ETH&Crypto
altTitle: 
authors:
- danny
users: 10000
appId: com.sdb.app
appCountry: 
released: 2022-12-07
updated: 2023-03-28
version: 2023.03.27
stars: 
ratings: 
reviews: 
website: 
repository: 
issue: 
icon: com.sdb.app.png
bugbounty: 
meta: removed
verdict: custodial
appHashes: 
date: 2024-10-19
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: CLARK DERICK EUGENE
features: 

---

## App Description from Google Play

> SDB focuses on providing safe, stable, easy-to-use and fast trading services for digital assets (including: Bitcoin, ETH, Litecoin and dozens of other digital assets) for global users. 
>
> Support a variety of digital asset trading pairs: BTC/USDT, ETH/BTC, DFT/ETH, LTC/BTC, EOS/ETH, OMG/BTC, XRP/ETH, etc.

## Analysis

- The app has not listed its website in its developer contact.
- When we registered the verification email came from a different domain - digifinex.com
- Tapping "deposit" in the main interface of the app does not show a Bitcoin network option. It is only by accessing 'wallet' can we see a bitcoin P2SH address for depositing.
- Strangely, under device management, it also describes this running instance as "Digifinex app".

- {% include walletLink.html wallet='android/com.digifinex.app' verdict='true' %}

- The processes involved in the creation of a self-custodial wallet are not evident. There were no seed phrases during app initialization. There is no option to back up the private keys in the options. This leads us to conclude that this app is **custodial** and therefore **not-verifiable**.

