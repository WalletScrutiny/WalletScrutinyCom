---
title: "Ballet Crypto Real"
appId: balletcryptoreal
authors:
- kiwilamb
- danny
released: 
discontinued: # date
updated:
version:
dimensions: [54, 85.6, 1.2]
weight: 35
website: https://www.balletcrypto.com/en/real/
shop: https://www.balletcrypto.com/en/buy/
company: Ballet
companywebsite: https://www.balletcrypto.com
country: US
price: 35USD
repository: 
issue:
icon: balletcrypto.png
bugbounty:
verdict: noita
date: 2022-01-20
signer:
reviewArchive:


providerTwitter: BalletCrypto
providerLinkedIn: balletcrypto
providerFacebook: balletcrypto.global
providerReddit: 
---


**Updated Analysis 2022-01-20**

Ballet Crypto REAL is the original and first iteration of the Ballet Crypto Cards series. Subsequent items are:

- {% include walletLink.html wallet='hardware/balletcryptopure' verdict='true' %}
- {% include walletLink.html wallet='hardware/balletcryptopro' verdict='true' %}

Like the PRO and the PURE, the REAL's private keys are printed on the item. It is encrypted and can be verified and decrypted through this process accessible via [balletcrypto.org](https://www.balletcrypto.org/#/):

### Step 1

> **Enter your wallet passphrase.** Remove the tamper-evident scratch-off to get the wallet passphrase.

### Step 2

> **Verify using BIP38 confirmation code.** You can use the Ballet Crypto mobile app to get your wallet’s BIP38 confirmation code.

### OR

> **Decrypt using BIP38 encrypted private key.** Peel off the top layer sticker and scan the encrypted private key QR code, which is set against a yellow sticker.

## 2FKG

To ensure that the private keys are not copied by the manufacturer, Ballet Crypto has a manufacturing process called [2FKG (2-Factor Key Generation)](https://www.balletcrypto.com/en/2FKG-graphic/):

**In the US**

> Using an offline computer, serial number, wallet passphrase, and intermediate code are generated in Ballet’s USA headquarters
>
> Serial number and intermediate code are then electronically transmitted to Ballet’s office in China.

**In China**

> Afterwards, the BIP38 process is used to randomly generate an encrypted private key (EPK) using the intermediate code data.
>
> The corresponding public key and deposit addresses will be generated, along with a confirmation code, to be used for verification and additional checking afterwards.
This encrypted private key is secure data, which is only stored once, on a hard disk drive.
> 
> In China, this two-layer QR code sticker is manufactured using an offline process in a secure printing facility
The secure data is never transmitted to any external computers or system.
>
> The secure data is transferred physically, on a hard disk drive.
>
> Right after the printing process, the secure data is then deleted, overwritten, and physically destroyed.
> 
> The secure two-layer QR code sticker will then be securely applied to the physical wallets, without ever revealing the encrypted private keys.
>
> Once finished, the partially assembled wallets are sent to the United States for final production.
The confirmation codes are also electronically sent back to the United States.
> 
> This is for further verification to ensure that the encrypted private keys and decryption wallet passphrase does match up with the generated cryptocurrency deposit addresses.

**Back in the US**

> The physical wallets and QR code stickers are verified and double checked in the United States according to their corresponding serial numbers.
>
> The matching decryption wallet passphrase and serial number will then be laser etched onto the wallets.
A strip of tamper evident scratch-off material is then applied on the wallet, to cover the wallet passphrase.

## Companion app

It requires a companion app {% include walletLink.html wallet='android/com.balletcrypto' verdict='true' %}

## Interface 

Perhaps one of the main weaknesses of these cards is the lack of an interface and an input mechanism. 

**Previous Analysis 2021-08-08**

This hardware device lacks a screen or a button, this device cannot provide basic security of hardware wallets.

