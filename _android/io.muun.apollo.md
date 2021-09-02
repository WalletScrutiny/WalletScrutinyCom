---
wsId: muun
title: "Muun - Bitcoin and Lightning Wallet"
altTitle: 
authors:
- leo
users: 10000
appId: io.muun.apollo
released: 2017-04-25
updated: 2021-08-31
version: "46.8"
stars: 4.8
ratings: 296
reviews: 182
size: 41M
website: https://muun.com
repository: https://github.com/muun/apollo
issue: https://github.com/muun/apollo/issues/2
icon: io.muun.apollo.png
bugbounty: 
verdict: nonverifiable
date: 2021-04-06
signer: 
reviewArchive:
- date: 2019-12-29
  version: "beta-36.2"
  appHash: 
  gitRevision: e5bd20b29118aaefc8abe66f03c728a834be9984
  verdict: nonverifiable

providerTwitter: MuunWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /io.muun.apollo/
  - /posts/io.muun.apollo/
---


**Update 2021-04-06**: The provider
[announced that the app is reproducible now](https://twitter.com/MuunWallet/status/1379490681165602823).
We will have to check that ...

So they now have
[build instructions for reproducible builds](https://github.com/muun/apollo/blob/master/BUILD.md#build-reproducibly).
Promising! Let's see how that goes ...

```
$ sha256sum fromGoogle45.2.apk # just for the record, the apk hash:
292776e270739d37b9307465cbddfc11068813078d9633035d74ae67f322a3b2  fromGoogle45.2.apk
$ cd /tmp/
$ git clone https://github.com/muun/apollo
$ cd apollo/
$ git checkout v45.2
$ mkdir -p apk
$ docker build -f android/Dockerfile -o apk .
...
BUILD SUCCESSFUL in 3m 9s
62 actionable tasks: 60 executed, 1 from cache, 1 up-to-date
Removing intermediate container 9812d21025c9
 ---> d997f192afe8
Step 24/26 : FROM scratch
 ---> 
Step 25/26 : COPY --from=build /src/android/apolloui/build/outputs/apk/prod/release/apolloui-prod-release-unsigned.apk apolloui-prod-release-unsigned.apk
 ---> 5b8f679ee607
Step 26/26 : COPY --from=build /src/android/apolloui/build/outputs/mapping/prodRelease/mapping.txt mapping.txt
 ---> ad2ddc6ce00f
Successfully built ad2ddc6ce00f
$ ls *.apk
$ ls apk/
$
```

so the apk did not end up where it's supposed to end up but it should be part of
the docker image now:

```
$ docker images
REPOSITORY                                                 TAG                    IMAGE ID            CREATED             SIZE
<none>                                                     <none>                 ad2ddc6ce00f        31 minutes ago      59.1MB
<none>                                                     <none>                 d997f192afe8        31 minutes ago      10.3GB
...
```

with some poking around with interactive runs, I found this works:

```
$ docker run --rm --volume $(pwd)/apk:/apk d997f192afe8 cp ./android/apolloui/build/outputs/apk/prod/release/apolloui-prod-release-unsigned.apk /apk/
$ ls apk/
apolloui-prod-release-unsigned.apk
$ apktool d -o fromBuild apk/apolloui-prod-release-unsigned.apk 
$ apktool d -o fromGoogle fromGoogle45.2.apk 
$ diff --brief --recursive from{Google,Build}
Files fromGoogle/apktool.yml and fromBuild/apktool.yml differ
Only in fromGoogle/original/META-INF: APOLLORE.RSA
Only in fromGoogle/original/META-INF: APOLLORE.SF
Files fromGoogle/original/META-INF/MANIFEST.MF and fromBuild/original/META-INF/MANIFEST.MF differ
Files fromGoogle/res/values/strings.xml and fromBuild/res/values/strings.xml differ
```

so the only diff of interest is in `res/values/strings.xml`:

```
$ diff from{Google,Build}/res/values/strings.xml
76c76
<     <string name="com.crashlytics.android.build_id">79a4d6b75ce84bd6ae254b900862f3a4</string>
---
>     <string name="com.crashlytics.android.build_id">976f51d22fdf4feda23c0dbc83806a9f</string>
```

That's almost reproducible. On a subjective level, if somebody reviewed the
source code and it is fine then yes, the apk is also fine but as we only allow
diffs in the signature part itself, it is too much of a diff for a reproducible
verdict. The app is close but still **not verifiable**.
