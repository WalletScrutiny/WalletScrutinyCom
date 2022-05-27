---
title: Square Subzero HSM Based Cold Storage
appId: square.subzero
authors:
- danny
released: 2018-10-23
discontinued: 
updated: 2022-05-03
version: v1.0.0
binaries: https://github.com/square/subzero/tags
dimensions: 
weight: 
provider: Square
providerWebsite: https://squareup.com/us/en
website: https://subzero.readthedocs.io/en/master/
shop: 
country: US
price: 
repository: https://github.com/square/subzero/
issue: 
icon: square.subzero.png
bugbounty: https://bugcrowd.com/squareopensource
meta: ok
verdict: nowallet
date: 2022-05-26
signer: 
reviewArchive: 
twitter: Square
social: 

---

## GitHub Description 

> Square's solution is unique, specifically, we leverage FIPS certified Hardware Security Modules (HSMs) to protect the private key material. We decided to use such HSMs because we already own, operate, and trust these devices for other payment-related needs.
>
> Funds can be sent from online systems to the cold storage at any time. Moving funds out of cold storage requires a multi-party signing ceremony. In addition, the offline HSMs are able to enforce business logic rules, for instance we only allow sending funds to Square-owned addresses. Such a scheme is usually called defense in depth or an onion model. We maintain the online/offline isolation by importing transaction metadata and exporting signatures using QR codes.
>
> HSMs have the ability to share key material. This enables the ability to store our backups in encrypted form and restore a wallet at any location.

[Further documentation](https://subzero.readthedocs.io/en/master/)

## Hardware 

> We leverage nCipher Security's nShield Solo XC General Purpose HSMs [(product page)](https://www.entrust.com/digital-security/hsm/products/nshield-hsms/nshield-solo). We recommend picking the XC Base model, but the software works with any of the XC models (XC Base, XC Mid, or XC High). Our latest build uses the vendor supplied CodeSafe-linux64-dev-12.50.2.iso and firmware 12.50.11.
>
> We picked this HSM for the following reasons:
> 
- FIPS certified.
- Ability to run custom, signed code.
>
> Our HSM's form factor is PCIe. 

More detailed information can be found on this [page.](https://subzero.readthedocs.io/en/master/physical_components/#choosing-secure-locations)

## Wallet Initialization 

Taken from this [page](https://subzero.readthedocs.io/en/master/wallet_initialization/)

> Once the HSMs have been initialized, a wallet initialization ceremony can take place. The wallet initialization is a two-step process.
>
> Step one: wallet encryption key creation
>
> In the first step, a wallet encryption key is created (256-bit AES). A wallet is then initialized. For additional safety purpose, entropy is mixed from the Linux server and the HSM. The resulting xpub is encrypted using the pubKey encryption key and exported.
>

![image](https://subzero.readthedocs.io/en/master/init_wallet.png)
>
> Above process takes place once per location
>
> By encrypting the xpub, we prevent the operators who are participating in the multi-party ceremony from being able to build a watch wallet. There's benefit in having a watch wallet which can only exist in the Coordinator service; including limiting the number of people who gain access to material non-public financial information.
>
> Step two: exchange of the encrypted xpub
> In the second step, each HSM is provided an encrypted xpub from the other locations. This information is stored in the wallet file and is required for signing transactions. A single xpub is revealed and uploaded to the Coordinator service.
>
> Finalize wallet Above process also takes place once per location
>
> Once every location has finalized their wallet, the Coordinator service is able to derive addresses and watch transactions. Funds can be sent to and from the cold wallet.

## Software 

These are the software components of Square's Sub Zero cold-storage implementation:

- Coordinator service
- Core (C code) runs inside the HSM.
- UI
- QR codes
- Live USB Creator
- Beancounter
- DVD Label

## Analysis 

The {{ page.title }} has a complicated setup which befits a more thorough analysis from specialists. It is not an ordinary hardware wallet but a complete system with different layers of security and customizable implementations. On the surface, we can assess that it is more appropriate for other commercial providers. 

It is designed to work with commercial-level security and financial systems such as those provided by Square in traditional financial systems. Square currently offers several products and services which can be found in its [hardware](https://squareup.com/us/en/hardware), [payments](https://squareup.com/us/en/payments), [banking](https://squareup.com/us/en/banking) pages, and more. 

Needless to say, the {{ page.title }} is **not an individual or personal hardware wallet**. It has however, the platform and capability to custodially provide wallets to individual users should they find the need to venture into it.   



