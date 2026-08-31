---
wsId: rehivePay
title: Rehive Pay
date: 2026-05-20
authors:
- danny
website: https://www.rehive.com
redirect_from:
- /android/com.rehivewallet/
- /iphone/com.rehive.wallet/
android:
  appId: com.rehivewallet
  users: 1000
  appCountry: us
  released: 2018-10-01
  updated: 2026-08-28
  version: 8.0.1
  icon: com.rehivewallet.png
  meta: ok
  verdict: custodial
  developerName: Rehive
iphone:
  appId: com.rehive.wallet
  idd: '1371128319'
  appCountry: us
  released: 2018-10-10
  updated: 2026-08-28
  version: 8.0.1
  reviews: 4
  icon: com.rehive.wallet.jpg
  meta: ok
  verdict: custodial
  developerName: Rehive

---

## Android

## App Description

Rehive Pay is a global money account.
It is focused on digital dollars.
It offers virtual bank account details.
It offers invoicing and payment requests.
It [requires identity verification](https://rehivepay.com/).
It supports personal and business accounts.
It says [balances are held in USDC](https://rehivepay.com/).

## Analysis

Rehive Pay is not a simple install-and-use Bitcoin wallet.
A user has to register an account first.
A personal account [requires identity verification](https://rehivepay.com/).
It also requires [source-of-funds information](https://rehivepay.com/).
A business account requires [company and director information](https://rehivepay.com/).

Rehive Pay says deposits through virtual accounts are [converted to USDC](https://rehivepay.com/).
It says [Bridge is the custodian partner](https://rehivepay.com/).
It says account balances are [held in USDC through Bridge](https://rehivepay.com/).
This means the user sees a hosted account balance.

Rehive documentation also describes Bitcoin deposit support.
Its warm-storage article says the Bitcoin Extension can give [each user a unique deposit address](https://rehive.intercom.help/en/articles/3560689-what-is-warm-storage).
That address comes from [an HD key provided by the company admin](https://rehive.intercom.help/en/articles/3560689-what-is-warm-storage).
The company admin provides it from [a wallet they control](https://rehive.intercom.help/en/articles/3560689-what-is-warm-storage).
Rehive says this address is used to [display a deposit address to the end-user](https://rehive.intercom.help/en/articles/3560689-what-is-warm-storage).

This explains how BTC deposits can work.
The user sends BTC to the displayed address.
Rehive identifies the user from the unique deposit address.
The user's app balance is credited inside Rehive.
The actual Bitcoin keys are not controlled by the user.
They are controlled by the company/admin wallet setup.

The warm-storage article also says [admins move funds out regularly](https://rehive.intercom.help/en/articles/3560689-what-is-warm-storage).
This is another sign that the provider controls the Bitcoin storage flow.
The user is not signing Bitcoin transactions with user-held private keys.

Rehive Pay's own public pages emphasize [USDC settlement](https://rehivepay.com/).
They say deposits through virtual accounts are [converted to USDC](https://rehivepay.com/).
They also say account balances are [held in USDC through Bridge](https://rehivepay.com/).
So a BTC deposit, where enabled, appears to be a custodial deposit into a hosted balance system.

We found no evidence of a seed phrase.
We found no evidence of a private-key backup.
We found no evidence that the user can recover BTC without Rehive or Bridge.

For WalletScrutiny purposes, this is a **custodial** service.

Sources:

- [Rehive Pay product page](https://rehivepay.com/)
- [Rehive Pay Terms](https://rehivepay.com/terms)
- [Rehive Pay App Store listing](https://apps.apple.com/us/app/rehive-pay/id1371128319)
- [Rehive Help Center: What currencies and rails are supported?](https://rehive.intercom.help/en/articles/11519385-what-currencies-and-rails-are-supported)
- [Rehive Help Center: What is Warm Storage?](https://rehive.intercom.help/en/articles/3560689-what-is-warm-storage)
- [Rehive Help Center: Custody models overview](https://rehive.intercom.help/en/articles/5516886-custody-models-overview)
- [Rehive Help Center: How the Bridge Extension works and managed currencies](https://rehive.intercom.help/en/articles/11519542-how-the-bridge-extension-works-and-managed-currencies)

---

## iPhone

{% include copyFromAndroid.html %}
