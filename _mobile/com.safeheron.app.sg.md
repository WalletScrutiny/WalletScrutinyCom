---
title: 'Safeheron: Crypto MPC Wallet'
date: 2025-08-28
authors:
- danny
twitter: Safeheron
social:
- https://www.linkedin.com/company/safeheron
- https://github.com/safeheron
redirect_from:
- /android/com.safeheron.app.sg/
android:
  appId: com.safeheron.app.sg
  users: 1000
  released: 2022-07-17
  updated: 2026-05-22
  version: 1.6.7
  icon: com.safeheron.app.sg.png
  meta: ok
  verdict: custodial
  developerName: Safeheron

---

## App Description

Safeheron is an enterprise-focused MPC (Multi-Party Computation) wallet solution. It offers institutional-grade self-custody using MPC-TSS and TEE technologies, removing single points of failure in private key management. The mobile app acts as a secure endpoint for approval workflows, integrated with Safeheron's web console and policy engine. Safeheron targets centralized financial systems, over-the-counter trading, brokerage, exchanges, cryptocurrency funds, Web3 projects, and other institutional customers.

**It was not meant to be a single user bitcoin wallet.** From the moment the app is opened, a "team" must be created. This service is only available for a 14-day free trial period. After that, the team must avail of a paid plan. 

## Analysis

**Is it a wallet?**
Yes, but it is primarily an enterprise custody platform, not a consumer wallet.

**Is it for bitcoins?**
Yes, Bitcoin is supported among a wide set of assets.

> “Safeheron supports 11 native coins such as  BTC and ETH, as well as hundreds of tokens.”

Safeheron [FAQ](https://safeheron.com/faq/)

**Ability to send & receive**
Can it send and receive bitcoins?
Yes, transactions can be created and approved via MPC, but transfers depend on institutional setup and governance policies.

**Key custody**
Is the product self-custodial?
For institutions, yes: Safeheron markets itself as an MPC-based self-custody provider where the institution retains control over key shards. However, this is not a typical retail self-custody wallet; trust in Safeheron's infrastructure is still required.

**Individual User Access**
Can individual users use this as a personal Bitcoin wallet?
No. The Android app requires:
- Team invitation code from Safeheron to onboard
- At least one team must be initialized and activated before functionality
- Even solo users must operate as a "team" (creator + member) within approval workflows and MPC shard distribution
- 14-day free trial followed by paid plan requirement
This makes it unsuitable as a personal wallet for individual users.

**Availability of source-code**
Is the source code publicly available?
Partially. Safeheron open-sourced its MPC-TSS algorithm library in C++ but not the full application stack.


## Verdict

Safeheron's Android app is **not a personal Bitcoin wallet** but an institutional **custody** platform that enforces team-based organizational structures. Individual users cannot simply download and use this app as a personal wallet - it requires team invitation codes, organizational setup, approval workflows, and paid subscriptions after a 14-day trial. Even solo users must operate within a "team" framework with MPC shard distribution and governance policies.

While Safeheron provides institutions with MPC-TSS key management, the app is fundamentally designed for enterprise custody rather than individual Bitcoin storage. The closed-source nature prevents verification of the mobile app and backend infrastructure, despite partial open-sourcing of cryptographic libraries. From a WalletScrutiny perspective, this is custodial enterprise infrastructure, not a self-custodial Bitcoin wallet for personal use.

A product only qualifies as "self-custodial" if you as the end user hold and can restore your funds independently (e.g., via a seed phrase or deterministic recovery). With Safeheron, you can't simply download the app and create a wallet — you need a team structure and Safeheron's backend to issue invitation codes. Recovery and operation depend on Safeheron's enterprise infrastructure and approval workflows. Even if cryptographically MPC shares are split, a single human user doesn't get full standalone custody.
