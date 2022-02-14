---
wsId: 
title: "Electrum Bitcoin Wallet"
altTitle: 
authors:
- leo
users: 500000
appId: org.electrum.electrum
appCountry: 
released: 2016-03-02
updated: 2021-07-19
version: "4.1.5.0"
stars: 3.3
ratings: 2493
reviews: 275
size: 21M
website: https://electrum.org
repository: https://github.com/spesmilo/electrum
issue: https://github.com/spesmilo/electrum/issues/7640
icon: org.electrum.electrum.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2022-01-21
signer: 
reviewArchive:
- date: 2021-07-19
  version: "4.1.5.0"
  appHash: de25614cc8f8fa20262f20df816634a349cf796b3e4cf026087e4dec12c15231
  gitRevision: 3af3091090e37747e1b3f2690dd37c5097645fa2
  verdict: reproducible
- date: 2021-06-18
  version: "4.1.4"
  appHash: fffa9a1c27ee6d6bd1d90e8008fe53ba960d19137964b93968d68ec7a4f04433
  gitRevision: 409a7b42b7975b50077de60a0fe096a13fed2d12
  verdict: reproducible
- date: 2021-06-10
  version: "3.3.7"
  appHash: 
  gitRevision: 612e60ecd2013c802012d1c553a2ff8b56004226
  verdict: nonverifiable
providerTwitter: ElectrumWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

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
appHash:        3b5011c575ba0646855f8686e7952fe3a4da70ca009082dd6a683bc12de529ca
commit:         d8d2c180aafaec1ae9bc68c27a7d780df8de4348

Diff:
Files /home/leo/tmp/fromPlay_org.electrum.electrum_34010500/assets/private.mp3 and /home/leo/tmp/fromBuild_org.electrum.electrum_34010500/assets/private.mp3 differ
Only in /home/leo/tmp/fromPlay_org.electrum.electrum_34010500/META-INF: CERT.RSA
Only in /home/leo/tmp/fromPlay_org.electrum.electrum_34010500/META-INF: CERT.SF
Files /home/leo/tmp/fromPlay_org.electrum.electrum_34010500/META-INF/MANIFEST.MF and /home/leo/tmp/fromBuild_org.electrum.electrum_34010500/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):
object d8d2c180aafaec1ae9bc68c27a7d780df8de4348
type commit
tag 4.1.5
tagger ThomasV <thomasv@electrum.org> 1626708974 +0200

