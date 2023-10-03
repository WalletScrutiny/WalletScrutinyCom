---
title: ArcBTC M5StackSats Point of Sale Device
appId: arcbtc.m5stacksats.pos
authors:
- danny
released: 2019-07-28
discontinued: 
updated: 2021-03-14
version: 
binaries: 
dimensions:
- 58
- 54
- 19
weight: 264
provider: Ben Arc
providerWebsite: 
website: 
shop: 
country: UK
price: 55USD
repository: https://github.com/arcbtc/M5StackSats
issue: 
icon: arcbtc.m5stacksats.pos.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2022-05-20
signer: 
reviewArchive: 
twitter: 
social: 
features: 

---

## Background 

From [GitHub:](https://github.com/arcbtc/M5StackSats)

> A bitcoin point of sale terminal using the ESP32 based M5Stack

This is the predecessor to the more recently updated {% include walletLink.html wallet='hardware/arcbtc.lnpos' verdict='true' %}

There are two versions of the project: M5Stack 1.21 Opennode version and Raspberry Pi Blitz LND version.  

## Video Tutorial 

<iframe width="560" height="315" src="https://www.youtube.com/embed/o4jqUbmypRQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Product Description 

This version of the the {{ page.title }} connects to the OpenNode *custodial* service. 

[OpenNode's Service described](https://www.opennode.com/): 

> Get lightning-fast, low-cost bitcoin payments and payouts for your business with our powerful API, ecommerce plugins, or hosted payment pages.
>
> Seamlessly convert between Bitcoin and major currencies
automatically at the time of the transaction with locked
exchange rates, or on demand.
> 
> Convert settled funds to/from bitcoin anytime. Hold funds in your preferred currency and optimize funds transfers.
> 
> When you deposit local currency, OpenNode converts to bitcoin at the time payouts are initiated to provide price certainty.

The OpenNode version is a [custodial service](https://youtu.be/o4jqUbmypRQ?t=319).

## Analysis 

The {{ page.title }} is a **do-it-yourself** Point of Sale system that interfaces with a custodial service. It is therefore **not a wallet**. 

