---
wsId: nunchuk
title: Nunchuk Bitcoin Wallet
altTitle: 
authors:
- leo
- emanuel
- mohammad
- danny
users: 10000
appId: io.nunchuk.android
appCountry: 
released: 2021-11-11
updated: 2025-03-26
version: 1.9.66
stars: 4.6
ratings: 26
reviews: 26
website: https://nunchuk.io
repository: https://github.com/nunchuk-io/nunchuk-android
issue: >-
  https://github.com/nunchuk-io/nunchuk-android/issues/23#issuecomment-2723364936
icon: io.nunchuk.android.png
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes:
- d2721ac6aaba398c65c85ce3ed1e7cf312f9cb1273de0fb2eb026389f3ca3b43
- 377d6a1b285afb8ff9343975736baf61b4f3f692b9aeb0fa18d61880aabb8e89
- 7862ed4b3830ee1439e8545ebb863b3fe4233697c51edf04ab16090969855b5f
date: 2025-03-13
signer: 79b1cd71de5f19c6236d4e3ef134b5b691cf051a138944bda01b640b3e9b1d42
reviewArchive:
- date: 2025-03-04
  version: 1.9.62
  appHashes:
  - d2cdcf52e5534d91275f85abb465bfc076871812512256f8c9b51b1f4a8cb69b
  - e2ae9e4b88963e7142c80c02a2c49b417fa34fb1809f296452efd828928b0b22
  - 698dd56861707684165d0dc39c6df73284a9cbadf867fd3accf8c6bf5cfdaaff
  verdict: reproducible
- date: 2025-01-27
  version: 1.9.59
  appHashes:
  - c0cc213b0e5f309d4bf83d8ff576f7e7c324c2273e202170a10704b0b5d9d535
  - 03a0faf7feae6ced736a0894049163dbfc81d8b616c0c549d1b9dc7c781bd0cc
  - 3f704527776c7696c85728790f8639ced4d38eaa1a43229d33c4c8b8aa0a1e0a
  gitRevision: 93f538c4a309c720acb3a344ddb614b5d546cefa
  verdict: nonverifiable
- date: 2025-01-15
  version: 1.9.58
  appHashes:
  - 8f53fa42fc072381ea228314fa421b52a77b33e9fe6029095fc1d13c68fd9b41
  - 9027651c5ed7dd4a31d6cd073023bb77f38b799d8a0aa0ff0f81a184b1795dd3
  - 02c32758930cf0d4d87a44a5985f7bf97550280e1539074276a277866489f022
  gitRevision: 8080d3a7f2c5ea5e5acf56295040b814accb6b11
  verdict: nonverifiable
- date: 2024-11-19
  version: 1.9.53
  appHashes: []
  gitRevision: 4458285efc54bd9bc76d74f88e696201a4af4a93
  verdict: nonverifiable
- date: 2024-11-19
  version: 1.9.53
  appHashes:
  - aaec6e500babbd1931db8485b99205468e426f6157df131f607aa69b6e821708
  gitRevision: b720beb1ee4f9de53638ab013f759690c8e787a4
  verdict: nonverifiable
- date: 2023-07-05
  version: 1.9.32
  appHashes: []
  gitRevision: 5e67b0f51e6c67a3e1140ba66a1b4222e8cfe2a4
  verdict: nonverifiable
- date: 2023-01-06
  version: 1.9.23
  appHashes: []
  gitRevision: 49d61c1c5807f24ea01ba185a2de6793f8df0d38
  verdict: nonverifiable
- date: 2021-12-15
  version: 1.9.21
  appHashes: []
  gitRevision: f9bb0384d334f1ab3cd67824f43ff0053e7e51e7
  verdict: nosource
twitter: nunchuk_io
social:
- https://nunchuk.medium.com/
- >-
  https://join.slack.com/t/nunchukio/shared_invite/zt-xqdlvl5g-xKKohQu_R7IUo7_np8rVaw
redirect_from: 
developerName: Nunchuk Inc
features: 

---

## Update for v1.9.64

We updated both testAAB.sh and io.nunchuk.android.sh to better accommodate the generation of the device-spec.json file. We also added to the `Begin Results` block to include the signer.

