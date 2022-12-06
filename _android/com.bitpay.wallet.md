---
wsId: bitpaywallet
title: BitPay - Crypto Card & Wallet
altTitle: 
authors:
- leo
- danny
users: 1000000
appId: com.bitpay.wallet
appCountry: 
released: 2016-10-01
updated: 2022-10-28
version: 14.6.6
stars: 4.3
ratings: 9809
reviews: 1982
size: 
website: https://bitpay.com
repository: https://github.com/bitpay/wallet
issue: https://github.com/bitpay/wallet/issues/12065
icon: com.bitpay.wallet.png
bugbounty: >-
  https://support.bitpay.com/hc/en-us/articles/204229369-Does-BitPay-have-a-bug-bounty-program-
meta: ok
verdict: nosource
date: 2022-11-02
signer: 
reviewArchive:
- date: 2019-11-29
  version: 
  appHash: 
  gitRevision: 8a474ddd867e50ed46404ed9d81f2a893bbf6619
  verdict: ftbfs
twitter: BitPay
social:
- https://www.linkedin.com/company/bitpay-inc-
- https://www.facebook.com/BitPayOfficial
redirect_from:
- /bitpay/
- /com.bitpay.wallet/
- /posts/2019/11/bitpay/
- /posts/com.bitpay.wallet/

---

