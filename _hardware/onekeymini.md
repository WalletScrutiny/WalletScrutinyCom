---
title: One Key Mini
appId: onekeymini
authors:
- danny
- mohammad
released: 2020-12-08
discontinued: 
updated: 2024-08-12
version: 3.9.0
binaries: 
dimensions: 
weight: 
provider: Bixin
providerWebsite: 
website: https://onekey.so/
shop: >-
  https://shop.onekey.so/products/onekey-mini-hardware-wallet?variant=41169098178722
country: SG
price: 48USD
repository: https://github.com/OneKeyHQ/firmware
issue: https://github.com/OneKeyHQ/firmware/issues/579#issuecomment-2721075263
icon: onekeymini.png
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes:
- 70134b755f3246621b67029a11c5913c782e698ccf3a36aa736e8a73832f41f0
date: 2025-03-13
signer: 
reviewArchive:
- date: 2023-07-12
  version: 3.0.0
  appHashes:
  - 88b76f05d95e6718d0bf3d4dabb12cf2403cfed91c351008441fe2a33b1cd9ae
  gitRevision: a51dc3d4e00e983c9ec22934df15bc9f09036173
  verdict: nonverifiable
- date: 2022-12-28
  version: 
  appHashes: []
  gitRevision: 
  verdict: nosource
twitter: onekeyhq
social:
- https://discord.gg/onekey
- https://weibo.com/yourKeysyourBitcoin
- https://www.reddit.com/r/OneKeyHQ/
features: 

---

## Initial Findings

We conducted a reproducibility test for OneKey Mini firmware v3.9.0 using a modified hardware-specific script. The test involved building the firmware from source code and comparing it with the official firmware downloaded from GitHub.

### Build and Download Process

We successfully built the firmware from the OneKey GitHub repository using their provided build system. The build process completed without errors, producing a firmware file named `mini.3.9.0-Stable-0313-a8b4519.bin` (where 0313 represents the build date).

We then downloaded the official firmware from GitHub using the URL:
```
https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv3.9.0/mini.3.9.0-Stable-0807-a8b4519.signed.bin
```

### Hash Comparison

We calculated SHA-256 hashes for both firmware files:
```
0ed8c4038c98cd351f3dcdeae1a6f159dc6084f4bd77cda891db60f0aae4899e  output/mini.3.9.0-Stable-0313-a8b4519.bin
70134b755f3246621b67029a11c5913c782e698ccf3a36aa736e8a73832f41f0  output/downloaded-firmware.bin
```

The hashes are different, which indicates that the built firmware is not bit-for-bit identical to the official firmware.

### Binary Comparison

We performed a binary comparison using `vbindiff` and `hexdump` tools. Interestingly, the file sizes are identical (979,516 bytes), and the file headers and initial binary content are byte-for-byte identical. The first several hundred bytes, including the "MINI" identifier at the beginning, match perfectly between both files.

