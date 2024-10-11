---
title: Trezor Safe 5
appId: trezorSafe5
authors:
- danny
released: 2024-06-14
discontinued: 
updated: 2024-09-19
version: 2.8.3
binaries: https://data.trezor.io/firmware/t3t1/trezor-t3t1-2.8.3.bin
dimensions: 
- 66
- 40
- 8
weight: 23
provider: Trezor
providerWebsite: 
website: https://trezor.io
shop: https://trezor.io/trezor-safe-5
country: CZ
price: 169USD
repository: https://github.com/trezor/data/tree/master/firmware/t3t1
issue: https://github.com/trezor/trezor-firmware/issues/4254
icon: trezorSafe5.png
bugbounty: https://trezor.io/learn/a/how-to-report-an-issue
meta: ok
verdict: wip
date: 2024-10-11
signer: 
reviewArchive: 
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
features: 

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/1EVzbNPn6bc?si=vv88okupfrEmtEff" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# [Trezor Safe 5 Official Online Documentation](https://trezor.io/learn/a/get-started-with-the-trezor-safe-5)

## Reproducible Build Verification for v2.8.3 (2024-10-11)

While the internal code for the {{ page.title }} hasn't been explicitly defined in its [external documentation](https://github.com/trezor/trezor-firmware/blob/1e3e7f808b623366a6fcfad855be6490e6f1d879/python/src/trezorlib/models.py#L39), we were able to find references to its code as **'T3T1'** [here](https://forum.trezor.io/t/update-trezor-suite-trezor-firmware-september-2024-update-is-here/19148). We can find in its [releases.json](https://data.trezor.io/firmware/t3t1/releases.json) file that version 2.8.3 is the latest. 

### 1. We begin by downloading the latest binary from trezor.

    $ wget https://data.trezor.io/firmware/t3t1/trezor-t3t1-2.8.3{,-bitcoinonly}.bin

### 2. We get the hashes for the binaries.

    $ sha256sum *.bin
    9f68696478e09d7bf8b8f5181413d8a5386b37571dc2f5ed8511a24f4c1d35b7  trezor-t3t1-2.8.3.bin
    49996a1a602f08809427cf3b959f3c70eeef1fcfd45f267bd6d058496a4cc37e  trezor-t3t1-2.8.3-bitcoinonly.bin  
    
### 3. We then proceed with building

    $ git clone https://github.com/trezor/trezor-firmware.git
    $ cd trezor-firmware
    $ git checkout core/v2.8.3
    $ bash -c "./build-docker.sh --models T3T1 core/v2.8.3"

The results:

    Built from commit 39565d3970deb9d696217cda793dc467f2a8e3e5

    Fingerprints:
    dfabe8b10368f268cedaa505e284192329f489519dd71feb5fba7d610ef748fc build/core-T3T1/bootloader/bootloader.bin
    0de51126c17cc0ac623800638dc851c0abd5b787cad5f3aa5843ea2c4cf8248a build/core-T3T1/firmware/firmware.bin
    dfabe8b10368f268cedaa505e284192329f489519dd71feb5fba7d610ef748fc build/core-T3T1-bitcoinonly/bootloader/bootloader.bin
    9eaf99a9420d2a3b9377102eb06b938f5a1886ecb06cccde7fd3cb7a39e1abd7 build/core-T3T1-bitcoinonly/firmware/firmware.bin

### 4. We then begin the process for signature zeroing. We have tried several variations, based on this [closed GitHub issue.](https://github.com/trezor/trezor-firmware/issues/4080)

    $ cp ../trezor-t3t1-2.8.3-bitcoinonly.bin trezor-t3t1-2.8.3-bitcoinonly.bin.zeroed
    $ cp ../trezor-t3t1-2.8.3.bin trezor-t3t1-2.8.3.bin.zeroed
    $ vendorHeaderSize=1024
    $ seekSize=$(( 5567 - vendorHeaderSize ))
    $ count=128
    $ dd if=/dev/zero of=trezor-t3t1-2.8.3.bin.zeroed bs=1 seek=$seekSize count=$count conv=notrunc
    $ dd if=/dev/zero of=trezor-t3t1-2.8.3-bitcoinonly.bin.zeroed bs=1 seek=$seekSize count=$count conv=notrunc

