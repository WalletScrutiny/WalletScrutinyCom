---
wsId: tangem
title: Tangem - Hardware Wallet
date: 2025-03-21
authors:
- leo
- danny
website: https://tangem.com
twitter: tangem
social:
- https://www.linkedin.com/company/tangem
features:
- buyWithCC
- multiSig
- nfc
- secEl
- tradeAlts
redirect_from:
- /android/com.tangem.wallet/
- /iphone/com.tangem.Tangem/
android:
  appId: com.tangem.wallet
  users: 100000
  appCountry: us
  released: 2018-10-24
  updated: 2026-05-19
  version: 5.37.5
  reviews: 1752
  icon: com.tangem.wallet.png
  signer: 6e19822814d3498163b2e911196bca85dab25a0267aae5739dde15acb2736002
  meta: ok
  verdict: sourceavailable
  developerName: Tangem
iphone:
  appId: com.tangem.Tangem
  idd: 1354868448
  appCountry: us
  released: 2018-04-28
  updated: 2026-05-12
  version: 5.37.1
  reviews: 22594
  icon: com.tangem.Tangem.jpg
  meta: ok
  verdict: nosource
  developerName: Tangem AG

---

## Android

**Update 2025-10-28 New Verdict**

After receiving some communication, we decided to give the Tangem android build another try. Good news: the repo finally ships without any submodules, so the long-standing blocker is gone. Our containerized verifier is now at v0.4.1, with tighter SDK provisioning and runtime-detection refinements baked directly into the script. We still have to feed Gradle a GitHub PAT because several dependencies live in GitHub’s package registry. Decompiling the official APK shows the shipping build is the Google flavor, so reproductions must target that variant to have any chance of matching. Gradle currently shouts that every Google/Huawei variant is missing its `google-services.json`, which explains why the google release task stalls out. 

But suffice to say, the Android app can now be viewed as **source available**

**Update 2025-03-21**

We conducted another attempt to build the Tangem Wallet app from source. The main repository at https://github.com/tangem/tangem-app-android is publicly available, but the build process fails when trying to initialize the required submodules:

```
git submodule update --init --recursive
Cloning into '/workspace/tangem-app-android/app/src/main/assets/tangem-app-config'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

The app depends on two critical submodules that are private:
- `tangem-app-config` at git@github.com:tangem/tangem-app-config.git
- `tangem-android-tools` at git@github.com:tangem/tangem-android-tools.git

These submodules use SSH URLs (git@github.com:...) rather than HTTPS URLs, which indicates they require SSH authentication to access. Without these components, it's impossible to build the app from the available source code.

This confirms our previous findings that the app should be classified as **nosource** since essential components remain private.

**Update 2024-08-20** 

I messaged them on [x.com](https://x.com/dannybuntu/status/1825809273320063101) and on [reddit.](https://www.reddit.com/r/Tangem/comments/1ewqdcn/im_trying_to_build_the_tangem_android_app_is/)

They [responded via x](https://x.com/Tangem/status/1825811448079024451) but want to collaborate via email. 

**Update 2024-08-19**: After a while, we saw it fit to retry the build to assuage the concerns of some that it is indeed source-available. 

So I begin with a basic docker template with some basic dependencies, with the cloning and building portions commented out.

```
# Use an official image as a base
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    curl \
    wget \
    git \
    unzip \
    lib32stdc++6 \
    lib32z1 \
    gradle \
    && apt-get clean

# Set environment variables
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH
ENV GRADLE_USER_HOME=/opt/gradle

# Download and install Android SDK command line tools
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O sdk-tools.zip && \
    unzip sdk-tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools && \
    mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest && \
    rm sdk-tools.zip

# Set up Android SDK
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-31" "build-tools;31.0.0"

# Clone the Tangem Android app repository
WORKDIR /workspace
# RUN git clone https://github.com/tangem/tangem-app-android.git .

# Update submodules to use HTTPS instead of SSH
# RUN sed -i 's/git@github.com:/https:\/\/github.com\//g' .gitmodules

# Initialize and update submodules
# RUN git submodule init && git submodule update

# Build the app
# RUN ./gradlew clean assembleDebug

