---
title: Foundation Passport - Founder's Edition
appId: passport
authors:
- kiwilamb
- leo
- '@sethforprivacy'
released: 2020-07-01
discontinued: 
updated: 2023-06-13
version: v2.1.2
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
verdict: reproducible
date: 2023-06-20
signer: 
reviewArchive:
- date: 2022-08-07
  version: "1.0.8"
  appHash: 6c6d1531685ac91eeea202d1fb818c4930a208a7590ab36e118bf5eb91e29e83
  gitRevision: f2a0b0525ce8d92f2c3159feb8353b223ebac123
  verdict: reproducible
- date: 2021-12-01
  version: 1.0.8-beta
  appHash: 703feb6c387db47ea862ab55acfa984afa456c75dff22b21977459f68e7e1795
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: 2021-10-04
  version: v1.0.7
  appHash: 265716676ca91bd724ad48b28a6877841b216003b7b03bbfd6e5eee85a5c057a
  gitRevision: ef2ffe05e70ed0485fa1526ea79a23bf80b15b4c
  verdict: reproducible
- date: 2021-08-17
  version: v1.0.6
  appHash: 606ca7ce1ba136988a36b445b2dae97508fbed062a8fdfa02f13ada69b6e92cd
  gitRevision: 1cf92f351ed58ce13738940ad6e9fad35366dbd5
  verdict: reproducible
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

With the provider's help we updated the [test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/passport.sh).

This device runs the "mono" version of the firmware so we provide these
parameters to it:
  
* version: 2.1.2
* model: mono
* build fingerprint: 02eda99314c0a45a0edac0cd2df54f9a977192d3b2ef7eb502959a83c543554c
* release fingerprint: 197bdfb863cca434395f6535d848622a9c47002a01e27867b7218e3678d6e8ac

The fingerprints can be found on the [release page](https://github.com/Foundation-Devices/passport2/releases).

```
$ ./scripts/test/hardware/passport.sh 2.1.2 mono 02eda99314c0a45a0edac0cd2df54f9a977192d3b2ef7eb502959a83c543554c 197bdfb863cca434395f6535d848622a9c47002a01e27867b7218e3678d6e8ac

...

   Compiling ur v0.3.0 (https://github.com/Foundation-Devices/ur-rs?branch=dev#69297429)
   Compiling ur-foundation v0.1.0 (https://github.com/Foundation-Devices/rust-ur-foundation?branch=dev-v0.1.0#0ae54214)
   Compiling foundation v0.1.0 (/workspace/extmod/foundation-rust)
    Finished release [optimized] target(s) in 9.50s
LINK build-Passport/firmware.elf
Memory region         Used Size  Region Size  %age Used
           FLASH:          0 GB         2 MB      0.00%
       FLASH_ISR:       14928 B       128 KB     11.39%
      FLASH_TEXT:     1646176 B      1664 KB     96.61%
            DTCM:      118664 B       128 KB     90.53%
             RAM:      229528 B       512 KB     43.78%
          RAM_D2:      270452 B       288 KB     91.71%
           SRAM4:       50324 B        64 KB     76.79%
   text	   data	    bss	    dec	    hex	filename
1640468	  20636	 648328	2309432	 233d38	build-Passport/firmware.elf
INFO: this build requires mboot to be installed first
GEN build-Passport/firmware-MONO.bin
GEN build-Passport/firmware.dfu
GEN build-Passport/firmware.hex
make: Leaving directory '/workspace/ports/stm32'
Built v2.1.2 binary sha256 hash:
02eda99314c0a45a0edac0cd2df54f9a977192d3b2ef7eb502959a83c543554c  ports/stm32/build-Passport/firmware-MONO.bin
Expected v2.1.2 build hash:
02eda99314c0a45a0edac0cd2df54f9a977192d3b2ef7eb502959a83c543554c
ports/stm32/build-Passport/firmware-MONO.bin: OK
v2.1.2 release binary sha256 hash:
197bdfb863cca434395f6535d848622a9c47002a01e27867b7218e3678d6e8ac  ../v2.1.2-founders-passport.bin
Expected v2.1.2 release binary hash:
197bdfb863cca434395f6535d848622a9c47002a01e27867b7218e3678d6e8ac
../v2.1.2-founders-passport.bin: OK
Comparing v2.1.2 stripped release binary hash:
Expected v2.1.2 build hash:
02eda99314c0a45a0edac0cd2df54f9a977192d3b2ef7eb502959a83c543554c
no-header-v2.1.2-founders-passport.bin: OK
Untagged: foundation-devices/passport2:latest
```

which shows this firmware is **reproducible**. Upon updating your device, you
should be shown
`197bdfb863cca434395f6535d848622a9c47002a01e27867b7218e3678d6e8ac` to be sure
you got the file that we tested.
