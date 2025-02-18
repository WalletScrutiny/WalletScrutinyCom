---
title: Coldcard Q
appId: coldcardQ1
authors:
- danny
- keraliss
released: 2024-02-08
discontinued: 
updated: 2024-09-12
version: v1.3.0Q
binaries: https://coldcard.com/downloads/
dimensions:
- 120
- 75
- 22
weight: 93
provider: Coinkite, Inc.
providerWebsite: https://coinkite.com
website: https://coldcard.com/docs/coldcard-q/
shop: https://store.coinkite.com/store/cc-q1
country: CA
price: 219.99USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coldcardQ1.png
bugbounty: 
meta: ok
verdict: reproducible
appHashes:
- cb23d9c1ace86724de450893239773e711f9c68486cd7d08fc6e4da5db1cc2b3
date: 2024-11-05
signer: d840fa4e83ebc7b0f961f30f68d795bed61271e2314dda4ab0eb0b8bfe7192f4
reviewArchive:
- date: 2024-08-12
  version: 1.2.3Q
  appHashes:
  - 54da941c8df84fcb84adcc62fdd3ee97d1fc12e2a9a648551ca614fcbacade3f
  gitRevision: 0eae1408092d9dc6c7c7d4ad328c4f32fa968325
  verdict: reproducible
- date: 2024-05-31
  version: 1.2.1Q
  appHashes:
  - 90b1edfbe194b093258f9cda8f4add4aa3317e9ea205ff35914da7d91410fdae
  gitRevision: f75bca706d73b85a627828802bc757f705bd9921
  verdict: reproducible
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
- https://www.linkedin.com/company/coinkite
- https://www.facebook.com/CoinKite
features: 

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/bpV-lrXoZao?si=t1LVbNO5BD18jP_s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Product Description 

## [View the Official Documentation](https://coldcard.com/docs/coldcard-q/)
  > - The Q uses exactly the same security model as the Mk4 COLDCARD, with dual multi-vendor secure elements.
  > - QWERTY Keyboard: ideal for long BIP-39 passphrases.
  > - 320x240 pixel LCD screen, 3.2" diagonal size. Four times Mk4 size.
  > - Battery powered by 3x AAA cells (or USB). Airgapped and/or wireless!
  > - Dual MicroSD slots (push-pull type, not spring loaded).
  > - QR Code scanner done right™, with LED illumination and advanced scanning algorithms and serial interface.
  > - NFC communication, like Mk4
  > - Includes internal storage for spare MicroSD cards.
  > - USB data & NFC data can be irreversibly blocked, by cutting a PCB trace: it permanently disable USB data and/or NFC data.
  > - Specifically, the COLDCARD uses Microchip's ATECC608 and Maxim's DS28C36B, to store the critical master secret: the 24-word seed phrase for your BIP39 wallet.
  > - During boot-up, the firmware's signature, and nearly every byte of flash memory, will be verified and the appropriate Green/Red light set.
  > - The PIN code on COLDCARD is divided into two parts, such as 1234-5678. You first enter 1234 and then you will be shown two words on-screen. Those words are unique for all PIN prefixes, and for each COLDCARD ever made.
  > - You may define an optional "duress PIN code". If anyone enters that PIN code, instead of the "real" PIN code, nothing special is shown on the screen and everything operates as normal... However, the bitcoin key generated is not the main key. It is effectively a completely separate wallet 

## Analysis 

It passes all criteria:

### 1. Private keys can be created offline ✅ 

> COLDCARD never needs to touch a computer. It can work entirely from a USB power pack or AC power adapter.

### 2. Private keys are not shared ✅ 

> If you don't trust our random number generator, you can generate the BIP39 seed phrase using dice rolls. We help with this process: you just have to press 1–6 for each roll (99 rolls recommended). At the end of that process, you'll have a properly-encoded seed phrase based solely on the dice rolls.

### 3. Device displays receive address for confirmation ✅

> Yes. See documentation [here](https://coldcard.com/docs/q-quick/).

### 4. Interface ✅

  - 320x240 LCD screen   
  - QWERTY keyboard

# 5. Reproducibility

## Version 1.3.0

Using the WalletScrutiny script for coldcard, we execute:

`./scripts/test/hardware/coldCard.sh "2024-09-12T1733-v1.3.0Q" q1`

The results are: 

```
Comparing against: /tmp/checkout/firmware/releases/2024-09-12T1733-v1.3.0Q-q1-coldcard.dfu
test -n "/tmp/checkout/firmware/releases/2024-09-12T1733-v1.3.0Q-q1-coldcard.dfu" -a -f /tmp/checkout/firmware/releases/2024-09-12T1733-v1.3.0Q-q1-coldcard.dfu
rm -f -f check-fw.bin check-bootrom.bin
signit split /tmp/checkout/firmware/releases/2024-09-12T1733-v1.3.0Q-q1-coldcard.dfu check-fw.bin check-bootrom.bin
start 293 for 999424 bytes: Firmware => check-fw.bin
signit check check-fw.bin
     magic_value: 0xcc001234
       timestamp: 2024-09-12 17:33:19 UTC
  version_string: 1.3.0Q
      pubkey_num: 1
 firmware_length: 999424
   install_flags: 0x0 =>
       hw_compat: 0x10 => Q1
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: a8057cb84b516a15 ... 62c950ec9d0701ef
sha256^2: 81b875ba1978bf174a730ee689e99bc324309da9906392ff711f3c767f8bb45d
 ECDSA Signature: CORRECT
signit check firmware-signed.bin
     magic_value: 0xcc001234
       timestamp: 2024-11-01 08:16:11 UTC
  version_string: 1.3.0Q
      pubkey_num: 0
 firmware_length: 999424
   install_flags: 0x0 =>
       hw_compat: 0x10 => Q1
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: cd16a2ccb766fa3e ... f277e921ba12ced6
sha256^2: 1dd258d52606ca8ee3d3a0dc03ab95e560839e8325f0e08546ba0358556b6f33
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 

You have built a bit-for-bit identical copy of Coldcard firmware for v1.3.0Q
+ set +ex

Hash of non-signature parts downloaded/compiled:
cb23d9c1ace86724de450893239773e711f9c68486cd7d08fc6e4da5db1cc2b3  2024-09-12T1733-v1.3.0Q-q1-nosig.bin
cb23d9c1ace86724de450893239773e711f9c68486cd7d08fc6e4da5db1cc2b3  firmware-nosig.bin

Hash of the signed firmware:
d840fa4e83ebc7b0f961f30f68d795bed61271e2314dda4ab0eb0b8bfe7192f4  /tmp/firmware/releases/2024-09-12T1733-v1.3.0Q-q1-coldcard.dfu
216b52dc37773caedc43407db29f2b4ee05f7c3ba8c730a7e01ef8007c308aff  /tmp/firmware/stm32/built/firmware-signed.dfu
```

1. The hash of the non-signature parts match.
2. The signature of the signed firmware matches the one [here.](https://github.com/search?q=%222024-09-12T1733-v1.3.0Q-q1-coldcard.dfu%22&ref=opensearch&type=code)

The matching hashes of both the downloaded and compiled firmware for version 1.3.0 for the Q1 indicates that version 1.3.0 of the {{ page.title }} is **reproducible**

{% include asciicast %}


