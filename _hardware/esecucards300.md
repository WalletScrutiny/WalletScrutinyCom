---
title: Excel Secucard S300
appId: esecucards300
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 86
- 54
- 1
weight: 
provider: Excelsecu Data Technology Co., Ltd
providerWebsite: https://www.excelsecu.com/
website: 
shop: https://www.excelsecu.com/productdetail/esecucarddispl.html
country: CN
price: 85USD
repository: 
issue: 
icon: esecucards300.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2022-03-23
signer: 
twitter: 
social:
- mailto:es_contact@excelsecu.com
features: 

---

## Product Description

The Excel Secucard S300 Display card finds its origins as a secure authentication card for various purposes. It can be used as a secure means for identification prior to its usage as a cryptocurrency wallet. It has a 256x256 E-Ink display screen and 13-key keypad. 

> eSecuCard Display Card is the newest smart Java card on the market which supports big E-ink display screen. It can display images, QR codes and texts. Embedded with Secure Element and a Real-Time-Clock chip, the super smart card provides a great platform for users to develop various applets based on smart card usage scenarios, such as bitcoin wallet for cold storage and payment, membership card, password vault, employee card, electronic ticket card and etc.

One of Excel Secu's other products, previously reviewed here has a striking resemblance: {% include walletLink.html wallet='hardware/esecubit' verdict='true' %} 

Product Specification Sheet:

> - Java platform for users to develop multiple applet
> - Compatible with Java Card v3.0.4 and GP v2.2.1
> - ISO 7816, ISO 14443 and Bluetooth communication interface
> - EPD screen and low energy consumption
> - Extended API allows applet to control keypad and display

The product specification sheet also mentions that it supports the following algorithms: 
- MD5, SHA1, SHA256, SHA384, SHA512
- DES, 3DES, TDES AES128
- RSA1024, RSA2048, RSA4096*, ECDSA (SECP256K1, SECP256R1, SECP384), ECDH (SECP256K1, SECP256R1, SECP384)

The card is also described as having a secure element. 

## Analysis 

We could not find any documentation on how the Excel Secucard S300 specifically functions as a bitcoin wallet. Although the technical specifications for the card itself are detailed in its product specification sheet, we discovered that Excel Secu had other products that are similar iterations of the card. Excelsecu seems to be a business-to-business manufacturer with general marketing directed towards other sellers. Thus, a consumer who wants to buy a bitcoin hardware wallet would not find information such as how the private key is handled on the device. We assume that it would be another party or business which would program hardware wallet capabilities. 

> Our main products includes PKI Digital signature token, One-Time-Password OTP token, FIDO U2F Security Key, Smart Card, Java card, Bluetooth Card, Display Card, Bitcoin cryptocurrency hardware wallets, smart wearable devices.

## What We Do Know

- The product is marketed as a bitcoin hardware wallet albeit with sparse documentation
- It has both input and output interfaces suitable for generating a QR code.
- It claims to have a secure element 
- We could not find a companion app

We have no way of knowing how the private key is stored and **could not find any linked publicly available source code**. We also could not find tutorials or relevant reviews. Assuming that we take their word for it that the device is indeed a bitcoin hardware wallet and functions as such, and without knowledge whether the **private keys are created during the manufacturing process**, we can only make an educated guess for the verdict.
