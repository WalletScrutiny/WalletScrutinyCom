---
title: Liana
appId: liana
authors:
- danny
released: 2022-07-20
discontinued: 
updated: 2025-10-09
version: 13.1
binaries: https://github.com/wizardsardine/liana/releases
provider: Wizardsardine
providerWebsite: 
website: https://wizardsardine.com/liana
repository: https://github.com/wizardsardine/liana
issue: 
icon: liana.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-11-07
twitter: 
social: 
features:
- multisig
- hardware

---

## App Description

Liana is a Bitcoin wallet that implements a spending policy combining a primary path and one or more time-delayed recovery paths. The primary path allows immediate spending, while recovery paths become available only after a specified period of onchain inactivity. Both paths support single-signature or multi-signature configurations. ([Source](https://github.com/wizardsardine/liana#about))

The time-based spending restrictions are enforced using Bitcoin Script timelocks and miniscript-based descriptors. The wallet daemon constructs PSBTs that conform to the configured spending policy. Users define the spending policy during wallet creation, specifying which keys can spend immediately and which keys can spend after defined lockup periods. ([Source](https://github.com/wizardsardine/liana#about))

Liana is implemented in Rust with two main components: a daemon that manages wallet state and transaction logic, and a GTK-based GUI for Linux, macOS, and Windows. The daemon exposes a JSONRPC API via Unix Domain Socket. The wallet supports PSBT (Partially Signed Bitcoin Transactions) and integrates with hardware wallets through HWI (Hardware Wallet Interface). Source code is available under the BSD 3-Clause License. ([Source](https://github.com/wizardsardine/liana#hacking-on-liana))

This desktop program is **for verification**.
