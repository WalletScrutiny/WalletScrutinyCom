---
title: "Muun - Bitcoin and Lightning Wallet"
altTitle: 

users: 1000
appId: io.muun.apollo
launchDate: 2017-04-25
latestUpdate: 2020-12-02
apkVersionName: "beta-41.6"
stars: 4.4
ratings: 69
reviews: 39
size: 37M
website: https://muun.com
repository: https://github.com/muun/apollo
issue: https://github.com/muun/apollo/issues/2
icon: io.muun.apollo.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2019-12-29
reviewStale: true
signer: 
reviewArchive:


providerTwitter: muunwallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /io.muun.apollo/
  - /posts/io.muun.apollo/
---


Update: The provider made clear that this app will remain non-reproducible:

>  **esneider** 16 hours ago: We have updated the instructions for building, and
   we won't be producing reproducible builds for the time being.

--------------------------------------------------------------------------------

The description starts out very clearly:

> Muun is a non-custodial wallet: this means you are in full control of your
  money. You remain in control of your private keys, which are stored only on
  your device using your phone's secure enclave. We never have access to your
  funds.

So it is non-custodial.

Also:

> Our code is in an open source repository and can be audited by anyone on the
  Internet.

So ... let's see if we can find this open source because it is not referenced in
the description itself.

Their link to GitHub on their website has the label "Audit us". Perfect. That's
us!

[This project "apollo"](https://github.com/muun/apollo) has the most promising
description: "Muun android wallet".

Ok, but where are the build instructions?

Let's see ...

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ git clone https://github.com/muun/apollo.git
$ cd apollo/
$ git submodule status 
$ git tag
$ git log --pretty=oneline --abbrev-commit
<font color="#C4A000">491d4d5 (</font><font color="#06989A"><b>HEAD -&gt; </b></font><font color="#4E9A06"><b>master</b></font><font color="#C4A000">, </font><font color="#CC0000"><b>origin/master</b></font><font color="#C4A000">, </font><font color="#CC0000"><b>origin/HEAD</b></font><font color="#C4A000">)</font> Release source code for beta-36.2
<font color="#C4A000">6facf35</font> Release source code for beta-36.1
<font color="#C4A000">5530b6e</font> Release source code beta-34
<font color="#C4A000">f476a6f</font> Release source code beta-33
<font color="#C4A000">c9a3697</font> Release source code beta-32
<font color="#C4A000">377b045</font> Release source code beta-29
<font color="#C4A000">7f3bd57</font> Release source code beta-28
<font color="#C4A000">cd3b46b</font> Release source code for beta-26
<font color="#C4A000">548af69</font> Release source code for beta-25
<font color="#C4A000">913f517</font> Release source code for beta-24.1
<font color="#C4A000">bc2f4db</font> Add license
<font color="#C4A000">8030bab</font> Add readme
<font color="#C4A000">8f78e5f</font> Apollo beta-16
<font color="#C4A000">a5d8782</font> Add .gitignore
</pre>
</div>
</div>

That's all their commits. No submodule. No tags.
We need `beta-36.2` which is the commit message of the final commit. That is
good although not enough for the future.

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">root@288e8088ff9f:/mnt# yes | /opt/android/tools/bin/sdkmanager "build-tools;28.0.3"
root@288e8088ff9f:/mnt# ./gradlew bundleRelease
Configuration on demand is an incubating feature.
> Task :apollo:libwallet FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':apollo:libwallet'.
> A problem occurred starting process 'command 'gomobile''

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 4s
1 actionable task: 1 executed
</pre>
</div>
</div>

That's all for now. Build fails with obscure error. No build instructions
provided.

Our verdict: **not verifiable**.
