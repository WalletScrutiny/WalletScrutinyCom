---
title: Diego La Comba BTC Hardware Wallet
appId: diegolacomba.btchww.diy
authors:
- danny
released: 2021-06-08
discontinued: 
updated: 2022-05-07
version: 
binaries: 
dimensions: 
weight: 
provider: Diege Lacomba Fañanas
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/diegolacomba/BTC-Hardware-Wallet
issue: 
icon: diegolacomba.btchww.diy.png
bugbounty: 
meta: ok
verdict: diy
appHashes: 
date: 2022-05-23
signer: 
twitter: 
social: 
features: 

---

## Background 

Diego Lacomba Fañanas' ongoing project centers on an offline hardware wallet based on an ESP32. 

The information provided has been translated from Spanish using Google Translate:

> The proposed project to be carried out consists of the design and development of a cold Bitcoin wallet, it is in other words, a hardware device that securely manages the private keys of your Bitcoin. To do this, it must be able to obtain a sufficiently random entropy to generate and derive the user keys safely and efficiently. These keys will be used to obtain the addresses associated and display them to the user. 
>
> To use the device, external software such as Bitcoin-Core is necessary, to which we will pass the derived master public key. Through external software we will receive and send Bitcoin, having only the master public key, by its own means can only manage the receipts that they make to the user, while to make shipments, as necessary sign the transactions and for this the private keys are used, our device is essential. In this way we have complete control of our Bitcoin without having to share the private keys with no one.

## Product Description 

Translated from Diego La Comba's [GitHub Repository](https://github.com/diegolacomba/BTC-Hardware-Wallet): 

> ## Functions
> The main function of the device is to securely store the private keys of the user's BTC. The device must be able to generate both the recovery seed and the private and public keys. In addition to employing a recovery seed for device restoration. (Briefly explain generation and encryption mechanisms).
>
> It must also be recognized by an online platform, such as Electrum, to make the transfers, from our device that stores the keys in an offline environment, to the hot wallet ( Electrum ) that stores the keys in an online environment ( server ) or vice versa. To operate with Electrum it is necessary to register on the platform, as with any other. The decision of the online platform to make the transfers is subject to change.
>
> As explained above, it must also be able to store the recovery seed on an SD card, as many copies as the user wishes can be made, this seed is stored encrypted. To carry out a BTC transaction, the public key is sent to the issuer (the latter cannot obtain your private key from it), this public key acts as the sending address. The transaction must be carried out through the BTC blockchain network and thus be registered. In the same way a shipment is made, in this case the user needs the receiver's public key 

## Analysis 

The complete report can be found [here](https://github.com/diegolacomba/BTC-Hardware-Wallet/blob/master/Report.pdf). This is an ongoing **do-it-yourself** project. 
