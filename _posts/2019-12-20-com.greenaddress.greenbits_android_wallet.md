---
title: "Blockstream Green Wallet"

wallet: true
users: 50000
appId: com.greenaddress.greenbits_android_wallet
launchDate: 2015-01-01
latestUpdate: 2019-11-13
apkVersionName: 3.2.7
stars: 4.0
ratings: 439
permissions:
website: https://blockstream.com/green
repository: https://github.com/Blockstream/green_android/
icon: "images/wallet_icons/greenwallet.png"
bugbounty:
verdict: verifiable # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty, cert1, cert2, cert3

date: 2019-11-23
permalink: /posts/2019/11/greenwallet/
redirect_from:
  - /greenwallet/
tags:
  - Android
  - FOSS
  - Security
---


Is it custodial?
================

In the Google Play description we read:

> Blockstream Green is a **non-custodial** Bitcoin wallet


Is it verifiable?
=================

Nowhere (description on google play, github readme, website) we were able to
find any mentions about verifiability or deterministic builds but as the wallet
[is on F-Droid](https://f-droid.org/en/packages/com.greenaddress.greenbits_android_wallet)
we expect it to be fully buildable from open source at least.

On their GitHub the latest release is 3.2.7 from November, 13, same version as
on Google Play. So we can try to reproduce the build.

In the
[building instructions](https://github.com/Blockstream/green_android/blob/master/BUILD.md),
it says there are three options on how to build:

- Use the released native libraries (recommended).
- Cross-compile the native libraries (advanced).
- Rebuilding with docker (optional)

As it's least dependent on and impactful for the host system, we try first with
Docker:

```
$ git clone https://github.com/Blockstream/green_android.git
$ cd green_android
$ git tag | grep 3.2.7
release_3.2.7
$ git checkout release_3.2.7
$ cd contrib/
$ cat Dockerfile
FROM debian:buster@sha256:2f04d3d33b6027bb74ecc81397abe780649ec89f1a2af18d7022737d0482cefe
COPY buster_deps.sh /deps.sh
RUN /deps.sh && rm /deps.sh
VOLUME /ga
ENV JAVA_HOME=/usr/lib/jvm/adoptopenjdk-8-hotspot-amd64
ENV ANDROID_HOME=/opt
CMD cd /ga/app && ./prepare_fdroid.sh && cd /ga && ./gradlew --project-dir=bitcoinj/tools build && ./gradlew assembleRelease
```

That's short. The magic happens in `buster_deps.sh`:

```
$ cat buster_deps.sh
#!/usr/bin/env bash
set -e

SDK_FILENAME=sdk-tools-linux-4333796.zip

apt-get -qq update
apt-get -yqq --no-install-recommends upgrade
apt-get -yqq --no-install-recommends install ca-certificates-java unzip curl gzip perl uncrustify git software-properties-common gnupg

SHA256SUM_KEY=428ce45ffbc74e350d707d95c661de959a2e43129a869bd82d78d1556a936440
curl -sL -o public.key https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public
echo "${SHA256SUM_KEY}  public.key" | sha256sum --check
apt-key add public.key
add-apt-repository --yes https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/

apt update -qq
apt install --no-install-recommends -yqq adoptopenjdk-8-hotspot
update-java-alternatives -s adoptopenjdk-8-hotspot-amd64

ANDROID_SDK_HASH=92ffee5a1d98d856634e8b71132e8a95d96c83a63fde1099be3d86df3106def9

cd /opt && curl -sSO https://dl.google.com/android/repository/${SDK_FILENAME}
echo "${ANDROID_SDK_HASH} ${SDK_FILENAME}" | sha256sum --check
unzip -qq ${SDK_FILENAME} && rm ${SDK_FILENAME}


#FIXME: avoid installing emulator
yes | /opt/tools/bin/sdkmanager "tools" "platform-tools"
yes | /opt/tools/bin/sdkmanager "build-tools;29.0.2"
yes | /opt/tools/bin/sdkmanager "platforms;android-29"
yes | /opt/tools/bin/sdkmanager "extras;android;m2repository" "extras;google;m2repository"
apt-get -yqq autoremove && apt-get -yqq clean
rm -rf /var/lib/apt/lists/* /var/cache/* /tmp/*
```

That looks good but does it work?

```
$ docker build -t greenbits_docker .
```

finishes without errors.

```
$ cd ..
$ docker run -v /tmp/green_android/:/gb greenbits_docker
/bin/sh: 1: cd: can't cd to /ga/app
```

Ok, `ga`? `/gb` ... let's tweak the call a bit:

```
$ docker run -v /tmp/green_android/:/ga greenbits_docker
dirname: missing operand
Try 'dirname --help' for more information.
./prepare_fdroid.sh: line 8: ANDROID_NDK: parameter null or not set
```

That looks like the docker is not ready to build this version. Let's try without
docker:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ ./gradlew build
...
<b>&gt; Task :bitcoinj:core:test</b>

org.bitcoinj.protocols.payments.PaymentSessionTest &gt; testPkiVerification <font color="#CC0000">FAILED</font>
    org.bitcoinj.protocols.payments.PaymentProtocolException$PkiVerificationException at PaymentSessionTest.java:128
        Caused by: java.security.cert.CertPathValidatorException at PaymentSessionTest.java:128
            Caused by: java.security.cert.CertificateExpiredException at PaymentSessionTest.java:128

5292 tests completed, 3 failed, 18 skipped

<font color="#CC0000"><b>&gt; Task :bitcoinj:core:test</b></font><font color="#CC0000"> FAILED</font>

<font color="#CC0000">FAILURE: Build failed with an exception.</font>

* What went wrong:
Execution failed for task &apos;:bitcoinj:core:test&apos;.
<font color="#C4A000">&gt; </font>There were failing tests. See the report at: file:///tmp/green_android/bitcoinj/core/build/reports/tests/test/index.html

* Try:
Run with <b>--stacktrace</b> option to get the stack trace. Run with <b>--info</b> or <b>--debug</b> option to get more log output. Run with <b>--scan</b> to get full insights.

* Get more help at <b>https://help.gradle.org</b>

Deprecated Gradle features were used in this build, making it incompatible with Gradle 6.0.
Use &apos;--warning-mode all&apos; to show the individual deprecation warnings.
See https://docs.gradle.org/5.4.1/userguide/command_line_interface.html#sec:command_line_warnings

<font color="#CC0000"><b>BUILD FAILED</b></font> in 3m 42s
</pre>
</div>
</div>

We know that one. For the sake of verifying a build we don't care about unit
tests, so lets ignore them:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ ./gradlew build -x :bitcoinj:core:test
<b>&gt; Task :app:preBuild</b><font color="#C4A000"> UP-TO-DATE</font>
<b>&gt; Task :app:preProductionDebugBuild</b><font color="#C4A000"> UP-TO-DATE</font>
<b>&gt; Task :app:compileProductionDebugAidl</b><font color="#C4A000"> NO-SOURCE</font>
<b>&gt; Task :app:compileProductionDebugRenderscript</b><font color="#C4A000"> NO-SOURCE</font>
<b>&gt; Task :app:checkProductionDebugManifest</b><font color="#C4A000"> UP-TO-DATE</font>
<b>&gt; Task :app:generateProductionDebugBuildConfig</b><font color="#C4A000"> UP-TO-DATE</font>
<b>&gt; Task :app:mainApkListPersistenceProductionDebug</b><font color="#C4A000"> UP-TO-DATE</font>
<b>&gt; Task :app:generateProductionDebugResValues</b><font color="#C4A000"> UP-TO-DATE</font>
<b>&gt; Task :app:generateProductionDebugResources</b><font color="#C4A000"> UP-TO-DATE</font>
...
<b>&gt; Task :app:check</b>
<b>&gt; Task :app:build</b>

<font color="#4E9A06"><b>BUILD SUCCESSFUL</b></font> in 2m 37s
108 actionable tasks: 8 executed, 100 up-to-date
</pre>
</div>
</div>

Now that looks promising. Let's see what diffoscope finds:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ diffoscope app-production-release-unsigned.apk &apos;Green 3.2.7 (com.greenaddress.greenbits_android_wallet).apk&apos;
--- app-production-release-unsigned.apk
+++ Green 3.2.7 (com.greenaddress.greenbits_android_wallet).apk
├── zipinfo /dev/stdin
│ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ <font color="#CC0000">-Zip file size: 25622941 bytes, number of entries: 1166</font>
│ <font color="#CC0000">--rw----     2.0 fat    15320 bx defN 80-000-00 00:00 AndroidManifest.xml</font>
│ <font color="#CC0000">--rw----     2.4 fat       87 b- defN 80-000-00 00:00 META-INF/MANIFEST.MF</font>
│ <font color="#4E9A06">+Zip file size: 25727227 bytes, number of entries: 1168</font>
│ <font color="#4E9A06">+-rw----     2.0 fat    15320 bx defN 80-Jan-01 00:00 AndroidManifest.xml</font>
│  -rw----     2.0 fat       12 bx defN 70-Jan-01 00:00 META-INF/android.support.design_material.version
│  -rw----     2.0 fat        6 bx defN 70-Jan-01 00:00 META-INF/androidx.appcompat_appcompat.version
│  -rw----     2.0 fat        6 bx defN 70-Jan-01 00:00 META-INF/androidx.arch.core_core-runtime.version
│  -rw----     2.0 fat        6 bx defN 70-Jan-01 00:00 META-INF/androidx.asynclayoutinflater_asynclayoutinflater.version
│  -rw----     2.0 fat        6 bx defN 70-Jan-01 00:00 META-INF/androidx.cardview_cardview.version
│  -rw----     2.0 fat        6 bx defN 70-Jan-01 00:00 META-INF/androidx.coordinatorlayout_coordinatorlayout.version
│  -rw----     2.0 fat        6 bx defN 70-Jan-01 00:00 META-INF/androidx.core_core.version
│ <font color="#06989A">@@ -63,161 +62,161 @@</font>
│  -rw----     2.0 fat     5978 bx defN 70-Jan-01 00:00 google/protobuf/timestamp.proto
│  -rw----     2.0 fat     6283 bx defN 70-Jan-01 00:00 google/protobuf/type.proto
│  -rw----     2.0 fat     3745 bx defN 70-Jan-01 00:00 google/protobuf/wrappers.proto
│  -rw----     2.4 fat 12754352 b- defN 80-000-00 00:00 lib/arm64-v8a/libgreenaddress.so
│  -rw----     2.4 fat  9300648 b- defN 80-000-00 00:00 lib/armeabi-v7a/libgreenaddress.so
│  -rw----     2.4 fat 12996160 b- defN 80-000-00 00:00 lib/x86/libgreenaddress.so
│  -rw----     2.4 fat 14130048 b- defN 80-000-00 00:00 lib/x86_64/libgreenaddress.so
│ <font color="#CC0000">--rw----     2.0 fat      616 b- defN 80-000-00 00:00 res/anim-v21/design_bottom_sheet_slide_in.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      616 b- defN 80-000-00 00:00 res/anim-v21/design_bottom_sheet_slide_out.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      388 b- defN 80-000-00 00:00 res/anim/abc_fade_in.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      388 b- defN 80-000-00 00:00 res/anim/abc_fade_out.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      852 b- defN 80-000-00 00:00 res/anim/abc_grow_fade_in_from_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      508 b- defN 80-000-00 00:00 res/anim/abc_popup_enter.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      508 b- defN 80-000-00 00:00 res/anim/abc_popup_exit.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      852 b- defN 80-000-00 00:00 res/anim/abc_shrink_fade_out_from_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      396 b- defN 80-000-00 00:00 res/anim/abc_slide_in_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      396 b- defN 80-000-00 00:00 res/anim/abc_slide_in_top.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      396 b- defN 80-000-00 00:00 res/anim/abc_slide_out_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      396 b- defN 80-000-00 00:00 res/anim/abc_slide_out_top.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      388 b- defN 80-000-00 00:00 res/anim/abc_tooltip_enter.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      388 b- defN 80-000-00 00:00 res/anim/abc_tooltip_exit.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      284 b- defN 80-000-00 00:00 res/anim/decelerate_cubic.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      616 b- defN 80-000-00 00:00 res/anim/design_bottom_sheet_slide_in.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      616 b- defN 80-000-00 00:00 res/anim/design_bottom_sheet_slide_out.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/design_snackbar_in.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/design_snackbar_out.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      508 b- defN 80-000-00 00:00 res/anim/popup_enter.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      508 b- defN 80-000-00 00:00 res/anim/popup_exit.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1216 b- defN 80-000-00 00:00 res/animator-v21/design_appbar_state_list_animator.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      796 b- defN 80-000-00 00:00 res/animator/design_fab_hide_motion_spec.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      796 b- defN 80-000-00 00:00 res/animator/design_fab_show_motion_spec.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     2664 b- defN 80-000-00 00:00 res/animator/mtrl_btn_state_list_anim.xml</font>
... 500 more lines like this ...
</pre>
</div>
</div>

That looks scary but upon closer inspection it seams it's only the file date
that is different and not even really different date but it looks like different
representations of the same date?

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">
│ --rw----     2.0 fat    15320 bx defN 80-<font color="#CC0000">000-00</font> 00:00 AndroidManifest.xml
│ +-rw----     2.0 fat    15320 bx defN 80-<font color="#4E9A06">Jan-01</font> 00:00 AndroidManifest.xml
</pre>
</div>
</div>

Anyway, we unpacked the APKs and compared them with meld:

```
$ apktool d -o fromGoogle Green\ 3.2.7\ \(com.greenaddress.greenbits_android_wallet\).apk
$ apktool d -o fromBuild app-production-release-unsigned.apk
$ meld fromBuild/ fromGoogle/
```

![meld diff for green wallet](/images/blockstreamMeld.png)

and this is how we hope it looks to conclude the wallet build is **verifiable**.


It would be nice though if Blockstream could improve the build instructions and
especially the Docker build.
