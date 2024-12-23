---
wsId: swissBitcoinPay
title: Swiss Bitcoin Pay
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: ch.swissbitcoinpay.checkout
appCountry: 
released: 2022-11-15
updated: 2024-12-20
version: 2.2.8
stars: 4.7
ratings: 
reviews: 
size: 
website: https://swiss-bitcoin-pay.ch
repository: https://github.com/SwissBitcoinPay/app
issue: https://github.com/SwissBitcoinPay/app/issues/53
icon: ch.swissbitcoinpay.checkout.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-09-18
signer: 17d9c0bf025008da16d5a146e1beaca6ddcfe3cb0cf063da23c847d3007eb621
reviewArchive:
- date: 2024-08-23
  version: 2.1.1
  appHash: 62df7d225d6178688f451604552fb5d79525a257ac59e281f0c02f4c96e4d343
  gitRevision: 3703a5d0543f672252f7b37e5636a9e40c3b6e5e
  verdict: nonverifiable
- date: 2024-06-04
  version: 2.1.0
  appHash: 
  gitRevision: 49d9b9282cfd495e90fb6d839423ce6ad7b5d721
  verdict: ftbfs
twitter: SwissBitcoinPay
social:
- https://www.linkedin.com/company/swiss-bitcoin-pay
- https://www.youtube.com/@swissbitcoinpay
redirect_from: 
developerName: Swiss Bitcoin Pay
features:
- ln

---

## Update 2024-09-10:
We tested the project using our <strong>test script <a href="/testScript">(?)</a></strong>, and here is the result:
```
===== End Results =====

Run a full
diff --recursive /tmp/fromPlay_ch.swissbitcoinpay.checkout_386 /tmp/fromBuild_ch.swissbitcoinpay.checkout_386
meld /tmp/fromPlay_ch.swissbitcoinpay.checkout_386 /tmp/fromBuild_ch.swissbitcoinpay.checkout_386
or
diffoscope "/home/keraliss/projects/apks/Swiss Bitcoin Pay.apk" /tmp/test_ch.swissbitcoinpay.checkout/base-master.apk
for more details.'
===== Begin Results =====
appId:          ch.swissbitcoinpay.checkout
signer:         17d9c0bf025008da16d5a146e1beaca6ddcfe3cb0cf063da23c847d3007eb621
apkVersionName: 2.1.4
apkVersionCode: 386
verdict:        
appHash:        69a7e528ca403489349a482af6a35b94646b428dd27b09336793ad5817cdd9af
commit:         6f2f989c0978da798d2c3c1b376e01ee0346a838

Diff:
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/AndroidManifest.xml and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/AndroidManifest.xml differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/assets/dexopt/baseline.prof and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/assets/index.android.bundle and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/assets/index.android.bundle differ
Only in /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/assets: index.android.bundle.hbc.map
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/assets/index.android.bundle.map and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/assets/index.android.bundle.map differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/classes.dex and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/classes.dex differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/drawable/notification_bg_low.xml and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable/notification_bg_low.xml differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/drawable/notification_bg.xml and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable/notification_bg.xml differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/drawable/notification_tile_bg.xml and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable/notification_tile_bg.xml differ
Only in /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4: node_modules_reactnative_libraries_logbox_ui_logboximages_alerttriangle.png
Only in /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4: node_modules_reactnative_libraries_logbox_ui_logboximages_chevronleft.png
Only in /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4: node_modules_reactnative_libraries_logbox_ui_logboximages_chevronright.png
Only in /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4: node_modules_reactnative_libraries_logbox_ui_logboximages_close.png
Only in /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4: node_modules_reactnative_libraries_logbox_ui_logboximages_loader.png
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_bitcointoslot.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_bitcointoslot.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_bitcoinwhiteborder.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_bitcoinwhiteborder.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_boltcardblack.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_boltcardblack.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_boltcard.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_boltcard.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_logosquarerounded.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/drawable-mdpi-v4/src_assets_images_logosquarerounded.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/res/mipmap-hdpi-v4/ic_launcher_adaptive_fore.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/res/mipmap-hdpi-v4/ic_launcher_adaptive_fore.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_386/resources.arsc and /tmp/fromBuild_ch.swissbitcoinpay.checkout_386/resources.arsc differ
Only in /tmp/fromPlay_ch.swissbitcoinpay.checkout_386: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====
```

The app built successfully although many of the differences consisted of timestamps and file permission codes.

The amount of diffs indicate that the app is **nonverifiable.** 



## App Description from Google Play

