---
title: Cryptnox BG1 Card
appId: cryptnox.bg1card
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Cryptnox SA
providerWebsite: 
website: https://cryptnox.com/
shop: https://shop.cryptnox.com/
country: CH
price: 49CHF
repository: https://github.com/Cryptnox-Software/cryptnoxpro
issue: 
icon: cryptnox.bg1card.png
bugbounty: 
meta: ok
verdict: noita
appHashes: 
date: 2023-11-15
signer: 
reviewArchive: 
twitter: cryptnox
social: 
features: 

---

## Updated Review 2023-11-15

- Changed price to reflect price changes on the website
- Added the companion app {% include walletLink.html wallet='iphone/com.cryptnox.companion' verdict='true' %} and {% include walletLink.html wallet='android/com.cryptnox.cryptnoxwallet' verdict='true' %}

## Background 

Cryptnox has partnered with the [HTEC group](https://htecgroup.com/client-stories/cryptnox-building-state-of-the-art-private-key-safety/) to offer multiple [products](https://shop.cryptnox.com/): 

1. Cryptnox FIDO2 - FIDO2 Certified Level 1 Smartcard

2. Cryptnox BG-1 Card Dual Seed Generation
- Two cards paired with a Mutual Authentication Security for Dual Generation

3. Cryptnox BG-1 Card
- Crypto hardware wallet smartcard with advanced functionalities 
 
4. Cryptnox B-NFT-1 Card
- Specific card version with potential application to non-fungible token (NFT) 

## Product Description 

> NFC and Contact
Optional Fido2 Enabled Functionality (Choose Option)
>
> Genuine check with On-Card Dynamic Active Authentication with Manufacturer Certificate Chain
>
> Backup Solutions:
> - CloudHSM based (FIPS 140-2) Key Mangement Service and Secret Manager from Amazon Web Services
Standard 12/24 Words (BIP 39)
 - BIP32 & SLIP10 Key Derivation fully On-Card (no Parity Recovery needed) and Digital Signature
>
> Export BIP32 XPUB Data
>
> Digital Signatures : ECDSA "Koblitz Bitcoin" K1 and NIST P1 256 bits curves
>
> Data Exchanges always fully protected within AES 256 bits Secure Tunnel, with MAC for integrity and authentication
>
> Seed Generation from On-Card TRNG source
>
> Card Authentication with:
> 
> - Windows Hello Biometrics (TPM)
- IOS with Biometrics (Secure Enclave)
- Yubikey Products with Personal Identity Verification Functionality ((NIST 800-73-4))
- Pin
- File Encryption and Decryption (Encryption Key derived from Seed)
>
> On-Card Transaction History and Counter Log
>
> On-Card Blockchain Configuration Settings
>
> Common Criteria EAL6+ Certified Chipset
>
Python3 CLI client for:
> - Windows
- MacOS
- Linux Ubuntu (including Ubuntu Core 20)
- IOS Application: https://apps.apple.com/app/id1583011693

## Documentation

[Documentation](https://cryptnox.com/get-software/) has been provided by the project

### Software
- [The Crypnox Software](https://github.com/Cryptnox-Software)
- [Cryptnox Py](https://github.com/Cryptnox-Software/cryptnoxpy)
- [Cryptnox Card](https://github.com/Cryptnox-Software/cryptnoxcard)
- [PyPi - Cryptnox Card](https://pypi.org/project/cryptnoxcard/)
- [PyPi - Cryptnox Py](https://pypi.org/project/cryptnoxpy/)
- [Library](https://cryptnoxpy.readthedocs.io/en/latest/)
- [Binaries](https://github.com/Cryptnox-Software/cryptnoxcard/releases/latest)
- [IOS App Store (Companion App)](https://apps.apple.com/app/id1583011693)
- [Snap Store (linux distributions)](https://snapcraft.io/cryptnox)
- [Compatible Third Party Software](https://uniblow.org/get)

## How it works 

Cryptnox gave this brief on [how the device works](https://htecgroup.com/client-stories/cryptnox-building-state-of-the-art-private-key-safety/): 

> Our Client Cryptnox wanted to make this entire process even safer by allowing the user to use a hardware wallet without having to work with the mnemonic phrase. They came up with an idea to offer users two separate cards, hardware wallets, which can generate the same private key inside of them without ever exposing it to the outside world.
>
This would allow users to use one card when they are making transactions and if that card gets stolen, or lost, they will have the backup, the other card which they have previously placed in a safe or some other secure place. As the cards are identical, the user can transfer the assets to another account from the backup card. Cryptnox needed somebody to help them implement their ideas in an innovative way — they approached HTEC Group to help them develop applications with a user-friendly interface that could perform a variety of advanced functionalities and turn their idea into a reality. 
>
Solution
We developed a complete iOS companion application that allows users to do transactions on Blockchain networks. The solution supports Bitcoin and Ethereum, and the user can, in CLI, use more granular commands, including working with smart contracts and the EOS network. At its core, it is a modern crypto wallet that uses our client’s cards for transaction signing. 

## Analysis 

The device noticeably has no display or means for the user to interact directly with the card. As mentioned above, the device needs the companion app:

> "We developed a complete iOS companion application that allows users to do transactions on Blockchain networks"  

Without a display, the user would not be able to approve transactions physically using the card. Transactions may be **signed blindly.**

