---
title: bkingexchange
date: 2026-07-22
website: https://www.bikingex.com
redirect_from:
- /android/com.blast.cosmicbubble/
- /iphone/com.BKExchange.appstore/
android:
  appId: com.blast.cosmicbubble
  users: 1000
  appCountry: us
  released: 2026-02-19
  updated: 2026-06-04
  version: 3.8.7
  icon: com.blast.cosmicbubble.jpg
  meta: ok
  verdict: custodial
  developerName: Cyberdoc Solutions
iphone:
  appId: com.BKExchange.appstore
  idd: '6466607380'
  appCountry: us
  released: 2023-10-17
  updated: 2026-06-06
  version: 3.8.7
  reviews: 38
  icon: com.BKExchange.appstore.jpg
  meta: ok
  verdict: custodial
  developerName: JUU INC

---

## App Description

BKExchange, also styled BKing Exchange, is a cryptocurrency exchange application listed on the App Store as `com.BKExchange.appstore` (developer JUU INC) and on Google Play as `com.blast.cosmicbubble`, titled "bkingexchange" (developer Cyberdoc Solutions). The Google Play application identifier reads like that of a casual game rather than an exchange; on manual inspection the installed Android app was a cryptocurrency exchange. The developer describes the product as "a leading global cryptocurrency trading platform, dedicated to providing secure and efficient blockchain asset trading services to users worldwide."

## Testing and Analysis

This entry covers the iOS and Android apps together because they are the same product. The platform's own website links both the App Store listing (`id6466607380`) and the Google Play package `com.blast.cosmicbubble` as its official apps, and the Google Play listing carries the "bkingexchange" branding. We note, without drawing a further conclusion, that the two stores list different developer names (JUU INC on iOS, Cyberdoc Solutions on Android) and that the Android application identifier resembles a game; what we verified is that the Android package is presented and operates as this exchange.

Our [testing](https://x.com/BitcoinWalletz/status/2079846176556564725) confirms the app provides a Bitcoin wallet with a receive address. It functions as an exchange deposit address funding a platform-held account rather than a wallet whose keys the user controls, as the platform's own terms make explicit.

We reviewed the platform's [Service Agreement](https://biking.bkexchange.news/hc/en-us/articles/11064572291473-Service-Agreement), which repeatedly describes platform-held funds. It advertises "an integrated custody solution" for users to "store digital assets". Users hold a "BiKing account" balance, and a withdrawal requires the platform to "deduct your BiKing account balance" and "initiate an on-chain transfer"; BiKing may also "suspend withdrawals". Over funds it holds, BiKing may "Freeze the affected funds and your BiKing account", may withhold "some or all of the digital assets", and may "deduct costs and fees directly from any assets". The same document also claims BiKing is "not the custodian of any digital assets" — a disclaimer that contradicts the powers just quoted.

By walletscrutiny.com's definition, an application whose funds are held in a platform-controlled account and released only on request is **custodial**: the user cannot move their assets without the provider's cooperation and does not hold the private keys. Not your keys, not your coins.
