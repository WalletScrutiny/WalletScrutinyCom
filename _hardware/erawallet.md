---
title: Era Wallet
appId: erawallet
authors:
- danny
released: 2025-03-10
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 86
- 54
- 5.5
weight: 45g
provider: HWLT FZE
providerWebsite: https://era-wallet.com
website: https://era-wallet.com
shop: https://era-wallet.com/products
country: 
price: 219USD
repository: 
issue: 
icon: erawallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-09-19
signer: 
twitter: era_wallet
social:
- https://t.me/erawlt
features:
- nfc
- camera
- airgapped
- wireless_charging
- secure_element
- multi_wallet

---

## Product Description

Era Wallet is a fully air-gapped signing device sized like a bank card, built from anodized aluminium with matte Gorilla Glass to keep QR scans glare-free. It wakes into a transport firmware that you upgrade over NFC via the vendor’s Android app, after which all signing traffic stays in camera-delivered QR codes. Wallet creation pulls entropy from touchscreen swipes, accelerometer motion, and a live camera frame so your keys are generated locally with user-supplied randomness. Up to ten wallets live on the device, each guarded by its own PIN and optional passphrase, with deposit screens that surface Bitcoin mainnet/testnet addresses across Taproot, Native SegWit, nested SegWit, and legacy formats. ERA Lens decodes the raw payload of every QR you scan—including EVM token swaps—so you see the network, amounts, fees, and endpoints before approving. Approvals happen on the built-in display with a single button, and the resulting signature goes back to the phone as a QR for broadcast. Backups ride on NFC recovery cards with user-chosen PINs (plus optional paper mnemonics), letting you clone or restore a wallet in seconds without exposing the seed to another computer.

## Analysis

Era Wallet generates private keys offline using on-device entropy and keeps them local, only exporting encrypted backups when you deliberately tap an NFC recovery card. It shows receive addresses and full transaction details on its own display, and you approve everything with the device’s button before any signature leaves the wallet.

## Conclusion

The source code for the firmware is **not available** in their organization page on GitHub. 
