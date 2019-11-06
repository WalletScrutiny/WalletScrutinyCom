---
title: 'A little investigation into Android Wallet Security'
date: 2019-10-27
permalink: /posts/2019/11/investigation-into-android-wallet-security/
redirect_from:
  - /first-post/
tags:
  - Android
  - Deterministic Builds
  - Security
---

(by [Leo Wandersleb](/cv/leo/))

Obvious lack of security bugs me and since working at Mycelium I pushed to put
an emphasize on deterministic builds - only if the app on Google Play can be
verified to match the code on GitHub, users can assume the public source code to be
relevant for their security.

The Problem
===========

Being your own bank is hard. And in Bitcoin, everybody wants to be their own
bank, with little to no knowledge of what could go wrong.

By now, most involved bitcoiners have learned **"Not your keys - not your bitcoins!"**.
Every time a big custodial service "got hacked", those who did not lose
money in the incidence were quick to blame the victims for trusting their
coins to some "random guy on the internet", the logic being that in a custodial
service the user only sees numbers on a screen but with a real wallet he ownes the
keys and thus the security is pushed to the periphery. No central server holding
all the coins means no attractive target to attack. The attacker would have to steal
the coins from each user individually.

Unfortunately there is many points to attack even if the keys are not on a
central server by design or necessity of the business model.

* The wallet could claim to be a wallet but in reality be a bitcoin bank, with the keys being stored on the server
  * While there were wallets that claimed to do more than they actually did in terms of Bitcoin crypto, I am not aware of this having happened yet to the degree where they claimed to not have the keys while holding them for normal operations.
  * I would argue though, calling a bitcoin banking interface a "wallet" falls into this category.
