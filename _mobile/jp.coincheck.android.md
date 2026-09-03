---
wsId: coincheck
title: Coincheck
date: 2026-09-03
authors:
- danny
website: https://coincheck.com
twitter: coincheckjp
social:
- https://www.facebook.com/coincheck
redirect_from:
- /android/jp.coincheck.android/
- /iphone/jp.coincheck.ios/
- /mobile/jp.coincheck.ios/
android:
  appId: jp.coincheck.android
  users: 1000000
  appCountry: us
  released: 2015-04-23
  updated: 2026-08-21
  version: 4.21.1
  reviews: 13
  icon: jp.coincheck.android.png
  meta: ok
  verdict: custodial
  developerName: Coincheck
iphone:
  appId: jp.coincheck.ios
  idd: 957130004
  appCountry: jp
  released: 2015-01-21
  updated: 2026-07-08
  version: 4.20.5
  reviews: 109728
  icon: jp.coincheck.ios.jpg
  meta: ok
  verdict: custodial
  developerName: Coincheck, Inc.

---

## App Description

Coincheck is the mobile app of the Japanese cryptocurrency exchange of the same name, operated by Coincheck, Inc. It ships under a different bundle ID on each store — `jp.coincheck.android` on Google Play and `jp.coincheck.ios` on the App Store, where it is listed as コインチェック-ビットコイン/仮想通貨（暗号資産）取引アプリ. It is an exchange account app: users deposit Japanese yen by bank transfer, convenience store or Pay-easy, trade 34 crypto assets including BTC from ¥500, and can send and receive bitcoin by QR code. The listing states plainly that the operator is a registered exchange business — "金融庁に登録されている暗号資産（仮想通貨）交換業者です。" ("We are a crypto asset exchange operator registered with the Financial Services Agency.")

The Google Play description makes the same wallet-shaped pitch:

> Anyone can easily send Bitcoins just by scanning QR code! You can also convert address for receiving Bitcoins to QR code as well. Coincheck wallet will enable everyone to exchange money without using cash or credit card.

## Testing and Analysis

### Coincheck says it holds the assets

No black-box testing is needed here, because the provider states the custody arrangement itself. On its own security page, Coincheck describes customer funds as deposited assets that it manages:

> Coincheckでは改正資金決済法の規定に従って、顧客ユーザーからの預かり資産である法定通貨や暗号資産を自社の資産と分別して管理しています。

("In accordance with the provisions of the revised Payment Services Act, Coincheck manages the fiat currency and crypto assets deposited by customer users separately from its own assets.")

The same page describes a daily reconciliation that only a custodian could perform:

> Coincheckが預かる顧客ユーザーの法定通貨や暗号資産それぞれについて、日次で実際の残高と当社が計算上把握している残高を照合し、顧客ユーザーの残高が不足していないかを確認しています。

("For each of the fiat currencies and crypto assets that Coincheck holds on behalf of customer users, we reconcile the actual balance daily against the balance we compute internally, and confirm that customer users' balances are not short.")

The wording is decisive in both directions. 預かり資産 and 預かる are the vocabulary of holding something on someone else's behalf, and a segregation-and-reconciliation regime under the Payment Services Act only makes sense where the operator controls the coins. Source: [Coincheckの安全性やセキュリティについて](https://coincheck.com/ja/article/372).

The same page describes how those keys are protected — cold wallets, multisig, two-factor authentication, SSL — which are Coincheck's controls over Coincheck's keys. Good custodial practice is still custody.

### The user never holds a key

Nothing in the app's own material offers self-custody, on either platform. The security sections of both store listings name only 2段階認証 (two-factor authentication) and PINコードロック (PIN code lock) — both account access controls, neither of them key management. There is no recovery phrase, no seed backup, no private key export and no import of an existing wallet anywhere in either description. The QR send and receive feature moves coins out of and into a Coincheck account; it does not put a key on the phone. Reviews of the app also mention ID card verification, as expected of a registered exchange.

This matters more than the app's own security engineering. A custodial provider can move every user's funds at its discretion, and its failures are the user's losses. Coincheck's own history is the illustration: on 26 January 2018 roughly 523 million NEM, about ¥58bn or [$530m](https://www.cnbc.com/2018/01/26/japanese-cryptocurrency-exchange-loses-more-than-500-million-to-hackers.html), were taken from coins the company was holding in a hot wallet. That exposure existed only because the operator held the coins, and it is worth reading the cold-wallet and multisig assurances above against it — they describe how Coincheck protects its own keys today, not a guarantee the user can verify or fall back on.

### Verifiability does not arise

Our verdict order stops at custody, and for good reason: where the provider holds the keys, whether the app is verifiable has no bearing on whether the funds are safe. For completeness, no source is published for either app. An [exchange API](https://coincheck.com/documents/exchange/api) is documented, and the [coincheckjp](https://github.com/coincheckjp) GitHub organisation publishes client libraries for Ruby, Python, Node and PHP — but not the mobile applications themselves. That was true when this project first reviewed the Android app in 2021 and remains true today.

### Verdict: custodial

Coincheck states on its own site that it holds customer crypto as deposited assets and reconciles those balances daily, and neither app offers the user a key, seed or recovery phrase of any kind. Funds are therefore at the provider's discretion rather than the user's, so both the Android and iPhone apps receive our **custodial** verdict.
