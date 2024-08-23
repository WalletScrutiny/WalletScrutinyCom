---
wsId: envoyFoundation
title: Envoy
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: com.foundationdevices.envoy
appCountry: US
released: 2022-04-01
updated: 2024-06-18
version: 1.7.0
stars: 4
ratings: 
reviews: 4
size: 
website: https://foundationdevices.com/
repository: https://github.com/Foundation-Devices/envoy
issue: https://github.com/Foundation-Devices/envoy/issues/1395
icon: com.foundationdevices.envoy.jpg
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-08-21
signer: 
reviewArchive: 
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://www.youtube.com/@foundationdevices
- https://www.reddit.com/r/FoundationDevices
- https://t.me/foundationdevices
redirect_from: 
developerName: Foundation Devices
features: 

---

**Update 2024-08-16**

Our [test script](/scripts/test/android/com.foundationdevices.envoy.sh) was executed successfully, resulting in a successfully built APK.

The APK was built successfully:

```
✓ Built build/app/outputs/flutter-apk/app-release.apk (255.2MB).
```

We then extracted the generated APK from the build and also obtained the official APK from the Google Play Store. After unzipping both APKs using `unzip --qqd`, we performed a comparison using:

```bash
diff --recursive from*
```

The comparison revealed significant differences between the generated APK and the Play Store version:

