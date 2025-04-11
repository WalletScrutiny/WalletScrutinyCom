---
wsId: slaviWallet
title: 'Slavi: DeFi Crypto Wallet'
altTitle: 
authors:
- danny
- keraliss
users: 100000
appId: com.defiwalletmobile
appCountry: 
released: 2021-12-13
updated: 2024-06-01
version: 1.26.2
stars: 4.8
ratings: 
reviews: 133
website: https://slavi.io/
repository: https://github.com/SlvLabs/slavi-wallet
issue: https://github.com/SlvLabs/slavi-wallet/issues/8
icon: com.defiwalletmobile.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-09-12
signer: 
reviewArchive: 
twitter: slavi_io
social:
- https://t.me/SlaviDappGroup
- https://www.youtube.com/channel/UCDkImGtFxBPMUBrAik0Ka9w
- https://medium.com/@SlaviDapp
- https://discord.com/invite/cJMYhXqRhD
- https://www.instagram.com/slavi.io
redirect_from: 
developerName: Slavi Development
features: 

---

**Update 2024-09-12:**

**Review: Slavi Wallet Build**

The build process for the Slavi Wallet was initiated using the provided Dockerfile. While the Docker environment successfully cloned the repository and installed most dependencies, the build ultimately failed during the `npm install` step.

**Command Used:**
```
docker build -t slavi_wallet -f slavi.dockerfile .
```

**Error Noted:**
The build encountered an error when attempting to install npm dependencies, particularly when cloning a submodule from GitLab via SSH:
```
npm error code 128
npm error git@gitlab.com: Permission denied (publickey).
npm error fatal: Could not read from remote repository.
```
This suggests that npm was unable to clone a required Git repository due to SSH key authentication issues, despite efforts to configure npm to use HTTPS and disable strict SSL checks.

**Attempts Made:**
- Configured Git and npm to use HTTPS instead of SSH.
- Tried disabling strict SSL to allow npm installations.
- Attempted to bypass SSH authentication by setting the `GIT_ASKPASS` environment variable.

**Conclusion:**
The build for the Slavi Wallet was unsuccessful due to issues with npm install. The repository requires access to a private repo for building, which we don't have access to. Therefore, it is marked as **nosource** and the wallet remains **not verifiable** at this time.

## App Description from Google Play

> SLAVI is an all-in-one Wallet and platform with built-in cross-chain and Layer 2 solutions.
>
> It’s a new generation DeFi mobile wallet that supports 5000+ cryptocurrencies and 30+ integrated blockchains such as Binance Smart Chain, Polkadot, Polygon (Matic), Ethereum, TRON, SOLANA, AVAX, NEAR, METIS, MINA.
>
> The December Wallet version will give you the opportunity to store, send and receive tokens using multi-chain solutions based on BSC, BTC, ETH, Polygon, Litecoin, Doge, Polkadot. Also it includes cold wallet features for better protection.

## Analysis

- The first action the app needed us to take was to accept the User Agreement
- We were then asked to provide a 4-digit pin code.
- The app then generated a 12-word mnemonic
- The app generated a legacy BTC address that can send and receive.
- The providers did not claim the source was available but had a GitHub link to their organization.
- We were able to find a [repository](https://github.com/SlvLabs/slavi-wallet) for the app but it did not have releases/tags.

**Update 2024-01-09**

We tried reaching out to the [developers on GitHub](https://github.com/SlvLabs/slavi-wallet/issues/6), but they have not responded. 

The build instructions were very sparse, resulting in a lot of guess work on how the dockerfile was built. This did not result in a completed build. With no tags and releases, there is no way this app can be reproduced. This app is **non-verifiable**.
