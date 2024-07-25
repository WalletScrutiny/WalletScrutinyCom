---
wsId: breez
title: "Breez: Lightning Client & POS"
altTitle:
authors:
  - leo
  - emanuel
  - mohammad
  - keraliss
users: 10000
appId: com.breez.client
appCountry:
released:
updated: 2024-06-11
version: 0.17.lnd
stars:
ratings:
reviews:
size:
website: http://breez.technology
repository: https://github.com/breez/breezmobile
issue: https://github.com/breez/breezmobile/issues/247
icon: com.breez.client.png
bugbounty:
meta: ok
verdict: nonverifiable
date: 2024-07-24
signer:
reviewArchive:
 -  date: 2023-07-12
    version: 0.15.refund_hotfix
    appHash:
    gitRevision: 3fd8b756e9afbeface68b158e46d292877bc03d7
    verdict: nonverifiable
  - date: 2023-06-24
    version: 0.15.refund_hotfix
    appHash:
    gitRevision: 3f6ea3a7e29487f3f7144bf5e7029b90d01e3d32
    verdict: nonverifiable
twitter: breez_tech
social:
redirect_from:
  - /breez/
  - /com.breez.client/
  - /posts/2019/12/breez/
  - /posts/com.breez.client/
developerName: Breez Development LTD
features:
  - ln
---

<!-- new review here  -->

**Update: 2024-07-24** 

# 2024-07-24 Build Attempt

This Dockerfile sets up a development environment suitable for building the BreezMobile application. Here is a step-by-step breakdown of each command in the Dockerfile:

## Stage 1: Build Stage for breez.aar

### Base Image

- `FROM debian:sid-slim AS breez_aar_builder`
  - This command sets up the base image using `debian:sid-slim`. It is a minimal Debian-based image suitable for building the `breez.aar` file.

### Installing Necessary Dependencies