This is the result of the vbindiff:
```
output/mini.3.9.0-Stable-0313-a8b4519.bin                                       
00000 0000:  4D 49 4E 49 1F A4 01 08  00 00 00 00 3C EE 0E 00  MINI.... ....<...
00000 0010:  02 63 63 00 02 63 63 00  39 00 00 00 00 00 00 00  .cc..cc. 9.......
00000 0020:  31 44 0B 3E E1 87 34 39  3D 7E 32 76 75 65 12 BA  1D.>..49 =~2vue..
00000 0030:  5D F2 79 F1 DD A9 01 AA  CC 71 CD 97 95 84 52 43  ].y..... .q....RC
00000 0040:  81 C5 8C 4F 1C 96 68 FF  EA B4 32 63 06 F8 A9 42  ...O..h. ..2c...B
00000 0050:  7A 69 A4 D9 42 1A E1 D7  0B 91 9C 5E F8 13 85 7B  zi..B... ...^...{
00000 0060:  31 27 60 1B B6 1C 90 2B  47 36 07 8D 6D 0C 7D 05  1'`....+ G6..m.}.
00000 0070:  D8 C8 FE 37 E8 40 E5 21  AD 4C A2 36 7C 56 39 ED  ...7.@.! .L.6|V9.
00000 0080:  28 5B A3 87 05 7F 19 9C  6C F9 0B A5 83 CE 2D 85  ([...... l.....-.
00000 0090:  97 43 AB D3 3C DD 59 3D  63 92 12 F8 DD E5 CF CC  .C..<.Y= c.......
00000 00A0:  B2 2D CA 17 9C 2C 84 A7  68 FC A1 8D B7 3D 2B 57  .-...,.. h....=+W
00000 00B0:  63 2A 6A 5A 2F A8 88 87  6A 87 31 0A 9E 4F 8C 8F  c*jZ/... j.1..O..
output/downloaded-firmware.bin                                                  
00000 0000:  4D 49 4E 49 1F A4 01 08  00 00 00 00 3C EE 0E 00  MINI.... ....<...
00000 0010:  02 63 63 00 02 63 63 00  39 00 00 00 00 00 00 00  .cc..cc. 9.......
00000 0020:  31 44 0B 3E E1 87 34 39  3D 7E 32 76 75 65 12 BA  1D.>..49 =~2vue..
00000 0030:  5D F2 79 F1 DD A9 01 AA  CC 71 CD 97 95 84 52 43  ].y..... .q....RC
00000 0040:  81 C5 8C 4F 1C 96 68 FF  EA B4 32 63 06 F8 A9 42  ...O..h. ..2c...B
00000 0050:  7A 69 A4 D9 42 1A E1 D7  0B 91 9C 5E F8 13 85 7B  zi..B... ...^...{
00000 0060:  31 27 60 1B B6 1C 90 2B  47 36 07 8D 6D 0C 7D 05  1'`....+ G6..m.}.
00000 0070:  D8 C8 FE 37 E8 40 E5 21  AD 4C A2 36 7C 56 39 ED  ...7.@.! .L.6|V9.
00000 0080:  28 5B A3 87 05 7F 19 9C  6C F9 0B A5 83 CE 2D 85  ([...... l.....-.
00000 0090:  97 43 AB D3 3C DD 59 3D  63 92 12 F8 DD E5 CF CC  .C..<.Y= c.......
00000 00A0:  B2 2D CA 17 9C 2C 84 A7  68 FC A1 8D B7 3D 2B 57  .-...,.. h....=+W
00000 00B0:  63 2A 6A 5A 2F A8 88 87  6A 87 31 0A 9E 4F 8C 8F  c*jZ/... j.1..O..
┌──────────────────────────────────────────────────────────────────────────────┐
│Arrow keys move  F find  N next  RET next difference  ESC quit  T move top    │
│C  ASCII/EBCDIC  E edit  P prev  G   goto position    Q   quit  B move bottom │
└─────────────────────────────────────────────────────────────────────────────
```
`$ hexdump -C -n 256 output/mini.3.9.0-Stable-0313-a8b4519.bin | head`

`$ hexdump -C -n 256 output/downloaded-firmware.bin | head`

```
00000000  4d 49 4e 49 1f a4 01 08  00 00 00 00 3c ee 0e 00  |MINI........<...|
00000010  02 63 63 00 02 63 63 00  39 00 00 00 00 00 00 00  |.cc..cc.9.......|
00000020  31 44 0b 3e e1 87 34 39  3d 7e 32 76 75 65 12 ba  |1D.>..49=~2vue..|
00000030  5d f2 79 f1 dd a9 01 aa  cc 71 cd 97 95 84 52 43  |].y......q....RC|
00000040  81 c5 8c 4f 1c 96 68 ff  ea b4 32 63 06 f8 a9 42  |...O..h...2c...B|
00000050  7a 69 a4 d9 42 1a e1 d7  0b 91 9c 5e f8 13 85 7b  |zi..B......^...{|
00000060  31 27 60 1b b6 1c 90 2b  47 36 07 8d 6d 0c 7d 05  |1'`....+G6..m.}.|
00000070  d8 c8 fe 37 e8 40 e5 21  ad 4c a2 36 7c 56 39 ed  |...7.@.!.L.6|V9.|
00000080  28 5b a3 87 05 7f 19 9c  6c f9 0b a5 83 ce 2d 85  |([......l.....-.|
00000090  97 43 ab d3 3c dd 59 3d  63 92 12 f8 dd e5 cf cc  |.C..<.Y=c.......|
00000000  4d 49 4e 49 1f a4 01 08  00 00 00 00 3c ee 0e 00  |MINI........<...|
00000010  02 63 63 00 02 63 63 00  39 00 00 00 00 00 00 00  |.cc..cc.9.......|
00000020  31 44 0b 3e e1 87 34 39  3d 7e 32 76 75 65 12 ba  |1D.>..49=~2vue..|
00000030  5d f2 79 f1 dd a9 01 aa  cc 71 cd 97 95 84 52 43  |].y......q....RC|
00000040  81 c5 8c 4f 1c 96 68 ff  ea b4 32 63 06 f8 a9 42  |...O..h...2c...B|
00000050  7a 69 a4 d9 42 1a e1 d7  0b 91 9c 5e f8 13 85 7b  |zi..B......^...{|
00000060  31 27 60 1b b6 1c 90 2b  47 36 07 8d 6d 0c 7d 05  |1'`....+G6..m.}.|
00000070  d8 c8 fe 37 e8 40 e5 21  ad 4c a2 36 7c 56 39 ed  |...7.@.!.L.6|V9.|
00000080  28 5b a3 87 05 7f 19 9c  6c f9 0b a5 83 ce 2d 85  |([......l.....-.|
00000090  97 43 ab d3 3c dd 59 3d  63 92 12 f8 dd e5 cf cc  |.C..<.Y=c.......|

$ tail -c 1024 output/downloaded-firmware.bin | hexdump -C
00000000  5c 4c 00 20 00 00 00 00  00 00 00 00 89 64 0a 08  |\L. .........d..|
00000010  00 00 00 00 00 00 00 00  e0 4b 00 20 00 00 00 00  |.........K. ....|
00000020  00 00 00 00 f9 34 0a 08  00 00 00 00 00 00 00 00  |.....4..........|
00000030  0c 49 00 20 00 00 00 00  00 00 00 00 c5 50 0a 08  |.I. .........P..|
00000040  00 00 00 00 01 00 00 00  6d b4 01 08 00 00 00 00  |........m.......|
00000050  00 00 00 00 14 43 0a 08  00 00 00 00 01 00 00 00  |.....C..........|
00000060  61 bd 01 08 00 00 00 00  00 00 00 00 d5 63 0a 08  |a............c..|
00000070  00 00 00 00 01 00 00 00  b1 bc 01 08 00 00 00 00  |................|
00000080  00 00 00 00 f9 34 0a 08  00 00 00 00 01 00 00 00  |.....4..........|
00000090  f9 16 03 08 00 00 00 00  00 00 00 00 e8 66 0a 08  |.............f..|
000000a0  00 00 00 00 00 00 00 00  5c 4c 00 20 00 00 00 00  |........\L. ....|
000000b0  00 00 00 00 00 00 00 00  00 00 00 00 05 00 00 00  |................|
000000c0  00 00 00 00 01 00 00 00  00 4b 00 20 00 00 00 00  |.........K. ....|
000000d0  00 00 00 00 00 00 00 00  02 00 00 00 00 00 00 00  |................|
000000e0  00 00 00 00 b0 4b 00 20  e0 4b 00 20 70 31 0a 08  |.....K. .K. p1..|
000000f0  00 00 00 00 01 00 00 00  55 b9 01 08 00 00 00 00  |........U.......|
00000100  01 00 00 00 61 31 0a 08  00 00 00 00 01 00 00 00  |....a1..........|
00000110  55 b9 01 08 00 00 00 00  01 00 00 00 00 00 00 00  |U...............|
00000120  00 00 00 00 04 00 00 00  00 00 00 00 01 00 00 00  |................|
00000130  fc 4b 00 20 9c 4a 00 20  03 3c 0a 08 00 00 00 00  |.K. .J. .<......|
00000140  01 00 00 00 25 b9 01 08  00 00 00 00 00 00 00 00  |....%...........|
00000150  a5 62 0a 08 00 00 00 00  01 00 00 00 25 ba 01 08  |.b..........%...|
00000160  00 00 00 00 00 00 00 00  d7 4b 0a 08 00 00 00 00  |.........K......|
00000170  00 00 00 00 94 4b 00 20  ad ae 01 08 01 00 00 00  |.....K. ........|
00000180  1b 63 0a 08 00 00 00 00  01 00 00 00 35 b7 01 08  |.c..........5...|
00000190  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
000001a0  03 00 00 00 00 00 00 00  01 00 00 00 78 4c 00 20  |............xL. |
000001b0  9c 4a 00 20 e0 53 0a 08  00 00 00 00 00 00 00 00  |.J. .S..........|
000001c0  50 4a 00 20 bd ad 01 08  00 00 00 00 d9 38 0a 08  |PJ. .........8..|
000001d0  00 00 00 00 00 00 00 00  58 49 00 20 11 ae 01 08  |........XI. ....|
000001e0  00 00 00 00 e0 3a 0a 08  00 00 00 00 00 00 00 00  |.....:..........|
000001f0  ec 49 00 20 41 ae 01 08  00 00 00 00 00 00 00 00  |.I. A...........|
00000200  00 00 00 00 02 00 00 00  57 6e 0a 08 00 00 00 00  |........Wn......|
00000210  dc 4c 00 20 0c 49 00 20  70 31 0a 08 00 00 00 00  |.L. .I. p1......|
00000220  01 00 00 00 1d bb 01 08  00 00 00 00 01 00 00 00  |................|
00000230  61 31 0a 08 00 00 00 00  01 00 00 00 1d bb 01 08  |a1..............|
00000240  00 00 00 00 01 00 00 00  ff ff ff ff 40 77 1b 00  |............@w..|
00000250  e0 93 04 00 f4 01 00 00  01 58 58 58 58 58 58 58  |.........XXXXXXX|
00000260  58 58 00 01 03 ab 00 20  44 ab 00 20 7f aa 00 20  |XX..... D.. ... |
00000270  a0 aa 00 20 c1 aa 00 20  e2 aa 00 20 01 00 00 00  |... ... ... ....|
00000280  c8 f6 0b 08 d8 ae 0c 08  04 53 01 20 19 53 01 20  |.........S. .S. |
00000290  2e 53 01 20 c8 d7 0c 08  9b e2 0c 08 0a 00 00 00  |.S. ............|
000002a0  88 00 fd 00 b7 01 27 02  8b 02 f5 02 41 03 81 03  |......'.....A...|
000002b0  b8 03 cc 03 e0 03 2c 04  95 04 be 04 f5 04 79 05  |......,.......y.|
000002c0  81 05 ed 05 e7 06 60 07  83 07 b1 07 f6 07 f6 07  |......`.........|
000002d0  fc 07 00 08 08 e4 0e 08  a6 56 0b 08 6c 08 01 01  |.........V..l...|
000002e0  a1 b3 01 20 00 00 00 00  00 00 00 00 00 00 00 00  |... ............|
000002f0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000300  00 00 00 00 00 00 00 00  00 00 00 00 3f c6 0f 08  |............?...|
00000310  28 00 00 00 00 01 04 00  01 00 00 00 00 00 00 00  |(...............|
00000320  00 01 57 49 4e 55 53 42  00 00 00 00 00 00 00 00  |..WINUSB........|
00000330  00 00 00 00 00 00 00 00  00 4e 00 20 00 00 00 00  |.........N. ....|
00000340  c8 d5 0f 08 e8 d5 0f 08  a8 d5 0f 08 00 00 00 00  |................|
00000350  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00000390  00 00 00 00 00 00 00 00  00 00 00 00 30 d5 0f 08  |............0...|
000003a0  30 d5 0f 08 01 00 00 00  00 00 00 00 4a 00 00 00  |0...........J...|
000003b0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
000003d0  00 00 00 00 4a 00 00 00  00 00 00 00 00 00 00 00  |....J...........|
000003e0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
000003f0  00 00 00 00 00 00 00 00  00 00 00 00 08 b6 01 20  |............... |
00000400
```

This suggests that while the core firmware code may be identical, there are differences in other parts of the firmware, likely related to build timestamps, signatures, or other metadata. These differences are sufficient to cause the hash verification to fail.

### Steps to Locate Differences in the Firmware Files

We performed several analyses to locate the exact differences between the built and downloaded firmware files:

1. **First byte difference location using `cmp`**:
```
$ cmp -l output/mini.3.9.0-Stable-0313-a8b4519.bin output/downloaded-firmware.bin | head
   321 234 165
   322  33 314
   323 202 250
   324 375  21
   325 352  66
   326 271  36
   327 311 372
   328 144 252
   329 376  20
   330 364  25
```
This shows that the first difference occurs at byte 321, which is very early in the firmware. This suggests that while the headers match, the actual code or data begins to differ quite early.

2. **Mid-section comparison (at offset 10000)**:
```
$ hexdump -C -s 10000 -n 100 output/mini.3.9.0-Stable-0313-a8b4519.bin > built_section.txt
$ hexdump -C -s 10000 -n 100 output/downloaded-firmware.bin > downloaded_section.txt
$ diff built_section.txt downloaded_section.txt
```
No differences were found at this specific section, indicating that some parts of the firmware remain identical despite the different build dates.

3. **String search for build dates**:
```
$ strings output/mini.3.9.0-Stable-0313-a8b4519.bin | grep "0313"
$ strings output/downloaded-firmware.bin | grep "0807"
mini.3.9.0-Stable-0313-a8b4519
mini.3.9.0-Stable-0807-a8b4519
```
The build date strings are embedded in the firmware files, confirming that the build process includes the date in the binary.

4. **End section comparison (last 4KB)**:
```
$ hexdump -C -s $((979516-4096)) output/mini.3.9.0-Stable-0313-a8b4519.bin > built_end.txt
$ hexdump -C -s $((979516-4096)) output/downloaded-firmware.bin > downloaded_end.txt
$ diff built_end.txt downloaded_end.txt
```
Surprisingly, no differences were found in the last 4KB, suggesting that the signature block (if present) might not be at the very end of the file.

5. **Firmware structure analysis using binwalk**:

  ```
  $ binwalk output/downloaded-firmware.bin
  DECIMAL       HEXADECIMAL     DESCRIPTION
  --------------------------------------------------------------------------------
  15412         0x3C34          SHA256 hash constants, little endian
  598268        0x920FC         SHA256 hash constants, little endian
  777503        0xBDD1F         Base64 standard index table
  910792        0xDE5C8         SHA256 hash constants, little endian

  $ binwalk output/mini.3.9.0-Stable-0313-a8b4519.bin
  DECIMAL       HEXADECIMAL     DESCRIPTION
  --------------------------------------------------------------------------------
  15412         0x3C34          SHA256 hash constants, little endian
  598268        0x920FC         SHA256 hash constants, little endian
  777503        0xBDD1F         Base64 standard index table
  910792        0xDE5C8         SHA256 hash constants, little endian
  ```

Both firmware files have identical `binwalk` signatures, showing the same cryptographic components in the same locations.

### Interpretation and Next Steps

Our analysis reveals a complex picture: the firmware files differ starting from byte 321, yet have identical sections elsewhere, including the end of the file. The build date is embedded in the firmware, but the differences extend beyond just the date string. To make the firmware reproducible, we would need to:

1. Identify the exact nature of the early differences (starting at byte 321)
2. Determine if these are functional code differences or just build artifacts
3. Modify the build process to use deterministic compilation settings
4. Potentially separate the signature process from the build process

A more detailed approach would involve disassembling both firmware files and comparing the assembly code to identify if the differences are in the actual executable code or just in metadata. We could also examine the OneKey build scripts to see if there are any non-deterministic elements (like timestamps or random values) being included during compilation.

### Conclusion

Based on our testing, the OneKey Mini firmware v3.9.0 is **not verifiable** in the strict sense, as we cannot produce a bit-for-bit identical copy of the official firmware. While many sections of the firmware appear to be identical, the differences that begin early in the file prevent full reproducibility. These differences are likely related to build environment specifics rather than intentional code changes.

## Addendum 

We ran another build with slightly different results, but feel that it could give a further insight on the build process. We posted this on a [gist](https://gist.github.com/xrviv/18c82e2882c16eb3d6bc84f39c362aec).

## Updated Issue

We [updated the issue](https://github.com/OneKeyHQ/firmware/issues/579#issuecomment-2721075263) for the OneKeyMini reproducible build to inform the developers of our findings.

## Product Description

Not to be confused with the {% include walletLink.html wallet='hardware/onekey' verdict='true' %}, the One Key Mini supports many cryptocurrencies including: BTC, LTC, BCH, ETH, BTG, DASH, USDT, DOGE and more. It supports many DeFi protocols and can connect to Metamask.

It is also compatible with Trezor, Metamask, Exodus, Bitcoin Core + Specter, BTCPayServe, Electrum-LTC, Nano Wallet, Electrum, Mycelium, MyEtherWallet, Bitcoin Core + HWI, Electrum- DASH and EtherWall.

According to the [FAQ](https://shop.onekey.so/pages/faq), even if the device was damaged, it is possible to recover via a mnemonic phrase.

The private keys are created offline, secured and airgapped. The mnemonic phrase is provided during initial device setup.

[One Key Mini User Manual](https://help.onekey.so/hc/en-us/articles/4408289773455-OneKey-Mini-hardware-wallet-activation-tutorial)

OneKey repeatedly claims that their software and firmwares are Open Source. However, the repository linked from their website indicates that it is already [deprecated](https://github.com/OneKeyHQ/wallet-deprecated).

Digging deeper into their User Service Agreement, we find this:

> OneKeyOpen Source Code (“OneKey OSC”): means the partial software code of OneKey that Company has publicized and made open-source. Users may use (include further development) such open source software code in accordance with relevant Open Source License and notices of the Company.

The key word is "partial". Making the **source code only partially available** indicates that certain functions are not made public. This is noted in an [issue on OneKey's Github](https://github.com/OneKeyHQ/firmware/issues/17), but it has not received any attention.

Whether it's a few lines of code that references a script downloaded from another source, users simply would not know.
