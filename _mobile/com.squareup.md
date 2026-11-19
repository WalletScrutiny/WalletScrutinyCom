---
title: 'Square Point of Sale: Payment'
date: 2026-10-28
authors:
- leo
website: https://square.com/help
android:
  appId: com.squareup
  users: 10000000
  appCountry: us
  released: May 11, 2010
  updated: 2026-10-27
  version: '7.30'
  reviews: 54588
  icon: com.squareup.webp
  meta: ok
  verdict: custodial
  developerName: Block, Inc.
iphone:
  appId: com.squareup.square
  idd: '335393788'
  appCountry: us
  released: '2010-04-03T04:42:05Z'
  updated: 2026-10-26
  version: '7.31'
  reviews: 606921
  icon: com.squareup.square.webp
  meta: ok
  verdict: custodial
  developerName: Block, Inc.

---

## App Description

Square Point of Sale is Block, Inc.'s point-of-sale app for merchants. It takes card, cash, digital wallet and Cash App Pay payments and handles invoices, inventory and appointments. The Play Store description adds a disclosure: "Square Bitcoin is not offered to NY Sellers or non-US Sellers" and "Bitcoin services are provided by Block, Inc." Through Square Bitcoin, eligible US sellers can accept bitcoin payments over Lightning, convert part of their card sales into bitcoin, and hold that bitcoin in a Square bitcoin wallet. Block holds this bitcoin for them.

## Analysis

- **Bitcoin support.** According to the [Square Bitcoin page](https://squareup.com/us/en/bitcoin), sellers can "Enable Bitcoin Payments in your Square Dashboard or Square Point of Sale apps". At checkout, "A Lightning Invoice QR code will appear on your screen" for the customer to pay. The payment lands in the seller's Square account "either in bitcoin or in automatically converted USD, depending on your settings". Sellers can also convert up to 50% of daily card sales into bitcoin.
- **Custody.** The same page says: "Your converted bitcoin will be custodied securely in your Square wallet". It also says that when conversions are turned off, "Your existing bitcoin stays securely custodied in your Square wallet." The bitcoin is held in the seller's Square account, and Block, Inc. provides the service.
- **Withdrawals and deposits.** The [help article on Bitcoin Conversions](https://squareup.com/help/us/en/article/7935-purchase-bitcoin-with-square) says: "On-chain withdrawals can be executed from your Square bitcoin wallet to any external wallet, including your Cash App wallet." The Square Bitcoin page says sellers can "buy, sell, hold, withdraw, or send bitcoin directly from your Square Dashboard". It also says: "You cannot deposit bitcoin into your Square account at this time". Bitcoin enters the account only through customer Lightning payments, sales conversions or purchases.
- **Where in the product.** Lightning payments are taken in the Point of Sale app itself. Withdrawals, buying and selling are documented only in the web Square Dashboard. We did not find documentation that this Android app can withdraw. The bitcoin balance belongs to the same Square account either way.
- Square Bitcoin is available only to US sellers outside New York. Elsewhere this is a fiat-only payment app.

The bitcoin a seller receives through this app is held by Block, Inc. in the seller's Square account. That makes the app {% include verdictBadge.html verdict="custodial" type='short' %}.

## iPhone

The iOS app is published by Block, Inc., the same provider, and it gives access to the same account and service, so the same verdict applies to it. Bitcoin on Square belongs to the seller's Square account, whichever app is used to reach it.

**Custodial: The provider holds the keys**
