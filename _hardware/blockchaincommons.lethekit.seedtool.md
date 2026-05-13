---
title: Blockchain Commons LetheKit Seedtool
appId: blockchaincommons.lethekit.seedtool
authors:
- danny
released: 2020-10-16
discontinued: 
updated: 2021-10-07
version: 0.5.0
binaries: 
dimensions: 
weight: 
provider: Blockchain Commons (Ken Sedgwick, Gorazd Kovacic, and Christopher Allen)
providerWebsite: https://www.blockchaincommons.com/
website: https://www.blockchaincommons.com/apps/Releasing-LetheKit/
shop: 
country: US
price: 58.03USD
repository: https://github.com/BlockchainCommons/lethekit
icon: blockchaincommons.lethekit.seedtool.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-02-27
signer: 
twitter: BlockchainComns
social: 
builds: 
features:
- selfBuild
- airGapped
- camera
- foss
- hd

---

## Product Description

> LetheKit is a do-it-youself platform for performing various sensitive cryptographic operations on an offline airgapped device. It uses no WiFi or Bluetooth which could leak information and contains no local storage, and when the device is turned off it forgets any sensitive data stored in RAM. Thus the name Lethe (lee-thee), from the mythological river of forgetfulness and oblivion.

<iframe width="560" height="315" src="https://www.youtube.com/embed/OSTQthcxsh0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

From [Gorazdko](https://twitter.com/gorazdko/status/1321399421238714368) 

> Users can roll a physical dice or generate hardware entropy to create truly random seeds
>
> Gordian LetheKit is a hardware exemplar meant to display the Gordian Principles, which are philosophical and technical underpinnings to Blockchain Commons' Gordian technology. This includes:
> 
- Independence. LetheKit ensures that you're in total control of your seeds.
- Privacy. LetheKit is totally offline.
- Resilience. LetheKit depends on you for its resilience, since you must back up your words or codes.
- Openness. LetheKit communicates through airgaps via URs and QRs, for maximum interoperability.

## Analysis 

The {{ page.title }} is in late alpha development stage. As a **DIY** device, it can perform the following functions: 

> - Display the seed in UR, QR code, or text. 
- The seed can also be converted into BIP39 words. 
- Construct HD-keys to view them on another wallet. 
- It is also possible to view bitcoin address derived from mnemonic seeds with BIP32. 
- Wallet descriptors can be exported to another device.

{% include featureEvidence.html feature="hd" quote="The Seedtool Application Instuctions describe how to generate and recover BIP-32 HD wallet master seeds in BIP-39 and SSKR formats." source="GitHub README" %}

{% include featureEvidence.html feature="airGapped" quote="LetheKit is a do-it-youself platform for performing various sensitive cryptographic operations on an offline airgapped device. It uses no WiFi or Bluetooth which could leak information and contains no local storage, and when the device is turned off it forgets any sensitive data stored in RAM." source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="the contents of this repository are Copyright © 2020 by Blockchain Commons, LLC, and are licensed under the spdx:BSD-2-Clause Plus Patent License." source="GitHub README" %}

{% include featureEvidence.html feature="camera" quote="Openness. LetheKit communicates through airgaps via URs and QRs, for maximum interoperability." source="GitHub README" %}