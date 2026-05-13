---
title: Konai CryptoKona
appId: konai.cryptokona
authors:
- danny
released: 2019-04-18
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 86
- 54
- 0.84
weight: 
provider: KONA I Co., Ltd.
providerWebsite: 
website: https://www.konai.com/business/cards/card
shop: 
country: KR
price: 
repository: 
icon: konai.cryptokona.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-04-27
signer: 
twitter: 
social:
- https://www.facebook.com/konai.story/
builds: 
features:
- fingerprint
- hd
- nfc
- secEl
- segwit

---

Kona I Co., Ltd. is a South Korean company involved in the manufacture of various electronic cards. Among its products include: 

- Fingerprint Card
- Display OTP / Dynamic CVV card
- Smart card key
- CryptoKona S / CryptoKona S Plus
- All-in-one banking card
- Authentication service

## Product Description 

The CryptoKona is a multi-currency card type [hardware wallet](https://www.konai.com/business/cards/card): 

> It is equipped with IC chips with international security CC EAL6 + certification to provide the highest level of security performance, and it is possible to manage cryptocurrency more safely through strong user authentication such as fingerprint authentication or PIN input.

It is paired with an [Android app](https://play.google.com/store/apps/details?id=com.konai.cryptokona) with the same name using Bluetooth.

The companion app can only be used once successfully paired through BLE with the card. Once connected, it has the described functions:

> - Users can receive coin from another account and send to other individual account.
- Every operations are possible with our CryptoKona card that have private key and use BLE technology so it's really safe from any danger.

There are 2 versions to the CryptoKona: the S and the S Plus. 

> - It utilizes the FIDO2 standard for authentication. 
- It prevents external leakage by performing key generation and recovery only within the card to enhance security.
- Encrypts key data through the App and the creation of Secure Channel (ECDH key exchange)

## Product Specification 

FCC Information and manual can be found [here](https://fcc.report/FCC-ID/2ARI2CK-KF-102/4251335)

H/W
- Display: 1.43”
- Secure IC: SAMSUNG S3FTXXX
- MCU: Cortex-M4
- Functional Temperature
- ConnectionType: BLE 4.1
- Contents: CryptoKona,Charge Cradle, USB Cable
- Wireless Frequency Certification: KC, CE, FCC, TELEC

S/W
- COS: Java card 3.0.4, GlobalPlatform2.2 CryptoKonasecure applet, Java Card applet 
- Mnemonic: 12~24
- Supported HD wallet: BIP 32, BIP43, BIP44, BIP49, ETC.
- Supported BIP BIP 38, BIP39, BIP141, BIP143, BIP144, BIP173, ETC.
- 지원알고리즘: RIPEMD160, SHA256, KECCAK, HMAC-SHA256, HMAC-SHA512, SECP256K1, SECP256R1, ETC.Plus

## Analysis

According to the [User Manual](https://fcc.report/FCC-ID/2ARI2CK-KF-102/4251335), setting up the master wallet is possible through the device. Mnemonics are also displayed on the e-paper display. It claims that the card operates through their open Java based COS (Chip Operating System). We were **not able to find links to this**. We were also not able to find pricing information as it is not displayed on their website. We emailed Kona I to verify additional information related to this. There is no reference to the device being an Open Source project.

{% include featureEvidence.html feature="hd" quote="Mnemonic: 12~24 - Supported HD wallet: BIP 32, BIP43, BIP44, BIP49, ETC. - Supported BIP BIP 38, BIP39, BIP141, BIP143, BIP144, BIP173, ETC." source="Existing WalletScrutiny review" comment="BIP39 mnemonic backup with BIP32/44/49 HD derivation explicitly listed in product specification." %}

{% include featureEvidence.html feature="segwit" quote="Supported BIP BIP 38, BIP39, BIP141, BIP143, BIP144, BIP173, ETC." source="Existing WalletScrutiny review" comment="BIP141 (SegWit), BIP143 (SegWit signing), BIP144, and BIP173 (bech32 addresses) are all explicitly listed, indicating full SegWit support including bech32." %}

{% include featureEvidence.html feature="fingerprint" quote="It is equipped with IC chips with international security CC EAL6 + certification to provide the highest level of security performance, and it is possible to manage cryptocurrency more safely through strong user authentication such as fingerprint authentication or PIN input." source="Existing WalletScrutiny review" comment="Fingerprint authentication is explicitly mentioned as a user authentication method on the hardware card." %}

{% include featureEvidence.html feature="secEl" quote="Secure IC: SAMSUNG S3FTXXX" source="Existing WalletScrutiny review" comment="A dedicated secure IC chip (Samsung S3FTXXX) is explicitly listed in the hardware specification." %}


{% include featureEvidence.html feature="nfc" quote="ConnectionType: BLE 4.1" source="Existing WalletScrutiny review" comment="No NFC evidence found — BLE only. Omitting nfc." %}