---
title: BITHD Razor
appId: bithdrazor
authors:
- kiwilamb
- danny
- leo
released: 2019-03-08
discontinued: 
updated: 2021-08-09
version: v4.1.7
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
meta: ok
verdict: reproducible
date: 2021-12-11
signer: 
reviewArchive: 
twitter: 
social: 

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

## Private keys can be created offline - ✔️

The [BitHD](https://bithd.com/BITHD-Razor.html) homepage affirms that the private keys are created offline. 

The process goes as follows: 

The BitHD Razor is paired with the BitPie app through bluetooth which can be downloaded on [their website.](https://bitpie.com/android/) and on Google Play.

- {% include walletLink.html wallet='android/com.bitpie' verdict='true' %}

The device then displays the seed phrases.

([Source: video](https://www.youtube.com/watch?v=nGm4_umShlg))

## Private keys are not shared - ✔️

The device has a security seal that displays the word VOID once opened. Since the device has to be paired with the user's app prior to seed generation, we can assume that the manufacturer will not have access to these.  

## Device displays receive address for confirmation - ✔️

Yes. This can be corroborated in the [official documentation](https://docs.bithd.com/en/latest/razor/sendandreceive.html) page on sending and receiving coins.

Note that most of the interaction is done via the BitPie app on the phone. 

## Interface - ✔️

The device has a 128*64 OLED display and two buttons. The display is used to:

1. Confirm transactions
2. Display the seed words 

## Code and Reproducibility - ✔️

At the bottom of [their website](https://bithd.com) we can read:

> BITHD is based on Trezor source code; and we extend our appreciation and
  gratitude to Trezor and BWallet.<br>
  [Open source](https://github.com/bithd)

and indeed their repository [bithd-mcu](https://github.com/bithd/bithd-mcu)
contains build instructions for all three of their products:

* {% include walletLink.html wallet='hardware/bithdwatch1' verdict='true' %}
* {% include walletLink.html wallet='hardware/bithdwatch2' verdict='true' %}
* {% include walletLink.html wallet='hardware/bithdrazor' verdict='true' %}

In terms of being a Trezor fork, the repository is ...

> 209 commits ahead, 515 commits behind trezor:master.

meaning it probably has some exclusive features and might miss more recent
changes from Trezor.

Anyway, let's see if we can reproduce builds. The latest signed firmware is
[v4.1.7](https://github.com/bithd/bithd-mcu/releases/tag/v4.1.7). There we find

```
bithd-v4.1.7-signed.bin 	0a89405429ea6aa5abe8533f538f45bbaff36044b62aefcaaa63ef52bffebde0
razor-v4.1.7-signed.bin 	a4a9a5584f1db23d745434c296aedd3c123fe506c49624076d4726417e900137
```

We assume the two watches use the same binary, while the razor uses the other.

So we get two binaries for three products ...

```
$ git clone https://github.com/bithd/bithd-mcu
$ cd bithd-mcu/
$ wget https://github.com/bithd/bithd-mcu/releases/download/v4.1.7/bithd-v4.1.7-signed.bin
$ wget https://github.com/bithd/bithd-mcu/releases/download/v4.1.7/razor-v4.1.7-signed.bin
$ echo '0a89405429ea6aa5abe8533f538f45bbaff36044b62aefcaaa63ef52bffebde0 bithd-v4.1.7-signed.bin' > shasums.txt
$ echo 'a4a9a5584f1db23d745434c296aedd3c123fe506c49624076d4726417e900137 razor-v4.1.7-signed.bin' >> shasums.txt
$ sha256sum --check shasums.txt 
bithd-v4.1.7-signed.bin: OK
razor-v4.1.7-signed.bin: OK
$ cat build-firmware.sh            # looks benign
$ pipenv --python 3 install
$ export VERSION_TAG=v4.1.7
$ export DEVICE_MODEL=BITHD_RAZOR
$ pipenv run ./build-firmware.sh $VERSION_TAG
$ cat script/prepare_firmware.py   # looks benign
$ pipenv run ./script/prepare_firmware.py -f ./build/razor-$VERSION_TAG-unsigned.bin
Warning: Your Pipfile requires python_version 3.8, but you are using 3.9.7 (/home/leo/.local/share/v/b/bin/python).
  $ pipenv check will surely fail.
Prepare to add metadata ...
Firmware size 417940 bytes
Firmware fingerprint: 2f142a5bd6e4cd2d3309895a4ed6ed539d67f9969260c5cbec2f524406527e84
$ diff <(xxd build/razor-v4.1.7-prepared.bin) <(xxd razor-v4.1.7-signed.bin)
1c1
< 00000000: 5452 5a52 945f 0600 0000 0001 0000 0000  TRZR._..........
---
> 00000000: 5452 5a52 945f 0600 0304 0501 0000 0000  TRZR._..........
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
> 00000040: 3a68 2f7d 8f3b 9d0a 855c 020c 925a 777d  :h/}.;...\...Zw}
> 00000050: e9f9 ca1d df66 bebc 1692 9fe0 4d21 2b5d  .....f......M!+]
> 00000060: a387 4242 6efb bf92 1baf 7f88 31a0 607a  ..BBn.......1.`z
> 00000070: 70a0 7832 b203 915d c6fe 2b1b c0e9 b051  p.x2...]..+....Q
> 00000080: 7e42 3955 a18b 4d4c 109d edc9 d96c 5f75  ~B9U..ML.....l_u
> 00000090: ab25 510e 477e 0ff1 7402 9610 dd5a b1ad  .%Q.G~..t....Z..
> 000000a0: db9d 87ca d82e d7c4 6215 c238 5c0d 2a9a  ........b..8\.*.
> 000000b0: 1651 0194 0edc 3ccf c2de 1a58 f82c e7ef  .Q....<....X.,..
> 000000c0: d60b 546a bf6c 3791 69b0 1e3c fbea 5bd8  ..Tj.l7.i..<..[.
> 000000d0: d889 7096 540d 28fa ff7e f0de f8ea 641f  ..p.T.(..~....d.
> 000000e0: a47b aaa5 7529 8945 7bc1 e5f3 871a 4c34  .{..u).E{.....L4
> 000000f0: 4270 57cf 09e3 845a 38cc aac1 224d b386  BpW....Z8..."M..
```

On to checking the watches ...

```
$ export DEVICE_MODEL=BITHD_BITHD
$ pipenv run ./build-firmware.sh $VERSION_TAG
$ pipenv run ./script/prepare_firmware.py -f ./build/bithd-$VERSION_TAG-unsigned.bin
Warning: Your Pipfile requires python_version 3.8, but you are using 3.9.7 (/home/leo/.local/share/v/b/bin/python).
  $ pipenv check will surely fail.
Prepare to add metadata ...
Firmware size 417788 bytes
Firmware fingerprint: 0f948e16337b0607d7b1218598e8af096b4a0566c54572c081ea5dded8ce9547
$ diff <(xxd build/bithd-v4.1.7-prepared.bin) <(xxd bithd-v4.1.7-signed.bin)
1c1
< 00000000: 5452 5a52 fc5e 0600 0000 0001 0000 0000  TRZR.^..........
---
> 00000000: 5452 5a52 fc5e 0600 0304 0501 0000 0000  TRZR.^..........
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
> 00000040: ea75 7244 687a 9eb6 2acc cf55 e2fb 8f8f  .urDhz..*..U....
> 00000050: a643 02b1 63ab c178 aa7e bd1b 547f 30b2  .C..c..x.~..T.0.
> 00000060: ef50 4e54 99ac d4b1 a1e4 ef04 77e8 5ac7  .PNT........w.Z.
> 00000070: 6967 21b8 e9d2 fad7 9ec8 36e8 a759 913a  ig!.......6..Y.:
> 00000080: fec0 db08 68fc 4289 ac45 7330 c797 9380  ....h.B..Es0....
> 00000090: 7d9c b4a3 c0db 3ce5 c559 f463 f33b 75e8  }.....<..Y.c.;u.
> 000000a0: cc4d a067 4441 03fe 5299 6602 c431 d6ac  .M.gDA..R.f..1..
> 000000b0: 4ab9 3d1a 1612 0d1e 7ec5 7c45 b91b f659  J.=.....~.|E...Y
> 000000c0: 8bad c208 9526 0da8 9627 5c53 c2e5 0ed3  .....&...'\S....
> 000000d0: b0ad bed4 1676 bab5 d190 8077 83b0 1c63  .....v.....w...c
> 000000e0: c3c7 2044 de40 21f2 ab85 8ae2 50a2 eb17  .. D.@!.....P...
> 000000f0: f149 9128 d745 65e3 af54 5dd3 418b f5ba  .I.(.Ee..T].A...
```

So both the razor and the bithd firmware yields the expected diff from the
signatures. This firmware is **reproducible**.
