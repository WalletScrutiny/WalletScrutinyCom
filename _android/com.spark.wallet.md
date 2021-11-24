---
wsId: 
title: "Spark Lightning Wallet"
altTitle: 
authors:
- leo
- danny
users: 1000
appId: com.spark.wallet
released: 2018-12-10
updated: 2021-11-08
version: "0.3.1"
stars: 4.2
ratings: 9
reviews: 3
size: 7.6M
website: https://github.com/shesek/spark-wallet
repository: 
issue: 
icon: com.spark.wallet.png
bugbounty: 
verdict: wip
date: 2021-11-11
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /com.spark.wallet/
  - /posts/com.spark.wallet/
---


<div class="alertBox"><div> ⚠️ Spark is beta-quality software under active development, please use with care.
</div> </div>
## App Description

From its GitHub page:

>Spark is a minimalistic wallet GUI for c-lightning, accessible over the web or through mobile and desktop apps (for Android, Linux, macOS and Windows). It is currently oriented for technically advanced users and is not an all-in-one package, but rather a "remote control" interface for a c-lightning node that has to be managed separately.
>
> Sparks supports sending and receiving payments, viewing history, and managing channels.
>
> Spark is a purely off-chain wallet, with no on-chain payments. This allows Spark to fully realize the awesome UX enabled by lightning, without worrying about the complications and friction of on-chain. This might change someday.
>
> Spark has a responsive UI suitable for mobile, tablet and desktop devices, but is best optimized for use on mobile.

## The App

As described above, the mobile app acts like a "remote-control interface for a c-lightning node". If a user is running his own lightning node, then the user is fully in control of his funds.

## Verdict

While managing the c-lightning server is a different aspect separate from the app, it entails self-custody. 

[Lightning has documentation](https://lightning.readthedocs.io/FAQ.html) on how to backup the wallet as described here:

### How to “backup my wallet” ?
>
> In summary: as a Bitcoin user, one may be familiar with a file or a seed (or some mnemonics) from which it can recover all its funds.
>
> C-lightning has an internal bitcoin wallet, which you can use to make “on-chain” transactions, (see withdraw. These on-chain funds are backed up via the HD wallet seed, stored in byte-form in **hsm_secret.**

As such, this is a self-custodial wallet that's due for verification. 