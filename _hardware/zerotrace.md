---
title: Zero Trace
appId: zerotrace
authors:
- danny
- leo
released: '2020-07-10'
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Zero Trace
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
verdict: nosource
appHashes: 
date: '2022-03-08'
signer: 
reviewArchive: 
twitter: 
social:
- https://www.facebook.com/zerotrace.org
features: 

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

So we then checked on Youtube.com and searched for unboxing reviews. Most of the reviews were positive with words like "definitely worth it". Considering that it's a 16 GB USB drive with a pre-installed version of a free Linux distribution, we might have to dig a little deeper about their unique value proposition. Sure enough, in one of the videos, the reviewer plugs the USB portion of the pen, reboots the PC, and the Tails OS splash screen appears. Electrum is one of the pre-installed apps as today it is with vanilla TAILS.

We also searched for USB drives that are disguised as ballpoint pens and they're priced somewhere between $10-$20. Tails OS, a Linux distribution, is free. Electrum is free software as well and **comes preinstalled in Tails, anyway**.

## Analysis

* The "company"'s business address listed on the website is a US Postal Service
  office in Miami, Florida.
* The [team](https://zerotrace.org/about/) is all anonymous.
* The "partners" (Tor Network, Debian and Electrum) do not link back to this
  product.
* There is no way of verifying if the pen contains exactly what is advertised.

To judge it as a hardware wallet, we have to treat it as a USB drive with
pre-installed, closed source software. This "wallet" is **not verifiable**.
