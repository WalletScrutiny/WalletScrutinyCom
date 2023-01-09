---
title: SmartBTC.eu - Smartcard HSM
appId: smartbtc.eu
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: CardContact Systems GmbH
providerWebsite: http://www.cardcontact.de/
website: http://smartbtc.eu/
shop: >-
  https://www.cardomatic.de/epages/64510967.sf/en_GB/?ObjectPath=/Shops/64510967/Categories/SmartCardHSM
country: DE
price: 34EUR
repository: https://github.com/CardContact
issue: 
icon: smartbtc.eu.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2022-03-23
signer: 
reviewArchive: 
twitter: 
social: 

---

## Product Description 

It is difficult to mention J.v.d.Bosch's SmartBTC.eu without mentioning the Smartcard HSM. In the same vein as the {% include walletLink.html wallet='hardware/nitrokey.hsm2' verdict='true' %}, Smartcard HSM is the hardware component to SmartBTC.eu's bitcoin software. The two go hand-in-hand to create a bitcoin hardware wallet DIY project. 

CardContact System's Smartcard HSM is directly referred to in Bosch's [tutorial](http://smartbtc.eu/). It is available in many form factors: 

- 4K - USB form factor 
- SIM / Card - ID-1 Contact, ID-1 Dual-IF, Mini-SIM and Micro-SIM 
- Micro SD - Micro SD
- EA+ Card - ID-1 Card 

The 4 have the same capabilities:

> - Build-in PKI
> - Secure Channel
> - Key Backup / Restore
> - PIN Management
> - Public Key Authentication
> - n-of-m Threshold Scheme
> - Transport-PIN Mode
> - Key Restriction
> - Key Use Counter
> - Key Import
> - End-to-end encryption
> - SDK Access
> - Key Domains
> - ECC Key Derivation
> - AES for Key Management

However, the EA+ Card does not have *Key Domains, ECC Key Derivation and AES for Key Management*. [ECC Key Derivation has a specific purpose](https://www.smartcard-hsm.com/features.html#ecderive) for cryptocurrencies and smart contracts: 

> In particular for crypto currencies and smart contracts, the SmartCard-HSM supports derived EC keys to implement key management schemes similar to BIP32. Unlike with BIP32, key material remains inside the secure element, while the public key can be calculated outside from the master public key. 

The [general purpose](https://www.smartcard-hsm.com/docs/sc-hsm-4k-datasheet.pdf) for the Smartcard HSM is described:

> The SmartCard-HSM is a light-weight hardware security module for secure key generation, storage and use. It has been designed for PKI and cryptographic systems with low to moderate load. The unique build in support for card verifiable certificates as defined in BSI TR-03110 (Extended Access Control) makes a SmartCard-HSM the perfect choice for storing key material in a distributed Public Key Infrastructure. A trusted channel and public key attestation allow remote key generation and certificate issuance. Advanced key management functions provide for key backup and device clustering in key domains.

## Analysis 

The Smartcard HSM is not marketed specifically as a Bitcoin hardware wallet. The Bitcoin wallet is described as one of the possible [applications](https://www.smartcard-hsm.com/applications.html#bitcoin) for the card: 

> The SmartCard-HSM has build-in support for the secp256k1 Elliptic Curve, the cryptographic algorithm used by Bitcoin.
>
> While your Bitcoins are in the network, spending your Bitcoins requires access to your private Bitcoin key. If someone manages to obtain a copy of your Bitcoin key, then he can spend your Bitcoins and you won't even know until it's too late.
>
> The Smart=BTC project has implemented a Bitcoin Wallet based on a SmartCard-HSM.

J.v.d.Bosch describes how this could be done [here](http://smartbtc.eu/): 

> Cryptographic Smartcards stores the private keys on a chip on the card. They include specialized hardware that performs crypto algorithms (RSA, DSA, ECC) to do all the operations on the card. They also generate the key pairs (public + private keys) on board, to avoid the risk from having more than one copy of the key. By design there usually isn't a way to extract private keys from a smart card. Such smart cards are mainly used for digital signatures and secure identification.
> 
> So it is a very usefull, secure and cheap tool for signing bitcoin transactions!
>
> Because I could not find a solution (a "wallet") built on a general purpose smartcard (the so called PKCS#11 type), I decided to write a simple programm to do Bitcoin transactions with a smartcard. The same smartcard that I can also use for ssh-login and encryption.

He continues: 

> This SmartCard-HSM has build-in support for the secp256k1 Elliptic Curve, the cryptographic algorithm used by Bitcoin.
Because there was no so-called PKCS#11-aware wallet for smartcards I had to write this myself.
> 
> I choosed to write it in Python.
>
> Fortunately there is a good library for bitcoin: "python-bitcoinlib", someone called it "The Swiss Army Knife of the Bitcoin protocol."
> 
> The result is this simple wallet. It shows the transansactions that have unspents, build a tansaction, signs it and sends it to the bitcoin network. It is open source under the GNU General Public License version 3, so you can see what its doing and you can adapt it to your needs.

Both SmartBTC and CardContact's software and firmware are open-source. It would be a challenging project for a beginner to be able to put the two together. As it is, there is a drawback for the project, the SmartCard-HSM **does not have any input or output interfaces**. This would make it reliant on another device to be able to sign a bitcoin transaction.