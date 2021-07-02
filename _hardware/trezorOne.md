---
title: "Trezor One"
appId: trezorOne
authors:
- leo
released: 2014-07-29
discontinued: # date
latestUpdate: 
version: 
dimensions: [60, 30, 6]
weight: 12
website: https://trezor.io
shop: https://shop.trezor.io/product/trezor-one-black
country: CZ
price: 49EUR
repository: https://github.com/trezor/trezor-firmware
issue: 
icon: trezorOne.png
bugbounty: 
verdict: wip # wip noita nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-06-30
signer: 
reviewArchive:


providerTwitter: trezor
providerLinkedIn: 
providerFacebook: trezor.io
providerReddit: TREZOR
---


This was the first hardware wallet and it's still being sold. The provider now
also offers {% include walletLink.html wallet='hardware/trezorT' verdict=true %}
and is working on [an open source secure element](https://tropicsquare.com/).

On the provider's [page on security](https://trezor.io/security/) we read:

> **Protected bootloader.**<br>
The bootloader is write protected and the JTAG is disabled, so an attacker
cannot replace it.

The bootloader is a tiny but critical part of any computer. Without one, no
higher functionality could be loaded. The device would have no way of knowing it
had a screen and buttons and storage ...

> **Firmware verification.**<br>
  The bootloader always verifies the firmware signature. The firmware is only
  run if correctly signed by SatoshiLabs. Otherwise, a warning is shown.

So in this case, the bootloader is tiny but knows about cryptography as it has
to verify the signature of the firmware and compare its signing key to the
provider's public keys that are hard-coded into the bootloader.

> **Secure update procedure.**<br>
  The bootloader erases the device memory if the firmware signature is invalid.
  Downgrade to a vulnerable version also wipes the memory.

We suppose, downgrading to any version - not only vulnerable ones - wipes the
memory.

The above properties ensure that only software approved by the provider can be
run on this device. It doesn't guarantee that this software is not stealing your
keys.

To our very surprise, the wallet's [main page](https://trezor.io/) has no easy
to find claims about the product being open source.

We [asked on Reddit](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/)
but somehow there really is no authoritative claim from the provider that the
device they sell follows this protocol:

1. The device comes without firmware[[1]](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/h3l44r2/)[[2]](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/h3l4oob/)
1. The firmware [can be downloaded](https://data.trezor.io/firmware/1/trezor-1.9.4.bin), [verified to match the source code](https://wiki.trezor.io/Developers_guide:Deterministic_firmware_build) and then deployed to your device on an air-gapped computer
1. The firmware checks the boot-loader for tampering. If you are sure to run
   a certain firmware (layout changed ...) you can be relatively sure that a
   rogue boot-loader would have been detected.

While the lack of a comprehensive "Security protocol for your Trezor One" is a
surprise, all the relevant information can be found and we can check the
software.

Please be aware that we only look at the software and the advertised properties
of the hardware. The hardware aspect makes it hard to make any claims about the
specific device you might be getting in your mail, which makes it hard to
eliminate the need for some level of trust. But let's see if we can reproduce
the current firmware version `1.9.4`:

```
$ wget https://data.trezor.io/firmware/1/trezor-1.9.4.bin
$ ls
trezor-1.9.4.bin
$ git clone https://github.com/trezor/trezor-firmware.git
$ cd trezor-firmware/
$ git checkout legacy/v1.9.4
$ cat build-docker.sh 
#!/usr/bin/env bash
set -e -o pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

CONTAINER_NAME=${CONTAINER_NAME:-trezor-firmware-env.nix}
ALPINE_CDN=${ALPINE_CDN:-http://dl-cdn.alpinelinux.org/alpine}
ALPINE_RELEASE=${ALPINE_RELEASE:-3.12}
ALPINE_ARCH=${ALPINE_ARCH:-x86_64}
ALPINE_VERSION=${ALPINE_VERSION:-3.12.3}
CONTAINER_FS_URL=${CONTAINER_FS_URL:-"$ALPINE_CDN/v$ALPINE_RELEASE/releases/$ALPINE_ARCH/alpine-minirootfs-$ALPINE_VERSION-$ALPINE_ARCH.tar.gz"}

TAG=${1:-master}
REPOSITORY=${2:-/local}
PRODUCTION=${PRODUCTION:-1}
MEMORY_PROTECT=${MEMORY_PROTECT:-1}

wget --no-config -nc -P ci/ "$CONTAINER_FS_URL"
docker build --build-arg ALPINE_VERSION="$ALPINE_VERSION" --build-arg ALPINE_ARCH="$ALPINE_ARCH" -t "$CONTAINER_NAME" ci/

# stat under macOS has slightly different cli interface
USER=$(stat -c "%u" . 2>/dev/null || stat -f "%u" .)
GROUP=$(stat -c "%g" . 2>/dev/null || stat -f "%g" .)

mkdir -p build/core build/legacy
mkdir -p build/core-bitcoinonly build/legacy-bitcoinonly

DIR=$(pwd)

# build core

for BITCOIN_ONLY in 0 1; do

  DIRSUFFIX=${BITCOIN_ONLY/1/-bitcoinonly}
  DIRSUFFIX=${DIRSUFFIX/0/}

  SCRIPT_NAME=".build_core_$BITCOIN_ONLY.sh"
  cat <<EOF > "build/$SCRIPT_NAME"
    # DO NOT MODIFY!
    # this file was generated by ${BASH_SOURCE[0]}
    # variant: core build BITCOIN_ONLY=$BITCOIN_ONLY
    set -e -o pipefail
    cd /tmp
    git clone "$REPOSITORY" trezor-firmware
    cd trezor-firmware/core
    ln -s /build build
    git checkout "$TAG"
    git submodule update --init --recursive
    poetry install
    poetry run make clean vendor build_firmware
    poetry run ../python/tools/firmware-fingerprint.py \
               -o build/firmware/firmware.bin.fingerprint \
               build/firmware/firmware.bin
    chown -R $USER:$GROUP /build
EOF

  docker run -it --rm \
    -v "$DIR:/local" \
    -v "$DIR/build/core$DIRSUFFIX":/build:z \
    --env BITCOIN_ONLY="$BITCOIN_ONLY" \
    --env PRODUCTION="$PRODUCTION" \
    --init \
    "$CONTAINER_NAME" \
    /nix/var/nix/profiles/default/bin/nix-shell --run "bash /local/build/$SCRIPT_NAME"
done

# build legacy

for BITCOIN_ONLY in 0 1; do

  DIRSUFFIX=${BITCOIN_ONLY/1/-bitcoinonly}
  DIRSUFFIX=${DIRSUFFIX/0/}

  SCRIPT_NAME=".build_legacy_$BITCOIN_ONLY.sh"
  cat <<EOF > "build/$SCRIPT_NAME"
    # DO NOT MODIFY!
    # this file was generated by ${BASH_SOURCE[0]}
    # variant: legacy build BITCOIN_ONLY=$BITCOIN_ONLY
    set -e -o pipefail
    cd /tmp
    git clone "$REPOSITORY" trezor-firmware
    cd trezor-firmware/legacy
    ln -s /build build
    git checkout "$TAG"
    git submodule update --init --recursive
    poetry install
    poetry run script/cibuild
    mkdir -p build/firmware
    cp firmware/trezor.bin build/firmware/firmware.bin
    cp firmware/trezor.elf build/firmware/firmware.elf
    poetry run ../python/tools/firmware-fingerprint.py \
               -o build/firmware/firmware.bin.fingerprint \
               build/firmware/firmware.bin
    chown -R $USER:$GROUP /build
EOF

  docker run -it --rm \
    -v "$DIR:/local" \
    -v "$DIR/build/legacy$DIRSUFFIX":/build:z \
    --env BITCOIN_ONLY="$BITCOIN_ONLY" \
    --env MEMORY_PROTECT="$MEMORY_PROTECT" \
    --init \
    "$CONTAINER_NAME" \
    /nix/var/nix/profiles/default/bin/nix-shell --run "bash /local/build/$SCRIPT_NAME"

done

# all built, show fingerprints

echo "Fingerprints:"
for VARIANT in core legacy; do
  for BITCOIN_ONLY in 0 1; do

    DIRSUFFIX=${BITCOIN_ONLY/1/-bitcoinonly}
    DIRSUFFIX=${DIRSUFFIX/0/}

    FWPATH=build/${VARIANT}${DIRSUFFIX}/firmware/firmware.bin
    FINGERPRINT=$(tr -d '\n' < $FWPATH.fingerprint)
    echo "$FINGERPRINT $FWPATH"
  done
done
```

That's a 200 lines of code script and we better understand what's going on.
After all this is supposed to be run on our PC.

So they want to use an `alpine:3.12.3` docker container to compile in but
instead of getting it from docker hub like so:

```
$ docker run --rm --interactive --tty alpine:3.12.3
Unable to find image 'alpine:3.12.3' locally
3.12.3: Pulling from library/alpine
801bfaa63ef2: Pull complete 
Digest: sha256:3c7497bf0c7af93428242d6176e8f7905f2201d8fc5861f45be7a346b5f23436
Status: Downloaded newer image for alpine:3.12.3
/ # 
```

they ... wget the image from `http://dl-cdn.alpinelinux.org/alpine`? That's a
bit confusing and might warrant a code comment.

Anyway, the script looks good. Let's see if it builds something:

```
$ bash build-docker.sh legacy/v1.9.4
...
python ../bootloader/firmware_sign.py -f trezor.bin
Firmware size 418700 bytes
Firmware fingerprint: 132a1d718936157fd0872380675e8a4cd1d48be65f809fd4ed2705b063608401
Slot #1 is empty
Slot #2 is empty
Slot #3 is empty
HASHES OK
make: Leaving directory '/tmp/trezor-firmware/legacy/firmware'
Fingerprints:
c0a6cacfed5c7a691314919c22307c29fbe9522071a9a28669769c014762d386 build/core/firmware/firmware.bin
53e7ee5bfc75cfa6412d8de5461b1ea8d9b7e10970ce7cadae9cbb1e17bbb77d build/core-bitcoinonly/firmware/firmware.bin
8b983590201bb5b91853c65423485a7bcffb0b8c91372b1e35f57c24126151c4 build/legacy/firmware/firmware.bin
132a1d718936157fd0872380675e8a4cd1d48be65f809fd4ed2705b063608401 build/legacy-bitcoinonly/firmware/firmware.bin
$ wget https://data.trezor.io/firmware/1/trezor-1.9.4.bin
$ sha256sum trezor-1.9.4.bin build/legacy/firmware/firmware.bin
c406a36aa83932f656caa5246e8a4383f426e4f970b11d86cad76ab95778a6ff  trezor-1.9.4.bin
ea3403f99093b5fc71907d2ded6af01bf66a67a881862629d96947550bdf711e  build/legacy/firmware/firmware.bin
```

That is not a match.

[The wiki explains](https://wiki.trezor.io/Developers_guide:Deterministic_firmware_build):

> The firmware headers have changed in firmware 1.8.0, so if you are building
  firmware >= 1.8.0 you need to strip those. You can download the official
  firmware and then run:
> ```
  # the following two lines print out the hashes of the firmwares
  tail -c +1281 trezor-1.9.4.bin | shasum -a 256
  tail -c +1025 build/legacy/firmware/firmware/bin | shasum -a 256
  ```

```
$ tail -c +1281 trezor-1.9.4.bin | shasum -a 256
8478aaabee98e9e3ec28d619dbdeb20a2c7c3edf26ecd2d8ef2f1ce55f81c586  -
$ tail -c +1025 build/legacy/firmware/firmware/bin | shasum -a 256
tail: cannot open 'build/legacy/firmware/firmware/bin' for reading: No such file or directory
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  -
```

Guess we found a typo as this looks good:

```
$ tail -c +1025 build/legacy/firmware/firmware.bin | shasum -a 256
8478aaabee98e9e3ec28d619dbdeb20a2c7c3edf26ecd2d8ef2f1ce55f81c586  -
```

That's a match! But why do we have to chop of heads? That explanation is not
satisfactory. "Reproducible" means that all bytes are accounted for. If those
bytes are the signature and can be decoded as such, we are good but for now we
need to research more.

