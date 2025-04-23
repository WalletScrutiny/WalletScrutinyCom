---
title: WX.Network
appId: wxnetwork
authors:
- danny
released: 2023-01-01
discontinued: 
updated: 2025-01-01
version: 2.3.38
binaries: 
provider: WX Network
providerWebsite: https://wx.network
website: https://wx.network
repository: 
issue: 
icon: wxnetwork.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-04-02
reviewArchive: 
twitter: wx_network
social: 
features: 

---

## App Description

WX.Network is a platform built on the Waves blockchain that offers self-custody cryptocurrency services through smart contracts. The application claims to provide decentralized trading, multi-chain compatibility, and community governance features. It supports deposits and withdrawals from multiple chains including Ethereum, Binance Smart Chain, and Polygon through gateway services that create tokenized versions of external assets on the Waves blockchain.

Users can create an account via email, hardware device, or seed phrase. According to the FAQ: (Visible on the app itself)

> **What is the difference between registering with email and registering with seed, private key or Keystore File?**

> By registering using email, you can access your account from any browser on any device, simply by specifying this email as a login and specifying your password.
>
> In the case of registration using Seed, private key, or Keystore File, registration occurs only for this device and only for this browser. As a result, you will be forced to create a password and import your account every time you clear your cache or use a new device or browser. We do not recommend using this method, as every time you provide your seed, private key, or Keystore File, they can be intercepted.

## Analysis

WX.Network serves as the successor to the defunct Waves Decentralized Exchange ({% include walletLink.html wallet='desktop/wavesdex' verdict='true' %}). The original Waves.Exchange website now redirects to WX.Network, with a migration notice instructing users to transfer their accounts. We verified the existence of a desktop client by downloading a .deb package from the official WX.Network domain.

A critical distinction between WX.Network and its predecessor is the absence of a public code repository. While the original Waves.Exchange maintained open-source code on GitHub (github.com/wavesplatform/WavesGUI), the WX.Network application's codebase is not publicly accessible. This represents a significant regression in transparency from the original platform.

Our technical examination of the WX.Network desktop client revealed that the various Bitcoin (BTC) assets displayed with different symbols (such as BTC|) are not actual Bitcoin blockchain assets but rather tokenized representations on the Waves blockchain. These tokens are created through gateway services that lock the original assets on their native blockchains and mint corresponding tokens on Waves. This approach means users are not directly interacting with the Bitcoin network but instead with Waves-based representations of BTC, introducing additional counterparty risks related to the gateway operators and smart contracts managing these tokenized assets.

The documentation can be quite confusing, as it seems to support Bitcoin deposits. However, when we tested this, all the bitcoin (variants) seemed to be on the Waves Network. We recorded a video and [posted it on twitter](https://x.com/BitcoinWalletz/status/1907388783885951461). Since, we've found some documentation which seems to support Bitcoin - we'll assume that it does. 

So it's self-custodial, but falls short because of the unavailability of its source code.

Without source code access, independent verification of the application's security model, private key management, and overall functionality is impossible. We cannot determine if the wallet is truly non-custodial or how it implements cryptographic operations. Due to this lack of code transparency, we classify WX.Network as a **work-in-progress**
