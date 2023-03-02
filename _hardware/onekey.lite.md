---
title: OneKey Lite
appId: onekey.lite
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: OneKey
providerWebsite: 
website: https://onekey.so/
shop: https://onekey.so/products/onekey-lite-hardware-wallet/
country: HK
price: 19.99 USD
repository: 
issue: 
icon: onekey.lite.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2023-03-01
signer: 
reviewArchive: 
twitter: OneKeyHQ
social: 
- https://discord.com/invite/nwUJaTzjzv
---

Paired with: {% include walletLink.html wallet='android/so.onekey.app.wallet' verdict='true' %}

## Product Description from the OneKey Website

> - Scan.
> - Set PIN.
> - Backed up.
> - It's that simple. OneKey Lite makes the most painful thing in DeFi become easy and enjoyable.

> Perfectly compatible with the following third-party software:
>
> - Trezor web wallet
> - Exodus
> - BTCPayServer
> - Nano Wallet
> - Mycelium
> - Bitcoin Core + HWI
> - MetaMask
> - Bitcoin Core + Specter
> - Electrum-LTC
> - Electrum
> - MyEtherWallet
> - Electrum-DASH

## [Backup Mnemonics Using One Key Lite](https://help.onekey.so/hc/en-us/articles/4911475744527-Using-OneKey-Lite-to-back-up-mnemonics) 

> ★ OneKey Lite only supports backup of hot wallet's helper words.
>
> ★ OneKey Lite requires the OneKey App. If you want to use OneKey Lite to back up other wallets, you will need to import the booster into the OneKey App first and then connect to OneKey Lite to back up the booster.
>
> ★ If you want to use OneKey Lite to back up other wallets, you need to import the stored words into the OneKey App and then connect OneKey Lite to back up.

## [One Key Lite's Features](https://help.onekey.so/hc/en-us/articles/4403416356879-OneKey-Lite-s-Features)

> During the development of the wallet, we discovered that remembering the mnemonic was a constant source of frustration.
>
> The main aspect is that the mnemonic must be "encrypted and stored," with the encryption chip being as secure as the hardware wallet.
>
> That's why we developed the OneKey Lite Backup Kit, also known as OneKey Lite.
>
> OneKey Lite makes storing your wallet app's tokens in hardware a breeze, as it:
>
> - Size as small as a credit card
>
> - Built-in CC EAL6+ security chip (same as hardware wallet)
>
> - Data transfer via NFC near field communication
>
> - Full military-grade encryption channel
>
> - Instant backup and restore of wallet app
>
> - Automatic data wiping with 10 brutal cracks
>
> If you're using the OneKey app, it's a good idea to:
>
> 1. Make a handwritten duplicate of the mnemonic and keep it somewhere secure at home.
>
> 2. Make a backup of your wallet using OneKey Lite and keep it with you.
>
> If your wallet is accidentally erased or reset, you may always recover it using Lite.
>
> Because the PIN code and encryption chip offer you plenty of time to relocate your assets, you won't have to worry about security x-rays or losing Lite.
>
> Note: We only allow communication between the OneKey app and Lite, not between Lite and the hardware wallet, due to security concerns.
>
> The OneKey Lite card communicates using NFC wireless technology and does not have any metal contact points, therefore it will not rust.
>
> Because this device lacks an internal battery, its lifespan is governed by the internal chip storage area years, which is often stated as 20 years.
>
> This device cannot be used without a password, and if the password is incorrect more than ten times, the storage space will be emptied, so you won't have to worry about other people picking up the violent crack.
>
> Unless we find a truly secure alternative, the hardware wallet is designed in such a way that the mnemonic cannot be exported in any form.

[One Key Lite FAQ](https://help.onekey.so/hc/en-us/articles/4403321426191-OneKey-Lite-FAQ-Summary)

## Analysis 

The device needs to be paired with {% include walletLink.html wallet='android/so.onekey.app.wallet' verdict='true' %} in order to function. 

We verified with OneKey support whether the seed phrases are encrypted, they [responded](https://twitter.com/OneKey_Support/status/1630986937027956736) and said that it was.

It requires the use of an NFC capable phone that has the app installed.
