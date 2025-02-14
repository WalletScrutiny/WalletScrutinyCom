---
wsId: 'envoyFoundation'
title: 'Envoy'
altTitle: 
authors:
- 'danny'
- 'keraliss'
users: 1000
appId: 'com.foundationdevices.envoy'
appCountry: 'US'
released: '2022-04-01'
updated: 2025-02-01
version: '1.8.6'
stars: 4.2
ratings: 
reviews: 5
website: 'https://foundationdevices.com/'
repository: 'https://github.com/Foundation-Devices/envoy'
issue: 'https://github.com/Foundation-Devices/envoy/issues/1395'
icon: 'com.foundationdevices.envoy.jpg'
bugbounty: 
meta: 'ok'
verdict: 'wip'
appHashes: []
date: '2024-11-22'
signer: 
reviewArchive:
- date: '2024-11-22'
  version: '1.8.4'
  appHashes:
  - '7d883cf4ac02b16238e2075a726db8dcefd7250f8461d06565e2daf9b520e2be'
  - 'c7283366b3c0857aae728dfa38d5776985362c000864d11ad95e5ea446019bae'
  - '2e8d46dc9d6df35d69b1f796e1ff44dd5eef92aafcb94c88159a7dd96c6527bd'
  - 'a3830481af62bf78d71a3e628f837fc76959d38028e985945bea956f8e80a931'
  gitRevision: '6c17feb4d414efa40ea736b9d2e8d44216776893'
  verdict: 'nonverifiable'
twitter: 'FOUNDATIONdvcs'
social:
- 'https://www.linkedin.com/company/foundationdevices'
- 'https://www.youtube.com/@foundationdevices'
- 'https://www.reddit.com/r/FoundationDevices'
- 'https://t.me/foundationdevices'
redirect_from: 
developerName: 'Foundation Devices'
features: 

---

## Updated Review v1.8.4 2024-11-22

### Split APK comparison

- With a modified build process, we were able to generate an AAB file by issuing the command 'just docker-build-android' after cloning the repository
- We automated this process with an updated script, since {{ page.title }} uses **split-apks**.

```
Official APKs:
========================================
**Official APKs Hashes**
7d883cf4ac02b16238e2075a726db8dcefd7250f8461d06565e2daf9b520e2be base.apk
c7283366b3c0857aae728dfa38d5776985362c000864d11ad95e5ea446019bae split_config.arm64_v8a.apk
2e8d46dc9d6df35d69b1f796e1ff44dd5eef92aafcb94c88159a7dd96c6527bd split_config.en.apk
a3830481af62bf78d71a3e628f837fc76959d38028e985945bea956f8e80a931 split_config.xxhdpi.apk
========================================
Built APKs:
========================================
**Built APKs Hashes**
3e8f3eeb18c4ef6ca109e353db416e7a7839265549881793d1d3ebcc1ca4dfbc base-arm64_v8a.apk
b60c2f36cff6cd5d2d52f16c6342145b276957e9a422728bba99e2cf4abc1a0c base-en.apk
54602149925cb94beccc4bb1e35960e3fbfc6025c848991d3415255ac6ca6856 base-master.apk
71181091b49726b1f445ba842ab57057ebdb947e5f92020eafec9e046893dd5e base-xxhdpi.apk
========================================
========================================
```

### We then process the diffs

Differences found between /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/arm64_v8a and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/arm64_v8a

### arm64_v8a

