---
wsId: mathWallet5
title: MathWallet
altTitle: 
authors:
- danny
users: 100000
appId: com.mathwallet.android
appCountry: 
released: 2021-10-26
updated: 2025-03-14
version: 5.6.6
stars: 3.6
ratings: 
reviews: 61
website: https://www.mathwallet.org/
repository: 
issue: 
icon: com.mathwallet.android.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-15
signer: 
reviewArchive: 
twitter: Mathwallet
social:
- https://discord.com/invite/gXSfnk5eP5
- https://t.me/mathwalletnews
- https://www.youtube.com/c/MathWallet
redirect_from: 
developerName: Math Global
features:
- segwit
- taproot
- multiwallet

---

💡 This is the successor to {% include walletLink.html wallet='android/com.medishares.android' verdict='true' %}

## App Description from Google Play

> The Multichain Wallet for Web3 supports all EVM / Substrate / CosmosSDK based and other mainstream blockchains.
>
> EVM: Ethereum, BNBChain, Polygon, Optimistic Ethereum, Arbitrum, Moonbeam, Fantom, Avalanche, and more.
>
> Substrate: Polkadot, Kusama, Statemine, Acala, Bifrost, Parallel, ChainX, and more.
>
> CosmosSDK: CosmosHub, IRISnet, Secret Network, Kava, Band Protocol, and more.
>
> Mainstream: Bitcoin, Solana, Arweave, Filecoin, Flow, Tron, Near, and more.

## Analysis 

- The app supports multiple blockchains
- The default BTC node is a Chinese named node
- The seed phrases were provided
- There is support for segwit and taproot
- The app is self-custodial

## Reproducibility?

In MathWallet's official GitHub profile we found a repository where its Playstore app ID was referenced. [MathWallet5SDK-Android](https://github.com/mathwallet/MathWallet5SDK-Android). The repository houses MathWallet's SDK, however that's all it is. There is no source code to use it with.

MathWallet's profile houses a different repository called ["MathChain"](https://github.com/mathwallet/MathChain) which is a different project entirely.

