---
wsId: Mixin
title: Mixin Crypto Wallet Messenger
altTitle: 
authors:
- danny
- emanuel
- leo
users: 50000
appId: one.mixin.messenger
appCountry: us
released: 2018-05-24
updated: 2025-04-25
version: 3.0.0
stars: 4.4
ratings: 1252
reviews: 153
website: https://mixin.one/messenger
repository: https://github.com/MixinNetwork/android-app
issue: https://github.com/MixinNetwork/android-app/issues/4980
icon: one.mixin.messenger.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: []
date: 2024-09-19
signer: 
twitter: MixinMessenger
social:
- https://www.facebook.com/MixinNetwork
- https://www.reddit.com/r/mixin
redirect_from: 
developerName: Mixin Ltd
features: 

---

**Update 2024-09-19**: 

We attempted to build again with the knowledge that an [MR has been merged](https://github.com/MixinNetwork/android-app/pull/3899) regarding Emanuel's issue. We assume that the app could be built from hereon. 

We begin our manual attempt, with this Dockerfile:

```
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    git \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin


RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools
RUN cd $ANDROID_SDK_ROOT/cmdline-tools && \
    curl -L --retry 5 --retry-connrefused --insecure https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -o commandlinetools.zip && \
    unzip commandlinetools.zip && \
    rm commandlinetools.zip && \
    mv cmdline-tools latest

RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"

RUN sdkmanager "ndk;27.0.12077973"

RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \
    && echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /root/.bashrc \
    && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
```

We build the docker image:

``` bash
cd /tmp/manualtest_one.mixin.messenger
docker build -t mixin-image . && docker run -it --rm -v "$(pwd)":/mnt mixin-image
```

From there, we execute:

``` bash
# cd /mnt
# git clone https://github.com/MixinNetwork/android-app.git
# cd android-app
# export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
# export ANDROID_SDK_ROOT=/opt/android-sdk
# export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$JAVA_HOME/bin
# yes | sdkmanager --licenses
# sdkmanager "platforms;android-31" "build-tools;31.0.0"
# ./gradlew assembleRelease --stacktrace

```

The complete [nosbin paste](https://nosbin.com/nevent1qqsxlafurq3mtyzc39hwlm2qv95upu09gf3cmzvdgk8ppa32847vewqpzemhxue69uhkzarvv9ejumn0wd68ytnvv9hxgqg4waehxw309ajkgetw9ehx7um5wghxcctwvsq3wamnwvaz7tmwdaehgu3wvekhgtnhd9azucnf0gq3gamnwvaz7tmwdaehgu3wdau8gu3wv3jhvqgswaehxw309ahx7um5wgh8w6twv5q3jamnwvaz7tmwdaehgu3w0fjkyetyv4jjucmvda6kgqghwaehxw309aex2mrp0yhxxatjwfjkuapwveukjqg5waehxw309aex2mrp0yhxgctdw4eju6t0qyt8wumn8ghj7un9d3shjtnwdaeky6tw9e3k7mgprfmhxue69uhhyetvv9ujummjv9hxwetsd9kxctnyv4mqzxrhwden5te0wfjkccte9eekummjwsh8xmmrd9skc8zumss)

Viewable as an asciicast [here.](https://asciinema.org/a/dRDe43PIxaLOXtRCB2Rsnp00r)

After 3 attempts, we noticed a recurring problem whenever we tried to execute `./gradlew`.

``` shell
Could not resolve com.mapbox.maps:android:10.10.0.
     Required by:
         project :app

> Could not get resource 'https://maven.pkg.github.com/checkout/checkout-3ds-sdk-android/com/mapbox/plugin/maps-lifecycle/10.10.0/maps-lifecycle-10.10.0.pom'.
            > Username must not be null!
```

Another user faced a similar problem [in Github issues](https://github.com/MixinNetwork/android-app/issues/4374). Devs confirm a *[Mapbox secret token](https://docs.mapbox.com/android/maps/guides/install/)* is required by one of the SDKs used to build Mixin Messenger

It's a secret token meaning you're expected to provide your own. To do that, you must create an account with Mapbox.

NOTE: **Signing up to MAPBOX requires you input your credit card information - and tax identification number. There's a free tier, but the credit card and tax identification number gave us pause.**

We raised this concern with them on [x.com](https://x.com/dannybuntu/status/1836681311114924146).

We verified these requirements in: 

**[app/build.gradle:](https://github.com/MixinNetwork/android-app/blob/7073cb70e8044ce9510f132236c2cd1a8dce2d6a/app/build.gradle#L369)**

Line 369:

> implementation "com.mapbox.maps:android:${mapboxSdkVersion}"

**[android-app/build.gradle:](https://github.com/MixinNetwork/android-app/blob/7073cb70e8044ce9510f132236c2cd1a8dce2d6a/build.gradle#L159C9-L168C10)**

Line 159:

> maven {
            url 'https://api.mapbox.com/downloads/v2/releases/maven'
            authentication {
                basic(BasicAuthentication)
            }
            credentials {
                username = 'mapbox'
                password = project.properties['MAPBOX_DOWNLOADS_TOKEN'] ?: ""
            }
        }

We [created an issue](https://github.com/MixinNetwork/android-app/issues/4980) in their repository.

For now, we will retain the previous verdict **failed to build from source**

---
**Update 2024-07-17**: After almost three years, we are re-opening this for verification. The issue that was created has been closed with an MR. 

**Update 2021-11-17**: Although the source code is public, Emanuel failed to
compile it from the source with the instructions provided. See the
[issue](https://github.com/MixinNetwork/android-app/issues/2559).

From the Play Store description:

> Mixin Messenger is an open-source cryptocurrency wallet and signal protocol messenger, which supports almost all popular cryptocurrencies.

It supports Bitcoin, Ethereum, EOS, Monero and thousands of other cryptocurrencies.

Also relevant:

> Mixin Messenger is built on Mixin Network, it's a PoS second layer solution for other blockchains. Mixin Network is a distributed second layer ledger, so you own your crypto assets. Because of this second layer, it's normal that you can't check your BTC address balance on a Bitcoin blockchain explorer.

More information about how its wallet functions can be found on this Zendesk article ["Guides for Wallet"](https://mixinmessenger.zendesk.com/hc/en-us/sections/360002664251-Guides-for-Wallet)

We emailed the Mixin development team on September 16, 2021, to verify whether they have custody of the private keys. We await their response.

The [repository](https://github.com/MixinNetwork) is linked in the description.

It appears that this wallet is **non-custodial** and that source-code is available. 

An issue has been made on Gitlab with the corresponding [results](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/344). 

Issue has been raised in MixinNetwork's [Github Issues page](https://github.com/MixinNetwork/android-app/issues/2490). 
