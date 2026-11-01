---
title: Coinstick
date: 2026-11-01
authors:
- danny
website: https://www.coinstick.co
twitter: coinstickHQ
social:
- https://www.facebook.com/CoinstickHQ
redirect_from:
- /android/com.coinstick.myapp/
android:
  appId: com.coinstick.myapp
  users: 10000
  appCountry: us
  released: 2023-01-23
  updated: 2026-08-19
  version: 1.0.0
  reviews: 6
  icon: com.coinstick.myapp.webp
  meta: ok
  verdict: nowallet
  developerName: Coinstick

---
**Update 2026-11-01:** Coinstick is an off-ramp: bitcoin sent to it is sold for fiat, and there is no way to take bitcoin back out. That makes it {% include verdictBadge.html verdict="nowallet" type='short' %}, the verdict we give all off-ramps.

**Update 2026-10-30:** Coinstick's [website](https://www.coinstick.co/crypto-to-wallet) now advertises a "crypto wallet" with a dedicated Bitcoin deposit address per account. Its own steps describe deposits being detected and sold for naira right away, like {% include walletLink.html wallet='android/com.app.breet' verdict='true' %}, and we found no way to send Bitcoin out, so we keep this app as {% include verdictBadge.html verdict="nosendreceive" type='short' %} until we can test the new wallet.

Several parts of the website app are not functioning. 

## App Description from Google Play

  > Welcome to coinstick! The best cryptocurrency platform that resonate with your routine daily financial needs and makes border matter less.
  > 
  > You can securely buy and sell bitcoin and other cryptocurrency in seconds.
  >
  > You can send, receive, save and earn on your bitcoin and other cryptocurrencies.


## Analysis 

- The balance is denominated in Nigerian Naira. 
- We could not find a BTC wallet, but there is an option to buy or sell Bitcoin in Naira. 
- It is possible to withdraw and deposit Naira by connecting a credit card to the app. 
- We do **not see any option to send or receive Bitcoin** with this app.
