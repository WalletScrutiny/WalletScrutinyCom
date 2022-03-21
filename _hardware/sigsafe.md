---
title: SigSafe
appId: sigsafe
authors:
- danny
released: 2014-05-14
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://bitcointalk.org/index.php?topic=610453.0
shop: 
country: 
price: 8USD
repository: 
issue: 
icon: sigsafe.png
bugbounty: 
meta: defunct
verdict: unreleased
date: 2022-02-17
signer: 
reviewArchive: 
twitter: PeterRizun
social: 

---

This device uses NFC (Near Field Communication) technology to sign bitcoin transactions. It was announced in 2014 via [bitcointalk.org](https://bitcointalk.org/index.php?topic=610453.0), although its domain is now no longer online.

Note that apart from the BitcoinTalk thread, CoinDesk, there is not much information available about the device as it presumably never made it to market.

Its [whitepaper](https://www.scribd.com/document/224366354/Sigsafe-An-electronic-key-tag-for-signing-bitcoin-transactions) details how the device works:

> A small electronic key tag for signing bitcoin transactions over a non-exploitable air gap is described. The tag communicates via a simple protocol with an NFC-enabled host, harvesting power directly from the NFC electromagnetic field and eliminating the need for a battery. After receiving a signature request from a host device, the tag checks the request against a set of rules and signs the transaction, provided none are violated. User-defined signing rules permit various levels of security from none (sign all requests), to locking the spend addresses, limiting the value of transactions, and requiring a password from the tag’s owner or cryptographic authentication from the host.

## Can the private keys be created offline?

An unlimited number of private keys can be stored on the SigSafe. ([Source](https://bitcointalk.org/index.php?topic=610453.msg6753736#msg6753736)) It would however, need a way for the user to "program" the private key into the SigSafe. 

> Private keys programmed into the tag by the user can be stored/backed-up however the user likes, so yes.

> But Key0 on each pair of sigsafe tags is not known by anyone in the world except the two tags (not even the manufacturer).  Key0 cannot be backed up, and this is why sigsafe tags would likely be purchased in pairs.  Of course, the user is not required to use Key0.  

## Are the private keys shared? 

According to Peter Rizun, even the manufacturer does not have access to this.

## Does the device display the receive address for confirmation?

No.

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

No.

## Is it reproducible?

There is no way to find out since the product **did not become commercially available** and its source code was not publicly released.


