---
title: Cake Wallet
appId: cakewallet
authors:
- danny
released: 2023-02-24
discontinued: 
updated: 2026-02-11
version: 5.9.0
binaries: 
provider: Cake Labs
providerWebsite: 
website: https://cakewallet.com
repository: https://github.com/cake-tech/cake_wallet
issue: 
icon: cakewallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-02-13
twitter: cakewallet
social:
- https://www.facebook.com/cakewallet
- https://t.me/cakewalletannouncements
- https://discord.com/invite/2vqYJdXG2H
builds: 
features: 

---

## App Description

Cake Wallet is a non-custodial, multi-currency wallet developed by Cake Labs LLC and licensed under [MIT](https://github.com/cake-tech/cake_wallet/blob/main/LICENSE). Originally released as a Monero-only mobile wallet in 2018, it expanded to support Bitcoin, Litecoin, Ethereum, Bitcoin Cash, Polygon, Solana, Tron, Nano, Zano, Decred, and Wownero. The desktop version launched in [February 2023](https://www.reddit.com/r/Monero/comments/11b4f3f/cake_wallet_arrives_on_desktop_beta_release_for/) (macOS), followed by Linux in May 2023 and Windows in May 2024.

The desktop app supports cross-platform wallet backup and restore (mobile-to-desktop and vice versa), built-in exchange functionality, custom remote node selection, and Monero subaddress/account management. It is available as a Windows installer, Linux Flatpak, and Linux tarball. SHA-256 hashes are published with each [GitHub release](https://github.com/cake-tech/cake_wallet/releases).

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/2022134630489706978) the app, and posted a screenshot on x.com. We were able to generate a Bitcoin wallet, and successfully exported it to Electrum using the provided seed phrases. The BTC addresses matched. 

This app is **for reproducible builds verification**.