- `RUN set -ex; \`
  - Uses `apt-get` to update package lists and install essential build tools and dependencies such as `unzip`, `ca-certificates`, `openjdk-11-jdk`, `curl`, `git`, `wget`, and `build-essential`.

### Installing Go

- `RUN set -ex; \`
  - Installs Go by downloading the tarball, extracting it to `/usr/local`, and adding it to the `PATH`.

### Setting Up Android SDK and NDK

- `RUN set -ex; \`
  - Downloads and configures the Android SDK and NDK, including necessary licenses and command-line tools.

### Cloning the Breez Repository

- `RUN set -ex; \`
  - Clones the Breez repository from GitHub, with retry logic to handle potential cloning issues.

### Environment Variables

- `ENV ANDROID_SDK_ROOT="/home/appuser/app/sdk" \`
  - Sets environment variables for the Android SDK, Go, and other necessary configurations.

### Clean Go Module Cache and Install Dependencies

- `RUN cd /home/appuser/breez && \`
  - Cleans the Go module cache and ensures all dependencies are downloaded and verified.

### Installing gomobile and gobind

- `RUN go install golang.org/x/mobile/cmd/gomobile@latest && \`
  - Installs `gomobile` and `gobind` for building the mobile bindings.

### Building the Project

- `RUN set -ex; \`
  - Configures and builds the project using `gomobile` and a custom `build.sh` script.

## Stage 2: Final Stage for Building APK

### Base Image

- `FROM debian:sid-slim`
  - Sets up the base image for the final stage using `debian:sid-slim`.

### Installing Necessary Dependencies

- `RUN set -ex; \`
  - Installs dependencies like `gradle`, `xz-utils`, `unzip`, `zip`, `openjdk-11-jdk`, `ca-certificates`, `file`, and `curl`.

### Configuring Android SDK and Flutter

- `RUN set -ex; \`
  - Downloads and configures the Flutter SDK and Android SDK.

### Cloning BreezMobile Repository and Configuring Build

- `RUN set -ex; \`
  - Clones the BreezMobile repository, checks out the specified tag `0.17.lnd`, and configures necessary build properties.

### Copying breez.aar from Build Stage

- `COPY --from=breez_aar_builder /home/appuser/breez/build/android/breez.aar /var/local/builder/breez/builds/master/breezmobile/android/app/libs/breez.aar`
  - Copies the `breez.aar` file from the build stage to the final stage.

### Building the APK

- `RUN set -ex; \`
  - Configures the Flutter project and builds the APK using Flutter.

## Build Command

- `CMD ["/bin/bash", "-c", "cd /var/local/builder/breez/builds/master/breezmobile && /home/appuser/app/sdk/flutter/bin/flutter build apk --target-platform=android-arm64 --flavor=client --release --target=lib/main.dart --no-tree-shake-icons"]`
  - Specifies the default command to build the APK when a container is started from the image.




## Verdict

The build was successful with this command:

```bash
sudo docker build --no-cache -t breez_wallet -f com.breez.client.dockerfile .
```

```plaintext
Successfully built 8b7ab5a53f19
Successfully tagged breez_wallet:latest
```

We were also able to extract the APK from the build file and obtained the official APK from the Play Store.

We unzipped both APKs using `unzip --qqd` and tested for differences with:

```bash
diff --recursive from*
```

Upon comparing with the APK from the Play Store, we found significant differences:

```plaintext
  Binary files fromBuild/res/ZF.xml and fromOfficial/res/ZF.xml differ
  Binary files fromBuild/res/zH.xml and fromOfficial/res/zH.xml differ
  Only in fromOfficial/res: Zi.xml
  Only in fromOfficial/res: zK.png
  Only in fromBuild/res: Zk.png
  Only in fromOfficial/res: zk.xml
  Only in fromOfficial/res: zl.xml
  Only in fromOfficial/res: Zl.xml
  Only in fromOfficial/res: Zm.png
  Only in fromOfficial/res: ZM.png
  Only in fromOfficial/res: ZN.png
  Only in fromBuild/res: zN.xml
  Only in fromOfficial/res: zO1.png
  Only in fromOfficial/res: zO.png
  Only in fromOfficial/res: zp.json
  Only in fromOfficial/res: z_.png
  Only in fromBuild/res: -Z.png
  Only in fromOfficial/res: Zp.png
  Binary files fromBuild/res/zq.xml and fromOfficial/res/zq.xml differ
  Only in fromOfficial/res: ZQ.xml
  Only in fromOfficial/res: zR.png
  Only in fromOfficial/res: Zs.png
  Only in fromOfficial/res: zs.xml
  Only in fromOfficial/res: zt.png
  Only in fromOfficial/res: ZU.png
  Only in fromOfficial/res: zv.png
  Only in fromOfficial/res: ZW1.xml
  Only in fromBuild/res: zw.png
  Binary files fromBuild/res/ZW.xml and fromOfficial/res/ZW.xml differ
  Binary files fromBuild/res/z_.xml and fromOfficial/res/z_.xml differ
  Only in fromOfficial/res: -Z.xml
  Only in fromOfficial/res: Z_.xml
  Only in fromBuild/res: zy.png
  Only in fromBuild/res: zZ.png
  Binary files fromBuild/resources.arsc and fromOfficial/resources.arsc differ
  Only in fromOfficial: storedclientpaymentchannel.proto
  Only in fromOfficial: storedserverpaymentchannel.proto
  Only in fromBuild: transport-backend-cct.properties
  Only in fromBuild: transport-runtime.properties
  Only in fromBuild: vision-common.properties
  Only in fromBuild: vision-interfaces.properties
  Only in fromOfficial: wallet.proto
```

With these differences, the wallet is **not verifiable**.


---

**Update: 2023-07-12**: We tested the app another round with the apk provided in Play Store and
the result was the same as previous test:

```
$ podman build --rm -t breez_build_apk --ulimit=nofile=8192 --cgroup-manager cgroupfs -f scripts/test/container/com.breez.client
$ podman run --rm --name breez_build_apk -it breez_build_apk
$ diff --recursive --brief ./FromPlay/ ./LocalBuild/

