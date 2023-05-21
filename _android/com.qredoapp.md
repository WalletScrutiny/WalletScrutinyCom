---
wsId: qredoNetwork
title: 'Qredo: Signing App'
altTitle: 
authors:
- danny
users: 10000
appId: com.qredoapp
appCountry: 
released: 2020-09-24
updated: 2023-05-17
version: v1.1.3
stars: 
ratings: 
reviews: 
size: 
website: https://www.qredo.com
repository: 
issue: 
icon: com.qredoapp.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2023-04-11
signer: 
reviewArchive: 
twitter: QredoNetwork
social:
- https://www.linkedin.com/company/qredo/
redirect_from: 
features: 

---

## App Description from [Google Play](https://play.google.com/store/apps/details?id=com.qredoapp) 

> The Qredo Signing App enables the secure authorization and approval of transactions on the Qredo Network.
>
> The Qredo Network is the world’s first decentralized multi-party computation solution for digital assets.
> 
> It provides a secure Layer 2 peer-to-peer trading network that:
> - facilitates instant cross-chain atomic swaps
> - provides institutional-grade security and decentralized custody

*Supported Assets* include Bitcoin

### Terms of Service 

#### Termination (Available in PDF when user is filling up registration)

> 4.5 We may, in our sole discretion, refuse to open an Account for you, or suspend or terminate any Accounts (including but not limited to duplicate accounts) or suspend or terminate the activities under your Account.

## Analysis 

Analyzing this wallet put us in a short conundrum. Most of the initial actions transpire in the web app counterpart for this app. This app has to be paired to the website similar to pairing a hardware device to a mobile app. Absent this pairing, there's very little the app could actually do to let the user access his account. 

[(Screenshots)](https://twitter.com/BitcoinWalletz/status/1645682542656516097)

### ["Decentralized Custody"](https://qredo.zendesk.com/hc/en-us/articles/4407948097169-What-is-Decentralized-Custody-)

What further gave us difficulty in assigning a verdict for this app is that, it believes in "decentralized custody". This is described as: 

> Qredo Network introduces a new paradigm - decentralized custody for digital assets
>
> The Qredo Wallet allows secure crypto asset custody, unique to other solutions available today that are either vulnerable to theft or slow to transact with.
> 
> Decentralized custody is a new category of custody made possible by a new innovation, a consensus driven MPC network. The network decentralizes private keys for assets secured over a layer 2 network.
>
> This allows for Fast and secure movement of digital assets with other trusted parties across the network. Governance and control of assets secured on the network, enabling easy transfer of ownership of digital assets and shielding users from theft or malicious actions.  

### Withdrawal 

The user can create a wallet address on another app and then input this address on the Qredo web app. This then, must be authorized from the mobile app to commence. 

### Deposit 

Can the user create a BTC wallet address on Qredo for Deposit? Yes. This is done solely through the web interface and not on the mobile app itself. 

## Verdict   

It was difficult to come up with a verdict for this app because of its complex dynamics. But if we break it down to its component parts and functionalities, we believe that it is possible. 

1. The app by itself, and without the help of its web counterpart, will not be able to generate its own Bitcoin public and private key pair. 

2. Any user, for example, who downloads this app, with the intention to deposit Bitcoin would have to sign up and register to the service found on the webiste qredo.network. 

3. The app can sign or "approve" withdrawals - to its supported cryptocurrency wallet addresses.  

4. As the app name implies, we **do not think this app is a wallet** at all. Absent the web service, it would be quite useless for that particular purpose. 