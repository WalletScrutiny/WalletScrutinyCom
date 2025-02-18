---
wsId: rakutenLeverage
title: 証拠金取引（レバレッジ）アプリ　楽天ウォレットPro
altTitle: 
authors:
- danny
users: 10000
appId: jp.co.rakuten.wallet.leverage
appCountry: 
released: 2020-03-22
updated: 2023-02-17
version: 1.2.4
stars: 
ratings: 
reviews: 
website: https://www.rakuten-wallet.co.jp/
repository: 
issue: 
icon: jp.co.rakuten.wallet.leverage.png
bugbounty: 
meta: removed
verdict: custodial
appHashes: 
date: 2024-02-05
signer: 
reviewArchive: 
twitter: Rakuten_Wallet
social: 
redirect_from: 
developerName: Rakuten Wallet
features: 

---

## App Description from Google Play

> - Issues handled by Rakuten Wallet Margin Trading
>   - BTC/JPY
>   - ETH/JPY
>   - BCH/JPY
>   - LTC/JPY
>   - XRP/JPY
>
> In response to customer requests, Rakuten Wallet aims to provide industry-leading spreads, especially for altcoin brands.
>
> Professional trading tools
> 
> Protect deposits as trust assets
> 
> Equipped with a variety of ordering methods such as speed order, OCO/IFD/IFO, and popular technical indicators, it is a specification that even experienced users can be satisfied with.

## Analysis 

- This app comes from the same developer of another Rakuten app: {% include walletLink.html wallet='android/jp.co.rakuten.wallet.crypto' verdict='true' %}

- Rakuten is a digital bank, and these apps are a part of its thrust to enter the virtual currency market which started in 2019.
- This is their leverage trading app. Unfortunately, the entirety of the app is in Japanese and the website documentation is inaccessible to us, so we were not able to install and register.
- A press-release is available for their [leverage/margin trading app](https://global.rakuten.com/corp/news/press/2020/0302_02.html).
- There are several pre-conditions before using the leverage trading app:
    - Must install the crypto exchange app
    - Must have a Rakuten bank account
    - Must be an experienced trader
- We were able to access an archived version that dates back to 2021. No archive entries were found for 2022 and 2023. 
- After some digging, we found some documentation that shows that Rakuten makes use of **cold-storage** mechanisms to protect the user's assets. This is taken from the [translated archive](https://web.archive.org/web/20211103144230/https://www.rakuten-wallet.co.jp/service/security.html):

     > Cold wallet operation management
     >
     > All crypto assets (virtual currencies) owned by customers are stored in cold wallets, and private keys are also managed with multisig, which requires multiple signatures. Regarding the management of cold wallets and private keys, we are working to provide a safe and secure transaction environment in partnership with a SECOM group company that has expertise in electronic key operations.

- This makes it *custodial* and **not-verifiable**.
