---
title: 楽天ウォレットの証拠金取引アプリ
date: 2026-10-31
authors:
- leo
website: https://www.rakuten-wallet.co.jp/
twitter: Rakuten_Wallet
android:
  appId: jp.co.rakuten.wallet.leverage.exchange
  users: 10000
  appCountry: us
  updated: 2026-09-15
  version: 1.2.10
  icon: jp.co.rakuten.wallet.leverage.exchange.webp
  meta: ok
  verdict: nosendreceive
  developerName: Rakuten Wallet
iphone:
  appId: jp.co.rakuten.wallet.leverage.exchange
  idd: '6462580183'
  appCountry: jp
  released: '2023-09-03T07:00:00Z'
  updated: 2026-10-14
  version: 1.2.10
  reviews: 46
  icon: jp.co.rakuten.wallet.leverage.exchange.webp
  meta: ok
  verdict: nosendreceive
  developerName: Rakuten Wallet, Inc.

---

## App Description

This is the "証拠金取引アプリ" (margin trading app) of Rakuten Wallet, Inc., the Rakuten group's registered Japanese crypto exchange. It trades the exchange-style margin service that, according to [Rakuten Group](https://corp.rakuten.co.jp/news/update/2022/1109_01.html), Rakuten Wallet launched in November 2022 with "9資産ペア（日本円建て）" ("nine asset pairs, denominated in Japanese yen"). The Play description promises TradingView charts, one-tap "speed orders" and API trading, and notes that "The setting is FIFO with leverage 2.0."

Rakuten Wallet's older margin app is {% include walletLink.html wallet='android/jp.co.rakuten.wallet.leverage' verdict='true' %} and its spot trading app is {% include walletLink.html wallet='android/jp.co.rakuten.wallet.crypto' verdict='true' %}. On October 14, 2026 Rakuten Wallet released a new app, also called "楽天ウォレット" (Rakuten Wallet), that merges spot and margin trading. [Coinotaku](https://coinotaku.com/news/articles/254948) reports that it unifies the "暗号資産取引" (crypto trading) and "証拠金取引" (margin trading) apps and that "現行の2アプリは2027年初頭をめどに提供を終了する予定だ" ("the current two apps are scheduled to end service around early 2027"). This app is the margin half of that pair.

## Analysis

- **Bitcoin support.** Rakuten Wallet's [取引概要](https://web.archive.org/web/20250306143319/https://www.rakuten-wallet.co.jp/service/overview.html) ("Trading overview", March 2025) lists BTC/JPY among the pairs of the "証拠金取引（取引所）" (margin trading, exchange) service.
- **Sending and receiving.** Rakuten Wallet's explainer [証拠金取引とは？](https://web.archive.org/web/20221129190639/https://www.rakuten-wallet.co.jp/start/leverage.html) ("What is margin trading?") says: "現物取引では代金と暗号資産を交換します。証拠金取引ではこの交換を行いません。その代わりどこかの時点で反対売買をして、差額を円建てで決済します。" ("In spot trading, money is exchanged for crypto assets. Margin trading does not make this exchange. Instead, at some point you make an offsetting trade and the difference is settled in yen.") The trading overview gives the spot service's "取引受渡日" (delivery date) as "約定日と同日" ("same day as the trade"), and for the margin exchange it gives only "-". The app trades contracts on the bitcoin price. No bitcoin is delivered into it, so it has nothing to send or receive. Sending and receiving coins happens in Rakuten Wallet's spot account. rakuten-wallet.co.jp returned HTTP 403 to us, so we cited archived copies.
- **Custody.** The funds in the margin account are held by Rakuten Wallet. Rakuten Wallet is the counterparty of a derivative, and the same explainer warns of "契約の相手方、楽天ウォレットの倒産リスク" ("the bankruptcy risk of the counterparty, Rakuten Wallet").

We list other Japanese crypto margin and CFD apps the same way, for example {% include walletLink.html wallet='android/jp.co.okasan_online.okasanonline.crypto.prd' verdict='true' %} and {% include walletLink.html wallet='android/jp.co.moneypartners.CryptoTrade' verdict='true' %}. Our older listing of Rakuten Wallet's previous margin app predates this analysis.

This app settles bitcoin price contracts in yen and cannot send or receive bitcoin, so it is {% include verdictBadge.html verdict="nosendreceive" type='short' %}. The same applies to the iPhone app, which comes from the same provider and connects to the same account.

**Can't send or receive bitcoins**
