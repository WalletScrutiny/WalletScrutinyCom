---
title: "BITHD Watch 1"
appId: bithdwatch1
authors:
- kiwilamb
- danny
released: 2017-01-01
discontinued: # date
updated:
version:
dimensions: [42, 37, 14]
weight: 
website: https://bithd.com/BITHD-watch-1.html
shop: https://bithd.com/BITHD-watch-1.html
company: BitHD
companywebsite: https://bithd.com
country: CH
price: 
repository: https://github.com/bithd
issue:
icon: bithdwatch1.png
bugbounty:
verdict: wip
date: 2021-07-16
signer:
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 
---


{{ page.title }} is the first-generation BitHD watch. As said on Bitpie's [Medium article:](https://medium.com/bitpie/where-can-you-purchase-bithd-hardware-wallet-be5b43dea016)

> The BitHD watch was unveiled December 30th 2017 as the first generation; the second generation — {% include walletLink.html wallet='hardware/bithdwatch2' %} was launched on January 18th 2019.

## Interface

We assume that this product functions similarly to its successor. It is a wearable hardware wallet with a 0.96 screen display and must be paired with the Bitpie app via Bluetooth.

It's not clear what the exact difference between the two generations is, but [a post from Bitpie Wallet on bitcointalk.org](https://bitcointalk.org/index.php?topic=5104019.0) implies that it is more involved with the external design of the watch.

> Compare to the first generation, the new generation is lighter, thinner, much more comfortable to wear and come with a magnetic wireless fast charger. It also has a longer battery life and a higher waterproof level.

The bitcointalk.org post linked above links to [this article](https://www.cybtc.com/article-3225-1.html) concerning {{ page.title }}. The article is a guide for setting up this specific product.

## Private keys can be created offline - ✔️

This wallet must be paired with Bitpie via **Bluetooth** before the user is allowed to create a wallet or generate the seed.

## Private keys are not shared - ✔️

From the [product page:](https://bithd.com/BITHD-watch-1.html)

> Assets are stored in cold model, completely kept away from internet. Base on mature technical solution of hardware wallet.

From [bitcointalk.org:](https://bitcointalk.org/index.php?topic=5104019.0)

- Unauthorized physical access to wallet protected by PIN
- Password account – (protect private key leak)
- No private keys leak risk in case of theft

## Device displays receive address for confirmation - ✔️

As shown in the guide linked in a previous section, you can see that the device will display the receive address for confirmation.

## Reproducibility

There is a Github repository titled "BitHD Firmware" which is forked from Trezor. This repository appears to still be active and has received a recent update.

This product is also slated for verification.
