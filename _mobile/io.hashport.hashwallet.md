---
title: HashPort Wallet
date: 2026-09-03
website: https://wallet.hashport.com/
appCountry: us
redirect_from:
- /iphone/io.hashport.hashwallet/
android:
  appId: io.hashport.hashwallet
  users: 100000
  appCountry: us
  released: Nov 4, 2024
  updated: 2026-08-10
  version: 3.18.1
  icon: io.hashport.hashwallet.png
  meta: ok
  verdict: nosource
  developerName: HashPort Inc.
iphone:
  appId: io.hashport.hashwallet
  idd: '6450660947'
  appCountry: us
  released: 2024-11-05
  updated: 2026-08-17
  version: 3.18.1
  reviews: 6
  icon: io.hashport.hashwallet.jpg
  meta: ok
  verdict: nosource
  developerName: HashPort Inc

---

## App Description

HashPort Wallet (`io.hashport.hashwallet` on both stores) is a multi-chain Web3 wallet published by HashPort Inc., a Japanese company. It is the continuation of the official Osaka-Kansai Expo wallet: the store listing states that "The Expo app 'EXPO2025 Digital Wallet' has been renewed as a new service, 'HashPort Wallet,' which will remain available even after the Expo ends", carrying over users' existing assets, NFTs and SBTs. It supports Ethereum, Polygon, Base, BNB Chain, Avalanche, Arbitrum and Aptos, over 500 tokens, the USDC and JPYC stablecoins, conversion of Japanese loyalty points such as Ponta and au PAY into digital assets, and access to decentralised exchanges.

## Testing and Analysis

### It does support Bitcoin, despite the store listing

Neither store listing mentions Bitcoin at all — the App Store description names only EVM chains and Aptos, and the Google Play page contains no occurrence of "Bitcoin", "BTC" or "ビットコイン". On the listings alone this would look like a wallet that does not handle BTC.

The provider's own supported-currency table says otherwise. Its first row is BTC on the Bitcoin network, marked for both sending and receiving:

> BTC ｜ Bitcoin ｜ 送る/受け取る ✔️

Source: [HashPort Walletの対応通貨はなんですか？](https://help.wallet.hashport.com/hc/ja/articles/51775249009177). The same table lists several wrapped variants on Base — cbBTC, WBTC, tBTC, SolvBTC — which are separate entries and not what qualifies this app. Native BTC is supported, so the app is in scope for review.

### The provider claims non-custodial, with a split key

HashPort states that the user, not the operator, holds the key:

> 「HashPort Wallet」のWeb3ウォレット機能では、ユーザー様ご自身でウォレットの鍵（秘密鍵）を管理する「ノンカストディアル型」を採用しています。運営側は秘密鍵を預かることはせず、ユーザー様ご自身がウォレットの安全性を管理します。

("The Web3 wallet function of HashPort Wallet adopts a non-custodial model in which users themselves manage the wallet's key. The operator does not hold private keys; users manage the security of the wallet themselves.")

The mechanism described is a split key protected by a six-digit passcode:

> 本アプリケーションでは、新規登録時にユーザー様が決定したパスコード (数字６桁の暗証番号) を元に暗号化し分割管理をしております。この秘密鍵はパスコードを参照できない運営側では復元できない仕組みとなっています。

("This application encrypts the key using the passcode — a six-digit PIN — chosen by the user at registration, and manages it in split form. The operator, which cannot see the passcode, is unable to restore this private key.")

Source: [HashPort Walletの秘密鍵管理方法はなんですか？](https://help.wallet.hashport.com/hc/ja/articles/51167953705113). Taken at face value this is the same shape as other threshold and multi-party wallets reviewed here, and it clears the custodial question — the provider says it cannot move funds on its own.

### But the user cannot leave with the key

Two limits stated by the provider deserve to be read together with that claim.

The private key cannot be exported:

> 現時点では、秘密鍵をエクスポートする機能は実装されておりません。

("At present, no function to export the private key has been implemented.")

Neither can a recovery phrase. HashPort will import one from another wallet, but not produce one:

> HashPort Walletはリカバリーフレーズのインポートは可能ですが、エクスポートには対応しておりません

("HashPort Wallet supports importing a recovery phrase, but does not support exporting one.")

Source: [リカバリーフレーズとは？](https://help.wallet.hashport.com/hc/ja/articles/54048333031193). Funds can still be sent out to another address, so this is not a lock-in of the coins. It does mean the user has no way to reconstitute the wallet outside HashPort's app, and no way to check for themselves that the key is theirs. The passcode is also the single factor protecting the user's share, and six digits is a small space; the operator additionally states it cannot reset that passcode, so a forgotten PIN is not recoverable.

### None of it can be checked

Every claim above is the provider's own description of software nobody outside the company can read. No source is published for either app. The GitHub accounts matching the name belong to other parties — `hashport` is an individual with no public repositories, and `hashport-network` is the unrelated Hedera bridge project, also with none. There is no repository for the wallet.

That is the point at which our analysis stops. A non-custodial architecture is a claim about what the code does with the key, and a closed binary that tells you it splits your key can equally be one that does not. With no source, no key export and no exportable recovery phrase, the user has neither of the two ways to verify the claim: reading the code, or taking the key elsewhere and confirming it works.

### Verdict: nosource

HashPort Wallet supports Bitcoin and describes a non-custodial split-key design, so it passes the custody gate on the provider's own account. But no source code is published for the shipping release on either platform, and the app offers no private key or recovery phrase export by which a user could independently confirm control. The design is therefore unverifiable, and the app receives our **nosource** verdict.
