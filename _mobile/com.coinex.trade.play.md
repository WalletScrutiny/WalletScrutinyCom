---
wsId: CoinEx
title: 'CoinEx: Buy Bitcoin & Crypto'
date: 2026-10-30
authors:
- leo
website: https://www.coinex.com/
twitter: coinexcom
social:
- https://www.facebook.com/TheCoinEx
- https://www.reddit.com/r/Coinex
redirect_from:
- /com.coinex.trade.play/
- /posts/com.coinex.trade.play/
- /android/com.coinex.trade.play/
- /iphone/com.viabtc.trader/
android:
  appId: com.coinex.trade.play
  users: 5000000
  appCountry: us
  released: 2019-12-27
  updated: 2026-08-14
  version: 4.19.0
  reviews: 879
  icon: com.coinex.trade.play.webp
  meta: ok
  verdict: custodial
  developerName: ViaBTC
iphone:
  appId: com.viabtc.trader
  idd: 1264462812
  released: 2017-08-23
  updated: 2022-01-01
  version: 3.5.0
  reviews: 2032
  icon: com.viabtc.trader.webp
  meta: removed
  verdict: custodial

---

## Android

**Update 2026-10-30:** The verdict
{% include verdictBadge.html verdict="custodial" type='short' %} still holds.
In September 2023 attackers stole about $70 million from CoinEx's hot wallets
after its private keys were compromised, and CoinEx said affected users would
be compensated
([Cointelegraph](https://cointelegraph.com/news/coinex-compromised-private-keys-behind-70-million-hack)).
That only works because CoinEx holds the users' coins. CoinEx's self-custody
products are separate apps, listed as
{% include walletLink.html wallet='android/com.viabtc.wallet' verdict='true' %}
and {% include walletLink.html wallet='android/com.viabtc.coldwallet' verdict='true' %}.

The description on Google Play starts not so promising:

> Meet the top cryptocurrency trading app！

Trading apps are usually custodial. Unfortunately there is no easily accessible
information on their website about the app neither. For now we assume it is
custodial and thus **not verifiable**.

---

## iPhone

**Update 2026-10-30:** This app is still gone from the App Store. CoinEx now
publishes its exchange on iPhone as a new app,
{% include walletLink.html wallet='iphone/com.coinex.trade' verdict='true' %},
which we found in the Hong Kong, Taiwan and Singapore stores. The verdict here
stays {% include verdictBadge.html verdict="custodial" type='short' %}.

**Update 2022-01-13**: This app is not available anymore.

Unfortunately there is no easily accessible information on the App Store or
their website about the app's security. For now we assume it is
custodial and thus **not verifiable**.