```
keraliss@keraliss:~/projects/walletScrutiny_build/envoy$ diff --recursive from*
Binary files fromBuild/AndroidManifest.xml and fromOfficial/AndroidManifest.xml differ
Binary files fromBuild/assets/dexopt/baseline.prof and fromOfficial/assets/dexopt/baseline.prof differ
diff --recursive fromBuild/assets/flutter_assets/AssetManifest.bin fromOfficial/assets/flutter_assets/AssetManifest.bin
1c1
�assets/BTCPayLogo.png
assetassets/BTCPayLogo.pngassets/EnvoyIcons.ttf
assetassets/EnvoyIcons.ttfassets/accounts.svg
assetassets/accounts.svgassets/address_verify.png
assetassets/address_verify.pngssets/allowed_regions.json
assetssets/allowed_regions.jsonassets/animated_odometer.riv
assetassets/animated_odometer.riv assets/animated_privacy_icon.riv
asset assets/animated_privacy_icon.rivassets/azteco_logo.png
assetassets/azteco_logo.pngassets/backspace.svg
assetassets/backspace.svgassets/bitcoin.svg
assetassets/bitcoin.svgassets/circle_ok.png
assetassets/circle_ok.pngassets/coin_lock.riv
assetassets/coin_lock.riv$assets/components/icons/activity.svg
asset$assets/components/icons/activity.svg!assets/components/icons/alert.svg
asset!assets/components/icons/alert.svg+assets/components/icons/arrow_down_left.svg
asset+assets/components/icons/arrow_down_left.svg*assets/components/icons/arrow_up_right.svg
asset*assets/components/icons/arrow_up_right.svg"assets/components/icons/azteco.svg
asset"assets/components/icons/azteco.svg assets/components/icons/bell.svg
asset assets/components/icons/bell.svg&assets/components/icons/biometrics.svg
asset&assets/components/icons/biometrics.svg assets/components/icons/bisq.svg
asset assets/components/icons/bisq.svg%assets/components/icons/bitcoin_b.svg
asset%assets/components/icons/bitcoin_b.svg%assets/components/icons/brandmark.png
asset%assets/components/icons/brandmark.pngassets/components/icons/btc.svg
assetassets/components/icons/btc.svg"assets/components/icons/btcPay.svg
asset"assets/components/icons/btcPay.svg$assets/components/icons/calendar.svg
asset$assets/components/icons/calendar.svg%assets/components/icons/card_view.svg
asset%assets/components/icons/card_view.svg!assets/components/icons/check.svg
asset!assets/components/icons/check.svg*assets/components/icons/checked_circle.svg
asset*assets/components/icons/checked_circle.svg(assets/components/icons/chevron_down.svg
asset(assets/components/icons/chevron_down.svg(assets/components/icons/chevron_left.svg
asset(assets/components/icons/chevron_left.svg)assets/components/icons/chevron_right.svg
asset)assets/components/icons/chevron_right.svg%assets/components/icons/clipboard.svg
asset%assets/components/icons/clipboard.svg!assets/components/icons/clock.svg
asset!assets/components/icons/clock.svg!assets/components/icons/close.svg
asset!assets/components/icons/close.svg(assets/components/icons/close_circle.svg
asset(assets/components/icons/close_circle.svg#assets/components/icons/compass.svg
asset#assets/components/icons/compass.svg assets/components/icons/copy.svg
asset assets/components/icons/copy.svg"assets/components/icons/delete.svg
asset"assets/components/icons/delete.svg#assets/components/icons/devices.svg
asset#assets/components/icons/devices.svg$assets/components/icons/download.svg
asset$assets/components/icons/download.svg assets/components/icons/edit.svg
asset assets/components/icons/edit.svg(assets/components/icons/externalLink.svg
asset(assets/components/icons/externalLink.svg"assets/components/icons/filter.svg
asset"assets/components/icons/filter.svg#assets/components/icons/history.svg
asset#assets/components/icons/history.svg$assets/components/icons/hodlHodl.svg
asset$assets/components/icons/hodlHodl.svg assets/components/icons/info.svg
asset assets/components/icons/info.svg!assets/components/icons/learn.svg
asset!assets/components/icons/learn.svg assets/components/icons/list.svg
asset assets/components/icons/list.svg$assets/components/icons/location.svg
asset$assets/components/icons/location.svg(assets/components/icons/location_tab.svg
asset(assets/components/icons/location_tab.svg assets/components/icons/mail.svg
asset assets/components/icons/mail.svg!assets/components/icons/minus.svg
asset!assets/components/icons/minus.svg assets/components/icons/node.svg
asset assets/components/icons/node.svg assets/components/icons/note.svg
asset assets/components/icons/note.svg!assets/components/icons/peach.svg
asset!assets/components/icons/peach.svg'assets/components/icons/performance.svg
asset'assets/components/icons/performance.svg assets/components/icons/plus.svg
asset assets/components/icons/plus.svg#assets/components/icons/privacy.svg
asset#assets/components/icons/privacy.svg assets/components/icons/ramp.svg
asset assets/components/icons/ramp.svg-assets/components/icons/ramp_without_name.svg
asset-assets/components/icons/ramp_without_name.svg%assets/components/icons/rbf_boost.svg
asset%assets/components/icons/rbf_boost.svg#assets/components/icons/receive.svg
asset#assets/components/icons/receive.svg"assets/components/icons/remove.svg
asset"assets/components/icons/remove.svg$assets/components/icons/robosats.svg
asset$assets/components/icons/robosats.svg assets/components/icons/sats.svg
asset assets/components/icons/sats.svg assets/components/icons/scan.svg
asset assets/components/icons/scan.svg"assets/components/icons/search.svg
asset"assets/components/icons/search.svg assets/components/icons/send.svg
asset assets/components/icons/send.svg!assets/components/icons/share.svg
asset!assets/components/icons/share.svg"assets/components/icons/shield.svg
asset"assets/components/icons/shield.svg(assets/components/icons/signet_badge.svg
asset(assets/components/icons/signet_badge.svg!assets/components/icons/spend.svg
asset!assets/components/icons/spend.svg&assets/components/icons/stop_watch.svg
asset&assets/components/icons/stop_watch.svgassets/components/icons/tag.svg
assetassets/components/icons/tag.svg)assets/components/icons/testnet_badge.svg
asset)assets/components/icons/testnet_badge.svg assets/components/icons/tool.svg
asset assets/components/icons/tool.svg$assets/components/icons/transfer.svg
asset$assets/components/icons/transfer.svg*assets/components/icons/unknown_circle.svg
asset*assets/components/icons/unknown_circle.svg assets/components/icons/utxo.svg
asset assets/components/icons/utxo.svg)assets/components/icons/verifyAddress.svg
asset)assets/components/icons/verifyAddress.svg"assets/components/icons/wallet.svg
asset"assets/components/icons/wallet.svgassets/data_secured_1.png
assetassets/data_secured_1.pngassets/data_secured_2.png
assetassets/data_secured_2.pngassets/data_secured_3.png
assetassets/data_secured_3.pngassets/devices.svg
assetassets/devices.svg&assets/divisions-with-coordinates.json
asset&assets/divisions-with-coordinates.jsonassets/envoy.png
assetassets/envoy.pngassets/envoy_loader.riv
assetassets/envoy_loader.rivassets/envoy_logo_new.svg
assetassets/envoy_logo_new.svg assets/envoy_logo_with_title.png
asset assets/envoy_logo_with_title.pngassets/envoy_magic_setup.riv
assetassets/envoy_magic_setup.riv�assets/envoy_on_device.png
asset�assets/envoy_on_device.pngassets/envoy_passport.png
assetassets/envoy_passport.pngssets/exclamation_icon.png
assetssets/exclamation_icon.pngassets/exclamation_triangle.png
assetassets/exclamation_triangle.pngassets/fi_shield.png
assetassets/fi_shield.pngassets/fi_shield_off.png
assets/fw.svgi_shield_off.png
assets/fw.svgassets/fw_intro.png
assetassets/fw_intro.pngassets/fw_ios_instructions.png
assetassets/fw_ios_instructions.pngassets/fw_microsd.png
assetassets/fw_microsd.pngassets/fw_passport.png
assetassets/fw_passport.pngassets/github.svg
assetassets/github.svgassets/hamburger.riv
assetassets/hamburger.rivassets/hot_wallet.svg
assetassets/hot_wallet.svg
                          assets/i.svg
asset
     assets/i.svgassets/icons/fi_hard_drive.svg
assetassets/icons/fi_hard_drive.svg$assets/icons/ic_bitcoin_straight.svg
asset$assets/icons/ic_bitcoin_straight.svg+assets/icons/ic_bitcoin_straight_circle.svg
asset+assets/icons/ic_bitcoin_straight_circle.svg assets/icons/ic_circle_check.svg
asset assets/icons/ic_circle_check.svgssets/icons/ic_compass.svg
assetssets/icons/ic_compass.svgassets/icons/ic_copy.svg
assetassets/icons/ic_copy.svgassets/icons/ic_edit_note.svg
assetassets/icons/ic_edit_note.svgassets/icons/ic_envoy_share.svg
assetassets/icons/ic_envoy_share.svg�assets/icons/ic_filter.svg
asset�assets/icons/ic_filter.svg!assets/icons/ic_filter_funnel.svg
asset!assets/icons/ic_filter_funnel.svgassets/icons/ic_node_icon.svg
assetassets/icons/ic_node_icon.svgassets/icons/ic_note.svg
assetassets/icons/ic_note.svgassets/icons/ic_notes.svg
assetassets/icons/ic_notes.svg$assets/icons/ic_passport_account.svg
asset$assets/icons/ic_passport_account.svgassets/icons/ic_sats.svg
assetassets/icons/ic_sats.svgassets/icons/ic_spend.svg
assetassets/icons/ic_spend.svgassets/icons/ic_status_icon.svg
assetassets/icons/ic_status_icon.svgassets/icons/ic_tag.svg
assetassets/icons/ic_tag.svgassets/icons/ic_utxos.svg
assetassets/icons/ic_utxos.svg assets/icons/ic_wallet_coins.svg
asset assets/icons/ic_wallet_coins.svg�assets/import_pp_intro.png
asset�assets/import_pp_intro.pngassets/import_pp_scan.png
assetassets/import_pp_scan.png"assets/indicator_shield_bronze.png
asset"assets/indicator_shield_bronze.png"assets/indicator_shield_copper.png
asset"assets/indicator_shield_copper.pngassets/indicator_shield_red.png
assetassets/indicator_shield_red.png assets/indicator_shield_teal.png
asset assets/indicator_shield_teal.pngassets/iso-3166-2.json
assetassets/iso-3166-2.jsonassets/learn.svg
assetassets/learn.svgassets/lightbulb.svg
assetassets/lightbulb.svgassets/lightning.svg
assetassets/lightning.svgassets/logo.png
assetassets/logo.pngassets/logo_envoy.png
assetassets/logo_envoy.pngassets/menu_x.svg
assetassets/menu_x.svgassets/onboarding_lock_icon.png
assetassets/onboarding_lock_icon.pngassets/onboarding_shield.png
assetassets/onboarding_shield.pngassets/pair_new_device_scan.png
assetassets/pair_new_device_scan.pngassets/passport1.png
assetassets/passport1.pngassets/passport12.png
assetassets/passport12.pngassets/passport_envoy.png
assetassets/passport_envoy.pngassets/passport_tou.html
assetassets/passport_tou.htmlassets/pin_intro.png
assetassets/pin_intro.pngassets/pp_backup_code.png
assetassets/pp_backup_code.pngassets/pp_encryption_words.png
assetassets/pp_encryption_words.pngassets/pp_new_seed.png
assetassets/pp_new_seed.pngassets/pp_restore_backup.png
assetassets/pp_restore_backup.png�assets/pp_restore_seed.png
asset�assets/pp_restore_seed.pngassets/pp_seed_backup.png
assetassets/pp_seed_backup.pngassets/pp_seed_words.png
assetassets/pp_seed_words.pngassets/pp_setup_intro.png
assetassets/pp_setup_intro.pngassets/qr_scan.svg
assetassets/qr_scan.svgassets/scv_scan_qr.png
assetassets/scv_scan_qr.pngassets/shield_bad.png
assetassets/shield_bad.pngassets/shield_info.png
assetassets/shield_info.pngassets/shield_inspect.png
assetassets/shield_inspect.pngassets/shield_ok.png
assetassets/shield_ok.pngassets/shield_ok_info.png
assetassets/shield_ok_info.pngassets/shielded.svg
assetassets/shielded.svgassets/splash.png
assetassets/splash.pngassets/splash.svg
assetassets/splash.svgassets/splash_blank.png
assetassets/splash_blank.pngassets/telegram.svg
assetassets/telegram.svgassets/trophy_icon.png
assetassets/trophy_icon.pngassets/vault.svg
assetassets/vault.svg"assets/videos/fd_wallet_manual.m4v
asset"assets/videos/fd_wallet_manual.m4vassets/videos/magic_backups.m4v
assetassets/videos/magic_backups.m4vassets/videos/passport_ad.m4v
assetassets/videos/passport_ad.m4vassets/viewfinder_stroke.svg
assetassets/viewfinder_stroke.svgassets/wallet.svg
assetassets/wallet.svg!google_fonts/Montserrat-Black.ttf
asset!google_fonts/Montserrat-Black.ttf'google_fonts/Montserrat-BlackItalic.ttf
asset'google_fonts/Montserrat-BlackItalic.ttf google_fonts/Montserrat-Bold.ttf
asset google_fonts/Montserrat-Bold.ttf&google_fonts/Montserrat-BoldItalic.ttf
asset&google_fonts/Montserrat-BoldItalic.ttf%google_fonts/Montserrat-ExtraBold.ttf
asset%google_fonts/Montserrat-ExtraBold.ttf+google_fonts/Montserrat-ExtraBoldItalic.ttf
asset+google_fonts/Montserrat-ExtraBoldItalic.ttf&google_fonts/Montserrat-ExtraLight.ttf
asset&google_fonts/Montserrat-ExtraLight.ttf,google_fonts/Montserrat-ExtraLightItalic.ttf
asset,google_fonts/Montserrat-ExtraLightItalic.ttf"google_fonts/Montserrat-Italic.ttf
asset"google_fonts/Montserrat-Italic.ttf!google_fonts/Montserrat-Light.ttf
asset!google_fonts/Montserrat-Light.ttf'google_fonts/Montserrat-LightItalic.ttf
asset'google_fonts/Montserrat-LightItalic.ttf"google_fonts/Montserrat-Medium.ttf
asset"google_fonts/Montserrat-Medium.ttf(google_fonts/Montserrat-MediumItalic.ttf
asset(google_fonts/Montserrat-MediumItalic.ttf#google_fonts/Montserrat-Regular.ttf
asset#google_fonts/Montserrat-Regular.ttf$google_fonts/Montserrat-SemiBold.ttf
asset$google_fonts/Montserrat-SemiBold.ttf*google_fonts/Montserrat-SemiBoldItalic.ttf
asset*google_fonts/Montserrat-SemiBoldItalic.ttf google_fonts/Montserrat-Thin.ttf
asset google_fonts/Montserrat-Thin.ttf&google_fonts/Montserrat-ThinItalic.ttf
asset&google_fonts/Montserrat-ThinItalic.ttf2packages/cupertino_icons/assets/CupertinoIcons.ttf
asset2packages/cupertino_icons/assets/CupertinoIcons.ttf)packages/wakelock_plus/assets/no_sleep.js
asset)packages/wakelock_plus/assets/no_sleep.js
\ No newline at end of file
---
�assets/BTCPayLogo.png
assetassets/BTCPayLogo.pngassets/EnvoyIcons.ttf
assetassets/EnvoyIcons.ttfassets/accounts.svg
assetassets/accounts.svgassets/address_verify.png
assetassets/address_verify.pngssets/allowed_regions.json
assetssets/allowed_regions.jsonassets/animated_odometer.riv
assetassets/animated_odometer.riv assets/animated_privacy_icon.riv
asset assets/animated_privacy_icon.rivassets/azteco_logo.png
assetassets/azteco_logo.pngassets/backspace.svg
assetassets/backspace.svgassets/bitcoin.svg
assetassets/bitcoin.svgassets/circle_ok.png
assetassets/circle_ok.pngassets/coin_lock.riv
assetassets/coin_lock.riv$assets/components/icons/activity.svg
asset$assets/components/icons/activity.svg!assets/components/icons/alert.svg
asset!assets/components/icons/alert.svg+assets/components/icons/arrow_down_left.svg
asset+assets/components/icons/arrow_down_left.svg*assets/components/icons/arrow_up_right.svg
asset*assets/components/icons/arrow_up_right.svg"assets/components/icons/azteco.svg
asset"assets/components/icons/azteco.svg assets/components/icons/bell.svg
asset assets/components/icons/bell.svg&assets/components/icons/biometrics.svg
asset&assets/components/icons/biometrics.svg assets/components/icons/bisq.svg
asset assets/components/icons/bisq.svg%assets/components/icons/bitcoin_b.svg
asset%assets/components/icons/bitcoin_b.svg%assets/components/icons/brandmark.png
asset%assets/components/icons/brandmark.pngassets/components/icons/btc.svg
assetassets/components/icons/btc.svg"assets/components/icons/btcPay.svg
asset"assets/components/icons/btcPay.svg$assets/components/icons/calendar.svg
asset$assets/components/icons/calendar.svg%assets/components/icons/card_view.svg
asset%assets/components/icons/card_view.svg!assets/components/icons/check.svg
asset!assets/components/icons/check.svg*assets/components/icons/checked_circle.svg
asset*assets/components/icons/checked_circle.svg(assets/components/icons/chevron_down.svg
asset(assets/components/icons/chevron_down.svg(assets/components/icons/chevron_left.svg
asset(assets/components/icons/chevron_left.svg%assets/components/icons/clipboard.svg
asset%assets/components/icons/clipboard.svg!assets/components/icons/clock.svg
asset!assets/components/icons/clock.svg!assets/components/icons/close.svg
asset!assets/components/icons/close.svg(assets/components/icons/close_circle.svg
asset(assets/components/icons/close_circle.svg#assets/components/icons/compass.svg
asset#assets/components/icons/compass.svg assets/components/icons/copy.svg
asset assets/components/icons/copy.svg"assets/components/icons/delete.svg
asset"assets/components/icons/delete.svg#assets/components/icons/devices.svg
asset#assets/components/icons/devices.svg$assets/components/icons/download.svg
asset$assets/components/icons/download.svg assets/components/icons/edit.svg
asset assets/components/icons/edit.svg(assets/components/icons/externalLink.svg
asset(assets/components/icons/externalLink.svg"assets/components/icons/filter.svg
asset"assets/components/icons/filter.svg#assets/components/icons/history.svg
asset#assets/components/icons/history.svg$assets/components/icons/hodlHodl.svg
asset$assets/components/icons/hodlHodl.svg assets/components/icons/info.svg
asset assets/components/icons/info.svg!assets/components/icons/learn.svg
asset!assets/components/icons/learn.svg assets/components/icons/list.svg
asset assets/components/icons/list.svg$assets/components/icons/location.svg
asset$assets/components/icons/location.svg(assets/components/icons/location_tab.svg
asset(assets/components/icons/location_tab.svg!assets/components/icons/minus.svg
asset!assets/components/icons/minus.svg assets/components/icons/node.svg
asset assets/components/icons/node.svg assets/components/icons/note.svg
asset assets/components/icons/note.svg!assets/components/icons/peach.svg
asset!assets/components/icons/peach.svg'assets/components/icons/performance.svg
asset'assets/components/icons/performance.svg assets/components/icons/plus.svg
asset assets/components/icons/plus.svg#assets/components/icons/privacy.svg
asset#assets/components/icons/privacy.svg assets/components/icons/ramp.svg
asset assets/components/icons/ramp.svg-assets/components/icons/ramp_without_name.svg
asset-assets/components/icons/ramp_without_name.svg%assets/components/icons/rbf_boost.svg
asset%assets/components/icons/rbf_boost.svg#assets/components/icons/receive.svg
asset#assets/components/icons/receive.svg"assets/components/icons/remove.svg
asset"assets/components/icons/remove.svg$assets/components/icons/robosats.svg
asset$assets/components/icons/robosats.svg assets/components/icons/sats.svg
asset assets/components/icons/sats.svg assets/components/icons/scan.svg
asset assets/components/icons/scan.svg"assets/components/icons/search.svg
asset"assets/components/icons/search.svg assets/components/icons/send.svg
asset assets/components/icons/send.svg!assets/components/icons/share.svg
asset!assets/components/icons/share.svg"assets/components/icons/shield.svg
asset"assets/components/icons/shield.svg(assets/components/icons/signet_badge.svg
asset(assets/components/icons/signet_badge.svg!assets/components/icons/spend.svg
asset!assets/components/icons/spend.svg&assets/components/icons/stop_watch.svg
asset&assets/components/icons/stop_watch.svgassets/components/icons/tag.svg
assetassets/components/icons/tag.svg)assets/components/icons/testnet_badge.svg
asset)assets/components/icons/testnet_badge.svg assets/components/icons/tool.svg
asset assets/components/icons/tool.svg$assets/components/icons/transfer.svg
asset$assets/components/icons/transfer.svg*assets/components/icons/unknown_circle.svg
asset*assets/components/icons/unknown_circle.svg assets/components/icons/utxo.svg
asset assets/components/icons/utxo.svg)assets/components/icons/verifyAddress.svg
asset)assets/components/icons/verifyAddress.svgassets/data_secured_1.png
assetassets/data_secured_1.pngassets/data_secured_2.png
assetassets/data_secured_2.pngassets/data_secured_3.png
assetassets/data_secured_3.pngassets/devices.svg
assetassets/devices.svg&assets/divisions-with-coordinates.json
asset&assets/divisions-with-coordinates.jsonassets/envoy.png
assetassets/envoy.pngassets/envoy_loader.riv
assetassets/envoy_loader.rivassets/envoy_logo_new.svg
assetassets/envoy_logo_new.svg assets/envoy_logo_with_title.png
asset assets/envoy_logo_with_title.pngassets/envoy_magic_setup.riv
assetassets/envoy_magic_setup.riv�assets/envoy_on_device.png
asset�assets/envoy_on_device.pngassets/envoy_passport.png
assetassets/envoy_passport.pngssets/exclamation_icon.png
assetssets/exclamation_icon.pngassets/exclamation_triangle.png
assetassets/exclamation_triangle.pngassets/fi_shield_off.png
assets/fw.svgi_shield_off.png
assets/fw.svgassets/fw_intro.png
assetassets/fw_intro.pngassets/fw_ios_instructions.png
assetassets/fw_ios_instructions.pngassets/fw_microsd.png
assetassets/fw_microsd.pngassets/fw_passport.png
assetassets/fw_passport.pngassets/github.png
assetassets/github.pngassets/hamburger.riv
assetassets/hamburger.rivassets/hot_wallet.svg
assetassets/hot_wallet.svg
                          assets/i.svg
asset
     assets/i.svg�assets/icons/EnvoyLogo.svg
asset�assets/icons/EnvoyLogo.svgassets/icons/fi_hard_drive.svg
assetassets/icons/fi_hard_drive.svg$assets/icons/ic_bitcoin_straight.svg
asset$assets/icons/ic_bitcoin_straight.svg+assets/icons/ic_bitcoin_straight_circle.svg
asset+assets/icons/ic_bitcoin_straight_circle.svg assets/icons/ic_circle_check.svg
asset assets/icons/ic_circle_check.svgssets/icons/ic_compass.svg
assetssets/icons/ic_compass.svgassets/icons/ic_copy.svg
assetassets/icons/ic_copy.svgassets/icons/ic_edit_note.svg
assetassets/icons/ic_edit_note.svgassets/icons/ic_envoy_share.svg
assetassets/icons/ic_envoy_share.svg�assets/icons/ic_filter.svg
asset�assets/icons/ic_filter.svg!assets/icons/ic_filter_funnel.svg
asset!assets/icons/ic_filter_funnel.svgassets/icons/ic_node_icon.svg
assetassets/icons/ic_node_icon.svgassets/icons/ic_note.svg
assetassets/icons/ic_note.svgassets/icons/ic_notes.svg
assetassets/icons/ic_notes.svg$assets/icons/ic_passport_account.svg
asset$assets/icons/ic_passport_account.svgassets/icons/ic_sats.svg
assetassets/icons/ic_sats.svgassets/icons/ic_spend.svg
assetassets/icons/ic_spend.svgassets/icons/ic_status_icon.svg
assetassets/icons/ic_status_icon.svgassets/icons/ic_tag.svg
assetassets/icons/ic_tag.svgassets/icons/ic_utxos.svg
assetassets/icons/ic_utxos.svg assets/icons/ic_wallet_coins.svg
asset assets/icons/ic_wallet_coins.svg�assets/import_pp_intro.png
asset�assets/import_pp_intro.pngassets/import_pp_scan.png
assetassets/import_pp_scan.png"assets/indicator_shield_bronze.png
asset"assets/indicator_shield_bronze.png"assets/indicator_shield_copper.png
asset"assets/indicator_shield_copper.pngassets/indicator_shield_red.png
assetassets/indicator_shield_red.png assets/indicator_shield_teal.png
asset assets/indicator_shield_teal.pngassets/iso-3166-2.json
assetassets/iso-3166-2.jsonassets/learn.svg
assetassets/learn.svgassets/lightbulb.svg
assetassets/lightbulb.svgassets/lightning.svg
assetassets/lightning.svgassets/logo.png
assetassets/logo.pngassets/menu_x.svg
assetassets/menu_x.svgassets/onboarding_lock_icon.png
assetassets/onboarding_lock_icon.pngassets/onboarding_shield.png
assetassets/onboarding_shield.pngassets/pair_new_device_scan.png
assetassets/pair_new_device_scan.pngassets/passport1.png
assetassets/passport1.pngassets/passport12.png
assetassets/passport12.pngassets/passport_envoy.png
assetassets/passport_envoy.pngassets/passport_tou.html
assetassets/passport_tou.htmlassets/pin_intro.png
assetassets/pin_intro.pngassets/pp_backup_code.png
assetassets/pp_backup_code.pngassets/pp_encryption_words.png
assetassets/pp_encryption_words.pngassets/pp_new_seed.png
assetassets/pp_new_seed.pngassets/pp_restore_backup.png
assetassets/pp_restore_backup.png�assets/pp_restore_seed.png
asset�assets/pp_restore_seed.pngassets/pp_seed_backup.png
assetassets/pp_seed_backup.pngassets/pp_seed_words.png
assetassets/pp_seed_words.pngassets/pp_setup_intro.png
assetassets/pp_setup_intro.pngassets/qr_scan.svg
assetassets/qr_scan.svgassets/scv_scan_qr.png
assetassets/scv_scan_qr.pngassets/shield_bad.png
assetassets/shield_bad.pngassets/shield_info.png
assetassets/shield_info.pngassets/shield_inspect.png
assetassets/shield_inspect.pngassets/shield_ok.png
assetassets/shield_ok.pngassets/shield_ok_info.png
assetassets/shield_ok_info.pngassets/shielded.svg
assetassets/shielded.svgassets/splash.png
assetassets/splash.pngassets/splash.svg
assetassets/splash.svgassets/splash_blank.png
assetassets/splash_blank.pngassets/telegram.svg
assetassets/telegram.svgassets/trophy_icon.png
assetassets/trophy_icon.pngassets/vault.svg
assetassets/vault.svg"assets/videos/fd_wallet_manual.m4v
asset"assets/videos/fd_wallet_manual.m4vassets/videos/magic_backups.m4v
assetassets/videos/magic_backups.m4vassets/videos/passport_ad.m4v
assetassets/videos/passport_ad.m4vassets/viewfinder_stroke.svg
assetassets/viewfinder_stroke.svgassets/wallet.svg
assetassets/wallet.svg!google_fonts/Montserrat-Black.ttf
asset!google_fonts/Montserrat-Black.ttf'google_fonts/Montserrat-BlackItalic.ttf
asset'google_fonts/Montserrat-BlackItalic.ttf google_fonts/Montserrat-Bold.ttf
asset google_fonts/Montserrat-Bold.ttf&google_fonts/Montserrat-BoldItalic.ttf
asset&google_fonts/Montserrat-BoldItalic.ttf%google_fonts/Montserrat-ExtraBold.ttf
asset%google_fonts/Montserrat-ExtraBold.ttf+google_fonts/Montserrat-ExtraBoldItalic.ttf
asset+google_fonts/Montserrat-ExtraBoldItalic.ttf&google_fonts/Montserrat-ExtraLight.ttf
asset&google_fonts/Montserrat-ExtraLight.ttf,google_fonts/Montserrat-ExtraLightItalic.ttf
asset,google_fonts/Montserrat-ExtraLightItalic.ttf"google_fonts/Montserrat-Italic.ttf
asset"google_fonts/Montserrat-Italic.ttf!google_fonts/Montserrat-Light.ttf
asset!google_fonts/Montserrat-Light.ttf'google_fonts/Montserrat-LightItalic.ttf
asset'google_fonts/Montserrat-LightItalic.ttf"google_fonts/Montserrat-Medium.ttf
asset"google_fonts/Montserrat-Medium.ttf(google_fonts/Montserrat-MediumItalic.ttf
asset(google_fonts/Montserrat-MediumItalic.ttf#google_fonts/Montserrat-Regular.ttf
asset#google_fonts/Montserrat-Regular.ttf$google_fonts/Montserrat-SemiBold.ttf
asset$google_fonts/Montserrat-SemiBold.ttf*google_fonts/Montserrat-SemiBoldItalic.ttf
asset*google_fonts/Montserrat-SemiBoldItalic.ttf google_fonts/Montserrat-Thin.ttf
asset google_fonts/Montserrat-Thin.ttf&google_fonts/Montserrat-ThinItalic.ttf
asset&google_fonts/Montserrat-ThinItalic.ttf2packages/cupertino_icons/assets/CupertinoIcons.ttf
asset2packages/cupertino_icons/assets/CupertinoIcons.ttf)packages/wakelock_plus/assets/no_sleep.js
asset)packages/wakelock_plus/assets/no_sleep.js
\ No newline at end of file
diff --recursive fromBuild/assets/flutter_assets/AssetManifest.json fromOfficial/assets/flutter_assets/AssetManifest.json
1c1
< {"assets/BTCPayLogo.png":["assets/BTCPayLogo.png"],"assets/EnvoyIcons.ttf":["assets/EnvoyIcons.ttf"],"assets/accounts.svg":["assets/accounts.svg"],"assets/address_verify.png":["assets/address_verify.png"],"assets/allowed_regions.json":["assets/allowed_regions.json"],"assets/animated_odometer.riv":["assets/animated_odometer.riv"],"assets/animated_privacy_icon.riv":["assets/animated_privacy_icon.riv"],"assets/azteco_logo.png":["assets/azteco_logo.png"],"assets/backspace.svg":["assets/backspace.svg"],"assets/bitcoin.svg":["assets/bitcoin.svg"],"assets/circle_ok.png":["assets/circle_ok.png"],"assets/coin_lock.riv":["assets/coin_lock.riv"],"assets/components/icons/activity.svg":["assets/components/icons/activity.svg"],"assets/components/icons/alert.svg":["assets/components/icons/alert.svg"],"assets/components/icons/arrow_down_left.svg":["assets/components/icons/arrow_down_left.svg"],"assets/components/icons/arrow_up_right.svg":["assets/components/icons/arrow_up_right.svg"],"assets/components/icons/azteco.svg":["assets/components/icons/azteco.svg"],"assets/components/icons/bell.svg":["assets/components/icons/bell.svg"],"assets/components/icons/biometrics.svg":["assets/components/icons/biometrics.svg"],"assets/components/icons/bisq.svg":["assets/components/icons/bisq.svg"],"assets/components/icons/bitcoin_b.svg":["assets/components/icons/bitcoin_b.svg"],"assets/components/icons/brandmark.png":["assets/components/icons/brandmark.png"],"assets/components/icons/btc.svg":["assets/components/icons/btc.svg"],"assets/components/icons/btcPay.svg":["assets/components/icons/btcPay.svg"],"assets/components/icons/calendar.svg":["assets/components/icons/calendar.svg"],"assets/components/icons/card_view.svg":["assets/components/icons/card_view.svg"],"assets/components/icons/check.svg":["assets/components/icons/check.svg"],"assets/components/icons/checked_circle.svg":["assets/components/icons/checked_circle.svg"],"assets/components/icons/chevron_down.svg":["assets/components/icons/chevron_down.svg"],"assets/components/icons/chevron_left.svg":["assets/components/icons/chevron_left.svg"],"assets/components/icons/chevron_right.svg":["assets/components/icons/chevron_right.svg"],"assets/components/icons/clipboard.svg":["assets/components/icons/clipboard.svg"],"assets/components/icons/clock.svg":["assets/components/icons/clock.svg"],"assets/components/icons/close.svg":["assets/components/icons/close.svg"],"assets/components/icons/close_circle.svg":["assets/components/icons/close_circle.svg"],"assets/components/icons/compass.svg":["assets/components/icons/compass.svg"],"assets/components/icons/copy.svg":["assets/components/icons/copy.svg"],"assets/components/icons/delete.svg":["assets/components/icons/delete.svg"],"assets/components/icons/devices.svg":["assets/components/icons/devices.svg"],"assets/components/icons/download.svg":["assets/components/icons/download.svg"],"assets/components/icons/edit.svg":["assets/components/icons/edit.svg"],"assets/components/icons/externalLink.svg":["assets/components/icons/externalLink.svg"],"assets/components/icons/filter.svg":["assets/components/icons/filter.svg"],"assets/components/icons/history.svg":["assets/components/icons/history.svg"],"assets/components/icons/hodlHodl.svg":["assets/components/icons/hodlHodl.svg"],"assets/components/icons/info.svg":["assets/components/icons/info.svg"],"assets/components/icons/learn.svg":["assets/components/icons/learn.svg"],"assets/components/icons/list.svg":["assets/components/icons/list.svg"],"assets/components/icons/location.svg":["assets/components/icons/location.svg"],"assets/components/icons/location_tab.svg":["assets/components/icons/location_tab.svg"],"assets/components/icons/mail.svg":["assets/components/icons/mail.svg"],"assets/components/icons/minus.svg":["assets/components/icons/minus.svg"],"assets/components/icons/node.svg":["assets/components/icons/node.svg"],"assets/components/icons/note.svg":["assets/components/icons/note.svg"],"assets/components/icons/peach.svg":["assets/components/icons/peach.svg"],"assets/components/icons/performance.svg":["assets/components/icons/performance.svg"],"assets/components/icons/plus.svg":["assets/components/icons/plus.svg"],"assets/components/icons/privacy.svg":["assets/components/icons/privacy.svg"],"assets/components/icons/ramp.svg":["assets/components/icons/ramp.svg"],"assets/components/icons/ramp_without_name.svg":["assets/components/icons/ramp_without_name.svg"],"assets/components/icons/rbf_boost.svg":["assets/components/icons/rbf_boost.svg"],"assets/components/icons/receive.svg":["assets/components/icons/receive.svg"],"assets/components/icons/remove.svg":["assets/components/icons/remove.svg"],"assets/components/icons/robosats.svg":["assets/components/icons/robosats.svg"],"assets/components/icons/sats.svg":["assets/components/icons/sats.svg"],"assets/components/icons/scan.svg":["assets/components/icons/scan.svg"],"assets/components/icons/search.svg":["assets/components/icons/search.svg"],"assets/components/icons/send.svg":["assets/components/icons/send.svg"],"assets/components/icons/share.svg":["assets/components/icons/share.svg"],"assets/components/icons/shield.svg":["assets/components/icons/shield.svg"],"assets/components/icons/signet_badge.svg":["assets/components/icons/signet_badge.svg"],"assets/components/icons/spend.svg":["assets/components/icons/spend.svg"],"assets/components/icons/stop_watch.svg":["assets/components/icons/stop_watch.svg"],"assets/components/icons/tag.svg":["assets/components/icons/tag.svg"],"assets/components/icons/testnet_badge.svg":["assets/components/icons/testnet_badge.svg"],"assets/components/icons/tool.svg":["assets/components/icons/tool.svg"],"assets/components/icons/transfer.svg":["assets/components/icons/transfer.svg"],"assets/components/icons/unknown_circle.svg":["assets/components/icons/unknown_circle.svg"],"assets/components/icons/utxo.svg":["assets/components/icons/utxo.svg"],"assets/components/icons/verifyAddress.svg":["assets/components/icons/verifyAddress.svg"],"assets/components/icons/wallet.svg":["assets/components/icons/wallet.svg"],"assets/data_secured_1.png":["assets/data_secured_1.png"],"assets/data_secured_2.png":["assets/data_secured_2.png"],"assets/data_secured_3.png":["assets/data_secured_3.png"],"assets/devices.svg":["assets/devices.svg"],"assets/divisions-with-coordinates.json":["assets/divisions-with-coordinates.json"],"assets/envoy.png":["assets/envoy.png"],"assets/envoy_loader.riv":["assets/envoy_loader.riv"],"assets/envoy_logo_new.svg":["assets/envoy_logo_new.svg"],"assets/envoy_logo_with_title.png":["assets/envoy_logo_with_title.png"],"assets/envoy_magic_setup.riv":["assets/envoy_magic_setup.riv"],"assets/envoy_on_device.png":["assets/envoy_on_device.png"],"assets/envoy_passport.png":["assets/envoy_passport.png"],"assets/exclamation_icon.png":["assets/exclamation_icon.png"],"assets/exclamation_triangle.png":["assets/exclamation_triangle.png"],"assets/fi_shield.png":["assets/fi_shield.png"],"assets/fi_shield_off.png":["assets/fi_shield_off.png"],"assets/fw.svg":["assets/fw.svg"],"assets/fw_intro.png":["assets/fw_intro.png"],"assets/fw_ios_instructions.png":["assets/fw_ios_instructions.png"],"assets/fw_microsd.png":["assets/fw_microsd.png"],"assets/fw_passport.png":["assets/fw_passport.png"],"assets/github.svg":["assets/github.svg"],"assets/hamburger.riv":["assets/hamburger.riv"],"assets/hot_wallet.svg":["assets/hot_wallet.svg"],"assets/i.svg":["assets/i.svg"],"assets/icons/fi_hard_drive.svg":["assets/icons/fi_hard_drive.svg"],"assets/icons/ic_bitcoin_straight.svg":["assets/icons/ic_bitcoin_straight.svg"],"assets/icons/ic_bitcoin_straight_circle.svg":["assets/icons/ic_bitcoin_straight_circle.svg"],"assets/icons/ic_circle_check.svg":["assets/icons/ic_circle_check.svg"],"assets/icons/ic_compass.svg":["assets/icons/ic_compass.svg"],"assets/icons/ic_copy.svg":["assets/icons/ic_copy.svg"],"assets/icons/ic_edit_note.svg":["assets/icons/ic_edit_note.svg"],"assets/icons/ic_envoy_share.svg":["assets/icons/ic_envoy_share.svg"],"assets/icons/ic_filter.svg":["assets/icons/ic_filter.svg"],"assets/icons/ic_filter_funnel.svg":["assets/icons/ic_filter_funnel.svg"],"assets/icons/ic_node_icon.svg":["assets/icons/ic_node_icon.svg"],"assets/icons/ic_note.svg":["assets/icons/ic_note.svg"],"assets/icons/ic_notes.svg":["assets/icons/ic_notes.svg"],"assets/icons/ic_passport_account.svg":["assets/icons/ic_passport_account.svg"],"assets/icons/ic_sats.svg":["assets/icons/ic_sats.svg"],"assets/icons/ic_spend.svg":["assets/icons/ic_spend.svg"],"assets/icons/ic_status_icon.svg":["assets/icons/ic_status_icon.svg"],"assets/icons/ic_tag.svg":["assets/icons/ic_tag.svg"],"assets/icons/ic_utxos.svg":["assets/icons/ic_utxos.svg"],"assets/icons/ic_wallet_coins.svg":["assets/icons/ic_wallet_coins.svg"],"assets/import_pp_intro.png":["assets/import_pp_intro.png"],"assets/import_pp_scan.png":["assets/import_pp_scan.png"],"assets/indicator_shield_bronze.png":["assets/indicator_shield_bronze.png"],"assets/indicator_shield_copper.png":["assets/indicator_shield_copper.png"],"assets/indicator_shield_red.png":["assets/indicator_shield_red.png"],"assets/indicator_shield_teal.png":["assets/indicator_shield_teal.png"],"assets/iso-3166-2.json":["assets/iso-3166-2.json"],"assets/learn.svg":["assets/learn.svg"],"assets/lightbulb.svg":["assets/lightbulb.svg"],"assets/lightning.svg":["assets/lightning.svg"],"assets/logo.png":["assets/logo.png"],"assets/logo_envoy.png":["assets/logo_envoy.png"],"assets/menu_x.svg":["assets/menu_x.svg"],"assets/onboarding_lock_icon.png":["assets/onboarding_lock_icon.png"],"assets/onboarding_shield.png":["assets/onboarding_shield.png"],"assets/pair_new_device_scan.png":["assets/pair_new_device_scan.png"],"assets/passport1.png":["assets/passport1.png"],"assets/passport12.png":["assets/passport12.png"],"assets/passport_envoy.png":["assets/passport_envoy.png"],"assets/passport_tou.html":["assets/passport_tou.html"],"assets/pin_intro.png":["assets/pin_intro.png"],"assets/pp_backup_code.png":["assets/pp_backup_code.png"],"assets/pp_encryption_words.png":["assets/pp_encryption_words.png"],"assets/pp_new_seed.png":["assets/pp_new_seed.png"],"assets/pp_restore_backup.png":["assets/pp_restore_backup.png"],"assets/pp_restore_seed.png":["assets/pp_restore_seed.png"],"assets/pp_seed_backup.png":["assets/pp_seed_backup.png"],"assets/pp_seed_words.png":["assets/pp_seed_words.png"],"assets/pp_setup_intro.png":["assets/pp_setup_intro.png"],"assets/qr_scan.svg":["assets/qr_scan.svg"],"assets/scv_scan_qr.png":["assets/scv_scan_qr.png"],"assets/shield_bad.png":["assets/shield_bad.png"],"assets/shield_info.png":["assets/shield_info.png"],"assets/shield_inspect.png":["assets/shield_inspect.png"],"assets/shield_ok.png":["assets/shield_ok.png"],"assets/shield_ok_info.png":["assets/shield_ok_info.png"],"assets/shielded.svg":["assets/shielded.svg"],"assets/splash.png":["assets/splash.png"],"assets/splash.svg":["assets/splash.svg"],"assets/splash_blank.png":["assets/splash_blank.png"],"assets/telegram.svg":["assets/telegram.svg"],"assets/trophy_icon.png":["assets/trophy_icon.png"],"assets/vault.svg":["assets/vault.svg"],"assets/videos/fd_wallet_manual.m4v":["assets/videos/fd_wallet_manual.m4v"],"assets/videos/magic_backups.m4v":["assets/videos/magic_backups.m4v"],"assets/videos/passport_ad.m4v":["assets/videos/passport_ad.m4v"],"assets/viewfinder_stroke.svg":["assets/viewfinder_stroke.svg"],"assets/wallet.svg":["assets/wallet.svg"],"google_fonts/Montserrat-Black.ttf":["google_fonts/Montserrat-Black.ttf"],"google_fonts/Montserrat-BlackItalic.ttf":["google_fonts/Montserrat-BlackItalic.ttf"],"google_fonts/Montserrat-Bold.ttf":["google_fonts/Montserrat-Bold.ttf"],"google_fonts/Montserrat-BoldItalic.ttf":["google_fonts/Montserrat-BoldItalic.ttf"],"google_fonts/Montserrat-ExtraBold.ttf":["google_fonts/Montserrat-ExtraBold.ttf"],"google_fonts/Montserrat-ExtraBoldItalic.ttf":["google_fonts/Montserrat-ExtraBoldItalic.ttf"],"google_fonts/Montserrat-ExtraLight.ttf":["google_fonts/Montserrat-ExtraLight.ttf"],"google_fonts/Montserrat-ExtraLightItalic.ttf":["google_fonts/Montserrat-ExtraLightItalic.ttf"],"google_fonts/Montserrat-Italic.ttf":["google_fonts/Montserrat-Italic.ttf"],"google_fonts/Montserrat-Light.ttf":["google_fonts/Montserrat-Light.ttf"],"google_fonts/Montserrat-LightItalic.ttf":["google_fonts/Montserrat-LightItalic.ttf"],"google_fonts/Montserrat-Medium.ttf":["google_fonts/Montserrat-Medium.ttf"],"google_fonts/Montserrat-MediumItalic.ttf":["google_fonts/Montserrat-MediumItalic.ttf"],"google_fonts/Montserrat-Regular.ttf":["google_fonts/Montserrat-Regular.ttf"],"google_fonts/Montserrat-SemiBold.ttf":["google_fonts/Montserrat-SemiBold.ttf"],"google_fonts/Montserrat-SemiBoldItalic.ttf":["google_fonts/Montserrat-SemiBoldItalic.ttf"],"google_fonts/Montserrat-Thin.ttf":["google_fonts/Montserrat-Thin.ttf"],"google_fonts/Montserrat-ThinItalic.ttf":["google_fonts/Montserrat-ThinItalic.ttf"],"packages/cupertino_icons/assets/CupertinoIcons.ttf":["packages/cupertino_icons/assets/CupertinoIcons.ttf"],"packages/wakelock_plus/assets/no_sleep.js":["packages/wakelock_plus/assets/no_sleep.js"]}
\ No newline at end of file
---
> {"assets/BTCPayLogo.png":["assets/BTCPayLogo.png"],"assets/EnvoyIcons.ttf":["assets/EnvoyIcons.ttf"],"assets/accounts.svg":["assets/accounts.svg"],"assets/address_verify.png":["assets/address_verify.png"],"assets/allowed_regions.json":["assets/allowed_regions.json"],"assets/animated_odometer.riv":["assets/animated_odometer.riv"],"assets/animated_privacy_icon.riv":["assets/animated_privacy_icon.riv"],"assets/azteco_logo.png":["assets/azteco_logo.png"],"assets/backspace.svg":["assets/backspace.svg"],"assets/bitcoin.svg":["assets/bitcoin.svg"],"assets/circle_ok.png":["assets/circle_ok.png"],"assets/coin_lock.riv":["assets/coin_lock.riv"],"assets/components/icons/activity.svg":["assets/components/icons/activity.svg"],"assets/components/icons/alert.svg":["assets/components/icons/alert.svg"],"assets/components/icons/arrow_down_left.svg":["assets/components/icons/arrow_down_left.svg"],"assets/components/icons/arrow_up_right.svg":["assets/components/icons/arrow_up_right.svg"],"assets/components/icons/azteco.svg":["assets/components/icons/azteco.svg"],"assets/components/icons/bell.svg":["assets/components/icons/bell.svg"],"assets/components/icons/biometrics.svg":["assets/components/icons/biometrics.svg"],"assets/components/icons/bisq.svg":["assets/components/icons/bisq.svg"],"assets/components/icons/bitcoin_b.svg":["assets/components/icons/bitcoin_b.svg"],"assets/components/icons/brandmark.png":["assets/components/icons/brandmark.png"],"assets/components/icons/btc.svg":["assets/components/icons/btc.svg"],"assets/components/icons/btcPay.svg":["assets/components/icons/btcPay.svg"],"assets/components/icons/calendar.svg":["assets/components/icons/calendar.svg"],"assets/components/icons/card_view.svg":["assets/components/icons/card_view.svg"],"assets/components/icons/check.svg":["assets/components/icons/check.svg"],"assets/components/icons/checked_circle.svg":["assets/components/icons/checked_circle.svg"],"assets/components/icons/chevron_down.svg":["assets/components/icons/chevron_down.svg"],"assets/components/icons/chevron_left.svg":["assets/components/icons/chevron_left.svg"],"assets/components/icons/clipboard.svg":["assets/components/icons/clipboard.svg"],"assets/components/icons/clock.svg":["assets/components/icons/clock.svg"],"assets/components/icons/close.svg":["assets/components/icons/close.svg"],"assets/components/icons/close_circle.svg":["assets/components/icons/close_circle.svg"],"assets/components/icons/compass.svg":["assets/components/icons/compass.svg"],"assets/components/icons/copy.svg":["assets/components/icons/copy.svg"],"assets/components/icons/delete.svg":["assets/components/icons/delete.svg"],"assets/components/icons/devices.svg":["assets/components/icons/devices.svg"],"assets/components/icons/download.svg":["assets/components/icons/download.svg"],"assets/components/icons/edit.svg":["assets/components/icons/edit.svg"],"assets/components/icons/externalLink.svg":["assets/components/icons/externalLink.svg"],"assets/components/icons/filter.svg":["assets/components/icons/filter.svg"],"assets/components/icons/history.svg":["assets/components/icons/history.svg"],"assets/components/icons/hodlHodl.svg":["assets/components/icons/hodlHodl.svg"],"assets/components/icons/info.svg":["assets/components/icons/info.svg"],"assets/components/icons/learn.svg":["assets/components/icons/learn.svg"],"assets/components/icons/list.svg":["assets/components/icons/list.svg"],"assets/components/icons/location.svg":["assets/components/icons/location.svg"],"assets/components/icons/location_tab.svg":["assets/components/icons/location_tab.svg"],"assets/components/icons/minus.svg":["assets/components/icons/minus.svg"],"assets/components/icons/node.svg":["assets/components/icons/node.svg"],"assets/components/icons/note.svg":["assets/components/icons/note.svg"],"assets/components/icons/peach.svg":["assets/components/icons/peach.svg"],"assets/components/icons/performance.svg":["assets/components/icons/performance.svg"],"assets/components/icons/plus.svg":["assets/components/icons/plus.svg"],"assets/components/icons/privacy.svg":["assets/components/icons/privacy.svg"],"assets/components/icons/ramp.svg":["assets/components/icons/ramp.svg"],"assets/components/icons/ramp_without_name.svg":["assets/components/icons/ramp_without_name.svg"],"assets/components/icons/rbf_boost.svg":["assets/components/icons/rbf_boost.svg"],"assets/components/icons/receive.svg":["assets/components/icons/receive.svg"],"assets/components/icons/remove.svg":["assets/components/icons/remove.svg"],"assets/components/icons/robosats.svg":["assets/components/icons/robosats.svg"],"assets/components/icons/sats.svg":["assets/components/icons/sats.svg"],"assets/components/icons/scan.svg":["assets/components/icons/scan.svg"],"assets/components/icons/search.svg":["assets/components/icons/search.svg"],"assets/components/icons/send.svg":["assets/components/icons/send.svg"],"assets/components/icons/share.svg":["assets/components/icons/share.svg"],"assets/components/icons/shield.svg":["assets/components/icons/shield.svg"],"assets/components/icons/signet_badge.svg":["assets/components/icons/signet_badge.svg"],"assets/components/icons/spend.svg":["assets/components/icons/spend.svg"],"assets/components/icons/stop_watch.svg":["assets/components/icons/stop_watch.svg"],"assets/components/icons/tag.svg":["assets/components/icons/tag.svg"],"assets/components/icons/testnet_badge.svg":["assets/components/icons/testnet_badge.svg"],"assets/components/icons/tool.svg":["assets/components/icons/tool.svg"],"assets/components/icons/transfer.svg":["assets/components/icons/transfer.svg"],"assets/components/icons/unknown_circle.svg":["assets/components/icons/unknown_circle.svg"],"assets/components/icons/utxo.svg":["assets/components/icons/utxo.svg"],"assets/components/icons/verifyAddress.svg":["assets/components/icons/verifyAddress.svg"],"assets/data_secured_1.png":["assets/data_secured_1.png"],"assets/data_secured_2.png":["assets/data_secured_2.png"],"assets/data_secured_3.png":["assets/data_secured_3.png"],"assets/devices.svg":["assets/devices.svg"],"assets/divisions-with-coordinates.json":["assets/divisions-with-coordinates.json"],"assets/envoy.png":["assets/envoy.png"],"assets/envoy_loader.riv":["assets/envoy_loader.riv"],"assets/envoy_logo_new.svg":["assets/envoy_logo_new.svg"],"assets/envoy_logo_with_title.png":["assets/envoy_logo_with_title.png"],"assets/envoy_magic_setup.riv":["assets/envoy_magic_setup.riv"],"assets/envoy_on_device.png":["assets/envoy_on_device.png"],"assets/envoy_passport.png":["assets/envoy_passport.png"],"assets/exclamation_icon.png":["assets/exclamation_icon.png"],"assets/exclamation_triangle.png":["assets/exclamation_triangle.png"],"assets/fi_shield_off.png":["assets/fi_shield_off.png"],"assets/fw.svg":["assets/fw.svg"],"assets/fw_intro.png":["assets/fw_intro.png"],"assets/fw_ios_instructions.png":["assets/fw_ios_instructions.png"],"assets/fw_microsd.png":["assets/fw_microsd.png"],"assets/fw_passport.png":["assets/fw_passport.png"],"assets/github.png":["assets/github.png"],"assets/hamburger.riv":["assets/hamburger.riv"],"assets/hot_wallet.svg":["assets/hot_wallet.svg"],"assets/i.svg":["assets/i.svg"],"assets/icons/EnvoyLogo.svg":["assets/icons/EnvoyLogo.svg"],"assets/icons/fi_hard_drive.svg":["assets/icons/fi_hard_drive.svg"],"assets/icons/ic_bitcoin_straight.svg":["assets/icons/ic_bitcoin_straight.svg"],"assets/icons/ic_bitcoin_straight_circle.svg":["assets/icons/ic_bitcoin_straight_circle.svg"],"assets/icons/ic_circle_check.svg":["assets/icons/ic_circle_check.svg"],"assets/icons/ic_compass.svg":["assets/icons/ic_compass.svg"],"assets/icons/ic_copy.svg":["assets/icons/ic_copy.svg"],"assets/icons/ic_edit_note.svg":["assets/icons/ic_edit_note.svg"],"assets/icons/ic_envoy_share.svg":["assets/icons/ic_envoy_share.svg"],"assets/icons/ic_filter.svg":["assets/icons/ic_filter.svg"],"assets/icons/ic_filter_funnel.svg":["assets/icons/ic_filter_funnel.svg"],"assets/icons/ic_node_icon.svg":["assets/icons/ic_node_icon.svg"],"assets/icons/ic_note.svg":["assets/icons/ic_note.svg"],"assets/icons/ic_notes.svg":["assets/icons/ic_notes.svg"],"assets/icons/ic_passport_account.svg":["assets/icons/ic_passport_account.svg"],"assets/icons/ic_sats.svg":["assets/icons/ic_sats.svg"],"assets/icons/ic_spend.svg":["assets/icons/ic_spend.svg"],"assets/icons/ic_status_icon.svg":["assets/icons/ic_status_icon.svg"],"assets/icons/ic_tag.svg":["assets/icons/ic_tag.svg"],"assets/icons/ic_utxos.svg":["assets/icons/ic_utxos.svg"],"assets/icons/ic_wallet_coins.svg":["assets/icons/ic_wallet_coins.svg"],"assets/import_pp_intro.png":["assets/import_pp_intro.png"],"assets/import_pp_scan.png":["assets/import_pp_scan.png"],"assets/indicator_shield_bronze.png":["assets/indicator_shield_bronze.png"],"assets/indicator_shield_copper.png":["assets/indicator_shield_copper.png"],"assets/indicator_shield_red.png":["assets/indicator_shield_red.png"],"assets/indicator_shield_teal.png":["assets/indicator_shield_teal.png"],"assets/iso-3166-2.json":["assets/iso-3166-2.json"],"assets/learn.svg":["assets/learn.svg"],"assets/lightbulb.svg":["assets/lightbulb.svg"],"assets/lightning.svg":["assets/lightning.svg"],"assets/logo.png":["assets/logo.png"],"assets/menu_x.svg":["assets/menu_x.svg"],"assets/onboarding_lock_icon.png":["assets/onboarding_lock_icon.png"],"assets/onboarding_shield.png":["assets/onboarding_shield.png"],"assets/pair_new_device_scan.png":["assets/pair_new_device_scan.png"],"assets/passport1.png":["assets/passport1.png"],"assets/passport12.png":["assets/passport12.png"],"assets/passport_envoy.png":["assets/passport_envoy.png"],"assets/passport_tou.html":["assets/passport_tou.html"],"assets/pin_intro.png":["assets/pin_intro.png"],"assets/pp_backup_code.png":["assets/pp_backup_code.png"],"assets/pp_encryption_words.png":["assets/pp_encryption_words.png"],"assets/pp_new_seed.png":["assets/pp_new_seed.png"],"assets/pp_restore_backup.png":["assets/pp_restore_backup.png"],"assets/pp_restore_seed.png":["assets/pp_restore_seed.png"],"assets/pp_seed_backup.png":["assets/pp_seed_backup.png"],"assets/pp_seed_words.png":["assets/pp_seed_words.png"],"assets/pp_setup_intro.png":["assets/pp_setup_intro.png"],"assets/qr_scan.svg":["assets/qr_scan.svg"],"assets/scv_scan_qr.png":["assets/scv_scan_qr.png"],"assets/shield_bad.png":["assets/shield_bad.png"],"assets/shield_info.png":["assets/shield_info.png"],"assets/shield_inspect.png":["assets/shield_inspect.png"],"assets/shield_ok.png":["assets/shield_ok.png"],"assets/shield_ok_info.png":["assets/shield_ok_info.png"],"assets/shielded.svg":["assets/shielded.svg"],"assets/splash.png":["assets/splash.png"],"assets/splash.svg":["assets/splash.svg"],"assets/splash_blank.png":["assets/splash_blank.png"],"assets/telegram.svg":["assets/telegram.svg"],"assets/trophy_icon.png":["assets/trophy_icon.png"],"assets/vault.svg":["assets/vault.svg"],"assets/videos/fd_wallet_manual.m4v":["assets/videos/fd_wallet_manual.m4v"],"assets/videos/magic_backups.m4v":["assets/videos/magic_backups.m4v"],"assets/videos/passport_ad.m4v":["assets/videos/passport_ad.m4v"],"assets/viewfinder_stroke.svg":["assets/viewfinder_stroke.svg"],"assets/wallet.svg":["assets/wallet.svg"],"google_fonts/Montserrat-Black.ttf":["google_fonts/Montserrat-Black.ttf"],"google_fonts/Montserrat-BlackItalic.ttf":["google_fonts/Montserrat-BlackItalic.ttf"],"google_fonts/Montserrat-Bold.ttf":["google_fonts/Montserrat-Bold.ttf"],"google_fonts/Montserrat-BoldItalic.ttf":["google_fonts/Montserrat-BoldItalic.ttf"],"google_fonts/Montserrat-ExtraBold.ttf":["google_fonts/Montserrat-ExtraBold.ttf"],"google_fonts/Montserrat-ExtraBoldItalic.ttf":["google_fonts/Montserrat-ExtraBoldItalic.ttf"],"google_fonts/Montserrat-ExtraLight.ttf":["google_fonts/Montserrat-ExtraLight.ttf"],"google_fonts/Montserrat-ExtraLightItalic.ttf":["google_fonts/Montserrat-ExtraLightItalic.ttf"],"google_fonts/Montserrat-Italic.ttf":["google_fonts/Montserrat-Italic.ttf"],"google_fonts/Montserrat-Light.ttf":["google_fonts/Montserrat-Light.ttf"],"google_fonts/Montserrat-LightItalic.ttf":["google_fonts/Montserrat-LightItalic.ttf"],"google_fonts/Montserrat-Medium.ttf":["google_fonts/Montserrat-Medium.ttf"],"google_fonts/Montserrat-MediumItalic.ttf":["google_fonts/Montserrat-MediumItalic.ttf"],"google_fonts/Montserrat-Regular.ttf":["google_fonts/Montserrat-Regular.ttf"],"google_fonts/Montserrat-SemiBold.ttf":["google_fonts/Montserrat-SemiBold.ttf"],"google_fonts/Montserrat-SemiBoldItalic.ttf":["google_fonts/Montserrat-SemiBoldItalic.ttf"],"google_fonts/Montserrat-Thin.ttf":["google_fonts/Montserrat-Thin.ttf"],"google_fonts/Montserrat-ThinItalic.ttf":["google_fonts/Montserrat-ThinItalic.ttf"],"packages/cupertino_icons/assets/CupertinoIcons.ttf":["packages/cupertino_icons/assets/CupertinoIcons.ttf"],"packages/wakelock_plus/assets/no_sleep.js":["packages/wakelock_plus/assets/no_sleep.js"]}
\ No newline at end of file
Only in fromBuild/assets/flutter_assets/assets/components/icons: chevron_right.svg
diff --recursive fromBuild/assets/flutter_assets/assets/components/icons/devices.svg fromOfficial/assets/flutter_assets/assets/components/icons/devices.svg
2c2
< <path fill-rule="evenodd" clip-rule="evenodd" d="M16 5V4.5C16 3.11929 14.8807 2 13.5 2L7.50003 2C6.11932 2 5.00003 3.11929 5.00003 4.5L5.00003 16.5C5.00003 17.8807 6.11932 19 7.50003 19H8.00002L8.00002 19.5C8.00002 20.8807 9.1193 22 10.5 22H16.5C17.8807 22 19 20.8807 19 19.5V7.5C19 6.11929 17.8807 5 16.5 5L16 5ZM13.25 4L7.75 4C7.33579 4 7 4.33579 7 4.75V16.5C7 16.9142 7.33579 17.25 7.75 17.25L8.00002 17.25V7.5C8.00002 6.11929 9.1193 5 10.5 5L14 5V4.75C14 4.33579 13.6642 4 13.25 4ZM10.7 7H16.3C16.6866 7 17 7.32335 17 7.72222V19.2778C17 19.6767 16.6866 20 16.3 20H10.7C10.3134 20 10 19.6766 10 19.2778L10 7.72222C10 7.32335 10.3134 7 10.7 7Z" fill="#231F20"/>
---
> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.34 4.04847C5.34 2.94433 6.17687 2 7.2665 2L12.8791 2C13.9688 2 14.8056 2.94433 14.8056 4.04847L14.8056 4.79454L16.6693 4.79454C17.8018 4.79454 18.6733 5.77629 18.6733 6.92659L18.6733 19.868C18.6733 21.0183 17.8018 22 16.6693 22L10.6692 22C9.53675 22 8.66518 21.0183 8.66518 19.868L8.66518 19.4131L7.26649 19.4131C6.17686 19.4131 5.33999 18.4688 5.33999 17.3646L5.34 4.04847ZM8.66518 17.7373L8.66519 6.92659C8.66519 5.77629 9.53675 4.79454 10.6692 4.79454L13.1977 4.79454L13.1977 4.04847C13.1977 3.81547 13.0294 3.67583 12.8791 3.67583L7.2665 3.67583C7.11622 3.67583 6.94794 3.81547 6.94794 4.04847L6.94793 17.3646C6.94793 17.5976 7.11621 17.7373 7.26649 17.7373L8.66518 17.7373ZM10.6692 6.47036C10.4761 6.47036 10.2731 6.64742 10.2731 6.92659L10.2731 19.868C10.2731 20.1471 10.4761 20.3242 10.6692 20.3242L16.6693 20.3242C16.8624 20.3242 17.0654 20.1471 17.0654 19.868L17.0654 6.92659C17.0654 6.64743 16.8624 6.47037 16.6693 6.47037L10.6692 6.47036Z" fill="#231F20"/>
Only in fromBuild/assets/flutter_assets/assets/components/icons: mail.svg
Only in fromBuild/assets/flutter_assets/assets/components/icons: wallet.svg
Only in fromBuild/assets/flutter_assets/assets: fi_shield.png
Only in fromOfficial/assets/flutter_assets/assets: github.png
Only in fromBuild/assets/flutter_assets/assets: github.svg
Only in fromOfficial/assets/flutter_assets/assets/icons: EnvoyLogo.svg
Only in fromBuild/assets/flutter_assets/assets: logo_envoy.png
Binary files fromBuild/assets/flutter_assets/assets/logo.png and fromOfficial/assets/flutter_assets/assets/logo.png differ
diff --recursive fromBuild/assets/flutter_assets/assets/menu_x.svg fromOfficial/assets/flutter_assets/assets/menu_x.svg
1,3c1,2
< <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
< <path d="M31.649 31.9692H29.6098L16.2976 15.9241H18.4859L31.649 31.9692Z" fill="#525152"/>
< <path fill-rule="evenodd" clip-rule="evenodd" d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM31.7607 14C31.2121 14 30.6876 14.2254 30.3099 14.6233L24.8372 20.3908L19.894 14.3657C19.704 14.1342 19.4203 14 19.1209 14H12.8515C12.5128 14 12.3274 14.3947 12.5436 14.6554L21.0736 24.9385L13.1149 33.3246C12.873 33.5795 13.0537 34 13.405 34H15.7268C16.001 34 16.2632 33.8874 16.452 33.6885L22.7935 27.0082L28.2942 33.6385C28.4841 33.8675 28.7662 34 29.0638 34H35.1544C35.4921 34 35.6779 33.6074 35.4636 33.3463L26.5415 22.4718L33.9406 14.6754C34.1825 14.4205 34.0018 14 33.6505 14H31.7607Z" fill="#525152"/>
---
> <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
> <path d="M25.169 1.0993C25.7776 0.400721 26.6569 0 27.5811 0H28.0012C29.3779 0 30.1137 1.62831 29.2072 2.66878L19.7225 13.5549L31.6727 29.4201C32.4711 30.4801 31.7181 32 30.3947 32H24.321C23.3229 32 22.3818 31.533 21.7754 30.7369L14.2171 20.8131L5.42539 30.9012C4.81684 31.5995 3.93775 32 3.0137 32H2.58995C1.21325 32 0.477438 30.3717 1.38396 29.3312L11.6907 17.5015L0.33249 2.5867C-0.473863 1.52785 0.27797 0 1.60537 0H7.92299C8.92715 0 9.87326 0.472633 10.479 1.27688L17.219 10.2252L25.169 1.0993ZM24.2294 28.7508H27.2248L7.88967 3.07856H4.67531L24.2294 28.7508Z" fill="#323232"/>
Binary files fromBuild/assets/flutter_assets/assets/splash_blank.png and fromOfficial/assets/flutter_assets/assets/splash_blank.png differ
Binary files fromBuild/assets/flutter_assets/assets/splash.png and fromOfficial/assets/flutter_assets/assets/splash.png differ
diff --recursive fromBuild/assets/flutter_assets/assets/telegram.svg fromOfficial/assets/flutter_assets/assets/telegram.svg
1,2c1,2
< <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
< <path d="M23.9887 4C20.033 4 16.1662 5.17298 12.8773 7.37061C9.58827 9.56824 7.02482 12.6918 5.51107 16.3463C3.99731 20.0009 3.60125 24.0222 4.37295 27.9018C5.14466 31.7814 7.04947 35.3451 9.84652 38.1421C12.6436 40.9392 16.2072 42.844 20.0869 43.6157C23.9665 44.3874 27.9878 43.9913 31.6423 42.4776C35.2968 40.9638 38.4204 38.4004 40.618 35.1114C42.8157 31.8224 43.9887 27.9556 43.9887 24C43.9889 21.3735 43.4717 18.7727 42.4667 16.3461C41.4617 13.9195 39.9885 11.7146 38.1313 9.85738C36.2741 8.00016 34.0692 6.52698 31.6426 5.52197C29.216 4.51695 26.6152 3.99978 23.9887 4ZM30.3477 34.3049C30.2728 34.4916 30.1589 34.6601 30.0136 34.7991C29.8683 34.9382 29.695 35.0446 29.5052 35.1111C29.3154 35.1777 29.1136 35.2029 28.9133 35.1851C28.7129 35.1673 28.5187 35.1069 28.3437 35.0079L22.9143 30.7892L19.4297 34.004C19.3488 34.0637 19.2543 34.1022 19.1547 34.1158C19.055 34.1294 18.9536 34.1177 18.8597 34.0819L19.5277 28.105L19.5491 28.1219L19.5627 28.0039C19.5627 28.0039 29.3327 19.1089 29.7307 18.7299C30.1337 18.3519 30.0007 18.2699 30.0007 18.2699C30.0237 17.8089 29.2777 18.2699 29.2777 18.2699L16.3327 26.598L10.9417 24.762C10.9417 24.762 10.1137 24.465 10.0357 23.812C9.95368 23.164 10.9687 22.812 10.9687 22.812L32.4027 14.297C32.4027 14.297 34.1647 13.5119 34.1647 14.812L30.3477 34.3049Z" fill="#525152"/>
---
> <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
> <path opacity="0.35" fill-rule="evenodd" clip-rule="evenodd" d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM17.4335 11.422L6.65895 15.8613C4.763 16.6012 5.87282 17.2948 5.87282 17.2948C5.87282 17.2948 7.49132 17.8497 8.87862 18.2659C10.2659 18.6821 11.0058 18.2197 11.0058 18.2197L17.526 13.8266C19.8382 12.2544 19.2832 13.5491 18.7283 14.104C17.526 15.3063 15.5376 17.2023 13.8728 18.7283C13.1329 19.3757 13.5029 19.9306 13.8266 20.2081C14.7676 21.0043 16.9834 22.4521 17.9906 23.1103C18.2704 23.293 18.4569 23.4149 18.4971 23.4451C18.7283 23.63 20.0231 24.4624 20.8092 24.2775C21.5954 24.0924 21.6878 23.0289 21.6878 23.0289L22.8439 15.7688C22.9467 15.0881 23.0494 14.4218 23.1452 13.8004C23.3944 12.1842 23.5966 10.8722 23.63 10.4046C23.7688 8.8324 22.104 9.47977 22.104 9.47977C22.104 9.47977 18.4971 10.9595 17.4335 11.422Z" fill="white"/>
Binary files fromBuild/assets/flutter_assets/fonts/MaterialIcons-Regular.otf and fromOfficial/assets/flutter_assets/fonts/MaterialIcons-Regular.otf differ
Binary files fromBuild/assets/flutter_assets/packages/cupertino_icons/assets/CupertinoIcons.ttf and fromOfficial/assets/flutter_assets/packages/cupertino_icons/assets/CupertinoIcons.ttf differ
Binary files fromBuild/classes.dex and fromOfficial/classes.dex differ
Only in fromBuild: lib
Only in fromBuild/META-INF: androidx.core_core-splashscreen.version
Only in fromOfficial/META-INF: BNDLTOOL.RSA
Only in fromOfficial/META-INF: BNDLTOOL.SF
Only in fromOfficial/META-INF: MANIFEST.MF
Only in fromBuild/res: 06.png
Only in fromBuild/res: 09.9.png
Only in fromBuild/res: 09.png
Only in fromBuild/res: 0b.xml
Only in fromBuild/res: 0H.9.png
Only in fromBuild/res: 0I.png
Only in fromBuild/res: 11.png
Only in fromBuild/res: 1C.webp
Only in fromBuild/res: 1L.xml
Only in fromBuild/res: 1y.xml
Only in fromBuild/res: 2C.9.png
Only in fromBuild/res: 2D.xml
Only in fromBuild/res: 2K.png
Only in fromBuild/res: 2U.webp
Only in fromBuild/res: 33.9.png
Only in fromBuild/res: 36.xml
Only in fromBuild/res: 3c.webp
Only in fromBuild/res: 3c.xml
Only in fromBuild/res: 3m.xml
Only in fromBuild/res: 3_.png
Only in fromBuild/res: 3X.png
Only in fromBuild/res: 3z.xml
Only in fromBuild/res: 43.xml
Only in fromBuild/res: 48.png
Only in fromBuild/res: 4_.9.png
Only in fromBuild/res: 4c.xml
Only in fromBuild/res: 4C.xml
Only in fromBuild/res: 4P.png
Only in fromBuild/res: 4r.png
Only in fromBuild/res: 4W.xml
Only in fromBuild/res: 5j.9.png
Only in fromBuild/res: 5J.png
Only in fromBuild/res: 5z.9.png
Only in fromBuild/res: 65.xml
Only in fromBuild/res: _6.9.png
Only in fromBuild/res: 6E.png
Only in fromBuild/res: 6e.xml
Only in fromBuild/res: 6w.9.png
Only in fromBuild/res: 72.9.png
Only in fromBuild/res: 72.xml
Only in fromBuild/res: 75.xml
Only in fromBuild/res: 7E.webp
Only in fromBuild/res: 7F.9.png
Only in fromBuild/res: 7P.9.png
Only in fromBuild/res: _7.png
Only in fromBuild/res: 7T.9.png
Only in fromBuild/res: 7u.xml
Only in fromBuild/res: 80.xml
Only in fromBuild/res: 8j.png
Only in fromBuild/res: 8s.xml
Only in fromBuild/res: 8T.png
Only in fromBuild/res: 8V.9.png
Only in fromBuild/res: 8w.9.png
Only in fromBuild/res: 93.9.png
Only in fromBuild/res: 9P.png
Only in fromBuild/res: 9t.png
Only in fromBuild/res: 9V.png
Only in fromBuild/res: 9X.9.png
Only in fromBuild/res: 9Z.png
Only in fromBuild/res: A1.xml
Only in fromBuild/res: a6.png
Only in fromBuild/res: aA.xml
Only in fromBuild/res: AA.xml
Only in fromBuild/res: AB.9.png
Only in fromBuild/res: Ac.9.png
Only in fromBuild/res: aD.xml
Only in fromBuild/res: Al.xml
Only in fromOfficial/res: anim
Only in fromOfficial/res: animator
Only in fromOfficial/res: anim-v21
Only in fromBuild/res: an.png
Only in fromBuild/res: Ar.xml
Only in fromBuild/res: au.9.png
Only in fromBuild/res: aV.xml
Only in fromBuild/res: aW.png
Only in fromBuild/res: B8.xml
Only in fromBuild/res: b9.xml
Only in fromBuild/res: bb.xml
Only in fromBuild/res: Bc.xml
Only in fromBuild/res: BG.png
Only in fromBuild/res: bK.9.png
Only in fromBuild/res: bM.xml
Only in fromBuild/res: BO1.png
Only in fromBuild/res: BO.png
Only in fromBuild/res: bu.9.png
Only in fromBuild/res: bW.png
Only in fromBuild/res: Bx.xml
Only in fromBuild/res: C7.xml
Only in fromBuild/res: C9.png
Only in fromBuild/res: ca.9.png
Only in fromBuild/res: CA.9.png
Only in fromBuild/res: Cb.xml
Only in fromBuild/res: Cd.png
Only in fromBuild/res: Cf.webp
Only in fromBuild/res: cf.xml
Only in fromBuild/res: Cg.9.png
Only in fromBuild/res: cH.xml
Only in fromBuild/res: cM.9.png
Only in fromBuild/res: cm.png
Only in fromBuild/res: co.webp
Only in fromBuild/res: cp.png
Only in fromBuild/res: cR.png
Only in fromBuild/res: Cv.xml
Only in fromBuild/res: cw.xml
Only in fromBuild/res: d1.9.png
Only in fromBuild/res: Df.xml
Only in fromBuild/res: dH.9.png
Only in fromBuild/res: dp.xml
Only in fromBuild/res: DP.xml
Only in fromOfficial/res: drawable
Only in fromOfficial/res: drawable-anydpi-v23
Only in fromOfficial/res: drawable-hdpi-v4
Only in fromOfficial/res: drawable-v21
Only in fromOfficial/res: drawable-v23
Only in fromOfficial/res: drawable-watch-v20
Only in fromBuild/res: DS.xml
Only in fromBuild/res: Dt.9.png
Only in fromBuild/res: dv.9.png
Only in fromBuild/res: dV.xml
Only in fromBuild/res: dY.ogg
Only in fromBuild/res: e1.xml
Only in fromBuild/res: E2.9.png
Only in fromBuild/res: e4.9.png
Only in fromBuild/res: E7.xml
Only in fromBuild/res: eB.9.png
Only in fromBuild/res: Eb.9.png
Only in fromBuild/res: ee.png
Only in fromBuild/res: ei.9.png
Only in fromBuild/res: ej.xml
Only in fromBuild/res: eK.9.png
Only in fromBuild/res: ER.9.png
Only in fromBuild/res: Er.png
Only in fromBuild/res: eU.xml
Only in fromBuild/res: eX.png
Only in fromBuild/res: f1.xml
Only in fromBuild/res: F8.9.png
Only in fromBuild/res: f9.png
Only in fromBuild/res: fD.9.png
Only in fromBuild/res: FG.png
Only in fromBuild/res: Fg.xml
Only in fromBuild/res: fH.xml
Only in fromBuild/res: fI.xml
Only in fromBuild/res: fL.xml
Only in fromBuild/res: FL.xml
Only in fromBuild/res: FM.9.png
Only in fromBuild/res: fM.png
Only in fromBuild/res: fr.9.png
Only in fromBuild/res: fv.9.png
Only in fromBuild/res: FW.xml
Only in fromBuild/res: Fx1.9.png
Only in fromBuild/res: Fx.9.png
Only in fromBuild/res: fx.png
Only in fromBuild/res: FY.png
Only in fromBuild/res: fZ.9.png
Only in fromBuild/res: FZ.xml
Only in fromBuild/res: G7.png
Only in fromBuild/res: gA.xml
Only in fromBuild/res: Gb.xml
Only in fromBuild/res: Ge.xml
Only in fromBuild/res: gG.9.png
Only in fromBuild/res: gL.9.png
Only in fromBuild/res: gl.xml
Only in fromBuild/res: Gn.xml
Only in fromBuild/res: GQ.xml
Only in fromBuild/res: gT.xml
Only in fromBuild/res: gV.9.png
Only in fromBuild/res: gW.xml
Only in fromBuild/res: gZ.xml
Only in fromBuild/res: h0.9.png
Only in fromBuild/res: H1.xml
Only in fromBuild/res: HA.xml
Only in fromBuild/res: hj.9.png
Only in fromBuild/res: HS.9.png
Only in fromBuild/res: hu.xml
Only in fromBuild/res: I3.png
Only in fromBuild/res: I7.xml
Only in fromBuild/res: IC.png
Only in fromBuild/res: Ig.xml
Only in fromBuild/res: ih.xml
Only in fromBuild/res: ii.9.png
Only in fromBuild/res: iL.xml
Only in fromBuild/res: In.9.png
Only in fromOfficial/res: interpolator
Only in fromBuild/res: iN.webp
Only in fromBuild/res: iP.webp
Only in fromBuild/res: iu.xml
Only in fromBuild/res: Iv.xml
Only in fromBuild/res: Iw.png
Only in fromBuild/res: iw.xml
Only in fromBuild/res: I-.xml
Only in fromBuild/res: J6.9.png
Only in fromBuild/res: J7.xml
Only in fromBuild/res: J8.9.png
Only in fromBuild/res: j9.9.png
Only in fromBuild/res: j-.9.png
Only in fromBuild/res: ja.xml
Only in fromBuild/res: jh.9.png
Only in fromBuild/res: jI.xml
Only in fromBuild/res: jK.9.png
Only in fromBuild/res: Jo.xml
Only in fromBuild/res: jR.xml
Only in fromBuild/res: JV.png
Only in fromBuild/res: jw.png
Only in fromBuild/res: jw.xml
Only in fromBuild/res: K3.xml
Only in fromBuild/res: kB.xml
Only in fromBuild/res: kI.xml
Only in fromBuild/res: kK.9.png
Only in fromBuild/res: kM.xml
Only in fromBuild/res: Kp.9.png
Only in fromBuild/res: k_.png
Only in fromBuild/res: Kq.xml
Only in fromBuild/res: Ks.xml
Only in fromBuild/res: Kv.xml
Only in fromBuild/res: l2.xml
Only in fromOfficial/res: layout
Only in fromOfficial/res: layout-v21
Only in fromOfficial/res: layout-v26
Only in fromOfficial/res: layout-watch-v20
Only in fromBuild/res: ld.9.png
Only in fromBuild/res: LD.png
Only in fromBuild/res: LF.xml
Only in fromBuild/res: ll.xml
Only in fromBuild/res: Ll.xml
Only in fromBuild/res: Ln.xml
Only in fromBuild/res: LN.xml
Only in fromBuild/res: -l.png
Only in fromBuild/res: L_.png
Only in fromBuild/res: Lq.9.png
Only in fromBuild/res: LT.xml
Only in fromBuild/res: LU.xml
Only in fromBuild/res: lW.xml
Only in fromBuild/res: _l.xml
Only in fromBuild/res: m6.xml
Only in fromBuild/res: M6.xml
Only in fromBuild/res: m9.9.png
Only in fromOfficial/res: mipmap-anydpi-v26
Only in fromOfficial/res: mipmap-hdpi-v4
Only in fromOfficial/res: mipmap-mdpi-v4
Only in fromOfficial/res: mipmap-xhdpi-v4
Only in fromOfficial/res: mipmap-xxhdpi-v4
Only in fromOfficial/res: mipmap-xxxhdpi-v4
Only in fromBuild/res: Ml.9.png
Only in fromBuild/res: MN.xml
Only in fromBuild/res: MP.xml
Only in fromBuild/res: Mr.9.png
Only in fromBuild/res: mU.png
Only in fromBuild/res: Mz.9.png
Only in fromBuild/res: n0.png
Only in fromBuild/res: N2.xml
Only in fromBuild/res: n9.9.png
Only in fromBuild/res: N9.xml
Only in fromBuild/res: nb.png
Only in fromBuild/res: nB.png
Only in fromBuild/res: nd1.png
Only in fromBuild/res: nd.png
Only in fromBuild/res: NI.xml
Only in fromBuild/res: nl.xml
Only in fromBuild/res: NM.9.png
Only in fromBuild/res: NP.9.png
Only in fromBuild/res: n_.png
Only in fromBuild/res: NR.xml
Only in fromBuild/res: ns.png
Only in fromBuild/res: NU.xml
Only in fromBuild/res: NV.png
Only in fromBuild/res: nz.xml
Only in fromBuild/res: O3.9.png
Only in fromBuild/res: o4.xml
Only in fromBuild/res: o8.xml
Only in fromBuild/res: oB.xml
Only in fromBuild/res: Od.xml
Only in fromBuild/res: Of1.9.png
Only in fromBuild/res: Of.9.png
Only in fromBuild/res: Of.xml
Only in fromBuild/res: OK.xml
Only in fromBuild/res: on.xml
Only in fromBuild/res: oR.9.png
Only in fromBuild/res: Ot.png
Only in fromBuild/res: Ou.png
Only in fromBuild/res: Ov.xml
Only in fromBuild/res: Ow.xml
Only in fromBuild/res: -o.xml
Only in fromBuild/res: o-.xml
Only in fromBuild/res: oy.xml
Only in fromBuild/res: oz1.xml
Only in fromBuild/res: oz.xml
Only in fromBuild/res: p7.xml
Only in fromBuild/res: PA.xml
Only in fromBuild/res: pF.9.png
Only in fromBuild/res: PF.xml
Only in fromBuild/res: Pi.9.png
Only in fromBuild/res: Pq.9.png
Only in fromBuild/res: Px.xml
Only in fromBuild/res: Q11.9.png
Only in fromBuild/res: Q1.9.png
Only in fromBuild/res: q1.xml
Only in fromBuild/res: q4.xml
Only in fromBuild/res: q61.xml
Only in fromBuild/res: q6.xml
Only in fromBuild/res: QD.9.png
Only in fromBuild/res: Qj.xml
Only in fromBuild/res: qK.xml
Only in fromBuild/res: -q.png
Only in fromBuild/res: qQ.xml
Only in fromBuild/res: qr.9.png
Only in fromBuild/res: Qv.png
Only in fromBuild/res: Qw.xml
Only in fromBuild/res: r0.xml
Only in fromBuild/res: R6.xml
Only in fromOfficial/res: raw
Only in fromBuild/res: rb.9.png
Only in fromBuild/res: rE.xml
Only in fromBuild/res: rn.png
Only in fromBuild/res: Rq.xml
Only in fromBuild/res: r-.xml
Only in fromBuild/res: Rx.xml
Only in fromBuild/res: s2.9.png
Only in fromBuild/res: s6.xml
Only in fromBuild/res: sB.png
Only in fromBuild/res: SH.xml
Only in fromBuild/res: SI.png
Only in fromBuild/res: sL.9.png
Only in fromBuild/res: Sr.png
Only in fromBuild/res: SS.xml
Only in fromBuild/res: st.9.png
Only in fromBuild/res: St.xml
Only in fromBuild/res: SU.xml
Only in fromBuild/res: sX.png
Only in fromBuild/res: T2.9.png
Only in fromBuild/res: tb.xml
Only in fromBuild/res: tE.xml
Only in fromBuild/res: TF.9.png
Only in fromBuild/res: Ti.png
Only in fromBuild/res: tj.9.png
Only in fromBuild/res: TK.xml
Only in fromBuild/res: Tl.9.png
Only in fromBuild/res: tM.9.png
Only in fromBuild/res: tq.png
Only in fromBuild/res: TQ.png
Only in fromBuild/res: tr.9.png
Only in fromBuild/res: Ts.xml
Only in fromBuild/res: uB.9.png
Only in fromBuild/res: uF.xml
Only in fromBuild/res: ug.xml
Only in fromBuild/res: Ug.xml
Only in fromBuild/res: Ui.png
Only in fromBuild/res: UM.png
Only in fromBuild/res: uo.xml
Only in fromBuild/res: UO.xml
Only in fromBuild/res: U_.png
Only in fromBuild/res: Us.9.png
Only in fromBuild/res: uu.png
Only in fromBuild/res: -u.xml
Only in fromBuild/res: V-1.9.png
Only in fromBuild/res: V1.xml
Only in fromBuild/res: v2.xml
Only in fromBuild/res: V4.png
Only in fromBuild/res: v6.9.png
Only in fromBuild/res: v8.xml
Only in fromBuild/res: V-.9.png
Only in fromBuild/res: V9.png
Only in fromBuild/res: va.png
Only in fromBuild/res: vc.xml
Only in fromBuild/res: vd.png
Only in fromBuild/res: vD.xml
Only in fromBuild/res: Ve.xml
Only in fromBuild/res: vG.webp
Only in fromBuild/res: vH.xml
Only in fromBuild/res: VK.9.png
Only in fromBuild/res: Vl.xml
Only in fromBuild/res: vp.xml
Only in fromBuild/res: Vq.png
Only in fromBuild/res: VW1.png
Only in fromBuild/res: VW.png
Only in fromBuild/res: vy.9.png
Only in fromBuild/res: w7.xml
Only in fromBuild/res: w8.png
Only in fromBuild/res: Wc.xml
Only in fromBuild/res: wi1.9.png
Only in fromBuild/res: wi.9.png
Only in fromBuild/res: wK.9.png
Only in fromBuild/res: wL.9.png
Only in fromBuild/res: wN.png
Only in fromBuild/res: WO.xml
Only in fromBuild/res: _W.png
Only in fromBuild/res: W-.png
Only in fromBuild/res: wT.png
Only in fromBuild/res: WT.xml
Only in fromBuild/res: wW.png
Only in fromBuild/res: x1.xml
Only in fromBuild/res: X3.9.png
Only in fromBuild/res: x5.9.png
Only in fromBuild/res: X5.png
Only in fromBuild/res: XB.xml
Only in fromBuild/res: xD.png
Only in fromOfficial/res: xml
Only in fromBuild/res: XM.xml
Only in fromBuild/res: Xp.9.png
Only in fromBuild/res: xR.png
Only in fromBuild/res: Xr.xml
Only in fromBuild/res: Xs1.9.png
Only in fromBuild/res: Xs.9.png
Only in fromBuild/res: xs.xml
Only in fromBuild/res: XS.xml
Only in fromBuild/res: xW.png
Only in fromBuild/res: Y4.png
Only in fromBuild/res: Ya.webp
Only in fromBuild/res: ya.xml
Only in fromBuild/res: YF.xml
Only in fromBuild/res: YH.9.png
Only in fromBuild/res: Yh.png
Only in fromBuild/res: YJ.png
Only in fromBuild/res: yO.9.png
Only in fromBuild/res: yP.xml
Only in fromBuild/res: yq.png
Only in fromBuild/res: YQ.xml
Only in fromBuild/res: Yt.9.png
Only in fromBuild/res: YW.png
Only in fromBuild/res: -Y.xml
Only in fromBuild/res: z1.xml
Only in fromBuild/res: z3.xml
Only in fromBuild/res: Z4.xml
Only in fromBuild/res: zH.xml
Only in fromBuild/res: Zk.png
Only in fromBuild/res: zq.xml
Only in fromBuild/res: zw.png
Only in fromBuild/res: zy.png
Only in fromBuild/res: zZ.png
Binary files fromBuild/resources.arsc and fromOfficial/resources.arsc differ
Only in fromOfficial: stamp-cert-sha256
```

With these many differences, the wallet is **not verifiable**.


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