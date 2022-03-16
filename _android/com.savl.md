---
wsId: Savl
title: "Savl Wallet Bitcoin & Solana"
altTitle: 
authors:
- danny
users: 100000
appId: com.savl
appCountry: ru
released: 2018-07-24
updated: 2022-02-18
version: "2.11.0"
stars: 4.41
ratings: 570
reviews: 192
size: 252M
website: https://savl.com
repository: 
issue: 
icon: com.savl.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-09-11
signer: 
reviewArchive:
twitter: 
social:
- https://www.facebook.com/savl.official
redirect_from:
---

> Account personalization with the ability to restore access. All the Savl wallets operations and data are protected by a unique 12-word key.

Savl provides the private keys. Found on [the official website](https://www.savl.com/access):

> IMPORTANT: Savl has no way to access users’ private keys. Private keys are only stored on the user’s device in encrypted form. If you lose access to your Savl account, the 12-word string, or private key, generated during registration will be needed to recover your account. Keep your private key in a safe place and do not share it with anyone. Savl staff will never ask for your private key.

From the Terms and Conditions, Section 3.4 Transactions via the "Wallet":

> The Wallet allows you to access your wallets within the respective Blockchains and to send Digital Assets from those wallets to other wallets within the same Blockchains. **At no point will the Company ever take custody of Digital Assets traded via the Wallet.**

We cannot find the source code for the wallet client using its Google play appID. 

Upon closer inspection of savL's [Client Agreement document](https://savl.s3.amazonaws.com/docs/terms.pdf)

> You undertake **not** to:(a)copy,redistribute,publish,reverseengineer,decompile,disassemble,modify,translateormakeany **attempt to access the source code** to create derivative works of the source code, or otherwise;

This wallet is a self custodial wallet, but without the source code for the wallet, it is **not verifiable**.



