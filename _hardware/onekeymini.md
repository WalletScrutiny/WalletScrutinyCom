---
title: One Key Mini
appId: onekeymini
authors:
- danny
- mohammad
released: 2020-12-08
discontinued: 
updated: 2021-10-16
version: 3.0.0
binaries: 
dimensions: 
weight: 
provider: Bixin
providerWebsite: 
website: https://onekey.so/
shop: >-
  https://shop.onekey.so/products/onekey-mini-hardware-wallet?variant=41169098178722
country: SG
price: 48USD
repository: https://github.com/OneKeyHQ/firmware
issue: https://github.com/OneKeyHQ/firmware/issues/404#issuecomment-1633287406
icon: onekeymini.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 88b76f05d95e6718d0bf3d4dabb12cf2403cfed91c351008441fe2a33b1cd9ae
date: 2023-07-12
signer: 
reviewArchive:
- date: 2022-12-28
  version: 
  appHashes: []
  gitRevision: 
  verdict: nosource
twitter: onekeyhq
social:
- https://discord.gg/onekey
- https://weibo.com/yourKeysyourBitcoin
- https://www.reddit.com/r/OneKeyHQ/
features: 

---

**Update 2023-07-12**: We followed the steps that provider sent to us and ran a script which is based on their
[Github actions](https://github.com/OneKeyHQ/firmware/blob/touch/.github/workflows/build-mini.yml).
Here is the result for v3.0.0:

```
$ sha256sum downloaded-firmware.bin mini.3.0.0-Stable-0712-b860d10.bin

88b76f05d95e6718d0bf3d4dabb12cf2403cfed91c351008441fe2a33b1cd9ae  downloaded-firmware.bin
afd46d3dc8d871dd8ff1310459e25474725260602b77d3fa5d183e9fdfb5bedc  mini.3.0.0-Stable-0712-b860d10.bin
```
The hashes were different, So we had a look at the diff of the hex formatted binaries:

```
$ xxd mini.3.0.0-Stable-0712-b860d10.bin > mini.3.0.0-Stable-0712-b860d10.hex
$ xxd downloaded-firmware.bin > downloaded-firmware.hex
$ diff mini.3.0.0-Stable-0712-b860d10.hex downloaded-firmware.hex

...

12773c12773
< 00031e40: 33f0 53fb 28b1 a248 d8f7 02ff 0146 0320  3.S.(..H.....F.
---
> 00031e40: 34f0 b4fd 28b1 a248 d8f7 02ff 0146 0320  4...(..H.....F.
12778,12779c12778,12779
< 00031e90: de80 0135 efe7 9048 d6e7 0121 2046 35f0  ...5...H...! F5.
< 00031ea0: a1fb 90b1 8d48 d8f7 d3fe 0146 0320 ddf7  .....H.....F. ..
---
> 00031e90: de80 0135 efe7 9048 d6e7 0121 2046 33f0  ...5...H...! F3.
> 00031ea0: c3fa 90b1 8d48 d8f7 d3fe 0146 0320 ddf7  .....H.....F. ..
12805,12808c12805,12808
< 00032040: 013b a342 b8d0 e0e7 8146 374d dfe7 35f0  .;.B.....F7M..5.
< 00032050: 59fa dde9 0d01 0faa 33f0 aef8 18b3 0220  Y.......3......
< 00032060: dcf7 70f8 0028 3ff4 16af 35f0 61fa 2f4a  ..p..(?...5.a./J
< 00032070: 2f49 35f0 3afa 4ff4 c872 2146 1ca8 3bf0  /I5.:.O..r!F..;.
---
> 00032040: 013b a342 b8d0 e0e7 8146 374d dfe7 33f0  .;.B.....F7M..3.
> 00032050: 7bf9 dde9 0d01 0faa 33f0 aef8 18b3 0220  {.......3......
> 00032060: dcf7 70f8 0028 3ff4 16af 33f0 83f9 2f4a  ..p..(?...3.../J
> 00032070: 2f49 33f0 5df9 4ff4 c872 2146 1ca8 3bf0  /I3.].O..r!F..;.
12810,12812c12810,12812
< 00032090: 9bff 14a9 1ca8 20f0 41f8 35f0 6ffa 2549  ...... .A.5.o.%I
< 000320a0: 14aa 35f0 12fa 1198 35f0 7cfa 0023 0ca9  ..5.....5.|..#..
< 000320b0: 1ca8 0c93 35f0 36fb 0446 0028 c4d0 0748  ....5.6..F.(...H
---
> 00032090: 9bff 14a9 1ca8 20f0 41f8 33f0 91f9 2549  ...... .A.3...%I
> 000320a0: 14aa 33f0 35f9 1198 33f0 9ef9 0023 0ca9  ..3.5...3....#..
> 000320b0: 1ca8 0c93 33f0 58fa 0446 0028 c4d0 0748  ....3.X..F.(...H
12818,12819c12818,12819
< 00032110: 66e2 0908 44dc 0e08 4053 0120 b4db 0e08  f...D...@S. ....
< 00032120: 12c3 0908 c4db 0e08 6d53 0120 9f1f 0c08  ........mS. ....
---
> 00032110: 66e2 0908 44dc 0e08 3853 0120 b4db 0e08  f...D...8S. ....
> 00032120: 12c3 0908 c4db 0e08 6553 0120 9f1f 0c08  ........eS. ....
17158c17158
< 00043050: 373a 0c08 433a 0c08 31d5 0e08 583a 0c08  7:..C:..1...X:..
---
> 00043050: 373a 0c08 433a 0c08 aed3 0e08 583a 0c08  7:..C:......X:..
25889,25890c25889,25890
< 00065200: 00f0 89f9 0028 61d1 5146 07a8 02f0 b8fc  .....(a.QF......
< 00065210: 0028 5bd1 5146 07a8 02f0 64fc 0138 0628  .([.QF....d..8.(
---
> 00065200: 01f0 eafb 0028 61d1 5146 07a8 00f0 24fa  .....(a.QF....$.
> 00065210: 0028 5bd1 5146 07a8 00f0 d0f9 0138 0628  .([.QF.......8.(

...
```

The above diff result is truncated because there are a lot of diffs.
We reported this problem in
[an issue on Github](https://github.com/OneKeyHQ/firmware/issues/404#issuecomment-1633287406).
Sadly at the current state, This firmware is **not verifiable**.

**Update 2022-12-28**: The provider sent us a
[link to claims of this product being open source and reproducible](https://help.onekey.so/hc/en-us/articles/6113121891599).
We have to check this.

## Product Description

Not to be confused with the {% include walletLink.html wallet='hardware/onekey' verdict='true' %}, the One Key Mini supports many cryptocurrencies including: BTC, LTC, BCH, ETH, BTG, DASH, USDT, DOGE and more. It supports many DeFi protocols and can connect to Metamask.

It is also compatible with Trezor, Metamask, Exodus, Bitcoin Core + Specter, BTCPayServe, Electrum-LTC, Nano Wallet, Electrum, Mycelium, MyEtherWallet, Bitcoin Core + HWI, Electrum- DASH and EtherWall.

According to the [FAQ](https://shop.onekey.so/pages/faq), even if the device was damaged, it is possible to recover via a mnemonic phrase.

The private keys are created offline, secured and airgapped. The mnemonic phrase is provided during initial device setup.

[One Key Mini User Manual](https://help.onekey.so/hc/en-us/articles/4408289773455-OneKey-Mini-hardware-wallet-activation-tutorial)

OneKey repeatedly claims that their software and firmwares are Open Source. However, the repository linked from their website indicates that it is already [deprecated](https://github.com/OneKeyHQ/wallet-deprecated).

Digging deeper into their User Service Agreement, we find this:

> OneKeyOpen Source Code (“OneKey OSC”): means the partial software code of OneKey that Company has publicized and made open-source. Users may use (include further development) such open source software code in accordance with relevant Open Source License and notices of the Company.

The key word is "partial". Making the **source code only partially available** indicates that certain functions are not made public. This is noted in an [issue on OneKey's Github](https://github.com/OneKeyHQ/firmware/issues/17), but it has not received any attention.

Whether it's a few lines of code that references a script downloaded from another source, users simply would not know.
