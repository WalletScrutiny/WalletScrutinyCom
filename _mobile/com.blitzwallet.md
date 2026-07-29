---
title: 'Blitz: Bitcoin Payments Wallet'
date: 2025-11-03
authors:
- danny
website: https://blitzwalletapp.com/
twitter: blitzwalletapp
social:
- https://www.youtube.com/@BlitzWalletApp
features:
- camera
- fingerprint
- foss
- liquid
- ln
- multiAccount
redirect_from:
- /android/com.blitzwallet/
android:
  appId: com.blitzwallet
  users: 1000
  appCountry: us
  released: 2025-09-29
  updated: 2026-07-27
  version: 0.7.14
  icon: com.blitzwallet.png
  meta: ok
  verdict: custodial
  developerName: Blitz Wallet
  repository: https://github.com/BlitzWallet/BlitzWallet

---

## App Description

**Blitz Wallet** is an open-source Bitcoin and Lightning wallet.

It supports on-chain Bitcoin and Lightning transactions.

## Updated Verdict

**Verdict updated to `custodial` (see rationale below) — pending Luis/team review of this MR.**

Prompted by [GitLab issue #947](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/work_items/947), tracking public claims that Spark-based wallets do not implement unilateral exit in practice. Governing precedent: Wallet of Satoshi's Spark "Self-Custody Mode" was reviewed for the same question and kept at `custodial`, because normal Spark transfers require the operator's co-signature — see [`_mobile/com.livingroomofsatoshi.wallet.md`, lines 103-105](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_mobile/com.livingroomofsatoshi.wallet.md#L103-L105). Blitz Wallet is reviewed below against that same bar.

All code citations below are pinned to two commits: Blitz Wallet Android at [`BlitzWallet/BlitzWallet@546fcfc8`](https://github.com/BlitzWallet/BlitzWallet/tree/546fcfc84167136316adab2ed3feda20d4718134), and its `@buildonspark/spark-sdk` dependency at the matching source commit [`buildonspark/spark@87f3b357`](https://github.com/buildonspark/spark/tree/87f3b357a9820e489647b0fa17192b0c45cb6b5f). `package.json` declares [`^0.8.5`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/package.json#L23); the yarn lockfile resolves that to the exact published version [`0.8.5`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/yarn.lock#L1796-L1798).

### 1. Does the app support (sending/receiving) on-chain BTC?

Yes, but on-chain receive is not the default action. The home screen has two separate buttons: the main "Receive" (down-arrow) button opens a Spark-native menu (Quick Pay/username, Create Invoice, Create Pool, Add Contact) — [`handleReceive`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/app/components/admin/homeComponents/homeLightning/sendReciveBTNs.js#L51-L65). A separate "Deposit" button opens a different menu that does include "Deposit Bitcoin / Receive via on-chain address" — [`handleDeposit`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/app/components/admin/homeComponents/homeLightning/sendReciveBTNs.js#L69-L83), [on-chain option label](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/app/components/admin/homeComponents/homeLightning/halfModalDepositFunds.js#L282-L286).

That "on-chain" address is not a locally-derived wallet address — selecting it calls the SDK's [`wallet.getStaticDepositAddress()`](https://github.com/buildonspark/spark/blob/87f3b357a9820e489647b0fa17192b0c45cb6b5f/sdks/js/packages/spark-sdk/src/spark-wallet/spark-wallet.ts#L1616) (app call site: [`app/functions/spark/index.js#L467-L482`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/app/functions/spark/index.js#L467-L482)), which in turn requests the address from the **Spark coordinator** via [`generateStaticDepositAddress()`](https://github.com/buildonspark/spark/blob/87f3b357a9820e489647b0fa17192b0c45cb6b5f/sdks/js/packages/spark-sdk/src/services/deposit.ts#L161-L200), a live RPC (`generate_static_deposit_address`) that returns a coordinator-signed proof. The address cannot be generated offline.

On-chain sending works through [`sendSparkBitcoinPayment()`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/app/functions/spark/index.js#L1268-L1307), which calls the SDK's `wallet.withdraw()`. Reading the SDK implementation, `withdraw()` is explicitly a **[Cooperative Exit Flow](https://github.com/buildonspark/spark/blob/87f3b357a9820e489647b0fa17192b0c45cb6b5f/sdks/js/packages/spark-sdk/src/spark-wallet/spark-wallet.ts#L4904-L5126)** — it calls the Spark Service Provider's `requestCoopExit`/`completeCoopExit` endpoints to produce the on-chain payout transaction. Generating the app's on-chain receive address and completing on-chain withdrawals both depend on Spark server-side infrastructure.

### 2. Does the app allow the export of BIP-39 seed phrases?

Yes. The app exports a standard 12-word BIP-39 mnemonic — confirmed via its `@scure/bip39` usage in [`app/functions/seed.js#L1-L25`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/app/functions/seed.js#L1-L25) and [`app/functions/isValidMnemonic.js#L1-L2`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/app/functions/isValidMnemonic.js#L1-L2) — but Spark balances depend on Spark-specific BIP-32 derivation paths on top of that mnemonic (see Q3). The Settings screen displays the live wallet's mnemonic in full, with copy-to-clipboard and a SeedQR export view — [`app/components/admin/homeComponents/settingsContent/seedPhrasePage.js#L1-L34`](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/app/components/admin/homeComponents/settingsContent/seedPhrasePage.js#L1-L34), matching the project's own claim: [README.md, "Self-custodial recovery"](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/README.md#L43).

### 3. Are the seed phrases importable to wallets outside of the Spark SDK ecosystem?

The words themselves are valid input to any standard BIP-39 wallet, but generic wallets will not find or use the Spark balance by default, because they do not implement Spark's derivation scheme or off-chain state model. The SDK derives every functional key (identity, signing, deposit, static deposit, HTLC preimage) under a **custom, Spark-specific derivation path** — `m/8797555'/{accountNumber}'/{0-4}'` — not any registered BIP44/49/84/86 purpose code a general-purpose wallet would try by default. See [`DefaultSparkKeysGenerator.deriveKeysFromSeed()`](https://github.com/buildonspark/spark/blob/87f3b357a9820e489647b0fa17192b0c45cb6b5f/sdks/js/packages/spark-sdk/src/signer/signer.ts#L52-L77).

Practical effect: importing a Blitz Wallet seed phrase into a standard wallet (e.g. Electrum) is expected to derive an unrelated, empty set of keys under that wallet's own default path, rather than surfacing any Blitz/Spark balance. This is expected because generic wallets do not implement Spark's derivation scheme or off-chain state model — it does not by itself confirm or rule out unilateral exit, which is a separate question addressed next.

### 4. Is it possible for users to commence unilateral exit?

No path was found in Blitz Wallet's own client code. Notably, unlike some other Spark-SDK wallets reviewed under #947, `@buildonspark/spark-sdk` 0.8.5 **does** publicly export real, operator-independent unilateral-exit machinery — [`buildUnilateralExitChain()`](https://github.com/buildonspark/spark/blob/87f3b357a9820e489647b0fa17192b0c45cb6b5f/sdks/js/packages/spark-sdk/src/utils/unilateral-exit.ts#L103) and [`constructUnilateralExitFeeBumpPackages()`](https://github.com/buildonspark/spark/blob/87f3b357a9820e489647b0fa17192b0c45cb6b5f/sdks/js/packages/spark-sdk/src/utils/unilateral-exit.ts#L198) — callable using leaf data (`wallet.getLeaves()`) the app already fetches, with no SSP cooperation required to construct the exit chain.

An exhaustive, file-by-file audit of every `@buildonspark/spark-sdk` call in the Blitz Wallet app (34 distinct SDK methods across the 5 files that import the package) found no call to either function, or to any other export of `unilateral-exit.ts`. The app's only on-chain withdrawal path is the cooperative `wallet.withdraw()` described in Q1. No UI element, settings screen, or documentation in the repository references "unilateral exit" or an operator-independent recovery flow (`grep -n -iE "unilateral"` across the full repo: zero hits).

Blitz Wallet also operates its own standalone recovery tool, [`BlitzWallet/spark-recover`](https://github.com/BlitzWallet/spark-recover), [hosted at `recover.blitzwalletapp.com` and self-described as "Self-custodial. Stateless. Trustless. No third parties."](https://github.com/BlitzWallet/spark-recover/blob/eddcd34735436a83b9060f4a2069e6a1a884097c/README.md#L4-L6). Reviewed at commit [`eddcd347`](https://github.com/BlitzWallet/spark-recover/tree/eddcd34735436a83b9060f4a2069e6a1a884097c), pinned to [`@buildonspark/spark-sdk@^0.6.0`](https://github.com/BlitzWallet/spark-recover/blob/eddcd34735436a83b9060f4a2069e6a1a884097c/package.json#L13): it calls the same cooperative [`wallet.transfer()`](https://github.com/BlitzWallet/spark-recover/blob/eddcd34735436a83b9060f4a2069e6a1a884097c/src/functions/spark/index.js#L186) and [`wallet.withdraw()`](https://github.com/BlitzWallet/spark-recover/blob/eddcd34735436a83b9060f4a2069e6a1a884097c/src/functions/spark/index.js#L329) methods as the main app — it is a second client for the same operator-dependent operations, not an independent exit mechanism. It is useful if the main app becomes unavailable while Spark's operators are still online and cooperating, but it does not answer what happens if they are not.

### Rationale for the verdict change

Under the WoS precedent — self-custodial requires exclusive user control as the _normal_ path, not just a theoretical capability elsewhere in the dependency tree — Blitz Wallet's shipped app does not meet that bar today: the app's Spark send/withdraw paths, on-chain receive-address generation, and recovery tool all depend on Spark operator/coordinator cooperation. The verdict above has been updated from `sourceavailable` to `custodial` accordingly, consistent with the WoS/#947 precedent, pending team review of this MR.

## Analysis (Previous)

We installed the app and created a BTC wallet with send/receive functions. We found its repository and confirm that it is **source-available**.

{% include featureEvidence.html feature="ln" quote="Blitz Wallet is a React Native application that allows users to interact with the Bitcoin Lighting Network in a self-custodial way." source="[GitHub README](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/README.md)" %}

{% include featureEvidence.html feature="liquid" quote="Using a Liquid QR Code" source="[GitHub README](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/README.md)" %}

{% include featureEvidence.html feature="fingerprint" quote="Opt-in Biometric login" source="[GitHub README](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/README.md)" %}

{% include featureEvidence.html feature="foss" quote="Blitz is released under the terms of the Apache 2.0 license. See LICENSE for more information." source="[License](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/LICENSE)" %}

{% include featureEvidence.html feature="multiAccount" quote="Ability to create sub-accounts within wallet" source="[GitHub README](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/README.md)" %}

{% include featureEvidence.html feature="camera" quote="From camera roll" source="[GitHub README](https://github.com/BlitzWallet/BlitzWallet/blob/546fcfc84167136316adab2ed3feda20d4718134/README.md)" %}
