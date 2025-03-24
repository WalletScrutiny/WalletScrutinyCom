---
wsId: tangem
title: Tangem - Crypto wallet
altTitle: 
authors:
- leo
- danny
users: 100000
appId: com.tangem.wallet
appCountry: 
released: 2018-10-24
updated: 2025-03-14
version: 5.21.2
stars: 4.8
ratings: 89
reviews: 877
website: https://tangem.com
repository: https://github.com/tangem/tangem-app-android
issue: 
icon: com.tangem.wallet.png
bugbounty: 
meta: ok
verdict: wip
appHashes: []
date: 2024-08-20
signer: 
reviewArchive:
- date: 2024-08-20
  version: 5.18.6
  appHashes: []
  gitRevision: 7dca9fc061b5239ece7294a0c8529fd0828ce608
  verdict: nosource
- date: 2024-07-02
  version: 5.5.1
  appHashes: []
  gitRevision: 541a3a95426d5d277d7590282bb5e1e1f341a4c0
  verdict: nosource
twitter: tangem
social:
- https://www.linkedin.com/company/tangem
redirect_from: 
developerName: Tangem
features: 

---

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
