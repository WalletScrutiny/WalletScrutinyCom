---
title: Ducatus Wallet
date: 2026-10-30
authors:
- leo
website: https://ducatus.net/
redirect_from:
- /android/io.ducatus.walnew/
android:
  appId: io.ducatus.walnew
  users: 10000
  appCountry: us
  released: 2019-12-05
  updated: 2026-09-21
  version: 3.13.10
  reviews: 8
  icon: io.ducatus.walnew.webp
  meta: ok
  verdict: nosource
  developerName: Ducatus Commerce

---

**Update 2026-10-30:** We found the provider's own source code, and it shows a
self-custodial wallet, not a custodial one. The
[DucatusX/ducatus-copay](https://github.com/DucatusX/ducatus-copay) repository
describes itself as "fork [of] Copay" and its
[app config](https://github.com/DucatusX/ducatus-copay/blob/master/app-template/walnew/appConfig.json)
uses this app's ID `io.ducatus.walnew`. Its README lists "Device-based security:
all private keys are stored locally, not in the cloud" and "Mnemonic (BIP39) support
for wallet backups". Copay is the wallet now called
{% include walletLink.html wallet='android/com.bitpay.wallet' verdict='true' %}.
But that repository stops at version
2.17.26 from December 2023, while the app on Google Play is at version 3.13.10, so
the source of the current app is not public. We change the verdict from custodial to
{% include verdictBadge.html verdict="nosource" type='short' %}. The website we
listed, ducatus.net, no longer shows a Ducatus page.

This app supports Bitcoin:

> Now supporting Bitcoin, Bitcoin Cash and Ethereum.

The ten reviews are all one or two words 5 stars except for the one 1 star
review:

> [Re Invest](https://play.google.com/store/apps/details?id=io.ducatus.walnew&reviewId=gp%3AAOqpTOGugVoUMzb6SVIMKYq_-dA9r_fCDED3Xj5qehzQALl_tVyXXhtylPIQYG2VnTwXqpxN28bLslG8Mk4G-A)<br>
  ★☆☆☆☆ 12 May 2020<br>
  Hey guy.. all coin in wallet disappeared? What 's ?

Their website is also "suspended". There is no further claims anywhere
to be found so we have to assume this app is not public source, not
self-custodial and **not verifiable** and also **probably not safe to use**.
