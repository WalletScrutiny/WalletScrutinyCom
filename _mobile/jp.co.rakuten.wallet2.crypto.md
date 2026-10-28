---
title: 楽天ウォレットのビットコイン・暗号資産取引
date: 2026-10-28
authors:
- leo
website: https://www.rakuten-wallet.co.jp/
twitter: Rakuten_Wallet
android:
  appId: jp.co.rakuten.wallet2.crypto
  users: 5000
  appCountry: us
  updated: 2026-10-26
  version: 1.0.1
  icon: jp.co.rakuten.wallet2.crypto.webp
  meta: ok
  verdict: custodial
  developerName: Rakuten Wallet

---

## App Description

This is the new "楽天ウォレット" (Rakuten Wallet) app from Rakuten Wallet, Inc., a registered Japanese crypto asset exchange in the Rakuten group. According to [Coinotaku](https://coinotaku.com/news/articles/254948), Rakuten Wallet launched it on October 14, 2026 by merging its "暗号資産取引" (crypto trading) and "証拠金取引" (margin trading) apps; Android came first. The existing apps are {% include walletLink.html wallet='android/jp.co.rakuten.wallet.crypto' verdict='true' %} and {% include walletLink.html wallet='android/jp.co.rakuten.wallet.leverage' verdict='true' %}, and the same report says "現行の2アプリは2027年初頭をめどに提供を終了する予定だ" ("the current two apps are scheduled to end service around early 2027"). The app offers spot and margin trading, buying crypto with Rakuten Points, and charging Rakuten Cash from crypto. Its Play description promises "Segregated asset management and trust protection" and "Offline management using cold wallets".

## Analysis

- **Bitcoin support.** Rakuten Wallet's help page [入出庫について](https://web.archive.org/web/20220628005525/https://www.rakuten-wallet.co.jp/start/transfer.html) ("About crypto deposits and withdrawals") illustrates the withdrawal steps with "（BTC出庫の例）" ("example: BTC withdrawal").
- **Deposits and withdrawals.** The same page says: "他の取引所・ウォレット等より、楽天ウォレットの入庫用アドレス宛に暗号資産をお送りください" ("send crypto assets from other exchanges or wallets to your Rakuten Wallet deposit address"). For withdrawals it says to choose "取引所以外" ("other than an exchange") when withdrawing to a private wallet. That page is from June 2022 and describes the older app. rakuten-wallet.co.jp returned HTTP 403 to us, so we could not read the current version. The press coverage we read does not mention deposits or withdrawals in the new app. The account is the same one the older apps use, and the older app's listing documents both directions.
- **Custody.** The Play description says customer assets are held under "Segregated asset management" with "Offline management using cold wallets", which means Rakuten Wallet stores the coins. The same 2022 page says customer money "当社の資産と明確に分別して管理します" ("is managed clearly separated from our company's assets"). Rakuten Wallet does not describe any way for users to hold their own keys.

Rakuten Wallet holds the bitcoin for its customers, so this app is {% include verdictBadge.html verdict="custodial" type='short' %}, like the two apps it replaces.

**Custodial: The provider holds the keys**
