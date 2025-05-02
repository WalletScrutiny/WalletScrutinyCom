---
title: Coldcard Q
appId: coldcardQ1
authors:
- danny
- keraliss
released: 2024-02-08
discontinued: 
updated: 2025-02-13
version: v1.3.1Q
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
price: 239.99USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coldcardQ1.png
bugbounty: 
meta: ok
verdict: reproducible
appHashes:
- 8f53880cde1b58a18e1b3166394a7e19e51866357ed2cbcf0aaa4dbbb9d17edc
- 2e1aad0a7a3ceb84db34322b54855a0c5496699e46e53606bfa443fcc992adec
- b7f961a8dd9a957d532da1e98b411b790fc25187c5d58f72380faaba129ca1b1
date: 2025-02-21
signer: d840fa4e83ebc7b0f961f30f68d795bed61271e2314dda4ab0eb0b8bfe7192f4
reviewArchive:
- date: 2024-11-05
  version: 1.3.0Q
  appHashes:
  - cb23d9c1ace86724de450893239773e711f9c68486cd7d08fc6e4da5db1cc2b3
  gitRevision: 934a9ec154a8225ff3bcb838078318deab3ff6c4
  verdict: reproducible
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

## Reproducibility Verification for version 1.3.1Q

To test, we run our [coldcard script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/coldCard.sh):

`./scripts/test/hardware/coldCard.sh "2025-02-13T1413-v1.3.1Q" q1`

## Results

```
Comparing against: /tmp/checkout/firmware/releases/2025-02-13T1413-v1.3.1Q-q1-coldcard.dfu
test -n "/tmp/checkout/firmware/releases/2025-02-13T1413-v1.3.1Q-q1-coldcard.dfu" -a -f /tmp/checkout/firmware/releases/2025-02-13T1413-v1.3.1Q-q1-coldcard.dfu
rm -f -f check-fw.bin check-bootrom.bin
signit split /tmp/checkout/firmware/releases/2025-02-13T1413-v1.3.1Q-q1-coldcard.dfu check-fw.bin check-bootrom.bin
start 293 for 1003520 bytes: Firmware => check-fw.bin
signit check check-fw.bin
     magic_value: 0xcc001234
       timestamp: 2025-02-13 14:13:56 UTC
  version_string: 1.3.1Q
      pubkey_num: 1
 firmware_length: 1003520
   install_flags: 0x0 =>
       hw_compat: 0x10 => Q1
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: ebab7d0b5609925b ... 9856a885e551ccc6
sha256^2: 541d06eb9d75c5ff66631b1160e2a683d6844587896420745ae44943273bd74e
 ECDSA Signature: CORRECT
signit check firmware-signed.bin
     magic_value: 0xcc001234
       timestamp: 2025-02-21 01:49:11 UTC
  version_string: 1.3.1Q
      pubkey_num: 0
 firmware_length: 1003520
   install_flags: 0x0 =>
       hw_compat: 0x10 => Q1
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: 2398e4c30c9f426f ... fc6521a7cf3f4de7
sha256^2: 8f53880cde1b58a18e1b3166394a7e19e51866357ed2cbcf0aaa4dbbb9d17edc
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 

You have built a bit-for-bit identical copy of Coldcard firmware for v1.3.1Q
```

Now we compare the hashes:

```
Hash of non-signature parts downloaded/compiled:
b7f961a8dd9a957d532da1e98b411b790fc25187c5d58f72380faaba129ca1b1  2025-02-13T1413-v1.3.1Q-q1-nosig.bin
b7f961a8dd9a957d532da1e98b411b790fc25187c5d58f72380faaba129ca1b1  firmware-nosig.bin

Hash of the signed firmware:
2e1aad0a7a3ceb84db34322b54855a0c5496699e46e53606bfa443fcc992adec  /tmp/firmware/releases/2025-02-13T1413-v1.3.1Q-q1-coldcard.dfu
2936d7b3219dc432f8afe147242ecc23e0901d18007dc38f6760774b80602878  /tmp/firmware/stm32/built/firmware-signed.dfu
```

## Conclusion

The script clones the firmware repository, builds it in a Docker container, and compares it with the downloaded firmware. The matching hashes (b7f961a8dd9a957d532da1e98b411b790fc25187c5d58f72380faaba129ca1b1) show that the non-signature parts of both the downloaded and compiled firmware are identical.

The hashes represent the binary content of the firmware without signatures (nosig.bin files), while the different hashes for the signed firmware (.dfu files) are expected since they contain different signatures but the same underlying code.

The stripped built firmware for version 1.3.1Q matches with the stripped downloaded firmware. 

Version 1.3.1Q is **reproducible**.

## Hashes explained:

- 8f53880cde1b58a18e1b3166394a7e19e51866357ed2cbcf0aaa4dbbb9d17edc # hash shown on device (sha256^2)
- 2e1aad0a7a3ceb84db34322b54855a0c5496699e46e53606bfa443fcc992adec # hash of signed binary
- b7f961a8dd9a957d532da1e98b411b790fc25187c5d58f72380faaba129ca1b1 # hash of stripped binary


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

