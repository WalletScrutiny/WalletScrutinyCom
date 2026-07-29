---
title: Cake Wallet
appId: cakewallet
authors:
- danny
released: 2023-02-24
discontinued: 
updated: 2026-07-27
version: 6.4.0
binaries: 
provider: Cake Labs
providerWebsite: 
website: https://cakewallet.com
repository: https://github.com/cake-tech/cake_wallet
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
- TOR
- batching
- buyWithCC
- coinCtrl
- customNode
- foss
- hd
- multiAccount
- tradeAlts

---

## App Description

Cake Wallet is a non-custodial, multi-currency wallet developed by Cake Labs LLC and licensed under [MIT](https://github.com/cake-tech/cake_wallet/blob/main/LICENSE#deadLink). Originally released as a Monero-only mobile wallet in 2018, it expanded to support Bitcoin, Litecoin, Ethereum, Bitcoin Cash, Polygon, Solana, Tron, Nano, Zano, Decred, and Wownero. The desktop version launched in [February 2023](https://www.reddit.com/r/Monero/comments/11b4f3f/cake_wallet_arrives_on_desktop_beta_release_for/) (macOS), followed by Linux in May 2023 and Windows in May 2024.

The desktop app supports cross-platform wallet backup and restore (mobile-to-desktop and vice versa), built-in exchange functionality, custom remote node selection, and Monero subaddress/account management. It is available as a Windows installer, Linux Flatpak, and Linux tarball. SHA-256 hashes are published with each [GitHub release](https://github.com/cake-tech/cake_wallet/releases).

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/2022134630489706978) the app, and posted a screenshot on x.com. We were able to generate a Bitcoin wallet, and successfully exported it to Electrum using the provided seed phrases. The BTC addresses matched. 

This app is **for reproducible builds verification**.

{% include featureEvidence.html feature="foss" quote="Cake Wallet is an open-source, non-custodial, and private multi-currency crypto wallet for Android, iOS, macOS, and Linux." source="README" comment="App Description also confirms MIT license from the GitHub LICENSE file." %}

{% include featureEvidence.html feature="tradeAlts" quote="Built-in exchange for dozens of pairs" source="README" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy cryptocurrency (BTC/LTC/XMR/ETH) with credit/debit/bank" source="README" %}

{% include featureEvidence.html feature="multiAccount" quote="Create several wallets" source="README" %}

{% include featureEvidence.html feature="customNode" quote="Select your own custom nodes/servers" source="README" %}

{% include featureEvidence.html feature="TOR" quote="Robust privacy settings (eg: Tor-only connections)" source="README" %}

{% include featureEvidence.html feature="batching" quote="Specify multiple recipients for batch sending" source="README" %}

{% include featureEvidence.html feature="coinCtrl" quote="Bitcoin coin control (specify specific outputs to spend)" source="README" %}

{% include featureEvidence.html feature="hd" quote="We were able to generate a Bitcoin wallet, and successfully exported it to Electrum using the provided seed phrases. The BTC addresses matched." source="App Description" comment="Seed phrases recoverable on a competitor product (Electrum) confirms BIP39/HD compliance." %}