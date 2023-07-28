---
wsId: dexfinWallet
title: Dexfin Wallet
altTitle: 
authors:
- danny
users: 5000
appId: com.dexfin.mpcwallet
appCountry: 
released: 2023-02-01
updated: 2023-02-01
version: 0.2.7
stars: 
ratings: 
reviews: 
size: 
website: https://www.dexfin.com
repository: 
issue: 
icon: com.dexfin.mpcwallet.png
bugbounty: 
meta: ok
verdict: nosource
date: 2023-07-28
signer: 
reviewArchive: 
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
- If the private keys are not provided to the user, then who holds the private keys? Two assumptions can be made: 

	1. The provider has a copy of the private keys.
	2. The provider has no copy of the private keys.

- Number 1 needs proof. Number 2, cannot be proven except by provable cooperation of the provider.
- If we go down the non-custodial assumption as they claim, this still leads us to conclude that this app is **not source-available**.
