---
title: Coldcard Mk4
appId: coldcardMk4
authors:
- danny
- leo
- mohammad
released: 2022-05-01
discontinued: 
updated: 2023-04-07
version: v5.1.2
binaries: https://coldcard.com/downloads/
dimensions: 
weight: 
provider: Coinkite
providerWebsite: 
website: https://coinkite.com/
shop: https://store.coinkite.com/store/mk4
country: CA
price: 127USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coldcardMk4.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2023-06-22
signer: 
reviewArchive: 
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

## Product Description 

The ColdCard Mark 4 is CoinKite's latest iteration of the ColdCard series. At the time of this writing, the Mark 4 is still in pre-order. The current product in the series is the {% include walletLink.html wallet='hardware/coldcardMk3' verdict='true' %}. 

Claimed features of the Coldcard Mark 4:

> - USB-C Connector
> - Unlimited Memory, no Bitcoin Transaction size restrictions
> - NFC Tap for all data types, PSBT, Address, etc...
> - Slide Cover
> - Even more security, Dual SE (Secure Elements)
> - Extensive duress PIN optionality
> - Multi-vendor SE
> - USB Virtual Disk mode
> - New 2x secure elements design (multi vendor)
> - New plastic
> - Faster Processor

Specs:

> - Speed: 120 Mhz main CPU (was 80Mhz)
> - Memmory: 840kb + 8M RAM (was only 360kb) - This is where we process transactions.
> - Flash memory: for firmware doubled! (now ~1.5M, was ~700M)
> - Settings memory: now 512kb (was 4kb)
> - PSRAM used instead of flash to hold PSBT and Transaction (faster workspace)
> - Replaceable OLED display (same size, resolution but better supplier)
> - Hardware SHA256 & AES engine (faster encryption/decription)
> - Multi-vendor dual Secure Element [SE] new design (Microchip 608A + )
> - New USB LED flashes when USB is active
> - USB-C connector
> - NFC V capability and exposed trace for permanent disable

Functions: 

> - Unlimited transaction size
> - More multisig wallets possible
> - Firmware upgrade more secure, faster: 15 seconds using USB vs. 2 minutes
> - Nearly same great price when you add inflation!
> - Boots much faster
> - New "trick pins" allow for endless duress labyrinth. Instant wipe or brick or wipe and continue into duress, etc...
> - Sliding case cover protects screen when COLDCARD is hidden and not in use
> - NFC communications integrated
> - USB disk emulation for simple use w/ web browsers and other PSBT sources
> - Bootrom contains anti-chip shouter/glitching protections which reduce timing certainty
> - Countdown to login feature improved: fast wipe
External settings chip removed. Setting now internal to MCU (faster, more space for settings)
> - Kill-key feature: press key N while phishing words shown -> fast wipe+stop (not silent)
> - Debug serial port moved to pins, rather than being virtual over USB

## Reproducibility

We have added the [test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/coldCard.sh)
for ColdCard wallets which is based on the build script that ColdCard provides in their Github.

Here are the test results for the latest version:

```
$ ./scripts/test/hardware/coldCard.sh "2023-04-07T1330-v5.1.2" 4

...

Hash of non-signature parts downloaded/compiled:
254bcf59c776902603f78310160e8edf2573bc7dcb934282acff8561bd9a173f  2023-04-07T1330-v5.1.2-mk4-nosig.bin
254bcf59c776902603f78310160e8edf2573bc7dcb934282acff8561bd9a173f  firmware-nosig.bin

Hash of the signed firmware:
7aefd5bcce533f15337e83618ebbd42925d336792c82a5ca19a430b209b30b8a  /tmp/firmware/releases/2023-04-07T1330-v5.1.2-mk4-coldcard.dfu
390b2cbc4053a1ab7e3949ee83b7d2008ae214e008a8f7a74688989d52de2d27  /tmp/firmware/stm32/built/firmware-signed.dfu
```

which shows this firmware is **reproducible**.
