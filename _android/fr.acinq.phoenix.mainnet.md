---
wsId: phoenix
title: Phoenix - LN Bitcoin wallet
altTitle: 
authors:
- leo
users: 10000
appId: fr.acinq.phoenix.mainnet
appCountry: us
released: 2019-12-10
updated: 2022-09-16
version: 1.4.23
stars: 4.4
ratings: 314
reviews: 28
size: 
website: https://phoenix.acinq.co
repository: https://github.com/ACINQ/phoenix
issue: https://github.com/ACINQ/phoenix-kmm/issues/187
icon: fr.acinq.phoenix.mainnet.png
bugbounty: 
meta: ok
verdict: ftbfs
date: 2022-01-24
signer: ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
reviewArchive:
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

---

**Update 2022-01-24**: The provided build instructions don't work anymore as
explained in [this issue](https://github.com/ACINQ/phoenix/issues/240).

**Update 2021-07-20**: The provider appears to be working on a re-write of the
app, so the [former issue](https://github.com/ACINQ/phoenix/issues/112) is not
expected to get resolved on the old repository.

Here we test if the latest version can be verified, following the known
procedure expressed in our {% include testScript.html %}:

```
fatal: Remote branch v1.4.2 not found in upstream origin
```

The provider failed to tag a revision with the latest version and the app
therefore is **not verifiable**.
