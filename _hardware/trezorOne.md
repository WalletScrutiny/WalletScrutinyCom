---
title: "Trezor One"
appId: trezorOne
authors:
- leo
released: 2014-07-29
discontinued: # date
latestUpdate: 
version: 1.9.4
dimensions: [60, 30, 6]
weight: 12
website: https://trezor.io
shop: https://shop.trezor.io/product/trezor-one-black
country: CZ
price: 49EUR
repository: https://github.com/trezor/trezor-firmware
issue: https://github.com/trezor/trezor-firmware/issues/1713
icon: trezorOne.png
bugbounty: 
verdict: reproducible
date: 2021-07-17
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
provider's public keys that should be hard-coded into the bootloader.

> **Secure update procedure.**<br>
  The bootloader erases the device memory if the firmware signature is invalid.
  Downgrade to a vulnerable version also wipes the memory.

We suppose, downgrading to any version - not only vulnerable ones - wipes the
memory.

The above properties ensure that only software which has been approved by the provider can be
run on this device. It doesn't guarantee that this software is not stealing your
keys.

To our surprise, the wallet's [main page](https://trezor.io/) does not show or link
to claims about the product being open source.

We [asked on Reddit](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/)
but somehow there really is no authoritative claim from the provider that the
device they sell follows this protocol:

