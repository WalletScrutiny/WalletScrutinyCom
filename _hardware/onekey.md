---
title: OneKey Classic
appId: onekey
authors:
- kiwilamb
- danny
- leo
- mohammad
released: 2022-08-23
discontinued: 
updated: 2026-02-05
version: 3.12.0
binaries: 
dimensions:
- 86
- 52
- 5.2
weight: 20.5
provider: Bixin
providerWebsite: https://onekey.so/
website: https://onekey.so/en-US/hardware
shop: https://onekey.so/en-US/hardware
country: SG
price: 42USD
repository: https://github.com/OneKeyHQ/firmware
icon: onekey.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- a8d7051ea8b4a85038d032e4b86d5e8ee8f34870e3f861e59bf1a5578c36d176
date: 2025-09-08
signer: 
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
builds: 
features:
- hd
- foss
- segwit
- taproot
- multiSig

---

## Device Description

OneKey Classic is a hardware Bitcoin and multi-cryptocurrency wallet whose C firmware is a fork of the Trezor One codebase, licensed under GPL v3 and built with an ARM cross-compiler inside a Nix-pinned shell (`prebuild.yml` installs dependencies via `nix-shell --run "poetry install"`). The device has a 1.54-inch 128×64 OLED display and physical confirmation buttons; signing logic in `legacy/firmware/signing.c` covers SegWit, Taproot, and multisig inputs. Private keys are derived from a BIP39 mnemonic and, per the provider, are created and stored exclusively on-device.

## Private keys are created offline - ✔️

From the [FAQ](https://shop.onekey.so/pages/faq)

> Number 5. The private keys of OneKey **are all created offline**, avoid cyber attacks completely. The physical buttons and display screen can provide complete protection even if the computer or mobile phone is implanted with malicious viruses, the transaction information needs double check on hardware device then signed for release. Software side cannot tamper it， private key is more secure throughout.

## Private keys are not shared with OneKeyHQ - ✔️

OneKey claims that the private keys are only [controlled by the user](https://help.onekey.so/hc/en-us/articles/360002184256-Why-Use-OneKey-Hardware-Wallets-to-Manage-Private-Keys-#deadLink)

> Wallet helpers and seeds created with OneKey are **stored locally and encrypted, so only you can decrypt the information, and our servers do not and cannot store any of the user's private data**. No more centralized institutions, you are in full control of your encrypted assets.

## Device displays receive address for confirmation - ✔️

[Tutorial on how to withdraw coins to OneKey](https://help.onekey.so/hc/en-us/articles/4408458838799-How-to-withdraw-coins-from-exchanges-to-OneKey-Mini-hardware-wallet#deadLink)

OneKey has a 1.54 Inch OLED with 128 x 64 pixels.

From the renderings provided on this [page](https://help.onekey.so/hc/en-us/articles/360004487195-OneKey-classic-hardware-wallet-activation-tutorial#deadLink), the OneKey hardware wallet has a confirmation button.

However, this is from the official documentation. We were not able to find third-party content such as pictures or videos on social media or blogs that depicts the actual device.

## Interface

Activating the wallet starts with the device providing the mnemonics and then securing it with a pin.

The wallet activation tutorial can be found [here](https://help.onekey.so/hc/en-us/articles/360004487195-OneKey-classic-hardware-wallet-activation-tutorial#deadLink).

Incorrectly entering the pin code 10 times, resets the wallet.

The wallet can then be connected to the OneKey [Desktop client](https://onekey.so/download?client=desktop) or through a [browser plug-in](https://onekey.so/plugin).

## Device Analysis

This device is **source-available**.

{% include featureEvidence.html feature="hd" source="[firmware/fsm_msg_common.h](https://github.com/OneKeyHQ/firmware/blob/onekey/legacy/firmware/fsm_msg_common.h)" quote="Mnemonic with wrong checksum provided" %}
{% include featureEvidence.html feature="foss" source="[COPYING](https://github.com/OneKeyHQ/firmware/blob/onekey/COPYING)" quote="GNU GENERAL PUBLIC LICENSE Version 3" %}
{% include featureEvidence.html feature="segwit" source="[firmware/signing.c](https://github.com/OneKeyHQ/firmware/blob/onekey/legacy/firmware/signing.c)" quote="Segwit not enabled on this coin" %}
{% include featureEvidence.html feature="taproot" source="[firmware/signing.c](https://github.com/OneKeyHQ/firmware/blob/onekey/legacy/firmware/signing.c)" quote="Taproot not enabled on this coin." %}
{% include featureEvidence.html feature="multiSig" source="[firmware/signing.c](https://github.com/OneKeyHQ/firmware/blob/onekey/legacy/firmware/signing.c)" quote="Error computing multisig fingerprint" %}