---
title: Blockstream Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
released: 2021-01-01
discontinued: 
updated: 2022-05-27
version: 0.1.34
binaries: 
dimensions:
- 24
- 60
- 17
weight: 
provider: Blockstream Corporation Inc.
providerWebsite: https://blockstream.com/
website: https://blockstream.com/jade/
shop: https://store.blockstream.com/product/blockstream-jade-token/
country: CA
price: 39.99USD
repository: https://github.com/Blockstream/jade
issue: https://github.com/Blockstream/Jade/issues/26
icon: blockstreamjade.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-06-29
signer: 
reviewArchive:
- date: 2022-08-07
  version: 0.1.33
  appHash: 
  gitRevision: 89390dfa4b632ab1261a523e1988c81ce2e47710
  verdict: nonverifiable
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
- https://t.me/blockstream
- https://www.youtube.com/channel/UCZNt3fZazX9cwWcC9vjDJ4Q
features: 

---

**Update 2023-06-29**: We used
[a test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/blockstreamjade.sh)
to build the firmware based on the
[the provided instructions](https://github.com/Blockstream/Jade/blob/master/REPRODUCIBLE.md).
After running the script we get this result for version 0.1.48 (BLE-Enabled):

```
$ ./scripts/test/hardware/blockstreamjade.sh 0.1.48

...

d329dbf4fea13c6cde7df9682febae15e162947dc5a747aae98540f69e1a25d3  downloaded-firmware.bin
a249638d43723e21927610f208727eda585e569f384cf14944297aedb85d66d1  build/jade_signed.bin
b74dc0d9df905f53097f3dfe66b62798257e9e7ae52a10815ec6d9f3ab2c2d89  build/jade.bin

```

Obviously the hashes wouldn't be the same because of the difference in signatures.
So we converted binaries to hex to see the diff.
Unfortunately the diff was something more than signatures:

```
$ xxd downloaded-firmware.bin > downloaded-firmware.hex
$ xxd build/jade_signed.bin > jade_signed.hex
$ diff downloaded-firmware.hex jade_signed.hex

4c4
< 00000030: 302e 312e 3438 0000 0000 0000 0000 0000  0.1.48..........
---
> 00000030: 3100 0000 0000 0000 0000 0000 0000 0000  1...............
12,13c12,13
< 000000b0: 0c00 a08c c9d3 f9ef 58bd 2405 e51c d269  ........X.$....i
< 000000c0: 194e 435e 6818 56ea 80ec c5aa 0259 2c1c  .NC^h.V......Y,.
---
> 000000b0: c250 4a04 278e 4d62 9f4d 6ba2 0e03 f187  .PJ.'.Mb.Mk.....
> 000000c0: d606 74fa 6ed5 0ccb 19e2 fa08 05a2 524e  ..t.n.........RN
24941c24941
< 000616c0: 60db fb3f c088 fc3f 0000 803f 0000 c03f  `..?...?...?...?
---
> 000616c0: 60db fb3f e0a3 fc3f 0000 803f 0000 c03f  `..?...?...?...?
26982c26982
< 00069650: 0000 0000 2000 0000 0800 803f 0000 0000  .... ......?....
---
> 00069650: 0000 0000 2000 0000 407e fc3f 0000 0000  .... ...@~.?....
27277c27277
< 0006a8c0: b468 fc3f 0080 f43f c088 fc3f a068 fc3f  .h.?...?...?.h.?
---
> 0006a8c0: b468 fc3f 0080 f43f e0a3 fc3f a068 fc3f  .h.?...?...?.h.?
27279c27279
< 0006a8e0: 2c00 f03f 8815 0840 201b 803f 0000 803f  ,..?...@ ..?...?
---
> 0006a8e0: 2c00 f03f 8815 0840 0000 803f 0000 803f  ,..?...@...?...?
27352,27353c27352,27353
< 0006ad70: 6458 0d40 c40c 803f d801 803f dc09 803f  dX.@...?...?...?
< 0006ad80: 580c 803f 500c 803f c80c 803f 95f4 413f  X..?P..?...?..A?
---
> 0006ad70: 6458 0d40 fc8a fc3f 1080 fc3f 1488 fc3f  dX.@...?...?...?
> 0006ad80: 908a fc3f 888a fc3f 008b fc3f 95f4 413f  ...?...?...?..A?
27356c27356
< 0006adb0: 81f4 413f 26f6 413f 0c13 803f ecf7 413f  ..A?&.A?...?..A?
---
> 0006adb0: 81f4 413f 26f6 413f 4491 fc3f ecf7 413f  ..A?&.A?D..?..A?
27358c27358
< 0006add0: 7074 1040 780f 803f 9bf4 413f a0f7 413f  pt.@x..?..A?..A?

... and the diff goes on...
```

This wallet has different version of firmwares. We just tried the BLE-Enabled firmware,
But the diff shows there are some differences between our build and the provided firmware.
We are still investigating the problem
[here](https://github.com/Blockstream/Jade/issues/26#issuecomment-1613597885) with
Blockstream. So for now it's **not reproducible**.

**Update 2022-03-08**: On March 3rd version 0.1.33 was released. If you are
running version 0.1.32 which was released December 23rd, you might or might not
be able to verify what you are updating to, depending on the companion app being
updated, too or not. Check
[this issue](https://github.com/Blockstream/Jade/issues/26) for details.

**Update 2021-11-02**: We are in touch with the provider and while the firmware
was updated two weeks ago already, their
[latest comment on the issue](https://github.com/Blockstream/Jade/issues/26#issuecomment-947420765)
was a day after the last release, so we assume the problem persists.

## Original Analysis

{{ page.title }} is one of the newer hardware wallets but provided by
Blockstream which is a very well known player in this space.

On the product website, the {{ page.title }} is advertised as

> **The first purpose-built hardware wallet for Liquid.**<br>
  Blockstream Jade is a purely open-source hardware wallet for the storage of
  bitcoin and Liquid assets.

Liquid is a sidechain developed by Blockstream, mostly used for quick settlement
between centralized exchanges with some advanced features like "confidential
transactions".

This hardware wallet works with
{% include walletLink.html wallet='android/com.greenaddress.greenbits_android_wallet' verdict='true' %}
and its iPhone and desktop counterparts as its companion app.

The provider makes no claims about the firmware being reproducible and neither
can we find the binaries for download. Given the companion app does have a good
track record of being reproducible, we assume
[this issue](https://github.com/Blockstream/Jade/issues/26) to be resolved
quickly and being more about documentation but as with half an hour of searching
we could not find the answers to these questions:

* Where can I download the firmware binary?
* Does the Jade display the binary's hash prior to installation?

the firmware of this device is currently **not verifiable**.

## Code and Reproducible Builds

So as we learned in [this issue](https://github.com/Blockstream/Jade/issues/26),
the provider doesn't easily offer the firmware for download but we came up with
a convenient script to download the latest version. As there are two slightly
different versions of the {{ page.title }} and the firmware comes in two
flavors - with or without radio - this script downloads four firmware binaries:

```
withoutWheel="jade1.1"
withWheel="jade"
for model in $withoutWheel $withWheel; do
	files=$( wget --output-document=- https://jadefw.blockstream.com/bin/$model/index.json | jq '.stable.full[].filename' --raw-output )
	for file in $files; do
		wget https://jadefw.blockstream.com/bin/$model/$file
	done
done
```

So we have something to check. On to compilation:

As always we prefer compilation in containers, so we go with the
[Use docker](https://github.com/Blockstream/Jade#use-docker) instructions:

```
$ git clone --recursive https://github.com/Blockstream/Jade.git
$ cd Jade
$ docker-compose up -d
$ docker-compose exec dev bash
```

From here, the
[Build the firmware](https://github.com/Blockstream/Jade#build-the-firmware)
part should work, right?

```
root@5d8f6ff15ec2:/jade# git clone --recursive https://github.com/Blockstream/Jade.git $HOME/jade
root@5d8f6ff15ec2:/jade# cd $HOME/jade
root@5d8f6ff15ec2:~/jade# cp configs/sdkconfig_jade.defaults sdkconfig.defaults
root@5d8f6ff15ec2:~/jade# idf.py flash monitor
...
-- Configuring done
-- Generating done
-- Build files have been written to: /root/jade/build
Serial port /dev/ttyS0
Connecting.......................
/dev/ttyS0 failed to connect: Failed to connect to Espressif device: No serial data received.
For troubleshooting steps visit: https://github.com/espressif/esptool#troubleshooting
No serial ports found. Connect a device, or use '-p PORT' option to set a specific port.
root@5d8f6ff15ec2:~/jade#
```

The error doesn't come as a surprise as we have no {{ page.title }} connected.
But `-- Build files have been written to: /root/jade/build` looks promising.

Sadly this is "Build files" not "Built files". None of the 769 files contains
"firmware" and the two ".bin" files
"build/CMakeFiles/3.18.4/CMakeDetermineCompilerABI_C*.bin" don't look promising
neither.

So what's probably going on is that the above command `idf.py flash monitor`
would determine the configuration of a connected {{ page.title }} to then
compile exactly for this device.

Under [Build configurations](https://github.com/Blockstream/Jade#build-configurations)
they explain:

> The menuconfig tool can also be used to adjust the build settings.
>
> `idf.py menuconfig`

Running this command, we get a huge menu with tons of sub-menus allowing to
configure what exactly to compile which is where we give up for now and hope
to get easy steps on how to reproduce exactly the four files we downloaded
above. In the mean time, this remains **not verifiable** for us.
