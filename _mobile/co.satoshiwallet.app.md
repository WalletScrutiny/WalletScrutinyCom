---
title: SatoshiWallet for Bitcoin, Ethereum, Monero & more
date: 2026-10-30
website: https://satoshipoint.io
redirect_from:
- /android/co.satoshiwallet.app/
android:
  appId: co.satoshiwallet.app
  users: 1000
  released: 2019-08-16
  updated: 2020-01-17
  version: 2.1.3
  icon: co.satoshiwallet.app.webp
  meta: defunct
  verdict: sourceavailable
  repository: https://github.com/SatoshiWallet/ui

---

**⚠️ Warning:** SatoshiWallet appears to be gone. Its website now shows unrelated content.

**Update 2026-10-30:** The app is still gone from Google Play, and the provider seems to be gone too. satoshipoint.io now redirects to an unrelated news site, and satoshiwallet.co is a parked domain. The [archived Play store page](https://web.archive.org/web/20220126092536/https://play.google.com/store/apps/details?id=co.satoshiwallet.app) from January 2022 described a multi-coin wallet with Bitcoin, where "You and only you can access your funds". Its code is public under a BSD license in [SatoshiWallet/ui](https://github.com/SatoshiWallet/ui), an Edge fork whose package is still named edge-react-gui and whose [Android code](https://github.com/SatoshiWallet/ui/tree/master/android/app/src/main/java/co/satoshiwallet/app) uses this app ID. Like {% include walletLink.html wallet='android/co.edgesecure.app' verdict='true' %}, it is {% include verdictBadge.html verdict="sourceavailable" type='short' %}. We never tried to build it, and now that the app is gone we cannot compare a build against it.

**Update 2022-02-20**: This app is not available anymore.

So this app was found by Emanuel, apparently for being open source. It is a fork
of the {% include walletLink.html wallet='android/co.edgesecure.app' %}.
