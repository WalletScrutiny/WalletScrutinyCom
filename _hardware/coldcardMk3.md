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
updated: 2023-06-26
version: v4.1.9
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
issue: 
icon: coldcardMk3.png
bugbounty: https://coinkite.com/responsible-disclosure
meta: discontinued
verdict: reproducible
appHashes:
- f6fb19d95bd1e38535f137bed60cafbfcd52379a686e3d12f372f881d78e640e
date: 2023-10-08
signer: 
reviewArchive:
- date: 2023-06-22
  version: v4.1.8
  appHashes:
  - 233398cc8f6b9e894072448eb8b8a82a4f546219ce461dd821f0ed0a38b61900
  gitRevision: 8c8a96cc2119fd85e4a8ffdc88ff2921c0085ed6
  verdict: reproducible
- date: 2022-11-25
  version: v4.1.7
  appHashes:
  - cc946bcb63211e15d85db577e25ab2432d4a74d5dad77d710539e505dce7914a
  gitRevision: 3c84a7bdc614161e0c52d4a79bc486ec2246ec96
  verdict: nonverifiable
- date: 2022-08-07
  version: v4.1.3
  appHashes:
  - d01d81305b209dadcf960b9e9d20affb8d4f11e9f9f916c5a06be29298c80dc2
  gitRevision: 13171e8e87bb975be68995fcba6df43318736de4
  verdict: nonverifiable
- date: 2021-08-14
  version: v4.1.2
  appHashes:
  - d01d81305b209dadcf960b9e9d20affb8d4f11e9f9f916c5a06be29298c80dc2
  gitRevision: 13171e8e87bb975be68995fcba6df43318736de4
  verdict: nonverifiable
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

**Update 2023-10-08**: We ran our test script on the latest version:

```
$ ./scripts/test/hardware/coldCard.sh "2023-06-26T1241-v4.1.9" 3
...
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 

You have built a bit-for-bit identical copy of Coldcard firmware for v4.1.9
+ set +ex

Hash of non-signature parts downloaded/compiled:
4583de49cc6e461151532b474a528bd6f469a655450216cb51b3bf1249e71eca  2023-06-26T1241-v4.1.9-nosig.bin
4583de49cc6e461151532b474a528bd6f469a655450216cb51b3bf1249e71eca  firmware-nosig.bin

Hash of the signed firmware:
f6fb19d95bd1e38535f137bed60cafbfcd52379a686e3d12f372f881d78e640e  /tmp/firmware/releases/2023-06-26T1241-v4.1.9-coldcard.dfu
53c9c07bfe860876303a09ed05e3b3b3e84727b02f59dc9be442823593a1bdec  /tmp/firmware/stm32/built/firmware-signed.dfu
```

This is what we hope to see to label this product **reproducible**.

**Update 2023-06-22**: Carl Dong noticed what might be wrong with our build
script. In his
[thread on Twitter](https://twitter.com/carl_dong/status/1671973538029346824)
he also linked to where Coldcard had fixed the issue with the compilation date
leaking into the compilation result.

We updated our test script accordingly and got these results:

```
$ ./scripts/test/hardware/coldCard.sh "2023-06-19T1627-v4.1.8" 3
...
 ECDSA Signature: CORRECT
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 

You have built a bit-for-bit identical copy of Coldcard firmware for v4.1.8
+ set +ex

Hash of non-signature parts downloaded/compiled:
fa919d8c18691320b4b2da7d24b7b950422b9c656edef5b5b335a4b69f40ddc1  2023-06-19T1627-v4.1.8-nosig.bin
fa919d8c18691320b4b2da7d24b7b950422b9c656edef5b5b335a4b69f40ddc1  firmware-nosig.bin

Hash of the signed firmware:
233398cc8f6b9e894072448eb8b8a82a4f546219ce461dd821f0ed0a38b61900  /tmp/firmware/releases/2023-06-19T1627-v4.1.8-coldcard.dfu
a52c574fc07c1f81139a1a4d69ff51db39c7ce4acc8303ae5f6e7a6748b7f661  /tmp/firmware/stm32/built/firmware-signed.dfu
```

This is what we hope to see to label this product **reproducible**.
