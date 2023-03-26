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
updated: 2023-01-26
version: 4.3.4.0
stars: 3.9
ratings: 2500
reviews: 302
size: 
website: https://electrum.org
repository: https://github.com/spesmilo/electrum
issue: https://github.com/spesmilo/electrum/issues/7640
icon: org.electrum.electrum.png
bugbounty: 
meta: outdated
verdict: reproducible
date: 2022-11-01
signer: 
reviewArchive:
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
- /org.electrum.electrum/
- /posts/2019/12/elecrtum/
- /posts/org.electrum.electrum/
features:
- ln

---

**Update 2022-11-01**: The latest binary does not compile with our current
script. We have to look into it and potentially consult with the provider.

With our {% include testScript.html %} we get:

```
...
+ cp contrib/deterministic-build/requirements-build-android.txt contrib/android/
+ docker build -t electrum-android-builder-img contrib/android/
Sending build context to Docker daemon  101.9kB
Step 1/51 : FROM ubuntu:20.04@sha256:86ac87f73641c920fb42cc9612d4fb57b5626b56ea2a19b894d0673fd5b4f2e9
...
Removing intermediate container e83920d3fae6
 ---> 6609b240a7d9
Step 44/51 : COPY contrib/deterministic-build/requirements-build-base.txt /opt/deterministic-build/
COPY failed: file not found in build context or excluded by .dockerignore: stat contrib/deterministic-build/requirements-build-base.txt: file does not exist
+ mkdir --parents .buildozer/.gradle
+ docker run -it --rm --name electrum-android-builder-cont --volume /tmp/test_org.electrum.electrum/app:/home/user/wspace/electrum --volume /tmp/test_org.electrum.electrum/app/.buildozer/.gradle:/home/user/.gradle --workdir /home/user/wspace/electrum electrum-android-builder-img /bin/bash -c './contrib/android/make_apk release-unsigned;
        echo "CTRL-D to continue";
  bash'
Unable to find image 'electrum-android-builder-img:latest' locally
docker: Error response from daemon: pull access denied for electrum-android-builder-img, repository does not exist or may require 'docker login': denied: requested access to the resource is denied.
...
```

which means something changed how to build this app.

Checking `git diff 4.1.5 4.2.1` indeed, the `Dockerfile` changed in the line of
the error:

```
-COPY requirements-build-android.txt /opt/deterministic-build/
+COPY contrib/deterministic-build/requirements-build-base.txt /opt/deterministic-build/
+COPY contrib/deterministic-build/requirements-build-android.txt /opt/deterministic-build/
```

the way the `Dockerfile` was used to build changed:

```
-sudo docker build \
+docker build \
     $DOCKER_BUILD_FLAGS \
     -t electrum-android-builder-img \
-    "$CONTRIB_ANDROID"
+    --file "$CONTRIB_ANDROID/Dockerfile" \
+    "$PROJECT_ROOT"
```

and ... the build instructions also slightly changed:

```
-    $ ELECBUILD_COMMIT=HEAD ELECBUILD_NOCACHE=1 ./build.sh release-unsigned
+    $ ELECBUILD_COMMIT=HEAD ELECBUILD_NOCACHE=1 ./build.sh kivy all release-unsigned
```

Time to update our {% include testScript.html %} and run it again:

```
===== Begin Results =====
appId:          org.electrum.electrum
signer:         e543d576fa0f2a33d412bca4c7d61e2301830e956e7d947e75b9052d176027d3
apkVersionName: 4.2.1.0
apkVersionCode: 34020100
verdict:        reproducible
appHash:        f7da55a86aca86080884c1864f8db383d29116d9409ed7f37179785514f1ecf0
commit:         90e5984b647eb0211524e604b6fedff08894f6fd

Diff:
Only in /tmp/fromPlay_org.electrum.electrum_34020100/META-INF: CERT.RSA
Only in /tmp/fromPlay_org.electrum.electrum_34020100/META-INF: CERT.SF
Files /tmp/fromPlay_org.electrum.electrum_34020100/META-INF/MANIFEST.MF and /tmp/fromBuild_org.electrum.electrum_34020100/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):
object 90e5984b647eb0211524e604b6fedff08894f6fd
type commit
tag 4.2.1
tagger ThomasV <thomasv@electrum.org> 1648320121 +0100

4.2.1
===== End Results =====
```

which looks good. This binary is **reproducible**.
