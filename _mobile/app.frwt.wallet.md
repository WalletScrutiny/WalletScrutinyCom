---
title: FRWT Secure DeFi Crypto Wallet
verdict: nosource
meta: ok
date: 2025-11-11
authors:
- danny
website: https://www.frwt.app/
twitter: FRWTwallet
social:
- https://www.facebook.com/app.frwt
- https://www.reddit.com/r/FRWT
- https://t.me/frwt_app
features:
- buyWithCC
- hd
- segwit
- tradeAlts
developerName: FRWLT LLC - Non-Custodial Wallet
redirect_from:
- /android/app.frwt.wallet/
android:
  appId: app.frwt.wallet
  users: 10000
  released: 2024-01-03
  updated: 2026-02-12
  version: 1.15.0
  reviews: 207
  icon: app.frwt.wallet.png

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

{% include featureEvidence.html feature="hd" quote="Generated a 15-word mnemonic in FRWT Secure DeFi Crypto Wallet (v1.11.0) on Android... The 15-word mnemonic is standard BIP39-compliant with 160-bit entropy. Electrum correctly restored the wallet with matching bc1... addresses." source="App Description" comment="BIP39 mnemonic confirmed, addresses recoverable in competitor wallet (Electrum) using standard derivation path m/84'/0'/0'" %}

{% include featureEvidence.html feature="segwit" quote="Noted the first BTC receiving address (Native SegWit: bc1qx2wvxpy...thwn2k)... Verified addresses matched between FRWT and Electrum" source="App Description" comment="Native SegWit (bech32 bc1...) receiving address confirmed in FRWT" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy cryptocurrency with your credit card on FRWT Get crypto tokens directly within the wallet app. You won't have to visit crypto exchanges or p2p platforms." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Crypto swaps Bypass exchange registrations. Instantly exchange crypto tokens right within your wallet" source="Website" %}