> Accept Bitcoin in your business.
>
> Worldwide. Free to start. No hardware. Non-custodial.
>
> The simplest way to accept Bitcoin payments in your Business, restaurant, bar, and others.
>
> So simple to use:
> 1. You type the amount in your local currency.
> 2. Client scan the QR or tap a Lightning NFC Card.
> 3. Paid.
>
> Maximum compatibility:
>
> Through the same screen, receive in:
> Bitcoin On-chain
> Lightning
> Lightning-NFC standard
>
> Non-custodial
>
> After clients have paid through Onchain and/or Lightning, the Lightning-BTC will be converted to Onchain-BTC (free of charge) and will all be sent to your private wallet (free of charge), as configured in your account.

- All the bitcoins that you charge via Swiss Bitcoin Pay will be sent to the address you provide.
- Lightning to Onchain conversions and miner fees are always free of charge for you
- Payout is done every day at 0:00 UTC
- A cryptographic signature of your Bitcoin wallet is required to prove ownership.

## Analysis 

- Account creation was straight-forward. It only required an email address.
- The 12-word seed phrase were provided during wallet creation.
- They claim to have their app on [F-Droid](https://swiss-bitcoin-pay.ch/fdroid/repo/).
- They provided the fingerprint (SHA-256) of the repository signing key.

# 2024-08-19 Dockerfile Update

The providers of Swiss Bitcoin Pay accommodated our request and provided a Dockerfile to build the app.

As such we were able to make a modified copy of their project's Dockerfile and incorporated it with our <strong>test script <a href="/testScript">(?)</a></strong>. Here are the summarized results:

```
===== Begin Results =====
appId:          ch.swissbitcoinpay.checkout
signer:         17d9c0bf025008da16d5a146e1beaca6ddcfe3cb0cf063da23c847d3007eb621
apkVersionName: 2.1.1
apkVersionCode: 381
verdict:        
appHash:        62df7d225d6178688f451604552fb5d79525a257ac59e281f0c02f4c96e4d343
commit:         b350085a6f30027a83a8fdb18b73c5aed073cc97

Diff:
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/AndroidManifest.xml and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/AndroidManifest.xml differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/assets/index.android.bundle and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/assets/index.android.bundle differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_bitcoinwhiteborder.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_bitcoinwhiteborder.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_boltcardblack.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_boltcardblack.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_boltcard.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_boltcard.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_logosquarerounded.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_logosquarerounded.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/mipmap-hdpi-v4/ic_launcher_adaptive_fore.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/mipmap-hdpi-v4/ic_launcher_adaptive_fore.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/resources.arsc and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/resources.arsc differ
Only in /tmp/fromPlay_ch.swissbitcoinpay.checkout_381: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====

```

{% include asciicast %}

The app built successfully although many of the differences consisted of timestamps and file permission codes.
[Link to full diffoscope here.](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/ch.swissbitcoinpay.checkout/diff-results.html)

The amount of diffs indicate that the app is **nonverifiable.** 

## Split APKs from AAB

Another approach is to compare split apks. Our [apkextractor_sync.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/apkextractor_sync.sh) script downloaded 3 apks: 

```
$ aapt2 dump badging fromPlay/*.apk | grep version*
package: name='ch.swissbitcoinpay.checkout' versionCode='381' versionName='2.1.1' platformBuildVersionName='' platformBuildVersionCode='' compileSdkVersion='34' compileSdkVersionCodename='14'
package: name='ch.swissbitcoinpay.checkout' versionCode='381' versionName='' split='config.armeabi_v7a'
package: name='ch.swissbitcoinpay.checkout' versionCode='381' versionName='' split='config.xhdpi'
```

We managed to build 3 split artifacts as well:

```
$ aapt2 dump badging fromBuild/*.apk | grep version*
package: name='ch.swissbitcoinpay.checkout' versionCode='381' versionName='' split='config.armeabi_v7a'
package: name='ch.swissbitcoinpay.checkout' versionCode='381' versionName='2.1.1' platformBuildVersionName='' platformBuildVersionCode='' compileSdkVersion='34' compileSdkVersionCodename='14'
package: name='ch.swissbitcoinpay.checkout' versionCode='381' versionName='' split='config.xhdpi'
```

## Normalization 

The split apks have varying names so the next step is to normalize their names.

Normalization entails renaming the apks so they would be easier to compare.

```
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits$ cd fromBuild
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits/fromBuild$ mv base-armeabi_v7a.apk armeabi_v7a.apk
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits/fromBuild$ mv base-master.apk base.apk
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits/fromBuild$ mv base-xhdpi.apk xhdpi.apk
```

```
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits/fromBuild$ cd ../fromPlay
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits/fromPlay$ mv split_config.armeabi_v7a.apk armeabi_v7a.apk
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits/fromPlay$ mv split_config.xhdpi.apk xhdpi.apk
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits/fromPlay$ cd ..
```

## Extraction

```
$ mkdir -p fromBuild_unpacked fromPlay_unpacked
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits$ ls
fromBuild  fromBuild_unpacked  fromPlay  fromPlay_unpacked
danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits$ cd fromBuild
for apk in *.apk; do
    unzip -q "$apk" -d "../fromBuild_unpacked/${apk%.apk}"
done
```

```
$ cd fromPlay
for apk in *.apk; do
    unzip -q "$apk" -d "../fromPlay_unpacked/${apk%.apk}"
done
cd ..
```

## Normalization of Content

We then remove these files 

- AndroidManifest.xml - related to build information
- stamp-cert-sha256 - SHA256SUM of certificate used to build

Public key certificate related files of the app signer:

- BNDLTOOL.RSA
- BNDLTOOL.SF
- EMERGENC.RSA
- EMERGENC.SF

Manifest file that's part of the jar signing process

- MANIFEST.MF

```
$ for dir in fromBuild_unpacked fromPlay_unpacked; do
    find "$dir" -type f \( -name "AndroidManifest.xml" -o -name "stamp-cert-sha256" -o -name "BNDLTOOL.RSA" -o -name "BNDLTOOL.SF" -o -name "MANIFEST.MF" -o -name "EMERGENC.RSA" -o -name "EMERGENC.SF" \) -delete
    find "$dir" -type f -path "*/res/xml/splits*.xml" -delete
    find "$dir" -type d -empty -delete
done
```

## Apk comparison

We then begin the comparison process with:

`danny@lw10:~/work/compare/ch.swissbitcoinpay.checkout/381-splits$ diff -r fromBuild_unpacked fromPlay_unpacked`

The results:

```
Binary files fromBuild_unpacked/armeabi_v7a/lib/armeabi-v7a/libconceal.so and fromPlay_unpacked/armeabi_v7a/lib/armeabi-v7a/libconceal.so differ
diff -r fromBuild_unpacked/base/assets/index.android.bundle fromPlay_unpacked/base/assets/index.android.bundle
1052c1052
< __d((function(g,r,i,a,m,e,d){'use strict';function n(){for(var n=arguments.length,t=new Array(n),o=0;o<n;o++)t[o]=arguments[o];return 1===t.length&&Array.isArray(t[0])&&(t=t[0]),new(r(d[0]))(t)}n.plugin=function(t,o){var s,c=!1;function u(){console&&console.warn&&!c&&(c=!0,console.warn(t+": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"),process.env.LANG&&process.env.LANG.startsWith('cn')&&console.warn(t+": \u91cc\u9762 postcss.plugin \u88ab\u5f03\u7528. \u8fc1\u79fb\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226"));var n=o.apply(void 0,arguments);return n.postcssPlugin=t,n.postcssVersion=(new(r(d[0]))).version,n}return Object.defineProperty(u,'postcss',{get:function(){return s||(s=u()),s}}),u.process=function(t,o,s){return n([u(s)]).process(t,o)},u},n.stringify=r(d[1]),n.parse=r(d[2]),n.fromJSON=r(d[3]),n.list=r(d[4]),n.comment=function(n){return new(r(d[5]))(n)},n.atRule=function(n){return new(r(d[6]))(n)},n.decl=function(n){return new(r(d[7]))(n)},n.rule=function(n){return new(r(d[8]))(n)},n.root=function(n){return new(r(d[9]))(n)},n.document=function(n){return new(r(d[10]))(n)},n.CssSyntaxError=r(d[11]),n.Declaration=r(d[7]),n.Container=r(d[12]),n.Processor=r(d[0]),n.Document=r(d[10]),n.Comment=r(d[5]),n.Warning=r(d[13]),n.AtRule=r(d[6]),n.Result=r(d[14]),n.Input=r(d[15]),n.Rule=r(d[8]),n.Root=r(d[9]),n.Node=r(d[16]),r(d[17]).registerPostcss(n),m.exports=n,n.default=n}),920,[921,923,933,947,944,940,941,938,943,935,946,931,936,926,925,928,939,945]);
---
> __d((function(g,r,i,a,m,e,d){'use strict';function n(){for(var n=arguments.length,t=new Array(n),o=0;o<n;o++)t[o]=arguments[o];return 1===t.length&&Array.isArray(t[0])&&(t=t[0]),new(r(d[0]))(t)}n.plugin=function(t,o){var s,u=!1;function c(){console&&console.warn&&!u&&(u=!0,console.warn(t+": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"));var n=o.apply(void 0,arguments);return n.postcssPlugin=t,n.postcssVersion=(new(r(d[0]))).version,n}return Object.defineProperty(c,'postcss',{get:function(){return s||(s=c()),s}}),c.process=function(t,o,s){return n([c(s)]).process(t,o)},c},n.stringify=r(d[1]),n.parse=r(d[2]),n.fromJSON=r(d[3]),n.list=r(d[4]),n.comment=function(n){return new(r(d[5]))(n)},n.atRule=function(n){return new(r(d[6]))(n)},n.decl=function(n){return new(r(d[7]))(n)},n.rule=function(n){return new(r(d[8]))(n)},n.root=function(n){return new(r(d[9]))(n)},n.document=function(n){return new(r(d[10]))(n)},n.CssSyntaxError=r(d[11]),n.Declaration=r(d[7]),n.Container=r(d[12]),n.Processor=r(d[0]),n.Document=r(d[10]),n.Comment=r(d[5]),n.Warning=r(d[13]),n.AtRule=r(d[6]),n.Result=r(d[14]),n.Input=r(d[15]),n.Rule=r(d[8]),n.Root=r(d[9]),n.Node=r(d[16]),r(d[17]).registerPostcss(n),m.exports=n,n.default=n}),920,[921,923,933,947,944,940,941,938,943,935,946,931,936,926,925,928,939,945]);
2138c2138
< __d((function(g,r,i,a,m,e,d){Object.defineProperty(e,"__esModule",{value:!0}),e.useVersionTag=void 0;var o=process.env.CM_COMMIT||process.env.COMMIT_REF;e.useVersionTag=function(){return`${(0,(0,r(d[0]).useTranslation)(void 0,{keyPrefix:"common"}).t)("version",{tag:"2.1.1"})} - ${o?`Commit ${o.slice(0,7)}`:"Dev mode"}`}}),1446,[1079]);
---
> __d((function(g,r,i,a,m,e,d){Object.defineProperty(e,"__esModule",{value:!0}),e.useVersionTag=void 0;e.useVersionTag=function(){return`${(0,(0,r(d[0]).useTranslation)(void 0,{keyPrefix:"common"}).t)("version",{tag:"2.1.1"})} - Commit ${"b350085a6f30027a83a8fdb18b73c5aed073cc97".slice(0,7)}`}}),1446,[1079]);
Binary files fromBuild_unpacked/base/res/drawable-mdpi-v4/src_assets_images_bitcoinwhiteborder.png and fromPlay_unpacked/base/res/drawable-mdpi-v4/src_assets_images_bitcoinwhiteborder.png differ
Binary files fromBuild_unpacked/base/res/drawable-mdpi-v4/src_assets_images_boltcardblack.png and fromPlay_unpacked/base/res/drawable-mdpi-v4/src_assets_images_boltcardblack.png differ
Binary files fromBuild_unpacked/base/res/drawable-mdpi-v4/src_assets_images_boltcard.png and fromPlay_unpacked/base/res/drawable-mdpi-v4/src_assets_images_boltcard.png differ
Binary files fromBuild_unpacked/base/res/drawable-mdpi-v4/src_assets_images_logosquarerounded.png and fromPlay_unpacked/base/res/drawable-mdpi-v4/src_assets_images_logosquarerounded.png differ
Binary files fromBuild_unpacked/base/res/mipmap-hdpi-v4/ic_launcher_adaptive_fore.png and fromPlay_unpacked/base/res/mipmap-hdpi-v4/ic_launcher_adaptive_fore.png differ
Binary files fromBuild_unpacked/base/resources.arsc and fromPlay_unpacked/base/resources.arsc differ
Binary files fromBuild_unpacked/xhdpi/resources.arsc and fromPlay_unpacked/xhdpi/resources.arsc differ
```

### Summary:

- **libconceal.so** in the *armeabi-v7a* directory
- Several image files (.png) in the base/res/drawable-mdpi-v4 directory
- **ic_launcher_adaptive_fore.png** in the base/res/mipmap-hdpi-v4 directory
- **resources.arsc** in both base and xhdpi directories

This confirms our verdict of **non-verifiable**

We raised an issue regarding this in SwissBitcoinPay's [issue tracker.](https://github.com/SwissBitcoinPay/app/issues/107)




