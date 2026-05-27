---
wsId: flashBitcoinWallet
title: 'Flash: Bitcoin Wallet'
verdict: nosource
date: 2026-05-20
authors:
- danny
website: https://paywithflash.com
redirect_from:
- /android/com.paywithflash.flash_wallet/
- /iphone/com.paywithflash.flashWallet/
android:
  appId: com.paywithflash.flash_wallet
  users: 1000
  released: 2025-07-22
  updated: 2025-12-30
  version: 1.0.16
  icon: com.paywithflash.flash_wallet.png
  meta: ok
  developerName: Flash Lightning Solutions
iphone:
  appId: com.paywithflash.flashWallet
  idd: '6711339709'
  appCountry: us
  released: 2025-07-12
  updated: 2025-10-16
  version: 1.0.12
  reviews: 1
  icon: com.paywithflash.flashWallet.jpg
  meta: ok
  developerName: Flash Lightning Solutions Inc.

---

## Android

## App Description

Flash Wallet is a Bitcoin Lightning wallet for accepting payments.
The Google Play listing says it lets business owners, freelancers, and creators accept Bitcoin payments.
It says payments can come through payment links, e-store checkouts, subscriptions, and other Flash payment tools.
It also says the wallet uses Lightning and Nostr Connect.
The listing claims the wallet is non-custodial and gives users full control over their funds.

## Analysis

Flash Wallet is presented as a Bitcoin wallet.
It claims Bitcoin support.
It claims users can accept Bitcoin payments.
The wallet page says users can earn and spend Bitcoin.
It also says users can transfer to other wallets.

The custody claims are self-custodial.
The wallet page says users retain complete control of their Bitcoin.
It says users hold their keys.
The Flash documentation says payments are sent directly to the user wallet.
It also says Flash does not hold user funds.

The product appears to use Lightning, Liquid, and Nostr Wallet Connect.
The documentation says Flash can only be used with wallets that support Nostr Wallet Connect.
It lists Flash Wallet as the dedicated mobile wallet option.
A Flash custody article says Flash Wallet is self-custodial within the Liquid network.
The same article says users hold private keys for L-BTC on Liquid, which is not directly Bitcoin.
It also explains that BTC moved to Liquid is locked by the Liquid Federation and represented as L-BTC.
The article says actual BTC is held by the Liquid Federation, not directly by the user.
It describes Liquid as a hybrid model: self-custodial for L-BTC, but not trustless for the underlying Bitcoin.
Another Flash article says Flash Wallet has full Lightning and Liquid support.

In our app test, Flash Wallet did provide a seed phrase.
However, the default receive flow was Lightning.
The Receive screen was labelled `Receive Bitcoin from any Lightning wallet`.
That screen showed a QR code, but it did not show a written or labelled on-chain Bitcoin address.
When we copied the receive QR payload, it started with `liquidnetwork:lq1...`.
That is a Liquid Network URI, not a Bitcoin mainnet address and not a Lightning invoice.
A Bitcoin mainnet address would normally start with `bc1`, `1`, or `3`.
A Lightning invoice would normally start with `lnbc`.
Because no Bitcoin mainnet address was displayed there, we could not compare an app-displayed Bitcoin address with an address derived from the exported seed.

This means the receive flow has important verification limits.
The app appears to show a Lightning-labelled payment front-end while using a Liquid receive destination.
The user-provided seed phrase may control Liquid L-BTC keys, but our test did not prove control over Bitcoin on mainnet or over a Lightning channel.
The Flash custody article acknowledges this distinction by saying L-BTC is not directly Bitcoin.

We did not find public source code for the Android wallet.
A GitHub code search for the exact app id `com.paywithflash.flash_wallet` did not return relevant wallet source code.
Broader searches for PayWithFlash wallet source code also did not find a current public repository.
The website does not link to a source repository.
The Google Play listing does not link to a source repository.
Without public source code, we cannot verify how the app handles the seed phrase, Liquid keys, Lightning receive flow, or Nostr Wallet Connect integration.
For our purposes, the stronger verdict is **nosource**.

Sources:

- [Flash documentation](https://docs.paywithflash.com/)
- [Connect Your Wallet documentation](https://docs.paywithflash.com/getting-started/connect-your-wallet)
- [Flash custody article](https://paywithflash.com/flash-wallet-self-custodial/)
- [Flash Wallet beta article](https://paywithflash.com/flash-wallet-beta-is-here-a-new-era-for-bitcoin-powered-businesses/)
- [Stacker News test report](https://stacker.news/items/1060779?commentId=1060853)
- [Flash App Store listing](https://apps.apple.com/be/app/flash-bitcoin-wallet/id6711339709)
- [GitHub code search for exact app id](https://github.com/search?q=%22com.paywithflash.flash_wallet%22&type=code)
- [Chrome-Stats Play metadata mirror](https://chrome-stats.com/d/com.paywithflash.flash_wallet)

---

## iPhone

{% include copyFromAndroid.html %}
