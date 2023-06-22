---
title: Coldcard Mk3
appId: coldcardMk3
authors:
- kiwilamb
- leo
- danny
- mohammad
released: 2018-04-01
discontinued: 
updated: 2023-06-19
version: v4.1.8
binaries: https://coldcard.com/downloads/
dimensions:
- 88
- 51
- 9
weight: 30
provider: Coinkite
providerWebsite: https://coinkite.com/
website: https://coldcard.com/
shop: https://store.coinkite.com/store/coldcard
country: CA
price: 147.94USD
repository: https://github.com/Coldcard/firmware
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/340
icon: coldcardMk3.png
bugbounty: https://coinkite.com/responsible-disclosure
meta: discontinued
verdict: nonverifiable
date: 2023-06-22
signer: 
reviewArchive:
- date: 2022-11-25
  version: v4.1.7
  appHash: cc946bcb63211e15d85db577e25ab2432d4a74d5dad77d710539e505dce7914a
  gitRevision: 3c84a7bdc614161e0c52d4a79bc486ec2246ec96
  verdict: nonverifiable
- date: 2022-08-07
  version: v4.1.3
  appHash: d01d81305b209dadcf960b9e9d20affb8d4f11e9f9f916c5a06be29298c80dc2
  gitRevision: 13171e8e87bb975be68995fcba6df43318736de4
  verdict: nonverifiable
- date: 2021-08-14
  version: v4.1.2
  appHash: d01d81305b209dadcf960b9e9d20affb8d4f11e9f9f916c5a06be29298c80dc2
  gitRevision: 13171e8e87bb975be68995fcba6df43318736de4
  verdict: nonverifiable
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

We checked the currently latest binary version 4.1.8 with the provider's own
build instructions for reproducible builds copied into our
[test script]():

```
$ ./scripts/test/hardware/coldCard.sh "2023-06-19T1627-v4.1.8" 3 
...
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt
--- repro-got.txt
+++ repro-want.txt
@@ -41226,7 +41226,7 @@
 000a1850  65 78 69 74 0d 0a 00 52  01 00 4d 69 63 72 6f 50  |exit...R..MicroP|
 000a1860  79 74 68 6f 6e 20 76 31  2e 31 32 2d 31 30 39 33  |ython v1.12-1093|
 000a1870  2d 67 66 33 62 32 61 38  63 32 65 2d 64 69 72 74  |-gf3b2a8c2e-dirt|
-000a1880  79 20 6f 6e 20 32 30 32  33 2d 30 36 2d 32 32 3b  |y on 2023-06-22;|
+000a1880  79 20 6f 6e 20 32 30 32  33 2d 30 36 2d 31 39 3b  |y on 2023-06-19;|
 000a1890  20 43 6f 6c 64 63 61 72  64 20 77 69 74 68 20 53  | Coldcard with S|
 000a18a0  54 4d 33 32 4c 34 78 78  52 47 0d 0a 00 54 79 70  |TM32L4xxRG...Typ|
 000a18b0  65 20 22 68 65 6c 70 28  29 22 20 66 6f 72 20 6d  |e "help()" for m|
@@ -42199,7 +42199,7 @@
 000a5570  68 20 53 54 4d 33 32 4c  34 78 78 52 47 00 76 31  |h STM32L4xxRG.v1|
 000a5580  2e 31 32 2d 31 30 39 33  2d 67 66 33 62 32 61 38  |.12-1093-gf3b2a8|
 000a5590  63 32 65 2d 64 69 72 74  79 20 6f 6e 20 32 30 32  |c2e-dirty on 202|
-000a55a0  33 2d 30 36 2d 32 32 00  31 2e 31 33 2e 30 00 70  |3-06-22.1.13.0.p|
+000a55a0  33 2d 30 36 2d 31 39 00  31 2e 31 33 2e 30 00 70  |3-06-19.1.13.0.p|
 000a55b0  79 62 6f 61 72 64 00 00  64 45 05 08 31 d3 03 08  |yboard..dE..1...|
 000a55c0  1c 4c 05 08 c8 d5 0a 08  e8 3c 05 08 9f 00 00 00  |.L.......<......|
 000a55d0  13 00 00 00 d8 d5 0a 08  ba 00 00 00 c2 2c 00 00  |.............,..|
make: *** [Makefile:279: check-repro] Error 1
+ set +ex

Hash of non-signature parts downloaded/compiled:
fa919d8c18691320b4b2da7d24b7b950422b9c656edef5b5b335a4b69f40ddc1  2023-06-19T1627-v4.1.8-nosig.bin
c58248cf705514c43f19900f3c157a072ff9042721676fa153a09f0266a03239  firmware-nosig.bin

Hash of the signed firmware:
233398cc8f6b9e894072448eb8b8a82a4f546219ce461dd821f0ed0a38b61900  /tmp/firmware/releases/2023-06-19T1627-v4.1.8-coldcard.dfu
528d50abad60843d1ee0a00fc5d6846e1a52a18b349b9752ae300494ef7f508b  /tmp/firmware/stm32/built/firmware-signed.dfu
```

While the diff looks benign - apparently the compilation date ends up in the
binary - this diff means the binary is again not reproducible.
