---
title: Bitcoin Core
appId: bitcoincore
authors:
- leo
- danny
released: 2009-01-04
discontinued: 
updated: 2025-04-15
version: '29'
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
date: 2025-04-25
reviewArchive: 
twitter: bitcoincoreorg
social: 
features: 

---

## App Description

The reference implementation of the Bitcoin protocol. Described in its [repository:](https://github.com/bitcoin/bitcoin#what-is-bitcoin-core)

> Bitcoin Core connects to the Bitcoin peer-to-peer network to download and fully validate blocks and transactions. It also includes a wallet and graphical user interface, which can be optionally built.

It can download the entire Bitcoin blockchain and stores the entire history of the network. Several binaries are available for Windows, Mac and Linux.

It is one of the most verified programs with several developers building and signing their attestations. It can be built using GUIX. Anyone can independently verify that the binaries match the source code. Instructions for building using GUIX can be found [here.](https://github.com/bitcoin/bitcoin/blob/master/contrib/guix/README.md). Builders GPG-sign SHA256 checksums of their binaries and publish signatures alongside releases.