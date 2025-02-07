---
title: BITHD Razor
appId: bithdrazor
authors:
- kiwilamb
- danny
- leo
released: 2019-03-08
discontinued: 
updated: 2021-12-14
version: v4.1.8
binaries: https://github.com/bithd/bithd-mcu/releases/
dimensions:
- 83
- 51
- 2.2
weight: 18
provider: BitHD
providerWebsite: https://bithd.com
website: https://bithd.com/BITHD-Razor.html
shop: https://bithd.com/BITHD-Razor.html
country: CN
price: 
repository: https://github.com/bithd/bithd-mcu
issue: 
icon: bithdrazor.png
bugbounty: 
meta: discontinued
verdict: nonverifiable
appHashes:
- 784c7448e0b713ef7952ebd454d4e809b15adffd23ac84cfdd3af06358e7cfe2
date: 2022-11-25
signer: 
reviewArchive:
- date: 2021-12-11
  version: 4.1.7
  appHashes:
  - a4a9a5584f1db23d745434c296aedd3c123fe506c49624076d4726417e900137
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

## Update 2022-11-25

The product's buy link goes to [Amazon.](https://www.amazon.com/BITHD-Cryptocurrency-Hardware-Wallet-Pocket/dp/B07QKF867S/ref=sr_1_4?m=A1Q5WMBAZ5F5MU&marketplaceID=ATVPDKIKX0DER&qid=1578887523&s=merchant-items&sr=1-4) It is indicated there that the product is "unavailable."

## Previous Verdict

For the latest firmware version, we try the same as last time, wrapped
into [this script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/bithdrazor.sh):

```
$ ./scripts/test/hardware/bithdrazor.sh 4.1.8
...
784c7448e0b713ef7952ebd454d4e809b15adffd23ac84cfdd3af06358e7cfe2  razor-v4.1.8-signed.bin
...
Filename    : build/razor-v4.1.8-unsigned.bin
Fingerprint : 338fa85b8e04093983c3d0f0de18ffb178211843acef7678035a344feb8f52ef
Size        : 417972 bytes (out of 491520 maximum)
Warning: Your Pipfile requires python_version 3.8, but you are using 3.9.2 (/home/leo/.local/share/v/b/bin/python).
  $ pipenv check will surely fail.
Prepare to add metadata ...
Firmware size 418228 bytes
Firmware fingerprint: 338fa85b8e04093983c3d0f0de18ffb178211843acef7678035a344feb8f52ef
1c1
< 00000000: 5452 5a52 b460 0600 0000 0001 0000 0000  TRZR.`..........
---
> 00000000: 5452 5a52 b460 0600 0304 0501 0000 0000  TRZR.`..........
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
> 00000040: a069 4723 6fa4 c943 83b9 8042 bfbf 1880  .iG#o..C...B....
> 00000050: f758 4e20 7e54 8591 705a d597 6121 5df3  .XN ~T..pZ..a!].
> 00000060: 6d74 8911 cd98 072e f4ca 6a43 b6c1 daf5  mt........jC....
> 00000070: 05a5 f448 51b3 f6a0 c290 91a4 5000 69cf  ...HQ.......P.i.
> 00000080: d710 cb5a d186 7b1b 44d8 7847 7e25 ce1c  ...Z..{.D.xG~%..
> 00000090: 747a 2921 9b17 c2b6 d06c a513 9aa8 c878  tz)!.....l.....x
> 000000a0: 9f02 ac7f 8398 2941 e1d7 abc1 9a71 6488  ......)A.....qd.
> 000000b0: b882 aa63 086f 0bb1 81db 6afb 0030 55ee  ...c.o....j..0U.
> 000000c0: 332c 8adf 71d9 89ab 1298 28f5 093b 1143  3,..q.....(..;.C
> 000000d0: 7388 18cf 8ea7 88ed db39 769c 1e6c ae67  s........9v..l.g
> 000000e0: 43b8 a0e4 7f8e f2f8 8b59 0f51 8205 caec  C........Y.Q....
> 000000f0: 626b 33b3 f812 1b8a 8537 2675 726b f14e  bk3......7&urk.N
425c425
< 00001a80: 3018 0408 0000 0020 95bc 0020 4218 0408  0...... ... B...
---
> 00001a80: 4518 0408 0000 0020 95bc 0020 3018 0408  E...... ... 0...
12692,12694c12692,12694
< 00031930: 6269 7463 6f69 6e74 7265 7a6f 722e 636f  bitcointrezor.co
< 00031940: 6d00 37cb c888 2133 3c8d 0c63 42b1 7fba  m.7...!3<..cB...
< 00031950: 9e8d 84b3 757a 0050 696e 206d 6973 6d61  ....uz.Pin misma
---
> 00031930: f5f3 8317 45a6 190b 00fb 0262 b9c7 09af  ....E......b....
> 00031940: 7618 49f8 0062 6974 636f 696e 7472 657a  v.I..bitcointrez
> 00031950: 6f72 2e63 6f6d 0050 696e 206d 6973 6d61  or.com.Pin misma
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
