---
wsId: 
title: "Bitcoin Wallet - Airbitz"
altTitle: 
authors:
- leo
users: 100000
appId: com.airbitz
launchDate: 2014-04-01
latestUpdate: 2018-09-21
apkVersionName: "2.4.12"
stars: 3.5
ratings: 1141
reviews: 486
size: 16M
website: https://airbitz.co
repository: https://github.com/EdgeApp/airbitz-android-gui
issue: https://github.com/EdgeApp/airbitz-android-gui/issues/21
icon: com.airbitz.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2019-11-10
reviewStale: true
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /airbitz/
  - /com.airbitz/
  - /posts/2019/11/airbitz/
  - /posts/com.airbitz/
---


Bitcoin Wallet - Airbitz
claims to be *non-custodial* and *open source* but being the predecessor of
[Edge](/edge/), it gets a bit confusing here as it points to the same website
for its open source:

> • Open-source code. Available at https://github.com/Airbitz

At [github.com/Airbitz](https://github.com/Airbitz) though, as mentioned in the
article on Edge there is no code and we get forwarded to
[github.com/EdgeApp](https://github.com/EdgeApp) where there are currently 130
repositories and 81 repositories created by EdgeApp. There at first sight, the
most likely source code for Airbitz Android app is
[airbitz-android-gui](https://github.com/EdgeApp/airbitz-android-gui).

> ![airbitz version on playstore](/images/airbitzVersionPlaystore.png)

The Playstore mentiones Airbitz currently and since one year to be at version
2.4.12 yet on GitHub the
[latest tag](https://github.com/EdgeApp/airbitz-android-gui/tags) is 2.2.0 from
three years ago. The currently
[latest commit on master](https://github.com/EdgeApp/airbitz-android-gui/commit/dab412f05bc3511374c0c8100a63740295cf68f1)
appears promising, as it has the commit comment "2.4.12", the version we would
hope to see matching the Playstore apk.

So ... what do the build instructions tell us?

> The Airbitz android application comes in 3 flavors. Production, Testnet and Develop. To build it issue one of the following commands:
>
> Develop version (Seperate App ID which does not conflict with production version. Also uses the develop branch of airbitz-core-java)
>
> `./gradlew installDevelopDebug`
>
> Testnet version
>
> `./gradlew installNettestDebug`
>
> Production version
>
> `./gradlew installProdDebug`

For a reproducible build I would have hoped to find some `buildProdRelease` and
not only `...Debug`.

So ... lets try this:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">airbitz-android-gui/Airbitz$ ./gradlew installProdDebug
Parallel execution is an incubating feature.
Incremental java compilation is an incubating feature.

<font color="#CC0000">FAILURE: Build failed with an exception.</font>

* What went wrong:
A problem occurred configuring project &apos;:airbitz&apos;.
<font color="#C4A000">&gt; </font>Could not resolve all dependencies for configuration &apos;:airbitz:_nettestDebugApk&apos;.
   <font color="#C4A000">&gt; </font>A problem occurred configuring project &apos;:libs:airbitz-directory&apos;.
      <font color="#C4A000">&gt; </font>No toolchains found in the NDK toolchains folder for ABI with prefix: mips64el-linux-android

* Try:
Run with <b>--stacktrace</b> option to get the stack trace. Run with <b>--info</b> or <b>--debug</b> option to get more log output.

<font color="#CC0000">BUILD FAILED</font>

Total time: 1.415 secs
</pre>
</div>
</div>

Given there is no promise of reproducibility and no instructions on how to build
the release version or implicit promise about plugins and APIs not resulting in
big differences, we give up here for now and conclude the now obsolete but still
available for install wallet Airbitz is **not verifiable** in its current form.