Files ./FromPlay/AndroidManifest.xml and ./LocalBuild/AndroidManifest.xml differ
Only in ./FromPlay/META-INF: GOOGPLAY.RSA
Only in ./FromPlay/META-INF: GOOGPLAY.SF
Only in ./FromPlay/META-INF: MANIFEST.MF
Files ./FromPlay/assets/dexopt/baseline.prof and ./LocalBuild/assets/dexopt/baseline.prof differ
Files ./FromPlay/classes.dex and ./LocalBuild/classes.dex differ
Files ./FromPlay/classes2.dex and ./LocalBuild/classes2.dex differ
Files ./FromPlay/lib/arm64-v8a/libapp.so and ./LocalBuild/lib/arm64-v8a/libapp.so differ
Files ./FromPlay/lib/arm64-v8a/libflutter.so and ./LocalBuild/lib/arm64-v8a/libflutter.so differ
Files ./FromPlay/lib/arm64-v8a/libgojni.so and ./LocalBuild/lib/arm64-v8a/libgojni.so differ
Only in ./LocalBuild/lib: armeabi-v7a
Only in ./LocalBuild/lib: x86
Only in ./LocalBuild/lib: x86_64
Only in ./FromPlay/: stamp-cert-sha256
```

Which is **not verifiable**.

**Update: 2023-06-24**: The provider released a new version but some of the building issues are not fixed yet.
So building this project needs a lot of modifications that makes it hard to review. But finally we were able to
build the project using
[this Dockerfile](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/container/com.breez.client)
which is based on the
[Dockerfile provided by Emanuel](https://github.com/breez/breezmobile/issues/247#issuecomment-1207317752).

Now it's time to build the image and get a diff:

```
$ podman build --rm -t breez_build_apk --ulimit=nofile=8192 --cgroup-manager cgroupfs -f scripts/test/container/com.breez.client
$ podman run --rm --name breez_build_apk -it breez_build_apk
$ diff --recursive --brief ./FromGithub/ ./LocalBuild/

Files ./FromGithub/AndroidManifest.xml and ./LocalBuild/AndroidManifest.xml differ
Only in ./FromGithub/META-INF: GOOGPLAY.RSA
Only in ./FromGithub/META-INF: GOOGPLAY.SF
Only in ./FromGithub/META-INF: MANIFEST.MF
Files ./FromGithub/assets/dexopt/baseline.prof and ./LocalBuild/assets/dexopt/baseline.prof differ
Files ./FromGithub/classes.dex and ./LocalBuild/classes.dex differ
Files ./FromGithub/classes2.dex and ./LocalBuild/classes2.dex differ
Files ./FromGithub/lib/arm64-v8a/libapp.so and ./LocalBuild/lib/arm64-v8a/libapp.so differ
Files ./FromGithub/lib/arm64-v8a/libflutter.so and ./LocalBuild/lib/arm64-v8a/libflutter.so differ
Files ./FromGithub/lib/arm64-v8a/libgojni.so and ./LocalBuild/lib/arm64-v8a/libgojni.so differ
Only in ./LocalBuild/lib: armeabi-v7a
Only in ./LocalBuild/lib: x86
Only in ./LocalBuild/lib: x86_64
Only in ./FromGithub/: stamp-cert-sha256
```

With diffs in some binary files the wallet is **not verifiable**.

## Original Analysis

A description to our liking. Here it is in full:

> Breez is a Lightning Network client which makes paying in bitcoin a seamless
> experience. With Breez, anyone can send or receive small payments in bitcoin.
> It's simple, fast and safe.

Ok, seamless, lightning, ... nice.

> Breez is a non-custodial service that uses lnd and Neutrino under the hood.

We want to hear that! Be your own bank!

> For more technical information, please go to: https://github.com/breez/breezmobile.

So they are non-custodial and provide source code. More work for us :)

> Warning: the app is still in beta and there is a chance your money will be
> lost. Use this app only if you are willing to take this risk.

That's certainly inspiring more confidence than other apps with 2 months of
track record claiming to be the best in the world. :)

Well, in terms of [Build Instructions](https://github.com/breez/breezmobile#build)
the app is lacking.

```
$ git clone git@github.com:breez/breezmobile.git
$ cd breezmobile/
$ git tag
0.5-openbeta
0.5.8-openbeta
0.5.9-openbeta
0.7-openbeta
0.8.improvements
```

As on the playstore it says "**Current Version:** Varies with device", we go with
what google gives us when we install it on a phone: `0.8-beta`. The best match above would thus be the tag
`0.8.improvements`:

```
$ git checkout 0.8.improvements
$ cat android/app/build.gradle | grep version
        versionCode 1
        versionName "0.8-beta"
            versionNameSuffix "-pos"
```

looks good so far. For now. We will not guess like this in the future.

> Build breez.aar and bindings.framework as decribed in breez/breez

```
$ git submodule status
$
```

... so ... the build instructions give no clue which version of breez/breez to
build and there is no submodule?

```
$ git clone git@github.com:breez/breez.git
$ cd breez
$ git tag
0.5-openbeta
0.5.8-openbeta
```

Had there been a `0.8`... in the breez project, we would have had a clue
where to go next but absent that, there is no hope of reproducing the app. For
now our verdict is: **not verifiable**.
