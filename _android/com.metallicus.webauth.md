---
wsId: webAuthProton
title: WebAuth
altTitle: 
authors:
- danny
users: 50000
appId: com.metallicus.webauth
appCountry: 
released: 2021-12-11
updated: 2025-04-29
version: 2.1.30
stars: 4.1
ratings: 
reviews: 69
website: https://webauth.com/
repository: 
issue: 
icon: com.metallicus.webauth.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-24
signer: 
twitter: protonxpr
social:
- https://www.facebook.com/protonxpr
- https://www.reddit.com/r/ProtonChain
- https://t.me/protonxpr
- https://discord.com/invite/B2QDmgf
redirect_from: 
developerName: Metallicus Inc.
features: 

---

## Updates 2024-07-24

No changes in the availability of the source is found. This app is still **not source-available.**

## App Description from Google Play 2023-07-06

> This app allows you to participate directly in the Proton ecosystem by staking XPR, earning block rewards, voting for block producers, and so much more. Verify your identity and gain access to new features, including cryptocurrency swapping and the ability to interact with different platforms and games that run on Proton!
>
> Capable of up to 4,000 transactions per second, this wallet features no gas fees for users, free accounts, and short usernames meant to be read by humans. Your keys are always stored on your device, giving you full control over your own security. Additionally, the Proton blockchain is protected by an independent, term-limited governance council designed to ensure all chain validators meet high technical and reputational standards.

## Analysis

- We were first asked to provide a user name
- We were then given a 12-word mnemonic then asked to input a 6-digit pin code.
- We then confirmed the mnemonic and inputted our email address.
- We verified our email.
- We were then shown the main interface.
- It is possible to receive 'XBTC' which is on the [Proton](https://github.com/ProtonProtocol/) blockchain. We tried accessing BTC on the Bitcoin network, but it prompted us to verify our identity first.
- We found a [GitHub organization](https://github.com/ProtonProtocol/) with over 50 repositories.
- A GitHub [code search](https://github.com/search?q=com.metallicus.webauth&type=code) using the app ID, resulted in 3 potential repositories:
  - [Proton Web SDK](https://github.com/ProtonProtocol/proton-web-sdk/blob/6bd62116b0f24c6469d3a31a33f2f6202f83f253/packages/proton-web-sdk/src/views/Footer.svelte#L14)
  - [Proton Affiliate](https://github.com/edenia/proton-affiliate/blob/82c45bbe37a32e8e7ee8e999ee918a2dc7203fc2/webapp/src/routes/Join/index.js#L343)
  - [Proton Web SDK](https://github.com/CharlestonX-DAO/proton-web-sdk/blob/d0f44ff53898e740415eb313c00ae4a6026d4e89/packages/proton-web-sdk/src/views/Footer.svelte#L13)
- The [Terms](https://www.proton.org/terms/) has a very "mild" termination clause. It only describes the termination of the user's license to use the app.
- Despite having several repositories in its GitHub organization account, we were not able to find the Android app's possible repository. Leading us to the conclusion that this app is **not source-available**.
