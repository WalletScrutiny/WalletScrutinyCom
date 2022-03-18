---
wsId: COINiDwallet
title: Bitcoin Wallet for COINiD
altTitle: 
authors:
- leo
users: 5000
appId: org.coinid.wallet.btc
appCountry: 
released: 2018-10-14
updated: 2021-02-20
version: 1.8.0
stars: 
ratings: 
reviews: 
size: 34M
website: https://coinid.org
repository: https://github.com/COINiD/COINiDWallet
issue: https://github.com/COINiD/COINiDWallet/issues/24
icon: org.coinid.wallet.btc.png
bugbounty: 
meta: stale
verdict: ftbfs
date: 2022-02-16
signer: 
reviewArchive: 
twitter: COINiDGroup
social: 
redirect_from:
- /org.coinid.wallet.btc/
- /posts/org.coinid.wallet.btc/

---

This app does not reveal much information on Google Play but

> - Complete Control
> - Hierarchical Deterministic

sounds like the standard non-custodial wallet.

The FAQ on their website is more explicit:

> **Do my private key ever leave my device?** 
> No, your private key never leaves your device. You are in full control of your
private key.

And in the FAQ we find this gem:

> **Do you provide deterministic builds?**
> Since we need to distribute the app via the App Store that is not possible.
The source is however available on our Github so that anyone can review and
compile it.

So let's give it a try anyway ...

The current version is `1.7.5`. The build instructions in their entirety are:

> # COINiD Wallet
> 
> Proper readme coming soon. If you have any questions you can contact us on our [Telegram](https://t.me/joinchat/IARCoBAdhQOIEN_7u941Qg) or via [Email](mailto:info@coinid.org).
> 
> ## Secrets.js
> We are currently not including the secrets.js in the repo. If you want to compile the wallet to test it you need to add the following to src/config/secrets.js.
>
>       export const p2pCommonSecret = '';
>       export const encryptPrivateSalt = '';
>       export const pinSecret = '';

That is not good but let's see:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">
$ git clone git@github.com:COINiD/COINiDWallet.git
$ cd COINiDWallet/
$ git tag
v1.6.0
v1.7.0
v1.7.2
v1.7.3
v1.7.4
v1.7.5
$ git checkout v1.7.5
$ docker run --volume=$PWD:/mnt --workdir=/mnt --rm -it beevelop/cordova bash
root@c0a4b6139564:/mnt# echo "export const p2pCommonSecret = '';export const encryptPrivateSalt = '';export const pinSecret = '';" > src/config/secrets.js
root@c0a4b6139564:/mnt# apt update ; apt install python -y
root@c0a4b6139564:/mnt# npm install
root@c0a4b6139564:/mnt# yes | $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-28"
root@c0a4b6139564:/mnt# cd android/
root@c0a4b6139564:/mnt/android# ./gradlew clean :app:assembleRelease
...
<b>&gt; Task :app:bundleReleaseJsAndAssets</b>
warning: the transform cache was reset.
Loading dependency graph, done.
error While trying to resolve module `lottie-react-native` from file `/mnt/src/components/CheckBoxSelect.js`, the package `/mnt/node_modules/lottie-react-native/package.json` was successfully found. However, this package itself specifies a `main` module field that could not be resolved (`/mnt/node_modules/lottie-react-native/lib/index.js`. Indeed, none of these files exist:

  * `/mnt/node_modules/lottie-react-native/lib/index.js(.native||.android.js|.native.js|.js|.android.json|.native.json|.json|.android.ts|.native.ts|.ts|.android.tsx|.native.tsx|.tsx)`
  * `/mnt/node_modules/lottie-react-native/lib/index.js/index(.native||.android.js|.native.js|.js|.android.json|.native.json|.json|.android.ts|.native.ts|.ts|.android.tsx|.native.tsx|.tsx)`. Run CLI with --verbose flag for more details.

<font color="#CC0000"><b>&gt; Task :app:bundleReleaseJsAndAssets</b></font><font color="#CC0000"> FAILED</font>

<font color="#CC0000">FAILURE: Build failed with an exception.</font>

* What went wrong:
Execution failed for task &apos;:app:bundleReleaseJsAndAssets&apos;.
<font color="#C4A000">&gt; </font>Process &apos;command &apos;node&apos;&apos; finished with non-zero exit value 1

* Try:
Run with <b>--stacktrace</b> option to get the stack trace. Run with <b>--info</b> or <b>--debug</b> option to get more log output. Run with <b>--scan</b> to get full insights.

* Get more help at <b>https://help.gradle.org</b>

Deprecated Gradle features were used in this build, making it incompatible with Gradle 6.0.
Use &apos;--warning-mode all&apos; to show the individual deprecation warnings.
See https://docs.gradle.org/5.1.1/userguide/command_line_interface.html#sec:command_line_warnings

<font color="#CC0000"><b>BUILD FAILED</b></font> in 25s
190 actionable tasks: 174 executed, 16 up-to-date
</pre></div></div>

And that's where we give it up and conclude with the verdict: **not verifiable**

