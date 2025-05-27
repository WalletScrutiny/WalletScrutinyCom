---
title: HoyTech Defido2
appId: hoytech.defido2
authors:
- danny
released: 2020-04-29
discontinued: 
updated: 2020-07-14
version: 
binaries: 
dimensions: 
weight: 
provider: Doug Hoyte
providerWebsite: https://hoytech.com/
website: 
shop: 
country: 
price: 
repository: https://github.com/hoytech/defido2
issue: 
icon: hoytech.defido2.png
bugbounty: 
meta: stale
verdict: nobtc
appHashes: 
date: 2022-05-26
signer: 
twitter: 
social: 
features: 

---

From the GitHub [repository:](https://github.com/hoytech/defido2) 

> defido2 is a command-line contract-based Ethereum wallet intended for DeFi (decentralized finance) use-cases. The wallet's key material is stored on special-purpose tamper-resistant devices known as FIDO2 or U2F keys. All signature operations are performed on the key itself.
>
> FIDO2 keys are cheap and common, since they are being heavily promoted by Google/Twitter/GitHub/etc. for Webauth, second-factor logins. Additionally, OpenSSH now supports FIDO2 devices for password-free logins.
>
> defido2 uses libfido2, so it should support any CTAP2-capable FIDO2 device. We've tested with 2 models of YubiKey, Solo USB-C, and Solo SOMU. Solos can be purchased for $20 on their web store.

## Analysis 

The project uses Fido2 keys including the YubiKey series. This **do-it-yourself** project is **Ethereum-centric**. 

