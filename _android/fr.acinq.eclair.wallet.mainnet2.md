---
wsId: 
title: "Eclair Mobile"
altTitle: 
authors:
- leo
users: 10000
appId: fr.acinq.eclair.wallet.mainnet2
launchDate: 2018-04-12
latestUpdate: 2021-01-05
apkVersionName: "0.4.13"
stars: 4.1
ratings: 352
reviews: 162
size: 28M
website: https://acinq.co
repository: https://github.com/ACINQ/eclair-mobile
issue: https://github.com/ACINQ/eclair-mobile/issues/232
icon: fr.acinq.eclair.wallet.mainnet2.jpg
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2019-12-22
reviewStale: true
signer: 
reviewArchive:


providerTwitter: acinq_co
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /eclair/
  - /fr.acinq.eclair.wallet.mainnet2/
  - /posts/2019/12/eclair/
  - /posts/fr.acinq.eclair.wallet.mainnet2/
---


This wallet has a really short description. Here it is in full:

> Eclair Mobile is a next generation, Lightning-ready Bitcoin wallet. It can be
used as a regular Bitcoin wallet, and can also connect to the Lightning Network
for cheap and instant payments.
>
> This software is based on eclair, and follows the Lightning Network standard.

No word on custodial or not.

Their website is more informative if only for the
[link to their GitHub](https://github.com/ACINQ).

[eclair-mobile](https://github.com/ACINQ/eclair-mobile) sounds promising.

There, in the description again we find no hints at it being non-custodial.

But in the repository's
[wiki](https://github.com/ACINQ/eclair-mobile/wiki/FAQ#is-eclair-mobile-a-real-lightning-node-)
finally we find:

> **Is Eclair Mobile a "real" Lightning Node ?**
>
> Yes it is. Eclair Mobile is a real, self-contained lightning node that runs on
your phone. It does not require you to run another Lightning Node node at home
or in the cloud. It is not a custodial wallet either, you are in full control of
your funds.

So ... can we reproduce the build?

The build instructions are not very plentiful on the
[repo's description](https://github.com/ACINQ/eclair-mobile/tree/mainnet#developers):

> **Developers**
>
> 1. clone this project
> 2. clone [eclair](https://github.com/ACINQ/eclair) and checkout the android branch.
>
>    Follow the steps here to build the eclair-core library.
> 4. Open the Eclair Mobile project with Android studio. You should now be able to install it on your phone/on an emulator.

This has two immediate issues:

* How do we know which version of "eclair" should we use? This should be
  resolved with a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).
* Compiling with Android Studio is not easy to automate and should not be
  necessary.
* Branches are not a good way of referencing revisions of a repository. The "android
  branch" has 1938 revisions and if I want to check anything but the latest
  revision I have little to go by to find which app would match to which state
  of the branch.

but let's see how compiling looks once these issues are resolved as we have
little hope to verify the current apk ...

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">
$ git clone git@github.com:ACINQ/eclair-mobile.git
$ git clone git@github.com:ACINQ/eclair.git
$ cd eclair
$ git checkout android
$ docker run -it -v $PWD/eclair:/eclair -v $PWD/eclair-mobile:/eclair-mobile --workdir / electrum-android-builder-img
user@d0cf683a144a:/$ sudo su -
root@d0cf683a144a:~# apt update      
root@d0cf683a144a:~# apt install maven
root@d0cf683a144a:~# mvn install -DskipTests
...
[<font color="#3465A4"><b>INFO</b></font>] <b>--- </b><font color="#4E9A06">maven-compiler-plugin:3.1:testCompile</font> <b>(default-testCompile)</b> @ <font color="#06989A">eclair-core_2.11</font><b> ---</b>
[<font color="#3465A4"><b>INFO</b></font>] Nothing to compile - all classes are up to date
[<font color="#3465A4"><b>INFO</b></font>]
[<font color="#3465A4"><b>INFO</b></font>] <b>--- </b><font color="#4E9A06">scala-maven-plugin:3.4.2:testCompile</font> <b>(scalac)</b> @ <font color="#06989A">eclair-core_2.11</font><b> ---</b>
[<font color="#3465A4"><b>INFO</b></font>] /eclair/eclair-core/src/test/java:-1: info: compiling
[<font color="#3465A4"><b>INFO</b></font>] /eclair/eclair-core/src/test/scala:-1: info: compiling
[<font color="#3465A4"><b>INFO</b></font>] Compiling 114 source files to /eclair/eclair-core/target/test-classes at 1577007350665
[<font color="#CC0000"><b>ERROR</b></font>] /eclair/eclair-core/src/test/scala/fr/acinq/eclair/blockchain/bitcoind/BitcoindService.scala:74: error: value writeString is not a member of object java.nio.file.Files
[<font color="#CC0000"><b>ERROR</b></font>]       Files.writeString(new File(PATH_BITCOIND_DATADIR.toString, &quot;bitcoin.conf&quot;).toPath, conf)
[<font color="#CC0000"><b>ERROR</b></font>]             ^
[<font color="#CC0000"><b>ERROR</b></font>] one error found
[<font color="#3465A4"><b>INFO</b></font>] <b>------------------------------------------------------------------------</b>
[<font color="#3465A4"><b>INFO</b></font>] <b>Reactor Summary for eclair_2.11 0.3.4-android-SNAPSHOT:</b>
[<font color="#3465A4"><b>INFO</b></font>]
[<font color="#3465A4"><b>INFO</b></font>] eclair_2.11 ........................................ <font color="#4E9A06"><b>SUCCESS</b></font> [  1.951 s]
[<font color="#3465A4"><b>INFO</b></font>] eclair-core_2.11 ................................... <font color="#CC0000"><b>FAILURE</b></font> [ 28.245 s]
[<font color="#3465A4"><b>INFO</b></font>] eclair-node ........................................ <font color="#C4A000"><b>SKIPPED</b></font>
[<font color="#3465A4"><b>INFO</b></font>] <b>------------------------------------------------------------------------</b>
[<font color="#3465A4"><b>INFO</b></font>] <font color="#CC0000"><b>BUILD FAILURE</b></font>
</pre>
</div>
</div>

So following the instructions we didn't get far and for now hope for better
documentation and remain with the verdict: This app is **not verifiable**.
