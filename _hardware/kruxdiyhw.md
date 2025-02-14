---
title: Krux DIY Hardware Wallet
appId: kruxdiyhw
authors:
- danny
released: '2021-07-18'
discontinued: 
updated: '2023-11-18'
version: 
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://selfcustody.github.io/krux/
shop: 
country: 
price: 50USD
repository: https://github.com/selfcustody/krux
issue: 
icon: kruxdiyhw.png
bugbounty: 
meta: ok
verdict: diy
appHashes: 
date: '2024-01-22'
signer: 
reviewArchive: 
twitter: selfcustodykrux
social:
- https://t.me/SC_Krux
- https://bitcointalk.org/index.php?topic=5350905.0
features:
- multiSignature

---

> Krux is open-source firmware that enables anyone to build their own Bitcoin signing device via off-the-shelf parts. It runs on Kendryte K210 devices such as the M5StickV and Maix Amigo, converting them into airgapped devices that can sign transactions for multisignature and single-signature wallets.
>
> Signing operations in Krux are done offline via QR code or via SD card. You can create/load your BIP-39 mnemonic, or import a wallet descriptor, and sign transactions all without having to plug the device into your computer (except to initially flash the firmware). It reads QR codes with its camera and outputs QR codes to its screen, or to paper via an optional thermal printer attachment. 
>
> Krux does not come with its own desktop wallet software. Instead, you can use Krux with third-party wallet coordinators to create/manage wallets, and send transactions from your online computer or mobile device while keeping your keys offline. Krux was built to be vendor agnostic and works with many popular wallet coordinators, including:
>
> - Specter Desktop
> - Sparrow Wallet
> - Nunchuk
> - BlueWallet

## Third Party Video Review

**Disclaimer**: WalletScrutiny is not affiliated with the producer of this video and does not endorse its content.  

<iframe width="560" height="315" src="https://www.youtube.com/embed/rsdvmIcucwQ?si=t6Wxe0KEkNLzYL43" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Can the private keys be created offline?

[Yes.](https://selfcustody.github.io/krux/getting-started/usage/generating-a-mnemonic/)

## Are the private keys shared? 

No, the private keys are used for signing within the device and never get shared. It mainly uses its camera and optional thermal printer to produce or scan a QR code.
It has two modes: single signature and multi-signature. 

[More information](https://selfcustody.github.io/krux/getting-started/usage/using-a-single-sig-wallet/#send-coins_1)

## Does the device display the receive address for confirmation?

[Yes.](https://selfcustody.github.io/krux/getting-started/usage/using-a-single-sig-wallet/#send-coins_1)

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes.

## Code and Reproducibility

This **diy project** requires the user to compile the code himself, so necessarily what ends up being installed on this device is **verifiable**.
