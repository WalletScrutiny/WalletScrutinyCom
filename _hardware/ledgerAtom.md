---
title: Ledger Atom
appId: ledgerAtom
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Ledger
providerWebsite: https://www.ledger.com/
website: https://shop.ledger.com/pages/ledger-atom
shop: https://shop.ledger.com/pages/ledger-atom
country: FR
price: 849USD
repository: 
icon: ledgerAtom.webp
bugbounty: 
meta: ok
verdict: unreleased
date: 2026-10-16
signer: 
twitter: Ledger
social:
- https://www.linkedin.com/company/ledgerhq
- https://www.facebook.com/Ledger
- https://www.instagram.com/ledger
- https://www.youtube.com/Ledger
- https://www.tiktok.com/@ledger
builds: 
features: 

---

## Review 2026-10-16

Ledger [announced the Ledger Atom](https://www.ledger.com/blog-introducing-ledger-atom) on 2026-10-15. It is a phone-like device with a 6.77" touchscreen that runs Android apps next to Ledger's own secure environment. Ledger calls it a "signer":

> Ledger Atom is a Ledger signer that runs your everyday apps.

It is **not yet released**. Ledger takes reservations at a special reserve price of $849 with a $100 refundable deposit, and states:

> The estimated delivery date is Q2 2027. It is an estimate, not a commitment, and may change.

### Bitcoin support

The [Ledger Atom whitepaper](https://www.ledger.com/ledger-atom-whitepaper) names Bitcoin among the apps that run in its secure mode:

> Secure Applications (such as Ethereum or Bitcoin) run on top of Ledger OS.

### Architecture

Per the whitepaper, the device has two separate chips with their own firmware: a "Standard Mode" running an operating system "built on Android Open Source Project", and a "Secure Mode" running Ledger OS on a secure element. Ledger OS is the same closed-source operating system used on the [Ledger Stax](https://walletscrutiny.com/hardware/ledgerStax/) and [Ledger Flex](https://walletscrutiny.com/hardware/ledgerFlex/).

### Source code and reproducibility

The whitepaper claims:

> Firmware artifacts shipped on Ledger Atom are built reproducibly: a clean rebuild from the same pinned sources and toolchain produces a bit-for-bit identical result, which any party can independently verify.

We could not find any published source code for Ledger OS or for the device's Bitcoin app. Without public source code, no independent party can do that rebuild.

We will review the device once it ships.
