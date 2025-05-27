---
title: Secure Wallet
appId: securewallet
authors:
- kiwilamb
- danny
released: 2018-04-01
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 54
- 85
- 0.84
weight: 
provider: ECOMI Technologies PTE
providerWebsite: https://www.ecomi.com/
website: https://securewallet.shop/
shop: https://securewallet.shop/products/secure-wallet
country: SG
price: 199USD
repository: 
issue: 
icon: securewallet.png
bugbounty: 
meta: ok
verdict: plainkey
appHashes: 
date: 2021-12-08
signer: 
twitter: ecomi_
social:
- https://www.linkedin.com/company/ecomi-technology
- https://www.facebook.com/ecomi.ecosystem
features: 

---

**NOTE:** Secure Wallet is temporarily sold out.

> We're SOLD OUT - New Stock Arriving 2022

This wallet has a companion app: {% include walletLink.html wallet='android/com.ecomi' verdict='true' %}

## Interface

The device is the size of a credit card and has a small "e-paper" display.

## Private keys can be created offline - ❓

([Tutorial for wallet setup](https://youtu.be/yEuPZ-NzS9c?t=155))

The device must be paired with the companion app before you can create a wallet and access the recovery seed.

Here's another [third-party video review](https://youtu.be/fdUjZPOfyTw?t=267) detailing how the harware wallet generates seeds. The seeds are actually numbers and not words.

## Private keys are not shared - ❓

ECOMI [claims](https://securewallet.shop/pages/wallet-features) that the Secure Wallet itself never connects directly to the internet.

> Unlike app or web-based wallets, the Secure Wallet is a piece of physical hardware that is never connected directly to the Internet. Instead, the Secure Wallet wirelessy connects through a paired Android or Apple device.
>
> The Bluetooth signal is encrypted with multiple layers of one-way hash functions using the AES256 encryption standard.

However, it appears as though the user **must** be paired with the companion app *on an external device* to recover assets.

> The best method to keep your private keys safe lies in an offline storage device. The Secure Wallet combines the best of hot and cold storage to provide unparalleled security with the convenience of a bank card. The wallet is never connected to the Internet, however, you can interact with it wirelessly through the companion app. **This lets you choose how and when to use the wallet, and provides a means to recover your assets if you lose the device.**

## Device displays receive address for confirmation - ❓

While the transaction amount needs to be confirmed on the device, it does not mention if the entire address is displayed. Only the amount has been described. On a [Medium article guide from ECOMI:](https://medium.com/ecomi/sending-and-receiving-with-the-secure-wallet-9ecf03fe2f8e)

> The Secure Wallet will display the **amount** you are choosing to send on the e-paper screen. You are required to press the physical confirmation button twice before it can be sent (this is the same button you use to turn on the card).
>
> The first time to confirm the amount you are sending is correct, and the second time to confirm the transaction and complete the process. <br>
Using the physical button means there can be no ‘man-in-the-middle’ attacks and your funds cannot leave the Secure Wallet without your confirmation.

## Verdict

Although the wallet itself may be completely offline, it still depends on the companion app to view and recover the seed phrase and make transactions. 

Moreover, the [device's hardware is powered by the same company](https://www.youtube.com/watch?v=bTmXZBAsWtM&t=47s) that manufactured the {% include walletLink.html wallet='hardware/coolwallets' verdict='true' %}. Similarly, the card is paired with a phone app, which [displays the seed phrases in sequence](https://youtu.be/FqzG7jPKH_0?t=221).  

In the case that the phone itself is compromised, the assets will be at risk.