```
*** Summary of Differences ***
Contents of diff_armeabi_v7a.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/armeabi_v7a/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/armeabi_v7a/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/armeabi_v7a: META-INF
Only in /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/armeabi_v7a: stamp-cert-sha256

Contents of diff_base.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/assets/dexopt/baseline.prof and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/assets/dexopt/baseline.prof differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/assets/dexopt/baseline.profm and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/assets/dexopt/baseline.profm differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/classes2.dex and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/classes2.dex differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/classes3.dex and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/classes3.dex differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/classes4.dex and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/classes4.dex differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/classes5.dex and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/classes5.dex differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/classes6.dex and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/classes6.dex differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/classes.dex and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/classes.dex differ
Only in /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/META-INF/services: Ii0
Only in /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/META-INF/services: Li0
Only in /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/META-INF/services: su
Only in /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/META-INF/services: vu
diff -r /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/META-INF/version-control-info.textproto /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/META-INF/version-control-info.textproto
4c4
<   revision: "1691f07f29a2646177d6d186ce6a75c3edfcd95e"
---
>   revision: "2d7955cb3c2b70d3056e6e29cfa4b967bb970571"
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/drawable/$avd_hide_password__0.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/drawable/$avd_hide_password__0.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/drawable/$avd_hide_password__1.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/drawable/$avd_hide_password__1.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/drawable/$avd_show_password__0.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/drawable/$avd_show_password__0.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/drawable/$avd_show_password__1.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/drawable/$avd_show_password__1.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/drawable/design_ic_visibility.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/drawable/design_ic_visibility.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/drawable/ic_info.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/drawable/ic_info.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_about.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_about.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_account_setting.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_account_setting.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_add_name.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_add_name.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_add_recover_shared_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_add_recover_shared_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_add_recover_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_add_recover_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_address_details.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_address_details.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_assign_signer.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_assign_signer.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_change_password.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_change_password.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_chat_info.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_chat_info.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_configure_shared_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_configure_shared_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_configure_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_configure_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_create_shared_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_create_shared_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_delete_account.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_delete_account.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_developer_setting.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_developer_setting.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_display_unit_setting.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_display_unit_setting.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_dynamic_qr.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_dynamic_qr.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_export_transaction.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_export_transaction.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_forgot_password.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_forgot_password.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_group_chat_info.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_group_chat_info.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_group_members.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_group_members.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_import_transaction.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_import_transaction.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_import_wallet_qrcode.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_import_wallet_qrcode.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_network_setting.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_network_setting.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_account.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_account.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_add_signer.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_add_signer.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_choose_username.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_choose_username.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_enter_passphrase.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_enter_passphrase.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_manually_signature.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_manually_signature.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_manually_username.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_manually_username.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_replace_key_intro.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_replace_key_intro.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_sign_in_intro.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_sign_in_intro.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_sign_in.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_sign_in.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_pkey_sign_up_intro.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_pkey_sign_up_intro.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_recover_password.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_recover_password.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_recover_seed.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_recover_seed.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_recover_shared_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_recover_shared_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_review_shared_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_review_shared_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_scan_dynamic_qr.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_scan_dynamic_qr.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_shared_wallet_config.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_shared_wallet_config.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_signer_intro.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_signer_intro.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_signin.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_signin.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_signup.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_signup.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_software_signer_intro.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_software_signer_intro.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_sync_setting.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_sync_setting.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_taproot_warning.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_taproot_warning.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_transaction_add_receipt.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_transaction_add_receipt.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_transaction_confirm.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_transaction_confirm.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_transaction_estimate_fee.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_transaction_estimate_fee.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_transaction_input_amount.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_transaction_input_amount.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_transaction_receive.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_transaction_receive.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_turn_notification.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_turn_notification.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_turn_on_nfc.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_turn_on_nfc.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_user_devices.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_user_devices.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_verify_new_device.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_verify_new_device.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_wallet_add.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_wallet_add.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_wallet_backup_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_wallet_backup_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_wallet_dynamic_qr.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_wallet_dynamic_qr.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_wallet_empty_signer.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_wallet_empty_signer.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/activity_wallet_upload_configuration.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/activity_wallet_upload_configuration.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_add_contacts.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_add_contacts.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_add_members.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_add_members.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_assisted_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_assisted_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_chat_group_info.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_chat_group_info.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_coin_collection.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_coin_collection.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_configure_gap_limit.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_configure_gap_limit.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_create_room.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_create_room.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_edit_name.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_edit_name.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_edit_tag_name.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_edit_tag_name.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_edit_user_photo.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_edit_user_photo.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_select_message.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_select_message.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/bottom_sheet_wallet_recovery_action.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/bottom_sheet_wallet_recovery_action.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/dialog_input_bottom_sheet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/dialog_input_bottom_sheet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/dialog_set_up_options_sheet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/dialog_set_up_options_sheet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/dialog_signer_detail_options_sheet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/dialog_signer_detail_options_sheet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/dialog_transaction_sign_bottom_sheet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/dialog_transaction_sign_bottom_sheet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/dialog_update_group_name_bottom_sheet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/dialog_update_group_name_bottom_sheet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/dialog_update_signer_bottom_sheet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/dialog_update_signer_bottom_sheet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/dialog_update_wallet_bottom_sheet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/dialog_update_wallet_bottom_sheet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_account_setting.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_account_setting.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_account.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_account.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_add_name_key.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_add_name_key.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_chat.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_chat.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_confirm_seed.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_confirm_seed.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_create_seed.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_create_seed.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_decryption_key.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_decryption_key.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_dialog_outpoint.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_dialog_outpoint.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_dummy_transaction_details.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_dummy_transaction_details.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_inheritance_notify_pref.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_inheritance_notify_pref.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_messages.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_messages.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_nfc_change_cvc.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_nfc_change_cvc.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_nfc_key_recover_info.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_nfc_key_recover_info.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_recover_nfc_key_guide.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_recover_nfc_key_guide.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_replace_by_fee.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_replace_by_fee.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_room_detail.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_room_detail.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_satscard_active_slot.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_satscard_active_slot.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_search_transaction.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_search_transaction.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_select_wallet_sweep.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_select_wallet_sweep.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_services_tab.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_services_tab.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_set_passphrase.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_set_passphrase.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_setup_chain_code.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_setup_chain_code.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_signer_info.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_signer_info.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_sign_in_dummy_transaction_details.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_sign_in_dummy_transaction_details.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_sign_in_qr.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_sign_in_qr.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_transaction_confirm.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_transaction_confirm.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_unseal_slot.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_unseal_slot.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_wallet_detail.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_wallet_detail.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_wallet_intermediary.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_wallet_intermediary.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_wallet_security_setting.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_wallet_security_setting.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/fragment_wallets.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/fragment_wallets.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_assign_signer.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_assign_signer.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_nunchuk_banner_new_chat.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_nunchuk_banner_new_chat.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_pkey_account.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_pkey_account.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_room.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_room.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_select_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_select_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_service_tab_empty_state.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_service_tab_empty_state.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_service_tab_observer_role.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_service_tab_observer_role.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_signer.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_signer.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_transaction_card.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_transaction_card.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_transaction_signer.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_transaction_signer.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_transaction.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_transaction.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_upgrade_plan_instruction.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_upgrade_plan_instruction.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_user_device.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_user_device.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_wallet_card.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_wallet_card.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_wallet_config_signer.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_wallet_config_signer.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/item_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/item_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/layout_empty_state_assign_signer.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/layout_empty_state_assign_signer.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/layout_empty_state_contacts.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/layout_empty_state_contacts.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/layout_syncing_data.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/layout_syncing_data.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_confirm_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_confirm_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_confirm_invite_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_confirm_invite_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_delete_confirm_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_delete_confirm_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_info_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_info_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_info_loading_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_info_loading_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_loading_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_loading_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_progress_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_progress_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_vertical_input_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_vertical_input_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_warning_dialog_veritcal.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_warning_dialog_veritcal.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nc_warning_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nc_warning_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/nfc_scan_dialog.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/nfc_scan_dialog.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/view_wallet_sticky.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/view_wallet_sticky.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/layout/zxing_barcode_scanner.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/layout/zxing_barcode_scanner.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/bottom_nav_menu.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/bottom_nav_menu.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_create_transaction.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_create_transaction.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_more_black.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_more_black.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_more.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_more.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_scan_qr.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_scan_qr.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_singer_details.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_singer_details.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_transaction_details.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_transaction_details.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_wallet_config.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_wallet_config.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_wallet_details.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_wallet_details.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/menu/menu_wallet.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/menu/menu_wallet.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/res/navigation/mobile_navigation.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/res/navigation/mobile_navigation.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base/resources.arsc and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/base/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/base: stamp-cert-sha256

Contents of diff_xhdpi.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/xhdpi/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/xhdpi/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/xhdpi: META-INF
Binary files /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/xhdpi/resources.arsc and /tmp/test_io.nunchuk.android_1.9.64/fromBuild-unzipped/xhdpi/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.64/fromPlay-unzipped/xhdpi: stamp-cert-sha256

```

