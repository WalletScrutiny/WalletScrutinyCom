---
wsId: Trustee
title: Trustee | crypto & btc wallet
altTitle: 
authors:
- leo
- danny
- keraliss
users: 500000
appId: com.trusteewallet
appCountry: 
released: 2019-05-01
updated: 2024-11-14
version: 1.51.10
stars: 3.9
ratings: 2467
reviews: 59
website: https://trusteeglobal.com
repository: https://github.com/trustee-wallet/trusteeWallet
issue: https://github.com/trustee-wallet/trusteeWallet/issues/180
icon: com.trusteewallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: []
date: 2025-01-22
signer: 
reviewArchive:
- date: 2023-10-03
  version: 1.51.5
  appHashes: []
  gitRevision: 84b2b2e4897e57ca4a3cd4d8a89f516d5102a8fc
  verdict: ftbfs
- date: 2020-01-24
  version: 1.29.347
  appHashes: []
  gitRevision: 02efce0be192c630f747855adbd5b5f81661bf0a
  verdict: nonverifiable
- date: 2019-12-28
  version: '1.0'
  appHashes: []
  gitRevision: 1237739e1756c97af5da425627da4b910c9aa00b
  verdict: nonverifiable
twitter: Trustee_Wallet
social:
- https://www.facebook.com/Trustee.Wallet
redirect_from:
- /com.trusteewallet/
- /posts/com.trusteewallet/
developerName: BlockSoft Lab
features: 

---

## Update 2025-01-22

Version 1.51.10 is now available on Google Play as well as in their release section. This should be re-tested and is **for verification**.

### Update 2024-08-01:

**Review: Build Issue with Trustee Wallet**

During the build process for the Trustee Wallet, we encountered the following error using the Dockerfile specified in the repository:

**Error Message Encountered:**

```
gyp ERR! build error 
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack at ChildProcess.<anonymous> (/usr/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:209:23)
gyp ERR! System Linux 6.1.0-20-amd64
gyp ERR! command "/usr/bin/node" "/usr/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /trustee/src/node_modules/sha3
gyp ERR! node -v v18.20.2
gyp ERR! node-gyp -v v10.0.1
gyp ERR! not ok
info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
The command '/bin/sh -c cd ./src && yarn install --no-progress --frozen-lockfile' returned a non-zero code: 1
```

**Issue Breakdown:**

The build error stems from a failure during the `make` process for the `sha3` module when running `yarn install`. This issue prevents the successful build of the Docker image and requires resolution.

**Additional Concerns:**

The version discrepancy between the GitHub repository and the Google Play version is notable. Currently, the GitHub release is v1.51.5, while the Google Play version is v1.51.10, updated as of June 28, 2024. This significant gap suggests a "source not available" verdict for the purposes of verification.

**Verdict:**

Currently, the Trustee Wallet build is **not verifiable** due to the encountered build error and the version inconsistency between the GitHub repository and Google Play Store. Addressing these issues is crucial for ensuring proper build verification and functionality.

**Update 2024-07-25**

