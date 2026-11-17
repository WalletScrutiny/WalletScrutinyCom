---
title: Wats Wallet
appId: com.wats.wallet
meta: ok
verdict: nobtc
archivedFrom: _android/com.wats.wallet.md
archivedCommit: 646bb53765af28e4271cc8c9435f2617182a2318

---

## App Description

From the Google Play listing:

> WATS, developed under the Alltoscan ecosystem, is here to revolutionize your crypto experience. With this multi channel wallet, you can perform all your transactions within one ecosystem that supports multiple chains and adheres to the highest security standards.

## Analysis

Despite repeatedly using the phrase "bitcoin wallet" in its Play Store description, Wats Wallet does not appear to support the Bitcoin (BTC) network. All confirmed supported chains are EVM-based (Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, BASE, Fantom) with Solana added in the most recent update. No Bitcoin network integration is mentioned in the feature list, changelog, or website.

The app uses a proprietary fee model — all transaction fees are paid in ATS (Alltoscan Token) regardless of the chain. An optional NFC hardware card ($54.90–$249.90) is offered for additional security.

The app allows adding a custom network via chain ID. However, chain IDs are an EVM-specific concept (EIP-155) and cannot represent Bitcoin, which uses a fundamentally different UTXO-based architecture. Custom network support does not extend Bitcoin compatibility.

No source code or GitHub repository is available.

## Verdict

Wats Wallet **does not support Bitcoin**. The repeated use of "bitcoin wallet" in its description appears to be SEO marketing language rather than a reflection of actual BTC network support.
