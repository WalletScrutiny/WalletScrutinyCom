---
title: Specter Shield
appId: specter.shield
authors:
- danny
released: '2020-11-27'
discontinued: 
updated: '2021-05-28'
version: '1.8.3'
binaries: 
dimensions: 
weight: 
provider: Specter Solutions
providerWebsite: https://specter.solutions
website: 
shop: https://specter.solutions/shop/specter-shield
country: 
price: 350 EUR
repository: https://github.com/cryptoadvance/specter-diy
issue: 
icon: specter.shield.png
bugbounty: 
meta: ok
verdict: diy
appHashes: 
date: '2023-02-07'
signer: 
reviewArchive: 
twitter: specterwallet
social:
- https://www.linkedin.com/company/specterlabs
features: 

---

## Product Description 

Specter Solutions was acquired by Swan in 2022. 

> - Open source extension board with QR Code Scanner, Battery and Smart Card Reader. 
> - Extension board for F469-Discovery board by STMicroelectronics
> - It includes a QR scanner, smartcard slot and a battery. All elements are not security-critical - QR scanner only captures images and sends scanned data to the main MCU over dead-simple serial interface, smartcard controller learns nothing about the data transmitted to the secure element as communication with it is encrypted.

This product being a copy of the open hardware and open source {% include walletLink.html wallet='hardware/specterdiy' verdict='true' %}, you can find the source code there.

### [BitcoinMagazine Description by Moritz Wietersheim](https://bitcoinmagazine.com/business/moritz-wietersheim-specter-bitcoin)

> In addition to the basic Specter DIY, an extended version called Specter Shield is a major increase in physical security. This is a custom extension board for the main STM32 Discovery board that the base model is built around. The files necessary to have one produced by a PCB board manufacturer are available on their Github repository. The Shield board has a QR code scanner, a battery and a smart card reader slot. This last feature is really what makes this extension board important. With the extension board and a smart card equipped with a secure element, the wallet can function with the same security model as something like a Coldcard. The key material can be stored on the secure element in a smart card and loaded onto the device during use, but only persistently stored on the smart card. Communication between the MCU and the secure element on the card are encrypted, so the information passed between them is not accessible to the microcontroller handling the smart card interface.

## Analysis 

Although this product can be bought entirely assembled from Specter Solutions website, we still list it as a **do it yourself** project as it is out of stock but can be assembled from off-the-shelf components.
