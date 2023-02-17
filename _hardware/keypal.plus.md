---
title: Keypal Plus
appId: keypal.plus
authors:
- danny
released: 2022-12-06
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 91
- 55
- 9 
weight: 63
provider: Keypal
providerWebsite: 
website: https://www.keypal.pro
shop: https://keypalwallet.mystrikingly.com/store/products/keypal-plus
country: CN
price: 110 USD
repository: 
issue: 
icon: keypal.plus.png
bugbounty: 
meta: ok
verdict: nosource
date: 2023-02-02
signer: 
reviewArchive: 
twitter: KeyPalWallet
social: 
- https://medium.com/@Keypal 
---

## Product Description 

The Keypal Plus is slightly heavier at 63 grams compared to the {% include walletLink.html wallet='hardware/keypal' verdict='true' %} which is at 53 grams. It's also thicker at 9 mm compared to the previous model's 6.7 mm.

Interestingly, there is no price difference between the two.

The pre-sale was announced on [twitter](https://twitter.com/KeyPalWallet/status/1598250828858818561) on December 1, 2022.

Like the Keypal, the Plus has a 2-inch LCD color display. It can connect to a mobile app using Bluetooth or to a desktop using a USB Type-C cable. It references {% include walletLink.html wallet='android/vip.mytokenpocket' verdict='false' %} a lot in its material. The MyTokenPocket website also links to the KeyPal. 

MyTokenPocket is the companion app for this device.
[Documentation Source:](https://keypal.gitbook.io/en/keypal-tutorial/2.User's-tutorial/Graphic-tutorial/2.5Use-KeyPal-to-connect-TP-extension-wallet)

## Analysis 

- The private keys [can be created offline](https://keypal.gitbook.io/en/keypal-tutorial/2.User's-tutorial/Graphic-tutorial/2.1Creat-a-new-wallet). 
- The device has an LCD screen which can allow the user to confirm transactions.
- Despite having a GitHub organization account, we find no repositories pertaining to the firmware.
- The device is paired with the MyTokenPocket mobile app using BlueTooth: 

> The KeyPal hardware wallet communicates with the companion app via dual-channel Bluetooth and USB. In the process of Bluetooth communication, the link layer will not transmit any sensitive privacy data, preventing any sensitive data from being intercepted through Bluetooth communication. [Source](https://www.keypal.pro/#/security)

Like the {% include walletLink.html wallet='hardware/keypal' verdict='true' %} this device **does not have its firmware available for scrutiny.**

