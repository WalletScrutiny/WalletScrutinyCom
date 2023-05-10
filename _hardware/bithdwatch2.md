---
title: BITHD Watch 2
appId: bithdwatch2
authors:
- kiwilamb
- danny
- leo
released: 2019-01-18
discontinued: 
updated: 2021-12-14
version: v4.1.8
binaries: https://github.com/bithd/bithd-mcu/releases/
dimensions:
- 42
- 36
- 12
weight: 
provider: BitHD
providerWebsite: https://bithd.com
website: https://bithd.com/BITHD-watch-2.html
shop: https://bithd.com/BITHD-watch-2.html
country: CN
price: 
repository: https://github.com/bithd/bithd-mcu
issue: 
icon: bithdwatch2.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2022-04-18
signer: 
reviewArchive:
- date: 2021-12-11
  version: 4.1.7
  appHash: 0a89405429ea6aa5abe8533f538f45bbaff36044b62aefcaaa63ef52bffebde0
  gitRevision: 5039bd8dc007690d50a6b60b5768c239255434af
  verdict: reproducible
twitter: 
social: 
features: 

---

<div class="alertBox"><div>
<p>There is currently several red flags about this product.

<ul>
<li>Companion app with terrible rating and accusations</li>
<li>No social media links</li>
<li>Out of stock product with no word on plans to re-stock</li>
</ul>
</p>
</div></div>

For the latest firmware version, we try the same as last time, wrapped
into [this script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/bithdwatches.sh):

```
$ ./scripts/test/hardware/bithdwatches.sh 4.1.8
...
Filename    : build/bithd-v4.1.8-unsigned.bin
Fingerprint : 7c3126aaff2e983c89f621fa7a3d269385832aeeccc3f13ddd1e540656b059d2
Size        : 417820 bytes (out of 491520 maximum)
Warning: Your Pipfile requires python_version 3.8, but you are using 3.9.2 (/home/leo/.local/share/v/b/bin/python).
  $ pipenv check will surely fail.
Prepare to add metadata ...
Firmware size 418076 bytes
Firmware fingerprint: 7c3126aaff2e983c89f621fa7a3d269385832aeeccc3f13ddd1e540656b059d2
90d795380fa7def90f4924a672b64d086b55892266be8baae12c63871ab6598b  bithd-v4.1.8-signed.bin
1c1
< 00000000: 5452 5a52 1c60 0600 0000 0001 0000 0000  TRZR.`..........
---
> 00000000: 5452 5a52 1c60 0600 0304 0501 0000 0000  TRZR.`..........
5,16c5,16
< 00000040: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 00000050: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 00000060: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 00000070: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 00000080: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 00000090: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 000000a0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 000000b0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 000000c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 000000d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 000000e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
< 000000f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
---
> 00000040: 2d28 206f 38de d998 bd9d 96d4 b845 35ae  -( o8........E5.
> 00000050: 758c b6ae e8ea 6c32 3028 94d7 4300 d300  u.....l20(..C...
> 00000060: fc0c c4db c3dd 4a54 d2d7 8922 267a 7cb4  ......JT..."&z|.
> 00000070: 8032 f675 79c3 e527 54dc 8e8b 3bd2 8460  .2.uy..'T...;..`
> 00000080: 9444 0f18 3490 e32c dc62 aeb4 8ba9 c903  .D..4..,.b......
> 00000090: 675c 7e43 810d d87e bb72 1ac0 4757 a27f  g\~C...~.r..GW..
> 000000a0: f9a8 b6f2 2d28 0f51 83ff bc81 89de a39d  ....-(.Q........
> 000000b0: 4631 332b dce9 b3d2 38c4 fa80 cde0 3fde  F13+....8.....?.
> 000000c0: 09ae 5bcb 7b6e 53dd b391 61a3 de1b 9a06  ..[.{nS...a.....
> 000000d0: d74e 0c37 5d89 7c42 0051 05e0 cd80 edcc  .N.7].|B.Q......
> 000000e0: 1200 16f8 56bf c8c9 e14d dcc6 fd91 2159  ....V....M....!Y
> 000000f0: 35a2 6832 ca7d a678 11c8 48d2 17f1 2c2b  5.h2.}.x..H...,+
425c425
< 00001a80: 8019 0408 0000 0020 c5bc 0020 9219 0408  ....... ... ....
---
> 00001a80: 9519 0408 0000 0020 c5bc 0020 8019 0408  ....... ... ....
12713,12715c12713,12715
< 00031a80: 6269 7463 6f69 6e74 7265 7a6f 722e 636f  bitcointrezor.co
< 00031a90: 6d00 37cb c888 2133 3c8d 0c63 42b1 7fba  m.7...!3<..cB...
< 00031aa0: 9e8d 84b3 757a 0050 696e 206d 6973 6d61  ....uz.Pin misma
---
> 00031a80: f5f3 8317 45a6 190b 00fb 0262 b9c7 09af  ....E......b....
> 00031a90: 7618 49f8 0062 6974 636f 696e 7472 657a  v.I..bitcointrez
> 00031aa0: 6f72 2e63 6f6d 0050 696e 206d 6973 6d61  or.com.Pin misma
```

This is a bigger diff than we expected. The first two chunks are ok as these
are 

* a 3-byte diff in the very beginning, which might be due to different file
  structure as per chunk #4 but probably nothing malicious.
* a signature-sized chunk where the compiled version holds zeros. This is
  expected.

Later chunks though are harder to interpret.

* Chunk #3 it is again a 2 byte change, where one byte might have moved,
  indicating some sorting inconsistency ... maybe
* The last chunk again has some sequences moved but it gets hard to interpret as
  it's slightly bigger.

In summary, this makes the firmware **not verifiable** although it all looks
pretty harmless as in "too small to actually be malicious".

Now we would love to get in touch with the provider but their issue tracker is
not open. Given their repository has not seen any update in months, together
with the lack of social accounts, this product feels pretty unmaintained.
