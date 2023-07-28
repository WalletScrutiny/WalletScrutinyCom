---
wsId: 
title: 'PXQ Wallet: Custom Seed Wallet'
altTitle: 
authors:
- danny
users: 10000
appId: app.pxq.android
appCountry: 
released: 2023-04-19
updated: 2023-07-03
version: 1.0.5
stars: 4.6
ratings: 
reviews: 14
size: 
website: https://pxq.app
repository: 
issue: 
icon: app.pxq.android.png
bugbounty: 
meta: ok
verdict: custodial
date: 2023-07-28
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: PXQ Group
features: 

---

## App Description from Google Play

> Create a secure, easy-to-use, and customizable cryptocurrency wallet with advanced staking options to maximize your digital assets' potential.
>
> PXQ Wallet puts you in control by allowing you to create your unique seed phrase to generate your wallet. This customization feature gives you an extra layer of security and personalization, making your wallet more secure and easily memorable
>
> PXQ Wallet supports a broad range of cryptocurrencies, including Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), TRON (TRX) and many more. Our extensive support ensures that you can manage your diverse portfolio in one place.

## Analysis 

- Wallet creation starts with 12 personal random questions
- We searched on GitHub Code for the app ID and found [0 results](https://github.com/search?q=app.pxq.android&type=repositories).
- It turns out that the answers to the security questions would become the seed phrases. We then created a passcode. 
- We found a Bitcoin wallet with a P2SH address which can send/receive.
- We tried to back up the phrases, but the app would be stuck in a loop of asking us the passcode. It appears to be broken.
- We could not really say that this is a self-custodial wallet, since the "seed phrases" were not generated through cryptographic means but by asking personal questions. Furthermore, this app is not source-available.
- Whenever we tried the 'backup' option in the settings it would simply revert to the settings screen, leading us to conclude that the app did not really allow the backup of private keys. 
- Without any option to back up the keys, this would be a **custodial** app, and thus **not-verifiable**.
