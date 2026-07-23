---
title: Coldlar - Crypto & Web3 Wallet
date: 2026-07-23
authors:
- danny
website: https://web.archive.org/web/20250409012753/https://www.coinlink.tech/
appCountry: us
redirect_from:
- /iphone/com.coinlinksec/
iphone:
  appId: com.coinlinksec
  idd: '6479732222'
  appCountry: us
  released: 2024-03-26
  updated: 2026-07-13
  version: 1.20.4
  reviews: 5
  icon: com.coinlinksec.jpg
  meta: ok
  verdict: nowallet
  developerName: CoinLink SecureTech Limited

---

## App Description

Coldlar (bundle `com.coinlinksec`, seller *CoinLink SecureTech Limited*, listed under Utilities) is the mobile companion app for the ColdLar line of NFC hardware cold wallets, not a standalone wallet. On its [App Store listing](https://apps.apple.com/us/app/id6479732222) they say the app is *"used in conjunction with hardware wallets"*, connects to the device over NFC, and is used to view balances / transaction history and to send, receive and broadcast transactions for BTC and other chains, while the signing keys stay on the hardware device (they describe it as syncing *"the encrypted asset transaction records of your Touch hardware cold wallet"*). They present it as key-less by design, so it should expose no in-app seed phrase or private-key material to generate, back up, or export — a point we could not verify without a device (see Testing and Analysis).

## App Description from App Store

> 1. Real-time transaction tracking:
>
> 2. Comprehensive multi-chain support:
>
> Support mainstream public chains such as Bitcoin, Ethereum, BNB Chain, Tron;
>
> 3. NFC connection to hardware wallet:
>
> Support advanced NFC technology.
>
> 4. Multilingual support:
> 
> 5. Security:
>
> Coinbag adopts advanced security measures to protect users' assets and private keys, including multi-signature, etc., to ensure the security of users' assets.

## Testing and Analysis

We do not have an iPhone or a ColdLar device, and iOS binaries cannot be reproduced, so this assessment is based solely on publicly available material rather than hands-on testing.

The public sources consistently describe this as a **companion / key-less app** whose paired hardware device holds the keys and performs signing:

- **App Store description** (provider's own text): *"Coinbag is a crypto&web3 wallet application used in conjunction with hardware wallets… No need to carry your hardware wallet. Just keep it safely at home."* — [apps.apple.com/us/app/id6479732222](https://apps.apple.com/us/app/id6479732222)
- **WalletScrutiny's ColdLar hardware reviews**, which document the same architecture and name the Android companion package `com.coldlar.hotwallet` as a balance-check / broadcast app that does not hold keys — [walletscrutiny.com/hardware/coldlartouch](https://walletscrutiny.com/hardware/coldlartouch/)
- **Provider's architecture description** (claim): the cold device generates and stores the private keys and signs transactions offline, while the companion app only checks balances and broadcasts — [medium.com/@coldlarwallet](https://medium.com/@coldlarwallet/the-technical-principles-of-cold-and-hot-wallet-isolation-843f102b6db3)

Taken together, the public evidence supports a **`nowallet`** classification: the app manages no keys of its own and defers all custody-critical behaviour to the separately-reviewed ColdLar hardware wallet, {% include walletLink.html wallet='hardware/coldlar.ultra' verdict='true' %}. This remains contingent on one unverifiable point — that the app cannot also operate as a standalone hot wallet — which only a device test could confirm; the App Store text describes companion-only operation but does not explicitly state "the app never stores private keys."

Note: the App Store description text refers to the app as *"Coinbag"* even though the listing title is *"Coldlar"*.
