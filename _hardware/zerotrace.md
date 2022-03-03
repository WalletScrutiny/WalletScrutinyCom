---
title: "Zero Trace"
appId: zerotrace
authors:
- danny
released: 2020-07-10
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: "Zero Trace"
providerWebsite: 
website: https://zerotrace.org
shop: https://zerotrace.org/product/zerotracepen/
country: US
price: 97USD
repository: 
issue: 
icon: zerotrace.png
bugbounty: 
meta: ok
verdict: noita
date: 2022-02-23
signer: 
reviewArchive: 
twitter: 
social: 
  - https://www.facebook.com/zerotrace.org
---

## Product Description

> Zero Trace is an all-in-one flash drive with everything you need to stay anonymous. Being completely portable, you can access the Tor network on any computer from the USB port, anonymously from the Zero Trace Pen.  Clearnet, Dark Web, Darknet, Deep Web Compatible
>
> - 40+ Pre-installed Privacy Apps
> - Built-In MAC Address Spoofer
> - Double Kill Switch (WiFi & RAM)
> - Cold Storage Cryptocurrency Wallet
> - ZT PRO Support

## A Live-USB with a customized Tails Linux OS with Apps

A cursory Google search with the terms "Zerotrace" + "Tails" will bring the user to a few reddit threads on r/Linux and one blog post on publish0x.com. The allegations are: the pen is merely a USB drive with a bootable Tails Linux OS along with an Electrum app + 39 other open source apps. One of the comments says that the USB drive's capacity is 16 GB which should cost less than $10 today.

So I then checked on Youtube.com and searched for unboxing reviews. Most of the reviews were positive with words like "definitely worth it". Considering that it's a 16 GB USB drive with a pre-installed version of a free Linux distribution, we might have to dig a little deeper about their unique value proposition. Sure enough, in one of the videos, the reviewer plugs the USB portion of the pen, reboots the PC, and the Tails OS splash screen appears. Electrum is one of the pre-installed apps.

## Analysis

The company's business address listed on the website is a US Postal Service office in Miami, Florida. We also searched for USB drives that are disguised as ballpoint pens and they're priced somewhere between $10-$20. Tails OS, a Linux distribution, is free. Electrum is free software as well.

We would have to stretch our definition of a **hardware wallet** to fit Zero Trace into this category.

To be fair, the Zero Trace pen isn't really marketed as a hardware wallet, but as an all around anonymizer with the bonus of a cryptocurrency wallet. Most hardware wallets have a Secure Element or a chip designed for ensuring that the private keys are retained on the device. There is no information if the Zero Trace device has this element given that it's merely a USB drive. At the very least, this device **does not have a display nor an interface** by which a user can confirm cryptocurrency transactions.   
