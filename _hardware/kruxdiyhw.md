---
title: Krux DIY Hardware Wallet
appId: kruxdiyhw
authors:
- danny
released: 2021-07-18
discontinued: 
updated: 2021-12-09
version: 
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://jreesun.github.io/krux/
shop: 
country: 
price: 50USD
repository: https://github.com/jreesun/krux
issue: 
icon: kruxdiyhw.png
bugbounty: 
meta: ok
verdict: diy
date: 2022-02-17
signer: 
reviewArchive: 
twitter: 
social: 

---

> Krux is an airgapped hardware signer built on top of the M5StickV, an open-source hardware device from M5Stack.
>
> All operations in Krux are done via QR code. You can load your BIP-39 mnemonic, import a wallet descriptor, and sign transactions without ever having to plug the device into your computer (other than to flash the firmware). It reads QR codes in with its camera and writes QR codes out to its screen or to paper via an optional thermal printer attachment.
>
> Unlike a hardware wallet, Krux does not come with its own wallet software. Instead, you can use Krux with wallet coordinators to manage wallets and create transactions from your computer while never giving them access to your private keys. Krux was built to be vendor agnostic and works with many popular wallet coordinators, including:
>
> - Specter Desktop
> - Sparrow Wallet
> - BlueWallet
> - Electrum

## Can the private keys be created offline?

[Yes. ](https://jreesun.github.io/krux/getting-started/generating-a-mnemonic/)

## Are the private keys shared? 

No, the private keys are used for signing within the device and never get shared.

## Does the device display the receive address for confirmation?

[Yes.](https://jreesun.github.io/krux/getting-started/using-a-single-key-wallet/#send-coins)

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes.

## Code and Reproducibility

This **diy project** requires the user to compile the code himself, so necessarily what ends up being installed on this device is **verifiable**.
