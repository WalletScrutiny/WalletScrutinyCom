---
title: MetaMUI Wallet
appId: id.metablockchain.metawallet
meta: ok
verdict: nobtc
archivedFrom: _mobile/id.metablockchain.metawallet.md
archivedCommit: 14ab6eaf513807cfda2289fee15544e46d87867e

---

## App Description

MetaMUI Wallet is a mobile wallet published by Sovereign Wallet Network Pte. Ltd., distributed under the identifier `id.metablockchain.metawallet` on both iOS and Android. Its store listings describe an "identity-based" wallet — *"the first and only wallet that is able to connect to the MetaMUI Blockchain mainnet network"* — that lets a user open an identity-bound wallet, hold and transfer MUI assets on the MetaMUI Blockchain, and present Verifiable Credentials (VC) and a decentralised identity (DID). The provider states a mnemonic phrase was integrated for wallet access (v3.1.0) and describes the app as the gateway into the wider MetaMUI ecosystem.

## Testing and Analysis

This assessment is based on the provider's published material, retrieved 2026-07-24. MetaMUI Wallet is the successor to the same developer's earlier SovereignWallet / MUI app (`exchange.sovereignwallet.mui`), which Sovereign Wallet Network confirmed to us it no longer supports.

**The app is a single-ecosystem wallet for the MetaMUI Blockchain, not a Bitcoin wallet.** Both store listings describe it exclusively as a wallet for MUI holdings on the MetaMUI Blockchain mainnet — *"Metawallet allows you to connect to the MetaMUI Blockchain network and completely manage your MUI holdings"* — alongside identity and Verifiable-Credential features. Neither listing mentions Bitcoin, a BTC balance, or a Bitcoin address. (MUI originated as an Ethereum ERC-20 token and is being migrated to the MetaMUI chain.)

**Verdict: nobtc.** MetaMUI Wallet is a wallet, but it manages assets on its own MetaMUI Blockchain rather than Bitcoin. WalletScrutiny reviews wallets that at least also support BTC, so the review stops here. Custody and source are therefore not assessed — though it is worth noting for any future review that the developer's previous SovereignWallet app was reported (via a third-party source, never on the developer's own site) to store users' private keys encrypted on a company server, which would warrant scrutiny should MetaMUI ever add Bitcoin support.
