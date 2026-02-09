---
title: Nutstash
appId: nutstash
authors:
- heisenberg
released: 2023-01-30
discontinued: 
updated: 2025-07-31
version: 
binaries: 
provider: 
providerWebsite: 
website: https://nutstash.app
repository: https://github.com/gandlafbtc/nutstash-wallet
issue: 
icon: nutstash.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-02-09
twitter: gandlaf21
social: 
features:
- ln
- ecash
- nostr

---

## App Description

Nutstash is a web-based Cashu wallet with multi-mint support and Nostr integration. It is available as a PWA at https://nutstash.app.

Key features include:

- **Multi-mint support**: Connect to and manage tokens from multiple Cashu mints
- **Send to Nostr keys**: Send ecash tokens directly to Nostr public keys
- **Token management**: View, send, receive, and organize ecash tokens
- **Lightning minting**: Mint new tokens from Lightning payments
- **Lightning redemption**: Redeem tokens to Lightning invoices
- **PWA**: Installable as a Progressive Web App

Nutstash is built with SvelteKit and stores tokens in browser local storage. Users should regularly back up their tokens.

**Important note**: Cashu ecash provides privacy through blind signatures, but tokens are custodial - the mint operator holds the underlying Bitcoin. Users must trust the mint to honor redemptions.

