---
title: "Foundation Passport"
appId: passport
authors:
- kiwilamb
- leo
released: 2020-07-01
discontinued: # date
latestUpdate: 2021-08-06
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
verdict: nonverifiable
date: 2021-08-14
signer: 
reviewArchive:


providerTwitter: FOUNDATIONdvcs
providerLinkedIn: foundationdevices
providerFacebook: 
providerReddit: 
---

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

We'll do that in a container to have a better defined environment:

```
$ docker run --rm -it --volume=$(pwd):/work/ --privileged ubuntu:20.04 bash
root@b36e920efbac:/# apt update
root@b36e920efbac:/# apt install --yes git python3-pip gcc-arm-none-eabi autotools-dev automake libusb-1.0-0-dev libtool
root@b36e920efbac:/# cd ~
root@b36e920efbac:~# git clone https://github.com/dhylands/rshell
root@b36e920efbac:~# pip3 install rshell
root@b36e920efbac:~# cd /work/
root@b36e920efbac:/work# make -C mpy-cross
root@b36e920efbac:/work# cd /work/ports/stm32/
root@b36e920efbac:/work/ports/stm32# make BOARD=Passport
...
boards/Passport/modtcc-codecs.c: In function 'modtcc_bech32_decode':
boards/Passport/modtcc-codecs.c:266:13: error: argument to variable-length array may be too large [-Werror=vla-larger-than=]
  266 |     uint8_t packed[tmp_len];
      |             ^~~~~~
cc1: all warnings being treated as errors
make: *** [../../py/mkrules.mk:47: build-Passport/boards/Passport/modtcc-codecs.o] Error 1
```

So on the first try, compiling the firmware failed. Like this, the firmware is
**not verifiable**.
