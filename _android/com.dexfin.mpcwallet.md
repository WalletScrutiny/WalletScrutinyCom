---
wsId: dexfinWallet
title: Dexfin Wallet
altTitle: 
authors:
- danny
users: 10000
appId: com.dexfin.mpcwallet
appCountry: 
released: 2023-02-01
updated: 2023-02-01
version: 0.2.7
stars: 
ratings: 
reviews: 
website: https://www.dexfin.com
repository: 
issue: 
icon: com.dexfin.mpcwallet.png
bugbounty: 
meta: removed
verdict: nosource
appHashes: 
date: 2025-01-09
signer: 
twitter: https://twitter.com/dexfinexchange
social:
- https://www.linkedin.com/company/dexfin
- https://www.facebook.com/dexfincom
- https://www.instagram.com/dexfinplatform
- https://t.me/dexfinhq
- https://www.youtube.com/channel/UCCheJWs3WGOFlVg7VfDl8_g
redirect_from: 
developerName: DEXFIN
features: 

---

This app is from the same [developer](https://play.google.com/store/apps/dev?id=6139388936009702585) as {% include walletLink.html wallet='android/com.dexfin.dexfin' verdict='true' %}

- One core distinguishing factor is that this app supports NFTs.
- The other app supports staking.
- Both can be linked to their exchange.

## App Description from Google Play

> Dexfin Wallet - Bitcoin & Multi-chain Wallet
>
> Dexfin Wallet, a self-custodial and secure wallet solution for managing your digital assets.
>
> With keyless security, anonymous biometric backup, and multichain functionality, you can store, send, receive and swap your digital assets with ease. Access decentralized applications (DApps) and non-fungible tokens (NFTs) all with one secure and easy to use wallet.

## Analysis 

- Registration entailed providing an email address. 
- Once verified, we entered a 6-digit passcode. 
- No seed phrases were provided during wallet creation. 
- A Bech32 BTC address was provided which can send/receive. 
- Under 'settings' and 'account recovery', one of the options is to generate a paper backup. This involves the generation of a QR code which can later be printed on a piece of paper or stored in the phone's gallery. There is no mention of keys, which we can refer back in the app description from Google Play as their 'keyless security'.
- There are [0 results](https://github.com/search?q=com.dexfin.mpcwallet&type=repositories) when we searched for the app Id in GitHub code.
- Which puts us in a quandary once again. If the app is "keyless", how can it be self or non-custodial? What is the QR code? How is it generated? More importantly, who holds the private keys to the bitcoin wallet? We asked these on [twitter.](https://twitter.com/BitcoinWalletz/status/1684848394446200832)
- If the private keys are not provided to the user, then who holds the private keys? The following assumptions are mutually exclusive: 

	1. The provider has a copy of the private keys: Shared custody would result in plausible deniability if funds moved and it would be against the claims of being non-custodial.
	2. The provider has no copy of the private keys: How can you recover if the provider disappeared and the app stopped working?
- If we go down the non-custodial assumption as they claim, this still leads us to conclude that this app is **not source-available**.
