---
wsId: com.btc.trustless
title: Trustless
date: 2026-02-03
authors:
- Pechen987 https://github.com/Pechen987
- danny
website: https://trustlesswallet.github.io/Trustless/
twitter: https://x.com/Trustlessbtc
social:
- https://github.com/TrustlessWallet
appCountry: it
redirect_from:
- /android/com.btc.trustless/
- /iphone/com.btc.trustless/
android:
  appId: com.btc.trustless
  users: 20
  released: 2026-02-03
  updated: 2026-05-12
  version: 2.0.0
  reviews: 0
  icon: com.btc.trustless.png
  meta: removed
  verdict: custodial
  developerName: pechen987
  repository: https://github.com/TrustlessWallet/Trustless
iphone:
  appId: com.btc.trustless
  idd: 6756965117
  appCountry: it
  released: 2026-02-03
  updated: 2026-08-10
  version: 3.1.1
  reviews: 1
  icon: com.btc.trustless.jpg
  meta: fewusers
  verdict: custodial
  developerName: Igor Kruglov
  repository: https://github.com/TrustlessWallet/Trustless

---

## App Description

**Trustless** is an open-source, Bitcoin-only mobile wallet with two pockets in one app: a regular on-chain Bitcoin wallet, and a Lightning balance that runs on Spark (via Breez's SDK). Its [README](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/README.md) describes it as "a fully open-source, non-custodial, privacy-focused, Bitcoin-only mobile wallet" with "**Non-custodial Lightning**: ... You can top-up and withdraw from your lighning balance at anytime."

## Analysis

This review was done as part of [issue #947](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/work_items/947), which tracks whether Spark-based wallets actually let users exit to on-chain Bitcoin without anyone's permission. Partway through, we belatedly confirmed that the Android app has been **removed from Google Play** (the store page returns 404); iOS is the only current store-listed version (3.0.1, 1 rating), though a sideloadable APK remains on the project's GitHub releases page. By then the source review was already complete, so we are publishing the findings anyway — they matter for the broader Spark custody question regardless of this app's listing status.

**1. Can you send and receive on-chain Bitcoin?**
Yes, properly. The on-chain pocket is a real Bitcoin wallet: your keys are made on your phone using the industry-standard recipe (BIP-84, the same one Electrum and Sparrow use), transactions are signed on your phone, and it talks to Electrum servers for balances and broadcasting — public ones by default, or your own node if you set one. No company sits in the middle of your on-chain money.

**2. Can you export your seed phrase?**
Yes. There's a screen that shows your 12 words, plus a QR export, and a restore screen to bring a wallet back.

**3. If Trustless disappeared tomorrow, could you recover your money with just the seed phrase in another wallet?**
Half yes, half no. Your **on-chain** money: yes — type the 12 words into Electrum or Sparrow and your coins are there, because Trustless uses the standard key recipe. Your **Lightning** money: no — that balance lives inside Spark's off-chain system, and a normal wallet can't see it. You'd need Spark-aware software *and* Spark's servers still running and willing to cooperate.

**4. Can you force your Lightning money back on-chain if Spark's operators go offline or refuse?**
No. The app does have a real "Withdraw to on-chain" button — more than most Spark wallets offer — but under the hood that button politely *asks* the service provider (Lightspark, by default — not Breez, as it turns out) to help build the exit transaction. If they don't cooperate, there's no plan B: the emergency "unilateral exit" that Spark's design brags about exists deep in the code, but neither the app nor the SDK version it uses gives anyone a way to press it. There's also no separate rescue tool (BlitzWallet publishes one, but note that even theirs still needs the operators' cooperation — it is not a unilateral fallback either).

**Bottom line:** the app's claim of being "non-custodial" is true for your on-chain pocket and oversold for the Lightning pocket. On-chain, you're in full control. On Lightning, your money's safety ultimately depends on Spark's operators staying online and cooperative — the same pattern that drove the [Wallet of Satoshi decision](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_mobile/com.livingroomofsatoshi.wallet.md). One footnote: a [reproducibility check](https://github.com/TrustlessWallet/Trustless/issues/156) of the GitHub release APK (the Play version was already gone) found that the JavaScript bundle, Android bytecode, and assets all matched the source exactly, with differences confined to natively-compiled libraries — possibly caused by build-environment differences, though the shipped binaries haven't been fully reproduced from source yet.

**Verdict: `custodial`.** The on-chain pocket is genuinely self-custodial — a user can always export the seed and recover their BTC in any standard wallet — but that does not create an exception under WalletScrutiny's written policy: ["Products that claim to be non-custodial but feature custodial accounts without very clearly marking those as custodial are also considered 'custodial' as a whole to avoid misguiding users that follow our assessment."](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_data/verdicts/custodial.yml) Trustless explicitly markets its Lightning pocket as "non-custodial," while this review shows moving that balance depends on third-party cooperation — the same limitation that kept Wallet of Satoshi's Spark mode at `custodial`. Since the Android app is removed from Google Play and the iOS listing has almost no users, we are not investing in further hands-on testing unless something materially changes.

## Technical Analysis

Everything below backs the plain-language answers above with exact code citations. Governing precedent: Wallet of Satoshi's Spark "Self-Custody Mode" was reviewed for the same question and kept at `custodial`, because normal Spark transfers require the operator's co-signature — see [`_mobile/com.livingroomofsatoshi.wallet.md`](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_mobile/com.livingroomofsatoshi.wallet.md). Trustless is measured against that same bar.

**Scope — source-level, not binary-level.** The primary review is pinned to two commits: Trustless at release tag [`2.0.2`](https://github.com/TrustlessWallet/Trustless/tree/266a2de442361d426757406cb28dc9fca2d9e33b) (`266a2de4`, the release examined by reproducibility issue #156) and its Breez SDK dependency at the source tag matching the lockfile resolution: [`breez/spark-sdk@0.12.2`](https://github.com/breez/spark-sdk/tree/40e3cbe28fed70ef0e1e61a4d726e12032753eb3) (`40e3cbe2`). [`package.json`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/package.json#L19) declares the compatible range `^0.12.2`; the lockfile pins the resolved version to [`0.12.2`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/package-lock.json#L2489-L2493), whose integrity hash matches the npm-published tarball (verifiable with `npm pack @breeztech/breez-sdk-spark-react-native@0.12.2`).

For precision, the versions in circulation are: the **last Google Play version was 2.0.0** (before removal); the **newest sideloadable GitHub release APK is [`3.0.0`](https://github.com/TrustlessWallet/Trustless/releases/tag/3.0.0)** (2026-06-16); reproducibility issue #156 examined the older GitHub **2.0.2** APK; and the **current iOS App Store release is 3.0.1**. The custody-relevant facts were checked at each newer tag as well:

- Tag [`2.0.0`](https://github.com/TrustlessWallet/Trustless/tree/462be31737dad21b006ef112cc48d82c2e64ecc6) (`462be317`, the last Google Play version): lockfile resolves the SDK to `0.12.2`; the withdrawal feature uses the same `prepareSendPayment`/`sendPayment` Bitcoin-address path ([`WalletContext.tsx#L616`](https://github.com/TrustlessWallet/Trustless/blob/462be31737dad21b006ef112cc48d82c2e64ecc6/src/contexts/WalletContext.tsx#L616), [`#L678`](https://github.com/TrustlessWallet/Trustless/blob/462be31737dad21b006ef112cc48d82c2e64ecc6/src/contexts/WalletContext.tsx#L678)); a repo-wide grep for `unilateral` returns zero hits.
- Tag [`3.0.0`](https://github.com/TrustlessWallet/Trustless/tree/753a5bfc5b2175ebf13c52d166d883b4c60a305a) (`753a5bfc`, the newest Android APK): lockfile resolves the SDK to `0.12.3`; the withdrawal feature uses the identical `prepareSendPayment`/`sendPayment` Bitcoin-address path ([`WalletContext.tsx#L640`](https://github.com/TrustlessWallet/Trustless/blob/753a5bfc5b2175ebf13c52d166d883b4c60a305a/src/contexts/WalletContext.tsx#L640), [`#L702-L709`](https://github.com/TrustlessWallet/Trustless/blob/753a5bfc5b2175ebf13c52d166d883b4c60a305a/src/contexts/WalletContext.tsx#L702-L709)); a repo-wide grep for `unilateral` returns zero hits.
- Tag [`3.0.1`](https://github.com/TrustlessWallet/Trustless/tree/703416934004527db72dee74e9332c5b9e2f55c8) (`70341693`, created 2026-06-19 — the same day as Apple's 3.0.1 release; iOS builds from the same shared React Native source via Expo): same checks, same results ([`WalletContext.tsx#L640`](https://github.com/TrustlessWallet/Trustless/blob/703416934004527db72dee74e9332c5b9e2f55c8/src/contexts/WalletContext.tsx#L640), [`#L702-L709`](https://github.com/TrustlessWallet/Trustless/blob/703416934004527db72dee74e9332c5b9e2f55c8/src/contexts/WalletContext.tsx#L702-L709), button at [`WalletScreen.tsx#L336`](https://github.com/TrustlessWallet/Trustless/blob/703416934004527db72dee74e9332c5b9e2f55c8/src/screens/WalletScreen.tsx#L336)).

The findings below therefore apply to every version in circulation: the last Play release (2.0.0-era source), the #156-examined 2.0.2, the newest Android APK (3.0.0), and the current iOS release (3.0.1). Neither the App Store binary nor the GitHub APKs have been fully reproduced from their tags (Expo generates the native projects at build time; see the #156 note below), so these remain source-level claims.

On the Android binary: a [reproducibility check](https://github.com/TrustlessWallet/Trustless/issues/156) of the **GitHub release** v2.0.2 APK (the app was already gone from Google Play) found `classes*.dex`, `AndroidManifest.xml`, the JS bundle, and all assets **byte-identical** to a rebuild from this source; the 37 differences are confined to natively-compiled `.so` libraries (nine libraries across four ABIs, including the Breez SDK's) plus `resources.arsc` — possibly caused by build-environment differences. Since all of the app-level custody wiring audited below lives in the byte-matching JS bundle, and the native SDK layer's exposed API contains no unilateral-exit method at any nearby version, the native-library mismatch is a reproducibility concern rather than a custody one — but strictly, the shipped binaries have not been fully byte-verified against source.

### 1. On-chain BTC support

Unlike the other Spark-based wallets reviewed under #947, Trustless has a **genuinely local on-chain wallet** alongside its Spark-based Lightning balance. On-chain receive addresses are derived on-device under the standard BIP-84 path `m/84'/0'/0'` ([`src/constants/network.ts#L7`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/constants/network.ts#L7), [derivation](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L1222)), transactions are built and signed locally with bitcoinjs-lib ([`createAndSignTransaction`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L1356), [PSBT construction](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L1396)), and balances, history, UTXOs, and broadcasting go through the **Electrum protocol** ([`src/services/electrum.ts`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/services/electrum.ts), a from-scratch TLS Electrum client; consumed by [`src/services/bitcoin.ts`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/services/bitcoin.ts)) — defaulting to public peers [`electrum.blockstream.info:50002` and `electrum.emzy.de:50002`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/services/electrum.ts#L283-L286), with a [user-configurable custom server](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/services/electrum.ts#L13). mempool.space's REST API is used for [fee estimates (with Electrum as the fallback estimator)](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/services/bitcoin.ts#L480-L530), and the [explorer URLs](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/constants/network.ts#L8-L10) open transaction/address pages in the browser. No coordinator is involved in generating on-chain addresses or signing on-chain transactions.

The **Lightning balance is different**: it runs on the Breez SDK's Spark integration ([`breezSdk.connect`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L415), gated on a [Breez API key](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L382)). Its "top-up" on-chain address is requested through the SDK ([`receivePayment` with `ReceivePaymentMethod.BitcoinAddress`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L616-L631)), and withdrawing the Lightning balance to L1 goes through the SDK's send-payment path (§4).

### 2. Seed phrase export

The app generates a standard BIP-39 mnemonic, stores it in the OS keychain ([`com.btc.trustless.mnemonic` service](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L85)), and exposes it to the user via dedicated screens: [`ShowMnemonicScreen`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/screens/ShowMnemonicScreen.tsx), [`ShowMnemonicQRScreen`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/screens/ShowMnemonicQRScreen.tsx), and [`VerifyMnemonicScreen`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/screens/VerifyMnemonicScreen.tsx), backed by [`getMnemonicForWallet`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L1330). A [`RecoverWalletScreen`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/screens/RecoverWalletScreen.tsx) restores from the same mnemonic.

### 3. Seed portability outside the Spark ecosystem

- **The on-chain balance: yes, genuinely.** Because the on-chain side uses the standard BIP-84 derivation path (§1), importing the seed into any mainstream wallet that speaks BIP-84 (Electrum, Sparrow, BlueWallet, ...) will locate and spend those funds with no Trustless- or Spark-specific knowledge. This is a real, exercisable independence guarantee for the on-chain balance.
- **The Lightning/Spark balance: no.** The same mnemonic is also fed to the Breez SDK ([`breezSdk.Seed.Mnemonic.new`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L411)), but that balance lives in Spark's off-chain leaf state, maintained by the Spark operator infrastructure — a generic BIP-39 wallet has no way to see or spend it. Recovering this balance requires Spark-aware software connecting to the same operator network.

### 4. Unilateral exit

Trustless does ship a real, user-reachable on-chain withdrawal for the Lightning balance — a "Withdraw to on-chain" screen linked from the main wallet screen ([navigation entry](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/navigation/AppNavigator.tsx#L397), [button](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/screens/WalletScreen.tsx#L286), [screen calls](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/screens/WithdrawToOnchainScreen.tsx#L151)) — which is further than most Spark wallets have gone. But tracing it end-to-end shows it is a **cooperative** exit, not a unilateral one:

- The app calls the SDK's [`prepareSendPayment`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L644) / [`sendPayment`](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L706-L713) with a Bitcoin-address destination.
- In the SDK's Rust core at the pinned tag, that destination routes to [`fetch_coop_exit_fee_quote`](https://github.com/breez/spark-sdk/blob/40e3cbe28fed70ef0e1e61a4d726e12032753eb3/crates/breez-sdk/core/src/sdk/payments.rs#L311-L334) at prepare time and [`send_bitcoin_address()`](https://github.com/breez/spark-sdk/blob/40e3cbe28fed70ef0e1e61a4d726e12032753eb3/crates/breez-sdk/core/src/sdk/payments.rs#L1094) → [`spark_wallet.withdraw()`](https://github.com/breez/spark-sdk/blob/40e3cbe28fed70ef0e1e61a4d726e12032753eb3/crates/breez-sdk/core/src/sdk/payments.rs#L1141-L1150) at send time.
- `withdraw()` performs the SDK's cooperative exit — its own code comment reads, verbatim, ["Perform the cooperative exit with the SSP"](https://github.com/breez/spark-sdk/blob/40e3cbe28fed70ef0e1e61a4d726e12032753eb3/crates/spark-wallet/src/wallet.rs#L1226-L1229). The SSP (Spark Service Provider) in the SDK's default configuration — which Trustless [uses unmodified](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/contexts/WalletContext.tsx#L395-L400) apart from the API key and a fee cap — is [Lightspark (`api.lightspark.com`)](https://github.com/breez/spark-sdk/blob/40e3cbe28fed70ef0e1e61a4d726e12032753eb3/crates/spark-wallet/src/config.rs#L51-L73), with a default operator pool run by [Lightspark, Breez, and Flashnet](https://github.com/breez/spark-sdk/blob/40e3cbe28fed70ef0e1e61a4d726e12032753eb3/crates/spark-wallet/src/config.rs#L98-L125) (operator 0, Lightspark, acts as coordinator). The Breez API key authenticates SDK services; it does not change who the SSP is.
- The SDK's genuine unilateral-exit machinery exists — [`SparkWallet::unilateral_exit()`](https://github.com/breez/spark-sdk/blob/40e3cbe28fed70ef0e1e61a4d726e12032753eb3/crates/spark-wallet/src/wallet.rs#L1249-L1259) — but it is a separate method that the `breez-sdk-spark` wrapper crate [never calls](https://github.com/breez/spark-sdk/tree/40e3cbe28fed70ef0e1e61a4d726e12032753eb3/crates/breez-sdk/core/src) (the only "unilateral" references in that crate are three doc-comments on a leaf-optimization tuning field). Consequently it is absent from the generated React Native bindings the source imports: the published `BreezSdk` class at 0.12.2 (the version resolved by source tag 2.0.2) exposes 41 methods, none of them exit-related (reproducible via `npm pack @breeztech/breez-sdk-spark-react-native@0.12.2` and inspecting `src/generated/breez_sdk_spark.ts`). The same absence was confirmed at 0.12.3 (the version resolved by iOS tag 3.0.1 and `main`) and holds at 0.14.0 per the equivalent review of another Breez-SDK wallet under #947 — so even if the distributed APK's embedded SDK build differs from the declared version (see the #156 note above), no nearby SDK version exposes a unilateral-exit call either.
- Trustless's own code never references unilateral exit (repo-wide grep: zero hits), and no Trustless-specific external recovery tool was found — the TrustlessWallet GitHub org has no analogue to `BlitzWallet/spark-recover`.

So if the Spark operator infrastructure went offline or refused to cooperate, a Trustless user could not exit their **Lightning balance** to L1 through anything the app or its SDK version exposes. The **on-chain balance** is unaffected by that scenario (§1/§3).

### Summary

Trustless is a hybrid: its primary on-chain wallet meets the exclusive-control bar (local standard-path keys, local signing, Electrum data with custom-server support, seed importable anywhere), while its Lightning balance sits on the same cooperative-exit-only Spark integration that determined the `custodial` verdict for Wallet of Satoshi under the WoS precedent. Because the app markets that Lightning balance as "non-custodial" without clearly marking its custodial character, the product is classified `custodial` as a whole under WalletScrutiny's written policy (see the verdict rationale in the Analysis section). The app's own claims ("non-custodial Lightning," ["The developers of this app never have access to your funds and cannot retrieve them for you"](https://github.com/TrustlessWallet/Trustless/blob/266a2de442361d426757406cb28dc9fca2d9e33b/src/screens/TermsConditionsScreen.tsx#L13)) are accurate for the on-chain balance but overstate the Lightning side: withdrawing that balance requires the cooperation of the Spark Service Provider and operator infrastructure, and no unilateral fallback is reachable by users today.

Separately noted for a future reproducibility review: both of the repository's closed issues concern reproducibility — [#19](https://github.com/TrustlessWallet/Trustless/issues/19) and [#156](https://github.com/TrustlessWallet/Trustless/issues/156) (the latter reporting 37 binary differences between the GitHub release APK and a rebuild of v2.0.2).
