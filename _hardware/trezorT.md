---
title: Trezor Model T
appId: trezorT
authors:
- leo
released: 2018-03-01
discontinued: 
updated: 2021-12-07
version: 2.4.3
binaries: https://github.com/trezor/webwallet-data/tree/master/firmware/2
dimensions:
- 64
- 39
- 10
weight: 22
provider: 
providerWebsite: 
website: https://trezor.io
shop: https://shop.trezor.io/product/trezor-model-t
country: CZ
price: 159EUR
repository: https://github.com/trezor/trezor-firmware
issue: 
icon: trezorT.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2022-01-10
signer: 
reviewArchive:
- date: 2021-10-16
  version: 2.4.2
  appHash: 1fa3d062251685dc8bebd0b15ed622441ca3778281a652d601548ed29287e29d
  gitRevision: 8d95977073353d5addee069f2003f3974cd50595
  verdict: reproducible
- date: 2021-07-18
  version: 2.3.6
  appHash: 0efa3ba6135caea7693d145d60441eeb46283fe0b8b1fd59a04af33a638ad237
  gitRevision: 3c395a639e29e6fa51468e559fc1e88d6b9f0516
  verdict: reproducible
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR

---

After manually testing prior versions, we now wrote a {% include testScript.html %}.

Here is it's condensed output:

```
$ ./scripts/test/hardware/trezorT.sh 2.4.3
...
Fingerprints:
a07f69d8d2065006a79c6b5636bd046496dbcb3820b41f1d604d8a4605ca4056 build/core/firmware/firmware.bin
1744efccabd479526392b281b7e0fc7aa2b4ecb454007dff7ca8c1f8171fad90 build/core-bitcoinonly/firmware/firmware.bin
3eaf589c54180dce1f8f3726b02d5384de356118bb710519e6137bcb32f52b4c build/legacy/firmware/firmware.bin
21542bba6cdc419460f87e6edbac3af0a19c6a51da46223bfdf7dc7350950e63 build/legacy-bitcoinonly/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled:
65+0 records in
65+0 records out
65 bytes copied, 0.000151876 s, 428 kB/s
f75eb91587be7b99ae94ee95cefadcda8f5149cabdc485f165f1086f0ad918cc  trezor-2.4.3.bin.zeroed
f75eb91587be7b99ae94ee95cefadcda8f5149cabdc485f165f1086f0ad918cc  build/core/firmware/firmware.bin

Hash of the signed firmware:
4279e8fbf0bf85b6412c1ab1e1fe16844b42d83d2d8a45aaf6cf68dfb7afabbc  trezor-2.4.3.bin
```

This looks good. The compiled version only differs in 64 bytes - the signature -
from the downloaded version. This firmware is **reproducible**.

# Original Analysis with discussion of details

After reviewing their
{% include walletLink.html wallet='hardware/trezorOne' verdict=true %},
this model should be mostly the same but with lessons learned ...

The claims made are straight the same:

On the provider's [page on security](https://trezor.io/security/) we read:

> **Protected bootloader.**<br>
The bootloader is write protected and the JTAG is disabled, so an attacker
cannot replace it.

The bootloader is a tiny but critical part of any computer. Without one, no
higher functionality could be loaded. The device would have no way of knowing it
had a screen and buttons and storage ...

> **Firmware verification.**<br>
  The bootloader always verifies the firmware signature. The firmware is only
  run if correctly signed by SatoshiLabs. Otherwise, a warning is shown.

So in this case, the bootloader is tiny but knows about cryptography as it has
to verify the signature of the firmware and compare its signing key to the
provider's public keys that should be hard-coded into the bootloader.

> **Secure update procedure.**<br>
  The bootloader erases the device memory if the firmware signature is invalid.
  Downgrade to a vulnerable version also wipes the memory.

The above properties ensure that only software which has been approved by the
provider can be run on this device. It doesn't guarantee that this software is
not stealing your keys.

To our surprise, the wallet's [main page](https://trezor.io/) does not show or link
to claims about the product being open source.

We [asked on Reddit](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/)
but somehow there really is no authoritative claim from the provider that the
device they sell follows this protocol:

