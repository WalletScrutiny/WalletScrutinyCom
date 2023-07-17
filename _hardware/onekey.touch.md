---
title: OneKey Touch
appId: onekey.touch
authors:
- danny
released: 2022-03-08
discontinued: 
updated: 2023-06-21
version: 4.3.0
binaries: 
dimensions:
- 88
- 53
- 9.2
weight: 75
provider: OneKey
providerWebsite: 
website: https://onekey.so/
shop: https://onekey.so/products/onekey-touch-hardware-wallet/
country: SG
price: 249 USD
repository: https://github.com/OneKeyHQ/firmware
issue: 
icon: onekey.touch.png
bugbounty: 
meta: ok
verdict: wip
date: 2023-07-13
signer: 
reviewArchive: 
twitter: OneKeyHQ
social:
- https://discord.com/invite/nwUJaTzjzv
features: 

---

Note from Provider:

> "...all (OneKey devices) need our APP to send data, process the received information inside the hardware, and then return it. This ensures that the private key in our hardware is safe.

Paired with: {% include walletLink.html wallet='android/so.onekey.app.wallet' verdict='true' %}

## [Operation Instructions](https://help.onekey.so/hc/en-us/articles/360002123856-OneKey-Hardware-Wallet-Quick-Start-Tutorial)

1. Can the private keys be created offline?

**Yes**. See [tutorial on seed generation](https://help.onekey.so/hc/en-us/articles/360004487195)

2. Are the private keys shared?

The hardware wallet is paired with the Android app prior to the generation of the private keys.

[Video reference ](https://youtu.be/9EMmZwCUxRA?t=290)

We'll go by the assumption that the hardware wallet does not share the private keys with the mobile app.

3. Does the device display the receive address for confirmation?

**Yes.**

[Video Reference](https://youtu.be/9EMmZwCUxRA?t=1249)

4. Does the interface have a display screen and buttons that allows the user to confirm transaction details?

**Yes** the device has a touchscreen interface.

5. Is it reproducible?

*For verification*
