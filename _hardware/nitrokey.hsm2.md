---
title: Nitrokey HSM2
appId: nitrokey.hsm2
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 48
- 19
- 7
weight: 6
provider: Nitrokey
providerWebsite: https://www.nitrokey.com/
website: 
shop: https://shop.nitrokey.com/shop/product/nkhs2-nitrokey-hsm-2-7
country: DE
price: 69EUR
repository: https://github.com/Nitrokey/nitrokey-documentation/tree/master/hsm/
issue: 
icon: nitrokey.hsm2.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2022-03-23
signer: 
reviewArchive: 
twitter: nitrokey
social:
- https://www.linkedin.com/company/nitrokey/
- https://www.youtube.com/nitrokey
- https://social.nitrokey.com/@nitrokey
- https://www.facebook.com/nitrokey
features: 

---

## Product Description 

The Nitrokey HSM 2 is a [physical cryptographic tool](https://www.nitrokey.com/solutions/security-for-crypto-currency-exchanges-and-bitcoin-startups).

> As far as possible, crypto currencies should be stored in so-called cold storage, i.e. not on a computer with an online connection. For dynamic business processes this is sometimes only possible for a small part of the coins. In this case the values should not be stored in an ordinary wallet software but in a Hardware Security Module (HSM). An HSM is a device that protects cryptographic keys from digital and physical attacks.

The Nitrokey HSM2 or Hardware Security Module has the following applications and features: 

> Applications:
>
> - Operating PKI and CA
> - Fulfilling Compliance Requirements 
> - Internet of Things
> - Securely Administrating Servers with SSH
> - Encrypting Emails
>
> Features: 
>
> - Two-Man Rule as Access Protection / M-of-N Threshold Scheme
> - Built-in PKI feature
> - Encrypted Backups
> - Key Restriction
> - Key Counter
> - Key Import
> - Secure Channel
> - Transport PIN
> - PIN Management
> - Strong Authentication

It also supports:

> - Elliptic curves: SECG / NIST P-192, P-256, P-384, P-521 (secp192r1/prime192v1, secp256r1/prime256v1, secp521r1/prime521v1); Bitcoin Koblitz curve: secp192k1, secp256k1, secp521k1; RFC 5639: brainpoolP192r1, brainpoolP224r1, brainpoolP256r1, brainpoolP320r1, brainpoolP384r1, brainpoolP512r1
> - Hash algorithms: SHA-1, SHA-256, SHA-384, SHA-512, internal and external hashing supported

For more information, the Nitrokey HSM factsheet can be found [here](https://www.nitrokey.com/files/doc/Nitrokey_HSM_factsheet.pdf).

## Analysis 

With all these feature-sets it was difficult for us to see the Nitrokey as a "traditional" hardware wallet. At this stage, it is still an advanced level diy cryptographic device which has the potential to be used as a Bitcoin wallet. This is evident in the statement from this [page](https://www.nitrokey.com/solutions/security-for-crypto-currency-exchanges-and-bitcoin-startups):

> Especially for Bitcoin the Nitrokey HSM supports the Koblitz curve secp256k1. In addition to a proof-of-concept wallet for Bitcoin, there is an integration in Go Ethereum. 

**The Proof-of-Concept wallet for Bitcoin** that it refers to is [Smartbtc.eu](http://smartbtc.eu/index.html) or *Pretty safe bitcoin wallet with keys on a smartcard*. The Nitrokey HSM has an embedded tamper resistant smart card. Perhaps the most telling evidence that it can be used as a DIY bitcoin wallet can be found in the German version of their  '[Applications](https://www.nitrokey.com/de/documentation/applications#a:bitcoin-wallet)' page. Curiously, we were not able to find the same information on the English version of the page.

> Bitcoin Wallet<br>
> Für: Nitrokey HSM<br>
> J.v.d.Bosch hat ein simples, freies Python-Programm geschrieben, um den privaten Schlüssel eines Bitcoin Wallets in einem HSM zu sichern und zu nutzen. Siehe hier für weitere Informationen (auf Englisch). 

Translated into English: 

> J.v.d.Bosch wrote a simple, free Python program to store and use the private key of a Bitcoin wallet in an HSM. See here for more information.

Nitrokeys and Smartbtc.eu are both FOSS. 

From the description on Smartbtc.eu's page: 

> Cryptographic Smartcards stores the private keys on a chip on the card. They include specialized hardware that performs crypto algorithms (RSA, DSA, ECC) to do all the operations on the card. They also generate the key pairs (public + private keys) on board, to avoid the risk from having more than one copy of the key. By design there usually isn't a way to extract private keys from a smart card. Such smart cards are mainly used for digital signatures and secure identification.
>
> So it is a very usefull, secure and cheap tool for signing bitcoin transactions!
>
> Because I could not find a solution (a "wallet") built on a general purpose smartcard (the so called PKCS#11 type), I decided to write a simple programm to do Bitcoin transactions with a smartcard. The same smartcard that I can also use for ssh-login and encryption.

In conclusion, this device is a secure element for the use in Bitcoin wallets but **no wallet itself**. 
