---
title: Blockstream Jade DIY
appId: blockstream.jade.diy
authors:
- danny
released: 2023-04-23
discontinued: 
updated: 2023-12-03
version: 
binaries: 
dimensions: 
weight: 
provider: EpicCurious
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/epiccurious/jade-diy
icon: blockstream.jade.diy.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-02-27
signer: 
twitter: epic_curious
social: 
builds: 
features:
- selfBuild
- foss

---

Review of the assembled version here: {% include walletLink.html wallet='hardware/blockstreamjade' verdict='true' %}

## GitHub Description 

> The Blockstream Jade is a bitcoin-only hardware wallet that runs 100% on Open Source code.
> 
> The firmware that runs Jade can also run other general purpose hardware that shares the same ESP32 microcontroller.

## Analysis 

This can be adapted for:

 - M5Stack M5StickC PLUS
 - M5Stack Core Basic
 - M5Stack FIRE v2.6

This is a **do-it-yourself project**.

{% include featureEvidence.html feature="foss" quote="The Blockstream Jade is a bitcoin-only hardware wallet that runs 100% on Open Source code." source="GitHub README" %}

{% include featureEvidence.html feature="selfBuild" quote="This is a do-it-yourself project. The hardware consists of a M5Stack, which you can buy off-the-shelf, and a 3D printed case." source="[GitHub epiccurious/jade-diy](https://github.com/epiccurious/jade-diy)" comment="Uses M5Stack Core (commercially available). No binary releases — source available only. Self-build instructions published." %}
