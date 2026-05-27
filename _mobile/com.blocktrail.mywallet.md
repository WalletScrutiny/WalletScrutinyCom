---
wsId: btcCom
title: BTC.com - Bitcoin Wallet
date: 2021-12-29
website: https://btc.com
repository: https://github.com/blocktrail/blocktrail-wallet
twitter: btccom_official
social:
- https://www.facebook.com/btccom
features:
- hd
- multiSig
- foss
- camera
redirect_from:
- /android/com.blocktrail.mywallet/
- /iphone/com.blocktrail.mywallet/
android:
  appId: com.blocktrail.mywallet
  users: 1000000
  released: 2015-09-09
  updated: 2019-04-03
  version: 4.4.7
  reviews: 3928
  icon: com.blocktrail.mywallet.png
  meta: removed
  verdict: sourceavailable
iphone:
  appId: com.blocktrail.mywallet
  idd: 1019614423
  released: 2015-09-08
  updated: 2019-04-13
  version: 4.4.9
  reviews: 424
  icon: com.blocktrail.mywallet.jpg
  meta: removed
  verdict: sourceavailable

---

## Android

{% include featureEvidence.html feature="hd" source="[README](https://github.com/blocktrail/blocktrail-wallet#readme)" quote="HD wallet technology allowing you to create an unlimited number of addresses" %}
{% include featureEvidence.html feature="multiSig" source="[README](https://github.com/blocktrail/blocktrail-wallet#readme)" quote="2-of-3 Multisig technology so you always remain in control of your coins" %}
{% include featureEvidence.html feature="foss" source="[README](https://github.com/blocktrail/blocktrail-wallet#readme)" quote="GNU Affero General Public License" %}
{% include featureEvidence.html feature="camera" source="[README](https://github.com/blocktrail/blocktrail-wallet#readme)" quote="QR code scanning with bitcoin URI support" %}

This app claims:

> - Bitcoin (BTC) & Bitcoin Cash (BCH) support<br>
> - 100% control of your private keys

so it's a self-custodial BTC wallet. And it's also open source:

> This wallet is a free and open source software. You can view the code on
  GitHub at https://github.com/blocktrail/blocktrail-wallet.

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

---

## iPhone

{% include featureEvidence.html feature="hd" source="[README](https://github.com/blocktrail/blocktrail-wallet#readme)" quote="HD wallet technology allowing you to create an unlimited number of addresses" %}
{% include featureEvidence.html feature="multiSig" source="[README](https://github.com/blocktrail/blocktrail-wallet#readme)" quote="2-of-3 Multisig technology so you always remain in control of your coins" %}
{% include featureEvidence.html feature="foss" source="[README](https://github.com/blocktrail/blocktrail-wallet#readme)" quote="GNU Affero General Public License" %}

**Update 2022-02-22**: This app is not available anymore.

{% include copyFromAndroid.html %}
