---
title: Peach Bitcoin
date: 2025-11-26
authors:
- danny
website: https://peachbitcoin.com
twitter: peachbitcoin
social:
- https://t.me/peachtopeach
- https://discord.com/invite/ypeHz3SW54
- https://snort.social/p/npub15369wu3wzzar5fclhecyqfv683x69n6nhlg7rxqnsg2dydgxflpq3apswl
features:
- coinCtrl
- customNode
- foss
- hd
- multiSig
- segwit
redirect_from:
- /android/com.peachbitcoin.peach.mainnet/
android:
  appId: com.peachbitcoin.peach.mainnet
  users: 10000
  appCountry: us
  updated: 2026-06-02
  version: 0.69.0
  icon: com.peachbitcoin.peach.mainnet.png
  meta: ok
  verdict: sourceavailable
  developerName: Peach Bitcoin
  repository: https://github.com/Peach2Peach/peach-app

---

## App Description

Peach Bitcoin is a peer-to-peer Bitcoin trading platform that facilitates non-KYC (no identity verification) transactions between buyers and sellers. The app includes an integrated self-custodial Bitcoin wallet where users control their private keys through a 12-word seed phrase that can be backed up and restored in standard Bitcoin wallets like Sparrow. During trades, Peach uses a 2-of-2 multisignature escrow system where sellers lock Bitcoin in an address requiring both their signature and Peach's signature to move funds, which are released to the buyer's wallet once payment is confirmed. The platform is licensed as a Swiss financial service provider and operates as an SRO member of Polyreg, supporting various payment methods including cash transactions across Europe, Africa, and Latin America.

**Note:** iOS version is currently only available via TestFlight (beta), not on the main App Store.

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/1993584064218206313) the app and can confirm the presence of a Bitcoin wallet with a 12-word seed phrase. We were able to import the seed phrases unto Electrum desktop and can confirm that the [addresses match](https://x.com/BitcoinWalletz/status/1993585057764983136) with the one provided by the app. 

This app is **for verification**.

## Feature Evidence

{% include featureEvidence.html feature="foss" quote="MIT License" source="[LICENSE](https://github.com/Peach2Peach/peach-app/blob/master/LICENSE)" %}

{% include featureEvidence.html feature="hd" comment="12-word BIP39 mnemonic backup confirmed by testing — seed imports into Electrum with matching addresses (see Analysis above). Source uses BDK `DescriptorSecretKey` with `Mnemonic` via `getDescriptorSecretKey.ts`." %}

{% include featureEvidence.html feature="segwit" comment="Wallet uses BIP84 native SegWit descriptors. Source: `src/utils/wallet/getDescriptorsBySeedphrase.ts` calls `new Descriptor().newBip84(descriptorSecretKey, KeychainKind.External/Internal)`." %}

{% include featureEvidence.html feature="multiSig" quote="Peach uses a 2-of-2 multisignature escrow system where sellers lock Bitcoin in an address requiring both their signature and Peach's signature" source="[README](https://github.com/Peach2Peach/peach-app#readme)" %}

{% include featureEvidence.html feature="coinCtrl" comment="UTXO selection confirmed in source: `src/views/wallet/CoinSelection.tsx` with `UTXOAddress` component allowing manual UTXO selection for transactions." %}

{% include featureEvidence.html feature="customNode" comment="Custom Electrum/Bitcoin node URL configurable in-app. Source: `src/views/settings/NodeSetup.tsx` implements `setCustomNode` with user-provided URL, SSL toggle, and `peachWallet.setBlockchain()` to apply the custom connection." %}
