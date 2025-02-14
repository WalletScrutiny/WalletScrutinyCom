---
wsId: 'coinCloudWallet'
title: 'Coin Cloud: Wallet'
altTitle: 
authors:
- 'danny'
users: 10000
appId: 'com.coincloud.walletpreview'
appCountry: 
released: '2022-02-02'
updated: '2023-03-09'
version: '12.9.24'
stars: 3.4
ratings: 
reviews: 44
size: 
website: 'http://coin.cloud/app'
repository: 
issue: 
icon: 'com.coincloud.walletpreview.png'
bugbounty: 
meta: 'removed'
verdict: 'nosource'
appHashes: 
date: '2024-03-02'
signer: 
reviewArchive: 
twitter: 'bitstopofficial'
social:
- 'https://www.facebook.com/Bitstopofficial'
- 'https://www.instagram.com/bitstopofficial'
- 'https://www.youtube.com/channel/UCInWJCpASNIgENyo9uep0lA/videos'
redirect_from: 
developerName: 'Coin Cloud'
features: 

---

## App and Company History

- Today the url coin.cloud/app redirects to a different domain [(bitstop.co)](https://bitstop.co/), with different apps:
  - {% include walletLink.html wallet='android/co.hodlwallet' verdict='true' %}
  - {% include walletLink.html wallet='iphone/co.hodlwallet' verdict='true' %}

- Genesis Coin, Inc. [was acquired](https://www.nasdaq.com/articles/worlds-largest-bitcoin-atm-software-platform-acquired-by-bitstop-founders) by BitStop founders, January 2023
- Coin Cloud has filed for Chapter 11 bankruptcy last February 2023
- Coin Cloud was [acquired](https://www.atmmarketplace.com/news/genesis-coin-to-add-more-than-5700-crypto-atms-from-coincloud/) by Genesis Coin in July 2023

We didn't dig further as to why the dates don't line up. Our guess is it has something to do with paperwork and filings that do not coincide with the press releases. But ultimately, BitStop became the surviving monolithic entity - hence, the reason for the redirection of the domains. 

## Why does Coin Cloud have so many apps? 

Bad versioning. We took a look at the history of the url "coin.cloud/app" and found that the app was different. 

**For [June 2021](https://web.archive.org/web/20210616162825/https://coin.cloud/app) the linked apps were:**

- {% include walletLink.html wallet='android/com.bitpay.coincloud' verdict='true' %}
- {% include walletLink.html wallet='iphone/com.bitpay.coincloud' verdict='true' %}

**For [March 2023](https://web.archive.org/web/20230316190543/https://coin.cloud/app) the linked apps were:**

- {% include walletLink.html wallet='android/com.coincloud.walletpreview' verdict='true' %}
- {% include walletLink.html wallet='iphone/com.coincloud.walletpreview' verdict='true' %}

## App Description from Google Play

> Secure, customizable non-custodial cryptocurrency wallet
>
> Keep your bitcoin and other digital currency secure and under your own control with the non-custodial Coin Cloud Wallet app. No third-party custodial services or key management — we put the power back in your hands with full access to your locally stored private keys, so what you do with your money is always your choice.

## Analysis

- We were not able to install since the app was geo-restricted.
- The domain coin.cloud redirects to bitstop.co
- Coin.cloud used to have articles about storing the mnemonics, but these are no longer accessible after they started redirecting their domain to bitstop. This is still accessible via [archive.org.](https://web.archive.org/web/20230329040518/https://www.coin.cloud/blog/how-to-secure-your-coin-cloud-wallet)
- BitStop is a Bitcoin ATM service provider. They require KYC, and according to their terms, may require users to submit information such as Tax Identification, proof of ownership of the email address, etc.
- They claim to be non-custodial. We were [not able to find](https://github.com/search?q=com.coincloud.walletpreview&type=code) any instances of their app ID, when searching GitHub Code. They did **not claim to be source-available.**