# Set entrypoint for manual build
CMD ["/bin/bash"]
```

### Clone the repository

```
danny@lw10:~/work/builds/com.tangem/5.13.1/3$ docker run -it --name tangem-container tangem-build:tag
root@0247199e5fcb:/workspace# git clone https://github.com/tangem/tangem-app-android
Cloning into 'tangem-app-android'...
remote: Enumerating objects: 188271, done.
remote: Counting objects: 100% (12854/12854), done.
remote: Compressing objects: 100% (3895/3895), done.
remote: Total 188271 (delta 5023), reused 11890 (delta 4508), pack-reused 175417 (from 1)
Receiving objects: 100% (188271/188271), 75.74 MiB | 23.40 MiB/s, done.
Resolving deltas: 100% (102715/102715), done.
root@0247199e5fcb:/workspace# 
```

### Checkout to hotfix/5.13.1 and then update submodules

Tangem's releases and tags are not updated regularly. Instead they have branches which is where their most recent updates are made.

```
root@0247199e5fcb:/workspace# cd tangem-app-android/
root@0247199e5fcb:/workspace/tangem-app-android# git checkout hotfix/5.13.1
Branch 'hotfix/5.13.1' set up to track remote branch 'hotfix/5.13.1' from 'origin'.
Switched to a new branch 'hotfix/5.13.1'
root@0247199e5fcb:/workspace/tangem-app-android# git submodule init
Submodule 'app/src/main/assets/tangem-app-config' (git@github.com:tangem/tangem-app-config.git) registered for path 'app/src/main/assets/tangem-app-config'
Submodule 'tangem-android-tools' (git@github.com:tangem/tangem-android-tools.git) registered for path 'tangem-android-tools'
root@0247199e5fcb:/workspace/tangem-app-android#
```

### git submodule update --init --recursive

```
root@0247199e5fcb:/workspace/tangem-app-android# git submodule update --init --recursive
Cloning into '/workspace/tangem-app-android/app/src/main/assets/tangem-app-config'...
The authenticity of host 'github.com (140.82.121.3)' can't be established.
ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'github.com' (ED25519) to the list of known hosts.
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:tangem/tangem-app-config.git' into submodule path '/workspace/tangem-app-android/app/src/main/assets/tangem-app-config' failed
Failed to clone 'app/src/main/assets/tangem-app-config'. Retry scheduled
Cloning into '/workspace/tangem-app-android/tangem-android-tools'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:tangem/tangem-android-tools.git' into submodule path '/workspace/tangem-app-android/tangem-android-tools' failed
Failed to clone 'tangem-android-tools'. Retry scheduled
Cloning into '/workspace/tangem-app-android/app/src/main/assets/tangem-app-config'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:tangem/tangem-app-config.git' into submodule path '/workspace/tangem-app-android/app/src/main/assets/tangem-app-config' failed
Failed to clone 'app/src/main/assets/tangem-app-config' a second time, aborting
```

Like in the previous review, this failure is indicative of a private repository/submodule (or nonexistent one). This means that the project is **not source-available**, or more completely, not 100% available. Since the build step fails very near to the part where we clone the repository, a failure in this shouldn't be considered a failure to build, since we've barely begun the build process.

## Previous Review 2024-02-09
Yes, there is a repository but it has neither
documentation nor an issue tracker to ask how to build it. But it doesn't look
too complicated. Let's see how it goes ...

`v5.5.1` is the currently available version on Google Play.

```
root@a05bfbe4d44c:/mnt# apt update
root@a05bfbe4d44c:/mnt# apt full-upgrade -y
root@a05bfbe4d44c:/mnt# git clone https://github.com/tangem/tangem-app-android
root@a05bfbe4d44c:/mnt# cd tangem-app-android/
root@a05bfbe4d44c:/mnt/tangem-app-android# git tag | grep '5\.'
4.5.1
root@a05bfbe4d44c:/mnt/tangem-app-android# git branch --all | grep '5\.5\.1'
  remotes/origin/5.5.1_pre_release
  remotes/origin/hotfix/5.5.1
  remotes/origin/merge/hotfix_5.5.1_to_release