{% include asciicast %}

## Analysis 

In stark contrast to version **1.9.62**, version **1.9.64** has a lot of diffs particularly in the main apk file `base.apk`. While we investigate the root cause of this, we determine version **1.9.64** to be **nonverifiable**.

We updated the [existing issue](https://github.com/nunchuk-io/nunchuk-android/issues/23#issuecomment-2723364936) with this new information.


## App Description

Nunchuk is a Bitcoin wallet offering advanced multisignature (multisig) functionality, inheritance planning, and robust privacy features. It eliminates single points of failure with multisig setups and provides key recovery options through encrypted cloud backups. The wallet ensures non-custodial control, allowing users to retain full ownership of their Bitcoin. Privacy is emphasized with features like end-to-end encrypted communication and inheritance planning without identity verification.

Additional capabilities include advanced coin control for managing transaction inputs, tagging, and filtering coins, as well as a multi-user multisig wallet for shared Bitcoin management. Nunchuk supports secure collaboration for families or businesses, ensuring that assets can be managed collectively with ease.

### Provider's Own Process

The provider has their own **[script](https://github.com/nunchuk-io/nunchuk-android/blob/master/reproducible-builds/apkdiff.py)** and **[instructions](https://github.com/nunchuk-io/nunchuk-android/tree/master/reproducible-builds)** for testing the reproducibility of the app. 


