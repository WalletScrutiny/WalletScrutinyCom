---
wsId: AirGapVault
title: "AirGap Vault - Tezos, Cosmos, Ethereum, Bitcoin"
altTitle: 
authors:
- leo
users: 10000
appId: it.airgap.vault
released: 2018-08-06
updated: 2021-08-26
version: "3.9.0"
stars: 4.0
ratings: 84
reviews: 36
size: 68M
website: https://airgap.it
repository: https://github.com/airgap-it/airgap-vault
issue: https://github.com/airgap-it/airgap-vault/issues/43
icon: it.airgap.vault.png
bugbounty: 
verdict: obfuscated
date: 2021-08-28
signer: 486381324d8669c80ca9b8c79d383dc972ec284227d65ebfe9e31cad5fd3f342
reviewArchive:
- date: 2021-08-03
  version: "3.8.0"
  appHash: f886635f7014856631e4d325fca4ba49b20fdb1b57116b1b416af0bfb8f5ba09
  gitRevision: 9e86597fdc6ed6beaf848b2899f1df7f9e9da62e
  verdict: reproducible
- date: 2021-04-24
  version: "3.7.0"
  appHash: 57c362a3508f1420007fe5d0867f889a9683f0b51d746ab20067fb9e90abbc2f
  gitRevision: f24d668889031ca802d7113153224d8435b58892
  verdict: reproducible
- date: 2021-03-03
  version: "3.6.2"
  appHash: 2394251a22f5658ed60187854f1a8d1dd97af367c779c698f3e4a75516c5d025
  gitRevision: b82c674377bf48cc9d068bc4d325913af7ebdaed
  verdict: reproducible
- date: 2021-02-27
  version: "3.6.2"
  appHash: f3ff145265859f45da2c7a310ac6c94183c61910fe2bf2fba0da7dbf8e56e626
  gitRevision: 3b6d2410d108ffe36e0dd9a208996c135496ba17
  verdict: reproducible
- date: 2021-02-18
  version: "3.6.1"
  appHash: 6068c88b2dbbc0033531f0237c77ea08b1d73d9fae5ea699ea7f551ae51a1920
  gitRevision: 1570fd01dc1f5b720e7b83553a9e5fe3d0a54f53
  verdict: obfuscated
- date: 2020-12-15
  version: "3.5.1"
  appHash: f46de03b62975b57350b9c30975d7fb85e4c9a88e46ca15bc2125fea24a56823
  gitRevision: 51b7e569c45fbaea30f26e1eda580fb68cf546c9
  verdict: reproducible
- date: 2020-09-02
  version: "3.5.0"
  appHash: ec1ffc9b88898084eb66852b46c9460922401bd16b80ce20532c6a5548467aaa
  gitRevision: 5e569f89c217deb79d15d78603ca71b3e2702200
  verdict: reproducible
- date: 2020-08-21
  version: "3.4.0"
  appHash: de51c80653019c3d31814daeb0aabdbe09ce4e4a5e340372c502d26dde57d045
  gitRevision: 6b6dfd6c7f4bb944e2c8ad4c0711e41848da569a
  verdict: reproducible
- date: 2020-07-22
  version: "3.3.0"
  appHash: caa4da6ca8fa905e4b25594bebbbcb4bfe030a70178ca65a9b0a60f2651bb316
  gitRevision: e0c3c00e6c5db1d4467c0c8049db15b59d1dbf2a
  verdict: reproducible
- date: 2020-07-17
  version: "3.3.0"
  appHash: caa4da6ca8fa905e4b25594bebbbcb4bfe030a70178ca65a9b0a60f2651bb316
  gitRevision: 7ed2da6afba9f50585e90a18699c231622803465
  verdict: nonverifiable
- date: 2020-04-28
  version: "3.2.0"
  appHash: 951ee71325f9cee9237cc43235cd653363bf0d7f268e574e4b50856207c170e4
  gitRevision: fa74057a781cc9f13b71e2067f78af8c48af752f
  verdict: reproducible
- date: 2020-04-09
  version: "3.1.0"
  appHash: f6f2f37ef164a585ae5de0ff28d5beaf729c8e41495ce1525af7b7642e1f963a
  gitRevision: b54542a17c2b75f5bd5ccbae353201d6f742bb50
  verdict: reproducible
- date: 2020-01-06
  version: "3.0.0"
  appHash: d3bb8f0c7c30119405ef9b6c00ca5574e89da76d8ca5208aecc3530bf24e1987
  gitRevision: 63cf4944a2aaa3275258632dc3e7efbd957e3a89
  verdict: reproducible
- date: 2019-12-29
  version: "3.0.0"
  appHash: d3bb8f0c7c30119405ef9b6c00ca5574e89da76d8ca5208aecc3530bf24e1987
  gitRevision: 1b2995ed2db18e2517812f7fbb3b2aca04a4653e
  verdict: nonverifiable

