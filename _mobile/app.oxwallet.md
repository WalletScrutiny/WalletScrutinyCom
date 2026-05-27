---
title: OX Wallet Secure
verdict: wip
date: 2026-01-14
authors:
- danny
website: https://oxwallet.app
redirect_from:
- /android/app.oxwallet/
android:
  appId: app.oxwallet
  users: 5000
  released: 2024-10-14
  updated: 2025-04-06
  version: 2.2.3
  icon: app.oxwallet.png
  meta: defunct
  developerName: Oxlabs group

---

## App Description

Based on the Play Store description alone, Ox Wallet explicitly claims to support Bitcoin and markets itself as a self-custodial, multi-asset wallet where private keys are stored locally on the user’s device.

From its Play description:

> Secure Self-Custody: Take full control of your digital assets. Your private keys are encrypted and stored securely on your device, giving you complete ownership and peace of mind.
>
> Multi-Asset Support: Ox Wallet supports a wide range of cryptocurrencies and digital assets, including Bitcoin, Ethereum, stablecoins, and more.
> 
> AI-Powered Insights: Gain an edge with advanced AI features. Receive personalized trading suggestions, portfolio optimization strategies, and risk assessment analysis.

## Analysis

The app's website is no longer online. Furthermore, the app has an associated token with it:

> The OXCH token powers the Ox Wallet ecosystem. 

Our testing reveals that the app barely functions. It [does not even display the supported assets](https://x.com/BitcoinWalletz/status/2011708944302145881/photo/3). 

The description also heavily emphasizes AI-powered trading suggestions, cashback on trades, staking of a native token (OXCH), DeFi access, and cross-chain bridges, which are features that commonly rely on backend services and third-party integrations and therefore require careful verification of custody and transaction flow. At this stage, there is no evidence provided that Bitcoin transactions are purely on-chain, locally signed, and broadcast without intermediary services. 

Although the app does show what appears to be a wallet's 12-word seed phrase - its main functions did not appear. This includes the wallet itself. A search on [social media for the app's associated ticker symbol](https://x.com/search?q=%24OXCH) would show a lot of Indian accounts posting about airdrops. Even secondary sites, or sites that are linked to the token ticker, such as oxchanger.com, related to the project are no longer online. 

At this point, we are assuming a **defunct project** with questionable claims of self-custody.
