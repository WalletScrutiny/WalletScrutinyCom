---
title: "Foundation Passport"
appId: passport
authors:
- kiwilamb
- leo
released: 2020-07-01
discontinued: 
updated: 2021-12-31
version: "v1.0.8"
binaries: https://github.com/Foundation-Devices/passport-firmware/releases
dimensions: [38, 102, 23]
weight: 138
provider: 
providerWebsite: 
website: https://foundationdevices.com/
shop: https://foundationdevices.com/product/passport/
country: US
price: 299USD
repository: https://github.com/Foundation-Devices/passport-firmware
issue: https://github.com/Foundation-Devices/passport-firmware/issues/40
icon: passport.png
bugbounty: https://foundationdevices.com/security/
meta: ok
verdict: reproducible
date: 2022-01-10
signer: 
reviewArchive: 
- date: 2021-12-01
  version: "1.0.8-beta"
  appHash: 703feb6c387db47ea862ab55acfa984afa456c75dff22b21977459f68e7e1795
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: 2021-10-04
  version: "v1.0.7"
  appHash: 265716676ca91bd724ad48b28a6877841b216003b7b03bbfd6e5eee85a5c057a
  gitRevision: ef2ffe05e70ed0485fa1526ea79a23bf80b15b4c
  verdict: reproducible
- date: 2021-08-17
  version: "v1.0.6"
  appHash: 606ca7ce1ba136988a36b445b2dae97508fbed062a8fdfa02f13ada69b6e92cd
  gitRevision: 1cf92f351ed58ce13738940ad6e9fad35366dbd5
  verdict: reproducible
twitter: FOUNDATIONdvcs
social: 
- https://www.linkedin.com/company/foundationdevices
---

The provider released a new version. Here we try to reproduce it again, using
our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/passport.sh):

```
$ ./scripts/test/hardware/passport.sh 1.0.8
...
ad6b4f5f4ae0b7e05ec35415713ea1ff7dde3edf10870876b1c8bd07391419d1  build-Passport/firmware.bin

root@cae95eed5f75:/passport-firmware/ports/stm32# exit
ad6b4f5f4ae0b7e05ec35415713ea1ff7dde3edf10870876b1c8bd07391419d1  -
ad6b4f5f4ae0b7e05ec35415713ea1ff7dde3edf10870876b1c8bd07391419d1  firmware-passport-v1.0.8.bin
```

As with other hardware wallets, we did not check if those clipped bytes are
signatures or valid but leave that to actual code reviews: If the code
of the hardware wallet does what is claimed, it interprets those bytes as
signatures and checks them. In other words, if the public source code is secure,
then the link with the binary is established. This product is **reproducible**.
