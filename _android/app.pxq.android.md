---
wsId: pxqWallet
title: 'PXQ Wallet: Custom Seed Wallet'
altTitle: 
authors:
- danny
users: 10000
appId: app.pxq.android
appCountry: 
released: 2023-04-19
updated: 2024-03-17
version: 1.1.2
stars: 2.4
ratings: 
reviews: 4
website: https://pxq.app
repository: 
issue: 
icon: app.pxq.android.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-24
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: PXQ Group
features: 

---

## Update 2024-07-24

Nothing suggests that they've changed their policy concerning the availability of their code.

## App Description from Google Play 2023-08-29

> Create a secure, easy-to-use, and customizable cryptocurrency wallet with advanced staking options to maximize your digital assets' potential.
>
> PXQ Wallet puts you in control by allowing you to create your unique seed phrase to generate your wallet. This customization feature gives you an extra layer of security and personalization, making your wallet more secure and easily memorable
>
> PXQ Wallet supports a broad range of cryptocurrencies, including Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), TRON (TRX) and many more. Our extensive support ensures that you can manage your diverse portfolio in one place.

## Analysis 

- Wallet creation starts with 12 personal random questions
- We searched on GitHub Code for the app ID and found [0 results](https://github.com/search?q=app.pxq.android&type=repositories).
- It turns out that the answers to the security questions would become the seed phrases. We then created a passcode. Described from the site:
  > A custom seed phrase is a unique series of words you set up when creating your PXQ Wallet account. This phrase acts as a password for your wallet, and it's essential to store it safely as it can be used to recover your wallet if needed.
  >
  > PXQ Wallet prioritizes user security. Your private keys are stored only on your device, not on any servers, giving you full control over your digital assets. Additionally, the custom seed phrase feature provides an extra layer of security.
- Note that the wallet can be restored using the custom seed phrase.
- We found a Bitcoin wallet with a P2SH address which can send/receive.
- ⚠️  We tried to back up the phrases from the settings, but the app would be stuck in a loop of asking us the 6-digit passcode. It appears to be broken. It doesn't really inform on what is being backed-up or how. 

The provider claims that the private keys are stored on the user's device, thus implying that it is self-custodial. However, there are no claims regarding source-availability, and we were not able to find a repository. This app is **not source-available**.
