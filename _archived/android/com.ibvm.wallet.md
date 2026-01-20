---
title: 'IBVM: Crypto & Bitcoin Wallet'
appId: com.ibvm.wallet
meta: ok
verdict: nobtc

---

## App Description

> Manage IBVM tokens, Bitcoin, Ethereum, Solana and other crypto swap assets, and explore DeFi with ease.

## Analysis

The application description claims to support Bitcoin.

**We tested the app:** [Testing documentation](https://x.com/BitcoinWalletz/status/1990726584429379703) reveals the app uses Ethereum-style addresses (starting with `0x`) for what it labels as "IBVM Bitcoin", not native Bitcoin addresses which start with `1`, `3`, or `bc1`.

The wallet displays "IBVM Bitcoin" with addresses in the format `0x27e10dAB658Ec9df25ec9a012407245D306a17B8`, which is not a Bitcoin network address format.

This app **does not support Bitcoin** on the Bitcoin network.
