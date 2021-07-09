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

... [clarity came in within 9h](https://github.com/digitalbitbox/bitbox02-firmware/issues/762#issuecomment-875448905):

> As for the hash shown in the release notes, please check this documentation:
> 
> [master/releases#verify-the-hash-as-shown-by-the-bitbox02-at-startup](https://github.com/digitalbitbox/bitbox02-firmware/tree/master/releases#verify-the-hash-as-shown-by-the-bitbox02-at-startup)
> 
> In summary, the hash you are seeing is the sha256d(<version><padded firmware>), and there is a small, easy to audit tool in the same folder to help reproduce it:
> 
> [master/releases/describe_signed_firmware.py](https://github.com/digitalbitbox/bitbox02-firmware/blob/master/releases/describe_signed_firmware.py)

So after reading the python script, this is what's going on:

We have to take the `firmware-btc.v9.6.0.signed.bin`, append as many binary `1`s
as fit into the maximum firmware size of ...

```
$ cat py/bitbox02/bitbox02/bitbox02/bootloader.py | grep MAX_FIRMWARE_SIZE
MAX_FIRMWARE_SIZE = 884736  # 928kB - 64kB
assert MAX_FIRMWARE_SIZE % CHUNK_SIZE == 0
FIRMWARE_CHUNKS = MAX_FIRMWARE_SIZE // CHUNK_SIZE
        empty_firmware = struct.pack("<I", firmware_v) + b"\xFF" * MAX_FIRMWARE_SIZE
```

884736 bytes.

*That tool is not "small, easy to audit" as it pulls in
`bitbox02.bitbox02.bootloader` which on the other hand is probably pretty well
scrutinized. We'll try to verify the hash without python anyway.*

```
$ wc -c firmware-btc.v9.6.0.signed.bin 
461816 firmware-btc.v9.6.0.signed.bin
$ echo $(( 884736 - 461816 ))
422920
$ cp firmware-btc.v9.6.0.signed.bin padded.bin
$ dd if=/dev/zero ibs=1 count=422920 | tr "\000" "\377" >> padded.bin 
$ wc -c padded.bin 
884736 padded.bin
```

No the `sha256d(<version><padded firmware>)` only misses the `version` part.

From the python script:

```
...
from bitbox02.bitbox02.bootloader import (
        parse_signed_firmware,
...
magic, sigdata, firmware = parse_signed_firmware(binary)
...
version = sigdata[SIGNING_PUBKEYS_DATA_LEN:][:4]
print(
  hashlib.sha256(hashlib.sha256(version + firmware_padded).digest()).hexdigest()
)
```

At this point this point we are a bit stuck. What is `version` here? Lets see if
the "small, easy to audit tool" can help:

```
$ podman run --volume $(pwd):/x --rm -it python bash
# cd /x/py/bitbox02/
# pip3 install .
# ../../releases/describe_signed_firmware.py ../../firmware-btc.v9.6.0.signed.bin 
The following information assumes the provided binary was signed correctly; the signatures are not being verified.
This is a Bitcoin-only edition firmware.
The hash of the unsigned firmware binary is (compare with reproducible build):
3a39395f04cbdfae3357efbb24a0c5f7fc9ce69bc505bfc545cb49dab76b4d46
The monotonic firmware version is: 22
The hash of the firmware as verified/shown by the bootloader is:
e788644ec86c63c193e13a1b6cfbdda359b7117dc38090c794e1c6aea69f601f
```

So their script gets the correct hash but we'd still love to get this with bash,
only, to not have to trust their tools.

```
# python
Python 3.9.6 (default, Jun 29 2021, 19:18:53) 
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys
>>> from bitbox02.bitbox02.bootloader import (parse_signed_firmware, SIGNING_PUBKEYS_DATA_LEN)
>>> with open("../../firmware-btc.v9.6.0.signed.bin", "rb") as fileobj:
...     binary = fileobj.read()
... 
>>> magic, sigdata, firmware = parse_signed_firmware(binary)
>>> version = sigdata[SIGNING_PUBKEYS_DATA_LEN:][:4]
>>> print(version)
b'\x16\x00\x00\x00'
```

So ... how to do this in bash now? `sha256(sha256(b'\x16\x00\x00\x00' + firmware + padding))`?

According to
[this blog post](https://btcleak.com/2020/06/10/double-sha256-in-bash-and-python/),
the double-sha256 hashing would be done using `| sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64`

```
$ printf '\x16\x00\x00\x00' > version.bin
$ cat version.bin padded.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64
d8700da73fe3edcb5a0772115bf22a8e7490c1002d0d7e108346460c129bde0a
```

which is not the hash
`e788644ec86c63c193e13a1b6cfbdda359b7117dc38090c794e1c6aea69f601f` from the
release notes.

Let's see if we are hashing the correct thing by first storing what their python
script hashes to a new file and then comparing that with what we try to hash:

```
$ cat releases/describe_signed_firmware.py
...
    print(
        hashlib.sha256(hashlib.sha256(version + firmware_padded).digest()).hexdigest()
    )
    with open("version_firmware_padding.bin", "wb") as fileobj:
        fileobj.write(version + firmware_padded)
...
$ podman run --volume $(pwd):/x --rm -it python bash
# cd /x/py/bitbox02/
# pip3 install .
# ../../releases/describe_signed_firmware.py ../../firmware-btc.v9.6.0.signed.bin
The following information assumes the provided binary was signed correctly; the signatures are not being verified.
This is a Bitcoin-only edition firmware.
The hash of the unsigned firmware binary is (compare with reproducible build):
3a39395f04cbdfae3357efbb24a0c5f7fc9ce69bc505bfc545cb49dab76b4d46
The monotonic firmware version is: 22
The hash of the firmware as verified/shown by the bootloader is:
e788644ec86c63c193e13a1b6cfbdda359b7117dc38090c794e1c6aea69f601f
# mv version_firmware_padding.bin ../..
# exit
$ cat version.bin padded.bin > version_firmware_padding_bash.bin 
leo@codex:/tmp/bitbox02-firmware(master)$ sha256sum version_*
ffc4b8ce0bbbf7976a94b6011e85f0c3c5803fd205e261f00594841ad09d9328  version_firmware_padding_bash.bin
ef87d59dec47f7e2379828ee4737f66d57ad4ccf0a8d47177bb1b1a179388427  version_firmware_padding.bin
```

so we are not hashing the same as their python script. What's the diff between
the two?

```
$ cmp --verbose version_firmware_padding*.bin | head
     5  21 140
     6  43 306
     7  73   1
     8  13  40
     9   1  11
    10   0 235
    11   0   2
    13 376 371
    14   1 234
    15 113   2
```

well, the first 4 bytes are the version bytes. Apparently we got those right.
The rest ... ok ... in hindsight the above was naive. The python script extracts
`firmware` but also `magic` and `sigdata`:

```
magic, sigdata, firmware = parse_signed_firmware(binary)
```

and only hashes `version` which is part of `sigdata`, `firmware` and `padding`
so to extract `firmware` from `firmware-btc.v9.6.0.signed.bin` we need to look
into `parse_signed_firmware()`:

```
NUM_ROOT_KEYS = 3
NUM_SIGNING_KEYS = 3

SIGDATA_MAGIC_STANDARD = struct.pack(">I", 0x653F362B)
SIGDATA_MAGIC_BTCONLY = struct.pack(">I", 0x11233B0B)
SIGDATA_MAGIC_BITBOXBASE_STANDARD = struct.pack(">I", 0xAB6BD345)

MAGIC_LEN = 4

VERSION_LEN = 4
SIGNING_PUBKEYS_DATA_LEN = VERSION_LEN + NUM_SIGNING_KEYS * 64 + NUM_ROOT_KEYS * 64
FIRMWARE_DATA_LEN = VERSION_LEN + NUM_SIGNING_KEYS * 64
SIGDATA_LEN = SIGNING_PUBKEYS_DATA_LEN + FIRMWARE_DATA_LEN

def parse_signed_firmware(firmware: bytes) -> typing.Tuple[bytes, bytes, bytes]:
    """
    Split raw firmware bytes into magic, sigdata and firmware
    """

    if len(firmware) < MAGIC_LEN + SIGDATA_LEN:
        raise ValueError("firmware too small")
    magic, firmware = firmware[:MAGIC_LEN], firmware[MAGIC_LEN:]
    if magic not in (
        SIGDATA_MAGIC_STANDARD,
        SIGDATA_MAGIC_BTCONLY,
        SIGDATA_MAGIC_BITBOXBASE_STANDARD,
    ):
        raise ValueError("invalid magic")

    sigdata, firmware = firmware[:SIGDATA_LEN], firmware[SIGDATA_LEN:]
    return magic, sigdata, firmware
```

Ok, this is getting way more involved than we had planned. In the above function
`firmware` gets redefined several times. As function parameter, it's the content
of the file we want to check: `firmware-btc.v9.6.0.signed.bin`. Then the 4
`magic` bytes get chopped off at the beginning and then the `SIGDATA_LEN` bytes
which itself contains 4 version bytes twice, 3 64 byte signing keys twice and 3
64 byte root keys.

As mentioned above, this script is **not** "small, easy to audit", mainly
because the first script reliese on this second script which again imports
further dependencies:

```
import struct
import typing
import io
import math
import hashlib

from bitbox02.communication import TransportLayer
from bitbox02.communication.devices import DeviceInfo
```

so to understand if the verification code is benign, we would have to also audit
`TransportLayer` and `DeviceInfo` and their dependencies. After all python
allows [MonkeyPatching](https://en.wikipedia.org/wiki/Monkey_patch#Examples)
dependencies, which allows any dependency to mess with this "small, easy to
audit" function(s).

To have all bytes accounted for, we need a secondary implementation and probably
will finish what was started above in bash. Signatures should be valid
signatures, magic bytes should match etc. For now this is still work in
progress.
