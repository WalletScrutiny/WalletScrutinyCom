---
wsId: spatium
title: Spatium Keyless Bitcoin Wallet
altTitle: 
authors:
- danny
- leo
users: 1000
appId: capital.spatium.wallet
appCountry: us
released: 2018-08-31
updated: 2022-03-16
version: 3.0.66.1
stars: 
ratings: 
reviews: 
size: 36M
website: https://spatium.net/
repository: 
issue: 
icon: capital.spatium.wallet.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-11-17
signer: 
reviewArchive: 
twitter: spatium_news
social:
- https://www.linkedin.com/company/spatium-capital
- https://www.facebook.com/spatiumnews
redirect_from: 

---

## App Description

> Spatium is a unique keyless crypto wallet that allows you to easily and safely buy, store, and send crypto.
> 
> Spatium wallet, based on SMPC technology and anonymous biometrics, allows you to manage digital assets **without a Private Key**. It’s replaced with an encrypted set of secrets distributed between your device and professional security provider.

In this case this does not mean that the wallet doesn't use a private key, with their server doing so. They claim there is no private key. Period. Which of course is bogus as Bitcoin transactions need a private key to sign.

It further claims to use biometrics to allow users to recover their data. In a [Medium blogpost](https://medium.com/spatium-blog/spatium-protocol-smpc-on-your-guard-d78a243f519) they mention more details. 

The worrying part is that they use threshold signatures with secrets generated and never leaving other devices, allowing to define a threshold "k of n" of devices required to sign a transaction. Unless k=n, their (partial) custodians can collude against the user but with k=n, the user is still not in control of his funds. The custodians could extort the users: Give us half your money or we burn it all.


## The App

There is a Bitcoin wallet with a send and receive function. Backup is possible through the use of biometric data.

## [Termination Clause in User Agreement](https://spatium.net/user-agreement.html)

> Upon termination of the Agreement, your account will cease to exist (be deleted). Upon termination of this Agreement, we will cease to provide services and you will cease to have access to the Application.
>
> If you terminate the Agreement for any reason, you will not be entitled to any refund of fees for use of features of the Application (if any) or any other fees. No data from your prior Reports will ever be available to you.

## Closed Source

> reverse engineer, decompile, disassemble or otherwise attempt to extract the source code of the Software, except as expressly permitted by law in the jurisdiction in which you are located;

> rent, lease, sell, assign or otherwise transfer the rights to the Application;

## Verdict

Without the private keys, we do not consider hashed biometric data as a suitable replacement. Add to that the ability to terminate access to the application plus their unwillingness to share their source code. While this does not qualify as a self-custodial service it does not exactly look "custodial" either. 

As this app **does not have publicly available source code** it is **not verifiable.**


