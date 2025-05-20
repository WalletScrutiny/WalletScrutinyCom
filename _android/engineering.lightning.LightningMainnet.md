---
wsId: 
title: Lightning (Remove Funds by Dec 31st)
altTitle: 
authors: 
users: 1000
appId: engineering.lightning.LightningMainnet
appCountry: 
released: 
updated: 2020-10-02
version: Varies with device
stars: 
ratings: 
reviews: 
website: https://lightning.engineering
repository: https://github.com/lightninglabs/lightning-app
issue: https://github.com/lightninglabs/lightning-app/issues/67
icon: engineering.lightning.LightningMainnet.png
bugbounty: 
meta: removed
verdict: wip
appHashes: 
date: 2021-02-04
signer: 
twitter: lightning
social: 
redirect_from:
- /engineering.lightning.LightningMainnet/
- /posts/engineering.lightning.LightningMainnet/
developerName: 
features: 

---

**Update:** This app is not supported by its provider anymore. As the name reads
"Lightning (Remove Funds by Dec 31st)" and the description talks about "3
months" we assume this app still being on Google Play is an accident.

From the description:

> 1. Install the app and follow the setup instructions.
> 2. Send a small amount of BTC to your wallet address (not more than you are
     willing to lose, it's alpha)
> 3. Wait a few minutes for the wallet to sync. Once completed, the app will
     open payment channels automatically. The funding transactions need to
     confirm just like regular on-chain transactions.

If it "sync"s and "open payment channels automatically", it is probably a
non-custodial app, although that is not said explicitly in the description.

But there is also a link to
[their GitHub](https://github.com/lightninglabs/lightning-app).

There is no word on the Android build on the main Readme.md but under
[mobile](https://github.com/lightninglabs/lightning-app/tree/master/mobile)
we find something ...

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ git clone https://github.com/lightninglabs/lightning-app
$ cd lightning-app/
$ docker run --rm --volume=$PWD:/mnt --workdir=/mnt  -it beevelop/cordova bash
root@bf7373350a59:/mnt# npm install
...
added 2140 packages from 1995 contributors and audited 943144 packages in 68.29s
found <font color="#EF2929">11</font> vulnerabilities (8 <font color="#FCE94F">moderate</font>, 3 <font color="#EF2929">high</font>)
  run `npm audit fix` to fix them, or `npm audit` for details
root@bf7373350a59:/mnt# cd mobile
root@bf7373350a59:/mnt/mobile# npm install
root@bf7373350a59:/mnt/mobile# cd android/
root@bf7373350a59:/mnt/mobile/android# yes | /opt/android/tools/bin/sdkmanager "build-tools;28.0.3"
root@bf7373350a59:/mnt/mobile/android# ./gradlew bundleRelease
<b>&gt; Task :app:bundleReleaseJsAndAssets</b>
warning: the transform cache was reset.
Loading dependency graph, done.
error Unable to resolve module `../../assets/rpc` from `/mnt/src/action/grpc-mobile.js`: The module `../../assets/rpc` could not be found from `/mnt/src/action/grpc-mobile.js`. Indeed, none of these files exist:
  * `/mnt/assets/rpc(.native||.android.js|.native.js|.js|.android.json|.native.json|.json|.android.ts|.native.ts|.ts|.android.tsx|.native.tsx|.tsx)`
  * `/mnt/assets/rpc/index(.native||.android.js|.native.js|.js|.android.json|.native.json|.json|.android.ts|.native.ts|.ts|.android.tsx|.native.tsx|.tsx)`. Run CLI with --verbose flag for more details.

<font color="#CC0000"><b>&gt; Task :app:bundleReleaseJsAndAssets</b></font><font color="#CC0000"> FAILED</font>

<font color="#CC0000">FAILURE: Build failed with an exception.</font>

* What went wrong:
Execution failed for task &apos;:app:bundleReleaseJsAndAssets&apos;.
<font color="#C4A000">&gt; </font>Process &apos;command &apos;node&apos;&apos; finished with non-zero exit value 1

* Try:
Run with <b>--stacktrace</b> option to get the stack trace. Run with <b>--info</b> or <b>--debug</b> option to get more log output. Run with <b>--scan</b> to get full insights.

* Get more help at <b>https://help.gradle.org</b>

Deprecated Gradle features were used in this build, making it incompatible with Gradle 5.0.
Use &apos;--warning-mode all&apos; to show the individual deprecation warnings.
See https://docs.gradle.org/4.10.1/userguide/command_line_interface.html#sec:command_line_warnings

<font color="#CC0000"><b>BUILD FAILED</b></font> in 30s
1 actionable task: 1 executed
</pre>
</div>
</div>

So we threw what we know at it but failed there.

We did not take the route using Android Studio, as that should never be necessary
as Android Studio itself uses gradle to build Android projects. For our purpose
a tool with graphical interface, involving clicking buttons is not practical as
build verification will be fully automated as it needs to be reevaluated after
each release.

So for now we hope for better build instructions so we can soon give it another
try and conclude this provider probably shares the source but it's **not verifiable**.
