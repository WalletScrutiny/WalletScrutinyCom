---
wsId: Hexa2
title: Bitcoin Tribe
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: io.hexawallet.hexa2
appCountry: in
released: 2021-09-30
updated: 2024-06-17
version: 2.4.6
stars: 5
ratings: 30
reviews: 6
website: https://bitcointribe.app/
repository: https://github.com/bithyve/hexa
issue: https://github.com/bithyve/bitcointribe/issues/2544
icon: io.hexawallet.hexa2.png
bugbounty: 
meta: removed
verdict: sourceavailable
appHashes: []
date: 2025-03-11
signer: 
reviewArchive: 
twitter: HexaWallet
social:
- https://www.linkedin.com/company/bithyve
redirect_from: 
developerName: BitHyve UK Ltd.
features: 

---

**Update 2024-08-23:**

**Review: Bitcoin Tribe Wallet Build**

Despite exhaustive efforts and multiple attempts, the build process for the Bitcoin Tribe Wallet repeatedly failed to complete successfully. Various optimizations and troubleshooting steps were implemented, but we could not produce a working APK .

**Command Used:**
```bash
yarn config set registry https://registry.npmjs.org/ &&
yarn install --network-timeout 600000 &&
yarn upgrade &&
./gradlew clean &&
./gradlew assembleDebug --stacktrace --info --console=plain \
-Dorg.gradle.jvmargs="-Xmx4096m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError" \
-Dorg.gradle.daemon=false \
-Dorg.gradle.workers.max=2 \
-Dorg.gradle.vfs.watch=true
```

**Build Failure Details:**
The build process consistently failed after running for an extended period, with the latest attempt taking 41 minutes and 41 seconds before terminating. The error log showed multiple issues primarily related to Gradle execution:

```
      at org.gradle.execution.plan.CompositeNodeGroup.isCanCancel(CompositeNodeGroup.java:101)
        at org.gradle.execution.plan.Node.isCanCancel(Node.java:232)
        at org.gradle.execution.plan.FinalizerGroup.isCanCancel(FinalizerGroup.java:155)
        at org.gradle.execution.plan.CompositeNodeGroup.isCanCancel(CompositeNodeGroup.java:101)
        at org.gradle.execution.plan.Node.isCanCancel(Node.java:232)
        at org.gradle.execution.plan.FinalizerGroup.isCanCancel(FinalizerGroup.java:155)
        at org.gradle.execution.plan.CompositeNodeGroup.isCanCancel(CompositeNodeGroup.java:101)
        at org.gradle.execution.plan.Node.isCanCancel(Node.java:232)
        at org.gradle.execution.plan.FinalizerGroup.isCanCancel(FinalizerGroup.java:155)
        at org.gradle.execution.plan.CompositeNodeGroup.isCanCancel(CompositeNodeGroup.java:101)
        at org.gradle.execution.plan.Node.isCanCancel(Node.java:232)
        at org.gradle.execution.plan.FinalizerGroup.isCanCancel(FinalizerGroup.java:155)
        at org.gradle.execution.plan.CompositeNodeGroup.isCanCancel(CompositeNodeGroup.java:101)
        at org.gradle.execution.plan.Node.isCanCancel(Node.java:232)
        at org.gradle.execution.plan.FinalizerGroup.isCanCancel(FinalizerGroup.java:155)
        at org.gradle.execution.plan.CompositeNodeGroup.isCanCancel(CompositeNodeGroup.java:101)
        at org.gradle.execution.plan.Node.isCanCancel(Node.java:232)
        at org.gradle.execution.plan.FinalizerGroup.isCanCancel(FinalizerGroup.java:155)

==============================================================================

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.5.1/userguide/command_line_interface.html#sec:command_line_warnings

Execution optimizations have been disabled for 1 invalid unit(s) of work during this build to ensure correctness.
Please consult deprecation warnings for more details.

BUILD FAILED in 41m 41s
1515 actionable tasks: 1510 executed, 5 up-to-date
The command '/bin/sh -c yarn config set registry https://registry.npmjs.org/ &&     yarn install --network-timeout 600000 &&     yarn upgrade &&     ./gradlew clean &&     ./gradlew assembleDebug --stacktrace --info --console=plain     -Dorg.gradle.jvmargs="-Xmx4096m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError"     -Dorg.gradle.daemon=false     -Dorg.gradle.workers.max=2     -Dorg.gradle.vfs.watch=true' returned a non-zero code: 1
```

