---
title: OneKey - Pro
appId: onekey.pro
authors:
- danny
- keraliss
released: 2024-03-05
discontinued: 
updated: 2025-01-06
version: 4.11.0
binaries: 
dimensions:
- 90
- 54
- 7.6
weight: 65
provider: Bixin
providerWebsite: https://onekey.so/
website: https://shop.onekey.so/
shop: https://shop.onekey.so/products/onekey-pro
country: CN
price: 270USD
repository: https://github.com/OneKeyHQ/firmware-pro
issue: https://github.com/OneKeyHQ/firmware-pro/issues/238
icon: onekey.pro.png
bugbounty: https://github.com/OneKeyHQ/app-monorepo/blob/onekey/docs/BUG_RULES.md
meta: ok
verdict: sourceavailable
appHashes:
- 2b8ce9dab486877b78ecfd9b7b5d0579e313197cb92e98f9bec20805072b7cdb
date: 2025-03-13
signer: 
reviewArchive: 
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
- https://www.youtube.com/@onekeyhq
features: 

---

# OneKey Pro Firmware Reproducibility Analysis

**Update 2025-03-13**: We tested the reproducibility of the OneKey Pro firmware.

The results for Pro v4.12.0:

```
Calculating checksums...
RESULTS==========================================
Built firmware hash:
2b8ce9dab486877b78ecfd9b7b5d0579e313197cb92e98f9bec20805072b7cdb  ./build/touch/firmware/firmware.bin
Downloaded firmware hash:
372fdf71a642e1797118fbd04a8df1b8f90c44cb8988f17c1e1ab85e6f0437cc  downloaded.bin
=================================================
```

We then generated a hexdump of the built and downloaded firmware and compared them.

```
$ xxd built_firmware.bin > built-firmware.hex
$ xxd downloaded-firmware.bin > downloaded-firmware.hex
$ diff -u built-firmware.hex downloaded-firmware.hex > firmware_diff.txt
```

