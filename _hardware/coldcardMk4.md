---
title: Coldcard Mk4
appId: coldcardMk4
authors:
- danny
- leo
- mohammad
- keraliss
released: 2022-05-01
discontinued: 
updated: 2025-02-13
version: v5.4.1
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
- 495f37ce7ddaba2e9fc3f03dec582f1646f258a3d0cec5e71c04d127357b2fa3
- f1ce1958911b741ec29bf1a0de46f146acd6dda37c5c6496fa05b81e40551964
date: 2025-02-28
signer: 
reviewArchive:
- date: 2025-02-21
  version: v5.4.1
  appHashes:
  - eb750a4f095eacc6133b2c8b38fe0738a22b2496a6cdf423ca865acde8c9bc4e
  - ab115260a6bd8728f1e81cf27b4dad8d6947b496abaa7810e89fe484c273fb94
  gitRevision: a6d663b6ee707729b2258fd460fbfe3bdab91223
  verdict: reproducible
- date: 2024-01-02
  version: v6.3.4X
  appHashes:
  - 681874256bcfca71a3908f1dd6c623804517fdba99a51ed04c73b96119650c13
  - 70e375200649ee77723fd816d581fe58e47472e72e7862773658a738685d4336
  gitRevision: a6d663b6ee707729b2258fd460fbfe3bdab91223
  verdict: reproducible
- date: 2024-10-01
  version: v5.4.0
  appHashes:
  - 04114bc10eaebf4a7296823561e966bdf871bb8cbbc77617f2f0714c89ff95d5
  gitRevision: d7dc11abaa3b2e7aae9321e66de7eea53a03f064
  verdict: reproducible
- date: 2024-08-15
  version: v5.3.3
  appHashes:
  - a694b91d546b23584a31d3f4b7b7e9795f788c4b62f4699ef48ff96d0b64eb28
  gitRevision: 8644d08aa08a2187b92322fcd6fa5184ebeba288
  verdict: reproducible
- date: 2023-10-08
  version: v5.1.4
  appHashes:
  - 4d83715772b31643abde3b9a0bb328003f4a31d14e2fe9c1e038077a518acaea
  gitRevision: f7e12618fa33223fde14fce8c27c4a98833bb15c
  verdict: reproducible
- date: 2023-06-22
  version: v5.1.2
  appHashes:
  - 7aefd5bcce533f15337e83618ebbd42925d336792c82a5ca19a430b209b30b8a
  gitRevision: 8c8a96cc2119fd85e4a8ffdc88ff2921c0085ed6
  verdict: reproducible
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

> "Edge" for the Coldcard Mk4 refers to an experimental firmware build available on the Coldcard downloads page. This version includes the latest, cutting‐edge features and improvements that are still under testing and refinement, so while it offers early access to new functionalities, it may be less stable than the official, fully vetted firmware releases. Users opting for Edge firmware should be comfortable with potential bugs or issues and ideally back up their data before updating.

## Update for Stable Version: 2025-02-20: 

The stable release v5.4.1 is the most recent, we would be reviewing that next.

`$ ./scripts/test/hardware/coldCard.sh 2025-02-13T1415-v5.4.1 mk4`

## Asciicast

{% include asciicast %}

## Results

```
Comparing against: /tmp/checkout/firmware/releases/2025-02-13T1415-v5.4.1-mk4-coldcard.dfu
test -n "/tmp/checkout/firmware/releases/2025-02-13T1415-v5.4.1-mk4-coldcard.dfu" -a -f /tmp/checkout/firmware/releases/2025-02-13T1415-v5.4.1-mk4-coldcard.dfu
rm -f -f check-fw.bin check-bootrom.bin
signit split /tmp/checkout/firmware/releases/2025-02-13T1415-v5.4.1-mk4-coldcard.dfu check-fw.bin check-bootrom.bin
start 293 for 946176 bytes: Firmware => check-fw.bin
signit check check-fw.bin
     magic_value: 0xcc001234
       timestamp: 2025-02-13 14:15:12 UTC
  version_string: 5.4.1
      pubkey_num: 1
 firmware_length: 946176
   install_flags: 0x0 =>
       hw_compat: 0x8 => Mk4
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: 54e7700b0cdb7335 ... 485a15f8541651f1
sha256^2: bea8bcb9e77c8afd8640ffe588eb3930e14c11d0374cf90f22b23d5b167eb749
 ECDSA Signature: CORRECT
signit check firmware-signed.bin
     magic_value: 0xcc001234
       timestamp: 2025-02-20 01:25:38 UTC
  version_string: 5.4.1
      pubkey_num: 0
 firmware_length: 946176
   install_flags: 0x0 =>
       hw_compat: 0x8 => Mk4
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: 5dca3ba5407acaa9 ... 259c0c79fc3dea36
sha256^2: 1084c2e4ad8ae1fbcd0b315a97bd935685f1a61b4a2b37283abf4a51ca47baa7
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 

You have built a bit-for-bit identical copy of Coldcard firmware for v5.4.1
```

