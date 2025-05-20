---
title: SeedSigner
appId: seedsigner
authors:
- danny
- leo
released: 2020-12-20
discontinued: 
updated: 2025-02-05
version: 0.8.5
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
verdict: sourceavailable
appHashes:
- bcb901e27d309d85f086dc80b49b153d6b1caab2247eba2811731384d58f2f3e
- 1e93a82e62d4a1defbdc777a6762a813f4cb5c3ef9090da0bd07542dfd6f62bf
- 398d9bf9cda0858fe97c0788b353194c1c902335a858b7dbf5d7b213bda75d96
- d298ffad3c765e11e48873efc6d1c65e4230528fde4d5bd4701bb507acbf493c
date: 2024-12-18
signer: 
twitter: SeedSigner
social:
- https://t.me/joinchat/GHNuc_nhNQjLPWsS
- >-
  https://snort.social/p/npub17tyke9lkgxd98ruyeul6wt3pj3s9uxzgp9hxu5tsenjmweue6sqq4y3mgl
features: 

---

**Update 2025-02-17**:

```
seedsigner_os.0.8.5.pi0.img
===== Begin Results =====
appId:          seedsigner
board:          Raspberry Pi Zero 1.3
version:        '0.8.5'
builtHash:      bcb901e27d309d85f086dc80b49b153d6b1caab2247eba2811731384d58f2f3e
releaseHash:    bcb901e27d309d85f086dc80b49b153d6b1caab2247eba2811731384d58f2f3e
verdict:        reproducible
===== End Results =====

seedsigner_os.0.8.5.pi2.img

===== Begin Results =====
appId:          seedsigner
board:          Raspberry Pi 2 Model B
version:        '0.8.5'
builtHash:      1e93a82e62d4a1defbdc777a6762a813f4cb5c3ef9090da0bd07542dfd6f62bf
releaseHash:    1e93a82e62d4a1defbdc777a6762a813f4cb5c3ef9090da0bd07542dfd6f62bf
verdict:        reproducible
===== End Results =====

seedsigner_os.0.8.5.pi02w.img

===== Begin Results =====
appId:          seedsigner
board:          Raspberry Pi Zero 2 W
version:        '0.8.5'
builtHash:      398d9bf9cda0858fe97c0788b353194c1c902335a858b7dbf5d7b213bda75d96
releaseHash:    398d9bf9cda0858fe97c0788b353194c1c902335a858b7dbf5d7b213bda75d96
verdict:        reproducible
===== End Results =====

seedsigner_os.0.8.5.pi4.img

===== Begin Results =====
appId:          seedsigner
board:          Raspberry Pi 4 Model B
version:        '0.8.5'
builtHash:      d298ffad3c765e11e48873efc6d1c65e4230528fde4d5bd4701bb507acbf493c
releaseHash:    d298ffad3c765e11e48873efc6d1c65e4230528fde4d5bd4701bb507acbf493c
verdict:        reproducible
===== End Results =====
```

The [seedsigner.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/seedsigner.sh) script is outputting "not-reproducible" but this is attributable to a flaw in the SHA256SUM string comparison logic.

We manually encoded the SHA256SUM string from the build.

The hash from their [release](https://github.com/SeedSigner/seedsigner/releases/download/0.8.5/seedsigner.0.8.5.sha256.txt)

```
398d9bf9cda0858fe97c0788b353194c1c902335a858b7dbf5d7b213bda75d96  seedsigner_os.0.8.5.pi02w.img
bcb901e27d309d85f086dc80b49b153d6b1caab2247eba2811731384d58f2f3e  seedsigner_os.0.8.5.pi0.img
1e93a82e62d4a1defbdc777a6762a813f4cb5c3ef9090da0bd07542dfd6f62bf  seedsigner_os.0.8.5.pi2.img
d298ffad3c765e11e48873efc6d1c65e4230528fde4d5bd4701bb507acbf493c  seedsigner_os.0.8.5.pi4.img
```

We verify if one of the actual images has this hash: 

```
$ wget https://github.com/SeedSigner/seedsigner/releases/download/0.8.5/seedsigner_os.0.8.5.pi0.img
$ sha256sum seedsigner_os.0.8.5.pi0.img
bcb901e27d309d85f086dc80b49b153d6b1caab2247eba2811731384d58f2f3e  seedsigner_os.0.8.5.pi0.img
```

The other images are available as well. 

This confirms that version 0.8.5 is **reproducibile**

The asciicast is too big, hence I put it in my own repository with GitHub LFS [here](https://github.com/xrviv/walletScrutinyBuildCasts/blob/main/2025/2025-02-17.seedsigner_v0.8.5.cast).


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
