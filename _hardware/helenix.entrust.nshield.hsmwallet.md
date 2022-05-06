---
title: Helenix Entrust NShield HSMWallet
appId: helenix.entrust.nshield.hsmwallet
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Helenix Company s.r.o. and Entrust Inc.
providerWebsite: https://www.entrust.com/
website: https://hsmwallet.com/#product
shop: 
country: US
price: 
repository: 
issue: 
icon: helenix.entrust.nshield.hsmwallet.png
bugbounty: 
meta: ok
verdict: custodial
date: 2022-05-04
signer: 
reviewArchive: 
twitter: 
social:
- https://www.linkedin.com/company/helenix/
- https://www.facebook.com/helenixdev

---

## Background 

We found it a little difficult to parse information pertaining to [HSM Wallet](https://hsmwallet.com) due to its complicated offerings and corporate structure. 

> HSM Wallet is a secure implementation of a cryptocurrency wallet. Different from personal hardware wallets currently presented on the market, our solution is oriented towards server systems with a high number of user keys.
>
> The hardware core of the HSM Wallet is the Entrust nShield HSM, FIPS 140-2 Level 3 certified general purpose HSM, which provides features essential for establishing a high level of security - the user's private keys are generated inside the HSM and all operations regarding them are executed in a tamper-proof HSM environment.

The devices in the picture are the different HSM form factors presented for the nShield product family. Previously of nCipher, it was then [acquired by Entrust Datacard in 2019](https://www.cambridgeindependent.co.uk/business/ncipher-acquisition-completed-by-entrust-datacard-9073019/). A [PDF brochure](https://go.ncipher.com/rs/104-QOX-775/images/nCipher_nShield_Family_Brochure.pdf) is still available online depicting these devices with the nCipher logo. 

These were previously marketed as general-purpose HSMs: 

> 'nShield Connect' (Network-attached appliances) HSMs delivery cryptographic services to applications distributed across the network. 
>
> 'nShield Edge' (Portable USB-based modules) are desktop devices designed for convenience and economy. The Edge is ideal for developers, and supports applications such as low volume key generation. 
>
> 'nShield Solo' (PCIe cards for embedding in appliances or servers) HSMs are low-profile PCI-Express card modules that deliver cryptographic services to applications hosted on a server or appliance.

nCipher rebranded after its acquisition. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/3ucxsfneg-M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Product Description 

> - Private keys are generated with a True Random Number Generator based on upredictable physical phenomenon.
> - All operations with private keys are completely isolated in a secure HSM environment.
> - Keys are stored and backedup in an encrypted blob using smart cards.
> - Support of different cryptocurrencies (Bitcoin, Ethereum, etc.)
> - Address generation for supported cryptocurrencies.
> - Transactions managment.
> - All private keys are stored and handled in a encrypted format.
> - Secure Multi-Factor Authentication (MFA).
> - "What You See Is What You Sign" approach.

## Analysis 

Although there are some references to blockchain on the Entrust.com domain, we could not specifically find details for marketing its nShield product line as "Bitcoin Wallets". Helenix does this via the hsmwallet.com domain and on helenix.com where it describes itself one of its solutions as: 

> **Blockchain Security**
>
> Trusted Environment
>
> Perform all critical operation in an isolated environment of hardware encryption modules certified according to the strictest data protection regulations. 
>
> Crypto Assets Control
>
> You no longer need to choose between security and convenience, as our APIs and mobile apps allow you to have both anytime, anywhere.
>
> Our solution have been carefully designed to reliably protect your crypto assets. They easily integrate with existing IT architecture elements by utilizing API or can be installed on devices as the application.
>
> - The hardware core is the FIPS 140-2 Level 3 certified general purpose HSM
>
> - All cryptographic operations concerning customer wallets are executed in trusted HSM environment

There is a [PDF brief](https://www.entrust.com/-/media/documentation/solution-briefs/nshield-helenix-hsm-wallet-sb.pdf) from the entrust.com domain referring to Helenix and nShield.

**According to this diagram, this is how the Helenix system works.**

![image](https://helenix.com/wp-content/uploads/2021/07/scheme.svg)

Our conclusion therefore is thus: since the {{ page.title }} is geared for exchanges or organizations with customers, they would be the ones in control of the HSMs. Therefore, they are providing a service to **custodians**. The HSMs and the software would thus be **nonverifiable**.