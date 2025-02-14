---
title: Foundation Passport
appId: passportb2
authors:
- kiwilamb
- leo
- '@sethforprivacy'
- danny
- keraliss
released: '2022-03-10'
discontinued: 
updated: '2024-08-10'
version: 'v2.3.5'
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
appHashes:
- 714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2
date: '2024-10-30'
signer: 
reviewArchive:
- date: '2024-10-16'
  version: 'v2.3.4'
  appHashes:
  - 7e13d43e9c848dd3e31c16abb93e6e47999d6e7cf1d38458e54e1980ed4c23d6
  gitRevision: d808a307a778663b0d3a866255c16233f4e8d8fa
  verdict: reproducible
- date: '2024-09-11'
  version: 'v2.3.2'
  appHashes:
  - ff64ad2fcc0d72c626e1a9885a3de224d0d3f2e78f4de19fc166f1f4e91e1464
  gitRevision: 592fc9503ff708d2a9179890946ddce6c8aea83e
  verdict: reproducible
- date: '2024-05-31'
  version: 'v2.3.1'
  appHashes:
  - ff64ad2fcc0d72c626e1a9885a3de224d0d3f2e78f4de19fc166f1f4e91e1464
  gitRevision: 592fc9503ff708d2a9179890946ddce6c8aea83e
  verdict: reproducible
- date: '2023-06-20'
  version: 'v2.1.2'
  appHashes:
  - 9de833a38931b7e4660e8d0e3ea4a2bfe74924caa1328834e9be9c3d1750cd7e
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
  
* version: 2.3.5
* model: color
* build fingerprint: 714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2 
* release fingerprint: d3bf923a1f5de18f70a16fc0c93a00a44d1e9d3bef8e198b668a928a5190797c

The fingerprints can be found on the [release page](https://github.com/Foundation-Devices/passport2/releases).

```
$ ./scripts/test/hardware/passport.sh 2.3.5 color 714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2 d3bf923a1f5de18f70a16fc0c93a00a44d1e9d3bef8e198b668a928a5190797c

...

LINK build-Passport/firmware.elf
Memory region         Used Size  Region Size  %age Used
           FLASH:     1554024 B      1662 KB     91.31%
            DTCM:      118664 B       128 KB     90.53%
             RAM:      217392 B       512 KB     41.46%
          RAM_D2:      292080 B       288 KB     99.04%
           SRAM4:       51092 B        64 KB     77.96%
   text    data     bss     dec     hex filename
1534200   19816  659404 2213420  21c62c build-Passport/firmware.elf
INFO: this build requires mboot to be installed first
GEN build-Passport/firmware-COLOR.bin
GEN build-Passport/firmware.dfu
GEN build-Passport/firmware.hex
make: Leaving directory '/workspace/ports/stm32'
Built v2.3.5 binary sha256 hash:
714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2  ports/stm32/build-Passport/firmware-COLOR.bin
Expected v2.3.5 build hash:
714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2
ports/stm32/build-Passport/firmware-COLOR.bin: OK
v2.3.5 release binary sha256 hash:
d3bf923a1f5de18f70a16fc0c93a00a44d1e9d3bef8e198b668a928a5190797c  ../v2.3.5-passport.bin
Expected v2.3.5 release binary hash:
d3bf923a1f5de18f70a16fc0c93a00a44d1e9d3bef8e198b668a928a5190797c
../v2.3.5-passport.bin: OK
Comparing v2.3.5 stripped release binary hash:
Expected v2.3.5 build hash:
714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2
no-header-v2.3.5-passport.bin: OK



```

1. The built binary's sha256 hash matches the expected build hash. -> 714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2 
2. The sha256 hash of the release binary, matches the expected hash. -> d3bf923a1f5de18f70a16fc0c93a00a44d1e9d3bef8e198b668a928a5190797c
3. Both the stripped release binary and the built binary have matching hashes. -> 714e6fc84664c206984d995e1630e360cba18d96ea4d17ffa577f95e89659ed2 

The verification process successfully proves that the firmware for v2.3.4 is **reproducible**. 

Upon updating your device, you should be shown
`d3bf923a1f5de18f70a16fc0c93a00a44d1e9d3bef8e198b668a928a5190797c` to be sure you got the file that we tested.
