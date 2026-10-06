---
title: Cake Wallet
appId: cakewallet
authors:
- danny
released: 2023-02-24
discontinued: 
updated: 2026-09-20
version: 6.4.5
binaries: 
provider: Cake Labs
providerWebsite: 
website: https://cakewallet.com
repository: https://github.com/cake-tech/cake_wallet
icon: cakewallet.webp
bugbounty: 
meta: ok
verdict: custodial
date: 2026-02-13
twitter: cakewallet
social:
- https://www.facebook.com/cakewallet
- https://t.me/cakewalletannouncements
- https://discord.com/invite/2vqYJdXG2H
builds: 
features:
- TOR
- batching
- buyWithCC
- coinCtrl
- customNode
- foss
- hd
- multiAccount
- tradeAlts
- ln

---

## Update 2026-10-06 Verdict Change

Since [version 6.0.0](https://github.com/cake-tech/cake_wallet/releases/tag/v6.0.0) (released 2026-02-24, eleven days after our earlier review), Cake Wallet includes an optional Lightning balance, so this update reviews a new feature rather than reversing an old finding. Users switch it on with "Enable Lightning", and the app describes a deposit as "swapping your on-chain Bitcoin from this wallet to your Lightning account". That account runs on Spark through the Breez SDK ([`breez_sdk_spark_flutter` v0.23.0 in Cake 6.4.5](https://github.com/cake-tech/cake_wallet/blob/v6.4.5/cw_bitcoin/pubspec.yaml#L77-L80)). On Spark, payments and withdrawals need the Spark operators to sign alongside the user. In Cake, the only way back from the Lightning balance to the Bitcoin blockchain is a withdrawal that goes through those operators ([`lightning_wallet.dart`](https://github.com/cake-tech/cake_wallet/blob/v6.4.5/cw_bitcoin/lib/lightning/lightning_wallet.dart#L286-L323)). The SDK version Cake uses does offer a unilateral exit that works without the operators, but the app never calls it, never stores the data such an exit needs, and never shows users how much of their balance they could recover on their own.

We apply the same test as for [Blitz Wallet](/mobile/com.blitzwallet/) and [Trustless](/mobile/com.btc.trustless/): can a user, with only what the app gives them and expecting help from nobody, actually force their money onto the Bitcoin blockchain? For Cake's Lightning balance the answer today is no, and the app does not mark that balance as depending on the operators: its English text never mentions Spark, Breez, operators or custody. Our rules treat a product that presents itself as non-custodial but contains an unmarked custodial account as custodial as a whole, so Cake Wallet is now rated custodial. This update does not concern Cake's on-chain wallets. We would revisit the verdict if the app lets users exit the Lightning balance without the operators, from exit data stored on the device, and shows how much that exit would recover, or if it clearly marks the Lightning balance in the app as depending on the operators.

The desktop builds differ. Cake only offers Lightning where its code allows it: [`isAvailable => Platform.isIOS || Platform.isAndroid || Platform.isMacOS`](https://github.com/cake-tech/cake_wallet/blob/v6.4.5/cw_bitcoin/lib/lightning/lightning_wallet.dart#L42), and the Breez SDK it uses supports only Android, iOS and macOS. So the macOS app has the Lightning balance described above, while the Windows and Linux apps have no Lightning at all and contain only on-chain wallets. This page covers all three desktop platforms, and because one of them ships the custodial Lightning balance, the verdict applies to the product as a whole. Windows and Linux users cannot open a Lightning balance, so they are not exposed to it.

{% include featureEvidence.html feature="ln" quote="When you deposit to Lightning, you are swapping your on-chain Bitcoin from this wallet to your Lightning account." source="App text (res/values/strings_en.arb, v6.4.5); macOS only on desktop" %}

## App Description

Cake Wallet is a non-custodial, multi-currency wallet developed by Cake Labs LLC and licensed under [MIT](https://github.com/cake-tech/cake_wallet/blob/main/LICENSE#deadLink). Originally released as a Monero-only mobile wallet in 2018, it expanded to support Bitcoin, Litecoin, Ethereum, Bitcoin Cash, Polygon, Solana, Tron, Nano, Zano, Decred, and Wownero. The desktop version launched in [February 2023](https://www.reddit.com/r/Monero/comments/11b4f3f/cake_wallet_arrives_on_desktop_beta_release_for/) (macOS), followed by Linux in May 2023 and Windows in May 2024.

The desktop app supports cross-platform wallet backup and restore (mobile-to-desktop and vice versa), built-in exchange functionality, custom remote node selection, and Monero subaddress/account management. It is available as a Windows installer, Linux Flatpak, and Linux tarball. SHA-256 hashes are published with each [GitHub release](https://github.com/cake-tech/cake_wallet/releases).

## Analysis

We [tested](https://x.com/BitcoinWalletz/status/2022134630489706978) the app, and posted a screenshot on x.com. We were able to generate a Bitcoin wallet, and successfully exported it to Electrum using the provided seed phrases. The BTC addresses matched. 

This app is **for reproducible builds verification**.

{% include featureEvidence.html feature="foss" quote="Cake Wallet is an open-source, non-custodial, and private multi-currency crypto wallet for Android, iOS, macOS, and Linux." source="README" comment="App Description also confirms MIT license from the GitHub LICENSE file." %}

{% include featureEvidence.html feature="tradeAlts" quote="Built-in exchange for dozens of pairs" source="README" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy cryptocurrency (BTC/LTC/XMR/ETH) with credit/debit/bank" source="README" %}

{% include featureEvidence.html feature="multiAccount" quote="Create several wallets" source="README" %}

{% include featureEvidence.html feature="customNode" quote="Select your own custom nodes/servers" source="README" %}

{% include featureEvidence.html feature="TOR" quote="Robust privacy settings (eg: Tor-only connections)" source="README" %}

{% include featureEvidence.html feature="batching" quote="Specify multiple recipients for batch sending" source="README" %}

{% include featureEvidence.html feature="coinCtrl" quote="Bitcoin coin control (specify specific outputs to spend)" source="README" %}

{% include featureEvidence.html feature="hd" quote="We were able to generate a Bitcoin wallet, and successfully exported it to Electrum using the provided seed phrases. The BTC addresses matched." source="App Description" comment="Seed phrases recoverable on a competitor product (Electrum) confirms BIP39/HD compliance." %}