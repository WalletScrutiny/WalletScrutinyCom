---
title: Vivid Business and Personal
date: 2026-07-24
authors:
- danny
website: https://vivid.money/
twitter: vivid_en
social:
- https://www.linkedin.com/company/vividmoney
- https://www.facebook.com/vivid.money.en
redirect_from:
- /android/vivid.money/
- /iphone/com.vivid.money/
- /mobile/com.vivid.money/
android:
  appId: vivid.money
  users: 1000000
  appCountry: us
  released: 2020-10-09
  updated: 2026-07-28
  version: 4.38.0
  reviews: 8
  icon: vivid.money.png
  meta: ok
  verdict: nosendreceive
  developerName: Vivid Money GmbH
iphone:
  appId: com.vivid.money
  idd: 1504417378
  appCountry: jp
  released: 2020-10-09
  updated: 2026-07-24
  version: 4.37.0
  reviews: 17
  icon: com.vivid.money.jpg
  meta: ok
  verdict: nosendreceive
  developerName: Vivid Money GmbH

---

## App Description

Vivid is a mobile banking and investing app from Vivid Money, offered to both personal and business customers and published under the identifier `vivid.money` on Android and `com.vivid.money` on iOS. Its store listings describe a current account with IBANs and Visa cards, cashback, interest-bearing accounts, and investing in stocks and ETFs from small amounts. Among these features is a "Crypto Pocket" for buying and selling cryptocurrency; the listing advertises trading of *"150+ coins 24/7,"* including Bitcoin and Ethereum.

## Testing and Analysis

We did not test the app; this assessment is based on Vivid's own published documentation, retrieved 2026-07-24. Crypto is one feature of a broader neobank, delivered through the in-app "Crypto Pocket."

**Vivid now holds real cryptocurrency, custodially.** This is a change from an earlier model in which Vivid offered only "Fractional Coins" — OTC derivatives that tracked a coin's price without conveying ownership. Under its current "Crypto 2.0" offering, customers own the underlying assets, but Vivid — not the user — holds them. Vivid's help centre states: *"When you purchase crypto-assets, Vivid Money B.V. securely stores it in a blockchain wallet alongside other customers' holdings. At Vivid Money B.V. we hold a ledger that enables us to accurately track and record your crypto-asset holdings"* ([Vivid Personal Help Center](https://support.vivid.money/en/articles/9298209-do-i-have-my-own-crypto-wallet-at-vivid), 2025-06-19). The [crypto product page](https://vivid.money/en-eu/personal/investments/crypto/) adds that *"your cryptocurrencies are stored at Copper — one of the leading custody providers,"* and that Vivid Money B.V. is a MiCAR-regulated Crypto Asset Service Provider. The user is given no private key or seed phrase and holds no wallet of their own.

**The app cannot send or receive cryptocurrency.** The Crypto Pocket is limited to buying, selling and swapping within Vivid: *"With the Crypto Pocket, you can purchase and sell crypto-assets in exchange for fiat currency (EUR), as well as seamlessly swap between different coins. Rest assured that these crypto-assets are securely held within a Vivid Money B.V. wallet on your behalf"* ([Vivid Personal Help Center](https://support.vivid.money/en/articles/9298381-what-is-the-crypto-pocket), 2025-06-19). Vivid states this directly: *"Currently, we do not support withdrawal or deposit of crypto-asset holdings"* ([Vivid Personal Help Center](https://support.vivid.money/en/articles/9298280-is-it-possible-to-withdraw-deposit-or-stake-my-crypto-asset-holdings), 2025-06-19). There is therefore no deposit address to receive bitcoin into and no way to withdraw it to a wallet the user controls; Vivid has described such transfers as forthcoming since 2022 but they remain unavailable at the time of writing.

**Verdict: nosendreceive.** The app lets a user hold Bitcoin in the sense of price exposure to a custodially-held balance, but it cannot send or receive actual bitcoin to or from an address the user controls, so it does not function as a wallet. As the WalletScrutiny definition notes, products in this category are custodial and funds remain at the mercy of the provider — here Vivid Money B.V. and its custodian, Copper.