**Update 2022-11-02**: The [two](https://github.com/bitpay/wallet/issues/11748)
[issues](https://github.com/bitpay/wallet/issues/12046) about not being able to
build this product did not get any attention from the provider but what's sadly
even worse: The version `14.7.4` has no published source code. This product is
**not verifiable**.

## Updated Review

[Emanuel](/authors/emanuel) tried to build the version: 12.6.4 and check the build's reproducibility or if not, see the diff. 

Containerfile used:

```
FROM ubuntu:rolling

RUN set -ex; \
    mkdir -p /usr/share/man/man1/; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes -o APT::Install-Suggests=false --no-install-recommends \
        npm \
        git \
        wget \
        unzip \
        gradle \
        python2 \
        make \
        g++ \        
        openjdk-8-jdk ; \
    rm -rf /var/lib/apt/lists/*; \
    useradd -ms /bin/bash appuser;

USER appuser

ENV ANDROID_SDK_ROOT="/home/appuser/app/sdk" \
    ANDROID_HOME="/home/appuser/app/sdk" \
    NODE_ENV="development"

RUN set -ex; \
    mkdir -p "/home/appuser/app/sdk/licenses" "/home/appuser/app/bitpay/"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/app/sdk/licenses/android-sdk-license"; \
    cd /home/appuser/app/bitpay/; \
    wget https://github.com/bitpay/wallet/archive/refs/tags/v12.6.4.zip; \
    unzip v12.6.4.zip; \
    git clone https://github.com/bitpay/wallet/; \
    cd /home/appuser/app/bitpay/wallet-12.6.4;
```

Compiled with:

`podman build --pull --rm -t bitpay_build_apk_new -f Containerfile`

Run with:

`podman run --rm --name bitpay_build_apk -ti bitpay_build_apk`

in container running npm install or npm ci or npm audit fix fails with the error:

```
npm ERR! ../src/create_string.cpp:17:37: error: no matching function for call to 'v8::String::Utf8Value::Utf8Value(v8::Local<v8::Value>&)'
npm ERR!    17 |   v8::String::Utf8Value string(value);
npm ERR!       |                                     ^
npm ERR! In file included from /home/appuser/.node-gyp/12.21.0/include/node/node.h:67,
npm ERR!                  from ../../nan/nan.h:56,
npm ERR!                  from ../src/create_string.cpp:1:
npm ERR! /home/appuser/.node-gyp/12.21.0/include/node/v8.h:3135:5: note: candidate: 'v8::String::Utf8Value::Utf8Value(v8::Isolate*, v8::Local<v8::Value>)'
npm ERR!  3135 |     Utf8Value(Isolate* isolate, Local<v8::Value> obj);
npm ERR!       |     ^~~~~~~~~
npm ERR! /home/appuser/.node-gyp/12.21.0/include/node/v8.h:3135:5: note:   candidate expects 2 arguments, 1 provided
npm ERR! make: *** [binding.target.mk:129: Release/obj.target/binding/src/create_string.o] Error 1
npm ERR! gyp ERR! build error 
npm ERR! gyp ERR! stack Error: `make` failed with exit code: 2
npm ERR! gyp ERR! stack     at ChildProcess.onExit (/home/appuser/app/bitpay/wallet-12.6.4/node_modules/node-gyp/lib/build.js:262:23)
npm ERR! gyp ERR! stack     at ChildProcess.emit (events.js:314:20)
npm ERR! gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:276:12)
npm ERR! gyp ERR! System Linux 5.12.15-300.fc34.x86_64
npm ERR! gyp ERR! command "/usr/bin/node" "/home/appuser/app/bitpay/wallet-12.6.4/node_modules/node-gyp/bin/node-gyp.js" "rebuild" "--verbose" "--libsass_ext=" "--libsass_cflags=" "--libsass_ldflags=" "--libsass_library="
npm ERR! gyp ERR! cwd /home/appuser/app/bitpay/wallet-12.6.4/node_modules/node-sass
npm ERR! gyp ERR! node -v v12.21.0
npm ERR! gyp ERR! node-gyp -v v3.8.0
npm ERR! gyp ERR! not ok 
npm ERR! Build failed with error code: 1
```

This app has **failed to build.** [Link to the Github thread.](https://github.com/bitpay/wallet/issues/11748)

Old Review 2019-11-29
---
BitPay – Secure Bitcoin Wallet
links to its source code on their Google Play app description.

Bitpay is the first wallet here that uses [Angular](https://angular.io/) and we
are not most familiar with it. Our standard being "easily reproducible" means it
is on the wallet provider to also provide clear instructions on how to build the
app and the most straight forward way to well define the environment would
be to explain it in code, using a [Docker](https://www.docker.com/) containers
for example.

Bitpay does not advertise reproducibility for their builds and neither describes
well how to build the app at all and so we are stuck after running `npm install`
with this error message:


```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! secp256k1@1.1.5 install: `node-gyp rebuild`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the secp256k1@1.1.5 install script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/name/.npm/_logs/2019-11-09T21_53_17_873Z-debug.log
[ERROR] An error occurred while running subprocess cordova.

        cordova platform add android --save exited with exit code 1.

        Re-running this command with the --verbose flag may provide more information.
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! copay@7.1.1 prepare:copay: `npm run clean && npm run apply:copay && ionic cordova platform add ios; ionic cordova platform add android && npm run fix:fcm`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the copay@7.1.1 prepare:copay script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/name/.npm/_logs/2019-11-09T21_53_17_974Z-debug.log
```

which as it turns out,
[others are struggling with, too](https://github.com/bitpay/copay/issues/9037)
without much help from the provider, who closed the issue without helping.

At this point we realize, the version on Google Play, `7.1.7` is nowhere to be
found in their git repository:

```
$ git log --grep="7.1.7"
$ git tag | grep "7.1.7"
$
```

Therefore for now our verdict is that Copay **cannot be easily verified**.

We did give compilation another try using a Cordova Docker we found
[here](https://www.yoprogramo.com/2019/03/24/cordova-android-con-docker/).
Generally we would love to see projects share Dockerfiles with which their build
instructions just worked but for now, here is what we tried:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ docker pull beevelop/cordova:latest
me@home:~/StudioProjects/copay$ docker run --name=cordova -v /home/me/StudioProjects/copay:/mnt -it beevelop/cordova bash
root@3eae2071ceaf:/tmp# cd /mnt/
root@3eae2071ceaf:/mnt# npm install

&gt; secp256k1@1.1.5 install /mnt/node_modules/secp256k1
&gt; node-gyp rebuild

<span style="background-color:#2E3436"><font color="#D3D7CF">gyp</font></span> <span style="background-color:#2E3436"><font color="#CC0000">ERR!</font></span> <font color="#75507B">configure error</font>
<span style="background-color:#2E3436"><font color="#D3D7CF">gyp</font></span> <span style="background-color:#2E3436"><font color="#CC0000">ERR!</font></span> <font color="#75507B">stack</font> Error: Can&apos;t find Python executable &quot;python&quot;, you can set the PYTHON env variable.
...
root@3eae2071ceaf:/mnt# apt update ; apt install python -y
root@3eae2071ceaf:/mnt# npm install

&gt; secp256k1@1.1.5 install /mnt/node_modules/secp256k1
&gt; node-gyp rebuild

<span style="background-color:#2E3436"><font color="#D3D7CF">gyp</font></span> <span style="background-color:#2E3436"><font color="#CC0000">ERR!</font></span> <font color="#75507B">build error</font>
<span style="background-color:#2E3436"><font color="#D3D7CF">gyp</font></span> <span style="background-color:#2E3436"><font color="#CC0000">ERR!</font></span> <font color="#75507B">stack</font> Error: not found: make
...
root@3eae2071ceaf:/mnt# apt install make
root@3eae2071ceaf:/mnt# npm install

&gt; secp256k1@1.1.5 install /mnt/node_modules/secp256k1
&gt; node-gyp rebuild

make: Entering directory &apos;/mnt/node_modules/secp256k1/build&apos;
  CXX(target) Release/obj.target/secp256k1/functions.o
make: g++: Command not found
...
root@3eae2071ceaf:/mnt# apt install g++
root@3eae2071ceaf:/mnt# npm install
...
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> <font color="#75507B">lifecycle</font> copay@8.0.4~postinstall: cannot run in wd copay@8.0.4 npm run env:dev &amp;&amp; npm run prompt (wd=/mnt)
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> @angular-devkit/build-webpack@0.12.4 requires a peer of webpack@^4.6.0 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> @ngtools/webpack@7.2.4 requires a peer of webpack@^4.0.0 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> @zxing/ngx-scanner@1.2.1 requires a peer of rxjs@^6.2.0 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> awesome-typescript-loader@5.2.1 requires a peer of typescript@^2.7 || ^3 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> circular-dependency-plugin@5.0.2 requires a peer of webpack@&gt;=4.0.1 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> mini-css-extract-plugin@0.8.0 requires a peer of webpack@^4.4.0 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> ngx-barcode@0.2.4 requires a peer of @angular/core@^4.0.0 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> terser-webpack-plugin@1.2.1 requires a peer of webpack@^4.0.0 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> webpack-dev-middleware@3.4.0 requires a peer of webpack@^4.0.0 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> webpack-dev-server@3.1.14 requires a peer of webpack@^4.0.0 but none is installed. You must install peer dependencies yourself.
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> <font color="#75507B">optional</font> SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.9 (node_modules/fsevents):
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#C4A000"><font color="#2E3436">WARN</font></span> <font color="#75507B">notsup</font> SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.9: wanted {&quot;os&quot;:&quot;darwin&quot;,&quot;arch&quot;:&quot;any&quot;} (current: {&quot;os&quot;:&quot;linux&quot;,&quot;arch&quot;:&quot;x64&quot;})

added 3 packages from 10 contributors and audited 76060 packages in 18.811s
found <font color="#EF2929">17</font> vulnerabilities (7 <b>low</b>, 1 <font color="#FCE94F">moderate</font>, 9 <font color="#EF2929">high</font>)
  run `npm audit fix` to fix them, or `npm audit` for details
root@3eae2071ceaf:/mnt# npm run clean-all
root@3eae2071ceaf:/mnt# npm install
root@3eae2071ceaf:/mnt# npm run apply:copay
root@3eae2071ceaf:/mnt# npm run prepare:copay
root@3eae2071ceaf:/mnt# npm run final:android
...
Checking the license for package Android SDK Platform 27 in /opt/android/licenses
Warning: License for package Android SDK Platform 27 not accepted.

FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':CordovaLib'.
> You have not accepted the license agreements of the following SDK components:
  [Android SDK Platform 27].
root@3eae2071ceaf:/mnt# $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-27"
root@3eae2071ceaf:/mnt# npm run final:android
...
45 actionable tasks: 2 executed, 43 up-to-date
Built the following apk(s):
	/mnt/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk

> copay@8.0.4 sign:android /mnt
> rm -f platforms/android/app/build/outputs/apk/release/android-release-signed-aligned.apk; jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../copay.keystore -signedjar platforms/android/app/build/outputs/apk/release/android-release-signed.apk platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk  copay_play && $ANDROID_HOME/build-tools/28.0.3/zipalign -v 4 platforms/android/app/build/outputs/apk/release/android-release-signed.apk platforms/android/app/build/outputs/apk/release/android-release-signed-aligned.apk

Enter Passphrase for keystore:
jarsigner: you must enter key password
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#2E3436"><font color="#CC0000">ERR!</font></span> <font color="#75507B">code</font> ELIFECYCLE
<span style="background-color:#2E3436"><font color="#D3D7CF">npm</font></span> <span style="background-color:#2E3436"><font color="#CC0000">ERR!</font></span> <font color="#75507B">errno</font> 1
</pre>
</div>
</div>

Although it looks bad, here we actually have what we wanted:
`platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`

We are not surprised to find this apk to massively differ from the one on Google
Play as we were not building the (not published) correct version.

At this point we found there is a relevant commit:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ git branch -r | grep &quot;7.1&quot;
  origin/v<font color="#CC0000"><b>7.1</b></font>
$ git checkout v7.1
Switched to branch &apos;v7.1&apos;
Your branch is up to date with &apos;origin/v7.1&apos;.
$ git log --grep=&quot;7.1.7&quot;
<font color="#C4A000">commit 84acad445ad76e2572869d9c7bcd1eaf10764aa1 (</font><font color="#06989A"><b>HEAD -&gt; </b></font><font color="#4E9A06"><b>v7.1</b></font><font color="#C4A000">, </font><font color="#CC0000"><b>origin/v7.1</b></font><font color="#C4A000">)</font>
Merge: be5809a48 685dbbb6d
Author: Matias Alejo Garcia &lt;ematiu@gmail.com&gt;
Date:   Thu Nov 14 16:45:11 2019 -0300

    Merge pull request #10333 from cmgustavo/bug/plugin-fcm-02

    Bump app v7.1.7 - Fix cordova-plugin-fcm

<font color="#C4A000">commit 685dbbb6d52f5f7db3b84c8e2fc5271b54d6e201</font>
Author: Gustavo Maximiliano Cortez &lt;cmgustavo83@gmail.com&gt;
Date:   Thu Nov 14 11:33:20 2019 -0300

    Bump app v7.1.7 - Fix cordova-plugin-fcm
</pre>
</div>
</div>

but compiling revision `84acad445ad76e` did also result in massive differences
with the version on Google Play:

![BitPay diffs 1](/images/BitpayDiffs1.png)

![BitPay diffs 2](/images/BitpayDiffs2.png)

this is by far not the only thing that differs

so our verdict remains: This app is **not verifiable**.

Above is not the whole picture of what we went through to get to this point.
Here is just the command history from the Docker session:

```
root@3eae2071ceaf:/mnt# history
    1  cd /mnt/
    2  ll
    3  npm install
    4  apt update
    5  apt install python
    6  npm install
    7  apt install make
    8  npm install
    9  apt install g++
   10  npm install
   11  npm run clean-all
   12  npm install
   13  npm run apply:copay
   14  npm run prepare:copay
   15  git checkout v7.1.7
   16  git tag
   17  git log
   18  npm run prepare:copay
   19  npm run final:android
   20  $ANDROID_HOME/tools/bin/sdkmanager --licenses
   21  $ANDROID_HOME/tools/bin/sdkmanager update sdk --no-ui --filter android-27
   22  $ANDROID_HOME/tools/bin/sdkmanager update sdk --filter android-27
   23  $ANDROID_HOME/tools/bin/sdkmanager android-27
   24  $ANDROID_HOME/tools/bin/sdkmanager --list
   25  $ANDROID_HOME/tools/bin/sdkmanager update
   26  $ANDROID_HOME/tools/bin/sdkmanager platforms;android-27
   27  $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-27"
   28  npm run final:android
   29  ll platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
   30  yes $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-27"
   31  yes $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-28"
   32  $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-28"
   33  $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-29"
   34  npm run final:android
   35  git checkout 84acad445ad
   36  history
   37  npm install
   38  npm run clean-all
   39  npm run apply:copay
   40  npm install
   41  npm run apply:copay
   42  history
   43  npm run prepare:copay
   44  npm run start:android
   45  history
   46  npm run final:android
```

With all the investigations above, this would be my build instructions:

```
$ docker run -v /path/to/copay:/mnt -it beevelop/cordova bash /mnt/build.sh
```

with this `build.sh`:

```
cd /mnt/ && \
apt update && \
apt install python make g++ -y && \
npm run clean-all && \
npm install && \
npm run apply:copay && \
npm run prepare:copay && \
yes | $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-27" && \
yes "" | npm run final:android
```

Other Observations
------------------

Copay has a
[Bug Bounty Program](https://support.bitpay.com/hc/en-us/articles/204229369-Does-BitPay-have-a-bug-bounty-program-).
