---
wsId: nunchuk
title: Nunchuk Bitcoin Wallet
altTitle: 
authors:
- leo
- emanuel
users: 5000
appId: io.nunchuk.android
appCountry: 
released: 2021-11-11
updated: 2023-05-24
version: 1.9.31
stars: 4.6
ratings: 26
reviews: 13
size: 
website: https://nunchuk.io
repository: https://github.com/nunchuk-io/nunchuk-android
issue: https://github.com/nunchuk-io/nunchuk-android/issues/7
icon: io.nunchuk.android.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-01-06
signer: 
reviewArchive:
- date: 2021-12-15
  version: 1.9.21
  appHash: 
  gitRevision: f9bb0384d334f1ab3cd67824f43ff0053e7e51e7
  verdict: nosource
twitter: nunchuk_io
social:
- https://nunchuk.medium.com/
- >-
  https://join.slack.com/t/nunchukio/shared_invite/zt-xqdlvl5g-xKKohQu_R7IUo7_np8rVaw
redirect_from: 
developerName: Nunchuk Inc
features: 

---

The app's version for Android was released as open source under the GPLv3
[here](https://github.com/nunchuk-io/nunchuk-android).

It's build instructions are:

1. Follow the build instructions for [Nunchuk Android Native SDK](https://github.com/nunchuk-io/nunchuk-android-nativesdk).
2. Publish the SDK to the local maven. Note the SDK version number.
3. Open dependencies.gradle and update nativeSdkVersion to the SDK version you just published.
4. Build and run the app on your device.

So, what are the "build instructions for Nunchuk Android Native SDK"?
First of all, Xcode is required. That's a bit of an issue for us, as all
contributors who do builds do not have a Mac and Xcode only works on Mac.
It's not immediately clear if it really is required, so lets look further ...

```
git submodule add --force -b main https://gitlab.com/nunchuck/libnunchuk.git
```

but the user [nunchuck](https://gitlab.com/nunchuck) doesn't exist on
gitlab.com.

As Nunchuk Android's code is on GitHub, we can guess the right repo might be
[nunchuk-io/libnunchuk](https://github.com/nunchuk-io/libnunchuk).

Which is weird is that the repo's
[git submodule](https://github.com/nunchuk-io/nunchuk-android-nativesdk/blob/main/.gitmodules)
also still points to GitLab, so the error is not only in the documentation.

Let's try:

```
$ git clone https://github.com/nunchuk-io/nunchuk-android-nativesdk.git
$ cd nunchuk-android-nativesdk/
$ cat .gitmodules 
[submodule "src/main/native/libnunchuk"]
	path = src/main/native/libnunchuk
	url = https://gitlab.com/nunchuck/libnunchuk.git
	branch = main
$ git submodule update --init --recursive
Submodule 'src/main/native/libnunchuk' (https://gitlab.com/nunchuck/libnunchuk.git) registered for path 'src/main/native/libnunchuk'
Cloning into '/home/leo/tmp/nunchuk-android-nativesdk/src/main/native/libnunchuk'...
Username for 'https://gitlab.com': 
```

This repo isn't a public repo but as it might be private, git asks for a login.
As discussed above, we'll use libnunchuk from GitHub:

```
$ git submodule set-url src/main/native/libnunchuk https://github.com/nunchuk-io/libnunchuk.git
$ git submodule update --init --recursive
Cloning into '/home/leo/tmp/nunchuk-android-nativesdk/src/main/native/libnunchuk'...
Submodule path 'src/main/native/libnunchuk': checked out 'c168cf715cbe768b5cd5004609f2db6d0ebfe254'
...
error: object e35e28f52d20df27561b2780f6b9c86669a9de21: zeroPaddedFilemode: contains zero-padded file modes
fatal: fsck error in packed object
fatal: index-pack failed
fatal: clone of 'https://github.com/sqlcipher/sqlcipher' into submodule path '/home/leo/tmp/nunchuk-android-nativesdk/src/main/native/libnunchuk/contrib/sqlcipher' failed
Failed to clone 'contrib/sqlcipher'. Retry scheduled
```

So ... we can't clone that dependency. Seriously?

```
$ git clone https://github.com/sqlcipher/sqlcipher
Cloning into 'sqlcipher'...
remote: Enumerating objects: 15498, done.
remote: Counting objects: 100% (1910/1910), done.
remote: Compressing objects: 100% (816/816), done.
error: object e35e28f52d20df27561b2780f6b9c86669a9de21: zeroPaddedFilemode: contains zero-padded file modes
fatal: fsck error in packed object
fatal: index-pack failed
```

So for now we give up at this point and file this product as **not verifiable**.

**Update 2023-01-06**: As laid out in
[this issue](https://github.com/nunchuk-io/nunchuk-android/issues/7), we managed
to compile the app but with substantial differences:

```
Files ./GooglePlay/classes2.dex and ./LocalBuild/classes2.dex differ
Files ./GooglePlay/classes3.dex and ./LocalBuild/classes3.dex differ
Files ./GooglePlay/classes4.dex and ./LocalBuild/classes4.dex differ
Files ./GooglePlay/classes5.dex and ./LocalBuild/classes5.dex differ
Files ./GooglePlay/classes.dex and ./LocalBuild/classes.dex differ
Files ./GooglePlay/lib/arm64-v8a/libnunchuk-android.so and ./LocalBuild/lib/arm64-v8a/libnunchuk-android.so differ
```

Until these issues are resolved, the app is **not verifiable**.

