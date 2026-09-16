---
title: Freedom Pay Wallet
date: 2026-09-16
authors:
- danny
website: https://www.freedomdevelopmentfoundation.org/our-mission
android:
  appId: com.freedomdevelopmentfoundation.ios
  users: 5000
  appCountry: us
  released: 2023-08-18
  updated: 2026-07-13
  version: '183'
  icon: com.freedomdevelopmentfoundation.ios.png
  meta: ok
  verdict: nobtc
  developerName: Freedom Pay
iphone:
  appId: com.freedomdevelopmentfoundation.ios
  idd: '6448116005'
  appCountry: us
  released: 2024-10-29
  updated: 2026-07-16
  version: '2.4'
  reviews: 0
  icon: com.freedomdevelopmentfoundation.ios.jpg
  meta: ok
  verdict: nobtc
  developerName: Freedom Development Foundation CIC

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6448116005" author="overtorment" severity="high" finding="SEP-30 “Secure Backup” gives two same-domain services enough weight to pay without the device key." note="Per overtorment’s analysis of the iPhone app, store version 2.4: he found no hidden third-party server and no upload of recovery phrases or secret keys. What he did find is that the “Secure Backup” sign-up hands signing power to two recovery services run by the same operator, on the same <code>bpventures.us</code> domain, and switches the account’s own master key off. Those two services together can act on the account without the phone. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

Freedom Pay Wallet is published by the Freedom Development Foundation CIC on the App Store and by Freedom Pay on Google Play. It is a payments wallet built on the Stellar network, aimed at sending and receiving stablecoins, and the app's home screen shows a dollar balance with **Deposit**, **Withdraw** and **Send** buttons plus a promotion for turning USDC into gift cards. Account creation offers a "Secure Backup" sign-up through a Google account.

## Testing and Analysis

This assessment was recorded on 2026-09-16. We installed the Android app, version 183, from [Google Play](https://play.google.com/store/apps/details?id=com.freedomdevelopmentfoundation.ios) and signed in through the Google account option. Screenshots of the wallet and its asset list are published in [this thread](https://x.com/BitcoinWalletz/status/2100047758359187768).

### The asset list is stablecoins and Stellar tokens

The wallet opens with a USDC balance. Scrolling its asset list, we recorded the following, in the order the app shows them:

- USDC, USDT0, PYUSD, USDY
- USDGLO, CETES, USTRY, NGNT, NGNC
- XLM (Stellar), ETH, GYEN, XRP
- BTCLN, EURC, BLND, TZS, AUDD, RWF, CLPX, AQUA, BRL

The list is long and scrolls, so this is what we captured rather than a guaranteed complete inventory. It is dominated by fiat-pegged stablecoins — US dollar, euro, Mexican, Turkish, Nigerian, Tanzanian, Australian, Rwandan and Brazilian — which matches a payments product rather than a Bitcoin wallet. Neither store description mentions Bitcoin.

### BTCLN is a token on Stellar, not native Bitcoin

One entry, **BTCLN**, carries a Bitcoin-styled name. This is a Stellar wallet: every other entry in that same list is a Stellar asset, and overtorment's analysis of the iPhone build describes the app as a Stellar wallet built with Capacitor and Next.js. An asset code shown in a Stellar wallet's own token list is a token issued on Stellar — somebody's promise, redeemable from that issuer — and not bitcoin held on the Bitcoin network. We did not open the asset to read its issuer, so we are describing where it appears, not who backs it.

This matters for the verdict. Holding a token that represents Bitcoin is not the same as holding Bitcoin: the user's claim is on whoever issued the token, and it is only as good as that issuer. Bitcoin held in a wallet the user controls carries no such dependency.

### What we could check of overtorment's finding

We used the same Google "Secure Backup" sign-up he analysed. That is the same screen, not the same evidence: he read the iPhone build, and we did not check whether the Android build sets its signers up the same way. We did not monitor the app's network traffic and did not inspect the Android bundle, so nothing below is reproduced by us. In plain terms, here is what he describes:

A Stellar account can have several keys that are allowed to sign for it, each key given a number of points, and the account has a rule saying how many points a transaction needs before it goes through. Freedom Pay uses that system to let you recover your wallet if you lose your phone, by giving two of the company's servers signing keys of their own.

Your phone's key gets 10 points, each of the two recovery servers gets 10 points, sending money needs 10 points, and changing who controls the account needs 20. The account's original master key is then set to 0 points, which switches it off entirely.

Both of those servers belong to the same company, BP Ventures, at the same `bpventures.us` address, so the company holds 20 points by itself and never needs your phone to act. That is why he describes this as the same as the company holding your money, even though nobody is secretly copying your recovery phrase. Reading the code he quotes, sending money needs only 10 points, so either server on its own already has enough to pay; the 20 matters for rewriting who controls the account. Your phone alone has 10 points, so you can pay — but you can never change the signing setup by yourself, because that needs 20 and you only have 10.

He also reports that the app's main bundle hardcodes an Android keystore password and a chat token, and stores the recovery device secret and PIN with a built-in fallback encryption key. We did not check these.

### Verdict: does not support Bitcoin (BTC)

The released app is a Stellar payments wallet whose asset list is stablecoins and Stellar tokens. Its one Bitcoin-named entry, BTCLN, appears from where it sits to be a token on Stellar rather than bitcoin on the Bitcoin network; we did not open it to confirm its issuer. Neither store description mentions Bitcoin. Both entries on this page are the same product, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**.

The verdict stops at the Bitcoin-support gate. The account-control material above is overtorment's research, recorded here so readers can weigh it; it is not a custody assessment of our own. Source availability is not assessed.
