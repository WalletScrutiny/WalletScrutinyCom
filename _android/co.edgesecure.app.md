---
wsId: edge
title: Edge - Bitcoin & Crypto Wallet
altTitle: 
authors:
- leo
- emanuel
users: 500000
appId: co.edgesecure.app
appCountry: 
released: 2018-03-01
updated: 2024-04-23
version: 4.5.0
stars: 4.2
ratings: 3880
reviews: 652
size: 
website: https://edge.app
repository: https://github.com/EdgeApp/edge-react-gui
issue: https://github.com/EdgeApp/edge-react-gui/issues/1748
icon: co.edgesecure.app.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-11-01
signer: 
reviewArchive:
- date: 2022-11-02
  version: 2.25.0
  appHash: 
  gitRevision: 40f08fdf8b2ed3762dba004a2500fa19b5a5eb02
  verdict: ftbfs
- date: 2022-03-13
  version: 2.12.0
  appHash: 
  gitRevision: 26a46f55d9739ede4c8b778ac3ae1ce6c91995b9
  verdict: ftbfs
- date: 2019-11-10
  version: 1.10.1
  appHash: 
  gitRevision: 1707808e9efc2ab4ea3a03510ebd408811586d47
  verdict: nonverifiable
twitter: edgewallet
social:
- https://www.linkedin.com/company/edgeapp
- https://www.reddit.com/r/EdgeWallet
redirect_from:
- /edge/
- /co.edgesecure.app/
- /posts/2019/11/edge/
- /posts/co.edgesecure.app/
developerName: Edge (formerly Airbitz)
features: 

---

**Update 2023-10-31**: Our latest issue was not addressed by the provider but
Emanuel had managed to compile a prior version of this app. Let's see how it
goes for version `3.20.0`:

Emanuel had managed to build the prior version using

```
$ podman build --rm -t edge_build_apk -f scripts/test/container/co.edgesecure.app
```

but here, this resulted repeatedly in different errors:

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':react-native-haptic-feedback'.
> java.util.concurrent.ExecutionException: org.gradle.api.GradleException: Failed to create Jar file /home/appuser/.gradle/caches/jars-9/04d45982efaf99f21af92706e55e06a4/sdk-common-26.0.0.jar.

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.5.1/userguide/command_line_interface.html#sec:command_line_warnings
5 actionable tasks: 5 executed

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 17m 17s
Error: error building at STEP "RUN set -ex;      cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/ ;      ./gradlew packageReleaseUniversalApk": error while running runtime: exit status 1
```

or

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':react-native-haptic-feedback'.
> java.util.concurrent.ExecutionException: org.gradle.api.UncheckedIOException: Failed to create receipt for instrumented classpath file 'f2b464732555e5b93522a12e9f7cd898/manifest-merger-26.0.0.jar'.

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.5.1/userguide/command_line_interface.html#sec:command_line_warnings

BUILD FAILED in 8m 35s
5 actionable tasks: 5 executed
Error: error building at STEP "RUN set -ex;      cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/ ;      ./gradlew clean": error while running runtime: exit status 1
```

or

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':react-native-screens'.
> Could not resolve all files for configuration ':react-native-screens:classpath'.
   > Could not download gradle-4.2.2.jar (com.android.tools.build:gradle:4.2.2)
      > Could not get resource 'https://dl.google.com/dl/android/maven2/com/android/tools/build/gradle/4.2.2/gradle-4.2.2.jar'.
         > java.io.IOException: No file descriptors available
   > Could not download builder-4.2.2.jar (com.android.tools.build:builder:4.2.2)
      > Could not get resource 'https://dl.google.com/dl/android/maven2/com/android/tools/build/builder/4.2.2/builder-4.2.2.jar'.
         > java.io.IOException: No file descriptors available
```

That latter one looks like an issue with the internet connection. Anyway. We
tried to go step by step. Omitting the very verbose bulk of the output, here are
the commands we ran to obtain an apk:

```
$ podman run -it --rm --volume $PWD:/mnt frolvlad/alpine-glibc sh
/ # apk update
/ # apk add --no-cache \
   git \
   npm \
   yarn \
   openjdk11
/ # adduser -D appuser
/ # mkdir -p "/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/"
/ # chown -R appuser:appuser /Users/
/ # su - appuser
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android$ export NODE_ENV="development" \
     ANDROID_SDK_ROOT="/home/appuser/sdk/" \
     ANDROID_HOME="/home/appuser/sdk/" \
     AIRBITZ_API_KEY="74591cbad4a4938e0049c9d90d4e24091e0d4070" \
     BUGSNAG_API_KEY="5aca2dbe708503471d8137625e092675"
a77152952cd1:~$ mkdir -p "/home/appuser/sdk/licenses"
a77152952cd1:~$ printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/sdk/licenses/android-sdk-license"
a77152952cd1:~$ cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master$ git clone --branch v3.20.0 --depth 1 --no-tags --single-branch https://github.com/EdgeApp/edge-react-gui/ .
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master$ yarnpkg install --frozen-lockfile --ignore-scripts
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master$ yarnpkg prepare
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master$ cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android$ ./gradlew packageReleaseUniversalApk
...
BUILD SUCCESSFUL in 18m 17s
965 actionable tasks: 965 executed
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android$ exit
/ # cp /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/app/build/outputs/universal_apk/release/app-release-universal.apk /mnt/
```

Notice, we also tried running what the
[build instructions](https://github.com/EdgeApp/edge-react-gui#android-1) say:

```
> Task :app:bugsnagReleaseReleaseTask FAILED
Bugsnag: Uploading to Releases API
{"errors":["API key not recognised: a0000000000000000000000000000000"],"status":"error"}

