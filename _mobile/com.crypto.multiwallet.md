---
wsId: guarda
title: 'Guarda: Crypto Bitcoin Wallet'
date: 2021-05-20
authors:
- leo
- danny
website: https://guarda.com
twitter: GuardaWallet
social:
- https://www.facebook.com/guarda.co
- https://www.reddit.com/r/GuardaWallet
redirect_from:
- /guardawallet/
- /com.crypto.multiwallet/
- /posts/2019/11/guardawallet/
- /posts/com.crypto.multiwallet/
- /android/com.crypto.multiwallet/
- /iphone/com.crypto.multiwallet/
android:
  appId: com.crypto.multiwallet
  users: 500000
  appCountry: us
  released: 2018-11-01
  updated: 2026-07-17
  version: 3.1.17
  reviews: 562
  icon: com.crypto.multiwallet.jpg
  meta: ok
  verdict: nosource
  developerName: GUARDA
iphone:
  appId: com.crypto.multiwallet
  idd: 1442083982
  appCountry: us
  released: 2018-12-01
  updated: 2026-07-17
  version: 3.1.18
  reviews: 948
  icon: com.crypto.multiwallet.jpg
  meta: ok
  verdict: nosource
  developerName: GUARDACO LDA

---

## Android

## Update 2024-07-13

The repository named [guarda-android-wallets](https://github.com/guardaco/guarda-android-wallets) has been archived in 2021.

## 2019-12-17

This wallet - `com.crypto.multiwallet` according to their applicationId,
"Moxi wallet" according to the first sentence of their description on Google
Play and "Guarda Wallet – for Bitcoin, Ethereum, etc." according to the app name -


doesn't have access to your private keys ...

> Moxi wallet doesn't have access to your keys and does not store your funds,

or do they? Here is the next sentence from the Google Play description:

> they are stored offline. We provide a wallet's backup for extra safety.

That sounds a lot like the provider keeps a copy of your private keys, does it
not?

Yet under features they explicitly claim:

> – Non-custodial wallet. We do not store your money.

Also good to know:

> This app does not mine cryptocurrency.

So maybe the confusion above is just a language barrier thing. We will assume
for now that the wallet is in fact non-custodial and the backup scheme actually
does work without them having access. In a deeper review, this would certainly
be one of the first points to check.

Looking for source code, we found a link to the company GitHub and from there to
a repository named
[guarda-android-wallets](https://github.com/guardaco/guarda-android-wallets) -
very promising.

As it turns out, "guarda-android-wallets" can be used to compile single coin
wallets but no app with the application ID `com.crypto.multiwallet`. In fact a
[search over all of GitHub](https://github.com/search?q=%22com.crypto.multiwallet%22)
didn't yield results neither.

Without source code available, our verdict is: **not verifiable**.

An issue has been opened at [https://github.com/guardaco/guarda-android-wallets/issues/42](https://github.com/guardaco/guarda-android-wallets/issues/42)

---

## iPhone

This app claims to be non-custodial on the App Store

> NON-CUSTODIAL SECURITY<br>
  We give you full control over your crypto wallet private keys. Guarda encrypts
  all your data and securely stores it on the device itself – no one can gain
  access to your funds except you. Besides, you can enable Touch ID to access
  the crypto storage without having to type the password every time.

but as there is no source code to be found, it's: **not verifiable**.
