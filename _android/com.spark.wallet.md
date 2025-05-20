---
wsId: 
title: Spark Lightning Wallet
altTitle: 
authors:
- leo
- danny
users: 1000
appId: com.spark.wallet
appCountry: 
released: 2018-12-10
updated: 2021-11-08
version: 0.3.1
stars: 4.5
ratings: 
reviews: 1
website: https://github.com/shesek/spark-wallet
repository: https://github.com/shesek/spark-wallet
issue: https://github.com/shesek/spark-wallet/issues/192
icon: com.spark.wallet.png
bugbounty: 
meta: removed
verdict: sourceavailable
appHashes: 
date: 2023-08-04
signer: 
twitter: 
social: 
redirect_from:
- /com.spark.wallet/
- /posts/com.spark.wallet/
developerName: Nadav Ivgi
features:
- ln

---

<div class="alertBox"><div>⚠️ The provider himself warns:
<blockquote>Spark is beta-quality software under active development, please use with care.</blockquote>
</div> </div>

## App Description

From its GitHub page:

>Spark is a minimalistic wallet GUI for c-lightning, accessible over the web or through mobile and desktop apps (for Android, Linux, macOS and Windows). It is currently oriented for technically advanced users and is not an all-in-one package, but rather a "remote control" interface for a c-lightning node that has to be managed separately.
>
> Sparks supports sending and receiving payments, viewing history, and managing channels.
>
> Spark is a purely off-chain wallet, with no on-chain payments. This allows Spark to fully realize the awesome UX enabled by lightning, without worrying about the complications and friction of on-chain. This might change someday.
>
> Spark has a responsive UI suitable for mobile, tablet and desktop devices, but is best optimized for use on mobile.

## The App

As described above, the mobile app acts like a "remote-control interface for a
c-lightning node". If a user is running his own lightning node, then the user is
fully in control of his funds. This app, as its remote control also could to bad
things if with a backdoor or a serious flaw. Therefore we consider it as a
self-custodial wallet, requiring binary transparency.

## Reproducibility

GitHub is their website and there is also their source code. On the main page in
the paragraph
[Code signing & reproducible builds](https://github.com/shesek/spark-wallet#code-signing--reproducible-builds)
they state:

> The NPM package, Linux `AppImage`/`snap`/`tar.gz` builds, macOS `zip` builds
  and the Windows installer
  [are deterministically reproducible](https://github.com/shesek/spark-wallet/blob/master/doc/reproducible-builds.md).

linking to a document that itself claims that also the "Android `apk`" was also
reproducible. Let's see how that goes ...

```
$ mkdir ~/tmp
$ cd ~/tmp/
$ git clone https://github.com/shesek/spark-wallet && cd spark-wallet
$ git checkout v0.3.1 
HEAD is now at 4ffb929 v0.3.1
...
Step 14/35 : RUN apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main' && apt-get update   && apt-get install -y --no-install-recommends openjdk-8-jdk-headless=8u302-b08-1~deb9u1   && apt-add-repository --remove 'deb http://security.debian.org/debian-security stretch/updates main' && apt-get update
 ---> Running in a098df6b197f
Hit:1 http://security.debian.org/debian-security bullseye-security InRelease
Hit:2 http://deb.debian.org/debian bullseye InRelease
Hit:3 http://deb.debian.org/debian bullseye-updates InRelease
Get:4 http://security.debian.org/debian-security stretch/updates InRelease [53.0 kB]
Hit:5 https://dl.winehq.org/wine-builds/debian bullseye InRelease
Get:6 http://security.debian.org/debian-security stretch/updates/main amd64 Packages [748 kB]
Get:7 http://security.debian.org/debian-security stretch/updates/main i386 Packages [748 kB]
Fetched 1549 kB in 1s (1847 kB/s)
Reading package lists...
Reading package lists...
Building dependency tree...
Reading state information...
E: Version '8u302-b08-1~deb9u1' for 'openjdk-8-jdk-headless' was not found
The command '/bin/sh -c apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main' && apt-get update   && apt-get install -y --no-install-recommends openjdk-8-jdk-headless=8u302-b08-1~deb9u1   && apt-add-repository --remove 'deb http://security.debian.org/debian-security stretch/updates main' && apt-get update' returned a non-zero code: 100
```

Ok. That was not successful. Dependencies can go away and reproduction might
succeed with a newer version of this now unavailable dependency. We will wait
for the provider to figure out if the reproducible build still works after a
short fix and consider the app in the meantime as **not verifiable**.
