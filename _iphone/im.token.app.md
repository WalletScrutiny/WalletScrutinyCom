---
wsId: imToken
title: imToken - BTC ＆ ETH Wallet
altTitle: 
authors:
- leo
appId: im.token.app
appCountry: 
idd: 1384798940
released: 2018-06-07
updated: 2022-03-21
version: 2.9.11
stars: 4.3
reviews: 445
size: '145456128'
website: https://token.im
repository: 
issue: https://github.com/consenlabs/token-core/issues/97
icon: im.token.app.jpg
bugbounty: 
meta: ok
verdict: nosource
date: 2021-05-02
signer: 
reviewArchive: 
twitter: imTokenOfficial
social: 

---

In the description we read:

> imToken is a feature-rich digital wallet to securely manage BTC, ETH, ATOM,
  EOS, TRX, CKB, BCH, LTC, KSM, DOT, FIL, XTZ and other digital assets. It
  enables decentralized value exchange and DApp browsing in one place.

"securely manage BTC". Ok, so it is a BTC wallet but is it self-custodial?

> **Carefully Guarding Your Assets**<br>
  Build a comprehensive risk control system to ensure the security of wallets.
  Support hardware wallets & cold wallets to prevent private keys from
  contacting the network and reduce the risk of theft.

This certainly implies to be self-custodial but there being something supported
doesn't mean that the default isn't them holding the keys. So hardware wallets
are supported but where are the keys stored if I use this wallet without a
hardware wallet?

Their website is not much more helpful:

> **Digital assets under your control**<br>
  imToken is an easy and secure digital wallet trusted by millions

again is implied self-custody but not really stated.

From
[their FAQ](https://token.im/hc/en/articles/360035109014-How-to-backup-the-mnemonic-):

> **How to backup the mnemonic?**<br>
> Whoever has the Mnemonic is able to use your wallet. So, be sure to do the
> following two things:
> 
> * Backup your Mnemonic,
> * Keep the Mnemonic safe 
> 
> Please note:
> 
> 1. Once the Mnemonic is lost, no one can retrieve it
> 1. Do not tell the Mnemonic to anyone, so as to avoid irreparable damage
> 
> Backup Mnemonic steps:
> 
> 1. Accurately transcribe 12 words in the displayed order
> 1. Confirm the Mnemonic, to ensure that the word transcript in step 1 is
>    correct, and the sorting is accurate
> 1. Backup complete

So the user does have access to the private keys but strictly speaking there is
no claim that they don't have a copy.

Finally on [their official Twitter account](https://twitter.com/imTokenOfficial)
there is a clear statement in the account's bio:

> Self-Custodial Crypto Wallet Since 2016.

I hope they make this claim a bit more prominent in the app's description and on
the website and asked for that in
[this tweet](https://twitter.com/LeoWandersleb/status/1388699561355616256).

Assuming self-custody, the next question is: Is it open source? Again, there is
no such claim in the description or the website but there is a link to
[their GitHub](https://github.com/consenlabs). On their GitHub though there is
[only one mention of their applicationId](https://github.com/search?q=org%3Aconsenlabs+%22im%5C.token%5C.app%22+is%3Aissue&type=issues)
in an issue opened by our contributor [Emanuel](/authors/emanuel). It's
[issue 97](https://github.com/consenlabs/token-core/issues/97) asking:

> Where is the latest source-code for im.token.app?

So for now we conclude this app is closed source and therefore
**not verifiable**.
