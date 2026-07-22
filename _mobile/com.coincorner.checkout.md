---
wsId: coinCornerCheckout
title: CoinCorner - Checkout
date: 2025-09-17
authors:
- danny
website: https://coincorner.com/checkout
redirect_from:
- /android/com.coincorner.checkout/
- /iphone/com.coincorner.checkout/
android:
  appId: com.coincorner.checkout
  users: 500
  appCountry: us
  released: 2022-09-29
  updated: 2025-09-15
  version: 2.7.0
  icon: com.coincorner.checkout.png
  meta: fewusers
  verdict: custodial
  developerName: CoinCorner Ltd
iphone:
  appId: com.coincorner.checkout
  idd: '1464880599'
  appCountry: us
  released: 2019-06-01
  updated: 2026-03-26
  version: 2.1.0
  reviews: 0
  icon: com.coincorner.checkout.jpg
  meta: ok
  verdict: custodial
  developerName: CoinCorner Ltd

---

## App Description

CoinCorner Checkout is a merchant point-of-sale application published by CoinCorner Ltd for Android (`com.coincorner.checkout`) and iOS (`com.coincorner.checkout`). The store listing states the app lets a business create invoices with QR codes for customers to scan and pay, manage orders and their payment status, view account balances (listed as GBP, EUR, BTC, ETH, LTC and XRP), and issue refunds, and its version history records that Lightning Network payment support was added in 2020. The developer describes it as a way to "Accept Bitcoin Payments today" and "perfect for businesses that want to accept Bitcoin whenever and wherever they are."

## Testing and Analysis

The app is a front-end to a CoinCorner-hosted account, not a self-custody wallet. The following documentary evidence establishes this:

1. **A CoinCorner business account is required, and payments settle into it.** CoinCorner's support documentation states that "CoinCorner Checkout allows CoinCorner business account holders to accept Bitcoin payments for their goods or services," offered both as a downloadable website plugin and, as a parallel channel, "through our checkout app" on the iOS and Android app stores ([What is CoinCorner Checkout?](https://support.coincorner.com/hc/en-us/articles/360023433914-What-is-CoinCorner-Checkout)). After a customer scans and pays the QR code, the article states the funds "will show in your CoinCorner business account balance in either BTC or GBP/EUR."

2. **CoinCorner holds the funds and retains the private keys.** Its Terms of Use establish the custodial relationship directly ([Terms of Use](https://www.coincorner.com/legal/iom/terms-and-privacy-policy)). For Checkout, the merchant authorises CoinCorner to hold their funds — "By using Checkout, you authorise us to act as your agent so we may receive, hold and disburse funds on your behalf" — and the purchaser's payment is made to CoinCorner rather than to the merchant directly: "Payment made by the Purchaser to CoinCorner will be considered the same as payment made directly to you and will extinguish the Purchaser's outstanding obligation, to the extent of the payment." For the underlying cryptoassets, CoinCorner states it controls the keys: "In the interest of security, CoinCorner retains and securely stores all Virtual Asset private keys in a mixture of both online and offline storage."

3. **The verdict rests on documentation, not app or source-code inspection.** A live account test could not be completed, so this assessment is based on CoinCorner's published support documentation and Terms of Use.

Because a third party (CoinCorner) holds the keys and the funds on the user's behalf, the app is **custodial**.
