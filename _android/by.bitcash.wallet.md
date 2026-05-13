---
wsId: bybitCashWallet
title: Bitcash Сrypto Bitcoin Wallet
altTitle: 
authors:
- danny
users: 10000
appId: by.bitcash.wallet
alternativeStores: 
appCountry: 
released: 
updated: 2026-04-17
version: 1.1.0
reviews: 
website: https://wbitcash.com/
repository: 
icon: by.bitcash.wallet.png
bugbounty: 
meta: ok
verdict: custodial
date: 2025-11-11
signer: 
twitter: 
social: 
redirect_from: 
developerName: LLC BITCASH
builds: 
features: 

---

## App Description

Quoted from Google Play:

> Bitcash is a crypto service that allows you to easily and safely buy, store, and send crypto
>
> Bitcash crypto service, based on anonymous biometrics, allows you to manage digital assets without a Private Key
> - nobody has access to the funds except you
> - even if you lose all credentials you can recover your wallet using your face

They claim to allow users to buy, send and hold bitcoin:

> - instantly send Bitcoin and another crypto to any wallet around the world

## Analysis

This app is georestricted, thus we were not able to test it.

Their app has some statements that cast some aspersions about how they treat user-funds. They mention:

> ...allows you to manage digital assets without a Private Key

In the **[Non-Custodial Wallet](https://wbitcash.com/services/nekastodialnyij-koshelek)** section of their website: 

(translated via their site's translation service)

> Our Multi-Party computation protocol eliminates the need for private keys and removes a single point of failure. The private key is replaced by a set of secrets, the first is stored on the mobile device, the second in the protected area of the service. 

In the section called "[Storage of Crypto Assets and Simple Exchange](https://wbitcash.com/services/storage-of-crypto-assets)"

> After verification, each of our clients has the opportunity to make exchange transactions at favorable rates through an affiliate service Whitebird.io

In their [biometric backup](https://wbitcash.com/services/biotmetric-backup) section:

> Neural network\
> 1 Converts the face into an anonymous biometric code and encrypts the secret from the wallet. 
>
> 2 Check for liveliness\
> The user is asked to perform dynamic tasks to determine whether it is a real user or a photo.
>
> 3 Face access\
> The neural network decrypts the secret when the user provides his biometric data

Bitcash claims to operate "without a private key," using a Multi-Party Computation protocol where "the first secret is stored on the mobile device, the second in the protected area of the service." [Source](wbitcash.com/services/nekastodialnyij-koshelek)

In this MPC setup, Bitcash holds one of the two key shares required to authorize transactions. While they likely cannot unilaterally steal funds (they need the user's share), they retain veto power over all transactions. If Bitcash's service refuses to provide their signature share, users cannot move their funds.

From WalletScrutiny's [custodial verdict definition](https://walletscrutiny.com/verdicts/custodial#deadLink):
> A custodial service is a service where the funds are held by a third party like the provider. The custodial service can at any point steal all the funds of all the users at their discretion.

While Bitcash cannot steal funds outright, their ability to block transactions gives them control equivalent to custody in practice - users cannot access their funds without the provider's cooperation. Recovery through facial recognition, where the service decrypts the second key share, further confirms provider involvement in the signing process.

This is a **custodial** service.