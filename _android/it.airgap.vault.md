---
title: "AirGap Vault - Tezos, Cosmos, Ethereum, Bitcoin"
altTitle: 

users: 5000
appId: it.airgap.vault
launchDate: 2018-08-06
latestUpdate: 2020-08-18
apkVersionName: "3.4.0"
stars: 3.8
ratings: 39
reviews: 17
size: 9.6M
website: https://airgap.it/
repository: https://github.com/airgap-it/airgap-vault
issue: https://github.com/airgap-it/airgap-vault/issues/23
icon: it.airgap.vault.png
bugbounty: 
verdict: reproducible # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-07-22
reviewStale: true
signer: 486381324d8669c80ca9b8c79d383dc972ec284227d65ebfe9e31cad5fd3f342
reviewArchive:
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


For the latest version our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/test.sh).
came to this conclusion:

```
Results:
appId:          it.airgap.vault
signer:         486381324d8669c80ca9b8c79d383dc972ec284227d65ebfe9e31cad5fd3f342
apkVersionName: 3.3.0
apkVersionCode: 20379
apkHash:        caa4da6ca8fa905e4b25594bebbbcb4bfe030a70178ca65a9b0a60f2651bb316

Diff:
Files /tmp/fromPlay_it.airgap.vault_20379/apktool.yml and /tmp/fromBuild_it.airgap.vault_20379/apktool.yml differ
Files /tmp/fromPlay_it.airgap.vault_20379/original/META-INF/MANIFEST.MF and /tmp/fromBuild_it.airgap.vault_20379/original/META-INF/MANIFEST.MF differ
Only in /tmp/fromPlay_it.airgap.vault_20379/original/META-INF: PAPERS.RSA
Only in /tmp/fromPlay_it.airgap.vault_20379/original/META-INF: PAPERS.SF

Revision, tag (and its signature):
object 453b522dbbe53a603ccbfd01d07bf24f85ad838b
type commit
tag v3.3.0
tagger Andreas Gassmann <a.gassmann@papers.ch> 1595232900 +0200

Version Code: 20379
```

which is what we expect to see for the verdict: **reproducible**.