While the [issue we filed](https://github.com/trustee-wallet/trusteeWallet/issues/1) is still open, the repository release is still at v1.51.5. The last response on the issue is still with WalletScrutiny. Meanwhile, the Google Play version is 1.51.10 which was recently updated last June 28, 2024. The one year difference between the GitHub version and the Google Play version is enough to warrant a **source not-available** verdict.

**Update 2023-09-29**: We have not had a look in a long time. While the last
time we were invited to re-evaluate, it didn't look too good, lets see if things
got worse or better ...

On Google Play we downloaded version `1.51.6`. On GitHub though we can only find
up to version `v1.51.5` in the tags. The latest code though might simply miss a
tag as [this line](https://github.com/trustee-wallet/trusteeWallet/blob/master/android/app/build.gradle#L137C24-L137C26)
looks good.

So ... the build instructions say:

> All building steps are tested with Ubuntu 16.04

That version of Ubuntu would still be supported under the
["Expanded Security Maintenance"](https://ubuntu.com/16-04) but ... it's really
old.

> nodejs version 10.x

Installing this we get a warning: "Node.js 10.x is no longer actively supported! [...] You should migrate to a supported version of Node.js as soon as possible."

So we assume the build instructions are not up to date ...

... and node developers are really trying to dissuade us from installing this
old version by forcing us to wait first 20s and then 60s ...

```
$ podman run --rm -it ubuntu:16.04 bash
root@8b8a40242a85:/# apt update
root@8b8a40242a85:/# apt install -y curl
root@8b8a40242a85:/# curl -sL https://deb.nodesource.com/setup_10.x | bash -
root@8b8a40242a85:/# apt install -y build-essential git openjdk-8-jdk nodejs gcc g++ make
root@8b8a40242a85:/# echo "JAVA_HOME=$(which java)" | tee -a /etc/environment
root@8b8a40242a85:/# source /etc/environment
root@8b8a40242a85:/# echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p
root@8b8a40242a85:/# mkdir ~/androidsdk
root@8b8a40242a85:/# export ANDROID_HOME=~/androidsdk
root@8b8a40242a85:/# mkdir ~/androidsdk/licenses 
root@8b8a40242a85:/# echo "24333f8a63b6825ea9c5514f83c2829b004d1fee" >  ~/androidsdk/licenses/android-sdk-license
root@8b8a40242a85:/# git clone https://github.com/trustee-wallet/trusteeWallet.git
root@8b8a40242a85:/# cd ./trusteeWallet
root@8b8a40242a85:/trusteeWallet# npm install
root@8b8a40242a85:/trusteeWallet# npx jetifier
root@8b8a40242a85:/trusteeWallet# rm -f shim.js
root@8b8a40242a85:/trusteeWallet# ./node_modules/.bin/rn-nodeify --hack --install
root@8b8a40242a85:/trusteeWallet/android# cd ./android
root@8b8a40242a85:/trusteeWallet/android# ./gradlew assembleRelease
> Task :app:bundleReleaseJsAndAssets
Loading dependency graph, done.
error SyntaxError: /trusteeWallet/app/router/NewRouter.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (326:8)

  324 |                 />
  325 |             
> 326 |         </Tab.Navigator>
      |         ^
SyntaxError: /trusteeWallet/app/router/NewRouter.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (326:8)
  327 |     )

  328 | }
  329 |. Run CLI with --verbose flag for more details.
  324 |                 />
  325 |             
> 326 |         </Tab.Navigator>
      |         ^
  327 |     )
  328 | }
  329 |
    at constructor (/trusteeWallet/node_modules/@babel/parser/lib/index.js:356:19)
    at FlowParserMixin.raise (/trusteeWallet/node_modules/@babel/parser/lib/index.js:3223:19)
    at FlowParserMixin.jsxParseElementAt (/trusteeWallet/node_modules/@babel/parser/lib/index.js:6911:18)
...
```

so this might be due to the build instructions being outdated, using old tools.

But how about the[Android verifiable builds](https://github.com/trustee-wallet/trusteeWallet/tree/master#android-verifiable-builds) section?
Maybe that works better?

```
$ git clone https://github.com/trustee-wallet/trusteeWallet.git
$ cd trusteeWallet/
$ cat docker/verify_android_build.sh 
#!/usr/bin/env sh

docker build --build-arg BUILD_NUMBER=VERSION_CODE_PLACEHOLDER --build-arg COMMIT_SHA=COMMIT_SHORT_SHA_PLACEHOLDER -t android/verify -f ./docker/Dockerfile.verifyandroidbuild .
```

That looks benign but also like it could use some parameters ...

```
$ docker/verify_android_build.sh 
Sending build context to Docker daemon  38.37MB
Step 1/14 : FROM trusteewallet/androidprebuild
latest: Pulling from trusteewallet/androidprebuild
```

That's already a problem. We'd have to build `trusteewallet/androidprebuild` to
avoid testing the provider's work using the provider's own binaries ...

```
$ docker image rm trusteewallet/androidprebuild:latest
$ docker image prune 
$ docker build -t trusteewallet/androidprebuild -f ./docker/Dockerfile.androidprebuild .
```

Ok, this builds on Ubuntu 20.04, not like the build instructions above on 16.04.
Promising ...

Node still is being installed deprecated scripts:

```
================================================================================
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
================================================================================

                           SCRIPT DEPRECATION WARNING                    

  
  This script, located at https://deb.nodesource.com/setup_X, used to
  install Node.js is deprecated now and will eventually be made inactive.

  Please visit the NodeSource distributions Github and follow the
  instructions to migrate your repo.
  https://github.com/nodesource/distributions

  The NodeSource Node.js Linux distributions GitHub repository contains
  information about which versions of Node.js and which Linux distributions
  are supported and how to install it.
  https://github.com/nodesource/distributions


                          SCRIPT DEPRECATION WARNING

================================================================================
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
================================================================================

TO AVOID THIS WAIT MIGRATE THE SCRIPT
Continuing in 60 seconds (press Ctrl-C to abort) ...
```

But we get our local image from source and can continue ...

```
...
Successfully tagged trusteewallet/androidprebuild:latest
$ docker/verify_android_build.sh 
...
[4/4] Building fresh packages...
warning Error running install script for optional dependency: "/trustee/src/node_modules/sodium-native: Command failed.
Exit code: 1
Command: node-gyp-build \"node preinstall.js\" \"node postinstall.js\"
Arguments: 
Directory: /trustee/src/node_modules/sodium-native
Output:
libtool is required, but wasn't found on this system
./configure: 5: ./configure: not found
/trustee/src/node_modules/sodium-native/preinstall.js:119
    if (err) throw err
             ^

Error: ./configure exited with 127
    at ChildProcess.<anonymous> (/trustee/src/node_modules/sodium-native/preinstall.js:149:25)
    at ChildProcess.emit (node:events:513:28)
    at Process.ChildProcess._handle.onexit (node:internal/child_process:293:12)"
info This module is OPTIONAL, you can safely ignore this error
...
FAILURE: Build failed with an exception.

* Where:
Build file '/trustee/src/android/app/build.gradle' line: 136

* What went wrong:
A problem occurred evaluating project ':app'.
> Could not get unknown property 'VERSION_CODE_PLACEHOLDER' for DefaultConfig_Decorated{name=main, dimension=null, minSdkVersion=DefaultApiVersion{mApiLevel=21, mCodename='null'}, targetSdkVersion=DefaultApiVersion{mApiLevel=31, mCodename='null'}, renderscriptTargetApi=null, renderscriptSupportModeEnabled=null, renderscriptSupportModeBlasEnabled=null, renderscriptNdkModeEnabled=null, versionCode=null, versionName=null, applicationId=com.trusteewallet, testApplicationId=null, testInstrumentationRunner=null, testInstrumentationRunnerArguments={}, testHandleProfiling=null, testFunctionalTest=null, signingConfig=null, resConfig=[], buildConfigFields={}, resValues={}, proguardFiles=[], consumerProguardFiles=[], manifestPlaceholders={}, wearAppUnbundled=null} of type com.android.build.gradle.internal.dsl.DefaultConfig.
```

So as mentioned above, the lacking arguments are indeed a problem. Let's try the
command with only a commit sha:

```
$ cat docker/verify_android_build.sh 
#!/usr/bin/env sh

docker build --build-arg BUILD_NUMBER=VERSION_CODE_PLACEHOLDER --build-arg COMMIT_SHA=COMMIT_SHORT_SHA_PLACEHOLDER -t android/verify -f ./docker/Dockerfile.verifyandroidbuild .
$ git log -n 1
commit 721e0c7749dfdc9534f04287b3f09b3a5f61931a (HEAD -> master, origin/master, origin/HEAD)
...
$ docker build --build-arg COMMIT_SHA=721e0c7749dfdc9534f04287b3f09b3a5f61931a -t android/verify -f ./docker/Dockerfile.verifyandroidbuild .
...
SyntaxError: /trustee/src/app/router/NewRouter.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (326:8)
...
BUILD FAILED in 6m 35s
```

So ... we got the error from before again and conclude, the current version is
**not verifiable**.

## Similar App Note 2023-08-23

This app is from the same developer of {% include walletLink.html wallet='android/com.trusteeplus' verdict='true' %}. 

We verified that both apps are linked from their homepage.

## Analysis 2019-12-28

They [asked us to re-evaluate](https://github.com/trustee-wallet/trusteeWallet/issues/1#issuecomment-577612039),
so ... here we go:

On Google Play the version is `1.29.347` yet on their git repository's full
history we find no such version:

```
$ git log
commit b599fb71548ccc40f9293b5557c6cee8377a2b2e (HEAD -> master, origin/master, origin/HEAD)
Author: Roman Hrusha <rhrusha@gmail.com>
Date:   Thu Jan 23 11:44:09 2020 +0200

    v1.29.362

commit a9e88887dec507ee5354c5d9df7f565c40966149
Author: Roman Hrusha <rhrusha@gmail.com>
Date:   Sat Jan 11 03:11:06 2020 +0200

    v1.29

commit 5e3541825f80dd6cf7031647ddcf21924ac79dac (tag: v1.2)
Author: Roman Hrusha <rhrusha@gmail.com>
Date:   Wed Dec 18 16:48:23 2019 +0200

    v1.2

commit 7700db0616649050a7a95220f1f5eb51392f8a04
Author: ksu <ksu.zhytomirsky@gmail.com>
Date:   Thu Sep 19 14:28:09 2019 +0300

    v1.0
```

Anyway, lets see if the build instructions now get us further than before:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">
root@33be2e484ec3:/mnt/android# apt update
root@33be2e484ec3:/mnt/android# apt install python make gcc g++ -y
root@33be2e484ec3:/mnt/android# npm install
...
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> <font color="#75507B">deprecated</font> core-js@2.6.11: core-js@&lt;3 is no longer maintained and not recommended for usage due to the number of issues. Please, upgrade your dependencies to the actual version of core-js@3.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> <font color="#75507B">deprecated</font> core-js@1.2.7: core-js@&lt;3 is no longer maintained and not recommended for usage due to the number of issues. Please, upgrade your dependencies to the actual version of core-js@3.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> <font color="#75507B">deprecated</font> fs-promise@2.0.3: Use mz or fs-extra^3.0 with Promise Support
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> <font color="#75507B">deprecated</font> tar.gz@1.0.7: ⚠️  WARNING ⚠️ tar.gz module has been deprecated and your application is vulnerable. Please use tar module instead: https://npmjs.com/tar
...
root@33be2e484ec3:/mnt/android# python ./__hacks__/makeX.py
root@33be2e484ec3:/mnt/android# rm -f shim.js
root@33be2e484ec3:/mnt/android# ./node_modules/.bin/rn-nodeify --hack --install
root@33be2e484ec3:/mnt/android# cd ./android
root@33be2e484ec3:/mnt/android# yes | /opt/android/tools/bin/sdkmanager "build-tools;28.0.3"
root@33be2e484ec3:/mnt/android# ./gradlew assembleRelease
...
<font color="#4E9A06"><b>BUILD SUCCESSFUL</b></font> in 13m 1s
903 actionable tasks: 903 executed
root@33be2e484ec3:/mnt/android# ll app/build/outputs/apk/release/
total 48476
drwxr-xr-x 2 root root     4096 Jan 24 11:45 <font color="#3465A4"><b>.</b></font>/
drwxr-xr-x 3 root root     4096 Jan 24 11:45 <font color="#3465A4"><b>..</b></font>/
-rw-r--r-- 1 root root 49621818 Jan 24 11:45 app-release.apk
-rw-r--r-- 1 root root      241 Jan 24 11:45 output.json
root@33be2e484ec3:/mnt/android# exit
$ diff --brief --recursive from*
Files fromBuild/AndroidManifest.xml and fromGoogle/AndroidManifest.xml differ
Files fromBuild/apktool.yml and fromGoogle/apktool.yml differ
Files fromBuild/assets/crashlytics-build.properties and fromGoogle/assets/crashlytics-build.properties differ
Files fromBuild/assets/index.android.bundle and fromGoogle/assets/index.android.bundle differ
Only in fromBuild: lib
Files fromBuild/original/AndroidManifest.xml and fromGoogle/original/AndroidManifest.xml differ
Files fromBuild/original/META-INF/CERT.RSA and fromGoogle/original/META-INF/CERT.RSA differ
Files fromBuild/original/META-INF/CERT.SF and fromGoogle/original/META-INF/CERT.SF differ
Files fromBuild/original/META-INF/MANIFEST.MF and fromGoogle/original/META-INF/MANIFEST.MF differ
Files fromBuild/res/drawable/abc_btn_check_material.xml and fromGoogle/res/drawable/abc_btn_check_material.xml differ
Files fromBuild/res/drawable/abc_btn_radio_material.xml and fromGoogle/res/drawable/abc_btn_radio_material.xml differ
Files fromBuild/res/drawable/abc_edit_text_material.xml and fromGoogle/res/drawable/abc_edit_text_material.xml differ
Files fromBuild/res/drawable/abc_item_background_holo_dark.xml and fromGoogle/res/drawable/abc_item_background_holo_dark.xml differ
Files fromBuild/res/drawable/abc_item_background_holo_light.xml and fromGoogle/res/drawable/abc_item_background_holo_light.xml differ
Files fromBuild/res/drawable/abc_list_selector_background_transition_holo_dark.xml and fromGoogle/res/drawable/abc_list_selector_background_transition_holo_dark.xml differ
Files fromBuild/res/drawable/abc_list_selector_background_transition_holo_light.xml and fromGoogle/res/drawable/abc_list_selector_background_transition_holo_light.xml differ
Files fromBuild/res/drawable/abc_list_selector_holo_dark.xml and fromGoogle/res/drawable/abc_list_selector_holo_dark.xml differ
Files fromBuild/res/drawable/abc_list_selector_holo_light.xml and fromGoogle/res/drawable/abc_list_selector_holo_light.xml differ
Files fromBuild/res/drawable/abc_ratingbar_indicator_material.xml and fromGoogle/res/drawable/abc_ratingbar_indicator_material.xml differ
Files fromBuild/res/drawable/abc_ratingbar_material.xml and fromGoogle/res/drawable/abc_ratingbar_material.xml differ
Files fromBuild/res/drawable/abc_ratingbar_small_material.xml and fromGoogle/res/drawable/abc_ratingbar_small_material.xml differ
Files fromBuild/res/drawable/abc_seekbar_thumb_material.xml and fromGoogle/res/drawable/abc_seekbar_thumb_material.xml differ
Files fromBuild/res/drawable/abc_seekbar_track_material.xml and fromGoogle/res/drawable/abc_seekbar_track_material.xml differ
Files fromBuild/res/drawable/abc_spinner_textfield_background_material.xml and fromGoogle/res/drawable/abc_spinner_textfield_background_material.xml differ
Files fromBuild/res/drawable/abc_switch_thumb_material.xml and fromGoogle/res/drawable/abc_switch_thumb_material.xml differ
Files fromBuild/res/drawable/abc_tab_indicator_material.xml and fromGoogle/res/drawable/abc_tab_indicator_material.xml differ
Files fromBuild/res/drawable/abc_textfield_search_material.xml and fromGoogle/res/drawable/abc_textfield_search_material.xml differ
Files fromBuild/res/drawable/common_google_signin_btn_icon_dark_normal.xml and fromGoogle/res/drawable/common_google_signin_btn_icon_dark_normal.xml differ
Files fromBuild/res/drawable/common_google_signin_btn_icon_disabled.xml and fromGoogle/res/drawable/common_google_signin_btn_icon_disabled.xml differ
Files fromBuild/res/drawable/common_google_signin_btn_icon_light_normal.xml and fromGoogle/res/drawable/common_google_signin_btn_icon_light_normal.xml differ
Files fromBuild/res/drawable/common_google_signin_btn_text_dark_normal.xml and fromGoogle/res/drawable/common_google_signin_btn_text_dark_normal.xml differ
Files fromBuild/res/drawable/common_google_signin_btn_text_disabled.xml and fromGoogle/res/drawable/common_google_signin_btn_text_disabled.xml differ
Files fromBuild/res/drawable/common_google_signin_btn_text_light_normal.xml and fromGoogle/res/drawable/common_google_signin_btn_text_light_normal.xml differ
Files fromBuild/res/drawable/notification_bg_low.xml and fromGoogle/res/drawable/notification_bg_low.xml differ
Files fromBuild/res/drawable/notification_bg.xml and fromGoogle/res/drawable/notification_bg.xml differ
Files fromBuild/res/drawable/notification_tile_bg.xml and fromGoogle/res/drawable/notification_tile_bg.xml differ
Only in fromBuild/res: drawable-hdpi
Only in fromBuild/res: drawable-ldrtl-hdpi-v17
Only in fromBuild/res: drawable-ldrtl-mdpi-v17
Only in fromBuild/res: drawable-ldrtl-xhdpi-v17
Only in fromBuild/res: drawable-ldrtl-xxhdpi-v17
Only in fromBuild/res: drawable-ldrtl-xxxhdpi-v17
Only in fromBuild/res/drawable-mdpi: abc_ab_share_pack_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_btn_check_to_on_mtrl_000.png
Only in fromBuild/res/drawable-mdpi: abc_btn_check_to_on_mtrl_015.png
Only in fromBuild/res/drawable-mdpi: abc_btn_radio_to_on_mtrl_000.png
Only in fromBuild/res/drawable-mdpi: abc_btn_radio_to_on_mtrl_015.png
Only in fromBuild/res/drawable-mdpi: abc_btn_switch_to_on_mtrl_00001.9.png
Only in fromBuild/res/drawable-mdpi: abc_btn_switch_to_on_mtrl_00012.9.png
Only in fromBuild/res/drawable-mdpi: abc_cab_background_top_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_ic_commit_search_api_mtrl_alpha.png
Only in fromBuild/res/drawable-mdpi: abc_ic_menu_copy_mtrl_am_alpha.png
Only in fromBuild/res/drawable-mdpi: abc_ic_menu_cut_mtrl_alpha.png
Only in fromBuild/res/drawable-mdpi: abc_ic_menu_paste_mtrl_am_alpha.png
Only in fromBuild/res/drawable-mdpi: abc_ic_menu_selectall_mtrl_alpha.png
Only in fromBuild/res/drawable-mdpi: abc_ic_menu_share_mtrl_alpha.png
Only in fromBuild/res/drawable-mdpi: abc_ic_star_black_16dp.png
Only in fromBuild/res/drawable-mdpi: abc_ic_star_black_36dp.png
Only in fromBuild/res/drawable-mdpi: abc_ic_star_black_48dp.png
Only in fromBuild/res/drawable-mdpi: abc_ic_star_half_black_16dp.png
Only in fromBuild/res/drawable-mdpi: abc_ic_star_half_black_36dp.png
Only in fromBuild/res/drawable-mdpi: abc_ic_star_half_black_48dp.png
Only in fromBuild/res/drawable-mdpi: abc_list_divider_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_list_focused_holo.9.png
Only in fromBuild/res/drawable-mdpi: abc_list_longpressed_holo.9.png
Only in fromBuild/res/drawable-mdpi: abc_list_pressed_holo_dark.9.png
Only in fromBuild/res/drawable-mdpi: abc_list_pressed_holo_light.9.png
Only in fromBuild/res/drawable-mdpi: abc_list_selector_disabled_holo_dark.9.png
Only in fromBuild/res/drawable-mdpi: abc_list_selector_disabled_holo_light.9.png
Only in fromBuild/res/drawable-mdpi: abc_menu_hardkey_panel_mtrl_mult.9.png
Only in fromBuild/res/drawable-mdpi: abc_popup_background_mtrl_mult.9.png
Only in fromBuild/res/drawable-mdpi: abc_scrubber_control_off_mtrl_alpha.png
Only in fromBuild/res/drawable-mdpi: abc_scrubber_control_to_pressed_mtrl_000.png
Only in fromBuild/res/drawable-mdpi: abc_scrubber_control_to_pressed_mtrl_005.png
Only in fromBuild/res/drawable-mdpi: abc_scrubber_primary_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_scrubber_track_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_spinner_mtrl_am_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_switch_track_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_tab_indicator_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_textfield_activated_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_textfield_default_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_textfield_search_activated_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_textfield_search_default_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi: abc_text_select_handle_left_mtrl_dark.png
Only in fromBuild/res/drawable-mdpi: abc_text_select_handle_left_mtrl_light.png
Only in fromBuild/res/drawable-mdpi: abc_text_select_handle_middle_mtrl_dark.png
Only in fromBuild/res/drawable-mdpi: abc_text_select_handle_middle_mtrl_light.png
Only in fromBuild/res/drawable-mdpi: abc_text_select_handle_right_mtrl_dark.png
Only in fromBuild/res/drawable-mdpi: abc_text_select_handle_right_mtrl_light.png
Only in fromBuild/res/drawable-mdpi: cio_card_io_logo.png
Only in fromBuild/res/drawable-mdpi: cio_ic_amex.png
Only in fromBuild/res/drawable-mdpi: cio_ic_discover.png
Only in fromBuild/res/drawable-mdpi: cio_ic_jcb.png
Only in fromBuild/res/drawable-mdpi: cio_ic_mastercard.png
Only in fromBuild/res/drawable-mdpi: cio_ic_paypal_monogram.png
Only in fromBuild/res/drawable-mdpi: cio_ic_visa.png
Only in fromBuild/res/drawable-mdpi: cio_paypal_logo.png
Only in fromBuild/res/drawable-mdpi: common_google_signin_btn_icon_dark_normal_background.9.png
Only in fromBuild/res/drawable-mdpi: common_google_signin_btn_icon_light_normal_background.9.png
Only in fromBuild/res/drawable-mdpi: common_google_signin_btn_text_dark_normal_background.9.png
Only in fromBuild/res/drawable-mdpi: common_google_signin_btn_text_light_normal_background.9.png
Only in fromBuild/res/drawable-mdpi: googleg_disabled_color_18.png
Only in fromBuild/res/drawable-mdpi: googleg_standard_color_18.png
Only in fromBuild/res/drawable-mdpi: node_modules_reactnavigationstack_lib_module_views_assets_backicon.png
Only in fromBuild/res/drawable-mdpi: notification_bg_low_normal.9.png
Only in fromBuild/res/drawable-mdpi: notification_bg_low_pressed.9.png
Only in fromBuild/res/drawable-mdpi: notification_bg_normal.9.png
Only in fromBuild/res/drawable-mdpi: notification_bg_normal_pressed.9.png
Only in fromBuild/res/drawable-mdpi: notify_panel_notification_icon_bg.png
Files fromBuild/res/drawable-v21/abc_edit_text_material.xml and fromGoogle/res/drawable-v21/abc_edit_text_material.xml differ
Files fromBuild/res/drawable-v21/abc_ratingbar_indicator_material.xml and fromGoogle/res/drawable-v21/abc_ratingbar_indicator_material.xml differ
Files fromBuild/res/drawable-v21/abc_ratingbar_material.xml and fromGoogle/res/drawable-v21/abc_ratingbar_material.xml differ
Files fromBuild/res/drawable-v21/abc_ratingbar_small_material.xml and fromGoogle/res/drawable-v21/abc_ratingbar_small_material.xml differ
Only in fromBuild/res: drawable-xhdpi
Only in fromBuild/res: drawable-xxhdpi
Only in fromBuild/res: drawable-xxxhdpi
Files fromBuild/res/values/drawables.xml and fromGoogle/res/values/drawables.xml differ
Files fromBuild/res/values/public.xml and fromGoogle/res/values/public.xml differ
Files fromBuild/res/values/strings.xml and fromGoogle/res/values/strings.xml differ
Files fromBuild/res/values/styles.xml and fromGoogle/res/values/styles.xml differ
Only in fromBuild/res: values-af
Only in fromBuild/res: values-am
Only in fromBuild/res: values-ar
Only in fromBuild/res: values-as
Only in fromBuild/res: values-az
Only in fromBuild/res: values-be
Only in fromBuild/res: values-bg
Only in fromBuild/res: values-bn
Only in fromBuild/res: values-bs
Only in fromBuild/res: values-b+sr+Latn
Only in fromBuild/res: values-ca
Only in fromBuild/res: values-cs
Only in fromBuild/res: values-da
Only in fromBuild/res: values-de
Only in fromBuild/res: values-el
Only in fromBuild/res: values-en-rAU
Only in fromBuild/res: values-en-rCA
Only in fromBuild/res: values-en-rGB
Only in fromBuild/res: values-en-rIN
Only in fromBuild/res: values-en-rXC
Only in fromBuild/res: values-es
Only in fromBuild/res: values-es-rUS
Only in fromBuild/res: values-et
Only in fromBuild/res: values-eu
Only in fromBuild/res: values-fa
Only in fromBuild/res: values-fi
Only in fromBuild/res: values-fr
Only in fromBuild/res: values-fr-rCA
Only in fromBuild/res: values-gl
Only in fromBuild/res: values-gu
Only in fromBuild/res: values-hdpi
Only in fromBuild/res: values-hi
Only in fromBuild/res: values-hr
Only in fromBuild/res: values-hu
Only in fromBuild/res: values-hy
Only in fromBuild/res: values-in
Only in fromBuild/res: values-is
Only in fromBuild/res: values-it
Only in fromBuild/res: values-iw
Only in fromBuild/res: values-ja
Only in fromBuild/res: values-ka
Only in fromBuild/res: values-kk
Only in fromBuild/res: values-km
Only in fromBuild/res: values-kn
Only in fromBuild/res: values-ko
Only in fromBuild/res: values-ky
Only in fromBuild/res: values-lo
Only in fromBuild/res: values-lt
Only in fromBuild/res: values-lv
Only in fromBuild/res: values-mk
Only in fromBuild/res: values-ml
Only in fromBuild/res: values-mn
Only in fromBuild/res: values-mr
Only in fromBuild/res: values-ms
Only in fromBuild/res: values-my
Only in fromBuild/res: values-nb
Only in fromBuild/res: values-ne
Only in fromBuild/res: values-nl
Only in fromBuild/res: values-or
Only in fromBuild/res: values-pa
Only in fromBuild/res: values-pl
Only in fromBuild/res: values-pt
Only in fromBuild/res: values-pt-rBR
Only in fromBuild/res: values-pt-rPT
Only in fromBuild/res: values-ro
Only in fromBuild/res: values-ru
Only in fromBuild/res: values-si
Only in fromBuild/res: values-sk
Only in fromBuild/res: values-sl
Only in fromBuild/res: values-sq
Only in fromBuild/res: values-sr
Only in fromBuild/res: values-sv
Only in fromBuild/res: values-sw
Only in fromBuild/res: values-ta
Only in fromBuild/res: values-te
Only in fromBuild/res: values-th
Only in fromBuild/res: values-tl
Only in fromBuild/res: values-tr
Only in fromBuild/res: values-uk
Only in fromBuild/res: values-ur
Only in fromBuild/res: values-uz
Files fromBuild/res/values-v17/styles.xml and fromGoogle/res/values-v17/styles.xml differ
Only in fromBuild/res: values-vi
Only in fromBuild/res: values-zh
Only in fromBuild/res: values-zh-rCN
Only in fromBuild/res: values-zh-rHK
Only in fromBuild/res: values-zh-rTW
Only in fromBuild/res: values-zu
Only in fromGoogle/res/xml: splits0.xml
Files fromBuild/smali/com/adobe/xmp/impl/XMPSchemaRegistryImpl.smali and fromGoogle/smali/com/adobe/xmp/impl/XMPSchemaRegistryImpl.smali differ
Only in fromBuild/smali/com/swmansion/reanimated: MapUtils.smali
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/AlwaysNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/AlwaysNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/BezierNode$CubicBezierInterpolator.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/BezierNode$CubicBezierInterpolator.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/BezierNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/BezierNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/ClockNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/ClockNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/ClockOpNode$ClockStartNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/ClockOpNode$ClockStartNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/ClockOpNode$ClockStopNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/ClockOpNode$ClockStopNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/ClockOpNode$ClockTestNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/ClockOpNode$ClockTestNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/ClockOpNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/ClockOpNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/CondNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/CondNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/DebugNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/DebugNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$22.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$22.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$23.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$23.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$24.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$24.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$25.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$25.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$26.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode$26.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/OperatorNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/ParamNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/ParamNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/nodes/SetNode.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/nodes/SetNode.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/NodesManager.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/NodesManager.smali differ
Only in fromBuild/smali_classes2/com/swmansion/reanimated: ReanimatedModule$12.smali
Files fromBuild/smali_classes2/com/swmansion/reanimated/ReanimatedModule.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/ReanimatedModule.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/transitions/ChangeTransition.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/transitions/ChangeTransition.smali differ
Files fromBuild/smali_classes2/com/swmansion/reanimated/transitions/TransitionUtils.smali and fromGoogle/smali_classes2/com/swmansion/reanimated/transitions/TransitionUtils.smali differ
Files fromBuild/smali_classes2/com/trusteewallet/BuildConfig.smali and fromGoogle/smali_classes2/com/trusteewallet/BuildConfig.smali differ
</pre></div></div>

No surprise to get a diff here given the version is different. We remain with
our verdict: **not verifiable**.
