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
stars: 4.1
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
