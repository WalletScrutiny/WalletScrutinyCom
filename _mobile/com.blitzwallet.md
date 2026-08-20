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

## Update to Verdict 2026-08-20

**Verdict remains `custodial`, but for different reasons than we gave before. Part of our previous analysis is now wrong, and we correct it below.**

On 2026-08-18 Blitz Wallet [said publicly](https://x.com/BlitzWalletApp/status/2089706250451788015) that a recent update makes the app compatible with Blink's Spark unilateral-exit process. We re-checked the code to see whether that changes the verdict. [GitLab issue #947](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/work_items/947) tracks this question across all Spark wallets.

Everything below is pinned to [`BlitzWallet@b3891c86f`](https://github.com/BlitzWallet/BlitzWallet/tree/b3891c86f29c0afec6476c7437f831acc75b0208), the Spark SDK at [`buildonspark/spark@2f0e6062`](https://github.com/buildonspark/spark/tree/2f0e6062bf9e660b8a1e0a22c9f28bb003b05db5), and Blink's tool at [`blinkbitcoin/spark-unilateral-exit@1a33a032`](https://github.com/blinkbitcoin/spark-unilateral-exit/tree/1a33a032b90b6d28afbd6a54f08cae9d843dbfbc). Code blocks are quoted verbatim from those commits; where a block is abridged it is marked.

### First, what the question actually is

In Spark, your money sits behind two signatures: yours and the Spark operators'. Every ordinary payment needs both. The operators cannot spend your money on their own, but they can refuse to move it.

So the question that decides self-custody is the escape route. Spark's answer is called **unilateral exit**: you publish a stack of already-signed transactions to the Bitcoin blockchain yourself, wait out a delay, and claim your coins without asking anyone. If that works, the operators refusing is an inconvenience. If it doesn't, it is permanent.

### Correcting our previous analysis

Two things we published are no longer true. They were accurate when written against commit `546fcfc8`, and they are wrong at `b3891c86f`:

- We wrote *"No path was found in Blitz Wallet's own client code."* The app now does call the Spark SDK's exit machinery.
- We wrote that searching the repository for "unilateral" returned *zero hits.* It now returns many.

### What Blitz Wallet built, and why it matters

To claim your money on the blockchain you need more than your own piece of it. Spark stores balances in a tree, and your piece — a "leaf" — can only be published if every transaction above it is published first. That chain of parent records is held by the Spark operators.

This is the SDK function that collects it (`spark-sdk/src/utils/unilateral-exit.ts:103-108`; the walk up the tree runs from line 112 to 163):

```ts
export async function buildUnilateralExitChain(
  node: TreeNode,
  nodeMap: Map<string, TreeNode>,
  sparkClient?: SparkServiceClient,
  network: Network = Network.MAINNET,
): Promise<TreeNode[]> {
```

and this is what happens when the operators reply without the parent record it asked for (same file, lines 144-149; a failed query is wrapped separately at 150-155):

```ts
        parentNode = nodeMap.get(currentNode.parentNodeId);
        if (!parentNode) {
          throw new Error(
            `Parent node ${currentNode.parentNodeId} not returned by query_nodes. Exit chain is incomplete.`,
          );
        }
```

Either way the chain cannot be completed. In plain terms: **the records you need in order to escape the operators normally come from the operators.** Ask for them too late and there is nothing to collect.

Blitz Wallet's update addresses exactly this. The app now calls that function to gather the records ahead of time (`app/functions/spark/index.js:569-574`):

```js
          const chain = await buildUnilateralExitChain(
            leaf,
            nodeMap,
            sparkClient,
            Network.MAINNET,
          );
```

**And it starts doing so automatically, without the user knowing to ask.** Collection begins when the wallet connects (`context-store/sparkContext.js:2290-2295`):

```js
  // On the first successful connect for an account: hydrate the leaves summary
  // from the local SQLite store (so the Wallet Leaves page has cached totals
  // immediately, even offline), then kick off one forced sync to freshen it.
  useEffect(() => {
    if (!sparkInformation.didConnect) return;
    if (!sparkInformation.identityPubKey) return;
```

ending in a forced sync (`sparkContext.js:2316`):

```js
      reconcileLeaves(true);
```

which refreshes the stored parent records on every fresh snapshot (`sparkContext.js:1206-1208`):

```js
        // Backfill the exit-node ancestors for this fresh snapshot (background,
        // not awaited — it self-throttles and single-flights).
        reconcileExitNodes(rawLeaves);
```

This is a genuine improvement and it counts in Blitz Wallet's favour. A user who never opens a settings screen may still hold what an exit requires. What the code guarantees is that collection is *attempted* automatically and retried on later activity; whether it completes for every leaf on a real wallet is not something source alone can tell us.

### What the app still cannot do

It collects the records and writes them into the file. What it never does is use them to construct, sign or broadcast an exit.

The Spark SDK contains a second function, `constructUnilateralExitFeeBumpPackages()`, which builds the actual transactions that move your money. Blitz Wallet never calls it:

```
$ git grep -n 'constructUnilateralExitFeeBumpPackages' b3891c86f
(no matches)
```

There is no signing, no broadcasting, no waiting out the delay, no final sweep. The app's exit feature ends by writing a file (`exportLeavesProgress.js:168-170`):

```js
        const fileData =
          `{"schema":"spark.unilateral-exit-bundle.v1",` +
          `"createdAt":${JSON.stringify(new Date().toISOString())},` +
```

To actually recover the money you take that file to [Blink's command-line tool](https://github.com/blinkbitcoin/spark-unilateral-exit) — software from an unrelated company — and run the recovery yourself.

### It has been done for real, but never from a Blitz file

This is not theoretical. Blink [documented a real recovery](https://github.com/blinkbitcoin/spark-unilateral-exit/blob/1a33a032b90b6d28afbd6a54f08cae9d843dbfbc/docs/mainnet-exit-case-study.md) on Bitcoin mainnet, begun on 2026-07-08, with transaction IDs anyone can check. It is worth knowing what it cost:

| | |
|---|---|
| Wallet | 100,000 sats in 22 leaves |
| Full 22-leaf exit graph | 253 transaction packages |
| Expected to reach the destination | ~82,028 sats at 1 sat/vB |
| Left behind as dust | 18 leaves, 9,888 sats |
| Time | multi-week — each level waits for a block, then a delay of 1,400 blocks for this wallet's leaves (~2,000 for fresh ones) |

Those 253 packages describe exiting all 22 leaves; after a first attempt submitted them all, the recovery that was actually pursued covered only the four economical leaves. Recovering *every* leaf would have cost around 77,500 sats to get back 100,000. The exit did not finish quickly: the four refunds confirmed by 2026-08-01, and at Blink's [2026-08-14 follow-up](https://github.com/blinkbitcoin/spark-unilateral-exit/blob/1a33a032b90b6d28afbd6a54f08cae9d843dbfbc/docs/mainnet-exit-case-study-follow-up.md) the final sweeps were still outstanding. That follow-up also revises the expected recovery down from an earlier 89,668-sat projection to ~82,028, because the exits completed by a costlier route than first assumed.

That recovery used Blink's own file, produced by Blink's own exporter. **We found no documented recovery, start to finish, from a file produced by Blitz Wallet** — not in Blitz Wallet's repository or release notes, not in Blink's repository or case studies, and not in Blitz Wallet's own public statement, which points users to Blink's tool rather than citing a completed Blitz recovery.

The same write-up records something that matters here. Blink's first file was silently incomplete — the operators' bulk lookup omits the very top record for older wallets, so all 22 chains had a gap — and their exporter now, in their words, *"refuses to write a bundle with open chains."*

Blitz Wallet's exporter performs no equivalent check. Its only completeness-related indicator is this (`exportLeavesProgress.js:123`):

```js
        const hasAncestors = nodeParts.length > 0;
```

That asks whether at least one parent record was stored anywhere in the wallet. It does not validate that any individual leaf has a complete chain to the top. Its effect is to select which note the file carries about itself — so a single stored record can produce a file whose own description claims complete chains, with no per-leaf check behind it.

To be clear about where the weakness is not: while collecting, the app fails loudly. If the operators do not return a parent, the SDK throws, the app catches it, and that leaf is left pending and retried later. The gap is at export time, where whatever happens to be cached is written out without checking that any leaf's chain reaches the top.

### The seed phrase is not a second route

Blitz Wallet also said you can *"either use the Spark leaves cached by Blitz or go through Blink's recovery process using your Blitz seed phrase."*

Blink's own README opens by saying the opposite:

> Seed-only recovery is not sufficient once Spark operators are offline, because current leaves cannot be discovered from the seed alone.

Their command for fetching that data is described as ["Query live Spark leaves from a seed"](https://github.com/blinkbitcoin/spark-unilateral-exit/blob/1a33a032b90b6d28afbd6a54f08cae9d843dbfbc/README.md?plain=1#L41), and their own recovery diagram places it in the stage marked ["Preparation — Spark operators online"](https://github.com/blinkbitcoin/spark-unilateral-exit/blob/1a33a032b90b6d28afbd6a54f08cae9d843dbfbc/README.md?plain=1#L61).

Put simply: **your seed proves the money is yours. It does not tell anyone where it is.** The seed remains necessary — the tool derives the fee-funding key, the signing keys and the refund keys from it — but the fees themselves are paid by a separately funded on-chain UTXO, and the money is swept to an address you supply. What the seed cannot do is discover which leaves you own. Both routes therefore depend on data captured while the operators were still answering, and the seed-only route works only while that data remains available from them. It is unavailable in exactly the outage the recovery route exists to survive. (Operators can also be reachable and still refuse to authorise a transfer, which is its own reason to exit.)

### Small balances cannot be recovered this way

Recovering a leaf costs on-chain fees, so tiny leaves cost more to rescue than they hold. Blitz Wallet sets a floor (`app/functions/spark/leavesStorage.js:14-16`):

```js
// Leaves below this value cannot be unilaterally exited economically (fees
// exceed value). Mirrors the Spark unilateral-exit minimum.
export const EXIT_MIN_SATS = 16348;
```

Anything smaller is left out of the file (`exportLeavesProgress.js:142-146`):

```js
            if (Number(leaf.value || 0) < EXIT_MIN_SATS) {
              excludedCount++;
              excludedSats += value;
              continue;
            }
```

**Blitz Wallet does disclose this.** The Wallet Leaves screen shows a separate "Below threshold — Too small to exit alone" bucket with its count and value (`settingsContent/leaves/index.js:170-177`), and the exported file records the excluded count, sats and reason. The threshold is also sound: it matches the figure in [Spark's own documentation](https://docs.spark.money/wallets/unilateral-exit), and Blink's real dust leaves would have cost 2,100–4,600 sats each to recover.

The consequence is what matters for the verdict, not the disclosure: money below the floor cannot be recovered by this route at all, and if no leaf reaches the threshold the export produces nothing.

### Why the verdict stays `custodial`

Needing a second signature is not by itself custody. A Lightning channel partner co-signs every update too, and we do not call Lightning wallets custodial — because under [BOLT 5](https://github.com/lightning/bolts/blob/master/05-onchain.md) both sides always hold a signed transaction they can publish alone, with no help and no lookup. Spark is different: its safety also depends on operators deleting their old key, which Spark itself calls a ["moment-in-time" trust model](https://docs.spark.money/learn/trust-model), and its documentation lists [attacks by a previous owner, timelock defence and watchtowers](https://docs.spark.money/learn/limitations) as part of the design.

So we judge it on whether the escape route can actually be used:

> **Can a user, with only what the app gives them and expecting help from nobody, actually force their money onto the Bitcoin blockchain?**

Today the answer is still no:

1. The app cannot perform a recovery. It only writes a file.
2. The recovery needs a third party's command-line tool, plus fee funding the user supplies, run over several weeks.
3. The file's completeness is never checked leaf by leaf — and the people who built this tooling treat that failure as serious enough to refuse to write such a file at all.
4. We found no demonstrated recovery from a Blitz Wallet file. We would not normally require a wallet to prove its recovery path by drill, but this one is a single implementation of a new file format feeding a third party's tool, and the reference implementation's own first file was silently incomplete in exactly this way — the risk is demonstrated, not hypothetical.
5. Money below the exit threshold cannot be recovered by this route, and if every leaf is below it, the file cannot be produced.

This verdict is **not** based on the operators co-signing ordinary payments, and it is **not** based on the automatic collection described above, which works in Blitz Wallet's favour.

### What would change our verdict

1. One documented recovery, start to finish, from a file Blitz Wallet produced, with the operators treated as unavailable.
2. An exporter that refuses to write — or clearly marks — a file whose chains are incomplete, instead of the single global check shown above.
3. A path that still works once the operators are unreachable. The export is written to fall back on what is already stored, and its own comment says so — but its first action is a live request that nothing ever gives up on. The background code wraps the same call in a 15-second limit; the export calls it directly:

```js
        // Assemble the file from the cached leaves + cached exit nodes in
        // yielding batches. Works fully offline from cache — no dependency on
        // operators being reachable at export time.
```

```js
        const rawLeaves = await getSparkLeaves(currentWalletMnemoinc, false);
```

(the comment is at `exportLeavesProgress.js:112-114`; the live call it describes is the function's first action, at `:75`)

We traced that call through every layer on the Android native runtime and found no time limit at any of them: `index.js:515` hands it to the SDK's `getLeaves()` (`spark-wallet.ts:917`), which reaches `leaf-manager.ts:292` without setting a deadline; with no deadline the React Native connection layer installs no timer at all (`connection.react-native.ts:259-281`); and the Android gRPC module the SDK ships (`SparkGrpcModule.kt`, 575 lines) contains no timeout, deadline or keepalive anywhere, building a plain `OkHttpChannelBuilder` channel at `:476`. The SDK's 60-second cap exists only in its XHR transport (`xhr-transport.ts:15`), which the native runtime does not use.

A *refused* connection still fails quickly, so this is not every outage — the exposure is an operator that accepts the connection and then never answers. In that case the export can wait indefinitely instead of falling back to the cache it already holds.

Items 1 to 3 together would, in our assessment, meet the standard above for a user's exit-eligible balance — even though Spark operators would still co-sign ordinary payments. Money below the exit threshold would remain outside any unilateral route.

## Previous Analysis (2025-11-03)

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
