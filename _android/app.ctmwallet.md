---
wsId: 'ctpayWallet'
title: 'CTPAY'
altTitle: 
authors:
- 'danny'
users: 10000
appId: 'app.ctmwallet'
appCountry: 
released: '2021-12-28'
updated: 2025-01-22
version: '1.0.24'
stars: 3.8
ratings: 
reviews: 4
website: 
repository: 
issue: 
icon: 'app.ctmwallet.png'
bugbounty: 
meta: 'ok'
verdict: 'nobtc'
appHashes: 
date: '2023-07-18'
signer: 
reviewArchive: 
twitter: 
social:
- 'https://ctpay.io'
redirect_from: 
developerName: 'cccode'
features: 

---

## App Description from Google Play

> CTPAY is a crypto wallet which allow users to save their own private key. Now we’re supporting Bitcoin, Ethereum and BSC network.

## Analysis

- The app disallowed us from using a virtual machine to inspect the app.
- When we downloaded the app, we were asked to fill up:
    - Email address
    - Password (no parameters mentioned, but we used standard upper, lower, number and symbol)
    - Empty referral code (optional)
- We tapped on the "Agree to the terms and conditions and register" button. Nothing happened. It merely says "Basic info is needed". We uninstalled and re-installed the app. 
- This time, we tapped the two required permissions even though there's no visual feedback that we enabled them. Registration worked, and the email verification was sent. 
- It asked us to provide security questions. 
- The answer to the security question was replaced by a string which we had to save.
- The phone then auto-screenshots the previous screen and asks us to send it through the available options. We finished registration.
- We were brought to the main interface and found a "BTC wallet". Strangely, it had a [0xb prefix](https://twitter.com/BitcoinWalletz/status/1681223839286476800). We searched on blockchair and confirmed that this **cannot** possibly be a [bitcoin address](https://blockchair.com/search?q=0xb40c156adc1594fe3bd770e3c92411b5c76ab87d). 
- We then inspected the other "wallets" and found that they all had the same exact address. 
- Suffice to say, that this app has several strange characteristics. Until some of its quirks are ironed out, we come to the conclusion that: it's not self-custodial because it does not provide the private keys, and does **not currently support BTC**, despite their claims.