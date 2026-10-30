---
wsId: BitcoinPoint
title: BitcoinPoint
date: 2026-10-30
authors:
- danny
website: https://www.bitcoinpoint.com/
features:
- fingerprint
- ln
appCountry: gb
redirect_from:
- /android/store.cashin.uk/
- /iphone/com.cashin.store/
android:
  appId: store.cashin.uk
  users: 1000
  released: 2021-04-02
  updated: 2022-02-10
  version: 4.5.0
  reviews: 28
  icon: store.cashin.uk.webp
  meta: removed
  verdict: custodial
iphone:
  appId: com.cashin.store
  idd: 1363753409
  appCountry: gb
  released: 2018-08-15
  updated: 2025-07-21
  version: '8.4'
  reviews: 1
  icon: com.cashin.store.webp
  meta: stale
  verdict: custodial
  developerName: BCP Technologies Ltd

---

## Android

**Update 2026-10-30:** This app is still gone from Google Play, and so is its successor
{% include walletLink.html wallet='android/com.bitcoinpoint.uk' verdict='true' %}. The provider is still in
business: BitcoinPoint is now [BCP Markets](https://www.bcp.markets/) by BCP Technologies Ltd, an FCA-registered
crypto asset firm, and that site links only an iPhone app. [bitcoinpoint.com](https://bitcoinpoint.com/) is
still up and offers to "Earn interest once a week on BTC, ETH and tGBP" on balances held in the app. We
found no change in custody; the verdict stays {% include verdictBadge.html verdict="custodial" type='short' %}.

**Update 2022-04-25**: This app is not available anymore.

## App Description

> BitcoinPoint is the only machine-less solution to buy Bitcoin through a network of agents in the UK and the first company to implement Open Banking to buy Bitcoin directly.
>
> BitcoinPoint is also allowing registered users to sell bitcoin and withdraw cash to the largest ATM network in the UK with 18,000 ATMs! (cashzone.co.uk)

Summary

> - Buy in stores with cash.
> - Buy online by safely connecting to your bank account.
> - Buy small amounts (from £5 online and £20 in stores)
> - Directly top up a Bitcoin Blockchain wallet (cold storage,...)
> - Access your BitcoinPoint Online wallet and send your bitcoin in the future where you'd like.
> - Add as many Bitcoin Blockchain wallets as you wish.
> - Secure instantaneous transactions for the Online BitcoinPoint wallet top up
> - Fast and secure transaction for other Bitcoin wallets (transactions are pending in the Blockchain after few seconds!)
> - Dynamic map with information on each retailer.
> - Main UK Banks are listed for fast bank transfer (Open Banking).
> - A dynamic bitcoin rate to monitor the price change of bitcoin.
> - Last but not least, you can send your bitcoin to any email address! The owner of the email address will simply need to download the BitcoinPoint App to automatically access the bitcoin sent and use them.

These are the [ways to withdraw Bitcoin](https://www.bitcoinpoint.com/20-key-points-in-plain-english/) from the BitcoinPoint wallet:

1. Bank
2. ATM
3. Another Bitcoin wallet or BitcoinPoint user

## Third-Party Media Mentions

Decrypt Media [reports](https://twitter.com/decryptmedia/status/1342100310819561473) on BitcoinPoint about their partnership with ATM operator Cash Zone. This would allow bitcoin holders to cash out via its network of ATMs.

## The App

The first screen informed us to "scan a wallet to directly transact with it. It then asked us to provide a mobile phone number. The OTP SMS verification did not arrive. 

Legal information and specifics could be found in this document ([PDF](https://www.bitcoinpoint.com/legal/)).

## Cold Storage

> All of our Online Wallets are on Cold Storage which means that their private keys are not on the internet.

## Verdict

The wallets are purportedly kept offline in cold storage and there is no evidence of private keys being provided to the user. In this case, it appears as though BitcoinPoint is a **custodial** service. This makes the app **not verifiable**.

---

## iPhone

**Update 2026-10-30:** The iPhone app is still listed, now under the name BCP Markets with BCP
Technologies Ltd as the seller; its last update was version 8.4 on 2025-07-21. Its description says users
can "Create deposits and withdraw funds directly to your UK bank account" and send crypto "to friends,
family or external wallets", and [bcp.markets](https://www.bcp.markets/) says bank deposits are converted
"into crypto in an in-App wallet or in your Self-Custody wallet". The in-app wallet is still held by the
provider, so the verdict stays {% include verdictBadge.html verdict="custodial" type='short' %}.

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Receive Bitcoin, including Lightning!" source="Store description" %}

{% include featureEvidence.html feature="fingerprint" quote="Log in with your phone number or using biometrics/passcode for 2FA." source="Store description" %}
