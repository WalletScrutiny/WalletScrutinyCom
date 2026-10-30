---
title: ProfitTradingApp For KuCoin
date: 2026-10-30
authors:
- danny
website: https://profittradingapp.com?utm_source=kucoin_gp
twitter: ProfitTrading_
social:
- https://www.facebook.com/profittradingapp
redirect_from:
- /android/com.profittrading.forkucoin/
android:
  appId: com.profittrading.forkucoin
  users: 50000
  appCountry: us
  released: 2020-12-27
  updated: 2026-03-25
  version: 8.1.1
  reviews: 21
  icon: com.profittrading.forkucoin.webp
  meta: ok
  verdict: custodial
  developerName: ProfitTradingApp

---

**Update 2026-10-30:** The verdict holds: this app still only drives your
KuCoin account, so your coins stay in KuCoin's custody. The provider now says the
opposite of our worry about its own access. The current store description says
the API keys "are encrypted and securely stored locally on your device and are
never transmitted to our servers" and that ProfiTradingApp "is not a broker,
custodian, or financial intermediary". Its [website](https://profittradingapp.com/)
calls it a "Non-custodial trading terminal" but also advertises trading bots
working "24/7". The app is closed source, so we cannot check where the keys and
bots live. The website now lists only Binance, Bybit, KuCoin, BitMEX and Bitget
as supported exchanges.

The provider [ProfitTradingApp](https://play.google.com/store/apps/dev?id=6470884744111312194) features a list of apps:

* {% include walletLink.html wallet='android/com.profittrading.forbinance' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forftx' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forokex' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forbybit' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forbinanceus' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forbitmex' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forhuobi' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forhitbtc' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forcoinbase' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forkraken' verdict='true' %}
* {% include walletLink.html wallet='android/com.profittrading.forbittrex' verdict='true' %}

each of which act as an interface to the respectively mentioned exchange.

While the provider doesn't custody your coins, neither do you. This app can trade on your behalf via its bots and you can also withdraw and deposit. This means you can use it as a wallet but not only are your coins in custody of the respective exchange, this app probably can also empty all the accounts of all its users at once which is why we consider it itself custodial and thus **not verifiable**.
