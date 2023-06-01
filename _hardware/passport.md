---
title: Foundation Passport "Batch 2"
appId: passport
authors:
- kiwilamb
- leo
released: 2022-03-10
discontinued: 
updated: 2023-06-01
version: v2.1.1
binaries: https://github.com/Foundation-Devices/passport2/releases
dimensions:
- 39
- 111
- 19
weight: 138
provider: 
providerWebsite: 
website: https://foundationdevices.com/
shop: https://foundationdevices.com/passport/
country: US
price: 199USD
repository: https://github.com/Foundation-Devices/passport2
icon: passportbatch2.png
bugbounty: https://foundationdevices.com/security/
verdict: reproducible
date: 2023-06-01
signer: 
reviewArchive:
- date: 2023-06-01
  version: 2.1.1
  appHash: 08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520
  gitRevision: b4b239e067f6384f38b27731337bb96d446f18c2
  verdict: reproducible
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://t.me/foundationdevices
- https://www.reddit.com/r/FoundationDevices/
features: 

---

The provider released a new version. Here we try to reproduce it again, using
our {% include testScript.html %}:

```
$ ./scripts/test/hardware/passport.sh 2.1.1 08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520 6191ba7f3ec54da7b4bea0572a18c11d068166048f45b2482dbef24df4b77700
...
Built v2.1.1 binary sha256 hash:
08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520 *ports/stm32/build-Passport/firmware-COLOR.bin
Expected v2.1.1 build hash:
08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520
ports/stm32/build-Passport/firmware-COLOR.bin: OK
v2.1.1 release binary sha256 hash:
6191ba7f3ec54da7b4bea0572a18c11d068166048f45b2482dbef24df4b77700 *../v2.1.1-passport.bin
Expected v2.1.1 release binary hash:
6191ba7f3ec54da7b4bea0572a18c11d068166048f45b2482dbef24df4b77700
../v2.1.1-passport.bin: OK
```

As with other hardware wallets, we did not check if those clipped bytes are
signatures or valid but leave that to actual code reviews: If the code
of the hardware wallet does what is claimed, it interprets those bytes as
signatures and checks them. In other words, if the public source code is secure,
then the link with the binary is established. This product is **reproducible**.
