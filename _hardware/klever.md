---
title: Kleversafe
appId: klever
authors:
- danny
released: 2021-12-17
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Klever Exchange
providerWebsite: https://klever.io/
website: https://kleversafe.io/
shop: https://kleversafe.io/cart/
country: BR
price: 199USD
repository: 
icon: klever.webp
bugbounty: 
meta: discontinued
verdict: noita
date: 2026-10-30
signer: 
twitter: klever_io
social:
- https://www.linkedin.com/company/klever-app
- https://www.facebook.com/klever.io
builds: 
features: 

---

**Update 2026-10-30:** KleverSafe can no longer be bought. kleversafe.io now redirects to [klever.io/kleversafe](https://klever.io/kleversafe/), which says "KleverSafe units are currently sold out". The old shop page already showed the device as out of stock at 199 USD in an [archived copy from November 2025](https://web.archive.org/web/20251113001306/https://kleversafe.io/shop/klever-safe/). The K4 app linked below has left Google Play. Its successor is {% include walletLink.html wallet='android/finance.klever.bitcoin.wallet' verdict='true' %}. Among the [Klever GitHub repositories](https://github.com/klever-io) we still found no firmware. We mark the device discontinued; the verdict stays {% include verdictBadge.html verdict="noita" type='short' %}, as the device still has no screen.

Klever is a company with many [development goals](https://web.archive.org/web/20230201032825/https://klever.finance/roadmap/) in mind. It's projects include smart phone wallets, crypto debit cards, its own blockchain, a cryptocurrency exchange and the Klever Hardware wallet which concluded its Pre-Sale in the 4th quarter of 2021. They claim that the Pre-Sale sold out. 

## Advertised Specifications

We were not able to find a video review of the actual device, so we'll go by the advertised technical specifications with what information is publicly available.

We derived information from [this article](https://web.archive.org/web/20220523132824/https://news.klever.io/p/focus-on-klever-hard-wallet) written by Marcelo Soussa, Klever's Head Engineer for their Hard Wallet Squad. 

- There are two types of connections for the device:
  - Bluetooth
  - USB with type-C connector
- They claim that the private keys are stored offline
- Certified security CC-EAL5+

> The wallet also features two buttons to confirm and abort transactions and two communication interfaces: USB (through a type-C connector) and Bluetooth. Visual user interface is accomplished through a RGB LED and the Klever Wallet app in order to provide a simple and efficient device. 
>
> The basic operation of the device is through the Klever Wallet app. As soon as the device is connected via USB or Bluetooth, coin transactions are held by the Klever Hardware Wallet instead of software. 

These are the companion apps. 

For Android:
- {% include walletLink.html wallet='android/cash.klever.blockchain.wallet' verdict='true' %} 

For iOS:
- {% include walletLink.html wallet='iphone/cash.klever.blockchain.wallet' verdict='true' %} 

There was no mention of a display screen on the Klever device. 

## Verdict

Without a video review of the physical device, we can only base our analysis on the information that is publicly available. They claim in [this article](https://web.archive.org/web/20220703015845/https://news.klever.io/p/klever-hardware-wallet-security-best) that:

> With this gadget, everyone can authenticate and confirm transactions without having to resort to their private key or any other sensitive code, as the process is solely managed by the device. The keys, passwords, pin numbers and mnemonics, typical security strategies of the digital world, may be only required during the device initial setup.

The device has no screen wherein the user can visually confirm transactions on the device itself. This also means that it is entirely reliant on the connected mobile phone app.

They also mentioned that they were going to release the source code publicly, but we checked their GitHub repository and we could not find the repository for the hardware wallet.

  


