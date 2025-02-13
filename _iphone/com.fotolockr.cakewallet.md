---
wsId: cake
title: Cake Wallet
altTitle: 
authors:
- leo
appId: com.fotolockr.cakewallet
appCountry: 
idd: 1334702542
released: 2018-01-19
updated: 2025-02-06
version: 4.23.1
stars: 4.7
reviews: 2571
size: '176223232'
website: https://cakewallet.com
repository: https://github.com/cake-tech/cake_wallet
issue: https://github.com/cake-tech/cake_wallet/issues/337
icon: com.fotolockr.cakewallet.jpg
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes: []
date: 2022-11-02
signer: 
reviewArchive:
- date: 2022-11-02
  version: 4.21.2
  appHashes: []
  gitRevision: c5fd94bf4c89189529bbb9a0265239acf4f53f35
  verdict: ftbfs
- date: 2021-04-14
  version: 4.1.4
  appHashes: []
  gitRevision: 3f57101209712caf0bf7dae6466ce81d29359fca
  verdict: nonverifiable
twitter: cakewallet
social:
- https://www.facebook.com/cakewallet
- https://www.reddit.com/r/cakewallet
features: 
developerName: Cake Technologies, LLC

---

**Note:** iPhone products are **not verifiable**.

**Update  2022-11-02**: Apparently this product fails to build from source. The
relatively old
[issue](https://github.com/cake-tech/cake_wallet/issues/337) was not closed yet.
We have to assume this product remains to be **not verifiable**.

**Update 2021-04-14**: They now do have a public issue tracker and
[emanuel](/authors/emanuel) tried to build with
[slightly more success](https://github.com/cake-tech/cake_wallet/issues/112)
but the verdict remains the same.

> Cake Wallet allows you to safely store, send receive and exchange your XMR /
  Monero and BTC / Bitcoin.

is an implicit claim of this being a non-custodial Bitcoin wallet but:

> -You control your own seed and keys

is more explicit about the non-custodial part.

On their website we read:

> **FEATURES**<br>
  ...<br>
  Open source

and indeed, there is [a source code repo](https://github.com/cake-tech/cake_wallet).

There is no claim about reproducibility or build instructions. As the app uses
[Flutter](https://flutter.dev/) and we have no experience with that, we have to
stop here. Usually at this point we open issues on the code repository but they
have no public issue tracker.
