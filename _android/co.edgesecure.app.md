---
title: "Edge - Bitcoin, Ethereum, Monero, Ripple Wallet"
altTitle: 

users: 100000
appId: co.edgesecure.app
launchDate: 2018-03-01
latestUpdate: 2021-01-03
apkVersionName: "1.19.1"
stars: 4.0
ratings: 2040
reviews: 1144
size: 36M
website: https://edge.app
repository: https://github.com/EdgeApp/edge-react-gui
issue: https://github.com/EdgeApp/edge-react-gui/issues/1748
icon: co.edgesecure.app.jpg
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2019-11-10
reviewStale: true
signer: 
reviewArchive:


providerTwitter: edgewallet
providerLinkedIn: company/3609678
providerFacebook: 
providerReddit: 

redirect_from:
  - /edge/
  - /co.edgesecure.app/
  - /posts/2019/11/edge/
  - /posts/co.edgesecure.app/
---


Edge - Bitcoin, Ethereum, Monero, Ripple Wallet
is the successor of [Airbitz](/airbitz/) and claims to be *non-custodial* and
*open source*.

The Playstore description points to [this link](https://github.com/Airbitz) as
their open source, where we are greeted with **"This organization has no public
repositories."**. Not good. But ... above we find `*** WE'VE MOVED. See
github.com/EdgeApp ***` and sure enough,
[this](https://github.com/EdgeApp/edge-react-gui) looks better.

So here we have to give up for now. We cannot find any claim of verifiability of
the builds but worse, the wording of the build
[Requirements](https://github.com/EdgeApp/edge-react-gui#requirements) doesn't
sound as if it was well established what was needed to successfully build the
wallet at all.

> Edge is known to build with this exact tool set. Updated versions of these toolsets may break the build or app. If you have issues, try mirroring these exact versions.

Android Studio 3.1.3 is a requirement? Version 3.5.1 being the current version I
would not be too happy to down-grade but for our standards of verification being
easy, we would probably require the verification to be possible to automate
meaning to at least work head-less in a docker container for example. A Docker
container would allow to define all the versions nicely and we hope the wallet
will provide such verification support soon.

Lastly the app can currently not be verified because the playstore version
`1.10.1` is ahead of the latest tag
[published on GitHub](https://github.com/EdgeApp/edge-react-gui/tags) being
`1.9.8`.


Verdict
=======

This wallet is currently **not verifiable**.
