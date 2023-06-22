---
title: Coldcard Mk3
appId: coldcardMk3
authors:
- kiwilamb
- leo
- danny
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
  gitRevision: 3ad740fdfe46e5acb1f18451ce8b07e91c409edc
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

**Update 2023-06-22**: We tested v4.1.8 and still got the same result as v4.1.7.

We checked the currently latest binary version 4.1.7 with the provider's own
build instructions for reproducible builds. Here is our result:

```
$ git clone https://github.com/Coldcard/firmware.git
$ cd firmware/stm32
$ cp path/to/2022-11-14T1854-v4.1.7-coldcard.dfu ../releases/
$ sha256sum ../releases/*.dfu
cc946bcb63211e15d85db577e25ab2432d4a74d5dad77d710539e505dce7914a  ../releases/2022-11-14T1854-v4.1.7-coldcard.dfu
$ git checkout 2022-11-14T1854-v4.1.7
$ make repro
...
+ make check-repro
./make_filetime.py COLDCARD/file_time.c 4.1.7
==> COLDCARD/file_time.c already version 4.1.7; not changing it
cd ../external/micropython/ports/stm32 && make BOARD=COLDCARD -j 4 EXCLUDE_NGU_TESTS=1
make[1]: Entering directory '/tmp/checkout/firmware/external/micropython/ports/stm32'
Use make V=1 or set BUILD_VERBOSE in your environment to increase build verbosity.
Including User C Module from boards/COLDCARD/c-modules/aes256ctr
Including User C Module from boards/COLDCARD/c-modules/libngu
Including User C Module from boards/COLDCARD/c-modules/mpy-qr
make[1]: Leaving directory '/tmp/checkout/firmware/external/micropython/ports/stm32'
Comparing against: ../releases/2022-11-14T1854-v4.1.7-coldcard.dfu
test -n "../releases/2022-11-14T1854-v4.1.7-coldcard.dfu" -a -f ../releases/2022-11-14T1854-v4.1.7-coldcard.dfu
rm -f -f check-fw.bin check-bootrom.bin
signit split ../releases/2022-11-14T1854-v4.1.7-coldcard.dfu check-fw.bin check-bootrom.bin
start 293 for 729600 bytes: Firmware => check-fw.bin
start 729901 for 30720 bytes: Bootrom => check-bootrom.bin
signit check check-fw.bin
     magic_value: 0xcc001234
       timestamp: 2022-11-14 18:54:14 UTC
  version_string: 4.1.7
      pubkey_num: 1
 firmware_length: 729600
   install_flags: 0x0 =>
       hw_compat: 0x6 => Mk2+Mk3
          future: 0000000000000000 ... 0000000000000000
       signature: e2ee0c995ee25148 ... f78dff2499223015
 ECDSA Signature: CORRECT
signit check firmware-signed.bin
     magic_value: 0xcc001234
       timestamp: 2022-11-22 22:40:04 UTC
  version_string: 4.1.7
      pubkey_num: 0
 firmware_length: 729600
   install_flags: 0x0 =>
       hw_compat: 0x6 => Mk2+Mk3
          future: 0000000000000000 ... 0000000000000000
       signature: 1117db18c5bae38f ... 5212e98de3295683
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt
--- repro-got.txt
+++ repro-want.txt
@@ -41571,7 +41571,7 @@
 000a2dd0  63 72 6f 50 79 74 68 6f  6e 20 76 31 2e 31 32 2d  |croPython v1.12-|
 000a2de0  31 30 39 32 2d 67 63 30  38 37 62 62 65 38 64 2d  |1092-gc087bbe8d-|
 000a2df0  64 69 72 74 79 20 6f 6e  20 32 30 32 32 2d 31 31  |dirty on 2022-11|
-000a2e00  2d 32 32 3b 20 43 6f 6c  64 63 61 72 64 20 77 69  |-22; Coldcard wi|
+000a2e00  2d 31 34 3b 20 43 6f 6c  64 63 61 72 64 20 77 69  |-14; Coldcard wi|
 000a2e10  74 68 20 53 54 4d 33 32  4c 34 78 78 52 47 0d 0a  |th STM32L4xxRG..|
 000a2e20  00 54 79 70 65 20 22 68  65 6c 70 28 29 22 20 66  |.Type "help()" f|
 000a2e30  6f 72 20 6d 6f 72 65 20  69 6e 66 6f 72 6d 61 74  |or more informat|
@@ -42548,7 +42548,7 @@
 000a6ae0  20 77 69 74 68 20 53 54  4d 33 32 4c 34 78 78 52  | with STM32L4xxR|
 000a6af0  47 00 76 31 2e 31 32 2d  31 30 39 32 2d 67 63 30  |G.v1.12-1092-gc0|
 000a6b00  38 37 62 62 65 38 64 2d  64 69 72 74 79 20 6f 6e  |87bbe8d-dirty on|
-000a6b10  20 32 30 32 32 2d 31 31  2d 32 32 00 31 2e 31 33  | 2022-11-22.1.13|
+000a6b10  20 32 30 32 32 2d 31 31  2d 31 34 00 31 2e 31 33  | 2022-11-14.1.13|
 000a6b20  2e 30 00 70 79 62 6f 61  72 64 00 00 d0 5b 05 08  |.0.pyboard...[..|
 000a6b30  39 d3 03 08 88 62 05 08  3c eb 0a 08 54 53 05 08  |9....b..<...TS..|
 000a6b40  9f 00 00 00 13 00 00 00  4c eb 0a 08 ba 00 00 00  |........L.......|
make: *** [Makefile:279: check-repro] Error 1
+ set +ex
```

While the diff looks benign - apparently the compilation date ends up in the
binary - this diff means the binary is not reproducible.
