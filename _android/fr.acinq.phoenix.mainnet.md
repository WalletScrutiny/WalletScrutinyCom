---
title: "Phoenix | The Bitcoin wallet from the future"
altTitle: 

users: 5000
appId: fr.acinq.phoenix.mainnet
launchDate: 2019-12-10
latestUpdate: 2020-10-19
apkVersionName: "1.4.0"
stars: 4.4
ratings: 147
reviews: 66
size: 34M
website: https://phoenix.acinq.co
repository: https://github.com/ACINQ/phoenix
issue: https://github.com/ACINQ/phoenix/issues/112
icon: fr.acinq.phoenix.mainnet.png
bugbounty: 
verdict: nonverifiable # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-10-24
reviewStale: false
signer: ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
reviewArchive:
- date: 2020-08-14
  version: "1.3.3"
  apkHash: 29211695f12c794d0e5edc883315810cf29d22e7ad8fdcd1da7755abec6aff4d
  gitRevision: 88e1f6824c733c848222ad885673a909ece99ffb
  verdict: reproducible
- date: 2020-01-13
  version: "1.3.1"
  apkHash: 0c91c5f118f88b9715d20323799d5002b722115d01c95d11f20f088521f76ada
  gitRevision: 9abba57f047955e9991baa269f2082e8f3374f95
  verdict: nonverifiable

providerTwitter: PhoenixWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /fr.acinq.phoenix.mainnet/
  - /posts/fr.acinq.phoenix.mainnet/
---

Here we test if the latest version can be verified, following the known
procedure expressed in our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/master/test.sh):

```
Results:
appId:          fr.acinq.phoenix.mainnet
signer:         ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
apkVersionName: 1.4.0
apkVersionCode: 15
apkHash:        4689d6249e86442ab3657756d9971c9b0894051728dab214a43778665bbc9d43

Diff:
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/apktool.yml and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/apktool.yml differ
Only in /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/original/META-INF: MAINNET.RSA
Only in /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/original/META-INF: MAINNET.SF
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/original/META-INF/MANIFEST.MF and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/original/META-INF/MANIFEST.MF differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/DatabaseImpl$Schema.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/DatabaseImpl$Schema.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$get$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$get$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$get$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$get$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$getByChannelId$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$getByChannelId$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$getByChannelId$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$getByChannelId$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$GetByChannelIdQuery$execute$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$GetByChannelIdQuery$execute$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$GetByChannelIdQuery.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$GetByChannelIdQuery.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$GetQuery$execute$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$GetQuery$execute$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$GetQuery.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$GetQuery.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertClosing$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertClosing$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertClosing$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertClosing$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertEmpty$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertEmpty$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertEmpty$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertEmpty$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertSwapIn$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertSwapIn$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertSwapIn$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertSwapIn$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertSwapOut$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertSwapOut$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertSwapOut$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$insertSwapOut$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$setChannelClosingError$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$setChannelClosingError$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$setChannelClosingError$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$setChannelClosingError$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$setDesc$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$setDesc$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$setDesc$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl$setDesc$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PaymentMetaQueriesImpl.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$get$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$get$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$get$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$get$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$GetQuery$execute$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$GetQuery$execute$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$GetQuery.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$GetQuery.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$insert$1.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$insert$1.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$insert$2.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl$insert$2.smali differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl.smali and /tmp/fromBuild_fr.acinq.phoenix.mainnet_15/smali_classes3/fr/acinq/phoenix/app/PayToOpenMetaQueriesImpl.smali differ
```

This is a huge and significant diff. In this version the app is
**not verifiable**.
