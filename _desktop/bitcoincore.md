---
title: Bitcoin Core
appId: bitcoincore
authors:
- leo
- danny
released: 2009-01-04
discontinued: 
updated: 2026-01-13
version: 30.2
binaries: https://bitcoincore.org/en/download
provider: Bitcoin Core Developers
providerWebsite: 
website: https://bitcoincore.org
repository: https://github.com/bitcoin/bitcoin
issue: 
icon: bitcoincore.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-05
twitter: bitcoincoreorg
social: 
builds:
- arch: x86_64-linux
  types:
  - tarball
- arch: aarch64-linux
  types:
  - tarball
- arch: arm-linux
  types:
  - tarball
- arch: x86_64-windows
  types:
  - zip
  - setup
features:
- ownFullNode
- foss

---
{% include featureEvidence.html feature="ownFullNode" source="[README](https://github.com/bitcoin/bitcoin#readme)" quote="Bitcoin Core connects to the Bitcoin peer-to-peer network to download and fully validate blocks and transactions." %}

## App Description

The reference implementation of the Bitcoin protocol. Described in its [repository:](https://github.com/bitcoin/bitcoin#what-is-bitcoin-core)

> Bitcoin Core connects to the Bitcoin peer-to-peer network to download and fully validate blocks and transactions. It also includes a wallet and graphical user interface, which can be optionally built.

It can download the entire Bitcoin blockchain and stores the entire history of the network. Several binaries are available for Windows, Mac and Linux.

It is one of the most verified programs with several developers building and signing their attestations. It can be built using GUIX. Anyone can independently verify that the binaries match the source code. Instructions for building using GUIX can be found [here.](https://github.com/bitcoin/bitcoin/blob/master/contrib/guix/README.md). Builders GPG-sign SHA256 checksums of their binaries and publish signatures alongside releases.

{% include featureEvidence.html feature="foss" quote="Bitcoin Core is released under the terms of the MIT license. See COPYING for more information or see https://opensource.org/license/MIT." source="GitHub README" %}