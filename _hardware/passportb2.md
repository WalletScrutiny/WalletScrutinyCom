---
title: Foundation Passport
appId: passportb2
authors:
- kiwilamb
- leo
- '@sethforprivacy'
released: 2022-03-10
discontinued: 
updated: 2023-06-13
version: v2.1.2
binaries: https://github.com/Foundation-Devices/passport2/releases
dimensions:
- 39
- 110
- 19
weight: 128
provider: 
providerWebsite: 
website: https://foundationdevices.com/
shop: https://foundationdevices.com/passport/
country: US
price: 199USD
repository: https://github.com/Foundation-Devices/passport2
issue: 
icon: passportb2.png
bugbounty: https://foundationdevices.com/security/
meta: ok
verdict: reproducible
date: 2023-06-20
signer: 
reviewArchive:
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://t.me/foundationdevices
- https://www.reddit.com/r/FoundationDevices/
features: 

---

## Background 

{{ page.title }} is the next iteration for the {% include walletLink.html wallet='hardware/passport' verdict='true' %}. 

## Product Description 

It features the following specifications: 

> - Supported Cryptocurrencies:	Bitcoin via PSBTs; best-in-class multisig experience.
- Supported Software Wallets:	Bitcoin Core, BlueWallet, BTCPay, Casa, Electrum, Nunchuk, Simple Bitcoin Wallet, Sparrow, Specter, Wasabi, and other wallets supporting PSBTs via microSD or QR codes.
- Key Components:	STM processor, Microchip 608a secure element, Omnivision Cameracube.
- Communication:	Camera and microSD port. No USB data, no Bluetooth, no wireless communications of any kind.
- Power:	1200 mAh Lithium ion battery in Nokia BL-5C form factor (included with purchase).
- Security Features:	Airgapped, easy passphrase entry, security lights, anti-phishing words, supply chain verification. 

From Foundation's Twitter account: 

> - 20% thinner design
- Standard form factor lithium-ion battery
- High resolution IPS color display bonded to ultra-hard glass
- STM processor, Microchip 608a secure element, Omnivision cameracube, and an avalanche noise source for entropy
- Physical power button 
- Improved microSD slot
- Power only USB-C port
>
> Passport now ships these accessories: 
- Industrial-grade microSD card 
- Removable lithium-ion battery
- microSD adapters for iOS and Android 
- USB-C charging cable.
- Helps you securely and easily set up Passport.
- Keeps you up-to-date with firmware updates, no computer required!
- Provides quick and easy access to support resources.
- Let's you send, receive, and "boost" bitcoin transactions.
>
> Onboarding: Envoy guides the user through unboxing Passport and setting it up securely, no need for a computer
> 
> Security: Envoy primarily communicates with Passport via airgapped QR codes, ensuring that Passport is never directly connected to an online device.
>
> Privacy: Envoy connects to Foundation’s server and Bitcoin node through Tor. Envoy offers the ability to connect to your own Bitcoin node, cutting out Foundation as the middleman.

## Reproducibility

With the provider's help we updated the [test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/passport.sh).

This device runs the "color" version of the firmware so we provide these
parameters to it:
  
* version: 2.1.2
* model: color
* build fingerprint: 08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520
* release fingerprint: 9de833a38931b7e4660e8d0e3ea4a2bfe74924caa1328834e9be9c3d1750cd7e

The fingerprints can be found on the [release page](https://github.com/Foundation-Devices/passport2/releases).

```
$ ./scripts/test/hardware/passport.sh 2.1.2 color 08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520 9de833a38931b7e4660e8d0e3ea4a2bfe74924caa1328834e9be9c3d1750cd7e

...

   Compiling phf v0.11.1
   Compiling ur v0.3.0 (https://github.com/Foundation-Devices/ur-rs?branch=dev#69297429)
   Compiling ur-foundation v0.1.0 (https://github.com/Foundation-Devices/rust-ur-foundation?branch=dev-v0.1.0#0ae54214)
   Compiling foundation v0.1.0 (/workspace/extmod/foundation-rust)
    Finished release [optimized] target(s) in 9.44s
LINK build-Passport/firmware.elf
Memory region         Used Size  Region Size  %age Used
           FLASH:          0 GB         2 MB      0.00%
       FLASH_ISR:       14928 B       128 KB     11.39%
      FLASH_TEXT:     1676872 B      1662 KB     98.53%
            DTCM:      118664 B       128 KB     90.53%
             RAM:      218872 B       512 KB     41.75%
          RAM_D2:      292080 B       288 KB     99.04%
           SRAM4:       51092 B        64 KB     77.96%
   text	   data	    bss	    dec	    hex	filename
1672004	  19796	 660908	2352708	 23e644	build-Passport/firmware.elf
INFO: this build requires mboot to be installed first
GEN build-Passport/firmware-COLOR.bin
GEN build-Passport/firmware.dfu
GEN build-Passport/firmware.hex
make: Leaving directory '/workspace/ports/stm32'
Built v2.1.2 binary sha256 hash:
08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520  ports/stm32/build-Passport/firmware-COLOR.bin
Expected v2.1.2 build hash:
08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520
ports/stm32/build-Passport/firmware-COLOR.bin: OK
v2.1.2 release binary sha256 hash:
9de833a38931b7e4660e8d0e3ea4a2bfe74924caa1328834e9be9c3d1750cd7e  ../v2.1.2-passport.bin
Expected v2.1.2 release binary hash:
9de833a38931b7e4660e8d0e3ea4a2bfe74924caa1328834e9be9c3d1750cd7e
../v2.1.2-passport.bin: OK
Comparing v2.1.2 stripped release binary hash:
Expected v2.1.2 build hash:
08959d69338eb33ab008ae6e74e111838cc60f39ef17befe401e77d1cc274520
no-header-v2.1.2-passport.bin: OK
Untagged: foundation-devices/passport2:latest
```

which shows this firmware is **reproducible**. Upon updating your device, you
should be shown
`9de833a38931b7e4660e8d0e3ea4a2bfe74924caa1328834e9be9c3d1750cd7e` to be sure
you got the file that we tested.
