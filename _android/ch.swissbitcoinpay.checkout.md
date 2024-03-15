---
wsId: swissBitcoinPay
title: Swiss Bitcoin Pay
altTitle: 
authors:
- danny 
users: 1000
appId: ch.swissbitcoinpay.checkout
appCountry: 
released: 2022-11-15
updated: 2024-02-03
version: 2.0.6
stars: 4.7
ratings: 
reviews: 
size: 
website: https://swiss-bitcoin-pay.ch
repository: https://github.com/SwissBitcoinPay/app
issue: 
icon: ch.swissbitcoinpay.checkout.png
bugbounty: 
meta: ok
verdict: wip
date: 2024-02-28
signer: 
reviewArchive: 
twitter: SwissBitcoinPay
social:
- https://www.linkedin.com/company/swiss-bitcoin-pay
- https://www.youtube.com/@swissbitcoinpay 
redirect_from: 
developerName: Swiss Bitcoin Pay
features:
- ln 

---

## App Description from Google Play

> Accept Bitcoin in your business.
>
> Worldwide. Free to start. No hardware. Non-custodial.
>
> The simplest way to accept Bitcoin payments in your Business, restaurant, bar, and others.
>
> So simple to use:
> 1. You type the amount in your local currency.
> 2. Client scan the QR or tap a Lightning NFC Card.
> 3. Paid.
>
> Maximum compatibility:
>
> Through the same screen, receive in:
> Bitcoin On-chain
> Lightning
> Lightning-NFC standard
>
> Non-custodial
>
> After clients have paid through Onchain and/or Lightning, the Lightning-BTC will be converted to Onchain-BTC (free of charge) and will all be sent to your private wallet (free of charge), as configured in your account.

- All the bitcoins that you charge via Swiss Bitcoin Pay will be sent to the address you provide.
- Lightning to Onchain conversions and miner fees are always free of charge for you
- Payout is done every day at 0:00 UTC
- A cryptographic signature of your Bitcoin wallet is required to prove ownership.

## Analysis 

- Account creation was straight-forward. It only required an email address.
- The 12-word seed phrase were provided during wallet creation.
- They claim to have their app on [F-Droid](https://swiss-bitcoin-pay.ch/fdroid/repo/).
- They provided the fingerprint (SHA-256) of the repository signing key.
- I requested Swiss Pay to provide build instructions using a Docker container. This app is **[for verification](https://github.com/SwissBitcoinPay/app/issues/53)**.
