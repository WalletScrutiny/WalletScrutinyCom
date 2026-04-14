---
title: BTC Wallet
appId: ranchimall
authors:
- danny
released: 2019-09-27
discontinued: 
updated: 2024-07-11
version: 
binaries: 
provider: RanchiMall
providerWebsite: 
website: https://ranchimall.github.io/btcwallet/
repository: https://github.com/ranchimall/btcwallet
icon: 
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-04-14
twitter: 
social: 
features: 

---

## App Description

RanchiMall BTC Wallet is a client-side web wallet for Bitcoin, served directly via GitHub Pages. It generates Bitcoin addresses and private keys locally in the browser without any server-side custody. Keys are handled entirely in-memory during the session — the local code path signs transactions locally and only broadcasts the signed raw transaction hex to the network. However, because an external script is loaded from CDN at runtime, this cannot be guaranteed absolutely. The app also functions as a Bitcoin explorer and includes a FLO / BTC / ETH address and private key converter for interoperability with RanchiMall's own FLO blockchain ecosystem.

Notably, the wallet does not use a seed phrase — it generates and exposes the raw private key directly, which the user is responsible for saving.

There is no installable binary. The repository is the deployable artifact: static HTML, CSS, and pre-minified JavaScript files are committed directly and served from GitHub Pages. There is no build toolchain (no package.json, no bundler, no Dockerfile), and there are no formal releases or version tags.

The app loads at least one dependency from an external CDN (`unpkg.com/uhtml@3.0.1`) at runtime, meaning the code executing in the browser is not solely what is committed to the repository. The pre-minified `.min.js` files also have no documented build provenance (no minifier config or lock file), making it impossible to verify whether they match the unminified `.js` counterparts also present in the repository.

The project has been inactive since July 2024.
