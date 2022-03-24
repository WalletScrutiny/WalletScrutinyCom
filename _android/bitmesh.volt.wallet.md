---
wsId: VoltWallet
title: 'Volt: Bitcoin wallet&DeFi portal on BSV blockchain'
altTitle: 
authors:
- danny
users: 1000
appId: bitmesh.volt.wallet
appCountry: us
released: 2020-05-15
updated: 2022-03-15
version: 2.2.9
stars: 4.630435
ratings: 161
reviews: 26
size: 101M
website: http://www.volt.id
repository: 
issue: 
icon: bitmesh.volt.wallet.png
bugbounty: 
meta: ok
verdict: custodial
date: 2021-11-11
signer: 
reviewArchive: 
twitter: Voltfinance
social: 
redirect_from: 

---

## App Description

It advertises itself as:

> Volt is a wallet that grandma can use **by removing key management responsibility away from end users.** It is as easy to set up and use as any other apps we use daily.

Volt claims to be able to store funds securely and transfer funds easily.

It also does not provide mnemonics to users as seen in this quote below:

> Easy setup: Set up the wallet by verifying email and connect your face id without having to write down mnemonic words and worry about losing it. There is no private key upon wallet creation and nor is a full private key is formed or used during the transaction signing process. This removes single point failure problem which happens with all mnemonic words based wallets.

## The Site

> There are no private keys generated upon account creation and during all signing process.
>
> This solution provides better security and privacy compared with private key based accounts and p2sh based multisig solutions.

It also claims to restore the wallet from a lost device through facial recognition.

> You’ll never lose your assets from Volt even if your device is lost, recover by a simple scan of your face.

## The App

We tested Volt to try out its features. Email addresses must be verified via an 8-digit OTP. Users are then allowed to start by setting a local password or a FaceID or TouchID. We did not find a backup or a restore feature. And as it claimed, no mnemonics were provided.

## Verdict

Its claim to an innovative approach to wallet security by removing a single-point of failure which it describes as the seed phrase, may fall short. Many questions arise such as: where is the facial data stored? If restoring a wallet from a lost device requires the use of facial recognition, then that data must be stored somewhere else - perhaps their own servers. If that is the case, the one who controls the server containing the user's data is the **custodian**. We couldn't find their code neither on their website nor searching for their appID 'bitmesh.volt.wallet' [on GitHub](https://github.com/search?q=bitmesh.volt.wallet). This means that the app **cannot be verified**.
