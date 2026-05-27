---
wsId: kyrrexGlobal
title: Kyrrex Global
date: 2023-07-11
authors:
- danny
website: https://kyrrex.com
twitter: Kyrrexcom
social:
- https://www.linkedin.com/company/kyrrex
- https://www.facebook.com/kyrrexcom
- https://www.instagram.com/kyrrexexchange
- https://www.reddit.com/r/kyrrex
- https://t.me/kyrrex_official_en
redirect_from:
- /android/com.kyrrex/
- /iphone/com.kyrrex.app/
android:
  appId: com.kyrrex
  users: 5000
  updated: 2026-04-24
  version: production/v4.2.62
  icon: com.kyrrex.jpg
  meta: ok
  verdict: custodial
  developerName: Kyrrex
iphone:
  appId: com.kyrrex.app
  idd: '1604879846'
  appCountry: ua
  released: 2022-01-28
  updated: 2023-02-28
  version: 4.0.6
  reviews: 15
  icon: com.kyrrex.app.jpg
  meta: removed
  verdict: custodial
  developerName: Kyrrex Limited

---

## Android

## App Description from Google Play

> Kyrrex is a leading regulated crypto exchange provides a one-stop shop both for traders and corporate, institutional, private professional clients through its advanced trading and custody technology based on its sophisticated and proprietary algorithms and secure infrastructure.
>
> Securing your funds is our main priority. We have developed several levels of protection using the most reliable and effective security technologies

## Analysis

- The provider's [Terms and Conditions](https://files.my.kyrrex.com/terms_of_business.pdf)
- Section 4.2 of the terms explicitly state that the user's funds will be held by the provider.
- After registration, the app asked us to provide a 4-digit pin code.
- The app provides a cryptocurrency exchange service. We were able to find a P2SH BTC wallet with deposit and withdrawal functions.
- The security option only presented these options:
  - Change pin
  - 2FA
  - Change password
- There was no private key backup option.
- Together with the stringent terms, the lack of an option to backup the private keys lead us to conclude that this is a **custodial** app.

---

## iPhone

{% include copyFromAndroid.html %}