```

So there is something about a `v5.5.1` release but it's not tagged correctly.
Is the app configured to be version `5.5.1`?

```
root@a05bfbe4d44c:/mnt/tangem-app-android# rgrep '5\.5\.1' .
./.git/packed-refs:a40b26faa3a13d82d40a81574391ebc0afad2390 refs/remotes/origin/5.5.1_pre_release
./.git/packed-refs:23d54ea5894c630ef36e020520d4a5e6f0eb0dcf refs/remotes/origin/hotfix/5.5.1
./.git/packed-refs:05a4b8af12e9bd7b4f9497e84db47961bff8ab4a refs/remotes/origin/merge/hotfix_5.5.1_to_release
```

Not really.

Can we compile the app? We see it has git submodules. Let's get those, first:

```
root@a05bfbe4d44c:/mnt/tangem-app-android# git submodule update --init --recursive
Cloning into '/mnt/tangem-app-android/app/src/main/assets/tangem-app-config'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:tangem/tangem-app-config.git' into submodule path '/mnt/tangem-app-android/app/src/main/assets/tangem-app-config' failed
Failed to clone 'app/src/main/assets/tangem-app-config'. Retry scheduled
Cloning into '/mnt/tangem-app-android/tangem-android-tools'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:tangem/tangem-android-tools.git' into submodule path '/mnt/tangem-app-android/tangem-android-tools' failed
Failed to clone 'tangem-android-tools'. Retry scheduled
Cloning into '/mnt/tangem-app-android/app/src/main/assets/tangem-app-config'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:tangem/tangem-app-config.git' into submodule path '/mnt/tangem-app-android/app/src/main/assets/tangem-app-config' failed
Failed to clone 'app/src/main/assets/tangem-app-config' a second time, aborting
```

It fails to clone from `git@github.com:tangem/tangem-app-config.git`. As it
turns out this is a private repository. So while the name suggest it's only some
configuration, we cannot verify that. This project is **not verifiable**.

Sadly we cannot file an issue with them but we will try to reach them on social
media.

---

## iPhone

### Updated Analysis 2025-10-28

The Android version of the app {% include walletLink.html wallet='android/com.tangem.wallet' verdict='true' %} has been reclassified as **source-available**. So we decided to give a quick cursory check if the ios app merits the same change. Here's what we gathered:

**What Looks Solid**

- Real Xcode project and Swift sources are all there (TangemApp.xcodeproj/project.pbxproj:32560, Tangem/App/...).
- bootstrap.sh actually unwraps a giant SwiftPM bundle so you can build offline (bootstrap.sh:18-42).
- Schemes for Tangem/Tangem Alpha/Tangem Beta exist, so Xcode will open without hacking around.

**Where It Breaks Down**

- Every config JSON is stuffed with "PLACEHOLDER" values (tangem-app-config/config_prod.json:1-38), and the Firebase plist is literally empty (tangem-app-config/ios/GoogleService-Info-Production.plist:1-5). Without the real API keys you can’t reproduce the shipping binary.
- The packaged dependencies include a private SSH repo (Package.swift:24-33), but they sneak in a prebuilt archive at SPM_dependencies.part00*. It works, yet we can’t verify what’s inside, and there are no checksums given.
- I couldn’t find any CI scripts, fastlane lanes, or release automation—recent commits are bland “Updated on …” messages from a bot (git show --stat, README.md:9-44). Nothing links a tag to an App Store build we could match.

**Bottom Line**

So the source is technically there, but the missing keys plus opaque dependency blobs keep it from being “source available” in a WalletScrutiny sense. You can’t rebuild and compare against the App Store IPA without extra info.

**Previous Analysis 2021-04-10**

This app is the companion app to an NFC card that is promoted as something like
a hardware wallet but without a screen or a button it can only do what the
companion app - this app - tells it to do. As such, this app is very crucial if
you use these cards as your Bitcoin wallet. It has to be trustworthy and thus we
consider it a Bitcoin wallet. Our mission is to look for the potential of all
the users of an app lose all their funds at once which arguably cannot happen in
the given configuration. The app could not collect the private keys from the
cards *if the cards do what they claim* which cannot be publicly verified
neither but even if the card does as advertised, the app could still steal a lot
of funds of a lot of users if it would switch to evil-mode for all users at
once. It would still require users' interaction but the window of opportunity
could easily be days to weeks before Google would remote-wipe the app or the app
would get stopped from emptying wallets of unsuspecting users upon their next
use.

The description on the App Store is not explaining much and neither does their
website explain in clear words what this app is but I found
[this demo video](https://www.youtube.com/watch?v=sTaQN2z7H_A) and it clearly
shows that the app is crucial for the security of your funds.

The next question would be: "Is the code public?" ... but as far as I
can see there is no source code available that one could inspect. That leaves us
with the verdict **not verifiable**.

{% include featureEvidence.html feature="nfc" quote="Tangem is a self-custody hardware and mobile wallet designed to give you secure access to digital assets and blockchain networks. The Tangem app works together with Tangem cards to provide a technical interface for sending, receiving, and interacting with cryptocurrencies and decentralized applications." source="Store" comment="Store description confirms NFC card interaction; further confirmed by 'NFC-enabled smartphone' mention." %}

{% include featureEvidence.html feature="secEl" quote="Tangem cards contain a secure chip designed for strong protection of private keys. The chip is certified to Common Criteria EAL6+, a high security assurance level used in secure hardware products (such as biometric passports)." source="Store" %}

{% include featureEvidence.html feature="multiSig" quote="Users can connect up to three Tangem cards to one wallet setup." source="Store" comment="Three cards to one wallet setup implies multi-signature or multi-card authorization scheme." %}

{% include featureEvidence.html feature="tradeAlts" quote="connect to third-party services for crypto-related transactions, and interact with decentralized exchanges and applications." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="connect to third-party services for crypto-related transactions" source="Store" comment="Insufficient — omitting; no explicit credit card mention." %}
