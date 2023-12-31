---
wsId: phoenix
title: Phoenix - LN Bitcoin wallet
altTitle: 
authors:
- leo
users: 50000
appId: fr.acinq.phoenix.mainnet
appCountry: us
released: 2019-12-10
updated: 2023-12-20
version: 2.1.1
stars: 4.4
ratings: 314
reviews: 37
size: 
website: https://phoenix.acinq.co
repository: https://github.com/ACINQ/phoenix
issue: https://github.com/ACINQ/phoenix/issues/112
icon: fr.acinq.phoenix.mainnet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-12-30
signer: ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
reviewArchive:
- date: 2023-11-30
  version: 2.0.12
  appHash: 45eadc50d2305081e610d9dc3f114c2ac6c609fef1988d98a96da55032086473
  gitRevision: 5489755f1fb016467278649a1cb10d912c053dd5
  verdict: nonverifiable
- date: 2023-11-02
  version: 2.0.11
  appHash: e690d64eb7ad2b59af85f048b33433765bb3fc6545420c4351400ccfb7ceaf8b
  gitRevision: 0fc7ad279838629b36467d6a1546fd7a25ed5ae6
  verdict: nonverifiable
- date: 2023-04-15
  version: 1.4.26
  appHash: 512bf20aa99e781726b55d1e508ef58c390fa24692c93d6299a82b8ccd24a8b8
  gitRevision: ef5a48ca08f7a502a5b953dc00c68d9826f27e87
  verdict: nonverifiable
- date: 2022-01-24
  version: 1.4.0
  appHash: 
  gitRevision: 9e8019958ef1d5e0558fc160cde8c84a949850aa
  verdict: ftbfs
- date: 2021-07-20
  version: 1.4.2
  appHash: 
  gitRevision: e678a81ce1e01c333d7e72cf57531dfd39741ef9
  verdict: nonverifiable
- date: 2020-10-24
  version: 1.4.0
  appHash: 4689d6249e86442ab3657756d9971c9b0894051728dab214a43778665bbc9d43
  gitRevision: 84f019731e8c51e8df2232d12f9632d284769cf8
  verdict: nonverifiable
- date: 2020-08-14
  version: 1.3.3
  appHash: 29211695f12c794d0e5edc883315810cf29d22e7ad8fdcd1da7755abec6aff4d
  gitRevision: 88e1f6824c733c848222ad885673a909ece99ffb
  verdict: reproducible
- date: 2020-01-13
  version: 1.3.1
  appHash: 0c91c5f118f88b9715d20323799d5002b722115d01c95d11f20f088521f76ada
  gitRevision: 9abba57f047955e9991baa269f2082e8f3374f95
  verdict: nonverifiable
twitter: PhoenixWallet
social: 
redirect_from:
- /fr.acinq.phoenix.mainnet/
- /posts/fr.acinq.phoenix.mainnet/
developerName: ACINQ
features:
- ln

---

**Update 2023-11-30**: The provider fixed the build issue and we managed to
compile the product:

```
===== Begin Results =====
appId:          fr.acinq.phoenix.mainnet
signer:         ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
apkVersionName: 2.1.1
apkVersionCode: 73
verdict:        
appHash:        e15cd3f5be07d5b45fad034845239dabd91ef5dcff60d1cb69408084331b869d
commit:         7d338cd49b8488e8f268885bb409fbb5f558383c

Diff:
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_73/assets/dexopt/baseline.prof and /tmp/fromBuild_fr.acinq.phoenix.mainnet_73/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_73/assets/dexopt/baseline.profm and /tmp/fromBuild_fr.acinq.phoenix.mainnet_73/assets/dexopt/baseline.profm differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_73/classes3.dex and /tmp/fromBuild_fr.acinq.phoenix.mainnet_73/classes3.dex differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_73/classes5.dex and /tmp/fromBuild_fr.acinq.phoenix.mainnet_73/classes5.dex differ
Only in /tmp/fromPlay_fr.acinq.phoenix.mainnet_73/META-INF: MAINNET.RSA
Only in /tmp/fromPlay_fr.acinq.phoenix.mainnet_73/META-INF: MAINNET.SF
Only in /tmp/fromPlay_fr.acinq.phoenix.mainnet_73/META-INF: MANIFEST.MF

Revision, tag (and its signature):

===== End Results =====
```

That is a bigger diff than expected. This version is **not verifiable**.

Upon closer inspection, the diffs in the casses3.dex and classes5.dex again look
benign but there is thousands of lines to review in the diffoscope output and we
did not do a deep analysis there.