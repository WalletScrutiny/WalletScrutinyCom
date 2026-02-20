---
title: Keycard Shell
appId: keycard-shell
authors:
- danny
released: 2025-10-14
discontinued: 
updated: 2026-02-06
version: 1.1.0
binaries: 
dimensions: 
weight: 
provider: Keycard
providerWebsite: https://get.keycard.tech/
website: https://get.keycard.tech/pages/keycard-shell
shop: 
country: 
price: 
repository: https://github.com/keycard-tech/keycard-shell
issue: 
icon: keycard-shell.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2026-01-20
signer: 
twitter: Keycard_
social:
- https://discord.com/invite/uJAXk7jFhZ
builds: 
features:
- Air-gapped hardware wallet using QR codes
- Bitcoin transaction signing via ERC-4527 QR standard
- Compatible with multiple Bitcoin wallets (e.g., Sparrow, Specter, BlueWallet, Nunchuk)
- 2-inch display for on-device transaction verification
- Supports Bitcoin and Ethereum out of the box

---

## Device Description

Keycard Shell is an air-gapped hardware signing device designed to authorize cryptocurrency transactions without ever connecting to the internet or a host computer via USB, Bluetooth, or Wi-Fi. It communicates exclusively through QR codes, using the ERC-4527 standard, allowing transaction data to be transferred to and from compatible wallet software while keeping private keys isolated on the device. The device includes a 2-inch display that shows transaction details for manual verification before signing, and it supports standard seed phrase–based key generation and backup on-device. Keycard Shell supports Bitcoin and Ethereum and is compatible with multiple external wallet applications that handle address management and transaction construction.

## Hardware Analysis

1. Private keys can be created offline

Yes. The device is fully air-gapped and generates keys on the hardware itself without any network connectivity.

2. Private keys are not shared

Yes. Private keys never leave the device; only QR-encoded transaction data and signatures are exchanged with companion wallets.

3. Device displays receive address for confirmation

Yes. The built-in 2-inch screen is used to display transaction details, including addresses, for user verification before signing.

4. Interface

The device has no wired or wireless interfaces and communicates exclusively via camera-scanned and displayed QR codes using the ERC-4527 standard. Includes a single physical button used to confirm actions such as approving transaction signing and navigating prompts on the device.

This device is **for verification**