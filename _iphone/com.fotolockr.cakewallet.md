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
updated: 2023-02-09
version: 4.5.8
stars: 3.6
reviews: 158
size: '103985152'
website: https://cakewallet.com
repository: https://github.com/cake-tech/cake_wallet
issue: https://github.com/cake-tech/cake_wallet/issues/337
icon: com.fotolockr.cakewallet.jpg
bugbounty: 
meta: ok
verdict: ftbfs
date: 2022-11-02
signer: 
reviewArchive:
- date: 2021-04-14
  version: 4.1.4
  appHash: 
  gitRevision: 3f57101209712caf0bf7dae6466ce81d29359fca
  verdict: nonverifiable
twitter: cakewallet
social:
- https://www.facebook.com/cakewallet
- https://www.reddit.com/r/cakewallet
features: 

---

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
