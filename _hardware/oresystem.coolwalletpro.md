---
title: Ore System CoolWallet Pro
appId: oresystem.coolwalletpro
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 86
- 54
- 0.8
weight: 6
provider: ORE System
providerWebsite: 
website: https://ore-system.com/
shop: https://ore-system.com/product/ore-system-coolwallet-pro/
country: US
price: 149USD
repository: 
issue: 
icon: oresystem.coolwalletpro.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-05-18
signer: 
reviewArchive: 
twitter: ORESystemNFT
social:
- https://www.facebook.com/oresystem/

---

## Background Information 

> The ORE System is a next-generation block-chain technology that creates value for content-creators, collectors, and studios. 
>
> ORE System specializes in blockchain enabled gaming and integration. The ORE System is a single ecoverse including The ORE Token, The ORE SDK, The ORE Forge and The ORE Stealth.

The ORE System card is a co-branding effort with:

- {% include walletLink.html wallet='hardware/coolwalletpro' verdict='true' %} 

Interested users can find more information about their co-branding partnership on this [page](https://www.coolwallet.io/cobranded_card_partnership/).  

## Product Description 

As a co-branded device with {% include walletLink.html wallet='hardware/coolwalletpro' %}, we believe that it possesses the same characteristics - including the price. 

> - Encrypted Bluetooth connection for Android and iOS
- EAL 6+ certified Secure Element
- DeFi, Dapp and NFT (e.g. Rarible, Opensea) In-app Integration Coming Soon
- Multi-cryptocurrency Support
- Trading features
- Staking
- Tron (TRX), Cosmos (ATOM), PolkaDot (DOT), BEP20 Token- BNB, BEP20 Official and Customized Tokens, TRC20 Tokens – USDT / USDJ / JUST / WBTT / WIN & All Other TRC20 Tokens
- Bitcoin Specification Supported
- Bitcoin algorithm: Support transaction signing algorithm ECDSA with specified elliptic curve secp256k1
- BIP-32 : BIP-32 HD Wallets
- BIP-44 : BIP-44 Support multiple coin type and accounts. Each account includes up to 232 external and
internal Bitcoin transaction addresses
- Seed Generation
- Generate seed directly from the CoolWallet Pro (recommended) or via the CoolBitX Crypto App.
   

## Analysis 

The unboxing video from ORE System shows a CoolWallet Pro box. But the card inside shows the branding of the ORE System. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/vfyM-GiqHLk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As indicated in the {% include walletLink.html wallet='hardware/coolwalletpro' verdict='true' %} review, the firmware is not publicly available. 

We'd like to add that the device pairs with a mobile app. We've asked ORE System via Telegram whether their device pairs with the following apps or if they have their own: 

* Android {% include walletLink.html wallet='android/com.coolbitx.cwsapp' %}
* iPhone {% include walletLink.html wallet='iphone/com.coolbitx.coolwallets' %}

CoolBitX (the manufacturer of the CoolWalletPro) disclosed in December 18, 2020, that the device has a [vulnerability](https://www.coolwallet.io/bluetooth-security-vulnerability-seed-replay-attack/) related to its Bluetooth pairing. The vulnerability exists given the following conditions: 

> 1. If a user uses the basic wallet creation and wallet recovery functions through an outdated app version.
> 2. If a malicious actor is physically within 30 meters of you and your CoolWallet at that time.
> 3. If the bad actor has prepared a second CoolWallet to intercept private information. 

This has since been patched. The url for this article describes this as a "Seed Replay Attack", which can only be executed provided the 3 conditions above are met. 

While the [Javascript SDK](https://github.com/CoolBitX-Technology/coolwallet-sdk) for the CoolWallet Pro is available on their GitHub repositories, we were not able to find the firmware's repository. 