Then: 

    128+0 records in
    128+0 records out
    128 bytes copied, 0.0003931 s, 326 kB/s
    128+0 records in
    128+0 records out
    128 bytes copied, 0.000358158 s, 357 kB/s

    $ sha256sum *.zeroed build/core-T3T1{,-bitcoinonly}/firmware/firmware.bin | sort

We surmise that the header size for the Trezor Safe 5 may be different which have lead to different values:

    13273f77e41c92755ab210a28fec9b54dc9df08af96c66caeb552b48028458aa  build/core-T3T1-bitcoinonly/firmware/firmware.bin
    83677f634f29e0f066153b599c25a8047729608d555f4c289b91df726472fd5d  build/core-T3T1/firmware/firmware.bin
    b8c06e15a081b943a11b815838447301fd06ddbddcae48236d6114087463dc55  trezor-t3t1-2.8.3-bitcoinonly.bin.zeroed
    f496ad992582ebe5a5f35519b3dd7d1ed65c9fc701bf8674c2c9541f3c4557b5  trezor-t3t1-2.8.3.bin.zeroed

After several different results, we ran diffoscope:

For the 'regular' and 'bitcoin-only' binaries:

    $ diffoscope --text diffoscope_results_regular.txt --max-text-report-size 0 trezor-t3t1-2.8.3.bin.zeroed build/core-T3T1/firmware/firmware.bin

    $ diffoscope --text diffoscope_results_bitcoinonly.txt --max-text-report-size 0 trezor-t3t1-2.8.3-bitcoinonly.bin.zeroed build/core-T3T1-bitcoinonly/firmware/firmware.bin

The results:

