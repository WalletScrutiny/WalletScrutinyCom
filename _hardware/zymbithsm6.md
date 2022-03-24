---
title: Zymbit HSM6
appId: zymbithsm6
authors:
- danny
released: 2021-09-17
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Zymbit
providerWebsite: 
website: https://www.zymbit.com/hsm6/
shop: https://store.zymbit.com/products/hsm6
country: US
price: 125USD
repository: 
issue: 
icon: zymbithsm6.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2022-03-08
signer: 
reviewArchive: 
twitter: zymbit
social:
- https://www.linkedin.com/company/zymbit
- https://www.facebook.com/zymbit
- https://github.com/Zymbit-Docs

---

HSM stands for Hardware Security Module for Embedded Applications.

## Product Description

> - Embedded Hardware Wallet for Crypto & Blockchain
> - BIP 32/39/44 HD wallet
> - 640 Foreign and private/public key slots
> - ED25519, X25519, secp256k1, secp256r1 (NIST P-256) support
> - Secure encapsulated module with hidden 30-pin connector
> - Code compatible with ZK4 & HSM4
> - Measured device identity & authentication
> - Data encryption & signing
> - Key generation & storage
> - Physical tamper detection
> - Battery monitoring with last gasp feature
> - Hardware root of trust

## Documentation

[Zymbit Tutorial](https://docs.zymbit.com/tutorials/digital-wallet/wallet-example/)

> Zymbit’s Hardware Wallet conforms to BIP32, BIP39, BIP44 documents for Hierarchical Deterministic (HD) wallets.

### Specifications

> HSM6 with BIP 32/39/44 Hierarchical Deterministic Wallets feature:
> - Create master seeds and derive child keys
> - Ability to recover master seeds
> - Ability to index wallet nodes with ZYMKEY key slots
>
> Multifactor Device ID and Authentication
>
> HSM6 enables remote attestation of host device hardware configuration:
> - Unique ID token created using multiple device specific measurements
> - Cryptographically derived ID token never exposed
> - Custom input factors available to OEMs
> - ID tokens bound to host permanently for production, or temporarily for development
> - Changes in host configuration trigger local hardware & API responses, policy dependent
> Data Integrity
>
> Encryption & Signing
>
> HSM6’s cryptographic engine utilizes strong cipher functions to encrypt, sign and authenticate data:
> - Strong cipher suite includes ECDSA, ECDH, AES-256, SHA256
> - AES-256 encrypt/decrypt data service
> - Integration with TLS client certificate, PKCS11
> - TRNG - true random number generator, suitable seed for FIPS PUB 140-2, 140-3 DRNG.
> Key Security
> 
> Generation & Storage
> 
> HSM6 generates and stores key pairs in tamper resistant silicon to support a variety of secure services:
> - 14 key slots, factory-defined, user available
> - 512 empty key pair slots, user available
> - 128 foreign public key slots, user defined
> - Cryptographic primitives
> - ED25519, X25519
> - ECC KOBLITZ P-256 (secp256k1), ECC NIST P-256 (secp256r1)
> - ECDSA (FIPS186-3), ECDH (FIPS SP800-56A)
> - AES-256 (FIPS 197), TRNG (NIST SP800-22)

## Installation

The Zymbit HSM6 needs to be installed onto a PiZero HAT. (More information [here](https://docs.zymbit.com/getting-started/hsm6/quickstart/))

## ANALYSIS

This is the tutorial for generating the [master seed](https://docs.zymbit.com/tutorials/digital-wallet/wallet-example/#using-the-zymbit-hardware-wallet).

The Zymbit HSM6 in and of itself, doesn't act like a consumer bitcoin wallet device for the average cryptocurrency enthusiast. It needs additional hardware with advanced technical knowledge of installing modules onto Raspberry Pi's and configuring these into a consumer product. It does have the requisite characteristics to generate a usable wallet - provided the user also has a Raspberry Pi and knowledge on how to configure the Zymbit. 

The Zymbit is geared towards makers who want to create a secure blockchain product. 

As a snap-in security module, it has **no interface** and no display of any sort that would allow the average user to use it from the get-go.    

