---
title: ビットコイン・暗号資産（仮想通貨）取引ならGMOコイン
date: 2026-10-28
authors:
- leo
website: https://coin.z.com/jp/
android:
  appId: com.gmowallet.mobilewallet
  users: 100000
  appCountry: us
  updated: 2026-09-23
  version: 5.19.1
  icon: com.gmowallet.mobilewallet.webp
  meta: ok
  verdict: custodial
  developerName: GMO Coin, Inc.
iphone:
  appId: com.z.coin.jp.wallet
  idd: '1388836948'
  appCountry: jp
  released: '2018-06-23T14:08:22Z'
  updated: 2026-10-07
  version: 5.20.2
  reviews: 12281
  icon: com.z.coin.jp.wallet.webp
  meta: ok
  verdict: custodial
  developerName: GMO Coin, Inc.

---

## App Description

This is the app of GMO Coin, Inc., a Japanese crypto exchange in the GMO Internet Group, registered as a "Crypto Asset Exchange Business" with the Kanto Local Finance Bureau (No. 00006). It offers spot and leveraged trading in 24 crypto assets including Bitcoin, plus forex trading. The Play Store description calls the app the "GMO Coin Cryptocurrency Wallet" and lists "Cryptocurrency deposits and transfers" among its functions. GMO Coin's help centre says customer crypto is held in the company's own storage, kept separate from the company's holdings.

## Analysis

- **Bitcoin support.** The Play Store description lists "major cryptocurrencies such as Bitcoin (BTC), Ethereum (ETH), and XRP".
- **Sending and receiving.** GMO Coin's help article on deposits ([暗号資産の預入方法を教えてください](https://support.coin.z.com/hc/ja/articles/115012950248)) tells app users to open "【ホーム】-【預入/送付】-（銘柄を選択）-【預入】" ("Home > Deposit/Send > (choose asset) > Deposit") to see the deposit address, then send from the "送付元サービス、ウォレット" ("sending service or wallet"). The article on sending ([暗号資産の送付方法を教えてください](https://support.coin.z.com/hc/ja/articles/115010364528)) uses the same menu and the "【送付】" (Send) tab, to a registered destination address.
- **Custody.** GMO Coin's help article on asset segregation ([分別管理について教えてください](https://support.coin.z.com/hc/ja/articles/115007373008)) says: "お客さまから預託された資産は全て当社の資産と分別して管理しており" ("all assets entrusted to us by customers are managed separately from the company's assets") and "暗号資産の保管場所は、当社保有分とお客さま保有分で物理的に分離しています" ("the storage locations of crypto assets are physically separated between the company's holdings and customers' holdings"). The company, not the user, stores the customers' crypto.

GMO Coin keeps the crypto customers entrust to it, so the app is {% include verdictBadge.html verdict="custodial" type='short' %}. We found no other listing for GMO Coin. The existing {% include walletLink.html wallet='android/com.gmo.exchange' verdict='true' %} listing belongs to a different GMO company in Thailand.

## iPhone

The iOS app is published by GMO Coin, Inc., the same provider, and it gives access to the same account and service, so the same verdict applies to it.

**Custodial: The provider holds the keys**
