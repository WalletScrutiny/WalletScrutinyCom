---
title: Crayonic Keyvault™
appId: crayonic.keyvault
authors:
- danny
released: 2022-04-28
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 74
- 24
- 13 
weight: 
provider: Crayonic
providerWebsite: https://www.crayonic.com
website: 
shop: https://www.crayonic.com/get
country: SK
price: 149 EUR
repository: 
issue: 
icon: crayonic.keyvault.png
bugbounty: 
meta: ok
verdict: wip
date: 2023-02-09
signer: 
reviewArchive: 
twitter: crayonic_com
social: 
- https://www.linkedin.com/company/crayonic/ 
---

## Product Description 

> - USB, NFC, Bluetooth 
> - Multimodal biometrics 
> - FIDO2, PIV, U2F, OTP, QSCD, physical access, password manager, 
> - crypto HW wallet 
> - SE EAL5+ 
> - Secure display
> - Encrypted mass storage

From its [technical paper](https://crayonic.io/docs/ckv-wp.pdf):

> The Crayonic KeyVault™ provides hardware wallet offline signing service for processing transactions on crypto-assets i.e., to receive and perform payments in cryptocurrencies.
>
> The KeyVault™ handles secure cold storage for private keys, allowing users to store their private blockchain keys locally, on their own device. The private keys stored in the SE never leave it and are only used for operations confirmed by the user’s authentication and shown in the secure display.
>
> In cases when a user’s device is lost, damaged or when the user simply wants to move the wallet to a different device it is possible to restore the set of wallet private keys with a recovery
seed. This is supported by the implementation of a hierarchical deterministic (HD) wallet (BIP0032) with a one-time backup.
> 
> A single recovery seed created during the initialization of the wallet can be backed up and stored offline. On the other hand, whoever gets access to the recovery seed is able to generate
the entire tree of children key pairs, therefore it should be properly safeguarded. It is suggested to encrypt the recovery seed and/or use KeyVault’s secret sharing mechanisms, i.e. a Shamir Shared Secret (e.g. SLIP-0039) and store the shares in different trusted parties secure stores.
>
> The logical hierarchy of the implemented wallet is defined by BIP-0044 and allows handling of multiple cryptocurrencies (coins), accounts and external/internal chains per account.
> 
> The Crayonic KeyVault™ will initially support Bitcoin and Ethereum signatures with future support for Cardano (ADA) transaction signing. Cardano blockchain may be used in the near
future as a HW wallet attestation anchor to help prove authenticity of the wallet by recording its DID on the chain during manufacturing.

## Analysis 

The device claims to be able to: 

- Generate a recovery seed offline
- Private keys are not shared 

> The private keys stored in the SE never leave it and are only used for operations confirmed by the user’s authentication and shown in the secure display.

- Does the device display the receive address for confirmation? 

This was not explicitly described in the available documentation. 

- The device has a display interface, biometric input, but no buttons. 

- The device has an organization listed on Github with 15 repositories. As the device has multiple functions, we were not able to find the repository for functions specific to its cryptocurrency uses. 

This device warrants further scrutiny. We contacted Pavol Schmitzer on LinkedIn to ask for more information. Until further information is available, we'll retain the status of this review.