1. The device comes without firmware[[1]](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/h3l44r2/)[[2]](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/h3l4oob/)
1. The firmware [can be downloaded](https://data.trezor.io/firmware/1/trezor-1.9.4.bin), [verified to match the source code](https://wiki.trezor.io/Developers_guide:Deterministic_firmware_build) and then deployed to your device on an air-gapped computer (?can it?)
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

That's a 121 lines of code script and we better understand what's going on.
After all this is supposed to be run on our PC.

So they want to use an `alpine:3.12.3` docker container to compile in but
instead of getting it from docker hub like so:

```
$ docker run --rm --interactive --tty docker.io/alpine:3.12.3
```

they ... wget the image from `http://dl-cdn.alpinelinux.org/alpine` which
doesn't even use ssl? That's a bit confusing and might warrant a code comment as
to why this way.

Anyway, else the script looks good. Let's see if it builds something:

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

The build instructions go on to explain:

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
$ tail -c +1281 trezor-1.9.4.bin | shasum -a 256; \
  tail -c +1025 build/legacy/firmware/firmware.bin | shasum -a 256
8478aaabee98e9e3ec28d619dbdeb20a2c7c3edf26ecd2d8ef2f1ce55f81c586  -
8478aaabee98e9e3ec28d619dbdeb20a2c7c3edf26ecd2d8ef2f1ce55f81c586  -
```

That's a match! But why do we have to chop off heads? That explanation is not
satisfactory. "Reproducible" means that all bytes are accounted for. If those
bytes are the signature and can be decoded as such, we are good but for now we
need to research more.

So they point [here](https://github.com/trezor/trezor-mcu/issues/459) for
details and Trezor co-founder [Pavel Prusnak](https://github.com/prusnak)
indeed
[explains](https://github.com/trezor/trezor-mcu/issues/459#issuecomment-470511795)
the diff as signatures:

> These 192 bytes are 3 ECDSA signatures (3 * 64 = 192)

To have peace of mind, we would have to either dig into the bootloader if it
really reads that part as signatures and not as executable code or we would have
to verify those three signatures - it would probably be impossible to have
something that is both a valid signature and malicious code. *The best option
though would be to verify these signatures with the signers public key as it
gives additional accountability.*

But first lets see if the header indeed matches except for 192 bytes:

```
$ hexdump -n 1024 -v -e '/1 "%02x\n"' build/legacy/firmware/firmware.bin > firstBytesBuild.txt
$ hexdump -n 1280 -v -e '/1 "%02x\n"' trezor-1.9.4.bin > firstBytesDownload.txt
$ meld firstBytes*
```

This is more than 192B of diff. The downloaded file starts with an extra 256B

```
54 52 5a 52 04 06 09 00 01 02 03 01 00 00 00 00 
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
c7 34 48 6d 08 b3 28 3b 83 93 77 78 ed 46 55 c2 
5b 07 01 01 29 7d 72 67 53 66 1d ae cc 90 14 06 
8a b1 d2 9c cf 4c 11 9b 46 f6 f2 ec 54 ac ce 25 
23 3d 23 4e 2b 07 a4 d9 fd 66 16 81 be 99 b0 44 
e5 23 15 48 e9 1a 24 28 8e 68 eb e4 44 46 82 f9 
96 3f 73 c7 82 a9 4c 46 ae 6f d6 db db 79 72 3e 
c3 cc ea 17 e6 a2 06 28 66 39 d8 d1 a9 79 7e 68 
b7 6a 3b be a1 77 a4 92 58 00 c1 cb 41 4f 19 2f 
23 53 3b d1 ab b0 ea 11 bb 42 9c 49 18 8d 1e cf 
f5 a3 5e ce 8f 36 74 0a de d2 1f 39 a3 92 14 2b 
ed 72 8e 7c 93 02 5e df 27 a7 41 10 3f f7 50 69 
55 7b 23 2e 5c 69 bd 97 a7 39 0e 05 b8 4c 9b fd
```

and its bytes 800 to 994:

```
7e 1f 7c 47 f1 f0 b7 3b 7d 43 3b 52 2d e6 5c 5e 
0d 52 2a ac 7d f1 84 2a 3a 15 8b 3c cf 1b 7e ec 
c4 7d d8 30 67 d4 42 58 ad 33 64 69 6d e5 5e 7b 
a1 8c 3c c5 15 be fd 98 87 91 0e bf 9f 10 cf f0 
aa 95 ba b8 13 89 a4 a7 ac 64 36 2b 6a 8e b3 7a 
a0 7f 5b 71 55 e1 c8 a1 1f 12 cb 4f 57 03 d8 fb 
f0 af a0 f0 63 b3 f8 a6 ba d3 66 63 cc ac 1c 04 
b1 a1 ce 24 ea 5b 29 60 9f 1a a6 e9 82 f8 73 1e 
00 79 cd 7e cb a5 d5 3e 70 9f f7 5b 4a da 9e d9 
45 1a f6 89 25 13 4f 70 55 af 77 2e 24 c9 39 18 
a6 17 54 27 4e eb 71 b0 08 9a 0c f1 f4 91 8a f5 
fb 8b a3 f0 2a ab 0d 83 8b 0e de f9 5a 46 80 41 
01 02 03
```

differ, too. Apparently the latter is the 192-ish bytes of 3 signatures. We
asked the provider for clarification in
[this issue](https://github.com/trezor/trezor-firmware/issues/1713).

... and we were given some more pointers on how to interpret the remaining 256 +
192 bytes:

> High-level comment:
> 
> Current firmwares are distributed as wrapped images where you have a firmware signed with new method (using [legacy/bootloader/firmware_sign.py](https://github.com/trezor/trezor-firmware/blob/master/legacy/bootloader/firmware_sign.py?rgh-link-date=2021-07-16T09%3A00%3A36Z)) and the result is then signed using the old method (using the method predating commit [07231d9](https://github.com/trezor/trezor-firmware/commit/07231d936e41335b3ec44c4c6eb336be006890d0)).
> 
> In both signing operations the keys used are private keys belonging to these public keys:
> 
> [signatures.c#L35-L41](https://github.com/trezor/trezor-firmware/blob/3d69ca1b1b0c0e429474321ced0d040d1d9e6dec/legacy/bootloader/signatures.c#L35-L41):
> ```
static const uint8_t * const pubkey[PUBKEYS] = { 
  (const uint8_t *)"\x04\xd5\x71\xb7\xf1\x48\xc5\xe4\x23\x2c\x38\x14\xf7\x77\xd8\xfa\xea\xf1\xa8\x42\x16\xc7\x8d\x56\x9b\x71\x04\x1f\xfc\x76\x8a\x5b\x2d\x81\x0f\xc3\xbb\x13\x4d\xd0\x26\xb5\x7e\x65\x00\x52\x75\xae\xde\xf4\x3e\x15\x5f\x48\xfc\x11\xa3\x2e\xc7\x90\xa9\x33\x12\xbd\x58", 
  (const uint8_t *)"\x04\x63\x27\x9c\x0c\x08\x66\xe5\x0c\x05\xc7\x99\xd3\x2b\xd6\xba\xb0\x18\x8b\x6d\xe0\x65\x36\xd1\x10\x9d\x2e\xd9\xce\x76\xcb\x33\x5c\x49\x0e\x55\xae\xe1\x0c\xc9\x01\x21\x51\x32\xe8\x53\x09\x7d\x54\x32\xed\xa0\x6b\x79\x20\x73\xbd\x77\x40\xc9\x4c\xe4\x51\x6c\xb1", 
  (const uint8_t *)"\x04\x43\xae\xdb\xb6\xf7\xe7\x1c\x56\x3f\x8e\xd2\xef\x64\xec\x99\x81\x48\x25\x19\xe7\xef\x4f\x4a\xa9\x8b\x27\x85\x4e\x8c\x49\x12\x6d\x49\x56\xd3\x00\xab\x45\xfd\xc3\x4c\xd2\x6b\xc8\x71\x0d\xe0\xa3\x1d\xbd\xf6\xde\x74\x35\xfd\x0b\x49\x2b\xe7\x0a\xc7\x5f\xde\x58", 
  (const uint8_t *)"\x04\x87\x7c\x39\xfd\x7c\x62\x23\x7e\x03\x82\x35\xe9\xc0\x75\xda\xb2\x61\x63\x0f\x78\xee\xb8\xed\xb9\x24\x87\x15\x9f\xff\xed\xfd\xf6\x04\x6c\x6f\x8b\x88\x1f\xa4\x07\xc4\xa4\xce\x6c\x28\xde\x0b\x19\xc1\xf4\xe2\x9f\x1f\xcb\xc5\xa5\x8f\xfd\x14\x32\xa3\xe0\x93\x8a", 
  (const uint8_t *)"\x04\x73\x84\xc5\x1a\xe8\x1a\xdd\x0a\x52\x3a\xdb\xb1\x86\xc9\x1b\x90\x6f\xfb\x64\xc2\xc7\x65\x80\x2b\xf2\x6d\xbd\x13\xbd\xf1\x2c\x31\x9e\x80\xc2\x21\x3a\x13\x6c\x8e\xe0\x3d\x78\x74\xfd\x22\xb7\x0d\x68\xe7\xde\xe4\x69\xde\xcf\xbb\xb5\x10\xee\x9a\x46\x0c\xda\x45", 
};
```
 
and




> as specified [in a comment](https://github.com/trezor/trezor-mcu/issues/459#issuecomment-470287085) in the issue you link in the review, the header at start of the downloaded image is:
> 
> * 256 bytes of the old TRZR header -- which is [stripped](https://github.com/trezor/trezor-firmware/blob/master/python/src/trezorlib/cli/firmware.py?rgh-link-date=2021-07-16T09%3A03%3A26Z#L335-L351) when you upload the image into bootloader 1.8.0 or newer
> * 1024 bytes of the new TRZF header, which should be identical to what you built, except for the 192 bytes of signatures
> 
> Structure of the old header is described here:<br>
> [https://github.com/trezor/trezor-firmware/blob/master/python/src/trezorlib/firmware.py#L246-L260](https://github.com/trezor/trezor-firmware/blob/master/python/src/trezorlib/firmware.py?rgh-link-date=2021-07-16T09%3A03%3A26Z#L246-L260)<br>
> Structure of the new header is described here:<br>
> [https://github.com/trezor/trezor-firmware/blob/master/python/src/trezorlib/firmware.py#L181-L213](https://github.com/trezor/trezor-firmware/blob/master/python/src/trezorlib/firmware.py?rgh-link-date=2021-07-16T09%3A03%3A26Z#L181-L213)
> 
> Signature verification for the old header is implemented here:<br>
> [https://github.com/trezor/trezor-firmware/blob/master/python/src/trezorlib/firmware.py#L411-L418](https://github.com/trezor/trezor-firmware/blob/master/python/src/trezorlib/firmware.py?rgh-link-date=2021-07-16T09%3A03%3A26Z#L411-L418)<br>
> Namely:
> 
> 1. calculate digest of firmware without header. This is essentially `tail -c +257 trezor.bin | sha256sum`
> 2. the `key_indexes` will tell you which 3 of the 5 [`V1_BOOTLOADER_KEYS`](https://github.com/trezor/trezor-firmware/blob/master/python/src/trezorlib/firmware.py?rgh-link-date=2021-07-16T09%3A03%3A26Z#L33-L42) are used
> 3. the `signatures` are ecdsa signatures of the digest with the respective keys
> 
> 
> Signature verification for the new header is identical, except:
> 
> * signatures are over a "header digest", which is a sha256 over the header with signature fields zeroed out
> * key indexes are `v1_key_indexes` in the new header
> * signatures are `v1_signatures` in the new header.
> 
> For purposes of reproducibility, we should also publish instructions along the same lines as for TT, i.e., use `dd` to zero out signatures, compare files byte-for-byte.

So ... what do we make of this? Do we **have to** reconstruct the verification
script or can we assume their open source verification script is getting the
same scrutiny as their firmware itself? As the bootloader is doing this check,
too, we have to assume the check is under as much scrutiny as the firmware
itself and for now will not dig deeper.

Trezor is the oldest player in the space and one of the most scrutinized and the
file format of the firmware reflects a transition from an old to a new format,
which left some legacy in how to verify its build today but it looks good. The
firmware version 1.9.4 is **reproducible**.
