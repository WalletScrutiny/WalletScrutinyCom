---
title: Hub Security Fire Wallet
appId: hubsecurity.firewallet
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 89
- 56
- 12
weight: 300
provider: ID-3 Services
providerWebsite: 
website: http://crypto-store.net
shop: http://crypto-store.net/shop/hub-security-firewallet/
country: UK
price: 1700GBP
repository: 
issue: 
icon: hubsecurity.firewallet.png
bugbounty: 
meta: ok
verdict: wip
appHashes: 
date: '2022-05-19'
signer: 
reviewArchive: 
twitter: id3services
social:
- https://www.linkedin.com/company/id-3-services-limited/
features: 

---

## Background Information

> The only Hardware Wallet with an embedded Firewall. HUB Security’s FireWallet works with the ultra secure Fire Vault to safely secures and protect your digital assets with the hardware based firewall, an EMI Shield, encrypted backup solution, and anti-tamper case. The HUB Security unique firewall creates logical and physical separation while multiple layers of protection in hardware and software complement each other for all-around protection against multiple types of local and remote attacks.

## Technical Specifications 

> Security:
- Physical Tamper Detection and Response compliant to FIPS 140-2 Level 4
- Embedded Hardware Firewall isolation
>
> Interface:
- USB 2.0 with micro USB connector, BLE
>
> Local interface:	
- 2.4” LCD touchscreen
>
> Power:
- Embedded rechargeable LiPo battery
>
> Hash:	
- MD2, MD4, MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA3 (Keccak), SHA3-224, SHA3-256, SHA3-384, SHA3-512, BLAKE2b, RIPEMD-160, Poly1305
>
> Symmetric:	
- AES, Camellia, DES, 3DES, IDEA, ARC4, RABBIT, HC-128, ChaCha20
>
> Asymmetric:	
- RSA, DSS, DH, EDH, ECDH-ECDSA, ECDHE-ECDSA, ECDH-RSA, ECDHE-RSA
>
> Curves:	
- Curve25519, Ed25519, SECP, SECPR2, SECPR3, BRAINPOOL, KOBLITZ
>
> Key Derivation:
- HMAC, PBKDF2
>
> Random:	
- Hardware physical TRNG
>
> Blockchain:	
- BIP32/39/44, all ERCs via ABI file download, 100+ tokens & networks, Smart contracts lifecycle management

## Analysis 

We were not able to find documentation for the {{ page.title }}. We contacted them through [Twitter](https://twitter.com/BitcoinWalletz/status/1522773462187909120) to ask for more information.

From the specifications we can glean that it connects to other devices via USB or Bluetooth. We do not know for certain if the device is able to go online. However, judging from the inclusion of a firewall, we believe that it can. The device has a 2.4" LCD touchscreen. 

The ID-3 Service's last tweet was made in January 19, 2021. There are many missing pieces of information that we were not able to find. Until we hear back from them and resolve our doubts we leave this analysis as **work-in-progress**.