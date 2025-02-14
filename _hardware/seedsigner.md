---
title: SeedSigner
appId: seedsigner
authors:
- danny
- leo
released: '2020-12-20'
discontinued: 
updated: '2024-08-21'
version: '0.8.0'
binaries: https://github.com/SeedSigner/seedsigner/releases
dimensions: 
weight: 
provider: Seed Signer
providerWebsite: 
website: https://seedsigner.com/
shop: >-
  https://btc-hardware-solutions.square.site/product/orange_pill_kit/6?cs=true&cst=custom
country: US
price: 93USD
repository: https://github.com/SeedSigner/seedsigner
issue: 
icon: seedsigner.png
bugbounty: 
meta: ok
verdict: reproducible
appHashes:
- 1d0f1c412f64b40e6aba21b5bacdb41d9323653c170ce06d0a3f1dd71fddb28e
- 11c5553d75b3ebca4988ae3c4573b60b33a12bc4779282454ae34404ba797670
- c8d5352ed4a86c19eb9ef54f2920934f8ce460742b464ea94dc9114f9f4e039a
- 917201e335bfc7ee4189f17827f954f89588dc0fdefdad80d26f2a65c5c8e6d0
date: '2024-12-18'
signer: 
reviewArchive:
- date: '2023-09-14'
  version: '0.7.0'
  appHashes: []
  gitRevision: ecbebc9a15b23cf32825669dd3ebb1a647f7a332
  verdict: reproducible
- date: '2022-03-26'
  version: '0.4.5'
  appHashes: []
  gitRevision: bb77f0f230d1ae52c437d16db7f43d440d9aa003
  verdict: nonverifiable
twitter: SeedSigner
social:
- https://t.me/joinchat/GHNuc_nhNQjLPWsS
- >-
  https://snort.social/p/npub17tyke9lkgxd98ruyeul6wt3pj3s9uxzgp9hxu5tsenjmweue6sqq4y3mgl
features: 

---

**Update 2024-12-18**:

```
===== Begin Results =====
appId:          seedsigner
board:          Raspberry Pi Zero 1.3
version:        '0.8.0'
builtHash:      1d0f1c412f64b40e6aba21b5bacdb41d9323653c170ce06d0a3f1dd71fddb28e
releaseHash:    1d0f1c412f64b40e6aba21b5bacdb41d9323653c170ce06d0a3f1dd71fddb28e
verdict:        reproducible
===== End Results =====

===== Begin Results =====
appId:          seedsigner
board:          Raspberry Pi 2 Model B
version:        '0.8.0'
builtHash:      11c5553d75b3ebca4988ae3c4573b60b33a12bc4779282454ae34404ba797670
releaseHash:    11c5553d75b3ebca4988ae3c4573b60b33a12bc4779282454ae34404ba797670
verdict:        reproducible
===== End Results =====

===== Begin Results =====
appId:          seedsigner
board:          Raspberry Pi Zero 2 W
version:        '0.8.0'
builtHash:      c8d5352ed4a86c19eb9ef54f2920934f8ce460742b464ea94dc9114f9f4e039a
releaseHash:    c8d5352ed4a86c19eb9ef54f2920934f8ce460742b464ea94dc9114f9f4e039a
verdict:        reproducible
===== End Results =====

===== Begin Results =====
appId:          seedsigner
board:          Raspberry Pi 4 Model B
version:        '0.8.0'
builtHash:      917201e335bfc7ee4189f17827f954f89588dc0fdefdad80d26f2a65c5c8e6d0
releaseHash:    917201e335bfc7ee4189f17827f954f89588dc0fdefdad80d26f2a65c5c8e6d0
verdict:        reproducible
===== End Results =====
```

**Update 2024-09-14**: 

We managed to build a [script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/e97be2a2e9604e8d4cdade68bef9687305784419/scripts/test/hardware/seedsigner.sh) that makes it slightly easier to verify the SeedSigner. 

From it, we get these results:

