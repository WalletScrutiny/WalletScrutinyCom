---
title: Penta Security D'Amo KMS
appId: pentasecurity.damokms
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Penta Security
providerWebsite: 
website: https://www.pentasecurity.com/
shop: 
country: KR
price: 
repository: 
issue: 
icon: pentasecurity.damokms.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2022-04-04
signer: 
twitter: pentasecsystems
social:
- https://www.linkedin.com/company/penta-security-systems-inc-/
- https://www.facebook.com/pentasecsystems
features: 

---

**Note:** Penta Security Systems has multiple domains related to their business: pentasecurity.co.kr, pentasecurity.co.jp, and pentasecurity.com. Penta Security Systems is Korea-based. Penta Security is the parent company of Amo Labs. Amo Labs is connected to a "reverse ICO" for the AMO token. It is self-described as:

> a blockchain infrastructure for the efficient exchange and sharing of all car data powering the next generation of automobiles.

Amo Labs is based in Singapore. 

KMS stands for Key Management System.

## Product Description

Initially known as Pallet Z, it was [announced on November 1, 2019](https://www.pentasecurity.com/press-releases/cryptography-experts-penta-security-release-pallet-z/):

> D’Amo KMS for cold wallet keeps itself separate from the network, thus eliminating all external threats, making it best suited for enterprise environments. D’Amo KMS for cold wallet utilizes hardware security module (HSM) based on in-house developed Penta Wallet Framework* and runs on established trusted execution environment (TEE) which provides absolute data integrity, robust security and confidentiality in order to prevent against any types of external threats.

The Penta Wallet Framework is Penta Security's "in-house blockchain algorithm and protocol framework". 

It is part of a package of services/products which also includes {% include walletLink.html wallet='hardware/pentasecurity.walletcard' verdict='true' %}. 

The D'Amo KMS for cold storage: 

> * Creates and manages wallets
> * Signs and approves transactions
> * Creates accounts and manages admins
> * Manages wallet-related policies 

In contrast the {% include walletLink.html wallet='hardware/pentasecurity.walletcard'%}:

> * Transfers transaction information
> * Transfers admin and authentication certificates
> * Authentication based on ownership

## Security features

> - Multi Cryptocurrency
> - Multi Admin
> - Multi Signature
> - Multi Wallet
> - Multi Authentication
> - Multi Approval
>
> D’Amo KMS for cold wallet operates all sensitive information only in trusted execution environment (TEE) through hardware security module (HSM)  in order to prevent against any theft
>
> Data exchange can only be implemented through D’Amo KMS cold wallet card which blocks all external access via separation from the network

Apart from the device, Penta Security provides services in the form of "Assisted deployment" and "Technical Support".

## Analysis

Marketing for this service/product was at its peak in 2018 and 2019. Rather than describing specific hardware, most of the descriptions seem to be inclined towards a suite of products that function in a process. We can assume that Penta Security generates revenue by offering not just the hardware, but the expertise in deploying such a solution. The physical rendering of the Penta Security D'Amo KMS appears similar to a Rugged Laptop or Notebook.

Intuiting from the available information, we believe that the device is a cold storage device that has a means for communicating with Penta Security's other devices. If it can create wallets and sign transactions, then as the name KMS or Key Management System implies, it also manages the private keys. To what extent, we can only surmise. If it can provide technical support or "assisted deployment" does that mean that they can have access to the system? It is possible that the service is semi-custodial. But for now, the most apparent verdict that we can glean from the available information is they don't claim to be an Open Source project and thus **do not publicly share their repositories**.
