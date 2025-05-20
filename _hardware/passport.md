---
title: Foundation Passport - Founder's Edition
appId: passport
authors:
- kiwilamb
- '@sethforprivacy'
- leo
released: 2020-07-01
discontinued: 
updated: 2024-02-21
version: v2.3.0
binaries: https://github.com/Foundation-Devices/passport2/releases
dimensions:
- 38
- 100
- 23
weight: 138
provider: 
providerWebsite: 
website: https://foundationdevices.com/
shop: 
country: US
price: 
repository: https://github.com/Foundation-Devices/passport2
issue: 
icon: passport.png
bugbounty: https://foundationdevices.com/security/
meta: discontinued
verdict: sourceavailable
appHashes:
- db160a44f538e8f030252a2076f8f6ed4927549ac4403834c6a39d43c7b400de
date: 2024-04-18
signer: 
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://t.me/foundationdevices
- https://www.reddit.com/r/FoundationDevices/
features: 

---

{{ page.title }} is the original and now discontinued version of
{% include walletLink.html wallet='hardware/passportb2' verdict='true' %}.

It is still maintained with firmware updates.

## Reproducibility

Expected fingerprints aka hashes can be found on the
[release page](https://github.com/Foundation-Devices/passport2/releases).

With our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/passport.sh)
and the parameters `$version`, `mono`, `$buildHash`, `$releaseHash`:

```
$ ./scripts/test/hardware/passport.sh \
  2.3.0 \
  mono \
  db160a44f538e8f030252a2076f8f6ed4927549ac4403834c6a39d43c7b400de \
  98833fdb3202ed09921d7bab43d77199ef66e7a87fc201cdbd8368bafcb9ba46
...
error: failed to compile `just v1.23.0`, intermediate artifacts can be found at `/tmp/cargo-installzHBtxM`

Caused by:
  package `nix v0.28.0` cannot be built because it requires rustc 1.69 or newer, while the currently active rustc version is 1.67.1
  Try re-running cargo install with `--locked`
```

Without being able to compile the firmware it is **not verifiable**. We hope for
a speedy resolution of our issue as
[filed here](https://github.com/Foundation-Devices/passport2/issues/493).

{% include asciicast %}

**Update 2024-04-18**: Our
[build issues](https://github.com/Foundation-Devices/passport2/issues/493) were
addressed by the provider. We now managed to run the updated build script as
such:

```
$ ./scripts/test/hardware/passport.sh 2.3.0 \
    mono \
    db160a44f538e8f030252a2076f8f6ed4927549ac4403834c6a39d43c7b400de \
    98833fdb3202ed09921d7bab43d77199ef66e7a87fc201cdbd8368bafcb9ba46 \
    2.3.0-reproducibility
...
Built v2.3.0 binary sha256 hash:
db160a44f538e8f030252a2076f8f6ed4927549ac4403834c6a39d43c7b400de  ports/stm32/build-Passport/firmware-MONO.bin
Expected v2.3.0 build hash:
db160a44f538e8f030252a2076f8f6ed4927549ac4403834c6a39d43c7b400de
ports/stm32/build-Passport/firmware-MONO.bin: OK
v2.3.0 release binary sha256 hash:
98833fdb3202ed09921d7bab43d77199ef66e7a87fc201cdbd8368bafcb9ba46  ../v2.3.0-founders-passport.bin
Expected v2.3.0 release binary hash:
98833fdb3202ed09921d7bab43d77199ef66e7a87fc201cdbd8368bafcb9ba46
../v2.3.0-founders-passport.bin: OK
Comparing v2.3.0 stripped release binary hash:
Expected v2.3.0 build hash:
db160a44f538e8f030252a2076f8f6ed4927549ac4403834c6a39d43c7b400de
no-header-v2.3.0-founders-passport.bin: OK
```

This looks good. This release is **reproducible**.
