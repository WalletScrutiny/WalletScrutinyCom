---
title: Mycelium Entropy
appId: mycelium.entropy
authors:
- danny
released: 2015-03-03
discontinued: 
updated: 2015-11-24
version: '1.1'
binaries: https://mycelium.com/download/entropy/me-1.1.bin
dimensions:
- 51
- 15
- 7.6
weight: 1
provider: Mycelium
providerWebsite: https://mycelium.com
website: https://mycelium.com/mycelium-entropy.html
shop: https://www.amazon.com/gp/product/B00WIRLGH4/
country: UK
price: 29.99USD
repository: 
issue: 
icon: mycelium.entropy.png
bugbounty: 
meta: defunct
verdict: plainkey
appHashes: 
date: 2024-11-15
signer: 
twitter: MyceliumCom
social:
- https://www.linkedin.com/company/mycelium/about/
- https://www.facebook.com/myceliumcom
features: 

---

## Background 

Mycelium held an [indiegogo fundraiser](https://www.indiegogo.com/projects/mycelium-entropy#/updates/all) for the Entropy on October 30, 2014. They were able to raise $31,271 out of their target goal of $20,000. 

## Product Description 

<iframe width="560" height="315" src="https://www.youtube.com/embed/cuUCjeABxOM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br /><br />

- [Documentation Available](https://mycelium.com/assets/entropy/me.html#_appendix_b_how_it_works)

> Mycelium Entropy is a small USB device with a single purpose: Making it easy to create Bitcoin paper wallets in a secure controlled environment.
>
> Paper wallets are created in 3 simple steps:
> 
> 1. Insert Mycelium Entropy into a printer that allows you to print pictures from a USB flash drive.
> 2. Select the print option on the printer.
>
> This way the paper wallet has never touched a computer or a network, and as soon as you eject the device the private key is wiped from memory.
>
> Mycelium Entropy is the easiest and most secure way of creating a paper wallet for offline cold storage.

## How it Works

> When Mycelium Entropy is inserted into a USB socket, it powers up and generates a large random number based on hardware entropy. That number is turned into a Bitcoin private key and a Bitcoin address. The private key and the address are turned into QR codes and and stored in a JPG file, and the USB device presents itself as a USB flash drive. This allows a printer that can print photos off a USB flash drive to print the paper wallet directly off the device.

## Analysis 

From the [Bitcoinist interview](https://bitcoinist.com/mycelium-entropy-exclusive-interview/), 

> 3. Is the entropy impervious to viruses or other malicious software?<br />
> By default, yes, because the underlying OS and system files are never exposed to the device accessing it. When Mycelium Entropy is plugged into a printer or a PC, the only thing they see is a JPG file. However, when the device is switched to flash mode, for the purpose of changing device settings or flashing new firmware, all the system files are visible to the PC, and thus may be targeted. Since the device never stores any actual bitcoin keys, a attacker would have to modify the code on the device to have it create private keys he knows about.Running a sha check on the files to compare them to the ones on our site will help prevent this. 

The {{ page.title }} is a USB device that looks to the host as if it were a pen drive with a single document on it but that document is truly random and thus different every time you plug it in.

The firmware is available [here](https://mycelium.com/download/entropy/me-1.1.bin).




