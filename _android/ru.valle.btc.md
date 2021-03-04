---
wsId: 
title: "Bitcoin Paper Wallet"
altTitle: 
authors:
- leo
users: 10000
appId: ru.valle.btc
launchDate: 2013-04-19
latestUpdate: 2020-03-22
apkVersionName: "Varies with device"
stars: 4.3
ratings: 148
reviews: 50
size: Varies with device
website: https://www.linkedin.com/in/vkonovalov
repository: https://github.com/ValleZ/Paper-Wallet
issue: https://github.com/ValleZ/Paper-Wallet/issues/42
icon: ru.valle.btc.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-08-04
reviewStale: false
signer: ee22ff921a6fbff122b609d21f56061c2e8b5c4fcaaf388be2549c0c1083c00f
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /ru.valle.btc/
  - /posts/ru.valle.btc/
---


**Update:** After
[feedback from the developer](https://github.com/ValleZ/Paper-Wallet/issues/42#issuecomment-668759686)
we removed the mention of `disable 'TrulyRandom', "GoogleAppIndexingWarning"`,
added more files to the list of worry-some binaries and hope for feedback
regarding App Bundles as this appears to be the first Bitcoin Wallet we came
across that uses this new format promoted by Google.

This app is an open source paper wallet generator but can we reproduce the build
`3.2.0` from Google Play?

```
$ git clone https://github.com/ValleZ/Paper-Wallet
$ cd Paper-Wallet/
$ git tag | grep 3....
3.0.0
```

not good but

```
$ git log -n 1
commit 06b3e50e798bb2219b327dc4bba636343ca9f678 (HEAD -> master, origin/master, origin/HEAD)
Author: Valentin Konovalov <valle.ketsujin@gmail.com>
Date:   Wed Mar 25 20:46:53 2020 -0400

    3.2.0
```

So the last commit had the label `3.2.0` which looks like the author just did
not tag it. Let's see ...

As there are no build instructions, we took the freedom and looked around a bit.
Normally we do not provide code reviews and our findings are so blatant that
they might actually be irrelevant upon deeper inspection but just in case this
app turns out to be reproducible/reproducible, the following two items require
a deeper look:

1. [This binary blob](https://github.com/ValleZ/Paper-Wallet/blob/master/app/libs/classes.jar)
   is not accounted for. Where does it come from? Can it be reproduced?
1. The developer pointed us to more binary blobs in
   [these folders](https://github.com/ValleZ/Paper-Wallet/blob/master/app/src/main/jniLibs/),
   too.

Anyway ... back to reproducibility:

```
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm beevelop/cordova bash
root@971258b281bb:/mnt# yes | /opt/android/tools/bin/sdkmanager "build-tools;29.0.3"
root@971258b281bb:/mnt# ./gradlew :app:assemble
BUILD SUCCESSFUL in 6m 18s
50 actionable tasks: 50 executed
root@971258b281bb:/mnt# exit
$ apktool d -o fromBuild app/build/outputs/apk/release/app-release-unsigned.apk
$ apktool d -o fromGoogle "/path/to/Paper Wallet 3.2.0 (ru.valle.btc).apk"
$ diff --recursive --brief from*
Files fromBuild/AndroidManifest.xml and fromGoogle/AndroidManifest.xml differ
Files fromBuild/apktool.yml and fromGoogle/apktool.yml differ
Only in fromBuild: lib
Files fromBuild/original/AndroidManifest.xml and fromGoogle/original/AndroidManifest.xml differ
Only in fromGoogle/original/META-INF: CERT.RSA
Only in fromGoogle/original/META-INF: CERT.SF
Files fromBuild/original/META-INF/MANIFEST.MF and fromGoogle/original/META-INF/MANIFEST.MF differ
Only in fromBuild/res: drawable-hdpi
Only in fromBuild/res: drawable-ldpi
Only in fromBuild/res: drawable-mdpi
Only in fromBuild/res: drawable-night-hdpi
Only in fromBuild/res: drawable-night-ldpi
Only in fromBuild/res: drawable-night-mdpi
Only in fromBuild/res: drawable-night-xhdpi
Only in fromBuild/res: drawable-night-xxhdpi
Only in fromBuild/res: drawable-night-xxxhdpi
Only in fromBuild/res: drawable-xhdpi
Only in fromBuild/res: drawable-xxhdpi
Only in fromBuild/res: drawable-xxxhdpi
Files fromBuild/res/layout/main.xml and fromGoogle/res/layout/main.xml differ
Files fromBuild/res/layout-v22/main.xml and fromGoogle/res/layout-v22/main.xml differ
Files fromBuild/res/menu/main.xml and fromGoogle/res/menu/main.xml differ
Files fromBuild/res/menu-v11/main.xml and fromGoogle/res/menu-v11/main.xml differ
Files fromBuild/res/values/public.xml and fromGoogle/res/values/public.xml differ
Only in fromGoogle/res: values-anydpi-v21
Only in fromBuild/res: values-ja
Only in fromBuild/res: values-pt
Only in fromBuild/res: values-ru
Only in fromGoogle/res/xml: splits0.xml
```

That is a big diff but on a closer look after the developer told us this was the
result of an App Bundle it actually does not look that bad:

Extra "stuff" is mainly in what we built, not in the app we got from Google
Play. Let's remove that and the other known benign files from the list:

```
$ diff --recursive --brief from* | grep -v "Only in fromBuild" | grep -v "META-INF" | grep -v apktool
Files fromBuild/AndroidManifest.xml and fromGoogle/AndroidManifest.xml differ
Files fromBuild/original/AndroidManifest.xml and fromGoogle/original/AndroidManifest.xml differ
Files fromBuild/res/layout/main.xml and fromGoogle/res/layout/main.xml differ
Files fromBuild/res/layout-v22/main.xml and fromGoogle/res/layout-v22/main.xml differ
Files fromBuild/res/menu/main.xml and fromGoogle/res/menu/main.xml differ
Files fromBuild/res/menu-v11/main.xml and fromGoogle/res/menu-v11/main.xml differ
Files fromBuild/res/values/public.xml and fromGoogle/res/values/public.xml differ
Only in fromGoogle/res: values-anydpi-v21
Only in fromGoogle/res/xml: splits0.xml
```

Now looking into some of those diffs they look harmless. UI components with
different labels. An extra `res/values-anydpi-v21/drawables.xml` and
`res/xml/splits0.xml` for example:

```
$ cat fromGoogle/res/values-anydpi-v21/drawables.xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <item type="drawable" name="APKTOOL_DUMMY_0">false</item>
</resources>
$ cat fromGoogle/res/xml/splits0.xml
$ cat fromGoogle/res/xml/splits0.xml
<?xml version="1.0" encoding="utf-8"?>
<splits>
    <module name="">
        <language>
            <entry key="ja" split="config.ja" />
            <entry key="pt" split="config.pt" />
            <entry key="ru" split="config.ru" />
        </language>
    </module>
</splits>
```

All that looks like it is following some automatism by Google but until we have
a deterministic way of reproducing this, can we not reproduce this build and
don't feel comfortable dismissing the possibility of missing something. After
all,

```
Binary files fromBuild/original/AndroidManifest.xml and fromGoogle/original/AndroidManifest.xml differ
```

does look a bit scary.

In summary, this app is **not verifiable**.

For later reference, the app from Google Play had the sha256sum
`ce90b2c62cae520a0f643a34b5a2a2a6b6961d5d194d06b07c21f2dd22748dea` and the use
of App Bundle can be detected in `META-INF/MANIFEST.MF`:

```
$ cat fromGoogle/original/META-INF/MANIFEST.MF | grep Built-By
Built-By: BundleTool
```
