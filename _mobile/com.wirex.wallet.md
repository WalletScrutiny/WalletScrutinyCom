---
wsId: wirexwalletdefi
title: 'COCA: Crypto Card & Wallet'
date: 2022-01-10
authors:
- danny
website: https://wirexapp.com/wirex-wallet#deadLink
twitter: wirexapp
social:
- https://github.com/wirexapp
features:
- buyWithCC
- fingerprint
- tradeAlts
appCountry: nz
redirect_from:
- /android/com.wirex.wallet/
- /iphone/com.wirex.wallet/
android:
  appId: com.wirex.wallet
  users: 500000
  appCountry: nz
  released: 2021-12-03
  updated: 2026-06-18
  version: 3.4.0
  reviews: 16
  icon: com.wirex.wallet.png
  meta: ok
  verdict: nosource
  developerName: CCA LABS
iphone:
  appId: com.wirex.wallet
  idd: 1594165139
  appCountry: nz
  released: 2021-12-07
  updated: 2026-06-03
  version: 3.2.1
  reviews: 10
  icon: com.wirex.wallet.jpg
  meta: ok
  verdict: nosource
  developerName: CCA LABS - FZCO

---

## Android

## Update 2024-07-17

No changes have been observed in the GitHub organization page. We also did not find any relevant Android repository when searching for ["com.wirex.wallet" on GitHub.](https://github.com/search?q=%22com.wirex.wallet%22&type=code)

## Review 2022-01-09

After app install, users are given two choices:

1. Create a wallet 
2. I already have a wallet  

Selecting create a wallet, the user is then asked to provide an email address. This email address is then verified. The user is then brought to a wallet page, where there is a Bitcoin address that can send and receive.

For a "non-custodial" wallet, we can't seem to locate the private keys or any option to backup the wallet.

> We want to give crypto users access, flexibility and control over their holdings without worrying if their funds are safe, losing their private key, high gas fees or the need to spread their tokens across different apps and platforms.

After a bit of more digging, we found Account Recovery options in 'Profile'. There are two options to recover the account:

1. Provide biometrics
2. Generate QR code

The biometrics section includes taking a picture of the user's face and getting the fingerprint.

The QR code uses Wirex own QR code generator. 

We did not find any reference to Wirex being open source. However, we did find a github repository, but has no reference to any of the apps that Wirex has. 

We question the claims that the Wirex Wallet app is non-custodial because of the absence of the Mnemonic phrase. 

At present, the verdict that we can give it is it is not an open source project.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="Create your account in just a few minutes and secure it with biometrics. Deposit crypto or buy it with your bank card, and start spending and earning right away." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy crypto using 182 local payment methods" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap assets across 15+ blockchains" source="Store description" %}
