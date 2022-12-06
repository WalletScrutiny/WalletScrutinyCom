---
title: Ken Sedgwic Lightning Pay Station Point of Sale
appId: kensedgwic.lightningpaystation
authors:
- danny
released: 2019-06-29
discontinued: 
updated: 2019-08-05
version: case19
binaries: https://github.com/ksedgwic/lightning-pos/releases/tag/case19
dimensions: 
weight: 
provider: Ken Sedgwick
providerWebsite: https://www.bonsai.com/
website: 
shop: 
country: US
price: 61.32USD
repository: https://github.com/ksedgwic/lightning-pos
issue: 
icon: kensedgwic.lightningpaystation.png
bugbounty: 
meta: obsolete
verdict: nowallet
date: 2022-05-21
signer: 
reviewArchive: 
twitter: ksedgwic
social:
- https://keybase.io/ksedgwic
- https://reddit.com/user/kensedgwick

---

## Background 

Ken Sedgwic is a Software Consultant and the founder of Bonsai Software, Inc. Bonsai is a platform that provides invoicing solutions for freelancers. 

Ken acknowledged the role of [arcbtc](https://github.com/arcbtc) and his [OpenNode Tutorial](https://github.com/arcbtc/bitcoin2019conf) in bootstrapping the Lightning Pay Station project.

From the GitHub page:

> The goal of this project is to build an inexpensive open source point-of-sale terminal for lightning network payments. The terminal can connect to:
>
1. OpenNode Accounts
2. BTCPay's Invoice API
3. LND's REST Interface
>
> The unit is designed to be attached to a wall or used standalone on a counter. It contains an internal battery and can operate for many hours on battery power. It requires a WiFi network to connect to the invoice api.
>
The current software supports three "presets" for commonly purchased item descriptions and prices and an "other" item with a dynamically specified price.
>
The [Parts List](https://github.com/ksedgwic/lightning-pos/blob/master/parts-list.md) describes all needed parts.
>
The case can be 3D printed from the provided STL files.
>
The [Assembly Instructions](https://github.com/ksedgwic/lightning-pos/blob/master/assembly.md) show how to put it together.

## Video 

<iframe width="560" height="315" src="https://www.youtube.com/embed/q51sR7Ha8ME" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Parts List 

|                 Description                 | Quantity | Price  | Updated    |
|:-------------------------------------------:|----------|--------|------------|
| MH-ET LIVE 1.54 Inch Epaper Module          | 1        | $12.00 | 2017-11-21 |
| 16 Key Membrane Switch Keypad               | 1        | $0.54  | 2017-12-23 |
| SparkFun ESP32 Thing Plus                   | 1        | $20.95 | 2017-11-25 |
| Lithium Ion Battery - 2Ah                   | 1        | $12.95 | 2017-11-25 |
| LED - Basic Green 5mm                       | 1        | $0.35  | 2017-11-26 |
| LED - Basic Blue 5mm                        | 1        | $0.55  | 2017-11-26 |
| LED Holder - 5mm                            | 2        | $1.00  |            |
| Jumper Wires                                | 1        | $1.95  |            |
| Break Away Male Headers - Right Angle       | 1        | $1.95  |            |
| Rocker Switch                               | 1        | $0.75  |            |
| Flat Head Thread-Forming Screws             | 4        | $0.23  |            |
| Phillips Rounded Head Thread-Forming Screws | 6        | $1.41  |            |
| Push-In Bumpers                             | 4        | $0.30  |            |
| 6 ft USB A to MicroUSB B Cable              | 1        | $6.39  |            |
| 3D Printed Case                             | 1        |        |            |
| TOTAL                                       |          | $61.32 |            |

## Analysis 

It's been **more than two years** since the Lightning Pay Station has been updated. We believe that this **do-it-yourself** Point of Sale system connects to either of the three services (OpenNode Accounts, BTCPay's Invoice API, LND's REST Interface) through an API  and thus **cannot be considered a wallet**.  