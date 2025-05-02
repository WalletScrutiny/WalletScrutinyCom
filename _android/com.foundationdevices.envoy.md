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
updated: 2025-02-01
version: 1.8.6
stars: 4.2
ratings: 
reviews: 5
website: https://foundationdevices.com/
repository: https://github.com/Foundation-Devices/envoy
issue: https://github.com/Foundation-Devices/envoy/issues/1395
icon: com.foundationdevices.envoy.jpg
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes:
- 84628d12486a8f47879952a2cf8bb6e0650c0f0d7ad7c0ccb71fded5bcc6e5f0
- 651ee1d39e5e8373af42229e98f4cd6c4bb57e070dd8881c31a91c40bcd971b2
- ad7fccf1d8dfc1761d2dbebc8ca6cc6a55ed7ee48b9e4636301ec184bbf5eb32
- 44dedb6efff420a0fc618162ab61d6d15b57cb6f025a0e181c072a12c0621727
date: 2025-02-13
signer: 
reviewArchive:
- date: 2024-11-22
  version: 1.8.4
  appHashes:
  - 7d883cf4ac02b16238e2075a726db8dcefd7250f8461d06565e2daf9b520e2be
  - c7283366b3c0857aae728dfa38d5776985362c000864d11ad95e5ea446019bae
  - 2e8d46dc9d6df35d69b1f796e1ff44dd5eef92aafcb94c88159a7dd96c6527bd
  - a3830481af62bf78d71a3e628f837fc76959d38028e985945bea956f8e80a931
  gitRevision: 6c17feb4d414efa40ea736b9d2e8d44216776893
  verdict: nonverifiable
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

## Updated Review v1.8.6 2025-02-13

Using our [testAAB.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/testAAB.sh) script, along with the existing app-specific script and dockerfile. 

{% include asciicast %}

## Build Results

### arm64_v8a.apk

```
Differences found between /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/arm64_v8a and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/arm64_v8a
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/arm64_v8a/AndroidManifest.xml and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/arm64_v8a/AndroidManifest.xml differ
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/arm64_v8a/lib/arm64-v8a/libapp.so and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/arm64_v8a/lib/arm64-v8a/libapp.so differ
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/arm64_v8a/lib/arm64-v8a/libbackup_ffi.so and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/arm64_v8a/lib/arm64-v8a/libbackup_ffi.so differ
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/arm64_v8a/lib/arm64-v8a/libtor.so and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/arm64_v8a/lib/arm64-v8a/libtor.so differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/arm64_v8a: META-INF
Only in /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/arm64_v8a: stamp-cert-sha256
Differences saved to /tmp/test_com.foundationdevices.envoy_1.8.6/diff_arm64_v8a.txt
```

### base.apk

```
Differences found between /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/base and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/base
./testAAB.sh: line 277: echo: write error: Broken pipe
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/base/assets/dexopt/baseline.prof and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/base/assets/dexopt/baseline.prof differ
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/base/assets/dexopt/baseline.profm and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/base/assets/dexopt/baseline.profm differ
diff -r /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/base/assets/flutter_assets/AssetManifest.bin /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/base/assets/flutter_assets/AssetManifest.bin
1c1
�assets/BTCPayLogo.png
assetassets/BTCPayLogo.pngassets/EnvoyIcons.ttf
assetassets/EnvoyIcons.ttfassets/accounts.svg
assetassets/accounts.svgassets/address_verify.png
assetassets/address_verify.pngssets/allowed_regions.json
assetssets/allowed_regions.jsonassets/animated_odometer.riv
assetassets/animated_odometer.riv assets/animated_privacy_icon.riv
asset assets/animated_privacy_icon.rivassets/atm_data.json
assetassets/atm_data.jsonassets/azteco_logo.png
assetassets/azteco_logo.pngassets/backspace.svg
assetassets/backspace.svgassets/beefqa_backup.mla.txt
assetassets/beefqa_backup.mla.txtassets/bitcoin.svg
assetassets/bitcoin.svgassets/circle_ok.png
assetassets/circle_ok.pngassets/coin_lock.riv
assetassets/coin_lock.rivassets/community.svg
assetassets/community.svg$assets/components/icons/activity.svg
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
assetassets/splash_blank.pngassets/trophy_icon.png
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
asset"assets/components/icons/wallet.svgassets/currencies.json
assetassets/currencies.jsonassets/data_secured_1.png
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
asset&google_fonts/Montserrat-ThinItalic.ttf-integration_test/assets/beefqa_backup.mla.txt
asset-integration_test/assets/beefqa_backup.mla.txt2packages/cupertino_icons/assets/CupertinoIcons.ttf
asset2packages/cupertino_icons/assets/CupertinoIcons.ttf)packages/wakelock_plus/assets/no_sleep.js
asset)packages/wakelock_plus/assets/no_sleep.js
\ No newline at end of file
[Output truncated. Full diff saved to /tmp/test_com.foundationdevices.envoy_1.8.6/diff_base.txt]
```

### en.apk 

```
Differences found between /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/en and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/en
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/en/AndroidManifest.xml and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/en/AndroidManifest.xml differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/en: META-INF
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/en/resources.arsc and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/en/resources.arsc differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/en: stamp-cert-sha256
```

### xxhdpi.apk

```
Differences found between /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/xxhdpi and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/xxhdpi
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/xxhdpi/AndroidManifest.xml and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/xxhdpi/AndroidManifest.xml differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/xxhdpi: META-INF
Binary files /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/xxhdpi/resources.arsc and /tmp/test_com.foundationdevices.envoy_1.8.6/fromBuild-unzipped/xxhdpi/resources.arsc differ
Only in /tmp/test_com.foundationdevices.envoy_1.8.6/fromPlay-unzipped/xxhdpi: stamp-cert-sha256
Differences saved to /tmp/test_com.foundationdevices.envoy_1.8.6/diff_xxhdpi.txt
```

## Analysis 

Due to the sheer number of diffs found between the Google Play and the build APKs, we did not perform a diffoscope on individual files. 

Thus, we conclude that version 1.8.6 of this app is **not verifiable**.


# App Description from Google Play

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

