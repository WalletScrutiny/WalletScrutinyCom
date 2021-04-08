---
wsId: 
title: "Breez: Lightning Network Client & Point-of-Sale"
altTitle: 
authors:
- leo
users: 5000
appId: com.breez.client
launchDate: 
latestUpdate: 2021-04-07
apkVersionName: "Varies with device"
stars: 
ratings: 
reviews: 
size: Varies with device
website: https://breez.technology
repository: https://github.com/breez/breezmobile
issue: https://github.com/breez/breezmobile/issues/247
icon: com.breez.client.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2019-12-28
reviewStale: true
signer: 
reviewArchive:


providerTwitter: breez_tech
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /breez/
  - /com.breez.client/
  - /posts/2019/12/breez/
  - /posts/com.breez.client/
---


A description to our liking. Here it is in full:

> Breez is a Lightning Network client which makes paying in bitcoin a seamless
  experience. With Breez, anyone can send or receive small payments in bitcoin.
  It's simple, fast and safe.

Ok, seamless, lightning, ... nice.

> Breez is a non-custodial service that uses lnd and Neutrino under the hood.

We want to hear that! Be your own bank!

> For more technical information, please go to: https://github.com/breez/breezmobile.

So they are non-custodial and provide source code. More work for us :)

> Warning: the app is still in beta and there is a chance your money will be
  lost. Use this app only if you are willing to take this risk.

That's certainly inspiring more confidence than other apps with 2 months of
track record claiming to be the best in the world. :)

Well, in terms of [Build Instructions](https://github.com/breez/breezmobile#build)
the app is lacking.

```
$ git clone git@github.com:breez/breezmobile.git
$ cd breezmobile/
$ git tag
0.5-openbeta
0.5.8-openbeta
0.5.9-openbeta
0.7-openbeta
0.8.improvements
```

As on the playstore it says "**Current Version:** Varies with device", we go with
what google gives us when we install it on a phone: `0.8-beta`. The best match above would thus be the tag
`0.8.improvements`:

```
$ git checkout 0.8.improvements 
$ cat android/app/build.gradle | grep version
        versionCode 1
        versionName "0.8-beta"
            versionNameSuffix "-pos"
```

looks good so far. For now. We will not guess like this in the future.

> Build breez.aar and bindings.framework as decribed in breez/breez

```
$ git submodule status 
$
```

... so ... the build instructions give no clue which version of breez/breez to
build and there is no submodule?

```
$ git clone git@github.com:breez/breez.git
$ cd breez
$ git tag
0.5-openbeta
0.5.8-openbeta
```

Had there been a `0.8`... in the breez project, we would have had a clue
where to go next but absent that, there is no hope of reproducing the app. For
now our verdict is: **not verifiable**.
