---
wsId: gemWallet
title: 'Gem Wallet: Bitcoin, USDT, BNB'
date: 2024-06-12
authors:
- danny
website: https://gemwallet.com
twitter: gemwallet
social:
- https://github.com/gemwalletcom
- https://www.reddit.com/r/gemwallet_official
- https://www.youtube.com/@gemwallet
- https://t.me/gemwallet
- https://discord.com/invite/4jpxtwT8r6
- https://www.reddit.com/r/GemWalletApp
features:
- buyWithCC
- foss
- hd
- segwit
- tradeAlts
redirect_from:
- /android/com.gemwallet.android/
- /iphone/com.gemwallet.ios/
android:
  appId: com.gemwallet.android
  users: 100000
  appCountry: ae
  released: 2023-06-26
  updated: 2026-06-12
  version: '2.89'
  reviews: 5
  icon: com.gemwallet.android.png
  meta: ok
  verdict: sourceavailable
  developerName: Gem Wallet LLC
  repository: https://github.com/gemwalletcom/wallet
iphone:
  appId: com.gemwallet.ios
  idd: '6448712670'
  appCountry: us
  released: 2023-07-17
  updated: 2026-06-15
  version: '2.89'
  reviews: 357
  icon: com.gemwallet.ios.jpg
  meta: ok
  verdict: wip
  developerName: Gem Wallet LLC
  repository: https://github.com/gemwalletcom/gem-android

---

## Android

**Note (2026-05-21):** Gem Wallet's Android source code has moved. The original standalone repository [`gemwalletcom/gem-android`](https://github.com/gemwalletcom/gem-android) was archived and its development migrated to the unified monorepo [`gemwalletcom/wallet`](https://github.com/gemwalletcom/wallet), which now hosts both the Android and iOS apps under a shared `android/` and `ios/` directory structure alongside the shared Rust core library. The monorepo uses a new version tag format (e.g. `2.68`) that matches the Play Store `versionName` directly, whereas the old repo used an internal `1.3.x` scheme decoupled from the displayed version.

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/4d35b58691a7b46c61502395f1864e0cc5f4c268/_android/com.gemwallet.android.md)*

## App Description from Google Play 

> Gem Wallet is a secure, self-custodial DeFi crypto wallet that prioritizes the utmost privacy of your sensitive information. With Gem Wallet, you retain full ownership of your cryptocurrencies and private keys. We deeply value your privacy, ensuring we don't track any personally identifiable information, wallet addresses, or asset balances.
>
> When you choose Gem Wallet, you gain access to a Bitcoin wallet, Ethereum wallet, toncoin wallet, USDT/USDC wallet, BNB wallet, solana wallet, litecoin wallet, injective wallet, celestia wallet, bonk wallet, SEI wallet, avax wallet, MATIC wallet, SUI wallet, PEPE wallet, Manta wallet, ATOM wallet, and more! Gem Wallet is your key to the Web3 world. A single solution for multiple challenges.
> 
> Gem Crypto Wallet Key Features:
- Open Source Wallet
- Supports ERC-20, BEP-20, and TRC-20
- Store, Track, Send, Receive Tokens, Stake and Swap Coins
- Stake your SUI, INJ, ATOM, TIA, SEI, SOL, TRX, OSMO and BNB
- Use Swap and DEXes like 1inch directly from wallet with best rates
- Protect your Crypto and Private Keys with Industry-leading security
- Completely Free to Use
- Buy crypto with credit card
- Access NFT features
- View Detailed History of Your Transactions
- Use built in WalletConnect to connect with DApps, earn, stake, swap, use nft marketplaces, play games, make loans, sky is the limit if there is a Dapp, you can connect Gem Wallet with it.


## Analysis

- We installed Gem Wallet app on our device. 
- Initialization began with wallet creation including the seed phrases.
- This app supports multiple coins including Bitcoin.
- There was an option to send and receive. The Bitcoin address was in the Bech32 format.
- As they claimed to be an Open Source project, we easily found their [repository](https://github.com/gemwalletcom/wallet). 


### Thank you to Gem Wallet for their donation

* $500 on [2024-06-12](https://x.com/dannybuntu/status/1805418147580887150)

{% include featureEvidence.html feature="segwit" quote="The Bitcoin address was in the Bech32 format." source="Analysis" %}

{% include featureEvidence.html feature="foss" quote="Gem Wallet is open-sourced software licensed under the © GPL-3.0." source="License" %}

{% include featureEvidence.html feature="tradeAlts" quote="Use Swap and DEXes like 1inch directly from wallet with best rates" source="App Description from Google Play" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy crypto with credit card" source="App Description from Google Play" %}

{% include featureEvidence.html feature="hd" quote="Create a new wallet and store the secret phrase somewhere safe" source="Website" %}

---

## iPhone

{% include copyFromAndroid.html %}
