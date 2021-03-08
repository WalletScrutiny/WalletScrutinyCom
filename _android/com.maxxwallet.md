---
wsId: 
title: "Bitcoin Wallet - MaxWallet"
altTitle: 
authors:
- leo
users: 10000
appId: com.maxxwallet
launchDate: 
latestUpdate: 2019-06-12
apkVersionName: "3.7.3"
stars: 3.2
ratings: 13
reviews: 10
size: 14M
website: http://bitcoinwalletcoin.com
repository: 
issue: 
icon: com.maxxwallet.png
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-12-12
reviewStale: true
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /com.maxxwallet/
---


In Google Play we read the right claims:

> Exclusive control of your wallet’s private keys.

and

> Open source

But ... this app was not updated in 18 months, has only one review which is
about lost coins and the provider did not ask to contact support but asks
details right there in public.

And that's all we can find out as the website is for sale by a Japanese
registrar. That's the same domain they provide for their contact email.

This app is **not verifiable** and **probably a scam**.

### Some more digging

So we decompiled the app using jadx and there we see it is a clone of
[BRD](/com.breadwallet/). BRD is published under the MIT license and thus
cloning is not a problem. A bit problematic might be that this wallet connects
to BRD's servers (`HOST = "api.breadwallet.com"`).

To find out what modifications this wallet did to the original, one would
probably figure out which version they cloned from, compile that BRD wallet and
compare the decompilation of both apps.
