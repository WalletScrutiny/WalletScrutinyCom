---
title: 'Krak: Money App & Cashback'
date: 2026-10-28
authors:
- leo
website: https://www.kraken.com
twitter: Krak
android:
  appId: com.kraken.pay.app
  users: 500000
  appCountry: us
  released: Jun 24, 2025
  updated: 2026-10-23
  version: 2.1.0
  reviews: 115
  icon: com.kraken.pay.app.webp
  meta: ok
  verdict: custodial
  developerName: Payward, Inc.

---

## App Description

Krak is a money app from Payward, Inc., the company behind Kraken. It combines a Visa debit card with cashback, interest-bearing "Vaults", payments to other Krak users, and buying, selling and holding "Bitcoin, Ethereum and 600+ other assets". The Play description says "Your money is safeguarded and your crypto is backed by transparent Proof-of-Reserves on major assets". It also says "Transfer assets to and from your Krak balance in just a few taps".

Payward's other apps listed here are {% include walletLink.html wallet='android/com.kraken.invest.app' verdict='true' %}, {% include walletLink.html wallet='android/com.kraken.trade' verdict='true' %}, {% include walletLink.html wallet='android/com.krakenfutures' verdict='true' %} and the self-custodial {% include walletLink.html wallet='android/com.kraken.superwallet' verdict='true' %}.

## Analysis

- **Bitcoin support.** Krak's [withdrawal fee table](https://support.krak.app/articles/cryptocurrency-withdrawal-fees-and-minimums) lists "Bitcoin" with a fee of "0.000015 BTC" and "Bitcoin (Lightning)" with "0 + 0.1% BTC". The same table lists kBTC variants on Ethereum, Ink, OP Mainnet and Unichain. Those are tokens on other chains, not BTC.
- **Deposits.** [How to deposit cryptocurrencies to your Krak account](https://support.krak.app/articles/how-to-deposit-cryptocurrencies-to-your-krak-account) says: "Choose your network. Some cryptocurrencies support multiple networks. (example is showing Bitcoin)". It then says to "Copy the deposit address ... Paste it into your sending platform or wallet". Sending by Kraktag, email or phone to other Krak users ([Send cash or crypto with Krak](https://support.krak.app/articles/how-to-send-cash-or-crypto-with-krak)) is an internal ledger transfer.
- **Custody.** Kraken's [Global Terms of Service](https://www.kraken.com/legal/global-terms) name the Krak app in their e-money and card annexes. Section 2, "Custody and Title of Digital Assets", states: "Digital Assets ... held within your account are assets held in custody by us for you". It adds: "we may use shared blockchain addresses, that we control, to hold Digital Assets on your behalf". The terms also say "a court may disagree with our treatment of your Digital Assets and subject them to claims of our creditors". The Play description says "Krak is not a bank; balances are not FDIC/SIPC-insured".

Krak balances sit in addresses Kraken controls, so the app is [custodial](/methodology/#custodial).

**Custodial: The provider holds the keys**
