---
title: Prosper Wallet
date: 2026-09-15
authors:
- danny
website: https://prosperlink.co
redirect_from:
- /android/com.prosperlink.wallet/
- /iphone/com.prosperlink.prosperwallet/
- /mobile/com.prosperlink.prosperwallet/
android:
  appId: com.prosperlink.wallet
  users: 100
  appCountry: us
  released: 2026-03-10
  updated: 2026-08-28
  version: 1.0.13
  icon: com.prosperlink.wallet.png
  meta: fewusers
  verdict: nobtc
  developerName: Prosperlink
iphone:
  appId: com.prosperlink.prosperwallet
  idd: '6760371341'
  appCountry: us
  released: 2026-03-24
  updated: 2026-09-04
  version: 1.0.14
  reviews: 14
  icon: com.prosperlink.prosperwallet.jpg
  meta: ok
  verdict: nobtc
  developerName: Prosper Link

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6760371341" author="overtorment" severity="critical" finding="Enrollment POSTs mnemonic and passcode. Login returns the mnemonic. Persist paths send ciphertext plus the encryption code plus the password." note="Per overtorment’s analysis of the iPhone app, build 1.0.13: signing up through the Prosperlink Digital Membership sends the new 12-word recovery phrase and the wallet passcode to Prosper’s wallet service unencrypted, and logging in returns the phrase from the server. Every way of creating or importing a wallet also sends the encrypted phrase together with its encryption code and the app password, so the server can decrypt it. The app’s sign-up screen says “Your keys are encrypted and stay on this device.” overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

Prosper Wallet, published by ProsperLink LLC, is a crypto wallet built around Trusted Smart Chain (TSC). It can create or import wallets and send and receive TSC, and it tracks daily node rewards. It also offers in-app messaging with other Prosperlink users. The Google Play description presents it as a wallet "designed specifically for Trusted Smart Chain (TSC)". The App Store description adds Solana, Ethereum, Base, BNB and XRP. Neither mentions Bitcoin.

## Testing and Analysis

This assessment was recorded on 2026-09-15.

### The app offers no Bitcoin

We installed the Android app from [Google Play](https://play.google.com/store/apps/details?id=com.prosperlink.wallet), where the current version is 1.0.13. On the **Create account** screen, the app offers three ways to start:

- a local recovery phrase ("Create seed phrase")
- an email sign-up ("Create ProsperWallet")
- a Prosperlink Digital Membership

We chose **Create seed phrase**. The app showed a 12-word recovery phrase with a "Copy recovery phrase" button, then opened the new wallet.

The wallet's **Assets** tab lists seven cryptocurrencies:

- TSC (TSC)
- ETH (Ethereum)
- BNB (BNB Smart Chain)
- ETH (Base)
- SOL (Solana)
- XRP (XRP Ledger)
- Stellar (Stellar)

Bitcoin is not among them. We published screenshots of the [Create account screen](https://x.com/BitcoinWalletz/status/2099761500084985981/photo/1), the [recovery phrase screen](https://x.com/BitcoinWalletz/status/2099761500084985981/photo/2), the [wallet home screen](https://x.com/BitcoinWalletz/status/2099761500084985981/photo/3) and the [asset list](https://x.com/BitcoinWalletz/status/2099761500084985981/photo/4).

The store listings agree: neither mentions Bitcoin. The in-app list also includes Stellar, which neither listing mentions.

### overtorment's findings were not tested

overtorment reports that every way of creating or importing a wallet sends the encrypted recovery phrase, its encryption code and the app password to the server. That includes the local "Create seed phrase" option we used. We did not monitor the app's network traffic, and we did not use the email or membership sign-ups, so we could not check his findings. He analysed the iPhone build, and the Android app is a separate binary.

### Verdict: does not support Bitcoin (BTC)

The released app's own asset list has no Bitcoin. A wallet that offers no Bitcoin cannot hold or send native Bitcoin, whatever else it supports. Both entries on this page are the same product and neither store description mentions Bitcoin, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**. The review stops at the Bitcoin-support gate. Custody and source availability are not assessed.