```
build-images-1  | Disk disk.img: 26 MiB, 27262976 bytes, 53248 sectors
build-images-1  | Units: sectors of 1 * 512 = 512 bytes
build-images-1  | Sector size (logical/physical): 512 bytes / 512 bytes
build-images-1  | I/O size (minimum/optimal): 512 bytes / 512 bytes
build-images-1  | 
build-images-1  | >>> Script header accepted.
build-images-1  | >>> Script header accepted.
build-images-1  | >>> Created a new DOS disklabel with disk identifier 0xba5eba11.
build-images-1  | disk.img1: Created a new partition 1 of type 'W95 FAT32 (LBA)' and of size 25 MiB.
build-images-1  | disk.img2: Done.
build-images-1  | 
build-images-1  | New situation:
build-images-1  | Disklabel type: dos
build-images-1  | Disk identifier: 0xba5eba11
build-images-1  | 
build-images-1  | Device     Boot Start   End Sectors Size Id Type
build-images-1  | disk.img1  *     2048 53247   51200  25M  c W95 FAT32 (LBA)
build-images-1  | 
build-images-1  | The partition table has been altered.
build-images-1  | Syncing disks.
build-images-1  | mkfs.fat 4.2 (2021-01-31)
build-images-1  | /opt/buildroot
build-images-1  | 917201e335bfc7ee4189f17827f954f89588dc0fdefdad80d26f2a65c5c8e6d0  /opt/../images/seedsigner_os.0.8.0.pi4.img
build-images-1 exited with code 0
Script finished.
```

