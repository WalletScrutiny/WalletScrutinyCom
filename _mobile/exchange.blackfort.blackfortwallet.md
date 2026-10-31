---
title: BlackFort Wallet
date: 2026-10-31
authors:
- leo
android:
  appId: exchange.blackfort.blackfortwallet
  users: 100000
  appCountry: us
  updated: 2026-09-09
  version: 2.25.0
  reviews: 5
  icon: exchange.blackfort.blackfortwallet.webp
  meta: ok
  verdict: nosource
  developerName: Blackfort Technologies LLC
iphone:
  appId: exchange.blackfort.blackfortwallet
  idd: '6447954137'
  appCountry: de
  released: '2023-05-20T07:00:00Z'
  updated: 2026-09-23
  version: 2.25.0
  reviews: 92
  icon: exchange.blackfort.blackfortwallet.webp
  meta: ok
  verdict: nosource
  developerName: BlackFort

---

**⚠️ Warning:** In June 2023 the German regulator BaFin warned that Blackfort Tech Estonia OÜ offers banking or financial services through blackfort.exchange without a licence, as [BehindMLM reported](https://behindmlm.com/companies/blackfort-wallet-securities-fraud-warning-from-germany/). The same site says the company is "operated by persons unknown". Its [2022 review](https://behindmlm.com/mlm-reviews/blackfort-wallet-review-bxn-token-nodes-ponzi/) calls BlackFort's token investment scheme a Ponzi scheme and reports that "BlackFort Wallet pays affiliates 10% of funds invested in BXN tokens". The wallet is closed source, so its self-custody claim cannot be checked.

## App Description

BlackFort Wallet is the wallet of BlackFort, which also runs its own EVM-compatible blockchain, BXN (chain ID 488), validated by "NFT nodes" that users buy. The Play description calls it "a secure client-side Wallet Application" for "Bitcoin, Ethereum, BXN and all ERC20 coins and tokens". It also offers card and SEPA purchases and in-app swaps. The description adds: "Private keys are stored on the device and never leave it, protected by a 12-word mnemonic phrase". BlackFort's [wallet page](https://blackfort.com/wallet) says "Non-Custodial By Design" and "Your private keys never leave your device". This app replaces the earlier app from the same developer, Blackfort Technologies LLC, {% include walletLink.html wallet='android/exchange.blackfort.wallet' verdict='true' %}, whose description made the same claims.

## Analysis

- **Bitcoin support.** The Play description lists Bitcoin first among the supported coins, and the [wallet page](https://blackfort.com/wallet) advertises "BTC + THOUSANDS" of assets.
- **Custody.** BlackFort claims the app is self-custodial, with keys on the device and a 12-word backup. In our test of the earlier app, it showed a 12-word backup phrase.
- **Source code.** Neither [blackfort.com](https://blackfort.com/) nor the wallet page links to any source code. BlackFort's GitHub organization, [BlackFortGroup](https://github.com/BlackFortGroup), has repositories for the BXN chain (contracts, docs, a Blockscout fork, deployment scripts). Its only wallet repository, [BlackFortWallet-Doc](https://github.com/BlackFortGroup/BlackFortWallet-Doc), holds screenshots and a JSON file from 2021, not app code. A GitHub repository search for "blackfort" found nothing else from the provider.

We found no public source code for this app, so the provider's self-custody claim cannot be verified. The app is {% include verdictBadge.html verdict="nosource" type='short' %}, like its predecessor.

**No source for current release found**
