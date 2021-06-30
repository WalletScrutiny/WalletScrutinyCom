---
title: "Trezor One"
appId: trezorOne
authors:
- leo
released: 2014-07-29
discontinued: # date
latestUpdate: 
version: 
dimensions: [60, 30, 6]
weight: 12
website: https://trezor.io
shop: https://shop.trezor.io/product/trezor-one-black
country: CZ
price: 49EUR
repository: https://github.com/trezor/trezor-firmware
issue: 
icon: trezorOne.png
bugbounty: 
verdict: wip # wip noita nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-06-30
signer: 
reviewArchive:


providerTwitter: trezor
providerLinkedIn: 
providerFacebook: trezor.io
providerReddit: TREZOR
---


This was the first hardware wallet and it's still being sold. The provider now
also offers {% include walletLink.html wallet='hardware/trezorT' verdict=true %}
and is working on [an open source secure element](https://tropicsquare.com/).

On the provider's [page on security](https://trezor.io/security/) we read:

> **Protected bootloader.**<br>
The bootloader is write protected and the JTAG is disabled, so an attacker
cannot replace it.

The bootloader is a tiny but critical part of any computer. Without one, no
higher functionality could be loaded. The device would have no way of knowing it
had a screen and buttons and storage ...

> **Firmware verification.**<br>
  The bootloader always verifies the firmware signature. The firmware is only
  run if correctly signed by SatoshiLabs. Otherwise, a warning is shown.

So in this case, the bootloader is tiny but knows about cryptography as it has
to verify the signature of the firmware and compare its signing key to the
provider's public keys that are hard-coded into the bootloader.

> **Secure update procedure.**<br>
  The bootloader erases the device memory if the firmware signature is invalid.
  Downgrade to a vulnerable version also wipes the memory.

We suppose, downgrading to any version - not only vulnerable ones - wipes the
memory.

The above properties ensure that only software approved by the provider can be
run on this device. It doesn't guarantee that this software is not stealing your
keys.

To our very surprise, the wallet's [main page](https://trezor.io/) has no easy
to find claims about the product being open source.
