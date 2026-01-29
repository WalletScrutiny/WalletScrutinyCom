---
wsId: 
title: FRWT Secure DeFi Crypto Wallet
altTitle: 
authors:
- danny
users: 10000
appId: app.frwt.wallet
appCountry: 
released: 2024-01-03
updated: 2026-01-20
version: 1.14.0
stars: 4.8
ratings: 
reviews: 185
website: https://www.frwt.app/
repository: 
issue: 
icon: app.frwt.wallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-11-11
signer: 
twitter: FRWTwallet
social:
- https://www.facebook.com/app.frwt
- https://www.reddit.com/r/FRWT
- https://t.me/frwt_app
redirect_from: 
developerName: FRWLT LLC - Non-Custodial Wallet
builds: 
features: 

---

## App Description

FRWT Secure DeFi Crypto Wallet is a self-custodial wallet that allows users to manage multiple cryptocurrencies on Android devices.

## Analysis 

We tested the app and generated a 15-word mnemonic. There is BTC support. We did not find any claims regarding source-availability. A search on github for its android app ID, did [not yield any results.](https://github.com/search?q=%22app.frwt.wallet%22&type=code)

This app is **not source-available**.

## Further Testing for BIP39 Compatibility

FRWT BIP39 Compatibility Test Summary

Test performed: 2025-11-17

What was done:
1. Generated a 15-word mnemonic in FRWT Secure DeFi Crypto Wallet (v1.11.0) on Android
2. Noted the first BTC receiving address (Native SegWit: bc1qx2wvxpy...thwn2k)
3. Imported the 15-word seed into Electrum Desktop (AppImage) using BIP39 import mode
4. Used derivation path m/84'/0'/0' (Native SegWit standard)
5. Verified addresses matched between FRWT and Electrum

Result: ✓ Successfully imported. The 15-word mnemonic is standard BIP39-compliant with 160-bit
entropy. Electrum correctly restored the wallet with matching bc1... addresses.

**Electrum Warning (during import):**
```
BIP39 seeds can be imported in Electrum, so that users can access funds locked in other 
wallets. However, we do not generate BIP39 seeds, because they do not meet our safety standard.
BIP39 seeds do not include a version number, which compromises compatibility with future 
software. We do not guarantee that BIP39 imports will always be supported in Electrum.
```

**Conclusion:** FRWT uses valid BIP39 15-word mnemonics (rare but standardized). The backup is
interoperable with other BIP39-compatible wallets, though Electrum's warning indicates they
prefer their own seed format for forward compatibility reasons.
