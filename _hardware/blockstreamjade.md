---
title: "Blockstream Jade"
appId: blockstreamjade
authors:
- kiwilamb
- leo
released: 2021-01-01
discontinued: # date
updated: 2021-10-19
version: 0.1.30
dimensions: [24, 60, 17]
weight: 
website: https://blockstream.com/jade/
shop: https://store.blockstream.com/product/blockstream-jade-token/
company: Blockstream Corporation Inc.
companywebsite: https://blockstream.com/
country: CA
price: 39.99USD
repository: https://github.com/Blockstream/jade
issue: https://github.com/Blockstream/Jade/issues/26
icon: blockstreamjade.png
bugbounty:
verdict: nonverifiable 
date: 2021-11-02
signer:
reviewArchive:


providerTwitter: Blockstream
providerLinkedIn: blockstream
providerFacebook: Blockstream
providerReddit: 
---


**Update 2021-11-02**: We are in touch with the provider and while the firmware
was updated two weeks ago already, their
[latest comment on the issue](https://github.com/Blockstream/Jade/issues/26#issuecomment-947420765)
was a day after the last release, so we assume the problem persists.

{{ page.title }} is one of the newer hardware wallets but provided by
Blockstream which is a very well known player in this space.

On the product website, the {{ page.title }} is advertised as

> **The first purpose-built hardware wallet for Liquid.**<br>
  Blockstream Jade is a purely open-source hardware wallet for the storage of
  bitcoin and Liquid assets.

Liquid is a sidechain developed by Blockstream, mostly used for quick settlement
between centralized exchanges with some advanced features like "confidential
transactions".

This hardware wallet works with
{% include walletLink.html wallet='android/com.greenaddress.greenbits_android_wallet' verdict='true' %}
and its iPhone and desktop counterparts as its companion app.

The provider makes no claims about the firmware being reproducible and neither
can we find the binaries for download. Given the companion app does have a good
track record of being reproducible, we assume
[this issue](https://github.com/Blockstream/Jade/issues/26) to be resolved
quickly and being more about documentation but as with half an hour of searching
we could not find the answers to these questions:

* Where can I download the firmware binary?
* Does the Jade display the binary's hash prior to installation?

the firmware of this device is currently **not verifiable**.
