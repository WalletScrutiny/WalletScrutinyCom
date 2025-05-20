---
wsId: 
title: B9 Crypto
altTitle: 
authors:
- danny
users: 100000
appId: com.coinb9.app
appCountry: 
released: 2022-03-07
updated: 2024-11-15
version: 4.1.9
stars: 2.7
ratings: 
reviews: 1
website: 
repository: 
issue: 
icon: com.coinb9.app.png
bugbounty: 
meta: removed
verdict: nobtc
appHashes: 
date: 2025-02-04
signer: 
twitter: 
social: 
redirect_from: 
developerName: 天空科技
features: 

---

## App Description from Google Play

> Digital asset trading systems and wallets, and has built a closed industrial loop of technical services-flow-commercialization.
>
> Coin9's independent currency mixing technology
>
> Users can create new addresses in seconds, up to 1000 addresses can be created, one-click generation, no need to memorize mnemonics/private keys, and each user's wallet is completely unique and not shared. After the user's assets are transferred to the coin9Wallet, the coin9Wallet will transfer the user's assets to various exchanges to cause confusion.
>
> After the user receives the payment, the asset will be randomly deposited in a random hot wallet address (tens of millions). When a user withdraws money, an address will be selected from the 15 million address pool.
>
> If the user withdraws more than 30,000, the hot wallet address will be randomly selected and divided into multiple transfers from the intermediate address.

## Analysis

- The app does not list a website in its developer contact
- When we registered, the email verification came from support@b9pre.com and included a gmail address that was supposed to be for their support.
- We then inputted a password, and we have successfully registered.
- We were then presented with the main app interface.
- The layout was similar to {% include walletLink.html wallet='android/com.binance.dev' verdict='true' %}.
- The upper panel consists of  user account shortcuts.
- The second layer consisted of a promotional carousel.
- The third layer consisted of 11 icons with shortcuts to various features: withdraw, futures, margin, chatroom, financial, chain game, exchange, simulator, community, lend, and OTC.
- The fourth layer is the spot market quotations with various cryptocurrency pairs: BTC/USDT, ETH/BTC, etc.
- We tapped on the bottom panel and it gave us an overview of our assets. We then tapped on 'Receive' and selected 'BTC'. The only two networks available were BTC on OMNI (On the Bitcoin blockchain), and BTC on BSC (which was unavailable when we were testing).
- BTC on the OMNI layer, is a tokenized version of BTC called 'Tethered Bitcoin'.
- It comes with a warning:
  > It is forbidden to recharge non-BTC-OMNI assets to the above-mentioned receiving address: to retrieve the wrong charge chain, it needs to be retrieved manually by a technician, and you need to pay a certain fee, please refer to....

## Conclusion

This was difficult to give a verdict to as it could pass several tests. First, should we consider BTC-OMNI as real BTC? As the warning implies, no. Sending 'real' BTC to the BTC-OMNI address could result in problems.

Second, while the app does have similarities with {% include walletLink.html wallet='android/com.binance.dev' verdict='false' %}, the only similarities are the layout and color schemes. The actual options and branding are different, so we could not qualify this as a clone.

Finally, the appearance of this app is that of an exchange. This would lead us to conclude that it is a custodial provider. But the first assessment takes precedence, that we have to conclude that this app **does not support BTC** as it supports BTC-OMNI and not the Bitcoin blockchain.
