---
title: "BitBox02"
appId: bitBox2
authors:
- leo
released: 
discontinued: # date
latestUpdate: 
version: 
dimensions: [54.5, 25.4, 9.6]
weight: 12
website: https://shiftcrypto.ch/
shop: https://shiftcrypto.shop/en/products/bitbox02-bitcoin-only-4/
country: CH
price: 119EUR
repository: https://github.com/digitalbitbox
issue: https://github.com/digitalbitbox/bitbox02-firmware/issues/762
icon: bitBox2.png
bugbounty: 
verdict: reproducible # wip noita nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-07-09
signer: 
reviewArchive:


providerTwitter: ShiftCryptoHQ
providerLinkedIn: shift-crypto
providerFacebook: Shiftcrypto
providerReddit: BitBoxWallet
---


The {{ page.title }} comes in two variations:

* Multi
* Bitcoin-only

The latter is great for Bitcoiners as software is only as secure as its weakest
part, so many parts increase the chance of a weakness. With a no-altcoin version
the attack surface is reduced.

In [security features](https://shiftcrypto.ch/bitbox02/security-features/) they
claim:

> **Reproducible builds**<br>
  Don't trust, verify! The BitBox02 firmware is reproducible, meaning anyone can
  compile the open-source firmware themselves and verify that the binary is
  exactly the same as the official release. You can find instructions and more
  details on how the reproducible builds work on our
  [Github](https://github.com/digitalbitbox/bitbox02-firmware/tree/master/releases).
>  
> We also gather signatures from the community asserting the correctness of our releases.
> 
> [Contribute and sign the bitbox02-firmware](https://github.com/digitalbitbox/bitbox02-firmware/tree/master/releases#contribute-your-signature)

which is great if we don't find any show-stoppers ...

For hardware wallets we care furthermore about who generates the keys. In this
case it looks like the device does not come pre-seeded, although that also is
part of the mix. It does not rely on a closed-source random number generator,
although that also is part of the mix. As the seeds get generated with random
numbers from:

> 1. A true random number generator on the secure chip
> 1. A true random number generator on the microcontroller
> 1. A static random number set during factory installation and unique to each BitBox02
> 1. Host entropy provided by the app running on your computer, e.g. from /dev/urandom
> 1. A cryptographic hash of the device password

... at least so claims the provider. We would very much like to know:

* **Can the user access the raw entropy?** Only if this is possible can a
  security expert determine if all the entropy actually went into the
  masterseed.
* **Can the user provide his own entropy, bypassing the problem of fake
  randomness?** Using for example physical dices as the sole source of entropy
  allows the user to both get strong, reliable entropy and a way to test if the
  addresses displayed by the device are indeed derived from the correct
  masterseed.<br>
  As the device allows recovery from the seed words, this can be done.

In [this comparison](https://shiftcrypto.ch/#comparison) the provider presents
what they probably consider the most relevant aspects of their product compared
with their competitors:

* **Open-source**: Yes, one of the most popular hardware wallets, the
  {% include walletLink.html wallet="hardware/ledgerNanoS" verdict="true" %}'s
  firmware is not open source!
* **Secure chip**: Yes, the
  {% include walletLink.html wallet="hardware/trezorT" verdict="true" %} doesn't
  have one!

**but those two bullet points** in combination are worthy a deeper look into the
details: Trezor doesn't use a "Secure Chip" precisely because those are not open
to public scrutiny. Prospect buyers have to sign NDAs before even getting a
closer look at what these chips can do. And this problematic circumstance is
very much acknowledged by the provider in
[this blog post](https://shiftcrypto.ch/blog/best-of-both-worlds-using-a-secure-chip-with-open-source-firmware/):

> **The closed-source drawback**<br>
  Secure chips are not even that expensive, so why does not every hardware wallet use them? The main drawback is that secure chips are closed source. Firmware running on a secure chip cannot be released as open source due to enforced non-disclosure agreements.
> 
> When it comes to firmware securing your bitcoin, creating random seeds and signing transactions, trusting closed source software that cannot be independently audited is just not good enough. In our opinion, you should not need to trust the manufacturer of your hardware wallet (and all its individual employees) to belong to the “good guys”, diligently finding their own bugs without independent reviews and then actually fixing them.

But the blog post goes on with some clever design considerations:

> **Best of both worlds**<br>
  Still, general purpose MCUs are simply not up to the task of keeping a digital secret. In the best of all worlds, we would be able to run open-source firmware on an open-source secure chip. There are projects that aim to create such a chip, like [TropicSquare](https://tropicsquare.com/), but no open-source chip is commercially available today. The next best option is to use the advantages of both open-source firmware and secure chip by combining them in a way that
> 
> * the hardware wallet only runs open-source firmware,
> * the device is hardened against physical attacks using a secure chip, and
> * the secure chip does not need to be trusted, as it cannot learn any of the secrets.
> 
> The BitBox02 security architecture is designed towards these goals. We use two chips, a general purpose MCU and a secure chip in parallel, both with their unique strengths. Instead of running Bitcoin firmware directly on the secure chip, we run it on the MCU, meaning the code is fully open-source and auditable by anyone. Secrets are also stored on the MCU, but encrypted using multiple keys, including a key stored on the secure chip that can only be accessed using dedicated key derivation functions (KDF).

So the chip the {{ page.title }} uses is the
[ATECC608B](https://www.microchip.com/wwwproducts/en/ATECC608B) but it's only
used supplementary:

* The chips "secure" random number generator is used but so are other sources of
  entropy
* The hardened key storage is used but not for the master seed itself. Only for
  an encryption key for that master seed which is stored outside the "Secure
  Chip".

So the harm this closed source chip could do is very limited. It could deny
service but it could not phone home or use poor randomness to leak the master
seed which is our primary
concern. The design is solid. Only remaining step is to see if the firmware is
[reproducible as advertised](https://github.com/digitalbitbox/bitbox02-firmware/tree/master/releases#how-to-reproduce):


For a start we will try to reproduce
[firmware-btc-only/v9.6.0](https://github.com/digitalbitbox/bitbox02-firmware/releases/tag/firmware-btc-only%2Fv9.6.0).

Independent of the update being done through the companion app, the
{{ page.title }} should show the firmware binary's hash prior to installation:

> **Verify the hash shown by the BitBox02:**<br>
  The hash of the firmware as verified/shown by the BitBox02 at startup is:<br>
  `e788644ec86c63c193e13a1b6cfbdda359b7117dc38090c794e1c6aea69f601f`

```
$ git clone https://github.com/digitalbitbox/bitbox02-firmware
$ cd bitbox02-firmware/
$ wget https://github.com/digitalbitbox/bitbox02-firmware/releases/download/firmware-btc-only%2Fv9.6.0/firmware-btc.v9.6.0.bin
$ wget https://github.com/digitalbitbox/bitbox02-firmware/releases/download/firmware-btc-only%2Fv9.6.0/firmware-btc.v9.6.0.signed.bin
$ echo e788644ec86c63c193e13a1b6cfbdda359b7117dc38090c794e1c6aea69f601f; sha256sum *.bin
e788644ec86c63c193e13a1b6cfbdda359b7117dc38090c794e1c6aea69f601f
3a39395f04cbdfae3357efbb24a0c5f7fc9ce69bc505bfc545cb49dab76b4d46  firmware-btc.v9.6.0.bin
e41917450ef6fb80af9fbe8f85478973763fe593c23cdeaec481e5d5395dd3b9  firmware-btc.v9.6.0.signed.bin
```

Ok? That's odd. There are two bin files provided and the source code. As the
device should check the signature of any firmware update, the correct file
should be `firmware-btc.v9.6.0.signed.bin`.

So now it's not clear what reproducing binaries is worth if then the companion
app downloads the firmware update from a different source or maybe the same and
patches it? Accountability is lost as far as we can see. We opened an
[issue](https://github.com/digitalbitbox/bitbox02-firmware/issues/762) and will
continue the review once we get clarity.

... [clarity came within 9h](https://github.com/digitalbitbox/bitbox02-firmware/issues/762#issuecomment-875448905):

> As for the hash shown in the release notes, please check this documentation:
> 
> [master/releases#verify-the-hash-as-shown-by-the-bitbox02-at-startup](https://github.com/digitalbitbox/bitbox02-firmware/tree/master/releases#verify-the-hash-as-shown-by-the-bitbox02-at-startup)
> 
> In summary, the hash you are seeing is the sha256d(&lt;version>&lt;padded firmware>), and there is a small, easy to audit tool in the same folder to help reproduce it:
> 
> [master/releases/describe_signed_firmware.py](https://github.com/digitalbitbox/bitbox02-firmware/blob/master/releases/describe_signed_firmware.py)

To understand if the verification code is benign, we would have to also audit
its direct and transitive dependencies. After all python
allows [MonkeyPatching](https://en.wikipedia.org/wiki/Monkey_patch#Examples)
dependencies, which allows any dependency to mess with this "small, easy to
audit" function(s).

To verify we dug through their verification script and basically replicated the
relevant parts in shell script:

We have to take the `firmware-btc.v9.6.0.signed.bin` and:

* strip its first 588 bytes
  * extract 4 "magic" bytes
  * extract 4 "version" bytes
  * extract 3 * 64 "signing keys" bytes
  * extract 3 * 64 "root keys" bytes
  * extract 4 "version" bytes
  * extract 3 * 64 "signing keys" bytes
* take the remaining bytes as firmware
* append as many binary `1`s as fit into the maximum firmware size of ...
  
  ```
  $ cat py/bitbox02/bitbox02/bitbox02/bootloader.py | grep MAX_FIRMWARE_SIZE
  MAX_FIRMWARE_SIZE = 884736  # 928kB - 64kB
  ```
  
  884736 bytes.

Here is the first 588 bytes in hexadecimal to our understanding:

```
btc-only magic:        11 23 3b 0b
signature (?) version: 01 00 00 00
sig key 1:             fe 01 4b fd d8 92 80 ce 2d a7 6e 95 84 aa 85 75 4f 68 3c 9e 10 48 10 9a 99 16 54 c5 2a bb ba 55 b0 f5 7c 60 f5 75 a3 a3 d5 cf 65 f3 cf 7b 50 e8 b4 c5 ac 95 71 29 27 04 89 92 ab 6c 97 8e 66 d9
sig key 2:             59 4d bc 1d 4c 81 a3 b5 aa 7e b4 b6 2c 9f ad 9e f3 f2 00 f2 59 a4 5c c0 6c c1 22 3c 0a ee a3 6f d5 76 98 af 4a 73 ff 49 de 7b 05 6e d4 0f d1 06 a8 2b 99 ad d0 82 c3 35 f2 a2 c6 72 00 af c6 43
sig key 3:             18 3e ba 23 f6 2d a6 7b 24 c1 9c 0d d5 79 25 60 38 45 3b c8 f5 76 36 59 85 c8 de 2f 7a 23 7b f7 33 cf 82 08 b6 b0 a9 05 e1 6f 45 43 c4 a3 0b 94 60 f5 78 f5 45 1e fd 01 3b 73 53 36 ad 56 7b 3b
root key 1:            59 32 1b 68 14 7c e1 4a ab 24 f5 8a d0 3c 32 d2 09 93 02 2f 6f d5 b6 34 a9 d7 54 f3 fd eb ba 0b 39 c5 97 0a 2b 69 be 7d f6 8c e4 d0 3e e4 ca 81 fe 52 0d ca 98 a5 04 24 f9 30 a0 41 f1 5b 02 6b
root key 2:            00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
root key 3:            63 ca 7f d0 0e 56 44 e4 37 31 74 94 74 1f bc bb 39 6d 2b 81 e4 97 f4 4f 88 a5 d9 dd af c2 4d 34 fc f7 ea 2a d5 87 e6 3a 9c 3f c9 f2 24 a1 32 6f 73 a0 4b bf 9e d9 84 8a 60 1e 0a 7b 48 fe 6f 3f
firmware version:      16 00 00 00
sig key 1:             3a 78 af b9 98 0f 96 1c 2d ee 88 6f 81 1c a2 e7 9a 57 51 f1 f5 1c 19 b4 20 a0 7f ac e3 44 cf af 61 9d b3 5b 51 11 4c 4b 6d ae 30 0d be a4 ca 36 64 41 86 60 68 d7 6a 6d 12 32 8a 10 bc f3 23 52
sig key 2:             8f e6 94 2a bc bd fd d1 44 ed 26 69 a7 cf 61 a3 8c e9 1d 25 d6 a4 44 9e 77 ec 28 c0 5a 79 1b 80 55 2e a5 ad f0 87 f5 6f 68 e1 57 f4 62 c0 b3 53 d4 de 8d 53 b4 c1 1e e0 9a 1d 9c a8 d7 13 42 c0
sig key 3:             00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```

The following is a condensed version of lots of try-and-error of extracting the
relevant parts:

```
$ head -c 588 firmware-btc.v9.6.0.signed.bin > p_head.bin
$ tail -c +589 firmware-btc.v9.6.0.signed.bin > p_firmware.bin
$ cat p_head.bin | tail -c +$(( 8 + 6 * 64 + 1 )) | head -c 4 > p_version.bin
$ cat p_version.bin | xxd -p
16000000
$ wc -c p_firmware.bin 
461228 p_firmware.bin
$ echo $(( 884736 - 461228 ))
423508
$ dd if=/dev/zero ibs=1 count=423508 | tr "\000" "\377" > p_padding.bin
$ cat p_version.bin p_firmware.bin p_padding.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64
e788644ec86c63c193e13a1b6cfbdda359b7117dc38090c794e1c6aea69f601f
```

So the {{ page.title }} shows the hash of all but the first 588 bytes while
those 588 bytes are mostly signatures. 588 bytes are enough for backdoors, so 
the correct working of the bootloader is essential. **Its detailed inspection is
beyond the scope of our analysis.**

So now, on to really reproducing the firmware ...

```
$ releases/build.sh firmware-btc-only/v9.6.0 "make firmware-btc"
$ sha256sum temp/build/bin/firmware-btc.bin firmware-btc.v9.6.0.bin
3a39395f04cbdfae3357efbb24a0c5f7fc9ce69bc505bfc545cb49dab76b4d46  temp/build/bin/firmware-btc.bin
3a39395f04cbdfae3357efbb24a0c5f7fc9ce69bc505bfc545cb49dab76b4d46  firmware-btc.v9.6.0.bin
```

During compilation we saw a surprising amount of dependencies being mentioned
using golang, rust, python and C which again hopefully others look into in more
detail. After all, the provider has a bug bounty program.

The result looks good. The {{ page.title }} is a hardware wallet and its
firmware is **reproducible**.
