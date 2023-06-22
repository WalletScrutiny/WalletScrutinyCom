---
wsId: zeusln
title: 'Zeus: Bitcoin and Lightning'
altTitle: 
authors:
- leo
users: 5000
appId: app.zeusln.zeus
appCountry: 
released: 2020-07-07
updated: 2023-06-13
version: 0.7.6
stars: 4.3
ratings: 45
reviews: 22
size: 
website: https://zeusln.app
repository: https://github.com/ZeusLN/zeus
issue: https://github.com/ZeusLN/zeus/issues/1516
icon: app.zeusln.zeus.png
bugbounty: 
meta: ok
verdict: ftbfs
date: 2023-06-22
signer: 
reviewArchive:
- date: 2021-08-30
  version: 0.5.1
  appHash: 
  gitRevision: b8c409778e3fcce1f150fe5cdcb965bde3267e7d
  verdict: nonverifiable
twitter: ZeusLN
social:
- https://iris.to/zeus@zeusln.app
- https://t.me/ZeusLN
redirect_from:
- /app.zeusln.zeus/
- /posts/app.zeusln.zeus/
developerName: Atlas 21 Inc.
features:
- ln

---

**Update 2023-06-21**: The provider claimed reproducibility, closing
[our respective issue](https://github.com/ZeusLN/zeus/issues/416) on 2022-08-29,
a time at which we had no funding. The provider reminded me (Leo) of this in
March and apparently I did start work on this as
[an incomplete build script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blame/dc67fae2236ee5649ef358884fb5ec899fbdaeb8/scripts/test/android/app.zeusln.zeus.sh)
was added but I added it with
[this commit](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/commit/dc67fae2236ee5649ef358884fb5ec899fbdaeb8)
where it did not belong. By accidentally adding it to this commit, my work in
progress disappeared from my "desk" so to say.
Apologies for forgetting about this interesting project for so long. There is no
excuse and we are improving our scripts to circle back to products in a
more timely fashion. Time to reproduce their current version `0.7.6`:

{{ page.title }} provided documentation for reproducible builds
[here](https://github.com/ZeusLN/zeus#reproducible-builds).

Let's see if we can run this in a container. We don't want to run changing
scripts on our machine without a container to avoid effects on other parts of
our system ...

Chosing a container for android builds ...

```
$ podman run -it --rm --volume=$PWD:/mnt --workdir /mnt mreichelt/android:latest bash
root@d529e4616416:/mnt# git clone https://github.com/ZeusLN/zeus
root@d529e4616416:/mnt# cd zeus/
root@d529e4616416:/mnt/zeus# git checkout v0.7.6
root@d529e4616416:/mnt/zeus# ./build.sh
./build.sh: line 7: docker: command not found
```

Ok, the build script itself wants to start a container using docker. We have to
copy its commands into our build script as running nested docker is complicated.

```
root@d529e4616416:/mnt/zeus# cat build.sh 
#!/bin/bash
# reactnativecommunity/react-native-android:7.0
BUILDER_IMAGE="reactnativecommunity/react-native-android@sha256:7bbad62c74f01b2099163890fd11ab7b37e8a496528e6af2dfaa1f29369c2e24"
CONTAINER_NAME="zeus_builder_container"
ZEUS_PATH=/olympus/zeus

docker run --rm --name $CONTAINER_NAME -v `pwd`:$ZEUS_PATH $BUILDER_IMAGE bash -c \
     'echo -e "\n\n********************************\n*** Building Zeus...\n********************************\n" && \
      cd /olympus/zeus ; yarn install --frozen-lockfile && \
      cd /olympus/zeus/node_modules/@lightninglabs/lnc-rn ; bash fetch-libraries.sh && \
      cd /olympus/zeus/android ; ./gradlew app:assembleRelease && \

      echo -e "\n\n********************************\n**** APKs and SHA256 Hashes\n********************************\n" && \
      cd /olympus/zeus && \
      for f in android/app/build/outputs/apk/release/*.apk;
      do
	      RENAMED_FILENAME=$(echo $f | sed -e "s/app-/zeus-/" | sed -e "s/-release-unsigned//")
	      mv $f $RENAMED_FILENAME
	      sha256sum $RENAMED_FILENAME
      done && \
      echo -e "\n" ';
```

Fair enough. Let's try that.
[reactnativecommunity/react-native-android@sha256:7bbad62c74f01b2099163890fd11ab7b37e8a496528e6af2dfaa1f29369c2e24](https://hub.docker.com/layers/reactnativecommunity/react-native-android/7/images/sha256-7bbad62c74f01b2099163890fd11ab7b37e8a496528e6af2dfaa1f29369c2e24?context=explore)
appears to be a neutral image we can assume not to be controlled by the
provider. With 3.46GB it is though much bigger than any other image we used so
far. For the purpose of this test, we assume that these 3.46GB do not introduce
any backdoor but would prefer a less complex image.

Trying out the command line by line interactively. That's better to understand
what's going on.

```
$ podman run -it --rm --volume=$PWD:/olympus/zeus --workdir /mnt --name zeus_builder_container reactnativecommunity/react-native-android@sha256:7bbad62c74f01b2099163890fd11ab7b37e8a496528e6af2dfaa1f29369c2e24 bash
root@bb1bfd4bf69e:/mnt# cd /olympus/zeus ; yarn install --frozen-lockfile
yarn install v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
...
[4/4] Building fresh packages...
$ rn-nodeify --install --hack; npx jetify; yarn run patch; react-native setup-ios-permissions; yarn run install-lnc; pod-install
not overwriting "assert"
not overwriting "browserify-zlib"
```

`rn-nodeify --install --hack; npx jetify; yarn run patch` sounds mildly scary
but reviewing in detail is beyond our scope.

```
failed to parse node_modules/resolve/test/resolver/malformed_package_json/package.json
hacking /olympus/zeus/node_modules/assert/assert.js
hacking /olympus/zeus/node_modules/form-data/package.json
hacking /olympus/zeus/node_modules/iconv-lite/package.json
```

Something failed. More "hacking". So far we only ran `yarn install` which runs
`package.json`'s `postinstall`: `rn-nodeify --install --hack; npx jetify; yarn run patch; react-native setup-ios-permissions; yarn run install-lnc; pod-install` which contains steps for the iOS app that we are not planning to build here.

`yarn run install-lnc` also appears to be doing the same as the next command
from `build.sh`: `cd /olympus/zeus/node_modules/@lightninglabs/lnc-rn ; bash fetch-libraries.sh`. Subsequently the 77 and 170MB downloads are run twice.

```
yarn run v1.22.19
$ git apply patches/rnqli-build.gradle.patch
Done in 0.06s.
warn Package react-native-blob-util contains invalid configuration: "dependency.hooks" is not allowed. Please verify it's properly linked using "react-native config" command and contact the package maintainers about this.
warn Package react-native-vector-icons contains invalid configuration: "dependency.assets" is not allowed. Please verify it's properly linked using "react-native config" command and contact the package maintainers about this.
yarn run v1.22.19
$ cd node_modules/@lightninglabs/lnc-rn; yarn run fetch-libraries
$ bash fetch-libraries.sh
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 77.0M  100 77.0M    0     0  2475k      0  0:00:31  0:00:31 --:--:-- 1733k
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100  170M  100  170M    0     0  1015k      0  0:02:51  0:02:51 --:--:-- 2702k
```

And then came a bunch of warnings:

```
WARNING:We recommend using a newer Android Gradle plugin to use compileSdk = 33

This Android Gradle plugin (7.2.1) was tested up to compileSdk = 32

This warning can be suppressed by adding
    android.suppressUnsupportedCompileSdk=33
to this project's gradle.properties

The build will continue, but you are strongly encouraged to update your project to
use a newer Android Gradle Plugin that has been tested with compileSdk = 33
WARNING:The specified Android SDK Build Tools version (23.0.1) is ignored, as it is below the minimum supported version (30.0.3) for Android Gradle Plugin 7.2.1.
Android SDK Build Tools 30.0.3 will be used.
```

and more warnings.

```
  - Gradle detected a problem with the following location: '/olympus/zeus'. Reason: Task ':app:bundleReleaseJsAndAssets' uses this output of task ':react-native-image-picker:compileReleaseAidl' without declaring an explicit or implicit dependency. This can lead to incorrect results being produced, depending on what order the tasks are executed. Please refer to https://docs.gradle.org/7.5.1/userguide/validation_problems.html#implicit_dependency for more details about this problem.

```

Lines like this: 316

And after that, the script stopped for the past hour.

Time to try out what Emanuel did to reproduce this product.

Just running the script with the new version number failed, complaining about:

```
> Could not find method compile() for arguments [directory 'libs'] on object of type org.gradle.api.internal.artifacts.dsl.dependencies.DefaultDependencyHandler.
```

That looks like the patch from above. Adding this ... and with a few more rounds
of trying, the result was again a build process stuck at what the past approach
got stuck at. 316 warnings and no further output.

Now already familiar with the provided build script, we try this, too:

```
$ git clone --depth 1 --branch v0.7.6 https://github.com/ZeusLN/zeus.git
Cloning into 'zeus'...
remote: Enumerating objects: 545, done.
remote: Counting objects: 100% (545/545), done.
remote: Compressing objects: 100% (476/476), done.
remote: Total 545 (delta 120), reused 312 (delta 43), pack-reused 0
Receiving objects: 100% (545/545), 8.35 MiB | 3.76 MiB/s, done.
Resolving deltas: 100% (120/120), done.
$ cd zeus/
zeus((no branch))$ ./build.sh 


********************************
*** Building Zeus...
********************************

yarn install v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
warning " > @react-navigation/bottom-tabs@5.11.11" has incorrect peer dependency "@react-navigation/native@^5.0.5".
warning " > lottie-react-native@5.1.5" has unmet peer dependency "lottie-ios@^3.4.0".
warning " > mobx-react@6.1.4" has incorrect peer dependency "react@^16.8.0 || 16.9.0-alpha.0".
warning "mobx-react > mobx-react-lite@1.5.2" has incorrect peer dependency "react@^16.8.0".
warning "react-native > react-native-codegen > jscodeshift@0.13.1" has unmet peer dependency "@babel/preset-env@^7.1.6".
...
> Task :react-native-tor:copyReleaseJniLibsProjectAndLocalJars
> Task :react-native-tcp:generateReleaseRFile
> Task :react-native-tor:compileReleaseRenderscript NO-SOURCE
> Task :react-native-tcp:extractReleaseAnnotations

> Task :react-native-tcp:compileReleaseJavaWithJavac FAILED
/olympus/zeus/node_modules/react-native-tcp/android/src/main/java/com/peel/react/TcpSockets.java:8: error: package android.support.annotation does not exist
import android.support.annotation.Nullable;
                                 ^
/olympus/zeus/node_modules/react-native-tcp/android/src/main/java/com/peel/react/TcpSocketManager.java:3: error: package android.support.annotation does not exist
import android.support.annotation.Nullable;
                                 ^
/olympus/zeus/node_modules/react-native-tcp/android/src/main/java/com/peel/react/TcpSockets.java:105: error: cannot find symbol
    public void connect(final Integer cId, final @Nullable String host, final Integer port, final ReadableMap options) {
                                                  ^
  symbol:   class Nullable
  location: class TcpSockets
/olympus/zeus/node_modules/react-native-tcp/android/src/main/java/com/peel/react/TcpSocketManager.java:122: error: cannot find symbol
    public void connect(final Integer cId, final @Nullable String host, final Integer port) throws UnknownHostException, IOException {
                                                  ^
  symbol:   class Nullable
  location: class TcpSocketManager
Note: /olympus/zeus/node_modules/react-native-tcp/android/src/main/java/com/peel/react/TcpSockets.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
4 errors

FAILURE: Build completed with 2 failures.

1: Task failed with an exception.
-----------
* What went wrong:
Execution failed for task ':react-native-tcp:compileReleaseJavaWithJavac'.
> Compilation failed; see the compiler error output for details.

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
==============================================================================

2: Task failed with an exception.
-----------
* What went wrong:
java.lang.StackOverflowError (no error message)

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
==============================================================================

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.5.1/userguide/command_line_interface.html#sec:command_line_warnings
BUILD FAILED in 4m 26s


Execution optimizations have been disabled for 11 invalid unit(s) of work during this build to ensure correctness.
Please consult deprecation warnings for more details.
528 actionable tasks: 528 executed
```

which also ended in errors. At this point we give up and file this version as
**not verifiable**, waiting for
[our issue](https://github.com/ZeusLN/zeus/issues/1516) to be resolved.

## Original Analysis

This app is a bit special as it does not hold your private keys but neither is
it custodial. It remote-controls your lightning node that you can run for
example at home. So it is a wallet in that you can use it to send and receive
Bitcoins.

And ... best of all:

> Furthermore our builds have no proprietary dependencies, are reproducible, and
  are distributed on F-Droid.

they claim to have reproducible builds! Being on F-Droid this is highly likely
to be reproducible for us, too. Let's see how it goes:

On [the repository](https://github.com/ZeusLN/zeus) there is no special mention
of reproducible builds. Only that the Play Store release is built from the
[play-releases branch](https://github.com/ZeusLN/zeus/tree/play-releases).

In that play-releases branch there is no special mention on reproducibility
neither. The build instructions end in:

```
npm i
react-native run-android
```

but `react-native run-android` is not a command to create the apk. It's to
install the app on a connected device. We'll go with

```
cd android
./gradlew assembleRelease
```

instead.

Also we will need version 0.5.1 which is the latest version we got from the Play
Store. (The following is the pruned version after [some detours](https://github.com/ZeusLN/zeus/issues/416#issuecomment-815419535).)

```
$ git clone https://github.com/ZeusLN/zeus
$ cd zeus/
$ git tag | grep 0.5.1
v0.5.1
$ git checkout v0.5.1 
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm beevelop/cordova bash
root@b5e24bbdc208:/mnt# npm install  
root@b5e24bbdc208:/mnt# npm install stream
root@b5e24bbdc208:/mnt# yes | $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-28"
root@c6e507f0b5dc:/mnt# npx react-native run-android
root@b5e24bbdc208:/mnt# cd android
root@c6e507f0b5dc:/mnt/android# echo -e "\nMYAPP_RELEASE_KEY_ALIAS=a\nMYAPP_RELEASE_KEY_PASSWORD=aaaaaa\nMYAPP_RELEASE_STORE_PASSWORD=aaaaaa\nMYAPP_RELEASE_STORE_FILE=../dummy.keystore"  >> gradle.properties
root@c6e507f0b5dc:/mnt# keytool -genkey -v -keystore dummy.keystore -alias a -keyalg RSA -keysize 2048 -validity 10

(entering password aaaaaa and all the rest defaults.)

root@b5e24bbdc208:/mnt/android# ./gradlew assembleRelease
BUILD SUCCESSFUL in 40s
564 actionable tasks: 279 executed, 285 up-to-date
root@c6e507f0b5dc:/mnt/android# ls -alh app/build/outputs/apk/release/
total 126M
drwxr-xr-x 2 root root 4.0K Apr  8 04:28 .
drwxr-xr-x 4 root root 4.0K Apr  8 04:28 ..
-rw-r--r-- 1 root root  18M Apr  8 04:28 app-arm64-v8a-release.apk
-rw-r--r-- 1 root root  17M Apr  8 04:28 app-armeabi-v7a-release.apk
-rw-r--r-- 1 root root  55M Apr  8 04:28 app-universal-release.apk
-rw-r--r-- 1 root root  19M Apr  8 04:28 app-x86-release.apk
-rw-r--r-- 1 root root  19M Apr  8 04:28 app-x86_64-release.apk
-rw-r--r-- 1 root root 1.7K Apr  8 04:28 output.json
root@c6e507f0b5dc:/mnt/android# exit
$ apktool d -o fromGoogle Zeus\ 0.5.1\ \(app.zeusln.zeus\).apk 
$ apktool d -o fromBuild android/app/build/outputs/apk/release/app-universal-release.apk 
$ diff --brief --recursive from{Google,Build}
Files fromGoogle/AndroidManifest.xml and fromBuild/AndroidManifest.xml differ
Files fromGoogle/apktool.yml and fromBuild/apktool.yml differ
Files fromGoogle/assets/index.android.bundle and fromBuild/assets/index.android.bundle differ
Files fromGoogle/lib/arm64-v8a/libimagepipeline.so and fromBuild/lib/arm64-v8a/libimagepipeline.so differ
Files fromGoogle/lib/arm64-v8a/libnative-filters.so and fromBuild/lib/arm64-v8a/libnative-filters.so differ
Files fromGoogle/lib/arm64-v8a/libnative-imagetranscoder.so and fromBuild/lib/arm64-v8a/libnative-imagetranscoder.so differ
Files fromGoogle/lib/arm64-v8a/libsifir_android.so and fromBuild/lib/arm64-v8a/libsifir_android.so differ
Files fromGoogle/lib/arm64-v8a/libv8android.so and fromBuild/lib/arm64-v8a/libv8android.so differ
Files fromGoogle/lib/armeabi-v7a/libimagepipeline.so and fromBuild/lib/armeabi-v7a/libimagepipeline.so differ
Files fromGoogle/lib/armeabi-v7a/libnative-filters.so and fromBuild/lib/armeabi-v7a/libnative-filters.so differ
Files fromGoogle/lib/armeabi-v7a/libnative-imagetranscoder.so and fromBuild/lib/armeabi-v7a/libnative-imagetranscoder.so differ
Files fromGoogle/lib/armeabi-v7a/libsifir_android.so and fromBuild/lib/armeabi-v7a/libsifir_android.so differ
Files fromGoogle/lib/armeabi-v7a/libv8android.so and fromBuild/lib/armeabi-v7a/libv8android.so differ
Files fromGoogle/lib/x86/libimagepipeline.so and fromBuild/lib/x86/libimagepipeline.so differ
Files fromGoogle/lib/x86/libnative-filters.so and fromBuild/lib/x86/libnative-filters.so differ
Files fromGoogle/lib/x86/libnative-imagetranscoder.so and fromBuild/lib/x86/libnative-imagetranscoder.so differ
Files fromGoogle/lib/x86/libsifir_android.so and fromBuild/lib/x86/libsifir_android.so differ
Files fromGoogle/lib/x86/libv8android.so and fromBuild/lib/x86/libv8android.so differ
Files fromGoogle/lib/x86_64/libimagepipeline.so and fromBuild/lib/x86_64/libimagepipeline.so differ
Files fromGoogle/lib/x86_64/libnative-filters.so and fromBuild/lib/x86_64/libnative-filters.so differ
Files fromGoogle/lib/x86_64/libnative-imagetranscoder.so and fromBuild/lib/x86_64/libnative-imagetranscoder.so differ
Files fromGoogle/lib/x86_64/libsifir_android.so and fromBuild/lib/x86_64/libsifir_android.so differ
Files fromGoogle/lib/x86_64/libv8android.so and fromBuild/lib/x86_64/libv8android.so differ
Files fromGoogle/original/AndroidManifest.xml and fromBuild/original/AndroidManifest.xml differ
Only in fromBuild/original/META-INF: CERT.RSA
Only in fromBuild/original/META-INF: CERT.SF
Only in fromGoogle/original/META-INF: GOOGPLAY.RSA
Only in fromGoogle/original/META-INF: GOOGPLAY.SF
Files fromGoogle/original/META-INF/MANIFEST.MF and fromBuild/original/META-INF/MANIFEST.MF differ
Only in fromGoogle/res/raw: node_modules_browserifyaes_modes_list.json
Only in fromGoogle/res/raw: node_modules_browserifysign_browser_algorithms.json
Only in fromGoogle/res/raw: node_modules_browserifysign_browser_curves.json
Only in fromGoogle/res/raw: node_modules_diffiehellman_lib_primes.json
Files fromGoogle/res/raw/node_modules_elliptic_package.json and fromBuild/res/raw/node_modules_elliptic_package.json differ
Only in fromGoogle/res/raw: node_modules_parseasn1_aesid.json
Files fromGoogle/res/values/public.xml and fromBuild/res/values/public.xml differ
```

and that's a lot of diffs in a lot of different files. The app cannot be
reproduced from the existing source code given the not given build
instructions(?). The app is **not verifiable**.