1. The device comes without firmware[[1]](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/h3l44r2/)[[2]](https://www.reddit.com/r/TREZOR/comments/oarc0b/where_can_i_find_the_most_authoritative_claim_of/h3l4oob/)
1. The firmware [can be downloaded](https://data.trezor.io/firmware/2/trezor-2.3.6.bin), [verified to match the source code](https://wiki.trezor.io/Developers_guide:Deterministic_firmware_build) and then deployed to your device on an air-gapped computer (?can it?)
1. The firmware checks the boot-loader for tampering. If you are sure to run
   a certain firmware (layout changed ...) you can be relatively sure that a
   rogue boot-loader would have been detected.

While the lack of a comprehensive "Security protocol for your Trezor Model T" is a
surprise, all the relevant information can be found and we can check the
firmware.

Please be aware that we only look at the software and the advertised properties
of the hardware. The hardware aspect makes it hard to make any claims about the
specific device you might be getting in your mail, which makes it hard to
eliminate the need for some level of trust. But let's see if we can reproduce
the current firmware version `2.3.6`:

```
$ git clone https://github.com/trezor/trezor-firmware.git
$ cd trezor-firmware/
$ git checkout core/v2.3.6
$ bash build-docker.sh core/v2.3.6
```

... thousands of lines of compiler output. This block calls our attention. It
looks related to the instructions on how to verify the build later:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">Vendor Header for <b>SatoshiLabs</b> version 0.0 (4608 bytes)
<font color="#4E9A06">✔</font> Signature is <font color="#8AE234"><b>VALID</b></font>
Firmware Header {
    magic: HeaderType.FIRMWARE
    header_len: 1024
    expiry: 0
    code_length: 1598976
    version: 2.3.6 build 0
    fix_version: 2.2.0 build 0
    hashes: [
        <font color="#4E9A06">✔</font> f4c8bcebb02f088c9e7a9df21b5b66f83d1209a7c3702db8643448717cf58593
        <font color="#4E9A06">✔</font> 9847b75d23ad100e9da871771e6592858450918d3f6a1d182edac7da7a012c63
        <font color="#4E9A06">✔</font> 7beaf165a8030dc682f4b43ad3b5b042b1fab16ac933e1f6af8cad8af1ecc705
        <font color="#4E9A06">✔</font> 5e4d8df865bb08bdbb44dd1c7e191ee20f12127ef5605259c0ac13f9a94948a9
        <font color="#4E9A06">✔</font> ced651b53ad164d6211c6ac76bc70a060cf27b62061009d729b48ddab39cbcff
        <font color="#4E9A06">✔</font> 64e03f153d5496d7d8271cce5107d05de46e6d735a0c25d4a8410339a141b17e
        <font color="#4E9A06">✔</font> 6a935d490188ede773871d73fa14e0480fdc34e343a6974d55d3e00d14fa476e
        <font color="#4E9A06">✔</font> a0980b638dd49f9ac53afcd8431917dcf934b70cd29a3e710355b916cdeb36db
        <font color="#4E9A06">✔</font> 986a1f5859a619588ab40abe901bce876173777a9f93e17e67ea2bca48db7f19
        <font color="#4E9A06">✔</font> c598ffda50a78b227e7b5b40018dfe9f301677f7dbf068dddb82e92f28a565d5
        <font color="#4E9A06">✔</font> 743180fd252895aae2b1879b771605a12fb7ee30e67e20155a73bbd2ce84d834
        <font color="#4E9A06">✔</font> 23f392eda648fd9bf80919a10c787fd9ebf9bb8d2a7dba439a221cca5167fdc6
        <font color="#4E9A06">✔</font> e2ee2ca1296e4ea18f248b7ac32ac483712f902df1b699c9752728b12ca378df
        <font color="#4E9A06">✔</font> 0000000000000000000000000000000000000000000000000000000000000000
        <font color="#4E9A06">✔</font> 0000000000000000000000000000000000000000000000000000000000000000
        <font color="#4E9A06">✔</font> 0000000000000000000000000000000000000000000000000000000000000000
    ]
    sigmask: 0
    signature: 64 bytes 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
}
Fingerprint: <b>0efa3ba6135caea7693d145d60441eeb46283fe0b8b1fd59a04af33a638ad237</b>
<font color="#CC0000">❌</font> Signature is <font color="#729FCF"><b>MISSING</b></font>, hashes are <font color="#8AE234"><b>VALID</b></font>
dd if=build/firmware/firmware.bin of=build/firmware/firmware.bin.p1 skip=0 bs=128k count=6
</pre></div></div>

As we can't sign, missing signatures are expected.

```
python ../bootloader/firmware_sign.py -f trezor.bin
Firmware size 418700 bytes
Firmware fingerprint: 94103013539c0d1e067d6da77dd20f46eae19a449d48e732cd9f6a99cc62560e
Slot #1 is empty
Slot #2 is empty
Slot #3 is empty
HASHES OK
make: Leaving directory '/tmp/trezor-firmware/legacy/firmware'
Fingerprints:
0efa3ba6135caea7693d145d60441eeb46283fe0b8b1fd59a04af33a638ad237 build/core/firmware/firmware.bin
e2cab40bb4c6ae65417b80ad564b905796038a0f5e6d0f50cead257fdd3a9c2d build/core-bitcoinonly/firmware/firmware.bin
8fe15b61de0cf547bfb9f3e5b251bab6ccca3780a44b6048d61e3aa6ffc8a9c3 build/legacy/firmware/firmware.bin
94103013539c0d1e067d6da77dd20f46eae19a449d48e732cd9f6a99cc62560e build/legacy-bitcoinonly/firmware/firmware.bin
$ wget https://data.trezor.io/firmware/2/trezor-2.3.6.bin
$ cmp build/core/firmware/firmware.bin trezor-2.3.6.bin --verbose
   5568   0   3
   5569   0  41
   5570   0 311
   5571   0  73
   5572   0 105
   5573   0  53
   5574   0  77
   5575   0 141
   5576   0 142
   5577   0 171
   5578   0 253
   5579   0 104
   5580   0 163
   5581   0  65
   5582   0 336
   5583   0 207
   5584   0 275
   5585   0  57
   5586   0  66
   5587   0  21
   5588   0  52
   5589   0 245
   5590   0   2
   5591   0 314
   5592   0 154
   5593   0 276
   5594   0 104
   5595   0  60
   5596   0 220
   5597   0  54
   5598   0 335
   5599   0 357
   5600   0 377
   5601   0 365
   5602   0 146
   5603   0 230
   5604   0   6
   5605   0 251
   5606   0 210
   5607   0 211
   5608   0  20
   5609   0 317
   5610   0 236
   5611   0 211
   5612   0 352
   5613   0  60
   5614   0 241
   5615   0 313
   5616   0  74
   5617   0  73
   5618   0  44
   5619   0 377
   5620   0 335
   5621   0 156
   5622   0 325
   5623   0  30
   5624   0 212
   5625   0 230
   5626   0 225
   5627   0  64
   5628   0  53
   5629   0 352
   5630   0 353
   5631   0 134
$ cmp build/core/firmware/firmware.bin trezor-2.3.6.bin --verbose | wc -l
64
```

so yes, the diff is 64 bytes. One signature, as expected.

The recommended way of checking the firmware for a match is to zero out the
signature in the original file, too and to then hash both:

```
$ dd if=/dev/zero of=trezor-2.3.6.bin bs=1 seek=5567 count=65 conv=notrunc
65+0 records in
65+0 records out
65 bytes copied, 0.000168417 s, 386 kB/s
$ sha256sum build/core/firmware/firmware.bin trezor-2.3.6.bin
c239e48c2088082155a48f4b47573a57aab59639d62e2f90ad69546b5e088181  build/core/firmware/firmware.bin
c239e48c2088082155a48f4b47573a57aab59639d62e2f90ad69546b5e088181  trezor-2.3.6.bin
```

and that is a match. The Trezor Model T firmware `2.3.6` is **reproducible**.

*This review is quite a bit shorter than the one of the older model
{% include walletLink.html wallet='hardware/trezorOne' verdict=true %}, which is
both to the newer model not using some legacy format that caused many more bytes
to be questionable there but also because we directly jumped to trusting tools
from their repository as we do not do code reviews. Our assurance is that a
passed code review of their repository has relevance for the binary and that
necessarily implies that if there was a problem with the tools we used to check
the binary, it would be in the open, to be found in a review. The
**reproducible** verdict does not replace a code review.*
