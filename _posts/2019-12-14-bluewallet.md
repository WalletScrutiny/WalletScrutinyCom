---
title: "BlueWallet - Bitcoin & Lightning Wallet"

wallet: true
users: 10000
appId: io.bluewallet.bluewallet
launchDate: 2018-11-01
latestUpdate: 2019-12-03
apkVersionName: 4.8.1
stars: 4.1
commentCount: 295
permissions:
website: https://bluewallet.io/
repository: https://github.com/bluewallet/bluewallet
issue: https://github.com/BlueWallet/BlueWallet/issues/758
icon: "images/wallet_icons/bluewallet.png"
bugbounty:
verdict: nonverifiable # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty, cert1, cert2, cert3

date: 2019-12-14
permalink: /posts/2019/12/bluewallet/
redirect_from:
  - /bluewallet/
tags:
  - Android
  - Security
---


Blue wallet certainly sounds like a non-custodial wallet:

> Be in control
Private keys never leave your device. You control your private keys

Also it is open source:

> Open Source
MIT licensed, you can build it and run it on your own! Made with ReactNative

Let's see if we can build it with the instructions provided
[here](https://github.com/bluewallet/bluewallet#build--run-it):

```
$ git clone https://github.com/BlueWallet/BlueWallet.git
$ cd BlueWallet/
$ git tag | grep 4.8.1
v4.8.1
$ git checkout v4.8.1
$ docker run -v path/to/BlueWallet/:/mnt -it beevelop/cordova bash
root@93d42b33d091:/mnt# cd /mnt/
root@93d42b33d091:/mnt# npm install
root@93d42b33d091:/mnt# npm start android
> BlueWallet@4.8.1 start /mnt
> node node_modules/react-native/local-cli/cli.js start "android"

┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Running Metro Bundler on port 8081.                                         │
│                                                                              │
│  Keep Metro running while developing on any JS projects. Feel free to        │
│  close this tab and run your own Metro instance if you prefer.               │
│                                                                              │
│  https://github.com/facebook/react-native                                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Looking for JS files in
   /mnt

Loading dependency graph, done.
```

This won't help to verify anything ...

Duckduck found
[this](https://facebook.github.io/react-native/docs/signed-apk-android)
for us and so we tried:

```
root@93d42b33d091:/mnt# cd android/
root@93d42b33d091:/mnt/android# ./gradlew bundleRelease
```

but this also didn't succeed:

```
error Unable to resolve module `../../release-notes` from `/mnt/screen/settings/releasenotes.js`: The module `../../release-notes` could not be found from `/mnt/screen/settings/releasenotes.js`. Indeed, none of these files exist:
  * `/mnt/release-notes(.native||.android.js|.native.js|.js|.android.json|.native.json|.json|.android.ts|.native.ts|.ts|.android.tsx|.native.tsx|.tsx)`
  * `/mnt/release-notes/index(.native||.android.js|.native.js|.js|.android.json|.native.json|.json|.android.ts|.native.ts|.ts|.android.tsx|.native.tsx|.tsx)`. Run CLI with --verbose flag for more details.
Error: Unable to resolve module `../../release-notes` from `/mnt/screen/settings/releasenotes.js`: The module `../../release-notes` could not be found from `/mnt/screen/settings/releasenotes.js`. Indeed, none of these files exist:
  * `/mnt/release-notes(.native||.android.js|.native.js|.js|.android.json|.native.json|.json|.android.ts|.native.ts|.ts|.android.tsx|.native.tsx|.tsx)`
  * `/mnt/release-notes/index(.native||.android.js|.native.js|.js|.android.json|.native.json|.json|.android.ts|.native.ts|.ts|.android.tsx|.native.tsx|.tsx)`
    at ModuleResolver.resolveDependency (/mnt/node_modules/metro/src/node-haste/DependencyGraph/ModuleResolution.js:163:15)
    at ResolutionRequest.resolveDependency (/mnt/node_modules/metro/src/node-haste/DependencyGraph/ResolutionRequest.js:52:18)
    at DependencyGraph.resolveDependency (/mnt/node_modules/metro/src/node-haste/DependencyGraph.js:283:16)
    at Object.resolve (/mnt/node_modules/metro/src/lib/transformHelpers.js:264:42)
    at dependencies.map.result (/mnt/node_modules/metro/src/DeltaBundler/traverseDependencies.js:399:31)
    at Array.map (<anonymous>)
    at resolveDependencies (/mnt/node_modules/metro/src/DeltaBundler/traverseDependencies.js:396:18)
    at /mnt/node_modules/metro/src/DeltaBundler/traverseDependencies.js:269:33
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/mnt/node_modules/metro/src/DeltaBundler/traverseDependencies.js:87:24)
...
BUILD FAILED in 4m 32s
7 actionable tasks: 7 executed
```

At this point the verdict thus is **not verifiable**.
