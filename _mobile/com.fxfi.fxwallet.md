---
title: FxWallet
date: 2026-07-23
website: https://www.fxwallet.com
appCountry: us
redirect_from:
- /android/com.fxfi.fxwallet/
- /iphone/com.fxfi.fxwallet/
android:
  appId: com.fxfi.fxwallet
  users: 10000
  appCountry: us
  released: 2021-04-28
  updated: 2026-08-26
  version: 3.1.0
  reviews: 4
  icon: com.fxfi.fxwallet.png
  meta: ok
  verdict: nosource
  developerName: ECHOINFI PTE. LTD.
iphone:
  appId: com.fxfi.fxwallet
  idd: '1560943983'
  appCountry: us
  released: 2021-05-05
  updated: 2026-08-26
  version: 3.1.0
  reviews: 28
  icon: com.fxfi.fxwallet.jpg
  meta: ok
  verdict: nosource
  developerName: DXP COMPUTING POWER FOUNDATION PTE. LTD.

---

## App Description

FxWallet (`com.fxfi.fxwallet`) is a closed-source multi-chain crypto wallet published on both iOS and Android with no public source repository; notably, the two stores list different publishers for the same package — Google Play as *ECHOINFI PTE. LTD.* and the App Store as *DXP Computing Power Foundation Pte. Ltd.* Its store listings and website claim self-custody ("one set of mnemonics manages all digital assets") across 80+ blockchains and tens of thousands of tokens including Bitcoin, plus a built-in Web3 DApp browser. Its self-custody claim checks out — exporting the mnemonic and importing it into Electrum reproduced the app's own Bitcoin address (see Analysis) — but the wallet application itself is not open source (only reusable component packages are published), so it cannot be audited or reproduced.

## Analysis

- **Bitcoin is supported**, with a standard BIP39 recovery phrase provided at wallet creation.
- **Self-custody confirmed (2026-07-23).** We exported the mnemonic from FxWallet and imported it into Electrum; the Bitcoin receive address shown in FxWallet — a legacy P2PKH address starting with `1` (not a native-SegWit `bc1` address) — was reproduced from that recovery phrase, confirming the phrase genuinely controls those funds and the user can independently move or restore them. ([test screenshot](https://x.com/BitcoinWalletz/status/2080226468450476263)) Note: this proves the user was given a working, exportable seed; because the app is closed-source it does **not** prove the app never transmitted or retained a copy of the keys.
- **Partial open source — but not the app.** FxWallet's official org [fxwalletOfficial](https://github.com/fxwalletOfficial) publishes reusable Flutter/Dart **component packages** used in the app ([fx-wallet-packages](https://github.com/fxwalletOfficial/fx-wallet-packages): candlestick charts, a Web3 WebView bridge, `crypto_utils`, UR/QR encoding, and an Aleo SDK — also on pub.dev). However, the **full wallet application source is not published**, so the shipped binary cannot be built from source, audited, or reproduced. (A [GitHub code search for `com.fxfi.fxwallet`](https://github.com/search?q=%22com.fxfi.fxwallet%22&type=code) surfaces only the official org's component packages, third-party wallet-connector registries, and this page — no application repository.)
- The two stores list different publishers for the same package: Google Play *ECHOINFI PTE. LTD.* and the App Store *DXP Computing Power Foundation Pte. Ltd.*

**Verdict: nosource.** The user is given a working, exportable BIP39 mnemonic that controls their Bitcoin, so this is not a custodial IOU service. Because the app is closed-source, however, we cannot rule out that it also transmits or retains a copy of the keys, and we cannot reproduce the binary — so it receives a **source-unavailable** verdict.

