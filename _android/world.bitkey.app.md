---
wsId: bitkeyBlock
title: Bitkey - Bitcoin Wallet
altTitle: 
authors:
- danny
users: 1000
appId: world.bitkey.app
appCountry: US
released: 2024-02-28
updated: 2024-12-05
version: 2024.74.1 (1)
stars: 4
ratings: 
reviews: 13
size: 
website: https://bitkey.world
repository: https://github.com/proto-at-block/bitkey
issue: 
icon: world.bitkey.app.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-12-07
signer: c0d0f9da7158cde788d0281e9ebd07034178165584d635f7ce17f77c037d961a
reviewArchive:
- date: 2024-09-23
  version: 2024.69.0 (4)
  appHash: 67c4d8ec5beec9b6424a39700e0fc9673f713a98d965a6cdd3ef4a968fd000af
  gitRevision: 3cb9e16e08babae6e2f6ce682158ba2aa6c603c5
  verdict: reproducible
- date: 2024-08-30
  version: 2024.68.0 (1)
  appHash: 0979d68dc323e95dbb5ddb4be259d7d0fcd83eccab4d5af5dd18a4632d216fa1
  gitRevision: 65f0d9d3018e6f4e8a32f53de5263b6c2e132964
  verdict: reproducible
- date: 2024-08-30
  version: 2024.67.0 (1)
  appHash: a3699344ebea4262a7d5652a6ea0a9bf45ab1b3a73423fae3e289c05f3c9ee72
  gitRevision: 3e0dace0287b9ad1ad11631f05bb5f067db5db6d
  verdict: reproducible
- date: 2024-07-26
  version: 2024.63.0 (4)
  appHash: d1adb1725e83e115c169f3676cee3b67fb97e044f6e8ba5be4c7dd88fe746de9
  gitRevision: 6ae7c72d480ca51b583f6b18d05516226e30f5a4
  verdict: reproducible
- date: 2024-03-23
  version: 2024.63.0 (2)
  appHash: 110568d39beb8b0ccb6fc0f4ed710c2d129392137acc9e97202d5ac1ee192125
  gitRevision: 93c2de0de2ff3717c59dffa274b444490b4a45d6
  verdict: reproducible
twitter: Bitkeyofficial
social:
- https://www.linkedin.com/company/bitkey-official
- https://www.facebook.com/profile.php?id=100088526238789
- https://www.instagram.com/ownbitkey
redirect_from: 
developerName: Block, Inc.
features:
- multiSignature

---

**Disclaimer**: The WalletScrutiny project is sponsored by Spiral, a subsidiary of Block.

<iframe width="560" height="315" src="https://www.youtube.com/embed/pZ-Yi7A-o_A?si=cP6zKgW7r-JosAb-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Analysis 

This is the **companion app** to the {% include walletLink.html wallet='hardware/blockhww' verdict='true' %}. It requires an NFC-capable phone, otherwise the app would not be installed.

<hr>