> Task :app:createReleaseApkListingFileRedirect

FAILURE: Build failed with an exception.
```

but that fails because the application of the API keys was omitted. Emanuel had
patched the source with the provider's API key but I prefer not to upload stuff
to their Bugsnag account or generally to patch the source to make it
reproducible, so I will leave it at this and go with the build result from
above.

With the apk from our build and the apk from Google Play in the same folder:

```
$ unzip -d fromGoogle Edge\ 3.20.0\ \(co.edgesecure.app\).apk 
$ unzip -d fromBuild app-release-universal.apk 
$ diff --recursive from*
Binary files fromBuild/AndroidManifest.xml and fromGoogle/AndroidManifest.xml differ
Only in fromGoogle/assets: dexopt
Binary files fromBuild/assets/index.android.bundle and fromGoogle/assets/index.android.bundle differ
Binary files fromBuild/classes.dex and fromGoogle/classes.dex differ
Binary files fromBuild/lib/arm64-v8a/libedge-core-jni.so and fromGoogle/lib/arm64-v8a/libedge-core-jni.so differ
Binary files fromBuild/lib/arm64-v8a/libmymonero-jni.so and fromGoogle/lib/arm64-v8a/libmymonero-jni.so differ
Binary files fromBuild/lib/arm64-v8a/libreanimated.so and fromGoogle/lib/arm64-v8a/libreanimated.so differ
Binary files fromBuild/lib/armeabi-v7a/libedge-core-jni.so and fromGoogle/lib/armeabi-v7a/libedge-core-jni.so differ
Binary files fromBuild/lib/armeabi-v7a/libmymonero-jni.so and fromGoogle/lib/armeabi-v7a/libmymonero-jni.so differ
Binary files fromBuild/lib/armeabi-v7a/libreanimated.so and fromGoogle/lib/armeabi-v7a/libreanimated.so differ
Binary files fromBuild/lib/x86/libedge-core-jni.so and fromGoogle/lib/x86/libedge-core-jni.so differ
Binary files fromBuild/lib/x86/libmymonero-jni.so and fromGoogle/lib/x86/libmymonero-jni.so differ
Binary files fromBuild/lib/x86/libreanimated.so and fromGoogle/lib/x86/libreanimated.so differ
Binary files fromBuild/lib/x86_64/libedge-core-jni.so and fromGoogle/lib/x86_64/libedge-core-jni.so differ
Binary files fromBuild/lib/x86_64/libmymonero-jni.so and fromGoogle/lib/x86_64/libmymonero-jni.so differ
Binary files fromBuild/lib/x86_64/libreanimated.so and fromGoogle/lib/x86_64/libreanimated.so differ
Binary files fromBuild/resources.arsc and fromGoogle/resources.arsc differ
$ sha256sum Edge\ 3.20.0\ \(co.edgesecure.app\).apk 
115fa7dbd478a0812048d416c94766e1bf548517a4960cf035225946fec50d0b  Edge 3.20.0 (co.edgesecure.app).apk
```

This app is clear **not verifiable**.

## Reveiw 2022-11-02:

Their latest version on Play Store is 2.25.0. The last version we checked did
not match the code. Let's see how it goes now ...

Using [Emanuel's Container file](https://github.com/EdgeApp/edge-react-gui/issues/1748#issuecomment-1065934661)
updated to 2.25.0:

```
...
+ cp /home/appuser/app/edgeUpstreamAPK/res/raw/env.json ./env.json
cp: can't stat '/home/appuser/app/edgeUpstreamAPK/res/raw/env.json': No such file or directory
Error: error building at STEP "RUN set -ex;     cd edge-react-gui;     git checkout v2.25.0;     yarnpkg install --frozen-lockfile --ignore-optional --ignore-scripts;     yarnpkg prepare;     cp /home/appuser/app/edgeUpstreamAPK/res/raw/env.json ./env.json;     cd android;     ./gradlew assembleRelease": error while running runtime: exit status 1
```

ran into an error. The `env.json` configuration file that Emanuel had extracted
from the binary we are trying to test is not in the binary anymore.

After removing that part of the container file, it **fails to build from source**:
  
```
$ podman build --rm -t edge_build_apk -f scripts/test/container/co.edgesecure.app
...
> Task :bugsnag_react-native:compileReleaseKotlin
w: /home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/src/main/java/com/bugsnag/android/BugsnagReactNative.kt: (204, 48): Elvis operator (?:) always returns the left operand of non-nullable type ReadableMap

> Task :bugsnag_react-native:javaPreCompileRelease
> Task :disklet:generateReleaseBuildConfig

> Task :bugsnag_react-native:compileReleaseJavaWithJavac FAILED
/home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/src/main/java/com/bugsnag/android/BugsnagPackage.java:1: error: cannot access com.bugsnag.android
package com.bugsnag.android;
^
  /home/appuser/.gradle/caches/transforms-3/db229a6e5f4fe0ba69c000c5a66ca523/transformed/swiperefreshlayout-1.0.0-api.jar: No file descriptors available
/home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/build/generated/source/buildConfig/release/com/bugsnag/reactnative/BuildConfig.java:4: error: cannot access com.bugsnag.reactnative
package com.bugsnag.reactnative;
^
  /home/appuser/.gradle/caches/transforms-3/db229a6e5f4fe0ba69c000c5a66ca523/transformed/swiperefreshlayout-1.0.0-api.jar: No file descriptors available
2 errors

FAILURE: Build failed with an exception.
...
```

This release is **not verifiable**.
