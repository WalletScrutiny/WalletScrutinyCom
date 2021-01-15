---
title: "ZenGo Crypto & Bitcoin Wallet: Buy, Earn & Trade"
altTitle: 

users: 50000
appId: com.zengo.wallet
launchDate: 
latestUpdate: 2020-12-17
apkVersionName: "2.19.0"
stars: 4.3
ratings: 1386
reviews: 604
size: 75M
website: https://www.zengo.com
repository: https://www.github.com/kzen-networks
issue: 
icon: com.zengo.wallet.png
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-06-20
reviewStale: true
signer: 
reviewArchive:


providerTwitter: zengo
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /com.zengo.wallet/
  - /posts/com.zengo.wallet/
---


This app claims on Google Play:

> ** Never worry about losing your private keys again **
> 
> With ZenGo’s advanced cryptography, there is no private key. Instead, the
  responsibility of signing transactions is divided between us and our
  customers, so that neither party sees the other's secret information. It also
  means that you never have to worry about managing private keys again. It makes
  ZenGo the simplest and safest crypto wallet.

which sounds scary. If you don't have to worry about private keys, who does have
them? If they lose them or go out of business, can you still use your money?

Also if they don't use established standards, can you still spend your coins if
their wallet stops working? They [claim you can](https://zengo.com/?p=1268).

> ** Stay in control **
> 
> ZenGo does not have access to your funds. All transactions happen directly on
  the blockchain. With securely encrypted biometrics and our password-free
  security, only you control your funds.

Again, "only you control your funds" sounds good but with the rest of the
comment it's a bit confusing.

On their website we find more details:

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

