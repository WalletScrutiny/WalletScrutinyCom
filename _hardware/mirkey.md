---
title: "MIRkey"
appId: mirkey
authors:
- kiwilamb
- danny
released: 
discontinued: # date
updated:
version:
dimensions: [19, 45, 10]
weight: 7
website: https://ellipticsecure.com/products/mirkey_overview.html
shop: https://ellipticsecure.com/order.html
company: Elliptic Secure
companywebsite: https://ellipticsecure.com
country: US
price: 49USD
repository: https://github.com/ellipticSecure
issue:
icon: mirkey.png
bugbounty:
verdict: noita
date: 2021-07-21
signer:
reviewArchive:


providerTwitter: 
providerLinkedIn: ellipticsecure
providerFacebook: 
providerReddit: 
---


> The MIRkey is a [FIDO2 Security Key](https://ellipticsecure.com/mirkey/faq/2019/05/28/what-is-a-hardware-security-key.html), multi-purpose [HSM](https://ellipticsecure.com/ehsm/faq/2019/02/09/what-is-a-hardware-security-module.html) and hardware Bitcoin wallet.

Here is [a tutorial](https://ellipticsecure.com/mirkey/how-to/2019/07/08/how-to-use-MIRkey-hardware-bitcoin-wallet-with-Electrum.html) on how to use this wallet with Electrum.

## Interface

This hardware wallet resembles a USB. It has no screen, although it has a button that allows the user to sign transactions.

## Private keys can be created offline

From the product page:

> With MIRkey you can import, create and store cryptographic keys safely. Keys are stored encrypted with master keys in tamper proof silicon that can only be unlocked with the user password. Its hardware and operating system free nature safeguards your keys from being stolen or copied without your knowledge.
>
> This protects your keys from ransomware as well as malware and viruses.

## Private keys are not shared 

In an article on the blog, Elliptic recommends storing bitcoins offline.

> Using a hardware device means that the keys to your Bitcoins are never exposed to software or stored on your file system where they can be copied by malware. Keep a copy of your seed words on paper in a vault and use a backup hardware device in case of loss, damage or theft. In case of device theft, transfer the Bitcoins to a new wallet.

## Device displays receive address for confirmation

There is a lack of any on-device screens, thus complicating the verification process. A transaction is sent to the device for signing and the user blindly presses a button on the device as confirmation.