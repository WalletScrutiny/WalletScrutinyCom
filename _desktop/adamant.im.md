---
title: Adamant IM
appId: adamant.im
authors:
- danny
released: 2017-11-22
discontinued: 
updated: 2024-03-20
version: 4.9.0
binaries: https://github.com/Adamant-im/adamant-im/releases/download/v4.9.0/ADAMANT-Messenger-4.9.0.AppImage
provider: Adamant
providerWebsite: 
website: https://adamant.im/
repository: https://github.com/Adamant-im/adamant-im
issue: https://github.com/Adamant-im/adamant-im/issues/666
icon: adamant.im.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2025-03-31
reviewArchive: 
twitter: adamant_im
social: 
features: 

---


## Reproduclbe Build Verification for Adamant.IM Desktop Linux AppImage v4.9.0

{% include asciicast %}

## Reproducibility Test

We downloaded version 4.9.0 of the Adamant IM desktop application from the official GitHub repository and verified its reproducibility.

The binary was downloaded from [GitHub releases](https://github.com/Adamant-im/adamant-im/releases/download/v4.9.0/ADAMANT-Messenger-4.9.0.AppImage) with SHA256 hash:
```
5f680ea906a2c6da62e79bc6eb5f9023585e31a9f39214fb7bfcd55e7f422ccc
```

We built the application from source following these steps:

1. Clone the repository:
   ```bash
   git clone --recursive https://github.com/Adamant-im/adamant-im.git
   cd adamant-im
   ```

2. Check out the specific version tag:
   ```bash
   git checkout v4.9.0
   ```

3. Install dependencies and build:
   ```bash
   npm install
   npm run electron:build
   ```

The resulting binary was located in the `release-electron` directory and had the SHA256 hash:
```
32f1cca447520264a5f54168a00f378381c4f27242f94f8539c76ff78f145a46
```

The hashes do not match, indicating that the build is not reproducible. This could be due to several factors including:

- Build timestamps embedded in the binary
- Developer signing of the official release
- Non-deterministic build processes
- Different build environments

This verification has been published as a Nostr attestation.
We updated the [existing issue.](https://github.com/Adamant-im/adamant-im/issues/666)

For now, until these issues are resolved, are marking this app as **nonverifiable**.

## App Description

ADAMANT is a decentralized messenger application built on blockchain technology. It operates independently of centralized servers, with all messages and transactions recorded on its blockchain network. The application implements end-to-end encryption using Diffie-Hellman Curve25519, Salsa20, and Poly1305 algorithms, with message authentication via SHA-256 and Ed25519 EdDSA signatures.

The system functions as both a communication platform and a cryptocurrency wallet. It supports multiple cryptocurrencies including ADAMANT (ADM), Bitcoin (BTC), Ethereum (ETH), Lisk (LSK), Dogecoin (DOGE), and Dash (DASH), with private keys derived from the user's ADAMANT passphrase.

Key features:
- No personal identifiers required (phone numbers, emails)
- No access to device data (contacts, location)
- IP address concealment from communication partners
- Tor network compatibility
- Integrated cryptocurrency wallets
- Cross-platform availability (web, desktop, mobile)
- Support for chatbots and notification services

