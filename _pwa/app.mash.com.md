---
title: Mash Wallet
appId: app.mash.com
authors:
- danny
released: 2023-08-01
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://mash.com
shop: 
country: 
price: 
repository: https://github.com/getmash/mash-js
issue:
icon: app.mash.com.png
bugbounty:
meta: ok
verdict: custodial 
date: 2023-08-02
signer: 
reviewArchive: 
twitter: getmash
social:
- https://discord.com/invite/4MeZDEZsfT
- https://www.youtube.com/@getmash
- https://t.me/mashpartners
features:
- ln
---

## App Description 

> Mash is a suite of monetization tools to grow your business. You can charge any amount, get paid fast, and easily integrate it across the web.
> 
> It supports the bitcoin-lightning network.

### [Terms of Service](https://mash.com/legal/terms-of-service-consumer/)

- Mash may disallow users from using their service.
- Mash may suspend and terminate user accounts at its sole discretion. (Sec. 12 and 13)

## Analysis 

- Once an account is created, the user may receive funds by creating a lightning invoice. 
- We were not able to find a legacy, P2SH or SegWit BTC address.
- We were not provided with the seed phrases during app initialization.
- Likewise, we found no option to back up the private keys.
- Given the reasons stated above, we find this pwa as a custodial offering and thus, **non-verifiable**.
