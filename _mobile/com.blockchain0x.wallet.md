---
title: Blockchain0x Wallet
date: 2026-09-17
authors:
- danny
website: https://www.blockchain0x.com
iphone:
  appId: com.blockchain0x.wallet
  idd: '6777918045'
  appCountry: us
  released: 2026-06-18
  updated: 2026-06-18
  version: '1.0'
  reviews: 0
  icon: com.blockchain0x.wallet.jpg
  meta: ok
  verdict: nobtc
  developerName: Recordskeeper Inc

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6777918045" author="overtorment" severity="high" finding="The server generates backup codes that become the recovery EOA secret. Atomic recovery POSTs new codes in plaintext." %}

## App Description

Blockchain0x is not presented as a general-purpose wallet for a person. Its [App Store listing](https://apps.apple.com/us/app/blockchain0x-wallet/id6777918045) is headed "Give Your AI Agent a Wallet and a Budget" and describes "a non-custodial payment and identity layer for AI agents": the user funds an agent with USDC, sets on-chain spending limits enforced by smart contracts, and the agent then pays for "APIs, services, and compute on its own using the x402 protocol". The listing says it "Runs on Base, the fast and low-cost Ethereum Layer 2" and is "Powered by Coinbase Smart Wallet and ERC-4337 account abstraction". The only asset named is USDC. The seller of record is Recordskeeper Inc.

The project's website, [blockchain0x.com](https://www.blockchain0x.com), is live and says the same
thing more precisely. It answers the supported-chain question in its own FAQ — "Why USDC on Base and
not on Solana, Polygon, or Ethereum mainnet?" — and replies that "Solana support is coming soon;
Ethereum mainnet and Polygon follow by demand". Bitcoin appears neither in what is supported nor in
what is planned, and the word does not occur anywhere on the site. The site also prices the service,
which the store listing does not: free to start, then $29 per month per agent that earns.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. Three descriptions of which assets the app handles are available:

- **The store listing**, the developer's own claim, which names USDC on Base and nothing else.
- **The project's website**, which goes further than absence: it names the chains it supports and the chains it intends to add, and Bitcoin is on neither list.
- **overtorment's coin classification**, derived from the shipped binary rather than from the developer's own material. For this app he records **USDC**.

All three agree. That agreement is the evidence for the verdict below, and it is not the same thing as having opened the app and looked at an asset list.

We did not attempt to reproduce overtorment's security findings. The alert above is his work and is attributed to him; we have neither confirmed nor contradicted it.

### Source availability

The organisation publishes some code, but no repository for this application was found. The public repositories sit under **`tosh-labs`** rather than the seller name on the listing, and are client SDKs — Go, Python, Ruby and Kotlin/JVM, each described as an "Official SDK for Blockchain0x" — plus an agent skill. None of them is the iPhone app. Searching the seller name instead leads only to unrelated repositories for a different "RecordsKeeper chain", last touched in 2018. Without the app's own source there is nothing to build and nothing to compare the released binary against.

One tension is worth recording for whoever revisits this page: the site describes the product as "non-custodial" throughout, while overtorment's finding above is that the server generates the backup codes that become the recovery secret. We have not tested that ourselves.

### Verdict: does not support Bitcoin (BTC)

The developer's own listing describes a USDC spending layer for AI agents on Base, and the coin classification taken from the shipped binary agrees. We therefore record **does not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate; this verdict should be revisited if a released build adds a Bitcoin address and Bitcoin-network transaction flow.
