---
title: "Coldcard Mk3"
appId: ColdCardMk3
authors:
- kiwilamb
- leo
released: 2018-04-01
discontinued: # date
latestUpdate: 
version: 
dimensions: [88, 51, 9]
weight: 30
website: https://coinkite.com/
shop: https://store.coinkite.com/store/coldcard
country: CA
price: 119USD
repository: https://github.com/Coldcard/firmware
issue: https://twitter.com/LeoWandersleb/status/1425907273029857281
icon: ColdCardMk3.png
bugbounty: 
verdict: nonverifiable
date: 2021-08-12
signer: 
reviewArchive:


providerTwitter: COLDCARDwallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 
---

The provider makes clear claims:

> **COLDCARD Hardware Wallet**<br>
  ✓ Bitcoin Only<br>
  ✓ Open-Source<br>
  ✓ Easy-to-Use<br>
  ✓ Ultra-Secure<br>
  ✓ Loved by Cypherpunks

and on [their repository: Reproducible Builds](https://github.com/Coldcard/firmware#reproducible-builds):

> To have confidence this source code tree is the same as the binary on your
  device, you can rebuild it from source and get **exactly the same bytes**.

Also the product is packed with security features, some unique to the
{{ page.title }}.

An anti-feature we would like to know why it's actually a feature is

> Because of the in-depth use of the secure element, there is no "factory reset"
  for the Coldcard. If you forget your Coldcard PIN, there is nothing we can do
  except remind you to recycle your e-waste responsibly!

meaning that if you ever forget your PIN even if you have your seed phrase, your
device is worthless. To our knowledge, no other device works like this and we
see no good reason why this could be advantageous to the user or more secure.

The "secure element" comes with another implication: Code run on the
"secure element" usually cannot be audited. "Secure element" providers require
NDAs and closed source from the users. As we've seen with
{% include walletLink.html wallet='hardware/bitBox2' verdict='true' %}, this
doesn't need to be to the detriment of the product's security: If the security
doesn't rely on the "secure element" but only uses it supplementary, the product
can benefit from added security without putting funds at risk if the "secure
element" is evil.

It turns out a bit hard to find what aspects {{ page.title }} delegates to the
"secure element". Is there a single point of failure?
**Is the masterseed by default generated with entropy solely from the "secure element"?**
If so, the closed source secure element might  be generating backups from poor
randomness that are trivial to recreate by the manufacturer of the chip. *This
would put the product as a whole into our "closed source" category!*

Surprisingly there is no public issue tracker on
[their firmware repository](https://github.com/Coldcard/firmware) neither.
Let's see if we get a reply to
[our question on Twitter](https://twitter.com/LeoWandersleb/status/1425907273029857281).

## Reproducing The Firmware

So the complete [section on Reproducible Builds](https://github.com/Coldcard/firmware#reproducible-builds) is:

> To have confidence this source code tree is the same as the binary on your device,
> you can rebuild it from source and get **exactly the same bytes**. This process
> has been automated using Docker. Steps are as follows:
> 
> 1. Install Docker and start it.
> 2. Install [make (GNUMake)](https://www.gnu.org/software/make/) if you don't already have it.
> 3. Checkout the code, and start the process.
>    ```
>    git clone https://github.com/Coldcard/firmware.git
>    cd firmware/stm32
>    make repro
>    ```
> 4. At the end of the process a clear confirmation message is shown, or the differences.
> 5. Build products can be found `firmware/stm32/built`.

Let's see ... we have docker installed and running aka "started" and make is
available, too. Let's see what `make repro` would run on our machine first:

```
$ git clone https://github.com/Coldcard/firmware.git; cd firmware/stm32
$ cat Makefile 
# (c) Copyright 2018 by Coinkite Inc. This file is covered by license found in COPYING-CC.
#
# Build micropython for stm32 (an ARM processor). Also handles signing of resulting firmware images.
#
MPY_TOP = ../external/micropython
PORT_TOP = $(MPY_TOP)/ports/stm32
MPY_CROSS = $(MPY_TOP)/mpy-cross/mpy-cross
PYTHON_MAKE_DFU = $(MPY_TOP)/tools/dfu.py
PYTHON_DO_DFU = $(MPY_TOP)/tools/pydfu.py

# aka ../cli/signit.py
SIGNIT = signit

MAKE_ARGS = BOARD=COLDCARD -j 4 EXCLUDE_NGU_TESTS=1

all: COLDCARD/file_time.c
	cd $(PORT_TOP) && $(MAKE) $(MAKE_ARGS)

clean:
	cd $(PORT_TOP) && $(MAKE) $(MAKE_ARGS) clean
	git clean -xf built

# These trigger the 'all' target when we haven't completed a successful build yet
l-port/build-COLDCARD/firmware.elf: all
l-port/build-COLDCARD/firmware0.bin: all
l-port/build-COLDCARD/firmware1.bin: all

firmware.elf: l-port/build-COLDCARD/firmware.elf
	cp l-port/build-COLDCARD/firmware.elf .

# These values used to make .DFU files. Flash memory locations.
FIRMWARE_BASE   = 0x08008000
BOOTLOADER_BASE = 0x08000000
FILESYSTEM_BASE = 0x080e0000

# Our version for this release.
VERSION_STRING = 4.1.2

#
# Sign and merge various parts
#
firmware-signed.bin: l-port/build-COLDCARD/firmware0.bin l-port/build-COLDCARD/firmware1.bin
	$(SIGNIT) sign $(VERSION_STRING) -o $@
firmware-signed.dfu: firmware-signed.bin Makefile
	$(PYTHON_MAKE_DFU) -b $(FIRMWARE_BASE):$< $@

# make the DFU file which is shared for upgrades
dfu: firmware-signed.dfu

# Build a binary, signed w/ production key
# - always rebuild binary for this one
.PHONY: dev.dfu
dev.dfu: l-port/build-COLDCARD/firmware?.bin
	cd $(PORT_TOP) && $(MAKE) $(MAKE_ARGS)
	$(SIGNIT) sign $(VERSION_STRING) -k 1 -o dev.bin
	$(PYTHON_MAKE_DFU) -b $(FIRMWARE_BASE):dev.bin dev.dfu

.PHONY: remake
remake:
	rm -rf l-port/build-COLDCARD/firmware?.bin l-port/build-COLDCARD/frozen_mpy*

# This is fast for Coinkite devs, but no DFU support in the wild.
up: dev.dfu
	$(PYTHON_DO_DFU) -u dev.dfu

# Slow, but works with unmod-ed board: use USB protocol to upgrade (2 minutes)
dev: dev.dfu
	ckcc upgrade dev.dfu

COLDCARD/file_time.c: Makefile make_filetime.py
	./make_filetime.py COLDCARD/file_time.c $(VERSION_STRING)

# Make a factory release: using key #1
# - when executed in a repro w/o the required key, it defaults to key zero
# - and that's what happens inside the Docker build
production.bin: firmware-signed.bin Makefile
	$(SIGNIT) sign $(VERSION_STRING) -r firmware-signed.bin -k 1 -o $@

# This is release of the bootloader that will be built into the release firmware.
BOOTLOADER_VERSION = 2.0.1

.PHONY: release
release: code-committed
	$(MAKE) clean
	$(MAKE) repro
	test -f built/production.bin
	$(MAKE) release-products
	$(MAKE) tag-source

# Make a release-candidate, faster.
.PHONY: rc1
rc1: 
	$(MAKE) repro
	test -f built/production.bin
	$(MAKE) release-products

# This target just combines latest version of production firmware with bootrom into a DFU
# file, stored in ../releases with appropriately dated file name.
.PHONY: release-products
release-products: NEW_VERSION = $(shell $(SIGNIT) version built/production.bin)
release-products: RELEASE_FNAME = ../releases/$(NEW_VERSION)-coldcard.dfu
release-products: built/production.bin
	test ! -f $(RELEASE_FNAME)
	cp built/file_time.c COLDCARD/file_time.c
	-git commit COLDCARD/file_time.c -m "For $(NEW_VERSION)"
	$(SIGNIT) sign $(VERSION_STRING) -r built/production.bin -k 1 -o built/production.bin
	$(PYTHON_MAKE_DFU) -b $(FIRMWARE_BASE):built/production.bin \
		-b $(BOOTLOADER_BASE):bootloader/releases/$(BOOTLOADER_VERSION)/bootloader.bin \
		$(RELEASE_FNAME)
	@echo
	@echo 'Made release: ' $(RELEASE_FNAME)
	@echo

built/production.bin:
	@echo "To make production build, must run docker code"
	@false

# Use DFU to install the latest production version you have on hand
dfu-latest: 
	$(PYTHON_DO_DFU) -u `ls -t1 ../releases/*.dfu | head -1`

# Use slow USB upload and reboot method.
latest:
	ckcc upgrade `ls -t1 ../releases/*.dfu | head -1`

.PHONY: code-committed
code-committed:
	@echo ""
	@echo "Are all changes commited already?"
	git diff --stat --exit-code .
	@echo '... yes'

# Sign a message with the contents of ../releases on the developer's machine
.PHONY: sign-release
sign-release:
	(cd ../releases; shasum -a 256 *.dfu *.md | sort -rk 2 | \
		gpg --clearsign -u A3A31BAD5A2A5B10 --digest-algo SHA256 --output signatures.txt --yes - )
	git commit -m "Signed for release." ../releases/signatures.txt

# Tag source code associate with built release version.
# - do "make release" before this step!
# - also edit/commit ChangeLog text too
# - update & sign signatures file
# - and tag everything
tag-source: PUBLIC_VERSION = $(shell $(SIGNIT) version built/production.bin)
tag-source: sign-release code-committed
	git commit  --allow-empty -am "New release: "$(PUBLIC_VERSION)
	echo "Taging version: " $(PUBLIC_VERSION)
	git tag -a $(PUBLIC_VERSION) -m "Release "$(PUBLIC_VERSION)
	git push
	git push --tags

# DFU file of boot and main code
# - bootloader is last so it can fail if already installed (maybe)
#
mostly.dfu: firmware-signed.bin bootloader/bootloader.bin Makefile
	$(PYTHON_MAKE_DFU) \
			-b $(FIRMWARE_BASE):firmware-signed.bin \
			-b $(BOOTLOADER_BASE):bootloader/bootloader.bin $@

# send everything
m-dfu: mostly.dfu
	$(PYTHON_DO_DFU) -u mostly.dfu

# Clear the internal filesystem (for dev-mistakes recovery)
# - unused?
.PHONY: wipe-fs
wipe-fs: 
	dd if=/dev/urandom of=tmp.bin bs=512 count=1
	$(PYTHON_MAKE_DFU) -b $(FILESYSTEM_BASE):tmp.bin tmp.dfu
	$(PYTHON_DO_DFU) -u tmp.dfu
	rm tmp.bin tmp.dfu

# unused
stlink:
	cd $(PORT_TOP) && $(MAKE) $(MAKE_ARGS) deploy-stlink

# useless, will be ignored by bootloader
unsigned-dfu:
	cd $(PORT_TOP) && $(MAKE) $(MAKE_ARGS) deploy

# see COLDCARD/mpconfigboard.mk
tags: 
	cd $(PORT_TOP) && $(MAKE) $(MAKE_ARGS) tags
checksum: 
	cd $(PORT_TOP) && $(MAKE) $(MAKE_ARGS) checksum
files:
	cd $(PORT_TOP) && $(MAKE) $(MAKE_ARGS) files

# OLD dev junk?
# compile and freeze python code
PY_FILES = $(shell find ../shared -name \*.py)
ALL_MPY_FILES = $(addprefix build/, $(PY_FILES:../shared/%.py=%.mpy))
MPY_FILES = $(filter-out build/obsolete/%, $(ALL_MPY_FILES))

# In another window: 
#
#		openocd -f openocd_stm32l4x6.cfg
#
# Can do:
# - "load" which writes the flash (medium speed, lots of output on st-util)
# - "cont" starts/continues system
# - "br main" sets breakpoints
# - "mon reset" to reset micro
# - and so on
#
debug:
	arm-none-eabi-gdb built/firmware.elf -x gogo.gdb

# detailed listing, very handy
OBJDUMP = arm-none-eabi-objdump
firmware.lss: l-port/build-COLDCARD/firmware.elf
	$(OBJDUMP) -h -S $< > $@

# Dump sizes of all frozen py files; requires recent build.
.PHONY: sizes
sizes:
	wc -c l-port/build-COLDCARD/frozen_mpy/*.mpy | sort -n

# Measure flash impact of a single file. Great for before/after.
# 	make F=foo.py size
# where: foo.py is anything in ../shared
size:
	$(MPY_CROSS) -o tmp.mpy -s $F ../shared/$F
	wc -c tmp.mpy

# one time setup, after repo checkout
setup:
	cd $(MPY_TOP) ; git submodule update --init lib/stm32lib
	cd $(MPY_TOP)/lib/stm32lib ; sed -i.orig -e 's/#define VECT_TAB_OFFSET  0x00/    /' \
				CMSIS/STM32L4xx/Source/Templates/system_stm32l4xx.c
	cd ../external/libngu; make min-one-time
	cd $(MPY_TOP)/mpy-cross ; make
	-ln -s $(PORT_TOP) l-port
	-ln -s $(MPY_TOP) l-mpy
	cd $(PORT_TOP)/boards; if [ ! -L COLDCARD ]; then \
		ln -s ../../../../../stm32/COLDCARD COLDCARD; fi
	

# Caution: docker container has read access to your source tree
# - a readonly copy of source tree, and one output directory
# - build products are copied to there, see repro-build.sh
# - works from this repo, but starts with copy of HEAD
DOCK_RUN_ARGS = -v $(realpath ..):/work/src:ro \
				-v $(realpath built):/work/built:rw \
				--privileged coldcard-build
repro: code-committed
	docker build -t coldcard-build - < dockerfile.build
	(cd ..; docker run $(DOCK_RUN_ARGS) sh src/stm32/repro-build.sh)

# debug: shell into docker container
shell:
	docker run -it $(DOCK_RUN_ARGS) sh

# debug: allow docker to write into source tree
#DOCK_RUN_ARGS := -v $(realpath ..):/work/src:rw --privileged coldcard-build

PUBLISHED_BIN = $(wildcard ../releases/*-v$(VERSION_STRING)-coldcard.dfu)

# final step in repro-building: check you got the right bytes
# - but you don't have the production signing key, so that section is removed
check-repro: TRIM_SIG = sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/'
check-repro: firmware-signed.bin
ifeq ($(PUBLISHED_BIN),)
	@echo ""
	@echo "Need published binary for: $(VERSION_STRING)"
	@echo ""
	@echo "Copy it into ../releases"
	@echo ""
else
	@echo Comparing against: $(PUBLISHED_BIN)
	test -n "$(PUBLISHED_BIN)" -a -f $(PUBLISHED_BIN)
	$(RM) -f check-fw.bin check-bootrom.bin
	$(SIGNIT) split $(PUBLISHED_BIN) check-fw.bin check-bootrom.bin
	$(SIGNIT) check check-fw.bin
	$(SIGNIT) check firmware-signed.bin
	hexdump -C firmware-signed.bin | $(TRIM_SIG) > repro-got.txt
	hexdump -C check-fw.bin | $(TRIM_SIG) > repro-want.txt
	diff repro-got.txt repro-want.txt
	@echo ""
	@echo "SUCCESS. "
	@echo ""
	@echo "You have built a bit-for-bit identical copy of Coldcard firmware for v$(VERSION_STRING)"
endif


# EOF
```

which is a scary lot of stuff we are supposed to run on our machine instead of
in a sandbox but it all boils down to those few lines:

```
DOCK_RUN_ARGS = -v $(realpath ..):/work/src:ro \
				-v $(realpath built):/work/built:rw \
				--privileged coldcard-build
	docker build -t coldcard-build - < dockerfile.build
	(cd ..; docker run $(DOCK_RUN_ARGS) sh src/stm32/repro-build.sh)
```

Let's see ...

```
$ docker build --tag coldcard-build - < dockerfile.build
$ DOCK_RUN_ARGS="--volume=$(realpath ..):/work/src:ro --volume=$(realpath built):/work/built:rw --privileged coldcard-build"
$ (cd ..; docker run --rm $DOCK_RUN_ARGS sh src/stm32/repro-build.sh)
...
Need published binary for: 4.1.2

Copy it into ../releases
```

Ok, that did something and as the latest commit looks like it's tagged with the
latest release `v4.1.2`:

```
$ git log -n 1
commit 4f69140ded9168b6a372a37540554e9099e065af (HEAD -> master, tag: 2021-07-28T1347-v4.1.2, origin/master, origin/HEAD)
Author: Peter D. Gray <peter@conalgo.com>
Date:   Wed Jul 28 09:47:37 2021 -0400

    New release: 2021-07-28T1347-v4.1.2
```

we are supposed to re-run this with the published binary in `../releases` ...
relative to where? There is a `../releases` aka `repositoryFolder/releases`  but
there we get the same issue:

```
$ wget https://coldcardwallet.com/downloads/2021-07-28T1347-v4.1.2-coldcard.dfu
$ sha256sum 2021-07-28T1347-v4.1.2-coldcard.dfu 
d01d81305b209dadcf960b9e9d20affb8d4f11e9f9f916c5a06be29298c80dc2  2021-07-28T1347-v4.1.2-coldcard.dfu
$ mv 2021-07-28T1347-v4.1.2-coldcard.dfu ../releases/
$ (cd ..; docker run --rm $DOCK_RUN_ARGS sh src/stm32/repro-build.sh)
...
Need published binary for: 4.1.2

Copy it into ../releases
```

So just to be safe this is not an issue with the shortcut we took by not running
`make repro` and neither an issue with `../releases/` referring to a folder
further up in the hierarchy, we tried with `make repro`, with
`2021-07-28T1347-v4.1.2-coldcard.dfu` in both the existing `firmware/releases`
and a new `firmware/../releases` to no avail. For now, this firmware is
**not verifiable**.
