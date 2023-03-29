---
title: Satochip Seedkeeper
appId: satochip.seedkeeper
authors:
- danny
released: 2022-03-28
discontinued: 
updated: 
version: 0.1
binaries: https://github.com/Toporin/Seedkeeper-Applet/releases/tag/v0.1
dimensions:
- 85.60
- 53.98 
weight: 
provider: Satochip
providerWebsite: https://satochip.io
website: https://seedkeeper.io
shop: https://satochip.io/product-category/seedkeeper-seed-storage/
country: BE
price: 25 EUR
repository: https://github.com/Toporin/Seedkeeper-Applet
issue: 
icon: satochip.seedkeeper.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2023-02-07
signer: 
reviewArchive: 
twitter: satochipwallet
social: 
- https://www.linkedin.com/company/satochip/
---

## Product Description 

> - Seeds are stored in the smartcard secure memory and can only be accessed by their legitimate owner using a short, easy-to-remember, secret PIN code.
> - Seedkeeper can be conveniently used in combination with a Satochip hardware wallet to serve as a secure backup.
> - Import an existing seed on the Seedkeeper;
> - Generate a new (random) mnenomic with the tool and store it on your Seedkeeper card;
> - Generate a new (random) masterseed directly on the Seedkeeper;
> - Export a seed stored in the Seedkeeper to setup a new Satochip hardware wallet.

[Source](https://github.com/Toporin/Seedkeeper-Applet) 

Used in conjunction with an official Satochip smartcard reader which can be plugged to a desktop computer via USB.

The [Seedkeeper Tool](https://github.com/Toporin/Seedkeeper-Tool) is used on either a Windows or Linux PC to perform functions on the Seedkeeper. 

> GUI client for use with the Seedkeeper secure vault smartcard. It requires a Seedkeeper smartcard loaded with the Seedkeeper javacard applet v0.1.

## More Features 

> ### PIN CODE
> Your Seedkeeper card is protected by a PIN code: a 4-16 characters password used to unlock it.
>
> Any sensitive command requires to unlock the device using your personal PIN code.
>
> After the wrong PIN is input several times (typically 4), the device bricks itself and cannot be used anymore!
> 
> ### ENCRYPTED EXPORT
>
> A seed can be exported in two ways, as defined during seed creation:
>
> - In plaintext: the seed is shown in plaintext on the SeedkeeperTool and can be copied to any wallet;
>
> - In encrypted form: the seed is encrypted for a specific device based on the authentikey and can only be exported for that device.

[Source](https://seedkeeper.io/#what)

## Analysis 

The Seedkeeper does not have its own display or buttons for the user to interact with. It relies on a smartcard reader which is connected to either a Windows or a Linux PC/laptop. 

The Javacard applet and the Seedkeeper tool are both Open Source. 

It claims to provide the ability for encrypted export but the reliance of the Seedkeeper on a smartcard reader, and a PC or a laptop comes with considerable risks. 