**diffoscope_results_bitcoinonly.txt**

    --- trezor-t3t1-2.8.3-bitcoinonly.bin.zeroed
    +++ build/core-T3T1-bitcoinonly/firmware/firmware.bin
    @@ -117,19 +117,19 @@
    00000740: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    00000750: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    00000760: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    00000770: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    00000780: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    00000790: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    000007a0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    -000007b0: 0000 0000 0000 0000 0000 0000 0000 0003  ................
    -000007c0: 579e 8401 f8c3 b622 d728 b1ef ade1 97c9  W......".(......
    -000007d0: 39d6 c214 d7d2 4a76 ee35 f8ec 7fd2 d464  9.....Jv.5.....d
    -000007e0: ac2f 2d7c 036c bf0e 584b 68ac ed46 7efb  ./-|.l..XKh..F~.
    -000007f0: 05af b69a f20b 5cc9 ec56 1509 86b7 aa04  ......\..V......
    +000007b0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    +000007c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    +000007d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    +000007e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    +000007f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    00000800: 0080 0330 9df7 070c 71ce 090c adcd 090c  ...0....q.......
    00000810: c9cd 090c e5cd 090c 01ce 090c 39ce 090c  ............9...
    00000820: 39e3 090c 39e3 090c 39e3 090c d1de 090c  9...9...9.......
    00000830: 39e3 090c 39e3 090c 5511 080c fddc 090c  9...9...U.......
    00000840: 39e3 090c 49d9 090c 39e3 090c 39e3 090c  9...I...9...9...
    00000850: 29e2 090c 39e3 090c 39e3 090c 39e3 090c  )...9...9...9...
    00000860: 55ce 090c 39e3 090c 39e3 090c 39e3 090c  U...9...9...9...
    @@ -277,23 +277,23 @@
    00001140: e9fe 032e 05d9 eb68 1e2b 04bf 64f0 7f04  .......h.+..d...
    00001150: e4b2 0122 40ea 0424 6946 a868 36f0 e4fa  ..."@..$iF.h6...
    00001160: 019a a4b2 b2f5 803f 02d3 0e49 0e48 e3e7  .......?...I.H..
    00001170: 2046 0099 92b2 01f0 71fa b0f1 aa3f f4d1   F......q....?..
    00001180: 054b 1a68 039b 5a40 4ff0 0003 01d0 4bf0  .K.h..Z@O.....K.
    00001190: 73fd 0620 04b0 70bd ac87 0030 6c80 0e0c  s.. ..p....0l...
    000011a0: 20fa 100c bb80 0e0c 4cfb 100c f0b5 304b   .......L.....0K
    -000011b0: 87b0 0746 0868 1b68 0593 4ff0 0003 0e00  ...F.h.h..O.....
    -000011c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    -000011d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    -000011e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    -000011f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    -00001200: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    -00001210: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    -00001220: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    -00001230: 0000 0000 0000 0000 0000 0000 0000 00f0  ................
    +000011b0: 87b0 0746 0868 1b68 0593 4ff0 0003 0e46  ...F.h.h..O....F
    +000011c0: fff7 a8fe 431e dbb2 3e2b 0546 03d9 2949  ....C...>+.F..)I
    +000011d0: 2948 41f0 bfff 7068 fff7 9cfe 022f 0446  )HA...ph...../.F
    +000011e0: 05d9 b368 1e2b 04bf 65f0 7f05 edb2 44ea  ...h.+..e.....D.
    +000011f0: 0520 0025 84b2 2a46 2946 2046 0df1 0203  . .%..*F)F F....
    +00001200: adf8 0250 02f0 74f8 b0f1 aa3f 29d1 bdf8  ...P..t....?)...
    +00001210: 0260 46b3 1022 2946 01a8 94f0 b5fb 3146  .`F..")F......1F
    +00001220: 01a8 43f0 99fe 2046 bdf8 0820 0399 0df1  ..C... F... ....
    +00001230: 0203 02f0 5df8 b0f1 aa3f 05d0 01a8 43f0  ....]....?....C.
    00001240: ddfe 0e49 0e48 c4e7 0e48 01a9 3df0 e2f9  ...I.H...H..=...
    00001250: 074b 1a68 059b 5a40 4ff0 0003 05d0 4bf0  .K.h..Z@O.....K.
    00001260: 0bfd 0620 f4e7 0848 f2e7 07b0 f0bd 00bf  ... ...H........
    00001270: ac87 0030 6c80 0e0c 20fa 100c d080 0e0c  ...0l... .......
    00001280: 4cfb 100c a410 110c 9410 110c 30b5 254d  L...........0.%M
    00001290: 00eb c000 244b 05eb 4005 87b0 0c46 2846  ....$K..@....F(F
    000012a0: 0021 1b68 0593 4ff0 0003 03f0 53f8 b0f1  .!.h..O.....S...

**diffoscope_results_regular.txt**

```
--- trezor-t3t1-2.8.3.bin.zeroed
+++ build/core-T3T1/firmware/firmware.bin
@@ -117,19 +117,19 @@
 00000740: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000750: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000760: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000770: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000780: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000790: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 000007a0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000007b0: 0000 0000 0000 0000 0000 0000 0000 0003  ................
-000007c0: 67ed dfc5 cdc1 faba 7d75 42ed 92d6 c880  g.......}uB.....
-000007d0: fd96 0e62 17d6 9d7c c2c0 b71a 890a e8e6  ...b...|........
-000007e0: ea0e 0556 0a6f ab79 2523 ce9f 672d e51f  ...V.o.y%#..g-..
-000007f0: a57c 9d89 0bf6 52ef 36bc 10de e0b2 5801  .|....R.6.....X.
+000007b0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
+000007c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
+000007d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
+000007e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
+000007f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00000800: 0080 0330 8d3a 080c 6111 0a0c 9d10 0a0c  ...0.:..a.......
 00000810: b910 0a0c d510 0a0c f110 0a0c 2911 0a0c  ............)...
 00000820: 2926 0a0c 2926 0a0c 2926 0a0c c121 0a0c  )&..)&..)&...!..
 00000830: 2926 0a0c 2926 0a0c 4554 080c ed1f 0a0c  )&..)&..ET......
 00000840: 2926 0a0c 391c 0a0c 2926 0a0c 2926 0a0c  )&..9...)&..)&..
 00000850: 1925 0a0c 2926 0a0c 2926 0a0c 2926 0a0c  .%..)&..)&..)&..
 00000860: 4511 0a0c 2926 0a0c 2926 0a0c 2926 0a0c  E...)&..)&..)&..
