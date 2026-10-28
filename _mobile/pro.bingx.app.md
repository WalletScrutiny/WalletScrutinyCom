---
title: BingX Pro Trade BTC
date: 2026-10-28
authors:
- leo
website: https://www.bingx.pro
twitter: BingXOfficial
android:
  appId: pro.bingx.app
  users: 100000
  appCountry: us
  released: Jan 16, 2026
  updated: 2026-08-21
  version: 5.0.3
  reviews: 5
  icon: pro.bingx.app.webp
  meta: ok
  verdict: custodial
  developerName: BINGX GLOBAL
iphone:
  appId: pro.bingx.app
  idd: '1672172781'
  appCountry: in
  released: '2023-12-04T08:00:00Z'
  updated: 2026-10-19
  version: 5.4.0
  reviews: 388
  icon: pro.bingx.app.webp
  meta: ok
  verdict: custodial
  developerName: BINGX EU EAB

---

## App Description

BingX Pro is an exchange app published by "BINGX GLOBAL". It links to `bingx.pro`, a BingX domain that serves the same site as bingx.com, and gives the support address `SupportCS@bingx.com`. BingX's bug bounty on [HackenProof](https://hackenproof.com/programs/bingx-exchange) lists `*.bingx.pro` alongside `*.bingx.com` as in-scope targets. The app offers spot trading, perpetual futures and copy trading in BTC, ETH, USDT and other assets. BingX's main app is already listed as {% include walletLink.html wallet='android/pro.bingbon.app' verdict='true' %}.

## Analysis

- **Bitcoin support.** The Play description says users can "buy, sell, trade and hold" BTC. BingX's help article [How Do I Send Bitcoin (BTC) to Another Person's Wallet?](https://bingx.com/en/answers/master-the-app-step-by-step-success/how-to-send-bitcoin-to-another-wallet) says to "Pick On-Chain Withdrawal to dispatch the assets externally" and to "Ensure the withdrawal network is explicitly set to BTC (Bitcoin Network)". That article is written for the main BingX platform. We assume BingX Pro uses the same accounts, since it is the same company on a BingX domain, but we did not test the app.
- **Custody.** BingX's [Service Agreement](https://static-app-cb.bb-os.com/agreement/AGRT_service_en.html), hosted on the same server as the privacy policy the app links, says users must "deposit digital assets prior to commencement of trading" and that "Traders may request the withdrawal of their digital assets, subject to the limitations as stated in these Terms". After an account is terminated, "BingX maintains full custody of the funds".
- **Publisher name.** The developer is "BINGX GLOBAL", while the main BingX app is published by "BINGX GROUP LIMITED". The website, support address and bug-bounty scope all point to BingX itself, so we see no sign of an impostor.
- **History.** BingX's hot wallet was hacked on 20 September 2024, with losses estimated at about $43M ([The Block](https://www.theblock.co/post/317448/crypto-exchange-bingx-faces-an-estimated-43-million-security-exploit-peckshield)). The main BingX app is listed as {% include walletLink.html wallet='android/pro.bingbon.app' verdict='true' %}.

Users deposit bitcoin to BingX and have to ask BingX to withdraw them, so BingX holds the keys: the app is {% include verdictBadge.html verdict="custodial" type='short' %}.

## iPhone

The iOS app is published by BINGX GLOBAL, the same provider, and it gives access to the same account and service, so the same verdict applies to it.

**Custodial: The provider holds the keys**
