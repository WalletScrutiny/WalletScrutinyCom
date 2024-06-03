---
title: Foundation Passport
appId: passportb2
authors:
- kiwilamb
- leo
- '@sethforprivacy'
- danny
released: 2022-03-10
discontinued: 
updated: 2024-05-28
version: v2.3.1
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
date: 2024-05-31
signer: 
reviewArchive:
- date: 2023-06-20
  version: v2.1.2
  appHash: 9de833a38931b7e4660e8d0e3ea4a2bfe74924caa1328834e9be9c3d1750cd7e
  gitRevision: 1b1de26f9dcadf889a665f5650ee2656cb0a4206
  verdict: reproducible
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
  
* version: 2.3.1
* model: color
* build fingerprint: b435743783951ebecbf50bf2666a01039db2e573ce507835fa15bc33608fc40f
* release fingerprint: ff64ad2fcc0d72c626e1a9885a3de224d0d3f2e78f4de19fc166f1f4e91e1464

The fingerprints can be found on the [release page](https://github.com/Foundation-Devices/passport2/releases).

```
$ ./scripts/test/hardware/passport.sh 2.3.1 color b435743783951ebecbf50bf2666a01039db2e573ce507835fa15bc33608fc40f ff64ad2fcc0d72c626e1a9885a3de224d0d3f2e78f4de19fc166f1f4e91e1464

...

Compiling foundation v0.1.0 (/workspace/extmod/foundation-rust)
    Finished release [optimized] target(s) in 9.29s
LINK build-Passport/firmware.elf
Memory region         Used Size  Region Size  %age Used
           FLASH:     1668340 B      1662 KB     98.03%
            DTCM:      118664 B       128 KB     90.53%
             RAM:      217536 B       512 KB     41.49%
          RAM_D2:      292080 B       288 KB     99.04%
           SRAM4:       51092 B        64 KB     77.96%
   text	   data	    bss	    dec	    hex	filename
1648520	  19812	 659548	2327880	 238548	build-Passport/firmware.elf
INFO: this build requires mboot to be installed first
GEN build-Passport/firmware-COLOR.bin
GEN build-Passport/firmware.dfu
GEN build-Passport/firmware.hex
make: Leaving directory '/workspace/ports/stm32'
Built v2.3.1 binary sha256 hash:
b435743783951ebecbf50bf2666a01039db2e573ce507835fa15bc33608fc40f  ports/stm32/build-Passport/firmware-COLOR.bin
Expected v2.3.1 build hash:
b435743783951ebecbf50bf2666a01039db2e573ce507835fa15bc33608fc40f
ports/stm32/build-Passport/firmware-COLOR.bin: OK
v2.3.1 release binary sha256 hash:
ff64ad2fcc0d72c626e1a9885a3de224d0d3f2e78f4de19fc166f1f4e91e1464  ../v2.3.1-passport.bin
Expected v2.3.1 release binary hash:
ff64ad2fcc0d72c626e1a9885a3de224d0d3f2e78f4de19fc166f1f4e91e1464
../v2.3.1-passport.bin: OK
Comparing v2.3.1 stripped release binary hash:
Expected v2.3.1 build hash:
b435743783951ebecbf50bf2666a01039db2e573ce507835fa15bc33608fc40f
no-header-v2.3.1-passport.bin: OK

```

which shows this firmware is **reproducible**. Upon updating your device, you
should be shown
`ff64ad2fcc0d72c626e1a9885a3de224d0d3f2e78f4de19fc166f1f4e91e1464` to be sure
you got the file that we tested.

{% include asciicast %}
