---
wsId: OWNR
title: "OWNR Bitcoin wallet and Visa card. Blockchain, BTC"
altTitle: 
authors:
- leo
users: 50000
appId: com.ownrwallet.wallet
launchDate: 
latestUpdate: 2021-06-04
apkVersionName: "1.13.0"
stars: 4.9
ratings: 1039
reviews: 927
size: 58M
website: https://ownrwallet.com
repository: 
issue: 
icon: com.ownrwallet.wallet.png
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-05-31
reviewStale: true
signer: 
reviewArchive:
- date: 2020-12-01
  version: "1.10.1"
  apkHash: 
  gitRevision: 8af53e3cbda241989d723aaebf71781579e70c3b
  verdict: custodial

providerTwitter: ownrwallet
providerLinkedIn: 
providerFacebook: ownrwallet
providerReddit: ownrwallet

redirect_from:
  - /com.ownrwallet.wallet/
---


So this app claims to be a partner of Bitfinex, one of the biggest exchanges:

> OWNR is an official partner of Bitfinex.

which surprised us as Bitfinex has
[their own app](https://www.bitfinex.com/mobile-trading/).

We asked them in [this tweet](https://twitter.com/LeoWandersleb/status/1333912501378048002) and in the replies we indeed get a pointer to
[this post](https://www.bitfinex.com/posts/558) which convinces us that this app
indeed is endorsed by Bitfinex. (If you have a better link, we would happily
add it if it explains why they have two wallets.)

Maybe this is the non-custodial one?

> - Restore HD-wallets with any seed phrase length (12/15/18/21/24 words)  
> - Only you sign the transactions and own your keys – we do no store them on
    our servers
> - Your seed phrase is stored on your device only

They certainly do claim to be non-custodial but as we can't find any source
code, we remain with a verdict of **not verifiable**.
