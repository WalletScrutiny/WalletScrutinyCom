---
title: "AirGap Vault - Tezos, Cosmos, Ethereum, Bitcoin"
altTitle: 

users: 5000
appId: it.airgap.vault
launchDate: 2018-08-06
latestUpdate: 2020-11-06
apkVersionName: "3.5.1"
stars: 4.0
ratings: 71
reviews: 27
size: 10M
website: https://airgap.it
repository: https://github.com/airgap-it/airgap-vault
issue: https://github.com/airgap-it/airgap-vault/issues/32
icon: it.airgap.vault.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-12-15
reviewStale: false
signer: 486381324d8669c80ca9b8c79d383dc972ec284227d65ebfe9e31cad5fd3f342
reviewArchive:
- date: 2020-09-02
  version: "3.5.0"
  apkHash: ec1ffc9b88898084eb66852b46c9460922401bd16b80ce20532c6a5548467aaa
  gitRevision: 5e569f89c217deb79d15d78603ca71b3e2702200
  verdict: reproducible
- date: 2020-08-21
  version: "3.4.0"
  apkHash: de51c80653019c3d31814daeb0aabdbe09ce4e4a5e340372c502d26dde57d045
  gitRevision: 6b6dfd6c7f4bb944e2c8ad4c0711e41848da569a
  verdict: reproducible
- date: 2020-07-22
  version: "3.3.0"
  apkHash: caa4da6ca8fa905e4b25594bebbbcb4bfe030a70178ca65a9b0a60f2651bb316
  gitRevision: e0c3c00e6c5db1d4467c0c8049db15b59d1dbf2a
  verdict: reproducible
- date: 2020-07-17
  version: "3.3.0"
  apkHash: caa4da6ca8fa905e4b25594bebbbcb4bfe030a70178ca65a9b0a60f2651bb316
  gitRevision: 7ed2da6afba9f50585e90a18699c231622803465
  verdict: nonverifiable
- date: 2020-04-28
  version: "3.2.0"
  apkHash: 951ee71325f9cee9237cc43235cd653363bf0d7f268e574e4b50856207c170e4
  gitRevision: fa74057a781cc9f13b71e2067f78af8c48af752f
  verdict: reproducible
- date: 2020-04-09
  version: "3.1.0"
  apkHash: f6f2f37ef164a585ae5de0ff28d5beaf729c8e41495ce1525af7b7642e1f963a
  gitRevision: b54542a17c2b75f5bd5ccbae353201d6f742bb50
  verdict: reproducible
- date: 2020-01-06
  version: "3.0.0"
  apkHash: d3bb8f0c7c30119405ef9b6c00ca5574e89da76d8ca5208aecc3530bf24e1987
  gitRevision: 63cf4944a2aaa3275258632dc3e7efbd957e3a89
  verdict: reproducible
- date: 2019-12-29
  version: "3.0.0"
  apkHash: d3bb8f0c7c30119405ef9b6c00ca5574e89da76d8ca5208aecc3530bf24e1987
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


**Update:** So the provider added the missing tag from our last try but
unfortunately the verdict did not change.

We ran our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/test.sh).
again which delivered these results:

```
Results:
appId:          it.airgap.vault
signer:         486381324d8669c80ca9b8c79d383dc972ec284227d65ebfe9e31cad5fd3f342
apkVersionName: 3.5.1
apkVersionCode: 23940
apkHash:        f46de03b62975b57350b9c30975d7fb85e4c9a88e46ca15bc2125fea24a56823

Diff:
Files /tmp/fromPlay_it.airgap.vault_23940/apktool.yml and /tmp/fromBuild_it.airgap.vault_23940/apktool.yml differ
Files /tmp/fromPlay_it.airgap.vault_23940/assets/public/index.html and /tmp/fromBuild_it.airgap.vault_23940/assets/public/index.html differ
Only in /tmp/fromBuild_it.airgap.vault_23940/assets/public: main.48c0b1291dc2c9240100.js
Only in /tmp/fromPlay_it.airgap.vault_23940/assets/public: main.cd4034adbb37067a0b90.js
Files /tmp/fromPlay_it.airgap.vault_23940/original/META-INF/MANIFEST.MF and /tmp/fromBuild_it.airgap.vault_23940/original/META-INF/MANIFEST.MF differ
Only in /tmp/fromPlay_it.airgap.vault_23940/original/META-INF: PAPERS.RSA
Only in /tmp/fromPlay_it.airgap.vault_23940/original/META-INF: PAPERS.SF

Revision, tag (and its signature):
object 32c980cd295c3976b5a4350cec30d8b10e00e650
type commit
tag v3.5.1
tagger Mike Godenzi <m.godenzi@papers.ch> 1605788380 +0100

version 3.5.1
```

which means the build is **not verifiable**.

**Digging deeper** we looked at what's going on and found:

* `index.html` differs in its reference to the `main.*.js`
* meld didn't like comparing those `main.*.js` consisting of one line
  with 5,206,447 characters each

After unfolding this **obfuscated** JS code with `js-beautify`, the diff became
more manageable. Turns out the obfuscator "invented" a different name for one
function name replacement and listed the functions in a different order:

The diff became a long list of essentially this:

```
...
82387c82387
<             var jt = Ht("N+aw"),
---
>             var jt = Ht("AQYT"),
87698c87698
<             var jt = Ht("N+aw"),
---
>             var jt = Ht("AQYT"),
88540c88540
<                 var jt = Ht("N+aw"),
---
>                 var jt = Ht("AQYT"),
90380c90380
<             var Jt = Ht("N+aw"),
---
>             var Jt = Ht("AQYT"),
...
```

and these function definitions in different lines:

```
55407,56453d56453
<         "N+aw": function(Qt, Ft, Ht) {
<             (function(Qt) {
<                 ! function(Qt, Ft) {
```

vs.

```
21489a21490,22536
>         AQYT: function(Qt, Ft, Ht) {
>             (function(Qt) {
>                 ! function(Qt, Ft) {
```

We
could replace one string with the other in one of the files, move a code block
and come to the same result. This does **not** count as reproducible as nobody
can be burdened with these steps but neither did we find a smoking gun. If the
code on GitHub is fine then so is the app we got from Google Play.

Lastly we recently introduced a new category for
[obfuscated apps](https://walletscrutiny.com/moreApps/#obfuscated) and will have
to move this app there if the problem cannot be resolved with the next release.

Obfuscation/Minification is not a problem as long as the app is reproducible but
a diff in obfuscated code makes analysis significantly harder as we had to
experience today.
