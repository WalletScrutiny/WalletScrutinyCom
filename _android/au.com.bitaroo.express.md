---
wsId: bitarooexpress
title: Bitaroo Express - Buy Bitcoin
altTitle: 
authors:
- danny
users: 1000
appId: au.com.bitaroo.express
appCountry: 
released: 
updated: 2025-03-18
version: 2.2.4
stars: 
ratings: 
reviews: 
website: https://www.bitaroo.com.au
repository: 
issue: 
icon: au.com.bitaroo.express.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2024-09-05
signer: 
reviewArchive: 
twitter: BitarooExchange
social:
- https://www.youtube.com/@bitarooexchange
- https://www.linkedin.com/company/bitaroo/
- https://www.reddit.com/r/Bitaroo/
redirect_from: 
developerName: Bitaroo
features: 

---

## Analysis

- Supports bitcoin
- Allows for deposit/withdrawal
- Users are not in control of the private keys

## Observations

Bitaroo Express is an exchange with support for Lightning Network and on-chain transactions and it supports the buying, selling, deposit/withdraw of bitcoin. There's no mention of private keys or self custody anywhere in the description of the app. [However, this article](https://support.bitaroo.exchange/hc/en-au/articles/8633601898767-Why-did-Bitaroo-build-a-Vault) has some more information on how Bitaroo "holds" users' bitcoin.

> Users who utilise our long-term custodial services but do not engage in buying, selling, paying a BPAY bill, depositing, or withdrawing will have their coins automatically moved to the [Bitaroo Vault](https://support.bitaroo.exchange/hc/en-au/articles/7880245231759-What-is-Bitaroo-Vault).

The Bitaroo Vault mentioned here is a **custodial** storage solution. It's unlikely that this app lets the users hold their own private keys, and even less likely to be open source and available for reproducibility testing.