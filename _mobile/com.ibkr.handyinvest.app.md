---
title: Handy Invest
date: 2026-10-28
authors:
- leo
android:
  appId: com.ibkr.handyinvest.app
  users: 1000
  appCountry: us
  released: Sep 1, 2022
  updated: 2026-09-08
  version: 1.4.939
  icon: com.ibkr.handyinvest.app.webp
  meta: ok
  verdict: custodial
  developerName: IB Exchange Corp.
iphone:
  appId: com.ibkr.handyinvest
  idd: '1641664193'
  appCountry: us
  released: '2022-09-07T07:00:00Z'
  updated: 2026-01-19
  version: '10.06'
  reviews: 0
  icon: com.ibkr.handyinvest.webp
  meta: ok
  verdict: custodial
  developerName: IB Exchange Corp.

---

## App Description

Handy Invest is a simplified mobile trading app from the Interactive Brokers group, published on Google Play by "IB Exchange Corp." It offers stocks on more than 90 markets, options and fractional shares, "plus Bitcoin, Bitcoin Cash, Ether and Litecoin". The description says US applicants must open an IBKR Lite account with Interactive Brokers LLC. It also says crypto trading and custody are provided by Paxos Trust Company.

## Analysis

- **Bitcoin support.** The description lists Bitcoin among the tradable assets.
- **Custody.** The description states: "All trading and custody of digital assets is provided by Paxos Trust Company ("Paxos") in an account held in your name at Paxos." The Interactive Brokers [cryptocurrency page](https://www.interactivebrokers.com/en/trading/products-cryptocurrencies.php), read via a rendering proxy, says: "Crypto execution and custody provided by Paxos Trust Company or zerohash llc, based on account type and residence". Paxos or zerohash holds the bitcoin, not the user.
- **Deposits and withdrawals.** According to the [IBKR crypto deposit guide](https://ibkrguides.com/clientportal/crypto-deposit.htm), clients can transfer "BTC, ETH, SOL, BCH, LTC" from an external wallet into their IBKR-linked crypto account, using **Transfer & Pay > Transfer Funds** in the Client Portal. According to the [withdrawal guide](https://www.ibkrguides.com/clientportal/transferandpay/withdrawcrypto.htm), "You can withdraw cryptocurrency assets from your Paxos or zerohash account and place them in an external wallet using the Paxos or the zerohash web app." Both guides describe the web portals. Neither mentions the Handy Invest app.
- Crypto eligibility depends on the IBKR entity and the client's country of residence. We did not determine which Handy Invest users can trade or transfer crypto.

Bitcoin bought through Handy Invest is held by Paxos or zerohash for the user. That makes the app {% include verdictBadge.html verdict="custodial" type='short' %}.

## iPhone

The iOS app is published by IB Exchange Corp., the same provider, and it gives access to the same account and service, so the same verdict applies to it.

**Custodial: The provider holds the keys**
