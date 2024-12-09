---
title: ColdLar Ultra
appId: coldlar.ultra
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 135
- 71
- 8.6
weight: 160
provider: ColdLar Information Technology Co.
providerWebsite: https://www.coldlar.com/
website: 
shop: https://www.coldlar.com/en/product/10072
country: CN
price: 680USD
repository: 
issue: 
icon: coldlar.ultra.png
bugbounty: 
meta: ok
verdict: nosource
date: 2024-12-09
signer: 
reviewArchive: 
twitter: Coldlar
social:
features: 

---

## [Official User's Manual](https://www.coldlar.com/en/help/manual)

<iframe width="560" height="315" src="https://www.youtube.com/embed/PkA_J-uqkG8?si=9IfitBiGsLTeptIJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Product Description 

- CC EAL6+ chip security standard
- Multi-chain support
- Supports NFT
- 5 inch touch screen
- Fingerprint recognition 

## Private keys can be created offline - ✔️

The ColdLar Ultra uses a two-part system:
- Hardware cold wallet (cold end) - handles private key generation, transaction construction and digital signatures
- Coldlar App (hot end) - connects to blockchain network for balance queries and transaction broadcasting

Note: The Android app is not available on Google Play.

The device offers two methods for private key generation:
1. Random seed password + payment password combination
2. Standard mnemonic phrase generation

All key operations are performed offline, with cold-hot communication strictly via QR codes, ensuring private keys never touch the internet.

## Private keys are not shared - ✔️

According to the manual:
1. The seed password is not stored in plaintext but is encrypted using the payment password
2. ColdLar explicitly states they do not store user seed passwords or payment passwords
3. Users must have both seed password and payment password to control assets
4. If either password is lost, assets cannot be recovered
5. The company recommends:
   - Writing passwords on paper only
   - Never storing electronic versions
   - Never entering passwords on any webpage
   - Never saving on networked devices

## Device displays receive address for confirmation - ✔️

According to this [tutorial video](https://youtu.be/RSFemN3hjAE), the Coldlar device will display the receive address for confirmation.

## Interface - ✔️

The device features:
- 5-inch touch screen display
- Fingerprint recognition
- QR code scanning capability for air-gapped transactions

## Source-availability

- A search on Github for "Coldlar" resulted in an organization page.
- The Coldlar organization only had a fork of the website bitcoincash.org as their sole repository.

There are **no** claims and proof that the Coldlar Ultra device is **source-available**.  

