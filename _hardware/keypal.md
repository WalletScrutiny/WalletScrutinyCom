---
title: Keypal
appId: keypal
authors:
- danny
released: 2021-08-09
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 91
- 55
- 7
weight: 53
provider: Keypal
providerWebsite: 
website: https://www.keypal.pro
shop: https://keypalwallet.mystrikingly.com/store/products/keypal-hardware-wallet
country: CN
price: 110 USD
repository: 
issue: 
icon: keypal.png
bugbounty: 
meta: ok
verdict: nosource
date: 2023-02-01
signer: 
reviewArchive: 
twitter: KeyPalWallet
social:
- https://medium.com/@Keypal
features: 

---

## Product Description 

According to its twitter account's [tweet](https://twitter.com/KeyPalWallet/status/1424712333910106112), it was designed by {% include walletLink.html wallet='android/vip.mytokenpocket' verdict='true' %}, which is Singapore based. 

This multicurrency hardware wallet comes equipped with a 2-inch LCD color display. It can connect to a mobile app using Bluetooth or to a desktop using a USB Type-C cable. It references {% include walletLink.html wallet='android/vip.mytokenpocket' verdict='false' %} a lot in its material. The MyTokenPocket website also links to the KeyPal. 

MyTokenPocket is the companion app for this device.
[Documentation Source:](https://keypal.gitbook.io/en/keypal-tutorial/2.User's-tutorial/Graphic-tutorial/2.5Use-KeyPal-to-connect-TP-extension-wallet)

### Security Claims

> 1. Built-in true random number generator
> 2. Multiple secure storage
> 3. Ensure that the seed does not leave the chip
> 4. Resist brute-force attack and prevent external reading

This is a copy of the [Product Manual](https://fcc.report/FCC-ID/2A4BUKEYPALONE/5812416) 

## Analysis 

- The private keys [can be created offline](https://keypal.gitbook.io/en/keypal-tutorial/2.User's-tutorial/Graphic-tutorial/2.1Creat-a-new-wallet). 
- The device has an LCD screen which can allow the user to confirm transactions.
- Despite having a GitHub organization account, we find no repositories pertaining to the firmware.
- The device is paired with the MyTokenPocket mobile app using BlueTooth: 

> The KeyPal hardware wallet communicates with the companion app via dual-channel Bluetooth and USB. In the process of Bluetooth communication, the link layer will not transmit any sensitive privacy data, preventing any sensitive data from being intercepted through Bluetooth communication. [Source](https://www.keypal.pro/#/security)

We can conclude that that this device **does not have its firmware available for scrutiny.**

