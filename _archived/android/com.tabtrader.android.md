---
title: 'TabTrader: Crypto Terminal'
appId: com.tabtrader.android
meta: ok
verdict: nowallet

---

**Updated 2022-01-06**

When buying bitcoin over at https://buy.tab-trader.com/, the user is asked to provide the following:

- The amount of Bitcoin to purchase
- The user's **own** bitcoin addresses

If the user has no wallet of his own, there's a small link at the bottom of the box which recommends bitpay wallet.

**Previous Analysis**

This app appears to not function as a wallet. At least we could not see any
documentation about depositing or withdrawing through the app, which makes the
verdict **not a wallet** but the app still has massive potential for abuse
if the provider front-runs the trades of the users from the insight they gain or
even worse, they could trigger lucrative-to-front-run trades the user never
intended to make.
