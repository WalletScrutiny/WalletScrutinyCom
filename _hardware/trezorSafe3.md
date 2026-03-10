---
title: Trezor Safe 3
appId: trezorSafe3
authors:
- danny
- leo
- keraliss
released: 2023-10-12
discontinued: 
updated: 2026-01-21
version: 2.10.0
binaries: https://github.com/trezor/data/tree/master/firmware/t2b1
dimensions:
- 59
- 32
- 7
weight: 14
provider: Trezor
providerWebsite: 
website: https://trezor.io
shop: https://trezor.io/trezor-safe-3
country: CZ
price: 79USD
repository: https://github.com/trezor/trezor-firmware
issue: https://github.com/trezor/trezor-firmware/issues/4586
icon: trezorSafe3.png
bugbounty: https://trezor.io/learn/a/how-to-report-an-issue
meta: ok
verdict: sourceavailable
appHashes:
- 38ebb96d4f0cfd36e28b82480a021d62832c3e72c6577d52f9bc92d12c0466cf
- e19a2be8b201d46e8099f092c9c9dc898b6931f02ea6a27babe4296ee5650765
- 9b2365d76045a02d77714827d311bd8f9c6a47f346224f313d258d7ec4881c46
date: 2025-09-11
signer: 
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
builds:
- arch: arm
  types:
    btc-only:
    - "trezor-*-bitcoinonly.bin"
    universal:
    - "trezor-*.bin"
features: 
- foss

---
{% include featureEvidence.html feature="foss" source="[Website](https://trezor.io)" quote="Advanced hardware security and fully open-source code protect millions of Trezor users every day." %}

## Device Description

The Trezor Safe 3 is a secure hardware wallet that combines a certified EAL6+ Secure Element chip with an open-source design for enhanced protection of digital assets. It features a 0.96" monochrome OLED display, USB-C connectivity, and two-button input for on-device transaction confirmation and passphrase/PIN entry. The wallet supports 12-, 20-, and 24-word backup options, including advanced Multi-share Backup, and integrates with the Trezor Suite app for managing, trading, staking, and tracking thousands of supported cryptocurrencies. Privacy features include Tor support and coin control, while authentication standards include FIDO2 and 2FA. Built with durable materials and tamper-evident casing, the Safe 3 offers a robust cold storage solution in a compact and modern design.

## Previous Review 2024-04-01

This is the latest model of the Trezor hardware wallets and it does feature a
so called "secure element" or SE in short. With that, our first worry is if we
have a firmware to review at all. Popular products like the
{% include walletLink.html wallet='hardware/ledgerNanoS' verdict='true' %} trade
transparency for "security" by running their sofware on chips where the provider
does not allow them to disclose the source, putting the provider in a position
where any update could put funds at risk with no way of independent scrutiny.

As Trezor has been struggling with these SEs for a long time, to the point of
working on [their own SE](https://tropicsquare.com/) that would allow scrutiny,
while always working with truely open source, this product is probably doing the
right thing, too. But ... how can we verify?

It took quite long to find mentions of firmware verifiability for the
{{ page.title }} but as metioned in a reply to
[this issue](https://github.com/trezor/trezor-firmware/issues/3418),

> the Safe 3 firmware is the same type and format as the TT so the exact same
  instructions apply.
> 
> the only change (which we do need to document) is that the path to the TS3
  binary is `build/core-r/fimware/firmware.bin`, and similarly for the model T
  the path changes to `core-t`

This is great but if for example the keys get created by only the SE, we are
back at having to trust its unknown code, right? So how exactly do they use the
SE?

[This article](https://trezor.io/learn/a/secure-element-in-trezor-safe-3) has
answers.

> We do not run code on the chip itself. The Secure Element simply stores a
  secret that can be used to decrypt the recovery seed, i.e., it never actually
  knows what your recovery seed is.

This is good. It implies that the SE neither generates the secret, following the
same path as for example the
{% include walletLink.html wallet='hardware/bitBox2' verdict='true' %}.

So, where is the firmware to be found? Quite a long search doesn't yield a
binary to download and their chatbot appears to not understand us neither.

In the [repo](https://github.com/trezor/data/tree/master/firmware) where we can
find the firmware for their other products, we can see cryptic descriptors
`t1b1`, `t2b1` and `t2t1` which according to
[this code](https://github.com/trezor/trezor-firmware/blob/1e3e7f808b623366a6fcfad855be6490e6f1d879/python/src/trezorlib/models.py#L39)
translate as follows:

```
TREZOR_ONE = T1B1
TREZOR_T = T2T1
TREZOR_R = T2B1
TREZOR_SAFE3 = T2B1
TREZOR_T3T1 = T2B1
TREZOR_DISC1 = DISC1
TREZOR_DISC2 = DISC2
```