@@ -277,23 +277,23 @@
 00001140: e9fe 032e 05d9 eb68 1e2b 04bf 64f0 7f04  .......h.+..d...
 00001150: e4b2 0122 40ea 0424 6946 a868 3af0 5cfc  ..."@..$iF.h:.\.
 00001160: 019a a4b2 b2f5 803f 02d3 0e49 0e48 e3e7  .......?...I.H..
 00001170: 2046 0099 92b2 01f0 71fa b0f1 aa3f f4d1   F......q....?..
 00001180: 054b 1a68 039b 5a40 4ff0 0003 01d0 4ff0  .K.h..Z@O.....O.
 00001190: ebfe 0620 04b0 70bd ac87 0030 10cd 0e0c  ... ..p....0....
 000011a0: 908f 110c 5fcd 0e0c bc90 110c f0b5 304b  ...._.........0K
-000011b0: 87b0 0746 0868 1b68 0593 4ff0 0003 0e00  ...F.h.h..O.....
-000011c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000011d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000011e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-000011f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00001200: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00001210: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00001220: 0000 0000 0000 0000 0000 0000 0000 0000  ................
-00001230: 0000 0000 0000 0000 0000 0000 0000 00f0  ................
+000011b0: 87b0 0746 0868 1b68 0593 4ff0 0003 0e46  ...F.h.h..O....F
+000011c0: fff7 a8fe 431e dbb2 3e2b 0546 03d9 2949  ....C...>+.F..)I
+000011d0: 2948 46f0 37f9 7068 fff7 9cfe 022f 0446  )HF.7.ph...../.F
+000011e0: 05d9 b368 1e2b 04bf 65f0 7f05 edb2 44ea  ...h.+..e.....D.
+000011f0: 0520 0025 84b2 2a46 2946 2046 0df1 0203  . .%..*F)F F....
+00001200: adf8 0250 02f0 74f8 b0f1 aa3f 29d1 bdf8  ...P..t....?)...
+00001210: 0260 46b3 1022 2946 01a8 99f0 07fa 3146  .`F..")F......1F
+00001220: 01a8 48f0 11f8 2046 bdf8 0820 0399 0df1  ..H... F... ....
+00001230: 0203 02f0 5df8 b0f1 aa3f 05d0 01a8 48f0  ....]....?....H.
 00001240: 55f8 0e49 0e48 c4e7 0e48 01a9 41f0 5afb  U..I.H...H..A.Z.
 00001250: 074b 1a68 059b 5a40 4ff0 0003 05d0 4ff0  .K.h..Z@O.....O.
 00001260: 83fe 0620 f4e7 0848 f2e7 07b0 f0bd 00bf  ... ...H........
 00001270: ac87 0030 10cd 0e0c 908f 110c 74cd 0e0c  ...0........t...
 00001280: bc90 110c 14a6 110c 04a6 110c 30b5 254d  ............0.%M
 00001290: 00eb c000 244b 05eb 4005 87b0 0c46 2846  ....$K..@....F(F
 000012a0: 0021 1b68 0593 4ff0 0003 03f0 53f8 b0f1  .!.h..O.....S...
```

After several tries, we decided to create GitHub issue [4254](https://github.com/trezor/trezor-firmware/issues/4254) so we can be aware of the appropriate values. 

## Review 2024-10-08

Built on the technology behind the {% include walletLink.html wallet='hardware/trezorSafe3' verdict='true' %}, the trezor Safe 5 features the following: 

- 39 mm touchscreen (240 x 240 pixels)
- NDA-free EAL 6+ Secure Element
- 12-, 20-, 24- wallet backup
- Advanced Multi-share Backup
- Haptic feedback
- Shipped without firmware (can be installed through USB-C using Trezor Suite)  
- Pin and passphrase protection
- Bitcoin-only and Universal (1000 coins and tokens) variants

