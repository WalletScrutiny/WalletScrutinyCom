---
title: Keepstick 32
appId: keepstick.32
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 56
- 22
- 10
weight: 30
provider: The Broadband Computer Company Limited
providerWebsite: 
website: https://keepstick.com/
shop: https://keepstick.com/cart
country: UK
price: 69GBP
repository: 
issue: 
icon: keepstick.32.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: '2022-05-03'
signer: 
reviewArchive: 
twitter: keep_stick
social:
- https://www.linkedin.com/company/keep-stick/
- https://www.facebook.com/KeepStick/
- https://www.instagram.com/keep_stick/
features: 

---

## Product Description 

> - Electrum based
- USB device with built in VPN (1 year subscription)
- Linux Ubuntu 18.04 based OS 
- 18GB of personal encrypted file storage
- Can be activated through an activation code sent by provider through email
- The Keep Activation App automatically sets up VPN, personal encrypted email, public/private key pair and password encrypted storage 

## Analysis 

The device is basically a Live Pendrive Linux (Ubuntu 18.04) with pre-installed Electrum Bitcoin Wallet. In other words, it's a standard USB pendrive with custom, bootable software.

**Activation**

> When you order a Keep Stick we send you a Keep USB stick via post and an Activation Key code via email. When you receive your stick you enter the code as part of the built in secure activation process to create your personal encrypted account on the stick. This process also automatically sets up your connected VPN and personal encrypted email services. 

**The device's Keep App automatically downloads security updates and other new features** 

Although it is standard practice to receive security updates to an OS or to an app, having this done on the same environment as a Bitcoin wallet can introduce risks. First, the updates that the custom OS downloads means that the provider has to be trusted. 

We tried to [verify](https://twitter.com/BitcoinWalletz/status/1518761437895991296) with Keep Stick if any of their software is Open Source. Their [documentation](https://keepstick.com/pages/faqs) generally states: 

> The open source applications we bundle with Keep Stick come with built in help and/or links to online documentation.

Since we believe that Keep Stick may have customized some of these applications, we need to know if their customizations are open source as well. 