---
title: PiCash Hardware Wallet
appId: picash.hww
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 86
- 54
- 0.68
weight: 
provider: International Linked Solutions LTD
providerWebsite: 
website: https://www.ilinkeds.com/payments
shop: 
country: UK
price: 24.99 EUR
repository: 
issue: 
icon: picash.hww.png
bugbounty: 
meta: ok
verdict: noita
date: 2023-02-09
signer: 
reviewArchive: 
twitter: ilinkeds
social:
- https://www.linkedin.com/in/ilinkeds/
features: 

---

## Product Description 

> PiCash hardware wallet is based on a smart card. It looks like your bank card but it is a security device that let you safely store your private keys within the tamper-proof secure chip. Using a chip card reader or simply with the NFC technology, you will be able to manage your favorite crypto assets.
>
​> PCH hardware wallet is supported (natively or not) by multiple well known software clients such Electrum for Bitcoin/BTC, Electrum for Litecoin/LTC, Electron Cash for Bitcoin Cash/BCH, Electron Cash SLP Edition, MetaMask, MyCrypto and MyEtherWallet.

From the [picash website](https://www.ilinkeds.com/payments).

> Access to private keys ( creation, derivation and signature ) is enforced through the use of a PIN code. This access control is needed every time you want to use the wallet. If a wrong PIN code is entered multiple time, the chip card get bricked. Even if you card is lost or stolen, your funds remain safe! As an additional protection measure, you can optionally enable 2-Factor-Authentication ( 2FA ) with an Android app: in this case, every transaction must also be confirmed on your smartphone before being broadcast!
>
> PCH hardware wallet has full BIP32 and BIP39 support and also supports the import of regular ( non-BIP keys ) such as vanity keys. Even more, private keys cannot be exported outside of the secure chip. Up to 16 regular keys can be imported on the chip. As a result, the private keys can be used to sign transactions and crypto messages, if sufficient credentials are provided.

## Analysis 

The device is dependent on another product they are selling - the PiCash card reader. The card reader can be plugged to a desktop Windows/Linux/Mac computer via USB. 

The reliance on desktop software exposes the wallet to risks such as malware. 