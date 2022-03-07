---
title: "One Key Mini"
appId: onekeymini
authors:
- danny
released: 2020-12-08
discontinued: 
updated: 2021-10-16
version: 
binaries: 
dimensions: 
weight: 
provider: "Bixin"
providerWebsite: 
website: https://onekey.so/
shop: https://shop.onekey.so/products/onekey-mini-hardware-wallet?variant=41169098178722
country: SG
price: 48USD
repository: https://github.com/OneKeyHQ/wallet-deprecated
issue: https://github.com/OneKeyHQ/firmware/issues/17
icon: onekeymini.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-03-05
signer: 
reviewArchive: 
twitter: onekeyhq
social: 
  - https://discord.gg/onekey
  - https://weibo.com/yourKeysyourBitcoin
  - https://www.reddit.com/r/OneKeyHQ/
---


## Product Description 

Not to be confused with the {% include walletLink.html wallet='hardware/onekey' verdict='true' %}, the One Key Mini supports many cryptocurrencies including: BTC, LTC, BCH, ETH, BTG, DASH, USDT, DOGE and more. It supports many DeFi protocols and can connect to Metamask.

It is also compatible with Trezor, Metamask, Exodus, Bitcoin Core + Specter, BTCPayServe, Electrum-LTC, Nano Wallet, Electrum, Mycelium, MyEtherWallet, Bitcoin Core + HWI, Electrum- DASH and EtherWall.

According to the [FAQ](https://shop.onekey.so/pages/faq), even if the device was damaged, it is possible to recover via a mnemonic phrase.

The private keys are created offline, secured and airgapped. The mnemonic phrase is provided during initial device setup.

[One Key Mini User Manual](https://help.onekey.so/hc/en-us/articles/4408289773455-OneKey-Mini-hardware-wallet-activation-tutorial)

OneKey repeatedly claims that their software and firmwares are Open Source. However, the repository linked from their website indicates that it is already [deprecated](https://github.com/OneKeyHQ/wallet-deprecated). 

Digging deeper into their User Service Agreement, we find this:

> OneKeyOpen Source Code (“OneKey OSC”): means the partial software code of OneKey that Company has publicized and made open-source. Users may use (include further development) such open source software code in accordance with relevant Open Source License and notices of the Company.

The key word is "partial". Making the **source code only partially available** indicates that certain functions are not made public. This is noted in an [issue on OneKey's Github](https://github.com/OneKeyHQ/firmware/issues/17), but it has not received any attention.

Whether it's a few lines of code that references a script downloaded from another source, users simply would not know. 
