---
wsId: mpcvaultMultisig
title: MPCVault - Multisig Wallet
altTitle: 
authors:
- danny
users: 5000
appId: com.mpcvault.mobileapp.android
appCountry: 
released: 2022-09-13
updated: 2026-02-02
version: 3.6.0
reviews: 3
website: https://mpcvault.com/
repository: 
issue: 
icon: com.mpcvault.mobileapp.android.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-11-20
signer: 
twitter: mpcvault
social:
- https://www.linkedin.com/company/mpcvault
redirect_from: 
developerName: MetaLoop Inc
builds: 
features: 

---

## App Description

MPCVault is a multi-chain, multi-asset wallet with multi-signature capabilities developed by MetaLoop Inc. The wallet supports multiple blockchains including Bitcoin.

According to the company's user agreement, **"MPCVault does not take custody of Virtual Currency"** and **"does not have total independent control over funds at a user's wallet"**. Users are responsible for storing backups of their wallet addresses and private key pairs.

The wallet's source code is not publicly available. The company maintains a GitHub organization (github.com/mpcvault) with API documentation but no mobile application source code.

## Analysis

MPCVault operates a 3-of-3 multi-party computation (MPC) architecture where the user holds one key share and MPCVault holds two key shares, requiring all three shares for transaction signing. Regular users cannot export their key shares or achieve independent custody; the 12-word "personal key certificate" provided during setup is used for app authentication and cannot recover funds independently. [Source](https://docs.mpcvault.com/techoverview)

Only business and enterprise customers on annual plans can [request a key share backup](https://docs.mpcvault.com/sharesexport/) that provides **"a copy of all your wallet's private keys and have full control over your funds"**.

From the [technical overview](https://docs.mpcvault.com/techoverview/):

> MPCVault operates with three rotating key shares: User holds 1 key share, MPCVault holds 2 key shares (stored in different cloud environments with encrypted backups worldwide). All three key shares are required for signing.

According to WalletScrutiny's custodial verdict criteria, products that "claim to be non-custodial but feature custodial accounts without very clearly marking those as custodial are also considered 'custodial' as a whole". Regular MPCVault users cannot achieve self-custody as they cannot export their keys or spend funds independently without MPCVault's cooperation, meeting the definition of custodial despite the company's claims of being "non-custodial".

[Video of our testing](https://x.com/BitcoinWalletz/status/1991342692748652743). The 12 words were not called seed phrases, but *"personal key certificates"*. The Bitcoin wallet address that the app provided to us was `3CmMZyfdc3LBLsQcM1NqzE6vQFLC8Fm6it`. We tried to import the 12-words to Electrum, but the addresses did not match. 



**Conclusion**: While MPCVault markets itself as non-custodial and enterprise users can eventually export keys, the default experience for regular users is functionally **custodial** - they cannot spend or recover funds without the provider's cooperation.
