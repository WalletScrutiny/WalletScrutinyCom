---
wsId: coinFlipCrypto
title: CoinFlip Crypto Wallet
date: 2026-01-03
authors:
- danny
website: https://coinflip.tech/
twitter: coinflip
social:
- https://www.instagram.com/coinflip
- https://www.facebook.com/CoinFlipATM
- https://www.linkedin.com/company/coinflipusa
- https://www.youtube.com/channel/UCBW95iOTlj46FuraynCeV1w
redirect_from:
- /android/tech.coinflip/
- /iphone/tech.coinflip.CoinFlip/
android:
  appId: tech.coinflip
  users: 50000
  appCountry: us
  released: 2024-08-19
  updated: 2026-05-18
  version: 4.3.0
  reviews: 99
  icon: tech.coinflip.png
  meta: ok
  verdict: custodial
  developerName: GPD Holdings LLC
iphone:
  appId: tech.coinflip.CoinFlip
  idd: '6502452721'
  appCountry: us
  released: 2024-06-05
  updated: 2026-05-21
  version: '4.4'
  reviews: 868
  icon: tech.coinflip.CoinFlip.jpg
  meta: ok
  verdict: custodial
  developerName: GPD Holdings, L.L.C.

---

## Android

## App Description

CoinFlip Wallet is a mobile cryptocurrency wallet that allows users to send and receive digital assets and includes built-in tools to locate CoinFlip ATMs worldwide.

The app supports pre-registration for CoinFlip services and is designed to integrate with CoinFlip’s cash-based buy and sell transactions at physical ATM locations.

According to the Play Store description, the wallet is intended to be self-custodial.

## Analysis

Note: Due to geo-restrictions we were not able to test the features of the app. 

Looking over its site, we find its post entitled ["Understanding and Securing Recovery Codes and Private Keys"](https://coinflip.tech/blog/wallet_recovery_codes_and_key_pairings):

> The CoinFlip Wallet modifies the Bitcoin mnemonic seed phrase concept for simplicity and security. Instead of 12, 18, or 24 words to write down or memorize, the CoinFlip Wallet only requires five code words. Our wallet uses multi-party computation, which means the private key is never created or stored in one place. Instead, it’s split into multiple pieces — one stays on a server, and the other goes to the user. The recovery codes that CoinFlip gives users represent their piece of the private key. Alone, it’s not enough to move funds, but when combined with CoinFlip’s piece, the wallet becomes functional. During onboarding, users can either write down their recovery code or encrypt and back it up to their iCloud or Google Drive with a password they choose. CoinFlip cannot see the user’s part of the key and cannot gain access to it. 

Although the app replaces a standard Bitcoin mnemonic with five recovery words, those words represent only one share of the private key in a multi-party computation (MPC) setup. The other key share is held by CoinFlip’s servers, and both shares are required to authorize transactions. As a result, users cannot independently move funds without CoinFlip’s participation, which means exclusive key control does not rest with the user.

Under WalletScrutiny standards, any wallet where a third party must cooperate to sign transactions—regardless of MPC, encryption, or backup method—is classified as **custodial**.

---

## iPhone

{% include copyFromAndroid.html %}
