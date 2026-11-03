---
title: Zaif　ビットコイン・暗号資産（仮想通貨）取引アプリ
date: 2026-10-31
authors:
- leo
website: https://zaif.jp/
twitter: zaifdotjp
android:
  appId: jp.zaif.zaifapp
  users: 10000
  appCountry: us
  updated: 2026-09-02
  version: 1.1.26
  icon: jp.zaif.zaifapp.webp
  meta: ok
  verdict: custodial
  developerName: 株式会社Ｚａｉｆ
iphone:
  appId: jp.zaif.zaifapp
  idd: '6443809031'
  appCountry: jp
  released: '2023-11-12T08:00:00Z'
  updated: 2026-09-02
  version: 1.1.26
  reviews: 62
  icon: jp.zaif.zaifapp.webp
  meta: ok
  verdict: custodial
  developerName: Zaif inc.

---

## App Description

This is the official app of Zaif Inc. (株式会社Ｚａｉｆ), a Japanese crypto exchange registered as a "Crypto Asset Exchange Business" with the Kinki Local Finance Bureau (No. 00001). The app replaces {% include walletLink.html wallet='android/jp.fcce.zaifapps' verdict='true' %}. It offers account opening, "Deposit and Withdraw Japanese Yen and Cryptocurrencies", easy buying and selling, orderbook trading, and "Coin Savings" (recurring purchases). Its Play description warns: "In the event of our bankruptcy, we may not be able to return any money or cryptocurrency you have deposited."

## Analysis

- **History.** In September 2018, while Tech Bureau ran Zaif, hackers stole about 7 billion yen in bitcoin, monacoin and bitcoin cash, [according to a 2019 report](https://finance.yahoo.com/news/hacked-crypto-exchange-zaif-resuming-120518736.html). The same report says the exchange then passed "from its previous owner, Tech Bureau, to an existing crypto exchange owned Fisco", effective April 22, 2019. Zaif's [company page](https://corp.zaif.jp/outline/) now lists 株式会社ＪＮグループ (JN Group) as its shareholder.
- **Bitcoin support.** The Play description recommends the app to users who "Want to save up Bitcoin" and "Want to buy and sell altcoins as well as Bitcoin".
- **Sending and receiving.** Zaif's [maintenance notice of October 20, 2026](https://corp.zaif.jp/maintenance/20261020-1) pauses "BTCの入出金サービス" ("the BTC deposit and withdrawal service") for several days, which shows that the service normally exists. Zaif's [security notice](https://corp.zaif.jp/info/unauthorized-access-prevention) recommends restricting "出金先アドレス" ("withdrawal destination addresses") to pre-registered ones.
- **Custody.** In a [December 2024 statement on customer assets](https://corp.zaif.jp/info/20241224_1-0), after the DMM Bitcoin theft, Zaif says that it keeps part of its customers' assets with a wallet vendor and that "暗号資産の移動に必要な秘密鍵は当社にて厳重に管理している" ("the private keys needed to move crypto assets are strictly managed by our company"). The Play description lists "an exchange that manages cryptocurrencies in a cold wallet" among its selling points.

Zaif manages the private keys for its customers' coins, so the app is {% include verdictBadge.html verdict="custodial" type='short' %}, like the app it replaces.

**Custodial: The provider holds the keys**
