---
wsId: Savl
title: 'UnityWallet: Crypto & Bitcoin'
verdict: nosource
meta: ok
date: 2021-09-11
authors:
- danny
social:
- https://www.facebook.com/savl.official
features:
- buyWithCC
- fingerprint
- multiAccount
- tradeAlts
appCountry: ru
redirect_from:
- /android/com.savl/
- /iphone/com.savl.savlapp/
android:
  appId: com.savl
  users: 100000
  released: 2018-07-24
  updated: 2026-03-31
  version: 9.2.0
  reviews: 207
  icon: com.savl.png
  website: https://unitywallet.com
  developerName: Unity Software FZE
iphone:
  appId: com.savl.savlapp
  idd: 1369912925
  released: 2018-04-22
  updated: 2026-04-06
  version: '9.2'
  reviews: 278
  icon: com.savl.savlapp.jpg
  website: https://www.unitywallet.com
  developerName: Unity Software FZE

---

## Android

## Update 2024-07-15

The terms and conditions of the app has not changed, and thus the app remains the intellectual property of Savl. A search for the app ID "com.savl" on GitHub shows the [Savl organization](https://github.com/savl-gmbh), but as expected, not the Android app.

## Review 2021-09-11

> Account personalization with the ability to restore access. All the Savl wallets operations and data are protected by a unique 12-word key.

Savl provides the private keys. Found on [the official website](https://www.savl.com/access#deadLink):

> IMPORTANT: Savl has no way to access users’ private keys. Private keys are only stored on the user’s device in encrypted form. If you lose access to your Savl account, the 12-word string, or private key, generated during registration will be needed to recover your account. Keep your private key in a safe place and do not share it with anyone. Savl staff will never ask for your private key.

From the Terms and Conditions, Section 3.4 Transactions via the "Wallet":

> The Wallet allows you to access your wallets within the respective Blockchains and to send Digital Assets from those wallets to other wallets within the same Blockchains. **At no point will the Company ever take custody of Digital Assets traded via the Wallet.**

We cannot find the source code for the wallet client using its Google play appID. 

Upon closer inspection of savL's [Client Agreement document](https://savl.s3.amazonaws.com/docs/terms.pdf)

> You undertake **not** to:(a)copy,redistribute,publish,reverseengineer,decompile,disassemble,modify,translateormakeany **attempt to access the source code** to create derivative works of the source code, or otherwise;

This wallet is a self custodial wallet, but without the source code for the wallet, it is **not verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="UnityWallet защищает активы с помощью шифрования AES-512, фразы восстановления из 24 слов и биометрической PIN-аутентификации." source="Store description" %}

{% include featureEvidence.html feature="multiAccount" quote="Создавайте суб-аккаунты для более удобного управления средствами и подключайтесь к тысячам DApps через WalletConnect." source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="UnityWallet поддерживает более 250 криптовалют. Вы можете быстро покупать, продавать и обменивать активы, в том числе с использованием банковской карты." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Вы можете быстро покупать, продавать и обменивать активы, в том числе с использованием банковской карты." source="Store description" %}
