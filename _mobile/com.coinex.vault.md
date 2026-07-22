---
title: 'CoinEx Vault: Multi-Sig Wallet'
date: 2026-01-14
website: https://vault.coinex.com
appCountry: us
redirect_from:
- /android/com.viabtc.coldwallet/
- /iphone/com.coinex.vault/
android:
  appId: com.viabtc.coldwallet
  users: 5000
  appCountry: us
  released: 2023-10-14
  updated: 2026-06-23
  version: 2.21.2
  icon: com.viabtc.coldwallet.jpg
  meta: ok
  verdict: nosource
  developerName: ViaBTC
iphone:
  appId: com.coinex.vault
  idd: '6529535723'
  appCountry: us
  released: 2024-07-23
  updated: 2026-07-04
  version: 2.21.3
  reviews: 3
  icon: com.coinex.vault.jpg
  meta: ok
  verdict: nosource
  developerName: Coinex Global Limited

---

## App Description

CoinEx Vault (Android `com.viabtc.coldwallet`, iOS `com.coinex.vault`) is a self-custodial multi-signature wallet from the group behind the CoinEx exchange, published on Android under ViaBTC and on iOS under Coinex Global Limited. It is marketed for enterprises and high-net-worth users, turning an offline mobile device into a cold-wallet carrier under a "multi-signature + cold wallet" model, with a request → approval → multi-sign → broadcast workflow and configurable m/n signing (n up to 15). It supports BTC and many other chains.

## Testing and Analysis

### Self-custody is genuine

The app generates a standard 12-word BIP39 recovery phrase on the device and displays it to the user. Using a throwaway wallet created solely for this test (no funds were ever sent to it), the recovery phrase restored cleanly in an independent wallet:

- The 12-word phrase was imported into Electrum as a BIP39 seed with legacy P2PKH derivation (`m/44'/0'/0'`).
- Electrum reproduced the app's first receiving address exactly: `1L7zmVEL87AsoZhpA3qX1FjCejURHfU9Rp`.
- Evidence screenshots: [seed phrase and matching address](https://x.com/BitcoinWalletz/status/2079884576026173834).

Because a standard BIP39/BIP44 seed recovered the same address in third-party software, the user has independent control of the wallet and can recover the funds without CoinEx. This is not a custodial product in the sense that the user is not dependent on CoinEx to access the funds. It does not, however, prove that CoinEx never received or retained a copy of the phrase — the restoration test cannot establish that, and a closed binary could in principle transmit the seed (see below). CoinEx's own [service agreement](https://vault.coinex.com/service) separately claims the mnemonic is generated and kept locally on the device.

### But the app is closed source

Self-custody alone is not verifiable without the app's source: a closed binary that shows you a seed can still generate it with weak randomness, exfiltrate it, or contain a backdoor, none of which can be ruled out by black-box testing. No source repository for either the Android or iOS app could be found:

- Neither official GitHub organisation — [github.com/viabtc](https://github.com/viabtc) nor [github.com/coinexcom](https://github.com/coinexcom) — hosts the wallet app; their public repositories are exchange, mining and blockchain-infrastructure code (the closest, `viawallet_core`, is a library for the separate ViaWallet product, not this app).
- A repository search for the Android package ID returned no relevant mobile-app repository: <https://github.com/search?q=com.viabtc.coldwallet&type=repositories>.
- Code searches for both `com.viabtc.coldwallet` and `com.coinex.vault` returned no application source; the only match for the latter is this WalletScrutiny entry itself.

### Verdict: nosource

The wallet is genuinely self-custodial, but with no published source code its handling of the keys cannot be independently verified or reproducibly built. It therefore receives our **nosource** verdict.
