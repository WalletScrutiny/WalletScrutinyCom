---
title: "Bitcoin Wallet"
altTitle: "Bitcoin Wallet (Schildbach)"

users: 5000000
appId: de.schildbach.wallet
launchDate: 2011-03-01
latestUpdate: 2020-10-07
apkVersionName: "Varies with device"
stars: 3.9
ratings: 24755
reviews: 7943
size: 2.8M
website: https://github.com/bitcoin-wallet/bitcoin-wallet
repository: https://github.com/bitcoin-wallet/bitcoin-wallet
issue: https://github.com/bitcoin-wallet/bitcoin-wallet/issues/612
icon: de.schildbach.wallet.png
bugbounty: 
verdict: reproducible # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-10-12
reviewStale: false
signer: 58dcd8a0edf2a590683ba022d22a8dca5659aabf4728741a5c07af738d53db38
reviewArchive:
- date: 2020-08-04
  version: "8.05"
  apkHash: 64a611be5c64b14a05a41f90c0a6e6112e7888a83675e5eeae827623e836e5c0
  gitRevision: b683aac93debae97df50251e2c4a975cdb9d5ba6
  verdict: reproducible
- date: 2020-06-20
  version: "8.03"
  apkHash: 09b78cea4be8ca41661b0a9ab3d4a2ed16c8947c2aaceeb39c931ee8e2d3f653
  gitRevision: ab2bf7d33112394ed2a62d7efb2a07c1dd931091
  verdict: reproducible
- date: 2020-05-03
  version: "8.02"
  apkHash: f01e4028778bc2036902af2253522b7de0eb40ca3bff50f51a8c0918737fd6b4
  gitRevision: 163a6e3b592eb73dd94c52f007cd3e8841b0029f
  verdict: reproducible
- date: 2020-04-14
  version: "8.01"
  apkHash: 57c1f1d1f69be7caba2df305c32b1cbd7913537554d9e17006c4b97fd7705a8b
  gitRevision: 6a19b8fdea423320ddd71a9cf7d40443c94df59b
  verdict: reproducible
- date: 2020-04-06
  version: "8.0"
  apkHash: d4bf786409e0cef85a2179a721c5f9b63542d422d6297c76c000194b6c540566
  gitRevision: da1e43187f164ead9aef1a551c067783c4cbb0f6
  verdict: reproducible
- date: 2020-03-29
  version: "7.69"
  apkHash: c3e8495a55da4dffbdd969b77dccf957bcb816a4469e8adc22751fdfc8579ba4
  gitRevision: 0cd3924ebfe4b941730eafdbb581a4abe5874670
  verdict: reproducible
- date: 2020-03-20
  version: "7.68"
  apkHash: f19b776e4483921d9f8d430671241649c55915062f680030ed5652f752c34a26
  gitRevision: 90d987f66d51671d7fb7097cd9676bcdce2a7c02
  verdict: reproducible
- date: 2020-03-14
  version: "7.61"
  apkHash: 03d35ae1d496fc779f46ee91cc8c73e382f498115f8da748030b6031f2befff3
  gitRevision: 586d158eacfe79f2537cf1fa19f0b081cb0fddb6
  verdict: reproducible
- date: 2020-02-16
  version: "7.53"
  apkHash: 03d35ae1d496fc779f46ee91cc8c73e382f498115f8da748030b6031f2befff3
  gitRevision: 5f044a4d730b3cd8dcf520e0273c365de9400c34
  verdict: reproducible
- date: 2020-01-24
  version: "7.47"
  apkHash: 5c57b5b0e57484ddb9a80d04a3a7ff355ccaa2aecdd926231f4844076f071293
  gitRevision: 759631d7bbad4d9150dab1362c3db296b99c6cda
  verdict: reproducible
- date: 2020-01-18
  version: "7.45"
  apkHash: 4ed8da2be3e64b399d84dc4fd3b20141117c496eb45f6bac284d2bd8ee45efa5
  gitRevision: 1237739e1756c97af5da425627da4b910c9aa00b
  verdict: reproducible
- date: 2020-01-07
  version: "7.43"
  apkHash: 
  gitRevision: 8cc2ca64100c1d3e03817debdf272bdec8ed707b
  verdict: reproducible
- date: 2019-11-15
  version: "7.23"
  apkHash: 
  gitRevision: 3d972d9773b0fd2fb1602d31117a50be01d48610
  verdict: reproducible

providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /schildbach/
  - /de.schildbach.wallet/
  - /posts/2019/10/schildbach/
  - /posts/de.schildbach.wallet/
---


For the latest version the
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/master/test.sh)
came to these results:

```
Results:
appId:          de.schildbach.wallet
signer:         58dcd8a0edf2a590683ba022d22a8dca5659aabf4728741a5c07af738d53db38
apkVersionName: 8.06
apkVersionCode: 806
apkHash:        7c68050e0e746d9a7ea984ac2aa4d9541e5a140a073254f5c88036d1aa7430ab

Diff:
Files /tmp/fromPlay_de.schildbach.wallet_806/apktool.yml and /tmp/fromBuild_de.schildbach.wallet_806/apktool.yml differ
Only in /tmp/fromPlay_de.schildbach.wallet_806/original/META-INF: BITCOIN-.RSA
Only in /tmp/fromPlay_de.schildbach.wallet_806/original/META-INF: BITCOIN-.SF
Files /tmp/fromPlay_de.schildbach.wallet_806/original/META-INF/MANIFEST.MF and /tmp/fromBuild_de.schildbach.wallet_806/original/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):
object 7a8bd45dee48676b4dc94a6ede7387b2c9678b59
type commit
tag v8.06
tagger Andreas Schildbach <andreas@schildbach.de> 1601980121 +0200

8.06 release
```

That is what we expected to again give this app the verdict **reproducible**.