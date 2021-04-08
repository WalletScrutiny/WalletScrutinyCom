---
wsId: 
title: "Zeus: Bitcoin/Lightning Wallet"
altTitle: 
authors:
- leo
users: 1000
appId: app.zeusln.zeus
launchDate: 
latestUpdate: 2021-03-26
apkVersionName: "0.5.1"
stars: 4.1
ratings: 15
reviews: 9
size: 55M
website: https://zeusln.app
repository: https://github.com/ZeusLN/zeus
issue: https://github.com/ZeusLN/zeus/issues/416
icon: app.zeusln.zeus.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-04-07
reviewStale: false
signer: 
reviewArchive:


providerTwitter: ZeusLN
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /app.zeusln.zeus/
  - /posts/app.zeusln.zeus/
---


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
./gradlew bundleRelease
```

instead.

Also we will need version 0.5.1 which is the latest version we got from the Play
Store.

```
$ git clone https://github.com/ZeusLN/zeus
$ cd zeus/
$ git tag | grep 0.5.1
v0.5.1
$ git checkout v0.5.1 
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm beevelop/cordova bash
root@b5e24bbdc208:/mnt# npm install  
root@b5e24bbdc208:/mnt/android# yes | $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-28"
root@b5e24bbdc208:/mnt# cd android
root@b5e24bbdc208:/mnt/android# ./gradlew bundleRelease
...
Error: Unable to resolve module stream from /mnt/node_modules/cipher-base/index.js: stream could not be found within the project.
...
root@b5e24bbdc208:/mnt/android# npm install stream
root@b5e24bbdc208:/mnt/android# ./gradlew bundleRelease
...
> Task :app:validateSigningRelease FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:validateSigningRelease'.
> Keystore file not set for signing config release
...
```

and at this point we googled how to skip signing but couldn't find a solution. We
want to reproduce the build and do not care about the signature. If creating a
dummy signature is required, a dummy configuration should be provided so that
the compilation works. For now we consider this app **not verifiable**.
