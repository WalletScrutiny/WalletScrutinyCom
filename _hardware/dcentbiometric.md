---
title: "D'CENT Biometric Wallet"
appId: dcentbiometric
authors:
- kiwilamb
- danny
- leo
released: 2019-06-28
discontinued: # date
updated: 2021-11-25
version: v2.16.7.bdd9
dimensions: [78.2, 43.2, 10.8]
weight: 36
website: https://dcentwallet.com/products/BiometricWallet
shop: https://dcentwallet.com/Shop/detail/b15125cd52814be19a3f0edf54c8bc17
company: IOTrust
companywebsite: https://iotrust.kr/
country: KP
price: 119USD
repository: https://github.com/DcentWallet
issue: 
icon: dcentbiometric.png
bugbounty: 
verdict: nosource
date: 2021-07-07
signer: 
reviewArchive:

providerTwitter: DCENTwallets
providerLinkedIn: 
providerFacebook: DcentWalletGlobal
providerReddit: 
---


## Private keys can be created offline - ✔️

Private keys are created when creating a new wallet. 

The process for [initialization can be found on the D'CENT user guide](https://userguide.dcentwallet.com/biometric-wallet/setting-up#before-start):

> Step 1. Select Language and Create Wallet
> - Power on D'CENT Biometric Wallet
> - Select Language
> - Select "Create a Wallet"
>
> Step 2. Register PIN and Fingerprint
> - Register a new PIN
> - Verify your PIN
> - Register Fingerprint
> - Verify Fingerprint
>
> Step 3. Write down the recovery seeds
> - Before you begin - What are recovery seeds
> - Write down the recovery seeds
> - Recovery seeds verification
>
> Step 4. Completing the Intitial Setup
> - Check for the latest Firmware

## Private keys are not shared - ✔️

The device can connect via BlueTooth or USB to an Android or iOS app by the same developer. 

{% include walletLink.html wallet='android/com.kr.iotrust.dcent.wallet' verdict='true' %}

## Device displays receive address for confirmation - ✔️

The device has a  1.1 inch OLED display (128x128 pixels)

Watch [third party unboxing and setup video](https://www.youtube.com/watch?v=3J9j7vtb1Go)

## Interface - ✔️

The device has a large enough display to show the public address of the wallet as well as the keys. There are also buttons to help the user navigate the options in the device. 

## Code and Reproducibility

As with the associated mobile app, there are no outward claims that the D'CENT wallet is open source. While they do have [several repositories on GitHub](https://github.com/orgs/DcentWallet/repositories) and one pertaining to their '[Biometric Firmware](https://github.com/DcentWallet/biometric-firmware)', these merely include images or bin files that have no build instructions or other information. 
