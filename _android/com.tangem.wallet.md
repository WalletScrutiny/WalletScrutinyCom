---
wsId: tangem
title: Tangem - Crypto wallet
altTitle: 
authors:
- leo
- danny
users: 50000
appId: com.tangem.wallet
appCountry: 
released: 2018-10-24
updated: 2024-04-16
version: 5.8.2
stars: 4.5
ratings: 89
reviews: 221
size: 
website: https://tangem.com
repository: https://github.com/tangem/tangem-app-android
issue: 
icon: com.tangem.wallet.png
bugbounty: 
meta: ok
verdict: nosource
date: 2024-02-09
signer: 
reviewArchive: 
twitter: tangem
social:
- https://www.linkedin.com/company/tangem
redirect_from: 
developerName: Tangem AG
features: 

---

**Update 2024-02-09**: Yes, there is a repository but it has neither
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
