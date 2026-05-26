---
wsId: HuobiWallet
title: 'iToken HD: DeFi Crypto Wallet'
verdict: nosource
meta: removed
date: 2023-09-28
authors:
- danny
- kiwilamb
- leo
social:
- https://medium.com/@iTokenWalletOfficial
- https://www.facebook.com/HuobiWallet
developerName: BlazekTech Internet Technology Service Limited
redirect_from:
- /android/com.huobionchainwallet.itokenhd/
- /iphone/com.walletdev.onchainwallet/
android:
  appId: com.huobionchainwallet.itokenhd
  users: 5000
  released: 2023-04-12
  updated: 2023-08-30
  version: 4.00.05.003
  reviews: 2
  icon: com.huobionchainwallet.itokenhd.png
  website: https://www.itoken.com/
  twitter: iTokenWallet
iphone:
  appId: com.walletdev.onchainwallet
  idd: 1433883012
  released: 2018-09-29
  updated: 2023-06-15
  version: 3.3.6
  reviews: 136
  icon: com.walletdev.onchainwallet.jpg
  website: https://www.itoken.com/en/
  twitter: HuobiWallet

---

## Android

## Notes on Similar Apps

This is the current Android app. It replaced:

- {% include walletLink.html wallet='android/com.huobionchainwallet.gp' verdict='true' %}

As seen on the [web archive.](https://web.archive.org/web/20220603173723/https://www.itoken.com/)

The iPhone version retained its app ID. 

## 2023-11-02 Review 

### App Description from Google Play

> iToken HD is a decentralized multichain crypto wallet securely managing and protecting all of your cryptocurrencies and NFTs & Your Gateway to Web 3.0.
>
> With iToken HD, you can easily store, transfer, receive, and stake a wide range of cryptocurrencies and NFTs. We're trusted by millions of users across the world, and we always prioritize user asset security above all.
>
> SAFE & SECURE
> - Enjoy full control over your assets with self custody of your private keys.
> - Manage all crypto assets with one set of mnemonics - it gives you access to all your wallet addresses and private keys.
> - Provide security detection for smart contracts, tokens, and NFTs to effectively detect the risks of your crypto wallet.
>
> PROFESSIONAL & CONVENIENT
> - Support 8 Mainchains: Bitcoin (BTC), Ethereum (ETH), Tron (TRX), Arbitrum (ARB), BSC (BNB),

## Analysis 

We were not able to install the app due to country restrictions. Its iPhone counterpart is also unavailable now.

If we are going to take the description at face-value, then this app:

1. Is self-custodial
2. Supports Bitcoin

However, we [did not find](https://github.com/search?q=com.huobionchainwallet.itokenhd&type=code) any pertinent repository or code that would show that this app is source-available. 

Thus, we make the conclusion that this app is **not source-available**.

---

## iPhone

From the description on the App Store the wallet provider clearly states the
private keys are in control of the user:

> Huobi Wallet users have sole control over their own private keys and thus have
  full control over their assets. There are no third parties involved in
  management of private keys.

However the non-custodial claims of the provider cannot be verified as no source
code is available.

Our verdict: This 'wallet' is possibly non-custodial but does not provide public
source and therefore is **not verifiable**.