We got this output:
```
--- built-header.hex 2025-03-12 16:53:47.250579928 +0000
+++ downloaded-header.hex 2025-03-12 16:53:47.250579928 +0000
@@ -1,64 +1,64 @@
-00000000: 4f4b 5456 000a 0000 0000 0000 0000 0203  OKTV............
-00000010: 8eff 0000 0000 0000 0000 0000 0000 0000  ................
-00000020: 5711 4f0a a669 d2f8 37e0 40ab 9bb5 1c00  W.O..i..7.@.....
-00000030: 9912 09f8 4bfd 7bf0 f893 6762 46fb a24a  ....K.{...gbF..J
-00000040: dcae 8e37 df5c 2460 27c0 3aa9 51bd 6ec6  ...7.\$`'.:.Q.n.
-00000050: caa7 ad32 c166 b1f5 48a4 efcd 88ca 3ca5  ...2.f..H.....<.
-00000060: 7729 12ab 61d1 dc4f 9133 325e 57e1 46ab  w)..a..O.32^W.F.
-00000070: 9fac 17a4 572c 6fcd f355 f800 3610 0004  ....W,o..U..6...
-00000080: 144f 4e45 4b45 592c 464f 5220 5445 5354  .ONEKEY,FOR TEST
-00000090: 204f 4e4c 5900 0000 544f 4966 7800 7800   ONLY...TOIfx.x.
-000000a0: 7708 0000 ed92 1f7c 726d 18c7 0741 1004  w......|rm...A..
-000000b0: 0f04 4110 0c06 4130 981c 0806 41f0 4010  ..A...A0....A.@.
-000000c0: 04c1 6030 7860 9004 4110 0c82 2008 8260  ..`0x`..A... ..`
-000000d0: 3008 8223 c160 3008 82e0 c081 6010 04dd  0..#.`0.....`...
-000000e0: f77d dd7f ded6 bbe7 7db7 eeab d5f9 b775  .}......}......u
-000000f0: f6e9 5c78 9feb 77fd bed7 ef22 27e4 58c7  ..\x..w...."'.X.
-00000100: 3ad6 b18e 75ac 55d1 1c9d b1cb 5545 69ee  :...u.U.....UEi.
-00000110: 4773 d679 46b6 95a9 ac77 65ca 21bf a1bd  Gs.yF....we.!...
-00000120: 1fc6 5a83 989c aa4f 3e09 7046 6a3f 82b5  ..Z....O>.pFj?..
-00000130: cc1a 12d4 1e9f 04d6 0f3b 33cd 89ac 72f0  .........;3...r.
-00000140: 892c ad84 9796 5d7d 7ec5 5b52 6e84 9316  .,....]}~.[Rn...
-00000150: 62aa aadc 7c55 8885 30db 2797 b4af 5f89  b...|U..0.'..._.
-00000160: bd84 8b96 ce24 280f 9f04 3a0b 11ef 480c  .....$(...:...H.
-00000170: 94c7 4f0c c828 24b4 29c8 6fc5 b0c4 00f2  ..O..($.).o.....
-00000180: b447 6c62 d31e e4c5 4459 db7e 853c 4985  .Glb....DY.~.<I.
-00000190: e296 d3aa 8402 74f8 0392 5997 3fa8 0efa  ......t...Y.?...
-000001a0: 7f95 a6c3 c0bb f28f 7cb2 cda2 db3a 5854  ........|....:XT
-000001b0: b6b1 1ebe 0841 ba3d 94b6 482b 9f76 55e4  .....A.=..H+.vU.
-000001c0: 2dd6 4767 87ce 2b8b 88ed 247d dcb9 a747  -.Gg..+...$}...G
-000001d0: 9544 f674 7bd8 b490 4768 2d98 efd5 fbac  .D.t{...Gh-.....
-000001e0: 2cbd 199a 07cc 5b53 2524 a321 49ed d59d  ,.....[S%$.!I...
-000001f0: 926d 645b 55d2 3d54 5ebe c0d2 658d 7dfb  .md[U.=T^...e.}.
-00000200: d925 96b0 c81e 262d 7dc4 d215 4b27 1a62  .%....&-}...K'.b
-00000210: 8025 cca2 87c8 2b5a 58ba 34e2 48c5 4613  .%....+ZX.4.H.F.
-00000220: 9e1c 1e2d 7b51 55dd 29cf 38d5 8139 b2b5  ...-{QU.).8..9..
-00000230: 0ec4 0e8c 7724 96ba 4d09 a4ec 58a9 2ca7  ....w$..M...X.,.
-00000240: 8852 82d8 87c4 0bd7 482a 8af5 5d5d ca15  .R......H*..]]..
-00000250: a605 cdc3 a1a5 6939 d41d 8a3f 2ed2 5d27  ......i9...?..]'
-00000260: 2c7e 63b7 4273 07c2 6bf0 3812 88c9 a2ae  ,~c.Bs..k.8.....
-00000270: f737 531d 5d90 1788 7110 e9e6 9485 b8bb  .7S.]...q.......
-00000280: f3e0 2ec5 0bd8 4dd3 ca01 f0a6 d0eb 9bd2  ......M.........
-00000290: 474f 3bec c9a1 ae2a 5a24 f5dd bc2c 8a25  GO;....*Z$...,.%
-000002a0: c133 5e75 791c d365 97df cc6b c829 92ee  .3^uy..e...k.)..
-000002b0: 2db1 3d2b dbb2 8828 0331 be93 17e6 4808  -.=+...(.1....H.
-000002c0: 26e4 7dd1 3e53 6610 97e3 be68 5a55 910c  &.}.>Sf....hZU..
-000002d0: 127e e98b 25b2 cd0e cd7d 17af f883 f851  .~..%....}.....Q
-000002e0: f4d1 b77d f630 7dd1 fa1e 5ad6 c0d2 e50b  ...}.0}...Z.....
-000002f0: 3f67 f031 9630 eb7f 03af 2113 8817 9394  ?g.1.0....!.....
-00000300: 7776 da3c 2306 62c0 e3c4 de3d 4575 f421  wv.<#.b....=Eu.!
-00000310: 3241 8caf e685 6b65 ea4e 20bf b3ef f9c3  2A....ke.N .....
-00000320: ffcf 3bff 8f61 5b85 e6d7 d2d2 b42c 227b  ..;..a[......,"{
-00000330: 6fef bccf 9bcd 1e5e d8d5 834e 2ad2 f497  o......^...N*...
-00000340: a6fb 8c6c 5db1 e8e7 5dec d44d 179d 615d  ...l]...]..M..a]
-00000350: 30ff c274 eb2a a93b e00b 627c de27 9698  0..t.*.;..b|.'..
-00000360: 7331 d831 cfe0 63a4 ed82 f6be 88d7 e00f  s1.1..c.........
-00000370: aee6 d7d4 05c6 2bc1 e57e c7bb f6eb 53ba  ......+..~....S.
-00000380: 8f98 6b1e 27a9 9dae 4b58 a74a 92ee ae99  ..k.'...KX.J....
-00000390: 30c7 1ae9 ec2b 78e5 3992 d12d cded dc53  0....+x.9..-...S
-000003a0: 0ecf 77c5 5bde d99b 9645 646a 3178 5af6  ..w.[....Edj1xZ.
-000003b0: 8238 b6e0 7e8f de91 db7b 5e27 dc54 a6de  .8..~....{^'.T..
-000003c0: 0b67 01f3 1aaa 8338 3edf 9dd0 ba37 e99e  .g.....8>....7..
-000003d0: 9718 3281 3477 f69a ecba f81d 3693 3ded  ..2.4w......6.=.
-000003e0: d72d 01e5 6def 7959 7d55 d5bb f938 385a  .-..m.yY}U...88Z
-000003f0: 5a57 963e 510c f6ed 9743 9437 b16f bf68  ZW.>Q....C.7.o.h
+00000000: 4f4b 5456 0006 0000 0000 0000 0000 0407  OKTV............
+00000010: ffff 0000 0000 0000 0000 0000 0000 0000  ................
+00000020: 154b 8ab2 61cc 8879 483f 689a 2d41 243a  .K..a..yH?h.-A$:
+00000030: e7db c402 1672 bbd2 5c33 8ae8 4d93 1154  .....r..\3..M..T
+00000040: a9e6 5e07 fe6d 39a8 a84e 11a9 96a0 283f  ..^..m9..N....(?
+00000050: 881e 175c ba60 2eb5 ac44 2fb7 5b39 e8e0  ...\.`...D/.[9..
+00000060: 6c88 05ab b2df 9d36 79f1 d28a 40cd 9903  l......6y...@...
+00000070: 99b9 9fc3 ee4e 0657 d81d 381e a148 8a12  .....N.W..8..H..
+00000080: 3ed7 9779 064d 5657 1b29 bcaa 734c bb6d  >..y.MVW.)..sL.m
+00000090: b61d 2e62 6566 628e cf4c 89e1 db45 eaec  ...befb..L...E..
+000000a0: 54a4 0633 bfd9 e60b 8a39 1265 b2e0 0637  T..3.....9.e...7
+000000b0: 4abe 631d 1e11 0733 2bca 56bf 9f8c 5c99  J.c....3+.V...\.
+000000c0: 4b71 134f 18e0 0787 c583 d407 42cc 188e  Kq.O........B...
+000000d0: 17fc 85ad e4cb 472d ae5e f8e0 69f0 fec5  ......G-.^..i...
+000000e0: 2ecf 80c8 2b44 9848 c000 3350 9213 9551  ....+D.H..3P...Q
+000000f0: bfe4 7b3c 7317 b499 50f6 5e1d 8243 2024  ..{<s...P.^..C $
+00000100: 064f 6e65 4b65 7900 544f 4966 4a00 4a00  .OneKey.TOIfJ.J.
+00000110: 5203 0000 cd92 2f8e e330 1487 0d0c 020c  R...../..0......
+00000120: 0c0a 96fa 08bd 428e 10b8 d470 b5a0 aa0a  ......B....p....
+00000130: a22a 24b2 0aa2 51c1 6834 c8b4 b070 a0af  .*$...Q.h4...p..
+00000140: 9023 982c 5c60 6060 60e0 5534 ca26 ed34  .#.,\````.U4.&.4
+00000150: d3fa 4fdb 7c41 6df2 9e3f bff7 03c0 175c  ..O.|Am..?.....\
+00000160: 2f77 1431 ccf5 71d3 96d2 4aeb 4674 bf85  /w.1..q...J.Ft..
+00000170: 1186 6b86 29ca 335c 833b 42e0 7acf f5a9  ..k.).3\.;B.z...
+00000180: c12d b4e5 7143 1181 a96d b6aa 2d5d 246d  .-..qC...m..-]$m
+00000190: b955 69cc f24c 1897 1061 8a66 4e3e 43e6  .Ui..L...a.fN>C.
+000001a0: c2bc 08bc 8f4f 0fd7 be7b 2c1a 55b9 3b23  .....O...{,.U.;#
+000001b0: 2d45 b71b 6d95 7b10 5b75 9b11 d7ee 81bc  -E..m.{.[u......
+000001c0: acae 1bbd acdc 83e1 7a2e 5bbb 7583 14b9  ........z.[.u...
+000001d0: 2751 3497 8d08 94f6 594e aa22 f0f9 d93e  'Q4.....YN."...>
+000001e0: 4798 af46 45e3 9e4c 9e9d 3b85 ec4d 98af  G..FE..L..;..M..
+000001f0: 4ff8 fecf 2715 32a5 4bd3 06e0 b048 3529  O...'.2.K....H5)
+00000200: 61fc 3b50 94da 697c 4b02 433a 1098 dac9  a.;P..i|K.C:....
+00000210: b91f 7ffa 3e0c a7da 5cac 13c3 7d9f b6f4  ....>...\...}...
+00000220: af5e efef e1d4 9631 9b53 95b4 fd93 cea9  .^.....1.S......
+00000230: df1e 452e 9294 4e9f f33f 6ee6 e4c4 7568  ..E...N..?n...uh
+00000240: 9aee e7d4 2501 d7ce cdc9 c939 5ce7 d9dc  ....%......9\...
+00000250: 9c96 bbf8 84a7 76a2 88e1 b939 311c df23  ......v....91..#
+00000260: b513 d7c2 cccd e9e3 7d7e 4e6d 296d bc13  ........}~Nm)m..
+00000270: 45c3 137f 4769 5338 a525 9591 aaba dba9  E...GiS8.%......
+00000280: 6a1e b712 8622 5cf7 6922 30c5 f6e2 7cf2  j...."\.i"0...|.
+00000290: 0c5c 80c0 6725 e2ed 157c 03c3 8f37 6218  .\..g%...|...7b.
+000002a0: 5ce1 d156 5c83 1b78 7b0d eb1e b279 6909  \..V\..x{....yi.
+000002b0: 1c9f 9d67 5c4b db96 c70d 45e3 ff71 adaa  ...g\K....E..q..
+000002c0: 90ee 214e e393 0914 66da 3764 7fdd ed7c  ..!N....f.7d...|
+000002d0: 6b54 3536 fa7a 2769 711d 3329 618e 1bdf  kT56.z'iq.3)a...
+000002e0: 9a8f f7c1 89eb 6b69 3b2c fc9d fc6b d6fb  ......ki;,...k..
+000002f0: 614a 53df 0c93 5aef 7dfb 73ed bff1 a2e9  aJS...Z.}.s.....
+00000300: cf2b 9a98 6fa6 6098 22df 9a3c ebcf 9bae  .+..o.`."..<....
+00000310: a5a8 ff26 cf7c fb53 b4dc 85cf 69da 69f8  ...&.|.S....i.i.
+00000320: c6df 29cf 701d 9ea7 e95a 02c3 f3d4 6551  ..).p....Z....eQ
+00000330: 5adf 0c82 ff08 73ed 0bae fdba b765 5775  Z.....s......eWu
+00000340: 58f8 55a9 6a38 9140 559d bf97 7698 92ff  X.U.j8.@U...v...
+00000350: 8d3f dec3 a63b a4a5 b33a 3d55 dae5 6e78  .?...;...:=U..nx
+00000360: 3b9d b8e9 847f 76f5 ad93 168c c035 456d  ;.....v......5Em
+00000370: d9cd 4f18 86bb 3484 4f69 4862 d7d1 8f97  ..O...4.OiHb....
+00000380: 15b8 81ad f2ed fb99 a60e 869d 373f ff5e  ............7?.^
+00000390: 33fa f5db bf2b c343 265c 00eb 7d6a a361  3....+.C&\..}j.a
+000003a0: 731d c284 74e0 7adc 639c b0e3 26a4 9f30  s...t.z.c...&..0
+000003b0: e32e 79e6 02e1 3acf 4e3b bdac 5415 d6ab  ..y...:.N;..T...
+000003c0: 684e ef16 36a9 4f54 254c f7b4 65a8 4d87  hN..6.OT%L..e.M.
+000003d0: b4e7 f30e 9f54 2ace a714 3ba9 78b8 be94  .....T*...;.x...
+000003e0: 4c02 6326 1f87 b404 828b 14cd b39c 2802  L.c&..........(.
+000003f0: 9330 fc0c 2386 c1b7 1c16 8f36 7a7b 0557  .0..#......6z{.W
```

From the diff analysis, we found significant differences:

1. The header analysis shows fundamentally different structure, including different header versions/flags (`OKTV 000a` vs `OKTV 0006`)
2. There is a significant difference related to timestamps
```
-00000120: 1fc6 5a83 989c aa4f 3e09 7046 6a3f 82b5  ..Z....O>.pFj?..
-00000130: cc1a 12d4 1e9f 04d6 0f3b 33cd 89ac 72f0  .........;3...r.
+00000120: db58 e5b4 aa32 5c1b 6a66 1d2b 4e5d 351c  .X...2\.jf.+N]5.
+00000130: 3367 cd45 2fd7 b845 378b 5bf4 a3fd 4ec9  3g.E/..E7.[...N.
```
3. Another significant difference occurs between offsets 00000220 to 00000320. The built and downloaded firmwares have completely different data in these ranges, suggesting structural differences between the versions.



With these differences, the firmware is **not-verifiable**.


## [Product Documentation](https://help.onekey.so/hc/en-us/articles/9384870496143-Authenticate-OneKey-Pro)

<iframe width="560" height="315" src="https://www.youtube.com/embed/YoEni3zAqUo?si=t4Cftm00KnW7b8Za" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> - The OneKey App desktop client and browser extension only support connecting to the hardware wallet via USB cable. The mobile app only supports connecting via Bluetooth.
> - The OneKey Pro can be updated via USB cable or Bluetooth. If by BlueTooth, the OneKey app is used. If through USB, the OneKey Desktop or Web App is used.  

1. Can the private keys be created offline? - ✔️ Yes
- As demonstrated [in this video](https://www.youtube.com/shorts/VxunFeDL8nU).
- The device has Air-Gap mode which completely isolates it from networks
- The information explicitly states it provides "offline storage of private keys"

2. Are the private keys shared? - **?** 
- The device keeps private keys in the secure element (EAL6+ chips)
- There may be some question regarding this [statement](https://help.onekey.so/hc/en-us/articles/11187527886095-Back-up-your-OneKey-Pro-with-OneKey-Lite) which allows the device to also backup the private keys to the {% include walletLink.html wallet='hardware/onekey.lite' verdict='true' %}: 
> "The OneKey Pro will search for the OneKey Lite card and transfer the **encrypted** recovery phrase securely."
- Note that the OneKey Lite can also pair with the {% include walletLink.html wallet='android/so.onekey.app.wallet' verdict='true' %}

3. Does the device display the receive address for confirmation? - ✔️ Yes. 
- From the usage instructions: "select your receive account and copy the wallet address"
- Has a 3.5-inch color touchscreen display

4. Does the interface have a display screen and buttons which allows the user to confirm transaction details? - ✔️ Yes. 
- Has a 3.5-inch IPS color touchscreen
- Transaction signing process is explicitly described with user confirmation steps
- Device shows transaction details for signing via QR codes

5. Is it reproducible? - **?**

    For now, the device is **for verification**. 