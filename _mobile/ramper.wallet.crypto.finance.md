---
title: Ramper Wallet
date: 2026-09-16
authors:
- danny
website: https://www.ramper.xyz/
redirect_from:
- /android/ramper.wallet.crypto.finance/
- /iphone/ramper.multichain.wallet.crypto/
- /mobile/ramper.multichain.wallet.crypto/
android:
  appId: ramper.wallet.crypto.finance
  users: 1000
  appCountry: us
  released: 2023-07-23
  updated: 2025-02-17
  version: 2.0.1
  icon: ramper.wallet.crypto.finance.png
  meta: stale
  verdict: nobtc
  developerName: Ramper Labs
iphone:
  appId: ramper.multichain.wallet.crypto
  idd: '6461721561'
  appCountry: us
  released: 2023-09-15
  updated: 2025-02-18
  version: 2.0.1
  reviews: 1
  icon: ramper.multichain.wallet.crypto.jpg
  meta: stale
  verdict: nobtc
  developerName: Ramper Labs

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6461721561" author="overtorment" severity="high" finding="Social signup uploads Shamir shares and, on older paths, a KMS-wrapped full key to Coin98 / Firebase." note="Per overtorment’s analysis of the iPhone app, version 2.0.1: signing up with a social account splits the wallet’s recovery phrase into three pieces, any two of which rebuild it, and uploads two of those pieces to the developer’s own infrastructure — one to a Coin98 server, one stored wrapped in Firebase. That is how signing back in restores a wallet when the phone is gone, and it means the vendor holds enough to reconstruct the phrase. Ramper’s own FAQ says the opposite, that a social account “is used only for logging in, not for recovering your wallet.” He found the other route, creating or importing a wallet with a phrase of your own, to be clean. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

Ramper Wallet is published by Ramper Labs and sells itself on not needing a recovery phrase: the Google Play description says "No difficult seed phrases or keys are required; all you need is your preferred social accounts and password." It is a wallet for Ethereum-style networks and NFTs, and the developer also sells an embedded-wallet kit to other companies. The app on the store is a white-labelled version of Coin98 Super Wallet, which is why its own help pages name Coin98 first when listing wallets a user could move to.

## Testing and Analysis

This assessment was recorded on 2026-09-16.

### We could not run this app, and that limits what follows

Everything below comes from the developer's own published material. We were not able to install or open the app, so nothing here is an observation of the running product. That is a real limitation and we would rather state it than paper over it.

- Google Play refuses the install on a current Android phone: "This app isn't available for your device because it was made for an older version of Android."
- No third-party mirror carries the package. APKCombo, APKPure, APKMirror, apk.support, Uptodown, Aptoide and apkgk were all checked and none had it.
- On an Android emulator, the store client could see Ramper Wallet 2.0.1 and begin the download, but the delivery request returned an HTTP 429 error and the download never completed.

The app also appears to be abandoned. Both versions are 2.0.1, last updated 17 February 2025 on Google Play and 18 February 2025 on the App Store, around nineteen months before this review.

### The developer's own list of supported networks has no Bitcoin

Ramper's help site answers the question directly. Under [Which networks are supported on Ramper?](https://docs.ramper.xyz/ramper-wallet/user-faqs/which-networks-are-supported-on-ramper) it says:

> Currently, the following blockchains are supported on Ramper:
> TomoChain, Ethereum, Polygon, BNB Smart Chain, Solana, Sei

Bitcoin is not on that list, and none of those six is a Bitcoin network. Nor is there any Bitcoin-named token to account for, which has been a recurring complication elsewhere in this set.

The rest of what Ramper publishes agrees. The Google Play description refers only to "cryptocurrencies and NFTs" and never mentions Bitcoin or BTC. Neither does the help site or the company's own pages. There is no claim of Bitcoin support anywhere for the app to fail to live up to.

### What the developer says about custody, recorded but not assessed

Because this review stops at the Bitcoin question we are not judging these claims, but they sit beside overtorment's finding and readers should see both.

Ramper's FAQ answer to "Does Ramper hold my funds?" is: "No! Ramper does not hold your funds… you do have full ownership over your private keys and assets." Its answer to whether a wallet can be recovered after losing a social account states that "the social account associated with your wallet is used only for logging in, not for recovering your wallet."

overtorment reports the opposite for the social signup path: that two of the three pieces of the recovery phrase are uploaded to the developer's servers, and that signing back in rebuilds the phrase from them when the phone's own piece is missing. Their marketing describes the same path as generating "non-custodial wallets behind the scene".

We did not test either account. This is a conflict between his research and their documentation, and we are recording it, not settling it.

For completeness, the FAQ does say the phrase can be exported, through Wallet, then Settings, then Backup Passphrase.

### Verdict: does not support Bitcoin (BTC)

The developer's own help site lists six supported networks and Bitcoin is not among them, no Bitcoin or Bitcoin-named token appears anywhere in the app's store listing or documentation, and the product is never advertised as supporting Bitcoin. Both entries on this page are the same product, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**.

This verdict rests on the developer's published material, not on a hands-on test, for the reasons given above. If the app becomes installable again and its own screens show something different, the verdict should be revisited.

The review stops at the Bitcoin-support gate. The recovery-phrase material above is overtorment's research set against the developer's documentation, recorded so readers can weigh it; it is not a finding of ours. Custody and source availability are not assessed.
