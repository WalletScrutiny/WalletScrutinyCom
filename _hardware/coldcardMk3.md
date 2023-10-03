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
issue: 
icon: coldcardMk3.png
bugbounty: https://coinkite.com/responsible-disclosure
meta: discontinued
verdict: reproducible
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
