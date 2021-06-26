---
wsId: ZenGo
title: "ZenGo: Crypto & Bitcoin Wallet"
altTitle: 
authors:
- leo
appId: kzencorp.mobile.ios
appCountry: 
idd: 1440147115
released: 2019-06-07
updated: 2021-06-22
version: "2.24.0"
stars: 4.59454
reviews: 1428
size: 71444480
website: https://www.zengo.com
repository: 
issue: 
icon: kzencorp.mobile.ios.jpg
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-04-27
reviewStale: true
signer: 
reviewArchive:


providerTwitter: zengo
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---

On their website we find:

> **Backing up your wallet is just as simple.** An encrypted copy of your device
  share is stored on the ZenGo server, and the decryption code is stored
  separately in your personal iCloud (iOS) or Google (Android) account. Only
  with your 3D biometric face map can you access the encrypted share. 

Does that mean that with a photo of you (and probably without) a google engineer
can access your backup? That's a bit scary.

So they claim it is non-custodial but do they share the source code? On that,
they link to
[this blog post](https://medium.com/zengo/zengo-and-open-source-5d0df5c07abf)
where they conclude:

> As open-sourcing our code is a step we cannot take back, we prefer to take a
  cautious approach to it. We already released some portions of our code and
  intend to gradually release more and more of our software as open source as we
  gain more confidence in out process and more momentum within the community.

... but for audits, it doesn't need to be "Open Source" in the sense of this
quote. It can just be public code. For audits only.

Their decision to not be transparent earns them the verdict **not verifiable**.
