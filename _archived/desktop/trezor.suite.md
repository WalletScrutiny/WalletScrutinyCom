---
title: Trezor Suite
appId: trezor.suite
meta: ok
verdict: nowallet

---

## Analysis

The Trezor Suite does not handle private keys directly — the Trezor hardware wallet does.

- Trezor Suite is the companion app that interfaces with the Trezor device.
- The private keys are securely stored and remain inside the Trezor hardware wallet at all times.
- Even when signing transactions, the private key never leaves the device — Trezor Suite just sends unsigned transactions to the Trezor, which signs them internally and returns the signed data.

This makes the desktop app, **not a wallet**.



