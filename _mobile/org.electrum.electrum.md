---
title: Electrum Bitcoin Wallet
date: 2025-08-11
authors:
- leo
- Mohammad Rafigh
- danny
- keraliss
website: https://electrum.org
twitter: ElectrumWallet
features:
- customNode
- foss
- ln
- multiSig
- segwit
redirect_from:
- /electrum/
- /android/org.electrum.electrum/
android:
  appId: org.electrum.electrum
  users: 1000000
  appCountry: us
  released: 2016-03-02
  updated: 2026-07-09
  version: 4.8.0
  reviews: 368
  icon: org.electrum.electrum.png
  alternativeStores:
  - fdroid
  meta: ok
  verdict: sourceavailable
  developerName: Electrum Technologies GmbH
  repository: https://github.com/spesmilo/electrum

---

**Electrum Bitcoin Wallet** is one of the oldest and most widely used Bitcoin wallets in the cryptocurrency ecosystem. First released in 2011, Electrum quickly gained popularity due to its focus on speed, low resource usage, and a strong emphasis on security. It is known for its lightweight architecture that uses remote servers to handle the blockchain, allowing quick startup and operation without requiring users to download the entire Bitcoin blockchain.

Over the years, Electrum has added advanced features such as hardware wallet integration, multi-signature support, cold storage capabilities, and compatibility with the Lightning Network (LN) for faster and cheaper Bitcoin transactions. These features make it suitable for both beginner users seeking a simple interface and advanced users needing complex transaction setups.

Electrum has played a notable role in the history of Bitcoin software, being an early adopter of deterministic wallets (seed phrases) and supporting various Bitcoin Improvement Proposals (BIPs) that enhanced wallet interoperability and security. Its open-source codebase has been actively maintained and audited by the Bitcoin community, ensuring transparency and trust.

For developers and security researchers, Electrum provides extensive documentation, API references, and a well-structured GitHub repository. The project is licensed under the MIT license, enabling community contributions and independent verifications of the source code.

**Key Features:**
- **Security**: Seed-based recovery, encryption, hardware wallet support, multi-signature wallets.
- **Speed**: Connects to a network of decentralized servers for quick blockchain access.
- **Advanced Tools**: Custom transaction fees, coin control, Lightning Network payments.
- **Cross-platform**: Available for desktop (Windows, macOS, Linux) and mobile (Android).

**Resources:**

- User Documentation: [https://electrum.readthedocs.io](https://electrum.readthedocs.io)
- Release Notes: [https://github.com/spesmilo/electrum/releases](https://github.com/spesmilo/electrum/releases)
- Lightning Network Guide: [https://electrum.readthedocs.io/en/latest/ln.html](https://electrum.readthedocs.io/en/latest/ln.html)

{% include featureEvidence.html feature="foss" quote="Released under the MIT Licence" source="Website" %}

{% include featureEvidence.html feature="multiSig" quote="Multisig Split the permission to spend your coins between several wallets." source="Website" %}

{% include featureEvidence.html feature="customNode" quote="How to run your own Electrum server: Install Guide" source="Website" %}

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/spesmilo/electrum/issues/8838](https://github.com/spesmilo/electrum/issues/8838)
