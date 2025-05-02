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
version: v3.9.0
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
appHashes:
- a8d7051ea8b4a85038d032e4b86d5e8ee8f34870e3f861e59bf1a5578c36d176
date: 2024-09-24
signer: 
reviewArchive:
- date: 2023-07-12
  version: 3.0.0
  appHashes:
  - a5d4ac8b98c1249f839fba018850df7deb66a3720f13a01c5d94250e426a0a71
  gitRevision: f5c6f845966914e0bea7c7d2952029ab76388b3b
  verdict: nonverifiable
- date: 2022-12-28
  version: 
  appHashes: []
  gitRevision: eb1b55711cd4bbb78072e47c1f6cc9fa67074b5e
  verdict: nosource
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
features: 

---

**Update 2024-09-17**: The script stopped working so we've had to adjust. 

The results for Classic v3.9.0

```
Calculating checksums...
RESULTS==========================================
Built firmware hash:
4d84d17402d206bed1cbfddaeb08dc92dd3ce9be56add8da28a0963571989451  ./classic.3.9.0-Stable-0917-f3b0717.bin
Downloaded firmware hash:
a8d7051ea8b4a85038d032e4b86d5e8ee8f34870e3f861e59bf1a5578c36d176  downloaded-firmware.bin
=================================================
Build completed. Check the 'output' directory for results.
```

{% include asciicast %}

We then generated a hexdump of the built and downloaded firmware. Then used a unified diff to compare.

```
$ cd output/
$ xxd classic.3.9.0-Stable-0917-f3b0717.bin > built-firmware.hex
$ xxd downloaded-firmware.bin > downloaded-firmware.hex
$ diff -u built-firmware.hex downloaded-firmware.hex > firmware_diff.txt
```

The output of the diff:

```
$ cat firmware_diff.txt 
--- built-firmware.hex	2024-09-17 13:21:42.261583273 +0000
+++ downloaded-firmware.hex	2024-09-17 13:22:02.354205676 +0000
@@ -16,8 +16,8 @@
 000000f0: e521 fc80 b931 89ea 3b32 99a2 536d be7c  .!...1..;2..Sm.|
 00000100: a3f1 5cb9 2dc7 c61f 07ed ec29 bdfc 1e53  ..\.-......)...S
 00000110: 15fa ecec c0cd 0a87 587b 9861 2c23 e7f0  ........X{.a,#..
-00000120: c21b d588 58bd e555 9f40 d9eb ea27 6395  ....X..U.@...'c.
-00000130: 520b 0d70 e29d ec8e 29e1 f5f9 d85b 0dc0  R..p....)....[..
+00000120: db58 e5b4 aa32 5c1b 6a66 1d2b 4e5d 351c  .X...2\.jf.+N]5.
+00000130: 3367 cd45 2fd7 b845 378b 5bf4 a3fd 4ec9  3g.E/..E7.[...N.
 00000140: 63b8 efba d27e 0bbd 7595 2426 8d8c d22c  c....~..u.$&...,
 00000150: cca3 61d3 7ab9 49c0 a623 e11a c436 f8df  ..a.z.I..#...6..
 00000160: 0b4a fa04 7fd6 98be 04f1 c4bd b53f 5f09  .J...........?_.
@@ -32,23 +32,23 @@
 000001f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000200: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000210: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000220: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000230: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000240: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000250: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000260: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000270: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000280: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000290: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000002a0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000002b0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000002c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000002d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000002e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000002f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000300: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000310: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00000320: 0000 0000 0000 0000 0000 0000 0000 0000  ................
+00000220: 01f3 b146 bc03 1287 f80d 9f74 5036 ba5c  ...F.......tP6.\
+00000230: f347 c55e 1170 71f2 b240 d595 cb9c 8629  .G.^.pq..@.....)
+00000240: 232e bc4f 0c19 a5f0 c2cf 6cd9 6676 a7cf  #..O......l.fv..
+00000250: a7b0 6bd8 dbe2 10d6 8d67 f28e 883f 29ca  ..k......g...?).
+00000260: ba4e 625a dc80 c429 ba29 a343 e3ce 8765  .NbZ...).).C...e
+00000270: 5a0b 9d00 1760 5ea0 0dd1 06ca 89fc 9b12  Z....`^.........
+00000280: 23b3 8730 71c5 3ffb df29 1f21 c5be b599  #..0q.?..).!....
+00000290: 061d 19d3 2810 8c20 5319 7e8e e6c7 8444  ....(.. S.~....D
+000002a0: bb79 ceb0 2f60 3f10 7259 e123 068f 5322  .y../`?.rY.#..S"
+000002b0: 29c8 1860 a3b0 cb80 3cb7 2f6f 9c94 1575  )..`....<./o...u
+000002c0: 4800 5be3 7f6d 6b82 3f66 f8d1 2fa2 19a9  H.[..mk.?f../...
+000002d0: ea5e 8543 cac0 5240 eac5 79ae 2bd4 c819  .^.C..R@..y.+...
+000002e0: 169e 7329 401b b481 9371 b492 a124 c499  ..s)@....q...$..
+000002f0: 26b6 5400 d028 ac41 b168 4ab0 3e2c a8d3  &.T..(.A.hJ.>,..
+00000300: 73d8 31d7 f4d3 e59d 295b c4f8 3124 4e4c  s.1.....)[..1$NL
+00000310: 0594 4313 cd50 efff ac5d b0e4 f59d c1ff  ..C..P...]......
+00000320: 0103 0405 0000 0000 0000 0000 0000 0000  ................
 00000330: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000340: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000350: 0000 0000 0000 0000 0000 0000 0000 0000  ................
@@ -35488,7 +35488,7 @@
 0008a9f0: b071 7d65 2c08 c79a 4b39 d06c 3c2b d9bc  .q}e,...K9.l<+..
 0008aa00: 5f17 b200 332e 392e 3000 636c 6173 7369  _...3.9.0.classi
 0008aa10: 632e 332e 392e 302d 5374 6162 6c65 2d30  c.3.9.0-Stable-0
-0008aa20: 3931 372d 6633 6230 3731 3700 556e 6578  917-f3b0717.Unex
+0008aa20: 3830 352d 6633 6230 3731 3700 556e 6578  805-f3b0717.Unex
 0008aa30: 7065 6374 6564 206d 6573 7361 6765 0041  pected message.A
 0008aa40: 6374 696f 6e20 6361 6e63 656c 6c65 6420  ction cancelled 
 0008aa50: 6279 2075 7365 7200 5049 4e20 6361 6e63  by user.PIN canc
```

One of the differences is the timestamp. The built firmware's value is 0917 - the date today. While the time stamp (or the short_release_date) on the downloaded firmware is 0805. 

The second difference occurs between offsets `00000220` to `00000320`. In the built firmware, we noticed that the values are comprised of zeroes. The corresponding offsets in the downloaded firmware is comprised of non-zeroes. This could indicate missing data in the built firmware.

We do not have enough data to determine the reason for the diffs here:

```
-00000120: c21b d588 58bd e555 9f40 d9eb ea27 6395
-00000130: 520b 0d70 e29d ec8e 29e1 f5f9 d85b 0dc0
+00000120: db58 e5b4 aa32 5c1b 6a66 1d2b 4e5d 351c
+00000130: 3367 cd45 2fd7 b845 378b 5bf4 a3fd 4ec9
```

With that said, the firmware is still **not-verifiable**.
We will update the [existing GitHub issue](https://github.com/OneKeyHQ/firmware/issues/404#issuecomment-1633287406).

**Previous Review 2023-07-12**: We followed the steps that provider sent to us and ran a script which is based on their
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
