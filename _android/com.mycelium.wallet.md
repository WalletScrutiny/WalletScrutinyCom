---
wsId: mycelium
title: Mycelium Bitcoin Wallet
altTitle: 
authors:
- leo
- danny
users: 1000000
appId: com.mycelium.wallet
appCountry: 
released: 2013-07-01
updated: 2025-05-14
version: 3.18.2.0
stars: 3.7
ratings: 11650
reviews: 1151
website: https://wallet.mycelium.com
repository: https://github.com/mycelium-com/wallet-android
issue: 
icon: com.mycelium.wallet.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- dff1afc579b1df3dfeb0c5f6f5c79ade9f3670939128c3b314d84ed69f5a4bc6
date: 2025-03-07
signer: b8e59d4a60b65290efb2716319e50b94e298d7a72c76c2119eb7d8d3afac302e
twitter: MyceliumCom
social:
- https://www.linkedin.com/company/mycelium
- https://www.facebook.com/myceliumcom
- https://www.reddit.com/r/mycelium
redirect_from:
- /mycelium/
- /com.mycelium.wallet/
- /posts/2019/11/mycelium/
- /posts/com.mycelium.wallet/
developerName: Mycelium Developers
features: 

---

Here we test if the latest version can be reproduced, following the known
procedure expressed in our {% include testScript.html %}:

```
===== Begin Results =====
appId:          com.mycelium.wallet
signer:         b8e59d4a60b65290efb2716319e50b94e298d7a72c76c2119eb7d8d3afac302e
apkVersionName: 3.18.2.0
apkVersionCode: 3180200
verdict:        reproducible
appHash:        dff1afc579b1df3dfeb0c5f6f5c79ade9f3670939128c3b314d84ed69f5a4bc6
commit:         791c52f5d948a18987b23edfb3e8ca4ededa85e5

Diff:
Files /tmp/fromPlay_com.mycelium.wallet_3180200/META-INF/CERT.RSA and /tmp/fromBuild_com.mycelium.wallet_3180200/META-INF/CERT.RSA differ
Files /tmp/fromPlay_com.mycelium.wallet_3180200/META-INF/CERT.SF and /tmp/fromBuild_com.mycelium.wallet_3180200/META-INF/CERT.SF differ

Revision, tag (and its signature):
object 791c52f5d948a18987b23edfb3e8ca4ededa85e5
type commit
tag v3.18.2.0
tagger AlexanderPavlenko <AlexanderPavlenko@users.noreply.github.com> 1740001957 +0400

Mycelium Bitcoin Wallet v3.18.2.0

bfb0ac376195f275d274fa86f213d658a5035dd2dcad2565c664ec1acdd040775891c1fd0e01f9b6ea569ea5cbcc94b436cce3abd56d145002375e1ba33ed8ad  prodnet/release/mbw-prodnet-release.apk
cec34c8d94ff010b86fecd9869f18222eb1c59541060ad40f6e697349db0e060bba53a2afe494b346af247c9ce5627ebd6eb0b13fb0fba47121a5de28e409d9f  prodnet/release/mbw-prodnet-release.apk_unzip/META-INF/MANIFEST.MF
b2ee6eb1579d43192b794677fbc0d1aea0debdb7788fae318c59b9d62f0d07669ff481adcf3a10e462d4793363d25ee2a62a47d519d72554a922102d81cbbb34  btctestnet/release/mbw-btctestnet-release.apk
f2605aaa8d36ecb2ab704ad3fcface8237fbfe9c6c937dc0622c156562953afde9910fb725be8927dfad98cc95043ba6dbbca8856da74b343d4bfb1a602e0aa4  btctestnet/release/mbw-btctestnet-release.apk_unzip/META-INF/MANIFEST.MF
8e24820bb21a79ebf2de65fd7f3e1362e980d2abb3f86431da0350d9b7aa847891f96ba4f07f93fec69e75927701a4e43a63d6a17960c25eb98f80cf95be8a5d  prodnet/debug/mbw-prodnet-debug.apk
b83def9380b8d70e1f0f7e399d3b8ad3c16f63b9ff27292d4cb8b690d11f697b5ecf8470a942c965556470f478acc41433337e453f49761f4ca11a865d7e7298  prodnet/debug/mbw-prodnet-debug.apk_unzip/META-INF/MANIFEST.MF
2f440b24751fc8597da7d84db123c93af3453d221078c929504e4bfd5162f1fde7b6ef4507f2ed390c6ca2008a03970840941d1c1b39b4cf43309552bd10e030  btctestnet/debug/mbw-btctestnet-debug.apk
c7c63ad6ce716edc94fc20877a5adb95d5b85fbd69e1470883505ba3343f41e2512e44e7f74b183c816d016c96d85835991feae5afa3903d28931e24cc67e9f9  btctestnet/debug/mbw-btctestnet-debug.apk_unzip/META-INF/MANIFEST.MF
===== End Results =====

```

This version is **reproducible**.

The hashes can be corroborated [here](https://github.com/mycelium-com/wallet-android/tree/v3.18.2.0) as well.

A recording of the test:

{% include asciicast %}

**Disclaimer**: Authors of this project have contributed to Mycelium.
