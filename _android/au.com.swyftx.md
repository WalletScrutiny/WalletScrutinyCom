---
wsId: swyftx
title: 'Swyftx: Buy Bitcoin, ETH & SOL'
altTitle: 
authors:
- danny
users: 100000
appId: au.com.swyftx
alternativeStores: 
appCountry: 
released: 
updated: 2026-05-15
version: 2.8.46
reviews: 
website: https://swyftx.com/
repository: 
icon: au.com.swyftx.png
bugbounty: 
meta: ok
verdict: custodial
date: 2025-11-11
signer: 
twitter: swyftxau
social:
- https://www.facebook.com/swyftx
- https://www.instagram.com/swyftx
- https://www.linkedin.com/company/swyftx
- https://www.reddit.com/r/Swyftx
redirect_from: 
developerName: Swyftx Pty Ltd
builds: 
features: 

---

## App Description

Swyftx is an Australian custodial cryptocurrency exchange offering trading for Bitcoin and other digital assets. It is registered with AUSTRAC as a Digital Currency Exchange and implements identity verification under Australian AML/CTF laws. Users buy, sell, and hold assets within custodial accounts managed by Swyftx, without direct control of private keys.

## Analysis

In the [Terms of Use](https://swyftx.com/terms-of-use/#terms-of-use) section "Holding of crypto assets, no custody, private key risk" (8th sentence), Swyftx claims it is not a custodial service:

> That being said, Swyftx and our third-party providers do not offer custodial or fiduciary services to you, and do not hold your crypto assets as your custodian or on your behalf.

However, three sentences later in the same paragraph (11th sentence), the terms state:

> You do not hold the private keys to crypto assets while they remain in your Swyftx account.

The terms also authorize Swyftx ([Section 8.4](https://swyftx.com/terms-of-use/#terms-of-use), clauses a and b) to hold assets in wallets and move assets to "Third Party Service Providers, external platforms and systems," though no specific custody partners are disclosed.

Additionally, the same paragraph notes that "Customer crypto assets and fiat currency may not be held in segregated client accounts or separate from Swyftx's own crypto assets and fiat currencies at all times," suggesting customer funds are pooled in shared infrastructure rather than separated at the blockchain level, with ownership tracked via internal accounting and reconciliation processes.

**Regardless of whether Swyftx manages custody in-house or through third-party custodians, users have no control of private keys.** By WalletScrutiny.com's standards, this is a **custodial** service.