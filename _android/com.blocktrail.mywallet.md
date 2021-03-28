---
wsId: btcCom
title: "BTC.com - Bitcoin Wallet"
altTitle: 
authors:

users: 500000
appId: com.blocktrail.mywallet
launchDate: 
latestUpdate: 2019-04-03
apkVersionName: "4.4.7"
stars: 3.5
ratings: 8006
reviews: 3798
size: 13M
website: https://btc.com
repository: http://github.com/blocktrail/blocktrail-wallet
issue: 
icon: com.blocktrail.mywallet.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-03-03
reviewStale: false
signer: 
reviewArchive:


providerTwitter: btccom_official
providerLinkedIn: 
providerFacebook: btccom
providerReddit: 

redirect_from:

---


This app claims:

> - Bitcoin (BTC) & Bitcoin Cash (BCH) support<br>
> - 100% control of your private keys

so it's a self-custodial BTC wallet. And it's also open source:

> This wallet is a free and open source software. You can view the code on
  GitHub at http://github.com/blocktrail/blocktrail-wallet.

That's great but can we reproduce the app?

On Google Play the "current version" is `4.4.7` and on GitHub we find a tag for
that.

The Readme.md also contains
[compile instructions](https://github.com/blocktrail/blocktrail-wallet#android).
Let's do this:

```
$ git clone https://github.com/blocktrail/blocktrail-wallet
$ cd blocktrail-wallet/
$ git checkout v4.4.7 
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm beevelop/cordova bash
root@f74eea3c3d23:/mnt# npm install -g npm # make sure npm is latest version
root@f74eea3c3d23:/mnt# npm_config_engine_strict=false npm install -g ionic@4.3.1 cordova@8.1.2 gulp
root@f74eea3c3d23:/mnt# npm install
(node:39) ExperimentalWarning: The fs.promises API is experimental
npm ERR! code 1
npm ERR! path /mnt/node_modules/@sentry/cli
npm ERR! command failed
npm ERR! command sh -c node scripts/install.js
npm ERR! Error: Command failed: /mnt/node_modules/@sentry/cli/sentry-cli --version
npm ERR! error: Failed to load .sentryclirc file from the home folder.
npm ERR!   caused by: Permission denied (os error 13)

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2021-03-05T02_14_24_795Z-debug.log
```

so as `.sentryclirc`
[apparently is a file that has to be in the home folder](https://github.com/getsentry/sentry-webpack-plugin/issues/111)
with some sort of credentials, we probably can't build the project without this
further step and conclude the app is **not verifiable**.

**Apart from there being source code it is worth mentioning that the app was not
updated since July 2019 and many 1* ratings complain about financial loss!**