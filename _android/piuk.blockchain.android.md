---
wsId: blockchainWallet
title: "Blockchain.com Wallet - Buy Bitcoin, ETH, & Crypto"
altTitle: 
authors:
- leo
users: 10000000
appId: piuk.blockchain.android
released: 2013-02-01
updated: 2021-09-30
version: "8.12.1"
stars: 3.3
ratings: 110313
reviews: 55177
size: 18M
website: https://www.blockchain.com
repository: https://github.com/blockchain/My-Wallet-V3-Android
issue: https://github.com/blockchain/My-Wallet-V3-Android/issues/1293
icon: piuk.blockchain.android.png
bugbounty: https://hackerone.com/blockchain
verdict: nosource
date: 2021-07-15
signer: 87a6e89e2e45848c1ddc43021e95812aae70b0b54c6c320c71db4dff83f7b6a0
reviewArchive:
- date: 2020-07-11
  version: "6.35.0"
  appHash: 07bec5eaaffbbe9b490c2662f950e4696620cb5ef4201827011c312dc72b7f0c
  gitRevision: 477c4edc4f632895993602574ba383a08df9041f
  verdict: nonverifiable

providerTwitter: blockchain
providerLinkedIn: blockchain
providerFacebook: blockchain
providerReddit: 

redirect_from:
  - /blockchainwallet/
  - /piuk.blockchain.android/
  - /posts/2019/11/blockchainwallet/
  - /posts/piuk.blockchain.android/
---


**Update 2021-07-15**: The app on Play Store is version **8.8.7**. The source
repository does not contain any such version. The latest version on their GitHub
repository as of writing this is **8.8.5**. Without source available, this app
is **not verifiable**.

**Update 2020-07-11**: In
[this comment to our now closed issue](https://github.com/blockchain/My-Wallet-V3-Android/issues/1256#issuecomment-651718119)
they claim to have addressed the issues we had earlier reported. A first update
went not so good as the new version was not yet rolled out but now we have both
the latest binary and the updated build instructions, all integrated in our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/test.sh).

The result is underwhelming:

