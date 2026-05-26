---
wsId: dexTradeWallet
title: DexTrade
verdict: nosource
meta: ok
date: 2025-08-28
authors:
- danny
social:
- https://t.me/dextrade_support
features:
- buyWithCC
- fingerprint
- tradeAlts
redirect_from:
- /android/org.dextrade.wallet/
- /iphone/com.dextrade.swap/
android:
  appId: org.dextrade.wallet
  users: 1000
  released: 2022-08-22
  updated: 2025-09-29
  version: 2.0.6
  icon: org.dextrade.wallet.png
  website: https://dextrade.com/
  developerName: Dextrade Technologies LTD
iphone:
  appId: com.dextrade.swap
  idd: '1608922056'
  appCountry: ua
  released: 2022-10-07
  updated: 2025-11-30
  version: 2.0.106
  reviews: 1
  icon: com.dextrade.swap.jpg
  developerName: DEXTRADE TECHNOLOGIES LTD

---

## Android

🚩 Note, it has a similar name and almost similar domain name with {% include walletLink.html wallet='android/com.dextrade.android' verdict='true' %}. They have a different logo however.

Its similar-sounding counterpart has a lot of negative reviews as well. 

Moreover, its only social media link in the front page is customer service... in Telegram.

Be wary of this one.

## App Description

DexTrade is a multi-cryptocurrency wallet application that supports Bitcoin, Ethereum, USDT, TRX, and various ERC20/BEP20/ERC721 tokens. The app claims non-custodial operation with local seed phrase storage and no server-side storage of private keys or transaction data. It includes built-in exchange functionality for cryptocurrency swaps and fiat on/off-ramps via Visa/Mastercard integration. The wallet implements biometric security features including FaceID and TouchID for access control.

## Analysis

1. **Is it a wallet?** Yes, DexTrade provides cryptocurrency wallet functionality for storing and managing digital assets.

2. **Is it for bitcoins?** Yes, it explicitly supports Bitcoin along with multiple other cryptocurrencies and tokens.

3. **Can it send and receive bitcoins?** Yes, the app allows users to send and receive Bitcoin and other supported cryptocurrencies.

4. **Is the product self-custodial?** Yes, we tested this and can agree with their claims that users control seed phrases locally and "Our wallet does not use servers to store seed phrases or transaction information."

5. **Is the source code publicly available?** No, while DexTrade maintains a [GitHub monorepo](https://github.com/dextrade-solutions/monorepo), it only contains web applications and is marked as proprietary with "All rights reserved" licensing. The Android wallet source code is not available.

## Verdict

DexTrade is a Bitcoin wallet that claims to be self-custodial with local key storage. However, **the source code is not available** for independent verification of these claims. While the company maintains a GitHub repository, it only contains proprietary web applications and explicitly restricts usage with "All rights reserved" licensing. Without source code transparency, users cannot verify the wallet's security implementation, confirm the custody model, or audit whether private keys are truly stored only locally as advertised.

{% include featureEvidence.html feature="fingerprint" quote="Use FaceID, Touch ID, or a password to protect access to crypto" source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Use an internal exchanger to sell digital coins" source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="fiat on/off-ramps via Visa/Mastercard integration" source="App Description" %}

---

## iPhone

{% include copyFromAndroid.html %}
