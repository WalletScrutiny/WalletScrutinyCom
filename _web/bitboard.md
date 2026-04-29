---
title: Bitboard Wallet
appId: bitboard
authors:
- danny
released: 2026-04-23
discontinued: 
updated: 2026-04-27
version: 0.1.2
binaries: 
provider: Michael Hrenka
providerWebsite: 
website: https://app.bitboard-wallet.com
repository: https://github.com/Radivis/bitboard-pwa-wallet
icon: bitboard.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-04-29
twitter: RadiVis
social: 
features: 

---

## App Description

Bitboard Wallet is an educational, self-custodial Bitcoin PWA served at `app.bitboard-wallet.com` and built with Rust compiled to WebAssembly and a React frontend. Mnemonic generation, encryption, and signing are performed client-side using BDK (Bitcoin Dev Kit) compiled to WebAssembly in the browser. Chain data is retrieved from Esplora-compatible providers (mempool.space, blockstream.info) via a CORS proxy deployed as Vercel serverless functions alongside the static app. Source code is publicly available under the MIT license at commit `9f0cc3b` (current main branch HEAD as of 2026-04-29), versioned `0.1.2` as of 2026-04-27; the repository has no release tags.

## Analysis

The app is source-available: the full codebase — including Rust crypto, React frontend, and Vercel API routes — is published at [github.com/Radivis/bitboard-pwa-wallet](https://github.com/Radivis/bitboard-pwa-wallet) under the MIT license. The deployment pipeline (`deploy-vercel.yml`) builds Rust to `wasm32-unknown-unknown` via wasm-pack and bundles the frontend with Vite, but the Rust toolchain version is not pinned and Node.js is only pinned to major version `24`, making byte-identical reproducible builds unlikely without further toolchain lockdown. The app includes two Vercel serverless functions (`api/esplora/` and `api/faucet/`) that act as CORS proxies to whitelisted public chain data providers and testnet faucets — neither route handles key material, but the deployment is not purely static. The README carries a prominent security warning that the wallet is in early development and should not be trusted with meaningful funds. [Testing confirmed the app launches and displays seed phrases in the browser.](https://x.com/BitcoinWalletz/status/2049392287827025997)
