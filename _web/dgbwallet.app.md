---
title: DigiByte Wallet
appId: dgbwallet.app
authors:
- danny
released: 2026-04-26
discontinued: 
updated: 2026-04-26
version: wallet-v0.1.4
binaries: 
provider: Dennis Pitallano
providerWebsite: https://dennispitallano.github.io
website: https://dgbwallet.app
repository: https://github.com/DennisPitallano/digibyte-wallet
icon: dgbwallet.app.png
bugbounty:
meta: ok
verdict: nobtc
date: 2026-04-29
twitter: 
social: 
features: 

---

## App Description

DigiByte Wallet is a Blazor WebAssembly PWA served at `dgbwallet.app`, where BIP39 mnemonic generation, HD key derivation, AES-256-GCM encrypted storage (browser IndexedDB), and transaction signing are all performed client-side via NBitcoin compiled to WebAssembly. The wallet exclusively supports the DigiByte (DGB) network — network parameters, bech32 prefix (`dgb`), and genesis block are all DigiByte-specific; no Bitcoin network configuration is present. Source code is publicly available on GitHub under the MIT license at commit `4846f84`, tagged `wallet-v0.1.4`. A separate backend API at `digibyte-api-production.up.railway.app` is referenced in the app's Content Security Policy and hosts SignalR hubs used for multisig room coordination and P2P trade chat.

## Testing and Analysis

The wallet's `_web` classification applies because it is a browser-based application with no native installable binary; the PWA manifest allows installation as a shortcut, but the runtime is entirely web-delivered. The repository's `src/DigiByte.Crypto/Networks/DigiByteNetwork.cs` confirms the sole supported network uses crypto code `"DGB"` with DigiByte-specific consensus parameters — no Bitcoin (`BTC`) network is registered or reachable in the codebase. All five `wallet-v*` releases (v0.1.0 through v0.1.4) were created within 73 minutes on 2026-04-26, the same day the project cut its first stable tag. The app's `connect-src` CSP directive includes the permissive `ws: wss:` tokens, allowing WebSocket connections to any origin, which was not disclosed in the review request.

We tested the app, and posted the video on [X.com](https://x.com/BitcoinWalletz/status/2049338205498134883). This app is exclusively for DigiByte and **does not have support for BTC**.
