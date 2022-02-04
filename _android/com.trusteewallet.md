---
wsId: Trustee
title: "Trustee | crypto & btc wallet"
altTitle: 
authors:
- leo
users: 100000
appId: com.trusteewallet
appCountry: 
released: 2019-05-01
updated: 2022-01-12
version: "1.50.4"
stars: 3.9
ratings: 2396
reviews: 39
size: 54M
website: https://trusteeglobal.com
repository: https://github.com/trustee-wallet/trusteeWallet
issue: https://github.com/trustee-wallet/trusteeWallet/issues/1
icon: com.trusteewallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2020-01-24
signer: 
reviewArchive:
- date: 2019-12-28
  version: "1.0"
  appHash: 
  gitRevision: 1237739e1756c97af5da425627da4b910c9aa00b
  verdict: nonverifiable
providerTwitter: Trustee_Wallet
providerLinkedIn: 
providerFacebook: Trustee.Wallet
providerReddit: 

redirect_from:
  - /com.trusteewallet/
  - /posts/com.trusteewallet/
---

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