4.1.5
===== End Results =====
```

which looks good except for the file `assets/private.mp3` which differs.

To inspect this further, `diffoscope` is a great tool that "understands" many
formats:

```
$ diffoscope /home/leo/tmp/fromPlay_org.electrum.electrum_34010500/assets/private.mp3 /home/leo/tmp/fromBuild_org.electrum.electrum_34010500/assets/private.mp3
--- /home/leo/tmp/fromPlay_org.electrum.electrum_34010500/assets/private.mp3
+++ /home/leo/tmp/fromBuild_org.electrum.electrum_34010500/assets/private.mp3
├── private.mp3-content
│ ├── packages/attrs-20.3.0.dist-info/RECORD
│ │ @@ -20,9 +20,9 @@
│ │  attr/validators.pyi,sha256=vZgsJqUwrJevh4v_Hd7_RSXqDrBctE6-3AEZ7uYKodo,1868
│ │  attrs-20.3.0.dist-info/AUTHORS.rst,sha256=wsqCNbGz_mklcJrt54APIZHZpoTIJLkXqEhhn4Nd8hc,752
│ │  attrs-20.3.0.dist-info/INSTALLER,sha256=zuuue4knoyJ-UwPPXg8fezS7VCrXJQrAP7zeNuwvFQg,4
│ │  attrs-20.3.0.dist-info/LICENSE,sha256=v2WaKLSSQGAvVrvfSQy-LsUJsVuY-Z17GaUsdA4yeGM,1082
│ │  attrs-20.3.0.dist-info/METADATA,sha256=dZRpEuqnuh9GVy6KKp7r2FNftkmQRnY-WpAfkfao4pU,10268
│ │  attrs-20.3.0.dist-info/RECORD,,
│ │  attrs-20.3.0.dist-info/REQUESTED,sha256=47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU,0
│ │ -attrs-20.3.0.dist-info/WHEEL,sha256=Z-nyYpwrcSqxfdux5Mbn_DQ525iP7J2DG3JgGvOYyTQ,110
│ │ +attrs-20.3.0.dist-info/WHEEL,sha256=z9j0xAa_JmUKMpmz72K0ZGALSM_n-wQVmGbleXx2VHg,110
│ │  attrs-20.3.0.dist-info/top_level.txt,sha256=tlRYMddkRlKPqJ96wP2_j9uEsmcNHgD2SbuWd4CzGVU,5
│ ├── packages/attrs-20.3.0.dist-info/WHEEL
│ │ @@ -1,6 +1,6 @@
│ │  Wheel-Version: 1.0
│ │ -Generator: bdist_wheel (0.36.2)
│ │ +Generator: bdist_wheel (0.37.1)
│ │  Root-Is-Purelib: true
│ │  Tag: py2-none-any
│ │  Tag: py3-none-any
│ ├── packages/importlib_metadata-3.7.2.dist-info/RECORD
│ │ @@ -1,11 +1,11 @@
│ │  importlib_metadata-3.7.2.dist-info/INSTALLER,sha256=zuuue4knoyJ-UwPPXg8fezS7VCrXJQrAP7zeNuwvFQg,4
│ │  importlib_metadata-3.7.2.dist-info/LICENSE,sha256=wNe6dAchmJ1VvVB8D9oTc-gHHadCuaSBAev36sYEM6U,571
│ │  importlib_metadata-3.7.2.dist-info/METADATA,sha256=QAixFtFPRI3wDMFsnEB08wkmIVxN1HH2XSS5sr-4ZqA,3465
│ │  importlib_metadata-3.7.2.dist-info/RECORD,,
│ │  importlib_metadata-3.7.2.dist-info/REQUESTED,sha256=47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU,0
│ │ -importlib_metadata-3.7.2.dist-info/WHEEL,sha256=OqRkF0eY5GHssMorFjlbTIq072vpHpF60fIQA6lS9xA,92
│ │ +importlib_metadata-3.7.2.dist-info/WHEEL,sha256=G16H4A3IeoQmnOrYV4ueZGKSjhipXx8zc8nu9FGlvMA,92
│ │  importlib_metadata-3.7.2.dist-info/top_level.txt,sha256=CO3fD9yylANiXkrMo4qHLV_mqXL2sC5JFKgt1yWAT-A,19
│ │  importlib_metadata/__init__.py,sha256=H9o96z7BGqGGdqgEDOZO0wgiNrxAOsWiaWCQfaDlCG0,24736
│ │  importlib_metadata/_compat.py,sha256=JA7DmId9NZtsj6nj8UjQZuPyktaLCTT3wHo7jWfPZc4,2384
│ │  importlib_metadata/_itertools.py,sha256=5TUj_APJHq3pvjn04hnP2oYBebP2No7HmNH_hkOGwLQ,607
│ │  importlib_metadata/py.typed,sha256=47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU,0
│ ├── packages/importlib_metadata-3.7.2.dist-info/WHEEL
│ │ @@ -1,5 +1,5 @@
│ │  Wheel-Version: 1.0
│ │ -Generator: bdist_wheel (0.36.2)
│ │ +Generator: bdist_wheel (0.37.1)
│ │  Root-Is-Purelib: true
│ │  Tag: py3-none-any
│ ├── packages/multidict-5.1.0.dist-info/RECORD
│ │ @@ -1,13 +1,13 @@
│ │  multidict-5.1.0.dist-info/INSTALLER,sha256=zuuue4knoyJ-UwPPXg8fezS7VCrXJQrAP7zeNuwvFQg,4
│ │  multidict-5.1.0.dist-info/LICENSE,sha256=ocWCVRMnnTCFoLpGiA4UjqNxDBSbuu3PLRFgWl7TxK0,11349
│ │  multidict-5.1.0.dist-info/METADATA,sha256=Y6GrdYtqGUB3_4DpKNQ9CYqxkO8zFwvMxpmZll43nzw,4116
│ │  multidict-5.1.0.dist-info/RECORD,,
│ │  multidict-5.1.0.dist-info/REQUESTED,sha256=47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU,0
│ │ -multidict-5.1.0.dist-info/WHEEL,sha256=OqRkF0eY5GHssMorFjlbTIq072vpHpF60fIQA6lS9xA,92
│ │ +multidict-5.1.0.dist-info/WHEEL,sha256=G16H4A3IeoQmnOrYV4ueZGKSjhipXx8zc8nu9FGlvMA,92
│ │  multidict-5.1.0.dist-info/top_level.txt,sha256=-euDElkk5_qkmfIJ7WiqCab02ZlSFZWynejKg59qZQQ,10
│ │  multidict/__init__.py,sha256=N4CEqAIdPpG1R12M4dPhLpljd4y7U6O8EWTb0bX-EIg,942
│ │  multidict/__init__.pyi,sha256=__MuUVn9A-C7Y1wqBzgc12G2T_b5TnXgG9uN4qrpk6M,4931
│ │  multidict/_abc.py,sha256=Zvnrn4SBkrv4QTD7-ZzqNcoxw0f8KStLMPzGvBuGT2w,1190
│ │  multidict/_compat.py,sha256=1pqf7gkjjapGmNpTPR38OfQZlbRDLHiaox853LPs-oA,363
│ │  multidict/_multidict.c,sha256=0kPnAtdE6rRwBDfhwLi6mrGp0DVsc6rq2Wbhi3_ZQOE,40881
│ │  multidict/_multidict_base.py,sha256=XugkE78fXBmtzDdg2Yi9TrEhDexmL-6qJbFIG0viLMg,3791
│ ├── packages/multidict-5.1.0.dist-info/WHEEL
│ │ @@ -1,5 +1,5 @@
│ │  Wheel-Version: 1.0
│ │ -Generator: bdist_wheel (0.36.2)
│ │ +Generator: bdist_wheel (0.37.1)
│ │  Root-Is-Purelib: true
│ │  Tag: py3-none-any
│ ├── packages/pip-21.0.1.dist-info/RECORD
│ │ @@ -2,15 +2,15 @@
│ │  ../../bin/pip3,sha256=I2UWrbOISqm6o_QRtkkf9H7UV1whUH_sKKjmElHFLnc,221
│ │  ../../bin/pip3.8,sha256=I2UWrbOISqm6o_QRtkkf9H7UV1whUH_sKKjmElHFLnc,221
│ │  pip-21.0.1.dist-info/INSTALLER,sha256=zuuue4knoyJ-UwPPXg8fezS7VCrXJQrAP7zeNuwvFQg,4
│ │  pip-21.0.1.dist-info/LICENSE.txt,sha256=ejlw8iXn2TntLdOpADqlISSc1qhJJgiYAKMZmq713Gk,1110
│ │  pip-21.0.1.dist-info/METADATA,sha256=YYT8F31NPOzdAi0WEvjg-STKbxj8jpPmgpTKJiVrdEA,4194
│ │  pip-21.0.1.dist-info/RECORD,,
│ │  pip-21.0.1.dist-info/REQUESTED,sha256=47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU,0
│ │ -pip-21.0.1.dist-info/WHEEL,sha256=OqRkF0eY5GHssMorFjlbTIq072vpHpF60fIQA6lS9xA,92
│ │ +pip-21.0.1.dist-info/WHEEL,sha256=G16H4A3IeoQmnOrYV4ueZGKSjhipXx8zc8nu9FGlvMA,92
│ │  pip-21.0.1.dist-info/entry_points.txt,sha256=HtfDOwpUlr9s73jqLQ6wF9V0_0qvUXJwCBz7Vwx0Ue0,125
│ │  pip-21.0.1.dist-info/top_level.txt,sha256=zuuue4knoyJ-UwPPXg8fezS7VCrXJQrAP7zeNuwvFQg,4
│ │  pip/__init__.py,sha256=N22Wk52M-ZwIU8jx64XlNaLmHk_MyL1ErZ_71RG1Pzo,473
│ │  pip/__main__.py,sha256=WGRSG7tdJrjefIHsZOk977H_rgkSt9z2liew-Cwm09U,874
│ │  pip/_internal/__init__.py,sha256=fnY9L5BJfq79L8CXhLnj2nJMH8-JEpJkGQAMhM231AU,512
│ │  pip/_internal/build_env.py,sha256=mEgguVg9YnwbVVLtwUlDF5irYsweDksk67obP0KAjE8,8323
│ │  pip/_internal/cache.py,sha256=j4UrFmwo2xC0e1QQUVAwPVuySmQttDUGJb-myD4t-Q8,10385
│ ├── packages/pip-21.0.1.dist-info/WHEEL
│ │ @@ -1,5 +1,5 @@
│ │  Wheel-Version: 1.0
│ │ -Generator: bdist_wheel (0.36.2)
│ │ +Generator: bdist_wheel (0.37.1)
│ │  Root-Is-Purelib: true
│ │  Tag: py3-none-any
│ ├── packages/yarl-1.6.3.dist-info/RECORD
│ │ @@ -1,13 +1,13 @@
│ │  yarl-1.6.3.dist-info/INSTALLER,sha256=zuuue4knoyJ-UwPPXg8fezS7VCrXJQrAP7zeNuwvFQg,4
│ │  yarl-1.6.3.dist-info/LICENSE,sha256=FMCCBQPO7xXoFKibA32e_AZocAhwGClLauDycWOHLMU,11368
│ │  yarl-1.6.3.dist-info/METADATA,sha256=4LdDdgnvmWHl5xPmIZAHnThRl4V8cXznId2oj-DHtmg,18982
│ │  yarl-1.6.3.dist-info/RECORD,,
│ │  yarl-1.6.3.dist-info/REQUESTED,sha256=47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU,0
│ │ -yarl-1.6.3.dist-info/WHEEL,sha256=OqRkF0eY5GHssMorFjlbTIq072vpHpF60fIQA6lS9xA,92
│ │ +yarl-1.6.3.dist-info/WHEEL,sha256=G16H4A3IeoQmnOrYV4ueZGKSjhipXx8zc8nu9FGlvMA,92
│ │  yarl-1.6.3.dist-info/top_level.txt,sha256=vf3SJuQh-k7YtvsUrV_OPOrT9Kqn0COlk7IPYyhtGkQ,5
│ │  yarl/__init__.py,sha256=q1AsILx9yBkriaOSJghxeC5ynHn_7rMmldWf-VlnFnA,154
│ │  yarl/__init__.pyi,sha256=81znZr-kyslhoSkwDDXZsfhrLOjUAoJ4ApfwDfcfbPM,3702
│ │  yarl/_quoting.py,sha256=A35UGLJW4EOOHZNNocSiK7tRNGKe1NgqH3jxMoYN2x0,519
│ │  yarl/_quoting_c.c,sha256=RSUoRWxACSWS4KUeP2_3GJX8CwTYOATxFD3U488diWI,453267
│ │  yarl/_quoting_c.pyi,sha256=plPeUkIbXp4Hzi0AbYII4JA0H9tCjtjw-UUPU5Na1s0,447
│ │  yarl/_quoting_c.pyx,sha256=_xiVS3dNEvYcKdGx973DYBRRUVz4CURuG5iTdF4zXYk,11498
│ ├── packages/yarl-1.6.3.dist-info/WHEEL
│ │ @@ -1,5 +1,5 @@
│ │  Wheel-Version: 1.0
│ │ -Generator: bdist_wheel (0.36.2)
│ │ +Generator: bdist_wheel (0.37.1)
│ │  Root-Is-Purelib: true
│ │  Tag: py3-none-any
│ ├── packages/zipp-3.4.1.dist-info/RECORD
│ │ @@ -1,8 +1,8 @@
│ │  zipp-3.4.1.dist-info/INSTALLER,sha256=zuuue4knoyJ-UwPPXg8fezS7VCrXJQrAP7zeNuwvFQg,4
│ │  zipp-3.4.1.dist-info/LICENSE,sha256=2z8CRrH5J48VhFuZ_sR4uLUG63ZIeZNyL4xuJUKF-vg,1050
│ │  zipp-3.4.1.dist-info/METADATA,sha256=EIdnTkPQX8qbq3tfp4HSbcR6E27KCFWOXjv9xbdR67s,2109
│ │  zipp-3.4.1.dist-info/RECORD,,
│ │  zipp-3.4.1.dist-info/REQUESTED,sha256=47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU,0
│ │ -zipp-3.4.1.dist-info/WHEEL,sha256=OqRkF0eY5GHssMorFjlbTIq072vpHpF60fIQA6lS9xA,92
│ │ +zipp-3.4.1.dist-info/WHEEL,sha256=G16H4A3IeoQmnOrYV4ueZGKSjhipXx8zc8nu9FGlvMA,92
│ │  zipp-3.4.1.dist-info/top_level.txt,sha256=iAbdoSHfaGqBfVb2XuR9JqSQHCoOsOtG6y9C_LSpqFw,5
│ │  zipp.py,sha256=wMSoYxAIPgYnqJAW0JcAl5sWaIcFc5xk3dNjf6ElGgU,8089
│ ├── packages/zipp-3.4.1.dist-info/WHEEL
│ │ @@ -1,5 +1,5 @@
│ │  Wheel-Version: 1.0
│ │ -Generator: bdist_wheel (0.36.2)
│ │ +Generator: bdist_wheel (0.37.1)
│ │  Root-Is-Purelib: true
│ │  Tag: py3-none-any
```

So this looks benign. To our understanding, the release manager used a different
version of [wheel](https://github.com/pypa/wheel) than we now did but the output
matched except for the record of the version used.

Although probably harmless, this binary is **not verifiable**.
