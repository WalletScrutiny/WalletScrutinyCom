---
title: Solidum Wallet
date: 2026-09-15
authors:
- danny
website: https://solidumwallet.com
android:
  appId: com.solidum.wallet
  users: 10
  appCountry: us
  released: 2026-07-02
  updated: 2026-09-09
  version: 1.2.8
  icon: com.solidum.wallet.jpg
  meta: fewusers
  verdict: nobtc
  developerName: Nova Solidum
iphone:
  appId: com.solidum.wallet
  idd: '6774024463'
  appCountry: us
  released: '2026-07-10T07:00:00Z'
  updated: 2026-09-09
  version: 1.0.7
  reviews: 0
  icon: com.solidum.wallet.jpg
  meta: ok
  verdict: nobtc
  developerName: Solidum Wallet

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6774024463" author="overtorment" severity="critical" finding="Create/import encrypts mnemonic and key to an embedded EC recipient and POSTs to Appwrite keyBackups." note="Per overtorment’s analysis of the iPhone app, version 1.2.7, creating or importing a wallet automatically sends its recovery phrase and private key to an Appwrite server at banco.codnodo.com. The data is encrypted for a public key built into the app; whoever holds the matching private key could recover those secrets. Solidum’s onboarding says the recovery phrase never leaves the device." %}

## App Description

Solidum Wallet is a mobile wallet for Tether (USDT) on the TRON network. The [Google Play](https://play.google.com/store/apps/details?id=com.solidum.wallet) and [App Store](https://apps.apple.com/us/app/id6774024463) listings describe creating or importing a wallet, sending and receiving TRC-20 USDT to TRON addresses, and viewing USDT and TRX balances, transaction history and market prices. They also describe biometric unlock and encrypted recovery-phrase backup; neither listing names Bitcoin support.

## Testing and Analysis

This assessment was recorded on 2026-09-15.

### The released Android code points to TRON, not Bitcoin

The [Google Play listing](https://play.google.com/store/apps/details?id=com.solidum.wallet) was region-blocked for the reviewer. Bob obtained an APKCombo XAPK for Solidum Wallet 1.2.8 (31), the version shown on Play, and checked the APKs' Google Play App Signing certificate and source stamp. Its React Native Hermes bundle contains onboarding text for sending and receiving USDT on TRON (TRC-20). TronGrid and Tronscan are its chain endpoints. Bitcoin appears in a market-price quote description, but Bob found no Bitcoin node, explorer, fee API, BTC address derivation or Bitcoin asset in the wallet flow. That quote does not establish a native Bitcoin wallet.

Bob installed the build on an emulator, but the ARM-only native libraries first prevented launch on the x86 device. A test repack got past that error; Google's PairIP licence check then blocked the app because Play had not recorded the install on that device. We therefore have static code evidence, not an observed wallet screen or send/receive test. Both store descriptions and [Solidum's website](https://solidumwallet.com/) describe USDT on TRON, and overtorment's coin column lists TRX, NEAR and USDT, not BTC.

### What we could check of overtorment's finding

overtorment analysed the iPhone build, version 1.2.7, and reports that wallet creation or import encrypts the recovery phrase and private key for a vendor-held recipient key, then uploads the result to an Appwrite `keyBackups` table at `banco.codnodo.com/v1`. Bob found `uploadSeedBackup`, `encryptSeedBackup`, `keyBackups` and that server address in the separate Android 1.2.8 bundle. This supports the presence of a matching upload path, but PairIP prevented a runtime check of whether it executes when a wallet is created.

The finding conflicts with the [website's promise](https://solidumwallet.com/) that keys never leave the device and with [terms §2.1](https://solidumwallet.com/terms.html), which says Nova Solidum does not store private keys on a company server or have access to the recovery phrase. The terms also describe an automatic protocol fee on transactions in §12, separate from TRON network fees. We did not execute a transaction or check that fee in the app.

### Verdict: does not support Bitcoin (BTC)

The released Android build's wallet code and the Android and iPhone listings describe USDT on TRON; the only BTC text Bob found is a price quote. This supports **does not support Bitcoin (BTC)** for both entries on this page, although neither mobile app could be walked through at runtime. The review stops at the Bitcoin-support gate. If a current released build exposes a native Bitcoin wallet, this verdict should be revisited.
