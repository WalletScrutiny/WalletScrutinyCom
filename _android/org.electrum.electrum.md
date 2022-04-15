---
wsId: 
title: Electrum Bitcoin Wallet
altTitle: 
authors:
- leo
users: 500000
appId: org.electrum.electrum
appCountry: 
released: 2016-03-02
updated: 2022-04-07
version: 4.2.1.0
stars: 3.5
ratings: 2500
reviews: 280
size: 23M
website: https://electrum.org
repository: https://github.com/spesmilo/electrum
issue: https://github.com/spesmilo/electrum/issues/7640
icon: org.electrum.electrum.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2022-04-15
signer: 
reviewArchive:
- date: 2022-01-21
  version: 4.1.5.0
  appHash: 3b5011c575ba0646855f8686e7952fe3a4da70ca009082dd6a683bc12de529ca
  gitRevision: eea48a17393717f715185a6874d3e9dc7ec7c0ed
  verdict: nonverifiable
- date: 2021-07-19
  version: 4.1.5.0
  appHash: de25614cc8f8fa20262f20df816634a349cf796b3e4cf026087e4dec12c15231
  gitRevision: 3af3091090e37747e1b3f2690dd37c5097645fa2
  verdict: reproducible
- date: 2021-06-18
  version: 4.1.4
  appHash: fffa9a1c27ee6d6bd1d90e8008fe53ba960d19137964b93968d68ec7a4f04433
  gitRevision: 409a7b42b7975b50077de60a0fe096a13fed2d12
  verdict: reproducible
- date: 2021-06-10
  version: 3.3.7
  appHash: 
  gitRevision: 612e60ecd2013c802012d1c553a2ff8b56004226
  verdict: nonverifiable
twitter: ElectrumWallet
social: 
redirect_from:
- /electrum/
- /org.electrum.electrum/
- /posts/2019/12/elecrtum/
- /posts/org.electrum.electrum/

---

With the updated test script:

```
===== Begin Results =====
appId:          org.electrum.electrum
signer:         e543d576fa0f2a33d412bca4c7d61e2301830e956e7d947e75b9052d176027d3
apkVersionName: 4.1.5.0
apkVersionCode: 34010500
verdict:        
appHash:        5042c47441ffa110f3edf0669d8135e77643e314d63428c262f8e091555b3588
commit:         d8d2c180aafaec1ae9bc68c27a7d780df8de4348

Diff:
Files /tmp/fromPlay_org.electrum.electrum_34010500/assets/private.mp3 and /tmp/fromBuild_org.electrum.electrum_34010500/assets/private.mp3 differ
Only in /tmp/fromPlay_org.electrum.electrum_34010500/META-INF: CERT.RSA
Only in /tmp/fromPlay_org.electrum.electrum_34010500/META-INF: CERT.SF
Files /tmp/fromPlay_org.electrum.electrum_34010500/META-INF/MANIFEST.MF and /tmp/fromBuild_org.electrum.electrum_34010500/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):
object d8d2c180aafaec1ae9bc68c27a7d780df8de4348
type commit
tag 4.1.5
tagger ThomasV <thomasv@electrum.org> 1626708974 +0200

4.1.5
===== End Results =====
```

which looks good except for the file `assets/private.mp3` which differs.

Although probably harmless, this binary is **not verifiable**.
