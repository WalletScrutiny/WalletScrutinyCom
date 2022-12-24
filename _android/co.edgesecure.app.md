---
wsId: edge
title: Edge - Bitcoin & Crypto Wallet
altTitle: 
authors:
- leo
- emanuel
users: 500000
appId: co.edgesecure.app
appCountry: 
released: 2018-03-01
updated: 2022-12-17
version: 2.28.0
stars: 3.7
ratings: 3880
reviews: 609
size: 
website: https://edge.app
repository: https://github.com/EdgeApp/edge-react-gui
issue: https://github.com/EdgeApp/edge-react-gui/issues/1748
icon: co.edgesecure.app.jpg
bugbounty: 
meta: ok
verdict: ftbfs
date: 2022-11-02
signer: 
reviewArchive:
- date: 2022-03-13
  version: 2.12.0
  appHash: 
  gitRevision: 26a46f55d9739ede4c8b778ac3ae1ce6c91995b9
  verdict: ftbfs
- date: 2019-11-10
  version: 1.10.1
  appHash: 
  gitRevision: 1707808e9efc2ab4ea3a03510ebd408811586d47
  verdict: nonverifiable
twitter: edgewallet
social:
- https://www.linkedin.com/company/edgeapp
- https://www.reddit.com/r/EdgeWallet
redirect_from:
- /edge/
- /co.edgesecure.app/
- /posts/2019/11/edge/
- /posts/co.edgesecure.app/

---

Their latest version on Play Store is 2.25.0. The last version we checked did
not match the code. Let's see how it goes now ...

Using [Emanuel's Container file](https://github.com/EdgeApp/edge-react-gui/issues/1748#issuecomment-1065934661)
updated to 2.25.0:

```
...
+ cp /home/appuser/app/edgeUpstreamAPK/res/raw/env.json ./env.json
cp: can't stat '/home/appuser/app/edgeUpstreamAPK/res/raw/env.json': No such file or directory
Error: error building at STEP "RUN set -ex;     cd edge-react-gui;     git checkout v2.25.0;     yarnpkg install --frozen-lockfile --ignore-optional --ignore-scripts;     yarnpkg prepare;     cp /home/appuser/app/edgeUpstreamAPK/res/raw/env.json ./env.json;     cd android;     ./gradlew assembleRelease": error while running runtime: exit status 1
```

ran into an error. The `env.json` configuration file that Emanuel had extracted
from the binary we are trying to test is not in the binary anymore.

After removing that part of the container file, it **fails to build from source**:
  
```
$ podman build --rm -t edge_build_apk -f scripts/test/container/co.edgesecure.app
...
> Task :bugsnag_react-native:compileReleaseKotlin
w: /home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/src/main/java/com/bugsnag/android/BugsnagReactNative.kt: (204, 48): Elvis operator (?:) always returns the left operand of non-nullable type ReadableMap

> Task :bugsnag_react-native:javaPreCompileRelease
> Task :disklet:generateReleaseBuildConfig

> Task :bugsnag_react-native:compileReleaseJavaWithJavac FAILED
/home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/src/main/java/com/bugsnag/android/BugsnagPackage.java:1: error: cannot access com.bugsnag.android
package com.bugsnag.android;
^
  /home/appuser/.gradle/caches/transforms-3/db229a6e5f4fe0ba69c000c5a66ca523/transformed/swiperefreshlayout-1.0.0-api.jar: No file descriptors available
/home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/build/generated/source/buildConfig/release/com/bugsnag/reactnative/BuildConfig.java:4: error: cannot access com.bugsnag.reactnative
package com.bugsnag.reactnative;
^
  /home/appuser/.gradle/caches/transforms-3/db229a6e5f4fe0ba69c000c5a66ca523/transformed/swiperefreshlayout-1.0.0-api.jar: No file descriptors available
2 errors

FAILURE: Build failed with an exception.
...
```

This release is **not verifiable**.
