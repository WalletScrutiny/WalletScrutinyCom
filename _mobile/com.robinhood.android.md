---
title: 'Robinhood: Trading & Investing'
date: 2026-10-30
authors:
- danny
website: https://robinhood.com/
twitter: RobinhoodApp
social:
- https://www.linkedin.com/company/robinhood
- https://www.facebook.com/robinhoodapp
appCountry: us
redirect_from:
- /android/com.robinhood.android/
- /iphone/com.robinhood.release.Robinhood/
android:
  appId: com.robinhood.android
  users: 10000000
  appCountry: us
  released: 2015-08-12
  updated: 2026-10-12
  version: 2026.40.1
  reviews: 270214
  icon: com.robinhood.android.webp
  meta: ok
  verdict: custodial
  developerName: Robinhood
iphone:
  appId: com.robinhood.release.Robinhood
  idd: 938003185
  appCountry: us
  released: 2014-12-11
  updated: 2026-10-12
  version: 2026.41.0
  reviews: 4880284
  icon: com.robinhood.release.Robinhood.webp
  meta: ok
  verdict: custodial
  developerName: Robinhood Markets, Inc.

---

## Android

**Update 2026-10-30:** Robinhood now lets you send and receive bitcoin ([crypto transfers](https://robinhood.com/us/en/support/articles/crypto-transfers/)), but the coins stay in a Robinhood account; the same page suggests moving them to "an external self-custody wallet, like Robinhood Wallet" ({% include walletLink.html wallet='android/com.robinhood.gateway' verdict='true' %}). So we change the verdict from {% include verdictBadge.html verdict="nosendreceive" type='short' %} to {% include verdictBadge.html verdict="custodial" type='short' %}. The FAQ we quote below is gone.

From the self-description, Robinhood is an investment and trading app. It is possible to buy and sell cryptocurrencies, including Bitcoin. 

Taken from [the FAQ:](https://robinhood.com/us/en/support/articles/Answers-to-top-questions/#deadLink)

> You can secure access to your mobile app using TouchID, FaceID, or a custom PIN code. We also offer two-factor authentication with an external authenticator app or via SMS.

Also, it appears that KYC verification is in use.

> **Can I transfer crypto into or out of my Robinhood Crypto account?**<br>
Not yet, but we’re working on it! We’re prioritizing safety and service reliability as we build out features that allow you to make cryptocurrency deposits and withdrawals.

It is currently **not possible to send or receive BTC** to and from your account.

---

## iPhone

**Update 2026-10-30:** Robinhood now lets you send and receive bitcoin ([crypto transfers](https://robinhood.com/us/en/support/articles/crypto-transfers/)), but the coins stay in a Robinhood account; the same page suggests moving them to "an external self-custody wallet, like Robinhood Wallet" ({% include walletLink.html wallet='iphone/com.robinhood.release.Gateway' verdict='true' %}). So we change the verdict from {% include verdictBadge.html verdict="nosendreceive" type='short' %} to {% include verdictBadge.html verdict="custodial" type='short' %}. The FAQ we quote below is gone.

The Android analysis above applies to the iPhone app too.
