---
wsId: nearMobileCrypto
title: NEAR Mobile - Crypto Wallet
altTitle: 
authors:
- danny
users: 500000
appId: com.peersyst.nearmobilewallet
appCountry: 
released: 2023-02-21
updated: 2026-03-04
version: 3.5.0
reviews: 1367
website: https://nearmobile.app/
repository: 
icon: com.peersyst.nearmobilewallet.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-11-26
signer: 
twitter: NEARMobile_app
social: 
redirect_from: 
developerName: Peersyst Technology
builds: 
features: 

---

## App Description

NEAR Mobile claims to be a non-custodial cryptocurrency wallet application developed by Peersyst Technology, primarily designed for the NEAR Protocol blockchain. The app supports storing, transferring, and staking NEAR tokens.

The wallet includes cross-chain swap functionality powered by "NEAR Intents" that claims to enable token exchanges across blockchains including Bitcoin, Ethereum, Solana, and XRP without using centralized exchanges or bridges. 

The app features fiat on-ramps for purchasing NEAR and includes a rewards token called NPRO that unlocks premium features and exclusive campaigns for active users.

## Analysis

We proceeded to [test the app](https://x.com/BitcoinWalletz/status/1993594899745415290) and was able to find a Bitcoin wallet along with the seed phrases. 

However, when we tried importing this to Electrum, the addresses [did not match](https://x.com/BitcoinWalletz/status/1993596752575058107). We tried different derivation paths to no success. 

The app-provided BTC address was `14HJDPoDch8U8yHPfVNtcUqvgeZVQk9Lsw`.

We were also able to export the private key: `ed25519:3UxX3e4Cgro5youxP4QKG419qP2V7BqB9ox83o181F9hLrptnvj7i6sUKVhjTNx5FwMCJR99DCyy6e59u6JHruhp`

The exported key is formatted in NEAR Protocol's standard, where:

ed25519: indicates the key uses the Ed25519 elliptic curve (used by NEAR, Solana, and other chains). The string after the colon is the base58-encoded private key.

This is NOT a Bitcoin private key. Bitcoin uses the secp256k1 curve, not Ed25519. This key controls the NEAR account, which then uses NEAR's Chain Signatures (MPC) infrastructure to derive and control the Bitcoin address. The Ed25519 key cannot be directly imported into Bitcoin wallets like Electrum, as they expect secp256k1 keys.

According to NEAR's [official documentation](https://docs.near.org/chain-abstraction/chain-signatures/getting-started), Bitcoin wallet functionality in NEAR Mobile relies on "Chain Signatures", which requires:

1. **Active MPC service dependency** - All Bitcoin transactions must call NEAR's `v1.signer` MPC contract to generate signatures ([source](https://docs.near.org/chain-abstraction/chain-signatures/getting-started))
2. **Non-standard key derivation** - Bitcoin addresses are derived from "NEAR account name + derivation path" using Additive Key Derivation, not BIP39/BIP44 ([source](https://docs.near.org/chain-abstraction/chain-signatures))
3. **Cannot recover with seed phrase alone** - The 12-word seed phrase controls the NEAR account, but Bitcoin access requires NEAR's MPC infrastructure to be operational ([source](https://github.com/near/mpc))

**Conclusion:** This is **not self-custodial** for Bitcoin because users cannot independently recover Bitcoin funds without NEAR's infrastructure.

And since the private key is not of Bitcoin, we can conclude that this is **not self-custodial for Bitcoin**.

