---
wsId: plugCrypto
title: Plug - Crypto Wallet
altTitle: 
authors:
- danny 
users: 100000
appId: co.psychedelic.plug
appCountry: 
released: 2022-07-01
updated: 2025-12-23
version: 2.6.0
stars: 3.8
ratings: 
reviews: 17
website: https://plugwallet.ooo
repository: 
issue: 
icon: co.psychedelic.plug.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2026-01-15
signer: 
twitter: plug_wallet
social:
- https://discord.com/invite/mPpzf45qrt 
redirect_from: 
developerName: Funded Labs
builds: 
features: 

---

## App Description

According to its Play description, Plug is a self-custody wallet and identity app designed for the Internet Computer ecosystem, allowing users to manage digital assets, tokens, and NFTs while carrying a portable Web3 identity across decentralized applications. The app claims support for multiple blockchains, including Bitcoin, Ethereum, Solana, and ICP, and provides features such as transaction history, address book management, and biometric security. Plug positions itself as a unified wallet experience that enables users to interact seamlessly with Web3 services on mobile and desktop.

## Testing and Analysis

The app was [tested](https://x.com/BitcoinWalletz/status/2011763343758147879) to evaluate its Bitcoin wallet implementation and key-derivation behavior. A Bitcoin receiving address(bc1p3f8xyj9n5fqtm9tkc0e3v26entfrqdzhpw2e8xum4xe64juqeccsaxfa7p) was generated, and the recovery phrase was exported and [imported into Electrum](https://x.com/BitcoinWalletz/status/2011764733909876926) Desktop 4.6.2 using standard Bitcoin derivation paths, followed by [Sparrow Wallet](https://x.com/BitcoinWalletz/status/2011768406329151999) configured explicitly for Taproot (BIP86, m/86'/0'/0').

In both cases, none of the derived addresses matched the Bitcoin address shown by the app, and no overlap was observed between address sets. This result persisted across native SegWit and Taproot configurations, ruling out derivation-path mismatch.

Although the app advertises Bitcoin support and displays a valid-looking Taproot (bc1p…) address, the observed behavior shows that it does not use standard, interoperable Bitcoin key derivation, and the recovery phrase cannot be used to reproduce the same Bitcoin addresses in independent Bitcoin wallet software.

Thus, we cannot claim true self-custody and have to give a **custodial** assessment.