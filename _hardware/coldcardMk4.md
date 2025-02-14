---
title: Coldcard Mk4
appId: coldcardMk4
authors:
- danny
- leo
- mohammad
- keraliss
released: '2022-05-01'
discontinued: 
updated: '2024-09-12'
version: 'v6.3.4X'
binaries: https://coldcard.com/downloads/
dimensions:
- 86
- 50
- 7.5
weight: 30
provider: Coinkite
providerWebsite: 
website: https://coinkite.com/
shop: https://store.coinkite.com/store/mk4
country: CA
price: 158USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coldcardMk4.png
bugbounty: 
meta: ok
verdict: reproducible
appHashes:
- 681874256bcfca71a3908f1dd6c623804517fdba99a51ed04c73b96119650c13
- 70e375200649ee77723fd816d581fe58e47472e72e7862773658a738685d4336
date: '2025-01-02'
signer: 
reviewArchive:
- date: '2024-10-01'
  version: 'v5.4.0'
  appHashes:
  - 04114bc10eaebf4a7296823561e966bdf871bb8cbbc77617f2f0714c89ff95d5
  gitRevision: d7dc11abaa3b2e7aae9321e66de7eea53a03f064
  verdict: reproducible
- date: '2024-08-15'
  version: 'v5.3.3'
  appHashes:
  - a694b91d546b23584a31d3f4b7b7e9795f788c4b62f4699ef48ff96d0b64eb28
  gitRevision: 8644d08aa08a2187b92322fcd6fa5184ebeba288
  verdict: reproducible
- date: '2023-10-08'
  version: 'v5.1.4'
  appHashes:
  - 4d83715772b31643abde3b9a0bb328003f4a31d14e2fe9c1e038077a518acaea
  gitRevision: f7e12618fa33223fde14fce8c27c4a98833bb15c
  verdict: reproducible
- date: '2023-06-22'
  version: 'v5.1.2'
  appHashes:
  - 7aefd5bcce533f15337e83618ebbd42925d336792c82a5ca19a430b209b30b8a
  gitRevision: 8c8a96cc2119fd85e4a8ffdc88ff2921c0085ed6
  verdict: reproducible
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

**Update 2025-01-02**: There are no binary misnaming for tag 2024-12-18T1413-v6.3.4X. We execute the ws coldcard script:

`$ ./scripts/test/hardware/coldCard.sh 2024-12-18T1413-v6.3.4X mk4`

## Asciicast

{% include asciicast %}

## Results

```
Comparing against: /tmp/checkout/firmware/releases/2024-12-18T1413-v6.3.4X-mk4-coldcard.dfu
test -n "/tmp/checkout/firmware/releases/2024-12-18T1413-v6.3.4X-mk4-coldcard.dfu" -a -f /tmp/checkout/firmware/releases/2024-12-18T1413-v6.3.4X-mk4-coldcard.dfu
rm -f -f check-fw.bin check-bootrom.bin
signit split /tmp/checkout/firmware/releases/2024-12-18T1413-v6.3.4X-mk4-coldcard.dfu check-fw.bin check-bootrom.bin
start 293 for 1019904 bytes: Firmware => check-fw.bin
signit check check-fw.bin
     magic_value: 0xcc001234
       timestamp: 2024-12-18 14:13:24 UTC
  version_string: 6.3.4X
      pubkey_num: 1
 firmware_length: 1019904
   install_flags: 0x0 =>
       hw_compat: 0x8 => Mk4
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: a37f1b7beaa0d909 ... 88ae154bc3985a7f
sha256^2: 7ee1d6c1db34de1a62921b37084be3c4aa281a8a4cfb4c00a7e660b0f2e62176
 ECDSA Signature: CORRECT
signit check firmware-signed.bin
     magic_value: 0xcc001234
       timestamp: 2025-01-02 12:51:33 UTC
  version_string: 6.3.4X
      pubkey_num: 0
 firmware_length: 1019904
   install_flags: 0x0 =>
       hw_compat: 0x8 => Mk4
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: db2c99f664733d45 ... c84de5e40b9c24c8
sha256^2: 0f7711afe9af96ed22baa918c104eb0e2ce655933cb88a32e4cce4654290113b
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 
```

The most pertinent part of the review:

```
You have built a bit-for-bit identical copy of Coldcard firmware for v6.3.4X
+ set +ex

Hash of non-signature parts downloaded/compiled:
31f40650460d4d3537c4a6676810de4ea5c4d6878a7a4fc7c22584ccc829b997  2024-12-18T1413-v6.3.4X-mk4-nosig.bin
31f40650460d4d3537c4a6676810de4ea5c4d6878a7a4fc7c22584ccc829b997  firmware-nosig.bin

Hash of the signed firmware:
681874256bcfca71a3908f1dd6c623804517fdba99a51ed04c73b96119650c13  /tmp/firmware/releases/2024-12-18T1413-v6.3.4X-mk4-coldcard.dfu
70e375200649ee77723fd816d581fe58e47472e72e7862773658a738685d4336  /tmp/firmware/stm32/built/firmware-signed.dfu
```

ColdCard advertises its products as verifiable, we can confirm that firmware version: 2024-12-18T1413-v6.3.4X is **reproducible**.

# Old Analysis

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

>>>>>>> c5fd94bf4c89189529bbb9a0265239acf4f53f35
