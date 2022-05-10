---
title: Securosys
appId: securosys.primusblockchain.hsm
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Securosys
providerWebsite: https://www.securosys.com/
website: 
shop: 
country: CH
price: 
repository: 
issue: 
icon: securosys.primusblockchain.hsm.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-05-05
signer: 
reviewArchive: 
twitter: securosys
social:
- https://www.linkedin.com/company/securosys/
- https://www.facebook.com/securosys/
- https://www.youtube.com/channel/UCD35W9FGQyfXD8R7jN0K-Fw
- https://bitcointalk.org/index.php?topic=5062204.0

---

## Background 

Securosys held an ITO (Initial Token Offering) in November 2, 2018 on [Bitcointalk.org](https://bitcointalk.org/index.php?topic=5062204.0).

> Securosys develops technically superior, security-wise most trusted, and financially competitive hardware and software for crypto assets and blockchain technologies. Its products enable Securosys to be the preferred partner not only for global enterprises, authorities, and industries but also new entrants to the blockchain space. Securosys' products already protect the Swiss Banking System by securing € 100 Billion in daily transactions.

## Product Information 

> A Hardware Security Module generates, stores, and manages digital identities (certificates), encryption keys, and digital assets. Rather than storing this critical information just somewhere on your network server or on a cloud server an HSM securely locks them away. So, even if your network is breached and your files are accessed, the most critical information, your digital identities and assets, your certificates, and your encryption keys are protected.
>
> Securosys currently offers three different families of HSMs: The Primus X-Series and E-Series HSM, two general purpose network security appliances, and the Primus S500.
>
> The Primus S500 is exclusively used by the Swiss Interbank Clearing System 
>
> The Primus E-Series is ideally suited to secure financial transactions such as EBICS, access to the cloud (CASB), key management in the PKI environment, or to protect blockchain systems.

### The Primus X-Series 

> The Primus X-Series Hardware Security Modules (HSMs) are available in different performance classes (X200/X400/X700/X1000). In its most powerful implementation, the Primus X1000 HSM is capable to perform 1200 RSA-4096 operations (or about 4000 RSA-2048) per second. The Primus X-Series HSM can be managed with our remote access device Decanus.
> - Generates encryption keys
> - Stores these keys
> - Manages the distribution of these keys
> - Also performs authentication and encryption tasks 
> - Primus supports symmetric (AES, 3DES), asymmetric (RSA, ECC, Diffie-Hellman), cryptographic hash algorithms (SHA-2, SHA-3), as well as advanced encryption standard-cipher message authentication code (AES-CMAC) for symmetric key diversification.
> - Multiple true random number generation (TRNG modules)
> - Ultra secure vault implemented inside a dedicated security chip. 
> - CC EAL 5+ certified device offers offline storage for PKI root keys and other critical keys
> - Can support unlimited users
> - Can securely hold over one million keys or objects
> - Tamper prevention features
> - API integration by the HSM or via a software layer

Download the [PDF factsheet](https://www.securosys.com/hubfs/Factsheet_X_E_V2.17.pdf?hsCtaTracking=7f6eb911-7dbd-4cfc-8f1a-cc9bcc703464%7Cffacd3b7-be18-4a13-bede-db42f35a69ef) 

## Analysis 

These HSMs are not designed to offer personal wallets to an individual (although their [PDF promotional material](https://www.securosys.com/hubfs/Blockchain%20HSM%20Securosys.pdf) makes an exception): 

> Wallet provider maintains a dedicated crypto keystore based on a Hardware Security Module (HSM) for his customers. Large crypto investors should either possess their own HSM crypto key storage or use an HSM service to secure their crypto assets.

"Large crypto investors" could mean institutional investors, corporations, exchanges, wallet providers or individuals with significant sums of cryptocurrencies. These HSMs go beyond our criteria for "ordinary" hardware wallets since their function is in a myriad of ways, different from your {% include walletLink.html wallet='hardware/ledgerNanoS' %}.

It is hard to make a verdict for this device due to numerous possible iterations of the service. For instance, users can avail of Securosys' [CloudHSM](https://www.securosys.com/hubfs/202107_CloudsHSM_Factsheet_EN_V1.5-1.pdf?hsCtaTracking=d7c682ab-8ca0-4c6b-9ca5-037b6fb780ca%7Cd526edb2-0f56-43e7-bc3c-e5ca260eaf66) service using these same HSMs: 

> The Securosys CloudsHSM service is located and operated in Switzerland. It offers operation services of shared or dedicated HSMs. CloudsHSM was built by the experts who designed and manufacture the HSM for the Swiss Interbank Clearing system.
>
> The HSMs are located in two active data centers. Every location features double internet access, thus guaranteeing no downtime. Additionally, your data is kept safe from environmental dangers in an EMP/HMP protected bunker (BSI zone 3 / NATO zone 2).

As such, it is **custodial**.

Users could also opt for a self-custodial solution by having the HSMs in-house. We could **not find public source code** for such a solution.

