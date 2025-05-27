---
title: Shock Wallet
appId: shockwallet
authors:
- danny
released: 2022-11-17
discontinued: 
updated: 2025-02-21
version: 0.0.17-beta
binaries: 
provider: ShockNet
providerWebsite: 
website: https://shock.network/
repository: https://github.com/shocknet/wallet2
issue: 
icon: shockwallet.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2024-05-09
twitter: shockbtc
social: 
features: 

---

## App Description

This comes as a progressive web application and not a native desktop application. There are no desktop binaries in the [releases](https://github.com/shocknet/wallet2/releases/tag/v0.0.17-beta) and only an apk. 

It is a BTC-lightning focused app that leverages the Nostr network to connect to lightning nodes. As such, the Bitcoin private key resides with the nodes which may or may not be controlled by the user. There is a default node configured for the app:

> For new users, an optional Bootstrap node is default on mainnet allowing for the lay-away of a self-custodied channel for your own node with a partner LSP.

They describe this as subject to their [terms.](https://docs.shock.network/terms)

The control over the Bitcoin private keys resides with the LSP. With that said, the app is **source-available.**