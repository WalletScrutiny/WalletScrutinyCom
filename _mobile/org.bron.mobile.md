---
title: Bron Wallet
date: 2026-10-20
authors:
- danny
website: https://bron.org/
twitter: BronWallet
android:
  appId: org.bron.mobile
  users: 1000
  appCountry: us
  released: 2026-03-10
  updated: 2026-10-18
  version: 1.1.538
  reviews: 6
  icon: org.bron.mobile.webp
  meta: ok
  verdict: custodial
  developerName: Bron Foundation
iphone:
  appId: org.bron.mobile
  idd: '6757437880'
  appCountry: us
  released: 2026-05-18
  updated: 2026-10-17
  version: 1.1.538
  reviews: 36
  icon: org.bron.mobile.webp
  meta: ok
  verdict: custodial
  developerName: Bron Foundation

---

## App Description

Bron Wallet is a multi-chain wallet by the Bron Foundation, published for Android and iOS under the identifier `org.bron.mobile`. Its website lists Bitcoin among the supported networks, and the app offers cross-chain swaps, staking and DeFi permission management. The developer claims the wallet is non-custodial and uses Multi-Party Computation (MPC), splitting signing authority into shards held by several parties. It also claims Bron "cannot initiate, approve, or execute any transaction" without the user's shard. The app has no seed phrase; recovery relies on "Guardians" or a trusted third party. Bron publishes its cryptography library ([bron-crypto](https://github.com/bronlabs/bron-crypto)) and SDKs; we found no published source code for the wallet app.

## Analysis

### What we observed

We installed version 1.1.538 from Google Play and created an account:

1. "Create an account", then "Continue with email" or "Continue with Google". Signing up requires agreeing to the Terms of Use.
2. Choose a nickname, create a passkey, then set phone biometrics or a PIN code.
3. Create a "Bron tag".
4. Tick a required box: "I appoint Qrypto as my trusted third party and agree to their user agreement." The app notes: "You appoint a trusted third party directly who will hold your third shard for recovery purposes."
5. We skipped the optional FaceScan recovery.
6. The account is created after several fingerprint scans.
7. "Deposit Crypto" > "Deposit BTC" shows a native SegWit (`bc1q…`) address and QR code.

Screenshots of the deposit screen and the account are recorded [here](https://x.com/BitcoinWalletz/status/2112372538936569959); the earlier signup steps are our notes and are not pictured. The app displayed a Bitcoin receiving address; we did not send or receive a transaction. During signup the app offered no seed phrase and no key export, as advertised. We did not test any recovery process.

### What Bron documents

These points come from Bron's own documents, not from our testing:

- **Shards:** the [Wallet Terms](https://bron.org/wallet-terms) split the key into three "Shards": "One Shard will be provided to you, one Shard will be retained by us, and one Shard will be provided to the TTP". They add: "At least two Shards must participate in a coordinated MPC signing process to authorize transactions." The [FAQ](https://bron.org/faq) states: "Any two of the three shards can recreate the key."
- **Recovery without your device:** per the FAQ, if you lose all devices, "Qrypt generates a new shard, together with the cryptographic material held by Bron."
- **Emergency key export:** the Wallet Terms say Bron "may make available" a "Key Export Feature" if Bron stops operating. A [support article](https://support.bron.org/en/articles/14171309-private-key-recovery-for-use-only-if-bron-shuts-down-permanently) describes the steps. They require a previously trusted device, plus a `.reconstruct` file from the third party (`bron.enquiries@qrypt.com`), after which the app displays the private keys. The article's import instructions cover EVM wallets, Solana, TON and Canton Coin; Bitcoin is not mentioned. We did not test this.

**Discrepancy in Bron's own statements:** the Play Store description says "Bron cannot initiate, approve, or execute any transaction without your shard signing first." By the FAQ and Wallet Terms quoted above, however, any two of the three shards are enough, so Bron's shard and the third party's shard together do not need the user's. Bron says both parties "act only on your instructions", and the FAQ says the third party is "contractually obliged to act on your instruction". These are contractual and organizational safeguards. Whether they are also enforced cryptographically could not be checked: we found no public source code for the wallet app, and we did not attempt any unauthorized signing.

**Discrepancy in the third party's name:** the signup checkbox we saw names "Qrypto". Bron's FAQ and [support pages](https://support.bron.org/en/articles/11514774-mpc-security-eliminating-single-points-of-failure) name "Qrypt" (Qrypt.com), and the recovery article's contact address is at qrypt.com. We did not find the "TTP Agreement" that the Wallet Terms say governs the third shard.

### Verdict

By Bron's published design, two parties other than the user, Bron and the third party, together hold enough shards to recreate the key or sign. The only documented way for the user to get a private key still depends on the third party. Our [custodial definition](/methodology/#custodial) states that a claim of access "shared between multiple parties" does not change the outcome. Based on Bron's published architecture, we rate Bron Wallet **custodial**, even though it is marketed as non-custodial.
