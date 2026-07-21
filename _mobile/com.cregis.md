---
title: Cregis:BTC, ETH Wallet & Pay
date: 2026-07-21
authors:
- danny
website: https://www.cregis.com
twitter: 0xCregis
redirect_from:
- /android/com.cregis/
- /iphone/com.cregis/
android:
  appId: com.cregis
  users: 1000
  appCountry: us
  released: 2023-04-05
  updated: 2026-07-10
  version: 3.7.4
  icon: com.cregis.png
  meta: ok
  verdict: custodial
  developerName: Cregis
iphone:
  appId: com.cregis
  idd: '6447176492'
  appCountry: us
  released: 2023-04-04
  updated: 2026-07-15
  version: 3.7.4
  reviews: 3
  icon: com.cregis.jpg
  meta: ok
  verdict: custodial
  developerName: Cregis Technology Limited

---

## Android

## App Description

Cregis is a digital asset wallet and payment application published by Cregis Technology Limited and distributed for Android and iOS under the identifier `com.cregis`. The developer describes it as an enterprise-oriented, self-custodial MPC wallet in which private keys are split into shards held across multiple user devices, supporting BTC, ETH, USDT and USDC across a stated 40+ networks. The store listings further describe a crypto payment engine with SDK and API access, a TRON energy purchasing service offered as an alternative to staking TRX, and a multi-user account management suite with role-based permissions.

## Testing

We created a wallet in the app and were shown a **15-word mnemonic phrase**, so the app does present recovery words to the user. The wallet's Bitcoin receiving address was `37o76FmuJfRWEepdEBHB7Ge4rH6VWz5ozi`, which we confirmed to be a well-formed mainnet P2SH address (version byte 5, valid Base58Check checksum).

We then attempted to reconstruct the wallet independently of Cregis. The 15 words are a valid BIP39 length (160-bit entropy), and we imported them into Electrum using the BIP39 seed option, checking all three standard Bitcoin derivation schemes:

| Script type | Derivation path | Result |
| --- | --- | --- |
| P2SH-SegWit | `m/49'/0'/0'` | address not derived |
| Legacy | `m/44'/0'/0'` | address not derived |
| Native SegWit | `m/84'/0'/0'` | address not derived |

**None of the three produced `37o76FmuJfRWEepdEBHB7Ge4rH6VWz5ozi`.** Screenshots of this testing are recorded [here](https://x.com/BitcoinWalletz/status/2079405968723689640).

## Analysis

The app displays a mnemonic phrase, but that phrase does not reproduce the wallet's own address under any standard derivation. A recovery phrase that cannot recreate the wallet it came from is not a backup in any sense a user can rely on: it does not let the holder of the words recover their funds using any independent wallet software.

This is consistent with what Cregis documents about its own architecture. Their [Terms of Service](https://support.cregis.com/terms-and-conditions/cregis-standard-terms-of-service) states that "Cregis splits the wallet's private key into multiple shards" and that "the original private key never appears during the assembly process", and describes the mnemonic only as something users "can use for key permission operations" — notably not as a wallet backup. The same document confirms the wallet "currently does not support importing external wallets", so no round trip in either direction is available to the user. The most consistent reading of our result is that the 15 words authorise access to a key shard or to the Cregis service, rather than encoding the key material that controls the address.

The practical consequence is what matters for the verdict: the user cannot derive, export, or reconstruct the keys controlling their coins outside of Cregis's infrastructure. Access to funds depends on Cregis's continued operation and cooperation. By walletscrutiny.com's definition this makes the app **custodial**, notwithstanding that it is marketed as a "Self-Custodial Wallet" and that a mnemonic is shown to the user.

We note the limits of this test. Electrum scans a bounded range of addresses per path, and we cannot exhaust every possible nonstandard derivation path, account index, or an undisclosed BIP39 passphrase. It remains possible that some proprietary derivation reproduces the address. That possibility does not change the outcome: a recovery phrase that requires undocumented, vendor-specific derivation to be useful provides no independent recovery path for the user, which is the property the self-custodial claim rests on.

