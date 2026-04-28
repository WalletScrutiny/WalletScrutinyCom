---
wsId: bitcoinkeeper
title: Bitcoin Keeper
altTitle: 
authors:
- danny
users: 1000
appId: io.hexawallet.bitcoinkeeper
alternativeStores: 
appCountry: UK
released: 2022-12-12
updated: 2026-04-09
version: 2.5.10
reviews: 
website: https://www.bitcoinkeeper.app/
repository: https://github.com/bithyve/bitcoin-keeper
icon: io.hexawallet.bitcoinkeeper.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- ef3d78cc482c6e6171a3b87ee344db0a097196c62736132fb4dcee898d905781
date: 2025-02-12
signer: 66568fd4fb14c0134ff4055762607038ad400ba5cbc8e23e5e25265a0234465c
twitter: bitcoinKeeper_
social:
- https://www.youtube.com/channel/UCMqDNxbz16w8pxpmsa6s8GQ
- https://www.linkedin.com/company/bithyve
- https://t.me/bitcoinkeeper
redirect_from: 
developerName: BitHyve UK Ltd.
builds: 
features:
- coinCtrl
- foss
- multiSig

---

*Legacy verification [2025](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/merge_requests/1002)*


## App Description 

Bitcoin Keeper is an open-source, Bitcoin-only application designed for users who require robust security and long-term storage solutions. It enables the management of Bitcoin across various wallet types, supporting both hot wallets and multi-key offline vaults with customizable m-of-n configurations. The application is compatible with widely used hardware wallets and includes features such as Canary Wallets for monitoring key usage and Assisted Keys for additional security. Users can also manage their UTXOs and plan for Bitcoin inheritance through built-in tools. A Mobile Key is available for quick setup when creating a vault, offering a streamlined user experience without compromising security.

In addition to its core functionality, Bitcoin Keeper includes future-focused features to address evolving security and privacy needs. The app provides several soft key options, allowing users to configure wallet security based on their specific requirements. Upcoming enhancements include in-app chat and Concierge services to facilitate user support and guidance. Its inheritance planning tools are designed to help users establish a structured approach to securing and transferring their Bitcoin holdings over time. For the latest updates, users can follow Bitcoin Keeper on Twitter or join the Telegram channel for support-related inquiries.

### Features

-   Open-source, Bitcoin-only application
-   Supports hot wallets and multi-key offline vaults with customizable m-of-n configurations
-   Compatible with widely used hardware wallets
-   Canary Wallets to monitor and alert users of unwanted key usage
-   Assisted Keys for enhanced security
-   Mobile Key available for quick setup when creating a vault
-   UTXO management for improved transaction control
-   Built-in inheritance planning tools
-   Several soft key options for flexible security configurations
-   Upcoming in-app chat and Concierge services for user support

## Analysis

This app is **for verification**

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2023 bithyve Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:" source="License" %}

{% include featureEvidence.html feature="multiSig" quote="Supports hot wallets and multi-key offline vaults with customizable m-of-n configurations" source="App Description" %}

{% include featureEvidence.html feature="coinCtrl" quote="UTXO management for improved transaction control" source="App Description" %}

An issue has been opened at [https://github.com/bithyve/bitcoin-keeper/issues/6097](https://github.com/bithyve/bitcoin-keeper/issues/6097)
