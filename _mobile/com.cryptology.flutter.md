---
title: 'Tothemoon: Buy & Trade BTC'
date: 2026-10-31
authors:
- leo
website: https://tothemoon.com
android:
  appId: com.cryptology.flutter
  users: 10000
  appCountry: us
  released: May 9, 2023
  updated: 2026-01-30
  version: 1.2.170
  icon: com.cryptology.flutter.webp
  meta: ok
  verdict: custodial
  developerName: tothemoon
iphone:
  appId: com.cryptology.go
  idd: '6448920037'
  appCountry: de
  released: '2023-10-05T07:00:00Z'
  updated: 2026-10-22
  version: 1.2.184
  reviews: 1
  icon: com.cryptology.go.webp
  meta: ok
  verdict: custodial
  developerName: Cypher Trading UAB

---

## App Description

This is the app of Tothemoon, the crypto exchange formerly called Cryptology. Tothemoon [announced the rebrand](https://blog.tothemoon.com/articles/cryptology-becomes-tothemoon-stepping-into-the-future-of-finance) on November 21, 2024: "Cryptology is now Tothemoon." The app's package ID still carries the old name, and it replaces {% include walletLink.html wallet='android/com.cryptology.android' verdict='true' %}. The app offers spot and futures trading of over 200 assets, buying crypto with a card, staking, and a Mastercard debit card that spends USDT.

## Analysis

- **History.** Cryptology has been running since 2017 according to the Play description ("Tothemoon has been in the crypto space since 2017"). After the 2024 rebrand, the [Platform Terms of Use](https://tothemoon.com/faq/exchange-t-cs-43000509173) name Brilliantscope Trading Limited, Cyprus, as the operator for the European Economic Area, "authorised by the Cyprus Securities and Exchange Commission as a Crypto-Asset Service Provider" under MiCA. Outside the EEA, services may come from "Tothemoon Global Inc., a company incorporated under the laws of the Republic of Panama". The App Store lists Cypher Trading UAB as the developer.
- **Bitcoin support.** The app is titled "Buy & Trade BTC", and its description lists "Bitcoin (BTC)" first among the supported assets.
- **Sending and receiving.** The Terms say: "You may withdraw or transfer supported crypto-assets or fiat currency, subject to available balance, account status, supported methods, limits, fees, compliance checks". Tothemoon's [withdrawal guide](https://blog.tothemoon.com/articles/how-to-withdraw-funds-step-by-step-guide) tells users to "Enter the wallet address where the funds will be sent and select the correct network". Deposits are covered by section 19 of the Terms.
- **Custody.** Section 17 of the Terms, "Custody and Administration of Crypto-Assets", says: "Tothemoon holds or arranges for the holding of supported crypto-assets or means of access to supported crypto-assets on behalf of clients." Assets may sit in "hot wallets, cold wallets, omnibus wallet arrangements, segregated wallet arrangements, internal ledger arrangements". It adds: "you do not have a claim to any specific blockchain address, private key, UTXO, wallet, token unit or on-chain asset. Your rights are recorded in your account and our internal records." The Play description promises "non-custodial options" for staking, but the rebrand post calls the same product "custodial staking".

Tothemoon holds the keys to its customers' bitcoin, so the app is {% include verdictBadge.html verdict="custodial" type='short' %}, like the Cryptology app it replaces.

## iPhone

The iOS app has a different bundle ID, `com.cryptology.go`, and is published under Cypher Trading UAB, but it is the same Tothemoon app for the same account, so the same verdict applies.

**Custodial: The provider holds the keys**
