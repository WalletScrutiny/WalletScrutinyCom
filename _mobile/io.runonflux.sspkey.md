---
title: SSP Key
date: 2026-10-28
authors:
- leo
website: https://sspwallet.io
twitter: sspwallet_io
android:
  appId: io.runonflux.sspkey
  users: 1000
  appCountry: us
  released: Jan 22, 2024
  updated: 2026-09-02
  version: 2.1.1
  icon: io.runonflux.sspkey.webp
  meta: ok
  verdict: sourceavailable
  developerName: Influx Technologies USA

---

## App Description

SSP Key is the phone half of SSP Wallet, a 2-of-2 multisignature wallet by Influx Technologies (the team behind Flux and Zelcore). The SSP Wallet browser extension holds one key and SSP Key the other: "Every transaction must be signed by both devices". SSP Key shows the user the transaction, adds the second signature, and offers QR-code signing for offline use. Supported chains include Bitcoin (native SegWit), Litecoin, Bitcoin Cash, Dogecoin, Zcash, Ravencoin, Flux, Ethereum and EVM networks, and Solana.

## Analysis

- **Is it a wallet?** SSP Key shows no balances, as a comment in its code confirms ("the Key shows no balances anywhere", [`BackupCheckupCard.tsx`](https://github.com/RunOnFlux/ssp-key/blob/v2.1.1/src/components/BackupCheckupCard/BackupCheckupCard.tsx)). Sending starts in the browser extension. SSP Key does hold one of the two private keys that control the funds, with its own seed phrase backup. No coins move without it, and losing it without a backup locks the funds. It also shows the multisig receiving address ("This is your wallet address. You can share this address with anyone to receive funds."). Like a hardware signer, it controls funds, so we review it as a wallet.
- **Bitcoin support.** The app's Bitcoin configuration uses native SegWit multisig (`scriptType: 'p2wsh'`, [`blockchains.ts`](https://github.com/RunOnFlux/ssp-key/blob/v2.1.1/src/storage/blockchains.ts)), with BIP-48 derivation.
- **Custody.** The description says "Keys are generated on your devices and never leave them. No seed, private key, or extended private key is ever shared between devices." The two keys sit on two devices the user owns. Influx's relay server only passes signing requests between them, and the app can also sign offline by QR code.
- **Source code.** The source is public under AGPL-3.0 at [RunOnFlux/ssp-key](https://github.com/RunOnFlux/ssp-key), linked from [sspwallet.io](https://sspwallet.io/). It builds the app ID `io.runonflux.sspkey`. Tag [v2.1.1](https://github.com/RunOnFlux/ssp-key/tree/v2.1.1) declares `versionName "2.1.1"` and is dated 2026-09-02, the same day the Play release was updated. The companion extension is at [RunOnFlux/ssp-wallet](https://github.com/RunOnFlux/ssp-wallet).

SSP Key is self-custodial and its source is public. A reproducible build test is still to be done. See [our methodology](/methodology/#sourceavailable).

**Source code is available**
