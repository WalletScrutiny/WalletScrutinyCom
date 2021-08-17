---
title: "Foundation Passport"
appId: passport
authors:
- kiwilamb
- leo
released: 2020-07-01
discontinued: # date
updated: 2021-08-06
version: v1.0.6
dimensions: [38, 102, 23]
weight: 138
website: https://foundationdevices.com/
shop: https://foundationdevices.com/product/passport/
country: US
price: 299USD
repository: https://github.com/Foundation-Devices/passport-firmware
issue: https://github.com/Foundation-Devices/passport-firmware/issues/40
icon: passport.png
bugbounty: https://foundationdevices.com/security/
verdict: reproducible
date: 2021-08-17
signer: 
reviewArchive:
- date: 2021-08-14
  version: "v1.0.6"
  appHash: 
  gitRevision: a5741b20061b346243b755b1b61237b2b9cfb955
  verdict: nonverifiable
  

providerTwitter: FOUNDATIONdvcs
providerLinkedIn: foundationdevices
providerFacebook: 
providerReddit: 
---

**Update 2021-08-17**: The provider
[helped with compile issues](https://github.com/Foundation-Devices/passport-firmware/issues/40#issuecomment-898810938)
and we managed to compile, too. See below the updated analysis.

This device has all the interfaces to verify transactions (screen, buttons) and
on their website the provider claims:

> **Open Source**<br>
  The best security is through openness, not secrecy. Passport is proudly
  open source – all software, electrical, and mechanical components are open and
  auditable. There is no hidden code or restricted information. You can even
  build a Passport yourself, from scratch!

Its firmware originally
[appears to have been a fork](https://github.com/Foundation-Devices/passport-firmware#open-source-components)
of the {% include walletLink.html wallet='hardware/ColdCardMk3' verdict='true' %}
firmware:

> * [Coldcard Firmware](https://github.com/Coldcard/firmware) - Passport's
  security model has a lot in common with Coldcard, and the Passport firmware
  was originally based directly on the ColdCard repository. As development
  progressed, however, we chose to follow MicroPython best practices and start
  with a fresh MicroPython repository. We've ported numerous files from Coldcard
  as needed, and we thank them for their great contribution to open source.

On [their security page](https://foundationdevices.com/security/) the provider
claims to provide a bug bounty program and to have been audited by Keylabs.

There is no direct claim of reproducibility of the firmware. We will try it out
anyway ...

Their [Support Page](https://support.foundationdevices.com/) has two links to
their firmware's binary download `v1.0.6`. Both links point to the
[GitHub release download](https://github.com/Foundation-Devices/passport-firmware/releases/download/v1.0.6/passport-fw-1.0.6.bin).

On [their GitHub Releases page](https://github.com/Foundation-Devices/passport-firmware/releases)
there are a total of 8 versions of which `v1.0.6` is the latest. We will go with
this.

```
leo@codex:/tmp$ wget https://github.com/Foundation-Devices/passport-firmware/releases/download/v1.0.6/passport-fw-1.0.6.bin
leo@codex:/tmp$ sha256sum passport-fw-1.0.6.bin ; echo 606ca7ce1ba136988a36b445b2dae97508fbed062a8fdfa02f13ada69b6e92cd
606ca7ce1ba136988a36b445b2dae97508fbed062a8fdfa02f13ada69b6e92cd  passport-fw-1.0.6.bin
606ca7ce1ba136988a36b445b2dae97508fbed062a8fdfa02f13ada69b6e92cd
$ git clone https://github.com/Foundation-Devices/passport-firmware.git
$ cd passport-firmware/
$ git checkout v1.0.6
```

Now the [Build Instructions](https://github.com/Foundation-Devices/passport-firmware/blob/main/DEVELOPMENT.md#building)
read:

> **Building the Main Firmare**<br>
  In one shell, make sure that you cd to the root stm32 source folder, e.g., cd ~/passport/ports/stm32:
  
  ```
  make BOARD=Passport
  ```

We'll do that in a container to have a better defined environment, as per
updated build instructions using Ubuntu 18.04:

```
$ mkdir passport
$ cd passport
$ docker run --rm -it --volume=$(pwd):/work/ ubuntu:18.04 bash -c   "apt update; \
    apt install --yes git python3-pip gcc-arm-none-eabi autotools-dev automake libusb-1.0-0-dev libtool; \
    git clone https://github.com/Foundation-Devices/passport-firmware.git; \
    cd passport-firmware; \
    git checkout v1.0.6; \
    make -C mpy-cross; \
    cd ports/stm32/; \
    make BOARD=Passport; \
    sha256sum build-Passport/firmware.bin;echo ab485dcf3a5f803b5649b84d864a2945c5b0191c67de32a7bbe6b85301b2cfab; \
    mv build-Passport/firmware.bin /work/firmware-passport-v1.0.6.bin; \
    bash"
...
ab485dcf3a5f803b5649b84d864a2945c5b0191c67de32a7bbe6b85301b2cfab  build-Passport/firmware.bin
ab485dcf3a5f803b5649b84d864a2945c5b0191c67de32a7bbe6b85301b2cfab
```

so that is the same hash the provider reported on
[this issue](https://github.com/Foundation-Devices/passport-firmware/issues/40#issuecomment-898855516)
but what about the official, signed binary?

Downloaded from the
[GitHub Releases](https://github.com/Foundation-Devices/passport-firmware/releases)
we get:

```
$ wget https://github.com/Foundation-Devices/passport-firmware/releases/download/v1.0.6/passport-fw-1.0.6.bin
$ sha256sum passport-fw-1.0.6.bin 
606ca7ce1ba136988a36b445b2dae97508fbed062a8fdfa02f13ada69b6e92cd  passport-fw-1.0.6.bin
```

which is not what we got above but it is supposedly signed with two of four
possible valid keys.

How do we strip that, to get the hash we got from our build?

```
$ hexdump -v -e '/1 "%02x\n"' passport-fw-1.0.6.bin > passport-fw-1.0.6.txt
$ hexdump -v -e '/1 "%02x\n"' firmware-passport-v1.0.6.bin > firmware-passport-v1.0.6.txt
$ diff *.txt
0a1,2048
> 53
> 53
> 41
> 50
> 8d
> b6
> 0d
> 61
> 41
> 75
> 67
> 20
> 30
> 36
> 2c
> 20
> 32
> 30
> 32
> 31
> 00
> 00
> 31
> 2e
> 30
> 2e
> 36
> 00
> 00
> 00
> 7c
> 6f
> 12
> 00
> 02
> 00
> 00
> 00
> 40
> 11
> 8e
> d2
> 23
> 26
> 42
> 79
> 2b
> d9
> ca
> f9
> ad
> 48
> bc
> 89
> 5e
> a7
> d9
> d6
> a5
> 52
> 43
> 1c
> b6
> 43
> 79
> 34
> aa
> d8
> ce
> 74
> a9
> 72
> 26
> 7b
> 1c
> a3
> 0b
> fe
> 97
> b0
> 18
> 0d
> ce
> 48
> 82
> 89
> 0d
> e3
> b3
> 8b
> e0
> 9c
> af
> 40
> 10
> 72
> 9e
> ab
> b0
> 56
> 60
> 1a
> 00
> 00
> 00
> 00
> 74
> 14
> b3
> ff
> 2c
> e8
> 1a
> 09
> 9c
> 43
> 22
> bb
> c8
> da
> 38
> 27
> ad
> b8
> 10
> e9
> 30
> 26
> 1a
> 33
> 25
> 06
> b2
> da
> c9
> 06
> 93
> 6b
> 6d
> 73
> cb
> 87
> ff
> 9b
> b6
> e3
> ad
> 2a
> 28
> 3a
> 1a
> cb
> 12
> 3c
> 23
> 1f
> 05
> 59
> 2f
> 77
> b4
> c9
> 27
> dc
> 76
> 9f
> 2d
> 18
> 96
> bd
> 00
> 00
> 00
> 00
> 00
> 00
> 00
...
```

followed by many more `00`. So we have some data in the first 170 bytes,
followed by zeros to fill 2048 bytes and the rest matches. And indeed, here is
our hash from before:

```
$ tail -c +2049 passport-fw-1.0.6.bin | sha256sum ; \
    sha256sum firmware-passport-v1.0.6.bin; \
    echo ab485dcf3a5f803b5649b84d864a2945c5b0191c67de32a7bbe6b85301b2cfab
ab485dcf3a5f803b5649b84d864a2945c5b0191c67de32a7bbe6b85301b2cfab  -
ab485dcf3a5f803b5649b84d864a2945c5b0191c67de32a7bbe6b85301b2cfab  firmware-passport-v1.0.6.bin
ab485dcf3a5f803b5649b84d864a2945c5b0191c67de32a7bbe6b85301b2cfab
```

As with other hardware wallets, we did not check if those first 170 bytes are
actually signatures or valid but leave that to actual code reviews: If the code
of the hardware wallet does what is claimed, it interprets those 170 bytes as
signatures and checks them. In other words, if the public source code is secure,
then the link with the binary is established. This product is **reproducible**.
