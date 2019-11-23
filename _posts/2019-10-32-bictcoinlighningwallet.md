---
title: "Bitcoin Lightning Wallet"
excerpt: "We still have to write up something about this wallet"

wallet: true
users: 10000
appId: com.lightning.walletapp
launchDate: 2018-05-01
latestUpdate: 2019-09-09
apkVersionName: 0.4
stars: 4.4
commentCount: 256
permissions:
website: http://lightning-wallet.com/
repository: https://github.com/btcontract/lnwallet
icon: "images/wallet_icons/bitcoinlightingwallet.png"
bugbounty:
verdict: nonverifiable # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty, cert1, cert2, cert3

date: 2019-11-23
permalink: /posts/2019/11/bictcoinlighningwallet/
redirect_from:
  - /bictcoinlighningwallet/
tags:
  - Android
  - Security
---


This wallet claims to be non-custodial and on their website we find their source
code repository. Let's see how that goes ...

```
$ git clone git@github.com:btcontract/lnwallet.git
```

... 750MB download later ...

```
$ cd lnwallet
$ git tag
0.3-130
v0.3-129
```

there is no v0.4 and upon further investigation it turns out the project doesn't
update the `versionName` with every release, so it's more complicated to
determine which version we are dealing with on Google Play.

The latest `Bump version`
[commit](https://github.com/btcontract/lnwallet/commit/540354acf3bcbd502757b6c56956b443f7c8879b)
defines `getSupportActionBar setSubtitle "App version 0.4-142"` yet in my
install of the app I find "App version 0.4-141". When was that introduced? In
[this commit](https://github.com/btcontract/lnwallet/commit/91e65f52f0e75f37590fba47ab6f8e1d9f3d7c3f).
So ... we try to go from there:

```
$ git checkout 91e65f52f0e7
```
<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ ./gradlew build
Parallel execution is an incubating feature.
Incremental java compilation is an incubating feature.

<font color="#CC0000">FAILURE: Build failed with an exception.</font>

* What went wrong:
A problem occurred configuring project &apos;:app&apos;.
<font color="#C4A000">&gt; </font>No toolchains found in the NDK toolchains folder for ABI with prefix: mips64el-linux-android

* Try:
Run with <b>--stacktrace</b> option to get the stack trace. Run with <b>--info</b> or <b>--debug</b> option to get more log output.

<font color="#CC0000">BUILD FAILED</font>
</pre>
</div>
</div>

Which is a [known issue](https://stackoverflow.com/a/52204135/969478): The
gradle version is outdated. It should be 3.1 or above but is defined as

```
classpath 'com.android.tools.build:gradle:2.3.0'
```

So if there is a good reason for using an old gradle version (2.3 is from
[early 2015](https://gradle.org/releases/)), the team should explain that and
give clear build instructions.

At this point we give up and decide the wallet is **not easily verifiable**.