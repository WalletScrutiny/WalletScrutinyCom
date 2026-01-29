---
title: Phoenixd Server Wallet
appId: phoenixd
authors:
- danny
released: 2024-11-10
discontinued: 
updated: 2026-01-20
version: 0.7.2
binaries: https://github.com/ACINQ/phoenixd/releases
provider: ACINQ
providerWebsite: https://acinq.co/
website: https://phoenix.acinq.co/server
repository: https://github.com/ACINQ/phoenixd
issue: https://github.com/ACINQ/phoenixd/issues
icon: phoenixd.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-01-01
twitter: acinq_co
social: 
builds: 
features:
- ln

---

## App Description

Phoenixd is ACINQ’s self-hosted companion to the Phoenix mobile wallet, packaged as a native daemon for Linux, macOS, Windows, and WSL. It keeps the user’s 12-word seed and SQLite databases under `~/.phoenix`, launches a headless Lightning node, and exposes a REST API plus `phoenix-cli` for wallet operations. Automated liquidity provisioning hooks directly into ACINQ’s LSP so incoming LN payments can open channels or accumulate fee credit without manual channel work. Despite relying on ACINQ’s infrastructure for on-chain access, the operator still controls the private keys and can restore the wallet from the mnemonic, so it clearly behaves as a desktop Lightning wallet.

**ACINQ LSP Dependency**: phoenixd exclusively connects to ACINQ's Lightning Service Provider infrastructure. Users cannot configure their own Bitcoin node or open independent channels. All liquidity and on-chain operations are managed by ACINQ's backend. In Phoenixd, the seed and signing keys live on the user's server; ACINQ never receives them and cannot spend without your signatures. That makes Phoenixd non-custodial, even though it depends on ACINQ for liquidity and on-chain connectivity. The downside is availability—not custody: if ACINQ’s LSP disappears, you still own the funds but the channels stay stalled until they return (or you can broadcast once they’re online). So it’s accurate to call Phoenixd non-custodial but LSP-dependent.

## Testing and Analysis

We cloned `https://github.com/ACINQ/phoenixd`, switched to tag `v0.7.1`, and built the `linuxX64DistZip` artifact with Temurin JDK 21 on Ubuntu Noble (Gradle 8.9) following upstream instructions. Release authenticity was confirmed by importing PM Padiou’s key `6AA4 5A4C 209A 2D30 64CF 66BE E434 ED29 2E85 643A`, verifying `SHA256SUMS.asc`, and checking the downloaded `phoenixd-0.7.1-linux-x64.zip` hash. 

This program is source-available and **for verification**.