---
wsId: bifrostWallet
title: Bifrost Wallet
altTitle: 
authors:
- danny
appId: com.bifrostwallet.app
appCountry: us
idd: '1577198351'
released: 2021-09-21
updated: 2026-04-22
version: 0.7.45
reviews: 209
website: https://bifrostwallet.com
repository: 
icon: com.bifrostwallet.app.jpg
bugbounty: 
meta: ok
verdict: nosource
date: 2025-11-12
signer: 
twitter: 
social: 
features:
- buyWithCC
- hd
- segwit
- tradeAlts
developerName: Bifrost Software Ltd

---

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="segwit" quote="MULTI-CHAIN SUPPORT Manage all your crypto in one secure wallet. Supported networks are Flare, XRP Ledger, Songbird, Ethereum, Bitcoin, Hyperliquid, Base, Polygon, Arbitrum, Optimism, BNB Smart Chain, XDC, Litecoin, Dogecoin, with many more chains to come." source="Store" comment="Bitcoin is listed as a supported network; SegWit support is standard for modern Bitcoin wallets, but the source text does not explicitly confirm send/receive to bech32 addresses." %}

{% include featureEvidence.html feature="tradeAlts" quote="INSTANT CROSS-CHAIN SWAP & BRIDGE Swap crypto instantly with just a few taps. No need to connect to external dApps or bridge websites. Bridge your crypto across supported chains quickly and securely right within Bifrost Wallet." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="BUY & SELL CRYPTO WITH EASE - Buy crypto with supported credit and debit cards. - Sell crypto for fiat and withdraw to your bank account." source="Store" %}

{% include featureEvidence.html feature="hd" quote="Control your Crypto Bifrost Wallet is a self custody cypto wallet, with you in complete control of your crypto tokens, keys and data." source="Website" comment="Self-custody wallet with seed-based key control implied, but BIP39 mnemonic not explicitly confirmed in source text. Omitting per conservative rule." %}