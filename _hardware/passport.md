---
title: "Foundation Passport"
appId: passport
authors:
- kiwilamb
- leo
released: 2020-07-01
discontinued: # date
updated: 2021-09-20
version: v1.0.7
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
date: 2021-10-04
signer: 
reviewArchive:
- date: 2021-08-17
  version: "v1.0.6"
  appHash: 606ca7ce1ba136988a36b445b2dae97508fbed062a8fdfa02f13ada69b6e92cd
  gitRevision: 1cf92f351ed58ce13738940ad6e9fad35366dbd5
  verdict: reproducible
  

providerTwitter: FOUNDATIONdvcs
providerLinkedIn: foundationdevices
providerFacebook: 
providerReddit: 
---

The provider released a new version. Here we try to reproduce it again:

```
$ cd /tmp/
$ v=1.0.7
$ buildHash=f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595
$ wget https://github.com/Foundation-Devices/passport-firmware/releases/download/v$v/passport-fw-$v.bin
$ sha256sum passport-fw-$v.bin 
265716676ca91bd724ad48b28a6877841b216003b7b03bbfd6e5eee85a5c057a  passport-fw-1.0.7.bin
$ mkdir passport
$ cd passport
$ docker run --rm -it --volume=$(pwd):/work/ ubuntu:18.04 bash -c   "apt update; \
    apt install --yes git python3-pip gcc-arm-none-eabi autotools-dev automake libusb-1.0-0-dev libtool; \
    git clone https://github.com/Foundation-Devices/passport-firmware.git; \
    cd passport-firmware; \
    git checkout v$v; \
    make -C mpy-cross; \
    cd ports/stm32/; \
    make BOARD=Passport; \
    sha256sum build-Passport/firmware.bin;echo $buildHash; \
    mv build-Passport/firmware.bin /work/firmware-passport-v$v.bin; \
    bash"
...
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595  build-Passport/firmware.bin
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595
$ tail -c +2049 ../passport-fw-$v.bin | sha256sum ; \
    sha256sum firmware-passport-v$v.bin; \
    echo $buildHash
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595  -
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595  firmware-passport-v1.0.7.bin
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595
```

Based on the above, we wrote a little
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/passport.sh)
for next time:

```
$ ./scripts/test/hardware/passport.sh 1.0.7 f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595
...
265716676ca91bd724ad48b28a6877841b216003b7b03bbfd6e5eee85a5c057a  passport-fw-1.0.7.bin
...
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595  build-Passport/firmware.bin
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595
root@db128e06c0bd:/passport-firmware/ports/stm32# exit
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595  -
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595  firmware-passport-v1.0.7.bin
f141ba05841e206291f63c9229c9b5ed2c45a3e0c9eb4f75ff82d8785feaa595
```

As with other hardware wallets, we did not check if those clipped bytes are
signatures or valid but leave that to actual code reviews: If the code
of the hardware wallet does what is claimed, it interprets those bytes as
signatures and checks them. In other words, if the public source code is secure,
then the link with the binary is established. This product is **reproducible**.
