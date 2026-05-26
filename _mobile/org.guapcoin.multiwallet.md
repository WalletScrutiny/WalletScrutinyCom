---
wsId: guapcoinWallet
title: Official Guap & Bitcoin Wallet
verdict: nosource
meta: removed
authors:
- danny
website: https://www.guapcoin.org
twitter: guapcoin
social:
- https://t.me/+VE9iA6mWwgB7oQZ0
- https://www.youtube.com/@GuapCoinOfficial
- https://www.facebook.com/guapcoinofficial
redirect_from:
- /android/org.guapcoin.multiwallet/
- /iphone/org.guapcoin.multiwallet/
android:
  appId: org.guapcoin.multiwallet
  users: 1000
  released: 2020-02-27
  updated: 2022-09-14
  version: 1.1.0
  reviews: 23
  icon: org.guapcoin.multiwallet.png
  date: 2025-03-17
  developerName: She Interactive, LLC
iphone:
  appId: org.guapcoin.multiwallet
  idd: '1498193127'
  appCountry: us
  released: 2020-02-25
  updated: 2022-09-24
  version: 1.1.3
  reviews: 48
  icon: org.guapcoin.multiwallet.jpg
  date: 2024-07-05
  developerName: Guap Coin, LLC

---

## Android

## App Description from Google Play

> Guap Coin is a cryptocurrency that was created to economically empower people of the Global African Diaspora. Let us take ownership of Black and Brown spending power and enrich our communities with it.
>
> This wallet enables Guap Coin adopters to easily send and receive Guap Coin & Bitcoin and create wallet addresses. Anyone can join the Guap AND Bitcoin revolution.
>
> Send and receive Guap as well as Bitcoin easily.

## Analysis 

- We signed up with the service using our email address. 
- A bitcoin wallet is present. It's in P2SH format.
- The mnemonics were not presented during initialization. 
- There is an option to back up the private keys of both Guapcoin and Bitcoin. There is a caveat, the format is not standard and possibly not valid. It is presented in a 35-character string that as far as we know, isn't in any of the standard Bitcoin private key formats. 
  > L4yN6qnYbzA3eBakmCRFnhGqP2AGTLi81mS6f83GhEEZSaUwdZEA
- Nevertheless, assuming that the app is indeed self-custodial, they do have a link to a [GitHub repository](https://github.com/guapcrypto/Guapcoin/releases). Unfortunately, none of the files here seem to point to the source code of the APK file. 

For this reason, this app is **not source-available**.

---

## iPhone

{% include copyFromAndroid.html %}
