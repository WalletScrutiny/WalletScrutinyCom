---
title: DenixDx OpenHW DIY Hardware Wallet
appId: denisdx.openhw.diy
authors:
- danny
released: 2019-06-24
discontinued: 
updated: 2019-07-10
version: 
binaries: 
dimensions: 
weight: 
provider: DenisDx
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/DenisDx/openHW
issue: 
icon: denisdx.openhw.diy.png
bugbounty: 
meta: obsolete
verdict: diy
date: 2022-05-26
signer: 
reviewArchive: 
twitter: 
social: 

---

## Project Abstract

From the [GitHub page:](https://github.com/DenisDx/openHW)

> OpenHW is an open-source free-licensed project aimed at developing a universal hardware wallet code that supports a wide range of computer chips (including the weakest ones) as well as a wide range of popular boards The main emphasis is on the simplicity of program code integration, simplicity of building and configuring. However, the cryptography used to preserve sensitive data is strong enough to ensure the security of the data at an industrial level if the wallet used correctly.
>
> One of the scenarios for using this code is when the end user buys the device compatible with the code and flashes it himself. An alternative is to buy a device specially designed for use with this firmware, but with the subsequent flashing of the code by the user himself.
>
> This important point provides the user with sufficient assurance that the device does not have built-in backdoors allowing the attacker who sold it to gain access to sensitive information.
>
> We believe that only open-source firmware and self-flashing on independent devices can provide sufficient security guarantees today.

## Description 

### Can you create the private keys offline? - ❓

> The ready-to-use device with firmware is connected to a computer or smartphone (hereinafter - the Host) via USB cable or via Bluetooth (if supported by the chosen board)
>
Host must have openHW-compatible software installed (e.g. EmerAPI KeyKeeper app). The device can be automatically detected or set in the program settings on the host.
>
At the first connection the user is offered to load his private key (and optionally the second private key for the Plausible deniability scheme) into openHW After the private key(s) is loaded, it is proposed to create a PIN code to protect the private key in case the device is stolen (and, optionally, a second PIN to be reported as a real)

### Are the private keys shared? - ❌ 

Yes, the design of the device requires the use of a host.

### Does the device display the receiving address for confirmation? - ❌ 

No, since this is a DIY project with custom hardware.

> The openHW device is controlled by the host by sending text commands. This can be done via a serial port, via USB (USB serial port), if the board has a Bluetooth module and this function is supported in the firmware - via a Bluetooth connection. Commands and data can be ended by line feed characters or be send as a unbreakable stream.

### Does the interface have a display screen and buttons which allows the user to confirm transaction details? - ❌ 

No.

## Analysis

The {{ page.title }} hardware wallet device is an Open Source **do-it-yourself** project with custom hardware. However, the lack of timely updates makes it **obsolete**.