```
Binary files /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/arm64_v8a/AndroidManifest.xml and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/arm64_v8a/AndroidManifest.xml differ
Binary files /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/arm64_v8a/lib/arm64-v8a/libapp.so and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/arm64_v8a/lib/arm64-v8a/libapp.so differ
Binary files /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/arm64_v8a/lib/arm64-v8a/libtor.so and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/arm64_v8a/lib/arm64-v8a/libtor.so differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/arm64_v8a: META-INF
Only in /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/arm64_v8a: stamp-cert-sha256
```
{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/com.foundationdevices.envoy/1.8.4/diffo-arm64_v8a-AndroidManifest.xml.html' %}

{% include diffoscope-modal.html label='libapp.so' url='/assets/diffoscope-results/android/com.foundationdevices.envoy/1.8.4/diffo-arm64_v8a-libapp.so.html' %}

{% include diffoscope-modal.html label='libtor.so' url='/assets/diffoscope-results/android/com.foundationdevices.envoy/1.8.4/diffo-arm64_v8a-libtor.so.html' %}

### en.apk

Differences found between /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/en and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/en

```
Binary files /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/en/AndroidManifest.xml and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/en/AndroidManifest.xml differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/en: META-INF
Binary files /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/en/resources.arsc and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/en/resources.arsc differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/en: stamp-cert-sha256
```
{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/com.foundationdevices.envoy/1.8.4/diffo-en-AndroidManifest.xml.html' %}

{% include diffoscope-modal.html label='resources.arsc' url='/assets/diffoscope-results/android/com.foundationdevices.envoy/1.8.4/diffo-en-resources.arsc.html' %}

### xxhdpi.apk

Differences found between /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/xxhdpi and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/xxhdpi

```
Binary files /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/xxhdpi/AndroidManifest.xml and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/xxhdpi/AndroidManifest.xml differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/xxhdpi: META-INF
Binary files /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/xxhdpi/resources.arsc and /tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/xxhdpi/resources.arsc differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/xxhdpi: stamp-cert-sha256
```

{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/com.foundationdevices.envoy/1.8.4/diffo-xxhdpi-AndroidManifest.xml.html' %}

{% include diffoscope-modal.html label='resources.arsc' url='/assets/diffoscope-results/android/com.foundationdevices.envoy/1.8.4/diffo-xxhdpi-resources.arsc.html' %}

### base.apk

Differences found between `/tmp/test_com.foundationdevices.envoy_1.8.4/fromPlay-unzipped/base` and `/tmp/test_com.foundationdevices.envoy_1.8.4/fromBuild-unzipped/base` is too large to put here and included characters that are not parsed properly. So we endeavored to use diffoscope on the two folders instead [found in this file]

{% include diffoscope-modal.html label='base.apk diffoscope' url='/assets/diffoscope-results/android/com.foundationdevices.envoy/1.8.4/diffo_base.html' %}

{% include asciicast %}

## Previous Review 2024-10-22

Our [test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/android/com.foundationdevices.envoy.sh) was executed successfully, resulting in a successfully built APK.

The APK was built successfully:

```
✓ Built build/app/outputs/flutter-apk/app-release.apk .
```

We then extracted the generated APK from the build and also obtained the official APK from the Google Play Store. After unzipping both APKs using `unzip --qqd`, we performed a comparison using:

```
diff --recursive fromBuild/ fromOfficial/
```

The comparison revealed significant differences between the generated APK and the Play Store version:

```
Files fromBuild/assets/dexopt/baseline.prof and fromOfficial/assets/dexopt/baseline.prof differ
Files fromBuild/assets/dexopt/baseline.profm and fromOfficial/assets/dexopt/baseline.profm differ
Files fromBuild/assets/flutter_assets/AssetManifest.bin and fromOfficial/assets/flutter_assets/AssetManifest.bin differ
Files fromBuild/assets/flutter_assets/assets/components/icons/ramp.svg and fromOfficial/assets/flutter_assets/assets/components/icons/ramp.svg differ
Files fromBuild/assets/flutter_assets/assets/components/icons/ramp_without_name.svg and fromOfficial/assets/flutter_assets/assets/components/icons/ramp_without_name.svg differ
Files fromBuild/assets/flutter_assets/fonts/MaterialIcons-Regular.otf and fromOfficial/assets/flutter_assets/fonts/MaterialIcons-Regular.otf differ
Only in fromBuild/assets/flutter_assets: integration_test
Files fromBuild/assets/flutter_assets/NOTICES.Z and fromOfficial/assets/flutter_assets/NOTICES.Z differ
Files fromBuild/assets/flutter_assets/shaders/ink_sparkle.frag and fromOfficial/assets/flutter_assets/shaders/ink_sparkle.frag differ
Files fromBuild/assets/lua/meta/art/00_musicbrainz.lua and fromOfficial/assets/lua/meta/art/00_musicbrainz.lua differ
Files fromBuild/assets/lua/meta/art/01_googleimage.lua and fromOfficial/assets/lua/meta/art/01_googleimage.lua differ
Files fromBuild/assets/lua/meta/art/02_frenchtv.lua and fromOfficial/assets/lua/meta/art/02_frenchtv.lua differ
Files fromBuild/assets/lua/meta/art/03_lastfm.lua and fromOfficial/assets/lua/meta/art/03_lastfm.lua differ
Files fromBuild/assets/lua/meta/reader/filename.lua and fromOfficial/assets/lua/meta/reader/filename.lua differ
Files fromBuild/assets/lua/modules/common.lua and fromOfficial/assets/lua/modules/common.lua differ
Files fromBuild/assets/lua/modules/sandbox.lua and fromOfficial/assets/lua/modules/sandbox.lua differ
Files fromBuild/assets/lua/modules/simplexml.lua and fromOfficial/assets/lua/modules/simplexml.lua differ
Files fromBuild/assets/lua/playlist/anevia_streams.lua and fromOfficial/assets/lua/playlist/anevia_streams.lua differ
Files fromBuild/assets/lua/playlist/appletrailers.lua and fromOfficial/assets/lua/playlist/appletrailers.lua differ
Files fromBuild/assets/lua/playlist/bbc_co_uk.lua and fromOfficial/assets/lua/playlist/bbc_co_uk.lua differ
Files fromBuild/assets/lua/playlist/break.lua and fromOfficial/assets/lua/playlist/break.lua differ
Files fromBuild/assets/lua/playlist/cue.lua and fromOfficial/assets/lua/playlist/cue.lua differ
Files fromBuild/assets/lua/playlist/extreme.lua and fromOfficial/assets/lua/playlist/extreme.lua differ
Files fromBuild/assets/lua/playlist/france2.lua and fromOfficial/assets/lua/playlist/france2.lua differ
Files fromBuild/assets/lua/playlist/jamendo.lua and fromOfficial/assets/lua/playlist/jamendo.lua differ
Files fromBuild/assets/lua/playlist/katsomo.lua and fromOfficial/assets/lua/playlist/katsomo.lua differ
Files fromBuild/assets/lua/playlist/lelombrik.lua and fromOfficial/assets/lua/playlist/lelombrik.lua differ
Files fromBuild/assets/lua/playlist/liveleak.lua and fromOfficial/assets/lua/playlist/liveleak.lua differ
Files fromBuild/assets/lua/playlist/metacafe.lua and fromOfficial/assets/lua/playlist/metacafe.lua differ
Files fromBuild/assets/lua/playlist/mpora.lua and fromOfficial/assets/lua/playlist/mpora.lua differ
Files fromBuild/assets/lua/playlist/newgrounds.lua and fromOfficial/assets/lua/playlist/newgrounds.lua differ
Files fromBuild/assets/lua/playlist/pinkbike.lua and fromOfficial/assets/lua/playlist/pinkbike.lua differ
Files fromBuild/assets/lua/playlist/rockbox_fm_presets.lua and fromOfficial/assets/lua/playlist/rockbox_fm_presets.lua differ
Files fromBuild/assets/lua/playlist/soundcloud.lua and fromOfficial/assets/lua/playlist/soundcloud.lua differ
Files fromBuild/assets/lua/playlist/twitch.lua and fromOfficial/assets/lua/playlist/twitch.lua differ
Files fromBuild/assets/lua/playlist/vocaroo.lua and fromOfficial/assets/lua/playlist/vocaroo.lua differ
Files fromBuild/assets/lua/playlist/youtube.lua and fromOfficial/assets/lua/playlist/youtube.lua differ
Files fromBuild/assets/lua/playlist/zapiks.lua and fromOfficial/assets/lua/playlist/zapiks.lua differ
Only in fromBuild/: billing.properties
Only in fromOfficial/: build-data.properties
Files fromBuild/classes.dex and fromOfficial/classes.dex differ
Files fromBuild/DebugProbesKt.bin and fromOfficial/DebugProbesKt.bin differ
Only in fromBuild/: firebase-encoders-json.properties
Only in fromBuild/: firebase-encoders.properties
Only in fromBuild/: firebase-encoders-proto.properties
Only in fromBuild/: lib
Files fromBuild/META-INF/androidx.activity_activity.version and fromOfficial/META-INF/androidx.activity_activity.version differ
Files fromBuild/META-INF/androidx.annotation_annotation-experimental.version and fromOfficial/META-INF/androidx.annotation_annotation-experimental.version differ
Files fromBuild/META-INF/androidx.appcompat_appcompat-resources.version and fromOfficial/META-INF/androidx.appcompat_appcompat-resources.version differ
Files fromBuild/META-INF/androidx.appcompat_appcompat.version and fromOfficial/META-INF/androidx.appcompat_appcompat.version differ
Files fromBuild/META-INF/androidx.core_core-ktx.version and fromOfficial/META-INF/androidx.core_core-ktx.version differ
Files fromBuild/META-INF/androidx.core_core.version and fromOfficial/META-INF/androidx.core_core.version differ
Files fromBuild/META-INF/androidx.emoji2_emoji2.version and fromOfficial/META-INF/androidx.emoji2_emoji2.version differ
Files fromBuild/META-INF/androidx.emoji2_emoji2-views-helper.version and fromOfficial/META-INF/androidx.emoji2_emoji2-views-helper.version differ
Files fromBuild/META-INF/androidx.fragment_fragment.version and fromOfficial/META-INF/androidx.fragment_fragment.version differ
Only in fromBuild/META-INF: androidx.lifecycle_lifecycle-livedata-core-ktx.version
Files fromBuild/META-INF/androidx.lifecycle_lifecycle-livedata-core.version and fromOfficial/META-INF/androidx.lifecycle_lifecycle-livedata-core.version differ
Files fromBuild/META-INF/androidx.lifecycle_lifecycle-livedata.version and fromOfficial/META-INF/androidx.lifecycle_lifecycle-livedata.version differ
Files fromBuild/META-INF/androidx.lifecycle_lifecycle-process.version and fromOfficial/META-INF/androidx.lifecycle_lifecycle-process.version differ
Files fromBuild/META-INF/androidx.lifecycle_lifecycle-runtime.version and fromOfficial/META-INF/androidx.lifecycle_lifecycle-runtime.version differ
Files fromBuild/META-INF/androidx.lifecycle_lifecycle-viewmodel-savedstate.version and fromOfficial/META-INF/androidx.lifecycle_lifecycle-viewmodel-savedstate.version differ
Files fromBuild/META-INF/androidx.lifecycle_lifecycle-viewmodel.version and fromOfficial/META-INF/androidx.lifecycle_lifecycle-viewmodel.version differ
Files fromBuild/META-INF/androidx.media_media.version and fromOfficial/META-INF/androidx.media_media.version differ
Files fromBuild/META-INF/androidx.profileinstaller_profileinstaller.version and fromOfficial/META-INF/androidx.profileinstaller_profileinstaller.version differ
Files fromBuild/META-INF/androidx.security_security-crypto.version and fromOfficial/META-INF/androidx.security_security-crypto.version differ
Files fromBuild/META-INF/androidx.tracing_tracing.version and fromOfficial/META-INF/androidx.tracing_tracing.version differ
Only in fromBuild/META-INF: androidx.window.extensions.core_core.version
Files fromBuild/META-INF/androidx.window_window-java.version and fromOfficial/META-INF/androidx.window_window-java.version differ
Files fromBuild/META-INF/androidx.window_window.version and fromOfficial/META-INF/androidx.window_window.version differ
Files fromBuild/META-INF/com/android/build/gradle/app-metadata.properties and fromOfficial/META-INF/com/android/build/gradle/app-metadata.properties differ
Files fromBuild/META-INF/kotlinx_coroutines_android.version and fromOfficial/META-INF/kotlinx_coroutines_android.version differ
Files fromBuild/META-INF/kotlinx_coroutines_core.version and fromOfficial/META-INF/kotlinx_coroutines_core.version differ
Only in fromBuild/META-INF/services: a4.f
Only in fromBuild/META-INF/services: B4.B
Only in fromOfficial/META-INF/services: c7.f
Only in fromOfficial/META-INF/services: d8.d0
Only in fromBuild/META-INF/services: G4.t
Only in fromOfficial/META-INF/services: kotlinx.coroutines.internal.r
Only in fromBuild/META-INF/services: u3.a
Only in fromOfficial/META-INF/services: w5.a
Only in fromBuild/META-INF: version-control-info.textproto
Only in fromBuild/: play-services-basement.properties
Only in fromBuild/: play-services-base.properties
Only in fromBuild/: play-services-location.properties
Only in fromBuild/: play-services-places-placereport.properties
Only in fromBuild/: play-services-tasks.properties
Only in fromOfficial/res: anim
Only in fromOfficial/res: animator
Only in fromOfficial/res: anim-v21
Only in fromOfficial/res: color-v26
Only in fromOfficial/res: drawable
Only in fromOfficial/res: drawable-anydpi-v23
Only in fromOfficial/res: drawable-hdpi-v4
Only in fromOfficial/res: drawable-v21
Only in fromOfficial/res: drawable-v23
Only in fromOfficial/res: drawable-watch-v20
Only in fromBuild/res: E5.ogg
Only in fromOfficial/res: interpolator
Only in fromOfficial/res: layout
Only in fromOfficial/res: layout-v21
Only in fromOfficial/res: layout-v26
Only in fromOfficial/res: layout-watch-v20
Only in fromOfficial/res: mipmap-anydpi-v26
Only in fromOfficial/res: mipmap-hdpi-v4
Only in fromOfficial/res: mipmap-mdpi-v4
Only in fromOfficial/res: mipmap-xhdpi-v4
Only in fromOfficial/res: mipmap-xxhdpi-v4
Only in fromOfficial/res: mipmap-xxxhdpi-v4
Only in fromOfficial/res: raw
Only in fromOfficial/res: xml
Files fromBuild/resources.arsc and fromOfficial/resources.arsc differ
Only in fromOfficial/: stamp-cert-sha256
Only in fromBuild/: transport-api.properties
Only in fromBuild/: transport-backend-cct.properties
Only in fromBuild/: transport-runtime.properties

```

There were around 1000+ more lines of diff containing png, webp and xml changes. With these many differences, the wallet is **not verifiable**.


**Conclusion:** Although the Docker image for the Envoy Wallet built successfully, the APK was not generated correctly. As a result, the APK is **not verifiable** at this time.

## App Description from Google Play

> Envoy is a simple Bitcoin wallet with powerful account management and privacy features.
>
> Use Envoy alongside your Passport hardware wallet for setup, firmware updates, and more.
>
> Envoy offers the following features:
>
> 1. Magic Backups. Get up and running with self-custody in only 60 seconds with automatic encrypted backups. Seed words optional.
>
> 2. Manage your mobile wallet and Passport hardware wallet accounts in the same app.
>
> 3. Send and receive Bitcoin in a zen-like interface.
>
> 4. Connect your Passport hardware wallet for setup, firmware updates, and support videos. Use Envoy as your software wallet connected to your Passport.
>
> 5. Fully open source and privacy preserving. Envoy optionally connects to the Internet with Tor for maximum privacy.
>
> 6. Optionally connect your own Bitcoin node.

A blog post states that this is not an ordinary "companion app", it is a fully-capable standalone self-custodial bitcoin wallet.  

## Analysis 

This app is **for verification**.