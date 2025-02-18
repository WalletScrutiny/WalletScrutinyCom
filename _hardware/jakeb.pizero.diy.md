---
title: Jake-B Pi Zero DIY Hardware Wallet
appId: jakeb.pizero.diy
authors:
- danny
released: 2017-07-20
discontinued: 
updated: 2017-07-24
version: 
binaries: 
dimensions:
- 66
- 31
- 5
weight: 9
provider: Jake Bordens
providerWebsite: https://www.allaboutjake.com/
website: 
shop: 
country: US
price: 
repository: https://github.com/jake-b/PiZeroWallet
issue: 
icon: jakeb.pizero.diy.png
bugbounty: 
meta: defunct
verdict: diy
appHashes: 
date: 2022-05-26
signer: 
reviewArchive: 
twitter: allaboutjake
social: 
features: 

---

## Background 

This is a do-it-yourself project that predates several similar projects, because they were built on a Rasperry Pi: 

- {% include walletLink.html wallet='hardware/openledger.micro' verdict='true' %}
- {% include walletLink.html wallet='hardware/pitrezor' verdict='true' %}
- {% include walletLink.html wallet='hardware/seedsigner' verdict='true' %}


The {{ page.title }} was released in July 20, 2017. Jake Bordens has a [blog post](https://www.allaboutjake.com/pi-offline-crypto-wallet/) detailing his efforts.

## Description 

From Jake's [blog post](https://www.allaboutjake.com/pi-offline-crypto-wallet/): 

"Airgapped"

> It has no onboard networking hardware, making it easy to maintain separation by simply never connecting a network interface.

It needs a host machine to function:

> The serial gadget makes it possible to connect the Pi Zero to a host machine and login to the command line. This is what I mean by “pseudo-airgapped”. Yes, I am connecting the machine to another via USB… but in theory, only via a simple serial connection. I’m sure there are state-level hackers that could do something malicious with this connection, but I’m pretty satisfied that it is somewhat secure for my purposes. (If you are really paranoid, you could use the Pi Zero’s serial port and use a USB-to-TTL-Serial thingy, and completely isolate the Pi from anything but a serial console)

Build instructions are all on the blog post noted above. 

## Analysis 

Unlike the {% include walletLink.html wallet='hardware/seedsigner' %} or the {% include walletLink.html wallet='hardware/pitrezor' %}, this device does not have a display. It is a **do-it-yourself** project and all the instructions are documented. The project has **not seen any updates beyond 2017**.   
