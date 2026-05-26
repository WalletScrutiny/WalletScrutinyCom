---
wsId: coinTraderMobile
title: Shift Platform
verdict: custodial
meta: removed
authors:
- danny
twitter: shiftmarkets
social:
- https://www.linkedin.com/company/shiftmarkets
- https://www.facebook.com/shiftmarketsnyc
- https://shiftmarkets.medium.com
redirect_from:
- /android/com.shiftmarkets.cointrader/
- /iphone/com.shiftmarkets.cointrader/
android:
  appId: com.shiftmarkets.cointrader
  users: 1000
  released: 2019-01-28
  updated: 2025-01-24
  version: 4.14.0
  icon: com.shiftmarkets.cointrader.png
  date: 2025-03-29
  website: https://www.shiftmarkets.com/
  developerName: Shift Markets Ltd
iphone:
  appId: com.shiftmarkets.cointrader
  idd: '1448372085'
  appCountry: gb
  released: 2021-07-02
  updated: 2023-02-13
  version: 4.1.0
  reviews: 0
  icon: com.shiftmarkets.cointrader.jpg
  date: 2023-12-19
  website: https://exchange.shiftmarkets.com#deadLink
  developerName: Shift Markets

---

## Android

## App Description from Google Play

> Top of the line trading UI: CoinTrader is a premier trading and financial technology company. We’ve built the best digital asset exchange by focusing on the needs of professional traders and digital currency experts. We are dedicated to making digital currency trading accessible, fast and totally secure.
>
> Trade Major Digital or Fiat Currency: We offer all the major digital and fiat currency pairs that you love to trade.

## Analysis 

- Shiftmarkets is a general service provider which also offer the following services: 
  - Crypto Exchange Software 
  - Crypto Pay
  - Cryptocurrency Licensing and Regulation
  - NFT Solutions
  - Market Making Technology
  - Blockchain Integrations
- The [terms](https://exchange-demo.shiftmarkets.com/terms) that we agreed to when we were registering with the service was for a demo of their exchange.
- We noticed a discrepancy in their app when we went to the deposit segment. We were supposed to deposit BTC, but the app gave an address that started with a non-BTC standard character of 'm'. The notice text under the QR code also notifies the user to *"Send only Ethereum chain to this deposit address. Deposits sent from other networks will be lost."* This is incorrect since this has to be a BTC wallet. We [tweeted](https://twitter.com/BitcoinWalletz/status/1694913991355883725) them about it.
- Moreover, the app seems to be preloaded with 20,000 XRP, 1 BTC, 10,000 USDT, 10,000 USD, 5 ETH, and 10 BCH. Perhaps this is a demo, but it was not made clear that this was a demo account. 
- Nevertheless, we found section 4.4 in their terms:
  > Cointrader securely stores all Digital Currency private keys in our control...

Although there was some initial confusion about the addresses and the lack of a designation that the initial account was a demo account, the terms make it clear that this is a **custodial** provider with a **non-verifiable** app.

---

## iPhone

{% include copyFromAndroid.html %}
