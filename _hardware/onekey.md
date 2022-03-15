---
title: "OneKey - Limited Edition"
appId: onekey
authors:
- kiwilamb
- danny
- leo
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: "Bixin"
providerWebsite: https://onekey.so/
website: https://onekey.so/en-US/hardware
shop: https://onekey.so/en-US/hardware
country: CN
price: 42USD
repository: 
issue: https://github.com/OneKeyHQ/firmware/issues/17
icon: onekey.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-01-05
signer: 
reviewArchive: 
twitter: OneKeyHQ
social: 
  - https://www.reddit.com/r/OneKeyHQ
---

OneKey is an open source hardware wallet by Bixin. The primary language for the website is Chinese. OneKey, the company claims to be based in Singapore

## Private keys are created offline - ✔️

From the [FAQ](https://shop.onekey.so/pages/faq)

> Number 5. The private keys of OneKey **are all created offline**, avoid cyber attacks completely. The physical buttons and display screen can provide complete protection even if the computer or mobile phone is implanted with malicious viruses, the transaction information needs double check on hardware device then signed for release. Software side cannot tamper it， private key is more secure throughout.

## Private keys are not shared with OneKeyHQ - ✔️

OneKey claims that the private keys are only [controlled by the user](https://help.onekey.so/hc/en-us/articles/360002184256-Why-Use-OneKey-Hardware-Wallets-to-Manage-Private-Keys-)

> Wallet helpers and seeds created with OneKey are **stored locally and encrypted, so only you can decrypt the information, and our servers do not and cannot store any of the user's private data**. No more centralized institutions, you are in full control of your encrypted assets.

## Device displays receive address for confirmation - ✔️

[Tutorial on how to withdraw coins to OneKey](https://help.onekey.so/hc/en-us/articles/4408458838799-How-to-withdraw-coins-from-exchanges-to-OneKey-Mini-hardware-wallet)

OneKey has a 1.54 Inch OLED with 128 x 64 pixels. 

From the renderings provided on this [page](https://help.onekey.so/hc/en-us/articles/360004487195-OneKey-classic-hardware-wallet-activation-tutorial), the OneKey hardware wallet has a confirmation button.

However, this is from the official documentation. We were not able to find third-party content such as pictures or videos on social media or blogs that depicts the actual device.

## Interface 

Activating the wallet starts with the device providing the mnemonics and then securing it with a pin. 

The wallet activation tutorial can be found [here](https://help.onekey.so/hc/en-us/articles/360004487195-OneKey-classic-hardware-wallet-activation-tutorial).

Incorrectly entering the pin code 10 times, resets the wallet.

The wallet can then be connected to the OneKey [Desktop client](https://onekey.so/download?client=desktop) or through a [browser plug-in](https://onekey.so/plugin).

## Code and Reproducibility

OneKey [claims that their software code and firmware codes are open source](https://onekey.so/hardware):

> All codes are open source<br>
  Transparent, WYSIWYG

Sadly their repository redirects to "OneKeyHQ/wallet-deprecated" which contains
no source code and no mention of "firmware".

There is another repo called
[OneKeyHQ/firmware](https://github.com/OneKeyHQ/firmware) (11396 commits)
which is a fork of
[trezor-firmware](https://github.com/trezor/trezor-firmware) (10805 commits).

Their
[OneKey hardware wallet firmware upgrade tutorial](https://help.onekey.so/hc/en-us/articles/360004745796-OneKey-hardware-wallet-firmware-upgrade-tutorial)
looks familiar to how
{% include walletLink.html wallet='hardware/trezorOne' verdict='true' %}
works but with a Bluetooth firmware option. The screenshots and lack of
discussion of such a feature imply there is no way of seeing a hash of the about
to be installed firmware. Neither could we find the signed binary releases.

We opened [an issue](https://github.com/OneKeyHQ/firmware/issues/17) in the
otherwise empty issue tracker of the most likely candidate for being the source
code repository of this product but until confirmation of tis, we have to file
this product as closed source as their website doesn't link to any actual
firmware source code. As such the product is **not verifiable**.
