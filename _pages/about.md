---
permalink: /
title: "Wallet Scrutiny"
excerpt: "Many wallets are not open to public scrutiny"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

**Wallet Scrutiny** is a project aimed at improving the security of the
major Bitcoin wallets.


What made us start this page?
========

(by [Leo Wandersleb](/cv/leo/))

Obvious lack of security bugs me and since working at Mycelium I pushed to put
an emphasize on deterministic builds - only if the app on Google Play can be
verified to match the code on GitHub, users can assume the public source code to be
relevant for their security.

The Problem
===========

Being your own bank is hard. And in Bitcoin, everybody wants to be their own
bank, with little to no knowledge of what could go wrong.

By now, most involved bitcoiners have learned **"Not your keys - not your bitcoins!"**.
Every time a big custodial service "got hacked", those who did not lose
money in the incident were quick to blame the victims for trusting their
coins to some "random guy on the internet", the logic being that in a custodial
service the user only sees numbers on a screen but with a real wallet he ownes the
keys and thus the security is pushed to the periphery. No central server holding
all the coins means no attractive target to attack. The attacker would have to steal
the coins from each user individually.

Unfortunately there is many points to attack even if the keys are not on a
central server by design or necessity of the business model.

* The wallet could claim to be a wallet but in reality be a bitcoin bank, with the keys being stored on the server
  * While there were wallets that claimed to do more than they actually did in terms of Bitcoin crypto, I am not aware of this having happened yet to the degree where they claimed to not have the keys while holding them for normal operations.
  * I would argue though, calling a bitcoin banking interface a "wallet" falls into this category.
* The wallet could leak the keys to a server
  * This [happened before](https://github.com/bitpay/copay/issues/9346)
* The wallet could employ poor randomness to create the keys, leaking them even when generating them offline
  * [This incident](https://bitcoin.org/en/alert/2013-08-11-android) was exploitable
* The wallet could at a certain time send all funds to a hacker's wallet

Not the Solution
================

Most bitcoiners make a huge distinction between open source and closed source
wallets, assuming that if it's open source, the above issues cannot arise.
Given that the two issues linked did affect open source wallets already shows
that the open source nature is no 100% protection but in these cases it clearly
was part of the quick discovery and fix.

Unfortunately even open source wallet developers can maliciously release apps that do
not match the published code.

A necessary but underappreciated part of the Solution: Reproducible Builds
====================================================

[Reproducible Builds](https://reproducible-builds.org/) means that the binary compiled from the source code
can be reproduced by following the exact recipe. Bitcoin Core for example uses
[gitian builds](https://github.com/bitcoin-core/docs/blob/master/gitian-building.md)
and always multiple users verify the signed release actually is based on a
tagged revision of the public code repository by reproducing the binary from the code.

To spare others from the work of gitian builds, the release is signed and verified by some.
[This release](https://bitcoincore.org/bin/bitcoin-core-0.18.1/) for example contains
the binaries (those `.gz`, `.dmg` and `.exe` files) and a
[signed message](https://bitcoincore.org/bin/bitcoin-core-0.18.1/SHA256SUMS.asc).
If any verifier would find the signed message to not match the tagged code revision,
red flags would get raised, usually before many of users update to the new version.

The signature is yet another topic.

With this in place, an attacker who wanted to give you a compromised binary would have
to compromise the source code under the scrutiny of many eyes or convince you
to install a binary that you can detect to be different from the source code.

Are Android apps verifiable?
============================

Unfortunately Android never had the tools in place to deterministically
build binaries. For example

* The binary the end user receives, is an APK file which contains a signature, which naturally cannot be reproduced by the end user.
  * The APK will always differ.
  * So ... we have to unwrap the APK.
* Build tools nowadays are meant to be deterministic but often are not
  * Bugs like [this](https://issuetracker.google.com/issues/120255763) and more recently [this](https://issuetracker.google.com/issues/110237303) getting through QA look like deterministic builds are not a top priority at Google.
  * F-Droid was probably one of the earliest projects to [work with reproducible builds](https://f-droid.org/docs/Reproducible_Builds/?title=Deterministic,_Reproducible_Builds) but pngcrunch and NDK can cause issues.

So in principle, APKs can be inspected but the signature and occasionally other
details have to be ignored or otherwise be handled manually.

Where do Android Bitcoin Wallets stand today?
=============================================

To find the most relevant wallets to look into, "bitcoin wallet android" was
searched with

* [Duckduckgo](https://duckduckgo.com/?q=android+bitcoin+wallet)
* [Google](https://www.google.com/search?q=android%20bitcoin%20wallet)
* [Google Play](https://play.google.com/store/search?q=bitcoin%20wallet)

Not only in our job at Mycelium, we cared about wallet security. How should we
trust any of them without compiling them ourselves?

Reviewing the changes that go into a wallet is a full time job and
security considerations are a common reason to reject changes at Mycelium.

Many wallets say that they are open source but do not provide even the claim of being
verifiable. Just open source is not enough.
Some of them hide the team in secrecy, which might suggest upcoming exit scams.

How can we raise awareness to the issue of released binaries not being what the
authors claim they are? Do we need a few wallets exit-scamming or can we
protect at least the cautious users? And lastly, are the cautious users willing
to chip in to improve the situation in one form or another?
