---
title: Bisq 2
appId: bisq2
authors:
- danny
released: 2024-03-27
discontinued: 
updated: 2026-08-22
version: 2.1.12
binaries: https://bisq.network/downloads/
provider: Bisq Network
providerWebsite: 
website: https://bisq.network
repository: https://github.com/bisq-network/bisq2
icon: bisq2.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-08-25
twitter: bisq_network
social: 
builds:
- arch: x86_64-linux-gnu
  types:
    deb:
    - Bisq-*.deb
    rpm:
    - Bisq-*.rpm
features:
- TOR
- tradeAlts
- ownFullNode
- foss
- multiSig

---

{% include featureEvidence.html feature="TOR" source="[Website](https://bisq.network)" quote="Every Bisq node is a Tor hidden service by default." %}
{% include featureEvidence.html feature="tradeAlts" source="[Website](https://bisq.network)" quote="Buy and sell bitcoin for fiat (or other cryptocurrencies) privately and securely" %}
{% include featureEvidence.html feature="ownFullNode" source="Review" quote="Integration with Bitcoin Core (full node) and light wallet options" %}

## App Description

Bisq 2 is the successor to Bisq v1, designed as a multi-protocol decentralized trading platform for bitcoin and other digital assets. As described in the [Bisq wiki:](https://bisq.wiki/Bisq_2)

> Bisq 2 will support multiple trade protocols, multiple privacy networks and multiple identities.

The initial release focuses on the "Bisq Easy" protocol, designed specifically for novice Bitcoin users who do not yet own bitcoin and cannot use Bisq v1 due to security deposit requirements. Bisq Easy uses a reputation-based trading system without security deposits, featuring a chat-based interface for social interaction between traders.

**Key architectural improvements over Bisq v1:**

- **Multiple Trade Protocols**: Planned support for various protocols including Bisq Easy (reputation-based), Bisq Multisig (improved v1 protocol), Submarine Swaps, Liquid integration, Lightning Network trading, and atomic swaps with Monero
- **Multiple Privacy Networks**: Initially supports Tor with experimental I2P implementation and potential future support for networks like Nym
- **Multiple Identities**: Users can create separate identities for different interactions, from single global identity to unique identities per trade
- **Multiple Applications**: Reference JavaFX desktop application with active Kotlin Multiplatform Mobile (KMP) development work and planned HTML interface for personal node projects and REST API for trading bots
- **Multiple Wallets**: Integration with Bitcoin Core (full node) and light wallet options, with protocol-specific wallets for Liquid and Monero

**Technical Implementation:**

Bisq 2 is primarily built with Kotlin with Java interoperability and requires JDK 21. The P2P network includes built-in DoS protection using Proof of Work and provides improved resilience compared to Bisq v1. The platform enforces BSQ bonding for contributor roles and infrastructure providers through the system itself.

The application is available for Windows, macOS, and Linux with GPG signature verification available for all releases. Installation requires additional steps on macOS due to removed notarization and can occasionally trigger antivirus alerts on Windows. The software maintains the same open-source, non-custodial principles as its predecessor while expanding accessibility to new Bitcoin users.

Bisq 2 represents a ground-up redesign to support multiple trading protocols that can expand over time, addressing the limitations of Bisq v1's single-protocol architecture while maintaining decentralization and privacy principles.

This app is **source available** and is **for verification**.

{% include featureEvidence.html feature="foss" quote="Bisq 2 is licensed under the AGPL-3.0 license. All contributions are subject to this license." source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Deposits held in 2-of-2 multisig wallets encourage safe, successful trades." source="Website" %}