The hash from their [release](https://github.com/SeedSigner/seedsigner/releases/download/0.8.0/seedsigner.0.8.0.sha256.txt)

- Hash from the build: 917201e335bfc7ee4189f17827f954f89588dc0fdefdad80d26f2a65c5c8e6d0
- Hash from repository: 917201e335bfc7ee4189f17827f954f89588dc0fdefdad80d26f2a65c5c8e6d0

We verify if the actual image has this hash: 

`$ wget https://github.com/SeedSigner/seedsigner/releases/download/0.8.0/seedsigner_os.0.8.0.pi4.img`
`$ sha256sum seedsigner_os.0.8.0.pi4.img`
`917201e335bfc7ee4189f17827f954f89588dc0fdefdad80d26f2a65c5c8e6d0  seedsigner_os.0.8.0.pi4.img`

This confirms that version 0.8.0 is **reproducibile**


{% include asciicast %}


**Update 2023-09-14**: Seedsigner
[announced reproducibility](https://twitter.com/SeedSigner/status/1701600348136436134)
with their latest release that they even gave the promising name
**The "It's reproducible forever, Laura" Release**. So we went and had a look
how reproducible it is. After some
[initial hurdles](https://twitter.com/LeoWandersleb/status/1702070495615611148),
we were
[pointed](https://twitter.com/KeithMukai/status/1702094039984595388) to the
[correct build instructions](https://github.com/SeedSigner/seedsigner-os/blob/main/docs/building.md).
That looks easy. Let's see how it goes ... crossing fingers the public wifi in
a café in the Bavarian countryside holds up ...

```
$ git clone --recursive https://github.com/SeedSigner/seedsigner-os.git
Cloning into 'seedsigner-os'...
remote: Enumerating objects: 1025, done.
remote: Counting objects: 100% (398/398), done.
remote: Compressing objects: 100% (149/149), done.
remote: Total 1025 (delta 295), reused 311 (delta 240), pack-reused 627
Receiving objects: 100% (1025/1025), 1.42 MiB | 4.23 MiB/s, done.
Resolving deltas: 100% (499/499), done.
Submodule 'buildroot' (https://github.com/seedsigner/buildroot) registered for path 'opt/buildroot'
Cloning into '/home/leo/tmp/seedsigner-os/opt/buildroot'...
remote: Enumerating objects: 505256, done.        
remote: Counting objects: 100% (3/3), done.        
remote: Compressing objects: 100% (2/2), done.        
remote: Total 505256 (delta 1), reused 1 (delta 1), pack-reused 505253        
Receiving objects: 100% (505256/505256), 156.36 MiB | 11.58 MiB/s, done.
Resolving deltas: 100% (334143/334143), done.
Submodule path 'opt/buildroot': checked out '165046699ae0799a359466ce73d124127df77554'
$ cd seedsigner-os
$ git checkout 0.7.0 
Branch '0.7.0' set up to track remote branch '0.7.0' from 'origin'.
Switched to a new branch '0.7.0'
$ git submodule update --init
$ SS_ARGS="--$BOARD_TYPE --app-branch=0.7.0" docker-compose up --force-recreate --build
Creating network "seedsigner-os_default" with the default driver
Building build-images
...    
```

... this step was already announced to take a while. And it does. The screen is
flying for half an hour straight already ... will it end soon? Will it take
2.5h?
The 4CPUs are maxed out. Table is getting hot. ... `sensors` occasionally
reports the CPU to go above 90°C ...

Anyway ... one coke later it got to a result. Let's see ...

```
...
build-images_1  | 
build-images_1  | Device     Boot Start   End Sectors Size Id Type
build-images_1  | disk.img1  *     2048 53247   51200  25M  c W95 FAT32 (LBA)
build-images_1  | 
build-images_1  | The partition table has been altered.
build-images_1  | Syncing disks.
build-images_1  | mkfs.fat 4.2 (2021-01-31)
build-images_1  | /opt/buildroot
build-images_1  | a380cb93eb852254863718a9c000be9ec30cee14a78fc0ec90708308c17c1b8a  /opt/../images/seedsigner_os.0.7.0.pi0.img
seedsigner-os_build-images_1 exited with code 0
```

That hash matches the one reported on their
[release page](https://github.com/SeedSigner/seedsigner/releases/tag/0.7.0).
Let's see if the binary for download actually has this hash:

```
$ wget https://github.com/SeedSigner/seedsigner/releases/download/0.7.0/seedsigner_os.0.7.0.pi0.img
$ sha256sum seedsigner_os.0.7.0.pi0.img images/seedsigner_os.0.7.0.pi0.img 
a380cb93eb852254863718a9c000be9ec30cee14a78fc0ec90708308c17c1b8a  seedsigner_os.0.7.0.pi0.img
a380cb93eb852254863718a9c000be9ec30cee14a78fc0ec90708308c17c1b8a  images/seedsigner_os.0.7.0.pi0.img
```

That looks good. This product is **reproducible** in the version tested with the
hash provided.

## Old Analysis

The Seed Signer is a truly Open Source project that lowers the barrier for entry for airgapped multi-signature cryptocurrency hardware wallets. The code is publicly available as are the instructions for assembly. 

It claims to [solve the following problems](https://seedsigner.com/faqs/):

> - Creates a secure, air-gapped environment for private key generation
> - Enforces strict separation between private key storage and protocol software / internet
> - Lowers the barrier cost of multi-sig security (from several hundred to < $50)

## Can the private keys be created offline? 

Yes. The seed signer is airgapped.

## Are the private keys shared? 

No. The companion apps only get signed transactions and no keys.

## Does the device display the receive address for confirmation?

Yes. 

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes. 

## Is it reproducible?

{{ page.title }} does share binaries, so the question is if these binaries match
the published and hopefully reviewed source code.

On their website there is a button labeled "DOWNLOAD VERSION 0.4.6" which does
not statically link to a binary but to a JavaScript document that then initiates
a download. While this is slightly suspicious, all that really matters is the
hash of the downloaded file. If you and I get the same hash, we are talking
about the same file.

Alternatively there is the
[GitHub Releases](https://github.com/SeedSigner/seedsigner/releases) where as of
now "0.4.6" is the "latest" release. Both downloads had the same sha256 hash
`1e47d997484c0396d01c87664753644e91c8e7c99f64b4cbfb048cf79bb03b1a`.

So ... how was this file created, so we can recreate it? There is not exactly
"Build Instructions". There is only a document with
[Manual Installation Instructions](https://github.com/SeedSigner/seedsigner/blob/main/docs/manual_installation.md).
And that is pretty involved. Its starting point is ... you need an RPi. Not
necessarily an RPi Zero 1.3 and the "Raspberry Pi Lite operating system, dated
2021-05-28". Being specific is important for reproducibility but the next steps
... are many and none of which to our knowledge is meant to make reproducible
modifications to the system. While many packages that are to be installed are
pinned to specific versions, this instruction:

> ```
> sudo apt-get update && sudo apt-get install -y wiringpi python3-pip \
>   python3-numpy python-pil libopenjp2-7 git python3-opencv \
>   python3-picamera libatlas-base-dev qrencode
> ```

explicitly instructs to update to whatever the latest packages are on the remote
server and install the given ten packages.

We might miss something here and might give it an actual try at some point but
for now we go with our educated guess that this product is **not verifiable**.

If you want to use thhttps://snort.social/p/npub17tyke9lkgxd98ruyeul6wt3pj3s9uxzgp9hxu5tsenjmweue6sqq4y3mglis product, do not trust the binary download. Go with the
"Manual Installation Instructions" instead!

We had a little
[back-and-forth with the provider on Twitter](https://twitter.com/WalletScrutiny/status/1507201398735220736).
