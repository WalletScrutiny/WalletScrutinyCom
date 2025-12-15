---
title: Trezor Suite
appId: trezor.suite
authors:
- danny
released: 2016-06-28
discontinued: 
updated: 2024-04-19
version: 25.6.3
binaries: 
provider: Trezor
providerWebsite: https://trezor.io
website: https://suite.trezor.io
repository: https://github.com/trezor/trezor-suite
issue: 
icon: trezor.suite.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2025-06-25
twitter: trezor
social: 
builds: 
features: 

---

## Analysis

The Trezor Suite does not handle private keys directly — the Trezor hardware wallet does.

- Trezor Suite is the companion app that interfaces with the Trezor device.
- The private keys are securely stored and remain inside the Trezor hardware wallet at all times.
- Even when signing transactions, the private key never leaves the device — Trezor Suite just sends unsigned transactions to the Trezor, which signs them internally and returns the signed data.

This makes the desktop app, **not a wallet**.