**Critical Issues Encountered:**

1. **Gradle Compatibility:**
   The build flagged the use of deprecated Gradle features, which are incompatible with Gradle 8.0:
   ```
   Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.
   ```
   Attempts to update Gradle configurations did not resolve these issues.

2. **Recursive Method Calls:**
   The error log revealed a concerning pattern of recursive method calls, suggesting a potential infinite loop or stack overflow:
   ```
   at org.gradle.execution.plan.Node.isCanCancel(Node.java:232)
   at org.gradle.execution.plan.FinalizerGroup.isCanCancel(FinalizerGroup.java:155)
   at org.gradle.execution.plan.CompositeNodeGroup.isCanCancel(CompositeNodeGroup.java:101)
   ```
   This pattern repeated frequently, indicating a deep-rooted issue within the build logic.

3. **Memory Allocation:**
   Despite increasing JVM memory allocation to 4GB, the build process still showed signs of memory pressure:
   ```
   -Dorg.gradle.jvmargs="-Xmx4096m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError"
   ```
   Increasing memory further did not alleviate the issue.

4. **Build Optimization Failures:**
   The build log showed that optimizations were disabled for certain tasks:
   ```
   Execution optimizations have been disabled for 1 invalid unit(s) of work during this build to ensure correctness.
   ```
   This suggests underlying issues with the project structure or build scripts that we could not resolve.

**Conclusion:**
Despite persistent efforts to update dependencies, adjust Gradle configurations, increase resources, and perform clean builds, the Bitcoin Tribe Wallet remains **not verifiable**. 


## Update 2024-07-16

After several years, it may be worth re-visiting whether this app could be built and verified. Re-labelling this as **for verification**

## Updated Verdict 2021-12-21

While the app developers claim that it is self-custodial, this app has failed to build from source. This was addressed in [issue 2544](https://github.com/bithyve/hexa/issues/2544).

> I checked our build config the dev flavour of our app can be built in debug mode. The build script to create a release apk of our production version is not in the project.
>
> I will add this to the project and add instructions on how to build it. I can’t specify a ETA for this right now but it will be done soon.
>
> On a side note, I did 2 builds one after the other on AppCentre to see if they are the same. using Android APK analyser I could still see some differences; very tiny differences in a couple of auto generated files. I am keen to understand if you will be using APK analyser to verify builds or will it be a straight diff comparison of binaries, or something else.

This correspondence has been made in January 23, 2021. Since then, there has been no update.

## App Description

The app's Google play description claims that the app is non-custodial. It has partnered with Swan Bitcoin which is a custodial service that allows users to "DCA" (Dollar Cost Average) into bitcoin. The Swan service is built-in the Hexa app. Unlike most self-custodial wallets, Hexa splits the seed into recovery keys which are then spread out over multiple devices. We posted a [screenshot of this on twitter.](https://twitter.com/BitcoinWalletz/status/1472114001916010501)

## The Site
The first level of security is the cloud backup. As Hexawallet aptly points out in their [FAQ](https://hexawallet.io/faq/),

> A normal Bitcoin Wallet relies on you remembering a set of words (often called a “mnemonic”) or a secret number (your “private key”) and losing these renders your account unusable. Hexa aims to simplify this by allowing you to recover access to your funds by splitting your seed into multiple parts (called “Recovery Keys”) shared between you and your Keepers (trusted people whom you can rely on in the event of emergency, like your mother)

Seeds are split into Recovery Keys:

> Recovery Keys are encrypted parts of your seed that are split and shared with your Keepers. Hexa creates 5 Recovery Keys, and having access to any 3 enables you to recover your wallet. These Keys are encrypted, so no one can read them without you requesting for them in the event of an emergency.




