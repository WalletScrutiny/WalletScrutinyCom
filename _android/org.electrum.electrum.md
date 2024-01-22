---
wsId: 
title: Electrum Bitcoin Wallet
altTitle: 
authors:
- leo
- Mohammad Rafigh
users: 500000
appId: org.electrum.electrum
appCountry: 
released: 2016-03-02
updated: 2024-01-19
version: 4.5.1.0
stars: 3.8
ratings: 2500
reviews: 321
size: 
website: https://electrum.org
repository: https://github.com/spesmilo/electrum
issue: https://github.com/spesmilo/electrum/issues/8838
icon: org.electrum.electrum.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2024-01-22
signer: 
reviewArchive:
- date: 2023-09-25
  version: "4.4.6.0"
  appHash: 23dcba9487f25334fa91387b91368ddc7a42de73dd8e2f55fcfdfc6f57a987db
  gitRevision: 629069611f99b513a69153e2cc7c0fba29ee44eb
  verdict: reproducible
- date: 2023-06-21
  version: 4.4.4.0
  appHash: 51d4fa83acb11e0b60bc3cd218f5a98b4a8a7fa6ac543cc94316168ca4e791af
  gitRevision: 02efce0be192c630f747855adbd5b5f81661bf0a
  verdict: reproducible
- date: 2023-05-09
  version: 4.4.2.0
  appHash: d668878b77b2a7accf819bcd9559e2eb088fc31d00163c8665b62e7cfefccb4a
  gitRevision: ff287e518fcc34010420ce413c95dd790ab544bd
  verdict: reproducible
- date: 2022-11-01
  version: 4.2.1.0
  appHash: f7da55a86aca86080884c1864f8db383d29116d9409ed7f37179785514f1ecf0
  gitRevision: 90e5984b647eb0211524e604b6fedff08894f6fd
  verdict: reproducible
- date: 2022-04-15
  version: 4.1.5.0
  appHash: 5042c47441ffa110f3edf0669d8135e77643e314d63428c262f8e091555b3588
  gitRevision: 55e1bd76d95920a8e60eac7890a72606c2069148
  verdict: nonverifiable
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
developerName: Electrum Technologies GmbH
features:
- ln

---

Here we test if the latest version can be reproduced, following the known
procedure expressed in our {% include testScript.html %}:

```
===== Begin Results =====
appId:          org.electrum.electrum
signer:         e543d576fa0f2a33d412bca4c7d61e2301830e956e7d947e75b9052d176027d3
apkVersionName: 4.5.1.0
apkVersionCode: 34050100
verdict:        reproducible
appHash:        efcf5a4873df41f21e653aa7f6733719402cc701a0ac4ebf4fe1a075514ca2ad
commit:         f98e9863457eac22d82a34daa9d970429032b5a1

Diff:
Only in /tmp/fromPlay_org.electrum.electrum_34050100/META-INF: CERT.RSA
Only in /tmp/fromPlay_org.electrum.electrum_34050100/META-INF: CERT.SF
Only in /tmp/fromPlay_org.electrum.electrum_34050100/META-INF: MANIFEST.MF

Revision, tag (and its signature):
object f98e9863457eac22d82a34daa9d970429032b5a1
type commit
tag 4.5.1
tagger SomberNight <somber.night@protonmail.com> 1705598266 +0000

4.5.1
===== End Results =====
```

This is what we want to see to file the product version as **reproducible**.

A recording of the test:

{% include asciicast %}
