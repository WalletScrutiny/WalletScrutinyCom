---
title: BitFree
date: 2026-10-30
authors:
- danny
website: https://www.bitfree.us/#contact
twitter: bitfree_us
social:
- https://bitfree.us
- https://www.facebook.com/bitfree.official
- https://t.me/bitfreehelp
redirect_from:
- /android/com.yykj.bitfree.en/
- /iphone/com.yykj.bitfree.en/
android:
  appId: com.yykj.bitfree.en
  users: 50000
  appCountry: us
  released: 2019-01-26
  updated: 2026-07-20
  version: 5.6.60
  reviews: 31
  icon: com.yykj.bitfree.en.webp
  meta: ok
  verdict: nowallet
  developerName: ifreepanda
iphone:
  appId: com.yykj.bitfree.en
  idd: '1453815920'
  appCountry: ph
  released: 2019-02-24
  updated: 2026-07-23
  version: 5.6.68
  reviews: 0
  icon: com.yykj.bitfree.en.webp
  meta: ok
  verdict: nowallet
  developerName: Bitfree Limited

---

**Update 2026-10-30:** BitFree is now only a prepaid card app and "not an exchange". Its [website](https://www.bitfree.us/) says supported digital assets "may be used only for prepaid card top-up requests" and "cannot be traded, transferred to other users, or withdrawn as cryptocurrency within the app"; a partner converts them and issues the card. You can send bitcoin in to top up the card but never get bitcoin out again, so this is not a wallet and both apps change from {% include verdictBadge.html verdict="custodial" type='short' %} to {% include verdictBadge.html verdict="nowallet" type='short' %}. The analysis below describes the old app, which still had a bitcoin wallet.

## Android

## App Description from Google Play 

> Legally compliant: Card links on-chain digital assets and the off-chain payment networks. It does not occupy the foreign exchange quota, and does not have an upper limit for payments.
>
> Safe and reliable: Card offers a convenient yet safe international standard account.
>
> Fast and convenient: Topping up with US dollars account using digital assets.

## App Description from Website [About Page](https://web.archive.org/web/20220526084424/https://bitfree.us/about)

> Bitfree is a leading global **digital asset management service platform** under the umbrella of Bitfree Inc.
>
> Card provides you with payment services for shopping, travel, entertainment and more. Every time you provide a merchant payment for the Card network outside the country, you only need to show the consumption of the Card.
>
> The system will automatically deduct the amount and cost of the purchase from the Card, eliminating the need to pay for your cash. Payment security and consumer privacy are protected by law.

## Analysis 

- After registration, we found a wallet as well as an option to exchange. 
- Bitcoin is supported, and it has both deposit and withdrawal functions. 
- We could not find any option to backup the private keys. 
- There are also 'staking' and 'mining' options.
- There is also an option to Apply or Activate a card [(More info on card)](https://web.archive.org/web/20241212031944/https://www.bitfree.us/faq)
- The absence of any option to backup the private keys means that this is a **custodial** app which ties the wallet to a user account.

---

## iPhone

The Android analysis above applies to the iPhone app too.
