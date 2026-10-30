---
wsId: UpholdbuyandsellBitcoin
title: 'Uphold: Trade crypto & stocks'
date: 2026-10-30
authors:
- leo
website: https://uphold.com
twitter: UpholdInc
social:
- https://www.linkedin.com/company/upholdinc
- https://www.facebook.com/UpholdInc
features:
- buyWithCC
- tradeAlts
redirect_from:
- /com.uphold.wallet/
- /posts/com.uphold.wallet/
- /android/com.uphold.wallet/
- /iphone/com.uphold.wallet.ios/
android:
  appId: com.uphold.wallet
  users: 5000000
  appCountry: us
  released: 2015-12-29
  updated: 2026-10-09
  version: 6.110.1
  reviews: 8405
  icon: com.uphold.wallet.webp
  meta: ok
  verdict: custodial
  developerName: Uphold
iphone:
  appId: com.uphold.wallet.ios
  idd: 1101145849
  appCountry: us
  released: 2016-04-19
  updated: 2026-10-09
  version: 6.110.1
  reviews: 90832
  icon: com.uphold.wallet.ios.webp
  meta: ok
  verdict: custodial
  developerName: Uphold HQ Inc.

---

## Android

**Update 2026-10-30:** The verdict still holds for the app's regular account,
which Uphold holds for you. The store description still says "Your money is 100%
reserved. We never loan out your funds." The app now also offers
[Vault](https://uphold.com/en-us/vault), a 2-of-3 multisig for BTC, HBAR and XRP
where the user holds two keys and Uphold one. Uphold calls it "assisted
self-custody". We found no public source code for the app, so Vault cannot be
verified either. In April 2026 the
[New York Attorney General](https://ag.ny.gov/press-release/2026/attorney-general-james-secures-over-5-million-crypto-platform-promoting)
secured $5 million from Uphold for misleadingly promoting Cred's CredEarn product.
It remains {% include verdictBadge.html verdict="custodial" type='short' %}.

This app appears to be an interface to a custodial trading platform. In the
Google Play description we read:

> **Trust Through Transparency**<br>
  Uphold is fully reserved. Unlike banks, we don’t loan out your money. To prove
  it, we publish our holdings in real time.

If they hold your money, you don't. As a custodial service this app is **not
verifiable**.

---

## iPhone

**Update 2026-10-30:** The verdict still holds. The App Store description carries
the same "100% reserved" claim as on Android, and the same optional
[Vault](https://uphold.com/en-us/vault) multisig is offered without public source
code. It remains {% include verdictBadge.html verdict="custodial" type='short' %}.

This app appears to be an interface to a custodial trading platform. In the
App Store description we read:

> - Uphold is fully reserved. Unlike banks, we don’t loan out your money. To
    prove it, we publish our holdings in real-time.

If they hold your money, you don't. As a custodial service this app is **not
verifiable**.

{% include featureEvidence.html feature="tradeAlts" quote="Buy and sell 360+ cryptocurrencies, 27 national currencies, and 4 precious metals (Gold, Silver, Platinum, Palladium), based on your location." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Open a free account in minutes and deposit via credit/debit cards, banks, crypto networks, or Apple Pay." source="Store description" %}
