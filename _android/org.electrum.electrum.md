---
title: "Electrum Bitcoin Wallet"
altTitle: 

users: 100000
appId: org.electrum.electrum
launchDate: 2016-03-02
latestUpdate: 2020-09-11
apkVersionName: "4.0.3.0"
stars: 3.2
ratings: 1820
reviews: 1116
size: 20M
website: https://electrum.org/
repository: https://github.com/spesmilo/electrum
issue: https://github.com/spesmilo/electrum/issues/5839
icon: org.electrum.electrum.png
bugbounty: 
verdict: nonverifiable # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2019-12-11
reviewStale: true
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /electrum/
  - /org.electrum.electrum/
  - /posts/2019/12/elecrtum/
  - /posts/org.electrum.electrum/
---


Electrum is around since 2011 in its various flavors and many projects came from
this open source project.

In the description we are pointed to their repository at
[this repository](https://github.com/spesmilo/electrum) where we are referred to
[this Readme.md](https://github.com/spesmilo/electrum/blob/master/electrum/gui/kivy/Readme.md).

And there we read:

> This script does not produce reproducible output (yet!). Please help us remedy
this.

We gave it a try anyway and ran:

```
git clone git@github.com:spesmilo/electrum.git
cd electrum
git tag
git checkout 3.3.7
docker build -t electrum-android-builder-img electrum/gui/kivy/tools
./contrib/pull_locale
./contrib/make_packages
mkdir --parents $PWD/.buildozer/.gradle
docker run -it --rm --name electrum-android-builder-cont \
  --volume $PWD:/home/user/wspace/electrum \
  --volume $PWD/.buildozer/.gradle:/home/user/.gradle \
  --volume ~/.keystore:/home/user/.keystore \
  --workdir /home/user/wspace/electrum \
  electrum-android-builder-img ./contrib/make_apk
cd bin/
apktool d -o fromPlayStore 'Electrum 3.3.7.0 (org.electrum.electrum).apk'
apktool d -o fromBuild Electrum-3.3.7.0-debug.apk
diff from* -r --brief | wc -l
```

The apk we got at this point was ... a debug build and thus it is no big
surprise to find **1362** files to differ.

Running the docker command again but with `./contrib/make_apk release` turned
out complicated, too. Even after copying a keystore with a known password to
`~/.keystore/` and providing the script with the password, we get this kind of
cryptic error:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ docker run -it --rm \
    --name electrum-android-builder-cont \
    -v $PWD:/home/user/wspace/electrum \
    -v $PWD/.buildozer/.gradle:/home/user/.gradle \
    -v ~/.keystore:/home/user/.keystore \
    --workdir /home/user/wspace/electrum \
    electrum-android-builder-img \
    ./contrib/make_apk release
~/wspace/electrum/electrum/gui/kivy ~/wspace/electrum
python3 -m kivy.atlas theming/light 1024 theming/light/*.png
[<font color="#C4A000"><b>WARNING</b></font>] [Config      ] Older configuration version detected (0 instead of 21)
[<font color="#C4A000"><b>WARNING</b></font>] [Config      ] Upgrading configuration in progress.
[<font color="#4E9A06"><b>INFO</b></font>   ] [Logger      ] Record log in /home/user/.kivy/logs/kivy_19-12-11_0.txt
[<font color="#4E9A06"><b>INFO</b></font>   ] [Kivy        ] v1.11.1
[<font color="#4E9A06"><b>INFO</b></font>   ] [Kivy        ] Installed at &quot;/usr/lib/python3/dist-packages/kivy/__init__.py&quot;
[<font color="#4E9A06"><b>INFO</b></font>   ] [Python      ] v3.6.9 (default, Nov  7 2019, 10:44:02)
[GCC 8.3.0]
[<font color="#4E9A06"><b>INFO</b></font>   ] [Python      ] Interpreter at &quot;/usr/bin/python3&quot;
[<font color="#4E9A06"><b>INFO</b></font>   ] [Atlas       ] create an 1024x1024 rgba image
Atlas created at theming/light.atlas
1 image has been created
Keystore Password:make[1]: Entering directory &apos;/home/user/wspace/electrum/electrum/gui/kivy&apos;
# running pre build setup
# copy electrum to main.py
make[1]: Leaving directory &apos;/home/user/wspace/electrum/electrum/gui/kivy&apos;
<font color="#06989A"># Check configuration tokens</font>
<font color="#06989A"># Ensure build layout</font>
<font color="#06989A"># Check configuration tokens</font>
<font color="#06989A"># Preparing build</font>
<font color="#06989A"># Check requirements for android</font>
<font color="#06989A"># Install platform</font>
<font color="#06989A"># Android ANT is missing, downloading</font>
<font color="#06989A"># Apache ANT installation done.</font>
<font color="#06989A"># Android SDK found at /opt/android/android-sdk</font>
<font color="#06989A"># Android NDK found at /opt/android/android-ndk-r17c</font>
<font color="#06989A"># Check application requirements</font>
<font color="#06989A"># Check garden requirements</font>
<font color="#06989A"># Compile platform</font>
<font color="#06989A"># Build the application #4</font>
<font color="#06989A"># Package the application</font>
<font color="#06989A"># Gradle project detected, copy files /home/user/wspace/electrum/.buildozer/android/platform/build/dists/Electrum/src/main/java</font>
copy electrum/gui/kivy/data/java-classes/ to /home/user/wspace/electrum/.buildozer/android/platform/build/dists/Electrum/src/main/java/
copy electrum/gui/kivy/data/java-classes/org to /home/user/wspace/electrum/.buildozer/android/platform/build/dists/Electrum/src/main/java/org
copy electrum/gui/kivy/data/java-classes/org/electrum to /home/user/wspace/electrum/.buildozer/android/platform/build/dists/Electrum/src/main/java/org/electrum
copy electrum/gui/kivy/data/java-classes/org/electrum/qr to /home/user/wspace/electrum/.buildozer/android/platform/build/dists/Electrum/src/main/java/org/electrum/qr
copy electrum/gui/kivy/data/java-classes/org/electrum/qr/SimpleScannerActivity.java to /home/user/wspace/electrum/.buildozer/android/platform/build/dists/Electrum/src/main/java/org/electrum/qr/SimpleScannerActivity.java
<font color="#CC0000"># Command failed: /usr/bin/python3 -m pythonforandroid.toolchain apk --debug --bootstrap=sdl2 --dist_name Electrum --name Electrum --version 3.3.7.0 --package org.electrum.electrum --android_api 28 --minsdk 21 --ndk-api 21 --private /home/user/wspace/electrum/.buildozer/android/app --permission INTERNET --permission CAMERA --add-activity org.electrum.qr.SimpleScannerActivity --presplash /home/user/wspace/electrum/./electrum/gui/icons/electrum_presplash.png --icon /home/user/wspace/electrum/./electrum/gui/icons/electrum_launcher.png --orientation portrait --window --intent-filters /home/user/wspace/electrum/electrum/gui/kivy/tools/bitcoin_intent.xml --activity-launch-mode singleTask --release --sign --copy-libs --depend me.dm7.barcodescanner:zxing:1.9.8 --arch armeabi-v7a --color=always --storage-dir=&quot;/home/user/wspace/electrum/.buildozer/android/platform/build&quot; --ndk-api=21</font>
<font color="#CC0000"># ENVIRONMENT:</font>
<font color="#CC0000">#     USER = &apos;user&apos;</font>
<font color="#CC0000">#     P4A_RELEASE_KEYSTORE = &apos;/home/user/.keystore&apos;</font>
<font color="#CC0000">#     LANGUAGE = &apos;en_US.UTF-8&apos;</font>
<font color="#CC0000">#     ANDROID_SDK_HOME = &apos;/opt/android/android-sdk&apos;</font>
<font color="#CC0000">#     HOSTNAME = &apos;f48b0ed2034d&apos;</font>
<font color="#CC0000">#     WORK_DIR = &apos;/home/user/wspace&apos;</font>
<font color="#CC0000">#     SHLVL = &apos;1&apos;</font>
<font color="#CC0000">#     HOME = &apos;/home/user&apos;</font>
<font color="#CC0000">#     P4A_RELEASE_KEYALIAS = &apos;electrum&apos;</font>
<font color="#CC0000">#     OLDPWD = &apos;/home/user/wspace/electrum/electrum/gui/kivy&apos;</font>
<font color="#CC0000">#     ANDROID_SDK_BUILD_TOOLS_VERSION = &apos;28.0.3&apos;</font>
<font color="#CC0000">#     MAKEFLAGS = &apos;&apos;</font>
<font color="#CC0000">#     HOME_DIR = &apos;/home/user&apos;</font>
<font color="#CC0000">#     ANDROID_SDK_TOOLS_VERSION = &apos;4333796&apos;</font>
<font color="#CC0000">#     MAKE_TERMERR = &apos;/dev/pts/0&apos;</font>
<font color="#CC0000">#     ANDROID_SDK_TOOLS_ARCHIVE = &apos;sdk-tools-linux-4333796.zip&apos;</font>
<font color="#CC0000">#     _ = &apos;/usr/bin/make&apos;</font>
<font color="#CC0000">#     P4A_RELEASE_KEYSTORE_PASSWD = &apos;android&apos;</font>
<font color="#CC0000">#     ANDROID_NDK_VERSION = &apos;17c&apos;</font>
<font color="#CC0000">#     TERM = &apos;xterm&apos;</font>
<font color="#CC0000">#     PATH = &apos;/home/user/.buildozer/android/platform/apache-ant-1.9.4/bin:/home/user/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin&apos;</font>
<font color="#CC0000">#     ANDROID_NDK_ARCHIVE = &apos;android-ndk-r17c-linux-x86_64.zip&apos;</font>
<font color="#CC0000">#     P4A_RELEASE_KEYALIAS_PASSWD = &apos;android&apos;</font>
<font color="#CC0000">#     ANDROID_SDK_TOOLS_DL_URL = &apos;https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip&apos;</font>
<font color="#CC0000">#     MAKELEVEL = &apos;1&apos;</font>
<font color="#CC0000">#     USE_SDK_WRAPPER = &apos;1&apos;</font>
<font color="#CC0000">#     ANDROID_NDK_HOME_V = &apos;/opt/android/android-ndk-r17c&apos;</font>
<font color="#CC0000">#     LANG = &apos;en_US.UTF-8&apos;</font>
<font color="#CC0000">#     ANDROID_NDK_DL_URL = &apos;https://dl.google.com/android/repository/android-ndk-r17c-linux-x86_64.zip&apos;</font>
<font color="#CC0000">#     MAKE_TERMOUT = &apos;/dev/pts/0&apos;</font>
<font color="#CC0000">#     PWD = &apos;/home/user/wspace/electrum&apos;</font>
<font color="#CC0000">#     LC_ALL = &apos;en_US.UTF-8&apos;</font>
<font color="#CC0000">#     ANDROID_HOME = &apos;/opt/android&apos;</font>
<font color="#CC0000">#     MFLAGS = &apos;&apos;</font>
<font color="#CC0000">#     ANDROID_NDK_HOME = &apos;/opt/android/android-ndk&apos;</font>
<font color="#CC0000">#     GRADLE_OPTS = &quot;-Xmx1536M -Dorg.gradle.jvmargs=&apos;-Xmx1536M&apos;&quot;</font>
<font color="#CC0000">#     PACKAGES_PATH = &apos;/home/user/.buildozer/android/packages&apos;</font>
<font color="#CC0000">#     ANDROIDSDK = &apos;/opt/android/android-sdk&apos;</font>
<font color="#CC0000">#     ANDROIDNDK = &apos;/opt/android/android-ndk-r17c&apos;</font>
<font color="#CC0000">#     ANDROIDAPI = &apos;28&apos;</font>
<font color="#CC0000">#     ANDROIDMINAPI = &apos;21&apos;</font>
<font color="#CC0000"># </font>
<font color="#CC0000"># Buildozer failed to execute the last command</font>
<font color="#CC0000"># If the error is not obvious, please raise the log_level to 2</font>
<font color="#CC0000"># and retry the latest command.</font>
<font color="#CC0000"># In case of a bug report, please add a full log with log_level = 2</font>
Makefile:24: recipe for target &apos;release&apos; failed
make: [release] Error 1 (ignored)
make[1]: Entering directory &apos;/home/user/wspace/electrum/electrum/gui/kivy&apos;
# Cleaning up
# rename main.py to electrum
# remove buildozer.spec
make[1]: Leaving directory &apos;/home/user/wspace/electrum/electrum/gui/kivy&apos;
~/wspace/electrum
</pre>
</div>
</div>

Given the project itself claims to **not produce reproducible output**, we
remain with the same conclusion and decide it is **not verifiable**.
