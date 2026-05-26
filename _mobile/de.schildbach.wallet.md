---
title: Bitcoin Wallet
bitcoinOrgId: bitcoinwallet
verdict: sourceavailable
meta: removed
date: 2025-05-30
authors:
- leo
- danny
- keraliss
website: https://github.com/bitcoin-wallet/bitcoin-wallet
repository: https://github.com/bitcoin-wallet/bitcoin-wallet
developerName: Bitcoin Wallet developers
redirect_from:
- /schildbach/
- /de.schildbach.wallet/
- /posts/2019/10/schildbach/
- /posts/de.schildbach.wallet/
- /android/de.schildbach.wallet/
android:
  appId: de.schildbach.wallet
  altTitle: Bitcoin Wallet (Schildbach)
  users: 10000000
  released: 2011-03-01
  updated: 2025-03-06
  version: '10.25'
  reviews: 2098
  icon: de.schildbach.wallet.png
  signer: 58dcd8a0edf2a590683ba022d22a8dca5659aabf4728741a5c07af738d53db38
  alternativeStores:
  - fdroid

---

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/1d32c0fcf0f4c6b16283a4195f0c94ce59bc4263/_android/de.schildbach.wallet.md)*

## The Removal of Bitcoin Wallet from Google Play: Significance and Implications

The removal of Bitcoin Wallet (de.schildbach.wallet) from Google Play could affect a significant number of users because it had over 100 million downloads. This application stood as one of the most trusted and widely used Bitcoin wallets in the Android ecosystem. What makes this situation particularly concerning is that Bitcoin Wallet is both source available and reproducible, meaning its code can be independently verified and built by security researchers. Google's decision stems from their new validation process, which apparently doesn't accommodate decentralized teams and development processes—the very organizational structure that has made Bitcoin Wallet a trusted tool since its release in 2011.

While technically savvy users can still obtain the wallet through F-Droid or build it themselves using the reproducible build instructions, these alternatives present significant barriers for average users. F-Droid remains relatively unknown to mainstream Android users, requiring them to enable installation from "unknown sources"—a step many users have been conditioned to avoid for security reasons. This shift to F-Droid also raises questions about how the wallet can be properly tested and verified within WalletScrutiny's existing frameworks, as the testing infrastructure may need adaptation to accommodate apps from different distribution platforms.

**Note:** For more details about this issue, see the [GitLab work item #738](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/work_items/738).
