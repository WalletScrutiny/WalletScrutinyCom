---
title: Coldcard Mk4
appId: coldcardMk4
authors:
- danny
- leo
- mohammad
released: 2022-05-01
discontinued: 
updated: 2024-09-12
version: v5.4.0
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
date: 2024-10-01
signer: 
reviewCurrent:
- date: 2024-10-01
  version: v5.4.0
  appHashes: [04114bc10eaebf4a7296823561e966bdf871bb8cbbc77617f2f0714c89ff95d5]
  verdict: reproducible
reviewArchive:
- date: 2024-08-15
  version: v5.3.3
  appHashes: [a694b91d546b23584a31d3f4b7b7e9795f788c4b62f4699ef48ff96d0b64eb28]
  gitRevision: 8644d08aa08a2187b92322fcd6fa5184ebeba288
  verdict: reproducible
- date: 2023-10-08
  version: v5.1.4
  appHashes: [4d83715772b31643abde3b9a0bb328003f4a31d14e2fe9c1e038077a518acaea]
  gitRevision: f7e12618fa33223fde14fce8c27c4a98833bb15c
  verdict: reproducible
- date: 2023-06-22
  version: v5.1.2
  appHashes: [7aefd5bcce533f15337e83618ebbd42925d336792c82a5ca19a430b209b30b8a]
  gitRevision: 8c8a96cc2119fd85e4a8ffdc88ff2921c0085ed6
  verdict: reproducible
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

**Update 2024-10-01**: There are no binary misnaming for tag 2024-09-12T1734-v5.4.0. We execute the ws coldcard script:

`$ ./scripts/test/hardware/coldCard.sh 2024-09-12T1734-v5.4.0 mk4`

## Asciicast

{% include asciicast %}

## Results

```
Comparing against: /tmp/checkout/firmware/releases/2024-09-12T1734-v5.4.0-mk4-coldcard.dfu
test -n "/tmp/checkout/firmware/releases/2024-09-12T1734-v5.4.0-mk4-coldcard.dfu" -a -f /tmp/checkout/firmware/releases/2024-09-12T1734-v5.4.0-mk4-coldcard.dfu
rm -f -f check-fw.bin check-bootrom.bin
signit split /tmp/checkout/firmware/releases/2024-09-12T1734-v5.4.0-mk4-coldcard.dfu check-fw.bin check-bootrom.bin
start 293 for 942080 bytes: Firmware => check-fw.bin
signit check check-fw.bin
     magic_value: 0xcc001234
       timestamp: 2024-09-12 17:34:31 UTC
  version_string: 5.4.0
      pubkey_num: 1
 firmware_length: 942080
   install_flags: 0x0 =>
       hw_compat: 0x8 => Mk4
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: 895ad7fd1c7cf46b ... 172be2679b6db566
sha256^2: 120e84880289f61c9eae0fe5182a180425ed7bea9016ee3c836e5481ef77ba92
 ECDSA Signature: CORRECT
signit check firmware-signed.bin
     magic_value: 0xcc001234
       timestamp: 2024-10-01 01:25:37 UTC
  version_string: 5.4.0
      pubkey_num: 0
 firmware_length: 942080
   install_flags: 0x0 =>
       hw_compat: 0x8 => Mk4
         best_ts: b'\x00\x00\x00\x00\x00\x00\x00\x00'
          future: 0000000000000000 ... 0000000000000000
       signature: c0fbe3997d069c18 ... bfbedea87fa85475
sha256^2: 5a2923ba8f4059143f194d405289e6dbe4ead833c4698743b07a9f2381d6b1ec
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 
```

The most pertinent part of the review:

```
You have built a bit-for-bit identical copy of Coldcard firmware for v5.4.0
+ set +ex

Hash of non-signature parts downloaded/compiled:
04114bc10eaebf4a7296823561e966bdf871bb8cbbc77617f2f0714c89ff95d5  2024-09-12T1734-v5.4.0-mk4-nosig.bin
04114bc10eaebf4a7296823561e966bdf871bb8cbbc77617f2f0714c89ff95d5  firmware-nosig.bin

Hash of the signed firmware:
237cfcb3fdf9217550eae1d9ea6fc828c1c8d09470bd60c9f72f9b00a3bb2d11  /tmp/firmware/releases/2024-09-12T1734-v5.4.0-mk4-coldcard.dfu
4ca2a537cb0cd2ffb1227bd7b6bd19f9c3ec1f510d4a743dd1bafe1ee860ff56  /tmp/firmware/stm32/built/firmware-signed.dfu
```



ColdCard advertises its products as verifiable, we can confirm that firmware version: 2024-09-12T1734-v5.4.0 is **reproducible**.
