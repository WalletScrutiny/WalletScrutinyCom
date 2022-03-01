---
wsId: 
title: "Bitcoin Wallet: by Bitcoin.org"
altTitle: 
authors:
- emanuel
- leo
users: 1000
appId: org.bitcoin.wallet
appCountry: 
released: 
updated: 2021-02-09
version: "1.0"
stars: 4.3
ratings: 9
reviews: 4
size: 39M
website: https://bitcoin.org
repository: https://github.com/bitcoin-dot-org/BitcoinWalletMobile
issue: https://github.com/bitcoin-dot-org/BitcoinWalletMobile/issues/7
icon: org.bitcoin.wallet.png
bugbounty: 
meta: defunct
verdict: nonverifiable
date: 2021-06-16
signer: 
reviewArchive:
twitter: 
social:
redirect_from:
---

**Update 2021-06-16**: It's been
[six weeks](https://github.com/bitcoin-dot-org/BitcoinWalletMobile/issues/9)
this app is not on the App store. If it should return, please open an issue on
our issue tracker!

[Emanuel](/authors/emanuel)
[looked into this wallet](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/208)
a bit as it claims
association with a pretty prominent website - bitcoin.org and indeed it is
[endorsed](https://github.com/bitcoin-dot-org/BitcoinWalletMobile/issues/4) by
[Cobra-Bitcoin](https://github.com/Cobra-Bitcoin), the owner of bitcoin.org.

As Emanuel so far doesn't write analysis, I'll reproduce his reproduction of
this wallet to also compare the result with what we get from Google Play:

```
mkir /tmp/testbitcoinorg
cd /tmp/testbitcoinorg
podman run --rm --volume $PWD:/app --interactive --tty frolvlad/alpine-glibc
apk update
apk add --no-cache openjdk8 git yarn
export ANDROID_SDK_ROOT="/home/appuser/app/sdk"
export ANDROID_HOME="/home/appuser/app/sdk"
export NODE_ENV="production"
mkdir -p "/home/appuser/app/sdk/licenses" "/home/appuser/app/bitcoinorg/"
printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/app/sdk/licenses/android-sdk-license"
cd /app
git clone https://github.com/bitcoin-dot-org/BitcoinWalletMobile/
cd BitcoinWalletMobile
git checkout v1.0
yarn install --frozen-lockfile --production
cd android
sed -i '/org.gradle.jvmargs/s/^#//g' gradle.properties
./gradlew assembleRelease
./gradlew bundleRelease
cp app/build/outputs/apk/release/app-release.apk .
cp app/build/outputs/bundle/release/app-release.aab .
```

So far so good, the apk and the aab got created successfully but ... Emanuel
stated that they use aab and we so far only could reproduce apk builds.

Let's see how the apk build looks like:

```
$ unzip /path/to/Bitcoin\ Wallet\ 1.0\ \(org.bitcoin.wallet\).apk -d fromGoogle
$ unzip BitcoinWalletMobile/android/app-release.apk -d fromBuild
$ diff --recursive --brief from*
Files fromBuild/AndroidManifest.xml and fromGoogle/AndroidManifest.xml differ
Only in fromGoogle/assets: index.android.bundle
Only in fromBuild: lib
Only in fromGoogle/META-INF: BNDLTOOL.RSA
Only in fromGoogle/META-INF: BNDLTOOL.SF
Only in fromBuild/META-INF: CERT.RSA
Only in fromBuild/META-INF: CERT.SF
Files fromBuild/META-INF/MANIFEST.MF and fromGoogle/META-INF/MANIFEST.MF differ
Only in fromBuild/res: drawable-anydpi-v21
Only in fromBuild/res: drawable-hdpi-v4
Files fromBuild/res/drawable-ldpi-v4/ic_launcher_foreground.png and fromGoogle/res/drawable-ldpi-v4/ic_launcher_foreground.png differ
Only in fromBuild/res: drawable-ldrtl-hdpi-v17
Only in fromBuild/res/drawable-ldrtl-mdpi-v17: abc_spinner_mtrl_am_alpha.9.png
Only in fromBuild/res: drawable-ldrtl-xhdpi-v17
Only in fromBuild/res: drawable-ldrtl-xxhdpi-v17
Only in fromBuild/res: drawable-ldrtl-xxxhdpi-v17
Only in fromBuild/res/drawable-mdpi-v4: abc_btn_check_to_on_mtrl_000.png
Only in fromBuild/res/drawable-mdpi-v4: abc_btn_check_to_on_mtrl_015.png
Only in fromBuild/res/drawable-mdpi-v4: abc_btn_radio_to_on_mtrl_000.png
Only in fromBuild/res/drawable-mdpi-v4: abc_btn_radio_to_on_mtrl_015.png
Only in fromBuild/res/drawable-mdpi-v4: abc_cab_background_top_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi-v4: abc_ic_star_black_48dp.png
Only in fromBuild/res/drawable-mdpi-v4: abc_ic_star_half_black_48dp.png
Only in fromBuild/res/drawable-mdpi-v4: abc_list_pressed_holo_dark.9.png
Only in fromBuild/res/drawable-mdpi-v4: abc_list_selector_disabled_holo_dark.9.png
Only in fromBuild/res/drawable-mdpi-v4: abc_popup_background_mtrl_mult.9.png
Only in fromBuild/res/drawable-mdpi-v4: abc_scrubber_control_off_mtrl_alpha.png
Only in fromBuild/res/drawable-mdpi-v4: abc_scrubber_control_to_pressed_mtrl_000.png
Only in fromBuild/res/drawable-mdpi-v4: abc_scrubber_control_to_pressed_mtrl_005.png
Only in fromBuild/res/drawable-mdpi-v4: abc_scrubber_primary_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi-v4: abc_scrubber_track_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi-v4: abc_spinner_mtrl_am_alpha.9.png
Only in fromBuild/res/drawable-mdpi-v4: abc_tab_indicator_mtrl_alpha.9.png
Only in fromBuild/res/drawable-mdpi-v4: abc_text_select_handle_left_mtrl_dark.png
Only in fromBuild/res/drawable-mdpi-v4: abc_text_select_handle_left_mtrl_light.png
Only in fromBuild/res/drawable-mdpi-v4: abc_text_select_handle_middle_mtrl_dark.png
Only in fromBuild/res/drawable-mdpi-v4: abc_text_select_handle_middle_mtrl_light.png
Only in fromBuild/res/drawable-mdpi-v4: abc_text_select_handle_right_mtrl_dark.png
Only in fromBuild/res/drawable-mdpi-v4: abc_text_select_handle_right_mtrl_light.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_arrow.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_camera.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_collectionfocus.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_collection.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_copy.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_create.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_currency.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_do_not_loose_it.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_exit.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_eye.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_forward.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_gearfocus.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_gear.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_keep_it_safe.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_language.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_laptop.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_link.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_qrcodeicon.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_receivedbutton.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_receivefocus.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_receive.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_refresh.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_restore.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_sendbutton.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_send.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_sent.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_swap.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_tick.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_warning.png
Only in fromBuild/res/drawable-mdpi-v4: assets_images_write_it_down.png
Only in fromBuild/res/drawable-mdpi-v4: common_google_signin_btn_icon_dark_normal_background.9.png
Only in fromBuild/res/drawable-mdpi-v4: common_google_signin_btn_icon_light_normal_background.9.png
Only in fromBuild/res/drawable-mdpi-v4: common_google_signin_btn_text_dark_normal_background.9.png
Only in fromBuild/res/drawable-mdpi-v4: common_google_signin_btn_text_light_normal_background.9.png
Only in fromBuild/res/drawable-mdpi-v4: design_ic_visibility_off.png
Only in fromBuild/res/drawable-mdpi-v4: design_ic_visibility.png
Only in fromBuild/res/drawable-mdpi-v4: googleg_disabled_color_18.png
Only in fromBuild/res/drawable-mdpi-v4: googleg_standard_color_18.png
Only in fromBuild/res/drawable-mdpi-v4: ic_launcher_foreground.png
Only in fromBuild/res/drawable-mdpi-v4: node_modules_reactnavigation_stack_src_views_assets_backicon.png
Only in fromBuild/res/drawable-mdpi-v4: notification_bg_low_normal.9.png
Only in fromBuild/res/drawable-mdpi-v4: notification_bg_low_pressed.9.png
Only in fromBuild/res/drawable-mdpi-v4: notification_bg_normal.9.png
Only in fromBuild/res/drawable-mdpi-v4: notification_bg_normal_pressed.9.png
Only in fromBuild/res/drawable-mdpi-v4: notify_panel_notification_icon_bg.png
Only in fromBuild/res: drawable-xhdpi-v4
Only in fromBuild/res: drawable-xxhdpi-v4
Only in fromBuild/res: drawable-xxxhdpi-v4
Only in fromGoogle/res/xml: splits0.xml
Files fromBuild/resources.arsc and fromGoogle/resources.arsc differ
Only in fromGoogle: stamp-cert-sha256
```

which is certainly not a match but aab would allow certain content to be
stripped and stuff missing in the version from Google Play could probably not do
harm. How's the diff ignoring those and the META-INF lines?

```
$ diff --recursive --brief from* | grep -v "$Only in fromBuild" | grep -v META-INF
Files fromBuild/AndroidManifest.xml and fromGoogle/AndroidManifest.xml differ
Only in fromGoogle/assets: index.android.bundle
Files fromBuild/res/drawable-ldpi-v4/ic_launcher_foreground.png and fromGoogle/res/drawable-ldpi-v4/ic_launcher_foreground.png differ
Only in fromGoogle/res/xml: splits0.xml
Files fromBuild/resources.arsc and fromGoogle/resources.arsc differ
Only in fromGoogle: stamp-cert-sha256
```

which is still a lot. We have to give up here and hope for the provider to help
with build reproduction. In the meantime this app is **not verifiable**.