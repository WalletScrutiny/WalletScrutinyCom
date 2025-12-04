---
title: Bitcoin Knots
appId: bitcoinknots
authors:
- danny
released: 2009-01-04
discontinued: 
updated: 2025-10-10
version: 29.2.knots20251110
binaries:
provider: Luke Dash Jr
providerWebsite: 
website: https://bitcoinknots.org
repository: https://github.com/bitcoinknots/bitcoin
issue: 
icon: bitcoinknots.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-04
twitter: BitcoinKnots
social: 
features:
builds:
  - arch: x86_64-linux
    types: [tarball]
  - arch: aarch64-linux
    types: [tarball]
  - arch: arm-linux
    types: [tarball]
  - arch: powerpc64-linux
    types: [tarball]
  - arch: powerpc64le-linux
    types: [tarball]
  - arch: riscv64-linux
    types: [tarball]
  - arch: x86_64-windows
    types: [zip, setup]

---

## App Description

Bitcoin Knots is a Bitcoin full-node and wallet implementation maintained as a derivative of Bitcoin Core. It includes all of Core's features with additional enhancements and policy changes aimed at advanced users and node operators. 

Like Bitcoin Core, it supports a self-custodial wallet that allows users to generate, store, and manage their own keys without trusting third parties. Bitcoin Knots is fully **source-available** under the MIT license, and its codebase is publicly hosted on GitHub. 

The project supports reproducible builds using the Guix system, enabling independent verification that the released binaries match the source code. A complete reproducibility guide is provided here: [https://github.com/bitcoinknots/bitcoin/blob/master/contrib/guix/README.md](https://github.com/bitcoinknots/bitcoin/blob/master/contrib/guix/README.md).
