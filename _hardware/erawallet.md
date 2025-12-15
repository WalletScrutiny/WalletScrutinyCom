---
title: Era Wallet
appId: erawallet
authors:
- danny
released: 2025-03-10
discontinued: 
updated: 2025-12-01
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
repository: https://github.com/ERAWLT/ERA-firmware-p
issue: 
icon: erawallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-12-03
signer: 
twitter: era_wallet
social:
- https://t.me/erawlt
builds: 
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

## Firmware Repository Status

ERA published a “Main Firmware” tree at https://github.com/ERAWLT/ERA-firmware-p that covers the STM32H753 application layer, FreeRTOS build, `hwlt-framework/` HAL, and supporting scripts, but the README makes it clear the dump is only **partially open**. Several proprietary components and secure-element assets are intentionally withheld pending audits and patent work, so the code cannot be built or flashed end-to-end yet.

The repository is currently licensed under Business Source License 1.1 (non-FOSS until the change date), includes optional Docker tooling plus ARM GNU 12.3 instructions, and references companion public repos (`ERA-crypto-p`, `ERA-apps-p`, `mcuboot-p`). Until the missing blobs and SE tooling land.

Because those withheld components prevent a third party from reproducing or flashing the reviewed release from source, the firmware is not verifiable even though part of the tree is public.

Therefore the current verdict stands until ERA releases every piece needed to build and load the shipping firmware, at which point it can graduate to `source-available`.
