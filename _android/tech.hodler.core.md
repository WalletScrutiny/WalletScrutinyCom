---
wsId: 
title: HODLER Open Source Multi-Asset
altTitle: 
authors:
- leo
users: 1000
appId: tech.hodler.core
appCountry: 
released: 2018-09-02
updated: 2019-10-29
version: 0.4.6
stars: 
ratings: 
reviews: 
website: https://hodler.tech
repository: https://github.com/HODLERTECH/HODLER-Open-Source-Multi-Asset-Wallet
issue: https://github.com/HODLERTECH/HODLER-Open-Source-Multi-Asset-Wallet/issues/165
icon: tech.hodler.core.png
bugbounty: 
meta: removed
verdict: ftbfs
appHashes: 
date: 2024-04-26
signer: 
reviewArchive: 
twitter: HODLER_TECH
social: 
redirect_from: 
developerName: HODLER.TECH LTD
features: 

---

So their website ... is for sale:

> Buy Hodler.tech For USD 3,799

but according to Play Store, it features BTC and is open source:

> We'd like to introduce the only fully Open Source, free multi-asset and
  multi-platform cryptocurrency wallet in the world.

In the description they link to
[this steemit article on why HODLER is open source](https://steemit.com/source/@hodler.tech/hodler-the-only-multiwallet-that-s-open-source-and-why-it-matters)
and cite security thanks to auditability but do not mention reproducibility even
though they mention that a malicious site could provide bad binaries. Their
proposal: Compile it yourself.

In the description they claim:

> Transactions are always generated and signed on your device. No sensitive data
  is ever send to an external server.

In the issues section
[this issue](https://github.com/HODLERTECH/HODLER-Open-Source-Multi-Asset-Wallet/issues/151)
stands out:

> Actually a one word mnemonic seed is accepted, and it most definitely should
  not.<br>
  However, like your project!

Yes, a single word is definitely not a
[BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki?rgh-link-date=2019-03-20T12%3A20%3A40Z)
backup. That sounds scary! They might be inventing their own crypto here which
means that restoring your account on a different product might not be straight
forward in case their servers go down.

Else it checks all the boxes: BTC, self custodial, public source but what about
reproducibility? Let's see:

The [Build Instructions](https://github.com/HODLERTECH/HODLER-Open-Source-Multi-Asset-Wallet#compilation)
are ... not straight forward.

Biggest hurdles are the need to use commercial or trial licensed compilers and
graphical tools which is hard to automate and run in a docker container.

Poking around in the repository I also found for example the folder
[homeAndroid](https://github.com/HODLERTECH/HODLER-Open-Source-Multi-Asset-Wallet/tree/master/HODLER_Multiplatform_Win_And_iOS_Linux/homeAndroid)
which contains huge "fmx" files for not only Android. Those files are 1MB
each while kind of human readable (there is binary embedded. PNGs for example),
they are not what the developer is working on. Then commit messages like
[autocommit on build ](https://github.com/HODLERTECH/HODLER-Open-Source-Multi-Asset-Wallet/commit/503fad1ff1fdb8ac1b4ac4392bb929c5fa497e1c)
sound not like any coding I've done so far but more like a Powerpoint document
that auto-saves from time to time. This commit for example changes 30 files with
8,301 added and 2,188 deleted lines, including the addition of [binary files](https://github.com/HODLERTECH/HODLER-Open-Source-Multi-Asset-Wallet/commit/503fad1ff1fdb8ac1b4ac4392bb929c5fa497e1c#diff-94cd8edf8970320bd520c5d8be2356cb5835250ea255a1ed327fd60802d6f58a) of undocumented origin.

All in all I'd like to understand more what's going on but as the project has
only 1000 downloads, a rather unconventional code base and basically two years
of silence on all levels, I won't dig deeper for now and file it as
**not verifiable**.
