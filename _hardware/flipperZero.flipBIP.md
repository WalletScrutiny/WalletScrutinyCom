---
title: Flipper Zero Flip BIP App
appId: flipperZero.flipBIP
authors:
- danny
released: 2023-03-04
discontinued: 
updated: 2023-10-22
version: 1.14.0
binaries: https://github.com/xtruan/FlipBIP/releases/tag/v1.14.0
dimensions:
- 85
- 130
- 45
weight: 102
provider: Flipper Devices
providerWebsite: https://flipperdevices.com/
website: https://flipperzero.one
shop: https://flipperzero.one/how-to-buy
country: US
price: 169USD
repository: https://github.com/xtruan/FlipBIP
issue: 
icon: flipperZero.flipBIP.png
bugbounty: 
meta: ok
verdict: nowallet
appHashes: 
date: 2023-12-22
signer: 
twitter: flipper_zero
social: 
features: 

---

**Point of clarification:** The device is not a standalone Bitcoin wallet. The
user still has to download the Flip BIP app. What we are reviewing is the app on
the multipurpose device, Flipper Zero.

## Features

> Trezor crypto C code ported into crypto subfolder
  >
  > Adapted to use Flipper hardware RNG (see crypto/rand.c)
  > Imports and some C library functions modified for compatibility with FBT

> Navigation and UI adapted from FAP Boilerplate app
>
> BIP39 mnemonic generation
  > - 24, 18, or 12 words
>
> BIP39 mnemonic to BIP39 seed generation
> 
> Hierarchical Deterministic (HD) wallet generation from seed
>
> Generation of offline m/44'/0'/0'/0 BTC wallet
>
> Similar features to: https://iancoleman.io/bip39/

## Can the private keys be created offline? 

The base Flipper Zero device isn't connected to the Internet. It can have this capability if an expansion board is installed. So, yes, the app can create the private keys offline.

> Saving wallets to SD card
> 
> Wallets are saved to SD card upon creation in apps_data/flipbip
>
> NOTE: apps_data folder must already exist on SD card!

## Are the private keys shared? 

No, the [README](https://github.com/xtruan/FlipBIP/blob/main/README.md) file describes the installation of the app on the Flipper Zero via USB. After installation, the app no longer needs to be connected to another device.

## Does the device display the receive address for confirmation?

It was not explicitly mentioned whether the device can be used to send bitcoin. We will [verify with the developer.](https://github.com/xtruan/FlipBIP/issues/26)

**Update 2023-12-22**

We got a reply and confirmed that the device cannot send bitcoins yet, much less display a confirmation on the screen. Without the ability to sign transactions, we could not consider this to be fully a wallet. It can store seed phrases and generate private keys. The inability to sign transactions means this is **not a wallet**.

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes.
