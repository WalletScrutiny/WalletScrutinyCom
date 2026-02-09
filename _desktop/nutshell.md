---
title: Cashu Nutshell
appId: nutshell
authors:
- heisenberg
released: 2022-09-11
discontinued: 
updated: 2025-11-21
version: 0.18.2
binaries: https://github.com/cashubtc/nutshell/releases
provider: Cashu
providerWebsite: https://cashu.space
website: https://docs.cashu.space
repository: https://github.com/cashubtc/nutshell
issue: 
icon: nutshell.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-02-09
twitter: CashuBTC
social:
- https://t.me/CashuBTC
builds: 
features:
- ln
- ecash

---

## App Description

Nutshell is the reference implementation for Cashu, a Chaumian ecash protocol for Bitcoin. It functions as both an ecash wallet and mint server. As described in the documentation:

> Cashu is a free and open-source Chaumian ecash system built for Bitcoin. Cashu offers near-perfect privacy for users of custodial Bitcoin applications.

Key features include:

- **Ecash wallet**: Send and receive Cashu tokens with privacy
- **Mint server**: Run your own Cashu mint backed by Lightning
- **CLI interface**: Command-line tool for wallet and mint operations
- **Lightning integration**: Mint tokens from Lightning payments, redeem to Lightning
- **Multi-mint support**: Use tokens from multiple mints

Nutshell is primarily a CLI/developer tool rather than an end-user application. It serves as:
- Reference implementation for the Cashu protocol (NUTs)
- Testing environment for mint operators
- Library for building Cashu applications

The software is written in Python and available under MIT license. Note that ecash systems involve trusting the mint operator with custody of underlying funds - tokens are bearer instruments backed by the mint's Lightning node.

