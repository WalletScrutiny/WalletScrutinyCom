---
title: Cypher Box
date: 2026-02-02
authors:
- danny
website: https://cypherbox.io
twitter: Cypher_Box
social:
- https://t.me/cypher_box
redirect_from:
- /android/io.cypherbox.btc/
android:
  appId: io.cypherbox.btc
  users: 100
  appCountry: us
  released: 2025-01-17
  updated: 2026-07-27
  version: 0.1.6
  icon: io.cypherbox.btc.png
  meta: fewusers
  verdict: wip
  developerName: Cypher Box LLC
  repository: https://github.com/Bamskki/Cypher-Box

---

Cypher Box is an open-source Bitcoin wallet designed to guide users from beginner to advanced self-custody through a tiered framework. It balances security, transaction fees, and convenience across four progressive difficulty levels that adapt to the user's Bitcoin knowledge and custody requirements. The application explicitly states that it does not custody user funds.

* **Level 1: Checking Account with Lightning Network Integration**
  * Facilitates instant Bitcoin transactions with minimal fees via Lightning Network
  * Implements automatic withdrawal thresholds to optimize between network fees and counterparty risk
  * Maintains configurable reserve amounts for frequent spending needs
  * Provides direct withdrawal functionality to self-custodial vaults

* **Level 2: Hot Savings Vault (Self-Custodial)**
  * Generates standard BIP39 12-word recovery phrases for key management
  * Enables Bitcoin transactions through the main network for larger amounts
  * Supports self-sovereign accumulation of Bitcoin
  * Allows consolidation and transfer of funds to cold storage
  * Includes recovery mechanisms for the Hot Vault

* **Level 3: Cold Savings Vault**
  * Supports hardware wallet integration for enhanced security
  * Manages large Bitcoin transactions with increased security
  * Enables bidirectional transfers between Hot Vault and Checking Account

* **Additional Features**
  * Interactive balance visualization with configurable thresholds
  * Graphical representation of UTXOs (upcoming feature)
  * Consolidated balance view across all custody levels

* **Technical Specifications**
  * LNURL protocol support
  * SegWit-first transaction structure
  * BIP39 mnemonic standard compliance
  * Watch-only vault functionality
  * PSBT (Partially Signed Bitcoin Transactions) support
  * Device-level private key security (keys never leave the device)

## Analysis

We were given self-custodial options for our BTC and was given the 12-word mnemonic phrase. **We will wait until such time when the app has more users.**