providerTwitter: AirGap_it
providerLinkedIn: 
providerFacebook: 
providerReddit: AirGap

redirect_from:
  - /it.airgap.vault/
  - /posts/it.airgap.vault/
---


We ran our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/test.sh)
which delivered these results:

```
[hash=62d2c09cb1cbceeab1b90cf19e94e7e1c2385cf1bf852629200dea0999ea1c62, versionCode=33523, versionName=3.9.0, date=Fri Aug 27 23:13:50 UTC 2021, reproducible=false, testResult=Something went wrong while trying to reproduce the apk from wallet repository.]
```

... this was our first run which happened automatically on our server.

Running it locally resulted in:

```
fatal: Remote branch v3.9.0 not found in upstream origin
```

which is what the server probably ran into, too. Without further investigation
we tried the latest version on the `master` branch:

```
$ ./test.sh --apk /path/to/AirGap\ Vault\ 3.9.0\ \(it.airgap.vault\).apk --revision-override master
...
Results:
appId:          it.airgap.vault
signer:         486381324d8669c80ca9b8c79d383dc972ec284227d65ebfe9e31cad5fd3f342
apkVersionName: 3.9.0
apkVersionCode: 33523
verdict:        
appHash:        62d2c09cb1cbceeab1b90cf19e94e7e1c2385cf1bf852629200dea0999ea1c62
commit:         5f7ace136ae9377128809155180aa160ecb01ed1

Diff:
Files /tmp/fromPlay_it.airgap.vault_33523/assets/public/3rdpartylicenses.txt and /tmp/fromBuild_it.airgap.vault_33523/assets/public/3rdpartylicenses.txt differ
Files /tmp/fromPlay_it.airgap.vault_33523/assets/public/index.html and /tmp/fromBuild_it.airgap.vault_33523/assets/public/index.html differ
Only in /tmp/fromPlay_it.airgap.vault_33523/assets/public: main.1991060c36f34c10328b.js
Only in /tmp/fromBuild_it.airgap.vault_33523/assets/public: main.462813af45843585aca4.js
Files /tmp/fromPlay_it.airgap.vault_33523/META-INF/MANIFEST.MF and /tmp/fromBuild_it.airgap.vault_33523/META-INF/MANIFEST.MF differ
Only in /tmp/fromPlay_it.airgap.vault_33523/META-INF: PAPERS.RSA
Only in /tmp/fromPlay_it.airgap.vault_33523/META-INF: PAPERS.SF

Revision, tag (and its signature):
```

which is **not verifiable**. But is it dangerous?

```
$ sha256sum /tmp/fromPlay_it.airgap.vault_33523/assets/public/main.1991060c36f34c10328b.js /tmp/fromBuild_it.airgap.vault_33523/assets/public/main.462813af45843585aca4.js
1bc94185658db02fe8d6b155f0ae01c237b916302627aba74581f31f63fe198a  /tmp/fromPlay_it.airgap.vault_33523/assets/public/main.1991060c36f34c10328b.js
91f78ee19cadb51b379e65f330dc44edceb1b1000e79b9d43dd2c585651e4fc5  /tmp/fromBuild_it.airgap.vault_33523/assets/public/main.462813af45843585aca4.js
```

`main.1991060c36f34c10328b.js` is not just named differently. As its content is
**obfuscated**:

```
$ head -c 800 /tmp/fromPlay_it.airgap.vault_33523/assets/public/main.1991060c36f34c10328b.js | fold -w 80
(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"+/uU":function(Qt){Qt.
exports=JSON.parse('{"$ref":"#/definitions/SignedEthereumTransaction","$schema":
"http://json-schema.org/draft-07/schema#","definitions":{"SignedEthereumTransact
ion":{"additionalProperties":false,"properties":{"accountIdentifier":{"type":"st
ring"},"transaction":{"type":"string"}},"required":["accountIdentifier","transac
tion"],"type":"object"}}}')},"+4fs":function(Qt,Ft,Jt){"use strict";var Ht,qt=Jt
("3Fw7"),jt=this&&this.__extends||(Ht=function extendStatics(Qt,Ft){return(Ht=Ob
ject.setPrototypeOf||{__proto__:[]}instanceof Array&&function(Qt,Ft){Qt.__proto_
_=Ft}||function(Qt,Ft){for(var Jt in Ft)Object.prototype.hasOwnProperty.call(Ft,
Jt)&&(Qt[Jt]=Ft[Jt])})(Qt,Ft)},function(Qt,Ft){function __(){this.constructor=Qt
```

This is alarming and not the first time this happens. Check Older Reviews above
for `v3.6.1`.