```
Results:
appId:          piuk.blockchain.android
signer:         87a6e89e2e45848c1ddc43021e95812aae70b0b54c6c320c71db4dff83f7b6a0
apkVersionName: 6.35.0
apkVersionCode: 551
appHash:        07bec5eaaffbbe9b490c2662f950e4696620cb5ef4201827011c312dc72b7f0c

Diff:
Files /tmp/fromPlay_piuk.blockchain.android_551/AndroidManifest.xml and /tmp/fromBuild_piuk.blockchain.android_551/AndroidManifest.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/apktool.yml and /tmp/fromBuild_piuk.blockchain.android_551/apktool.yml differ
Only in /tmp/fromBuild_piuk.blockchain.android_551: lib
Files /tmp/fromPlay_piuk.blockchain.android_551/original/AndroidManifest.xml and /tmp/fromBuild_piuk.blockchain.android_551/original/AndroidManifest.xml differ
Only in /tmp/fromPlay_piuk.blockchain.android_551/original/META-INF: BNDLTOOL.RSA
Only in /tmp/fromPlay_piuk.blockchain.android_551/original/META-INF: BNDLTOOL.SF
Files /tmp/fromPlay_piuk.blockchain.android_551/original/META-INF/MANIFEST.MF and /tmp/fromBuild_piuk.blockchain.android_551/original/META-INF/MANIFEST.MF differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_btn_check_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_btn_check_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_btn_radio_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_btn_radio_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_edit_text_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_edit_text_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_item_background_holo_dark.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_item_background_holo_dark.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_item_background_holo_light.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_item_background_holo_light.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_list_selector_background_transition_holo_dark.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_list_selector_background_transition_holo_dark.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_list_selector_background_transition_holo_light.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_list_selector_background_transition_holo_light.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_list_selector_holo_dark.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_list_selector_holo_dark.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_list_selector_holo_light.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_list_selector_holo_light.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_ratingbar_indicator_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_ratingbar_indicator_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_ratingbar_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_ratingbar_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_ratingbar_small_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_ratingbar_small_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_seekbar_thumb_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_seekbar_thumb_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_seekbar_track_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_seekbar_track_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_spinner_textfield_background_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_spinner_textfield_background_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_switch_thumb_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_switch_thumb_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_tab_indicator_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_tab_indicator_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/abc_textfield_search_material.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/abc_textfield_search_material.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_icon_dark_normal.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_icon_dark_normal.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_icon_disabled.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_icon_disabled.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_icon_light_normal.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_icon_light_normal.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_text_dark_normal.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_text_dark_normal.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_text_disabled.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_text_disabled.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_text_light_normal.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/common_google_signin_btn_text_light_normal.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/design_password_eye.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/design_password_eye.xml differ
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable: ic_search.xml
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/notification_bg_low.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/notification_bg_low.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/notification_bg.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/notification_bg.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/drawable/notification_tile_bg.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/drawable/notification_tile_bg.xml differ
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-anydpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ab_share_pack_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_btn_check_to_on_mtrl_000.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_btn_check_to_on_mtrl_015.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_btn_radio_to_on_mtrl_000.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_btn_radio_to_on_mtrl_015.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_btn_switch_to_on_mtrl_00001.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_btn_switch_to_on_mtrl_00012.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_cab_background_top_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_commit_search_api_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_menu_copy_mtrl_am_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_menu_cut_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_menu_paste_mtrl_am_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_menu_selectall_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_menu_share_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_star_black_16dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_star_black_36dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_star_black_48dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_star_half_black_16dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_star_half_black_36dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_ic_star_half_black_48dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_list_divider_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_list_focused_holo.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_list_longpressed_holo.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_list_pressed_holo_dark.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_list_pressed_holo_light.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_list_selector_disabled_holo_dark.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_list_selector_disabled_holo_light.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_menu_hardkey_panel_mtrl_mult.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_popup_background_mtrl_mult.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_scrubber_control_off_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_scrubber_control_to_pressed_mtrl_000.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_scrubber_control_to_pressed_mtrl_005.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_scrubber_primary_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_scrubber_track_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_spinner_mtrl_am_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_switch_track_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_tab_indicator_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_textfield_activated_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_textfield_default_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_textfield_search_activated_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_textfield_search_default_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_text_select_handle_left_mtrl_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_text_select_handle_left_mtrl_light.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_text_select_handle_middle_mtrl_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_text_select_handle_middle_mtrl_light.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_text_select_handle_right_mtrl_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: abc_text_select_handle_right_mtrl_light.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_amex.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_camera_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_camera.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_card_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_cardholder_name_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_cardholder_name.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_card.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_diners_club.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_discover.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_hipercard.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_hiper.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_jcb.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_maestro.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_mastercard.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_mobile_number_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_mobile_number.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_postal_code_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_postal_code.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_unionpay.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_unknown.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: bt_ic_visa.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: common_full_open_on_phone.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: common_google_signin_btn_icon_dark_normal_background.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: common_google_signin_btn_icon_light_normal_background.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: common_google_signin_btn_text_dark_normal_background.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: common_google_signin_btn_text_light_normal_background.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: design_ic_visibility_off.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: design_ic_visibility.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: googleg_disabled_color_18.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: googleg_standard_color_18.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_arrow_drop_down_grey600_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_clear_white_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_fingerprint_logo.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_flare_white_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_launcher_round.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_notification_white.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: icon_swap_intro_five.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: icon_swap_intro_four.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: icon_swap_intro_one.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: icon_swap_intro_three.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: icon_swap_intro_two.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_receive_copy.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_receive_scan.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_search.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_share_white_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: ic_warning_white_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: image_laptop_centered.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: image_laptop_cutoff.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: image_lockbox.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: mdtp_ic_chevron_left_black_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: mdtp_ic_chevron_right_black_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: notification_bg_low_normal.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: notification_bg_low_pressed.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: notification_bg_normal.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: notification_bg_normal_pressed.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: notify_panel_notification_icon_bg.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: places_ic_clear.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: places_ic_search.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: powered_by_google_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: powered_by_google_light.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: price_container.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_biometric_passport.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_back_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_back.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_btn_check.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_btn_close.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_button_loader_full.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_button_loader_hollow.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_check.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_close.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_decision_tick.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_driving_large.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_driving.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_dropdown.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_error_camera.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_error_microphone.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_error_network.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_error_nfc.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_error_session.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_error_system.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_green_check.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_id_large.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_id.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_info.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_language.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_notification.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_passport_large.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_passport.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_progress_indefinite.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_residence_large.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_residence.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_search.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_signal_1_on.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_signal_1.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_signal_2_on.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_signal_2.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_signal_3_on.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_signal_3.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_submission_not_ok.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_submission_ok.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_turn.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_ic_veriff.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_instruction_back_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_instruction_emrtd.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_instruction_front_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_instruction_passport_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_instruction_portrait_and_doc_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_instruction_portrait_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_phone.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-hdpi: vrff_preselected_passport.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-ldpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-ldrtl-hdpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-ldrtl-mdpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-ldrtl-xhdpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-ldrtl-xxhdpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-ldrtl-xxxhdpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-mdpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-xhdpi
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ab_share_pack_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_btn_check_to_on_mtrl_000.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_btn_check_to_on_mtrl_015.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_btn_radio_to_on_mtrl_000.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_btn_radio_to_on_mtrl_015.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_btn_switch_to_on_mtrl_00001.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_btn_switch_to_on_mtrl_00012.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_cab_background_top_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_commit_search_api_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_menu_copy_mtrl_am_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_menu_cut_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_menu_paste_mtrl_am_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_menu_selectall_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_menu_share_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_star_black_16dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_star_black_36dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_star_black_48dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_star_half_black_16dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_star_half_black_36dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_ic_star_half_black_48dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_list_divider_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_list_focused_holo.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_list_longpressed_holo.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_list_pressed_holo_dark.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_list_pressed_holo_light.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_list_selector_disabled_holo_dark.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_list_selector_disabled_holo_light.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_menu_hardkey_panel_mtrl_mult.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_popup_background_mtrl_mult.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_scrubber_control_off_mtrl_alpha.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_scrubber_control_to_pressed_mtrl_000.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_scrubber_control_to_pressed_mtrl_005.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_scrubber_primary_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_scrubber_track_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_spinner_mtrl_am_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_switch_track_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_tab_indicator_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_textfield_activated_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_textfield_default_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_textfield_search_activated_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_textfield_search_default_mtrl_alpha.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_text_select_handle_left_mtrl_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_text_select_handle_left_mtrl_light.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_text_select_handle_middle_mtrl_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_text_select_handle_middle_mtrl_light.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_text_select_handle_right_mtrl_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: abc_text_select_handle_right_mtrl_light.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_amex.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_camera_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_camera.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_card_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_cardholder_name_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_cardholder_name.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_card.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_diners_club.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_discover.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_hipercard.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_hiper.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_jcb.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_maestro.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_mastercard.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_mobile_number_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_mobile_number.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_postal_code_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_postal_code.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_unionpay.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_unknown.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: bt_ic_visa.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: common_google_signin_btn_icon_dark_normal_background.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: common_google_signin_btn_icon_light_normal_background.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: common_google_signin_btn_text_dark_normal_background.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: common_google_signin_btn_text_light_normal_background.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: design_ic_visibility_off.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: design_ic_visibility.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: googleg_disabled_color_18.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: googleg_standard_color_18.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_arrow_drop_down_grey600_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_clear_white_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_fingerprint_logo.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_flare_white_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_launcher_round.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_notification_white.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: icon_swap_intro_five.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: icon_swap_intro_four.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: icon_swap_intro_one.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: icon_swap_intro_three.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: icon_swap_intro_two.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_receive_copy.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_receive_scan.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_search.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_share_white_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: ic_warning_white_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: image_laptop_centered.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: image_laptop_cutoff.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: image_lockbox.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: mdtp_ic_chevron_left_black_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: mdtp_ic_chevron_right_black_24dp.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: places_ic_clear.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: places_ic_search.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: powered_by_google_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: powered_by_google_light.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: price_container.9.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_biometric_passport.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_back_dark.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_back.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_btn_check.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_btn_close.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_button_loader_full.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_button_loader_hollow.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_check.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_close.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_decision_tick.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_driving_large.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_driving.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_dropdown.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_error_camera.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_error_microphone.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_error_network.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_error_nfc.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_error_session.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_error_system.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_green_check.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_id_large.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_id.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_info.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_language.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_notification.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_passport_large.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_passport.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_progress_indefinite.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_residence_large.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_residence.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_search.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_signal_1_on.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_signal_1.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_signal_2_on.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_signal_2.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_signal_3_on.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_signal_3.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_submission_not_ok.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_submission_ok.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_turn.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_ic_veriff.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_instruction_back_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_instruction_emrtd.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_instruction_front_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_instruction_passport_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_instruction_portrait_and_doc_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_instruction_portrait_new.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_phone.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res/drawable-xxhdpi: vrff_preselected_passport.png
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: drawable-xxxhdpi
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/activity_lockbox_landing.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/activity_lockbox_landing.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/activity_transaction_details.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/activity_transaction_details.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/country_picker.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/country_picker.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/dialog_confirm_transaction.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/dialog_confirm_transaction.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/dialog_fingerprint.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/dialog_fingerprint.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/dialog_transfer_funds.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/dialog_transfer_funds.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/include_from_row.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/include_from_row.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/include_to_row_editable.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/include_to_row_editable.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/include_to_row.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/include_to_row.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/item_announcement_standard.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/item_announcement_standard.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/item_transaction.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/item_transaction.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/mdtp_daypicker_group.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/mdtp_daypicker_group.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/picker_layout.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/picker_layout.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/place_autocomplete_fragment.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/place_autocomplete_fragment.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/place_autocomplete_item_powered_by_google.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/place_autocomplete_item_powered_by_google.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/price_chart_marker.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/price_chart_marker.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/layout/spinner_item.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/layout/spinner_item.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/menu/menu_account.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/menu/menu_account.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/menu/menu_scan.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/menu/menu_scan.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/menu/menu_transaction_detail.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/menu/menu_transaction_detail.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/values/drawables.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/values/drawables.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/values/public.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/values/public.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/values/strings.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/values/strings.xml differ
Files /tmp/fromPlay_piuk.blockchain.android_551/res/values/styles.xml and /tmp/fromBuild_piuk.blockchain.android_551/res/values/styles.xml differ
Only in /tmp/fromBuild_piuk.blockchain.android_551/res: values-hdpi
Only in /tmp/fromPlay_piuk.blockchain.android_551/res/xml: splits0.xml
Files /tmp/fromPlay_piuk.blockchain.android_551/smali/com/blockchain/koin/modules/FeaturesKt.smali and /tmp/fromBuild_piuk.blockchain.android_551/smali/com/blockchain/koin/modules/FeaturesKt.smali differ
Files /tmp/fromPlay_piuk.blockchain.android_551/smali_classes2/piuk/blockchain/android/ui/thepit/PitLaunchBottomDialog$Companion$launch$$inlined$apply$lambda$1.smali and /tmp/fromBuild_piuk.blockchain.android_551/smali_classes2/piuk/blockchain/android/ui/thepit/PitLaunchBottomDialog$Companion$launch$$inlined$apply$lambda$1.smali differ
Files /tmp/fromPlay_piuk.blockchain.android_551/smali_classes2/piuk/blockchain/android/ui/thepit/PitPermissionsPresenter.smali and /tmp/fromBuild_piuk.blockchain.android_551/smali_classes2/piuk/blockchain/android/ui/thepit/PitPermissionsPresenter.smali differ
```

and while closer inspection shows that some of differences are fake credentials
vs. real credentials, this by far does not explain all of the diff.

For a verdict "reproducible", those diffs would be too much already as there is
no good reason not to put credentials into the code repository as they would
stand out in the diff anyway.

For now the verdict remains **not verifiable**. 
