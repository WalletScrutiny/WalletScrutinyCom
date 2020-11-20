---
title: "Haven - Private Shopping"
altTitle: 

users: 100000
appId: io.ob1.nativeandroid
launchDate: 
latestUpdate: 2020-09-27
apkVersionName: "1.3.7"
stars: 3.8
ratings: 381
reviews: 167
size: 95M
website: https://gethaven.app/
repository: https://github.com/OpenBazaar/haven
issue: https://github.com/OpenBazaar/haven/issues/3
icon: io.ob1.nativeandroid.png
bugbounty: 
verdict: nonverifiable # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-08-27
reviewStale: true
signer: 
reviewArchive:
- date: 2020-08-04
  version: "null"
  apkHash: 
  gitRevision: d35be5007a773253ccdf2e6c4234b33f12b25fec
  verdict: nosource

providerTwitter: HavenPrivacy
providerLinkedIn: 
providerFacebook: 
providerReddit: havenapp

redirect_from:
  - /io.ob1.nativeandroid/
---


**Update:** [@StevieZollo](https://twitter.com/StevieZollo) sent a
[tweet](https://twitter.com/StevieZollo/status/1299056449168052224):

> @WalletScrutiny @LeoWandersleb
> it looks like you reviewed @HavenPrivacy the day before it went open source.
  You can find its source code here: [https://github.com/OpenBazaar/haven](https://github.com/OpenBazaar/haven)

so we can check its source code after all. Let's see how that goes:

Just in case, we reviewed their website again if this is the official repo but
there is no link to it, so that doesn't leave us with much hope. Also: **Unless
the provider endorses this repository, you should not assume it is anything
official or trustworthy!** Anyway ...

```
/tmp$ git clone https://github.com/OpenBazaar/haven
Cloning into 'haven'...
remote: Enumerating objects: 12, done.
remote: Counting objects: 100% (12/12), done.
remote: Compressing objects: 100% (11/11), done.
remote: Total 766 (delta 2), reused 5 (delta 0), pack-reused 754
Receiving objects: 100% (766/766), 15.25 MiB | 9.58 MiB/s, done.
Resolving deltas: 100% (46/46), done.
/tmp$ cd haven/
/tmp/haven(master)$ git tag
/tmp/haven(master)$ git branch 
* master
/tmp/haven(master)$ git log --oneline
ef354df (HEAD -> master, origin/master, origin/HEAD) Merge pull request #1 from OpenBazaar/add-license-1
de4cced (origin/add-license-1) Create LICENSE
2a5fe76 Update readme
f486f33 feat: havenBuildConfigFiles setup
a0a8bc8 Initial commit
```

So there is essentially only one revision as far as the Android app goes. Changes to
license or readme should not affect the app on Android itself. The missing tag
will be a problem later on though.

```
root@4be0f50e58d3:/mnt# apt install nodejs npm -y
root@4be0f50e58d3:/mnt# npm install -g npm yarn
root@4be0f50e58d3:/mnt# yarn
root@4be0f50e58d3:/mnt# apt install curl
root@4be0f50e58d3:/mnt# yarn
root@4be0f50e58d3:/mnt# find . | grep '\.env'
```

At this point, the build instructions read

> Copy `.env` file to the root directory

but according to `find . | grep '\.env'` there is no `.env` file anywhere. The
instruction:

> The env file should look like this:
> ```
> BRANCH_KEY=
> COUNTLY_ROOT_URL=
> COUNTLY_APP_KEY=
> STREAM_API_KEY=
> STREAM_APP_ID=
> HMAC_SECRET=
> ```

looks like the provider is not sharing all details necessary to build this app
but let's see what happens ...

It doesn't get better. Next we are supposed to

> Copy those files into `havenBuildConfigFiles` folder:
> ```
> AppCenter-Config.plist
> GoogleService-Info.plist
> appcenter-config.json
> google-services.json
> ```

and again those are not files provided by the company.

So to little surprise, compiling doesn't go all too well:

```
root@4be0f50e58d3:/mnt/android# cd android/
root@4be0f50e58d3:/mnt/android# ./gradlew clean assembleRelease
...
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:processReleaseGoogleServices'.
> File google-services.json is missing. The Google Services Plugin cannot function without it. 
   Searched Location: 
  /mnt/android/app/src/nullnull/release/google-services.json
  /mnt/android/app/src/release/nullnull/google-services.json
  /mnt/android/app/src/nullnull/google-services.json
  /mnt/android/app/src/release/google-services.json
  /mnt/android/app/src/nullnullRelease/google-services.json
  /mnt/android/app/google-services.json

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 7.0.
Use '--warning-mode all' to show the individual deprecation warnings.
See https://docs.gradle.org/6.5/userguide/command_line_interface.html#sec:command_line_warnings

BUILD FAILED in 4m 14s
330 actionable tasks: 299 executed, 31 up-to-date
```

At this point we give up and give the verdict **not verifiable**.
