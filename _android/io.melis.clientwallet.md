---
wsId: 
title: "Melis Bitcoin, Bitcoin Cash, Litecoin Wallet"
altTitle: 

users: 1000
appId: io.melis.clientwallet
launchDate: 2017-01-30
latestUpdate: 2019-06-03
apkVersionName: "1.5.40"
stars: 4.1
ratings: 19
reviews: 11
size: 6.9M
website: https://www.melis.io
repository: https://github.com/melis-wallet/melis-cm-client
issue: https://github.com/melis-wallet/melis-cm-client/issues/1
icon: io.melis.clientwallet.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-04-07
reviewStale: false
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /io.melis.clientwallet/
  - /posts/io.melis.clientwallet/
---


**Update:** The provider
[replied to our issue](https://github.com/melis-wallet/melis-cm-client/issues/1#issuecomment-619886541)
so we took another look.

On Google Play we find no claims of this wallet being non-custodial or open
source.

On their website they claim

> With Melis you have the complete control of your bitcoins and private keys

which probably means non-custodial. And

> Melis is open source, published on GitHub.

but the link only leads us to [this GitHub account](https://github.com/melis-wallet),
not to a GitHub repository. But lets
[search the appId there ...](https://github.com/search?q=org%3Amelis-wallet+%22io.melis.clientwallet%22&type=Code) 
which gives us five hits in [this repository](https://github.com/melis-wallet/melis-cm-client).

So this is a Cordova app. The build instructions are there ... promising so far.
Time to get more hands-on ...

```
$ git clone https://github.com/melis-wallet/melis-cm-client
$ cd melis-cm-client/
$ git log
commit 61246945952eb3c50ef8c7800eba84bea1142836 (HEAD -> release, origin/release, origin/HEAD)
Author: lele <lele@melis.io>
Date:   Thu Jan 2 14:33:58 2020 +0100

    - synced to upstrem 1.5.41

commit 287994f4bcfb08f6ca975ccfb1d12f13c664be3c
Author: lele <lele@melis.io>
Date:   Fri Jan 5 16:29:58 2018 +0100

    - v1.1.0

commit 4dff0ed0b3f75579c7b98f983d87601225324c54 (tag: v1.3.9)
Author: lele <lele@melis.io>
Date:   Fri Jan 5 15:35:25 2018 +0100

    - v1.3.9

commit 653ba15a279b9df2e35c7ce85758b11bc04d0afc
Author: Lele <lele@melis.io>
Date:   Thu Jul 27 16:42:11 2017 +0200

    Provided links to the melis website

commit 11b778e6f8f45d1e4c23c580b8cdc3f7e5ca025f (tag: 0.20.30)
Author: lele <lele@melis.io>
Date:   Thu May 11 09:34:24 2017 +0200

    - public release
$ rgrep "1\.5\.40" .
$ rgrep "1\.5\.41" .
./package.json:  "version": "1.5.41",
```

So this repository has a total of 5 commits with the latest being ahead of what
we would like to reproduce (1.5.40) and the prior one being much behind (1.1.0).

Lets see if the build instructions are helpful:

```
$ docker run --rm -v $PWD:/mnt --workdir /mnt -it beevelop/cordova bash
root@696ffb01eee2:/mnt# apt update
root@696ffb01eee2:/mnt# apt install -y phantomjs
phantomjs is already the newest version (2.1.1+dfsg-1).
root@696ffb01eee2:/mnt# npm install -g npm bower ember-cli yarn
...
+ ember-cli@3.17.0
+ yarn@1.22.4
+ bower@1.8.8
+ npm@6.14.4
root@696ffb01eee2:/mnt# git --version
git version 2.7.4
root@696ffb01eee2:/mnt# node --version
v10.16.3
root@696ffb01eee2:/mnt# wget https://github.com/melis-wallet/melis-cm-client/releases/download/1.5.1/ember-leaf-theme-basic-master-9601b6f57e468dd0ccc4bbcdb01ae1aebfb0153c.zip
root@696ffb01eee2:/mnt# unzip ember-leaf-theme-basic-master-9601b6f57e468dd0ccc4bbcdb01ae1aebfb0153c.zip
root@8797b57b1bb3:/mnt# mv ember-leaf-theme-basic-master-9601b6f57e468dd0ccc4bbcdb01ae1aebfb0153c ../ember-leaf-theme-basic
root@696ffb01eee2:/mnt# yarn
root@696ffb01eee2:/mnt# bower install --allow-root
root@696ffb01eee2:/mnt# node i18n/generate-melis-i18n.js
root@696ffb01eee2:/mnt# build/cordova-setup.sh
Usage: config <platform> <target>
root@696ffb01eee2:/mnt# build/build-android.sh
Usage: build <target> <version> <keystorepassword>
```

So with the provider's help we get a bit further but we still did not manage to
get to a compiled app. For build reproduction we would need an unsigned apk. The
`keystorepassword` therefore should not be needed.

Also the zip file being downloaded from the provider's GitHub is certainly kind
of closed source as is and would require investigation apart from how it is
cumbersome to use. It would probably be more convenient to provide that folder
as a git submodule.

We are looking forward to finally reproducing a build but for now remain with
the verdict: **not verifiable**.