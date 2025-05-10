---
wsId: 
title: Electrum Bitcoin Wallet
altTitle: 
authors:
- leo
- Mohammad Rafigh
- danny
- keraliss
users: 1000000
appId: org.electrum.electrum
appCountry: 
released: 2016-03-02
updated: 2024-10-22
version: 4.5.7
stars: 4
ratings: 2500
reviews: 343
website: https://electrum.org
repository: https://github.com/spesmilo/electrum
issue: https://github.com/spesmilo/electrum/issues/8838
icon: org.electrum.electrum.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 042333dc6dd81238c70609bffe580c4d871fc9cac295c2e588d7537c95355e94
date: 2024-10-23
signer: 
reviewArchive:
- date: 2024-07-11
  version: 4.5.5.0
  appHashes:
  - 5f25335ab62c13df2c20ce7d56e18db1f12eaf0fe00462bacae2a2ab0b71daf6
  gitRevision: 64219fc498da2057c7469cffb3cde9e128fe4ac7
  verdict: reproducible
- date: 2024-03-25
  version: 4.5.4.0
  appHashes:
  - cb4577e845374d7d118e05984d6c04bfbc1e065c1a31d2f8b4d3879499c88a98
  gitRevision: f610a4b7fa9d5f31ff65d1a6935a46ddbf854c2f
  verdict: reproducible
- date: 2024-01-22
  version: 4.5.1.0
  appHashes:
  - efcf5a4873df41f21e653aa7f6733719402cc701a0ac4ebf4fe1a075514ca2ad
  gitRevision: 668c0b5c594847155457efad9eb7d0bdc8a72af6
  verdict: reproducible
- date: 2023-09-25
  version: 4.4.6.0
  appHashes:
  - 23dcba9487f25334fa91387b91368ddc7a42de73dd8e2f55fcfdfc6f57a987db
  gitRevision: 629069611f99b513a69153e2cc7c0fba29ee44eb
  verdict: reproducible
- date: 2023-06-21
  version: 4.4.4.0
  appHashes:
  - 51d4fa83acb11e0b60bc3cd218f5a98b4a8a7fa6ac543cc94316168ca4e791af
  gitRevision: 02efce0be192c630f747855adbd5b5f81661bf0a
  verdict: reproducible
- date: 2023-05-09
  version: 4.4.2.0
  appHashes:
  - d668878b77b2a7accf819bcd9559e2eb088fc31d00163c8665b62e7cfefccb4a
  gitRevision: 8fad27bc4aa5606bfac202986c98be8d2c562e30
  verdict: reproducible
- date: 2022-11-01
  version: 4.2.1.0
  appHashes:
  - f7da55a86aca86080884c1864f8db383d29116d9409ed7f37179785514f1ecf0
  gitRevision: 5c4119ad98989e27feebe00c85f0fa3d49faec81
  verdict: reproducible
- date: 2021-07-19
  version: 4.1.5.0
  appHashes:
  - 5042c47441ffa110f3edf0669d8135e77643e314d63428c262f8e091555b3588
  - 3b5011c575ba0646855f8686e7952fe3a4da70ca009082dd6a683bc12de529ca
  - de25614cc8f8fa20262f20df816634a349cf796b3e4cf026087e4dec12c15231
  gitRevision: 3af3091090e37747e1b3f2690dd37c5097645fa2
  verdict: reproducible
- date: 2021-06-18
  version: 4.1.4
  appHashes:
  - fffa9a1c27ee6d6bd1d90e8008fe53ba960d19137964b93968d68ec7a4f04433
  gitRevision: 409a7b42b7975b50077de60a0fe096a13fed2d12
  verdict: reproducible
- date: 2021-06-10
  version: 3.3.7
  appHashes: []
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
apkVersionName: 4.5.7
apkVersionCode: 45405073
verdict:        reproducible
appHash:        042333dc6dd81238c70609bffe580c4d871fc9cac295c2e588d7537c95355e94
commit:         8ec250e5271ab6957b28c7a4aa3bbb4f3d276981

Diff:
Only in /tmp/fromPlay_org.electrum.electrum_45405073/META-INF: CERT.RSA
Only in /tmp/fromPlay_org.electrum.electrum_45405073/META-INF: CERT.SF
Only in /tmp/fromPlay_org.electrum.electrum_45405073/META-INF: MANIFEST.MF

Revision, tag (and its signature):
object 8ec250e5271ab6957b28c7a4aa3bbb4f3d276981
type commit
tag 4.5.7
tagger SomberNight <somber.night@protonmail.com> 1729438457 +0000

4.5.7
===== End Results =====

```

This is what we want to see to file the product version as **reproducible**.

{% include asciicast %}