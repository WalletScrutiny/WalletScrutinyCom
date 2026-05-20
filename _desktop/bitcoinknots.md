---
title: Bitcoin Knots
appId: bitcoinknots
bitcoinOrgId: bitcoinknots
authors:
- danny
released: 2009-01-04
discontinued: 
updated: 2026-05-09
version: 29.3.knots20260508
binaries: 
provider: Luke Dash Jr
providerWebsite: 
website: https://bitcoinknots.org
repository: https://github.com/bitcoinknots/bitcoin
icon: bitcoinknots.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-04
twitter: BitcoinKnots
social: 
builds:
- arch: x86_64-linux
  types:
    tarball:
    - bitcoin-*-x86_64-linux-gnu.tar.gz
- arch: aarch64-linux
  types:
    tarball:
    - bitcoin-*-aarch64-linux-gnu.tar.gz
- arch: arm-linux
  types:
    tarball:
    - bitcoin-*-arm-linux-gnueabihf.tar.gz
- arch: powerpc64-linux
  types:
    tarball:
    - bitcoin-*-powerpc64-linux-gnu.tar.gz
- arch: powerpc64le-linux
  types:
    tarball:
    - bitcoin-*-powerpc64le-linux-gnu.tar.gz
- arch: riscv64-linux
  types:
    tarball:
    - bitcoin-*-riscv64-linux-gnu.tar.gz
- arch: x86_64-windows
  types:
    zip:
    - bitcoin-*-win64-pgpverifiable.zip
    setup:
    - bitcoin-*-win64-setup-pgpverifiable.exe
features:
- ownFullNode
- foss

---

{% include featureEvidence.html feature="ownFullNode" source="[Website](https://bitcoinknots.org)" quote="Bitcoin node and wallet in one." %}

## App Description

Bitcoin Knots is a Bitcoin full-node and wallet implementation maintained as a derivative of Bitcoin Core. It includes all of Core's features with additional enhancements and policy changes aimed at advanced users and node operators. 

Like Bitcoin Core, it supports a self-custodial wallet that allows users to generate, store, and manage their own keys without trusting third parties. Bitcoin Knots is fully **source-available** under the MIT license, and its codebase is publicly hosted on GitHub. 

The project supports reproducible builds using the Guix system, enabling independent verification that the released binaries match the source code. A complete reproducibility guide is provided here: [https://github.com/bitcoinknots/bitcoin/blob/master/contrib/guix/README.md](https://github.com/bitcoinknots/bitcoin/blob/master/contrib/guix/README.md).

{% include featureEvidence.html feature="foss" quote="Bitcoin Knots is released under the terms of the MIT license. See COPYING for more information or see https://opensource.org/licenses/MIT." source="GitHub README" comment="MIT license is a recognized OSI-approved FOSS license. No Commons Clause or other restrictions mentioned." %}