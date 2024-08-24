---
title: OneKey - Classic
appId: onekey
authors:
- kiwilamb
- danny
- leo
- mohammad
released: 2022-08-23
discontinued: 
updated: 2024-05-21
version: v3.8.0
binaries: 
dimensions:
- 86
- 52
- 5.2
weight: 20.5
provider: Bixin
providerWebsite: https://onekey.so/
website: https://onekey.so/en-US/hardware
shop: https://onekey.so/en-US/hardware
country: SG
price: 42USD
repository: https://github.com/OneKeyHQ/firmware
issue: https://github.com/OneKeyHQ/firmware/issues/404#issuecomment-1633287406
icon: onekey.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-08-06
signer: 
reviewArchive:
- date: 2022-12-28
  version: 
  appHash: 
  gitRevision: eb1b55711cd4bbb78072e47c1f6cc9fa67074b5e
  verdict: nosource
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
features: 

---

**Update 2023-07-12**: We followed the steps that provider sent to us and ran a script which is based on their
[Github actions](https://github.com/OneKeyHQ/firmware/blob/touch/.github/workflows/build-classic.yml).
Here is the result for v3.0.0:

```
$ sha256sum classic.3.0.0-Stable-0511-0bf60dd.bin downloaded-firmware.bin

1b0e3382adc909fd85b2225f83cf6cd3886e73ff1bf2901ed8ccb1a6414366fd  classic.3.0.0-Stable-0511-0bf60dd.bin
a5d4ac8b98c1249f839fba018850df7deb66a3720f13a01c5d94250e426a0a71  downloaded-firmware.bin
```
The hashes were different, So we had a look at the diff of the hex formatted binaries:

```
$ xxd classic.3.0.0-Stable-0511-0bf60dd.bin > classic.3.0.0-Stable-0511-0bf60dd.hex
$ xxd downloaded-firmware.bin > downloaded-firmware.hex
$ diff classic.3.0.0-Stable-0511-0bf60dd.hex downloaded-firmware.hex

...

304c304
< 000012f0: 63f0 c4f9 2022 0021 15a8 63f0 bff9 3d46  c... ".!..c...=F
---
> 000012f0: 63f0 c2f9 2022 0021 15a8 63f0 bdf9 3d46  c... ".!..c...=F
328c328
< 00001470: 97fd 31b0 bde8 f08f f8ff 0120 2de9 f74f  ..1........ -..O
---
> 00001470: 95fd 31b0 bde8 f08f f8ff 0120 2de9 f74f  ..1........ -..O
402c402
< 00001910: 0120 0020 7047 2822 0021 62f0 afbe 0000  . . pG(".!b.....
---
> 00001910: 0120 0020 7047 2822 0021 62f0 adbe 0000  . . pG(".!b.....
518c518
< 00002050: 4ff0 0003 01d0 5df0 a3ff 0cb0 10bd 00bf  O.....].........
---
> 00002050: 4ff0 0003 01d0 5df0 a1ff 0cb0 10bd 00bf  O.....].........
751c751
< 00002ee0: 1a68 1b9b 5a40 4ff0 0003 01d0 5df0 58f8  .h..Z@O.....].X.
---
> 00002ee0: 1a68 1b9b 5a40 4ff0 0003 01d0 5df0 56f8  .h..Z@O.....].V.
775c775
< 00003060: 019b 5a40 4ff0 0003 01d0 5cf0 99ff 02b0  ..Z@O.....\.....
---
> 00003060: 019b 5a40 4ff0 0003 01d0 5cf0 97ff 02b0  ..Z@O.....\.....
799,800c799,800
< 000031e0: 1899 2030 2844 1db0 bde8 f04f 61f0 1eba  .. 0(D.....Oa...
< 000031f0: 019b 3246 03f1 2004 6019 1899 61f0 16fa  ..2F.. .`...a...
---
> 000031e0: 1899 2030 2844 1db0 bde8 f04f 61f0 1cba  .. 0(D.....Oa...
> 000031f0: 019b 3246 03f1 2004 6019 1899 61f0 14fa  ..2F.. .`...a...
1249c1249
< 00004e00: 5bf0 cef8 27b0 f0bd f8ff 0120 f0b5 0346  [...'...... ...F
---
> 00004e00: 5bf0 ccf8 27b0 f0bd f8ff 0120 f0b5 0346  [...'...... ...F
1258,1259c1258,1259
< 00004e90: 4ff0 0003 03d0 5bf0 83f8 0120 f4e7 13b0  O.....[.... ....
< 00004ea0: f0bd 00bf f8ff 0120 c078 0708 f8b5 1546  ....... .x.....F
---
> 00004e90: 4ff0 0003 03d0 5bf0 81f8 0120 f4e7 13b0  O.....[.... ....
> 00004ea0: f0bd 00bf f8ff 0120 bc78 0708 f8b5 1546  ....... .x.....F

...

```

The above diff result is truncated because there are a lot of diffs.
We reported this problem in
[an issue on Github](https://github.com/OneKeyHQ/firmware/issues/404#issuecomment-1633287406).
Sadly at the current state, This firmware is **not verifiable**.

**Update 2022-12-28**: The provider sent us a
[link to claims of this product being open source and reproducible](https://help.onekey.so/hc/en-us/articles/6113121891599).
We have to check this.

OneKey is an open source hardware wallet by Bixin. The primary language for the website is Chinese. OneKey, the company claims to be based in Singapore

## Private keys are created offline - ✔️

From the [FAQ](https://shop.onekey.so/pages/faq)

> Number 5. The private keys of OneKey **are all created offline**, avoid cyber attacks completely. The physical buttons and display screen can provide complete protection even if the computer or mobile phone is implanted with malicious viruses, the transaction information needs double check on hardware device then signed for release. Software side cannot tamper it， private key is more secure throughout.

## Private keys are not shared with OneKeyHQ - ✔️

OneKey claims that the private keys are only [controlled by the user](https://help.onekey.so/hc/en-us/articles/360002184256-Why-Use-OneKey-Hardware-Wallets-to-Manage-Private-Keys-)

> Wallet helpers and seeds created with OneKey are **stored locally and encrypted, so only you can decrypt the information, and our servers do not and cannot store any of the user's private data**. No more centralized institutions, you are in full control of your encrypted assets.

## Device displays receive address for confirmation - ✔️

[Tutorial on how to withdraw coins to OneKey](https://help.onekey.so/hc/en-us/articles/4408458838799-How-to-withdraw-coins-from-exchanges-to-OneKey-Mini-hardware-wallet)

OneKey has a 1.54 Inch OLED with 128 x 64 pixels.

From the renderings provided on this [page](https://help.onekey.so/hc/en-us/articles/360004487195-OneKey-classic-hardware-wallet-activation-tutorial), the OneKey hardware wallet has a confirmation button.

However, this is from the official documentation. We were not able to find third-party content such as pictures or videos on social media or blogs that depicts the actual device.

## Interface

Activating the wallet starts with the device providing the mnemonics and then securing it with a pin.

The wallet activation tutorial can be found [here](https://help.onekey.so/hc/en-us/articles/360004487195-OneKey-classic-hardware-wallet-activation-tutorial).

Incorrectly entering the pin code 10 times, resets the wallet.

The wallet can then be connected to the OneKey [Desktop client](https://onekey.so/download?client=desktop) or through a [browser plug-in](https://onekey.so/plugin).

## Code and Reproducibility

OneKey [claims that their software code and firmware codes are open source](https://onekey.so/hardware):

> All codes are open source<br>
  Transparent, WYSIWYG

Sadly their repository redirects to "OneKeyHQ/wallet-deprecated" which contains
no source code and no mention of "firmware".

There is another repo called
[OneKeyHQ/firmware](https://github.com/OneKeyHQ/firmware) (11396 commits)
which is a fork of
[trezor-firmware](https://github.com/trezor/trezor-firmware) (10805 commits).

Their
[OneKey hardware wallet firmware upgrade tutorial](https://help.onekey.so/hc/en-us/articles/360004745796-OneKey-hardware-wallet-firmware-upgrade-tutorial)
looks familiar to how
{% include walletLink.html wallet='hardware/trezorOne' verdict='true' %}
works but with a Bluetooth firmware option. The screenshots and lack of
discussion of such a feature imply there is no way of seeing a hash of the about
to be installed firmware. Neither could we find the signed binary releases.

We opened [an issue](https://github.com/OneKeyHQ/firmware/issues/17) in the
otherwise empty issue tracker of the most likely candidate for being the source
code repository of this product but until confirmation of tis, we have to file
this product as closed source as their website doesn't link to any actual
firmware source code. As such the product is **not verifiable**.