* The wallet could leak the keys to a server
  * This [happened before](https://github.com/bitpay/copay/issues/9346)
* The wallet could employ poor randomness to create the keys, leaking them even when generating them offline
  * [This incident](https://bitcoin.org/en/alert/2013-08-11-android) was exploitable
* The wallet could at a certain time send all funds to a hacker's wallet

Not the Solution
================

Most bitcoiners make a huge distinction between open source and closed source
wallets, assuming that if it's open source, the above issues cannot arise.
Given that the two issues linked did affect open source wallets already shows
that the open source nature is no 100% protection but in these cases it clearly
was part of the quick discovery and fix.

Unfortunately even open source wallet developers can maliciously release apps that do
not match the published code.

A necessary but underappreciated part of the Solution: Reproducible Builds
====================================================

[Reproducible Builds](https://reproducible-builds.org/) means that the binary compiled from the source code
can be reproduced by following the exact recipe. Bitcoin Core for example uses
[gitian builds](https://github.com/bitcoin-core/docs/blob/master/gitian-building.md)
and always multiple users verify the signed release actually is based on a
tagged revision of the public code repository by reproducing the binary from the code.

To spare others from the work of gitian builds, the release is signed and verified by some.
[This release](https://bitcoincore.org/bin/bitcoin-core-0.18.1/) for example contains
the binaries (those `.gz`, `.dmg` and `.exe` files) and a
[signed message](https://bitcoincore.org/bin/bitcoin-core-0.18.1/SHA256SUMS.asc).
If any verifier would find the signed message to not match the tagged code revision,
red flags would get raised, usually before many of users update to the new version.

The signature is yet another topic.

With this in place, an attacker who wanted to give you a compromised binary would have
to compromise the source code under the scrutiny of many eyes or convince you
to install a binary that you can detect to be different from the source code.

Are Android apps verifiable?
============================

Unfortunately Android never had the tools in place to deterministically
build binaries. For example

* The binary the end user receives, is an APK file which contains a signature, which naturally cannot be reproduced by the end user.
  * The APK will always differ.
  * So ... we have to unwrap the APK.
* Build tools nowadays are meant to be deterministic but often are not
  * Bugs like [this](https://issuetracker.google.com/issues/120255763) and more recently [this](https://issuetracker.google.com/issues/110237303) getting through QA look like deterministic builds are not a top priority at Google.
  * F-Droid was probably one of the earliest projects to [work with reproducible builds](https://f-droid.org/docs/Reproducible_Builds/?title=Deterministic,_Reproducible_Builds) but pngcrunch and NDK can cause issues.

So in principle, APKs can be inspected but the signature and occasionally other
details have to be ignored or otherwise be handled manually

Where do Android Bitcoin Wallets stand today?
=============================================

To find the most relevant wallets to look into, "bitcoin wallet android" was
searched with

* [Duckduckgo](https://duckduckgo.com/?q=android+bitcoin+wallet)
* [Google](https://www.google.com/search?q=android%20bitcoin%20wallet)
* [Google Play](https://play.google.com/store/search?q=bitcoin%20wallet)

which resulted in this list of "wallets" sorted by downloads:

| Name with link | Installs |
|-|-|
| [Blockchain Wallet. Bitcoin, Bitcoin Cash, Ethereum](https://play.google.com/store/apps/details?id=piuk.blockchain.android) | 5M |
| [Coinbase – Buy & Sell Bitcoin. Crypto Wallet.](https://play.google.com/store/apps/details?id=com.coinbase.android) | 5M |
| [Bitcoin Wallet](https://play.google.com/store/apps/details?id=de.schildbach.wallet) | 1M |
| [Mycelium Bitcoin Wallet (Beta)](https://play.google.com/store/apps/details?id=com.mycelium.wallet) | 1M |
| [Xapo](https://play.google.com/store/apps/details?id=com.xapo) | 1M |
| [Coins.ph Wallet](https://play.google.com/store/apps/details?id=asia.coins.mobile) | 1M |
| [Luno: Buy Bitcoin, Ethereum and Cryptocurrency](https://play.google.com/store/apps/details?id=co.bitx.android.wallet) | 1M |
| [Bitcoin Wallet](https://play.google.com/store/apps/details?id=com.bitcoin.mwallet) | 1M |
| [Blockfolio - Bitcoin and Cryptocurrency Tracker](https://play.google.com/store/apps/details?id=com.blockfolio.blockfolio) | 1M |
| [BRD Bitcoin Wallet. Bitcoin Cash, Ethereum, Crypto](https://play.google.com/store/apps/details?id=com.breadwallet) | 1M |
| [Coinomi Wallet :: Bitcoin Ethereum Altcoins Tokens](https://play.google.com/store/apps/details?id=com.coinomi.wallet) | 1M |
| [BitPay – Secure Bitcoin Wallet](https://play.google.com/store/apps/details?id=com.bitpay.wallet) | 500k |
| [Cobo Wallet: Bitcoin, Ethereum, Dash, XRP, XLM](https://play.google.com/store/apps/details?id=cobo.wallet) | 100k |
| [Edge - Bitcoin, Ethereum, Monero, Ripple Wallet](https://play.google.com/store/apps/details?id=co.edgesecure.app) | 100k |
| [Bitcoin Wallet - Airbitz](https://play.google.com/store/apps/details?id=com.airbitz) | 100k |
| [Bcoiner - Free Bitcoin Wallet](https://play.google.com/store/apps/details?id=com.bcoiner.webviewapp) | 100k |
| [Cryptonator cryptocurrency wallet](https://play.google.com/store/apps/details?id=com.cryptonator.android) | 100k |
| [Enjin Crypto Wallet - Ethereum Bitcoin ERC20 ETH](https://play.google.com/store/apps/details?id=com.enjin.mobile.wallet) | 100k |
| [Ripio Bitcoin Wallet: the new digital economy](https://play.google.com/store/apps/details?id=com.ripio.android) | 100k |
| [Jaxx Liberty: Blockchain Wallet](https://play.google.com/store/apps/details?id=com.liberty.jaxx) | 100k |
| [Trust - Crypto & Bitcoin Wallet](https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp) | 100k |
| [Atomic Wallet: Bitcoin Ethereum EOS Ripple Tron](https://play.google.com/store/apps/details?id=io.atomicwallet) | 100k |
| [Electrum Bitcoin Wallet](https://play.google.com/store/apps/details?id=org.electrum.electrum) | 100k |
| [Coinbase Wallet — Crypto Wallet & DApp Browser](https://play.google.com/store/apps/details?id=org.toshi) | 100k |
| [Paxful Bitcoin Wallet](https://play.google.com/store/apps/details?id=com.paxful.wallet) | 100k |
| [Coin Bitcoin Wallet](https://play.google.com/store/apps/details?id=com.coinspace.app) | 50k |
| [Blockstream Green Wallet](https://play.google.com/store/apps/details?id=com.greenaddress.greenbits_android_wallet) | 50k |
| [Bitcoin Wallet - Buy BTC](https://play.google.com/store/apps/details?id=com.polehin.android) | 50k |
| [Samourai Wallet (Early Access)](https://play.google.com/store/apps/details?id=com.samourai.wallet) | 50k |
| [Bitcoin wallet – Totalcoin](https://play.google.com/store/apps/details?id=io.totalcoin.wallet) | 50k |
| [Bitcoin Lightning Wallet](https://play.google.com/store/apps/details?id=com.lightning.walletapp) | 10k |
| [Bitcoin Wallet Blockchain](https://play.google.com/store/apps/details?id=com.bitcoin.wallet.btc) | 10k |
| [DoWallet: Bitcoin Wallet. A Secure Crypto Wallet.](https://play.google.com/store/apps/details?id=com.dowallet) | 10k |
| [Moxi Wallet – for Bitcoin, Ethereum etc.](https://play.google.com/store/apps/details?id=com.crypto.multiwallet) | 10k |
| [DropBit: Bitcoin Wallet](https://play.google.com/store/apps/details?id=com.coinninja.coinkeeper) | 5k |
| [Lite HD Wallet – Your Coin Base (Early Access)](https://play.google.com/store/apps/details?id=org.freewallet.lite.android) | 500 |

In the following posts I will look into individual wallets and try to verify
their apps from Google Play and describe the process and results.

I will skip looking into verifiable builds if it's not an actual wallet.

Depending on feedback, this might turn into a permanent project monitoring
all wallets and providing in depth security audits or it might just be a blog
about a few wallets and their state around the end of 2019.
