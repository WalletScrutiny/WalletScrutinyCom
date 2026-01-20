---
title: Trezor Suite
appId: io.trezor.suite
meta: ok
verdict: nowallet

---

Note: The app needs a Trezor hardware wallet.

## App Description from Google Play

> Securely monitor your crypto account balances, track your savings, and get a new deposit address even if you don’t have your Trezor hardware wallet with you.

## Analysis

- The app initializes and asks us to sync. The only way to see further parts of the app is by scanning an XPUB QR code or manually entering a public key. Other than that, a Trezor device must be plugged in. This app does **not have a wallet** that generates a BTC address on its own.
