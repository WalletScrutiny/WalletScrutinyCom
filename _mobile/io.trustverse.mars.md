---
wsId: marSDigitalAssetWallet
title: MarS
verdict: nosource
meta: removed
date: 2024-05-18
authors:
- danny
twitter: TrustVerse
social:
- https://www.facebook.com/trustverseofficial
- https://t.me/trustverse_officialchannel
- https://www.instagram.com/trustverse_official
- https://trustverse-official.medium.com
- https://www.trustverse.io
redirect_from:
- /android/io.trustverse.mars/
- /iphone/io.trustverse.mars/
android:
  appId: io.trustverse.mars
  users: 5000
  released: 2020-05-27
  updated: 2022-11-22
  version: 2.4.0G
  icon: io.trustverse.mars.jpg
  website: http://www.trustverse.io
  developerName: TrustVerse(DigiFinance)
iphone:
  appId: io.trustverse.mars
  idd: '1567874624'
  appCountry: kr
  released: 2021-08-10
  updated: 2022-11-24
  version: 2.0.1
  reviews: 3
  icon: io.trustverse.mars.jpg
  developerName: trustverse

---

## Android

## App Description from Google Play

> Through MarS, a cryptocurrency wallet, you can comprehensively manage Bitcoin, Ethereum, and Aergo-based cryptocurrencies and NFTs.
>
> You can safely send and receive various cryptocurrencies and NFTs. Also, keep and enjoy the NFTs you have purchased. In preparation for the loss of the seed phrase, MarS has performed with the MasterKey service. Prepare for the worst possible situation with MarS!
>
> - Convenient and fast usability
>
> You can check and manage all ERC-20 compatible tokens including Bitcoin, Ethereum, Bitcoin Cash, and Trustverse, as well as Argo-based cryptocurrencies and NFTs at a glance.
>
> - Interlocking with recovery service, it is safe even if you lose your seed phrases
>
> By perfectly interlocking with the Master Key service, you can safely restore your wallet even if you lose your phone or recovery text. See https://www.the-masterkey.com#deadLink for details.

## Analysis 

- Once we opened the app, it opened a browser page to a subdomain of trustverse.io. (This is strange because the primary domain, trustverse.io shows a GoDaddy parking page. The www.trustverse.io domain shows the website.) There we filled out our profile and verified both our email address and phone number.
- We were provided with a 12-word seed phrase.
- We found a BTC wallet that can send and receive.
- There were no claims that the app was public source, but they do have a [GitHub](https://github.com/trustverse) organization page.
- GitHub Code only has 2 results when we searched for the app ID, both were related to WalletScrutiny and unrelated to the possible source of the Android app. 
- The app is **not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}
