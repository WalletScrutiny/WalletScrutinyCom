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
meta: outdated
verdict: nonverifiable
date: 2022-08-07
signer: 
reviewArchive: 
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
- https://t.me/blockstream
- https://www.youtube.com/channel/UCZNt3fZazX9cwWcC9vjDJ4Q
features: 

---

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
