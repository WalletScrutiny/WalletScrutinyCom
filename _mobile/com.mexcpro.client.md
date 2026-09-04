---
wsId: mexc
title: 'MEXC: Buy Bitcoin & Crypto'
date: 2026-09-04
authors:
- danny
website: https://www.mexc.com
twitter: MEXC_Global
social:
- https://www.linkedin.com/company/mexcglobal
- https://www.facebook.com/mexcglobal
- https://www.reddit.com/r/MXCexchange
appCountry: us
redirect_from:
- /android/com.mexcpro.client/
- /iphone/mobile.mexcglobal.www/
- /mobile/mobile.mexcglobal.www/
android:
  appId: com.mexcpro.client
  users: 10000000
  appCountry: us
  released: 2020-07-23
  updated: 2026-09-02
  version: 6.73.1
  reviews: 3188
  icon: com.mexcpro.client.png
  meta: ok
  verdict: custodial
  developerName: MEXC Ltd
iphone:
  appId: mobile.mexcglobal.www
  idd: '1605393003'
  appCountry: us
  released: 2022-02-09
  updated: 2026-09-03
  version: 6.73.1
  reviews: 8286
  icon: mobile.mexcglobal.www.jpg
  meta: ok
  verdict: custodial
  developerName: Onechain Technology Ltd

---

## App Description

MEXC is the mobile app of the centralised cryptocurrency exchange of the same name. The Android app is published by MEXC Ltd as `com.mexcpro.client`; the iPhone app is published by Onechain Technology Ltd as `mobile.mexcglobal.www`. Both stores carry the same product name, version and description, advertising more than 3,000 tradable assets, including Bitcoin, together with spot and futures trading, savings products, deposits and withdrawals.

## Testing and Analysis

This assessment is based on MEXC's own store listings and legal documentation, retrieved 2026-09-04.

### MEXC explicitly holds the assets

There is no need to infer custody from MEXC merely being an exchange. Clause 36 of the [MEXC User Agreement](https://www.mexc.com/terms) states it directly:

> MEXC maintains full custody of the assets, funds and User data/information

The same agreement says MEXC may place an administrative hold on funds in an account and that users can be unable to withdraw while a hold remains. It may also prohibit withdrawals, transfers or any other removal of assets when identity-verification requirements are not satisfied. These are controls that only the custodian can exercise.

### The apps control an account, not a Bitcoin key

The agreement defines deposits as transfers to designated addresses in a user's MEXC Account and withdrawals as transfers that MEXC carries out from that account after receiving the user's instruction. Access is governed by an account password and additional verification methods. Neither store listing offers a recovery phrase, private-key backup or import of an existing Bitcoin wallet.

Users can deposit BTC from an external wallet and request an on-chain withdrawal to an address they control, so this is not a closed system with no send/receive capability. But until a withdrawal is executed, the user has an account balance and MEXC has the keys. MEXC can move, freeze or restrict the assets without a signature from the user.

### Verdict: custodial

MEXC says it maintains full custody of account assets, while users authenticate to an exchange account rather than control Bitcoin keys on their phones. Both the Android and iPhone apps therefore receive our **custodial** verdict. The review stops at the custody gate: source availability and reproducibility cannot give an account holder control over keys held by MEXC.
