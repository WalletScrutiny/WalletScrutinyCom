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
verdict: wip # wip noita nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-06-20
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
  
  We also gather signatures from the community asserting the correctness of our releases.
  
  [Contribute and sign the bitbox02-firmware](https://github.com/digitalbitbox/bitbox02-firmware/tree/master/releases#contribute-your-signature)

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
  
  When it comes to firmware securing your bitcoin, creating random seeds and signing transactions, trusting closed source software that cannot be independently audited is just not good enough. In our opinion, you should not need to trust the manufacturer of your hardware wallet (and all its individual employees) to belong to the “good guys”, diligently finding their own bugs without independent reviews and then actually fixing them.

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
