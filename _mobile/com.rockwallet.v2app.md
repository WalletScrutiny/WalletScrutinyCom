---
title: 'RockWallet: Crypto Simplified'
date: 2026-10-31
authors:
- leo
website: https://www.rockwallet.com
twitter: rockwallet
android:
  appId: com.rockwallet.v2app
  users: 10000
  appCountry: us
  released: Apr 1, 2026
  updated: 2026-10-19
  version: 1.8.0
  reviews: 33
  icon: com.rockwallet.v2app.webp
  meta: ok
  verdict: custodial
  developerName: MNEE App, LLC
iphone:
  appId: com.rockwallet.v2app
  idd: '6746219863'
  appCountry: us
  released: '2026-04-08T07:00:00Z'
  updated: 2026-10-22
  version: 1.8.0
  reviews: 39
  icon: com.rockwallet.v2app.webp
  meta: ok
  verdict: custodial
  developerName: RockWallet, LLC

---

## App Description

This is "RockWallet 2.0", the new app of RockWallet, LLC. Its Play listing names the developer as MNEE App, LLC. It replaces {% include walletLink.html wallet='android/com.rockwallet.app' verdict='true' %}. In a [letter from October 2026](https://www.rockwallet.com/blog/a-letter-from-our-ceo-rockwallet-is-becoming-mnee-app), CEO Ron Tarter announces that "RockWallet will become MNEE App when banking launches". Users of 2.0 keep "the same passkey or username and password". RockWallet 1.0 closes on December 7, 2026. The app buys, sells, swaps and stores BTC, ETH, USDC, USDT and other assets, and serves only US customers in supported states. The Play description says "Non-custodial Bitcoin wallet - your keys never leave your device". It also says "our advanced keys setup allows us to give you a hand in sticky situations".

## Analysis

- **Bitcoin support.** The store description lists "Bitcoin (BTC)". The CEO letter says customers "will be able to continue buying, selling, swapping and holding BTC, BSV, BCH and many more".
- **Sending and receiving.** The store description promises "Send and receive crypto globally with just a wallet address". The CEO letter tells 1.0 users that "the easiest way is to send your crypto from RockWallet 1.0 to your RockWallet 2.0 account".
- **Keys.** The [terms of service](https://www.rockwallet.com/terms-of-service) (last updated May 21, 2026) describe the wallet as follows: "Customer’s Wallet is secured by multiple keys, of which Customer controls one of the keys necessary to authorize transactions. RockWallet holds a second key to assist with authorizing transactions and RockWallet delegates custody of a third key to a third party vendor for recovery of access to the Wallet." Two of the three keys are therefore with RockWallet and a vendor RockWallet chose. The user has no seed phrase, and the terms say "RockWallet is not able to supply Customer with such keys".
- **The provider can move funds.** The terms reserve RockWallet's right "to liquidate, offset, withhold, freeze, debit, or apply any Fiat balance, Digital Asset balance, stablecoin balance, or other assets associated with Customer’s Account or Wallet" against debts owed to it, and add: "Customer hereby grants RockWallet permission to access the key held for the Customer’s Wallet for such purposes." A wallet whose funds the provider may debit without the user is not self-custodial, whatever the marketing says. We treat {% include walletLink.html wallet='android/com.openblock.wallet' verdict='true' %}, which uses the same user, provider and third-party key split, the same way.
- **Going fully custodial.** The CEO letter adds: "In 2027, MNEE App will move to a fully custodial model, where we safeguard your assets for you."

RockWallet and its chosen vendor hold two of the three keys, and the terms let RockWallet debit wallet balances, so this app is {% include verdictBadge.html verdict="custodial" type='short' %}, despite its "Your keys. Your crypto. Your control." slogan. The iPhone app is the same product from the same provider.

**Custodial: The provider holds the keys**
