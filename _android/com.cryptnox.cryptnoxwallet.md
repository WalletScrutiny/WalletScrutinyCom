---
wsId: cryptnoxCompanion
title: 'Cryptnox: Your Web3 Wallet'
altTitle: 
authors:
- danny
users: 1000
appId: com.cryptnox.cryptnoxwallet
appCountry: 
released: 2023-09-29
updated: 2025-12-09
version: 2.9.13
stars: 
ratings: 
reviews: 
website: https://cryptnox.com/
repository: 
issue: 
icon: com.cryptnox.cryptnoxwallet.png
bugbounty: 
meta: ok
verdict: nowallet
appHashes: 
date: 2025-08-29
signer: 
twitter: CryptnoxTech
social:
- https://github.com/Cryptnox-Software
- https://www.linkedin.com/company/cryptnox/
redirect_from: 
developerName: Cryptnox SA
builds: 
features: 

---

[Here's the tutorial](https://www.youtube.com/watch?v=w8YKHFijllk) on how to initialize the CryptNox hardware wallet on the companion app.

This is the companion app to the {% include walletLink.html wallet='hardware/cryptnox.bg1card' verdict='true' %} hardware wallet. As such, it depends on the user having the correct card so that it can process and make transactions. The private key is not "stored" on the app itself.

## App Description

Cryptnox Wallet is a companion application that manages Cryptnox NFC smartcards through NFC technology for secure connection and interaction. The app provides control over the Cryptnox card including seed injection, backup, and recovery processes, but cannot function independently without the physical hardware card. All critical wallet operations depend on the NFC smartcard rather than the mobile application itself.

## Analysis

**1. Is it a wallet?**
No. The app is a companion interface that requires a separate Cryptnox NFC smartcard to function. *"The Cryptnox Wallet app is your ultimate tool for securely managing Crypto Hardware Wallet smartcards"*.

**2. Is it for bitcoins?**
Yes, when paired with the Cryptnox card, it supports Bitcoin and other cryptocurrencies.

**3. Ability to send & receive**
Only when connected to the Cryptnox NFC smartcard. The app cannot send or receive Bitcoin independently as it relies on the card to authorize and sign transactions.

**4. Key custody**
The private keys are stored on the Cryptnox NFC smartcard, not in the mobile app. *"This hardware wallet app offers complete control over your Cryptnox card, including word seed injection, backup, and recovery processes"*.

## Conclusion

Cryptnox Wallet is not a standalone Bitcoin wallet but a companion app that requires a separate Cryptnox NFC smartcard to function. The app cannot generate seed phrases, store private keys, or process transactions without the physical hardware card. Since key management and storage occur in the NFC card rather than the companion app, this does **not qualify as a wallet application**.
