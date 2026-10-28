---
title: BitTrade ビットコインなど暗号資産(仮想通貨)取引
date: 2026-10-28
authors:
- leo
website: https://www.bittrade.co.jp/
twitter: BitTrade_jp
redirect_from:
- /iphone/jp.co.huobi.bittrade/
android:
  appId: jp.co.huobi.japan
  users: 100000
  appCountry: us
  updated: 2026-10-02
  version: 3.18.97
  icon: jp.co.huobi.japan.webp
  meta: ok
  verdict: custodial
  developerName: BitTrade Inc.
iphone:
  appId: jp.co.huobi.bittrade
  idd: '1449925793'
  appCountry: jp
  released: '2019-01-26T05:58:15Z'
  updated: 2026-10-21
  version: 3.19.01
  reviews: 2149
  icon: jp.co.huobi.bittrade.webp
  meta: ok
  verdict: custodial
  developerName: BitTrade Inc.

---

## App Description

BitTrade is the trading app of BitTrade Inc. (ビットトレード株式会社), a Japanese crypto asset exchange registered with the Kanto Local Finance Bureau (Crypto Asset Exchange Business No. 00007). The company was called Huobi Japan (フォビジャパン株式会社) until April 2023, which explains the app ID `jp.co.huobi.japan`. The app trades over 40 crypto assets against Japanese yen, including Bitcoin, and offers accumulation plans, lending and leveraged trading. The Play description says "100% of customer crypto assets are managed in cold wallets".

## Analysis

- **Bitcoin support.** The Play description lists "Bitcoin (BTC)" among the tradable assets. The [fee page](https://www.bittrade.co.jp/ja-jp/support/fee/) lists a BTC withdrawal fee of "BTC 0.0005" under "暗号資産別出金手数料" ("withdrawal fee per crypto asset").
- **Deposits and withdrawals.** The help article [暗号資産の出金方法を教えてください](https://bittrade.zendesk.com/hc/ja/articles/360036234754) ("How do I withdraw crypto assets?") describes withdrawing from the app: "ご希望の出金をしたい暗号資産をタップします" ("tap the crypto asset you want to withdraw"), then pick a registered withdrawal address. It warns: "アドレスや宛先タグ等を間違えて送付した場合、送付した暗号資産は戻りません" ("if you send to a wrong address or destination tag, the crypto assets sent will not come back").
- **Custody.** The [risk warning](https://www.bittrade.co.jp/about/risk/) states "当社において、お客様の資産の預託を受けます" ("we accept the deposit of customers' assets"). It warns that if the company cannot continue its business, "お客様から預託を受けた暗号資産及び預託金を返還することができなくなり" ("we may become unable to return the crypto assets and money deposited by customers"). On keys it says: "当社の秘密鍵の管理については、外部事業者との間で連携して実施するマルチシグの仕組みによって安全性を高めています" ("we secure the management of our private keys with a multisig scheme operated together with an outside provider"). The keys are the company's and its provider's, not the user's.
- **Name change.** BitTrade's [press release](https://prtimes.jp/main/html/rd/p/000000184.000037450.html) confirms that "フォビジャパン株式会社 ... 2023年４月21日に社名を「ビットトレード株式会社（英文表記：BitTrade Inc.）」へ変更" ("Huobi Japan Inc. changed its name to BitTrade Inc. on April 21, 2023").

BitTrade holds the customers' bitcoin and the private keys that control them, so the app is [custodial](/methodology/#custodial).

## iOS

There is also an [iOS version on the App Store](https://apps.apple.com/jp/app/id1449925793). The provider's website links to it, and it gives access to the same account and service, so the same verdict applies to it.

**Custodial: The provider holds the keys**