[**Release Notes**](https://bitkey.world/en-US/releases)

# Verified Builds

[Documentation](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/README.md) 

## Verification Update for version 2024.73.1 (2)

For this review, we encountered several difficulties with the build process.   

First, we tried applying the modifications suggested in [this](https://github.com/proto-at-block/bitkey/pull/4) PR and the build process did not complete. Thus, we could no longer test the app independent of a phone connected via USB to the build computer. 

Secondly, for the process to succeed, the build computer must have a stable internet connection with enough RAM. Otherwise, the build process would crash and reboot the computer.

Third, we used **Bitkey's own [verification script](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/verification/verify-android-apk)** to verify the build. This process requires a phone connected via USB to the build computer.

Fourth, we see in the sub-script [**normalize-apk-content**](https://github.com/proto-at-block/bitkey/blob/2c0dd04b9b434ae1d36747128471b26622f182c6/app/verifiable-build/android/verification/steps/normalize-apk-content#L26) that Bitkey excludes these signing-related files from comparison:

```
incomparable_files=(
    "AndroidManifest.xml"
    "stamp-cert-sha256"
    "BNDLTOOL.RSA"
    "BNDLTOOL.SF"
    "MANIFEST.MF"
    "EMERGENC.RSA"
    "EMERGENC.SF"
)
```

Files matching `\*/res/xml/splits\*.xml` are also excluded as seen in line 32 of **[normalize-apk-content](https://github.com/proto-at-block/bitkey/blob/2c0dd04b9b434ae1d36747128471b26622f182c6/app/verifiable-build/android/verification/steps/normalize-apk-content#L32)**

## Results

### arm64_v8a.apk

```
Binary files from-device/comparable/arm64_v8a/lib/arm64-v8a/libcore.so and locally-built/comparable/arm64_v8a/lib/arm64-v8a/libcore.so differ
```

Diffoscope results for: {% include diffoscope-modal.html label='libcore.so' url='/assets/diffoscope-results/android/world.bitkey.app/2024.73.1/arm64_v8a/diffo-arm64_v8a-libcore.so.html' %}

### base.apk

```
$ diff -r from-device/comparable/base locally-built/comparable/base
Only in locally-built/comparable/base/assets/composeResources/bitkey.shared.ui_core_public.generated.resources/drawable: bitcoin_badged.xml
Only in locally-built/comparable/base/assets/composeResources/bitkey.shared.ui_core_public.generated.resources/drawable: bitcoin_consolidation.xml
Only in locally-built/comparable/base/assets/composeResources/bitkey.shared.ui_core_public.generated.resources/drawable: bitkey_corian.webp
Only in locally-built/comparable/base/assets/composeResources/bitkey.shared.ui_core_public.generated.resources/drawable: small_icon_check_inheritance.xml
Only in locally-built/comparable/base/assets/composeResources/bitkey.shared.ui_core_public.generated.resources/drawable: small_icon_clock_hands.xml
Only in locally-built/comparable/base/assets/composeResources/bitkey.shared.ui_core_public.generated.resources/drawable: warning_badge.xml
Only in locally-built/comparable/base/assets/composeResources/bitkey.shared.ui_core_public.generated.resources/files: loader_badge.json
Binary files from-device/comparable/base/assets/dexopt/baseline.prof and locally-built/comparable/base/assets/dexopt/baseline.prof differ
Binary files from-device/comparable/base/assets/dexopt/baseline.profm and locally-built/comparable/base/assets/dexopt/baseline.profm differ
Binary files from-device/comparable/base/classes2.dex and locally-built/comparable/base/classes2.dex differ
Binary files from-device/comparable/base/classes.dex and locally-built/comparable/base/classes.dex differ
diff -r from-device/comparable/base/META-INF/androidx.compose.material3_material3.version locally-built/comparable/base/META-INF/androidx.compose.material3_material3.version
1c1
< 1.3.0
---
> 1.3.1
Only in locally-built/comparable/base/META-INF/services: ah.o
Only in from-device/comparable/base/META-INF/services: B8.a
Only in locally-built/comparable/base/META-INF/services: D8.a
Only in from-device/comparable/base/META-INF/services: De.e
Only in locally-built/comparable/base/META-INF/services: Fe.e
Only in from-device/comparable/base/META-INF/services: ge.g
Only in from-device/comparable/base/META-INF/services: Gf.c
Only in locally-built/comparable/base/META-INF/services: ie.g
Only in locally-built/comparable/base/META-INF/services: If.c
Only in from-device/comparable/base/META-INF/services: lg.g
Only in locally-built/comparable/base/META-INF/services: ng.g
Only in from-device/comparable/base/META-INF/services: Tg.B
Only in locally-built/comparable/base/META-INF/services: Vg.B
Only in from-device/comparable/base/META-INF/services: x8.d
Only in from-device/comparable/base/META-INF/services: Yg.o
Only in locally-built/comparable/base/META-INF/services: z8.d
Binary files from-device/comparable/base/META-INF/state-machine-ui-public_release.kotlin_module and locally-built/comparable/base/META-INF/state-machine-ui-public_release.kotlin_module differ
Binary files from-device/comparable/base/res/drawable/abc_btn_check_material_anim.xml and locally-built/comparable/base/res/drawable/abc_btn_check_material_anim.xml differ
Binary files from-device/comparable/base/res/drawable/abc_btn_radio_material_anim.xml and locally-built/comparable/base/res/drawable/abc_btn_radio_material_anim.xml differ
Only in locally-built/comparable/base/res/drawable: bitcoin_consolidation.xml
Binary files from-device/comparable/base/res/drawable/btn_checkbox_checked_to_unchecked_mtrl_animation.xml and locally-built/comparable/base/res/drawable/btn_checkbox_checked_to_unchecked_mtrl_animation.xml differ
Binary files from-device/comparable/base/res/drawable/btn_checkbox_unchecked_to_checked_mtrl_animation.xml and locally-built/comparable/base/res/drawable/btn_checkbox_unchecked_to_checked_mtrl_animation.xml differ
Binary files from-device/comparable/base/res/drawable/btn_radio_off_to_on_mtrl_animation.xml and locally-built/comparable/base/res/drawable/btn_radio_off_to_on_mtrl_animation.xml differ
Binary files from-device/comparable/base/res/drawable/btn_radio_on_to_off_mtrl_animation.xml and locally-built/comparable/base/res/drawable/btn_radio_on_to_off_mtrl_animation.xml differ
Binary files from-device/comparable/base/res/drawable/notification_bg_low.xml and locally-built/comparable/base/res/drawable/notification_bg_low.xml differ
Binary files from-device/comparable/base/res/drawable/notification_bg.xml and locally-built/comparable/base/res/drawable/notification_bg.xml differ
Binary files from-device/comparable/base/res/drawable/notification_tile_bg.xml and locally-built/comparable/base/res/drawable/notification_tile_bg.xml differ
Only in locally-built/comparable/base/res/drawable: warning_badge.xml
Binary files from-device/comparable/base/res/drawable-v23/compat_splash_screen.xml and locally-built/comparable/base/res/drawable-v23/compat_splash_screen.xml differ
Binary files from-device/comparable/base/res/mipmap-anydpi-v26/ic_launcher_round.xml and locally-built/comparable/base/res/mipmap-anydpi-v26/ic_launcher_round.xml differ
Binary files from-device/comparable/base/res/mipmap-anydpi-v26/ic_launcher.xml and locally-built/comparable/base/res/mipmap-anydpi-v26/ic_launcher.xml differ
Binary files from-device/comparable/base/resources.arsc and locally-built/comparable/base/resources.arsc differ
```

The diffs are too plenty that an in-depth diffoscope analysis would be too resource-intensive. 

### en.apk

```
$ diff -r from-device/comparable/en/ locally-built/comparable/en
Binary files from-device/comparable/en/resources.arsc and locally-built/comparable/en/resources.arsc differ
```

Diffoscope results for:{% include diffoscope-modal.html label='resources.arsc' url='/assets/diffoscope-results/android/world.bitkey.app/2024.73.1/en/diffo-en-resources.arsc.html' %}

### xxhdpi.apk

```
$ diff -r from-device/comparable/xxhdpi/ locally-built/comparable/xxhdpi/
Binary files from-device/comparable/xxhdpi/resources.arsc and locally-built/comparable/xxhdpi/resources.arsc differ
```

Diffoscope results for: {% include diffoscope-modal.html label='resources.arsc' url='/assets/diffoscope-results/android/world.bitkey.app/2024.73.1/xxhdpi/diffo-xxhdpi-resources.arsc.html' %}

The huge differences between the APKs lead us to the conclusion that version 2024.73.1(2) is **not verifiable**.

The [Nosbin build log, ](https://nosbin.com/nevent1qqsf5ta46x799sfw5cmydyrgkq6vxsm38vj3vavdk5x2fmdvhhh7e4qpzemhxue69uhkzarvv9ejumn0wd68ytnvv9hxgqg4waehxw309ajkgetw9ehx7um5wghxcctwvsq3wamnwvaz7tmwdaehgu3wvekhgtnhd9azucnf0gq3gamnwvaz7tmwdaehgu3wdau8gu3wv3jhvqgswaehxw309ahx7um5wgh8w6twv5q3jamnwvaz7tmwdaehgu3w0fjkyetyv4jjucmvda6kgqghwaehxw309aex2mrp0yhxxatjwfjkuapwveukjqg5waehxw309aex2mrp0yhxgctdw4eju6t0qyt8wumn8ghj7un9d3shjtnwdaeky6tw9e3k7mgprfmhxue69uhhyetvv9ujummjv9hxwetsd9kxctnyv4mqzxrhwden5te0wfjkccte9eekummjwsh8xmmrd9skckcl382) [Pastebin copy](https://pastebin.com/k3xGqZMa)


## For archival purposes:

### From device APK checksums:

```
fc27a6e11e4d4f0f800e02eacad6d8723d71f41ca64eb89511aa962b22ccd648  base.apk
66a622b73b665f15bec2a9bcf491354340999917f4892e8685cc5194392897e9  split_config.arm64_v8a.apk
54e7ea9ff748c22715f32d2448307f0e5533928ceff4739d420091e76383dd39  split_config.en.apk
cf7d7253dfc89a78fb0a411162951234df36a6b92330344e363834e2c47dd978  split_config.xxhdpi.apk
```

### Locally built APK checksums:

```
75231c06bae15ce51167b68b483b9ffde702c8a7ff0728e37fad8b84e2c32b5b  base-arm64_v8a.apk
6af1a20c2d7b9370f6409ced1a9b33fd441d03d4b47d7b3a901f645b297d9046  base-en.apk
c450bc84fe154daa4cec5af3a87bf1646fd0fa2d340a99a608d25f737173ca52  base-master.apk
6f95117f4940e34eaa1dbc151e78b721d1691ccaa01f2b538a11712c37a316ee  base-xxhdpi.apk
```