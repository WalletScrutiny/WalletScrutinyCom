---
wsId: coinsDoCoinWallet
title: 'CoinWallet: BTC USDT Wallet'
date: 2026-07-23
authors:
- danny
website: https://www.coinsdo.com
twitter: coinsdogroup
social:
- https://www.facebook.com/CoinsDogroup
- https://www.linkedin.com/company/coinsdo
redirect_from:
- /android/com.coinsdo.wallet/
- /iphone/com.coinsdo.wallet/
- /iphone/com.coinsdo.coinsdowallet/
- /mobile/com.coinsdo.coinsdowallet/
android:
  appId: com.coinsdo.wallet
  users: 500000
  appCountry: us
  released: 2022-06-26
  updated: 2026-06-24
  version: 2.0.29
  reviews: 118
  icon: com.coinsdo.wallet.png
  meta: ok
  verdict: nosource
  developerName: COINSDO
iphone:
  appId: com.coinsdo.coinsdowallet
  idd: '6479635869'
  appCountry: us
  released: 2024-04-16
  updated: 2026-06-29
  version: 2.0.29
  reviews: 89
  icon: com.coinsdo.coinsdowallet.jpg
  meta: ok
  verdict: nosource
  developerName: Tecstation Pte Ltd

---

## Update 2026-07-23

The original iOS listing (`com.coinsdo.wallet`, idd `1631258517`) was removed from the App Store and re-published as `com.coinsdo.coinsdowallet` (idd `6479635869`, "CoinsDo Wallet: BTC ETH Wallet", seller *Tecstation Pte Ltd*). It is the same product as the Android app: a self-custody MPC wallet by CoinsDo supporting BTC/ETH/USDT, shipping the same version (`2.0.29`) in the same week as the Google Play release. The source-code situation is unchanged, so the **source-unavailable** verdict carries over.

## Android

## Update 2024-07-24

Nothing has changed in this app's repository. It is still **not source-available** despite the Google Play app, being recently updated.

## App Description by Provider 2023-06-23

> CoinWallet is a decentralized, non-custodial wallet developed independently by CoinsDo. It solely manages your private key and does not host or engage in buying, selling, exchanging, or trading. CoinWallet has launched a new feature that leverages the Trusted Shards Computation (TSC) algorithm for collaborative digital asset management.
>
> The client-side wallet opens the source code to the corporate user, so the corporate user can audit or recompile.

## Analysis 

- The app supports BTC 
- The BTC wallet can send/receive 
- The mnemonic phrase was provided
- There's a claim that the product is Open Source, but we can find no links to the repository.
- The [CoinsDo GitHub account](https://github.com/CoinsDo) publishes several Go libraries, including a wallet SDK, but none contains the source of the published mobile app. Therefore, the app binary remains unverifiable.
- We [tweeted](https://twitter.com/BitcoinWalletz/status/1672082520949522432) them about it and await their response.
- Until they respond, we'll mark this as **source-unavailable.**

---

## iPhone

{% include copyFromAndroid.html %}
