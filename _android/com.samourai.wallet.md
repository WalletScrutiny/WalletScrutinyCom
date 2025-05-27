---
wsId: 
title: Samourai Wallet
altTitle: 
authors:
- emanuel
- Mohammad Rafigh
- leo
users: 100000
appId: com.samourai.wallet
appCountry: 
released: 
updated: 2024-03-29
version: VARY
stars: 
ratings: 
reviews: 
website: https://samouraiwallet.com
repository: https://code.samourai.io/wallet/samourai-wallet-android
issue: 
icon: com.samourai.wallet.png
bugbounty: 
meta: removed
verdict: sourceavailable
appHashes: []
date: 2024-04-26
signer: 6ab9471c21d2cddd628172975cff8ba23584da41c6962df074eb56e4ef08d990
twitter: SamouraiWallet
social: 
redirect_from:
- /samourai/
- /com.samourai.wallet/
developerName: Samourai
features: 

---

**Update 2024-04-29**: As of this date, {{ page.title }} has been taken down from Google Play Store. The website [has been seized by the US government](https://web.archive.org/web/20240428014817/http://www.samouraiwallet.com/). For more information detailing the founders' arrest, here is the article from the website of the [United States Attorney's Office.](https://www.justice.gov/usao-sdny/pr/founders-and-ceo-cryptocurrency-mixing-service-arrested-and-charged-money-laundering)

Because of Samourai Wallet's removal, users may find that their funds *appear* to have gone to zero. This is likely due to the servers going offline. Don't panic, as your coins are still there. However it is best to restore your backup to another wallet.

## If you have been affected by this, here are some resources and steps to help recover your wallet:

[WalletsRecovery.org](https://walletsrecovery.org/) is a site that allows you to find a specific wallet's supported derivation paths, whether it has a BIP39 pass, or supports BIP174 PSBT, as well as keeping track of documentation.

Here's a [guide](https://twitter.com/_k3tan/status/1783389500485578847) detailing on how to import a Samourai Wallet into Sparrow. Make sure to keep track of your passphrase and check the "Use passphrase" box upon using it.

Below are some step-by-step instructions on how to import a Samourai Wallet into Electrum:

1. **Secure your recovery phrase:** This is the 12-word phrase that should have been generated once you created your wallet. Make sure it is in a safe place where it is easily accessible. **NEVER SHARE THIS WITH ANYONE, NOT EVEN WITH USERS WHO CLAIM TO BE DEVELOPERS OR STAFF.** Note that Samourai wallet comes with a separate passphrase, which is not the same as the 12-word seed phrase. Both of them need to be secured.
1. **Find Samourai Wallet's derivation path:**  You can go to WalletsRecovery.org and find "Samourai Wallet" in the table on its homepage. Take note of the data provided, especially the derivation paths. Samourai offers multiple paths depending on the type of wallet you had. Select the wallet derivation path that applies to your original wallet.
1. **Set up the backup:** Select `File > New/Restore`, choose `Standard Wallet`, select `I already have a seed` and enter the passphrase. 
1. **Enter your Samourai Wallet passphrase:** Make sure to click **Options** and check BIP39. Then, check `Extend this seed with custom words.` You will have to enter your passphrase.
1. **Set the path:** Set the derivation path to the one you selected in step 2. If that fails, leave the path as `m/84'/0'/0'`. Select "native segwit (p2wpkh)". 
1. **Set the new password for Electrum.** It is advisable to save and backup this password.

**Update 2024-04-05**: The provider did not tag their release but the relevant
`versionCode` was set in
[this commit](https://code.samourai.io/wallet/samourai-wallet-android/-/commit/64d464e7f616999aa6d64a20b9e3874a0f047f32)
and compiling that gives us this result:

```
===== Begin Results =====
appId:          com.samourai.wallet
signer:         6ab9471c21d2cddd628172975cff8ba23584da41c6962df074eb56e4ef08d990
apkVersionName: 0.99.98ii
apkVersionCode: 201
verdict:        
appHash:        c158c4d2a55d6066722fd6fc5b95d9368da4e746ddd806ffd175f6b6a9c9e307
commit:         64d464e7f616999aa6d64a20b9e3874a0f047f32

Diff:
Files /tmp/fromPlay_com.samourai.wallet_201/AndroidManifest.xml and /tmp/fromBuild_com.samourai.wallet_201/AndroidManifest.xml differ
Only in /tmp/fromPlay_com.samourai.wallet_201/assets: common
Files /tmp/fromPlay_com.samourai.wallet_201/assets/dexopt/baseline.prof and /tmp/fromBuild_com.samourai.wallet_201/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_com.samourai.wallet_201/assets/dexopt/baseline.profm and /tmp/fromBuild_com.samourai.wallet_201/assets/dexopt/baseline.profm differ
Only in /tmp/fromBuild_com.samourai.wallet_201/assets: LargeWordsList
Files /tmp/fromPlay_com.samourai.wallet_201/classes2.dex and /tmp/fromBuild_com.samourai.wallet_201/classes2.dex differ
Files /tmp/fromPlay_com.samourai.wallet_201/classes3.dex and /tmp/fromBuild_com.samourai.wallet_201/classes3.dex differ
Files /tmp/fromPlay_com.samourai.wallet_201/classes4.dex and /tmp/fromBuild_com.samourai.wallet_201/classes4.dex differ
Files /tmp/fromPlay_com.samourai.wallet_201/classes5.dex and /tmp/fromBuild_com.samourai.wallet_201/classes5.dex differ
Files /tmp/fromPlay_com.samourai.wallet_201/classes6.dex and /tmp/fromBuild_com.samourai.wallet_201/classes6.dex differ
Files /tmp/fromPlay_com.samourai.wallet_201/classes7.dex and /tmp/fromBuild_com.samourai.wallet_201/classes7.dex differ
Files /tmp/fromPlay_com.samourai.wallet_201/classes.dex and /tmp/fromBuild_com.samourai.wallet_201/classes.dex differ
Files /tmp/fromPlay_com.samourai.wallet_201/DebugProbesKt.bin and /tmp/fromBuild_com.samourai.wallet_201/DebugProbesKt.bin differ
Files /tmp/fromPlay_com.samourai.wallet_201/kotlin/annotation/annotation.kotlin_builtins and /tmp/fromBuild_com.samourai.wallet_201/kotlin/annotation/annotation.kotlin_builtins differ
Files /tmp/fromPlay_com.samourai.wallet_201/kotlin/kotlin.kotlin_builtins and /tmp/fromBuild_com.samourai.wallet_201/kotlin/kotlin.kotlin_builtins differ
Files /tmp/fromPlay_com.samourai.wallet_201/kotlin/ranges/ranges.kotlin_builtins and /tmp/fromBuild_com.samourai.wallet_201/kotlin/ranges/ranges.kotlin_builtins differ
Files /tmp/fromPlay_com.samourai.wallet_201/kotlin/reflect/reflect.kotlin_builtins and /tmp/fromBuild_com.samourai.wallet_201/kotlin/reflect/reflect.kotlin_builtins differ
Files /tmp/fromPlay_com.samourai.wallet_201/kotlin-tooling-metadata.json and /tmp/fromBuild_com.samourai.wallet_201/kotlin-tooling-metadata.json differ
Only in /tmp/fromBuild_com.samourai.wallet_201/lib/arm64-v8a: libKmpTor.so
Only in /tmp/fromBuild_com.samourai.wallet_201/lib/armeabi-v7a: libKmpTor.so
Only in /tmp/fromBuild_com.samourai.wallet_201/lib/x86: libKmpTor.so
Only in /tmp/fromBuild_com.samourai.wallet_201/lib/x86_64: libKmpTor.so
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.activity_activity-compose.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.activity_activity-compose.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.activity_activity-ktx.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.activity_activity-ktx.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.activity_activity.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.activity_activity.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.annotation_annotation-experimental.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.annotation_annotation-experimental.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.arch.core_core-runtime.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.arch.core_core-runtime.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.animation_animation-core.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.animation_animation-core.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.animation_animation.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.animation_animation.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.foundation_foundation-layout.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.foundation_foundation-layout.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.foundation_foundation.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.foundation_foundation.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.runtime_runtime-livedata.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.runtime_runtime-livedata.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.runtime_runtime-saveable.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.runtime_runtime-saveable.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.runtime_runtime.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.runtime_runtime.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-geometry.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-geometry.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-graphics.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-graphics.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-text.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-text.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-tooling-data.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-tooling-data.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-tooling-preview.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-tooling-preview.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-tooling.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-tooling.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-unit.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-unit.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-util.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui-util.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.compose.ui_ui.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.core_core-ktx.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.core_core-ktx.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.core_core.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.core_core.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.customview_customview-poolingcontainer.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.customview_customview-poolingcontainer.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.databinding_viewbinding.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.databinding_viewbinding.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.emoji2_emoji2.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.emoji2_emoji2.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.emoji2_emoji2-views-helper.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.emoji2_emoji2-views-helper.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-livedata-core-ktx.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-livedata-core-ktx.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-livedata-core.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-livedata-core.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-livedata-ktx.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-livedata-ktx.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-livedata.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-livedata.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-process.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-process.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-runtime-ktx.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-runtime-ktx.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-runtime.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-runtime.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-service.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-service.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-viewmodel-compose.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-viewmodel-compose.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-viewmodel-ktx.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-viewmodel-ktx.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-viewmodel-savedstate.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-viewmodel-savedstate.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-viewmodel.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.lifecycle_lifecycle-viewmodel.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.profileinstaller_profileinstaller.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.profileinstaller_profileinstaller.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.savedstate_savedstate-ktx.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.savedstate_savedstate-ktx.version differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/androidx.savedstate_savedstate.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/androidx.savedstate_savedstate.version differ
Only in /tmp/fromPlay_com.samourai.wallet_201/META-INF: CERT.RSA
Only in /tmp/fromPlay_com.samourai.wallet_201/META-INF: CERT.SF
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/com/android/build/gradle/app-metadata.properties and /tmp/fromBuild_com.samourai.wallet_201/META-INF/com/android/build/gradle/app-metadata.properties differ
Files /tmp/fromPlay_com.samourai.wallet_201/META-INF/kotlinx_coroutines_android.version and /tmp/fromBuild_com.samourai.wallet_201/META-INF/kotlinx_coroutines_android.version differ
Only in /tmp/fromPlay_com.samourai.wallet_201/META-INF: MANIFEST.MF
Only in /tmp/fromBuild_com.samourai.wallet_201/META-INF: versions
Files /tmp/fromPlay_com.samourai.wallet_201/org/apache/commons/codec/language/bm/ash_lang.txt and /tmp/fromBuild_com.samourai.wallet_201/org/apache/commons/codec/language/bm/ash_lang.txt differ
Files /tmp/fromPlay_com.samourai.wallet_201/org/apache/commons/codec/language/bm/gen_lang.txt and /tmp/fromBuild_com.samourai.wallet_201/org/apache/commons/codec/language/bm/gen_lang.txt differ
Files /tmp/fromPlay_com.samourai.wallet_201/org/apache/commons/codec/language/bm/lang.txt and /tmp/fromBuild_com.samourai.wallet_201/org/apache/commons/codec/language/bm/lang.txt differ
Files /tmp/fromPlay_com.samourai.wallet_201/org/apache/commons/codec/language/bm/sep_lang.txt and /tmp/fromBuild_com.samourai.wallet_201/org/apache/commons/codec/language/bm/sep_lang.txt differ
Files /tmp/fromPlay_com.samourai.wallet_201/org/apache/commons/codec/language/dmrules.txt and /tmp/fromBuild_com.samourai.wallet_201/org/apache/commons/codec/language/dmrules.txt differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/0E.xml and /tmp/fromBuild_com.samourai.wallet_201/res/0E.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/0K.xml and /tmp/fromBuild_com.samourai.wallet_201/res/0K.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/0l.xml and /tmp/fromBuild_com.samourai.wallet_201/res/0l.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/0s.png and /tmp/fromBuild_com.samourai.wallet_201/res/0s.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/0S.xml and /tmp/fromBuild_com.samourai.wallet_201/res/0S.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/0W.xml and /tmp/fromBuild_com.samourai.wallet_201/res/0W.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 0Y.xml
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 0Z.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/15.png and /tmp/fromBuild_com.samourai.wallet_201/res/15.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/1E.xml and /tmp/fromBuild_com.samourai.wallet_201/res/1E.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 1f.xml
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 1g1.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/1g.png and /tmp/fromBuild_com.samourai.wallet_201/res/1g.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/1g.xml and /tmp/fromBuild_com.samourai.wallet_201/res/1g.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/1K1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/1K1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/1K.xml and /tmp/fromBuild_com.samourai.wallet_201/res/1K.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/1S.xml and /tmp/fromBuild_com.samourai.wallet_201/res/1S.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/-1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/-1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/1Z.xml and /tmp/fromBuild_com.samourai.wallet_201/res/1Z.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/21.xml and /tmp/fromBuild_com.samourai.wallet_201/res/21.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 25.ttf
Files /tmp/fromPlay_com.samourai.wallet_201/res/2c.png and /tmp/fromBuild_com.samourai.wallet_201/res/2c.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/2c.xml and /tmp/fromBuild_com.samourai.wallet_201/res/2c.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/2f.xml and /tmp/fromBuild_com.samourai.wallet_201/res/2f.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/2j.xml and /tmp/fromBuild_com.samourai.wallet_201/res/2j.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/2n.xml and /tmp/fromBuild_com.samourai.wallet_201/res/2n.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/2w.xml and /tmp/fromBuild_com.samourai.wallet_201/res/2w.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: -2.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/2X.png and /tmp/fromBuild_com.samourai.wallet_201/res/2X.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/3A.xml and /tmp/fromBuild_com.samourai.wallet_201/res/3A.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/3L.xml and /tmp/fromBuild_com.samourai.wallet_201/res/3L.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/-3.png and /tmp/fromBuild_com.samourai.wallet_201/res/-3.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/3r.xml and /tmp/fromBuild_com.samourai.wallet_201/res/3r.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/3R.xml and /tmp/fromBuild_com.samourai.wallet_201/res/3R.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/44.png and /tmp/fromBuild_com.samourai.wallet_201/res/44.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/45.png and /tmp/fromBuild_com.samourai.wallet_201/res/45.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/46.xml and /tmp/fromBuild_com.samourai.wallet_201/res/46.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/4G.xml and /tmp/fromBuild_com.samourai.wallet_201/res/4G.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/4I.xml and /tmp/fromBuild_com.samourai.wallet_201/res/4I.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/4p.png and /tmp/fromBuild_com.samourai.wallet_201/res/4p.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/4S.png and /tmp/fromBuild_com.samourai.wallet_201/res/4S.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/4x.xml and /tmp/fromBuild_com.samourai.wallet_201/res/4x.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/5B.png and /tmp/fromBuild_com.samourai.wallet_201/res/5B.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/5l.xml and /tmp/fromBuild_com.samourai.wallet_201/res/5l.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/5O.xml and /tmp/fromBuild_com.samourai.wallet_201/res/5O.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 5P.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/5u.png and /tmp/fromBuild_com.samourai.wallet_201/res/5u.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 5v.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/5W.png and /tmp/fromBuild_com.samourai.wallet_201/res/5W.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/61.xml and /tmp/fromBuild_com.samourai.wallet_201/res/61.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/66.xml and /tmp/fromBuild_com.samourai.wallet_201/res/66.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 6A.xml
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 6d.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/6-.png and /tmp/fromBuild_com.samourai.wallet_201/res/6-.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 6P.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/6W.xml and /tmp/fromBuild_com.samourai.wallet_201/res/6W.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/6x.xml and /tmp/fromBuild_com.samourai.wallet_201/res/6x.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 71.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/75.png and /tmp/fromBuild_com.samourai.wallet_201/res/75.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/7B.xml and /tmp/fromBuild_com.samourai.wallet_201/res/7B.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/7G.xml and /tmp/fromBuild_com.samourai.wallet_201/res/7G.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/7J.png and /tmp/fromBuild_com.samourai.wallet_201/res/7J.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 7m.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/7R.xml and /tmp/fromBuild_com.samourai.wallet_201/res/7R.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 7V.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/-7.xml and /tmp/fromBuild_com.samourai.wallet_201/res/-7.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/82.xml and /tmp/fromBuild_com.samourai.wallet_201/res/82.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/8b.png and /tmp/fromBuild_com.samourai.wallet_201/res/8b.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/8c.png and /tmp/fromBuild_com.samourai.wallet_201/res/8c.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/8F.png and /tmp/fromBuild_com.samourai.wallet_201/res/8F.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/8j.png and /tmp/fromBuild_com.samourai.wallet_201/res/8j.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/8M.png and /tmp/fromBuild_com.samourai.wallet_201/res/8M.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: 8t.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/8X.xml and /tmp/fromBuild_com.samourai.wallet_201/res/8X.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/92.png and /tmp/fromBuild_com.samourai.wallet_201/res/92.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/96.xml and /tmp/fromBuild_com.samourai.wallet_201/res/96.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9a.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9a.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9D.png and /tmp/fromBuild_com.samourai.wallet_201/res/9D.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9E1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9E1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9E.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9E.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9j.png and /tmp/fromBuild_com.samourai.wallet_201/res/9j.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9J.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9J.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9k.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9k.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9K.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9K.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9m.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9m.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9O.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9O.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9V1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9V1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9V.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9V.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9w.png and /tmp/fromBuild_com.samourai.wallet_201/res/9w.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9X.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9X.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/9z.xml and /tmp/fromBuild_com.samourai.wallet_201/res/9z.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/a0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/a0.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/A0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/A0.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/a1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/a1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/A1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/A1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ab.png and /tmp/fromBuild_com.samourai.wallet_201/res/Ab.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/AB.xml and /tmp/fromBuild_com.samourai.wallet_201/res/AB.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Ac.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ae.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ae.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/AE.xml and /tmp/fromBuild_com.samourai.wallet_201/res/AE.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Ag.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/aG.xml and /tmp/fromBuild_com.samourai.wallet_201/res/aG.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/AG.xml and /tmp/fromBuild_com.samourai.wallet_201/res/AG.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/AI.xml and /tmp/fromBuild_com.samourai.wallet_201/res/AI.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ak.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ak.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Al.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/AN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/AN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ap.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ap.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: aR.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/as.png and /tmp/fromBuild_com.samourai.wallet_201/res/as.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/aT.xml and /tmp/fromBuild_com.samourai.wallet_201/res/aT.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: aU.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/A_.xml and /tmp/fromBuild_com.samourai.wallet_201/res/A_.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/B0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/B0.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Be.gz
Files /tmp/fromPlay_com.samourai.wallet_201/res/Be.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Be.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: bi.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/Bi.png and /tmp/fromBuild_com.samourai.wallet_201/res/Bi.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/BI.png and /tmp/fromBuild_com.samourai.wallet_201/res/BI.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Bi.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Bi.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/bL.xml and /tmp/fromBuild_com.samourai.wallet_201/res/bL.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/_B.png and /tmp/fromBuild_com.samourai.wallet_201/res/_B.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: BT.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/bT.xml and /tmp/fromBuild_com.samourai.wallet_201/res/bT.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/BT.xml and /tmp/fromBuild_com.samourai.wallet_201/res/BT.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Bv.png and /tmp/fromBuild_com.samourai.wallet_201/res/Bv.png differ
Only in /tmp/fromPlay_com.samourai.wallet_201/res: BW1.xml
Only in /tmp/fromBuild_com.samourai.wallet_201/res: bw.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/BW.xml and /tmp/fromBuild_com.samourai.wallet_201/res/BW.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/By.xml and /tmp/fromBuild_com.samourai.wallet_201/res/By.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Bz.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Bz.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/c6.xml and /tmp/fromBuild_com.samourai.wallet_201/res/c6.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/cA.xml and /tmp/fromBuild_com.samourai.wallet_201/res/cA.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ci.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ci.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Cj.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Cj.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Ck.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/cm1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/cm1.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: cm2.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/cm.xml and /tmp/fromBuild_com.samourai.wallet_201/res/cm.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: cN.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_background_cache_hint_selector_material_dark.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_background_cache_hint_selector_material_dark.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_background_cache_hint_selector_material_light.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_background_cache_hint_selector_material_light.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_hint_foreground_material_dark.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_hint_foreground_material_dark.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_hint_foreground_material_light.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_hint_foreground_material_light.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_primary_text_disable_only_material_dark.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_primary_text_disable_only_material_dark.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_primary_text_disable_only_material_light.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_primary_text_disable_only_material_light.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_primary_text_material_dark.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_primary_text_material_dark.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_primary_text_material_light.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_primary_text_material_light.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_secondary_text_material_dark.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_secondary_text_material_dark.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/abc_secondary_text_material_light.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/abc_secondary_text_material_light.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/design_box_stroke_color.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/design_box_stroke_color.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_dark_default_color_primary_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_dark_default_color_primary_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_dark_default_color_secondary_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_dark_default_color_secondary_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_dark_highlighted_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_dark_highlighted_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_dark_hint_foreground.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_dark_hint_foreground.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_dark_primary_text_disable_only.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_dark_primary_text_disable_only.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_default_color_primary_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_default_color_primary_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_default_color_secondary_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_default_color_secondary_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_highlighted_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_highlighted_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_hint_foreground.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_hint_foreground.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/m3_primary_text_disable_only.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/m3_primary_text_disable_only.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/switch_thumb_material_dark.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/switch_thumb_material_dark.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color/switch_thumb_material_light.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color/switch_thumb_material_light.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_default_color_primary_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_default_color_primary_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_default_color_secondary_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_default_color_secondary_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_highlighted_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_highlighted_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_hint_foreground.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_hint_foreground.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_primary_text_disable_only.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_dark_primary_text_disable_only.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_default_color_primary_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_default_color_primary_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_default_color_secondary_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_default_color_secondary_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_highlighted_text.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_highlighted_text.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_hint_foreground.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_hint_foreground.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/color-v31/m3_dynamic_primary_text_disable_only.xml and /tmp/fromBuild_com.samourai.wallet_201/res/color-v31/m3_dynamic_primary_text_disable_only.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/CO.xml and /tmp/fromBuild_com.samourai.wallet_201/res/CO.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/CR1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/CR1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/CR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/CR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/cs.xml and /tmp/fromBuild_com.samourai.wallet_201/res/cs.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/CV.png and /tmp/fromBuild_com.samourai.wallet_201/res/CV.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/cv.xml and /tmp/fromBuild_com.samourai.wallet_201/res/cv.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/cV.xml and /tmp/fromBuild_com.samourai.wallet_201/res/cV.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/cX.png and /tmp/fromBuild_com.samourai.wallet_201/res/cX.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/cy.xml and /tmp/fromBuild_com.samourai.wallet_201/res/cy.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/d1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/d1.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: D-1.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/d4.png and /tmp/fromBuild_com.samourai.wallet_201/res/d4.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/dA.png and /tmp/fromBuild_com.samourai.wallet_201/res/dA.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/DB.xml and /tmp/fromBuild_com.samourai.wallet_201/res/DB.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/dd.png and /tmp/fromBuild_com.samourai.wallet_201/res/dd.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/de.xml and /tmp/fromBuild_com.samourai.wallet_201/res/de.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/df.xml and /tmp/fromBuild_com.samourai.wallet_201/res/df.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/dg.png and /tmp/fromBuild_com.samourai.wallet_201/res/dg.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/DG.xml and /tmp/fromBuild_com.samourai.wallet_201/res/DG.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/dH.png and /tmp/fromBuild_com.samourai.wallet_201/res/dH.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/dO.xml and /tmp/fromBuild_com.samourai.wallet_201/res/dO.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/d-.png and /tmp/fromBuild_com.samourai.wallet_201/res/d-.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Dq.png and /tmp/fromBuild_com.samourai.wallet_201/res/Dq.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/dT.xml and /tmp/fromBuild_com.samourai.wallet_201/res/dT.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/du.png and /tmp/fromBuild_com.samourai.wallet_201/res/du.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/D-.xml and /tmp/fromBuild_com.samourai.wallet_201/res/D-.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/dX.xml and /tmp/fromBuild_com.samourai.wallet_201/res/dX.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/e0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/e0.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/E1.png and /tmp/fromBuild_com.samourai.wallet_201/res/E1.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/E3.xml and /tmp/fromBuild_com.samourai.wallet_201/res/E3.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/EA.png and /tmp/fromBuild_com.samourai.wallet_201/res/EA.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/eA.xml and /tmp/fromBuild_com.samourai.wallet_201/res/eA.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Ec.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/ej.xml and /tmp/fromBuild_com.samourai.wallet_201/res/ej.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/eK1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/eK1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/eK.xml and /tmp/fromBuild_com.samourai.wallet_201/res/eK.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Em.png and /tmp/fromBuild_com.samourai.wallet_201/res/Em.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/eN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/eN.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: En.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/EN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/EN.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: EP.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/Er.png and /tmp/fromBuild_com.samourai.wallet_201/res/Er.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/er.xml and /tmp/fromBuild_com.samourai.wallet_201/res/er.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ES.png and /tmp/fromBuild_com.samourai.wallet_201/res/ES.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: es.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/eW.xml and /tmp/fromBuild_com.samourai.wallet_201/res/eW.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: eY.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/f0.png and /tmp/fromBuild_com.samourai.wallet_201/res/f0.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/f6.xml and /tmp/fromBuild_com.samourai.wallet_201/res/f6.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/F8.xml and /tmp/fromBuild_com.samourai.wallet_201/res/F8.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/fe.xml and /tmp/fromBuild_com.samourai.wallet_201/res/fe.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Ff.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/fg.xml and /tmp/fromBuild_com.samourai.wallet_201/res/fg.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/fH.png and /tmp/fromBuild_com.samourai.wallet_201/res/fH.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/FK.xml and /tmp/fromBuild_com.samourai.wallet_201/res/FK.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: FN.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/fO.png and /tmp/fromBuild_com.samourai.wallet_201/res/fO.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Fp.png and /tmp/fromBuild_com.samourai.wallet_201/res/Fp.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: FQ.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/FR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/FR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/FS.png and /tmp/fromBuild_com.samourai.wallet_201/res/FS.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/fS.xml and /tmp/fromBuild_com.samourai.wallet_201/res/fS.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/FT.xml and /tmp/fromBuild_com.samourai.wallet_201/res/FT.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/fu.xml and /tmp/fromBuild_com.samourai.wallet_201/res/fu.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Fu.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Fu.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/f_.xml and /tmp/fromBuild_com.samourai.wallet_201/res/f_.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/fY.xml and /tmp/fromBuild_com.samourai.wallet_201/res/fY.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Fz.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Fz.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: G2.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/g3.xml and /tmp/fromBuild_com.samourai.wallet_201/res/g3.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/g4.xml and /tmp/fromBuild_com.samourai.wallet_201/res/g4.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/gb.xml and /tmp/fromBuild_com.samourai.wallet_201/res/gb.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Gc.png and /tmp/fromBuild_com.samourai.wallet_201/res/Gc.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/gd.xml and /tmp/fromBuild_com.samourai.wallet_201/res/gd.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/gD.xml and /tmp/fromBuild_com.samourai.wallet_201/res/gD.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/GE.xml and /tmp/fromBuild_com.samourai.wallet_201/res/GE.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/gi.xml and /tmp/fromBuild_com.samourai.wallet_201/res/gi.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Gk.png and /tmp/fromBuild_com.samourai.wallet_201/res/Gk.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/gN.png and /tmp/fromBuild_com.samourai.wallet_201/res/gN.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Go.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Go.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/gq.xml and /tmp/fromBuild_com.samourai.wallet_201/res/gq.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/GQ.xml and /tmp/fromBuild_com.samourai.wallet_201/res/GQ.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: gr.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/GR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/GR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/gt.png and /tmp/fromBuild_com.samourai.wallet_201/res/gt.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/gu.xml and /tmp/fromBuild_com.samourai.wallet_201/res/gu.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/g-.xml and /tmp/fromBuild_com.samourai.wallet_201/res/g-.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/_G.xml and /tmp/fromBuild_com.samourai.wallet_201/res/_G.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: GY.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/gz.png and /tmp/fromBuild_com.samourai.wallet_201/res/gz.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/h5.xml and /tmp/fromBuild_com.samourai.wallet_201/res/h5.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/h8.xml and /tmp/fromBuild_com.samourai.wallet_201/res/h8.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/HA.png and /tmp/fromBuild_com.samourai.wallet_201/res/HA.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ha.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ha.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/hb.xml and /tmp/fromBuild_com.samourai.wallet_201/res/hb.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/HF.xml and /tmp/fromBuild_com.samourai.wallet_201/res/HF.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/hm.xml and /tmp/fromBuild_com.samourai.wallet_201/res/hm.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/hn.png and /tmp/fromBuild_com.samourai.wallet_201/res/hn.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/hP1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/hP1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/-h.png and /tmp/fromBuild_com.samourai.wallet_201/res/-h.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/HP.xml and /tmp/fromBuild_com.samourai.wallet_201/res/HP.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/hu.xml and /tmp/fromBuild_com.samourai.wallet_201/res/hu.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/hv.xml and /tmp/fromBuild_com.samourai.wallet_201/res/hv.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: _H.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/Hx.png and /tmp/fromBuild_com.samourai.wallet_201/res/Hx.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/I0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/I0.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/I3.xml and /tmp/fromBuild_com.samourai.wallet_201/res/I3.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/i7.xml and /tmp/fromBuild_com.samourai.wallet_201/res/i7.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/iB.xml and /tmp/fromBuild_com.samourai.wallet_201/res/iB.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/IE.xml and /tmp/fromBuild_com.samourai.wallet_201/res/IE.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/iI.xml and /tmp/fromBuild_com.samourai.wallet_201/res/iI.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ik.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ik.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/iN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/iN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/iQ.xml and /tmp/fromBuild_com.samourai.wallet_201/res/iQ.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/IR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/IR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/IV.xml and /tmp/fromBuild_com.samourai.wallet_201/res/IV.xml differ
Only in /tmp/fromPlay_com.samourai.wallet_201/res: Iw.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/Iy.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Iy.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/J0.png and /tmp/fromBuild_com.samourai.wallet_201/res/J0.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/j6.xml and /tmp/fromBuild_com.samourai.wallet_201/res/j6.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/J7.xml and /tmp/fromBuild_com.samourai.wallet_201/res/J7.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Jc.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Jc.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/jD.xml and /tmp/fromBuild_com.samourai.wallet_201/res/jD.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/JD.xml and /tmp/fromBuild_com.samourai.wallet_201/res/JD.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/JF.xml and /tmp/fromBuild_com.samourai.wallet_201/res/JF.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/jG.xml and /tmp/fromBuild_com.samourai.wallet_201/res/jG.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: jH.gz
Files /tmp/fromPlay_com.samourai.wallet_201/res/-j.png and /tmp/fromBuild_com.samourai.wallet_201/res/-j.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Jp.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Jp.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/JP.xml and /tmp/fromBuild_com.samourai.wallet_201/res/JP.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Jq.png and /tmp/fromBuild_com.samourai.wallet_201/res/Jq.png differ
Only in /tmp/fromPlay_com.samourai.wallet_201/res: JU.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/Jw.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Jw.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/JW.xml and /tmp/fromBuild_com.samourai.wallet_201/res/JW.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: j_.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/Jz.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Jz.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/k0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/k0.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/K3.xml and /tmp/fromBuild_com.samourai.wallet_201/res/K3.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/K5.xml and /tmp/fromBuild_com.samourai.wallet_201/res/K5.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/k81.xml and /tmp/fromBuild_com.samourai.wallet_201/res/k81.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/k8.xml and /tmp/fromBuild_com.samourai.wallet_201/res/k8.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ka.png and /tmp/fromBuild_com.samourai.wallet_201/res/ka.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ki.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ki.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Kl.png and /tmp/fromBuild_com.samourai.wallet_201/res/Kl.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/kn.xml and /tmp/fromBuild_com.samourai.wallet_201/res/kn.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/kN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/kN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Kp.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Kp.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: kS.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/KT.xml and /tmp/fromBuild_com.samourai.wallet_201/res/KT.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/kV.xml and /tmp/fromBuild_com.samourai.wallet_201/res/kV.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/_k.xml and /tmp/fromBuild_com.samourai.wallet_201/res/_k.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/k_.xml and /tmp/fromBuild_com.samourai.wallet_201/res/k_.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/LA.png and /tmp/fromBuild_com.samourai.wallet_201/res/LA.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/lE.xml and /tmp/fromBuild_com.samourai.wallet_201/res/lE.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Lf.png and /tmp/fromBuild_com.samourai.wallet_201/res/Lf.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ll.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ll.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: LO.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/lR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/lR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ls.xml and /tmp/fromBuild_com.samourai.wallet_201/res/ls.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/LS.xml and /tmp/fromBuild_com.samourai.wallet_201/res/LS.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/lT.xml and /tmp/fromBuild_com.samourai.wallet_201/res/lT.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/lv.png and /tmp/fromBuild_com.samourai.wallet_201/res/lv.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: LW.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/L-.xml and /tmp/fromBuild_com.samourai.wallet_201/res/L-.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/LX.png and /tmp/fromBuild_com.samourai.wallet_201/res/LX.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/m2.png and /tmp/fromBuild_com.samourai.wallet_201/res/m2.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/m8.xml and /tmp/fromBuild_com.samourai.wallet_201/res/m8.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/mA.png and /tmp/fromBuild_com.samourai.wallet_201/res/mA.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ma.png and /tmp/fromBuild_com.samourai.wallet_201/res/Ma.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/mA.xml and /tmp/fromBuild_com.samourai.wallet_201/res/mA.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: MD.png
Only in /tmp/fromBuild_com.samourai.wallet_201/res: md.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/Mg.png and /tmp/fromBuild_com.samourai.wallet_201/res/Mg.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/mK.png and /tmp/fromBuild_com.samourai.wallet_201/res/mK.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ml.xml and /tmp/fromBuild_com.samourai.wallet_201/res/ml.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/MO.xml and /tmp/fromBuild_com.samourai.wallet_201/res/MO.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/mr.xml and /tmp/fromBuild_com.samourai.wallet_201/res/mr.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Mt.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Mt.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/MU.xml and /tmp/fromBuild_com.samourai.wallet_201/res/MU.xml differ
Only in /tmp/fromPlay_com.samourai.wallet_201/res: N3.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/nD.png and /tmp/fromBuild_com.samourai.wallet_201/res/nD.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/nL.png and /tmp/fromBuild_com.samourai.wallet_201/res/nL.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/NM.xml and /tmp/fromBuild_com.samourai.wallet_201/res/NM.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/NN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/NN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/n-.png and /tmp/fromBuild_com.samourai.wallet_201/res/n-.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/nP.xml and /tmp/fromBuild_com.samourai.wallet_201/res/nP.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/nu.xml and /tmp/fromBuild_com.samourai.wallet_201/res/nu.xml differ
Only in /tmp/fromPlay_com.samourai.wallet_201/res: Nv.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/nz.xml and /tmp/fromBuild_com.samourai.wallet_201/res/nz.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/o8.png and /tmp/fromBuild_com.samourai.wallet_201/res/o8.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Od.png and /tmp/fromBuild_com.samourai.wallet_201/res/Od.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/OD.xml and /tmp/fromBuild_com.samourai.wallet_201/res/OD.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: oi.ttf
Files /tmp/fromPlay_com.samourai.wallet_201/res/oi.xml and /tmp/fromBuild_com.samourai.wallet_201/res/oi.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Oi.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Oi.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/oJ.xml and /tmp/fromBuild_com.samourai.wallet_201/res/oJ.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: OM.png
Only in /tmp/fromBuild_com.samourai.wallet_201/res: on.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/o-.png and /tmp/fromBuild_com.samourai.wallet_201/res/o-.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/oP.xml and /tmp/fromBuild_com.samourai.wallet_201/res/oP.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: or.ttf
Only in /tmp/fromBuild_com.samourai.wallet_201/res: OX1.png
Only in /tmp/fromBuild_com.samourai.wallet_201/res: OX.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/oY.xml and /tmp/fromBuild_com.samourai.wallet_201/res/oY.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/OZ.xml and /tmp/fromBuild_com.samourai.wallet_201/res/OZ.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/p0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/p0.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/p3.xml and /tmp/fromBuild_com.samourai.wallet_201/res/p3.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: p8.png
Only in /tmp/fromBuild_com.samourai.wallet_201/res: pa1.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/pa.xml and /tmp/fromBuild_com.samourai.wallet_201/res/pa.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/pE.xml and /tmp/fromBuild_com.samourai.wallet_201/res/pE.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/pI.png and /tmp/fromBuild_com.samourai.wallet_201/res/pI.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: pj.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/PL.png and /tmp/fromBuild_com.samourai.wallet_201/res/PL.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/-_.png and /tmp/fromBuild_com.samourai.wallet_201/res/-_.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/pN.png and /tmp/fromBuild_com.samourai.wallet_201/res/pN.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/PQ.xml and /tmp/fromBuild_com.samourai.wallet_201/res/PQ.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/PT.xml and /tmp/fromBuild_com.samourai.wallet_201/res/PT.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/pV.png and /tmp/fromBuild_com.samourai.wallet_201/res/pV.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/pV.xml and /tmp/fromBuild_com.samourai.wallet_201/res/pV.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/PV.xml and /tmp/fromBuild_com.samourai.wallet_201/res/PV.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qC.png and /tmp/fromBuild_com.samourai.wallet_201/res/qC.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/QD.png and /tmp/fromBuild_com.samourai.wallet_201/res/QD.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qF.png and /tmp/fromBuild_com.samourai.wallet_201/res/qF.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qH.xml and /tmp/fromBuild_com.samourai.wallet_201/res/qH.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Qh.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Qh.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/QH.xml and /tmp/fromBuild_com.samourai.wallet_201/res/QH.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/QN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/QN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qO.xml and /tmp/fromBuild_com.samourai.wallet_201/res/qO.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/_q.png and /tmp/fromBuild_com.samourai.wallet_201/res/_q.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Q-.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/qP.xml and /tmp/fromBuild_com.samourai.wallet_201/res/qP.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qS.png and /tmp/fromBuild_com.samourai.wallet_201/res/qS.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qS.xml and /tmp/fromBuild_com.samourai.wallet_201/res/qS.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/QS.xml and /tmp/fromBuild_com.samourai.wallet_201/res/QS.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qy.png and /tmp/fromBuild_com.samourai.wallet_201/res/qy.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qz1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/qz1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/QZ.png and /tmp/fromBuild_com.samourai.wallet_201/res/QZ.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/qz.xml and /tmp/fromBuild_com.samourai.wallet_201/res/qz.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/QZ.xml and /tmp/fromBuild_com.samourai.wallet_201/res/QZ.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/r2.xml and /tmp/fromBuild_com.samourai.wallet_201/res/r2.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/R5.xml and /tmp/fromBuild_com.samourai.wallet_201/res/R5.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/R7.xml and /tmp/fromBuild_com.samourai.wallet_201/res/R7.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/rh.png and /tmp/fromBuild_com.samourai.wallet_201/res/rh.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/RJ.png and /tmp/fromBuild_com.samourai.wallet_201/res/RJ.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/rK.xml and /tmp/fromBuild_com.samourai.wallet_201/res/rK.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/RK.xml and /tmp/fromBuild_com.samourai.wallet_201/res/RK.xml differ
Only in /tmp/fromPlay_com.samourai.wallet_201/res: rM.txt
Files /tmp/fromPlay_com.samourai.wallet_201/res/RM.xml and /tmp/fromBuild_com.samourai.wallet_201/res/RM.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ro.png and /tmp/fromBuild_com.samourai.wallet_201/res/ro.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/_r.png and /tmp/fromBuild_com.samourai.wallet_201/res/_r.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/rR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/rR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/rU.xml and /tmp/fromBuild_com.samourai.wallet_201/res/rU.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/rw.xml and /tmp/fromBuild_com.samourai.wallet_201/res/rw.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Rw.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Rw.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/rx.png and /tmp/fromBuild_com.samourai.wallet_201/res/rx.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Rx.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Rx.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/S1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/S1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/s7.xml and /tmp/fromBuild_com.samourai.wallet_201/res/s7.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/s8.xml and /tmp/fromBuild_com.samourai.wallet_201/res/s8.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/S8.xml and /tmp/fromBuild_com.samourai.wallet_201/res/S8.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/SE.xml and /tmp/fromBuild_com.samourai.wallet_201/res/SE.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/SF.xml and /tmp/fromBuild_com.samourai.wallet_201/res/SF.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/sH.png and /tmp/fromBuild_com.samourai.wallet_201/res/sH.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Sh.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Sh.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/SN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/SN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/sq.xml and /tmp/fromBuild_com.samourai.wallet_201/res/sq.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/sr.png and /tmp/fromBuild_com.samourai.wallet_201/res/sr.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Sr.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Sr.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/St.xml and /tmp/fromBuild_com.samourai.wallet_201/res/St.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Su.png and /tmp/fromBuild_com.samourai.wallet_201/res/Su.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/sy.png and /tmp/fromBuild_com.samourai.wallet_201/res/sy.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/t1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/t1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tb.png and /tmp/fromBuild_com.samourai.wallet_201/res/tb.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: td.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/tI.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tI.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tj1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tj1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tj.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tj.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tJ.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tJ.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/TJ.xml and /tmp/fromBuild_com.samourai.wallet_201/res/TJ.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tK.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tK.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tL.png and /tmp/fromBuild_com.samourai.wallet_201/res/tL.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Tl.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/Tm.png and /tmp/fromBuild_com.samourai.wallet_201/res/Tm.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tO.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tO.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Tp.png and /tmp/fromBuild_com.samourai.wallet_201/res/Tp.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tp.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tp.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/TP.xml and /tmp/fromBuild_com.samourai.wallet_201/res/TP.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tr.png and /tmp/fromBuild_com.samourai.wallet_201/res/tr.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Tr.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/Tt.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Tt.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tu.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tu.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tU.xml and /tmp/fromBuild_com.samourai.wallet_201/res/tU.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/tW.png and /tmp/fromBuild_com.samourai.wallet_201/res/tW.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ty.png and /tmp/fromBuild_com.samourai.wallet_201/res/ty.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/u0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/u0.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/U0.xml and /tmp/fromBuild_com.samourai.wallet_201/res/U0.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/U7.xml and /tmp/fromBuild_com.samourai.wallet_201/res/U7.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/U9.xml and /tmp/fromBuild_com.samourai.wallet_201/res/U9.xml differ
Only in /tmp/fromPlay_com.samourai.wallet_201/res: UC.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/uE.png and /tmp/fromBuild_com.samourai.wallet_201/res/uE.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/UF.png and /tmp/fromBuild_com.samourai.wallet_201/res/UF.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/uh.png and /tmp/fromBuild_com.samourai.wallet_201/res/uh.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/uI.png and /tmp/fromBuild_com.samourai.wallet_201/res/uI.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/uj.png and /tmp/fromBuild_com.samourai.wallet_201/res/uj.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Um.png and /tmp/fromBuild_com.samourai.wallet_201/res/Um.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/UR.png and /tmp/fromBuild_com.samourai.wallet_201/res/UR.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/uR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/uR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ut.png and /tmp/fromBuild_com.samourai.wallet_201/res/Ut.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/V3.xml and /tmp/fromBuild_com.samourai.wallet_201/res/V3.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/v9.png and /tmp/fromBuild_com.samourai.wallet_201/res/v9.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/v9.xml and /tmp/fromBuild_com.samourai.wallet_201/res/v9.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/vf.xml and /tmp/fromBuild_com.samourai.wallet_201/res/vf.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/vG.xml and /tmp/fromBuild_com.samourai.wallet_201/res/vG.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Vi.png and /tmp/fromBuild_com.samourai.wallet_201/res/Vi.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: vi.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/Vl.png and /tmp/fromBuild_com.samourai.wallet_201/res/Vl.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/vL.xml and /tmp/fromBuild_com.samourai.wallet_201/res/vL.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Vl.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Vl.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: vq1.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/vq.xml and /tmp/fromBuild_com.samourai.wallet_201/res/vq.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: VW.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/w5.png and /tmp/fromBuild_com.samourai.wallet_201/res/w5.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: W5.png
Only in /tmp/fromBuild_com.samourai.wallet_201/res: w7.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/w9.xml and /tmp/fromBuild_com.samourai.wallet_201/res/w9.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/wb.png and /tmp/fromBuild_com.samourai.wallet_201/res/wb.png differ
Only in /tmp/fromPlay_com.samourai.wallet_201/res: Wj1.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/Wj.png and /tmp/fromBuild_com.samourai.wallet_201/res/Wj.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/wl.png and /tmp/fromBuild_com.samourai.wallet_201/res/wl.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/wO.png and /tmp/fromBuild_com.samourai.wallet_201/res/wO.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Wo.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Wo.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/W-.png and /tmp/fromBuild_com.samourai.wallet_201/res/W-.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ws.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ws.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/WU.xml and /tmp/fromBuild_com.samourai.wallet_201/res/WU.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/WY.png and /tmp/fromBuild_com.samourai.wallet_201/res/WY.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: X9.ttf
Files /tmp/fromPlay_com.samourai.wallet_201/res/xa.xml and /tmp/fromBuild_com.samourai.wallet_201/res/xa.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/xb.xml and /tmp/fromBuild_com.samourai.wallet_201/res/xb.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/xd.xml and /tmp/fromBuild_com.samourai.wallet_201/res/xd.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/xD.xml and /tmp/fromBuild_com.samourai.wallet_201/res/xD.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/xe.png and /tmp/fromBuild_com.samourai.wallet_201/res/xe.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Xe.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Xe.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/xk.png and /tmp/fromBuild_com.samourai.wallet_201/res/xk.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Xk.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Xk.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Xl.xml
Only in /tmp/fromBuild_com.samourai.wallet_201/res: __.xml
Files /tmp/fromPlay_com.samourai.wallet_201/res/XM.xml and /tmp/fromBuild_com.samourai.wallet_201/res/XM.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/xN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/xN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/X_.png and /tmp/fromBuild_com.samourai.wallet_201/res/X_.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/xs.xml and /tmp/fromBuild_com.samourai.wallet_201/res/xs.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/xz.png and /tmp/fromBuild_com.samourai.wallet_201/res/xz.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Y1.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Y1.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Y2.png and /tmp/fromBuild_com.samourai.wallet_201/res/Y2.png differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Y3.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/y6.xml and /tmp/fromBuild_com.samourai.wallet_201/res/y6.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: Y9.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/yA.xml and /tmp/fromBuild_com.samourai.wallet_201/res/yA.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: YD.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/Ye.xml and /tmp/fromBuild_com.samourai.wallet_201/res/Ye.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/yf.xml and /tmp/fromBuild_com.samourai.wallet_201/res/yf.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/yl.xml and /tmp/fromBuild_com.samourai.wallet_201/res/yl.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/yn.png and /tmp/fromBuild_com.samourai.wallet_201/res/yn.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/YN.xml and /tmp/fromBuild_com.samourai.wallet_201/res/YN.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/YO.xml and /tmp/fromBuild_com.samourai.wallet_201/res/YO.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Yp.png and /tmp/fromBuild_com.samourai.wallet_201/res/Yp.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/YR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/YR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/yV.xml and /tmp/fromBuild_com.samourai.wallet_201/res/yV.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/_y.xml and /tmp/fromBuild_com.samourai.wallet_201/res/_y.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/yY.png and /tmp/fromBuild_com.samourai.wallet_201/res/yY.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/z5.xml and /tmp/fromBuild_com.samourai.wallet_201/res/z5.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zc.xml and /tmp/fromBuild_com.samourai.wallet_201/res/zc.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ZC.xml and /tmp/fromBuild_com.samourai.wallet_201/res/ZC.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zE.xml and /tmp/fromBuild_com.samourai.wallet_201/res/zE.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zg.png and /tmp/fromBuild_com.samourai.wallet_201/res/zg.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zG.xml and /tmp/fromBuild_com.samourai.wallet_201/res/zG.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zH.xml and /tmp/fromBuild_com.samourai.wallet_201/res/zH.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ZJ.png and /tmp/fromBuild_com.samourai.wallet_201/res/ZJ.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ZK.png and /tmp/fromBuild_com.samourai.wallet_201/res/ZK.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ZK.xml and /tmp/fromBuild_com.samourai.wallet_201/res/ZK.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: zL.png
Files /tmp/fromPlay_com.samourai.wallet_201/res/ZM.xml and /tmp/fromBuild_com.samourai.wallet_201/res/ZM.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zP.png and /tmp/fromBuild_com.samourai.wallet_201/res/zP.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zp.xml and /tmp/fromBuild_com.samourai.wallet_201/res/zp.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ZP.xml and /tmp/fromBuild_com.samourai.wallet_201/res/ZP.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zr.png and /tmp/fromBuild_com.samourai.wallet_201/res/zr.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zR.png and /tmp/fromBuild_com.samourai.wallet_201/res/zR.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ZR.png and /tmp/fromBuild_com.samourai.wallet_201/res/ZR.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/zR.xml and /tmp/fromBuild_com.samourai.wallet_201/res/zR.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/Zv.png and /tmp/fromBuild_com.samourai.wallet_201/res/Zv.png differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/ZW.xml and /tmp/fromBuild_com.samourai.wallet_201/res/ZW.xml differ
Files /tmp/fromPlay_com.samourai.wallet_201/res/-z.xml and /tmp/fromBuild_com.samourai.wallet_201/res/-z.xml differ
Only in /tmp/fromBuild_com.samourai.wallet_201/res: zz.png
Files /tmp/fromPlay_com.samourai.wallet_201/resources.arsc and /tmp/fromBuild_com.samourai.wallet_201/resources.arsc differ

Revision, tag (and its signature):

===== End Results =====
```

This product is **not verifiable**.
