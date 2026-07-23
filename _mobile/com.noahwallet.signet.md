---
title: Noah (Signet)
date: 2026-05-28
authors:
- danny
redirect_from:
- /android/com.noahwallet.signet/
android:
  appId: com.noahwallet.signet
  users: 50
  appCountry: us
  updated: 2026-07-22
  version: VARY
  icon: com.noahwallet.signet.png
  meta: fewusers
  verdict: sourceavailable
  developerName: Hampus Sjöberg
  repository: https://github.com/smolcars/noah

---

## App Description

Noah is a self-custodial mobile wallet for [Ark](https://ark-protocol.org), a Bitcoin Layer 2 protocol. Ark uses shared on-chain UTXOs and virtual UTXOs (vTXOs) managed off-chain to enable cheap, scalable Bitcoin payments without channel management. Funds can always be reclaimed on-chain unilaterally, even if the Ark Service Provider (ASP) goes offline.

The app's own README warns: *"This project is in rapid development phase and is extremely alpha. DO NOT use with real funds."* It operates exclusively on Bitcoin **signet** (testnet).

## Analysis

On wallet creation, a 12-word BIP39 seed phrase is presented to the user — consistent with self-custodial design. The seed was not exported to an external Taproot-capable wallet to cross-verify address derivation.

The Receive screen shows only a QR code; no copyable address text is displayed. Scanning the QR code returns a [BIP21](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki) URI combining an on-chain fallback with an Ark address:

```
bitcoin:tb1pqlxjw7saeahkyrr7tyv509q95klzz6njz2u2ru9xjpv073w5s0dqpvqhx9?ark=TARK1PEM36WCFZQQPW5K52JCRWPYNQCJQTARX9NG0EQH9Y4E5WQETMRGMK69E5YUTX9SEZQYP3CDHJLZLLXM547HJE8AVT95FA87VGTZKEYKK84VU33FHAQ0NKQ0S7G4JUJ
```

- **On-chain fallback**: `tb1p...` — a Taproot (P2TR) address on signet. This is **not** a simple BIP86 single-key P2TR: in Ark, a vTXO is a Taproot output whose key path is an aggregate of the user key and the ASP key (MuSig2), with the user's timelock script as the unilateral exit path. Cross-verifying this address in a standard wallet (e.g. Electrum with `--signet`) is therefore not possible — any standard wallet would derive a different address from the same seed, because it has no knowledge of the ASP's public key or the Ark Taproot tweak.
- **Ark address**: `TARK1P...` — bech32m with `tark` HRP (testnet Ark); no other wallet implements Ark yet.

Despite the app UI suggesting multiple payment types, the QR contains no Lightning component.

Ark vTXOs have an expiry timeout; users must refresh or perform a unilateral exit before the deadline or the ASP may sweep the expired funds. This is a liveness requirement — the user's private key is solely theirs, and the ASP cannot take funds before expiry. Unilateral exit to Layer 1 was added in v0.0.15 (2026-05-27).

Screencast of wallet creation and receive QR was posted on [X.com](https://x.com/BitcoinWalletz/status/2059833276458799437).

## Source

Source code is publicly available under the MIT license at [github.com/smolcars/noah](https://github.com/smolcars/noah). The developer is Hampus Sjöberg ([@hsjoberg](https://github.com/hsjoberg)), author of [Blixt Wallet](https://blixtwallet.com).