The most pertinent portion of the results:

```
You have built a bit-for-bit identical copy of Coldcard firmware for v5.4.1
+ set +ex

Hash of non-signature parts downloaded/compiled:
34b52b568f74cae05e12c54576422f962be8d9cbc04d1bea2e568d572281430d  2025-02-13T1415-v5.4.1-mk4-nosig.bin
34b52b568f74cae05e12c54576422f962be8d9cbc04d1bea2e568d572281430d  firmware-nosig.bin

Hash of the signed firmware:
eb750a4f095eacc6133b2c8b38fe0738a22b2496a6cdf423ca865acde8c9bc4e  /tmp/firmware/releases/2025-02-13T1415-v5.4.1-mk4-coldcard.dfu
ab115260a6bd8728f1e81cf27b4dad8d6947b496abaa7810e89fe484c273fb94  /tmp/firmware/stm32/built/firmware-signed.dfu
```

We see that the stripped hashes of both the downloaded and compiled firmware for version 5.4.1 for the MK4 indicates that version 5.4.1 of the {{ page.title }} is **reproducible**.

## Update for Edge Version: 2025-02-28: 

The Edge release v6.3.5X is the most recent, we would be reviewing that next. 

`$ ./scripts/test/hardware/coldCard.sh 2025-02-19T1941-v6.3.5X mk4`

## Results

```
Comparing against: /tmp/checkout/firmware/releases/2025-02-19T1941-v6.3.5X-mk4-coldcard.dfu
test -n "/tmp/checkout/firmware/releases/2025-02-19T1941-v6.3.5X-mk4-coldcard.dfu" -a -f /tmp/checkout/firmware/releases/2025-02-19T1941-v6.3.5X-mk4-coldcard.dfu
rm -f -f check-fw.bin check-bootrom.bin
signit split /tmp/checkout/firmware/releases/2025-02-19T1941-v6.3.5X-mk4-coldcard.dfu check-fw.bin check-bootrom.bin
start 293 for 1024000 bytes: Firmware => check-fw.bin
signit check check-fw.bin
     magic_value: 0xcc001234
       timestamp: 2025-02-19 19:41:15 UTC
  version_string: 6.3.5X
      pubkey_num: 1
 firmware_length: 1024000
   install_flags: 0x0 =>
       hw_compat: 0x8 => Mk4
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: 48197eddbc96d537 ... 7ff249b6e1533d93
sha256^2: 0b408d520f4da3274d0e3c07d4a989d5c73ddd9f9d08c25105d6bcce69f79b4f
 ECDSA Signature: CORRECT
signit check firmware-signed.bin
     magic_value: 0xcc001234
       timestamp: 2025-02-28 13:42:46 UTC
  version_string: 6.3.5X
      pubkey_num: 0
 firmware_length: 1024000
   install_flags: 0x0 =>
       hw_compat: 0x8 => Mk4
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: 39bf84a085064d84 ... 6c8b6a2da0cf2551
sha256^2: 88a6ab588285b8577520f8ec261eeed0155cb0f4a81b1f593d85883d34bdc24d
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 

You have built a bit-for-bit identical copy of Coldcard firmware for v6.3.5X
```

The most pertinent portion of the results:
```
You have built a bit-for-bit identical copy of Coldcard firmware for v6.3.5X
+ set +ex

Hash of non-signature parts downloaded/compiled:
d2deaa515a959048cffe46ce7f97947c5f93066197a694861b1e530dda650273  2025-02-19T1941-v6.3.5X-mk4-nosig.bin
d2deaa515a959048cffe46ce7f97947c5f93066197a694861b1e530dda650273  firmware-nosig.bin

Hash of the signed firmware:
495f37ce7ddaba2e9fc3f03dec582f1646f258a3d0cec5e71c04d127357b2fa3  /tmp/firmware/releases/2025-02-19T1941-v6.3.5X-mk4-coldcard.dfu
f1ce1958911b741ec29bf1a0de46f146acd6dda37c5c6496fa05b81e40551964  /tmp/firmware/stm32/built/firmware-signed.dfu
```

We see that the stripped hashes of both the downloaded and compiled firmware for version 6.3.5X for the MK4 indicates that version 6.3.5X of the {{ page.title }} is **reproducible**.



The [coldcard.sh script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/coldCard.sh) strips the signature section that appears in the address range **0x3f800-0x3ff00** (which is near the end of the firmware), effectively removing the signature header while preserving the actual firmware code for comparison. The firmware starts at byte 293 while the total firmware size is 946,176 bytes.


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
