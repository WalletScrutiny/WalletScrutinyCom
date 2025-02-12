---
title: Kraken Desktop
appId: kraken.desktop
authors:
- danny
released: 2024-10-31
discontinued: 
updated: 
version: 1.1.1-1
binaries: https://kraken.com/desktop
provider: Payward, Inc. (Kraken)
providerWebsite: https://www.kraken.com
website: https://www.kraken.com/desktop
repository: 
issue: 
icon: kraken.png
bugbounty: 
meta: ok
verdict: custodial
date: 2024-02-04
reviewArchive: 
twitter: krakenfx
social:
- https://www.facebook.com/KrakenFX
- https://www.reddit.com/r/Kraken
- https://github.com/kraken
features:
- trading
- custodial

---

## App Description

Kraken Desktop is a trading platform built using Rust and the Iced GUI library, designed for advanced cryptocurrency trading. The app provides a customizable interface for trading across 800+ Kraken markets.

Key features include:
- Advanced order types (iceberg, trailing stops)
- Technical analysis tools and drawing library
- Customizable layouts with up to 48 modules per board
- Multi-window support
- Chart comparison tools
- Price alerts
- Ladder trading capabilities

## Analysis 

Kraken Desktop is a **custodial** trading platform for the following reasons:

1. It's an official application from Kraken exchange, a custodial cryptocurrency exchange
2. Users must log in with their Kraken Pro account credentials
3. The app integrates directly with Kraken's custodial trading services
4. Users don't control their private keys
5. All trades and assets are managed through Kraken's custodial infrastructure

While the application offers advanced trading features and is built with performance in mind using Rust, it remains a custodial solution where users must trust Kraken with their funds. The app serves as an interface to Kraken's exchange services rather than a self-custodial wallet.
