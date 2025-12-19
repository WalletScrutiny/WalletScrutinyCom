---
title: Bisq
appId: bisq
authors:
- danny
released: 2016-04-09
discontinued: 
updated: 2024-05-27
version: 1.9.21
binaries: 
provider: 
providerWebsite: 
website: https://bisq.network
repository: https://github.com/bisq-network/bisq
issue: 
icon: bisq.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-08-25
twitter: bisq_network
social: 
builds:
  - arch: x86_64-linux
    types:
      - deb
      - rpm
features: 

---

## App Description

Bisq is a decentralized peer-to-peer exchange for trading bitcoin with national currencies and other cryptocurrencies. As described on their [website:](https://bisq.network)

> Bisq is a safe, private and decentralized way to exchange bitcoin for national currencies and other digital assets. Bisq uses peer-to-peer networking and multi-signature escrow to facilitate trading without a third party.

Key features include:
- **No registration required** - Users can start trading immediately without identity verification
- **Non-custodial** - Bisq never holds user funds; trades use 2-of-2 multisig escrow
- **Privacy-focused** - All data stored locally, every node runs as Tor hidden service by default
- **Decentralized governance** - The Bisq DAO enables decentralized decision-making built on Bitcoin

The application is available for Windows, macOS, and Linux. It connects to a global P2P network where users can create offers to buy/sell bitcoin or take existing offers from other traders.

Bisq is open-source software built with Java and uses Gradle as its build system. The project has discussed implementing deterministic builds similar to Bitcoin's Gitian build system, though this appears to be a work in progress. The JAR file is already deterministic and hashes are provided with releases for verification, but the full binary reproducibility for all platforms requires further development.

Its successor, [Bisq2](https://bisq.wiki/Bisq_2) is currently in beta.
