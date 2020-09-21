---
title: "Samourai Wallet"
altTitle: 

users: 100000
appId: com.samourai.wallet
launchDate: 
latestUpdate: 2020-08-24
apkVersionName: "Varies with device"
stars: 
ratings: 
reviews: 
size: Varies with device
website: https://samouraiwallet.com/
repository: https://code.samourai.io/wallet/samourai-wallet-android
issue: https://code.samourai.io/wallet/samourai-wallet-android/-/issues/376
icon: com.samourai.wallet.png
bugbounty: 
verdict: nonverifiable # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-08-03
reviewStale: true
signer: 6ab9471c21d2cddd628172975cff8ba23584da41c6962df074eb56e4ef08d990
reviewArchive:


providerTwitter: SamouraiWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /samourai/
  - /com.samourai.wallet/
  - /posts/2019/11/samourai/
  - /posts/com.samourai.wallet/
---


**Update**: Samourai [claims](https://twitter.com/SamouraiWallet/status/1289942465047396352)

> You can verify that the built APK is indeed built from the provided source

which is a direct claim of falsehood of our findings. No other neutral party
party supported this claim so far and neither did the provider explain how such
a verification should work or where our findings are wrong. This is so far the
clearest lie and thus red flag about this wallet.

**Update**: Samourai
[tweeted](https://twitter.com/SamouraiWallet/status/1206521035689996291) in
response to us:

> [@SamouraiWallet](https://twitter.com/SamouraiWallet) Replying to
  [@BashCo_](https://twitter.com/BashCo_) deterministic builds have not been a
  priority or goal at this stage of dev using the resources we have. The goals
  we have focused on (privacy, dojo, whirlpool, etc) we have continued to
  deliver on. There is limited value in this investment without expert audits
  for each release

Also the provider closed
[the issue we had opened on their repository](https://github.com/Samourai-Wallet/samourai-wallet-android/issues/376).

The original review:

Samourai is still "early access" which means that there are no Google ratings or
comments.

Their website claims the wallet is non-custodial:

> Be your own Swiss Bank
> Fully non custodial software ensures you are always in control of your private
keys. No email address, no ID checks, and no hassle. Just install and go.

Given claims like:

> We are privacy activists who have dedicated our lives to creating the software
that Silicon Valley will never build, the regulators will never allow, and the
VC's will never invest in. We build the software that Bitcoin deserves.

we are not surprised to not find who is behind this wallet.

But the build instructions on their GitHub are fairly simple:

> Import as Android Studio project. Should build "as is".

so lets see what we get when we do this:


```
/tmp/$ git clone git@github.com:Samourai-Wallet/samourai-wallet-android.git
/tmp/$ cd samourai-wallet-android
/tmp/samourai-wallet-android$ git tag
0.81
0.99.27-gb
0.99.87
0.99.88
/tmp/samourai-wallet-android$ git checkout 0.99.88
```

We open the folder in
[Android Studio](https://developer.android.com/studio/index.html), set the
*Build Variants* as follows:

![Samourai Build Variants](/images/samouraiBuildVariants.png)

and build the APK.

The following is the full output of diffoscope. Red lines are what the playstore
version misses compared to the self compiled version and green lines are
additions. Right in the beginning we see the expected lines:
`META-INF/MANIFEST.MF` is different, `META-INF/CERT.RSA` and `META-INF/CERT.SF`
are exclusive to the playstore version as should be.

The rest of the diff is what makes the build **not verifiable**.

We left all the diff here for the more curious to investigate but it's obviously
too much to consider acceptable like we might conclude if it was only the `.png`
files that were different.

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">/tmp/samourai-wallet-android/app/build/outputs/apk/production/release$ diffoscope app-production-release-unsigned.apk &quot;Samourai 0.99.88 (com.samourai.wallet).apk&quot;
--- app-production-release-unsigned.apk
+++ Samourai 0.99.88 (com.samourai.wallet).apk
├── zipinfo /dev/stdin
│ <font color="#06989A">@@ -1,11 +1,13 @@</font>
│ <font color="#CC0000">-Zip file size: 39242823 bytes, number of entries: 1033</font>
│ <font color="#4E9A06">+Zip file size: 39330072 bytes, number of entries: 1035</font>
│  -rw----     0.0 fat    16108 b- defN 80-000-00 00:00 AndroidManifest.xml
│  -rw----     2.4 fat    13115 b- defN 80-000-00 00:00 BIP39/en.txt
│ <font color="#CC0000">--rw----     2.4 fat       87 b- defN 80-000-00 00:00 META-INF/MANIFEST.MF</font>
│ <font color="#4E9A06">+-rw----     2.4 fat     1211 b- defN 80-000-00 00:00 META-INF/CERT.RSA</font>
│ <font color="#4E9A06">+-rw----     2.4 fat   121611 b- defN 80-000-00 00:00 META-INF/CERT.SF</font>
│ <font color="#4E9A06">+-rw----     2.4 fat   121574 b- defN 80-000-00 00:00 META-INF/MANIFEST.MF</font>
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/android.arch.core_runtime.version
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/android.arch.lifecycle_extensions.version
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/android.arch.lifecycle_livedata-core.version
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/android.arch.lifecycle_livedata.version
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/android.arch.lifecycle_runtime.version
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/android.arch.lifecycle_viewmodel.version
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/androidx.arch.core_core-runtime.version
│ <font color="#06989A">@@ -39,16 +41,16 @@</font>
│  -rw----     2.4 fat     1434 b- defN 80-000-00 00:00 ch/qos/logback/classic/gaffer/AppenderDelegate.groovy
│  -rw----     2.4 fat     4606 b- defN 80-000-00 00:00 ch/qos/logback/classic/gaffer/ComponentDelegate.groovy
│  -rw----     2.4 fat      950 b- defN 80-000-00 00:00 ch/qos/logback/classic/gaffer/ConfigurationContributor.groovy
│  -rw----     2.4 fat    10134 b- defN 80-000-00 00:00 ch/qos/logback/classic/gaffer/ConfigurationDelegate.groovy
│  -rw----     2.4 fat     3706 b- defN 80-000-00 00:00 ch/qos/logback/classic/gaffer/GafferConfigurator.groovy
│  -rw----     2.4 fat      659 b- defN 80-000-00 00:00 ch/qos/logback/classic/gaffer/NestedType.groovy
│  -rw----     2.4 fat     3511 b- defN 80-000-00 00:00 ch/qos/logback/classic/gaffer/PropertyUtil.groovy
│ <font color="#CC0000">--rw----     2.4 fat  7820644 b- defN 80-000-00 00:00 classes.dex</font>
│ <font color="#CC0000">--rw----     2.4 fat  7088656 b- defN 80-000-00 00:00 classes2.dex</font>
│ <font color="#4E9A06">+-rw----     2.4 fat  7820264 b- defN 80-000-00 00:00 classes.dex</font>
│ <font color="#4E9A06">+-rw----     2.4 fat  7085304 b- defN 80-000-00 00:00 classes2.dex</font>
│  -rw----     2.4 fat  6694856 b- defN 80-000-00 00:00 classes3.dex
│  -rw----     2.4 fat  3770392 b- defN 80-000-00 00:00 classes4.dex
│  -rw----     2.4 fat  4842944 b- defN 80-000-00 00:00 classes5.dex
│  -rw----     2.4 fat  6713184 b- defN 80-000-00 00:00 classes6.dex
│  -rw----     2.4 fat      375 b- defN 80-000-00 00:00 javax/annotation/CheckForNull.java
│  -rw----     2.4 fat      698 b- defN 80-000-00 00:00 javax/annotation/CheckForSigned.java
│  -rw----     2.4 fat      494 b- defN 80-000-00 00:00 javax/annotation/CheckReturnValue.java
│ <font color="#06989A">@@ -375,27 +377,27 @@</font>
│  -rw----     2.4 fat     2044 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_launcher.png
│  -rw----     2.4 fat     2001 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_launcher_foreground.png
│  -rw----     2.4 fat     3761 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_launcher_round.png
│  -rw----     2.4 fat      334 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_link_white_24dp.png
│  -rw----     2.4 fat      309 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_lock_white_24dp.png
│  -rw----     2.4 fat      940 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_paynym_white_24dp.png
│  -rw----     2.4 fat     1071 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_receive_qr.png
│ <font color="#CC0000">--rw----     2.4 fat    13003 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+-rw----     2.4 fat    13336 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│  -rw----     2.4 fat      678 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_samourai_deposit_24dp.png
│  -rw----     2.4 fat     4601 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_samourai_logo_trans2x.png
│  -rw----     2.4 fat      653 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_samourai_send_24dp.png
│  -rw----     2.4 fat     1488 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_send_final.png
│  -rw----     2.4 fat      397 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_share_white_24dp.png
│  -rw----     2.4 fat      577 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/ic_standard.png
│  -rw----     2.4 fat      212 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/notification_bg_low_normal.9.png
│  -rw----     2.4 fat      225 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/notification_bg_low_pressed.9.png
│  -rw----     2.4 fat      212 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/notification_bg_normal.9.png
│  -rw----     2.4 fat      225 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/notification_bg_normal_pressed.9.png
│  -rw----     2.4 fat      107 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/notify_panel_notification_icon_bg.png
│ <font color="#CC0000">--rw----     2.4 fat     5948 b- stor 80-000-00 00:00 res/drawable-ldpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+-rw----     2.4 fat     6083 b- stor 80-000-00 00:00 res/drawable-ldpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│  -rw----     2.4 fat      199 b- stor 80-000-00 00:00 res/drawable-ldrtl-hdpi-v17/abc_ic_menu_copy_mtrl_am_alpha.png
│  -rw----     2.4 fat      400 b- stor 80-000-00 00:00 res/drawable-ldrtl-hdpi-v17/abc_ic_menu_cut_mtrl_alpha.png
│  -rw----     2.4 fat      345 b- stor 80-000-00 00:00 res/drawable-ldrtl-hdpi-v17/abc_spinner_mtrl_am_alpha.9.png
│  -rw----     2.4 fat      127 b- stor 80-000-00 00:00 res/drawable-ldrtl-mdpi-v17/abc_ic_menu_copy_mtrl_am_alpha.png
│  -rw----     2.4 fat      253 b- stor 80-000-00 00:00 res/drawable-ldrtl-mdpi-v17/abc_ic_menu_cut_mtrl_alpha.png
│  -rw----     2.4 fat      318 b- stor 80-000-00 00:00 res/drawable-ldrtl-mdpi-v17/abc_spinner_mtrl_am_alpha.9.png
│  -rw----     2.4 fat      178 b- stor 80-000-00 00:00 res/drawable-ldrtl-xhdpi-v17/abc_ic_menu_copy_mtrl_am_alpha.png
│ <font color="#06989A">@@ -471,15 +473,15 @@</font>
│  -rw----     2.4 fat     1394 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_launcher.png
│  -rw----     2.4 fat     1481 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_launcher_foreground.png
│  -rw----     2.4 fat     2394 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_launcher_round.png
│  -rw----     2.4 fat      206 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_link_white_24dp.png
│  -rw----     2.4 fat      208 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_lock_white_24dp.png
│  -rw----     2.4 fat      509 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_paynym_white_24dp.png
│  -rw----     2.4 fat      722 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_receive_qr.png
│ <font color="#CC0000">--rw----     2.4 fat     8261 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+-rw----     2.4 fat     8436 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│  -rw----     2.4 fat      406 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_samourai_deposit_24dp.png
│  -rw----     2.4 fat     2209 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_samourai_logo_trans2x.png
│  -rw----     2.4 fat      421 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_samourai_send_24dp.png
│  -rw----     2.4 fat     1101 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_send_final.png
│  -rw----     2.4 fat      268 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_share_white_24dp.png
│  -rw----     2.4 fat      417 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/ic_standard.png
│  -rw----     2.4 fat      215 b- stor 80-000-00 00:00 res/drawable-mdpi-v4/notification_bg_low_normal.9.png
│ <font color="#06989A">@@ -569,15 +571,15 @@</font>
│  -rw----     2.4 fat     2612 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_launcher_foreground.png
│  -rw----     2.4 fat     5407 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_launcher_round.png
│  -rw----     2.4 fat      371 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_link_white_24dp.png
│  -rw----     2.4 fat      372 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_lock_white_24dp.png
│  -rw----     2.4 fat     1380 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_paynym_white_24dp.png
│  -rw----     2.4 fat     1158 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_query_builder_white.png
│  -rw----     2.4 fat     1342 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_receive_qr.png
│ <font color="#CC0000">--rw----     2.4 fat    18051 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+-rw----     2.4 fat    18614 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│  -rw----     2.4 fat      826 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_samourai_deposit_24dp.png
│  -rw----     2.4 fat     5536 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_samourai_logo_trans2x.png
│  -rw----     2.4 fat      852 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_samourai_send_24dp.png
│  -rw----     2.4 fat     2386 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_send_final.png
│  -rw----     2.4 fat      496 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_share_white_24dp.png
│  -rw----     2.4 fat      851 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/ic_standard.png
│  -rw----     2.4 fat      221 b- stor 80-000-00 00:00 res/drawable-xhdpi-v4/notification_bg_low_normal.9.png
│ <font color="#06989A">@@ -649,15 +651,15 @@</font>
│  -rw----     2.4 fat     4383 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_launcher.png
│  -rw----     2.4 fat     6479 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_launcher_foreground.png
│  -rw----     2.4 fat     8544 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_launcher_round.png
│  -rw----     2.4 fat      537 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_link_white_24dp.png
│  -rw----     2.4 fat      540 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_lock_white_24dp.png
│  -rw----     2.4 fat     2772 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_paynym_white_24dp.png
│  -rw----     2.4 fat     2074 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_receive_qr.png
│ <font color="#CC0000">--rw----     2.4 fat    28996 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+-rw----     2.4 fat    29790 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│  -rw----     2.4 fat     1504 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_samourai_deposit_24dp.png
│  -rw----     2.4 fat    10672 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_samourai_logo_trans2x.png
│  -rw----     2.4 fat     1492 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_samourai_send_24dp.png
│  -rw----     2.4 fat     3015 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_send_final.png
│  -rw----     2.4 fat      698 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_share_white_24dp.png
│  -rw----     2.4 fat     1086 b- stor 80-000-00 00:00 res/drawable-xxhdpi-v4/ic_standard.png
│  -rw----     2.4 fat      275 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/abc_btn_check_to_on_mtrl_000.png
│ <font color="#06989A">@@ -702,15 +704,15 @@</font>
│  -rw----     2.4 fat     6204 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_launcher.png
│  -rw----     2.4 fat     9766 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_launcher_foreground.png
│  -rw----     2.4 fat    12354 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_launcher_round.png
│  -rw----     2.4 fat      704 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_link_white_24dp.png
│  -rw----     2.4 fat      702 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_lock_white_24dp.png
│  -rw----     2.4 fat     3924 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_paynym_white_24dp.png
│  -rw----     2.4 fat      478 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_receive_qr.png
│ <font color="#CC0000">--rw----     2.4 fat    40599 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+-rw----     2.4 fat    41928 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│  -rw----     2.4 fat     1568 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_samourai_deposit_24dp.png
│  -rw----     2.4 fat    17031 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_samourai_logo_trans2x.png
│  -rw----     2.4 fat     1546 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_samourai_send_24dp.png
│  -rw----     2.4 fat     4486 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_send_final.png
│  -rw----     2.4 fat      938 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_share_white_24dp.png
│  -rw----     2.4 fat     2033 b- stor 80-000-00 00:00 res/drawable-xxxhdpi-v4/ic_standard.png
│  -rw----     0.0 fat      588 b- defN 80-000-00 00:00 res/drawable/abc_btn_borderless_material.xml
│ <font color="#06989A">@@ -1028,8 +1030,8 @@</font>
│  -rw----     0.0 fat      972 b- defN 80-000-00 00:00 res/xml/settings_remote.xml
│  -rw----     0.0 fat      856 b- defN 80-000-00 00:00 res/xml/settings_root.xml
│  -rw----     0.0 fat      652 b- defN 80-000-00 00:00 res/xml/settings_stealth.xml
│  -rw----     0.0 fat     1116 b- defN 80-000-00 00:00 res/xml/settings_troubleshoot.xml
│  -rw----     0.0 fat     1980 b- defN 80-000-00 00:00 res/xml/settings_txs.xml
│  -rw----     0.0 fat     1888 b- defN 80-000-00 00:00 res/xml/settings_wallet.xml
│  -rw----     0.0 fat  1132060 b- stor 80-000-00 00:00 resources.arsc
│ <font color="#CC0000">-1033 files, 103130171 bytes uncompressed, 39067745 bytes compressed:  62.1%</font>
│ <font color="#4E9A06">+1035 files, 103374077 bytes uncompressed, 39154517 bytes compressed:  62.1%</font>
├── classes.dex
│ ├── classes.jar
│ │ ├── zipinfo /dev/stdin
│ │ │ <font color="#06989A">@@ -1,8 +1,8 @@</font>
│ │ │ <font color="#CC0000">-Zip file size: 13858266 bytes, number of entries: 6980</font>
│ │ │ <font color="#4E9A06">+Zip file size: 13857934 bytes, number of entries: 6980</font>
│ │ │  ?rwxrwxr-x  2.0 unx      134 b- stor 80-Jan-01 00:00 android/arch/core/R.class
│ │ │  ?rwxrwxr-x  2.0 unx      419 b- stor 80-Jan-01 00:00 android/arch/core/executor/ArchTaskExecutor$1.class
│ │ │  ?rwxrwxr-x  2.0 unx      418 b- stor 80-Jan-01 00:00 android/arch/core/executor/ArchTaskExecutor$2.class
│ │ │  ?rwxrwxr-x  2.0 unx      394 b- stor 80-Jan-01 00:00 android/arch/core/executor/TaskExecutor.class
│ │ │  ?rwxrwxr-x  2.0 unx       96 b- stor 80-Jan-01 00:00 android/arch/core/internal/SafeIterableMap$1.class
│ │ │  ?rwxrwxr-x  2.0 unx     1154 b- stor 80-Jan-01 00:00 android/arch/core/internal/SafeIterableMap$Entry.class
│ │ │  ?rwxrwxr-x  2.0 unx      188 b- stor 80-Jan-01 00:00 android/arch/core/internal/SafeIterableMap$SupportRemove.class
│ │ │ <font color="#06989A">@@ -2548,15 +2548,15 @@</font>
│ │ │  ?rwxrwxr-x  2.0 unx      893 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/TypeDeserializer$1.class
│ │ │  ?rwxrwxr-x  2.0 unx     2147 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/TypeDeserializer.class
│ │ │  ?rwxrwxr-x  2.0 unx      610 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/TypeIdResolver.class
│ │ │  ?rwxrwxr-x  2.0 unx     1205 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/TypeResolverBuilder.class
│ │ │  ?rwxrwxr-x  2.0 unx      941 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/TypeSerializer$1.class
│ │ │  ?rwxrwxr-x  2.0 unx     3973 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/TypeSerializer.class
│ │ │  ?rwxrwxr-x  2.0 unx     1631 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/impl/StdTypeResolverBuilder$1.class
│ │ │ <font color="#CC0000">-?rwxrwxr-x  2.0 unx     4867 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator.class</font>
│ │ │ <font color="#4E9A06">+?rwxrwxr-x  2.0 unx     4537 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator.class</font>
│ │ │  ?rwxrwxr-x  2.0 unx     1900 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/node/JsonNodeCreator.class
│ │ │  ?rwxrwxr-x  2.0 unx     1277 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/node/JsonNodeType.class
│ │ │  ?rwxrwxr-x  2.0 unx      903 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/node/TreeTraversingParser$1.class
│ │ │  ?rwxrwxr-x  2.0 unx     3489 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/ser/AnyGetterWriter.class
│ │ │  ?rwxrwxr-x  2.0 unx     1557 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/ser/BasicSerializerFactory$1.class
│ │ │  ?rwxrwxr-x  2.0 unx      691 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/ser/BeanPropertyFilter.class
│ │ │  ?rwxrwxr-x  2.0 unx     5389 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/ser/BeanSerializerBuilder.class
│ │ │ <font color="#06989A">@@ -4538,15 +4538,15 @@</font>
│ │ │  ?rwxrwxr-x  2.0 unx     6529 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/SequenceWriter.class
│ │ │  ?rwxrwxr-x  2.0 unx     2990 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/SerializationFeature.class
│ │ │  ?rwxrwxr-x  2.0 unx    17936 b- defN 80-Jan-01 00:00 com/fasterxml/jackson/databind/SerializerProvider.class
│ │ │  ?rwxrwxr-x  2.0 unx      347 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/cfg/ConfigOverride$Empty.class
│ │ │  ?rwxrwxr-x  2.0 unx     2222 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/cfg/ContextAttributes$Impl.class
│ │ │  ?rwxrwxr-x  2.0 unx     9142 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/cfg/MapperConfig.class
│ │ │  ?rwxrwxr-x  2.0 unx     2134 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/cfg/MutableConfigOverride.class
│ │ │ <font color="#CC0000">-?rwxrwxr-x  2.0 unx      643 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/cfg/PackageVersion.class</font>
│ │ │ <font color="#4E9A06">+?rwxrwxr-x  2.0 unx      641 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/cfg/PackageVersion.class</font>
│ │ │  ?rwxrwxr-x  2.0 unx    54332 b- defN 80-Jan-01 00:00 com/fasterxml/jackson/databind/deser/BasicDeserializerFactory.class
│ │ │  ?rwxrwxr-x  2.0 unx     1659 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/deser/BeanDeserializer$BeanReferring.class
│ │ │  ?rwxrwxr-x  2.0 unx     3075 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/deser/Deserializers$Base.class
│ │ │  ?rwxrwxr-x  2.0 unx     1437 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/deser/SettableAnyProperty$AnySetterReferring.class
│ │ │  ?rwxrwxr-x  2.0 unx      634 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/deser/ValueInstantiator$Base.class
│ │ │  ?rwxrwxr-x  2.0 unx      509 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/deser/ValueInstantiators$Base.class
│ │ │  ?rwxrwxr-x  2.0 unx     2286 b- stor 80-Jan-01 00:00 com/fasterxml/jackson/databind/deser/impl/JavaUtilCollectionsDeserializers$JavaUtilCollectionsConverter.class
│ │ │ <font color="#06989A">@@ -6975,8 +6975,8 @@</font>
│ │ │  ?rwxrwxr-x  2.0 unx     3486 b- stor 80-Jan-01 00:00 android/support/v4/app/NotificationCompat$NotificationCompatApi26Impl.class
│ │ │  ?rwxrwxr-x  2.0 unx      625 b- stor 80-Jan-01 00:00 android/support/v4/view/ViewCompat$ViewCompatApi23Impl.class
│ │ │  ?rwxrwxr-x  2.0 unx     1368 b- stor 80-Jan-01 00:00 android/support/v4/view/accessibility/AccessibilityNodeInfoCompat$AccessibilityNodeInfoApi23Impl.class
│ │ │  ?rwxrwxr-x  2.0 unx     1468 b- stor 80-Jan-01 00:00 ch/qos/logback/classic/pattern/RootCauseFirstThrowableProxyConverter.class
│ │ │  ?rwxrwxr-x  2.0 unx     1193 b- stor 80-Jan-01 00:00 android/support/v4/view/ViewCompat$ViewCompatApi24Impl.class
│ │ │  ?rwxrwxr-x  2.0 unx     1115 b- stor 80-Jan-01 00:00 android/support/v4/view/accessibility/AccessibilityNodeInfoCompat$AccessibilityNodeInfoApi24Impl.class
│ │ │  ?rwxrwxr-x  2.0 unx     1364 b- stor 80-Jan-01 00:00 android/support/v4/view/ViewCompat$ViewCompatApi26Impl.class
│ │ │ <font color="#CC0000">-6980 files, 14641375 bytes uncompressed, 12523538 bytes compressed:  14.5%</font>
│ │ │ <font color="#4E9A06">+6980 files, 14641043 bytes uncompressed, 12523206 bytes compressed:  14.5%</font>
│ │ ├── com/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator.class
│ │ │ ├── procyon -ec {}
│ │ │ │ <font color="#06989A">@@ -56,19 +56,14 @@</font>
│ │ │ │          set.add(&quot;ch.qos.logback.core.db.JNDIConnectionSource&quot;);
│ │ │ │          set.add(&quot;com.zaxxer.hikari.HikariConfig&quot;);
│ │ │ │          set.add(&quot;com.zaxxer.hikari.HikariDataSource&quot;);
│ │ │ │          set.add(&quot;org.apache.cxf.jaxrs.provider.XSLTJaxbProvider&quot;);
│ │ │ │          set.add(&quot;org.apache.commons.configuration.JNDIConfiguration&quot;);
│ │ │ │          set.add(&quot;org.apache.commons.configuration2.JNDIConfiguration&quot;);
│ │ │ │          set.add(&quot;org.apache.xalan.lib.sql.JNDIConnectionPool&quot;);
│ │ │ │ <font color="#CC0000">-        set.add(&quot;org.apache.commons.dbcp.datasources.PerUserPoolDataSource&quot;);</font>
│ │ │ │ <font color="#CC0000">-        set.add(&quot;org.apache.commons.dbcp.datasources.SharedPoolDataSource&quot;);</font>
│ │ │ │ <font color="#CC0000">-        set.add(&quot;com.p6spy.engine.spy.P6DataSource&quot;);</font>
│ │ │ │ <font color="#CC0000">-        set.add(&quot;org.apache.log4j.receivers.db.DriverManagerConnectionSource&quot;);</font>
│ │ │ │ <font color="#CC0000">-        set.add(&quot;org.apache.log4j.receivers.db.JNDIConnectionSource&quot;);</font>
│ │ │ │          DEFAULT_NO_DESER_CLASS_NAMES = Collections.unmodifiableSet((Set&lt;?&gt;)set);
│ │ │ │          instance = new SubTypeValidator();
│ │ │ │      }
│ │ │ │      
│ │ │ │      protected SubTypeValidator() {
│ │ │ │          this._cfgIllegalClassNames = SubTypeValidator.DEFAULT_NO_DESER_CLASS_NAMES;
│ │ │ │      }
│ │ ├── com/fasterxml/jackson/databind/cfg/PackageVersion.class
│ │ │ ├── procyon -ec {}
│ │ │ │ <font color="#06989A">@@ -6,14 +6,14 @@</font>
│ │ │ │  import com.fasterxml.jackson.core.Versioned;
│ │ │ │  
│ │ │ │  public final class PackageVersion implements Versioned
│ │ │ │  {
│ │ │ │      public static final Version VERSION;
│ │ │ │      
│ │ │ │      static {
│ │ │ │ <font color="#CC0000">-        VERSION = VersionUtil.parseVersion(&quot;2.9.10.1&quot;, &quot;com.fasterxml.jackson.core&quot;, &quot;jackson-databind&quot;);</font>
│ │ │ │ <font color="#4E9A06">+        VERSION = VersionUtil.parseVersion(&quot;2.9.10&quot;, &quot;com.fasterxml.jackson.core&quot;, &quot;jackson-databind&quot;);</font>
│ │ │ │      }
│ │ │ │      
│ │ │ │      public Version version() {
│ │ │ │          return PackageVersion.VERSION;
│ │ │ │      }
│ │ │ │  }
├── res/drawable-xhdpi/ic_samourai_and_tor_notif_icon.png
│ ├── sng
│ │ <font color="#06989A">@@ -41,14 +41,19 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#4E9A06">+    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │ <font color="#4E9A06">+    (255,255,255)     # rgb = (0xff,0xff,0xff) grey100</font>
│ │ <font color="#4E9A06">+    (255,255,255)     # rgb = (0xff,0xff,0xff) grey100</font>
│ │ <font color="#4E9A06">+    (255,255,255)     # rgb = (0xff,0xff,0xff) grey100</font>
│ │ <font color="#4E9A06">+    (255,255,255)     # rgb = (0xff,0xff,0xff) grey100</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#06989A">@@ -63,611 +68,610 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#CC0000">-    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │  }
│ │  tRNS {
│ │ <font color="#CC0000">- 199 103 87 179 135 24 215 163 147 151 187 67 12 155 20 115 56 123 203 127 71 79 32 44 91 175 247 219 40 4 239 211 131 64 111 227 183 60 107 95 48 207 223 143 235 191 171 16 251 159 231 139 99 52 28 75 119 195 243 8 36 83 167 0}</font>
│ │ <font color="#4E9A06">+ 103 72 207 68 88 60 179 147 227 135 131 175 117 20 167 108 16 143 247 211 203 133 36 28 24 235 183 100 12 112 159 40 64 56 32 251 52 128 102 199 44 0 124 171 84 80 195 219 104 151 139 92 243 8 215 163 116 231 187 48 120 191 76 223 4 239 96 155}</font>
│ │  IMAGE {
│ │      pixels hex

... some huge but probably boring diff here ...

│ │  }
├── res/drawable-xxhdpi/ic_samourai_and_tor_notif_icon.png
│ ├── sng
│ │ <font color="#06989A">@@ -32,14 +32,16 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#4E9A06">+    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │ <font color="#4E9A06">+    (255,255,255)     # rgb = (0xff,0xff,0xff) grey100</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#06989A">@@ -63,909 +65,908 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#CC0000">-    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │  }
│ │  tRNS {
│ │ <font color="#CC0000">- 99 44 103 67 115 155 131 111 235 151 179 56 107 203 163 139 20 175 227 91 8 243 219 75 28 187 211 87 40 231 199 183 64 251 16 207 135 83 36 195 147 4 239 223 123 215 191 143 32 79 171 247 12 127 119 159 24 71 52 48 95 60 167 0}</font>
│ │ <font color="#4E9A06">+ 112 68 1 195 108 36 139 171 155 88 56 60 32 52 8 187 199 163 20 48 16 251 219 40 231 235 28 72 207 183 104 151 0 124 76 211 131 84 247 12 80 120 167 135 227 215 223 203 44 159 243 175 128 191 4 239 100 147 92 179 64 116 24 96 143}</font>
│ │  IMAGE {
│ │      pixels hex

... some huge but probably boring diff here ...

│ │  }
├── res/drawable-ldpi/ic_samourai_and_tor_notif_icon.png
│ ├── sng
│ │ <font color="#06989A">@@ -42,21 +42,21 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#CC0000">-    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#4E9A06">+    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#06989A">@@ -67,234 +67,234 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │  }
│ │  tRNS {
│ │ <font color="#CC0000">- 75 199 183 95 56 131 67 143 223 16 135 179 87 159 99 247 40 155 12 163 219 103 211 147 83 36 231 195 20 123 207 151 71 24 243 8 171 227 127 191 215 52 0 167 115 119 239 4 139 203 175 107 60 48 91 44 251 111 64 187 79 32 235 28}</font>
│ │ <font color="#4E9A06">+ 167 80 68 235 151 44 147 36 195 28 163 219 76 112 231 139 72 40 92 179 227 84 131 60 155 108 199 223 100 52 20 203 116 247 12 48 187 8 243 175 128 104 88 135 183 215 191 124 0 120 96 143 211 239 4 16 251 159 171 56 32 207 64 24}</font>
│ │  IMAGE {
│ │      pixels hex

... some huge but probably boring diff here ...

│ │  }
├── res/drawable-mdpi/ic_samourai_and_tor_notif_icon.png
│ ├── sng
│ │ <font color="#06989A">@@ -19,14 +19,16 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#4E9A06">+    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │ <font color="#4E9A06">+    (255,255,255)     # rgb = (0xff,0xff,0xff) grey100</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#06989A">@@ -63,313 +65,312 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#CC0000">-    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │  }
│ │  tRNS {
│ │ <font color="#CC0000">- 95 135 203 48 239 171 115 16 64 179 103 211 163 147 12 91 167 111 56 155 119 195 131 44 143 175 99 52 4 243 8 24 71 60 107 151 215 40 87 235 75 28 183 207 227 159 251 20 67 191 247 83 36 223 199 231 139 123 32 79 187 127 219 0}</font>
│ │ <font color="#4E9A06">+ 112 191 108 76 187 72 163 116 179 60 151 147 96 36 171 28 231 211 195 0 124 68 159 183 143 104 117 20 44 52 100 215 219 48 24 80 203 175 128 64 56 243 8 167 120 235 199 155 40 12 247 207 139 92 16 251 4 239 32 84 131 223 88 135 227}</font>
│ │  IMAGE {
│ │      pixels hex

... some huge but probably boring diff here ...

│ │  }
├── res/drawable-hdpi/ic_samourai_and_tor_notif_icon.png
│ ├── sng
│ │ <font color="#06989A">@@ -32,14 +32,15 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#4E9A06">+    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#06989A">@@ -61,464 +62,463 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#CC0000">-    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │  }
│ │  tRNS {
│ │ <font color="#CC0000">- 215 207 75 28 151 107 123 195 83 239 199 139 155 227 163 67 4 135 179 191 187 159 99 52 119 175 223 183 36 235 147 115 219 231 71 24 211 131 103 56 32 79 171 203 143 16 251 91 44 247 12 127 48 95 20 40 87 111 64 60 167 0 243 8}</font>
│ │ <font color="#4E9A06">+ 139 36 108 131 143 92 68 135 227 179 56 52 207 235 28 48 76 84 199 191 187 183 215 32 223 239 4 155 219 231 159 112 0 124 171 12 247 40 147 100 72 151 104 128 175 120 167 60 163 116 24 8 243 211 96 20 64 203 88 16 251 44 195 80}</font>
│ │  IMAGE {
│ │      pixels hex

... some huge but probably boring diff here ...

│ │  }
├── res/drawable-xxxhdpi/ic_samourai_and_tor_notif_icon.png
│ ├── sng
│ │ <font color="#06989A">@@ -30,14 +30,17 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#4E9A06">+    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │ <font color="#4E9A06">+    (255,255,255)     # rgb = (0xff,0xff,0xff) grey100</font>
│ │ <font color="#4E9A06">+    (255,255,255)     # rgb = (0xff,0xff,0xff) grey100</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#06989A">@@ -55,1215 +58,1214 @@</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │ <font color="#CC0000">-    (  0,  0,  0)     # rgb = (0x00,0x00,0x00) grey0</font>
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │      (255,255,255)     # rgb = (0xff,0xff,0xff) grey100
│ │  }
│ │  tRNS {
│ │ <font color="#CC0000">- 79 147 99 195 20 119 71 103 40 207 139 48 24 75 211 16 52 251 187 155 87 171 227 231 215 183 131 107 60 235 175 91 44 219 143 123 28 199 135 12 247 223 203 191 127 67 159 115 95 163 179 111 64 56 167 0 4 239 32 83 36 151 243 8}</font>
│ │ <font color="#4E9A06">+ 171 215 52 155 207 116 104 68 92 167 199 133 36 8 60 247 143 20 12 48 72 151 163 80 231 227 139 219 195 179 0 124 40 135 88 243 32 108 56 159 112 183 203 84 131 223 76 191 16 251 44 4 239 100 147 211 96 175 128 64 187 24 235 222 28 120}</font>
│ │  IMAGE {
│ │      pixels hex

... some huge but probably boring diff here ...

│ │  }
├── smali/com/fasterxml/jackson/databind/cfg/PackageVersion.smali
│ <font color="#06989A">@@ -10,15 +10,15 @@</font>
│  .field public static final VERSION:Lcom/fasterxml/jackson/core/Version;
│  
│  
│  # direct methods
│  .method static constructor &lt;clinit&gt;()V
│      .locals 3
│  
│ <font color="#CC0000">-    const-string v0, &quot;2.9.10.1&quot;</font>
│ <font color="#4E9A06">+    const-string v0, &quot;2.9.10&quot;</font>
│  
│      const-string v1, &quot;com.fasterxml.jackson.core&quot;
│  
│      const-string v2, &quot;jackson-databind&quot;
│  
│      .line 13
│      invoke-static {v0, v1, v2}, Lcom/fasterxml/jackson/core/util/VersionUtil;-&gt;parseVersion(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Lcom/fasterxml/jackson/core/Version;
├── smali/com/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator.smali
│ <font color="#06989A">@@ -248,74 +248,49 @@</font>
│      invoke-interface {v0, v1}, Ljava/util/Set;-&gt;add(Ljava/lang/Object;)Z
│  
│      const-string v1, &quot;org.apache.xalan.lib.sql.JNDIConnectionPool&quot;
│  
│      .line 113
│      invoke-interface {v0, v1}, Ljava/util/Set;-&gt;add(Ljava/lang/Object;)Z
│  
│ <font color="#CC0000">-    const-string v1, &quot;org.apache.commons.dbcp.datasources.PerUserPoolDataSource&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 116</font>
│ <font color="#CC0000">-    invoke-interface {v0, v1}, Ljava/util/Set;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v1, &quot;org.apache.commons.dbcp.datasources.SharedPoolDataSource&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 117</font>
│ <font color="#CC0000">-    invoke-interface {v0, v1}, Ljava/util/Set;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v1, &quot;com.p6spy.engine.spy.P6DataSource&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 118</font>
│ <font color="#CC0000">-    invoke-interface {v0, v1}, Ljava/util/Set;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v1, &quot;org.apache.log4j.receivers.db.DriverManagerConnectionSource&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 121</font>
│ <font color="#CC0000">-    invoke-interface {v0, v1}, Ljava/util/Set;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v1, &quot;org.apache.log4j.receivers.db.JNDIConnectionSource&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 122</font>
│ <font color="#CC0000">-    invoke-interface {v0, v1}, Ljava/util/Set;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 124</font>
│ <font color="#4E9A06">+    .line 115</font>
│      invoke-static {v0}, Ljava/util/Collections;-&gt;unmodifiableSet(Ljava/util/Set;)Ljava/util/Set;
│  
│      move-result-object v0
│  
│      sput-object v0, Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;-&gt;DEFAULT_NO_DESER_CLASS_NAMES:Ljava/util/Set;
│  
│ <font color="#CC0000">-    .line 132</font>
│ <font color="#4E9A06">+    .line 123</font>
│      new-instance v0, Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;
│  
│      invoke-direct {v0}, Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;-&gt;&lt;init&gt;()V
│  
│      sput-object v0, Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;-&gt;instance:Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;
│  
│      return-void
│  .end method
│  
│  .method protected constructor &lt;init&gt;()V
│      .locals 1
│  
│ <font color="#CC0000">-    .line 134</font>
│ <font color="#4E9A06">+    .line 125</font>
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 130</font>
│ <font color="#4E9A06">+    .line 121</font>
│      sget-object v0, Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;-&gt;DEFAULT_NO_DESER_CLASS_NAMES:Ljava/util/Set;
│  
│      iput-object v0, p0, Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;-&gt;_cfgIllegalClassNames:Ljava/util/Set;
│  
│      return-void
│  .end method
│  
│  .method public static instance()Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;
│      .locals 1
│  
│ <font color="#CC0000">-    .line 136</font>
│ <font color="#4E9A06">+    .line 127</font>
│      sget-object v0, Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;-&gt;instance:Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;
│  
│      return-object v0
│  .end method
│  
│  
│  # virtual methods
│ <font color="#06989A">@@ -323,122 +298,122 @@</font>
│      .locals 3
│      .annotation system Ldalvik/annotation/Throws;
│          value = {
│              Lcom/fasterxml/jackson/databind/JsonMappingException;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 143</font>
│ <font color="#4E9A06">+    .line 134</font>
│      invoke-virtual {p2}, Lcom/fasterxml/jackson/databind/JavaType;-&gt;getRawClass()Ljava/lang/Class;
│  
│      move-result-object p2
│  
│ <font color="#CC0000">-    .line 144</font>
│ <font color="#4E9A06">+    .line 135</font>
│      invoke-virtual {p2}, Ljava/lang/Class;-&gt;getName()Ljava/lang/String;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 148</font>
│ <font color="#4E9A06">+    .line 139</font>
│      iget-object v1, p0, Lcom/fasterxml/jackson/databind/jsontype/impl/SubTypeValidator;-&gt;_cfgIllegalClassNames:Ljava/util/Set;
│  
│      invoke-interface {v1, v0}, Ljava/util/Set;-&gt;contains(Ljava/lang/Object;)Z
│  
│      move-result v1
│  
│      if-eqz v1, :cond_0
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 155</font>
│ <font color="#4E9A06">+    .line 146</font>
│      :cond_0
│      invoke-virtual {p2}, Ljava/lang/Class;-&gt;isInterface()Z
│  
│      move-result v1
│  
│      if-eqz v1, :cond_1
│  
│      goto :goto_2
│  
│      :cond_1
│      const-string v1, &quot;org.springframework.&quot;
│  
│ <font color="#CC0000">-    .line 157</font>
│ <font color="#4E9A06">+    .line 148</font>
│      invoke-virtual {v0, v1}, Ljava/lang/String;-&gt;startsWith(Ljava/lang/String;)Z
│  
│      move-result v1
│  
│      if-eqz v1, :cond_3
│  
│      :goto_0
│      if-eqz p2, :cond_5
│  
│ <font color="#CC0000">-    .line 158</font>
│ <font color="#4E9A06">+    .line 149</font>
│      const-class v1, Ljava/lang/Object;
│  
│      if-eq p2, v1, :cond_5
│  
│ <font color="#CC0000">-    .line 159</font>
│ <font color="#4E9A06">+    .line 150</font>
│      invoke-virtual {p2}, Ljava/lang/Class;-&gt;getSimpleName()Ljava/lang/String;
│  
│      move-result-object v1
│  
│      const-string v2, &quot;AbstractPointcutAdvisor&quot;
│  
│ <font color="#CC0000">-    .line 161</font>
│ <font color="#4E9A06">+    .line 152</font>
│      invoke-virtual {v2, v1}, Ljava/lang/String;-&gt;equals(Ljava/lang/Object;)Z
│  
│      move-result v2
│  
│      if-nez v2, :cond_4
│  
│      const-string v2, &quot;AbstractApplicationContext&quot;
│  
│ <font color="#CC0000">-    .line 163</font>
│ <font color="#4E9A06">+    .line 154</font>
│      invoke-virtual {v2, v1}, Ljava/lang/String;-&gt;equals(Ljava/lang/Object;)Z
│  
│      move-result v1
│  
│      if-eqz v1, :cond_2
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 158</font>
│ <font color="#4E9A06">+    .line 149</font>
│      :cond_2
│      invoke-virtual {p2}, Ljava/lang/Class;-&gt;getSuperclass()Ljava/lang/Class;
│  
│      move-result-object p2
│  
│      goto :goto_0
│  
│      :cond_3
│      const-string p2, &quot;com.mchange.v2.c3p0.&quot;
│  
│ <font color="#CC0000">-    .line 167</font>
│ <font color="#4E9A06">+    .line 158</font>
│      invoke-virtual {v0, p2}, Ljava/lang/String;-&gt;startsWith(Ljava/lang/String;)Z
│  
│      move-result p2
│  
│      if-eqz p2, :cond_5
│  
│      const-string p2, &quot;DataSource&quot;
│  
│ <font color="#CC0000">-    .line 174</font>
│ <font color="#4E9A06">+    .line 165</font>
│      invoke-virtual {v0, p2}, Ljava/lang/String;-&gt;endsWith(Ljava/lang/String;)Z
│  
│      move-result p2
│  
│      if-eqz p2, :cond_5
│  
│      :cond_4
│      :goto_1
│      const-string p2, &quot;Illegal type (%s) to deserialize: prevented for security reasons&quot;
│  
│      const/4 v1, 0x1
│  
│ <font color="#CC0000">-    .line 181</font>
│ <font color="#4E9A06">+    .line 172</font>
│      new-array v1, v1, [Ljava/lang/Object;
│  
│      const/4 v2, 0x0
│  
│      aput-object v0, v1, v2
│  
│      invoke-virtual {p1, p3, p2, v1}, Lcom/fasterxml/jackson/databind/DeserializationContext;-&gt;reportBadTypeDefinition(Lcom/fasterxml/jackson/databind/BeanDescription;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/Object;
├── smali/com/msopentech/thali/android/toronionproxy/AndroidOnionProxyManager.smali
│ <font color="#06989A">@@ -256,12 +256,12 @@</font>
│      .line 96
│      sget-object v2, Lcom/msopentech/thali/android/toronionproxy/AndroidOnionProxyManager;-&gt;LOG:Lorg/slf4j/Logger;
│  
│      const-string v3, &quot;Someone tried to call stop before we had finished registering the receiver&quot;
│  
│      invoke-interface {v2, v3, v1}, Lorg/slf4j/Logger;-&gt;info(Ljava/lang/String;Ljava/lang/Throwable;)V
│  
│ <font color="#CC0000">-    .line 99</font>
│ <font color="#4E9A06">+    .line 97</font>
│      :cond_1
│      :goto_1
│      throw v0
│  .end method
├── smali/com/msopentech/thali/android/toronionproxy/torinstaller/NativeLoader.smali
│ <font color="#06989A">@@ -408,12 +408,12 @@</font>
│  
│      move-result-object p0
│  
│      const-string p2, &quot;TorNativeLoader&quot;
│  
│      invoke-static {p2, p0}, Landroid/util/Log;-&gt;e(Ljava/lang/String;Ljava/lang/String;)I
│  
│ <font color="#CC0000">-    .line 69</font>
│ <font color="#4E9A06">+    .line 67</font>
│      :cond_6
│      :goto_8
│      throw p1
│  .end method
├── smali/com/msopentech/thali/toronionproxy/OnionProxyManager$1.smali
│ <font color="#06989A">@@ -190,11 +190,11 @@</font>
│  
│      move-result-object v2
│  
│      const-string v3, &quot;Couldn\&apos;t close input stream in eatStream&quot;
│  
│      invoke-interface {v2, v3, v1}, Lorg/slf4j/Logger;-&gt;error(Ljava/lang/String;Ljava/lang/Throwable;)V
│  
│ <font color="#CC0000">-    .line 480</font>
│ <font color="#4E9A06">+    .line 479</font>
│      :goto_2
│      throw v0
│  .end method
├── smali/com/msopentech/thali/toronionproxy/FileUtilities.smali
│ <font color="#06989A">@@ -86,15 +86,14 @@</font>
│      return-void
│  
│      :catchall_0
│      move-exception p1
│  
│      invoke-virtual {p0}, Ljava/io/InputStream;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 95</font>
│      throw p1
│  .end method
│  
│  .method public static copyDoNotCloseInput(Ljava/io/InputStream;Ljava/io/OutputStream;)V
│      .locals 3
│      .annotation system Ldalvik/annotation/Throws;
│          value = {
│ <font color="#06989A">@@ -138,15 +137,14 @@</font>
│  
│      :catchall_0
│      move-exception p0
│  
│      .line 113
│      invoke-virtual {p1}, Ljava/io/OutputStream;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 114</font>
│      throw p0
│  .end method
│  
│  .method public static extractContentFromZip(Ljava/io/File;Ljava/io/InputStream;)V
│      .locals 4
│      .annotation system Ldalvik/annotation/Throws;
│          value = {
│ <font color="#06989A">@@ -320,15 +318,14 @@</font>
│      :catchall_0
│      move-exception p0
│  
│      if-eqz p1, :cond_8
│  
│      invoke-virtual {p1}, Ljava/io/InputStream;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 208</font>
│      :cond_8
│      throw p0
│  .end method
│  
│  .method public static listFilesToLog(Ljava/io/File;)V
│      .locals 3
│  
│ <font color="#06989A">@@ -439,15 +436,14 @@</font>
│      return-object v0
│  
│      :catchall_0
│      move-exception p0
│  
│      invoke-virtual {v1}, Ljava/io/FileInputStream;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 140</font>
│      throw p0
│  .end method
│  
│  .method public static recursiveFileDelete(Ljava/io/File;)V
│      .locals 4
│  
│      .line 160
├── smali/com/msopentech/thali/toronionproxy/OnionProxyManager.smali
│ <font color="#06989A">@@ -592,15 +592,14 @@</font>
│      :goto_0
│      if-eqz v1, :cond_0
│  
│      .line 508
│      :try_start_4
│      invoke-virtual {v1}, Ljava/io/PrintWriter;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 510</font>
│      :cond_0
│      throw v0
│  
│      .line 489
│      :cond_1
│      new-instance v0, Ljava/lang/RuntimeException;
│  
│ <font color="#06989A">@@ -908,15 +907,15 @@</font>
│  
│      .line 421
│      :try_start_5
│      iget-object v0, p0, Lcom/msopentech/thali/toronionproxy/OnionProxyManager;-&gt;controlConnection:Lnet/freehaven/tor/control/TorControlConnection;
│      :try_end_5
│      .catchall {:try_start_5 .. :try_end_5} :catchall_2
│  
│ <font color="#CC0000">-    .line 385</font>
│ <font color="#4E9A06">+    .line 425</font>
│      monitor-exit p0
│  
│      return v8
│  
│      :cond_5
│      move-object v5, v4
│  
│ <font color="#06989A">@@ -956,15 +955,14 @@</font>
│      if-eqz v5, :cond_7
│  
│      .line 425
│      invoke-virtual {v5}, Ljava/lang/Process;-&gt;destroy()V
│      :try_end_7
│      .catchall {:try_start_7 .. :try_end_7} :catchall_2
│  
│ <font color="#CC0000">-    .line 393</font>
│      :cond_7
│      monitor-exit p0
│  
│      return v8
│  
│      .line 397
│      :cond_8
│ <font color="#06989A">@@ -1040,15 +1038,14 @@</font>
│      if-eqz v5, :cond_9
│  
│      .line 425
│      invoke-virtual {v5}, Ljava/lang/Process;-&gt;destroy()V
│      :try_end_9
│      .catchall {:try_start_9 .. :try_end_9} :catchall_2
│  
│ <font color="#CC0000">-    .line 412</font>
│      :cond_9
│      monitor-exit p0
│  
│      return v1
│  
│      :catchall_0
│      move-exception v0
│ <font color="#06989A">@@ -1106,15 +1103,14 @@</font>
│      if-eqz v5, :cond_a
│  
│      .line 425
│      invoke-virtual {v5}, Ljava/lang/Process;-&gt;destroy()V
│      :try_end_b
│      .catchall {:try_start_b .. :try_end_b} :catchall_2
│  
│ <font color="#CC0000">-    .line 419</font>
│      :cond_a
│      monitor-exit p0
│  
│      return v8
│  
│      :catch_3
│      move-exception v0
│ <font color="#06989A">@@ -1141,15 +1137,14 @@</font>
│      if-eqz v5, :cond_b
│  
│      .line 425
│      invoke-virtual {v5}, Ljava/lang/Process;-&gt;destroy()V
│      :try_end_d
│      .catchall {:try_start_d .. :try_end_d} :catchall_2
│  
│ <font color="#CC0000">-    .line 415</font>
│      :cond_b
│      monitor-exit p0
│  
│      return v8
│  
│      .line 421
│      :goto_4
│ <font color="#06989A">@@ -1159,15 +1154,14 @@</font>
│      if-nez v1, :cond_c
│  
│      if-eqz v5, :cond_c
│  
│      .line 425
│      invoke-virtual {v5}, Ljava/lang/Process;-&gt;destroy()V
│  
│ <font color="#CC0000">-    .line 427</font>
│      :cond_c
│      throw v0
│      :try_end_e
│      .catchall {:try_start_e .. :try_end_e} :catchall_2
│  
│      :catchall_2
│      move-exception v0
│ <font color="#06989A">@@ -1798,15 +1792,14 @@</font>
│      if-nez p1, :cond_0
│  
│      .line 137
│      invoke-virtual {p0}, Lcom/msopentech/thali/toronionproxy/OnionProxyManager;-&gt;stop()V
│      :try_end_1
│      .catchall {:try_start_1 .. :try_end_1} :catchall_1
│  
│ <font color="#CC0000">-    .line 109</font>
│      :cond_0
│      monitor-exit p0
│  
│      return v0
│  
│      :cond_1
│      const/4 v2, 0x1
│ <font color="#06989A">@@ -1848,15 +1841,14 @@</font>
│      if-nez p1, :cond_3
│  
│      .line 137
│      invoke-virtual {p0}, Lcom/msopentech/thali/toronionproxy/OnionProxyManager;-&gt;stop()V
│      :try_end_3
│      .catchall {:try_start_3 .. :try_end_3} :catchall_1
│  
│ <font color="#CC0000">-    .line 118</font>
│      :cond_3
│      monitor-exit p0
│  
│      return v2
│  
│      .line 123
│      :cond_4
│ <font color="#06989A">@@ -1884,15 +1876,14 @@</font>
│      move-result p2
│  
│      if-nez p2, :cond_5
│  
│      .line 137
│      invoke-virtual {p0}, Lcom/msopentech/thali/toronionproxy/OnionProxyManager;-&gt;stop()V
│  
│ <font color="#CC0000">-    .line 139</font>
│      :cond_5
│      throw p1
│  
│      .line 136
│      :cond_6
│      invoke-virtual {p0}, Lcom/msopentech/thali/toronionproxy/OnionProxyManager;-&gt;isRunning()Z
│  
│ <font color="#06989A">@@ -1901,15 +1892,14 @@</font>
│      if-nez p1, :cond_7
│  
│      .line 137
│      invoke-virtual {p0}, Lcom/msopentech/thali/toronionproxy/OnionProxyManager;-&gt;stop()V
│      :try_end_5
│      .catchall {:try_start_5 .. :try_end_5} :catchall_1
│  
│ <font color="#CC0000">-    .line 133</font>
│      :cond_7
│      monitor-exit p0
│  
│      return v0
│  
│      .line 103
│      :cond_8
│ <font color="#06989A">@@ -2047,15 +2037,14 @@</font>
│      .line 235
│      :cond_3
│      iput-object v0, p0, Lcom/msopentech/thali/toronionproxy/OnionProxyManager;-&gt;controlConnection:Lnet/freehaven/tor/control/TorControlConnection;
│  
│      .line 236
│      iput-object v0, p0, Lcom/msopentech/thali/toronionproxy/OnionProxyManager;-&gt;controlSocket:Ljava/net/Socket;
│  
│ <font color="#CC0000">-    .line 237</font>
│      throw v1
│      :try_end_4
│      .catchall {:try_start_4 .. :try_end_4} :catchall_1
│  
│      :catchall_1
│      move-exception v0
├── smali/com/msopentech/thali/toronionproxy/OsData.smali
│ <font color="#06989A">@@ -340,15 +340,14 @@</font>
│  
│      :goto_2
│      if-eqz v0, :cond_6
│  
│      .line 100
│      invoke-virtual {v0}, Ljava/lang/Process;-&gt;destroy()V
│  
│ <font color="#CC0000">-    .line 102</font>
│      :cond_6
│      throw v1
│  .end method
│  
│  .method public static getOsType()Lcom/msopentech/thali/toronionproxy/OsData$OsType;
│      .locals 1
├── lib/arm64-v8a/libiconv.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -6,22 +6,22 @@</font>
│ │    [ 1] .note.gnu.build-id NOTE            00000000000001c8 0001c8 000024 00   A  0   0  4
│ │    [ 2] .hash             HASH            00000000000001f0 0001f0 000150 04   A  3   0  8
│ │    [ 3] .dynsym           DYNSYM          0000000000000340 000340 000438 18   A  4   3  8
│ │    [ 4] .dynstr           STRTAB          0000000000000778 000778 0001c9 00   A  0   0  1
│ │    [ 5] .gnu.version      VERSYM          0000000000000942 000942 00005a 02   A  3   0  2
│ │    [ 6] .gnu.version_r    VERNEED         00000000000009a0 0009a0 000020 00   A  4   1  8
│ │    [ 7] .rela.dyn         RELA            00000000000009c0 0009c0 0016c8 18   A  3   0  8
│ │ <font color="#CC0000">-  [ 8] .rela.plt         RELA            0000000000002088 002088 000288 18  AI  3  18  8</font>
│ │ <font color="#4E9A06">+  [ 8] .rela.plt         RELA            0000000000002088 002088 000288 18  AI  3   9  8</font>
│ │    [ 9] .plt              PROGBITS        0000000000002310 002310 0001d0 10  AX  0   0 16
│ │    [10] .text             PROGBITS        00000000000024e0 0024e0 015400 00  AX  0   0  4
│ │    [11] .rodata           PROGBITS        00000000000178e0 0178e0 0c85dd 00   A  0   0 16
│ │    [12] .eh_frame_hdr     PROGBITS        00000000000dfec0 0dfec0 000874 00   A  0   0  4
│ │    [13] .eh_frame         PROGBITS        00000000000e0738 0e0738 001ca8 00   A  0   0  8
│ │ <font color="#CC0000">-  [14] .init_array       INIT_ARRAY      00000000000f2b48 0e2b48 000008 08  WA  0   0  1</font>
│ │ <font color="#CC0000">-  [15] .fini_array       FINI_ARRAY      00000000000f2b50 0e2b50 000010 08  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [14] .init_array       INIT_ARRAY      00000000000f2b48 0e2b48 000008 00  WA  0   0  1</font>
│ │ <font color="#4E9A06">+  [15] .fini_array       FINI_ARRAY      00000000000f2b50 0e2b50 000010 00  WA  0   0  8</font>
│ │    [16] .data.rel.ro      PROGBITS        00000000000f2b60 0e2b60 0011a8 00  WA  0   0  8
│ │    [17] .dynamic          DYNAMIC         00000000000f3d08 0e3d08 000200 10  WA  4   0  8
│ │    [18] .got              PROGBITS        00000000000f3f08 0e3f08 0000f8 08  WA  0   0  8
│ │    [19] .data             PROGBITS        00000000000f4000 0e4000 00000c 00  WA  0   0  8
│ │    [20] .bss              NOBITS          00000000000f4010 0e400c 000008 00  WA  0   0  8
│ │    [21] .comment          PROGBITS        0000000000000000 0e400c 000064 01  MS  0   0  1
│ │    [22] .shstrtab         STRTAB          0000000000000000 0e4070 0000d1 00      0   0  1
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00002310 f07bbfa9 900700b0 118e47f9 10623c91 .{........G..b&lt;.
│ │    0x00002320 20021fd6 1f2003d5 1f2003d5 1f2003d5  .... ... ... ..
│ │    0x00002330 900700b0 119247f9 10823c91 20021fd6 ......G...&lt;. ...
│ │    0x00002340 900700b0 119647f9 10a23c91 20021fd6 ......G...&lt;. ...
│ │    0x00002350 900700b0 119a47f9 10c23c91 20021fd6 ......G...&lt;. ...
│ │    0x00002360 900700b0 119e47f9 10e23c91 20021fd6 ......G...&lt;. ...
│ │    0x00002370 900700b0 11a247f9 10023d91 20021fd6 ......G...=. ...
│ ├── readelf --wide --decompress --hex-dump=.got {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x000f3f08 00000000 00000000 00000000 00000000 ................
│ │    0x000f3f18 00000000 00000000 10230000 00000000 .........#......
│ │    0x000f3f28 10230000 00000000 10230000 00000000 .#.......#......
│ │    0x000f3f38 10230000 00000000 10230000 00000000 .#.......#......
│ │    0x000f3f48 10230000 00000000 10230000 00000000 .#.......#......
│ │    0x000f3f58 10230000 00000000 10230000 00000000 .#.......#......
│ │    0x000f3f68 10230000 00000000 10230000 00000000 .#.......#......
├── lib/arm64-v8a/libzbar.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -6,22 +6,22 @@</font>
│ │    [ 1] .note.gnu.build-id NOTE            00000000000001c8 0001c8 000024 00   A  0   0  4
│ │    [ 2] .hash             HASH            00000000000001f0 0001f0 0006f8 04   A  3   0  8
│ │    [ 3] .dynsym           DYNSYM          00000000000008e8 0008e8 001728 18   A  4   3  8
│ │    [ 4] .dynstr           STRTAB          0000000000002010 002010 001640 00   A  0   0  1
│ │    [ 5] .gnu.version      VERSYM          0000000000003650 003650 0001ee 02   A  3   0  2
│ │    [ 6] .gnu.version_r    VERNEED         0000000000003840 003840 000020 00   A  4   1  8
│ │    [ 7] .rela.dyn         RELA            0000000000003860 003860 000570 18   A  3   0  8
│ │ <font color="#CC0000">-  [ 8] .rela.plt         RELA            0000000000003dd0 003dd0 000d68 18  AI  3  18  8</font>
│ │ <font color="#4E9A06">+  [ 8] .rela.plt         RELA            0000000000003dd0 003dd0 000d68 18  AI  3   9  8</font>
│ │    [ 9] .plt              PROGBITS        0000000000004b40 004b40 000910 10  AX  0   0 16
│ │    [10] .text             PROGBITS        0000000000005450 005450 01a958 00  AX  0   0  4
│ │    [11] .rodata           PROGBITS        000000000001fdb0 01fdb0 001ead 00   A  0   0 16
│ │    [12] .eh_frame_hdr     PROGBITS        0000000000021c60 021c60 0007d4 00   A  0   0  4
│ │    [13] .eh_frame         PROGBITS        0000000000022438 022438 001f38 00   A  0   0  8
│ │ <font color="#CC0000">-  [14] .init_array       INIT_ARRAY      00000000000345f8 0245f8 000008 08  WA  0   0  1</font>
│ │ <font color="#CC0000">-  [15] .fini_array       FINI_ARRAY      0000000000034600 024600 000010 08  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [14] .init_array       INIT_ARRAY      00000000000345f8 0245f8 000008 00  WA  0   0  1</font>
│ │ <font color="#4E9A06">+  [15] .fini_array       FINI_ARRAY      0000000000034600 024600 000010 00  WA  0   0  8</font>
│ │    [16] .data.rel.ro      PROGBITS        0000000000034610 024610 000318 00  WA  0   0 16
│ │    [17] .dynamic          DYNAMIC         0000000000034928 024928 000210 10  WA  4   0  8
│ │    [18] .got              PROGBITS        0000000000034b38 024b38 0004c0 08  WA  0   0  8
│ │    [19] .data             PROGBITS        0000000000035000 025000 00005c 00  WA  0   0  8
│ │    [20] .bss              NOBITS          0000000000035060 02505c 000060 00  WA  0   0  8
│ │    [21] .comment          PROGBITS        0000000000000000 02505c 000064 01  MS  0   0  1
│ │    [22] .shstrtab         STRTAB          0000000000000000 0250c0 0000d1 00      0   0  1
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00004b40 f07bbfa9 90010090 11a645f9 10222d91 .{........E..&quot;-.
│ │    0x00004b50 20021fd6 1f2003d5 1f2003d5 1f2003d5  .... ... ... ..
│ │    0x00004b60 90010090 11aa45f9 10422d91 20021fd6 ......E..B-. ...
│ │    0x00004b70 90010090 11ae45f9 10622d91 20021fd6 ......E..b-. ...
│ │    0x00004b80 90010090 11b245f9 10822d91 20021fd6 ......E...-. ...
│ │    0x00004b90 90010090 11b645f9 10a22d91 20021fd6 ......E...-. ...
│ │    0x00004ba0 90010090 11ba45f9 10c22d91 20021fd6 ......E...-. ...
│ ├── readelf --wide --decompress --hex-dump=.got {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00034b38 00000000 00000000 00000000 00000000 ................
│ │    0x00034b48 00000000 00000000 404b0000 00000000 ........@K......
│ │    0x00034b58 404b0000 00000000 404b0000 00000000 @K......@K......
│ │    0x00034b68 404b0000 00000000 404b0000 00000000 @K......@K......
│ │    0x00034b78 404b0000 00000000 404b0000 00000000 @K......@K......
│ │    0x00034b88 404b0000 00000000 404b0000 00000000 @K......@K......
│ │    0x00034b98 404b0000 00000000 404b0000 00000000 @K......@K......
├── lib/arm64-v8a/tor.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,24 +7,24 @@</font>
│ │    [ 2] .note.android.ident NOTE            00000168 000168 000098 00   A  0   0  4
│ │    [ 3] .dynsym           DYNSYM          00000200 000200 024760 10   A  4   1  4
│ │    [ 4] .dynstr           STRTAB          00024960 024960 033f8f 00   A  0   0  1
│ │    [ 5] .hash             HASH            000588f0 0588f0 011224 04   A  3   0  4
│ │    [ 6] .gnu.version      VERSYM          00069b14 069b14 0048ec 02   A  3   0  2
│ │    [ 7] .gnu.version_r    VERNEED         0006e400 06e400 000060 00   A  4   3  4
│ │    [ 8] .rel.dyn          REL             0006e460 06e460 017b88 08   A  3   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00085fe8 085fe8 000698 08  AI  3  21  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00085fe8 085fe8 000698 08  AI  3  10  4</font>
│ │    [10] .plt              PROGBITS        00086680 086680 0009f8 00  AX  0   0  4
│ │    [11] .text             PROGBITS        00087078 087078 4e38d4 00  AX  0   0  4
│ │    [12] .ARM.extab        PROGBITS        0056a94c 56a94c 010824 00   A  0   0  4
│ │    [13] .ARM.exidx        ARM_EXIDX       0057b170 57b170 00c5b8 08  AL 11   0  4
│ │    [14] .rodata           PROGBITS        00587728 587728 0c6c30 00   A  0   0  8
│ │    [15] .data.rel.ro.local PROGBITS        00650240 64f240 00b394 00  WA  0   0  4
│ │ <font color="#CC0000">-  [16] .fini_array       FINI_ARRAY      0065b5d4 65a5d4 000008 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      0065b5dc 65a5dc 000010 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [18] .preinit_array    PREINIT_ARRAY   0065b5ec 65a5ec 000008 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [16] .fini_array       FINI_ARRAY      0065b5d4 65a5d4 000008 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      0065b5dc 65a5dc 000010 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [18] .preinit_array    PREINIT_ARRAY   0065b5ec 65a5ec 000008 00  WA  0   0  4</font>
│ │    [19] .data.rel.ro      PROGBITS        0065b5f8 65a5f8 004f28 00  WA  0   0  8
│ │    [20] .dynamic          DYNAMIC         00660520 65f520 000120 08  WA  4   0  4
│ │    [21] .got              PROGBITS        00660644 65f644 0009bc 00  WA  0   0  4
│ │    [22] .data             PROGBITS        00661000 660000 016e78 00  WA  0   0  8
│ │    [23] .bss              NOBITS          00677e78 676e78 0064c0 00  WA  0   0  8
│ │    [24] .note.gnu.gold-version NOTE            00000000 676e78 00001c 00      0   0  4
│ │    [25] .ARM.attributes   ARM_ATTRIBUTES  00000000 676e94 000034 00      0   0  1
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00086680 04e02de5 04e09fe5 0ee08fe0 08f0bee5 ..-.............
│ │    0x00086690 18a65d00 05c68fe2 daca8ce2 18f6bce5 ..].............
│ │    0x000866a0 05c68fe2 daca8ce2 10f6bce5 05c68fe2 ................
│ │    0x000866b0 daca8ce2 08f6bce5 05c68fe2 daca8ce2 ................
│ │    0x000866c0 00f6bce5 05c68fe2 daca8ce2 f8f5bce5 ................
│ │    0x000866d0 05c68fe2 daca8ce2 f0f5bce5 05c68fe2 ................
│ │    0x000866e0 daca8ce2 e8f5bce5 05c68fe2 daca8ce2 ................
│ ├── readelf --wide --decompress --hex-dump=.got {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00660644 ecb56500 dcb56500 d4b56500 e4b56500 ..e...e...e...e.
│ │    0x00660654 20710800 a8e16600 f0ab6700 f8ab6700  q....f...g...g.
│ │    0x00660664 d8806700 48926700 50926700 58926700 ..g.H.g.P.g.X.g.
│ │    0x00660674 30936700 38936700 60926700 48936700 0.g.8.g.`.g.H.g.
│ │    0x00660684 50936700 58936700 60936700 d07f6700 P.g.X.g.`.g...g.
│ │    0x00660694 7c7e6700 00000000 bc453600 c4473600 |~g......E6..G6.
│ │    0x006606a4 544c3600 bcc93500 08e36700 1ce36700 TL6...5...g...g.
├── lib/arm64-v8a/liberrno-lib.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -6,21 +6,21 @@</font>
│ │    [ 1] .note.gnu.build-id NOTE            00000000000001c8 0001c8 000024 00   A  0   0  4
│ │    [ 2] .hash             HASH            00000000000001f0 0001f0 000054 04   A  3   0  8
│ │    [ 3] .dynsym           DYNSYM          0000000000000248 000248 000180 18   A  4   3  8
│ │    [ 4] .dynstr           STRTAB          00000000000003c8 0003c8 0000fd 00   A  0   0  1
│ │    [ 5] .gnu.version      VERSYM          00000000000004c6 0004c6 000020 02   A  3   0  2
│ │    [ 6] .gnu.version_r    VERNEED         00000000000004e8 0004e8 000020 00   A  4   1  8
│ │    [ 7] .rela.dyn         RELA            0000000000000508 000508 000018 18   A  3   0  8
│ │ <font color="#CC0000">-  [ 8] .rela.plt         RELA            0000000000000520 000520 000060 18  AI  3  16  8</font>
│ │ <font color="#4E9A06">+  [ 8] .rela.plt         RELA            0000000000000520 000520 000060 18  AI  3   9  8</font>
│ │    [ 9] .plt              PROGBITS        0000000000000580 000580 000060 10  AX  0   0 16
│ │    [10] .text             PROGBITS        00000000000005e0 0005e0 00008c 00  AX  0   0  4
│ │    [11] .eh_frame_hdr     PROGBITS        000000000000066c 00066c 00001c 00   A  0   0  4
│ │    [12] .eh_frame         PROGBITS        0000000000000688 000688 000058 00   A  0   0  8
│ │ <font color="#CC0000">-  [13] .init_array       INIT_ARRAY      0000000000010db8 000db8 000008 08  WA  0   0  1</font>
│ │ <font color="#CC0000">-  [14] .fini_array       FINI_ARRAY      0000000000010dc0 000dc0 000010 08  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [13] .init_array       INIT_ARRAY      0000000000010db8 000db8 000008 00  WA  0   0  1</font>
│ │ <font color="#4E9A06">+  [14] .fini_array       FINI_ARRAY      0000000000010dc0 000dc0 000010 00  WA  0   0  8</font>
│ │    [15] .dynamic          DYNAMIC         0000000000010dd0 000dd0 0001f0 10  WA  4   0  8
│ │    [16] .got              PROGBITS        0000000000010fc0 000fc0 000040 08  WA  0   0  8
│ │    [17] .data             PROGBITS        0000000000011000 001000 000008 00  WA  0   0  8
│ │    [18] .bss              NOBITS          0000000000011008 001008 000000 00  WA  0   0  1
│ │    [19] .comment          PROGBITS        0000000000000000 001008 000064 01  MS  0   0  1
│ │    [20] .shstrtab         STRTAB          0000000000000000 00106c 0000bc 00      0   0  1
│ │  Key to Flags:
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00000580 f07bbfa9 90000090 11ea47f9 10423f91 .{........G..B?.
│ │    0x00000590 20021fd6 1f2003d5 1f2003d5 1f2003d5  .... ... ... ..
│ │    0x000005a0 90000090 11ee47f9 10623f91 20021fd6 ......G..b?. ...
│ │    0x000005b0 90000090 11f247f9 10823f91 20021fd6 ......G...?. ...
│ │    0x000005c0 90000090 11f647f9 10a23f91 20021fd6 ......G...?. ...
│ │    0x000005d0 90000090 11fa47f9 10c23f91 20021fd6 ......G...?. ...
│ ├── readelf --wide --decompress --hex-dump=.got {}
│ │ <font color="#06989A">@@ -1,8 +1,7 @@</font>
│ │  
│ │  Hex dump of section &apos;.got&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00010fc0 00000000 00000000 00000000 00000000 ................
│ │    0x00010fd0 00000000 00000000 80050000 00000000 ................
│ │    0x00010fe0 80050000 00000000 80050000 00000000 ................
│ │    0x00010ff0 80050000 00000000 d00d0100 00000000 ................
├── lib/x86_64/libiconv.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,23 +7,23 @@</font>
│ │    [ 2] .dynsym           DYNSYM          0000000000000228 000228 0003a8 18   A  3   1  8
│ │    [ 3] .dynstr           STRTAB          00000000000005d0 0005d0 0001b7 00   A  0   0  1
│ │    [ 4] .hash             HASH            0000000000000788 000788 000138 04   A  2   0  8
│ │    [ 5] .gnu.version      VERSYM          00000000000008c0 0008c0 00004e 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          0000000000000910 000910 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         000000000000092c 00092c 000020 00   A  3   1  4
│ │    [ 8] .rela.dyn         RELA            0000000000000950 000950 0016e0 18   A  2   0  8
│ │ <font color="#CC0000">-  [ 9] .rela.plt         RELA            0000000000002030 002030 000288 18  AI  2  20  8</font>
│ │ <font color="#4E9A06">+  [ 9] .rela.plt         RELA            0000000000002030 002030 000288 18  AI  2  10  8</font>
│ │    [10] .plt              PROGBITS        00000000000022c0 0022c0 0001c0 10  AX  0   0 16
│ │    [11] .text             PROGBITS        0000000000002480 002480 013bd8 00  AX  0   0 16
│ │    [12] .rodata           PROGBITS        0000000000016060 016060 0c8fa4 00   A  0   0 16
│ │    [13] .eh_frame         PROGBITS        00000000000df008 0df008 001e5c 00   A  0   0  8
│ │    [14] .eh_frame_hdr     PROGBITS        00000000000e0e64 0e0e64 000894 00   A  0   0  4
│ │ <font color="#CC0000">-  [15] .fini_array       FINI_ARRAY      00000000000e2b20 0e1b20 000010 08  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [15] .fini_array       FINI_ARRAY      00000000000e2b20 0e1b20 000010 00  WA  0   0  8</font>
│ │    [16] .data.rel.ro      PROGBITS        00000000000e2b30 0e1b30 0011a8 00  WA  0   0 16
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      00000000000e3cd8 0e2cd8 000008 08  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      00000000000e3cd8 0e2cd8 000008 00  WA  0   0  8</font>
│ │    [18] .dynamic          DYNAMIC         00000000000e3ce0 0e2ce0 000230 10  WA  3   0  8
│ │    [19] .got              PROGBITS        00000000000e3f10 0e2f10 000000 00  WA  0   0  8
│ │    [20] .got.plt          PROGBITS        00000000000e3f10 0e2f10 0000f0 00  WA  0   0  8
│ │    [21] .data             PROGBITS        00000000000e4000 0e3000 00000c 00  WA  0   0  8
│ │    [22] .bss              NOBITS          00000000000e4010 0e300c 000008 00  WA  0   0  8
│ │    [23] .comment          PROGBITS        0000000000000000 0e300c 000065 01  MS  0   0  1
│ │    [24] .note.gnu.gold-version NOTE            0000000000000000 0e3074 00001c 00      0   0  4
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x000022c0 ff35521c 0e00ff25 541c0e00 90909090 .5R....%T.......
│ │    0x000022d0 ff25521c 0e006800 000000e9 e0ffffff .%R...h.........
│ │    0x000022e0 ff254a1c 0e006801 000000e9 d0ffffff .%J...h.........
│ │    0x000022f0 ff25421c 0e006802 000000e9 c0ffffff .%B...h.........
│ │    0x00002300 ff253a1c 0e006803 000000e9 b0ffffff .%:...h.........
│ │    0x00002310 ff25321c 0e006804 000000e9 a0ffffff .%2...h.........
│ │    0x00002320 ff252a1c 0e006805 000000e9 90ffffff .%*...h.........
│ ├── readelf --wide --decompress --hex-dump=.got.plt {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got.plt&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x000e3f10 e03c0e00 00000000 00000000 00000000 .&lt;..............
│ │    0x000e3f20 00000000 00000000 d6220000 00000000 .........&quot;......
│ │    0x000e3f30 e6220000 00000000 f6220000 00000000 .&quot;.......&quot;......
│ │    0x000e3f40 06230000 00000000 16230000 00000000 .#.......#......
│ │    0x000e3f50 26230000 00000000 36230000 00000000 &amp;#......6#......
│ │    0x000e3f60 46230000 00000000 56230000 00000000 F#......V#......
│ │    0x000e3f70 66230000 00000000 76230000 00000000 f#......v#......
├── lib/x86_64/libzbar.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,23 +7,23 @@</font>
│ │    [ 2] .dynsym           DYNSYM          0000000000000228 000228 001698 18   A  3   1  8
│ │    [ 3] .dynstr           STRTAB          00000000000018c0 0018c0 001633 00   A  0   0  1
│ │    [ 4] .hash             HASH            0000000000002ef8 002ef8 0006e0 04   A  2   0  8
│ │    [ 5] .gnu.version      VERSYM          00000000000035d8 0035d8 0001e2 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          00000000000037bc 0037bc 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         00000000000037d8 0037d8 000020 00   A  3   1  4
│ │    [ 8] .rela.dyn         RELA            00000000000037f8 0037f8 000588 18   A  2   0  8
│ │ <font color="#CC0000">-  [ 9] .rela.plt         RELA            0000000000003d80 003d80 000d68 18  AI  2  20  8</font>
│ │ <font color="#4E9A06">+  [ 9] .rela.plt         RELA            0000000000003d80 003d80 000d68 18  AI  2  10  8</font>
│ │    [10] .plt              PROGBITS        0000000000004af0 004af0 000900 10  AX  0   0 16
│ │    [11] .text             PROGBITS        00000000000053f0 0053f0 01d5c2 00  AX  0   0 16
│ │    [12] .rodata           PROGBITS        00000000000229c0 0229c0 001ec8 00   A  0   0 16
│ │    [13] .eh_frame         PROGBITS        0000000000024888 024888 0023b4 00   A  0   0  8
│ │    [14] .eh_frame_hdr     PROGBITS        0000000000026c3c 026c3c 0007f4 00   A  0   0  4
│ │ <font color="#CC0000">-  [15] .fini_array       FINI_ARRAY      00000000000285c0 0275c0 000010 08  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [15] .fini_array       FINI_ARRAY      00000000000285c0 0275c0 000010 00  WA  0   0  8</font>
│ │    [16] .data.rel.ro      PROGBITS        00000000000285d0 0275d0 000328 00  WA  0   0 16
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      00000000000288f8 0278f8 000008 08  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      00000000000288f8 0278f8 000008 00  WA  0   0  8</font>
│ │    [18] .dynamic          DYNAMIC         0000000000028900 027900 000240 10  WA  3   0  8
│ │    [19] .got              PROGBITS        0000000000028b40 027b40 000028 00  WA  0   0  8
│ │    [20] .got.plt          PROGBITS        0000000000028b68 027b68 000490 00  WA  0   0  8
│ │    [21] .data             PROGBITS        0000000000029000 028000 000064 00  WA  0   0 16
│ │    [22] .bss              NOBITS          0000000000029068 028064 000060 00  WA  0   0  8
│ │    [23] .comment          PROGBITS        0000000000000000 028064 000065 01  MS  0   0  1
│ │    [24] .note.gnu.gold-version NOTE            0000000000000000 0280cc 00001c 00      0   0  4
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00004af0 ff357a40 0200ff25 7c400200 90909090 .5z@...%|@......
│ │    0x00004b00 ff257a40 02006800 000000e9 e0ffffff .%z@..h.........
│ │    0x00004b10 ff257240 02006801 000000e9 d0ffffff .%r@..h.........
│ │    0x00004b20 ff256a40 02006802 000000e9 c0ffffff .%j@..h.........
│ │    0x00004b30 ff256240 02006803 000000e9 b0ffffff .%b@..h.........
│ │    0x00004b40 ff255a40 02006804 000000e9 a0ffffff .%Z@..h.........
│ │    0x00004b50 ff255240 02006805 000000e9 90ffffff .%R@..h.........
│ ├── readelf --wide --decompress --hex-dump=.got.plt {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got.plt&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00028b68 00890200 00000000 00000000 00000000 ................
│ │    0x00028b78 00000000 00000000 064b0000 00000000 .........K......
│ │    0x00028b88 164b0000 00000000 264b0000 00000000 .K......&amp;K......
│ │    0x00028b98 364b0000 00000000 464b0000 00000000 6K......FK......
│ │    0x00028ba8 564b0000 00000000 664b0000 00000000 VK......fK......
│ │    0x00028bb8 764b0000 00000000 864b0000 00000000 vK.......K......
│ │    0x00028bc8 964b0000 00000000 a64b0000 00000000 .K.......K......
├── lib/x86_64/tor.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,24 +7,24 @@</font>
│ │    [ 2] .note.android.ident NOTE            00000168 000168 000098 00   A  0   0  2
│ │    [ 3] .dynsym           DYNSYM          00000200 000200 0240d0 10   A  4   1  4
│ │    [ 4] .dynstr           STRTAB          000242d0 0242d0 033888 00   A  0   0  1
│ │    [ 5] .hash             HASH            00057b58 057b58 011080 04   A  3   0  4
│ │    [ 6] .gnu.version      VERSYM          00068bd8 068bd8 00481a 02   A  3   0  2
│ │    [ 7] .gnu.version_r    VERNEED         0006d3f4 06d3f4 000060 00   A  4   3  4
│ │    [ 8] .rel.dyn          REL             0006d454 06d454 017020 08   A  3   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00084474 084474 000680 08  AI  3  22  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00084474 084474 000680 08  AI  3  10  4</font>
│ │    [10] .plt              PROGBITS        00084b00 084b00 000d10 04  AX  0   0 16
│ │    [11] .text             PROGBITS        00085820 085820 48f20c 00  AX  0   0 32
│ │    [12] .rodata           PROGBITS        00514a40 514a40 0c9d00 00   A  0   0 64
│ │    [13] .eh_frame         PROGBITS        005de740 5de740 08a1a8 00   A  0   0  4
│ │    [14] .eh_frame_hdr     PROGBITS        006688e8 6688e8 01a6cc 00   A  0   0  4
│ │    [15] .data.rel.ro.local PROGBITS        006848c0 6838c0 00bc2c 00  WA  0   0 64
│ │ <font color="#CC0000">-  [16] .fini_array       FINI_ARRAY      006904ec 68f4ec 000008 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      006904f4 68f4f4 000008 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [18] .preinit_array    PREINIT_ARRAY   006904fc 68f4fc 000008 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [16] .fini_array       FINI_ARRAY      006904ec 68f4ec 000008 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      006904f4 68f4f4 000008 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [18] .preinit_array    PREINIT_ARRAY   006904fc 68f4fc 000008 00  WA  0   0  4</font>
│ │    [19] .data.rel.ro      PROGBITS        00690540 68f540 006608 00  WA  0   0 64
│ │    [20] .dynamic          DYNAMIC         00696b48 695b48 000120 08  WA  4   0  4
│ │    [21] .got              PROGBITS        00696c68 695c68 000018 00  WA  0   0  4
│ │    [22] .got.plt          PROGBITS        00696c80 695c80 00034c 00  WA  0   0  4
│ │    [23] .data             PROGBITS        00697000 696000 0185d8 00  WA  0   0 64
│ │    [24] .bss              NOBITS          006af600 6ae5d8 006c30 00  WA  0   0 64
│ │    [25] .note.gnu.gold-version NOTE            00000000 6ae5d8 00001c 00      0   0  4
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00084b00 ffb30400 0000ffa3 08000000 00000000 ................
│ │    0x00084b10 ffa30c00 00006800 000000e9 e0ffffff ......h.........
│ │    0x00084b20 ffa31000 00006808 000000e9 d0ffffff ......h.........
│ │    0x00084b30 ffa31400 00006810 000000e9 c0ffffff ......h.........
│ │    0x00084b40 ffa31800 00006818 000000e9 b0ffffff ......h.........
│ │    0x00084b50 ffa31c00 00006820 000000e9 a0ffffff ......h ........
│ │    0x00084b60 ffa32000 00006828 000000e9 90ffffff .. ...h(........
│ ├── readelf --wide --decompress --hex-dump=.got.plt {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got.plt&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00696c80 486b6900 00000000 00000000 164b0800 Hki..........K..
│ │    0x00696c90 264b0800 364b0800 464b0800 564b0800 &amp;K..6K..FK..VK..
│ │    0x00696ca0 664b0800 764b0800 864b0800 964b0800 fK..vK...K...K..
│ │    0x00696cb0 a64b0800 b64b0800 c64b0800 d64b0800 .K...K...K...K..
│ │    0x00696cc0 e64b0800 f64b0800 064c0800 164c0800 .K...K...L...L..
│ │    0x00696cd0 264c0800 364c0800 464c0800 564c0800 &amp;L..6L..FL..VL..
│ │    0x00696ce0 664c0800 764c0800 864c0800 964c0800 fL..vL...L...L..
├── lib/x86_64/liberrno-lib.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,21 +7,21 @@</font>
│ │    [ 2] .dynsym           DYNSYM          0000000000000228 000228 0000f0 18   A  3   1  8
│ │    [ 3] .dynstr           STRTAB          0000000000000318 000318 0000db 00   A  0   0  1
│ │    [ 4] .hash             HASH            00000000000003f8 0003f8 00003c 04   A  2   0  8
│ │    [ 5] .gnu.version      VERSYM          0000000000000434 000434 000014 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          0000000000000448 000448 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         0000000000000464 000464 000020 00   A  3   1  4
│ │    [ 8] .rela.dyn         RELA            0000000000000488 000488 000030 18   A  2   0  8
│ │ <font color="#CC0000">-  [ 9] .rela.plt         RELA            00000000000004b8 0004b8 000060 18  AI  2  18  8</font>
│ │ <font color="#4E9A06">+  [ 9] .rela.plt         RELA            00000000000004b8 0004b8 000060 18  AI  2  10  8</font>
│ │    [10] .plt              PROGBITS        0000000000000520 000520 000050 10  AX  0   0 16
│ │    [11] .text             PROGBITS        0000000000000570 000570 000083 00  AX  0   0 16
│ │    [12] .eh_frame         PROGBITS        00000000000005f8 0005f8 0000c4 00   A  0   0  8
│ │    [13] .eh_frame_hdr     PROGBITS        00000000000006bc 0006bc 00003c 00   A  0   0  4
│ │ <font color="#CC0000">-  [14] .fini_array       FINI_ARRAY      0000000000001d90 000d90 000010 08  WA  0   0  8</font>
│ │ <font color="#CC0000">-  [15] .init_array       INIT_ARRAY      0000000000001da0 000da0 000008 08  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [14] .fini_array       FINI_ARRAY      0000000000001d90 000d90 000010 00  WA  0   0  8</font>
│ │ <font color="#4E9A06">+  [15] .init_array       INIT_ARRAY      0000000000001da0 000da0 000008 00  WA  0   0  8</font>
│ │    [16] .dynamic          DYNAMIC         0000000000001da8 000da8 000220 10  WA  3   0  8
│ │    [17] .got              PROGBITS        0000000000001fc8 000fc8 000000 00  WA  0   0  8
│ │    [18] .got.plt          PROGBITS        0000000000001fc8 000fc8 000038 00  WA  0   0  8
│ │    [19] .data             PROGBITS        0000000000002000 001000 000008 00  WA  0   0  8
│ │    [20] .bss              NOBITS          0000000000002008 001008 000000 00  WA  0   0  1
│ │    [21] .comment          PROGBITS        0000000000000000 001008 000065 01  MS  0   0  1
│ │    [22] .note.gnu.gold-version NOTE            0000000000000000 001070 00001c 00      0   0  4
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,8 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00000520 ff35aa1a 0000ff25 ac1a0000 90909090 .5.....%........
│ │    0x00000530 ff25aa1a 00006800 000000e9 e0ffffff .%....h.........
│ │    0x00000540 ff25a21a 00006801 000000e9 d0ffffff .%....h.........
│ │    0x00000550 ff259a1a 00006802 000000e9 c0ffffff .%....h.........
│ │    0x00000560 ff25921a 00006803 000000e9 b0ffffff .%....h.........
│ ├── readelf --wide --decompress --hex-dump=.got.plt {}
│ │ <font color="#06989A">@@ -1,8 +1,7 @@</font>
│ │  
│ │  Hex dump of section &apos;.got.plt&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00001fc8 a81d0000 00000000 00000000 00000000 ................
│ │    0x00001fd8 00000000 00000000 36050000 00000000 ........6.......
│ │    0x00001fe8 46050000 00000000 56050000 00000000 F.......V.......
│ │    0x00001ff8 66050000 00000000                   f.......
├── lib/x86/libiconv.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,23 +7,23 @@</font>
│ │    [ 2] .dynsym           DYNSYM          00000158 000158 000260 10   A  3   1  4
│ │    [ 3] .dynstr           STRTAB          000003b8 0003b8 0001a0 00   A  0   0  1
│ │    [ 4] .hash             HASH            00000558 000558 000134 04   A  2   0  4
│ │    [ 5] .gnu.version      VERSYM          0000068c 00068c 00004c 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          000006d8 0006d8 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         000006f4 0006f4 000020 00   A  3   1  4
│ │    [ 8] .rel.dyn          REL             00000714 000714 0007a0 08   A  2   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00000eb4 000eb4 0000d0 08  AI  2  20  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00000eb4 000eb4 0000d0 08  AI  2  10  4</font>
│ │    [10] .plt              PROGBITS        00000f90 000f90 0001b0 04  AX  0   0 16
│ │    [11] .text             PROGBITS        00001140 001140 014790 00  AX  0   0 16
│ │    [12] .rodata           PROGBITS        000158d0 0158d0 0c8610 00   A  0   0 16
│ │    [13] .eh_frame         PROGBITS        000ddee0 0ddee0 002074 00   A  0   0  4
│ │    [14] .eh_frame_hdr     PROGBITS        000dff54 0dff54 0008a4 00   A  0   0  4
│ │ <font color="#CC0000">-  [15] .fini_array       FINI_ARRAY      000e2594 0e1594 000008 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [15] .fini_array       FINI_ARRAY      000e2594 0e1594 000008 00  WA  0   0  4</font>
│ │    [16] .data.rel.ro      PROGBITS        000e259c 0e159c 0008d4 00  WA  0   0  4
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      000e2e70 0e1e70 000004 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      000e2e70 0e1e70 000004 00  WA  0   0  4</font>
│ │    [18] .dynamic          DYNAMIC         000e2e74 0e1e74 000118 08  WA  3   0  4
│ │    [19] .got              PROGBITS        000e2f8c 0e1f8c 000000 00  WA  0   0  4
│ │    [20] .got.plt          PROGBITS        000e2f8c 0e1f8c 000074 00  WA  0   0  4
│ │    [21] .data             PROGBITS        000e3000 0e2000 000008 00  WA  0   0  4
│ │    [22] .bss              NOBITS          000e3008 0e2008 000004 00  WA  0   0  4
│ │    [23] .comment          PROGBITS        00000000 0e2008 000065 01  MS  0   0  1
│ │    [24] .note.gnu.gold-version NOTE            00000000 0e2070 00001c 00      0   0  4
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00000f90 ffb30400 0000ffa3 08000000 00000000 ................
│ │    0x00000fa0 ffa30c00 00006800 000000e9 e0ffffff ......h.........
│ │    0x00000fb0 ffa31000 00006808 000000e9 d0ffffff ......h.........
│ │    0x00000fc0 ffa31400 00006810 000000e9 c0ffffff ......h.........
│ │    0x00000fd0 ffa31800 00006818 000000e9 b0ffffff ......h.........
│ │    0x00000fe0 ffa31c00 00006820 000000e9 a0ffffff ......h ........
│ │    0x00000ff0 ffa32000 00006828 000000e9 90ffffff .. ...h(........
│ ├── readelf --wide --decompress --hex-dump=.got.plt {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got.plt&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x000e2f8c 742e0e00 00000000 00000000 a60f0000 t...............
│ │    0x000e2f9c b60f0000 c60f0000 d60f0000 e60f0000 ................
│ │    0x000e2fac f60f0000 06100000 16100000 26100000 ............&amp;...
│ │    0x000e2fbc 36100000 46100000 56100000 66100000 6...F...V...f...
│ │    0x000e2fcc 76100000 86100000 96100000 a6100000 v...............
│ │    0x000e2fdc b6100000 c6100000 d6100000 e6100000 ................
│ │    0x000e2fec f6100000 06110000 16110000 26110000 ............&amp;...
├── lib/x86/libzbar.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,23 +7,23 @@</font>
│ │    [ 2] .dynsym           DYNSYM          00000158 000158 000f20 10   A  3   1  4
│ │    [ 3] .dynstr           STRTAB          00001078 001078 00163c 00   A  0   0  1
│ │    [ 4] .hash             HASH            000026b4 0026b4 0006e4 04   A  2   0  4
│ │    [ 5] .gnu.version      VERSYM          00002d98 002d98 0001e4 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          00002f7c 002f7c 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         00002f98 002f98 000020 00   A  3   1  4
│ │    [ 8] .rel.dyn          REL             00002fb8 002fb8 0001d8 08   A  2   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00003190 003190 000480 08  AI  2  20  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00003190 003190 000480 08  AI  2  10  4</font>
│ │    [10] .plt              PROGBITS        00003610 003610 000910 04  AX  0   0 16
│ │    [11] .text             PROGBITS        00003f20 003f20 01e2f8 00  AX  0   0 16
│ │    [12] .rodata           PROGBITS        00022220 022220 001e60 00   A  0   0 16
│ │    [13] .eh_frame         PROGBITS        00024080 024080 001e8c 00   A  0   0  4
│ │    [14] .eh_frame_hdr     PROGBITS        00025f0c 025f0c 000804 00   A  0   0  4
│ │ <font color="#CC0000">-  [15] .fini_array       FINI_ARRAY      00027ae8 026ae8 000008 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [15] .fini_array       FINI_ARRAY      00027ae8 026ae8 000008 00  WA  0   0  4</font>
│ │    [16] .data.rel.ro      PROGBITS        00027af0 026af0 00018c 00  WA  0   0  4
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      00027c7c 026c7c 000004 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      00027c7c 026c7c 000004 00  WA  0   0  4</font>
│ │    [18] .dynamic          DYNAMIC         00027c80 026c80 000120 08  WA  3   0  4
│ │    [19] .got              PROGBITS        00027da0 026da0 000014 00  WA  0   0  4
│ │    [20] .got.plt          PROGBITS        00027db4 026db4 00024c 00  WA  0   0  4
│ │    [21] .data             PROGBITS        00028000 027000 000058 00  WA  0   0  4
│ │    [22] .bss              NOBITS          00028058 027058 000044 00  WA  0   0  4
│ │    [23] .comment          PROGBITS        00000000 027058 000065 01  MS  0   0  1
│ │    [24] .note.gnu.gold-version NOTE            00000000 0270c0 00001c 00      0   0  4
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00003610 ffb30400 0000ffa3 08000000 00000000 ................
│ │    0x00003620 ffa30c00 00006800 000000e9 e0ffffff ......h.........
│ │    0x00003630 ffa31000 00006808 000000e9 d0ffffff ......h.........
│ │    0x00003640 ffa31400 00006810 000000e9 c0ffffff ......h.........
│ │    0x00003650 ffa31800 00006818 000000e9 b0ffffff ......h.........
│ │    0x00003660 ffa31c00 00006820 000000e9 a0ffffff ......h ........
│ │    0x00003670 ffa32000 00006828 000000e9 90ffffff .. ...h(........
│ ├── readelf --wide --decompress --hex-dump=.got.plt {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got.plt&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00027db4 807c0200 00000000 00000000 26360000 .|..........&amp;6..
│ │    0x00027dc4 36360000 46360000 56360000 66360000 66..F6..V6..f6..
│ │    0x00027dd4 76360000 86360000 96360000 a6360000 v6...6...6...6..
│ │    0x00027de4 b6360000 c6360000 d6360000 e6360000 .6...6...6...6..
│ │    0x00027df4 f6360000 06370000 16370000 26370000 .6...7...7..&amp;7..
│ │    0x00027e04 36370000 46370000 56370000 66370000 67..F7..V7..f7..
│ │    0x00027e14 76370000 86370000 96370000 a6370000 v7...7...7...7..
├── lib/x86/tor.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,24 +7,24 @@</font>
│ │    [ 2] .note.android.ident NOTE            00000168 000168 000098 00   A  0   0  2
│ │    [ 3] .dynsym           DYNSYM          00000200 000200 0240d0 10   A  4   1  4
│ │    [ 4] .dynstr           STRTAB          000242d0 0242d0 033888 00   A  0   0  1
│ │    [ 5] .hash             HASH            00057b58 057b58 011080 04   A  3   0  4
│ │    [ 6] .gnu.version      VERSYM          00068bd8 068bd8 00481a 02   A  3   0  2
│ │    [ 7] .gnu.version_r    VERNEED         0006d3f4 06d3f4 000060 00   A  4   3  4
│ │    [ 8] .rel.dyn          REL             0006d454 06d454 017020 08   A  3   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00084474 084474 000680 08  AI  3  22  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00084474 084474 000680 08  AI  3  10  4</font>
│ │    [10] .plt              PROGBITS        00084b00 084b00 000d10 04  AX  0   0 16
│ │    [11] .text             PROGBITS        00085820 085820 48f20c 00  AX  0   0 32
│ │    [12] .rodata           PROGBITS        00514a40 514a40 0c9d00 00   A  0   0 64
│ │    [13] .eh_frame         PROGBITS        005de740 5de740 08a1a8 00   A  0   0  4
│ │    [14] .eh_frame_hdr     PROGBITS        006688e8 6688e8 01a6cc 00   A  0   0  4
│ │    [15] .data.rel.ro.local PROGBITS        006848c0 6838c0 00bc2c 00  WA  0   0 64
│ │ <font color="#CC0000">-  [16] .fini_array       FINI_ARRAY      006904ec 68f4ec 000008 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      006904f4 68f4f4 000008 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [18] .preinit_array    PREINIT_ARRAY   006904fc 68f4fc 000008 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [16] .fini_array       FINI_ARRAY      006904ec 68f4ec 000008 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      006904f4 68f4f4 000008 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [18] .preinit_array    PREINIT_ARRAY   006904fc 68f4fc 000008 00  WA  0   0  4</font>
│ │    [19] .data.rel.ro      PROGBITS        00690540 68f540 006608 00  WA  0   0 64
│ │    [20] .dynamic          DYNAMIC         00696b48 695b48 000120 08  WA  4   0  4
│ │    [21] .got              PROGBITS        00696c68 695c68 000018 00  WA  0   0  4
│ │    [22] .got.plt          PROGBITS        00696c80 695c80 00034c 00  WA  0   0  4
│ │    [23] .data             PROGBITS        00697000 696000 0185d8 00  WA  0   0 64
│ │    [24] .bss              NOBITS          006af600 6ae5d8 006c30 00  WA  0   0 64
│ │    [25] .note.gnu.gold-version NOTE            00000000 6ae5d8 00001c 00      0   0  4
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00084b00 ffb30400 0000ffa3 08000000 00000000 ................
│ │    0x00084b10 ffa30c00 00006800 000000e9 e0ffffff ......h.........
│ │    0x00084b20 ffa31000 00006808 000000e9 d0ffffff ......h.........
│ │    0x00084b30 ffa31400 00006810 000000e9 c0ffffff ......h.........
│ │    0x00084b40 ffa31800 00006818 000000e9 b0ffffff ......h.........
│ │    0x00084b50 ffa31c00 00006820 000000e9 a0ffffff ......h ........
│ │    0x00084b60 ffa32000 00006828 000000e9 90ffffff .. ...h(........
│ ├── readelf --wide --decompress --hex-dump=.got.plt {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got.plt&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00696c80 486b6900 00000000 00000000 164b0800 Hki..........K..
│ │    0x00696c90 264b0800 364b0800 464b0800 564b0800 &amp;K..6K..FK..VK..
│ │    0x00696ca0 664b0800 764b0800 864b0800 964b0800 fK..vK...K...K..
│ │    0x00696cb0 a64b0800 b64b0800 c64b0800 d64b0800 .K...K...K...K..
│ │    0x00696cc0 e64b0800 f64b0800 064c0800 164c0800 .K...K...L...L..
│ │    0x00696cd0 264c0800 364c0800 464c0800 564c0800 &amp;L..6L..FL..VL..
│ │    0x00696ce0 664c0800 764c0800 864c0800 964c0800 fL..vL...L...L..
├── lib/x86/liberrno-lib.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,21 +7,21 @@</font>
│ │    [ 2] .dynsym           DYNSYM          00000158 000158 0000b0 10   A  3   1  4
│ │    [ 3] .dynstr           STRTAB          00000208 000208 0000ec 00   A  0   0  1
│ │    [ 4] .hash             HASH            000002f4 0002f4 000040 04   A  2   0  4
│ │    [ 5] .gnu.version      VERSYM          00000334 000334 000016 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          0000034c 00034c 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         00000368 000368 000020 00   A  3   1  4
│ │    [ 8] .rel.dyn          REL             00000388 000388 000010 08   A  2   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00000398 000398 000028 08  AI  2  18  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00000398 000398 000028 08  AI  2  10  4</font>
│ │    [10] .plt              PROGBITS        000003c0 0003c0 000060 04  AX  0   0 16
│ │    [11] .text             PROGBITS        00000420 000420 00012f 00  AX  0   0 16
│ │    [12] .eh_frame         PROGBITS        00000550 000550 00010c 00   A  0   0  4
│ │    [13] .eh_frame_hdr     PROGBITS        0000065c 00065c 00004c 00   A  0   0  4
│ │ <font color="#CC0000">-  [14] .fini_array       FINI_ARRAY      00001ec4 000ec4 000008 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [15] .init_array       INIT_ARRAY      00001ecc 000ecc 000004 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [14] .fini_array       FINI_ARRAY      00001ec4 000ec4 000008 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [15] .init_array       INIT_ARRAY      00001ecc 000ecc 000004 00  WA  0   0  4</font>
│ │    [16] .dynamic          DYNAMIC         00001ed0 000ed0 000110 08  WA  3   0  4
│ │    [17] .got              PROGBITS        00001fe0 000fe0 000000 00  WA  0   0  4
│ │    [18] .got.plt          PROGBITS        00001fe0 000fe0 000020 00  WA  0   0  4
│ │    [19] .data             PROGBITS        00002000 001000 000004 00  WA  0   0  4
│ │    [20] .bss              NOBITS          00002004 001004 000000 00  WA  0   0  1
│ │    [21] .comment          PROGBITS        00000000 001004 000065 01  MS  0   0  1
│ │    [22] .note.gnu.gold-version NOTE            00000000 00106c 00001c 00      0   0  4
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x000003c0 ffb30400 0000ffa3 08000000 00000000 ................
│ │    0x000003d0 ffa30c00 00006800 000000e9 e0ffffff ......h.........
│ │    0x000003e0 ffa31000 00006808 000000e9 d0ffffff ......h.........
│ │    0x000003f0 ffa31400 00006810 000000e9 c0ffffff ......h.........
│ │    0x00000400 ffa31800 00006818 000000e9 b0ffffff ......h.........
│ │    0x00000410 ffa31c00 00006820 000000e9 a0ffffff ......h ........
│ ├── readelf --wide --decompress --hex-dump=.got.plt {}
│ │ <font color="#06989A">@@ -1,6 +1,5 @@</font>
│ │  
│ │  Hex dump of section &apos;.got.plt&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00001fe0 d01e0000 00000000 00000000 d6030000 ................
│ │    0x00001ff0 e6030000 f6030000 06040000 16040000 ................
├── lib/armeabi-v7a/libiconv.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,23 +7,23 @@</font>
│ │    [ 2] .dynsym           DYNSYM          00000158 000158 000570 10   A  3   1  4
│ │    [ 3] .dynstr           STRTAB          000006c8 0006c8 0005e9 00   A  0   0  1
│ │    [ 4] .hash             HASH            00000cb4 000cb4 000270 04   A  2   0  4
│ │    [ 5] .gnu.version      VERSYM          00000f24 000f24 0000ae 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          00000fd4 000fd4 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         00000ff0 000ff0 000020 00   A  3   1  4
│ │    [ 8] .rel.dyn          REL             00001010 001010 0007d8 08   A  2   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             000017e8 0017e8 000198 08  AI  2  19  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             000017e8 0017e8 000198 08  AI  2  10  4</font>
│ │    [10] .plt              PROGBITS        00001980 001980 000278 00  AX  0   0  4
│ │    [11] .text             PROGBITS        00001bf8 001bf8 00f7e8 00  AX  0   0  4
│ │    [12] .ARM.extab        PROGBITS        000113e0 0113e0 0000e4 00   A  0   0  4
│ │    [13] .ARM.exidx        ARM_EXIDX       000114c4 0114c4 000520 08  AL 11   0  4
│ │    [14] .rodata           PROGBITS        000119f0 0119f0 0c7c87 00   A  0   0 16
│ │ <font color="#CC0000">-  [15] .fini_array       FINI_ARRAY      000db510 0da510 000008 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [15] .fini_array       FINI_ARRAY      000db510 0da510 000008 00  WA  0   0  4</font>
│ │    [16] .data.rel.ro      PROGBITS        000db518 0da518 0008d4 00  WA  0   0  4
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      000dbdec 0dadec 000004 04  WA  0   0  1</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      000dbdec 0dadec 000004 00  WA  0   0  1</font>
│ │    [18] .dynamic          DYNAMIC         000dbdf0 0dadf0 000118 08  WA  3   0  4
│ │    [19] .got              PROGBITS        000dbf08 0daf08 0000f8 00  WA  0   0  4
│ │    [20] .data             PROGBITS        000dc000 0db000 000008 00  WA  0   0  4
│ │    [21] .bss              NOBITS          000dc008 0db008 000004 00  WA  0   0  4
│ │    [22] .comment          PROGBITS        00000000 0db008 000065 01  MS  0   0  1
│ │    [23] .note.gnu.gold-version NOTE            00000000 0db070 00001c 00      0   0  4
│ │    [24] .ARM.attributes   ARM_ATTRIBUTES  00000000 0db08c 000038 00      0   0  1
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00001980 04e02de5 04e09fe5 0ee08fe0 08f0bee5 ..-.............
│ │    0x00001990 98a50d00 00c68fe2 daca8ce2 98f5bce5 ................
│ │    0x000019a0 00c68fe2 daca8ce2 90f5bce5 00c68fe2 ................
│ │    0x000019b0 daca8ce2 88f5bce5 00c68fe2 daca8ce2 ................
│ │    0x000019c0 80f5bce5 00c68fe2 daca8ce2 78f5bce5 ............x...
│ │    0x000019d0 00c68fe2 daca8ce2 70f5bce5 00c68fe2 ........p.......
│ │    0x000019e0 daca8ce2 68f5bce5 00c68fe2 daca8ce2 ....h...........
│ ├── readelf --wide --decompress --hex-dump=.got {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x000dbf08 00000000 00000000 00000000 00000000 ................
│ │    0x000dbf18 00000000 e4190100 c4140100 00000000 ................
│ │    0x000dbf28 00000000 00000000 00000000 80190000 ................
│ │    0x000dbf38 80190000 80190000 80190000 80190000 ................
│ │    0x000dbf48 80190000 80190000 80190000 80190000 ................
│ │    0x000dbf58 80190000 80190000 80190000 80190000 ................
│ │    0x000dbf68 80190000 80190000 80190000 80190000 ................
├── lib/armeabi-v7a/libzbar.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,23 +7,23 @@</font>
│ │    [ 2] .dynsym           DYNSYM          00000158 000158 0013b0 10   A  3   1  4
│ │    [ 3] .dynstr           STRTAB          00001508 001508 001bde 00   A  0   0  1
│ │    [ 4] .hash             HASH            000030e8 0030e8 000910 04   A  2   0  4
│ │    [ 5] .gnu.version      VERSYM          000039f8 0039f8 000276 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          00003c70 003c70 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         00003c8c 003c8c 000020 00   A  3   1  4
│ │    [ 8] .rel.dyn          REL             00003cac 003cac 000210 08   A  2   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00003ebc 003ebc 0005f0 08  AI  2  19  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00003ebc 003ebc 0005f0 08  AI  2  10  4</font>
│ │    [10] .plt              PROGBITS        000044ac 0044ac 0008fc 00  AX  0   0  4
│ │    [11] .text             PROGBITS        00004da8 004da8 013e44 00  AX  0   0  4
│ │    [12] .ARM.extab        PROGBITS        00018bec 018bec 0001f8 00   A  0   0  4
│ │    [13] .ARM.exidx        ARM_EXIDX       00018de4 018de4 000748 08  AL 11   0  4
│ │    [14] .rodata           PROGBITS        00019530 019530 001454 00   A  0   0  8
│ │ <font color="#CC0000">-  [15] .fini_array       FINI_ARRAY      0001ba10 01aa10 000008 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [15] .fini_array       FINI_ARRAY      0001ba10 01aa10 000008 00  WA  0   0  4</font>
│ │    [16] .data.rel.ro      PROGBITS        0001ba18 01aa18 00018c 00  WA  0   0  4
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      0001bba4 01aba4 000004 04  WA  0   0  1</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      0001bba4 01aba4 000004 00  WA  0   0  1</font>
│ │    [18] .dynamic          DYNAMIC         0001bba8 01aba8 000120 08  WA  3   0  4
│ │    [19] .got              PROGBITS        0001bcc8 01acc8 000338 00  WA  0   0  4
│ │    [20] .data             PROGBITS        0001c000 01b000 000058 00  WA  0   0  4
│ │    [21] .bss              NOBITS          0001c058 01b058 000044 00  WA  0   0  4
│ │    [22] .comment          PROGBITS        00000000 01b058 000065 01  MS  0   0  1
│ │    [23] .note.gnu.gold-version NOTE            00000000 01b0c0 00001c 00      0   0  4
│ │    [24] .ARM.attributes   ARM_ATTRIBUTES  00000000 01b0dc 000038 00      0   0  1
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x000044ac 04e02de5 04e09fe5 0ee08fe0 08f0bee5 ..-.............
│ │    0x000044bc 40780100 00c68fe2 17ca8ce2 40f8bce5 @x..........@...
│ │    0x000044cc 00c68fe2 17ca8ce2 38f8bce5 00c68fe2 ........8.......
│ │    0x000044dc 17ca8ce2 30f8bce5 00c68fe2 17ca8ce2 ....0...........
│ │    0x000044ec 28f8bce5 00c68fe2 17ca8ce2 20f8bce5 (........... ...
│ │    0x000044fc 00c68fe2 17ca8ce2 18f8bce5 00c68fe2 ................
│ │    0x0000450c 17ca8ce2 10f8bce5 00c68fe2 17ca8ce2 ................
│ ├── readelf --wide --decompress --hex-dump=.got {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x0001bcc8 00000000 00000000 00000000 00000000 ................
│ │    0x0001bcd8 00000000 00000000 00000000 00000000 ................
│ │    0x0001bce8 00000000 00000000 2c950100 e48d0100 ........,.......
│ │    0x0001bcf8 00000000 00000000 00000000 00000000 ................
│ │    0x0001bd08 ac440000 ac440000 ac440000 ac440000 .D...D...D...D..
│ │    0x0001bd18 ac440000 ac440000 ac440000 ac440000 .D...D...D...D..
│ │    0x0001bd28 ac440000 ac440000 ac440000 ac440000 .D...D...D...D..
├── lib/armeabi-v7a/tor.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,24 +7,24 @@</font>
│ │    [ 2] .note.android.ident NOTE            00000168 000168 000098 00   A  0   0  4
│ │    [ 3] .dynsym           DYNSYM          00000200 000200 024760 10   A  4   1  4
│ │    [ 4] .dynstr           STRTAB          00024960 024960 033f8f 00   A  0   0  1
│ │    [ 5] .hash             HASH            000588f0 0588f0 011224 04   A  3   0  4
│ │    [ 6] .gnu.version      VERSYM          00069b14 069b14 0048ec 02   A  3   0  2
│ │    [ 7] .gnu.version_r    VERNEED         0006e400 06e400 000060 00   A  4   3  4
│ │    [ 8] .rel.dyn          REL             0006e460 06e460 017b88 08   A  3   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00085fe8 085fe8 000698 08  AI  3  21  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00085fe8 085fe8 000698 08  AI  3  10  4</font>
│ │    [10] .plt              PROGBITS        00086680 086680 0009f8 00  AX  0   0  4
│ │    [11] .text             PROGBITS        00087078 087078 4e38d4 00  AX  0   0  4
│ │    [12] .ARM.extab        PROGBITS        0056a94c 56a94c 010824 00   A  0   0  4
│ │    [13] .ARM.exidx        ARM_EXIDX       0057b170 57b170 00c5b8 08  AL 11   0  4
│ │    [14] .rodata           PROGBITS        00587728 587728 0c6c30 00   A  0   0  8
│ │    [15] .data.rel.ro.local PROGBITS        00650240 64f240 00b394 00  WA  0   0  4
│ │ <font color="#CC0000">-  [16] .fini_array       FINI_ARRAY      0065b5d4 65a5d4 000008 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [17] .init_array       INIT_ARRAY      0065b5dc 65a5dc 000010 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [18] .preinit_array    PREINIT_ARRAY   0065b5ec 65a5ec 000008 04  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [16] .fini_array       FINI_ARRAY      0065b5d4 65a5d4 000008 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [17] .init_array       INIT_ARRAY      0065b5dc 65a5dc 000010 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [18] .preinit_array    PREINIT_ARRAY   0065b5ec 65a5ec 000008 00  WA  0   0  4</font>
│ │    [19] .data.rel.ro      PROGBITS        0065b5f8 65a5f8 004f28 00  WA  0   0  8
│ │    [20] .dynamic          DYNAMIC         00660520 65f520 000120 08  WA  4   0  4
│ │    [21] .got              PROGBITS        00660644 65f644 0009bc 00  WA  0   0  4
│ │    [22] .data             PROGBITS        00661000 660000 016e78 00  WA  0   0  8
│ │    [23] .bss              NOBITS          00677e78 676e78 0064c0 00  WA  0   0  8
│ │    [24] .note.gnu.gold-version NOTE            00000000 676e78 00001c 00      0   0  4
│ │    [25] .ARM.attributes   ARM_ATTRIBUTES  00000000 676e94 000034 00      0   0  1
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00086680 04e02de5 04e09fe5 0ee08fe0 08f0bee5 ..-.............
│ │    0x00086690 18a65d00 05c68fe2 daca8ce2 18f6bce5 ..].............
│ │    0x000866a0 05c68fe2 daca8ce2 10f6bce5 05c68fe2 ................
│ │    0x000866b0 daca8ce2 08f6bce5 05c68fe2 daca8ce2 ................
│ │    0x000866c0 00f6bce5 05c68fe2 daca8ce2 f8f5bce5 ................
│ │    0x000866d0 05c68fe2 daca8ce2 f0f5bce5 05c68fe2 ................
│ │    0x000866e0 daca8ce2 e8f5bce5 05c68fe2 daca8ce2 ................
│ ├── readelf --wide --decompress --hex-dump=.got {}
│ │ <font color="#06989A">@@ -1,10 +1,9 @@</font>
│ │  
│ │  Hex dump of section &apos;.got&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00660644 ecb56500 dcb56500 d4b56500 e4b56500 ..e...e...e...e.
│ │    0x00660654 20710800 a8e16600 f0ab6700 f8ab6700  q....f...g...g.
│ │    0x00660664 d8806700 48926700 50926700 58926700 ..g.H.g.P.g.X.g.
│ │    0x00660674 30936700 38936700 60926700 48936700 0.g.8.g.`.g.H.g.
│ │    0x00660684 50936700 58936700 60936700 d07f6700 P.g.X.g.`.g...g.
│ │    0x00660694 7c7e6700 00000000 bc453600 c4473600 |~g......E6..G6.
│ │    0x006606a4 544c3600 bcc93500 08e36700 1ce36700 TL6...5...g...g.
├── lib/armeabi-v7a/liberrno-lib.so
│ ├── readelf --wide --sections {}
│ │ <font color="#06989A">@@ -7,21 +7,21 @@</font>
│ │    [ 2] .dynsym           DYNSYM          00000158 000158 000100 10   A  3   1  4
│ │    [ 3] .dynstr           STRTAB          00000258 000258 00013b 00   A  0   0  1
│ │    [ 4] .hash             HASH            00000394 000394 000054 04   A  2   0  4
│ │    [ 5] .gnu.version      VERSYM          000003e8 0003e8 000020 02   A  2   0  2
│ │    [ 6] .gnu.version_d    VERDEF          00000408 000408 00001c 00   A  3   1  4
│ │    [ 7] .gnu.version_r    VERNEED         00000424 000424 000020 00   A  3   1  4
│ │    [ 8] .rel.dyn          REL             00000444 000444 000040 08   A  2   0  4
│ │ <font color="#CC0000">-  [ 9] .rel.plt          REL             00000484 000484 000048 08  AI  2  17  4</font>
│ │ <font color="#4E9A06">+  [ 9] .rel.plt          REL             00000484 000484 000048 08  AI  2  10  4</font>
│ │    [10] .plt              PROGBITS        000004cc 0004cc 000080 00  AX  0   0  4
│ │    [11] .text             PROGBITS        0000054c 00054c 000e4e 00  AX  0   0  4
│ │    [12] .ARM.extab        PROGBITS        0000139c 00139c 00003c 00   A  0   0  4
│ │    [13] .ARM.exidx        ARM_EXIDX       000013d8 0013d8 000110 08  AL 11   0  4
│ │ <font color="#CC0000">-  [14] .fini_array       FINI_ARRAY      00002e98 001e98 000008 04  WA  0   0  4</font>
│ │ <font color="#CC0000">-  [15] .init_array       INIT_ARRAY      00002ea0 001ea0 000004 04  WA  0   0  1</font>
│ │ <font color="#4E9A06">+  [14] .fini_array       FINI_ARRAY      00002e98 001e98 000008 00  WA  0   0  4</font>
│ │ <font color="#4E9A06">+  [15] .init_array       INIT_ARRAY      00002ea0 001ea0 000004 00  WA  0   0  1</font>
│ │    [16] .dynamic          DYNAMIC         00002ea4 001ea4 000110 08  WA  3   0  4
│ │    [17] .got              PROGBITS        00002fb4 001fb4 00004c 00  WA  0   0  4
│ │    [18] .data             PROGBITS        00003000 002000 000004 00  WA  0   0  4
│ │    [19] .bss              NOBITS          00003004 002004 000000 00  WA  0   0  1
│ │    [20] .comment          PROGBITS        00000000 002004 000065 01  MS  0   0  1
│ │    [21] .note.gnu.gold-version NOTE            00000000 00206c 00001c 00      0   0  4
│ │    [22] .ARM.attributes   ARM_ATTRIBUTES  00000000 002088 000038 00      0   0  1
│ ├── readelf --wide --decompress --hex-dump=.plt {}
│ │ <font color="#06989A">@@ -1,9 +1,10 @@</font>
│ │  
│ │  Hex dump of section &apos;.plt&apos;:
│ │ <font color="#4E9A06">+ NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x000004cc 04e02de5 04e09fe5 0ee08fe0 08f0bee5 ..-.............
│ │    0x000004dc f42a0000 00c68fe2 02ca8ce2 f4fabce5 .*..............
│ │    0x000004ec 00c68fe2 02ca8ce2 ecfabce5 00c68fe2 ................
│ │    0x000004fc 02ca8ce2 e4fabce5 00c68fe2 02ca8ce2 ................
│ │    0x0000050c dcfabce5 00c68fe2 02ca8ce2 d4fabce5 ................
│ │    0x0000051c 00c68fe2 02ca8ce2 ccfabce5 00c68fe2 ................
│ │    0x0000052c 02ca8ce2 c4fabce5 00c68fe2 02ca8ce2 ................
│ ├── readelf --wide --decompress --hex-dump=.got {}
│ │ <font color="#06989A">@@ -1,9 +1,8 @@</font>
│ │  
│ │  Hex dump of section &apos;.got&apos;:
│ │ <font color="#CC0000">- NOTE: This section has relocations against it, but these have NOT been applied to this dump.</font>
│ │    0x00002fb4 a50c0000 a90c0000 ad0c0000 00000000 ................
│ │    0x00002fc4 e8140000 d8130000 00000000 00000000 ................
│ │    0x00002fd4 00000000 00000000 cc040000 cc040000 ................
│ │    0x00002fe4 cc040000 cc040000 cc040000 cc040000 ................
│ │    0x00002ff4 cc040000 cc040000 cc040000          ............
├── original/META-INF/MANIFEST.MF
│ <font color="#06989A">@@ -1,4 +1,3140 @@</font>
│  Manifest-Version: 1.0
│  Built-By: Generated-by-ADT
│  Created-By: Android Gradle 3.2.1
│  
│ <font color="#4E9A06">+Name: AndroidManifest.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 4r8uqlA1/asLSNm0WakLOJJr83CwTG593osXg9eeyLM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: BIP39/en.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: GH2wSoad2bx76A0hqGSX1pLA22q9OqjLa+XWGP91f64=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/android.arch.core_runtime.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: zFL2eISLgUNzdXtGA4O/YZYOSUPCA3Na3eCjULPlCYk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/android.arch.lifecycle_extensions.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: zFL2eISLgUNzdXtGA4O/YZYOSUPCA3Na3eCjULPlCYk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/android.arch.lifecycle_livedata-core.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: zFL2eISLgUNzdXtGA4O/YZYOSUPCA3Na3eCjULPlCYk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/android.arch.lifecycle_livedata.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: zFL2eISLgUNzdXtGA4O/YZYOSUPCA3Na3eCjULPlCYk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/android.arch.lifecycle_runtime.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: zFL2eISLgUNzdXtGA4O/YZYOSUPCA3Na3eCjULPlCYk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/android.arch.lifecycle_viewmodel.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: zFL2eISLgUNzdXtGA4O/YZYOSUPCA3Na3eCjULPlCYk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/androidx.arch.core_core-runtime.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: wo/MpTY3vIjhJK8XJd8Ty5jGne3v1i+zzb4c22t2BiQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/androidx.lifecycle_lifecycle-livedata-core.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: wo/MpTY3vIjhJK8XJd8Ty5jGne3v1i+zzb4c22t2BiQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/androidx.lifecycle_lifecycle-livedata.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: wo/MpTY3vIjhJK8XJd8Ty5jGne3v1i+zzb4c22t2BiQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/androidx.lifecycle_lifecycle-viewmodel.version</font>
│ <font color="#4E9A06">+SHA-256-Digest: wo/MpTY3vIjhJK8XJd8Ty5jGne3v1i+zzb4c22t2BiQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/proguard/androidx-annotations.pro</font>
│ <font color="#4E9A06">+SHA-256-Digest: jwlksyF/nd1D8WLP//uDEYbfGodEKlJ93FKlRXNNrQ4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/proguard/okhttp3.pro</font>
│ <font color="#4E9A06">+SHA-256-Digest: xtLaBB4+VZ6tJ5clxmCZRdjCG3LgSr4tY8MvPWVfQVg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/services/com.fasterxml.jackson.core.JsonFactory</font>
│ <font color="#4E9A06">+SHA-256-Digest: i/cV+/TDNDbM5V+SafwzHrJVwyIjPN7a5EVil7M4qvA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/services/com.fasterxml.jackson.core.ObjectCodec</font>
│ <font color="#4E9A06">+SHA-256-Digest: pklDsKPn5XNOlP5tcRc6krjA+D72UDBbRKxDiwe4jME=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: META-INF/services/javax.servlet.ServletContainerInitializer</font>
│ <font color="#4E9A06">+SHA-256-Digest: wxA9BaP/QLfcKB37lBx75dpHWBGWCh8Uq+LagnvYvtw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/BIP39/en.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: GH2wSoad2bx76A0hqGSX1pLA22q9OqjLa+XWGP91f64=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/common/bridges.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 2o/dF25ukmGh/mWa0moKVaKMWk9KFYz1mqz2UdnuK1c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/common/geoip</font>
│ <font color="#4E9A06">+SHA-256-Digest: 15oU4baF7Jz7PppIm5ZQ5AkuzMRoye70IidlhX6D2W4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/common/geoip6</font>
│ <font color="#4E9A06">+SHA-256-Digest: JuK4jJkocxMbpkItbrj2ztlK3S9av9vj3MpMvXmGHWc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/common/torrc</font>
│ <font color="#4E9A06">+SHA-256-Digest: yqJNpHyQ7UomDuJg7NHas/iTdojoKuCjcFcDs42kMng=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/fontawesome-webfont.ttf</font>
│ <font color="#4E9A06">+SHA-256-Digest: TW656dhSoqb3TnxChFai8H/GOhYT0QGS2O00AdnaX/o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/geoip</font>
│ <font color="#4E9A06">+SHA-256-Digest: n2XquGUIIktBy/MZMUwHDzP97LJQ0XJH2oOre01DYVk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/geoip6</font>
│ <font color="#4E9A06">+SHA-256-Digest: KWkRwPaaJrX9ZfRVL2oUHWzbtZefYri32yjnuX4GmPU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: assets/torrc</font>
│ <font color="#4E9A06">+SHA-256-Digest: wPva3zaise8LQoe2bTqUMSkV+vXxCwhh5JTqbEC2LC4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/boolex/EvaluatorTemplate.groovy</font>
│ <font color="#4E9A06">+SHA-256-Digest: +lNsvIJ0oSnQLa9xdRsOXPx3ifby6AlppXLNiQli/SQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/db2.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: +YQZiTOrN18pScD3r3sc2U95iFcLOzt2+mSKKfKnJEQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/h2.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: XQLfg298OTeWRG/wea6SkKKEub40PSsTi9RJG3IXxO0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/hsqldb.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: GVsDFksN6/S4UYFSPvR4T/bskKmBeKD2HJK2s8bj9Fs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/mssql.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: paWZN2rIXoFagADfBKUglY532BioTpOk69YNpUmy5AE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/mysql.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: ETSxBF8gRYfLY3bmgpY8WYzVwXLmQ5Lbw2qVY4kWtRM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/oracle.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: ugcKyb27gSksRrwvQ2ODdCdxbTEWTV0+kIlnfoQSxHY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/postgresql.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: bPybfeIOoRQGvjuqVkFVQgz0yHn4/OTURMAmNFbUxxM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/sqllite.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: dB0+iyn+BkFxWAHqCalcGU/eWOsRbFoocNvTXXQQE2A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/db/script/sybaseSqlAnywhere.sql</font>
│ <font color="#4E9A06">+SHA-256-Digest: 8Ip1QqbgYBU/D6lLKUW0mUtThGEC/xk7AES86pdMk6Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/gaffer/AppenderDelegate.groovy</font>
│ <font color="#4E9A06">+SHA-256-Digest: c0b+dZ+ArMyZnzsdVmIaeTCeI0NX35wfPKFBknjPVTI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/gaffer/ComponentDelegate.groovy</font>
│ <font color="#4E9A06">+SHA-256-Digest: 96o0q8qAAVN+4Gw4KQcBQKBJMXSOJURzl5rPAoT2vec=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/gaffer/ConfigurationContributor.groovy</font>
│ <font color="#4E9A06">+SHA-256-Digest: X8NdEUjO4txp1yYFTSh3AVZSm+o2Mxr9j3mR3mSrEAI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/gaffer/ConfigurationDelegate.groovy</font>
│ <font color="#4E9A06">+SHA-256-Digest: eCp6Np2Tb2kIZ41oaKRS8veMMboZO0yCFfv0uSGODEE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/gaffer/GafferConfigurator.groovy</font>
│ <font color="#4E9A06">+SHA-256-Digest: nxJnU/bYAMAWLtxAbCCosOtHqZdZaElVi346Apqldw8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/gaffer/NestedType.groovy</font>
│ <font color="#4E9A06">+SHA-256-Digest: ie3J3BbQZaF0b0A8ACiyNoa+R0YsMk8i/pZYVktN7A0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: ch/qos/logback/classic/gaffer/PropertyUtil.groovy</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7ENAQML6zAdoKSdp6hfpf4MosMNNWT45bcwJ4BXcaRc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: classes.dex</font>
│ <font color="#4E9A06">+SHA-256-Digest: hYMKVZaSEgc412qzVpKIUYiRgxG3nKopEdc/rRFVjk0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: classes2.dex</font>
│ <font color="#4E9A06">+SHA-256-Digest: L8skTFGa2ul2scmzwei0q5azoLcz2V77JrAJNriKiFQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: classes3.dex</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9HkRFdGh0GRSyzslEWf0ujYrmUFQWExZgAXqF4z+TKI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: classes4.dex</font>
│ <font color="#4E9A06">+SHA-256-Digest: XxSPdIoCzMoXl3IkkSkPKjZ0gMKRxXh0fF9z5tgsdeg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: classes5.dex</font>
│ <font color="#4E9A06">+SHA-256-Digest: cHOqGgKNAUkH3VMcUPn9c2dXuztSb2DwDl//T3AmEog=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: classes6.dex</font>
│ <font color="#4E9A06">+SHA-256-Digest: tedW5+NI5C0uSe/OXUylnynMN3wejiuog9TeqpCRLgg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/CheckForNull.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: SAeUIENgWzJfD++iQzRNsNEeMs69jxM98rfF2EhvIxI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/CheckForSigned.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: nD10L+mrjl+wjVViqwywJV4pYPrPlPgzSb5UK2VX88E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/CheckReturnValue.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: /DKMLbx5+zvCXUen8EhkEP6KBObWzq35f37UT6bcDrs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/Detainted.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: fScs+BTUfIz4ndDS8oPd/IiiZAUSL9mPKELbyweJ7Q4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/MatchesPattern.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: /y/7yjgjwaP1MzYwh4BoxyT2cFgmTMpzltmr74IYl90=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/Nonnegative.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: c7g9eDvHzfe1yfQzGpKBVMbcTpe6NJpeUSTgJrpCIbA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/Nonnull.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6y1ax81ijdPFnl97FDeP6lMdXHaFffg3z+j5ouzh3dw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/Nullable.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: URyeiIi73BPgOI61w6iC9D/yEWAJO0BMhwzpToOh9Qk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/OverridingMethodsMustInvokeSuper.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: XXhsT/8/OBurq590UlLdgLoQIQxAK9TBUWHOm2PezKY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/ParametersAreNonnullByDefault.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: lCM8ocpPttRXvtiD+DaQGdTwAWvoHU5cz8AfXVC/lG4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/ParametersAreNullableByDefault.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: TTBxyQ10lxPQhomq8oy9YWjQHYSaVMbPe4+vFfiADls=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/PropertyKey.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: VVkAHQ9p5JSH8cwM+oLTfgZLBENszHAmo9ilqjAhXX0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/RegEx.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: ewjQkXNGcvj48yD9qnzea6SMeGov3KlMniQH4eKvKro=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/Signed.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: dmM63OWQ58dx739ye1dfmuVDiVOdZmZ3qcoankJW43Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/Syntax.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: Y8Bb04x8J50UcFjW4VSkTuHaYsksxoSaVzvcbDRYaeA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/Tainted.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: m3VdCVzyxKQajgZLW9CrPlVoRQSLcF0syY6GNbi9pvI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/Untainted.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5ECWplT4Jcn48/uboJn4BRVbPa9BkYwXfXGTVYuxGYE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/WillClose.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: HIHqHHKEw3xdZrQ2/GMmeHdmfaA7K2RvxsEeoqjfrAg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/WillCloseWhenClosed.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: s8bjQrTfxMYtM4V/iSDP4Hfp8sMTedj2J0leDEoGyxM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/WillNotClose.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: bCWHWPz1TJZXBS3J6G0KvHgPikWAgE46CouLN2Up5FM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/concurrent/GuardedBy.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: 8mUJcQAcv9TBJ0h+ARXnqVOdZP1qmN2N0GdTMK47eQ0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/concurrent/Immutable.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: R/mgdqQ5bEkqNz7sliKhVJe1a2M6Z6+XylG9OxFCoI0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/concurrent/NotThreadSafe.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: cwYKiQfAHuenK/vZx0oDf/GVO9ekUQuJl/3OwKV0Ghk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/concurrent/ThreadSafe.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: vP2feievSaZQVzSrAyWfAqciLTvQUoIcqm2U2TC9/Jo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/meta/Exclusive.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: CwQF8dwUCsLr20zdO7v9zxniLXJLxXqJ1TCzPoybf/U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/meta/Exhaustive.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: ybQIUEGs0WAmke5JU1pqka/Ctn1r2dn7ThqyFp1iem8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/meta/TypeQualifier.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: go//phisHNovwH/MDl5YeFqt/kvEgcDk6Nxfwj1mLOU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/meta/TypeQualifierDefault.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: J/qgSNfCO9bXnTUVgW7B81Z1iuFAwO3HAqdLkfkhU5U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/meta/TypeQualifierNickname.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: MJz1joN/G8Yxg/yUQ7IxkEFX8awlv+4OXOvK5S9E61E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/meta/TypeQualifierValidator.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: TR4spvRlzhMKgjMIYFOsyZHl/TiffjHIigzRnvMsZmo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: javax/annotation/meta/When.java</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1536meA/oettDm8CSDPvFsECm5iXXi52f3YLLb9Nh5A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/arm64-v8a/liberrno-lib.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: PSO6A13gv88TtGH7C+xiR+l9P1dCOuAd/EJihgtriG8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/arm64-v8a/libiconv.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: VQuWUGbiDHBng9gLo1oDwViwTpe8Mkib6QxSm28FJgA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/arm64-v8a/libzbar.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: rVGmLzYOrNyj/jDMfNujp+paAQdwEunldspUVWS07LY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/arm64-v8a/tor.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: gD6W7V/CQoUCV5rpePMEsjEtsPP6YuprbwhGKL1wiZ0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/arm64/tor.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0I5bkk0pOodcRiUlGUWOMr47ef+main0tDf3qg5mZVU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/armeabi-v7a/liberrno-lib.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: Ytba8tLWlTWau1j1qp9X6l+l4UYE1wJ3H/m84gt1XE0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/armeabi-v7a/libiconv.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: /FBU6cDeAbrrcSok1dWsU5ill8RF/QZcEfq6AsUYJLQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/armeabi-v7a/libzbar.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: KH/YpxSGoRcYHw6ZpTxpGFDaudkOt2wr/2wQ8/bN6IE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/armeabi-v7a/tor.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: gD6W7V/CQoUCV5rpePMEsjEtsPP6YuprbwhGKL1wiZ0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/armeabi/liberrno-lib.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: ahhqF2DNDlVU5Nvrxr1k1cSkYDiK94RwY8ahqS7K2pE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/armeabi/libiconv.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: UtebRNGIT+OVhKFz177sX8/k94SBQZurYxYXXU+Xt88=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/armeabi/libzbar.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: PUw6glsPoRG9ZIctCHUKOrX0kQdMH75G6R77XPUtl1Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/armeabi/tor.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: gD6W7V/CQoUCV5rpePMEsjEtsPP6YuprbwhGKL1wiZ0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/mips/liberrno-lib.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: CVOPZO0JQtaeTJgLo/NZDKOO/o8YgOnejRCe0Sw8jgU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/mips/libiconv.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: rj6XMczVCl556cRsZbGfkkgWodzwfwxZ5psEwyWD3Dg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/mips/libzbar.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: OlXt+qetoiD1mC8z+VH+GQ7jCZF+GvT0aLoCq8EwBww=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/mips64/liberrno-lib.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: G98z/mjQdiDdSU0crh5jhUe0NkremLDsSnfRzV9uI/o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/mips64/libiconv.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3ZpOpLIUVxm+rYtFS624O5OZHHzmuL7ofC3cFqNJr7I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/mips64/libzbar.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: phP7Y/vRYT1Sn7WaRnYcWFufMNc4MKkstOKrhEvGqcU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86/liberrno-lib.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6JKv/XhWOOWykBTT0DxPB1u8gNgMNRyLe2aQ+wl4Rjw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86/libiconv.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: 4U6ydko3k/7R9254t5OZqXv9XD2GQa/m3NxtgH9TgKM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86/libzbar.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: gnDFrR1xWbLmhP5SPau5rdZn59PMlO8/W4zf51k0HWA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86/tor.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: o/yjyq92GyzWqiGuciylgspgkHMXhatfjqcMa3zUevI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86_64/darwin/libscrypt.dylib</font>
│ <font color="#4E9A06">+SHA-256-Digest: gyfs7hxuX+tBdmdmuE4dH/EcO/7h1WzBHbbbBJGeWlg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86_64/liberrno-lib.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: suJn6p4e1mY4G8TDNLUx9pzl4PKBXqGWfw8Tbk+BsMQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86_64/libiconv.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: B9Zx8HxXyIfnIVaaRa2a+ePI4kxhEL3RCnb8q5Ltoso=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86_64/libzbar.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: b60ZdHejiiz+kFkqLE2Zi+8StNG7jbe6nhsjchSqd+s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: lib/x86_64/tor.so</font>
│ <font color="#4E9A06">+SHA-256-Digest: o/yjyq92GyzWqiGuciylgspgkHMXhatfjqcMa3zUevI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: okhttp3/internal/publicsuffix/publicsuffixes.gz</font>
│ <font color="#4E9A06">+SHA-256-Digest: vo2mhtIIs05LPwv5CqLgt2OClWQRMsPwyqgbA0mQMv8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org.bitcoin.production.checkpoints.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: wE70VezgxhVBf+q8O1RwOYDYgI+BfU4T6LYcqeO3z7k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org.bitcoin.test.checkpoints.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: qkgrpznOp5Yur9xEq/KG35JFOi78DwtnqYLFcGr2Z3A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: rWx14OULUfgH1zo9PvRqb2ZqiRy0lTzDV6XTBeYeMKs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 2lt/68cPhg+RvMzKN8KaYZojRCzIC5zZitiE4W1smFQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_cyrillic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: opkX6kwAvdIW2zHTYgXvOCnQ+3aSbRifzYJg03ANTFc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_english.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: U3Ob0nhoKSM4YG73of0gm2JT016U16SvsDF2lJjWDWQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: GWUOSraWeLuEkCiQDkwuhn91IpxER6D8v1pb1rO9acM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_german.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: z8fB70EgmvibZ2ukahgwYLk97cqx59cw9iU/SPWvDqk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_hungarian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: a9JJkQcmlJr6TlqWI+w5mRUcPvQ4Q3FKkAA8+xE1Awk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_polish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: X1ZifVDU7w48jHYiXT5y/ZXIyQrmKdZdMvIC95LVkSo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_romanian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: kAvLi4Us6XOPhe+s2pG7yvAZLWYvL6mW67404RWAFzY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_russian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: uQi4EyUJkJEGfsuqsjLbAhW2Hr1omdD32YmgEzY6fLM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_approx_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: a9JJkQcmlJr6TlqWI+w5mRUcPvQ4Q3FKkAA8+xE1Awk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: vGtrQj5q+ZfORTSOF/Og1qGGF8/me1C9tQHMlyWMPTU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_approx_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: oflH4HFCOqXCQ2BIT4W3E596P/530gieNnyhUnQ9Ghk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: /DVYN3g5oQN1u0AUbZ0S7Js3SHIjAjzAdplGrtJPNS8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_cyrillic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jl2TtTDy8LOytgKv2m6RI3DAsBwG30ophxGfYyC/+0Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_english.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jl2TtTDy8LOytgKv2m6RI3DAsBwG30ophxGfYyC/+0Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jl2TtTDy8LOytgKv2m6RI3DAsBwG30ophxGfYyC/+0Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_german.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: MmdPNC98i3P+gx9GsFN98KK51DxF/N7XYX3fKElcDio=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_hungarian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jl2TtTDy8LOytgKv2m6RI3DAsBwG30ophxGfYyC/+0Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_polish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0E1ujqTtWT9Hj+H/FQofV6wwVXwT+fAZ/PKxZYtv9J4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_romanian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jl2TtTDy8LOytgKv2m6RI3DAsBwG30ophxGfYyC/+0Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_russian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: NL+lCVEfdRemKDMMynxeUUZKtO75U4NAVPaE0C4R/8c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_exact_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jl2TtTDy8LOytgKv2m6RI3DAsBwG30ophxGfYyC/+0Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_hebrew_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: rRGg9TfpCwiT6GJODJl92OLs4T3+i5CzZtOnc/gpvuU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_lang.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: dJUMHaAgEr/87RcHNC/FUF/dqeYrVVxnmBYiQMQqToE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_languages.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7nNoiKByVJehHHTMownuIdUg1a1ktVQSUOjx2pE4/pc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: vbYMOQGrBX9MlLOEswKgvdemASrAfPTtuHvTe5KD0Xs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_cyrillic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: NhvIdpHaa/2ln/QWzmHJIqroEZRGaf0F9TesYp7v7YQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_english.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: fCiYbn3JEdh5jr6fJrk9BIfmMkgvxTSDY82O+U2sGl4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: I09LHurOpsgUr0SUwVV5nCE4fys85hxH8PXpDpWSgCo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_german.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: ALCkuvJ/90+ZLzn/h133tpTv5yGPIoc0aVtLCBdXV1g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: HjaCi9kKByG2UT9vaH6sUD3IwaN4JK5ubY1JY0RiAZQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_hungarian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: okevMKxHy6qHzJRY/jOp+hAUJNd1ZcfKAStOi5I6Np0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_polish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: BHv3YwsDjhgKxAfca+20XrvELAGnyb57F4RcTpsV8lA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_romanian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: IS8DwqHFOaCNRmQQexB73c7TpGG21TYjNcDBA53YjXw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_russian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: nZkE0j7GAx/2IJZ3Zs9yoG9aqayVjryatsSVahnCx2s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/ash_rules_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: yeQQqKXAlls545NiqQS9EHI5u/4BdjSOADQj5eSBKqA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: pyu9Rd6KMao86qoGUTiWxKu1m8du+UWBGj7cY7VUUdQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_arabic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: g4pH5vloGJpKiCuCIgZUyiGUUJVtLPCuAzbTQolMWY8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7fA+T0nDQ9RbY+qcPUcLa6+Vo2iMVyOtHoW9+4YOMxQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_cyrillic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: +adQ1IFW2Ojh2UyO002/WWwk7+lFEj1ugIrwad7iWZo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_czech.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5SsSolD6WT+ZyooG4CsYoJFRih5rZv1Jbnin2ziIzEM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_dutch.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5SsSolD6WT+ZyooG4CsYoJFRih5rZv1Jbnin2ziIzEM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_english.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: U3Ob0nhoKSM4YG73of0gm2JT016U16SvsDF2lJjWDWQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: HZ009k5djTAJdJ2dgYwFg0Y+6J8IwPfSsFRKQxasrUc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_german.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: QzD0Pgh3WdNhawLrNiB0rtlGmMtNT4SKbljyUyxbCus=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_greek.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5SsSolD6WT+ZyooG4CsYoJFRih5rZv1Jbnin2ziIzEM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_greeklatin.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3/oALTl/hRNK8DUMwvp18e3f11oqGL5aV2HjyAeB8S4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_hungarian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: +Cf1SvZWCkxtYVYYQzRX4cncBseMdoPe5tQYfNvNjIM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_italian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: +Cf1SvZWCkxtYVYYQzRX4cncBseMdoPe5tQYfNvNjIM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_polish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0GI0PwMw4SHGhOPmlD93dYVceOllsEOoOaTbqHM21Ng=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_portuguese.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5SsSolD6WT+ZyooG4CsYoJFRih5rZv1Jbnin2ziIzEM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_romanian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: TjXdhrItjQESh7GauosdSvnoxj698n0ImejZ7fTUse0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_russian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: FeceM/r3u0VY/T9k7J44ERuwSFI0O8SomwmuEnJ5yvA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: ypOR+IMBG3SRl/u8eXdnd9lX3V9VdJ2aYAwdIp+AuN8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_approx_turkish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5SsSolD6WT+ZyooG4CsYoJFRih5rZv1Jbnin2ziIzEM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: z42j7lHUeNzh/2+hzO8vZUETCNR3A/kgQjzBFyJmYj4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_approx_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: lI9tQ1WsdAEczNe9VOw7zkop6ibF1FGPAZzcHc7ycoU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_arabic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: iRogEQxQ/V3Ww0unHBEgfi4RlIw8yl8VVLPJNGRPWgU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: apQ8qM8/e+0f9Rbemj7PRPE8gB09yWeAOxtqla5F03I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_cyrillic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: /VUX6Y7r++H5eewh+XSenWyv0+Z5jl8xwXOgvgjAJeU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_czech.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: /VUX6Y7r++H5eewh+XSenWyv0+Z5jl8xwXOgvgjAJeU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_dutch.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_english.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: /VUX6Y7r++H5eewh+XSenWyv0+Z5jl8xwXOgvgjAJeU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_german.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: q+DCspPd430FHITApgGUuMMDjzmUEbYPBwbc3frbC98=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_greek.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_greeklatin.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: h4TCsdi44gbj385u2k897IAKG8IT3E9NwMsJqBMqVCw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_hungarian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_italian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_polish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: bYBff8MXLwLxEkC5BD/txTXQcpoQXyGCBd287jJFeBo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_portuguese.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_romanian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_russian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: NL+lCVEfdRemKDMMynxeUUZKtO75U4NAVPaE0C4R/8c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: sziO1amBffpxcrEGHNIAMGhiPFt5S00loiEiXIk+3fI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_exact_turkish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_hebrew_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Spibhp8ik1kMIa8jBdpliJZq7m073kMbPkkSOQSxG88=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_lang.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: y8ekz3vyimv8ShgE6q5RESX0WfKnPaTBwzscqfWKq9s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_languages.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: sxZa2qNgJsKTONyNjzUc68dCNzFGXh1kIvJ9Z3hJTH0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0j1XaCmCHt194T9nNOynRqdn3W1WWkzRjjPZc23w0Kw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_arabic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: grcHx5mYAxvaJp/XwRkuoalnDAPq0J7nenfOT+yhLDg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_cyrillic.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: DIFYEn8ZvQ5oO/iDqy+360wXOjTuUatnUvVskyqxJeg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_czech.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: hN6eFSQSzWEpNAWQNyVx/tsUh2BUtd87gqKjZWT81hk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_dutch.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: mSHnXbvJQtJXKoZgsJeTKWOehwf/qbsd5rfRp6mVXCs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_english.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: vPuHI8vzlmsJug3G89u9x4goacTnrxYPgDwvBRl4WiI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: tfErCFz7SJapECD5AbwW5vMWTwZB5oOw0gWnMFYCdLM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_german.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: RT1HSrmWUjovCaHFiX2OPhtMBFBhInwFJ5L5guHDyLc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_greek.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: a1bF2Km2Jw+Hd8zl8bCGA5CqIY9+K0PusdfL2zh3iDA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_greeklatin.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: BhIvA/6Hny73iwt2vxQS6xcMafqCj0DX57kHhWZWRG4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: pXDzf0XzXy5AmxFz2VXYOtyHjagYf4mduTDV0Z+JpfE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_hungarian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Frp895v4UIncKf2S7/Y1jIk7xq74XmOW3SmvfEGk9hE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_italian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: mRVd7fDK6q5CEod9C5DaUuAlKBLu5KsGqar1OTuUr7A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_polish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5ODrYQqLzPcdOc0OELLFHk0fEyoFLRg8dJURRk7VH8k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_portuguese.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: DFHCzCKYhRawP2r91WmYl7fK/is+XTZ2qxAZQfv9ktw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_romanian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: de4m88a/bK/CJYviG4IJUuLgfBkpGeNP1xfdgbCi9K0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_russian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3tEFyFcWfCuoxEztfO4ADWvNeCOkhRtpj46lQBFafzc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5yU8fBq35G0pyFeSvmjBWnvbiTfDZAQ/TExljQj3ams=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/gen_rules_turkish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: GAC6ua7mvl9Xg4v6rwcQCYQcGvk9XdInieGnZD0ZkmE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/lang.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: BZh6aARCRqoZ6rtqvFptm9BmyyULf9yVrpZytzidyR4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_approx_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: R2Yckre9Kj2/8LGfI0IoEHbyh3+rJZKgwHalVagTlH8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_approx_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: fz6imF/UsbXg9aZUSkerYySXp4U7aRrvXmvXMg/Ko6Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_approx_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_approx_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_approx_italian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: thZdvaPZcrXFSyGRQJosBKw1/H26Cr9d3zya4T+amKA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_approx_portuguese.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: IdYyJ5dyromDgyIgUFvPDG+1APT/reD5kIMG0BhxDxM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_approx_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: IdYyJ5dyromDgyIgUFvPDG+1APT/reD5kIMG0BhxDxM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_exact_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3z9js5RrjV8FxJd+5atIjagWL0rYyvp6gc2HMbSVTLg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_exact_approx_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Iy9ZdQ+d7c8Lwq8ZTRah9DSlagrOBBX+Z5JLc8fiKjI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_exact_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: w2VK1Da+GFNv7z44cttyVWWcQTv8m1rURrFGe2jIuMA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_exact_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: ndy3mHXDpJJZ6Y+vmEM8fYwp42je3qcVXJ/3FxAWhX0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_exact_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_exact_italian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_exact_portuguese.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_exact_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1U8m+Absg6NL6qAzy9EQqSBPhTBFv5BQowUBRrUuxQs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_hebrew_common.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9U2KTVCsQzGzSpptZGYQjo1GL1kNg7iBMMtDn3YKdOg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_lang.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5jMZFWwHb41g6UTl+ZhynweTFqvY5cL2Pme43lf7pp8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_languages.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: nMEtQXLkFWQrQQXZZxfZybKKvKir+2G2RD9OnEetr4c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_rules_any.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: ozQ1bez4HBgmgtjg0D4XJ6tFoGhEbtEcloCRZ6yhh38=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_rules_french.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: Kjy+NH/aDfWV4xEJWcSWVsbsa287evaaZ9VZDwcpaZs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_rules_hebrew.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: VFkZ7uyu5zAf8Ur+aciPrwJ381aMFUAyviBNP/DZ2mg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_rules_italian.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: O00lNxDQyd1WSVlAR8jhB2MJTBC3tRjP2EBIwSIlX5s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_rules_portuguese.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: ih4GdV66guQN6Avuzcq8Adig6aVH8eq7NTRuUmvPkLI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/bm/sep_rules_spanish.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: V2VLQ1Xke5CFVhJqjPEPmnfcSeW/Oxeel5e06bR/iO0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/commons/codec/language/dmrules.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: IIHTrMHFtfxtYZ9x/YnpsAIZ8/hqlj7dKXHd7RE5PA0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/log4j/lf5/config/defaultconfig.properties</font>
│ <font color="#4E9A06">+SHA-256-Digest: JuYOLDYhiUMeIiHz7kEE9i9SwWXT4uj3fLUoUg9pgSg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/log4j/lf5/viewer/images/channelexplorer_new.gif</font>
│ <font color="#4E9A06">+SHA-256-Digest: +ULKIuSheUGTlqtStyDBdgj7i34MkHvf7hT4we9BdHI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/log4j/lf5/viewer/images/channelexplorer_satellite.gif</font>
│ <font color="#4E9A06">+SHA-256-Digest: szUvEHpYnKgQYwyBsOQOuv/k4pmSvT5V5cvmQi0As8Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/log4j/lf5/viewer/images/lf5_small_icon.gif</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0Zma3l8QxcUvWlli4VJkiJj/9r449MmutiENkl1LoBY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/apache/log4j/xml/log4j.dtd</font>
│ <font color="#4E9A06">+SHA-256-Digest: wmOR1/QYAt8wl9ZeLImMVI87hD9YT9qFBwDt3akVU9E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/bitcoinj/crypto/cacerts</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3ZGWN2KPzntmN8AjwJm9/kkc/D1r+kVts1Tf/ZFuj0g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/bitcoinj/crypto/mnemonic/wordlist/english.txt</font>
│ <font color="#4E9A06">+SHA-256-Digest: L17tU6Rye0v4iA2PPxme/JDlhQNkbZ/47/Oi7Tsk29o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/bouncycastle/x509/CertPathReviewerMessages.properties</font>
│ <font color="#4E9A06">+SHA-256-Digest: ySg5To7Sxmr8lMyNGblQu7mA3nSO8M5SdevRWgO3mCo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/bouncycastle/x509/CertPathReviewerMessages_de.properties</font>
│ <font color="#4E9A06">+SHA-256-Digest: OKOeMtg1i5SYdKOMyjmvIw+4MlBXUAz0r/8p0VDdCqg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/spongycastle/x509/CertPathReviewerMessages.properties</font>
│ <font color="#4E9A06">+SHA-256-Digest: ySg5To7Sxmr8lMyNGblQu7mA3nSO8M5SdevRWgO3mCo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: org/spongycastle/x509/CertPathReviewerMessages_de.properties</font>
│ <font color="#4E9A06">+SHA-256-Digest: OKOeMtg1i5SYdKOMyjmvIw+4MlBXUAz0r/8p0VDdCqg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim-v21/design_bottom_sheet_slide_in.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: hMj/XTf3dpYI9wVpGgxlHl9N+bml6qSXR5Q1GEyP1r0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim-v21/design_bottom_sheet_slide_out.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: t8QZI3a230p6NVfkdMFXLjKFdrlw5j/sr2mS0enwzq0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_fade_in.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: HKmvv61b/dCu+BeaMa2gBq1tMidK1sG9PHbgakJAaa8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_fade_out.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: dyKjxQwRIZ2twlcCaD3N+XtCHcKd806BO6cxWo36qh0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_grow_fade_in_from_bottom.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: NsdMWQMKPetGS9Gjww3mkf20g95rnErQufKCfTg+J00=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_popup_enter.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: jNJyF4a+7bCsXGTS7i+15S0Sd9CA0R75unfd4HjQyUg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_popup_exit.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: prczrlvEHKzVeHUSHxYnr6+0M2WQTuMqwNHEXTtKdCI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_shrink_fade_out_from_bottom.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: AEsXaAyXlRSD9TcEV8rQJZyrz/IlgY7PPMLpNbQBl3w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_slide_in_bottom.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: dEtNd8sFeQwn3AcZeUd9ReTrYQRJDdvO0TzMOfGeRQ8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_slide_in_top.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: kDHdPf1sBcrDorMBU14EB+AViNnj7YSKUEihmSPRxeo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_slide_out_bottom.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: d+VNYSw2LCUbmof7oV4UUbwfxma9JdGlNUkSVFJpVxo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/abc_slide_out_top.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9oqCO1fOAYZ/CG0iUGm2Z05jiWHmjAgE7e7bvsD1hxk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/check_path_anim.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9vecn1F6EcsvFClJBO5C9F7X7J+mtnRklUsuLCgF88c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/design_snackbar_in.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Xkmxq0Qw42Eke0k8H6Glovx12UEbzSQ7YMC/yGvEuJw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/design_snackbar_out.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Pe0XaQSeOjN3xBnKVPOFtKOUa0LbCzb8HsxlqLWBbdg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/fab_scale_down.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: BymRqT81I+Bz3bKhpcS+rs4ao/gO3YT3/i7AslcqYh0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/fab_scale_up.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Yjiu2+6f+yoITpL28PLrEya4VusCnunyqFsT7aiWbTY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/fab_slide_in_from_left.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: hbmsnjLLZyLzdsyKF36rKjYVU0z+HDcxBH4P289I0Ls=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/fab_slide_in_from_right.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZtMuOqaaxD1X46EZ/GcW9VGdvrpyblc/Hus5de2vNNc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/fab_slide_out_to_left.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: kEZWDswpiYi4L68Up5aInSvGxZ9VAykOIk/Gi3vHhBE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/fab_slide_out_to_right.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: LHMqOCfq0JY2oLY6B31d1ezW/JLgD0kglIMHvu2uems=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/tooltip_enter.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Z6/DurPNBoT5oHivqUWCXqFvVIFW0C4DBRfB1zG4VUE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/anim/tooltip_exit.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: b77Fo67XqhQ4BTZviBhYUXSfnguXGXPk4LhuRFM1Wo0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/animator-v21/design_appbar_state_list_animator.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: p7uHtEpoBRW9mCHIbDo3TXpnx0sgtqGbeYRoNhdylOM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v11/abc_background_cache_hint_selector_material_dark.x</font>
│ <font color="#4E9A06">+ ml</font>
│ <font color="#4E9A06">+SHA-256-Digest: DDDwyqPsxyRDSJa0RMXnG7sFHSLB4q6nwpSbe0c1XV0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v11/abc_background_cache_hint_selector_material_light.</font>
│ <font color="#4E9A06">+ xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: zwhgekVmHAEBwFo+ZrNIf3KVS746BdF3rmlcohHcyfY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_btn_colored_borderless_text_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 2l137DTr9HLXIj/R/oItiDRWTsQFZmqYgbKMygZcShA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_btn_colored_text_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Q4Pkxead8Q97FT75s1V1zA4bPS/jbTVEc4wD4eDDWpo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_color_highlight_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: eVGfHgSe50bHKFPTwug/w/Um+NEo8wX8Naud+zq2Pss=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_tint_btn_checkable.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: OpSB+FgOhZAFxPAbAtraip8vyk78kVXEVMH+OcSdnKU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_tint_default.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: aFd4sruChxEr4QLfjgjFPgnAhegE47NRXlk4RF1YbmU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_tint_edittext.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: aZAfjL+wYLMDn6DleVafkKHpbHFJxVqTX97yoSYSF30=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_tint_seek_thumb.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: OUXbDaLB+bfoLo5LMv7rsI7YEORkbdYpxJBXynzLcW0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_tint_spinner.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: aZAfjL+wYLMDn6DleVafkKHpbHFJxVqTX97yoSYSF30=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/abc_tint_switch_track.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: JE8CZa0LrozCUcYw+WKs+Fs94D3phDX0L0YKmbN/tco=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color-v23/design_tint_password_toggle.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wJlsPtEeeTTT32XfaIHgBG8UwYhh+Sqfz2Gzhy21VUM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_btn_colored_borderless_text_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: A5GfhZkv9H15/fXVuAtLFP+sF1ZrcaNmTCD80HerNCg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_btn_colored_text_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: KeriW5WLy3IujKht37BYuN65fqVPK0f+wb400hWq2Aw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_hint_foreground_material_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1xjj7/4XAfvXu1WxN7RLEmc2bEXh25Sgrx//ridtSsA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_hint_foreground_material_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: og5DkZJBK2yTyJWkeXie7/EQSlWZLcExrsq9bnebyKM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_primary_text_disable_only_material_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5L4W/Vnd6ujeI4sUmOvGjCdMwL59KL5j7altBOBpCck=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_primary_text_disable_only_material_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7QkTRJjchiBGEAYrjcLFOXglCsUJlqCl/aLw+O+fVoo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_primary_text_material_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: z/opeeIiwL5PyBeU9bN0hmTt+kHkYZ8hcfI/tuWnwkQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_primary_text_material_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: /Hvz/jjoYhHnLwV+C6fNLinTOoY3QYXb70yi7c0HIsw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_search_url_text.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: dJ39sAz847CfpYbvy2JJr1Bn2e0fdlrZc1rmKHdzXqc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_secondary_text_material_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: BYmO8KdGPXxm4n0sIbTGOoMJfnJBGXUB3Z8Lm671x/g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_secondary_text_material_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Mkxb0q0uUVpJtHZzuAEqancegNYx5Ca1LrPlVNeWTOQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_tint_btn_checkable.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: j6TDMSE5bkc1Npsdpd9HeQUKY0sm8c4Mysy5gak6SWc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_tint_default.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Gu5w/CfG/DX/JXIHfSPGnngc/vOQwSomlMMEpZxRaBk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_tint_edittext.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: bxOhiK0UG13acSh2zn4QI+IK2Jo88dZ93yJCJl2cDdc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_tint_seek_thumb.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: FI2BhAFIpHBSx9LDoHWp0B/PflMVkFlgunDoj+PFJdE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_tint_spinner.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: KS0FWeCUVLSaOcGnTD4RBGZbs78dCg/Nb49ThpHMJSc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/abc_tint_switch_track.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: TRxwTMtKmQFZchAxh4PNmpzbuShRgee+aTlPku/wM20=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/design_error.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1Zr9aJcYhYrsClUlCeFcDbPV77XCyLZsQuz9xwAuppM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/design_tint_password_toggle.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1HxBo3FdQqcJkkJtEJIb4f23nqqKwp6sm94y8hza7GA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/switch_thumb_material_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: EmSbeIwo0FroNZZ0RkeKHlt+kMRYjCmfrrXkKQvy4pI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/color/switch_thumb_material_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: iYS6bNiUEzp8wNkcYf3WWlhuLXwHKBe2w4gAWazumnw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-anydpi-v21/design_ic_visibility.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: C8itaNejehKmmkOYOvXdRSVzHTR1J/xui5erTnHHGaw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-anydpi-v21/design_ic_visibility_off.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: c9svgylRx8la6WN3DECsU0te/G0tpGvoLarFZcVS4Yc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-anydpi-v24/ic_samourai_and_tor_notif_icon.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: WozvYfpk6B32334ZtEar+rA76GDmuV5e+lPrca2mtrY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ab_share_pack_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: mR9zvmAK2IIaZ0PbVK9RP5sEcFjpUGbiL83R1yAyvFg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_btn_check_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XsoCgL04poh7bkF2XPXaVzEzh0YlAB65AVbq6zX74Ig=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_btn_check_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XO0qt3SFMFAlXXMJ4Qt2IXgT1W8/irj7c6w/Y12QxnY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_btn_radio_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: UICwfrSGugXt5ze1Z+sruJ17eaPttcLKgUHG66ASt10=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_btn_radio_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: dELNplOsus35rvJWqhkeXrtgcaF0cxKuxF4duCUqPPs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_btn_switch_to_on_mtrl_00001.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: n4SbzXiK3Osy9MGlqoknSb0eJEo3h7+/vTDTtvXY6ds=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_btn_switch_to_on_mtrl_00012.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: q5SvyyuzJVRMDBEDv1EJuCe/Bw9EH675CfhWrilaHPA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_cab_background_top_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Z+cBR2knB42Jqwu7Of/xLWlwJZKnpCgjeiEWiiHsEDg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_commit_search_api_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: I51gLJxl8Vb+AkYTIHlVrI+905WubsPvpRvpjjpEc/Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: OZDQBHpJq3nHQXh2/AsphzDy01JZJPbXKkGhTqhLsLU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: UAQZiW1C7ggY8hDbMXQ533RYrZ9vaPizNpC9bxjH0Fo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_menu_paste_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: OaoTi3kvbB4d+Z4MG3SEBrUKpto6hkNF8Rve2zwHEKc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_menu_selectall_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: mtKnrnRrEpOYj1ZCvwfqCaJ8BM2K2KTy2Og2YaSJfT4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_menu_share_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZgPuwG2bikC5e85xM38aQPkS8C0x2EqBUGETdwBvnpY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_star_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 2HSD1O7u7stOCICg6wwWHwR7/OUAQTG8RrFRLBTHnMA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_star_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Qo7YJasoTJGO1Dhm+fo0wi8AVTcSkkciubMYY5ixVVE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_star_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: qwfze23s+20VnJZ0U444lYkqd9mcr42EsZanfViT40E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_star_half_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ibtp1BzB4tjG6+vGKX4Iq18cLSXgFCO8Hj6KzCM7xk4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_star_half_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: C6ByV53E/yPWx7EL0CpC0Mja1oAyaFtI0zoQLZ8VbLc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_ic_star_half_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZDQnxL1ghnrK00qhRFsRtNnq4+m7HqX1zQa5YG9o3Bk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_list_divider_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: N4aUcG+3JW3SJI4q+FTv1x7H6IhfYdouFqK9Mvzz0Kk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_list_focused_holo.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ovGjevjmmTIKL62+VO6qYRLVo1ItV9aC7fBP6XvjtH4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_list_longpressed_holo.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1cZEsA7nm9Tx/LeJ67+J55wMb+qHjfvEqMZMO+NLWwM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_list_pressed_holo_dark.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: p1I8zwN/fDHPh6GG/uy5E575LYfgcCyrsIoxkUsrUD4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_list_pressed_holo_light.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: kbg1jiKsG4VUxxpShBSs8wCI2a1WK9rDgUhEdxwUyKk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_list_selector_disabled_holo_dark.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: icKOiHsNYMAbNdzSvmVPQWv/tm6FZXFtyYPjsCBJZ+g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_list_selector_disabled_holo_light.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: R18Ds8z/BPzpGnqRIULRUKAAsdAR2gA3RdwsDj9fsJI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_menu_hardkey_panel_mtrl_mult.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: j89bnaA8aN/2Wt+ocT25zjteQjqfUEbxeFq2QMKmR/s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_popup_background_mtrl_mult.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: AKGsdNgWTLXEdJoLLnfixtpKkKvoc9hgTymEHBk1fGY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_scrubber_control_off_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: DmMdv+JXXdFtP9bFlkHfpKu14WLWD1kEnkRZ8K8p+/Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_scrubber_control_to_pressed_mtrl_000.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: wTGrDi65h5vQY+c2q4ExPFpPR+qi9KDsnsqToaFQ7Xk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_scrubber_control_to_pressed_mtrl_005.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3AivnRTmtnO/nzHCSCNvBFezIkZANmR0c+OjKiN3Pw4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_scrubber_primary_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: mhpIA4qNHcBBA1tJzHMtsj4AjRJsiy5oB0ndKWFqN7M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_scrubber_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yG2TSlgJ8yWZ5CFD4wbtbgZrIk/h+j8yreFgMHTlsTY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: sLLcLK54EcEkrlKNcUMYuxBDtZ2CpkDyLEes5kwoP+w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_switch_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Lj1wIwl3rzfG13OYmac+Y5N+69/m2ALxqVfEPC8qsTE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_tab_indicator_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: qmEinNcCOSeBCcXr5yXnJITQJS76SQKhcZI2aUJ0kok=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_text_select_handle_left_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: z34NERGB243CwWtdXgJ+iDmU8SPtlAkIpfQL36jodXg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_text_select_handle_left_mtrl_light.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: SYsMvQm2tP7tisqe130jX1uycsU9IbMyZJoA6ULZido=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_text_select_handle_middle_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: zURZ0d+D1xN8rSyxYIieRXbm3R84V0WpMwCO6IKjSgw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_text_select_handle_middle_mtrl_light.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: pHVZSufHcQkqOicYmB4nEMc3hE9EpEAfctOVN1Nkmno=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_text_select_handle_right_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: TeAWG0R86ptGnVO8GmrBLQKHuS2kwQ2DuqBPkIAmbO8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_text_select_handle_right_mtrl_light.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZGAhzHfn9L1oq1n7MtMG+BogQhJebNqhYYSgYqgYP3k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_textfield_activated_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: qTOq676uSJ3qhOeOf7xAef39pXb73rM5QB/abNwD52Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_textfield_default_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: lP6YJHFK2UwAL+YhnnI8DYDHy+OmEw16pJNzC2filNE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_textfield_search_activated_mtrl_alpha.9</font>
│ <font color="#4E9A06">+ .png</font>
│ <font color="#4E9A06">+SHA-256-Digest: JfJREsxGsoV2fee1sFjPwKnv1fIc/nJK8DFQXWap7Os=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/abc_textfield_search_default_mtrl_alpha.9.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: FBGuZdgWBXPBZtKlchBv0RA8EvJC9n/uxf6qVQGX5fU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/design_ic_visibility.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: C3WvFiu1UK5eiptkMY22ao/ZV3stWaTAo3LR8gOkj0c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/design_ic_visibility_off.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: b6TCZL+NFgIB5N62U3oA8ss2Pni6eCR9UX2H7KYXZp0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/fab_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: i1j9rF8LyVcvRzbqwR0h69eGspGT5TCjVAnKgOdqR0s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/fab_bg_mini.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9+ya88VjjFcYfWEdxugn8/GstiOwM9mt5JEJ0528zIQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/fab_bg_normal.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: /madVJ9rVMmBOmDgDz1gGv9dzPw240QikOb4isjFjeg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_action_delete_sweep.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: cS78/pJvg/+aujQdWfmZF3c67oid5giri1/xMKjOmcI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_action_fiber_new.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XND86AeohZ4ho++VkEuTnnrHLifDUgF3njVKLdiLAq8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_action_playlist_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6zQ3YcmOzbib/82PCtP/zY3myt0SxcMBv+MzSor+oaI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_action_send.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: I26YPk048fLihdH9gZubTcAGXaE9SnyHMk01UJNPdj4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_backspace_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: eh1NY4Odd0imsiP0hzmQt0H4ji6/k1XjZn87BGq6O68=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_bubbles.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: jdAslM5TWx/31a2UAtp1c+rDYDarsJgiuyVxAsIpveM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_bubbles_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: tBdKVb+ECulgiN2uJDTgqeaYEaXuYeSDowhUWDsnMyM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_crop_free_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: e43yu1bGT3yP1B1BnA14L3lB0pZeU/8XCwA2WeivNSg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_done_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: wgp/0jWXDn4zFfjjUpWh67Ce/LO2AFMoP0RWSX25PnA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_edit_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: YAtIrnj6fbHYRvar5DpNQxh0fM+SawzYxGR46j45Grk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_launcher.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: riRg48GqnJGyljl+BKb9ukQBjkZwhWPj/cSQKYK/qgc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_launcher_foreground.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: vUGmZBRe39IYoGVrLmFaEy3NJTeX7A3hzAugmE8Yn+M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_launcher_round.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: AriXyPiF9UlOtbvEuqyTT360O/sfKRHZySguBcMDRkI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_link_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: MHlhjFo79eYefgbLbqAj4iXGfS3v5qOrmFnjV1blPEQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_lock_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: GnMElRPl58HsKfrnvg7MyL3AIjGDElJ2M8YEEV27gbQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_paynym_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: BCb60B+nQZeK972v9lB0ym4ClT3vaxI/mz0frk3aU3Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_receive_qr.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: NymgsT5xFKFCYdHyoj3sdJAyjGdZmzTfzGBjbgBfQ0A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6oDH+bClyU4sz9XDnc/sQ2x5EnWZAacxa3hwsrY0UUg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_samourai_deposit_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: igNiy/9nSsKGYAgHthTnefbzak4Chk2RAnTVzMXeDgw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_samourai_logo_trans2x.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 32KBtfYSd4obJWEfu6QvxMikGifVlZZdvaiBdER4mio=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_samourai_send_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1vz4mdVXsOJ8ZG3GAQxKTGHGk+DEhQD1HA06u1oFMnc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_send_final.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: IMAzfBCPkHv/zy2F1HQ5i3f7dwtQQmAi0IMHEPACgtI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_share_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: +n6R89enuf3bN5XlNi+p/46miYTAjlx1Jn92kelim9M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/ic_standard.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: eO9NG9oS3R5lKsSVCyoRl4SpCSxcFjWy2HChpGi1W3M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/notification_bg_low_normal.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: IfC1UoC+ELGHzv+O3vSlpwR2g+bp/PR95BCqODn0EJQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/notification_bg_low_pressed.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Qq7gsDiD6U315UM0ijl9EwLBuCIYlYcag7gYmfWpZHs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/notification_bg_normal.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: DGMox7JCBXCn7DizvrO6yaKdiVrBq3I5MVq6cmZBhZM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/notification_bg_normal_pressed.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: GLMo2AF+Z31arT29ZrrjVrXKyXjG8GcJOOpkjlHQ62Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-hdpi-v4/notify_panel_notification_icon_bg.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: hDDsAD4APz8roveNSP0VDiVAdmflMOguh6fUhBwP1nY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1uR40MP1ih9uDrQ54H1tnrTXhFdj6+kDBuZGB3r5gAA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-hdpi-v17/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZBrRnTRnqOXE2XFOt1gWCN4oQ/GempAqTpIjvgZh+4c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-hdpi-v17/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yzdN3X9rRNAoRg82KbEAk4fABXJxe/JAyF+agmUfq0E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-hdpi-v17/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1NKw27A58cY5UYOr6UWzlHCtmop7aApA+nkN9sZFu0M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-mdpi-v17/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: c0wfYb1Qe7T0wfsoYg0WPvFY4sGd+pTzROGNTi/Q7F4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-mdpi-v17/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: bcb3C2ArUk1vCXwzleP6u/mGoA66zMjHcarxKhhaWbg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-mdpi-v17/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: gFApeTAt7nNT9HX1WMSXrmaX93GBpR98yAtA1ywuDEw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xhdpi-v17/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: d3fAgt2QCz8OoxOUQjK+QB5ef6HwfaFcVD/8/aTK7ig=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xhdpi-v17/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XQGoD4K0xYdPINeBgwN/tVUExsM4RFitKbRTW9uVHKw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xhdpi-v17/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: d/DrqyQWQE6x1WI0LkMVQdiFaG3R5J1tyTvhqGwic8Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xxhdpi-v17/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Kho/hC0Fbm5+fgy54HWhPTo/D47cTEHED6C8NQYTL1U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xxhdpi-v17/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: O7fnnzwSUeISRjO5KvPGVC+/4zTIO43XauQUbai1r8A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xxhdpi-v17/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: AH2/X6LcRmpJQLCmpz2rSMtyH2TTWPcf81qq25Ywtew=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xxxhdpi-v17/abc_ic_menu_copy_mtrl_am_alpha.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: q+dDHj8dV8z1Aq7NHMar3DWy2NgCPEQLakw/ABKmt4c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xxxhdpi-v17/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Fg9jJyQLWew1NO7+DU6m29WF4B0TV9hw6RDFWUAW3JY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-ldrtl-xxxhdpi-v17/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: jD3lOJpP7fI7Hv3xx3N8p+tE84HCI2kVPfqXJhOkxEg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ab_share_pack_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: +U4hKRgMC6aSRDA3RAJFYDXc1rb/99BfbefiQZajrzU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_btn_check_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: BV1fh7G7tmdwlrx+t+rOV+QCFsuX8rK5JtJsEmP5q84=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_btn_check_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yvHkc99nAsKmqV1zjx1vK3MZZ2a1BOX/Mzs8jnR+BHs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_btn_radio_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: pUdDH+vxCMz6lYiribEHjjh7s1HrVNdyOUMyGH93C3Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_btn_radio_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yIJc1jflmgJQDYt1GFYvDJG+8u3Zcbo+WtD0FnlNYY4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_btn_switch_to_on_mtrl_00001.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Viy6GtG5q9UC2pwD9MELsr1ygCLFRvGAWTGfKtKTKA4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_btn_switch_to_on_mtrl_00012.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: tSIoo1Ug4teG6WLoUBP+f3yX/7Qmd/O9q8Ay+7cJlSo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_cab_background_top_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: +3HhHAkBM6l/6E+jt2omO0KckDLsRnhUsOMqMVel66U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_commit_search_api_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: UlSajQtsNfryeV799rTF/iyzS36LEDnMp6onabbKs9A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Z2keRGYoVlQbxZ9WQ5NC/X7p6YUQnVqIGaS3RryHGNo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZbS24iueooZbzG6yr8RgpkXMOfZC1urs6lppt5SBM5Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_menu_paste_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: SlyDmrDOjAsjpHCRv2ppOSxuEefgLzHgiJ8SwLGifMo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_menu_selectall_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: kysvGl0fcUdCVR304lt4rx1o2MOXKj2XrY0sJNwTd3s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_menu_share_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yHIIM6M44ECCN2tDBTD0EZ0/Iu4U5d1DTAbP4vC8y1M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_star_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: KWVhpd00YdfBh/Cw+NtKumJ1wJcLWx/XsEF8tbmcMr8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_star_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: WazzJLvijuzNl/41rWmZpK0Bo2JJvtBG4Gq/xTjVPlM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_star_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 38IQ1KAgHs7ma0jAGlZo6CuLZIUdY0107EE71lAW5kU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_star_half_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5E2V5XFyYDqpkv/ba7mjAvlF8AtjKl98bCm4cxYemqk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_star_half_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: wzwTi9NSYNd75e66+gjvv+JdnrstV9Ftoxyq9Yf7Blc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_ic_star_half_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: pHTsuFeMU5tRTByZYN6LDBd6hnNAhUJyRA4ONJlZFBM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_list_divider_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: N4aUcG+3JW3SJI4q+FTv1x7H6IhfYdouFqK9Mvzz0Kk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_list_focused_holo.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: hDZiQiD7okaugWo6qzed/X/ypIQoSrJMOvSYl3hwW7M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_list_longpressed_holo.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 28CvYfRAuz9TgrjqP6V4ZZ92x6au9iCmivxDqQny4OU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_list_pressed_holo_dark.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XUFhv5SCtdKiNGzT+ic57DID2ZW+usAuiacylDNou/w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_list_pressed_holo_light.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6Y8ZLwE6kiYBBIKrjhTH8hX7Fr2jzLDdrsPtCycRnnw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_list_selector_disabled_holo_dark.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: oVFx6tSxzZuAxYuTwO+0U7DPiJtxTMhZ7iybk39LN9A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_list_selector_disabled_holo_light.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: fEXkbkBfW0o9DGKiLmcBDDMnAi3RwfS7zOoSeaTRrXQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_menu_hardkey_panel_mtrl_mult.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: x5VOK/vQHlu8nXdN1NdD0/iiZhMSn6yAcbdBurMBirA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_popup_background_mtrl_mult.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XHxoL/tk9LUx3g+VScDaEcM3V25CZhhSK/0dNaRRpBQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_scrubber_control_off_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Wmyh0NL+pTgT2ls8kDdAgIf591P1jdLhKKSkj3aJdp8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_scrubber_control_to_pressed_mtrl_000.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: n4Vt0ApPKB0RmOZnmshhH8Z9MB8owHrql1BCRLoWy0Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_scrubber_control_to_pressed_mtrl_005.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: YVFFDs46uWZyE8OYe22P/6Jbr5/0PVO82clP2Op2FtA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_scrubber_primary_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Xj8T7oVPpBNUynN4NYuZ+OQfOxyZaMMTtjCwLehwTm4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_scrubber_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: mpyUDqEz9+CsjbbwbhPoUlCGM8IfjHHyl0gxZaBtkus=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: D6F9h1TW0WPMQz8IfK1sCDFzrIetcJfnaVCiXuxfPpA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_switch_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Ykd63HTU5oNuPA5LUzfDfXSMs/lAM/QsYpk47xjTi0E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_tab_indicator_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9i16ofkpcwKkMzKlmDR1XtvTo4ZwuMUjYUrhNmtflH8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_text_select_handle_left_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ENs+Wnc1caTtp9C/D0u55GuJKYwoOViFXFnCVYnucRM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_text_select_handle_left_mtrl_light.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: D9L1OUbrk7MVT0S9r8iJbqkxlaZM5fxkBJ6LcpPNaAE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_text_select_handle_middle_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: YXTxf7L/nYQwonpA31BwDTLjb28zadENQq37eXj+m7M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_text_select_handle_middle_mtrl_light.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: U1hzfLaA6hzda6QA0zMW+r+HL9RPag4Se/yL3RYys3Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_text_select_handle_right_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9mK4e+nTJ+Dobj9NupVTE4PtCxnT7GWFfYcjbTf9KjU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_text_select_handle_right_mtrl_light.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: fIRytyRBzCihrFOgi08MFPMQrzOBdbpsRv1jQqyM4v8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_textfield_activated_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: +lAWK9s1Aca1DPo2wU2rnJTkjVf1WGB+yYWBJNcEEvk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_textfield_default_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: n9N8gvh98ARkVUNE3d3qVeSA0JwztQWsEyUgNtTWJ24=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_textfield_search_activated_mtrl_alpha.9</font>
│ <font color="#4E9A06">+ .png</font>
│ <font color="#4E9A06">+SHA-256-Digest: S8j00T0qzMwTOPc/+QzZdpXZIQ4E3l2pJCFSQ8iVC/M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/abc_textfield_search_default_mtrl_alpha.9.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: uAD6x9Lwp1sX+tcAlwfqSRNJGeSJhOiYFanSTA+nBNg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/design_ic_visibility.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: G1Q7uL7FfOG+9m8DiAA04dFdy78Xd1SV1el9b520e0s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/design_ic_visibility_off.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: E9g1J4JaYlgGBfuP1Yynylve4tt2xROEyCWnBFJ1kv0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/fab_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: U9Qbtrr+xt2W10Zyd4zUZONmb8CADfGKef98gO9vFFo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/fab_bg_mini.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: J9OeRN0P4qG1GAHeVExgHfDM4HFU8LhjJNeqj/EIMWs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/fab_bg_normal.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jx+NRZcjutQLFwWieLnnLgEcfvW1X7b4G2IXUaNTBc4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_action_delete_sweep.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: RBvzkU4AaWBUAFgIqKt8vtHH680aqIuBlvJdnljrYag=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_action_fiber_new.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 2UnC8gTsbUPhqRkUvDkSiLyTtN3cbfxb7oWNAwTj0uY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_action_playlist_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: +vj7r0wnfNDdjhTKbSzFiEDkwOUa2it2bwsBbek8Gpo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_action_send.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: FACVuYA8ha5aXMAKqehEP+p0ev9V0h2iT1LFUk7Ue/4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_backspace_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: w5NpU8lef6DaMpWjZuvJWe0nAgRO/DLuFqJrUIurtRA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_bubbles.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: uRmawjzBhM5j67nm5Bu6n13ZuJEnZp21YswME5/fYOE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_bubbles_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7t6KgnnBMIPp8m2cS8TNgs+Vdnc1pw9e1qY4Ys5GiKI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_crop_free_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: uEo4HjdYgXEXSrfDwLBuNXIlNu2TXk5aQPaO5mJw/3k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_done_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ppX2sR1bL3C1TiJLImT2X8YCA92M6IygJD7v0mk23kQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_launcher.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6GB3Ab9wzUxQuKt9lUTF9Mp3evi1+e5ukt5RSpr7nhI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_launcher_foreground.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: zCdckwC989HKNtKD5cwKya11h3feGbTcRQ8dXNnv0Lw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_launcher_round.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: spn0Ur50+DVhKCtIWArPsOJLRH4XXRzbl97qxcLdqD8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_link_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Q3rpUHOs2Fonzw/oCLFvo+NqnnF40zlpr74vWj+0k+g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_lock_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Q4FHcJfMCpZiwqUUV/2Dyqx/0QGSHBxZyaE3qySsrL8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_paynym_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: KI/N2mG+UFamjGtnZIz+RjqbBI4QY4I98mtqLwLX2Ug=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_receive_qr.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: CEru6dqLNxYQ/pHMiMrrzKwEIOQ20ycMOhAyeiaNeTc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0bf022RGjCJxzlxLtCsIjA58Hi4hOj3VG3/qJGNa4Uw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_samourai_deposit_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 34PnyYR/MUPINo+ZZmetorWV7TT6WBTJR/CzdVPb0u8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_samourai_logo_trans2x.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: OuxkS/o3YilbB8nLjZ5r6bhhro6Q4uXDHtQR+Raqkf8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_samourai_send_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: BEiSc3H4LV73Ju4kSpPTCIn9Kf6ivzyz0f1embXdwxk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_send_final.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9WgkWMhWUNb4BKK2t6wb4BlaldXNPdHGSHHwrIVLPtg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_share_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: GxDVAToRM43EqDQiRCosh3hKqf9or7DdENLVYlpK5Ag=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/ic_standard.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: aHwb+Boj3sKbFyfhfVCpjNky3KhGFn9KXYFUzlEJvxg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/notification_bg_low_normal.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: L3+9oLpuU+mkfi/A4k4yxEfGE6WAjC1ihdxlHoOgetc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/notification_bg_low_pressed.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 4Xdh7SgO3ZPXFBvVBLcPnp4VqGUiiNnmMzv0zpZO+EQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/notification_bg_normal.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: qGdqF5OsgxD/sSmGIy32bfCS0pwkKu7cK3NVbAENONw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/notification_bg_normal_pressed.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: mcFNaFW4viltWAF9N1G43IScR7bR2Aq2FP+QdQgORhs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-mdpi-v4/notify_panel_notification_icon_bg.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: DXc+YsdWQiMTJihGx4flj2fg7ofkXhrplCAC6BbEy54=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/$avd_hide_password__0.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jg+CNtPxdZHHNZRfcPrQMqHmLWGCC0TCrGsAOqiVK5s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/$avd_hide_password__1.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3fXsToAuRyE37BZYeuQZRhkl9tcPy3hLowoX8Fan+E8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/$avd_hide_password__2.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 8Vmu2o+WgfBb6/mfqeRNGA2fQ/yvVTvvVHrbpEImp2U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/$avd_show_password__0.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: QaDFKSmldIpwiCSvM8ZUReyT4SXng0DgmZb7ujRNLFw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/$avd_show_password__1.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: HBMd4eRyt4l0uP4A+iOWa2YPlQuVVPv8lG5jW5QC8Yg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/$avd_show_password__2.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ScnJQzXghFRzYDHgUz4wc4kwAt43CRG+ThUijhiPMso=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/abc_action_bar_item_background_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: zMdk4b1AhJxt3ZupjfSZ9R0XTgupgnkzNZTACtO/gUQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/abc_btn_colored_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9+4Af0o3NA30uyDD91oIhLaBUYbuQUcDKTtUyo4ZxmY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/abc_edit_text_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: VFERN3oe8YUWKgkeW/BheZlkdvfLFYRM4jp7Yk2uBJI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/avd_hide_password.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wUtoXNdPlxszj4IjzGFh6UQwxTEy6asK+ZAv8AVqo50=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/avd_show_password.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: AmJ8S7DZgAAgu0DBwEHElsNhxiNrxuiRRcbBrNdJXIc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/design_bottom_navigation_item_background.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7ZCbm1Zt4EoGZz3UzuCkfoVLDqMMwJ+Ko8+hVJBEFX8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/design_password_eye.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wio1vLALUgyvWihxy4aPSXd0NFJ34bBPxxGHNibITSA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v21/notification_action_background.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: NdllFdAbfBfmOy6qa9631usyxLRjr/EaCp+ZVc2LfyQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-v23/abc_control_background_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0XtBAek0Rb//4/0tR4EvR7T7+WtAvRFsbi0/mLEeZq4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ab_share_pack_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: oEcINpq+CSDe0g2H1Yrr9pkuu2fv76JIqEIYle/FNT8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_btn_check_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Q8zx8KXp6e2abfM+Gz03jUnbyNxg2Dsc25heXkj1JJc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_btn_check_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: L6UkzaeNfr1mFkqJagQid7ela4ZY+zGPxwChFMsE97I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_btn_radio_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0ZCSJUqkEz+6i3eV+121YK1dzRbG95IBvsMbDx6bYIs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_btn_radio_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Aq0Opv9aVg6UdFLH1k9nmvogVrRPhuo7cHocsXXCzrA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_btn_switch_to_on_mtrl_00001.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: FBdXQTTF6TIcCxj+pxGghEjM9JlX9V4Qztr7EyN1EPc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_btn_switch_to_on_mtrl_00012.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: TS/kWoFp82gFLJISMKJoup9T6l/tvLCf81EHRzVR5Qw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_cab_background_top_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9lqH76L1PW/i2EjPyh9skK6l6fxn/0f1lJpt0qduvhs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_commit_search_api_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: uEoneAf487tTeOY1PZnRNEruEL2aBfR8MK/jgy2cp/A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: W6nClCr0OOkWQYZsMJgOPwsE57EvJAonBlslaTxVtdI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: nvWY4iUsgRuhsLAx5c8n34R4I7YlN0L4Bz7nC5CYEBk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_menu_paste_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7StURJcZUGnVVmO9kbXL+lxzK51NJk7yATlNjvWd624=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_menu_selectall_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7kiMY1kv+fI+DpXbYsU6M6VDZWPCNVJ46o9h11VQZx4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_menu_share_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: D+zEN+4LaBHg+z3+tBh6juL8mGzLMqsBPiPrnOs9biM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_star_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: scvIjfE7nOYFt9wlEZ1yf5+h4fKBIz0wSO/xuT2t4uw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_star_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6mb4iyfjNb/9+SOT628SD6tO4GGxpZslFW2UONQi7mQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_star_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0QhcZfJCFkxFlZiBNdW1/bCAhtXMptbAENd8hTDMsgQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_star_half_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: CxMytCrxUuBsv5pD1KRLFDWcNkrhxTBR4kuUhdIZj34=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_star_half_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yk8aH7dX8qQ7ITkU2nsTXbnwAiHod+z2Gr0iy0E2xP8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_ic_star_half_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: BV635dvPxULIyKc/mvzAFxYDSjwev5W5xfpb6KUfQZI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_list_divider_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: N4aUcG+3JW3SJI4q+FTv1x7H6IhfYdouFqK9Mvzz0Kk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_list_focused_holo.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Zx0n5aS0IREXS4iNVxGOBQdaVW1wO9VPkzUgLSpBZ5E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_list_longpressed_holo.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: cn14/sP5A6JxwEdqUOjAZNKLMveCmwFq4KB9pTuDsoE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_list_pressed_holo_dark.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Y21/JL5obpUV99aDDOk2uqClQWRoIg6U6OJXVHln4iw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_list_pressed_holo_light.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: B79c5f+JNyV6/RRgYsm/XKH0EVoWQ1KdgYRdAgLH3e8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_list_selector_disabled_holo_dark.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: /XGeSXqvCRwxZstRv0QEykvDtlRd+++/qgzzHweQt9E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_list_selector_disabled_holo_light.9.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: zBYtS4wS7jKeN8jWUUQvDvCp0cb4jvNS5U2o39mlDf4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_menu_hardkey_panel_mtrl_mult.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: AG8twlusw55za8cg4mplRd90J7bBA7Ldd8Hrhyw/MwY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_popup_background_mtrl_mult.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: H33Ys1ITU69HP0GFCIfpOFz2HDkMbjTk4r2ZGSHM/fg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_scrubber_control_off_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: d3oc9TggqkZyZ9H2Tl+SNlb5MEcDjqY3W8ziV7UXkw4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_scrubber_control_to_pressed_mtrl_000.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: QTODD0P5uqCw7TzIDXmLIAcdqfUf4S72sL0Jq8jV0zo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_scrubber_control_to_pressed_mtrl_005.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: KZU72AGd2Wt3ATKbmiA8/2NGBRlUm5zKml63T5sbCTA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_scrubber_primary_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: wPkwpyKhbfmGkjv0GQgdEJD5R2pyh8i2Vas2/8CAZMs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_scrubber_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ayNytBSrwc/P1xyY9RkBqExGxbcSBGquAZthEN4mUXU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: xjqU5xNs7u9DsK3otJ6OHvTRBg1YT2y5q1i31uqhYxI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_switch_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: RoYHYBFAlVshxgkYl7/GX2CdOG+mjVbBmSAYleA7P7w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_tab_indicator_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: uLJnCNcbTHpc9TEavN+nQf7jnJ9eE4PUnKDGd/zbA80=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_text_select_handle_left_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: HABkmOPnqY34jqtbxostKpFGWZmDK9249zAfzBpTqbE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_text_select_handle_left_mtrl_light.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: g6RieeL2XYUslFLIbjgybvnz3vb1vsLvFBbHKBWl+/o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_text_select_handle_middle_mtrl_dark.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: FMBg9lnSCw2GX0jfJF85dB1C+Jy4bNxbH9R4/MYe3Ro=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_text_select_handle_middle_mtrl_light.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: Pbutkm1UBYbWvRIw8ykxCHdMlec/ZgTwu/iMOhFTAiM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_text_select_handle_right_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: NbjRRtvUPXtIRI2h6ZHh6cz9mMuzxOc+Z6m9Pp5rgZo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_text_select_handle_right_mtrl_light.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: a0Wu+L9DdnwsHIPe4r2c65AXmU++9mE4kea8IV4qXuM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_textfield_activated_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: I0ObiJn0tj1orpOF6qSShqS5W5X3m4uNN947Dk/bx0c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_textfield_default_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: DKrqAGCzdyukM8Dp46VFLybzQhulAjyFUVcnC8Z1swk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_textfield_search_activated_mtrl_alpha.</font>
│ <font color="#4E9A06">+ 9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: WulZQkCtpeU1AOJSQhWz4rPJHm3ZWwXgrN0n2djFfnI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/abc_textfield_search_default_mtrl_alpha.9.</font>
│ <font color="#4E9A06">+ png</font>
│ <font color="#4E9A06">+SHA-256-Digest: d5omBqkxo5miydO9AfPFEMQS8pFkeKpofkMOYAOwpfM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/design_ic_visibility.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5UNk6BFe6hjmlTsGOwlESzOaA6nZS1v2i3EIbK22bD8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/design_ic_visibility_off.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: wn9EDRTTYa4Y4oNlmTIs8s6suWVzLgxW1NqEB5iib7A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/fab_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: kA/OtpyXIa1bDMRbmHD+7n4P6bHXMa7O/ns1r/DQgMI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/fab_bg_mini.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: cQknTRx+F94hZ783WtXeK6QXHQNmINMguY/j8N8KIgY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/fab_bg_normal.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: wT8JvKTsoi2jMZkGhK+UkzWMSFawPaZKN7wxDqNbTy4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_action_delete_sweep.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: VgbZBiyl7Iy8CVr9cyQiIX/tpR5Ma3aPNmMoTc03LYI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_action_fiber_new.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3FXWlJgVg6TRSr2vKfQ/MxQ2TmjyOiqN76GhTkrXQOs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_action_playlist_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: AI+Rl4Sc/va1MzqlNJX5ARpheE5NdB497b7lBNk19/w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_action_refresh.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XKJIkc4+XOVZIJm99XPrt2BGNF5MHrlm5S/1mm2B+6Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_action_send.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3+YvAzP8LjoPPqLWR3iH8PY+tX10BpQyEzeqIkGt/Bc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_backspace_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: okZlTozRoOizWpB2fN26SMIFyUKEiqFJk9yhOmi4RZk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_bubbles.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: deNWh0/0IoWB0Wl5Fxy8F2jQ77ri7AZy3fVxRwg5MAI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_bubbles_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yC01jLSE3U51dixAwVTee7HEaJ7X+e8gTD60jSCeWck=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_crop_free_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: HHPLJB+UaT4wo3ajINWufO564SXs+UrZ3S0NKQ8McT0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_done_white.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: W4qKlI0OwPIefy4kKaNj8qyHigyeBkhLfgDsjSHrzzw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_done_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: DnfEC0AcWo0682YnyHzeqmYS614I2tckhe/EEj+r6U0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_launcher.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ypp5tQj7vj2oV82yywv1sUWFgHKKIhIQnv8AL3F5Wcw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_launcher_foreground.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: a58oz3jmoNkOEIMF/RdMWPDnKI57075PJt4V8U4sSCE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_launcher_round.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6PBg30H/8wV3IQ5cX3K1TSz3AaCU7UYtUhiBhGDCEwM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_link_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: En5NOQldA3RyXwwktpdRMCg1fHHNVT9YzY0B4LIlnNQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_lock_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: K4bW9iEWSJydPIu8hQYhh0hnAL7Qc4P9x2nc0CQ29EY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_paynym_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yWhp8zFD55y+Qa8B5L7NZ2BA0qoTfMz2IVn1J6ebgYA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_query_builder_white.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: heB9Cmk6NwY9XcG26VnLLuZUP1aUQIFiNg5sGBT8f6w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_receive_qr.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: gVHGrOUIVJH6+idZD5dLsdSWDlYpyuz3ZO3WkyJj2yo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: bIjGzFrDwKYZBZZyutbZp6WcvoXdt4P474BlGbK7q58=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_samourai_deposit_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: U7K7Epn6aZs2U2xwRHsEKJTj+YUhaVYxgQL8t3evP1c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_samourai_logo_trans2x.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: /g1HmB6hJfMt+O0yHQ4/9a/Ag43YQ4C2YqZHHyy8wDo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_samourai_send_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: RtPdznFeBItBaPowww1ieUvvatpNx0syyNS+Vn/T2pE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_send_final.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: iVr4eN2SeknKbWCU2rgOi3l2jSH6tNmoJoxvCMyd5ZI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_share_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0Tv82QeMTGwZ88a5Gsyu261NNeE7bYQkxXZa+4rHsbU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/ic_standard.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: gIY1wXaknPJgJuarAKcAWHliGpoUYxBQXcLpSHbzbHY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/notification_bg_low_normal.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: PgmvohxFNywDVZjAF8j7QFptZ45suE3IV1gcs7QOSC0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/notification_bg_low_pressed.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: IDQyIvn3ndVlw6IkhJTUUucIIKwcQ3Fzw4ut1F+WKv0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/notification_bg_normal.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: VZv3g9dlwCM46XlSvcnGaJx/+ZCQuMmBM2kRjaiwgPA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/notification_bg_normal_pressed.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0nr0NRAcpMvsDIQL0waHkYzTnrg6qxSHQghVYjpFmYs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xhdpi-v4/notify_panel_notification_icon_bg.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: tE7to016Upwv5VcZ6wmPopcHyqkdGN4Gp6d11ua8+XM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ab_share_pack_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: +BQSxRMQRqg/XZ3h0Q4rSzH24mV8TAh0OCXNQPYF/dM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_btn_check_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: GGIMFRMwKJu6GWwcweJpn5gGGjW+NVGHYpaoxNWSuhc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_btn_check_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: caK6Y6XU6R98FDJPocPrkpC3PLezx4KAGNBa2xz6q0U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_btn_radio_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Du2Z0KXjakaLVXYF5szqSVwCnzVphEpF9LXY2t131Kc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_btn_radio_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XgeZoNC11D7Vrjo3iqoIR6gQzu/1jbmg94Nuv07xcUY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_btn_switch_to_on_mtrl_00001.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: D422BdY78dbTX9ZH1ZKsTnDJpxL/XRwhFMjVioi4Ioo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_btn_switch_to_on_mtrl_00012.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: H5U4dFz9MgnMCe1FHBmDAqrDocXaQehzlDd4FLG8xe4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_cab_background_top_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1o0Dln+yIvfjV3Ki4GN/c7TdDWy7nuPytEMtL5DCV9s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_commit_search_api_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9fNJwelJ8OZjdPg7Zn/A0PR3N5YU82kSreIqKZ8hlNU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: oeGqB3STG3MVFCP96FrV7gFeU8qd3qhmMm2hJmoSsoU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1oy9V5n6PhQw/MYSvRsDbhyMcYsci9DWtamfJZq9aeg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_menu_paste_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1En5E1XqyS3K6r3KYfmp+HTsYqaIO7B1PKvHI1Rueo8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_menu_selectall_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: jG4qPDOJDXK+NFMQ5uUxd4wlucmxQ3YsbCve6I9fsNA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_menu_share_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: npoZM6+MK0Hj5z7Cc/27ZeWVQsOXF08qYUhpAwcr7Dg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_star_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: /ABPnNdQOpxLQZsXjCuj4kqhkaFFiAOYZb4jVQe929o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_star_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ywCg6DBq94qW1rTpRJsvBi8rD2Ea3ty72+pGCP8FZfc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_star_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: p5sGDQ7bZjMb743ZpsdblQbRX9gjwqa4V577Ykm4Uwk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_star_half_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: XSYy3/spelJXwJKhqb00BpK8HO9SdNyiy8Shyc0V+c4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_star_half_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: tXbjLUHHcUeSXu+4ArFyyNNnIGzRpVTk4q9Fd327bMs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_ic_star_half_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: YTgOuustar+NvU7rkbuCJLOyDlmpzrkT5q+aSQWpjQA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_list_divider_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: SZAwc6sjq/wRpV4TM+spBcdD4bOCAGwnwVQ0/XbgIHw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_list_focused_holo.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: jGhG9BBe8cAhB+hCFC6c5gsIgZKW6VELLQwSz0VgxeE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_list_longpressed_holo.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: RMKXZrLYi3inE5Oz46dxyn7vX1UmMMYHTzPWKRJB0Lk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_list_pressed_holo_dark.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: p3qqIH/VefZDgzI7k/BI7pQ040XKi7ZBdDp3kBtDg8I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_list_pressed_holo_light.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: k7dlcYRHPViBZpuA49Q/1k5ELR7XG+TO01GDgLbOxp0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_list_selector_disabled_holo_dark.9.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: lK4ic6M1ZywcZ5iOevWV1C6AUm7bf1ZU7hMNzgb9QNc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_list_selector_disabled_holo_light.9.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: TxhlR8P+V5bvSdqW1gpKmks0c1fq/zeU845fKq3j5AA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_menu_hardkey_panel_mtrl_mult.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: qCUvUmOMgN8RnbAxYmGYpKjUsy7mGOlsOja5uUbiaJQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_popup_background_mtrl_mult.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 4aK4ZNARSoRxZi+OMP/Lsuuf/UFNNiOWEt74x3kqRQo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_scrubber_control_off_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: E20I+rD+QW/H4OypxJjmPGg1eyyqQkH0RLvD8m+adMk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_scrubber_control_to_pressed_mtrl_000.</font>
│ <font color="#4E9A06">+ png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Y/rQoZy55BZYYEnUC2IWGwzEwlE9g5MdOFLi9acubRM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_scrubber_control_to_pressed_mtrl_005.</font>
│ <font color="#4E9A06">+ png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Ty+MKnsELlWqj0P0zoE0syF+6c2kMsX/jUwz0J2G32g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_scrubber_primary_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: dlby8ZqEzvwr+fr8AHYCFnddMz/AsI64X/HgAGtG/CA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_scrubber_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: xWq5N1sUm6HF7iaPIrPPZQe7R5hvYoORUA+6OBR9qyg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: vYk3g8jSvrsWesBaJ82upd/WUf6NZLyzDBTnuSU4DHk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_switch_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: u0sJKuacQp6dT3/5fGC6EMLkQ6Kwyhmp9sd4VL8y4pM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_tab_indicator_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: NjPsmdZqrkMy+aay29NIBRNDMAGo7sDnltK8tp11tz8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_text_select_handle_left_mtrl_dark.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: wbI/G58W/MGpHZKeBtlUrjIs01JrkMVnGVlqKWN7v5g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_text_select_handle_left_mtrl_light.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: r7yu3mapfdybVMTZiRwJQVy2lE15xMGuhEDNpVOWOVc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_text_select_handle_middle_mtrl_dark.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: U/r+ClYvDtt1m9vuAgxaN5UgFZk0fvWz5L2Dn4qiT1k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_text_select_handle_middle_mtrl_light.</font>
│ <font color="#4E9A06">+ png</font>
│ <font color="#4E9A06">+SHA-256-Digest: JPXbIm8c1W5ed1+Cw39l89HuyQkbJrdIYWKcrwAZw70=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_text_select_handle_right_mtrl_dark.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: yBqgf/xs/JjR10bLY+UkFhFMLGzYOzgVEE34TBzkrc0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_text_select_handle_right_mtrl_light.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: PP0FVIRIlrUAwzUTseie1iAo0MgN9z08WTVHn0lwSjw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_textfield_activated_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: aCxGbT5POeMfEUq8FjLYXnNFV705gU47p9fGHq4tBps=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_textfield_default_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: oNY+x27CHUD+lqS2+09KrFthprY6Y0ctqwVeDZ6YkLE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_textfield_search_activated_mtrl_alpha</font>
│ <font color="#4E9A06">+ .9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: yNE+VoejTVuFAY/3qfDyKHCil7Jh/xQLPtBBzn5/S4E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/abc_textfield_search_default_mtrl_alpha.9</font>
│ <font color="#4E9A06">+ .png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 8jJxTMvsypetxjsIEdYmKQV8d9y9CwYsguJnVMt0SDE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/design_ic_visibility.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: t+Ko1OyH7/3LhdM5J6yPi+zXUBlFCVVjZXJ0EXudIzg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/design_ic_visibility_off.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ssWvkusjHtpWuYn0emeI8NAoIu6nFGQWnfEkeyhik70=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/fab_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: fg+yBfenNaJ53jTA4ErvfUxgsRbSLL/GQu+aE9IIRDo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/fab_bg_mini.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5GCC2Vq1s7V3GyIHMrfYFHjUwj2bF1l7FdMzDcZcjiY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/fab_bg_normal.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: VR8ECjqaeZEpPRUkM0OSelOr2ydAjJVQIB6y8OTIqyo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_action_delete_sweep.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: iesspWcx42Q0i6emhr4fLGBBGnamkNs8NnGAZdmXwXI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_action_fiber_new.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: sMwyrHYAK0Qrh5RqE5GUVhVCracibQVSeljOlZEAi+M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_action_playlist_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3tb3EZpL2yfPyAdaDnUr8GC3WV8d6ZgjPOQ1cylmlak=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_action_send.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: MbKQTQKiDP6hWAZxlq+IWJTwCTO8/dGP2+X8x283Iog=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_backspace_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: IqVaquWmcBktClOjrN+DTHlBVoW9tXF/ff/ITIeOV7g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_bubbles.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: x/U6MN58Qr4sIOuPk2tURYPklfNzcC8920paK8wInOw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_bubbles_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: abhyIFkR7v8u6f8m3VBrxTdCb1EloOx/x8UKkKayP+c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_crop_free_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 4nDShyGSZYPZeoCfnStULTTMpDqOQTtDfOefJVYU82g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_done_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: W4qKlI0OwPIefy4kKaNj8qyHigyeBkhLfgDsjSHrzzw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_launcher.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: okvhp6deo9slfQrz9ZGTVrJghs4O9oUFb25x2s3Kecg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_launcher_foreground.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: BQjonSKNWbDS5z9H6cuFl4T4IDCdf9aXqF2N32rqSlY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_launcher_round.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: LB19yBk5fGIv/dLJvjDCmhoaR0gRe4Wq60Ng7+M55Ks=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_link_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 94y++kjXoPHprV33UBGDRMK8lB6SkzrA1nUPcIML3a4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_lock_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: pTjyiib3r3Z28V2xDcpAcSnIzMlBW5mHyeDe7+2V6CY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_paynym_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: kVmmmAgR16RaOq/c+q9+RgEdypI5R+rnhWqChosRnIw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_receive_qr.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: px8PDlyfDJYxI5yk7iZ3gjc5L41B6xqKvKgM3UjcpQw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: QFs24kAnc7X6Wc1wnh8S/OD+ISxSY+ml+WWsetQTEe4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_samourai_deposit_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6YW0jL69/YCODqodQ8tESRMRGcUw5QZE8T0/Iok9sx0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_samourai_logo_trans2x.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: xb2PLoSn51mHAfM9/VR9aj/XOz7ODMn5TyLu7fUHubk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_samourai_send_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9U5Kvv3AqG1tYd4YungwGXK0wrVHVrqZ8bAWCFWF+x4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_send_final.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: w2RxlCcKV4qCeVASS2xrDDVNwUc8zeGTYna73MHuAnc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_share_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: phwbqBEGUvJNVC9jhf3yw1qrPHP+/8M8G3VZ70M5lok=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxhdpi-v4/ic_standard.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: G7k0zIPnPvmy/msj4C+9Ua7uGvvbn0nPKV7jLKVLBfs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_btn_check_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: sKoBDnqIXkt6ZpwWx7oQ/NhioS3/PxQsc1R3hEKmP94=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_btn_check_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: UqA1jlRDk3PKOfmc2Dzzp75zwlfwf66D7dg8m0iRiV0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_btn_radio_to_on_mtrl_000.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: YALrVng7lWtfkebd/682zIZ0AqAaIl5ie0wlyNIaTiM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_btn_radio_to_on_mtrl_015.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: UzQLCw9SmybbavYyoBEnCCM78xJEjFuJoTV7LNcLP0I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_btn_switch_to_on_mtrl_00001.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: w2e3OjOpM0KeHVfTP8+/JD8CdOfNuiIaC5g+4VtbrKk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_btn_switch_to_on_mtrl_00012.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: tK9z5SJmvlcMLBY9mH5kNIBm2zEbQeejggAFKcATbGs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: UJJkcEclxdelFh4ogJkL6uzBGb5eGmZ9VDoIrM5dbmc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: VyP43ekU36Uo9dKtD5cCuOyPvFkW0Lhx3SofuQ3lARY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_menu_paste_mtrl_am_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9KOvhszm6mDZwIxQZpNGHcYOn7ItfAHIA4bwCyNphlk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_menu_selectall_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: f1HA8/c32j+4Lu/H7Xwzo40PeA3NvkQl/cBJhBnmxL0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_menu_share_mtrl_alpha.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: cCU7gub//vP4QmuO5xKblnISv0F4jqofTG6ImK9qFzo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_star_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: V2UiklPuSrO10NH/Z4B8LTd06zwWlRImybQF5jvAnFQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_star_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: NXAPu7MkmXiv6CHadu9Z28LMQcsS2k/j+eF3RtTs1DA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_star_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: jhAzmfAOiNfledv+iDiH/QlrEdfHTX7aTqI3TnDWChQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_star_half_black_16dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: //dyXiBzwzDTj2MMH8lBVqdzByEb+mbAMqv82ooF+WE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_star_half_black_36dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: /K4fdBwYdJbjG+9Qa/6oTynzEpRSSqUqr8MXYpVspaU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_ic_star_half_black_48dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: vdbrb8Se695w2l5Q/umRyoVrIC8dShRB5cigc8HWaRk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_scrubber_control_to_pressed_mtrl_000</font>
│ <font color="#4E9A06">+ .png</font>
│ <font color="#4E9A06">+SHA-256-Digest: HjsC4k+kMbGr4Kl61nI/rUPfef2oF2wQYLb70xF4YZ8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_scrubber_control_to_pressed_mtrl_005</font>
│ <font color="#4E9A06">+ .png</font>
│ <font color="#4E9A06">+SHA-256-Digest: aDaR157xHoY/5OyE3cYxaW5ZhLVYT8RUnWWG26yiIMc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: JVLNG83ZiC1sJYgz+3C8CBoxoqCT75wlb5JDE3Cm5d4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_switch_track_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: EAzGrjhw3XaaJS5EYIqBlWUi6GdnT4VGGbp8aNMUytc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_tab_indicator_mtrl_alpha.9.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5+NsPLztyXvCiv+R7XLEMQsWwzFxOhaYppLGbUb2Mic=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_text_select_handle_left_mtrl_dark.pn</font>
│ <font color="#4E9A06">+ g</font>
│ <font color="#4E9A06">+SHA-256-Digest: t7B1+xt6RKBCbccZ7VkZRB8x5+GvnTRBtwJjuUGWRo8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_text_select_handle_left_mtrl_light.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: Vbwndy9tNb6TNPuAw3GzJ9sl+qmmCYw8FASekmVKwb8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_text_select_handle_right_mtrl_dark.p</font>
│ <font color="#4E9A06">+ ng</font>
│ <font color="#4E9A06">+SHA-256-Digest: P0OWrRhILUg6BzspAE3Kx+cKYwqfvVPc+F6FxCveqqM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/abc_text_select_handle_right_mtrl_light.</font>
│ <font color="#4E9A06">+ png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 2DVD8MgrYs9JnyYYrZlDH571DaYLQVmA7I4OULkOOJM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/design_ic_visibility.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: X8MrNJc8Ndyz6/265oI9kI7Aj4zVid3dwFQSYiA8LAw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/design_ic_visibility_off.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1C5/18yqkl3LO5xCJkpP8JxX0fqJjC7PMzuuUuEqOHs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/fab_bg_mini.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: HgeP5mUT0FSUr4MoS2PVZcoOmupJcggty4pXxDiD0ks=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/fab_bg_normal.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: LAgwNoRa3c8mcUyOClWYuGVtsU7vYsDG83FMFQhK/ME=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_action_delete_sweep.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: EJYBAy/e3sQiLxkwKzZEOTY2gjIwSImdTckq1Y62CpA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_action_fiber_new.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: dcXqJFIG1GQC+9h4kE0145ch/Aaor5v3HxwfeVXaJgA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_action_playlist_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: SpxvjRUhzehErSzfQ1H1vel3cBbJ7ZV0t3MqWy7OopA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_action_send.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: a2mSxefYTKRBkVVq7X+WqMya6RHkaOcNzgQ9onAn4EQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_backspace_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: HL0zle0b4YiE2Kh9+EY33z+R/K1fHrbWoVT6aOsJb3c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_bubbles.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 4flg7qAFp0LnxdqZt1Qpwid7MH3W4nl/KlcHeGTyd3o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_bubbles_add.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 27iW8Wk4jyVfhnu9/VIlB3MQoINgEuwK5cDw11FPGis=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_crop_free_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: J87Y09sn440GQaTLQhjGgBzqCp5uMRTi0T9eRpPa0Gw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_done_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: nAx4WfOrv7a0NVWkdzWdNMhjEyeoSeO0QgGwfQnT+n8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_launcher.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: DDO1pIKTYrm3+pzxkMGWJUiK31PZ8CMBIcVl+mNsDls=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_launcher_foreground.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: OC97ONRDKbKVtNim7ZRF8LFxUZen750vpGzsb4PHIcI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_launcher_round.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: fev+tqeTduHBx9cAHjW7+u0DCe5kfnLCKGVI3PWImug=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_link_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: U6hJfyR5mCLCmj0NCEgoC4u7oUGefxzzjt7NP6zNNzE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_lock_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: Oy6/6U9WH4DNQYGxbDyeSOD2/2lvh2YpjtVotVCFcKs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_paynym_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: wf797bUkP9SUmuXaUoIJvYseQiAdyVj88nenBtAH4W4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_receive_qr.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: E0/VE67b0PitIu8en3hNnUOoxS9SReGZKiLpF/1BJZM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_samourai_and_tor_notif_icon.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: KNioGUDAJeX6V4j4576+5EbVTYuvz1/YJl94tchU43Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_samourai_deposit_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: PwHCNvfeeSQ8+iFc+3AVEo/qrn26ePkM+RFK5m5Th6M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_samourai_logo_trans2x.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: ukk/iyg2pVtwL2m3Fj8ooAtVOSF0ZZGD2hhRQ2lGUo4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_samourai_send_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1QOBUQ3ct3E+juvBI3pZNUeqYFxxdu2jRep8PIaOWMg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_send_final.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: JxiY1btHwjn5jYOBTB1fpLYypmaATnfYB9riHaoGpRw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_share_white_24dp.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: BSP0vrW15sktXkijfBZ6FE2Xp3X+tgCuLWjpE+id9XY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable-xxxhdpi-v4/ic_standard.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: QWAOsE/GTBnz31mqVRY/4OV3b7DFhqykS8jvI8g+giw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_btn_borderless_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: rG21oW4YGUi91iMwOaO9GaYiEcz1DUYDdgfiWE2Odmc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_btn_check_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: b4caChaNk2l4U1G2h1OXu4wnTQP9wJYwF0OzHWUQgwA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_btn_default_mtrl_shape.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: oR/dQMRB9YpC2KMq7O9lOEAFzVGAnC0NEibYw9q7l4E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_btn_radio_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: monPbATjX65gVdX8TBLJtn84WtjJ48nmWuPoO9BozVc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_cab_background_internal_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: eZewiJYmo9U+B9Vs88R5WrQt9njD1iZcGGDAav/vAt8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_cab_background_top_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: HW14lQHwLJG8g5rkOXeJ+oiyVw1qMlCsSM49e2Zptes=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_dialog_material_background.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: fcRqTb7KKhuWsiQ2iBZTchArAo7zbclMmUqPhHYiHUc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ic_ab_back_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: UcMDmNCsUhFzomDAnbSPqG70VkuSPxrIzouPB9RpHhE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ic_arrow_drop_right_black_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: g7J7l4rnKNhRKYvigmyJnbgfru3mbv5w6Fh1I/qR2v8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ic_clear_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: mY7uFSLZ34ZTNSEivjKwAFOAAD4z6+lJ/PhYMXZ9neQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ic_go_search_api_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: pNr8WXzeyXPQD8QsSGRYP7DjmtbNfN9YmEYhMasiRZ0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ic_menu_overflow_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9F7dwIyFLx4enbwlbdgvHuq11Z07b/yeNG+Amuzwo1g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ic_search_api_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7h0hR7A+80ZVvVO2dCQuZdOF/441ceamuTL2wriwDjc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ic_voice_search_api_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: GwaqN8vFJzHIOoo9WaAJhGmLd/obIkkNDY8MPTwZecc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_item_background_holo_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: TcF85YibhQRp5061RI1WcEtahcpKYWetmk/U9ocKhx4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_item_background_holo_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: VN/olLPpjXR1RIfQ2Wj7WHnnE7/uUigDh92rnaOoXTU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_list_selector_background_transition_holo_dark.x</font>
│ <font color="#4E9A06">+ ml</font>
│ <font color="#4E9A06">+SHA-256-Digest: bz2kstePChPS8CODX5kQ6IQvER6ek1vqWFzu+QGdei0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_list_selector_background_transition_holo_light.</font>
│ <font color="#4E9A06">+ xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Ie+Z5iCE0g0pmcx7HpyHP03dSojjiC4ktDyQnWYGdkc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_list_selector_holo_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: PiLxj73Dd17jkK4F8FEcuU9EWfYvUdAd35kVN+p3E+k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_list_selector_holo_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: glJndKHvrTTVh1AgMKuXs0D3eVOCsiM44jvt6r1wSjk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ratingbar_indicator_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3nveUVNEMv+Iv3qT3d5dAHBiJ4Wg6CfxW4DvaJL5jwg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ratingbar_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 2Ml+7EbzTAdox693zuCtCvMLHZgu09ZLsuPURP1yRpc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_ratingbar_small_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: HGenJybTg9tQ+jDOk0tqf0ZsTKWF6HFFex5VXxNMmcI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_seekbar_thumb_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: JSOz/HFkV0P3IPs1qVQ2ynwOsLeSiOb+shYD6UgZ8aY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_seekbar_tick_mark_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jy4qrRuGw1DPCzzYru+BG9CUmdBPz3tjfl5rnPUeMzg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_seekbar_track_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: DQMhzJHB9SShxT9ykHA8tWfYbbdcI3aqFd5ldxChdrU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_spinner_textfield_background_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: NO+6ocgFwFhFJYGd47RR3JlqKKPlxk0iRLF82W8EGPg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_switch_thumb_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: rvdwqXcOrfefXIB4sgsGUWICAyepZAfPiVdM8RIalPE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_tab_indicator_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wCJ6+6r7IiGqtfSDU0l73HoSAj8XVJ3b3IYPxZA8rUw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_text_cursor_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ARUIuq4F68311+AToGWWYY1H7iMWb/+C01LItHbS1M4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_textfield_search_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9ojP723HcxwkAEM+MalQ8o+ZMljOcAoY3fBmjNWS1jQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/abc_vector_test.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: CuU+jKXpUUvWtnS4eVg0zIiJrUtkv8K9DH3HEjMtqhE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/alert_round.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: oRHo2/Xm3bAhdyFeCfUVsjc/H7qtGa/M5Bd22To35uI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/animated_check_vd.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: QezkZMWLO+KilsD7MISfFvrVNVIJ2vGbV09+ubwREdI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/border_button2_shape.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: TN2jqznQv5u3bmL6p8wM2jFCrZQMBgUsS1BQ6TCVXR8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/border_button_rounded_shape.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: txfnT3y2Oa9FAaLSKebE6L1Yg+uD1mRTosROZ+P50zM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/border_button_rounded_transparent_shape.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Wna7FseELtXO2p4Xo5oh+PiMVU8agnsHarkjxTFelQk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/border_button_shape.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7zVdmJfABPa3qGZ4UMnOj6ikQfUdlpcsX6d4BF5cB4U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/border_round_button_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: bh+Qp9ZWeIpt9asrjn86KGgyBzvM02T+eMLWH93lzzw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/button_blue.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6Vnh8q2Sfm0RXUU9zxxQ09q2jKa3G8R8Uj58NYLDJ38=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/button_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: rC1Y1PAuJHp/9b+bIjSK4AfXI7GGRmo9h9n0V9ZMW/k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/button_green.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZjU+6ZRUQLdWCvlBwEomGoJroiD+TBZ6z2Wp4b46QHI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/circle_dot_white.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: kUSBAyeRM16dnxuT+k6sG/+w9CQ4Xh2SHRJDZoxUnRM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/circle_shape.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ntkgBI4bjgem8qSeggAoYShRomXHNf5G+NMSWRO0y2Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/cycle_progress.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: rVtv1mbDB6vX6eBb4WmOyNGSX9/TZzacpVrRCN0Z+g8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/cycle_selector_btn_normal.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZyS5EFhXldMUZWs9FBNOhVAVkin8GFzfxastvGKN73U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/cycle_selector_btn_pressed.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: dj986UQtcZz2lUvWKmpDelJmLPiD7mNfyO02wm8jkIc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/cycle_selector_button_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: snLXGycS/+BTsnISowLJmMhbqISdqvO1+3HSkNiljk4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/design_fab_background.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: z4pq/ez4HTlzV/IQoMhCo4RedXjDE2Bbmongq8fiSug=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/design_snackbar_background.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: YwEbHbgJYk5wCDtJ17Y2/lYsDRV6Yb/vPP9ac5ySMXA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/disabled_grey_button.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: MV7ioy6hLBXpIsmRjAIvPLZ6f+GJVdP7jUzbrOAOwPM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/divider.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: X2Zg0K/JHH5+WJUfTSmgaiCSFHVXJCYoqOPNIe8eAMQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/divider_grey.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: kJI7ZxcIcQcIFLmf8MuI8ddxA5DBmqezUPVNhzFlVKA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/dojobox.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: zXCC8RrKuYIyf+LAKXUW0yfI2wz1MO9YjDyFS+6RqNQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/fab_label_background.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: dIV+TWc5+wMG7wUp5F1hhC13jSSZ0/kwJNeDMl+YU+o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_action_account_circle.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: JI6dYXq6e2X7G6lumIbXkT4rqaLs1FKXTETDJhSWPQU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_add_bubble.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: VatAZHtbVncfPM59N8fmISoALXzu/c+scYYS5MjwsD0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_add_bubble_green.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: iDNk+B4kNiYtIR+Lov2EG+VhAxcuJvbICk/pBtSFxV8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_add_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: g1+mremIS5bT/5qn33dnh/h4uBUcXHsIHJNL2oiveP0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_check_circle_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: TbOoBe2U/AHto7e+fpipGgx/TgGqI4nap3qGcU1NJuw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_check_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: oipSijdIhCAxpIlNeOeDEh5JFOBvutDbm1QF+RRWAsQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_check_white_82dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ckeAkCYuSZeTnjwSIch5QfFa9CX9/ywEQxvyNc8oUdo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_chevron_right_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: XbTVFrZeWtKKhY+uEYGD/TVDHlJ01ydxdt1zmRJGD/Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_circle_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: B31k9O5qqjilRrz5HbbFgMuCybsV9Uq6+j3CUDVVz7A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_close_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: yr/aa7gB+GqdJX3DYZ4OMy+m8olSp3ewjEsoRrT24lc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_code_scanner_auto_focus_off.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: mBeMNNwUVty4CGf+RXjOtZUaVu8pB7fIEE/Njc7Ttcg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_code_scanner_auto_focus_on.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: YoshMgq4zUaXwPJij9pr+SAsADdYOS++bcxtuK0A+2s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_code_scanner_flash_off.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: mbEIYaNxagG/mzjtbvDf6jQeVPzMIFJ/Lvn5YuKS+dY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_code_scanner_flash_on.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: /7LUnI/9JzdfrkLLe07qiTJDvGJgkI6KCbb69kAswkg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_dialpad_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: QjhLN5AqzyeUqX5yq8scaXZ6jjReJLqMHjbILisaeos=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_explore_black_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: lVz63mfCXYRiEF+HExXPKEiEL0FAHBdo+lVZnR/ETxA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_flash_black.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZdJmOeeTx7erEchey0CHk2TC/6u8MAqv0bVRSvcPHOU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_group.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Du+hxf5YeyF2DNFXnUzskUzRsHxKBAphjujKzJ6WXno=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_insert_chart_black_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: N9+R4bW6emZ1ha7pu0acrjehg0o90uy7dH/M2i3nZ/w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_loyalty_whie_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: zcvVRzzeH3Whj4GXP3GlqIEodgr8lDs23Pc9fv1cnc0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_more_vert_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: HatmwKqIjN3L1W/zy+Sr6MJRxUij2p/MpBZh+JU8cwM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_navigate_before_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 10TJP0F6zy+gar8zUnX7CImrWxC/EEdSD/E0RG4zLWM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_navigate_next_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: meNP3C2H8UCJ2dZuWjV1ukdX9vSLg0/ztTs4GPUqJ/0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_network_check_black_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3cASeMqRe2beITpxKGtWM5TEgLGNWTB8NPBMPCfqs3I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_note_black_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: /8SU+KxPzefkwFpg+W3CGevbttxAy+GCTmQwXvdWhdI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_person_add_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: L4w/TuV2aIaImXW4iWS8zVj/Lm43QHUDlTeyNTuXOGw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_pool.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: vlySgLYoR+nR9Omy0xgIASosSJZCkeRDyff8jDNbEdo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_samourai_logo_toolbar.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: RfOpb76DV7jhYIfWgV4AQH8el2VJyX+TJXNsDvrDPYI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_search_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: vOhKeu4hASQYU8JDiI1MtrywlnDGSOc/nkxo+xdYEoM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_security_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: EcFVQrvOZARbjXdzTNZPzGqLUwlQQtna/VqgDuhGpi8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_settings_applications_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: QehR7tW+qz8t1s1CA1SrKLheGGadAQ6qDubsiYNb/4A=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_signal_cellular_connected_no_internet.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: fw+eXFWIQVL7lbngfUFF4xp/8KIZg4IXM3U6N8ObBz0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_stars_black_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: sd3zP3rF+XVPSn93RFsAhDFSXLGl8TlArWfqvxxxDyE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_supercharge.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: cTij0oTpqJ1amKCj+lWKlV3lwclIhzlc3qjeGqIjGU8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_timer_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: TUMTWBrIKSRZk5dCSMBLYOEESDulb4KlqAwHZu8I9g8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_verified_user_white_24dp.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: IpQid1wbtvhWKUvV/S9W/nHXjo8KHZBoaPBOFzevtHQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ic_whirlpool.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: EXZQrSal9N7Il7QEFbEJZ/icsA5DdoseyIt3+WE7BaY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/incoming_tx_green.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: umNvmNMMwCl4tDaGUrc7Mf1bs10J2fikw1SrK6JOmrE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/keypad_rectangle_shape.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 01CKxY69zUS4+AbYKaNg0N1UKfJD2aj8PW/nV6x5BTU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/launch_screen.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5LpZj+lII1Wxeoh/uUTCDCArK4d78db4YrCPyPx2POU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/list_divider.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: OTyMliOTAjaRjei5u5CTGiJxuSpQCiAfI24Xz+8mBzA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/navigation_empty_icon.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: iB6ORIG4l3wHQR8jwauin73IRGbHuh+06f7Tz9Jf6H0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/notification_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: /GEezBlwjZXL4S4SOX8AZtDtxgTCRe0/kKvv1/iMM0k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/notification_bg_low.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: +MgmcYyKURuBkWrKHodO/0PD3kf/uw4f+GHZBnHSjbM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/notification_icon_background.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1s3axc3i3lDo1L/l08Z5p2I+d4eRhbmdqcgyExr8dl0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/notification_tile_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1hnfxInDSz8YwavcWdqWa0dG+fyqipzpppho6hjIS78=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/out_going_tx_whtie_arrow.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 22a0RvNd6qKa0KqJOJgo++o5rWbcC8Rl5NR2dFSgr8Q=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/pager_indicator_dot.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9NR7S2zZqS+b1APp91B8IjeLCDMsloDLa8olvu0GO5E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/paynym.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: shNT33Bk8fXPpjOwroCw3LnuuXfMnr1+9bNOd9TBzuQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/recovery_word_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: e7fjaYYr2TC/+0prMCWxwf3JErk75ijpdhPhKiDPCyE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/recovery_word_number_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: eXGzhZyYaU7S88f067bSUSY8MjnWAjQGX67CH1qTw2Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ripple_initial_blue.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: a1fDIRYwpsCIGER8VguA1FM4LiHgnozpIsf1WgIojHg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ripple_initial_green.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: VoCxeCGZXMxQW3NGL0hX6Jjre60Mub1CFIZl7BZOwQU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ripple_initial_red.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: qJB2Gzsm38yf7EFxtSNZpkKZ6V17wmLtcipyIIkhdJ4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/ripple_tx_status.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 8m5lfmmG0E8pDM0+pMpJ6Q7+fIM4vBFUFU2+s7lsjwE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/round_border_grey_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wz6cbst8vTIILlnr2lvxXI0j5QslMDXmci+lygP5PJQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/round_rectangle_token_word_background.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: y7zs2B9z5gwxmhlGM/viW7ukC10L1/rd/gOhuygcfiM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/rounded_rectangle_black.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: dowK5w6nXjAngVD0yfwsTcSQqECHY0JSSgJ/M1X1414=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/rounded_rectangle_green.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: E12kH5N/Y9OhAA74ZHaqU98FFFrQvjsnL/L10DDkHrA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/rounded_rectangle_pinview.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: fiVG2+o85CbUESZjnEOpINtvRjgZ24UO6kG4evkNKzM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/samourai_splash.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: M/JYKLDbrwsNdmOc3jsOwrb+X+hZhT8TQIVO8CBaNmU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/seekbar_blue_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: cPeGNBnY9BJpKidNpv5cWzVag+TyBTssiTEAJoh4vAs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/seekbar_blue_thumb.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: MRqUwkhM3GsfNMIwaniO10p8OSfazECt3fJJFOUHJT4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/seekbar_green_bg.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: o5hskEQFmMNPyL/u7Hz6Z5X9SUnGeYYF2pmuJCPK0qY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/seekbar_green_thumb.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: eaN5AgRYoSU4Qbx+vccBoa8khze/rCGTUeI8i1icTkw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/tooltip_frame_dark.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: jo5vWMwdIX2kssimNgOcoxGofbz9eRis01iW6ztknSI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/tooltip_frame_light.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: PNyiV7MZu0pYxgkeEJSW0XK6y6+1cbVRsfjWmyQvC48=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/tor_off.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: 0AHrlx/t+FMgX9k5/K9UP+RWW5B4rbNCNaRDXx+1qH4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/tor_on.png</font>
│ <font color="#4E9A06">+SHA-256-Digest: IQ//GGwIdxNAufhZ0s+1GoEHKZi/53ISw/aoUsHlvzg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/tx_ripples.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wPWMBrSyB8f5eK0/8fXFAQv2I7UNg1eB06wo02++ZoY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/whirlpool_btn_blue.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: GD+kezDbT0Zpt2zhF3/F1fKBw2NxLp/hDgHX899Mp78=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/drawable/whirlpool_btn_inactive.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: rdUBpYBPHzms1xlZZZg47yGqo88b/30MO1Tn1DMbhAQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/font-v22/roboto_mono.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: DEZT6//a0ZHHvw9WDJlTpvTooKWXpf1DPk6fbn2iQhI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/font/roboto_mono.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Jq91dwUz0ZlNTnZHo9/DYATC4vUyAPBb5el95xnJPrY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/font/roboto_mono_italic.ttf</font>
│ <font color="#4E9A06">+SHA-256-Digest: Pb3XA7CaF65MFtDZJl61gjSUFssLo8d7OD8p3m4rJ8U=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/font/roboto_mono_regular.ttf</font>
│ <font color="#4E9A06">+SHA-256-Digest: x6stc899U4+s4IvN3pW5KM5gmpcCN8iBHKPHYFnIuy8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout-sw600dp-v13/design_layout_snackbar.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: DygIeI6TLKLSUz5jNGOY+NFQoykylhLt6Z0fNWAC5lM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout-v21/notification_action.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6W5qxa9chTUJVpte9C6vCQ1HEouROC0OZSHlXTnwSqA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout-v21/notification_action_tombstone.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 8ly2HLrFJkFV/qAF1xpEskQEbMOc3RmcZQ3Hw5tYSu0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout-v21/notification_template_custom_big.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: SlEkXy7BaqLN/6vXBdiphZ9JYM1cg2CA5U+twlplCFs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout-v21/notification_template_icon_group.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: kiCQ7wrKx03pb9cguPb21cEsHixfzNZUzIloLxAkGvg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout-v22/abc_alert_dialog_button_bar_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: iC74JP13Asszo2crdfCDccczh7aebO8jEpvHxZEttr4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout-v22/activity_network_dashboard.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 8il2guKNuc61HLr/uDwDnae2zX3dnI0d/vxwnqMxVdY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout-v26/abc_screen_toolbar.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: X8kC6eZmceCViBd4ucL5BtPLk49Xw4opYJbswJBNHJE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_action_bar_title_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 8R97Yafa1wv+IrBtpG9o5QH6gEoj1hxId/4OVn7ysl0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_action_bar_up_container.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: KxIkwLwSCwfZ9b9aYVYz/i6EWo14j5q0lpmUSXQ/Th0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_action_bar_view_list_nav_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: egOSAg9Yv3dr7k5IOnmc+YziTrc1kTA0n6M0WYgKXm4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_action_menu_item_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: zSG24lHSbCL5Cnh9XjrZPdpawzQr9EEG3w4NgzXfJSs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_action_menu_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 4FTmWV6fkEitBXh/k85pzVt1o+tTV43Bbdzw5Qkpcx0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_action_mode_bar.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: TMLoJWkNGyHfCIO0BShNUv5aDqE6G9Kt/dyw+v9aQvo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_action_mode_close_item_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: oKWwH7VlQuwFdyXgsYh1o5EuFdYdJHpUvdtFeDvHAoE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_activity_chooser_view.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 22gSOFHnd6CVO/9MkvEfRsqpXTHSnVSSRcCp94KZot0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_activity_chooser_view_list_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: qBYtqIF7lv9oHW03U7UeJnqtJlQfPoZSkvuHO64zYEo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_alert_dialog_button_bar_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: GLJ66zUYTNcSGXcWgkfirp5qdLdI5X/q0UKoSGVseq4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_alert_dialog_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6w9IXI9Bf/6m2xZHFYxocz1lBsAHZRiH/yQfQ9s1SfE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_alert_dialog_title_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: vOFYjm3adanQNCcfk+al1qTm4/+kWnzxgJfJYDTX+aE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_dialog_title_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9FOmhEsZPFpHexCthsFVNh+mcCVNANwKqobCCb8O78o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_expanded_menu_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: HJT06vSuNpH7vMRKne2Zscc5NXnKThC6qOS83ZrdVrQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_list_menu_item_checkbox.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: +z81DmV86xtfgJeewDlHyHHRO96L2EP0+vs9n+z7Tww=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_list_menu_item_icon.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: zGFV3zDeyq3FSFKROXKdYY+4G1tQrm7eI3NXzYXJz7I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_list_menu_item_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: lG0em8QE8CDveEuxcCICMW6/rgEs2MqwHg010Amj5s0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_list_menu_item_radio.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Ho+U+OoyfxvjbOV+eHFdLOLmW9jnwkX7KhgY2aZ5nP8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_popup_menu_header_item_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: y+G6GihDM9+f9q3jZR8zzDj7nRQ/zvl4dBkpFH9cZzE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_popup_menu_item_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: jdsLd846KgtSzOtjsRqDQQtmaZec1Y8+smpVbVhj4j4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_screen_content_include.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: FFGaI5cAFHolHvX2v/m+sd9tlAgz+g8q7PRFqDxxuQ4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_screen_simple.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: bJkY7Az/zsbecc3Q6dxjLqeeb1mOcfNNozk8ZkzXgCQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_screen_simple_overlay_action_mode.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wqunrpHedl3ilQp+R60IdHG91E3iVD6pv1JGLs0Aqxc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_screen_toolbar.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: AgdpVgAID2aZteP+DJoN5DrPpAhvUNZPAo2+gvyntyY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_search_dropdown_item_icons_2line.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6t+IEm4BarsgkrcJ0zNYacL5Ojm/G5uAum/CXNCZzuc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_search_view.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Mpb475R0Dj1TrrkkDn2Uo78pV5w8Vcz5Am6IU62Bjn8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/abc_select_dialog_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: cTVzGPlGnVTnJILiHRciiyfFxvIniTl8wHUDNwEQAMM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_about.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: JziSRp1H5tvuks5i+DxGIq8TjUWwgs/dpAqkxnUZmwk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_add_paynym.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: AOKGRDDsKAgu24vm9yQwTgrsYkhXZ4Xj5bcDfPykPSE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_address_calc.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: rsr28oSwUVv6zRc3DGkvHltN/8Th1c0UKC3otiQ54hs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_balance.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: YYuE5EuA9yH8WrUxYJ72MmQXr+wakO8KceYpklaEJ5M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_batchsend.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: AzqAIzumFwCfSIXczHxIYtrRC90Y6VX10z1eji82nFg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_choose_cycle_type.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: /O6v5vkX1RuCm94gvtE2zjJVjzpyblQwyXeHzuqK19o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_create_wallet.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7jga81bqtd6cwe/ACznS8qSXQFu3wSRpfxM2n2AC+64=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_cycle.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: a59Uur1QzOvcNcH2PA1Hvhap90q3d8hRobRglMW9Z/8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_fee.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ct3TU5AF5ImWr2zUNaYMiLXyyBuzwbCsPHrLQTLGv1E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_landing.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Y8dSll2mMSFG2KiWw8yxJduselGlPFmNjxmp/X6AwZg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_main.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: fYnZoDyZAc/5dxMDu7EPcE+XUenTTGzt8m3LyAwRhgo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_manual_stone_wall.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: nw/EhmXKpsAXleCYV+BJgvghCplGC3RP/ghv882Pzik=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_network_dashboard.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: uqwXCm5jMGUPjqdiLg3UMFuBfhsTLzCLNNiZA+L+02I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_new_whirlpool_cycle.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: lf+JAmBosTL7b5Gffsyhkta7gotHKz2wqXr5qkGl6ZU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_opendime.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: x/g+jYgJtah1T2BSxoih1Cg6Ha8VzkJT81XuN56av74=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_pay_nym_home.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: X1Wd19i+vozSPTxtHGBG1IcxgaeQABp9Yywl2C4q/cU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_paynym_calc.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: /eMO8LxfVmv16Ov//F+g43Ne+Z6YJuuiEw9BhMGbRiw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_paynym_claim.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5dc07DFylkI50YTLszZGyYSichJZIN4sw0ovgLvYdb0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_paynym_details.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: cRbz2kYXUEe1YVmFnwYyTZkwM4QrF7E1La1ZrdK+J20=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_pinentry.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: lEYrzTDkJklOOj2lQTs3SFYCju6kAc6JjFwRSNBsDPs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_receive.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: riag0exjJA13ZNy7YaS32hoKrW63MvHfkKBnTQH3JU8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_recovery_words.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wKtWk1NjGXUsD6/muZWham4EIXnUR2PbiunRvtsj+70=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_replay_protection.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: mNR2UeVBDm5uB6bzQgE4StBGWazZUwjUAzUaNd8gpPc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_restore_wallet_activity.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7jga81bqtd6cwe/ACznS8qSXQFu3wSRpfxM2n2AC+64=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_ricochet.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: FMq0zOcYig4pOstRERYYkTCGBFljWhXCqBuI4tbUIkw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_send.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: d03A/qUUSE2YSjYqoesXUBiDNiG+wVdM0K8yte3WHOw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_tx.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: gEE2yhWhfiRUqNK4fugYuEDJE8nitQOCrbSqX2HBCGY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_tx_anim_ui.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: iIM6UREDVPWy6KKf3Ktw604rgF5PrEBvJZ+a1GgAOVw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_tx_privacy_details.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: xI/lzj9okk0xLMH5nS4kG4DYZbmPEpc5SP/v0tQOUO8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_utxo.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: QujD4iNAc7APaTFGRfdKTcCuMElUw7yJmLSyahnrV/M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_utxos.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 69NpW65wYiSx/boZ9tEfPryqSgmfe9383sanSJsmWv4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/activity_whirlpool_main.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: XbjcXk4B4E4ChmRhVq77olU8CCunokuINOEWwTsQxPA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/alert_bis_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: lulAYQnvLIoFUehYsOVyL8YZn/COU8w6G1BU4wcHuyo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/alert_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: JNw3zMLgnw7anZNreldfwGQ6N110b7m100h5eeuBx1M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/balance_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: P6heYQU0dgtsxnyWwSAoZyt5xJYGnSF72KeCcRX7+Ws=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/bip47_add.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3sbnlhuCk5RpuKNk56Ip6gGMNMH84EyxrQ4IS9k9VF0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/bip47_entry.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: AAKZJiqxDHybrRDK4HiEChwbavygc7ZjZcXH2DePl6c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/bip47_list.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: g4tA19FPf5TYOQBUnR4uKkV7NhPOmKpBu9uGJ2Q13aw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/bip47_show_qr.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ag46RyVvUaYl3ngATug681jYfV1B2YgXsvDF/UgSzhk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/bottomsheet_camera.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: YBxpZuL1fVgzeCiUOHWO7SKBpNXwwe0d151zkYC1KS0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/bottomsheet_dojo_configure.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 98ABkD66i9LmJwN/40fVnuPjZWThoknhr8+zvbIqOSc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/bottomsheet_edit_paynym.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: pMwOZiANQYbGQ0tMTHrGLjTEigonNTj5YNb2eEDpKCg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/bottomsheet_paynym_qr.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1um+qpJfja+s5MssayUqMIWnxkwHh8+6TAIKxiaMPac=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/cahoots_broadcast_details.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7XxcweFU4XoqiR1m0vVCu8kI4NyiyTwmjyjgnX3ZvbM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/cahoots_qr_dialog_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Hqet8pWSCXYM3mDbOMjyrYI2TDH1UL6DbsWt/BLkfVg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/cahoots_step_view.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: x5ba1EVp4H7+avCT+mjItjH11pQdtP0pPckEy+VsuLo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/circle_step_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: zLFoC0xQzqfdX9OHakDl/R4e4X9BNo+xqFMAQGHh8rI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/content_cycle.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: cAfqlj9oQLGZvheMTai0amoUCnQ6T19sLiNR9MVGFgE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/cycle_header.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: TwEBOLL2mc/AS8UlzIlVRVwDgOI7XW+ESxV8ijErjeY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/cycle_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: oi5kG2lDFcPjkpOjM67tb/FBtkTJM8R6B6TjL2LdEwk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_bottom_navigation_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: rVRmFJGaPSw3eGxxmYkOkvtUSUNpi7uhUV4WtXUTsUU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_bottom_sheet_dialog.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: tu/GJgzqCwXGaI1dc02APYEqcaDbKgd2AKvv2c7Byp0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_layout_snackbar.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: jo4kPn7F690cNAUeGOYZHolGwRozZfOiI91FOI+tMkA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_layout_snackbar_include.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Cg4Gy14Ya0tfoXafg9cWaxbv1i9BU6eUNjyNkX45ac0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_layout_tab_icon.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: mpLZKvZHT9p8CMcdttxxTKba+qu2poYfM0gfdtP4Mk0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_layout_tab_text.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: cC9kGw1yLNoH5z4Jb+rTdCOME2AE7TP10dAIJiUhQ9M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_menu_item_action_area.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3qtw5q9gufYOn3/rDgEhSP5TbOFaXvaf41Ba+qIbWf8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_navigation_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZbSQ4fOCxyK5x1RjmFD2TfzrEtuhbbjvnJP9pcsBWk0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_navigation_item_header.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7fExbZKdFLJ6zNUjzMIQ8CRRRaHkIQt3l9MPPePUBXc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_navigation_item_separator.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: J4n5m2iSKAlcsfFi14IKqaKs2z2K3jKG+w6PPWaT46w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_navigation_item_subheader.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: zEpSq/LZ6xsdGBVTE0KzQd3jQ4D+JXygI9KwFoTHRBQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_navigation_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: xXDXdUeJ2Eo1/qmCIn21WHX/+kA57RB84f6koL/IoKk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_navigation_menu_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: H1z8Oa6pxxBQvtfKywElRMxVmawKLt4jteCNuIsimKA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/design_text_input_password_icon.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: kcvRKBwRsdZWoWjsYygHypE/Tzrrw3/5LntC4m+wqE4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/dojo_connect_dialog.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: NFWp5rkiwxURR2EjZBqmJwrDz3n01c51eNJRMdn3oEw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fee_selector.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: GbhE3RR6Y3DYoyP7DIsktEe05odfQpW8PBlE1vHjyAU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fee_template.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: U7N7c0tDmvBlaVyFnvWCHG6IMIsOLK8pysr2uN9jLUk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_choose_cahoots_type.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: OZttvAqSYJi2HZE5iRK72M/t87fyGZxWYXVuZMkYaNM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_choose_pools.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: R8Iaewa3CiUafNN2hCLgdiEFk0oIA4GIaFavfndDD9Y=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_choose_utxos.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZTPrZ7Ic2wG/Oo8c6ikSA1XEmojNP7nlkryo7Bp8WZU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_import_wallet.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: VTDYavl0gc/TVv0d3FU1erE1GIR0pf6Fy+Xe7wW0KFk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_password_entry.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: NDdbSkdEF3RjqhDBHk3tdiXn5dGJzxKH7q1fUhwK3M0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_paynymselectmodal_list_dialog.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: uVgH28co4nTTLfJLzow/eqnpPJON8IIJtHnXz53NK+I=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_paynymselectmodal_list_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: D7im5SdDGN81p27F+MKlBAi1HyP7ibjrk1sAer7ADWA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_pin_entry.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5Dz9DpC4yq/MUU1XiAIAYn9hl3s12Q5msgOnAGiKBuo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/fragment_whirlpool_review.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: dvtOLC1QJMVNlCn04b+1WS8XYgXCj5a8/GK7mT2yhkM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/item_coin.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: XPQsBaufHzXkRcRKztdLrVB7Qw9MmlZ3rpWH5D7cAxk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/item_cycle_tx.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: YQmXZe/Rlzmw8vHCGik2N0UQW2iqC3vS/1QxG1WS/7M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/item_pool.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: DIWxF7oBXQKvC3UZ/HC4ozdPnaZZiDTuVwfLM22KbMQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/keypad_view.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 01cxNI4241/wwxkmyuW6KRTQXhaOrmnnm5NV/0XxdGo=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/landing_restore_dialog.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: SaQbuWMqi3s2c4XZ1wWJTmPc7m4/69tCHDbYTU+Aub0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/network_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5Hmdx7tX0FVAjYjOqAiGa3Ttt8XVAQ0kTjMYMsGloU0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_media_action.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 5DHUBLDO3StmKAsnNPNgWqd4oSug0umqt6G5Wl0BCGI=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_media_cancel_action.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: dfbyC6A/Ar82oscZ0g7ArnYcRSw8lfd/ftfAyPJwBKs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_big_media.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ArKn9Ia2VP16gBe/6f4EQcrEp8/mbI4f2GVezY7tXZw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_big_media_custom.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 9vegcMUwwhLMZ0b7dT2JJdH4+/l6GmHvKEBvjYCnCAU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_big_media_narrow.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: bNs6k52CBbK/0PP1TflBy7kEr0Rj71WsTvJEGgmmDfE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_big_media_narrow_custom.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 7Sa1chG1vfYxnHBEOadxexqF6S/W8HP/BeqcvUeJhJQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_lines_media.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: R0ZYKzANyjjz8DKOQIzzgOvZuMQd4oT7TPoMACKVmLw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_media.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 4tvBjobngkO2wFcLcCrcfzwmOgQvp/gAT8bByWlU/zQ=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_media_custom.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6oKD2Ti0SGzsRLBMdB8gAz1vgklIqUdZ4lOYt87rDsg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_part_chronometer.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1mgCDVJCpXGFdArej80hJJqmFj/x+WiL8zIj041rzp8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/notification_template_part_time.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: EKxdJ1yMmadSEV7UtQsDtTB+LSI0tFJfgP6YOqow6mE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/paynym_account_list_fragment.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: yi/XGUaIMpzHOen+nSMYj773kdpV5YpXBE6p5o+MRwY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/paynym_follow_dialog.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: U9Gmy3QNH4YgpR4CRfwHOUHqy5TGPI71XbvSgN1rAGw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/paynym_list_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Mn8thzT9/6jmoc2I54RIBgXbnfJLWiuO8M8/jfmpGX4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/receive_advance_form_segment.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ZkapEk+dI6/3eFoBT6aQ+r+EXKsYASErvo7BtreV9ic=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/replay_protection_progess_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: oEs9DdAZkglLzOm6mbQRL65dlMzlYum68GEyTTORnN0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/replay_protection_warning_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: nYjG7L7xTP4USu+A1ZZ7u2uNIzGYbheh19USVPJaGU8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/select_dialog_item_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: V2XHyp7XZdpH/E8gWKOMSN1CjkOpgLhf9UNdUR16gGE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/select_dialog_multichoice_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: xQ0cYjwdlQzTU+QECviIDK9nO8RbQaP//Ctn3upS+zE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/select_dialog_singlechoice_material.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 1dbyuOMO86zph1EQcLXCMbSh4viNB84MMLiqkk41UEU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/send_form_segment.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: fYN3ONlkinYuKZnGoL5qwRTxYqiEKHy4ITzZ9Hayt/E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/send_template.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Kjgx9Ccdb57yHlGJhZb9d4kJYqg7A6BSsLTnG0NX8yk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/send_transaction.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: RaLTbmPo329fWMjRm555B755r42p5NxNAbXsbpJi6Y4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/send_transaction_main_segment.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wDDssK+HFgv9YPsMH5+NufpnnL0g8Geq8v1eLaCMRC0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/send_transaction_review.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: RNCNs41DcQJcB2JpgCQ5ZkR8uZgxB/X9RiolUNspsfM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/simple_list_item3.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: LRsaEQjjkOhtTl6BFEWkcm5D7iUMa68oY7AcL3L0tv8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/support_simple_spinner_dropdown_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: t5EaheQXiqXqYMv9vYZ/0vQ7wxoGYCiB4FuzrHFxZxc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/tooltip.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wpue33I7eJL7FbjrFb5dVBr4Oc3+LYavXcUDwY1ojIM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/tor_option_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: NTSLo1pmDCieXxqVeMZ2IPbwHhoJa+pkwJphSgaruME=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/transaction_progress_view.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: abyYyLYAhxi6SpGSB2x+hqz09pDxPV/MHSxLt6tt1fE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/tx_item_layout_.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: c36XPojqAYKEAr0c/6ZC+lL3y3wq9s3RcARXUtu+u28=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/tx_item_layout_paynym.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: /WKZzy/1TpWSYAmbJ6PM+UR42AEB0U+DEqYmoDeUHcw=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/tx_item_section_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: JZIxtlEMv6vtgzwGVXfR0/GH1iTJ3REysjfyMVsN5fc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/utxo_item_layout.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: TjuFO94uVHyaDTn3rZ6E0R+3zb7OJ87vpR9LcUvFYbE=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/whirlpool_cycles_list.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: U5DtmnJSczA1UF3DfKO8o8tcyOTk2lcEnxZ8ZatIjds=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/whirlpool_intro_item.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: LrvTfVa//3t3P/R+N83mxSK0WkbVTxjOlkDcXZGxMWc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/whirlpool_stepper.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Pu3rrljKVzvaOGFcVmaIb+A3HBcBPJMY5ZljL1VGZuk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/widget_horizontal_stepsview.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: WjDbkP55/3t5FA4SFmJcOYSWDlfNKwItnktRYpFADUs=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/layout/word_grid_item_view.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: PvDY6G6zbyaOb+5XfXwFYpOX+h9Qt5ZxF+wajKrSxfg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/add_paynym_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 3zi85GHzV6QgAdUvl4wKCAxlxbIhbPmQK7+Gjy225mc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/batch_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: sY0O276dbxru8y81JHOlxucDBnNpSga9V7FuQIZIfBM=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/bip47_add.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 6Mjs0Hw8Mx04gW2XmRi5NzEz3Hpa4jm+/W3TrVgAO8g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/bip47_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: nNeJSOdqt0JCjx2fNIA2IIM4Vyu+ZgjaxPZPFFoEcYg=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/bip47_menu_show_qr.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: iBraokHflRi30GJF341jp4bbfVCSPDOchMFvvpYss6k=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/landing_activity_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: z53NM4fvtAE+4Q7lzibN6Cz1yO8wETqwsFROiYMOTmY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/main.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: p4980Z9HPZLPg6KhNQ/Cbeo5Lff5JiGWENgYmPOOk7g=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/manual_stonewall_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: wvJwXH+aKlV6R4nZJRuUeYdmRrJnDvuujdf1CCvXu74=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/menu_whirl_pool_main.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: LAe6jSsAfNhqR8axNKTEiHybeh/86vo+B9kE2S/UERY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/opendime_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: EVvumR7Z96xylU1hvIieqY+se3/No5w8FsjCQB09SfY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/paynym_details_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: HjoKO/7q6uCH42A+rzEv2KCTYrBIxYAQRcr3llOQyE0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/receive_activity_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: HOljHAWnqfbMbkjm9sfePMA+dhRjfwd6kXQt/SsJ0c4=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/ricochet.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: kYsgnTB6MJzGWKBMRUGTqX79SlqA16oY7iRP7yFQC9E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/send_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Mz8/fHUz9Y/WWW+MF+I2bR3zJGlIw/8o0L0uGZ5R1cc=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/tx_details_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: p1S0GnyZXcPbU1kpA+UE7d+cm2eqUFVjPlWV3yFMuss=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/utxo_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ze3tEu+d7UtaorBMfHiyqSY5iJDRYoWxA95QmkWGX/o=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/utxo_popup_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: JfJjURjfvN7D4BJCCQY0WTIVwXlEeqc6Yc6awe1T/yk=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/menu/whirlpool_cycle_detail_menu.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ELm4kTOeMtcwGPRxscHyqeWBY//YQo7dZvTYHpIgLi0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/raw/cacerts</font>
│ <font color="#4E9A06">+SHA-256-Digest: s7aSgrcmpZ2VIyXTva2Mq7kQxunN0sk7RfcEzvpfO6w=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/raw/debiancacerts.bks</font>
│ <font color="#4E9A06">+SHA-256-Digest: NAXPj/ftSllY2z964/trBdiso8tA5xCbO68/2f9Omm0=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/device_filter.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: CjQEl/0DI+9m96aWFk6kDqoAlaga9lnhFRi+TVrTpxY=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/provider_paths.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: iDME9YAXMUznHbJEiIDf+ClkbIMHEB3tfDMlxdpvd68=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_networking.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: 2VWPT3u5UwQxnrHbjo207mVVSoLHY0FRH/gdnpObbPA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_other.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: shayS7kzrWq8QEjDOWbSlApeORbujiUHOStGCSUs01E=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_prefs.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: ySeoiLNXdOU3lOi79qgJ4W3AWi7vJt/ac1WcpF+r+2c=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_remote.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: XJWTyQSlcNWm/hAfdm0JS5aTvA4LHIhtJIwcS0AMH1s=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_root.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: DoZJJymCL5ojXcxV/OLvXEK7S2vMJdMQD9zax8oQujA=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_stealth.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: MOR33ch+jpz2ofH2RvK2Bi8+YVr/BMoghyOck/KsCr8=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_troubleshoot.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: KSzq9rMPMH9wJvjI1zAMOIpVCA6GM6YkzqZ0VtLZzAU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_txs.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: Zx2Tjx2bhx8BflaDmrDgc1lCOs+7woRAvJIUtT/x5QU=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: res/xml/settings_wallet.xml</font>
│ <font color="#4E9A06">+SHA-256-Digest: FQZbr39ZPVMoeKjs2ylTTQ8w0feLhDupuwazYxeWW7M=</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+Name: resources.arsc</font>
│ <font color="#4E9A06">+SHA-256-Digest: VklLivCt570+mVgepv3QeYOFcCEqcJnijMk5VdvaDUQ=</font>
│ <font color="#4E9A06">+</font>
├── smali_classes2/com/samourai/boltzmann/Boltzmann.smali
│ <font color="#06989A">@@ -150,34 +150,52 @@</font>
│      iget-object v2, p0, Lcom/samourai/boltzmann/Boltzmann;-&gt;txProcessor:Lcom/samourai/boltzmann/processor/TxProcessor;
│  
│      .line 45
│      invoke-virtual {v2, p1, p2, p3}, Lcom/samourai/boltzmann/processor/TxProcessor;-&gt;processTx(Lcom/samourai/boltzmann/beans/Txos;F[Lcom/samourai/boltzmann/linker/TxosLinkerOptionEnum;)Lcom/samourai/boltzmann/processor/TxProcessorResult;
│  
│      move-result-object p1
│  
│ <font color="#4E9A06">+    .line 46</font>
│ <font color="#4E9A06">+    new-instance p2, Lcom/samourai/boltzmann/beans/BoltzmannResult;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-direct {p2, p1}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/processor/TxProcessorResult;)V</font>
│ <font color="#4E9A06">+</font>
│      .line 47
│ <font color="#4E9A06">+    invoke-virtual {p2}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;print()V</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    .line 49</font>
│ <font color="#4E9A06">+    sget-object p1, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    new-instance p3, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-direct {p3}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    const-string v2, &quot;Duration = &quot;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {p3, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│      invoke-static {}, Ljava/lang/System;-&gt;currentTimeMillis()J
│  
│ <font color="#CC0000">-    move-result-wide p2</font>
│ <font color="#4E9A06">+    move-result-wide v2</font>
│  
│ <font color="#CC0000">-    sub-long/2addr p2, v0</font>
│ <font color="#4E9A06">+    sub-long/2addr v2, v0</font>
│  
│ <font color="#CC0000">-    const-wide/16 v0, 0x3e8</font>
│ <font color="#4E9A06">+    invoke-virtual {p3, v2, v3}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    div-long/2addr p2, v0</font>
│ <font color="#4E9A06">+    const-string v0, &quot;ms&quot;</font>
│  
│ <font color="#CC0000">-    .line 48</font>
│ <font color="#CC0000">-    new-instance v0, Lcom/samourai/boltzmann/beans/BoltzmannResult;</font>
│ <font color="#4E9A06">+    invoke-virtual {p3, v0}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v0, p2, p3, p1}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;&lt;init&gt;(JLcom/samourai/boltzmann/processor/TxProcessorResult;)V</font>
│ <font color="#4E9A06">+    invoke-virtual {p3}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    .line 49</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;print()V</font>
│ <font color="#4E9A06">+    move-result-object p3</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {p1, p3}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    return-object v0</font>
│ <font color="#4E9A06">+    return-object p2</font>
│  .end method
│  
│  .method public process(Ljava/lang/String;)Lcom/samourai/boltzmann/beans/BoltzmannResult;
│      .locals 2
│      .annotation system Ldalvik/annotation/Throws;
│          value = {
│              Ljava/lang/Exception;
├── smali_classes2/com/samourai/boltzmann/utils/ListsUtils$2.smali
│ <font color="#06989A">@@ -23,42 +23,42 @@</font>
│  .field final synthetic val$copy:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lit/unimi/dsi/fastutil/objects/ObjectBigList;Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 144</font>
│ <font color="#4E9A06">+    .line 137</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/utils/ListsUtils$2;-&gt;val$copy:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      iput-object p2, p0, Lcom/samourai/boltzmann/utils/ListsUtils$2;-&gt;val$c:Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(J)V
│      .locals 1
│  
│ <font color="#CC0000">-    .line 147</font>
│ <font color="#4E9A06">+    .line 140</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/utils/ListsUtils$2;-&gt;val$copy:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      invoke-interface {v0, p1, p2}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, Lit/unimi/dsi/fastutil/ints/IntBigArrayBigList;
│  
│      invoke-virtual {p1}, Lit/unimi/dsi/fastutil/ints/IntBigArrayBigList;-&gt;clone()Lit/unimi/dsi/fastutil/ints/IntBigArrayBigList;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 148</font>
│ <font color="#4E9A06">+    .line 141</font>
│      iget-object p2, p0, Lcom/samourai/boltzmann/utils/ListsUtils$2;-&gt;val$c:Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;
│  
│      invoke-virtual {p2, p1}, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;-&gt;add(Ljava/lang/Object;)Z
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/utils/Utils.smali
│ <font color="#06989A">@@ -2,545 +2,126 @@</font>
│  .super Ljava/lang/Object;
│  .source &quot;Utils.java&quot;
│  
│  
│  # static fields
│  .field private static final BYTE_TO_MB:J = 0x100000L
│  
│ <font color="#CC0000">-.field private static final LOG_PROGRESS_FREQUENCY:I = 0x1e</font>
│ <font color="#CC0000">-</font>
│  .field private static final log:Lorg/slf4j/Logger;
│  
│ <font color="#CC0000">-.field private static maxMemUsed:J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-.field private static final progressLast:Ljava/util/Map;</font>
│ <font color="#CC0000">-    .annotation system Ldalvik/annotation/Signature;</font>
│ <font color="#CC0000">-        value = {</font>
│ <font color="#CC0000">-            &quot;Ljava/util/Map&lt;&quot;,</font>
│ <font color="#CC0000">-            &quot;Ljava/lang/String;&quot;,</font>
│ <font color="#CC0000">-            &quot;Lcom/samourai/boltzmann/utils/Progress;&quot;,</font>
│ <font color="#CC0000">-            &quot;&gt;;&quot;</font>
│ <font color="#CC0000">-        }</font>
│ <font color="#CC0000">-    .end annotation</font>
│ <font color="#CC0000">-.end field</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-.field private static final progressResult:Ljava/util/List;</font>
│ <font color="#CC0000">-    .annotation system Ldalvik/annotation/Signature;</font>
│ <font color="#CC0000">-        value = {</font>
│ <font color="#CC0000">-            &quot;Ljava/util/List&lt;&quot;,</font>
│ <font color="#CC0000">-            &quot;Lcom/samourai/boltzmann/utils/Progress;&quot;,</font>
│ <font color="#CC0000">-            &quot;&gt;;&quot;</font>
│ <font color="#CC0000">-        }</font>
│ <font color="#CC0000">-    .end annotation</font>
│ <font color="#CC0000">-.end field</font>
│ <font color="#CC0000">-</font>
│  
│  # direct methods
│  .method static constructor &lt;clinit&gt;()V
│ <font color="#CC0000">-    .locals 2</font>
│ <font color="#4E9A06">+    .locals 1</font>
│  
│ <font color="#CC0000">-    .line 8</font>
│ <font color="#4E9A06">+    .line 7</font>
│      const-class v0, Lcom/samourai/boltzmann/utils/Utils;
│  
│      invoke-static {v0}, Lorg/slf4j/LoggerFactory;-&gt;getLogger(Ljava/lang/Class;)Lorg/slf4j/Logger;
│  
│      move-result-object v0
│  
│      sput-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;log:Lorg/slf4j/Logger;
│  
│ <font color="#CC0000">-    .line 12</font>
│ <font color="#CC0000">-    new-instance v0, Ljava/util/HashMap;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v0}, Ljava/util/HashMap;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    sput-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;progressLast:Ljava/util/Map;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 13</font>
│ <font color="#CC0000">-    new-instance v0, Ljava/util/LinkedList;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v0}, Ljava/util/LinkedList;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    sput-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;progressResult:Ljava/util/List;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-wide/16 v0, 0x0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 15</font>
│ <font color="#CC0000">-    sput-wide v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;maxMemUsed:J</font>
│ <font color="#CC0000">-</font>
│      return-void
│  .end method
│  
│  .method public constructor &lt;init&gt;()V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 7</font>
│ <font color="#4E9A06">+    .line 6</font>
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│ <font color="#CC0000">-.method public static duration(J)Ljava/lang/String;</font>
│ <font color="#CC0000">-    .locals 11</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 80</font>
│ <font color="#CC0000">-    new-instance v0, Ljava/lang/StringBuffer;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v0}, Ljava/lang/StringBuffer;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-wide/16 v1, 0x3c</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-wide/16 v3, 0x0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    cmp-long v5, p0, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-ltz v5, :cond_2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 85</font>
│ <font color="#CC0000">-    div-long v5, p0, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    long-to-double v5, v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v5, v6}, Ljava/lang/Math;-&gt;floor(D)D</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    double-to-long v5, v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 86</font>
│ <font color="#CC0000">-    rem-long/2addr p0, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    cmp-long v7, v5, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-ltz v7, :cond_0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 89</font>
│ <font color="#CC0000">-    div-long v7, v5, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    long-to-double v7, v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v7, v8}, Ljava/lang/Math;-&gt;floor(D)D</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    double-to-long v7, v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 90</font>
│ <font color="#CC0000">-    rem-long/2addr v5, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    goto :goto_0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_0</font>
│ <font color="#CC0000">-    move-wide v7, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :goto_0</font>
│ <font color="#CC0000">-    cmp-long v1, v7, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-ltz v1, :cond_1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-wide/16 v1, 0x18</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 94</font>
│ <font color="#CC0000">-    div-long v9, v7, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    long-to-double v9, v9</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v9, v10}, Ljava/lang/Math;-&gt;floor(D)D</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v9</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    double-to-long v9, v9</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 95</font>
│ <font color="#CC0000">-    rem-long v1, v7, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    goto :goto_1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_1</font>
│ <font color="#CC0000">-    move-wide v9, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v1, v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    goto :goto_1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_2</font>
│ <font color="#CC0000">-    move-wide v1, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v5, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v9, v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :goto_1</font>
│ <font color="#CC0000">-    cmp-long v7, v9, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-lez v7, :cond_3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 99</font>
│ <font color="#CC0000">-    new-instance v7, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v7}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v7, v9, v10}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v8, &quot;d&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v7}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v0, v7}, Ljava/lang/StringBuffer;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuffer;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_3</font>
│ <font color="#CC0000">-    cmp-long v7, v1, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-lez v7, :cond_4</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 102</font>
│ <font color="#CC0000">-    new-instance v7, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v7}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v7, v1, v2}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v1, &quot;h&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v7, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v7}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v0, v1}, Ljava/lang/StringBuffer;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuffer;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_4</font>
│ <font color="#CC0000">-    cmp-long v1, v5, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-lez v1, :cond_5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 105</font>
│ <font color="#CC0000">-    new-instance v1, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v1, v5, v6}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v2, &quot;m&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v0, v1}, Ljava/lang/StringBuffer;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuffer;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_5</font>
│ <font color="#CC0000">-    cmp-long v1, p0, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-gtz v1, :cond_6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 107</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Ljava/lang/StringBuffer;-&gt;length()I</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-nez v1, :cond_7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 108</font>
│ <font color="#CC0000">-    :cond_6</font>
│ <font color="#CC0000">-    new-instance v1, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v1, p0, p1}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string p0, &quot;s&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object p0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v0, p0}, Ljava/lang/StringBuffer;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuffer;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 110</font>
│ <font color="#CC0000">-    :cond_7</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Ljava/lang/StringBuffer;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object p0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    return-object p0</font>
│ <font color="#CC0000">-.end method</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-.method public static getMaxMemUsed()J</font>
│ <font color="#CC0000">-    .locals 2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 76</font>
│ <font color="#CC0000">-    sget-wide v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;maxMemUsed:J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    return-wide v0</font>
│ <font color="#CC0000">-.end method</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-.method public static getProgressResult()Ljava/util/List;</font>
│ <font color="#4E9A06">+.method public static logMemory()V</font>
│      .locals 1
│ <font color="#CC0000">-    .annotation system Ldalvik/annotation/Signature;</font>
│ <font color="#CC0000">-        value = {</font>
│ <font color="#CC0000">-            &quot;()&quot;,</font>
│ <font color="#CC0000">-            &quot;Ljava/util/List&lt;&quot;,</font>
│ <font color="#CC0000">-            &quot;Lcom/samourai/boltzmann/utils/Progress;&quot;,</font>
│ <font color="#CC0000">-            &quot;&gt;;&quot;</font>
│ <font color="#CC0000">-        }</font>
│ <font color="#CC0000">-    .end annotation</font>
│  
│ <font color="#CC0000">-    .line 72</font>
│ <font color="#CC0000">-    sget-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;progressResult:Ljava/util/List;</font>
│ <font color="#4E9A06">+    const/4 v0, 0x0</font>
│  
│ <font color="#CC0000">-    return-object v0</font>
│ <font color="#4E9A06">+    .line 11</font>
│ <font color="#4E9A06">+    invoke-static {v0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    return-void</font>
│  .end method
│  
│  .method public static logMemory(Ljava/lang/String;)V
│ <font color="#CC0000">-    .locals 8</font>
│ <font color="#4E9A06">+    .locals 9</font>
│  
│ <font color="#CC0000">-    .line 18</font>
│ <font color="#4E9A06">+    .line 15</font>
│      sget-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;log:Lorg/slf4j/Logger;
│  
│      invoke-interface {v0}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z
│  
│      move-result v0
│  
│      if-eqz v0, :cond_1
│  
│ <font color="#CC0000">-    .line 19</font>
│ <font color="#4E9A06">+    .line 16</font>
│      invoke-static {}, Ljava/lang/Runtime;-&gt;getRuntime()Ljava/lang/Runtime;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 20</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Ljava/lang/Runtime;-&gt;freeMemory()J</font>
│ <font color="#4E9A06">+    .line 18</font>
│ <font color="#4E9A06">+    invoke-virtual {v0}, Ljava/lang/Runtime;-&gt;totalMemory()J</font>
│  
│      move-result-wide v1
│  
│      const-wide/32 v3, 0x100000
│  
│      div-long/2addr v1, v3
│  
│ <font color="#CC0000">-    .line 21</font>
│ <font color="#CC0000">-    sget-object v5, Lcom/samourai/boltzmann/utils/Utils;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    new-instance v6, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v6}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v6, v1, v2}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v7, &quot;M free - &quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-eqz p0, :cond_0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    goto :goto_0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_0</font>
│ <font color="#CC0000">-    const-string p0, &quot;&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :goto_0</font>
│ <font color="#CC0000">-    invoke-virtual {v6, p0}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v6}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object p0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v5, p0}, Lorg/slf4j/Logger;-&gt;debug(Ljava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 24</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Ljava/lang/Runtime;-&gt;totalMemory()J</font>
│ <font color="#4E9A06">+    .line 19</font>
│ <font color="#4E9A06">+    invoke-virtual {v0}, Ljava/lang/Runtime;-&gt;freeMemory()J</font>
│  
│      move-result-wide v5
│  
│      div-long/2addr v5, v3
│  
│ <font color="#CC0000">-    sub-long/2addr v5, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 26</font>
│ <font color="#CC0000">-    sget-wide v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;maxMemUsed:J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    cmp-long p0, v5, v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-lez p0, :cond_1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 27</font>
│ <font color="#CC0000">-    sput-wide v5, Lcom/samourai/boltzmann/utils/Utils;-&gt;maxMemUsed:J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_1</font>
│ <font color="#CC0000">-    return-void</font>
│ <font color="#CC0000">-.end method</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-.method public static logProgress(Ljava/lang/String;JJ)V</font>
│ <font color="#CC0000">-    .locals 6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v5, &quot;&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object v0, p0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v1, p1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v3, p3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 33</font>
│ <font color="#CC0000">-    invoke-static/range {v0 .. v5}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgress(Ljava/lang/String;JJLjava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    return-void</font>
│ <font color="#CC0000">-.end method</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-.method public static logProgress(Ljava/lang/String;JJLjava/lang/String;)V</font>
│ <font color="#CC0000">-    .locals 8</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 37</font>
│ <font color="#CC0000">-    sget-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;progressLast:Ljava/util/Map;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v0, p0}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    check-cast v0, Lcom/samourai/boltzmann/utils/Progress;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 38</font>
│ <font color="#CC0000">-    invoke-static {}, Ljava/lang/System;-&gt;currentTimeMillis()J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-eqz v0, :cond_0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 39</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Lcom/samourai/boltzmann/utils/Progress;-&gt;getLast()J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    sub-long/2addr v1, v3</font>
│ <font color="#4E9A06">+    sub-long v3, v1, v5</font>
│  
│ <font color="#CC0000">-    const-wide/16 v3, 0x7530</font>
│ <font color="#4E9A06">+    const-wide/16 v7, 0x64</font>
│  
│ <font color="#CC0000">-    cmp-long v1, v1, v3</font>
│ <font color="#4E9A06">+    mul-long v3, v3, v7</font>
│  
│ <font color="#CC0000">-    if-gez v1, :cond_0</font>
│ <font color="#4E9A06">+    .line 21</font>
│ <font color="#4E9A06">+    div-long/2addr v3, v1</font>
│  
│ <font color="#CC0000">-    return-void</font>
│ <font color="#4E9A06">+    .line 22</font>
│ <font color="#4E9A06">+    sget-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    :cond_0</font>
│ <font color="#CC0000">-    if-nez v0, :cond_1</font>
│ <font color="#4E9A06">+    new-instance v1, Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    .line 46</font>
│ <font color="#CC0000">-    new-instance v0, Lcom/samourai/boltzmann/utils/Progress;</font>
│ <font color="#4E9A06">+    invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    move-object v2, v0</font>
│ <font color="#4E9A06">+    invoke-virtual {v1, v3, v4}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    move-object v3, p0</font>
│ <font color="#4E9A06">+    const-string v2, &quot;% mem used (&quot;</font>
│  
│ <font color="#CC0000">-    move-wide v4, p1</font>
│ <font color="#4E9A06">+    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    move-wide v6, p3</font>
│ <font color="#4E9A06">+    invoke-virtual {v1, v5, v6}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct/range {v2 .. v7}, Lcom/samourai/boltzmann/utils/Progress;-&gt;&lt;init&gt;(Ljava/lang/String;JJ)V</font>
│ <font color="#4E9A06">+    const-string v2, &quot;MB free) &quot;</font>
│  
│ <font color="#CC0000">-    .line 47</font>
│ <font color="#CC0000">-    sget-object p1, Lcom/samourai/boltzmann/utils/Utils;-&gt;progressLast:Ljava/util/Map;</font>
│ <font color="#4E9A06">+    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-interface {p1, p0, v0}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    if-eqz p0, :cond_0</font>
│  
│      goto :goto_0
│  
│ <font color="#CC0000">-    .line 49</font>
│ <font color="#CC0000">-    :cond_1</font>
│ <font color="#CC0000">-    invoke-virtual {v0, p1, p2, p3, p4}, Lcom/samourai/boltzmann/utils/Progress;-&gt;update(JJ)V</font>
│ <font color="#4E9A06">+    :cond_0</font>
│ <font color="#4E9A06">+    const-string p0, &quot;&quot;</font>
│  
│ <font color="#CC0000">-    .line 53</font>
│      :goto_0
│ <font color="#CC0000">-    sget-object p0, Lcom/samourai/boltzmann/utils/Utils;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {p0}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result p0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-eqz p0, :cond_2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 54</font>
│ <font color="#CC0000">-    new-instance p0, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {p0}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Lcom/samourai/boltzmann/utils/Progress;-&gt;getProgress()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object p1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string p1, &quot; &quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {p0, p5}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {p0}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object p0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {p0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_2</font>
│ <font color="#CC0000">-    return-void</font>
│ <font color="#CC0000">-.end method</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-.method public static logProgressDone(Ljava/lang/String;J)V</font>
│ <font color="#CC0000">-    .locals 1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v0, &quot;&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 59</font>
│ <font color="#CC0000">-    invoke-static {p0, p1, p2, v0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgressDone(Ljava/lang/String;JLjava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    return-void</font>
│ <font color="#CC0000">-.end method</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-.method public static logProgressDone(Ljava/lang/String;JLjava/lang/String;)V</font>
│ <font color="#CC0000">-    .locals 1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 63</font>
│ <font color="#CC0000">-    sget-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;progressLast:Ljava/util/Map;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v0, p0}, Ljava/util/Map;-&gt;remove(Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object p0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    check-cast p0, Lcom/samourai/boltzmann/utils/Progress;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 64</font>
│ <font color="#CC0000">-    sget-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;progressResult:Ljava/util/List;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v0, p0}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 65</font>
│ <font color="#CC0000">-    sget-object v0, Lcom/samourai/boltzmann/utils/Utils;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v0}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-eqz v0, :cond_0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 66</font>
│ <font color="#CC0000">-    invoke-static {p1, p2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object p1</font>
│ <font color="#4E9A06">+    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {p0, p1, p3}, Lcom/samourai/boltzmann/utils/Progress;-&gt;done(Ljava/lang/Long;Ljava/lang/String;)Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│      move-result-object p0
│  
│ <font color="#CC0000">-    .line 67</font>
│ <font color="#CC0000">-    invoke-static {p0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│ <font color="#4E9A06">+    invoke-interface {v0, p0}, Lorg/slf4j/Logger;-&gt;debug(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    :cond_0</font>
│ <font color="#4E9A06">+    :cond_1</font>
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/utils/ListsUtils$1.smali
│ <font color="#06989A">@@ -26,26 +26,26 @@</font>
│  .end annotation
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;()V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 106</font>
│ <font color="#4E9A06">+    .line 99</font>
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic compare(Ljava/lang/Object;Ljava/lang/Object;)I
│      .locals 0
│  
│ <font color="#CC0000">-    .line 106</font>
│ <font color="#4E9A06">+    .line 99</font>
│      check-cast p1, Ljava/util/Map$Entry;
│  
│      check-cast p2, Ljava/util/Map$Entry;
│  
│      invoke-virtual {p0, p1, p2}, Lcom/samourai/boltzmann/utils/ListsUtils$1;-&gt;compare(Ljava/util/Map$Entry;Ljava/util/Map$Entry;)I
│  
│      move-result p1
│ <font color="#06989A">@@ -61,15 +61,15 @@</font>
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;TK;TV;&gt;;&quot;,
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;TK;TV;&gt;;)I&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 109</font>
│ <font color="#4E9A06">+    .line 102</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava/lang/Comparable;
│  
│      invoke-interface {p2}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
├── smali_classes2/com/samourai/boltzmann/utils/ListsUtils.smali
│ <font color="#06989A">@@ -1,36 +1,17 @@</font>
│  .class public Lcom/samourai/boltzmann/utils/ListsUtils;
│  .super Ljava/lang/Object;
│  .source &quot;ListsUtils.java&quot;
│  
│  
│ <font color="#CC0000">-# static fields</font>
│ <font color="#CC0000">-.field private static final log:Lorg/slf4j/Logger;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-</font>
│  # direct methods
│ <font color="#CC0000">-.method static constructor &lt;clinit&gt;()V</font>
│ <font color="#CC0000">-    .locals 1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 18</font>
│ <font color="#CC0000">-    const-class v0, Lcom/samourai/boltzmann/utils/ListsUtils;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v0}, Lorg/slf4j/LoggerFactory;-&gt;getLogger(Ljava/lang/Class;)Lorg/slf4j/Logger;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    sput-object v0, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    return-void</font>
│ <font color="#CC0000">-.end method</font>
│ <font color="#CC0000">-</font>
│  .method public constructor &lt;init&gt;()V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 17</font>
│ <font color="#4E9A06">+    .line 15</font>
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  .method public static clone(Lit/unimi/dsi/fastutil/objects/ObjectBigList;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│      .locals 5
│ <font color="#06989A">@@ -42,44 +23,44 @@</font>
│              &quot;&gt;;)&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;Lit/unimi/dsi/fastutil/ints/IntBigList;&quot;,
│              &quot;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 139</font>
│ <font color="#4E9A06">+    .line 132</font>
│      new-instance v0, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;
│  
│      invoke-interface {p0}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;size64()J
│  
│      move-result-wide v1
│  
│      invoke-direct {v0, v1, v2}, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;-&gt;&lt;init&gt;(J)V
│  
│ <font color="#CC0000">-    .line 141</font>
│ <font color="#4E9A06">+    .line 134</font>
│      invoke-interface {p0}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;size64()J
│  
│      move-result-wide v1
│  
│      const-wide/16 v3, 0x0
│  
│      invoke-static {v3, v4, v1, v2}, Ljava8/util/stream/LongStreams;-&gt;range(JJ)Ljava8/util/stream/LongStream;
│  
│      move-result-object v1
│  
│ <font color="#CC0000">-    .line 142</font>
│ <font color="#4E9A06">+    .line 135</font>
│      invoke-interface {v1}, Ljava8/util/stream/LongStream;-&gt;parallel()Ljava8/util/stream/LongStream;
│  
│      move-result-object v1
│  
│      new-instance v2, Lcom/samourai/boltzmann/utils/ListsUtils$2;
│  
│      invoke-direct {v2, p0, v0}, Lcom/samourai/boltzmann/utils/ListsUtils$2;-&gt;&lt;init&gt;(Lit/unimi/dsi/fastutil/objects/ObjectBigList;Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;)V
│  
│ <font color="#CC0000">-    .line 143</font>
│ <font color="#4E9A06">+    .line 136</font>
│      invoke-interface {v1, v2}, Ljava8/util/stream/LongStream;-&gt;forEachOrdered(Ljava8/util/function/LongConsumer;)V
│  
│      return-object v0
│  .end method
│  
│  .method public static comparingByValue()Ljava/util/Comparator;
│      .locals 1
│ <font color="#06989A">@@ -92,15 +73,15 @@</font>
│              &quot;-TV;&gt;;&gt;()&quot;,
│              &quot;Ljava/util/Comparator&lt;&quot;,
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;TK;TV;&gt;;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 106</font>
│ <font color="#4E9A06">+    .line 99</font>
│      new-instance v0, Lcom/samourai/boltzmann/utils/ListsUtils$1;
│  
│      invoke-direct {v0}, Lcom/samourai/boltzmann/utils/ListsUtils$1;-&gt;&lt;init&gt;()V
│  
│      return-object v0
│  .end method
│  
│ <font color="#06989A">@@ -111,15 +92,15 @@</font>
│              &quot;([[I&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;Lit/unimi/dsi/fastutil/ints/IntBigList;&quot;,
│              &quot;&gt;;)Z&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 161</font>
│ <font color="#4E9A06">+    .line 154</font>
│      array-length v0, p0
│  
│      int-to-long v0, v0
│  
│      invoke-interface {p1}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;size64()J
│  
│      move-result-wide v2
│ <font color="#06989A">@@ -131,21 +112,21 @@</font>
│      if-eqz v0, :cond_0
│  
│      return v4
│  
│      :cond_0
│      const/4 v0, 0x0
│  
│ <font color="#CC0000">-    .line 164</font>
│ <font color="#4E9A06">+    .line 157</font>
│      :goto_0
│      array-length v1, p0
│  
│      if-ge v0, v1, :cond_2
│  
│ <font color="#CC0000">-    .line 165</font>
│ <font color="#4E9A06">+    .line 158</font>
│      aget-object v1, p0, v0
│  
│      int-to-long v2, v0
│  
│      invoke-interface {p1, v2, v3}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object v2
│ <font color="#06989A">@@ -183,15 +164,15 @@</font>
│          value = {
│              &quot;([[J&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;[J&gt;;)Z&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 173</font>
│ <font color="#4E9A06">+    .line 166</font>
│      array-length v0, p0
│  
│      int-to-long v0, v0
│  
│      invoke-interface {p1}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;size64()J
│  
│      move-result-wide v2
│ <font color="#06989A">@@ -203,21 +184,21 @@</font>
│      if-eqz v0, :cond_0
│  
│      return v4
│  
│      :cond_0
│      const/4 v0, 0x0
│  
│ <font color="#CC0000">-    .line 176</font>
│ <font color="#4E9A06">+    .line 169</font>
│      :goto_0
│      array-length v1, p0
│  
│      if-ge v0, v1, :cond_2
│  
│ <font color="#CC0000">-    .line 177</font>
│ <font color="#4E9A06">+    .line 170</font>
│      aget-object v1, p0, v0
│  
│      int-to-long v2, v0
│  
│      invoke-interface {p1, v2, v3}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object v2
│ <font color="#06989A">@@ -258,15 +239,15 @@</font>
│      const-wide/16 v0, 0x0
│  
│      :goto_0
│      cmp-long v2, v0, p2
│  
│      if-gez v2, :cond_0
│  
│ <font color="#CC0000">-    .line 156</font>
│ <font color="#4E9A06">+    .line 149</font>
│      invoke-interface {p0, p1}, Lit/unimi/dsi/fastutil/BigList;-&gt;add(Ljava/lang/Object;)Z
│  
│      const-wide/16 v2, 0x1
│  
│      add-long/2addr v0, v2
│  
│      goto :goto_0
│ <font color="#06989A">@@ -287,15 +268,15 @@</font>
│              &quot;Ljava/util/List&lt;&quot;,
│              &quot;Ljava/util/Set&lt;&quot;,
│              &quot;Ljava/lang/String;&quot;,
│              &quot;&gt;;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 28</font>
│ <font color="#4E9A06">+    .line 24</font>
│      new-instance v0, Ljava/util/LinkedList;
│  
│      invoke-direct {v0, p0}, Ljava/util/LinkedList;-&gt;&lt;init&gt;(Ljava/util/Collection;)V
│  
│      const/4 p0, 0x1
│  
│      move-object v1, v0
│ <font color="#06989A">@@ -303,40 +284,40 @@</font>
│      const/4 v0, 0x1
│  
│      :goto_0
│      if-eqz v0, :cond_3
│  
│      const/4 v0, 0x0
│  
│ <font color="#CC0000">-    .line 32</font>
│ <font color="#4E9A06">+    .line 28</font>
│      new-instance v2, Ljava/util/LinkedList;
│  
│      invoke-direct {v2}, Ljava/util/LinkedList;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 33</font>
│ <font color="#4E9A06">+    .line 29</font>
│      :goto_1
│      invoke-virtual {v1}, Ljava/util/LinkedList;-&gt;isEmpty()Z
│  
│      move-result v3
│  
│      if-nez v3, :cond_2
│  
│ <font color="#CC0000">-    .line 34</font>
│ <font color="#4E9A06">+    .line 30</font>
│      invoke-virtual {v1}, Ljava/util/LinkedList;-&gt;poll()Ljava/lang/Object;
│  
│      move-result-object v3
│  
│      check-cast v3, Ljava/util/Set;
│  
│ <font color="#CC0000">-    .line 36</font>
│ <font color="#4E9A06">+    .line 32</font>
│      new-instance v4, Ljava/util/LinkedList;
│  
│      invoke-direct {v4}, Ljava/util/LinkedList;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 37</font>
│ <font color="#4E9A06">+    .line 33</font>
│      invoke-virtual {v1}, Ljava/util/LinkedList;-&gt;iterator()Ljava/util/Iterator;
│  
│      move-result-object v1
│  
│      :goto_2
│      invoke-interface {v1}, Ljava/util/Iterator;-&gt;hasNext()Z
│  
│ <font color="#06989A">@@ -346,35 +327,35 @@</font>
│  
│      invoke-interface {v1}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;
│  
│      move-result-object v5
│  
│      check-cast v5, Ljava/util/Set;
│  
│ <font color="#CC0000">-    .line 38</font>
│ <font color="#4E9A06">+    .line 34</font>
│      invoke-static {v3, v5}, Ljava/util/Collections;-&gt;disjoint(Ljava/util/Collection;Ljava/util/Collection;)Z
│  
│      move-result v6
│  
│      if-eqz v6, :cond_0
│  
│ <font color="#CC0000">-    .line 39</font>
│ <font color="#4E9A06">+    .line 35</font>
│      invoke-virtual {v4, v5}, Ljava/util/LinkedList;-&gt;add(Ljava/lang/Object;)Z
│  
│      goto :goto_2
│  
│ <font color="#CC0000">-    .line 42</font>
│ <font color="#4E9A06">+    .line 38</font>
│      :cond_0
│      invoke-interface {v3, v5}, Ljava/util/Set;-&gt;addAll(Ljava/util/Collection;)Z
│  
│      const/4 v0, 0x1
│  
│      goto :goto_2
│  
│ <font color="#CC0000">-    .line 45</font>
│ <font color="#4E9A06">+    .line 41</font>
│      :cond_1
│      invoke-virtual {v2, v3}, Ljava/util/LinkedList;-&gt;add(Ljava/lang/Object;)Z
│  
│      move-object v1, v4
│  
│      goto :goto_1
│  
│ <font color="#06989A">@@ -386,20 +367,20 @@</font>
│      :cond_3
│      return-object v1
│  .end method
│  
│  .method public static newIntBigList(JI)Lit/unimi/dsi/fastutil/ints/IntBigList;
│      .locals 1
│  
│ <font color="#CC0000">-    .line 133</font>
│ <font color="#4E9A06">+    .line 126</font>
│      new-instance v0, Lit/unimi/dsi/fastutil/ints/IntBigArrayBigList;
│  
│      invoke-direct {v0, p0, p1}, Lit/unimi/dsi/fastutil/ints/IntBigArrayBigList;-&gt;&lt;init&gt;(J)V
│  
│ <font color="#CC0000">-    .line 134</font>
│ <font color="#4E9A06">+    .line 127</font>
│      invoke-static {p2}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;
│  
│      move-result-object p2
│  
│      invoke-static {v0, p2, p0, p1}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;fill(Lit/unimi/dsi/fastutil/BigList;Ljava/lang/Object;J)V
│  
│      return-object v0
│ <font color="#06989A">@@ -412,66 +393,66 @@</font>
│              &quot;(JJI)&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;Lit/unimi/dsi/fastutil/ints/IntBigList;&quot;,
│              &quot;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 124</font>
│ <font color="#4E9A06">+    .line 117</font>
│      new-instance v0, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;
│  
│      invoke-direct {v0, p0, p1}, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;-&gt;&lt;init&gt;(J)V
│  
│      const-wide/16 v1, 0x0
│  
│      :goto_0
│      cmp-long v3, v1, p0
│  
│      if-gez v3, :cond_0
│  
│ <font color="#CC0000">-    .line 126</font>
│ <font color="#4E9A06">+    .line 119</font>
│      invoke-static {p2, p3, p4}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;newIntBigList(JI)Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      move-result-object v3
│  
│ <font color="#CC0000">-    .line 127</font>
│ <font color="#4E9A06">+    .line 120</font>
│      invoke-interface {v0, v3}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;add(Ljava/lang/Object;)Z
│  
│      const-wide/16 v3, 0x1
│  
│      add-long/2addr v1, v3
│  
│      goto :goto_0
│  
│      :cond_0
│      return-object v0
│  .end method
│  
│  .method public static powerSet([Ljava/lang/Long;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│ <font color="#CC0000">-    .locals 19</font>
│ <font color="#4E9A06">+    .locals 17</font>
│      .annotation system Ldalvik/annotation/Signature;
│          value = {
│              &quot;([&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;)&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;[J&gt;;&quot;
│          }
│      .end annotation
│  
│      move-object/from16 v0, p0
│  
│ <font color="#CC0000">-    .line 69</font>
│ <font color="#4E9A06">+    .line 65</font>
│      array-length v1, v0
│  
│      const-wide/16 v2, 0x1
│  
│      shl-long v4, v2, v1
│  
│ <font color="#CC0000">-    .line 70</font>
│ <font color="#4E9A06">+    .line 66</font>
│      new-instance v1, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;
│  
│      invoke-direct {v1, v4, v5}, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;-&gt;&lt;init&gt;(J)V
│  
│      const/4 v6, 0x0
│  
│      const/4 v7, 0x0
│ <font color="#06989A">@@ -479,107 +460,97 @@</font>
│      :goto_0
│      int-to-long v8, v7
│  
│      cmp-long v10, v8, v4
│  
│      if-gez v10, :cond_2
│  
│ <font color="#CC0000">-    .line 73</font>
│ <font color="#4E9A06">+    .line 68</font>
│      invoke-static {v8, v9}, Ljava/lang/Long;-&gt;bitCount(J)I
│  
│      move-result v10
│  
│      new-array v10, v10, [J
│  
│ <font color="#CC0000">-    move-wide v12, v8</font>
│ <font color="#4E9A06">+    move-wide v11, v8</font>
│  
│ <font color="#CC0000">-    const/4 v11, 0x0</font>
│ <font color="#4E9A06">+    const/4 v8, 0x0</font>
│  
│ <font color="#CC0000">-    const/4 v14, 0x0</font>
│ <font color="#4E9A06">+    const/4 v9, 0x0</font>
│  
│ <font color="#CC0000">-    .line 75</font>
│ <font color="#4E9A06">+    .line 70</font>
│      :goto_1
│ <font color="#CC0000">-    array-length v15, v0</font>
│ <font color="#4E9A06">+    array-length v13, v0</font>
│  
│ <font color="#CC0000">-    if-ge v11, v15, :cond_1</font>
│ <font color="#4E9A06">+    if-ge v8, v13, :cond_1</font>
│  
│ <font color="#CC0000">-    and-long v15, v12, v2</font>
│ <font color="#4E9A06">+    and-long v13, v11, v2</font>
│  
│ <font color="#CC0000">-    const-wide/16 v17, 0x0</font>
│ <font color="#4E9A06">+    const-wide/16 v15, 0x0</font>
│  
│ <font color="#CC0000">-    cmp-long v15, v15, v17</font>
│ <font color="#4E9A06">+    cmp-long v13, v13, v15</font>
│  
│ <font color="#CC0000">-    if-eqz v15, :cond_0</font>
│ <font color="#4E9A06">+    if-eqz v13, :cond_0</font>
│  
│ <font color="#CC0000">-    add-int/lit8 v15, v14, 0x1</font>
│ <font color="#4E9A06">+    add-int/lit8 v13, v9, 0x1</font>
│  
│ <font color="#CC0000">-    .line 76</font>
│ <font color="#CC0000">-    aget-object v16, v0, v11</font>
│ <font color="#4E9A06">+    .line 71</font>
│ <font color="#4E9A06">+    aget-object v14, v0, v8</font>
│  
│ <font color="#CC0000">-    invoke-virtual/range {v16 .. v16}, Ljava/lang/Long;-&gt;longValue()J</font>
│ <font color="#4E9A06">+    invoke-virtual {v14}, Ljava/lang/Long;-&gt;longValue()J</font>
│  
│ <font color="#CC0000">-    move-result-wide v16</font>
│ <font color="#4E9A06">+    move-result-wide v14</font>
│  
│ <font color="#CC0000">-    aput-wide v16, v10, v14</font>
│ <font color="#4E9A06">+    aput-wide v14, v10, v9</font>
│  
│ <font color="#CC0000">-    move v14, v15</font>
│ <font color="#4E9A06">+    move v9, v13</font>
│  
│      :cond_0
│ <font color="#CC0000">-    add-int/lit8 v11, v11, 0x1</font>
│ <font color="#4E9A06">+    add-int/lit8 v8, v8, 0x1</font>
│  
│ <font color="#CC0000">-    const/4 v15, 0x1</font>
│ <font color="#4E9A06">+    const/4 v13, 0x1</font>
│  
│ <font color="#CC0000">-    shr-long/2addr v12, v15</font>
│ <font color="#4E9A06">+    shr-long/2addr v11, v13</font>
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 78</font>
│ <font color="#4E9A06">+    .line 73</font>
│      :cond_1
│      invoke-interface {v1, v10}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;add(Ljava/lang/Object;)Z
│  
│ <font color="#CC0000">-    const-string v10, &quot;powerSet&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 79</font>
│ <font color="#CC0000">-    invoke-static {v10, v8, v9, v4, v5}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgress(Ljava/lang/String;JJ)V</font>
│ <font color="#CC0000">-</font>
│      add-int/lit8 v7, v7, 0x1
│  
│      goto :goto_0
│  
│      :cond_2
│ <font color="#CC0000">-    const-string v2, &quot;powerSet&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 81</font>
│ <font color="#CC0000">-    invoke-static {v2, v4, v5}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgressDone(Ljava/lang/String;J)V</font>
│ <font color="#CC0000">-</font>
│      const-wide/high16 v2, 0x4000000000000000L    # 2.0
│  
│ <font color="#CC0000">-    .line 84</font>
│ <font color="#4E9A06">+    .line 77</font>
│      array-length v0, v0
│  
│      int-to-double v4, v0
│  
│      invoke-static {v2, v3, v4, v5}, Ljava/lang/Math;-&gt;pow(DD)D
│  
│      move-result-wide v2
│  
│      double-to-long v2, v2
│  
│ <font color="#CC0000">-    .line 85</font>
│ <font color="#4E9A06">+    .line 78</font>
│      invoke-interface {v1}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;size64()J
│  
│      move-result-wide v4
│  
│      cmp-long v0, v2, v4
│  
│      if-nez v0, :cond_3
│  
│      return-object v1
│  
│ <font color="#CC0000">-    .line 86</font>
│ <font color="#4E9A06">+    .line 79</font>
│      :cond_3
│      new-instance v0, Ljava/lang/RuntimeException;
│  
│      new-instance v4, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v4}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│ <font color="#06989A">@@ -623,32 +594,32 @@</font>
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;TK;TV;&gt;;&gt;;)&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;TK;TV;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 93</font>
│ <font color="#4E9A06">+    .line 86</font>
│      new-instance v0, Ljava/util/ArrayList;
│  
│      invoke-interface {p0}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;
│  
│      move-result-object p0
│  
│      invoke-direct {v0, p0}, Ljava/util/ArrayList;-&gt;&lt;init&gt;(Ljava/util/Collection;)V
│  
│ <font color="#CC0000">-    .line 94</font>
│ <font color="#4E9A06">+    .line 87</font>
│      invoke-static {v0, p1}, Ljava/util/Collections;-&gt;sort(Ljava/util/List;Ljava/util/Comparator;)V
│  
│ <font color="#CC0000">-    .line 96</font>
│ <font color="#4E9A06">+    .line 89</font>
│      new-instance p0, Ljava/util/LinkedHashMap;
│  
│      invoke-direct {p0}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 97</font>
│ <font color="#4E9A06">+    .line 90</font>
│      invoke-interface {v0}, Ljava/util/List;-&gt;iterator()Ljava/util/Iterator;
│  
│      move-result-object p1
│  
│      :goto_0
│      invoke-interface {p1}, Ljava/util/Iterator;-&gt;hasNext()Z
│  
│ <font color="#06989A">@@ -658,15 +629,15 @@</font>
│  
│      invoke-interface {p1}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/util/Map$Entry;
│  
│ <font color="#CC0000">-    .line 98</font>
│ <font color="#4E9A06">+    .line 91</font>
│      invoke-interface {v0}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;
│  
│      move-result-object v1
│  
│      invoke-interface {v0}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object v0
│ <font color="#06989A">@@ -686,36 +657,36 @@</font>
│              &quot;([[D)&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;Lit/unimi/dsi/fastutil/doubles/DoubleBigList;&quot;,
│              &quot;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 193</font>
│ <font color="#4E9A06">+    .line 186</font>
│      new-instance v0, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;
│  
│      array-length v1, p0
│  
│      int-to-long v1, v1
│  
│      invoke-direct {v0, v1, v2}, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;-&gt;&lt;init&gt;(J)V
│  
│      const/4 v1, 0x0
│  
│      const/4 v2, 0x0
│  
│ <font color="#CC0000">-    .line 195</font>
│ <font color="#4E9A06">+    .line 188</font>
│      :goto_0
│      array-length v3, p0
│  
│      if-ge v2, v3, :cond_0
│  
│      const/4 v3, 0x1
│  
│ <font color="#CC0000">-    .line 196</font>
│ <font color="#4E9A06">+    .line 189</font>
│      new-array v3, v3, [[D
│  
│      aget-object v4, p0, v2
│  
│      aput-object v4, v3, v1
│  
│      invoke-static {v3}, Lit/unimi/dsi/fastutil/doubles/DoubleBigArrayBigList;-&gt;wrap([[D)Lit/unimi/dsi/fastutil/doubles/DoubleBigArrayBigList;
│ <font color="#06989A">@@ -739,36 +710,36 @@</font>
│              &quot;([[I)&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;Lit/unimi/dsi/fastutil/ints/IntBigList;&quot;,
│              &quot;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 185</font>
│ <font color="#4E9A06">+    .line 178</font>
│      new-instance v0, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;
│  
│      array-length v1, p0
│  
│      int-to-long v1, v1
│  
│      invoke-direct {v0, v1, v2}, Lit/unimi/dsi/fastutil/objects/ObjectBigArrayBigList;-&gt;&lt;init&gt;(J)V
│  
│      const/4 v1, 0x0
│  
│      const/4 v2, 0x0
│  
│ <font color="#CC0000">-    .line 186</font>
│ <font color="#4E9A06">+    .line 179</font>
│      :goto_0
│      array-length v3, p0
│  
│      if-ge v2, v3, :cond_0
│  
│      const/4 v3, 0x1
│  
│ <font color="#CC0000">-    .line 187</font>
│ <font color="#4E9A06">+    .line 180</font>
│      new-array v3, v3, [[I
│  
│      aget-object v4, p0, v2
│  
│      aput-object v4, v3, v1
│  
│      invoke-static {v3}, Lit/unimi/dsi/fastutil/ints/IntBigArrayBigList;-&gt;wrap([[I)Lit/unimi/dsi/fastutil/ints/IntBigArrayBigList;
│ <font color="#06989A">@@ -792,37 +763,37 @@</font>
│              &quot;(&quot;,
│              &quot;Ljava/util/Collection&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;&gt;;)[J&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 115</font>
│ <font color="#4E9A06">+    .line 108</font>
│      invoke-interface {p0}, Ljava/util/Collection;-&gt;size()I
│  
│      move-result v0
│  
│      new-array v0, v0, [J
│  
│ <font color="#CC0000">-    .line 116</font>
│ <font color="#4E9A06">+    .line 109</font>
│      invoke-interface {p0}, Ljava/util/Collection;-&gt;iterator()Ljava/util/Iterator;
│  
│      move-result-object p0
│  
│      const/4 v1, 0x0
│  
│ <font color="#CC0000">-    .line 117</font>
│ <font color="#4E9A06">+    .line 110</font>
│      :goto_0
│      invoke-interface {p0}, Ljava/util/Iterator;-&gt;hasNext()Z
│  
│      move-result v2
│  
│      if-eqz v2, :cond_0
│  
│ <font color="#CC0000">-    .line 118</font>
│ <font color="#4E9A06">+    .line 111</font>
│      invoke-interface {p0}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;
│  
│      move-result-object v2
│  
│      check-cast v2, Ljava/lang/Long;
│  
│      invoke-virtual {v2}, Ljava/lang/Long;-&gt;longValue()J
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$5$1$1.smali
│ <font color="#06989A">@@ -33,30 +33,30 @@</font>
│  .field final synthetic val$nbOccur:I
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;I)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 544</font>
│ <font color="#4E9A06">+    .line 555</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1$1;-&gt;this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;
│  
│      iput p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1$1;-&gt;val$nbOccur:I
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 544</font>
│ <font color="#4E9A06">+    .line 555</font>
│      check-cast p1, Ljava/util/Map$Entry;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1$1;-&gt;accept(Ljava/util/Map$Entry;)V
│  
│      return-void
│  .end method
│  
│ <font color="#06989A">@@ -67,15 +67,15 @@</font>
│              &quot;(&quot;,
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;[I&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 547</font>
│ <font color="#4E9A06">+    .line 558</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, [I
│  
│      const/4 v0, 0x1
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$1$1.smali
│ <font color="#06989A">@@ -25,15 +25,15 @@</font>
│  .field final synthetic val$outAggVal:J
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;JLjava/util/List;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 103</font>
│ <font color="#4E9A06">+    .line 106</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;
│  
│      iput-wide p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1$1;-&gt;val$outAggVal:J
│  
│      iput-object p4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1$1;-&gt;val$keysMatchOutAgg:Ljava/util/List;
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│ <font color="#06989A">@@ -42,28 +42,28 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(I)V
│      .locals 5
│  
│ <font color="#CC0000">-    .line 106</font>
│ <font color="#4E9A06">+    .line 109</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allOutAggVal:[J
│  
│      aget-wide v1, v0, p1
│  
│      iget-wide v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1$1;-&gt;val$outAggVal:J
│  
│      cmp-long v0, v1, v3
│  
│      if-nez v0, :cond_0
│  
│ <font color="#CC0000">-    .line 107</font>
│ <font color="#4E9A06">+    .line 110</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1$1;-&gt;val$keysMatchOutAgg:Ljava/util/List;
│  
│      invoke-static {p1}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;
│  
│      move-result-object p1
│  
│      invoke-interface {v0, p1}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$3$1$1.smali
│ <font color="#06989A">@@ -21,39 +21,39 @@</font>
│  .field final synthetic this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 224</font>
│ <font color="#4E9A06">+    .line 233</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1$1;-&gt;this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(J)V
│      .locals 2
│  
│ <font color="#CC0000">-    .line 227</font>
│ <font color="#4E9A06">+    .line 236</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1$1;-&gt;this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$inCmbn:Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      invoke-interface {v0, p1, p2}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;getInt(J)I
│  
│      move-result v0
│  
│ <font color="#CC0000">-    .line 228</font>
│ <font color="#4E9A06">+    .line 237</font>
│      iget-object v1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1$1;-&gt;this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;
│  
│      iget-object v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;
│  
│      iget-object v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$inCmbn:Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      add-int/lit8 v0, v0, 0x1
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$2.smali
│ <font color="#06989A">@@ -27,15 +27,15 @@</font>
│  .field final synthetic val$tgt:I
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/LinkedList;ILjava/util/Map;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 143</font>
│ <font color="#4E9A06">+    .line 147</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iput-object p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$aggs:Ljava/util/LinkedList;
│  
│      iput p3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$tgt:I
│  
│      iput-object p4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$mat:Ljava/util/Map;
│ <font color="#06989A">@@ -44,86 +44,109 @@</font>
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(I)V
│ <font color="#CC0000">-    .locals 8</font>
│ <font color="#4E9A06">+    .locals 2</font>
│  
│ <font color="#CC0000">-    .line 146</font>
│ <font color="#4E9A06">+    .line 150</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$aggs:Ljava/util/LinkedList;
│  
│      invoke-static {p1}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/util/LinkedList;-&gt;contains(Ljava/lang/Object;)Z
│  
│      move-result v0
│  
│      if-eqz v0, :cond_0
│  
│ <font color="#CC0000">-    .line 147</font>
│ <font color="#4E9A06">+    .line 151</font>
│      iget v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$tgt:I
│  
│      sub-int/2addr v0, p1
│  
│      add-int/lit8 v0, v0, 0x1
│  
│      invoke-static {p1, v0}, Ljava/lang/Math;-&gt;min(II)I
│  
│      move-result v0
│  
│      const/4 v1, 0x0
│  
│ <font color="#CC0000">-    .line 149</font>
│ <font color="#4E9A06">+    .line 153</font>
│      invoke-static {v1, v0}, Ljava8/util/stream/IntStreams;-&gt;range(II)Ljava8/util/stream/IntStream;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 150</font>
│ <font color="#4E9A06">+    .line 154</font>
│      invoke-interface {v0}, Ljava8/util/stream/IntStream;-&gt;parallel()Ljava8/util/stream/IntStream;
│  
│      move-result-object v0
│  
│      new-instance v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;
│  
│      invoke-direct {v1, p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;I)V
│  
│ <font color="#CC0000">-    .line 151</font>
│ <font color="#4E9A06">+    .line 155</font>
│      invoke-interface {v0, v1}, Ljava8/util/stream/IntStream;-&gt;forEach(Ljava8/util/function/IntConsumer;)V
│  
│ <font color="#4E9A06">+    .line 167</font>
│      :cond_0
│ <font color="#CC0000">-    const-string v2, &quot;computeInAggCmbn&quot;</font>
│ <font color="#4E9A06">+    rem-int/lit16 v0, p1, 0x190</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    if-nez v0, :cond_1</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    .line 168</font>
│ <font color="#4E9A06">+    invoke-static {}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$000()Lorg/slf4j/Logger;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    int-to-long v3, p1</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    move-result v0</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    if-eqz v0, :cond_1</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    .line 169</font>
│ <font color="#4E9A06">+    new-instance v0, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-direct {v0}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    const-string p1, &quot;/&quot;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    .line 163</font>
│      iget p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$tgt:I
│  
│ <font color="#CC0000">-    int-to-long v5, p1</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    new-instance p1, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    const-string p1, &quot;... &quot;</font>
│  
│ <font color="#CC0000">-    invoke-direct {p1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$mat:Ljava/util/Map;</font>
│ <font color="#4E9A06">+    iget-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$mat:Ljava/util/Map;</font>
│  
│ <font color="#CC0000">-    invoke-interface {v0}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#4E9A06">+    invoke-interface {p1}, Ljava/util/Map;-&gt;size()I</font>
│  
│ <font color="#CC0000">-    move-result v0</font>
│ <font color="#4E9A06">+    move-result p1</font>
│  
│ <font color="#CC0000">-    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    const-string v0, &quot; matches&quot;</font>
│ <font color="#4E9A06">+    const-string p1, &quot; matches&quot;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {p1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│ <font color="#CC0000">-    invoke-static/range {v2 .. v7}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgress(Ljava/lang/String;JJLjava/lang/String;)V</font>
│ <font color="#4E9A06">+    invoke-static {p1}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│  
│ <font color="#4E9A06">+    :cond_1</font>
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$3$1.smali
│ <font color="#06989A">@@ -32,30 +32,30 @@</font>
│  .field final synthetic val$inIdx:I
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;I)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 211</font>
│ <font color="#4E9A06">+    .line 220</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;
│  
│      iput p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;val$inIdx:I
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(Ljava/lang/Integer;)V
│      .locals 8
│  
│ <font color="#CC0000">-    .line 216</font>
│ <font color="#4E9A06">+    .line 225</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;
│  
│      iget-object v1, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;
│  
│      iget-object v2, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$matCmbn:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│ <font color="#06989A">@@ -70,17 +70,17 @@</font>
│  
│      int-to-long v5, p1
│  
│      iget-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;
│  
│      iget-object v7, p1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$allAgg:Lcom/samourai/boltzmann/aggregator/TxosAggregates;
│  
│ <font color="#CC0000">-    invoke-static/range {v1 .. v7}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$100(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+    invoke-static/range {v1 .. v7}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$200(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│ <font color="#CC0000">-    .line 220</font>
│ <font color="#4E9A06">+    .line 229</font>
│      iget-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;
│  
│      iget-object p1, p1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$allAgg:Lcom/samourai/boltzmann/aggregator/TxosAggregates;
│  
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregates;-&gt;getInAgg()Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;
│  
│      move-result-object p1
│ <font color="#06989A">@@ -95,37 +95,37 @@</font>
│  
│      invoke-interface {p1, v0, v1}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, [J
│  
│ <font color="#CC0000">-    .line 221</font>
│ <font color="#4E9A06">+    .line 230</font>
│      invoke-static {p1}, Ljava8/util/stream/LongStreams;-&gt;of([J)Ljava8/util/stream/LongStream;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 222</font>
│ <font color="#4E9A06">+    .line 231</font>
│      invoke-interface {p1}, Ljava8/util/stream/LongStream;-&gt;parallel()Ljava8/util/stream/LongStream;
│  
│      move-result-object p1
│  
│      new-instance v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1$1;
│  
│      invoke-direct {v0, p0}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;)V
│  
│ <font color="#CC0000">-    .line 223</font>
│ <font color="#4E9A06">+    .line 232</font>
│      invoke-interface {p1, v0}, Ljava8/util/stream/LongStream;-&gt;forEach(Ljava8/util/function/LongConsumer;)V
│  
│      return-void
│  .end method
│  
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 211</font>
│ <font color="#4E9A06">+    .line 220</font>
│      check-cast p1, Ljava/lang/Integer;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;accept(Ljava/lang/Integer;)V
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$6.smali
│ <font color="#06989A">@@ -43,15 +43,15 @@</font>
│  .field final synthetic val$otGt:J
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;JLcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;IILjava/util/Map;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 583</font>
│ <font color="#4E9A06">+    .line 594</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iput-wide p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$otGt:J
│  
│      iput-object p4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$aggMatches:Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;
│  
│      iput p5, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$nIl:I
│ <font color="#06989A">@@ -66,15 +66,15 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 583</font>
│ <font color="#4E9A06">+    .line 594</font>
│      check-cast p1, Ljava/util/Map$Entry;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;accept(Ljava/util/Map$Entry;)V
│  
│      return-void
│  .end method
│  
│ <font color="#06989A">@@ -87,67 +87,67 @@</font>
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;[I&gt;;&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 586</font>
│ <font color="#4E9A06">+    .line 597</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/lang/Long;
│  
│      invoke-virtual {v0}, Ljava/lang/Long;-&gt;longValue()J
│  
│      move-result-wide v0
│  
│ <font color="#CC0000">-    .line 587</font>
│ <font color="#4E9A06">+    .line 598</font>
│      iget-wide v2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$otGt:J
│  
│      sub-long/2addr v2, v0
│  
│ <font color="#CC0000">-    .line 591</font>
│ <font color="#4E9A06">+    .line 602</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava/util/Map;
│  
│      invoke-interface {p1}, Ljava/util/Map;-&gt;values()Ljava/util/Collection;
│  
│      move-result-object p1
│  
│      invoke-static {p1}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 592</font>
│ <font color="#4E9A06">+    .line 603</font>
│      invoke-interface {p1}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava8/util/stream/Stream;
│  
│      new-instance v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$1;
│  
│      invoke-direct {v0, p0}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;)V
│  
│ <font color="#CC0000">-    .line 593</font>
│ <font color="#4E9A06">+    .line 604</font>
│      invoke-interface {p1, v0}, Ljava8/util/stream/Stream;-&gt;mapToInt(Ljava8/util/function/ToIntFunction;)Ljava8/util/stream/IntStream;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 600</font>
│ <font color="#4E9A06">+    .line 611</font>
│      invoke-interface {p1}, Ljava8/util/stream/IntStream;-&gt;sum()I
│  
│      move-result p1
│  
│ <font color="#CC0000">-    .line 603</font>
│ <font color="#4E9A06">+    .line 614</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$aggMatches:Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;
│  
│      invoke-virtual {v0}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;getMatchInAggToVal()Ljava/util/Map;
│  
│      move-result-object v0
│  
│      iget v1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$nIl:I
│ <font color="#06989A">@@ -162,15 +162,15 @@</font>
│  
│      check-cast v0, Ljava/lang/Long;
│  
│      invoke-virtual {v0}, Ljava/lang/Long;-&gt;longValue()J
│  
│      move-result-wide v0
│  
│ <font color="#CC0000">-    .line 604</font>
│ <font color="#4E9A06">+    .line 615</font>
│      iget-object v4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$aggMatches:Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;
│  
│      invoke-virtual {v4}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;getValToMatchOutAgg()Ljava/util/Map;
│  
│      move-result-object v4
│  
│      invoke-static {v0, v1}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│ <font color="#06989A">@@ -183,23 +183,23 @@</font>
│  
│      check-cast v0, Ljava/util/Collection;
│  
│      invoke-static {v0}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 605</font>
│ <font color="#4E9A06">+    .line 616</font>
│      invoke-interface {v0}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava8/util/stream/Stream;
│  
│      new-instance v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;
│  
│      invoke-direct {v1, p0, v2, v3, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;JI)V
│  
│ <font color="#CC0000">-    .line 606</font>
│ <font color="#4E9A06">+    .line 617</font>
│      invoke-interface {v0, v1}, Ljava8/util/stream/Stream;-&gt;forEach(Ljava8/util/function/Consumer;)V
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$4$1.smali
│ <font color="#06989A">@@ -34,30 +34,30 @@</font>
│  .field final synthetic val$key0:J
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;J)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 458</font>
│ <font color="#4E9A06">+    .line 469</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;
│  
│      iput-wide p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;val$key0:J
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 458</font>
│ <font color="#4E9A06">+    .line 469</font>
│      check-cast p1, Ljava/util/Map$Entry;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;accept(Ljava/util/Map$Entry;)V
│  
│      return-void
│  .end method
│  
│ <font color="#06989A">@@ -69,78 +69,78 @@</font>
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/lang/Integer;&quot;,
│              &quot;&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 461</font>
│ <font color="#4E9A06">+    .line 472</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/lang/Long;
│  
│      invoke-virtual {v0}, Ljava/lang/Long;-&gt;longValue()J
│  
│      move-result-wide v5
│  
│ <font color="#CC0000">-    .line 463</font>
│ <font color="#4E9A06">+    .line 474</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava/lang/Integer;
│  
│      invoke-virtual {p1}, Ljava/lang/Integer;-&gt;intValue()I
│  
│      move-result p1
│  
│ <font color="#CC0000">-    .line 464</font>
│ <font color="#4E9A06">+    .line 475</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksClear:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      invoke-static {v0}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;clone(Lit/unimi/dsi/fastutil/objects/ObjectBigList;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 465</font>
│ <font color="#4E9A06">+    .line 476</font>
│      iget-object v1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;
│  
│      iget-object v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iget-wide v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;val$key0:J
│  
│      iget-object v2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;
│  
│      iget-object v7, v2, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$allAgg:Lcom/samourai/boltzmann/aggregator/TxosAggregates;
│  
│      move-object v2, v0
│  
│ <font color="#CC0000">-    invoke-static/range {v1 .. v7}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$100(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+    invoke-static/range {v1 .. v7}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$200(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│ <font color="#CC0000">-    .line 467</font>
│ <font color="#4E9A06">+    .line 478</font>
│      iget-object v1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;
│  
│      iget-wide v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksX:J
│  
│      const-wide/16 v3, 0x0
│  
│      invoke-static {v3, v4, v1, v2}, Ljava8/util/stream/LongStreams;-&gt;range(JJ)Ljava8/util/stream/LongStream;
│  
│      move-result-object v1
│  
│ <font color="#CC0000">-    .line 468</font>
│ <font color="#4E9A06">+    .line 479</font>
│      invoke-interface {v1}, Ljava8/util/stream/LongStream;-&gt;parallel()Ljava8/util/stream/LongStream;
│  
│      move-result-object v1
│  
│      new-instance v2, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;
│  
│      invoke-direct {v2, p0, v0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;Lit/unimi/dsi/fastutil/objects/ObjectBigList;I)V
│  
│ <font color="#CC0000">-    .line 469</font>
│ <font color="#4E9A06">+    .line 480</font>
│      invoke-interface {v1, v2}, Ljava8/util/stream/LongStream;-&gt;forEach(Ljava8/util/function/LongConsumer;)V
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$2$1.smali
│ <font color="#06989A">@@ -23,30 +23,30 @@</font>
│  .field final synthetic val$i:I
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;I)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 152</font>
│ <font color="#4E9A06">+    .line 156</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;
│  
│      iput p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;-&gt;val$i:I
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(I)V
│      .locals 6
│  
│ <font color="#CC0000">-    .line 155</font>
│ <font color="#4E9A06">+    .line 159</font>
│      iget v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;-&gt;val$i:I
│  
│      and-int/2addr v0, p1
│  
│      if-nez v0, :cond_0
│  
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;
│ <font color="#06989A">@@ -59,15 +59,15 @@</font>
│  
│      invoke-virtual {v0, v1}, Ljava/util/LinkedList;-&gt;contains(Ljava/lang/Object;)Z
│  
│      move-result v0
│  
│      if-eqz v0, :cond_0
│  
│ <font color="#CC0000">-    .line 156</font>
│ <font color="#4E9A06">+    .line 160</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iget-object v1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;
│  
│      iget-object v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;val$mat:Ljava/util/Map;
│ <font color="#06989A">@@ -76,22 +76,22 @@</font>
│  
│      int-to-long v2, v2
│  
│      int-to-long v4, p1
│  
│      add-long/2addr v2, v4
│  
│ <font color="#CC0000">-    .line 157</font>
│ <font color="#CC0000">-    invoke-static {v0, v1, v2, v3}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$000(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;J)Ljava/util/List;</font>
│ <font color="#4E9A06">+    .line 161</font>
│ <font color="#4E9A06">+    invoke-static {v0, v1, v2, v3}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$100(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;J)Ljava/util/List;</font>
│  
│      move-result-object v0
│  
│      const/4 v1, 0x2
│  
│ <font color="#CC0000">-    .line 158</font>
│ <font color="#4E9A06">+    .line 162</font>
│      new-array v1, v1, [I
│  
│      const/4 v2, 0x0
│  
│      iget v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2$1;-&gt;val$i:I
│  
│      aput v3, v1, v2
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$5.smali
│ <font color="#06989A">@@ -41,15 +41,15 @@</font>
│  .field final synthetic val$pt:Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;JJLjava/util/Map;Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 510</font>
│ <font color="#4E9A06">+    .line 521</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iput-wide p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;val$ir:J
│  
│      iput-wide p4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;val$il:J
│  
│      iput-object p6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;val$dLinks:Ljava/util/Map;
│ <font color="#06989A">@@ -62,15 +62,15 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 510</font>
│ <font color="#4E9A06">+    .line 521</font>
│      check-cast p1, Ljava/util/Map$Entry;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;accept(Ljava/util/Map$Entry;)V
│  
│      return-void
│  .end method
│  
│ <font color="#06989A">@@ -83,65 +83,65 @@</font>
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;[I&gt;;&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 513</font>
│ <font color="#4E9A06">+    .line 524</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/lang/Long;
│  
│      invoke-virtual {v0}, Ljava/lang/Long;-&gt;longValue()J
│  
│      move-result-wide v0
│  
│ <font color="#CC0000">-    .line 514</font>
│ <font color="#4E9A06">+    .line 525</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava/util/Map;
│  
│      const/4 v2, 0x2
│  
│ <font color="#CC0000">-    .line 515</font>
│ <font color="#4E9A06">+    .line 526</font>
│      new-array v2, v2, [J
│  
│      iget-wide v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;val$ir:J
│  
│      const/4 v5, 0x0
│  
│      aput-wide v3, v2, v5
│  
│      const/4 v3, 0x1
│  
│      aput-wide v0, v2, v3
│  
│ <font color="#CC0000">-    .line 518</font>
│ <font color="#4E9A06">+    .line 529</font>
│      invoke-interface {p1}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;
│  
│      move-result-object p1
│  
│      invoke-static {p1}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 519</font>
│ <font color="#4E9A06">+    .line 530</font>
│      invoke-interface {p1}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava8/util/stream/Stream;
│  
│      new-instance v3, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;
│  
│      invoke-direct {v3, p0, v2, v0, v1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;[JJ)V
│  
│ <font color="#CC0000">-    .line 520</font>
│ <font color="#4E9A06">+    .line 531</font>
│      invoke-interface {p1, v3}, Ljava8/util/stream/Stream;-&gt;forEach(Ljava8/util/function/Consumer;)V
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask.smali
│ <font color="#06989A">@@ -46,58 +46,58 @@</font>
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;[I&gt;;&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 251</font>
│ <font color="#4E9A06">+    .line 260</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 252</font>
│ <font color="#4E9A06">+    .line 261</font>
│      iput p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;idxIl:I
│  
│ <font color="#CC0000">-    .line 253</font>
│ <font color="#4E9A06">+    .line 262</font>
│      iput-wide p3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;il:J
│  
│ <font color="#CC0000">-    .line 254</font>
│ <font color="#4E9A06">+    .line 263</font>
│      iput-wide p5, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;ir:J
│  
│ <font color="#CC0000">-    .line 255</font>
│ <font color="#4E9A06">+    .line 264</font>
│      iput-object p7, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;dOut:Ljava/util/Map;
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public getIdxIl()I
│      .locals 1
│  
│ <font color="#CC0000">-    .line 259</font>
│ <font color="#4E9A06">+    .line 268</font>
│      iget v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;idxIl:I
│  
│      return v0
│  .end method
│  
│  .method public getIl()J
│      .locals 2
│  
│ <font color="#CC0000">-    .line 267</font>
│ <font color="#4E9A06">+    .line 276</font>
│      iget-wide v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;il:J
│  
│      return-wide v0
│  .end method
│  
│  .method public getIr()J
│      .locals 2
│  
│ <font color="#CC0000">-    .line 271</font>
│ <font color="#4E9A06">+    .line 280</font>
│      iget-wide v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;ir:J
│  
│      return-wide v0
│  .end method
│  
│  .method public getdOut()Ljava/util/Map;
│      .locals 1
│ <font color="#06989A">@@ -108,21 +108,21 @@</font>
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;[I&gt;;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 275</font>
│ <font color="#4E9A06">+    .line 284</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;dOut:Ljava/util/Map;
│  
│      return-object v0
│  .end method
│  
│  .method public setIdxIl(I)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 263</font>
│ <font color="#4E9A06">+    .line 272</font>
│      iput p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;idxIl:I
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1.smali
│ <font color="#06989A">@@ -23,30 +23,30 @@</font>
│  .field final synthetic val$i:J
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;J)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 477</font>
│ <font color="#4E9A06">+    .line 488</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;-&gt;this$3:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;
│  
│      iput-wide p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;-&gt;val$i:J
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(J)V
│      .locals 5
│  
│ <font color="#CC0000">-    .line 480</font>
│ <font color="#4E9A06">+    .line 491</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;-&gt;this$3:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$links:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│ <font color="#06989A">@@ -59,39 +59,39 @@</font>
│  
│      check-cast v0, Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      invoke-interface {v0, p1, p2}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;getInt(J)I
│  
│      move-result v0
│  
│ <font color="#CC0000">-    .line 481</font>
│ <font color="#4E9A06">+    .line 492</font>
│      iget-object v1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;-&gt;this$3:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;
│  
│      iget-object v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;
│  
│      iget-object v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;
│  
│      iget-object v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$links:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      iget-wide v2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;-&gt;val$i:J
│  
│ <font color="#CC0000">-    .line 482</font>
│ <font color="#4E9A06">+    .line 493</font>
│      invoke-interface {v1, v2, v3}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object v1
│  
│      check-cast v1, Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      iget-object v2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;-&gt;this$3:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;
│  
│      iget-object v2, v2, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;val$linkCmbn:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      iget-wide v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;-&gt;val$i:J
│  
│ <font color="#CC0000">-    .line 486</font>
│ <font color="#4E9A06">+    .line 497</font>
│      invoke-interface {v2, v3, v4}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object v2
│  
│      check-cast v2, Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      invoke-interface {v2, p1, p2}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;getInt(J)I
│ <font color="#06989A">@@ -102,12 +102,12 @@</font>
│  
│      iget v3, v3, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;val$mult:I
│  
│      mul-int v2, v2, v3
│  
│      add-int/2addr v0, v2
│  
│ <font color="#CC0000">-    .line 483</font>
│ <font color="#4E9A06">+    .line 494</font>
│      invoke-interface {v1, p1, p2, v0}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;set(JI)I
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$3.smali
│ <font color="#06989A">@@ -40,15 +40,15 @@</font>
│  .field final synthetic val$matCmbn:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;Lit/unimi/dsi/fastutil/objects/ObjectBigList;Lcom/samourai/boltzmann/aggregator/TxosAggregates;Lit/unimi/dsi/fastutil/ints/IntBigList;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 202</font>
│ <font color="#4E9A06">+    .line 211</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iput-object p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$aggMatches:Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;
│  
│      iput-object p3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$matCmbn:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      iput-object p4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$allAgg:Lcom/samourai/boltzmann/aggregator/TxosAggregates;
│ <font color="#06989A">@@ -61,15 +61,15 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 202</font>
│ <font color="#4E9A06">+    .line 211</font>
│      check-cast p1, Ljava/util/Map$Entry;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;accept(Ljava/util/Map$Entry;)V
│  
│      return-void
│  .end method
│  
│ <font color="#06989A">@@ -81,37 +81,37 @@</font>
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;Ljava/lang/Integer;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 205</font>
│ <font color="#4E9A06">+    .line 214</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/lang/Integer;
│  
│      invoke-virtual {v0}, Ljava/lang/Integer;-&gt;intValue()I
│  
│      move-result v0
│  
│ <font color="#CC0000">-    .line 206</font>
│ <font color="#4E9A06">+    .line 215</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava/lang/Long;
│  
│      invoke-virtual {p1}, Ljava/lang/Long;-&gt;longValue()J
│  
│      move-result-wide v1
│  
│ <font color="#CC0000">-    .line 208</font>
│ <font color="#4E9A06">+    .line 217</font>
│      iget-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;val$aggMatches:Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;
│  
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;getValToMatchOutAgg()Ljava/util/Map;
│  
│      move-result-object p1
│  
│      invoke-static {v1, v2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│ <font color="#06989A">@@ -124,23 +124,23 @@</font>
│  
│      check-cast p1, Ljava/util/Collection;
│  
│      invoke-static {p1}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 209</font>
│ <font color="#4E9A06">+    .line 218</font>
│      invoke-interface {p1}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava8/util/stream/Stream;
│  
│      new-instance v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;
│  
│      invoke-direct {v1, p0, v0}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;I)V
│  
│ <font color="#CC0000">-    .line 210</font>
│ <font color="#4E9A06">+    .line 219</font>
│      invoke-interface {p1, v1}, Ljava8/util/stream/Stream;-&gt;forEach(Ljava8/util/function/Consumer;)V
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$6$1.smali
│ <font color="#06989A">@@ -29,40 +29,40 @@</font>
│  .field final synthetic this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 594</font>
│ <font color="#4E9A06">+    .line 605</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic applyAsInt(Ljava/lang/Object;)I
│      .locals 0
│  
│ <font color="#CC0000">-    .line 594</font>
│ <font color="#4E9A06">+    .line 605</font>
│      check-cast p1, [I
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$1;-&gt;applyAsInt([I)I
│  
│      move-result p1
│  
│      return p1
│  .end method
│  
│  .method public applyAsInt([I)I
│      .locals 1
│  
│      const/4 v0, 0x0
│  
│ <font color="#CC0000">-    .line 597</font>
│ <font color="#4E9A06">+    .line 608</font>
│      aget p1, p1, v0
│  
│      return p1
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator.smali
│ <font color="#06989A">@@ -36,46 +36,55 @@</font>
│  
│      .line 20
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│ <font color="#CC0000">-.method static synthetic access$000(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;J)Ljava/util/List;</font>
│ <font color="#4E9A06">+.method static synthetic access$000()Lorg/slf4j/Logger;</font>
│ <font color="#4E9A06">+    .locals 1</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    .line 17</font>
│ <font color="#4E9A06">+    sget-object v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    return-object v0</font>
│ <font color="#4E9A06">+.end method</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+.method static synthetic access$100(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;J)Ljava/util/List;</font>
│      .locals 0
│  
│      .line 17
│      invoke-direct {p0, p1, p2, p3}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;createLine(Ljava/util/Map;J)Ljava/util/List;
│  
│      move-result-object p0
│  
│      return-object p0
│  .end method
│  
│ <font color="#CC0000">-.method static synthetic access$100(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+.method static synthetic access$200(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│      .locals 0
│  
│      .line 17
│      invoke-direct/range {p0 .. p6}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;updateLinkCmbn(Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object p0
│  
│      return-object p0
│  .end method
│  
│ <font color="#CC0000">-.method static synthetic access$200(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[JILjava/util/Map;)V</font>
│ <font color="#4E9A06">+.method static synthetic access$300(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[JILjava/util/Map;)V</font>
│      .locals 0
│  
│      .line 17
│      invoke-direct {p0, p1, p2, p3}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;addDLinkLine([JILjava/util/Map;)V
│  
│      return-void
│  .end method
│  
│ <font color="#CC0000">-.method static synthetic access$300(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;J)Ljava/util/Map;</font>
│ <font color="#4E9A06">+.method static synthetic access$400(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;J)Ljava/util/Map;</font>
│      .locals 0
│  
│      .line 17
│      invoke-direct {p0, p1, p2, p3}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;ndOutLine(Ljava/util/Map;J)Ljava/util/Map;
│  
│      move-result-object p0
│  
│ <font color="#06989A">@@ -96,15 +105,15 @@</font>
│          }
│      .end annotation
│  
│      monitor-enter p0
│  
│      const/4 v0, 0x0
│  
│ <font color="#CC0000">-    .line 558</font>
│ <font color="#4E9A06">+    .line 569</font>
│      :try_start_0
│      aget-wide v1, p1, v0
│  
│      invoke-static {v1, v2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v1
│  
│ <font color="#06989A">@@ -112,52 +121,52 @@</font>
│  
│      move-result-object v1
│  
│      check-cast v1, Ljava/util/Map;
│  
│      if-nez v1, :cond_0
│  
│ <font color="#CC0000">-    .line 560</font>
│ <font color="#4E9A06">+    .line 571</font>
│      new-instance v1, Ljava/util/LinkedHashMap;
│  
│      invoke-direct {v1}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 561</font>
│ <font color="#4E9A06">+    .line 572</font>
│      aget-wide v2, p1, v0
│  
│      invoke-static {v2, v3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v2
│  
│      invoke-interface {p3, v2, v1}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
│  
│      :cond_0
│      const/4 p3, 0x1
│  
│ <font color="#CC0000">-    .line 564</font>
│ <font color="#4E9A06">+    .line 575</font>
│      aget-wide v2, p1, p3
│  
│      invoke-static {v2, v3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v2
│  
│      invoke-interface {v1, v2}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;
│  
│      move-result-object v2
│  
│      check-cast v2, Ljava/lang/Integer;
│  
│      if-nez v2, :cond_1
│  
│ <font color="#CC0000">-    .line 566</font>
│ <font color="#4E9A06">+    .line 577</font>
│      invoke-static {v0}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;
│  
│      move-result-object v2
│  
│ <font color="#CC0000">-    .line 568</font>
│ <font color="#4E9A06">+    .line 579</font>
│      :cond_1
│      aget-wide v3, p1, p3
│  
│      invoke-static {v3, v4}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object p1
│  
│ <font color="#06989A">@@ -171,23 +180,23 @@</font>
│  
│      move-result-object p2
│  
│      invoke-interface {v1, p1, p2}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
│      :try_end_0
│      .catchall {:try_start_0 .. :try_end_0} :catchall_0
│  
│ <font color="#CC0000">-    .line 569</font>
│ <font color="#4E9A06">+    .line 580</font>
│      monitor-exit p0
│  
│      return-void
│  
│      :catchall_0
│      move-exception p1
│  
│ <font color="#CC0000">-    .line 557</font>
│ <font color="#4E9A06">+    .line 568</font>
│      monitor-exit p0
│  
│      throw p1
│  .end method
│  
│  .method private declared-synchronized createLine(Ljava/util/Map;J)Ljava/util/List;
│      .locals 2
│ <font color="#06989A">@@ -201,61 +210,61 @@</font>
│              &quot;Ljava/util/List&lt;&quot;,
│              &quot;[I&gt;;&quot;
│          }
│      .end annotation
│  
│      monitor-enter p0
│  
│ <font color="#CC0000">-    .line 173</font>
│ <font color="#4E9A06">+    .line 182</font>
│      :try_start_0
│      invoke-static {p2, p3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v0
│  
│      invoke-interface {p1, v0}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/util/List;
│  
│ <font color="#CC0000">-    .line 174</font>
│ <font color="#4E9A06">+    .line 183</font>
│      invoke-static {p2, p3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v1
│  
│      invoke-interface {p1, v1}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;
│  
│      move-result-object v1
│  
│      if-nez v1, :cond_0
│  
│ <font color="#CC0000">-    .line 175</font>
│ <font color="#4E9A06">+    .line 184</font>
│      new-instance v0, Ljava/util/ArrayList;
│  
│      invoke-direct {v0}, Ljava/util/ArrayList;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 176</font>
│ <font color="#4E9A06">+    .line 185</font>
│      invoke-static {p2, p3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object p2
│  
│      invoke-interface {p1, p2, v0}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
│      :try_end_0
│      .catchall {:try_start_0 .. :try_end_0} :catchall_0
│  
│ <font color="#CC0000">-    .line 178</font>
│ <font color="#4E9A06">+    .line 187</font>
│      :cond_0
│      monitor-exit p0
│  
│      return-object v0
│  
│      :catchall_0
│      move-exception p1
│  
│ <font color="#CC0000">-    .line 172</font>
│ <font color="#4E9A06">+    .line 181</font>
│      monitor-exit p0
│  
│      throw p1
│  .end method
│  
│  .method private finalizeLinkMatrix(Lcom/samourai/boltzmann/aggregator/TxosAggregates;JJLjava/util/Map;I)Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;
│      .locals 16
│ <font color="#06989A">@@ -270,20 +279,20 @@</font>
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/lang/Integer;&quot;,
│              &quot;&gt;;&gt;;I)&quot;,
│              &quot;Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 420</font>
│ <font color="#4E9A06">+    .line 430</font>
│      invoke-direct/range {p0 .. p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;newLinkCmbn(Lcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│ <font color="#CC0000">-    move-result-object v8</font>
│ <font color="#4E9A06">+    move-result-object v7</font>
│  
│ <font color="#CC0000">-    .line 423</font>
│ <font color="#4E9A06">+    .line 433</font>
│      new-instance v0, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v0}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v1, &quot;Filling matrix for allAgg... &quot;
│  
│      invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│ <font color="#06989A">@@ -302,117 +311,94 @@</font>
│  
│      invoke-virtual {v0}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v0
│  
│      invoke-static {v0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 424</font>
│ <font color="#CC0000">-    invoke-static {v8}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;clone(Lit/unimi/dsi/fastutil/objects/ObjectBigList;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object/from16 v9, p0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object v10, v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide/from16 v11, p2</font>
│ <font color="#4E9A06">+    .line 434</font>
│ <font color="#4E9A06">+    invoke-static {v7}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;clone(Lit/unimi/dsi/fastutil/objects/ObjectBigList;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v13, p4</font>
│ <font color="#4E9A06">+    move-result-object v15</font>
│  
│ <font color="#CC0000">-    move-object/from16 v15, p1</font>
│ <font color="#4E9A06">+    move-object/from16 v8, p0</font>
│  
│ <font color="#CC0000">-    .line 425</font>
│ <font color="#CC0000">-    invoke-direct/range {v9 .. v15}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;updateLinkCmbn(Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+    move-object v9, v15</font>
│  
│ <font color="#CC0000">-    const/4 v0, 0x1</font>
│ <font color="#4E9A06">+    move-wide/from16 v10, p2</font>
│  
│ <font color="#CC0000">-    add-int/lit8 v11, p7, 0x1</font>
│ <font color="#4E9A06">+    move-wide/from16 v12, p4</font>
│  
│ <font color="#CC0000">-    .line 428</font>
│ <font color="#CC0000">-    invoke-interface {v6}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;size64()J</font>
│ <font color="#4E9A06">+    move-object/from16 v14, p1</font>
│  
│ <font color="#CC0000">-    move-result-wide v4</font>
│ <font color="#4E9A06">+    .line 435</font>
│ <font color="#4E9A06">+    invoke-direct/range {v8 .. v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;updateLinkCmbn(Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│ <font color="#CC0000">-    const-wide/16 v1, 0x0</font>
│ <font color="#4E9A06">+    add-int/lit8 v10, p7, 0x1</font>
│  
│ <font color="#CC0000">-    .line 429</font>
│ <font color="#CC0000">-    invoke-interface {v6, v1, v2}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    .line 438</font>
│ <font color="#4E9A06">+    invoke-interface {v15}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;size64()J</font>
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-wide v3</font>
│  
│ <font color="#CC0000">-    check-cast v3, Lit/unimi/dsi/fastutil/ints/IntBigList;</font>
│ <font color="#4E9A06">+    const-wide/16 v0, 0x0</font>
│  
│ <font color="#CC0000">-    invoke-interface {v3}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;size64()J</font>
│ <font color="#4E9A06">+    .line 439</font>
│ <font color="#4E9A06">+    invoke-interface {v15, v0, v1}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-wide v9</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    .line 433</font>
│ <font color="#CC0000">-    new-array v3, v0, [J</font>
│ <font color="#4E9A06">+    check-cast v0, Lit/unimi/dsi/fastutil/ints/IntBigList;</font>
│  
│ <font color="#CC0000">-    const/4 v0, 0x0</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;size64()J</font>
│  
│ <font color="#CC0000">-    aput-wide v1, v3, v0</font>
│ <font color="#4E9A06">+    move-result-wide v5</font>
│  
│ <font color="#CC0000">-    .line 434</font>
│ <font color="#4E9A06">+    .line 442</font>
│      invoke-interface/range {p6 .. p6}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;
│  
│      move-result-object v0
│  
│      invoke-static {v0}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 435</font>
│ <font color="#4E9A06">+    .line 443</font>
│      invoke-interface {v0}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    move-object v12, v0</font>
│ <font color="#4E9A06">+    move-object v11, v0</font>
│  
│ <font color="#CC0000">-    check-cast v12, Ljava8/util/stream/Stream;</font>
│ <font color="#4E9A06">+    check-cast v11, Ljava8/util/stream/Stream;</font>
│  
│ <font color="#CC0000">-    new-instance v13, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;</font>
│ <font color="#4E9A06">+    new-instance v12, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;</font>
│  
│ <font color="#CC0000">-    move-object v0, v13</font>
│ <font color="#4E9A06">+    move-object v0, v12</font>
│  
│      move-object/from16 v1, p0
│  
│ <font color="#CC0000">-    move-object v2, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object/from16 v3, p6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object v14, v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v6, v9</font>
│ <font color="#4E9A06">+    move-object/from16 v2, p6</font>
│  
│ <font color="#CC0000">-    move-object/from16 v9, p1</font>
│ <font color="#4E9A06">+    move-object/from16 v8, p1</font>
│  
│ <font color="#CC0000">-    move-object v10, v14</font>
│ <font color="#4E9A06">+    invoke-direct/range {v0 .. v9}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;JJLit/unimi/dsi/fastutil/objects/ObjectBigList;Lcom/samourai/boltzmann/aggregator/TxosAggregates;Lit/unimi/dsi/fastutil/objects/ObjectBigList;)V</font>
│  
│ <font color="#CC0000">-    invoke-direct/range {v0 .. v10}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[JLjava/util/Map;JJLit/unimi/dsi/fastutil/objects/ObjectBigList;Lcom/samourai/boltzmann/aggregator/TxosAggregates;Lit/unimi/dsi/fastutil/objects/ObjectBigList;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 436</font>
│ <font color="#CC0000">-    invoke-interface {v12, v13}, Ljava8/util/stream/Stream;-&gt;forEachOrdered(Ljava8/util/function/Consumer;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v0, &quot;finalizeLinkMatrix&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 495</font>
│ <font color="#CC0000">-    invoke-interface/range {p6 .. p6}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result v1</font>
│ <font color="#4E9A06">+    .line 444</font>
│ <font color="#4E9A06">+    invoke-interface {v11, v12}, Ljava8/util/stream/Stream;-&gt;forEachOrdered(Ljava8/util/function/Consumer;)V</font>
│  
│ <font color="#CC0000">-    int-to-long v1, v1</font>
│ <font color="#4E9A06">+    const-string v0, &quot;Filling matrix DONE&quot;</font>
│  
│ <font color="#CC0000">-    invoke-static {v0, v1, v2}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgressDone(Ljava/lang/String;J)V</font>
│ <font color="#4E9A06">+    .line 506</font>
│ <font color="#4E9A06">+    invoke-static {v0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    .line 496</font>
│ <font color="#4E9A06">+    .line 507</font>
│      new-instance v0, Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;
│  
│ <font color="#CC0000">-    invoke-direct {v0, v11, v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;-&gt;&lt;init&gt;(ILit/unimi/dsi/fastutil/objects/ObjectBigList;)V</font>
│ <font color="#4E9A06">+    invoke-direct {v0, v10, v15}, Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;-&gt;&lt;init&gt;(ILit/unimi/dsi/fastutil/objects/ObjectBigList;)V</font>
│  
│      return-object v0
│  .end method
│  
│  .method private declared-synchronized ndOutLine(Ljava/util/Map;J)Ljava/util/Map;
│      .locals 1
│      .annotation system Ldalvik/annotation/Signature;
│ <font color="#06989A">@@ -427,52 +413,52 @@</font>
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;[I&gt;;&quot;
│          }
│      .end annotation
│  
│      monitor-enter p0
│  
│ <font color="#CC0000">-    .line 639</font>
│ <font color="#4E9A06">+    .line 650</font>
│      :try_start_0
│      invoke-static {p2, p3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v0
│  
│      invoke-interface {p1, v0}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/util/Map;
│  
│      if-nez v0, :cond_0
│  
│ <font color="#CC0000">-    .line 641</font>
│ <font color="#4E9A06">+    .line 652</font>
│      new-instance v0, Ljava/util/LinkedHashMap;
│  
│      invoke-direct {v0}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 642</font>
│ <font color="#4E9A06">+    .line 653</font>
│      invoke-static {p2, p3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object p2
│  
│      invoke-interface {p1, p2, v0}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
│      :try_end_0
│      .catchall {:try_start_0 .. :try_end_0} :catchall_0
│  
│ <font color="#CC0000">-    .line 644</font>
│ <font color="#4E9A06">+    .line 655</font>
│      :cond_0
│      monitor-exit p0
│  
│      return-object v0
│  
│      :catchall_0
│      move-exception p1
│  
│ <font color="#CC0000">-    .line 638</font>
│ <font color="#4E9A06">+    .line 649</font>
│      monitor-exit p0
│  
│      throw p1
│  .end method
│  
│  .method private newLinkCmbn(Lcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│      .locals 9
│ <font color="#06989A">@@ -483,15 +469,15 @@</font>
│              &quot;)&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;Lit/unimi/dsi/fastutil/ints/IntBigList;&quot;,
│              &quot;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 654</font>
│ <font color="#4E9A06">+    .line 665</font>
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregates;-&gt;getOutAgg()Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;
│  
│      move-result-object v0
│  
│      invoke-virtual {v0}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;-&gt;getAllAggIndexes()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v0
│ <font color="#06989A">@@ -514,15 +500,15 @@</font>
│  
│      invoke-interface {v0}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;
│  
│      move-result-object v5
│  
│      check-cast v5, [J
│  
│ <font color="#CC0000">-    .line 655</font>
│ <font color="#4E9A06">+    .line 666</font>
│      invoke-static {v5}, Ljava8/util/stream/LongStreams;-&gt;of([J)Ljava8/util/stream/LongStream;
│  
│      move-result-object v5
│  
│      invoke-interface {v5}, Ljava8/util/stream/LongStream;-&gt;max()Ljava8/util/OptionalLong;
│  
│      move-result-object v5
│ <font color="#06989A">@@ -535,15 +521,15 @@</font>
│  
│      if-lez v7, :cond_0
│  
│      move-wide v3, v5
│  
│      goto :goto_0
│  
│ <font color="#CC0000">-    .line 662</font>
│ <font color="#4E9A06">+    .line 673</font>
│      :cond_1
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregates;-&gt;getInAgg()Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;
│  
│      move-result-object p1
│  
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;-&gt;getAllAggIndexes()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│ <font color="#06989A">@@ -565,15 +551,15 @@</font>
│  
│      invoke-interface {p1}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, [J
│  
│ <font color="#CC0000">-    .line 663</font>
│ <font color="#4E9A06">+    .line 674</font>
│      invoke-static {v0}, Ljava8/util/stream/LongStreams;-&gt;of([J)Ljava8/util/stream/LongStream;
│  
│      move-result-object v0
│  
│      invoke-interface {v0}, Ljava8/util/stream/LongStream;-&gt;max()Ljava8/util/OptionalLong;
│  
│      move-result-object v0
│ <font color="#06989A">@@ -595,15 +581,15 @@</font>
│  
│      add-long/2addr v3, v0
│  
│      add-long/2addr v5, v0
│  
│      const/4 p1, 0x0
│  
│ <font color="#CC0000">-    .line 672</font>
│ <font color="#4E9A06">+    .line 683</font>
│      invoke-static {v3, v4, v5, v6, p1}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;newIntMatrix(JJI)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object p1
│  
│      return-object p1
│  .end method
│  
│ <font color="#06989A">@@ -619,38 +605,38 @@</font>
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/lang/Integer;&quot;,
│              &quot;&gt;;&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 505</font>
│ <font color="#4E9A06">+    .line 516</font>
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIl()J
│  
│      move-result-wide v4
│  
│ <font color="#CC0000">-    .line 506</font>
│ <font color="#4E9A06">+    .line 517</font>
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIr()J
│  
│      move-result-wide v2
│  
│ <font color="#CC0000">-    .line 507</font>
│ <font color="#4E9A06">+    .line 518</font>
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getdOut()Ljava/util/Map;
│  
│      move-result-object p1
│  
│      invoke-interface {p1}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;
│  
│      move-result-object p1
│  
│      invoke-static {p1}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 508</font>
│ <font color="#4E9A06">+    .line 519</font>
│      invoke-interface {p1}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava8/util/stream/Stream;
│  
│      new-instance v8, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;
│ <font color="#06989A">@@ -661,15 +647,15 @@</font>
│  
│      move-object v6, p3
│  
│      move-object v7, p2
│  
│      invoke-direct/range {v0 .. v7}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;JJLjava/util/Map;Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;)V
│  
│ <font color="#CC0000">-    .line 509</font>
│ <font color="#4E9A06">+    .line 520</font>
│      invoke-interface {p1, v8}, Ljava8/util/stream/Stream;-&gt;forEachOrdered(Ljava8/util/function/Consumer;)V
│  
│      return-void
│  .end method
│  
│  .method private runTask(IILcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;JLjava/util/Map;)Ljava/util/Map;
│      .locals 11
│ <font color="#06989A">@@ -687,29 +673,29 @@</font>
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;[I&gt;;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 577</font>
│ <font color="#4E9A06">+    .line 588</font>
│      new-instance v8, Ljava/util/LinkedHashMap;
│  
│      invoke-direct {v8}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 580</font>
│ <font color="#4E9A06">+    .line 591</font>
│      invoke-interface/range {p6 .. p6}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;
│  
│      move-result-object v0
│  
│      invoke-static {v0}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 581</font>
│ <font color="#4E9A06">+    .line 592</font>
│      invoke-interface {v0}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object v0
│  
│      move-object v9, v0
│  
│      check-cast v9, Ljava8/util/stream/Stream;
│ <font color="#06989A">@@ -728,15 +714,15 @@</font>
│  
│      move v6, p2
│  
│      move-object v7, v8
│  
│      invoke-direct/range {v0 .. v7}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;JLcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;IILjava/util/Map;)V
│  
│ <font color="#CC0000">-    .line 582</font>
│ <font color="#4E9A06">+    .line 593</font>
│      invoke-interface {v9, v10}, Ljava8/util/stream/Stream;-&gt;forEachOrdered(Ljava8/util/function/Consumer;)V
│  
│      return-object v8
│  .end method
│  
│  .method private updateLinkCmbn(Lit/unimi/dsi/fastutil/objects/ObjectBigList;JJLcom/samourai/boltzmann/aggregator/TxosAggregates;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│      .locals 7
│ <font color="#06989A">@@ -750,78 +736,78 @@</font>
│              &quot;)&quot;,
│              &quot;Lit/unimi/dsi/fastutil/objects/ObjectBigList&lt;&quot;,
│              &quot;Lit/unimi/dsi/fastutil/ints/IntBigList;&quot;,
│              &quot;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 686</font>
│ <font color="#4E9A06">+    .line 697</font>
│      invoke-virtual {p6}, Lcom/samourai/boltzmann/aggregator/TxosAggregates;-&gt;getOutAgg()Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;
│  
│      move-result-object v0
│  
│      invoke-virtual {v0}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;-&gt;getAllAggIndexes()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v0
│  
│      invoke-interface {v0, p4, p5}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object p4
│  
│      check-cast p4, [J
│  
│ <font color="#CC0000">-    .line 687</font>
│ <font color="#4E9A06">+    .line 698</font>
│      invoke-virtual {p6}, Lcom/samourai/boltzmann/aggregator/TxosAggregates;-&gt;getInAgg()Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;
│  
│      move-result-object p5
│  
│      invoke-virtual {p5}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;-&gt;getAllAggIndexes()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object p5
│  
│      invoke-interface {p5, p2, p3}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object p2
│  
│      check-cast p2, [J
│  
│ <font color="#CC0000">-    .line 689</font>
│ <font color="#4E9A06">+    .line 700</font>
│      array-length p3, p2
│  
│      const/4 p5, 0x0
│  
│      const/4 p6, 0x0
│  
│      :goto_0
│      if-ge p6, p3, :cond_1
│  
│      aget-wide v0, p2, p6
│  
│ <font color="#CC0000">-    .line 690</font>
│ <font color="#4E9A06">+    .line 701</font>
│      array-length v2, p4
│  
│      const/4 v3, 0x0
│  
│      :goto_1
│      if-ge v3, v2, :cond_0
│  
│      aget-wide v4, p4, v3
│  
│ <font color="#CC0000">-    .line 691</font>
│ <font color="#4E9A06">+    .line 702</font>
│      invoke-interface {p1, v4, v5}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object v6
│  
│      check-cast v6, Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      invoke-interface {v6, v0, v1}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;getInt(J)I
│  
│      move-result v6
│  
│ <font color="#CC0000">-    .line 692</font>
│ <font color="#4E9A06">+    .line 703</font>
│      invoke-interface {p1, v4, v5}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object v4
│  
│      check-cast v4, Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      add-int/lit8 v6, v6, 0x1
│ <font color="#06989A">@@ -853,42 +839,42 @@</font>
│              &quot;Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;&quot;,
│              &quot;)&quot;,
│              &quot;Ljava/util/Set&lt;&quot;,
│              &quot;[J&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 188</font>
│ <font color="#4E9A06">+    .line 197</font>
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getInputs()Ljava/util/Map;
│  
│      move-result-object v0
│  
│      invoke-interface {v0}, Ljava/util/Map;-&gt;size()I
│  
│      move-result v0
│  
│ <font color="#CC0000">-    .line 189</font>
│ <font color="#4E9A06">+    .line 198</font>
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getOutputs()Ljava/util/Map;
│  
│      move-result-object p1
│  
│      invoke-interface {p1}, Ljava/util/Map;-&gt;size()I
│  
│      move-result p1
│  
│ <font color="#CC0000">-    .line 191</font>
│ <font color="#4E9A06">+    .line 200</font>
│      sget-object v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;
│  
│      invoke-interface {v1}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z
│  
│      move-result v1
│  
│      if-eqz v1, :cond_0
│  
│ <font color="#CC0000">-    .line 192</font>
│ <font color="#4E9A06">+    .line 201</font>
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Checking deterministic links: &quot;
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│ <font color="#06989A">@@ -910,38 +896,38 @@</font>
│      :cond_0
│      int-to-long v1, p1
│  
│      int-to-long v3, v0
│  
│      const/4 p1, 0x0
│  
│ <font color="#CC0000">-    .line 195</font>
│ <font color="#4E9A06">+    .line 204</font>
│      invoke-static {v1, v2, v3, v4, p1}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;newIntMatrix(JJI)Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 197</font>
│ <font color="#4E9A06">+    .line 206</font>
│      invoke-static {v3, v4, p1}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;newIntBigList(JI)Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 199</font>
│ <font color="#4E9A06">+    .line 208</font>
│      invoke-virtual {p3}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;getMatchInAggToVal()Ljava/util/Map;
│  
│      move-result-object v1
│  
│      invoke-interface {v1}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;
│  
│      move-result-object v1
│  
│      invoke-static {v1}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object v1
│  
│ <font color="#CC0000">-    .line 200</font>
│ <font color="#4E9A06">+    .line 209</font>
│      invoke-interface {v1}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object v1
│  
│      check-cast v1, Ljava8/util/stream/Stream;
│  
│      new-instance v2, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;
│ <font color="#06989A">@@ -956,39 +942,39 @@</font>
│  
│      move-object v9, p2
│  
│      move-object v10, p1
│  
│      invoke-direct/range {v5 .. v10}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$3;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;Lit/unimi/dsi/fastutil/objects/ObjectBigList;Lcom/samourai/boltzmann/aggregator/TxosAggregates;Lit/unimi/dsi/fastutil/ints/IntBigList;)V
│  
│ <font color="#CC0000">-    .line 201</font>
│ <font color="#4E9A06">+    .line 210</font>
│      invoke-interface {v1, v2}, Ljava8/util/stream/Stream;-&gt;forEach(Ljava8/util/function/Consumer;)V
│  
│      const-wide/16 p2, 0x0
│  
│ <font color="#CC0000">-    .line 237</font>
│ <font color="#4E9A06">+    .line 246</font>
│      invoke-interface {p1, p2, p3}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;getInt(J)I
│  
│      move-result p1
│  
│ <font color="#CC0000">-    .line 238</font>
│ <font color="#4E9A06">+    .line 247</font>
│      invoke-virtual {p0, v0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;findDtrmLinks(Lit/unimi/dsi/fastutil/objects/ObjectBigList;I)Ljava/util/Set;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 239</font>
│ <font color="#4E9A06">+    .line 248</font>
│      sget-object p2, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;
│  
│      invoke-interface {p2}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z
│  
│      move-result p2
│  
│      if-eqz p2, :cond_1
│  
│ <font color="#CC0000">-    .line 240</font>
│ <font color="#4E9A06">+    .line 249</font>
│      new-instance p2, Ljava/lang/StringBuilder;
│  
│      invoke-direct {p2}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      invoke-interface {p1}, Ljava/util/Set;-&gt;size()I
│  
│      move-result p3
│ <font color="#06989A">@@ -1006,149 +992,151 @@</font>
│      invoke-static {p2}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V
│  
│      :cond_1
│      return-object p1
│  .end method
│  
│  .method public computeInAggCmbn(Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;)Ljava/util/Map;
│ <font color="#CC0000">-    .locals 5</font>
│ <font color="#4E9A06">+    .locals 4</font>
│      .annotation system Ldalvik/annotation/Signature;
│          value = {
│              &quot;(&quot;,
│              &quot;Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;&quot;,
│              &quot;)&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/util/List&lt;&quot;,
│              &quot;[I&gt;;&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 128</font>
│ <font color="#4E9A06">+    .line 133</font>
│      new-instance v0, Ljava/util/LinkedList;
│  
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;getAllMatchInAgg()Ljava/util/List;
│  
│      move-result-object p1
│  
│      invoke-direct {v0, p1}, Ljava/util/LinkedList;-&gt;&lt;init&gt;(Ljava/util/Collection;)V
│  
│ <font color="#CC0000">-    .line 129</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Ljava/util/LinkedList;-&gt;pollFirst()Ljava/lang/Object;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 131</font>
│ <font color="#4E9A06">+    .line 134</font>
│      sget-object p1, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;
│  
│      invoke-interface {p1}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z
│  
│      move-result p1
│  
│      if-eqz p1, :cond_0
│  
│ <font color="#CC0000">-    .line 132</font>
│ <font color="#4E9A06">+    .line 135</font>
│      new-instance p1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {p1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    const-string v1, &quot;Computing combinations for &quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;Computing combinations: &quot;</font>
│  
│      invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {v0}, Ljava/util/LinkedList;-&gt;size()I
│  
│      move-result v1
│  
│      invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    const-string v1, &quot; aggregates...&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│      invoke-virtual {p1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object p1
│  
│      invoke-static {p1}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 135</font>
│ <font color="#4E9A06">+    .line 138</font>
│      :cond_0
│ <font color="#4E9A06">+    invoke-virtual {v0}, Ljava/util/LinkedList;-&gt;pollFirst()Ljava/lang/Object;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    .line 140</font>
│      new-instance p1, Ljava/util/LinkedHashMap;
│  
│      invoke-direct {p1}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 136</font>
│ <font color="#4E9A06">+    .line 141</font>
│      invoke-virtual {v0}, Ljava/util/LinkedList;-&gt;isEmpty()Z
│  
│      move-result v1
│  
│      if-nez v1, :cond_1
│  
│ <font color="#CC0000">-    .line 137</font>
│ <font color="#4E9A06">+    .line 142</font>
│      invoke-virtual {v0}, Ljava/util/LinkedList;-&gt;pollLast()Ljava/lang/Object;
│  
│      move-result-object v1
│  
│      check-cast v1, Ljava/lang/Integer;
│  
│      invoke-virtual {v1}, Ljava/lang/Integer;-&gt;intValue()I
│  
│      move-result v1
│  
│      const/4 v2, 0x0
│  
│      add-int/lit8 v3, v1, 0x1
│  
│ <font color="#CC0000">-    .line 140</font>
│ <font color="#4E9A06">+    .line 144</font>
│      invoke-static {v2, v3}, Ljava8/util/stream/IntStreams;-&gt;range(II)Ljava8/util/stream/IntStream;
│  
│      move-result-object v2
│  
│ <font color="#CC0000">-    .line 141</font>
│ <font color="#4E9A06">+    .line 145</font>
│      invoke-interface {v2}, Ljava8/util/stream/IntStream;-&gt;parallel()Ljava8/util/stream/IntStream;
│  
│      move-result-object v2
│  
│      new-instance v3, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;
│  
│      invoke-direct {v3, p0, v0, v1, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$2;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/LinkedList;ILjava/util/Map;)V
│  
│ <font color="#CC0000">-    .line 142</font>
│ <font color="#4E9A06">+    .line 146</font>
│      invoke-interface {v2, v3}, Ljava8/util/stream/IntStream;-&gt;forEachOrdered(Ljava8/util/function/IntConsumer;)V
│  
│ <font color="#CC0000">-    const-string v0, &quot;computeInAggCmbn&quot;</font>
│ <font color="#4E9A06">+    .line 175</font>
│ <font color="#4E9A06">+    :cond_1</font>
│ <font color="#4E9A06">+    sget-object v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    int-to-long v1, v1</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    .line 167</font>
│ <font color="#CC0000">-    new-instance v3, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    move-result v0</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    if-eqz v0, :cond_2</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    .line 176</font>
│ <font color="#4E9A06">+    new-instance v0, Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v3}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-direct {v0}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│  
│      invoke-interface {p1}, Ljava/util/Map;-&gt;size()I
│  
│ <font color="#CC0000">-    move-result v4</font>
│ <font color="#4E9A06">+    move-result v1</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    const-string v4, &quot; matches&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot; combinations&quot;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v3}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    invoke-static {v0, v1, v2, v3}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgressDone(Ljava/lang/String;JLjava/lang/String;)V</font>
│ <font color="#4E9A06">+    invoke-static {v0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    :cond_1</font>
│ <font color="#4E9A06">+    :cond_2</font>
│      return-object p1
│  .end method
│  
│  .method public computeLinkMatrix(Lcom/samourai/boltzmann/beans/Txos;Lcom/samourai/boltzmann/aggregator/TxosAggregates;Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;Ljava/util/Map;Ljava/lang/Integer;)Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;
│ <font color="#CC0000">-    .locals 38</font>
│ <font color="#4E9A06">+    .locals 37</font>
│      .annotation system Ldalvik/annotation/Signature;
│          value = {
│              &quot;(&quot;,
│              &quot;Lcom/samourai/boltzmann/beans/Txos;&quot;,
│              &quot;Lcom/samourai/boltzmann/aggregator/TxosAggregates;&quot;,
│              &quot;Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│ <font color="#06989A">@@ -1157,664 +1145,610 @@</font>
│              &quot;[I&gt;;&gt;;&quot;,
│              &quot;Ljava/lang/Integer;&quot;,
│              &quot;)&quot;,
│              &quot;Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    move-object/from16 v0, p4</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 294</font>
│ <font color="#4E9A06">+    .line 303</font>
│      invoke-virtual/range {p1 .. p1}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getInputs()Ljava/util/Map;
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Ljava/util/Map;-&gt;size()I</font>
│  
│ <font color="#CC0000">-    move-result v1</font>
│ <font color="#4E9A06">+    move-result v0</font>
│  
│ <font color="#CC0000">-    int-to-double v1, v1</font>
│ <font color="#4E9A06">+    int-to-double v0, v0</font>
│  
│ <font color="#CC0000">-    const-wide/high16 v3, 0x4000000000000000L    # 2.0</font>
│ <font color="#4E9A06">+    const-wide/high16 v2, 0x4000000000000000L    # 2.0</font>
│  
│ <font color="#CC0000">-    invoke-static {v3, v4, v1, v2}, Ljava/lang/Math;-&gt;pow(DD)D</font>
│ <font color="#4E9A06">+    invoke-static {v2, v3, v0, v1}, Ljava/lang/Math;-&gt;pow(DD)D</font>
│  
│ <font color="#CC0000">-    move-result-wide v1</font>
│ <font color="#4E9A06">+    move-result-wide v0</font>
│  
│ <font color="#CC0000">-    double-to-long v1, v1</font>
│ <font color="#4E9A06">+    double-to-long v0, v0</font>
│  
│ <font color="#CC0000">-    const-wide/16 v5, 0x1</font>
│ <font color="#4E9A06">+    const-wide/16 v4, 0x1</font>
│  
│ <font color="#CC0000">-    sub-long/2addr v1, v5</font>
│ <font color="#4E9A06">+    sub-long/2addr v0, v4</font>
│  
│ <font color="#CC0000">-    .line 295</font>
│ <font color="#4E9A06">+    .line 304</font>
│      invoke-virtual/range {p1 .. p1}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getOutputs()Ljava/util/Map;
│  
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v7}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    int-to-double v7, v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v3, v4, v7, v8}, Ljava/lang/Math;-&gt;pow(DD)D</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v3</font>
│ <font color="#4E9A06">+    move-result-object v6</font>
│  
│ <font color="#CC0000">-    double-to-long v3, v3</font>
│ <font color="#4E9A06">+    invoke-interface {v6}, Ljava/util/Map;-&gt;size()I</font>
│  
│ <font color="#CC0000">-    sub-long/2addr v3, v5</font>
│ <font color="#4E9A06">+    move-result v6</font>
│  
│ <font color="#CC0000">-    .line 297</font>
│ <font color="#CC0000">-    sget-object v5, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#4E9A06">+    int-to-double v6, v6</font>
│  
│ <font color="#CC0000">-    invoke-interface {v5}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│ <font color="#4E9A06">+    invoke-static {v2, v3, v6, v7}, Ljava/lang/Math;-&gt;pow(DD)D</font>
│  
│ <font color="#CC0000">-    move-result v5</font>
│ <font color="#4E9A06">+    move-result-wide v2</font>
│  
│ <font color="#CC0000">-    if-eqz v5, :cond_0</font>
│ <font color="#4E9A06">+    double-to-long v2, v2</font>
│  
│ <font color="#CC0000">-    .line 298</font>
│ <font color="#CC0000">-    new-instance v5, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    sub-long/2addr v2, v4</font>
│  
│ <font color="#CC0000">-    invoke-direct {v5}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    mul-long v4, v4, v0</font>
│  
│ <font color="#CC0000">-    const-string v6, &quot;Computing links for &quot;</font>
│ <font color="#4E9A06">+    mul-long v4, v4, v2</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    const-wide/16 v6, 0x20</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v5, v1, v2}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    .line 306</font>
│ <font color="#4E9A06">+    div-long/2addr v4, v6</font>
│  
│ <font color="#CC0000">-    const-string v6, &quot;x&quot;</font>
│ <font color="#4E9A06">+    .line 307</font>
│ <font color="#4E9A06">+    sget-object v6, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-interface {v6}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v5, v3, v4}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    move-result v6</font>
│  
│ <font color="#CC0000">-    const-string v6, &quot;...&quot;</font>
│ <font color="#4E9A06">+    if-eqz v6, :cond_0</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    .line 308</font>
│ <font color="#4E9A06">+    new-instance v6, Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v5}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-direct {v6}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    move-result-object v5</font>
│ <font color="#4E9A06">+    const-string v7, &quot;Computing link matrix: &quot;</font>
│  
│ <font color="#CC0000">-    invoke-static {v5}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    .line 301</font>
│ <font color="#CC0000">-    :cond_0</font>
│ <font color="#CC0000">-    new-instance v5, Ljava/util/LinkedHashMap;</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v0, v1}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v5}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    const-string v7, &quot;x&quot;</font>
│  
│ <font color="#CC0000">-    .line 311</font>
│ <font color="#CC0000">-    new-instance v6, Ljava/util/LinkedList;</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v6}, Ljava/util/LinkedList;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v2, v3}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    .line 314</font>
│ <font color="#CC0000">-    new-instance v14, Ljava/util/LinkedHashMap;</font>
│ <font color="#4E9A06">+    const-string v7, &quot; (&quot;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v14}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    .line 315</font>
│ <font color="#CC0000">-    new-instance v7, Ljava/util/LinkedHashMap;</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v4, v5}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v7}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    const-string v7, &quot; iters est.)&quot;</font>
│  
│ <font color="#CC0000">-    const-wide/16 v15, 0x0</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    .line 316</font>
│ <font color="#CC0000">-    invoke-static/range {v15 .. v16}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    invoke-virtual {v6}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    move-result-object v8</font>
│ <font color="#4E9A06">+    move-result-object v6</font>
│  
│ <font color="#CC0000">-    const/4 v9, 0x2</font>
│ <font color="#4E9A06">+    invoke-static {v6}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    new-array v9, v9, [I</font>
│ <font color="#4E9A06">+    .line 312</font>
│ <font color="#4E9A06">+    :cond_0</font>
│ <font color="#4E9A06">+    new-instance v14, Ljava/util/LinkedHashMap;</font>
│  
│ <font color="#CC0000">-    fill-array-data v9, :array_0</font>
│ <font color="#4E9A06">+    invoke-direct {v14}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    invoke-interface {v7, v8, v9}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    .line 322</font>
│ <font color="#4E9A06">+    new-instance v15, Ljava/util/LinkedList;</font>
│  
│ <font color="#CC0000">-    .line 317</font>
│ <font color="#CC0000">-    invoke-static {v3, v4}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    invoke-direct {v15}, Ljava/util/LinkedList;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    move-result-object v8</font>
│ <font color="#4E9A06">+    .line 325</font>
│ <font color="#4E9A06">+    new-instance v13, Ljava/util/LinkedHashMap;</font>
│  
│ <font color="#CC0000">-    invoke-interface {v14, v8, v7}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-direct {v13}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    .line 320</font>
│ <font color="#CC0000">-    new-instance v12, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;</font>
│ <font color="#4E9A06">+    .line 326</font>
│ <font color="#4E9A06">+    new-instance v6, Ljava/util/LinkedHashMap;</font>
│  
│ <font color="#CC0000">-    const/4 v9, 0x0</font>
│ <font color="#4E9A06">+    invoke-direct {v6}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    const-wide/16 v10, 0x0</font>
│ <font color="#4E9A06">+    const-wide/16 v16, 0x0</font>
│  
│ <font color="#CC0000">-    move-object v7, v12</font>
│ <font color="#4E9A06">+    .line 327</font>
│ <font color="#4E9A06">+    invoke-static/range {v16 .. v17}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    move-object/from16 v8, p0</font>
│ <font color="#4E9A06">+    move-result-object v7</font>
│  
│ <font color="#CC0000">-    move-object v15, v12</font>
│ <font color="#4E9A06">+    const/4 v8, 0x2</font>
│  
│ <font color="#CC0000">-    move-wide v12, v1</font>
│ <font color="#4E9A06">+    new-array v8, v8, [I</font>
│  
│ <font color="#CC0000">-    invoke-direct/range {v7 .. v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;IJJLjava/util/Map;)V</font>
│ <font color="#4E9A06">+    fill-array-data v8, :array_0</font>
│  
│ <font color="#CC0000">-    .line 321</font>
│ <font color="#CC0000">-    invoke-interface {v6, v15}, Ljava/util/Deque;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#4E9A06">+    invoke-interface {v6, v7, v8}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    .line 322</font>
│ <font color="#CC0000">-    invoke-virtual {v15}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIr()J</font>
│ <font color="#4E9A06">+    .line 328</font>
│ <font color="#4E9A06">+    invoke-static {v2, v3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    move-result-wide v7</font>
│ <font color="#4E9A06">+    move-result-object v7</font>
│  
│ <font color="#CC0000">-    invoke-static {v7, v8}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    invoke-interface {v13, v7, v6}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#4E9A06">+    .line 330</font>
│ <font color="#4E9A06">+    new-instance v11, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;</font>
│  
│ <font color="#CC0000">-    invoke-interface {v0, v7}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    const/4 v8, 0x0</font>
│  
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#4E9A06">+    const-wide/16 v9, 0x0</font>
│  
│ <font color="#CC0000">-    check-cast v7, Ljava/util/List;</font>
│ <font color="#4E9A06">+    move-object v6, v11</font>
│  
│ <font color="#CC0000">-    if-eqz v7, :cond_1</font>
│ <font color="#4E9A06">+    move-object/from16 v7, p0</font>
│  
│ <font color="#CC0000">-    .line 323</font>
│ <font color="#CC0000">-    invoke-interface {v7}, Ljava/util/List;-&gt;size()I</font>
│ <font color="#4E9A06">+    move-object/from16 v18, v11</font>
│  
│ <font color="#CC0000">-    move-result v7</font>
│ <font color="#4E9A06">+    move-wide v11, v0</font>
│  
│ <font color="#CC0000">-    move v13, v7</font>
│ <font color="#4E9A06">+    invoke-direct/range {v6 .. v13}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;IJJLjava/util/Map;)V</font>
│  
│ <font color="#CC0000">-    goto :goto_0</font>
│ <font color="#4E9A06">+    move-object/from16 v6, v18</font>
│  
│ <font color="#CC0000">-    :cond_1</font>
│ <font color="#CC0000">-    const/4 v13, 0x0</font>
│ <font color="#4E9A06">+    invoke-interface {v15, v6}, Ljava/util/Deque;-&gt;add(Ljava/lang/Object;)Z</font>
│  
│ <font color="#CC0000">-    .line 326</font>
│ <font color="#CC0000">-    :goto_0</font>
│ <font color="#4E9A06">+    .line 333</font>
│      invoke-static {}, Ljava/lang/System;-&gt;currentTimeMillis()J
│  
│ <font color="#CC0000">-    move-result-wide v17</font>
│ <font color="#4E9A06">+    move-result-wide v18</font>
│  
│ <font color="#CC0000">-    const/4 v7, 0x0</font>
│ <font color="#4E9A06">+    const/4 v13, 0x0</font>
│  
│ <font color="#CC0000">-    const/4 v11, 0x0</font>
│ <font color="#4E9A06">+    const/4 v12, 0x0</font>
│  
│ <font color="#CC0000">-    const/16 v16, 0x0</font>
│ <font color="#4E9A06">+    const/16 v20, 0x0</font>
│  
│ <font color="#CC0000">-    .line 332</font>
│ <font color="#CC0000">-    :goto_1</font>
│ <font color="#CC0000">-    invoke-interface {v6}, Ljava/util/Deque;-&gt;isEmpty()Z</font>
│ <font color="#4E9A06">+    .line 337</font>
│ <font color="#4E9A06">+    :goto_0</font>
│ <font color="#4E9A06">+    invoke-interface {v15}, Ljava/util/Deque;-&gt;isEmpty()Z</font>
│  
│ <font color="#CC0000">-    move-result v8</font>
│ <font color="#4E9A06">+    move-result v6</font>
│  
│ <font color="#CC0000">-    if-nez v8, :cond_a</font>
│ <font color="#4E9A06">+    if-nez v6, :cond_8</font>
│  
│ <font color="#CC0000">-    .line 334</font>
│ <font color="#4E9A06">+    .line 339</font>
│      invoke-static {}, Ljava/lang/System;-&gt;currentTimeMillis()J
│  
│ <font color="#CC0000">-    move-result-wide v8</font>
│ <font color="#4E9A06">+    move-result-wide v6</font>
│  
│ <font color="#CC0000">-    sub-long v8, v8, v17</font>
│ <font color="#4E9A06">+    sub-long v6, v6, v18</font>
│  
│ <font color="#CC0000">-    const-wide/16 v19, 0x3e8</font>
│ <font color="#4E9A06">+    const-wide/16 v8, 0x3e8</font>
│  
│ <font color="#CC0000">-    .line 335</font>
│ <font color="#CC0000">-    div-long v8, v8, v19</font>
│ <font color="#4E9A06">+    .line 340</font>
│ <font color="#4E9A06">+    div-long/2addr v6, v8</font>
│  
│ <font color="#CC0000">-    if-eqz p5, :cond_2</font>
│ <font color="#4E9A06">+    if-eqz p5, :cond_1</font>
│  
│ <font color="#CC0000">-    .line 336</font>
│ <font color="#4E9A06">+    .line 341</font>
│      invoke-virtual/range {p5 .. p5}, Ljava/lang/Integer;-&gt;intValue()I
│  
│ <font color="#CC0000">-    move-result v10</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object/from16 v21, v15</font>
│ <font color="#4E9A06">+    move-result v8</font>
│  
│ <font color="#CC0000">-    int-to-long v14, v10</font>
│ <font color="#4E9A06">+    int-to-long v8, v8</font>
│  
│ <font color="#CC0000">-    cmp-long v8, v8, v14</font>
│ <font color="#4E9A06">+    cmp-long v6, v6, v8</font>
│  
│ <font color="#CC0000">-    if-ltz v8, :cond_3</font>
│ <font color="#4E9A06">+    if-ltz v6, :cond_1</font>
│  
│ <font color="#CC0000">-    .line 337</font>
│ <font color="#4E9A06">+    .line 342</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      const-string v1, &quot;maxDuration limit reached!&quot;
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 338</font>
│ <font color="#4E9A06">+    .line 343</font>
│      new-instance v0, Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;
│  
│      const/4 v1, 0x0
│  
│ <font color="#CC0000">-    const/4 v2, 0x0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v0, v2, v1}, Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;-&gt;&lt;init&gt;(ILit/unimi/dsi/fastutil/objects/ObjectBigList;)V</font>
│ <font color="#4E9A06">+    invoke-direct {v0, v13, v1}, Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;-&gt;&lt;init&gt;(ILit/unimi/dsi/fastutil/objects/ObjectBigList;)V</font>
│  
│      return-object v0
│  
│ <font color="#CC0000">-    :cond_2</font>
│ <font color="#CC0000">-    move-object/from16 v21, v15</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 342</font>
│ <font color="#CC0000">-    :cond_3</font>
│ <font color="#CC0000">-    invoke-interface {v6}, Ljava/util/Deque;-&gt;getLast()Ljava/lang/Object;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v8</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object v14, v8</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    check-cast v14, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 343</font>
│ <font color="#CC0000">-    invoke-virtual {v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIdxIl()I</font>
│ <font color="#4E9A06">+    .line 347</font>
│ <font color="#4E9A06">+    :cond_1</font>
│ <font color="#4E9A06">+    invoke-interface {v15}, Ljava/util/Deque;-&gt;getLast()Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result v8</font>
│ <font color="#4E9A06">+    move-result-object v6</font>
│  
│ <font color="#CC0000">-    .line 346</font>
│ <font color="#CC0000">-    invoke-virtual {v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIr()J</font>
│ <font color="#4E9A06">+    move-object v10, v6</font>
│  
│ <font color="#CC0000">-    move-result-wide v9</font>
│ <font color="#4E9A06">+    check-cast v10, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;</font>
│  
│ <font color="#CC0000">-    invoke-static {v9, v10}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    .line 348</font>
│ <font color="#4E9A06">+    invoke-virtual {v10}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIdxIl()I</font>
│  
│ <font color="#CC0000">-    move-result-object v9</font>
│ <font color="#4E9A06">+    move-result v6</font>
│  
│ <font color="#CC0000">-    invoke-interface {v0, v9}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    .line 351</font>
│ <font color="#4E9A06">+    invoke-virtual {v10}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIr()J</font>
│  
│ <font color="#CC0000">-    move-result-object v9</font>
│ <font color="#4E9A06">+    move-result-wide v7</font>
│  
│ <font color="#CC0000">-    check-cast v9, Ljava/util/List;</font>
│ <font color="#4E9A06">+    invoke-static {v7, v8}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    if-eqz v9, :cond_4</font>
│ <font color="#4E9A06">+    move-result-object v7</font>
│  
│ <font color="#CC0000">-    .line 347</font>
│ <font color="#CC0000">-    invoke-interface {v9}, Ljava/util/List;-&gt;size()I</font>
│ <font color="#4E9A06">+    move-object/from16 v11, p4</font>
│  
│ <font color="#CC0000">-    move-result v10</font>
│ <font color="#4E9A06">+    invoke-interface {v11, v7}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move v15, v10</font>
│ <font color="#4E9A06">+    move-result-object v7</font>
│  
│ <font color="#CC0000">-    goto :goto_2</font>
│ <font color="#4E9A06">+    check-cast v7, Ljava/util/List;</font>
│  
│ <font color="#CC0000">-    :cond_4</font>
│ <font color="#CC0000">-    const/4 v15, 0x0</font>
│ <font color="#4E9A06">+    if-eqz v7, :cond_2</font>
│  
│ <font color="#CC0000">-    .line 349</font>
│ <font color="#CC0000">-    :goto_2</font>
│ <font color="#CC0000">-    invoke-virtual {v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIdxIl()I</font>
│ <font color="#4E9A06">+    .line 352</font>
│ <font color="#4E9A06">+    invoke-interface {v7}, Ljava/util/List;-&gt;size()I</font>
│  
│ <font color="#CC0000">-    move-result v12</font>
│ <font color="#4E9A06">+    move-result v8</font>
│  
│ <font color="#CC0000">-    const/16 v20, 0x1</font>
│ <font color="#4E9A06">+    move v9, v8</font>
│  
│ <font color="#CC0000">-    if-ge v12, v15, :cond_7</font>
│ <font color="#4E9A06">+    goto :goto_1</font>
│  
│ <font color="#CC0000">-    add-int/lit8 v10, v7, 0x1</font>
│ <font color="#4E9A06">+    :cond_2</font>
│ <font color="#4E9A06">+    const/4 v9, 0x0</font>
│  
│      .line 354
│ <font color="#CC0000">-    invoke-interface {v9, v12}, Ljava/util/List;-&gt;get(I)Ljava/lang/Object;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    check-cast v7, [I</font>
│ <font color="#4E9A06">+    :goto_1</font>
│ <font color="#4E9A06">+    invoke-virtual {v10}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIdxIl()I</font>
│  
│ <font color="#CC0000">-    aget v8, v7, v20</font>
│ <font color="#4E9A06">+    move-result v8</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v31, v1</font>
│ <font color="#4E9A06">+    const/16 v21, 0x1</font>
│  
│ <font color="#CC0000">-    int-to-long v1, v8</font>
│ <font color="#4E9A06">+    if-ge v8, v9, :cond_5</font>
│  
│ <font color="#CC0000">-    .line 357</font>
│ <font color="#CC0000">-    invoke-virtual {v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIl()J</font>
│ <font color="#4E9A06">+    .line 358</font>
│ <font color="#4E9A06">+    invoke-interface {v7, v8}, Ljava/util/List;-&gt;get(I)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-wide v23</font>
│ <font color="#4E9A06">+    move-result-object v6</font>
│  
│ <font color="#CC0000">-    cmp-long v7, v1, v23</font>
│ <font color="#4E9A06">+    check-cast v6, [I</font>
│  
│ <font color="#CC0000">-    if-lez v7, :cond_6</font>
│ <font color="#4E9A06">+    aget v6, v6, v21</font>
│  
│ <font color="#CC0000">-    .line 359</font>
│ <font color="#CC0000">-    invoke-interface {v9, v12}, Ljava/util/List;-&gt;get(I)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    move-object/from16 v31, v14</font>
│  
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#4E9A06">+    int-to-long v13, v6</font>
│  
│ <font color="#CC0000">-    check-cast v7, [I</font>
│ <font color="#4E9A06">+    .line 361</font>
│ <font color="#4E9A06">+    invoke-virtual {v10}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIl()J</font>
│  
│ <font color="#CC0000">-    const/16 v22, 0x0</font>
│ <font color="#4E9A06">+    move-result-wide v22</font>
│  
│ <font color="#CC0000">-    aget v9, v7, v22</font>
│ <font color="#4E9A06">+    cmp-long v22, v13, v22</font>
│  
│ <font color="#CC0000">-    const-string v23, &quot;computeLinkMatrix&quot;</font>
│ <font color="#4E9A06">+    if-lez v22, :cond_4</font>
│  
│      .line 363
│ <font color="#CC0000">-    invoke-virtual/range {v21 .. v21}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getIdxIl()I</font>
│ <font color="#4E9A06">+    invoke-interface {v7, v8}, Ljava/util/List;-&gt;get(I)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result v7</font>
│ <font color="#4E9A06">+    move-result-object v7</font>
│  
│ <font color="#CC0000">-    move-object/from16 v33, v6</font>
│ <font color="#4E9A06">+    check-cast v7, [I</font>
│  
│ <font color="#CC0000">-    int-to-long v6, v7</font>
│ <font color="#4E9A06">+    const/16 v30, 0x0</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v34, v1</font>
│ <font color="#4E9A06">+    aget v7, v7, v30</font>
│  
│ <font color="#CC0000">-    int-to-long v0, v13</font>
│ <font color="#4E9A06">+    .line 365</font>
│ <font color="#4E9A06">+    rem-int/lit8 v22, v12, 0x32</font>
│  
│ <font color="#CC0000">-    new-instance v2, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    if-nez v22, :cond_3</font>
│  
│ <font color="#CC0000">-    invoke-direct {v2}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    .line 366</font>
│ <font color="#4E9A06">+    sget-object v22, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v2, v10}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-interface/range {v22 .. v22}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    move/from16 v36, v9</font>
│ <font color="#4E9A06">+    move-result v22</font>
│  
│ <font color="#CC0000">-    const-string v9, &quot;/&quot;</font>
│ <font color="#4E9A06">+    if-eqz v22, :cond_3</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v2, v9}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    move/from16 v32, v6</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v2, v11}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    .line 367</font>
│ <font color="#4E9A06">+    new-instance v6, Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    const-string v9, &quot;, &quot;</font>
│ <font color="#4E9A06">+    invoke-direct {v6}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v2, v9}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    move/from16 v33, v7</font>
│  
│ <font color="#CC0000">-    .line 365</font>
│ <font color="#CC0000">-    invoke-interface {v5}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#4E9A06">+    const-string v7, &quot;Computing link matrix... Task &quot;</font>
│  
│ <font color="#CC0000">-    move-result v9</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v2, v9}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v12}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    const-string v9, &quot; dlinks&quot;</font>
│ <font color="#4E9A06">+    const-string v7, &quot;/&quot;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v2, v9}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v2}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v4, v5}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    move-result-object v28</font>
│ <font color="#4E9A06">+    const-string v7, &quot; est. (&quot;</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v24, v6</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v26, v0</font>
│ <font color="#4E9A06">+    .line 373</font>
│ <font color="#4E9A06">+    invoke-interface/range {v31 .. v31}, Ljava/util/Map;-&gt;size()I</font>
│  
│ <font color="#CC0000">-    .line 361</font>
│ <font color="#CC0000">-    invoke-static/range {v23 .. v28}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgress(Ljava/lang/String;JJLjava/lang/String;)V</font>
│ <font color="#4E9A06">+    move-result v7</font>
│  
│ <font color="#CC0000">-    .line 368</font>
│ <font color="#CC0000">-    invoke-virtual {v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getdOut()Ljava/util/Map;</font>
│ <font color="#4E9A06">+    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    move-result-object v0</font>
│ <font color="#4E9A06">+    invoke-virtual {v6}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    move-object/from16 v7, p0</font>
│ <font color="#4E9A06">+    move-result-object v6</font>
│  
│ <font color="#CC0000">-    move/from16 v1, v36</font>
│ <font color="#4E9A06">+    .line 367</font>
│ <font color="#4E9A06">+    invoke-static {v6}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    move v9, v1</font>
│ <font color="#4E9A06">+    goto :goto_2</font>
│  
│ <font color="#CC0000">-    move v2, v10</font>
│ <font color="#4E9A06">+    :cond_3</font>
│ <font color="#4E9A06">+    move/from16 v32, v6</font>
│  
│ <font color="#CC0000">-    move-object/from16 v10, p3</font>
│ <font color="#4E9A06">+    move/from16 v33, v7</font>
│  
│ <font color="#CC0000">-    move/from16 v36, v11</font>
│ <font color="#4E9A06">+    .line 378</font>
│ <font color="#4E9A06">+    :goto_2</font>
│ <font color="#4E9A06">+    invoke-virtual {v10}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getdOut()Ljava/util/Map;</font>
│  
│ <font color="#CC0000">-    move v6, v12</font>
│ <font color="#4E9A06">+    move-result-object v22</font>
│  
│ <font color="#CC0000">-    move-wide v11, v3</font>
│ <font color="#4E9A06">+    move/from16 v7, v32</font>
│  
│ <font color="#CC0000">-    move/from16 v37, v13</font>
│ <font color="#4E9A06">+    move-object/from16 v6, p0</font>
│  
│ <font color="#CC0000">-    move-object v13, v0</font>
│ <font color="#4E9A06">+    move/from16 v34, v33</font>
│  
│ <font color="#CC0000">-    invoke-direct/range {v7 .. v13}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;runTask(IILcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;JLjava/util/Map;)Ljava/util/Map;</font>
│ <font color="#4E9A06">+    move/from16 v32, v8</font>
│  
│ <font color="#CC0000">-    move-result-object v30</font>
│ <font color="#4E9A06">+    move/from16 v8, v34</font>
│  
│ <font color="#CC0000">-    add-int/lit8 v12, v6, 0x1</font>
│ <font color="#4E9A06">+    move/from16 v33, v9</font>
│  
│ <font color="#CC0000">-    .line 371</font>
│ <font color="#CC0000">-    invoke-virtual {v14, v12}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;setIdxIl(I)V</font>
│ <font color="#4E9A06">+    move-object/from16 v9, p3</font>
│  
│ <font color="#CC0000">-    add-int/lit8 v10, v2, 0x1</font>
│ <font color="#4E9A06">+    move-wide/from16 v35, v0</font>
│  
│ <font color="#CC0000">-    .line 375</font>
│ <font color="#CC0000">-    new-instance v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;</font>
│ <font color="#4E9A06">+    move-object v0, v10</font>
│  
│ <font color="#CC0000">-    const/16 v25, 0x0</font>
│ <font color="#4E9A06">+    move-wide v10, v2</font>
│  
│ <font color="#CC0000">-    int-to-long v1, v1</font>
│ <font color="#4E9A06">+    move v1, v12</font>
│  
│ <font color="#CC0000">-    move-object/from16 v23, v0</font>
│ <font color="#4E9A06">+    move-object/from16 v12, v22</font>
│  
│ <font color="#CC0000">-    move-object/from16 v24, p0</font>
│ <font color="#4E9A06">+    invoke-direct/range {v6 .. v12}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;runTask(IILcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;JLjava/util/Map;)Ljava/util/Map;</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v26, v34</font>
│ <font color="#4E9A06">+    move-result-object v29</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v28, v1</font>
│ <font color="#4E9A06">+    add-int/lit8 v8, v32, 0x1</font>
│  
│ <font color="#CC0000">-    invoke-direct/range {v23 .. v30}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;IJJLjava/util/Map;)V</font>
│ <font color="#4E9A06">+    .line 381</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v8}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;setIdxIl(I)V</font>
│  
│ <font color="#CC0000">-    move-object/from16 v11, v33</font>
│ <font color="#4E9A06">+    .line 384</font>
│ <font color="#4E9A06">+    new-instance v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;</font>
│  
│ <font color="#CC0000">-    invoke-interface {v11, v0}, Ljava/util/Deque;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#4E9A06">+    const/16 v24, 0x0</font>
│  
│ <font color="#CC0000">-    .line 376</font>
│ <font color="#CC0000">-    invoke-static {v1, v2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    move/from16 v6, v34</font>
│  
│ <font color="#CC0000">-    move-result-object v0</font>
│ <font color="#4E9A06">+    int-to-long v6, v6</font>
│  
│ <font color="#CC0000">-    move-object/from16 v1, p4</font>
│ <font color="#4E9A06">+    move-object/from16 v22, v0</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1, v0}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    move-object/from16 v23, p0</font>
│  
│ <font color="#CC0000">-    move-result-object v0</font>
│ <font color="#4E9A06">+    move-wide/from16 v25, v13</font>
│  
│ <font color="#CC0000">-    check-cast v0, Ljava/util/List;</font>
│ <font color="#4E9A06">+    move-wide/from16 v27, v6</font>
│  
│ <font color="#CC0000">-    if-eqz v0, :cond_5</font>
│ <font color="#4E9A06">+    invoke-direct/range {v22 .. v29}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;IJJLjava/util/Map;)V</font>
│  
│ <font color="#CC0000">-    .line 377</font>
│ <font color="#CC0000">-    invoke-interface {v0}, Ljava/util/List;-&gt;size()I</font>
│ <font color="#4E9A06">+    invoke-interface {v15, v0}, Ljava/util/Deque;-&gt;add(Ljava/lang/Object;)Z</font>
│  
│ <font color="#CC0000">-    move-result v14</font>
│ <font color="#4E9A06">+    move/from16 v6, v32</font>
│  
│      goto :goto_3
│  
│ <font color="#CC0000">-    :cond_5</font>
│ <font color="#CC0000">-    const/4 v14, 0x0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :goto_3</font>
│ <font color="#CC0000">-    add-int v0, v36, v14</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move/from16 v36, v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move v8, v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move v7, v10</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    goto :goto_4</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :cond_6</font>
│ <font color="#CC0000">-    move-object v1, v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move v2, v10</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move/from16 v36, v11</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move/from16 v37, v13</font>
│ <font color="#4E9A06">+    :cond_4</font>
│ <font color="#4E9A06">+    move-wide/from16 v35, v0</font>
│  
│ <font color="#CC0000">-    const/16 v22, 0x0</font>
│ <font color="#4E9A06">+    move/from16 v33, v9</font>
│  
│ <font color="#CC0000">-    move-object v11, v6</font>
│ <font color="#4E9A06">+    move v1, v12</font>
│  
│ <font color="#CC0000">-    .line 384</font>
│ <font color="#CC0000">-    invoke-interface {v9}, Ljava/util/List;-&gt;size()I</font>
│ <font color="#4E9A06">+    const/16 v30, 0x0</font>
│  
│ <font color="#CC0000">-    move-result v8</font>
│ <font color="#4E9A06">+    .line 390</font>
│ <font color="#4E9A06">+    invoke-interface {v7}, Ljava/util/List;-&gt;size()I</font>
│  
│ <font color="#CC0000">-    move v7, v2</font>
│ <font color="#4E9A06">+    move-result v6</font>
│  
│ <font color="#CC0000">-    goto :goto_4</font>
│ <font color="#4E9A06">+    goto :goto_3</font>
│  
│ <font color="#CC0000">-    :cond_7</font>
│ <font color="#CC0000">-    move-wide/from16 v31, v1</font>
│ <font color="#4E9A06">+    :cond_5</font>
│ <font color="#4E9A06">+    move-wide/from16 v35, v0</font>
│  
│ <font color="#CC0000">-    move/from16 v36, v11</font>
│ <font color="#4E9A06">+    move/from16 v33, v9</font>
│  
│ <font color="#CC0000">-    move/from16 v37, v13</font>
│ <font color="#4E9A06">+    move v1, v12</font>
│  
│ <font color="#CC0000">-    const/16 v22, 0x0</font>
│ <font color="#4E9A06">+    move-object/from16 v31, v14</font>
│  
│ <font color="#CC0000">-    move-object v1, v0</font>
│ <font color="#4E9A06">+    const/16 v30, 0x0</font>
│  
│ <font color="#CC0000">-    move-object v11, v6</font>
│ <font color="#4E9A06">+    :goto_3</font>
│ <font color="#4E9A06">+    add-int/lit8 v12, v1, 0x1</font>
│  
│ <font color="#CC0000">-    :goto_4</font>
│ <font color="#CC0000">-    add-int/lit8 v15, v15, -0x1</font>
│ <font color="#4E9A06">+    add-int/lit8 v9, v33, -0x1</font>
│  
│ <font color="#CC0000">-    if-le v8, v15, :cond_9</font>
│ <font color="#4E9A06">+    if-le v6, v9, :cond_6</font>
│  
│ <font color="#CC0000">-    .line 392</font>
│ <font color="#CC0000">-    invoke-interface {v11}, Ljava/util/Deque;-&gt;removeLast()Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    .line 399</font>
│ <font color="#4E9A06">+    invoke-interface {v15}, Ljava/util/Deque;-&gt;removeLast()Ljava/lang/Object;</font>
│  
│      move-result-object v0
│  
│      check-cast v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;
│  
│ <font color="#CC0000">-    .line 395</font>
│ <font color="#CC0000">-    invoke-interface {v11}, Ljava/util/Deque;-&gt;isEmpty()Z</font>
│ <font color="#4E9A06">+    .line 402</font>
│ <font color="#4E9A06">+    invoke-interface {v15}, Ljava/util/Deque;-&gt;isEmpty()Z</font>
│  
│ <font color="#CC0000">-    move-result v2</font>
│ <font color="#4E9A06">+    move-result v1</font>
│  
│ <font color="#CC0000">-    if-eqz v2, :cond_8</font>
│ <font color="#4E9A06">+    if-eqz v1, :cond_7</font>
│  
│ <font color="#CC0000">-    .line 397</font>
│ <font color="#4E9A06">+    .line 404</font>
│      invoke-virtual {v0}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getdOut()Ljava/util/Map;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    invoke-static {v3, v4}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    invoke-static {v2, v3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    move-result-object v2</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    invoke-interface {v0, v2}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v0, v1}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/util/Map;
│  
│ <font color="#CC0000">-    const-wide/16 v8, 0x0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v8, v9}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    invoke-static/range {v16 .. v17}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    move-result-object v2</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    invoke-interface {v0, v2}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v0, v1}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│      move-result-object v0
│  
│      check-cast v0, [I
│  
│ <font color="#CC0000">-    aget v16, v0, v20</font>
│ <font color="#4E9A06">+    aget v20, v0, v21</font>
│  
│ <font color="#CC0000">-    :goto_5</font>
│ <font color="#CC0000">-    move-object/from16 v6, p0</font>
│ <font color="#4E9A06">+    :cond_6</font>
│ <font color="#4E9A06">+    move-object/from16 v14, p0</font>
│  
│ <font color="#CC0000">-    goto :goto_6</font>
│ <font color="#4E9A06">+    move-object/from16 v13, v31</font>
│  
│ <font color="#CC0000">-    :cond_8</font>
│ <font color="#CC0000">-    const-wide/16 v8, 0x0</font>
│ <font color="#4E9A06">+    goto :goto_4</font>
│  
│ <font color="#CC0000">-    .line 400</font>
│ <font color="#CC0000">-    invoke-interface {v11}, Ljava/util/Deque;-&gt;getLast()Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    .line 407</font>
│ <font color="#4E9A06">+    :cond_7</font>
│ <font color="#4E9A06">+    invoke-interface {v15}, Ljava/util/Deque;-&gt;getLast()Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-object v2</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    check-cast v2, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;</font>
│ <font color="#4E9A06">+    check-cast v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;</font>
│  
│ <font color="#CC0000">-    move-object/from16 v6, p0</font>
│ <font color="#4E9A06">+    move-object/from16 v14, p0</font>
│  
│ <font color="#CC0000">-    .line 402</font>
│ <font color="#CC0000">-    invoke-direct {v6, v0, v2, v5}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;onTaskCompleted(Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;Ljava/util/Map;)V</font>
│ <font color="#4E9A06">+    move-object/from16 v13, v31</font>
│  
│ <font color="#CC0000">-    goto :goto_6</font>
│ <font color="#4E9A06">+    .line 409</font>
│ <font color="#4E9A06">+    invoke-direct {v14, v0, v1, v13}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;onTaskCompleted(Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;Ljava/util/Map;)V</font>
│  
│ <font color="#CC0000">-    :cond_9</font>
│ <font color="#CC0000">-    const-wide/16 v8, 0x0</font>
│ <font color="#4E9A06">+    :goto_4</font>
│ <font color="#4E9A06">+    move-object v14, v13</font>
│  
│ <font color="#CC0000">-    goto :goto_5</font>
│ <font color="#4E9A06">+    move-wide/from16 v0, v35</font>
│  
│ <font color="#CC0000">-    :goto_6</font>
│ <font color="#CC0000">-    move-object v0, v1</font>
│ <font color="#4E9A06">+    const/4 v13, 0x0</font>
│  
│ <font color="#CC0000">-    move-object v6, v11</font>
│ <font color="#4E9A06">+    goto/16 :goto_0</font>
│  
│ <font color="#CC0000">-    move-object/from16 v15, v21</font>
│ <font color="#4E9A06">+    :cond_8</font>
│ <font color="#4E9A06">+    move-wide/from16 v35, v0</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v1, v31</font>
│ <font color="#4E9A06">+    move v1, v12</font>
│  
│ <font color="#CC0000">-    move/from16 v11, v36</font>
│ <font color="#4E9A06">+    move-object v13, v14</font>
│  
│ <font color="#CC0000">-    move/from16 v13, v37</font>
│ <font color="#4E9A06">+    move-object/from16 v14, p0</font>
│  
│ <font color="#CC0000">-    goto/16 :goto_1</font>
│ <font color="#4E9A06">+    .line 413</font>
│ <font color="#4E9A06">+    sget-object v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    :cond_a</font>
│ <font color="#CC0000">-    move-object/from16 v6, p0</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v31, v1</font>
│ <font color="#4E9A06">+    move-result v0</font>
│  
│ <font color="#CC0000">-    move/from16 v37, v13</font>
│ <font color="#4E9A06">+    if-eqz v0, :cond_9</font>
│  
│ <font color="#CC0000">-    const-string v0, &quot;computeLinkMatrix&quot;</font>
│ <font color="#4E9A06">+    .line 414</font>
│ <font color="#4E9A06">+    new-instance v0, Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    move/from16 v14, v37</font>
│ <font color="#4E9A06">+    invoke-direct {v0}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    int-to-long v1, v14</font>
│ <font color="#4E9A06">+    const-string v6, &quot;Computing link matrix DONE... (&quot;</font>
│  
│ <font color="#CC0000">-    .line 406</font>
│ <font color="#CC0000">-    new-instance v7, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v6}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v7}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-interface {v5}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#4E9A06">+    const-string v1, &quot; iterations/&quot;</font>
│  
│ <font color="#CC0000">-    move-result v8</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v4, v5}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    const-string v8, &quot; dlinks&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot; est.)&quot;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v7}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    invoke-static {v0, v1, v2, v7}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgressDone(Ljava/lang/String;JLjava/lang/String;)V</font>
│ <font color="#4E9A06">+    invoke-static {v0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    move-object/from16 v7, p0</font>
│ <font color="#4E9A06">+    :cond_9</font>
│ <font color="#4E9A06">+    move-object/from16 v6, p0</font>
│  
│ <font color="#CC0000">-    move-object/from16 v8, p2</font>
│ <font color="#4E9A06">+    move-object/from16 v7, p2</font>
│  
│ <font color="#CC0000">-    move-wide/from16 v9, v31</font>
│ <font color="#4E9A06">+    move-wide/from16 v8, v35</font>
│  
│ <font color="#CC0000">-    move-wide v11, v3</font>
│ <font color="#4E9A06">+    move-wide v10, v2</font>
│  
│ <font color="#CC0000">-    move-object v13, v5</font>
│ <font color="#4E9A06">+    move-object v12, v13</font>
│  
│ <font color="#CC0000">-    move/from16 v14, v16</font>
│ <font color="#4E9A06">+    move/from16 v13, v20</font>
│  
│ <font color="#CC0000">-    .line 408</font>
│ <font color="#CC0000">-    invoke-direct/range {v7 .. v14}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;finalizeLinkMatrix(Lcom/samourai/boltzmann/aggregator/TxosAggregates;JJLjava/util/Map;I)Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;</font>
│ <font color="#4E9A06">+    .line 418</font>
│ <font color="#4E9A06">+    invoke-direct/range {v6 .. v13}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;finalizeLinkMatrix(Lcom/samourai/boltzmann/aggregator/TxosAggregates;JJLjava/util/Map;I)Lcom/samourai/boltzmann/aggregator/TxosAggregatorResult;</font>
│  
│      move-result-object v0
│  
│      return-object v0
│  
│      :array_0
│      .array-data 4
│ <font color="#06989A">@@ -1832,36 +1766,36 @@</font>
│              &quot;Lit/unimi/dsi/fastutil/ints/IntBigList;&quot;,
│              &quot;&gt;;I)&quot;,
│              &quot;Ljava/util/Set&lt;&quot;,
│              &quot;[J&gt;;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 706</font>
│ <font color="#4E9A06">+    .line 717</font>
│      new-instance v0, Ljava/util/LinkedHashSet;
│  
│      invoke-direct {v0}, Ljava/util/LinkedHashSet;-&gt;&lt;init&gt;()V
│  
│      const-wide/16 v1, 0x0
│  
│      move-wide v3, v1
│  
│ <font color="#CC0000">-    .line 707</font>
│ <font color="#4E9A06">+    .line 718</font>
│      :goto_0
│      invoke-interface {p1}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;size64()J
│  
│      move-result-wide v5
│  
│      cmp-long v5, v3, v5
│  
│      if-gez v5, :cond_2
│  
│      move-wide v5, v1
│  
│ <font color="#CC0000">-    .line 708</font>
│ <font color="#4E9A06">+    .line 719</font>
│      :goto_1
│      invoke-interface {p1, v3, v4}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object v7
│  
│      check-cast v7, Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│ <font color="#06989A">@@ -1871,30 +1805,30 @@</font>
│  
│      const-wide/16 v9, 0x1
│  
│      cmp-long v7, v5, v7
│  
│      if-gez v7, :cond_1
│  
│ <font color="#CC0000">-    .line 709</font>
│ <font color="#4E9A06">+    .line 720</font>
│      invoke-interface {p1, v3, v4}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;get(J)Ljava/lang/Object;
│  
│      move-result-object v7
│  
│      check-cast v7, Lit/unimi/dsi/fastutil/ints/IntBigList;
│  
│      invoke-interface {v7, v5, v6}, Lit/unimi/dsi/fastutil/ints/IntBigList;-&gt;getInt(J)I
│  
│      move-result v7
│  
│      if-ne v7, p2, :cond_0
│  
│      const/4 v7, 0x2
│  
│ <font color="#CC0000">-    .line 710</font>
│ <font color="#4E9A06">+    .line 721</font>
│      new-array v7, v7, [J
│  
│      const/4 v8, 0x0
│  
│      aput-wide v3, v7, v8
│  
│      const/4 v8, 0x1
│ <font color="#06989A">@@ -1918,15 +1852,15 @@</font>
│      goto :goto_0
│  
│      :cond_2
│      return-object v0
│  .end method
│  
│  .method public matchAggByVal(Lcom/samourai/boltzmann/aggregator/TxosAggregates;JLcom/samourai/boltzmann/linker/IntraFees;)Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;
│ <font color="#CC0000">-    .locals 24</font>
│ <font color="#4E9A06">+    .locals 23</font>
│  
│      .line 32
│      invoke-virtual/range {p1 .. p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregates;-&gt;getInAgg()Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;
│  
│      move-result-object v0
│  
│      invoke-virtual {v0}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;-&gt;getAllAggVal()[J
│ <font color="#06989A">@@ -1953,97 +1887,95 @@</font>
│  
│      invoke-interface {v0}, Ljava8/util/stream/LongStream;-&gt;sorted()Ljava8/util/stream/LongStream;
│  
│      move-result-object v0
│  
│      invoke-interface {v0}, Ljava8/util/stream/LongStream;-&gt;toArray()[J
│  
│ <font color="#CC0000">-    move-result-object v0</font>
│ <font color="#4E9A06">+    move-result-object v3</font>
│  
│      .line 37
│      invoke-static/range {v16 .. v16}, Ljava8/util/stream/LongStreams;-&gt;of([J)Ljava8/util/stream/LongStream;
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1}, Ljava8/util/stream/LongStream;-&gt;distinct()Ljava8/util/stream/LongStream;</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Ljava8/util/stream/LongStream;-&gt;distinct()Ljava8/util/stream/LongStream;</font>
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1}, Ljava8/util/stream/LongStream;-&gt;sorted()Ljava8/util/stream/LongStream;</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Ljava8/util/stream/LongStream;-&gt;sorted()Ljava8/util/stream/LongStream;</font>
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1}, Ljava8/util/stream/LongStream;-&gt;toArray()[J</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Ljava8/util/stream/LongStream;-&gt;toArray()[J</font>
│  
│      move-result-object v4
│  
│      .line 39
│ <font color="#CC0000">-    sget-object v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#4E9A06">+    sget-object v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    move-result v1</font>
│ <font color="#4E9A06">+    move-result v0</font>
│  
│ <font color="#CC0000">-    if-eqz v1, :cond_0</font>
│ <font color="#4E9A06">+    if-eqz v0, :cond_0</font>
│  
│      .line 40
│ <font color="#CC0000">-    new-instance v1, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    new-instance v0, Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-direct {v0}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    const-string v2, &quot;Matching aggregates: &quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;Matching aggregates: &quot;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    array-length v2, v4</font>
│ <font color="#4E9A06">+    array-length v1, v4</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    const-string v2, &quot;x&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;x&quot;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    array-length v2, v0</font>
│ <font color="#4E9A06">+    array-length v1, v3</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {v0}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│  
│ <font color="#CC0000">-    invoke-static {v1}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│ <font color="#4E9A06">+    invoke-static {v0}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│  
│      .line 44
│      :cond_0
│ <font color="#CC0000">-    new-instance v15, Ljava/util/ArrayList;</font>
│ <font color="#4E9A06">+    new-instance v0, Ljava/util/ArrayList;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v15}, Ljava/util/ArrayList;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-direct {v0}, Ljava/util/ArrayList;-&gt;&lt;init&gt;()V</font>
│  
│      .line 45
│ <font color="#CC0000">-    new-instance v14, Ljava/util/HashMap;</font>
│ <font color="#4E9A06">+    new-instance v15, Ljava/util/HashMap;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v14}, Ljava/util/HashMap;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-direct {v15}, Ljava/util/HashMap;-&gt;&lt;init&gt;()V</font>
│  
│      .line 46
│ <font color="#CC0000">-    new-instance v13, Ljava/util/LinkedHashMap;</font>
│ <font color="#4E9A06">+    new-instance v14, Ljava/util/LinkedHashMap;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v13}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-direct {v14}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│  
│      const/4 v1, 0x0
│  
│      if-eqz p4, :cond_1
│  
│      .line 49
│      invoke-virtual/range {p4 .. p4}, Lcom/samourai/boltzmann/linker/IntraFees;-&gt;hasFees()Z
│  
│ <font color="#CC0000">-    move-result v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-eqz v3, :cond_1</font>
│ <font color="#4E9A06">+    move-result v5</font>
│  
│ <font color="#CC0000">-    const/4 v3, 0x1</font>
│ <font color="#4E9A06">+    if-eqz v5, :cond_1</font>
│  
│      const/4 v5, 0x1
│  
│      goto :goto_0
│  
│      :cond_1
│      const/4 v5, 0x0
│ <font color="#06989A">@@ -2069,90 +2001,85 @@</font>
│  
│      :goto_1
│      if-eqz v5, :cond_3
│  
│      .line 53
│      invoke-virtual/range {p4 .. p4}, Lcom/samourai/boltzmann/linker/IntraFees;-&gt;getFeesMaker()J
│  
│ <font color="#CC0000">-    move-result-wide v2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    neg-long v2, v2</font>
│ <font color="#4E9A06">+    move-result-wide v6</font>
│  
│ <font color="#CC0000">-    move-wide v8, v2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    goto :goto_2</font>
│ <font color="#4E9A06">+    neg-long v6, v6</font>
│  
│      :cond_3
│      move-wide v8, v6
│  
│ <font color="#CC0000">-    .line 58</font>
│ <font color="#CC0000">-    :goto_2</font>
│ <font color="#CC0000">-    array-length v2, v0</font>
│ <font color="#4E9A06">+    .line 57</font>
│ <font color="#4E9A06">+    array-length v2, v3</font>
│  
│      invoke-static {v1, v2}, Ljava8/util/stream/IntStreams;-&gt;range(II)Ljava8/util/stream/IntStream;
│  
│      move-result-object v1
│  
│ <font color="#CC0000">-    .line 59</font>
│ <font color="#4E9A06">+    .line 58</font>
│      invoke-interface {v1}, Ljava8/util/stream/IntStream;-&gt;parallel()Ljava8/util/stream/IntStream;
│  
│ <font color="#CC0000">-    move-result-object v6</font>
│ <font color="#4E9A06">+    move-result-object v13</font>
│  
│ <font color="#CC0000">-    new-instance v7, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;</font>
│ <font color="#4E9A06">+    new-instance v6, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;</font>
│  
│ <font color="#CC0000">-    move-object v1, v7</font>
│ <font color="#4E9A06">+    move-object v1, v6</font>
│  
│      move-object/from16 v2, p0
│  
│ <font color="#CC0000">-    move-object v3, v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object/from16 v19, v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object/from16 v20, v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object v0, v7</font>
│ <font color="#4E9A06">+    move-object/from16 v19, v6</font>
│  
│      move-wide/from16 v6, p2
│  
│      move-wide/from16 v10, v17
│  
│ <font color="#CC0000">-    move-object/from16 v21, v13</font>
│ <font color="#4E9A06">+    move-object/from16 v20, v13</font>
│  
│ <font color="#CC0000">-    move-object v13, v15</font>
│ <font color="#4E9A06">+    move-object v13, v0</font>
│  
│ <font color="#CC0000">-    move-object/from16 v22, v14</font>
│ <font color="#4E9A06">+    move-object/from16 v21, v14</font>
│  
│ <font color="#CC0000">-    move-object/from16 v23, v15</font>
│ <font color="#4E9A06">+    move-object v14, v15</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    move-object/from16 v22, v0</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    move-object v0, v15</font>
│  
│      move-object/from16 v15, v21
│  
│      invoke-direct/range {v1 .. v16}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[J[JZJJJ[JLjava/util/List;Ljava/util/Map;Ljava/util/Map;[J)V
│  
│ <font color="#4E9A06">+    move-object/from16 v2, v19</font>
│ <font color="#4E9A06">+</font>
│      move-object/from16 v1, v20
│  
│ <font color="#CC0000">-    .line 60</font>
│ <font color="#CC0000">-    invoke-interface {v1, v0}, Ljava8/util/stream/IntStream;-&gt;forEachOrdered(Ljava8/util/function/IntConsumer;)V</font>
│ <font color="#4E9A06">+    .line 59</font>
│ <font color="#4E9A06">+    invoke-interface {v1, v2}, Ljava8/util/stream/IntStream;-&gt;forEachOrdered(Ljava8/util/function/IntConsumer;)V</font>
│  
│ <font color="#CC0000">-    const-string v0, &quot;matchAggByVal&quot;</font>
│ <font color="#4E9A06">+    .line 119</font>
│ <font color="#4E9A06">+    sget-object v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    move-object/from16 v1, v19</font>
│ <font color="#4E9A06">+    invoke-interface {v1}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    .line 116</font>
│ <font color="#CC0000">-    array-length v1, v1</font>
│ <font color="#4E9A06">+    move-result v1</font>
│  
│ <font color="#CC0000">-    int-to-long v1, v1</font>
│ <font color="#4E9A06">+    if-eqz v1, :cond_4</font>
│  
│ <font color="#CC0000">-    invoke-static {v0, v1, v2}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgressDone(Ljava/lang/String;J)V</font>
│ <font color="#4E9A06">+    .line 120</font>
│ <font color="#4E9A06">+    invoke-static {}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory()V</font>
│  
│ <font color="#CC0000">-    .line 117</font>
│ <font color="#CC0000">-    new-instance v0, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;</font>
│ <font color="#4E9A06">+    .line 122</font>
│ <font color="#4E9A06">+    :cond_4</font>
│ <font color="#4E9A06">+    new-instance v1, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;</font>
│  
│      move-object/from16 v3, v21
│  
│      move-object/from16 v2, v22
│  
│ <font color="#CC0000">-    move-object/from16 v1, v23</font>
│ <font color="#4E9A06">+    invoke-direct {v1, v2, v0, v3}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;&lt;init&gt;(Ljava/util/List;Ljava/util/Map;Ljava/util/Map;)V</font>
│  
│ <font color="#CC0000">-    invoke-direct {v0, v1, v2, v3}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;&lt;init&gt;(Ljava/util/List;Ljava/util/Map;Ljava/util/Map;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    return-object v0</font>
│ <font color="#4E9A06">+    return-object v1</font>
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$1.smali
│ <font color="#06989A">@@ -43,15 +43,15 @@</font>
│  .field final synthetic val$valToMatchOutAgg:Ljava/util/Map;
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[J[JZJJJ[JLjava/util/List;Ljava/util/Map;Ljava/util/Map;[J)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 61</font>
│ <font color="#4E9A06">+    .line 60</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iput-object p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allUniqueInAggVal:[J
│  
│      iput-object p3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allUniqueOutAggVal:[J
│  
│      iput-boolean p4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$hasIntraFees:Z
│ <font color="#06989A">@@ -78,245 +78,272 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(I)V
│      .locals 13
│  
│ <font color="#CC0000">-    .line 64</font>
│ <font color="#4E9A06">+    .line 63</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allUniqueInAggVal:[J
│  
│      aget-wide v1, v0, p1
│  
│ <font color="#CC0000">-    const-string v0, &quot;matchAggByVal&quot;</font>
│ <font color="#4E9A06">+    .line 65</font>
│ <font color="#4E9A06">+    rem-int/lit16 v0, p1, 0x190</font>
│  
│ <font color="#CC0000">-    int-to-long v3, p1</font>
│ <font color="#4E9A06">+    if-nez v0, :cond_0</font>
│  
│      .line 66
│ <font color="#4E9A06">+    invoke-static {}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$000()Lorg/slf4j/Logger;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    move-result-object v0</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-interface {v0}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    move-result v0</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    if-eqz v0, :cond_0</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    .line 67</font>
│ <font color="#4E9A06">+    new-instance v0, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-direct {v0}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    const-string p1, &quot;/&quot;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│      iget-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allUniqueInAggVal:[J
│  
│      array-length p1, p1
│  
│ <font color="#CC0000">-    int-to-long v5, p1</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v0}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    invoke-static {v0, v3, v4, v5, v6}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgress(Ljava/lang/String;JJ)V</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│ <font color="#4E9A06">+    invoke-static {p1}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    :cond_0</font>
│      const/4 p1, 0x0
│  
│      const/4 v0, 0x0
│  
│ <font color="#CC0000">-    .line 68</font>
│ <font color="#4E9A06">+    .line 71</font>
│      :goto_0
│      iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allUniqueOutAggVal:[J
│  
│      array-length v3, v3
│  
│ <font color="#CC0000">-    if-ge v0, v3, :cond_a</font>
│ <font color="#4E9A06">+    if-ge v0, v3, :cond_b</font>
│  
│ <font color="#CC0000">-    .line 69</font>
│ <font color="#4E9A06">+    .line 72</font>
│      iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allUniqueOutAggVal:[J
│  
│      aget-wide v4, v3, v0
│  
│      sub-long v6, v1, v4
│  
│ <font color="#CC0000">-    .line 73</font>
│ <font color="#4E9A06">+    .line 76</font>
│      iget-boolean v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$hasIntraFees:Z
│  
│      const-wide/16 v8, 0x0
│  
│ <font color="#CC0000">-    if-nez v3, :cond_0</font>
│ <font color="#4E9A06">+    if-nez v3, :cond_1</font>
│  
│      cmp-long v3, v6, v8
│  
│ <font color="#CC0000">-    if-gez v3, :cond_0</font>
│ <font color="#4E9A06">+    if-gez v3, :cond_1</font>
│  
│      goto/16 :goto_4
│  
│ <font color="#CC0000">-    .line 77</font>
│ <font color="#CC0000">-    :cond_0</font>
│ <font color="#4E9A06">+    .line 80</font>
│ <font color="#4E9A06">+    :cond_1</font>
│      iget-boolean v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$hasIntraFees:Z
│  
│      const/4 v10, 0x1
│  
│ <font color="#CC0000">-    if-nez v3, :cond_1</font>
│ <font color="#4E9A06">+    if-nez v3, :cond_2</font>
│  
│      iget-wide v11, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$fees:J
│  
│      cmp-long v3, v6, v11
│  
│ <font color="#CC0000">-    if-gtz v3, :cond_1</font>
│ <font color="#4E9A06">+    if-gtz v3, :cond_2</font>
│  
│      const/4 v3, 0x1
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    :cond_1</font>
│ <font color="#4E9A06">+    :cond_2</font>
│      const/4 v3, 0x0
│  
│ <font color="#CC0000">-    .line 78</font>
│ <font color="#4E9A06">+    .line 81</font>
│      :goto_1
│      iget-boolean v11, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$hasIntraFees:Z
│  
│ <font color="#CC0000">-    if-eqz v11, :cond_3</font>
│ <font color="#4E9A06">+    if-eqz v11, :cond_4</font>
│  
│      cmp-long v8, v6, v8
│  
│ <font color="#CC0000">-    if-gtz v8, :cond_2</font>
│ <font color="#4E9A06">+    if-gtz v8, :cond_3</font>
│  
│      iget-wide v11, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$feesMaker:J
│  
│      cmp-long v9, v6, v11
│  
│ <font color="#CC0000">-    if-gez v9, :cond_4</font>
│ <font color="#4E9A06">+    if-gez v9, :cond_5</font>
│  
│ <font color="#CC0000">-    :cond_2</font>
│ <font color="#CC0000">-    if-ltz v8, :cond_3</font>
│ <font color="#4E9A06">+    :cond_3</font>
│ <font color="#4E9A06">+    if-ltz v8, :cond_4</font>
│  
│      iget-wide v8, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$feesTaker:J
│  
│      cmp-long v6, v6, v8
│  
│ <font color="#CC0000">-    if-gtz v6, :cond_3</font>
│ <font color="#4E9A06">+    if-gtz v6, :cond_4</font>
│  
│      goto :goto_2
│  
│ <font color="#CC0000">-    :cond_3</font>
│ <font color="#4E9A06">+    :cond_4</font>
│      const/4 v10, 0x0
│  
│ <font color="#CC0000">-    :cond_4</font>
│ <font color="#4E9A06">+    :cond_5</font>
│      :goto_2
│ <font color="#CC0000">-    if-nez v3, :cond_5</font>
│ <font color="#4E9A06">+    if-nez v3, :cond_6</font>
│  
│ <font color="#CC0000">-    if-eqz v10, :cond_9</font>
│ <font color="#4E9A06">+    if-eqz v10, :cond_a</font>
│  
│ <font color="#CC0000">-    :cond_5</font>
│ <font color="#4E9A06">+    :cond_6</font>
│      const/4 v3, 0x0
│  
│ <font color="#CC0000">-    .line 85</font>
│ <font color="#4E9A06">+    .line 88</font>
│      :goto_3
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allInAggVal:[J
│  
│      array-length v6, v6
│  
│ <font color="#CC0000">-    if-ge v3, v6, :cond_7</font>
│ <font color="#4E9A06">+    if-ge v3, v6, :cond_8</font>
│  
│ <font color="#CC0000">-    .line 86</font>
│ <font color="#4E9A06">+    .line 89</font>
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allInAggVal:[J
│  
│      aget-wide v7, v6, v3
│  
│      cmp-long v6, v7, v1
│  
│ <font color="#CC0000">-    if-nez v6, :cond_6</font>
│ <font color="#4E9A06">+    if-nez v6, :cond_7</font>
│  
│ <font color="#CC0000">-    .line 87</font>
│ <font color="#4E9A06">+    .line 90</font>
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allMatchInAgg:Ljava/util/List;
│  
│      invoke-static {v3}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;
│  
│      move-result-object v7
│  
│      invoke-interface {v6, v7}, Ljava/util/List;-&gt;contains(Ljava/lang/Object;)Z
│  
│      move-result v6
│  
│ <font color="#CC0000">-    if-nez v6, :cond_6</font>
│ <font color="#4E9A06">+    if-nez v6, :cond_7</font>
│  
│ <font color="#CC0000">-    .line 88</font>
│ <font color="#4E9A06">+    .line 91</font>
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allMatchInAgg:Ljava/util/List;
│  
│      invoke-static {v3}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;
│  
│      move-result-object v7
│  
│      invoke-interface {v6, v7}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z
│  
│ <font color="#CC0000">-    .line 89</font>
│ <font color="#4E9A06">+    .line 92</font>
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$matchInAggToVal:Ljava/util/Map;
│  
│      invoke-static {v3}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;
│  
│      move-result-object v7
│  
│      invoke-static {v1, v2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v8
│  
│      invoke-interface {v6, v7, v8}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
│  
│ <font color="#CC0000">-    :cond_6</font>
│ <font color="#4E9A06">+    :cond_7</font>
│      add-int/lit8 v3, v3, 0x1
│  
│      goto :goto_3
│  
│ <font color="#CC0000">-    .line 95</font>
│ <font color="#CC0000">-    :cond_7</font>
│ <font color="#4E9A06">+    .line 98</font>
│ <font color="#4E9A06">+    :cond_8</font>
│      iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$valToMatchOutAgg:Ljava/util/Map;
│  
│      invoke-static {v1, v2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v6
│  
│      invoke-interface {v3, v6}, Ljava/util/Map;-&gt;containsKey(Ljava/lang/Object;)Z
│  
│      move-result v3
│  
│ <font color="#CC0000">-    if-nez v3, :cond_8</font>
│ <font color="#4E9A06">+    if-nez v3, :cond_9</font>
│  
│ <font color="#CC0000">-    .line 96</font>
│ <font color="#4E9A06">+    .line 99</font>
│      iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$valToMatchOutAgg:Ljava/util/Map;
│  
│      invoke-static {v1, v2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v6
│  
│      new-instance v7, Ljava/util/ArrayList;
│  
│      invoke-direct {v7}, Ljava/util/ArrayList;-&gt;&lt;init&gt;()V
│  
│      invoke-interface {v3, v6, v7}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
│  
│ <font color="#CC0000">-    .line 98</font>
│ <font color="#CC0000">-    :cond_8</font>
│ <font color="#4E9A06">+    .line 101</font>
│ <font color="#4E9A06">+    :cond_9</font>
│      iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$valToMatchOutAgg:Ljava/util/Map;
│  
│      invoke-static {v1, v2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v6
│  
│      invoke-interface {v3, v6}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;
│  
│      move-result-object v3
│  
│      check-cast v3, Ljava/util/List;
│  
│ <font color="#CC0000">-    .line 100</font>
│ <font color="#4E9A06">+    .line 103</font>
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;-&gt;val$allOutAggVal:[J
│  
│      array-length v6, v6
│  
│      invoke-static {p1, v6}, Ljava8/util/stream/IntStreams;-&gt;range(II)Ljava8/util/stream/IntStream;
│  
│      move-result-object v6
│  
│ <font color="#CC0000">-    .line 101</font>
│ <font color="#4E9A06">+    .line 104</font>
│      invoke-interface {v6}, Ljava8/util/stream/IntStream;-&gt;parallel()Ljava8/util/stream/IntStream;
│  
│      move-result-object v6
│  
│      new-instance v7, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1$1;
│  
│      invoke-direct {v7, p0, v4, v5, v3}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$1$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$1;JLjava/util/List;)V
│  
│ <font color="#CC0000">-    .line 102</font>
│ <font color="#4E9A06">+    .line 105</font>
│      invoke-interface {v6, v7}, Ljava8/util/stream/IntStream;-&gt;forEachOrdered(Ljava8/util/function/IntConsumer;)V
│  
│ <font color="#CC0000">-    :cond_9</font>
│ <font color="#4E9A06">+    :cond_a</font>
│      add-int/lit8 v0, v0, 0x1
│  
│      goto/16 :goto_0
│  
│ <font color="#CC0000">-    :cond_a</font>
│ <font color="#4E9A06">+    :cond_b</font>
│      :goto_4
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$4.smali
│ <font color="#06989A">@@ -33,122 +33,129 @@</font>
│  # instance fields
│  .field final synthetic this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│  .field final synthetic val$allAgg:Lcom/samourai/boltzmann/aggregator/TxosAggregates;
│  
│  .field final synthetic val$dLinks:Ljava/util/Map;
│  
│ <font color="#CC0000">-.field final synthetic val$i:[J</font>
│ <font color="#CC0000">-</font>
│  .field final synthetic val$links:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│  .field final synthetic val$linksClear:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│  .field final synthetic val$linksX:J
│  
│  .field final synthetic val$linksY:J
│  
│  
│  # direct methods
│ <font color="#CC0000">-.method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[JLjava/util/Map;JJLit/unimi/dsi/fastutil/objects/ObjectBigList;Lcom/samourai/boltzmann/aggregator/TxosAggregates;Lit/unimi/dsi/fastutil/objects/ObjectBigList;)V</font>
│ <font color="#4E9A06">+.method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;JJLit/unimi/dsi/fastutil/objects/ObjectBigList;Lcom/samourai/boltzmann/aggregator/TxosAggregates;Lit/unimi/dsi/fastutil/objects/ObjectBigList;)V</font>
│      .locals 0
│  
│ <font color="#CC0000">-    .line 437</font>
│ <font color="#4E9A06">+    .line 445</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│ <font color="#CC0000">-    iput-object p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$i:[J</font>
│ <font color="#4E9A06">+    iput-object p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$dLinks:Ljava/util/Map;</font>
│  
│ <font color="#CC0000">-    iput-object p3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$dLinks:Ljava/util/Map;</font>
│ <font color="#4E9A06">+    iput-wide p3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksX:J</font>
│  
│ <font color="#CC0000">-    iput-wide p4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksX:J</font>
│ <font color="#4E9A06">+    iput-wide p5, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksY:J</font>
│  
│ <font color="#CC0000">-    iput-wide p6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksY:J</font>
│ <font color="#4E9A06">+    iput-object p7, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksClear:Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│ <font color="#CC0000">-    iput-object p8, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksClear:Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+    iput-object p8, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$allAgg:Lcom/samourai/boltzmann/aggregator/TxosAggregates;</font>
│  
│ <font color="#CC0000">-    iput-object p9, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$allAgg:Lcom/samourai/boltzmann/aggregator/TxosAggregates;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    iput-object p10, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$links:Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+    iput-object p9, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$links:Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 437</font>
│ <font color="#4E9A06">+    .line 445</font>
│      check-cast p1, Ljava/util/Map$Entry;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;accept(Ljava/util/Map$Entry;)V
│  
│      return-void
│  .end method
│  
│  .method public accept(Ljava/util/Map$Entry;)V
│ <font color="#CC0000">-    .locals 11</font>
│ <font color="#4E9A06">+    .locals 6</font>
│      .annotation system Ldalvik/annotation/Signature;
│          value = {
│              &quot;(&quot;,
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;Ljava/lang/Integer;&quot;,
│              &quot;&gt;;&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 440</font>
│ <font color="#4E9A06">+    .line 448</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/lang/Long;
│  
│      invoke-virtual {v0}, Ljava/lang/Long;-&gt;longValue()J
│  
│      move-result-wide v0
│  
│ <font color="#CC0000">-    const-string v2, &quot;finalizeLinkMatrix&quot;</font>
│ <font color="#4E9A06">+    const-wide/16 v2, 0x64</font>
│  
│ <font color="#CC0000">-    .line 442</font>
│ <font color="#CC0000">-    iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$i:[J</font>
│ <font color="#4E9A06">+    .line 450</font>
│ <font color="#4E9A06">+    rem-long v2, v0, v2</font>
│  
│ <font color="#CC0000">-    const/4 v4, 0x0</font>
│ <font color="#4E9A06">+    const-wide/16 v4, 0x0</font>
│  
│ <font color="#CC0000">-    aget-wide v5, v3, v4</font>
│ <font color="#4E9A06">+    cmp-long v2, v2, v4</font>
│  
│ <font color="#CC0000">-    const-wide/16 v7, 0x1</font>
│ <font color="#4E9A06">+    if-nez v2, :cond_0</font>
│  
│ <font color="#CC0000">-    add-long/2addr v7, v5</font>
│ <font color="#4E9A06">+    .line 451</font>
│ <font color="#4E9A06">+    invoke-static {}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$000()Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    aput-wide v7, v3, v4</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$dLinks:Ljava/util/Map;</font>
│ <font color="#4E9A06">+    new-instance v3, Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    .line 445</font>
│ <font color="#CC0000">-    invoke-interface {v3}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#4E9A06">+    invoke-direct {v3}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    move-result v3</font>
│ <font color="#4E9A06">+    const-string v4, &quot;Processing dLink &quot;</font>
│  
│ <font color="#CC0000">-    int-to-long v7, v3</font>
│ <font color="#4E9A06">+    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    new-instance v3, Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v3, v0, v1}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v3}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    const-string v4, &quot;/&quot;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    iget-object v4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$dLinks:Ljava/util/Map;</font>
│  
│ <font color="#CC0000">-    const-string v4, &quot;Processing dLink... &quot;</font>
│ <font color="#4E9A06">+    .line 455</font>
│ <font color="#4E9A06">+    invoke-interface {v4}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    move-result v4</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    const-string v4, &quot;: &quot;</font>
│  
│      invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    .line 447</font>
│ <font color="#4E9A06">+    .line 457</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object v4
│  
│      check-cast v4, Ljava/util/Map;
│  
│      invoke-interface {v4}, Ljava/util/Map;-&gt;size()I
│ <font color="#06989A">@@ -157,67 +164,62 @@</font>
│  
│      invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;
│  
│      const-string v4, &quot; x (&quot;
│  
│      invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    iget-wide v9, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksX:J</font>
│ <font color="#4E9A06">+    iget-wide v4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksX:J</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v3, v9, v10}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v3, v4, v5}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│      const-string v4, &quot;x&quot;
│  
│      invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    iget-wide v9, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksY:J</font>
│ <font color="#4E9A06">+    iget-wide v4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksY:J</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v3, v9, v10}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v3, v4, v5}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│      const-string v4, &quot;)&quot;
│  
│      invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {v3}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│ <font color="#CC0000">-    move-result-object v9</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v3, v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v5, v7</font>
│ <font color="#4E9A06">+    move-result-object v3</font>
│  
│ <font color="#CC0000">-    move-object v7, v9</font>
│ <font color="#4E9A06">+    .line 451</font>
│ <font color="#4E9A06">+    invoke-interface {v2, v3}, Lorg/slf4j/Logger;-&gt;info(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    .line 442</font>
│ <font color="#CC0000">-    invoke-static/range {v2 .. v7}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgress(Ljava/lang/String;JJLjava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 455</font>
│ <font color="#4E9A06">+    .line 466</font>
│ <font color="#4E9A06">+    :cond_0</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava/util/Map;
│  
│      invoke-interface {p1}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;
│  
│      move-result-object p1
│  
│      invoke-static {p1}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    .line 456</font>
│ <font color="#4E9A06">+    .line 467</font>
│      invoke-interface {p1}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object p1
│  
│      check-cast p1, Ljava8/util/stream/Stream;
│  
│      new-instance v2, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;
│  
│      invoke-direct {v2, p0, v0, v1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;J)V
│  
│ <font color="#CC0000">-    .line 457</font>
│ <font color="#4E9A06">+    .line 468</font>
│      invoke-interface {p1, v2}, Ljava8/util/stream/Stream;-&gt;forEachOrdered(Ljava8/util/function/Consumer;)V
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$6$2.smali
│ <font color="#06989A">@@ -34,15 +34,15 @@</font>
│  .field final synthetic val$sol:J
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;JI)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 607</font>
│ <font color="#4E9A06">+    .line 618</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;
│  
│      iput-wide p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;val$sol:J
│  
│      iput p4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;val$nbPrt:I
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│ <font color="#06989A">@@ -51,15 +51,15 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(Ljava/lang/Integer;)V
│      .locals 9
│  
│ <font color="#CC0000">-    .line 612</font>
│ <font color="#4E9A06">+    .line 623</font>
│      iget-wide v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;val$sol:J
│  
│      invoke-virtual {p1}, Ljava/lang/Integer;-&gt;intValue()I
│  
│      move-result v2
│  
│      int-to-long v2, v2
│ <font color="#06989A">@@ -68,33 +68,33 @@</font>
│  
│      const-wide/16 v2, 0x0
│  
│      cmp-long v0, v0, v2
│  
│      if-nez v0, :cond_0
│  
│ <font color="#CC0000">-    .line 616</font>
│ <font color="#4E9A06">+    .line 627</font>
│      iget-wide v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;val$sol:J
│  
│      invoke-virtual {p1}, Ljava/lang/Integer;-&gt;intValue()I
│  
│      move-result v4
│  
│      int-to-long v4, v4
│  
│      add-long/2addr v0, v4
│  
│ <font color="#CC0000">-    .line 617</font>
│ <font color="#4E9A06">+    .line 628</font>
│      iget-object v4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;
│  
│      iget-wide v4, v4, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$otGt:J
│  
│      sub-long/2addr v4, v0
│  
│ <font color="#CC0000">-    .line 620</font>
│ <font color="#4E9A06">+    .line 631</font>
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;
│  
│      iget-object v6, v6, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$aggMatches:Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;
│  
│      invoke-virtual {v6}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;getMatchInAggToVal()Ljava/util/Map;
│  
│      move-result-object v6
│ <font color="#06989A">@@ -113,20 +113,20 @@</font>
│  
│      check-cast v6, Ljava/lang/Long;
│  
│      invoke-virtual {v6}, Ljava/lang/Long;-&gt;longValue()J
│  
│      move-result-wide v6
│  
│ <font color="#CC0000">-    .line 621</font>
│ <font color="#4E9A06">+    .line 632</font>
│      iget-object v8, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;
│  
│      iget-object v8, v8, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$aggMatches:Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;
│  
│ <font color="#CC0000">-    .line 622</font>
│ <font color="#4E9A06">+    .line 633</font>
│      invoke-virtual {v8}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesMatches;-&gt;getValToMatchOutAgg()Ljava/util/Map;
│  
│      move-result-object v8
│  
│      invoke-static {v6, v7}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│  
│      move-result-object v6
│ <font color="#06989A">@@ -141,39 +141,39 @@</font>
│  
│      cmp-long v0, v0, v2
│  
│      if-nez v0, :cond_0
│  
│      long-to-int v0, v4
│  
│ <font color="#CC0000">-    .line 626</font>
│ <font color="#4E9A06">+    .line 637</font>
│      invoke-static {v0}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;
│  
│      move-result-object v0
│  
│      invoke-interface {v6, v0}, Ljava/util/List;-&gt;contains(Ljava/lang/Object;)Z
│  
│      move-result v0
│  
│      if-eqz v0, :cond_0
│  
│ <font color="#CC0000">-    .line 627</font>
│ <font color="#4E9A06">+    .line 638</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iget-object v1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;
│  
│      iget-object v1, v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6;-&gt;val$ndOut:Ljava/util/Map;
│  
│ <font color="#CC0000">-    invoke-static {v0, v1, v4, v5}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$300(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;J)Ljava/util/Map;</font>
│ <font color="#4E9A06">+    invoke-static {v0, v1, v4, v5}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$400(Lcom/samourai/boltzmann/aggregator/TxosAggregator;Ljava/util/Map;J)Ljava/util/Map;</font>
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 628</font>
│ <font color="#4E9A06">+    .line 639</font>
│      invoke-virtual {p1}, Ljava/lang/Integer;-&gt;intValue()I
│  
│      move-result p1
│  
│      int-to-long v1, p1
│  
│      invoke-static {v1, v2}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;
│ <font color="#06989A">@@ -199,14 +199,14 @@</font>
│      :cond_0
│      return-void
│  .end method
│  
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 607</font>
│ <font color="#4E9A06">+    .line 618</font>
│      check-cast p1, Ljava/lang/Integer;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$6$2;-&gt;accept(Ljava/lang/Integer;)V
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$5$1.smali
│ <font color="#06989A">@@ -35,15 +35,15 @@</font>
│  .field final synthetic val$rKey:[J
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;[JJ)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 521</font>
│ <font color="#4E9A06">+    .line 532</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;
│  
│      iput-object p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;val$rKey:[J
│  
│      iput-wide p3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;val$or:J
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│ <font color="#06989A">@@ -52,15 +52,15 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public bridge synthetic accept(Ljava/lang/Object;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 521</font>
│ <font color="#4E9A06">+    .line 532</font>
│      check-cast p1, Ljava/util/Map$Entry;
│  
│      invoke-virtual {p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;accept(Ljava/util/Map$Entry;)V
│  
│      return-void
│  .end method
│  
│ <font color="#06989A">@@ -71,103 +71,103 @@</font>
│              &quot;(&quot;,
│              &quot;Ljava/util/Map$Entry&lt;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;[I&gt;;)V&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 524</font>
│ <font color="#4E9A06">+    .line 535</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/lang/Long;
│  
│      invoke-virtual {v0}, Ljava/lang/Long;-&gt;longValue()J
│  
│      move-result-wide v0
│  
│ <font color="#CC0000">-    .line 525</font>
│ <font color="#4E9A06">+    .line 536</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object v2
│  
│      check-cast v2, [I
│  
│      const/4 v3, 0x0
│  
│      aget v2, v2, v3
│  
│ <font color="#CC0000">-    .line 526</font>
│ <font color="#4E9A06">+    .line 537</font>
│      invoke-interface {p1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;
│  
│      move-result-object p1
│  
│      check-cast p1, [I
│  
│      const/4 v4, 0x1
│  
│      aget p1, p1, v4
│  
│      const/4 v5, 0x2
│  
│ <font color="#CC0000">-    .line 528</font>
│ <font color="#4E9A06">+    .line 539</font>
│      new-array v5, v5, [J
│  
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;
│  
│      iget-wide v6, v6, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;val$il:J
│  
│      aput-wide v6, v5, v3
│  
│      aput-wide v0, v5, v4
│  
│      add-int/2addr p1, v4
│  
│ <font color="#CC0000">-    .line 532</font>
│ <font color="#4E9A06">+    .line 543</font>
│      monitor-enter p0
│  
│ <font color="#CC0000">-    .line 533</font>
│ <font color="#4E9A06">+    .line 544</font>
│      :try_start_0
│      iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;
│  
│      iget-object v3, v3, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      iget-object v4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;val$rKey:[J
│  
│      iget-object v6, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;
│  
│      iget-object v6, v6, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;val$dLinks:Ljava/util/Map;
│  
│ <font color="#CC0000">-    invoke-static {v3, v4, v2, v6}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$200(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[JILjava/util/Map;)V</font>
│ <font color="#4E9A06">+    invoke-static {v3, v4, v2, v6}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$300(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[JILjava/util/Map;)V</font>
│  
│ <font color="#CC0000">-    .line 534</font>
│ <font color="#4E9A06">+    .line 545</font>
│      iget-object v3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;
│  
│      iget-object v3, v3, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;this$0:Lcom/samourai/boltzmann/aggregator/TxosAggregator;
│  
│      mul-int v2, v2, p1
│  
│      iget-object v4, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;
│  
│      iget-object v4, v4, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;val$dLinks:Ljava/util/Map;
│  
│ <font color="#CC0000">-    invoke-static {v3, v5, v2, v4}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$200(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[JILjava/util/Map;)V</font>
│ <font color="#4E9A06">+    invoke-static {v3, v5, v2, v4}, Lcom/samourai/boltzmann/aggregator/TxosAggregator;-&gt;access$300(Lcom/samourai/boltzmann/aggregator/TxosAggregator;[JILjava/util/Map;)V</font>
│  
│ <font color="#CC0000">-    .line 535</font>
│ <font color="#4E9A06">+    .line 546</font>
│      monitor-exit p0
│      :try_end_0
│      .catchall {:try_start_0 .. :try_end_0} :catchall_0
│  
│ <font color="#CC0000">-    .line 539</font>
│ <font color="#4E9A06">+    .line 550</font>
│      iget-wide v2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;val$or:J
│  
│      add-long/2addr v0, v2
│  
│ <font color="#CC0000">-    .line 540</font>
│ <font color="#4E9A06">+    .line 551</font>
│      iget-object v2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;
│  
│      iget-object v2, v2, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5;-&gt;val$pt:Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;
│  
│      invoke-virtual {v2}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$ComputeLinkMatrixTask;-&gt;getdOut()Ljava/util/Map;
│  
│      move-result-object v2
│ <font color="#06989A">@@ -178,43 +178,43 @@</font>
│  
│      invoke-interface {v2, v0}, Ljava/util/Map;-&gt;get(Ljava/lang/Object;)Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava/util/Map;
│  
│ <font color="#CC0000">-    .line 541</font>
│ <font color="#4E9A06">+    .line 552</font>
│      invoke-interface {v0}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;
│  
│      move-result-object v0
│  
│      invoke-static {v0}, Ljava8/util/stream/StreamSupport;-&gt;stream(Ljava/util/Collection;)Ljava8/util/stream/Stream;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 542</font>
│ <font color="#4E9A06">+    .line 553</font>
│      invoke-interface {v0}, Ljava8/util/stream/Stream;-&gt;parallel()Ljava8/util/stream/BaseStream;
│  
│      move-result-object v0
│  
│      check-cast v0, Ljava8/util/stream/Stream;
│  
│      new-instance v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1$1;
│  
│      invoke-direct {v1, p0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$5$1;I)V
│  
│ <font color="#CC0000">-    .line 543</font>
│ <font color="#4E9A06">+    .line 554</font>
│      invoke-interface {v0, v1}, Ljava8/util/stream/Stream;-&gt;forEach(Ljava8/util/function/Consumer;)V
│  
│      return-void
│  
│      :catchall_0
│      move-exception p1
│  
│ <font color="#CC0000">-    .line 535</font>
│ <font color="#4E9A06">+    .line 546</font>
│      :try_start_1
│      monitor-exit p0
│      :try_end_1
│      .catchall {:try_start_1 .. :try_end_1} :catchall_0
│  
│      throw p1
│  .end method
├── smali_classes2/com/samourai/boltzmann/aggregator/TxosAggregator$4$1$1.smali
│ <font color="#06989A">@@ -25,15 +25,15 @@</font>
│  .field final synthetic val$mult:I
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;Lit/unimi/dsi/fastutil/objects/ObjectBigList;I)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 470</font>
│ <font color="#4E9A06">+    .line 481</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;
│  
│      iput-object p2, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;val$linkCmbn:Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      iput p3, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;val$mult:I
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│ <font color="#06989A">@@ -42,34 +42,34 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public accept(J)V
│      .locals 4
│  
│ <font color="#CC0000">-    .line 474</font>
│ <font color="#4E9A06">+    .line 485</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;-&gt;this$2:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;
│  
│      iget-object v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1;-&gt;this$1:Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;
│  
│      iget-wide v0, v0, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4;-&gt;val$linksY:J
│  
│      const-wide/16 v2, 0x0
│  
│      invoke-static {v2, v3, v0, v1}, Ljava8/util/stream/LongStreams;-&gt;range(JJ)Ljava8/util/stream/LongStream;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 475</font>
│ <font color="#4E9A06">+    .line 486</font>
│      invoke-interface {v0}, Ljava8/util/stream/LongStream;-&gt;parallel()Ljava8/util/stream/LongStream;
│  
│      move-result-object v0
│  
│      new-instance v1, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;
│  
│      invoke-direct {v1, p0, p1, p2}, Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1$1;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregator$4$1$1;J)V
│  
│ <font color="#CC0000">-    .line 476</font>
│ <font color="#4E9A06">+    .line 487</font>
│      invoke-interface {v0, v1}, Ljava8/util/stream/LongStream;-&gt;forEach(Ljava8/util/function/LongConsumer;)V
│  
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/fetch/OxtFetch.smali
│ <font color="#06989A">@@ -71,15 +71,15 @@</font>
│      .line 28
│      const-class v2, Lcom/samourai/boltzmann/fetch/OxtFetch;
│  
│      new-instance v3, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v3}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    const-string v4, &quot;/fetchTx/&quot;</font>
│ <font color="#4E9A06">+    const-string v4, &quot;/chainSoFetch/&quot;</font>
│  
│      invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      const-string v4, &quot;.json&quot;
├── smali_classes2/com/samourai/boltzmann/beans/BoltzmannResult.smali
│ <font color="#06989A">@@ -2,117 +2,108 @@</font>
│  .super Lcom/samourai/boltzmann/processor/TxProcessorResult;
│  .source &quot;BoltzmannResult.java&quot;
│  
│  
│  # instance fields
│  .field private dtrmLnks:[[Ljava/lang/String;
│  
│ <font color="#CC0000">-.field private duration:J</font>
│ <font color="#CC0000">-</font>
│  
│  # direct methods
│ <font color="#CC0000">-.method public constructor &lt;init&gt;(JLcom/samourai/boltzmann/processor/TxProcessorResult;)V</font>
│ <font color="#CC0000">-    .locals 14</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-object v13, p0</font>
│ <font color="#4E9A06">+.method public constructor &lt;init&gt;(Lcom/samourai/boltzmann/processor/TxProcessorResult;)V</font>
│ <font color="#4E9A06">+    .locals 13</font>
│  
│ <font color="#CC0000">-    .line 16</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getNbCmbn()I</font>
│ <font color="#4E9A06">+    .line 15</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getNbCmbn()I</font>
│  
│      move-result v1
│  
│ <font color="#CC0000">-    .line 17</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getMatLnkCombinations()Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+    .line 16</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getMatLnkCombinations()Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│      move-result-object v2
│  
│ <font color="#CC0000">-    .line 18</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getMatLnkProbabilities()Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+    .line 17</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getMatLnkProbabilities()Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│      move-result-object v3
│  
│ <font color="#CC0000">-    .line 19</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getEntropy()Ljava/lang/Double;</font>
│ <font color="#4E9A06">+    .line 18</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getEntropy()Ljava/lang/Double;</font>
│  
│      move-result-object v4
│  
│ <font color="#CC0000">-    .line 20</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getDtrmLnksById()Ljava/util/Set;</font>
│ <font color="#4E9A06">+    .line 19</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getDtrmLnksById()Ljava/util/Set;</font>
│  
│      move-result-object v5
│  
│ <font color="#CC0000">-    .line 21</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getTxos()Lcom/samourai/boltzmann/beans/Txos;</font>
│ <font color="#4E9A06">+    .line 20</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getTxos()Lcom/samourai/boltzmann/beans/Txos;</font>
│  
│      move-result-object v6
│  
│ <font color="#CC0000">-    .line 22</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getFees()J</font>
│ <font color="#4E9A06">+    .line 21</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getFees()J</font>
│  
│      move-result-wide v7
│  
│ <font color="#CC0000">-    .line 23</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getIntraFees()Lcom/samourai/boltzmann/linker/IntraFees;</font>
│ <font color="#4E9A06">+    .line 22</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getIntraFees()Lcom/samourai/boltzmann/linker/IntraFees;</font>
│  
│      move-result-object v9
│  
│ <font color="#CC0000">-    .line 24</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getEfficiency()Ljava/lang/Double;</font>
│ <font color="#4E9A06">+    .line 23</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getEfficiency()Ljava/lang/Double;</font>
│  
│      move-result-object v10
│  
│ <font color="#CC0000">-    .line 25</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getNbCmbnPrfctCj()Ljava/lang/Double;</font>
│ <font color="#4E9A06">+    .line 24</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getNbCmbnPrfctCj()Ljava/lang/Double;</font>
│  
│      move-result-object v11
│  
│ <font color="#CC0000">-    .line 26</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getNbTxosPrfctCj()Lcom/samourai/boltzmann/processor/NbTxos;</font>
│ <font color="#4E9A06">+    .line 25</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getNbTxosPrfctCj()Lcom/samourai/boltzmann/processor/NbTxos;</font>
│  
│      move-result-object v12
│  
│      move-object v0, p0
│  
│ <font color="#CC0000">-    .line 15</font>
│ <font color="#4E9A06">+    .line 14</font>
│      invoke-direct/range {v0 .. v12}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;&lt;init&gt;(ILit/unimi/dsi/fastutil/objects/ObjectBigList;Lit/unimi/dsi/fastutil/objects/ObjectBigList;Ljava/lang/Double;Ljava/util/Set;Lcom/samourai/boltzmann/beans/Txos;JLcom/samourai/boltzmann/linker/IntraFees;Ljava/lang/Double;Ljava/lang/Double;Lcom/samourai/boltzmann/processor/NbTxos;)V
│  
│ <font color="#CC0000">-    .line 28</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getDtrmLnksById()Ljava/util/Set;</font>
│ <font color="#4E9A06">+    .line 27</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getDtrmLnksById()Ljava/util/Set;</font>
│  
│      move-result-object v0
│  
│      if-eqz v0, :cond_0
│  
│ <font color="#CC0000">-    .line 29</font>
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getDtrmLnksById()Ljava/util/Set;</font>
│ <font color="#4E9A06">+    .line 28</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getDtrmLnksById()Ljava/util/Set;</font>
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    invoke-virtual/range {p3 .. p3}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getTxos()Lcom/samourai/boltzmann/beans/Txos;</font>
│ <font color="#4E9A06">+    invoke-virtual {p1}, Lcom/samourai/boltzmann/processor/TxProcessorResult;-&gt;getTxos()Lcom/samourai/boltzmann/beans/Txos;</font>
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│ <font color="#CC0000">-    invoke-direct {p0, v0, v1}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;replaceDtrmLinks(Ljava/util/Set;Lcom/samourai/boltzmann/beans/Txos;)[[Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-direct {p0, v0, p1}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;replaceDtrmLinks(Ljava/util/Set;Lcom/samourai/boltzmann/beans/Txos;)[[Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    move-result-object v0</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│      goto :goto_0
│  
│      :cond_0
│ <font color="#CC0000">-    const/4 v0, 0x0</font>
│ <font color="#4E9A06">+    const/4 p1, 0x0</font>
│  
│ <font color="#CC0000">-    new-array v0, v0, [[Ljava/lang/String;</font>
│ <font color="#4E9A06">+    new-array p1, p1, [[Ljava/lang/String;</font>
│  
│      :goto_0
│ <font color="#CC0000">-    iput-object v0, v13, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;dtrmLnks:[[Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-wide v0, p1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 31</font>
│ <font color="#CC0000">-    iput-wide v0, v13, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;duration:J</font>
│ <font color="#4E9A06">+    iput-object p1, p0, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;dtrmLnks:[[Ljava/lang/String;</font>
│  
│      return-void
│  .end method
│  
│  .method private replaceDtrmLinks(Ljava/util/Set;Lcom/samourai/boltzmann/beans/Txos;)[[Ljava/lang/String;
│      .locals 10
│      .annotation system Ldalvik/annotation/Signature;
│ <font color="#06989A">@@ -122,15 +113,15 @@</font>
│              &quot;[J&gt;;&quot;,
│              &quot;Lcom/samourai/boltzmann/beans/Txos;&quot;,
│              &quot;)[[&quot;,
│              &quot;Ljava/lang/String;&quot;
│          }
│      .end annotation
│  
│ <font color="#CC0000">-    .line 35</font>
│ <font color="#4E9A06">+    .line 33</font>
│      invoke-interface {p1}, Ljava/util/Set;-&gt;size()I
│  
│      move-result v0
│  
│      const/4 v1, 0x2
│  
│      filled-new-array {v0, v1}, [I
│ <font color="#06989A">@@ -141,15 +132,15 @@</font>
│  
│      invoke-static {v2, v0}, Ljava/lang/reflect/Array;-&gt;newInstance(Ljava/lang/Class;[I)Ljava/lang/Object;
│  
│      move-result-object v0
│  
│      check-cast v0, [[Ljava/lang/String;
│  
│ <font color="#CC0000">-    .line 37</font>
│ <font color="#4E9A06">+    .line 35</font>
│      invoke-virtual {p2}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getOutputs()Ljava/util/Map;
│  
│      move-result-object v2
│  
│      invoke-interface {v2}, Ljava/util/Map;-&gt;keySet()Ljava/util/Set;
│  
│      move-result-object v2
│ <font color="#06989A">@@ -160,15 +151,15 @@</font>
│  
│      invoke-interface {v2, v4}, Ljava/util/Set;-&gt;toArray([Ljava/lang/Object;)[Ljava/lang/Object;
│  
│      move-result-object v2
│  
│      check-cast v2, [Ljava/lang/String;
│  
│ <font color="#CC0000">-    .line 38</font>
│ <font color="#4E9A06">+    .line 36</font>
│      invoke-virtual {p2}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getInputs()Ljava/util/Map;
│  
│      move-result-object p2
│  
│      invoke-interface {p2}, Ljava/util/Map;-&gt;keySet()Ljava/util/Set;
│  
│      move-result-object p2
│ <font color="#06989A">@@ -177,15 +168,15 @@</font>
│  
│      invoke-interface {p2, v4}, Ljava/util/Set;-&gt;toArray([Ljava/lang/Object;)[Ljava/lang/Object;
│  
│      move-result-object p2
│  
│      check-cast p2, [Ljava/lang/String;
│  
│ <font color="#CC0000">-    .line 41</font>
│ <font color="#4E9A06">+    .line 39</font>
│      invoke-interface {p1}, Ljava/util/Set;-&gt;iterator()Ljava/util/Iterator;
│  
│      move-result-object p1
│  
│      const/4 v4, 0x0
│  
│      :goto_0
│ <font color="#06989A">@@ -197,31 +188,31 @@</font>
│  
│      invoke-interface {p1}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;
│  
│      move-result-object v5
│  
│      check-cast v5, [J
│  
│ <font color="#CC0000">-    .line 42</font>
│ <font color="#4E9A06">+    .line 40</font>
│      aget-wide v6, v5, v3
│  
│      long-to-int v6, v6
│  
│      aget-object v6, v2, v6
│  
│      const/4 v7, 0x1
│  
│ <font color="#CC0000">-    .line 43</font>
│ <font color="#4E9A06">+    .line 41</font>
│      aget-wide v8, v5, v7
│  
│      long-to-int v5, v8
│  
│      aget-object v5, p2, v5
│  
│ <font color="#CC0000">-    .line 44</font>
│ <font color="#4E9A06">+    .line 42</font>
│      new-array v8, v1, [Ljava/lang/String;
│  
│      aput-object v6, v8, v3
│  
│      aput-object v5, v8, v7
│  
│      aput-object v8, v0, v4
│ <font color="#06989A">@@ -235,24 +226,24 @@</font>
│  .end method
│  
│  
│  # virtual methods
│  .method public getDtrmLnks()[[Ljava/lang/String;
│      .locals 1
│  
│ <font color="#CC0000">-    .line 52</font>
│ <font color="#4E9A06">+    .line 50</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;dtrmLnks:[[Ljava/lang/String;
│  
│      return-object v0
│  .end method
│  
│  .method public print()V
│ <font color="#CC0000">-    .locals 11</font>
│ <font color="#4E9A06">+    .locals 8</font>
│  
│ <font color="#CC0000">-    .line 56</font>
│ <font color="#4E9A06">+    .line 54</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Inputs = &quot;
│ <font color="#06989A">@@ -271,15 +262,15 @@</font>
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 57</font>
│ <font color="#4E9A06">+    .line 55</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Outputs = &quot;
│ <font color="#06989A">@@ -298,15 +289,15 @@</font>
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 58</font>
│ <font color="#4E9A06">+    .line 56</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Fees = &quot;
│ <font color="#06989A">@@ -325,61 +316,61 @@</font>
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 60</font>
│ <font color="#4E9A06">+    .line 58</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getIntraFees()Lcom/samourai/boltzmann/linker/IntraFees;
│  
│      move-result-object v0
│  
│      if-eqz v0, :cond_0
│  
│ <font color="#CC0000">-    .line 61</font>
│ <font color="#4E9A06">+    .line 59</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getIntraFees()Lcom/samourai/boltzmann/linker/IntraFees;
│  
│      move-result-object v0
│  
│      invoke-virtual {v0}, Lcom/samourai/boltzmann/linker/IntraFees;-&gt;getFeesMaker()J
│  
│      move-result-wide v0
│  
│      const-wide/16 v2, 0x0
│  
│      cmp-long v0, v0, v2
│  
│      if-lez v0, :cond_0
│  
│ <font color="#CC0000">-    .line 62</font>
│ <font color="#4E9A06">+    .line 60</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getIntraFees()Lcom/samourai/boltzmann/linker/IntraFees;
│  
│      move-result-object v0
│  
│      invoke-virtual {v0}, Lcom/samourai/boltzmann/linker/IntraFees;-&gt;getFeesTaker()J
│  
│      move-result-wide v0
│  
│      cmp-long v0, v0, v2
│  
│      if-lez v0, :cond_0
│  
│ <font color="#CC0000">-    .line 63</font>
│ <font color="#4E9A06">+    .line 61</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Hypothesis: Max intrafees received by a participant = &quot;
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    .line 65</font>
│ <font color="#4E9A06">+    .line 63</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getIntraFees()Lcom/samourai/boltzmann/linker/IntraFees;
│  
│      move-result-object v2
│  
│      invoke-virtual {v2}, Lcom/samourai/boltzmann/linker/IntraFees;-&gt;getFeesMaker()J
│  
│      move-result-wide v2
│ <font color="#06989A">@@ -390,29 +381,29 @@</font>
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│ <font color="#CC0000">-    .line 63</font>
│ <font color="#4E9A06">+    .line 61</font>
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 67</font>
│ <font color="#4E9A06">+    .line 65</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Hypothesis: Max intrafees paid by a participant = &quot;
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    .line 69</font>
│ <font color="#4E9A06">+    .line 67</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getIntraFees()Lcom/samourai/boltzmann/linker/IntraFees;
│  
│      move-result-object v2
│  
│      invoke-virtual {v2}, Lcom/samourai/boltzmann/linker/IntraFees;-&gt;getFeesTaker()J
│  
│      move-result-wide v2
│ <font color="#06989A">@@ -423,63 +414,63 @@</font>
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│ <font color="#CC0000">-    .line 67</font>
│ <font color="#4E9A06">+    .line 65</font>
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 73</font>
│ <font color="#4E9A06">+    .line 71</font>
│      :cond_0
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getNbCmbnPrfctCj()Ljava/lang/Double;
│  
│      move-result-object v0
│  
│      if-eqz v0, :cond_1
│  
│ <font color="#CC0000">-    .line 74</font>
│ <font color="#4E9A06">+    .line 72</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Perfect coinjoin = &quot;
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    .line 76</font>
│ <font color="#4E9A06">+    .line 74</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getNbCmbnPrfctCj()Ljava/lang/Double;
│  
│      move-result-object v2
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/Object;)Ljava/lang/StringBuilder;
│  
│      const-string v2, &quot; combinations (for &quot;
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    .line 78</font>
│ <font color="#4E9A06">+    .line 76</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getNbTxosPrfctCj()Lcom/samourai/boltzmann/processor/NbTxos;
│  
│      move-result-object v2
│  
│      invoke-virtual {v2}, Lcom/samourai/boltzmann/processor/NbTxos;-&gt;getNbIns()I
│  
│      move-result v2
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;
│  
│      const-string v2, &quot;x&quot;
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    .line 80</font>
│ <font color="#4E9A06">+    .line 78</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getNbTxosPrfctCj()Lcom/samourai/boltzmann/processor/NbTxos;
│  
│      move-result-object v2
│  
│      invoke-virtual {v2}, Lcom/samourai/boltzmann/processor/NbTxos;-&gt;getNbOuts()I
│  
│      move-result v2
│ <font color="#06989A">@@ -490,18 +481,18 @@</font>
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│ <font color="#CC0000">-    .line 74</font>
│ <font color="#4E9A06">+    .line 72</font>
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 83</font>
│ <font color="#4E9A06">+    .line 81</font>
│      :cond_1
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│ <font color="#06989A">@@ -517,22 +508,22 @@</font>
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 84</font>
│ <font color="#4E9A06">+    .line 82</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getEntropy()Ljava/lang/Double;
│  
│      move-result-object v0
│  
│      if-eqz v0, :cond_2
│  
│ <font color="#CC0000">-    .line 85</font>
│ <font color="#4E9A06">+    .line 83</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Tx entropy = &quot;
│ <font color="#06989A">@@ -551,15 +542,15 @@</font>
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 86</font>
│ <font color="#4E9A06">+    .line 84</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Entropy denstity = &quot;
│ <font color="#06989A">@@ -574,34 +565,34 @@</font>
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 89</font>
│ <font color="#4E9A06">+    .line 87</font>
│      :cond_2
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getEfficiency()Ljava/lang/Double;
│  
│      move-result-object v0
│  
│      if-eqz v0, :cond_3
│  
│ <font color="#CC0000">-    .line 90</font>
│ <font color="#4E9A06">+    .line 88</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v1, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v1}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v2, &quot;Wallet efficiency = &quot;
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    .line 92</font>
│ <font color="#4E9A06">+    .line 90</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getEfficiency()Ljava/lang/Double;
│  
│      move-result-object v2
│  
│      invoke-virtual {v2}, Ljava/lang/Double;-&gt;doubleValue()D
│  
│      move-result-wide v2
│ <font color="#06989A">@@ -612,15 +603,15 @@</font>
│  
│      invoke-virtual {v1, v2, v3}, Ljava/lang/StringBuilder;-&gt;append(D)Ljava/lang/StringBuilder;
│  
│      const-string v2, &quot;% (&quot;
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    .line 94</font>
│ <font color="#4E9A06">+    .line 92</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getEfficiency()Ljava/lang/Double;
│  
│      move-result-object v2
│  
│      invoke-virtual {v2}, Ljava/lang/Double;-&gt;doubleValue()D
│  
│      move-result-wide v2
│ <font color="#06989A">@@ -635,439 +626,251 @@</font>
│  
│      invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {v1}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v1
│  
│ <font color="#CC0000">-    .line 90</font>
│ <font color="#4E9A06">+    .line 88</font>
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 98</font>
│ <font color="#4E9A06">+    .line 96</font>
│      :cond_3
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getMatLnkCombinations()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v0
│  
│      if-nez v0, :cond_4
│  
│ <font color="#CC0000">-    .line 99</font>
│ <font color="#4E9A06">+    .line 97</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getNbCmbn()I
│  
│      move-result v0
│  
│      if-nez v0, :cond_6
│  
│ <font color="#CC0000">-    .line 100</font>
│ <font color="#4E9A06">+    .line 98</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      const-string v1, &quot;Skipped processing of this transaction (too many inputs and/or outputs)&quot;
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│      goto :goto_0
│  
│ <font color="#CC0000">-    .line 104</font>
│ <font color="#4E9A06">+    .line 102</font>
│      :cond_4
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getMatLnkProbabilities()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v0
│  
│      if-eqz v0, :cond_5
│  
│ <font color="#CC0000">-    .line 105</font>
│ <font color="#4E9A06">+    .line 103</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      const-string v1, &quot;Linkability Matrix (probabilities):&quot;
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 106</font>
│ <font color="#4E9A06">+    .line 104</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getMatLnkProbabilities()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/Object;)V
│  
│ <font color="#CC0000">-    .line 108</font>
│ <font color="#4E9A06">+    .line 106</font>
│      :cond_5
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getMatLnkCombinations()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v0
│  
│      if-eqz v0, :cond_6
│  
│ <font color="#CC0000">-    .line 109</font>
│ <font color="#4E9A06">+    .line 107</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      const-string v1, &quot;Linkability Matrix (#combinations with link):&quot;
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 110</font>
│ <font color="#4E9A06">+    .line 108</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getMatLnkCombinations()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/Object;)V
│  
│ <font color="#CC0000">-    .line 114</font>
│ <font color="#4E9A06">+    .line 112</font>
│      :cond_6
│      :goto_0
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getDtrmLnks()[[Ljava/lang/String;
│  
│      move-result-object v0
│  
│      array-length v0, v0
│  
│ <font color="#CC0000">-    const/4 v1, 0x1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const/4 v2, 0x0</font>
│ <font color="#CC0000">-</font>
│      if-lez v0, :cond_7
│  
│ <font color="#CC0000">-    .line 115</font>
│ <font color="#4E9A06">+    .line 113</font>
│      sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│ <font color="#CC0000">-    const-string v3, &quot;Deterministic links:&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;Deterministic links:&quot;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v0, v3}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    .line 116</font>
│ <font color="#4E9A06">+    .line 114</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getDtrmLnks()[[Ljava/lang/String;
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 117</font>
│ <font color="#CC0000">-    array-length v3, v0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const/4 v4, 0x0</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :goto_1</font>
│ <font color="#CC0000">-    if-ge v4, v3, :cond_8</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    aget-object v5, v0, v4</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 118</font>
│ <font color="#CC0000">-    aget-object v6, v5, v2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 119</font>
│ <font color="#CC0000">-    aget-object v5, v5, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 120</font>
│ <font color="#CC0000">-    sget-object v7, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    new-instance v8, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v8}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v5, &quot; &amp; &quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v8, v6}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v5, &quot; are deterministically linked&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v8}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v7, v5}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    add-int/lit8 v4, v4, 0x1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    goto :goto_1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 123</font>
│ <font color="#CC0000">-    :cond_7</font>
│ <font color="#CC0000">-    sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v3, &quot;Deterministic links: none&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v0, v3}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 126</font>
│ <font color="#CC0000">-    :cond_8</font>
│ <font color="#CC0000">-    sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v3, &quot;Benchmarks:&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v0, v3}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 127</font>
│ <font color="#CC0000">-    new-instance v0, Ljava/util/ArrayList;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v0}, Ljava/util/ArrayList;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const/4 v3, 0x2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 129</font>
│ <font color="#CC0000">-    new-array v4, v3, [Ljava/lang/Object;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v5, &quot;duration&quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    aput-object v5, v4, v2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    iget-wide v5, p0, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;duration:J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v5, v6}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    aput-object v5, v4, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v0, v4}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 130</font>
│ <font color="#CC0000">-    sget-object v4, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    new-instance v5, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v5}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-string v6, &quot;Duration = &quot;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    iget-wide v6, p0, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;duration:J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v6, v7}, Lcom/samourai/boltzmann/utils/Utils;-&gt;duration(J)Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v5}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v4, v5}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 132</font>
│ <font color="#CC0000">-    invoke-static {}, Lcom/samourai/boltzmann/utils/Utils;-&gt;getMaxMemUsed()J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v4</font>
│ <font color="#4E9A06">+    .line 115</font>
│ <font color="#4E9A06">+    array-length v1, v0</font>
│  
│ <font color="#CC0000">-    .line 133</font>
│ <font color="#CC0000">-    new-array v6, v3, [Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    const/4 v2, 0x0</font>
│  
│ <font color="#CC0000">-    const-string v7, &quot;maxMem&quot;</font>
│ <font color="#4E9A06">+    const/4 v3, 0x0</font>
│  
│ <font color="#CC0000">-    aput-object v7, v6, v2</font>
│ <font color="#4E9A06">+    :goto_1</font>
│ <font color="#4E9A06">+    if-ge v3, v1, :cond_8</font>
│  
│ <font color="#CC0000">-    invoke-static {v4, v5}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    aget-object v4, v0, v3</font>
│  
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#4E9A06">+    .line 116</font>
│ <font color="#4E9A06">+    aget-object v5, v4, v2</font>
│  
│ <font color="#CC0000">-    aput-object v7, v6, v1</font>
│ <font color="#4E9A06">+    const/4 v6, 0x1</font>
│  
│ <font color="#CC0000">-    invoke-interface {v0, v6}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#4E9A06">+    .line 117</font>
│ <font color="#4E9A06">+    aget-object v4, v4, v6</font>
│  
│ <font color="#CC0000">-    .line 134</font>
│ <font color="#4E9A06">+    .line 118</font>
│      sget-object v6, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v7, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v7}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    const-string v8, &quot;Max mem used: &quot;</font>
│ <font color="#4E9A06">+    invoke-virtual {v7, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    const-string v4, &quot; &amp; &quot;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v7, v4, v5}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v7, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    const-string v4, &quot;M&quot;</font>
│ <font color="#4E9A06">+    invoke-virtual {v7, v5}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    const-string v4, &quot; are deterministically linked&quot;</font>
│  
│      invoke-virtual {v7, v4}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {v7}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object v4
│  
│      invoke-virtual {v6, v4}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│ <font color="#CC0000">-    .line 136</font>
│ <font color="#CC0000">-    invoke-static {}, Lcom/samourai/boltzmann/utils/Utils;-&gt;getProgressResult()Ljava/util/List;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v4</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v4}, Ljava/util/List;-&gt;iterator()Ljava/util/Iterator;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v4</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    :goto_2</font>
│ <font color="#CC0000">-    invoke-interface {v4}, Ljava/util/Iterator;-&gt;hasNext()Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    if-eqz v5, :cond_9</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {v4}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    check-cast v5, Lcom/samourai/boltzmann/utils/Progress;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 137</font>
│ <font color="#CC0000">-    sget-object v6, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v5}, Lcom/samourai/boltzmann/utils/Progress;-&gt;getResult()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    add-int/lit8 v3, v3, 0x1</font>
│  
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v6, v7}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const/4 v6, 0x5</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 138</font>
│ <font color="#CC0000">-    new-array v6, v6, [Ljava/lang/Object;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 140</font>
│ <font color="#CC0000">-    invoke-virtual {v5}, Lcom/samourai/boltzmann/utils/Progress;-&gt;getName()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    aput-object v7, v6, v2</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 141</font>
│ <font color="#CC0000">-    invoke-virtual {v5}, Lcom/samourai/boltzmann/utils/Progress;-&gt;getTarget()J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v7, v8}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    aput-object v7, v6, v1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 142</font>
│ <font color="#CC0000">-    invoke-virtual {v5}, Lcom/samourai/boltzmann/utils/Progress;-&gt;computeElapsed()J</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const-wide/16 v9, 0x3e8</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    div-long/2addr v7, v9</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v7, v8}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v7</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    aput-object v7, v6, v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    const/4 v7, 0x3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 143</font>
│ <font color="#CC0000">-    invoke-virtual {v5}, Lcom/samourai/boltzmann/utils/Progress;-&gt;getRate()D</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v8</font>
│ <font color="#4E9A06">+    goto :goto_1</font>
│  
│ <font color="#CC0000">-    invoke-static {v8, v9}, Ljava/lang/Double;-&gt;valueOf(D)Ljava/lang/Double;</font>
│ <font color="#4E9A06">+    .line 121</font>
│ <font color="#4E9A06">+    :cond_7</font>
│ <font color="#4E9A06">+    sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;</font>
│  
│ <font color="#CC0000">-    move-result-object v8</font>
│ <font color="#4E9A06">+    const-string v1, &quot;Deterministic links: none&quot;</font>
│  
│ <font color="#CC0000">-    aput-object v8, v6, v7</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    const/4 v7, 0x4</font>
│ <font color="#4E9A06">+    .line 124</font>
│ <font color="#4E9A06">+    :cond_8</font>
│ <font color="#4E9A06">+    sget-object v0, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;</font>
│  
│ <font color="#CC0000">-    .line 144</font>
│ <font color="#CC0000">-    invoke-virtual {v5}, Lcom/samourai/boltzmann/utils/Progress;-&gt;getMsg()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getTxos()Lcom/samourai/boltzmann/beans/Txos;</font>
│  
│ <font color="#CC0000">-    move-result-object v5</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    aput-object v5, v6, v7</font>
│ <font color="#4E9A06">+    invoke-virtual {v1}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getOutputs()Ljava/util/Map;</font>
│  
│ <font color="#CC0000">-    .line 146</font>
│ <font color="#CC0000">-    invoke-interface {v0, v6}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    goto :goto_2</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/Object;)V</font>
│  
│ <font color="#CC0000">-    .line 150</font>
│ <font color="#CC0000">-    :cond_9</font>
│ <font color="#4E9A06">+    .line 127</font>
│      :try_start_0
│ <font color="#CC0000">-    new-instance v1, Ljava/util/LinkedHashMap;</font>
│ <font color="#4E9A06">+    new-instance v0, Ljava/util/LinkedHashMap;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v1}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-direct {v0}, Ljava/util/LinkedHashMap;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    const-string v2, &quot;ins&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;ins&quot;</font>
│  
│ <font color="#CC0000">-    .line 151</font>
│ <font color="#4E9A06">+    .line 128</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getTxos()Lcom/samourai/boltzmann/beans/Txos;
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v3}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getInputs()Ljava/util/Map;</font>
│ <font color="#4E9A06">+    invoke-virtual {v2}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getInputs()Ljava/util/Map;</font>
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1, v2, v3}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v0, v1, v2}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    const-string v2, &quot;outs&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;outs&quot;</font>
│  
│ <font color="#CC0000">-    .line 152</font>
│ <font color="#4E9A06">+    .line 129</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getTxos()Lcom/samourai/boltzmann/beans/Txos;
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v3}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getOutputs()Ljava/util/Map;</font>
│ <font color="#4E9A06">+    invoke-virtual {v2}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getOutputs()Ljava/util/Map;</font>
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1, v2, v3}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v0, v1, v2}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    const-string v2, &quot;nbCmbn&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;nbCmbn&quot;</font>
│  
│ <font color="#CC0000">-    .line 153</font>
│ <font color="#4E9A06">+    .line 130</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getNbCmbn()I
│  
│ <font color="#CC0000">-    move-result v3</font>
│ <font color="#4E9A06">+    move-result v2</font>
│  
│ <font color="#CC0000">-    invoke-static {v3}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;</font>
│ <font color="#4E9A06">+    invoke-static {v2}, Ljava/lang/Integer;-&gt;valueOf(I)Ljava/lang/Integer;</font>
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1, v2, v3}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v0, v1, v2}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    const-string v2, &quot;mat&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;mat&quot;</font>
│  
│ <font color="#CC0000">-    .line 154</font>
│ <font color="#4E9A06">+    .line 131</font>
│      invoke-virtual {p0}, Lcom/samourai/boltzmann/beans/BoltzmannResult;-&gt;getMatLnkCombinations()Lit/unimi/dsi/fastutil/objects/ObjectBigList;
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-virtual {v3}, Ljava/lang/Object;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1, v2, v3}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-virtual {v2}, Ljava/lang/Object;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    const-string v2, &quot;benchmarks&quot;</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    .line 155</font>
│ <font color="#CC0000">-    invoke-interface {v1, v2, v0}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v0, v1, v2}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    .line 157</font>
│ <font color="#CC0000">-    new-instance v0, Lcom/fasterxml/jackson/databind/ObjectMapper;</font>
│ <font color="#4E9A06">+    .line 132</font>
│ <font color="#4E9A06">+    new-instance v1, Lcom/fasterxml/jackson/databind/ObjectMapper;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v0}, Lcom/fasterxml/jackson/databind/ObjectMapper;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-direct {v1}, Lcom/fasterxml/jackson/databind/ObjectMapper;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v0, v1}, Lcom/fasterxml/jackson/databind/ObjectMapper;-&gt;writeValueAsString(Ljava/lang/Object;)Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {v1, v0}, Lcom/fasterxml/jackson/databind/ObjectMapper;-&gt;writeValueAsString(Ljava/lang/Object;)Ljava/lang/String;</font>
│  
│      move-result-object v0
│  
│ <font color="#CC0000">-    .line 158</font>
│ <font color="#4E9A06">+    .line 133</font>
│      sget-object v1, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      new-instance v2, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v2}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      const-string v3, &quot;Export: &quot;
│ <font color="#06989A">@@ -1080,18 +883,18 @@</font>
│  
│      move-result-object v0
│  
│      invoke-virtual {v1, v0}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│      :try_end_0
│      .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
│  
│ <font color="#CC0000">-    goto :goto_3</font>
│ <font color="#4E9A06">+    goto :goto_2</font>
│  
│      :catch_0
│      move-exception v0
│  
│ <font color="#CC0000">-    .line 160</font>
│ <font color="#4E9A06">+    .line 135</font>
│      invoke-virtual {v0}, Ljava/lang/Exception;-&gt;printStackTrace()V
│  
│ <font color="#CC0000">-    :goto_3</font>
│ <font color="#4E9A06">+    :goto_2</font>
│      return-void
│  .end method
├── smali_classes2/com/samourai/boltzmann/linker/TxosLinker$2.smali
│ <font color="#06989A">@@ -23,30 +23,30 @@</font>
│  .field final synthetic val$allVal:[Ljava/lang/Long;
│  
│  
│  # direct methods
│  .method constructor &lt;init&gt;(Lcom/samourai/boltzmann/linker/TxosLinker;[Ljava/lang/Long;)V
│      .locals 0
│  
│ <font color="#CC0000">-    .line 406</font>
│ <font color="#4E9A06">+    .line 401</font>
│      iput-object p1, p0, Lcom/samourai/boltzmann/linker/TxosLinker$2;-&gt;this$0:Lcom/samourai/boltzmann/linker/TxosLinker;
│  
│      iput-object p2, p0, Lcom/samourai/boltzmann/linker/TxosLinker$2;-&gt;val$allVal:[Ljava/lang/Long;
│  
│      invoke-direct {p0}, Ljava/lang/Object;-&gt;&lt;init&gt;()V
│  
│      return-void
│  .end method
│  
│  
│  # virtual methods
│  .method public applyAsLong(J)J
│      .locals 1
│  
│ <font color="#CC0000">-    .line 409</font>
│ <font color="#4E9A06">+    .line 404</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/linker/TxosLinker$2;-&gt;val$allVal:[Ljava/lang/Long;
│  
│      long-to-int p1, p1
│  
│      aget-object p1, v0, p1
│  
│      invoke-virtual {p1}, Ljava/lang/Long;-&gt;longValue()J
├── smali_classes2/com/samourai/boltzmann/linker/TxosLinker.smali
│ <font color="#06989A">@@ -84,51 +84,51 @@</font>
│  
│      return-void
│  .end method
│  
│  .method private checkLimitOk(Lcom/samourai/boltzmann/beans/Txos;)Z
│      .locals 1
│  
│ <font color="#CC0000">-    .line 422</font>
│ <font color="#4E9A06">+    .line 417</font>
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getInputs()Ljava/util/Map;
│  
│      move-result-object v0
│  
│      invoke-interface {v0}, Ljava/util/Map;-&gt;size()I
│  
│      move-result v0
│  
│ <font color="#CC0000">-    .line 423</font>
│ <font color="#4E9A06">+    .line 418</font>
│      invoke-virtual {p1}, Lcom/samourai/boltzmann/beans/Txos;-&gt;getOutputs()Ljava/util/Map;
│  
│      move-result-object p1
│  
│      invoke-interface {p1}, Ljava/util/Map;-&gt;size()I
│  
│      move-result p1
│  
│ <font color="#CC0000">-    .line 424</font>
│ <font color="#4E9A06">+    .line 419</font>
│      invoke-static {v0, p1}, Ljava/lang/Math;-&gt;max(II)I
│  
│      move-result p1
│  
│ <font color="#CC0000">-    .line 425</font>
│ <font color="#4E9A06">+    .line 420</font>
│      iget-object v0, p0, Lcom/samourai/boltzmann/linker/TxosLinker;-&gt;maxTxos:Ljava/lang/Integer;
│  
│      if-eqz v0, :cond_0
│  
│      iget-object v0, p0, Lcom/samourai/boltzmann/linker/TxosLinker;-&gt;maxTxos:Ljava/lang/Integer;
│  
│      invoke-virtual {v0}, Ljava/lang/Integer;-&gt;intValue()I
│  
│      move-result v0
│  
│      if-le p1, v0, :cond_0
│  
│ <font color="#CC0000">-    .line 426</font>
│ <font color="#4E9A06">+    .line 421</font>
│      sget-object p1, Ljava/lang/System;-&gt;out:Ljava/io/PrintStream;
│  
│      const-string v0, &quot;maxTxos limit reached!&quot;
│  
│      invoke-virtual {p1, v0}, Ljava/io/PrintStream;-&gt;println(Ljava/lang/String;)V
│  
│      const/4 p1, 0x0
│ <font color="#06989A">@@ -167,15 +167,15 @@</font>
│  
│      invoke-direct {v1, v0, p1}, Lcom/samourai/boltzmann/aggregator/TxosAggregates;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;)V
│  
│      return-object v1
│  .end method
│  
│  .method private prepareTxos(Ljava/util/Map;)Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;
│ <font color="#CC0000">-    .locals 9</font>
│ <font color="#4E9A06">+    .locals 7</font>
│      .annotation system Ldalvik/annotation/Signature;
│          value = {
│              &quot;(&quot;,
│              &quot;Ljava/util/Map&lt;&quot;,
│              &quot;Ljava/lang/String;&quot;,
│              &quot;Ljava/lang/Long;&quot;,
│              &quot;&gt;;)&quot;,
│ <font color="#06989A">@@ -196,274 +196,255 @@</font>
│      invoke-static {v1}, Ljava/util/Collections;-&gt;reverseOrder(Ljava/util/Comparator;)Ljava/util/Comparator;
│  
│      move-result-object v1
│  
│      .line 369
│      invoke-static {p1, v1}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;sortMap(Ljava/util/Map;Ljava/util/Comparator;)Ljava/util/Map;
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;</font>
│ <font color="#4E9A06">+    invoke-interface {p1}, Ljava/util/Map;-&gt;entrySet()Ljava/util/Set;</font>
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1}, Ljava/util/Set;-&gt;iterator()Ljava/util/Iterator;</font>
│ <font color="#4E9A06">+    invoke-interface {p1}, Ljava/util/Set;-&gt;iterator()Ljava/util/Iterator;</font>
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│      :cond_0
│      :goto_0
│ <font color="#CC0000">-    invoke-interface {v1}, Ljava/util/Iterator;-&gt;hasNext()Z</font>
│ <font color="#4E9A06">+    invoke-interface {p1}, Ljava/util/Iterator;-&gt;hasNext()Z</font>
│  
│ <font color="#CC0000">-    move-result v2</font>
│ <font color="#4E9A06">+    move-result v1</font>
│  
│ <font color="#CC0000">-    const-wide/16 v3, 0x0</font>
│ <font color="#4E9A06">+    const-wide/16 v2, 0x0</font>
│  
│ <font color="#CC0000">-    if-eqz v2, :cond_1</font>
│ <font color="#4E9A06">+    if-eqz v1, :cond_1</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {p1}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-object v2</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    check-cast v2, Ljava/util/Map$Entry;</font>
│ <font color="#4E9A06">+    check-cast v1, Ljava/util/Map$Entry;</font>
│  
│      .line 371
│ <font color="#CC0000">-    invoke-interface {v2}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-object v5</font>
│ <font color="#4E9A06">+    move-result-object v4</font>
│  
│ <font color="#CC0000">-    check-cast v5, Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    check-cast v4, Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v5}, Ljava/lang/Long;-&gt;longValue()J</font>
│ <font color="#4E9A06">+    invoke-virtual {v4}, Ljava/lang/Long;-&gt;longValue()J</font>
│  
│ <font color="#CC0000">-    move-result-wide v5</font>
│ <font color="#4E9A06">+    move-result-wide v4</font>
│  
│ <font color="#CC0000">-    cmp-long v3, v5, v3</font>
│ <font color="#4E9A06">+    cmp-long v2, v4, v2</font>
│  
│ <font color="#CC0000">-    if-lez v3, :cond_0</font>
│ <font color="#4E9A06">+    if-lez v2, :cond_0</font>
│  
│      .line 372
│ <font color="#CC0000">-    invoke-interface {v2}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v1}, Ljava/util/Map$Entry;-&gt;getKey()Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-object v3</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    invoke-interface {v2}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v1}, Ljava/util/Map$Entry;-&gt;getValue()Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-object v2</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    invoke-interface {v0, v3, v2}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v0, v2, v1}, Ljava/util/Map;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;</font>
│  
│      goto :goto_0
│  
│      .line 377
│      :cond_1
│      invoke-interface {v0}, Ljava/util/Map;-&gt;values()Ljava/util/Collection;
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│ <font color="#CC0000">-    const/4 v2, 0x0</font>
│ <font color="#4E9A06">+    const/4 v1, 0x0</font>
│  
│ <font color="#CC0000">-    new-array v5, v2, [Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    new-array v4, v1, [Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    invoke-interface {v1, v5}, Ljava/util/Collection;-&gt;toArray([Ljava/lang/Object;)[Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {p1, v4}, Ljava/util/Collection;-&gt;toArray([Ljava/lang/Object;)[Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-object v1</font>
│ <font color="#4E9A06">+    move-result-object p1</font>
│  
│ <font color="#CC0000">-    check-cast v1, [Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    check-cast p1, [Ljava/lang/Long;</font>
│  
│      .line 378
│ <font color="#CC0000">-    new-instance v5, Ljava/util/ArrayList;</font>
│ <font color="#4E9A06">+    new-instance v4, Ljava/util/ArrayList;</font>
│  
│ <font color="#CC0000">-    invoke-direct {v5}, Ljava/util/ArrayList;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    invoke-direct {v4}, Ljava/util/ArrayList;-&gt;&lt;init&gt;()V</font>
│  
│      .line 379
│      :goto_1
│      invoke-interface {v0}, Ljava/util/Map;-&gt;size()I
│  
│ <font color="#CC0000">-    move-result v6</font>
│ <font color="#4E9A06">+    move-result v5</font>
│  
│ <font color="#CC0000">-    int-to-long v6, v6</font>
│ <font color="#4E9A06">+    int-to-long v5, v5</font>
│  
│ <font color="#CC0000">-    cmp-long v6, v3, v6</font>
│ <font color="#4E9A06">+    cmp-long v5, v2, v5</font>
│  
│ <font color="#CC0000">-    if-gez v6, :cond_2</font>
│ <font color="#4E9A06">+    if-gez v5, :cond_2</font>
│  
│      .line 380
│ <font color="#CC0000">-    invoke-static {v3, v4}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    invoke-static {v2, v3}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    move-result-object v6</font>
│ <font color="#4E9A06">+    move-result-object v5</font>
│  
│ <font color="#CC0000">-    invoke-interface {v5, v6}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#4E9A06">+    invoke-interface {v4, v5}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z</font>
│  
│ <font color="#CC0000">-    const-wide/16 v6, 0x1</font>
│ <font color="#4E9A06">+    const-wide/16 v5, 0x1</font>
│  
│ <font color="#CC0000">-    add-long/2addr v3, v6</font>
│ <font color="#4E9A06">+    add-long/2addr v2, v5</font>
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    :cond_2</font>
│ <font color="#CC0000">-    const-wide/high16 v3, 0x4000000000000000L    # 2.0</font>
│ <font color="#CC0000">-</font>
│      .line 385
│ <font color="#CC0000">-    invoke-interface {v5}, Ljava/util/List;-&gt;size()I</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    int-to-double v6, v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-static {v3, v4, v6, v7}, Ljava/lang/Math;-&gt;pow(DD)D</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-wide v3</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    double-to-long v3, v3</font>
│ <font color="#4E9A06">+    :cond_2</font>
│ <font color="#4E9A06">+    sget-object v2, Lcom/samourai/boltzmann/linker/TxosLinker;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    .line 386</font>
│ <font color="#CC0000">-    sget-object v6, Lcom/samourai/boltzmann/linker/TxosLinker;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#4E9A06">+    invoke-interface {v2}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    invoke-interface {v6}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│ <font color="#4E9A06">+    move-result v2</font>
│  
│ <font color="#CC0000">-    move-result v6</font>
│ <font color="#4E9A06">+    if-eqz v2, :cond_3</font>
│  
│ <font color="#CC0000">-    if-eqz v6, :cond_3</font>
│ <font color="#4E9A06">+    const-wide/high16 v2, 0x4000000000000000L    # 2.0</font>
│  
│      .line 387
│ <font color="#CC0000">-    sget-object v6, Lcom/samourai/boltzmann/linker/TxosLinker;-&gt;log:Lorg/slf4j/Logger;</font>
│ <font color="#4E9A06">+    invoke-interface {v4}, Ljava/util/List;-&gt;size()I</font>
│  
│ <font color="#CC0000">-    invoke-interface {v6}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│ <font color="#4E9A06">+    move-result v5</font>
│  
│ <font color="#CC0000">-    move-result v6</font>
│ <font color="#4E9A06">+    int-to-double v5, v5</font>
│  
│ <font color="#CC0000">-    if-eqz v6, :cond_3</font>
│ <font color="#4E9A06">+    invoke-static {v2, v3, v5, v6}, Ljava/lang/Math;-&gt;pow(DD)D</font>
│  
│ <font color="#CC0000">-    .line 388</font>
│ <font color="#CC0000">-    new-instance v6, Ljava/lang/StringBuilder;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-direct {v6}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│ <font color="#4E9A06">+    move-result-wide v2</font>
│  
│ <font color="#CC0000">-    const-string v7, &quot;Computing aggregates for &quot;</font>
│ <font color="#4E9A06">+    double-to-long v2, v2</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    .line 388</font>
│ <font color="#4E9A06">+    sget-object v5, Lcom/samourai/boltzmann/linker/TxosLinker;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    .line 390</font>
│ <font color="#CC0000">-    invoke-interface {p1}, Ljava/util/Map;-&gt;size()I</font>
│ <font color="#4E9A06">+    invoke-interface {v5}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    move-result p1</font>
│ <font color="#4E9A06">+    move-result v5</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v6, p1}, Ljava/lang/StringBuilder;-&gt;append(I)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    if-eqz v5, :cond_3</font>
│  
│ <font color="#CC0000">-    const-string p1, &quot; utxos: &quot;</font>
│ <font color="#4E9A06">+    .line 389</font>
│ <font color="#4E9A06">+    new-instance v5, Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v6, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-direct {v5}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v6, v3, v4}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    const-string v6, &quot;Computing aggregates: &quot;</font>
│  
│ <font color="#CC0000">-    const-string p1, &quot; aggregates...&quot;</font>
│ <font color="#4E9A06">+    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v6, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+    invoke-virtual {v5, v2, v3}, Ljava/lang/StringBuilder;-&gt;append(J)Ljava/lang/StringBuilder;</font>
│  
│ <font color="#CC0000">-    invoke-virtual {v6}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│ <font color="#4E9A06">+    invoke-virtual {v5}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;</font>
│  
│ <font color="#CC0000">-    move-result-object p1</font>
│ <font color="#4E9A06">+    move-result-object v2</font>
│  
│ <font color="#CC0000">-    .line 388</font>
│ <font color="#CC0000">-    invoke-static {p1}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│ <font color="#4E9A06">+    invoke-static {v2}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory(Ljava/lang/String;)V</font>
│  
│ <font color="#CC0000">-    .line 396</font>
│ <font color="#4E9A06">+    .line 392</font>
│      :cond_3
│ <font color="#CC0000">-    new-array p1, v2, [Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    new-array v1, v1, [Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    invoke-interface {v5, p1}, Ljava/util/List;-&gt;toArray([Ljava/lang/Object;)[Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    invoke-interface {v4, v1}, Ljava/util/List;-&gt;toArray([Ljava/lang/Object;)[Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    move-result-object p1</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    check-cast p1, [Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    check-cast v1, [Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    invoke-static {p1}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;powerSet([Ljava/lang/Long;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│ <font color="#4E9A06">+    invoke-static {v1}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;powerSet([Ljava/lang/Long;)Lit/unimi/dsi/fastutil/objects/ObjectBigList;</font>
│  
│ <font color="#CC0000">-    move-result-object p1</font>
│ <font color="#4E9A06">+    move-result-object v1</font>
│  
│ <font color="#CC0000">-    .line 400</font>
│ <font color="#4E9A06">+    .line 396</font>
│      new-instance v2, Ljava/util/LinkedList;
│  
│      invoke-direct {v2}, Ljava/util/LinkedList;-&gt;&lt;init&gt;()V
│  
│ <font color="#CC0000">-    .line 402</font>
│ <font color="#CC0000">-    invoke-interface {p1}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;iterator()Lit/unimi/dsi/fastutil/objects/ObjectBigListIterator;</font>
│ <font color="#4E9A06">+    .line 397</font>
│ <font color="#4E9A06">+    invoke-interface {v1}, Lit/unimi/dsi/fastutil/objects/ObjectBigList;-&gt;iterator()Lit/unimi/dsi/fastutil/objects/ObjectBigListIterator;</font>
│  
│ <font color="#CC0000">-    move-result-object v5</font>
│ <font color="#4E9A06">+    move-result-object v3</font>
│  
│      :goto_2
│ <font color="#CC0000">-    invoke-interface {v5}, Ljava/util/Iterator;-&gt;hasNext()Z</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result v6</font>
│ <font color="#4E9A06">+    invoke-interface {v3}, Ljava/util/Iterator;-&gt;hasNext()Z</font>
│  
│ <font color="#CC0000">-    if-eqz v6, :cond_4</font>
│ <font color="#4E9A06">+    move-result v4</font>
│  
│ <font color="#CC0000">-    invoke-interface {v5}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;</font>
│ <font color="#4E9A06">+    if-eqz v4, :cond_4</font>
│  
│ <font color="#CC0000">-    move-result-object v6</font>
│ <font color="#4E9A06">+    invoke-interface {v3}, Ljava/util/Iterator;-&gt;next()Ljava/lang/Object;</font>
│  
│ <font color="#CC0000">-    check-cast v6, [J</font>
│ <font color="#4E9A06">+    move-result-object v4</font>
│  
│ <font color="#CC0000">-    .line 404</font>
│ <font color="#CC0000">-    invoke-static {v6}, Ljava8/util/stream/LongStreams;-&gt;of([J)Ljava8/util/stream/LongStream;</font>
│ <font color="#4E9A06">+    check-cast v4, [J</font>
│  
│ <font color="#CC0000">-    move-result-object v6</font>
│ <font color="#4E9A06">+    .line 399</font>
│ <font color="#4E9A06">+    invoke-static {v4}, Ljava8/util/stream/LongStreams;-&gt;of([J)Ljava8/util/stream/LongStream;</font>
│  
│ <font color="#CC0000">-    new-instance v7, Lcom/samourai/boltzmann/linker/TxosLinker$2;</font>
│ <font color="#4E9A06">+    move-result-object v4</font>
│  
│ <font color="#CC0000">-    invoke-direct {v7, p0, v1}, Lcom/samourai/boltzmann/linker/TxosLinker$2;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/linker/TxosLinker;[Ljava/lang/Long;)V</font>
│ <font color="#4E9A06">+    new-instance v5, Lcom/samourai/boltzmann/linker/TxosLinker$2;</font>
│  
│ <font color="#CC0000">-    .line 405</font>
│ <font color="#CC0000">-    invoke-interface {v6, v7}, Ljava8/util/stream/LongStream;-&gt;map(Ljava8/util/function/LongUnaryOperator;)Ljava8/util/stream/LongStream;</font>
│ <font color="#4E9A06">+    invoke-direct {v5, p0, p1}, Lcom/samourai/boltzmann/linker/TxosLinker$2;-&gt;&lt;init&gt;(Lcom/samourai/boltzmann/linker/TxosLinker;[Ljava/lang/Long;)V</font>
│  
│ <font color="#CC0000">-    move-result-object v6</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    .line 412</font>
│ <font color="#CC0000">-    invoke-interface {v6}, Ljava8/util/stream/LongStream;-&gt;sum()J</font>
│ <font color="#4E9A06">+    .line 400</font>
│ <font color="#4E9A06">+    invoke-interface {v4, v5}, Ljava8/util/stream/LongStream;-&gt;map(Ljava8/util/function/LongUnaryOperator;)Ljava8/util/stream/LongStream;</font>
│  
│ <font color="#CC0000">-    move-result-wide v6</font>
│ <font color="#4E9A06">+    move-result-object v4</font>
│  
│ <font color="#CC0000">-    .line 404</font>
│ <font color="#CC0000">-    invoke-static {v6, v7}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│ <font color="#4E9A06">+    .line 407</font>
│ <font color="#4E9A06">+    invoke-interface {v4}, Ljava8/util/stream/LongStream;-&gt;sum()J</font>
│  
│ <font color="#CC0000">-    move-result-object v6</font>
│ <font color="#4E9A06">+    move-result-wide v4</font>
│  
│ <font color="#CC0000">-    .line 403</font>
│ <font color="#CC0000">-    invoke-interface {v2, v6}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z</font>
│ <font color="#4E9A06">+    .line 399</font>
│ <font color="#4E9A06">+    invoke-static {v4, v5}, Ljava/lang/Long;-&gt;valueOf(J)Ljava/lang/Long;</font>
│  
│ <font color="#CC0000">-    const-string v6, &quot;prepareTxos&quot;</font>
│ <font color="#4E9A06">+    move-result-object v4</font>
│  
│ <font color="#CC0000">-    .line 414</font>
│ <font color="#CC0000">-    invoke-interface {v2}, Ljava/util/List;-&gt;size()I</font>
│ <font color="#4E9A06">+    .line 398</font>
│ <font color="#4E9A06">+    invoke-interface {v2, v4}, Ljava/util/List;-&gt;add(Ljava/lang/Object;)Z</font>
│  
│ <font color="#CC0000">-    move-result v7</font>
│ <font color="#4E9A06">+    goto :goto_2</font>
│  
│ <font color="#CC0000">-    int-to-long v7, v7</font>
│ <font color="#4E9A06">+    .line 409</font>
│ <font color="#4E9A06">+    :cond_4</font>
│ <font color="#4E9A06">+    sget-object p1, Lcom/samourai/boltzmann/linker/TxosLinker;-&gt;log:Lorg/slf4j/Logger;</font>
│  
│ <font color="#CC0000">-    invoke-static {v6, v7, v8, v3, v4}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgress(Ljava/lang/String;JJ)V</font>
│ <font color="#4E9A06">+    invoke-interface {p1}, Lorg/slf4j/Logger;-&gt;isDebugEnabled()Z</font>
│  
│ <font color="#CC0000">-    goto :goto_2</font>
│ <font color="#4E9A06">+    move-result p1</font>
│  
│ <font color="#CC0000">-    :cond_4</font>
│ <font color="#CC0000">-    const-string v1, &quot;prepareTxos&quot;</font>
│ <font color="#4E9A06">+    if-eqz p1, :cond_5</font>
│  
│ <font color="#CC0000">-    .line 416</font>
│ <font color="#CC0000">-    invoke-static {v1, v3, v4}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logProgressDone(Ljava/lang/String;J)V</font>
│ <font color="#4E9A06">+    .line 410</font>
│ <font color="#4E9A06">+    invoke-static {}, Lcom/samourai/boltzmann/utils/Utils;-&gt;logMemory()V</font>
│  
│ <font color="#CC0000">-    .line 417</font>
│ <font color="#CC0000">-    new-instance v1, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;</font>
│ <font color="#4E9A06">+    .line 412</font>
│ <font color="#4E9A06">+    :cond_5</font>
│ <font color="#4E9A06">+    new-instance p1, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;</font>
│  
│      invoke-static {v2}, Lcom/samourai/boltzmann/utils/ListsUtils;-&gt;toPrimitiveArray(Ljava/util/Collection;)[J
│  
│      move-result-object v2
│  
│ <font color="#CC0000">-    invoke-direct {v1, v0, p1, v2}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;-&gt;&lt;init&gt;(Ljava/util/Map;Lit/unimi/dsi/fastutil/objects/ObjectBigList;[J)V</font>
│ <font color="#4E9A06">+    invoke-direct {p1, v0, v1, v2}, Lcom/samourai/boltzmann/aggregator/TxosAggregatesData;-&gt;&lt;init&gt;(Ljava/util/Map;Lit/unimi/dsi/fastutil/objects/ObjectBigList;[J)V</font>
│  
│ <font color="#CC0000">-    return-object v1</font>
│ <font color="#4E9A06">+    return-object p1</font>
│  .end method
│  
│  
│  # virtual methods
│  .method protected packLinkedTxos(Ljava/util/Collection;Lcom/samourai/boltzmann/beans/Txos;)Lcom/samourai/boltzmann/beans/Txos;
│      .locals 9
│      .annotation system Ldalvik/annotation/Signature;
├── smali_classes2/com/samourai/wallet/CreateWalletActivity$2.smali
│ <font color="#06989A">@@ -156,15 +156,15 @@</font>
│      .line 328
│      invoke-virtual {v0}, Ljava/io/IOException;-&gt;printStackTrace()V
│      :try_end_1
│      .catchall {:try_start_1 .. :try_end_1} :catchall_0
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 333</font>
│ <font color="#4E9A06">+    .line 332</font>
│      :goto_0
│      throw v0
│  
│      .line 335
│      :cond_0
│      iget-object v0, p0, Lcom/samourai/wallet/CreateWalletActivity$2;-&gt;val$seed:Ljava/lang/String;
│  
│ <font color="#06989A">@@ -633,15 +633,15 @@</font>
│  
│      move-result-object v1
│  
│      invoke-virtual {v1}, Lcom/samourai/wallet/util/AppUtil;-&gt;restartApp()V
│  
│      goto :goto_7
│  
│ <font color="#CC0000">-    .line 393</font>
│ <font color="#4E9A06">+    .line 392</font>
│      :goto_6
│      throw v0
│  
│      .line 426
│      :cond_6
│      iget-boolean v0, p0, Lcom/samourai/wallet/CreateWalletActivity$2;-&gt;val$create:Z
│  
│ <font color="#06989A">@@ -713,15 +713,15 @@</font>
│      invoke-static {v0}, Lcom/samourai/wallet/CreateWalletActivity;-&gt;access$200(Lcom/samourai/wallet/CreateWalletActivity;)V
│  
│      .line 444
│      invoke-static {}, Landroid/os/Looper;-&gt;loop()V
│  
│      return-void
│  
│ <font color="#CC0000">-    .line 441</font>
│ <font color="#4E9A06">+    .line 440</font>
│      :goto_9
│      throw v0
│  
│ <font color="#CC0000">-    .line 355</font>
│ <font color="#4E9A06">+    .line 354</font>
│      :goto_a
│      throw v0
│  .end method
├── smali_classes2/com/samourai/wallet/PinEntryActivity.smali
│ <font color="#06989A">@@ -1382,15 +1382,14 @@</font>
│      :goto_2
│      new-instance v0, Lcom/samourai/wallet/-$$Lambda$PinEntryActivity$UOMXInJQ-EG6NN_TdTeOjO7rTRI;
│  
│      invoke-direct {v0, p0}, Lcom/samourai/wallet/-$$Lambda$PinEntryActivity$UOMXInJQ-EG6NN_TdTeOjO7rTRI;-&gt;&lt;init&gt;(Lcom/samourai/wallet/PinEntryActivity;)V
│  
│      invoke-virtual {p0, v0}, Lcom/samourai/wallet/PinEntryActivity;-&gt;runOnUiThread(Ljava/lang/Runnable;)V
│  
│ <font color="#CC0000">-    .line 359</font>
│      throw p1
│  
│      .line 362
│      :cond_5
│      new-instance p1, Lcom/samourai/wallet/-$$Lambda$PinEntryActivity$TPBmobuGthMUvi7I--t235mCN7g;
│  
│      invoke-direct {p1, p0}, Lcom/samourai/wallet/-$$Lambda$PinEntryActivity$TPBmobuGthMUvi7I--t235mCN7g;-&gt;&lt;init&gt;(Lcom/samourai/wallet/PinEntryActivity;)V
├── smali_classes2/com/samourai/wallet/RestoreSeedWalletActivity$3.smali
│ <font color="#06989A">@@ -156,15 +156,15 @@</font>
│      .line 415
│      invoke-virtual {v0}, Ljava/io/IOException;-&gt;printStackTrace()V
│      :try_end_1
│      .catchall {:try_start_1 .. :try_end_1} :catchall_0
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 420</font>
│ <font color="#4E9A06">+    .line 419</font>
│      :goto_0
│      throw v0
│  
│      .line 422
│      :cond_0
│      iget-object v0, p0, Lcom/samourai/wallet/RestoreSeedWalletActivity$3;-&gt;val$seed:Ljava/lang/String;
│  
│ <font color="#06989A">@@ -633,15 +633,15 @@</font>
│  
│      move-result-object v1
│  
│      invoke-virtual {v1}, Lcom/samourai/wallet/util/AppUtil;-&gt;restartApp()V
│  
│      goto :goto_7
│  
│ <font color="#CC0000">-    .line 480</font>
│ <font color="#4E9A06">+    .line 479</font>
│      :goto_6
│      throw v0
│  
│      .line 513
│      :cond_6
│      iget-boolean v0, p0, Lcom/samourai/wallet/RestoreSeedWalletActivity$3;-&gt;val$create:Z
│  
│ <font color="#06989A">@@ -713,15 +713,15 @@</font>
│      invoke-static {v0}, Lcom/samourai/wallet/RestoreSeedWalletActivity;-&gt;access$300(Lcom/samourai/wallet/RestoreSeedWalletActivity;)V
│  
│      .line 530
│      invoke-static {}, Landroid/os/Looper;-&gt;loop()V
│  
│      return-void
│  
│ <font color="#CC0000">-    .line 528</font>
│ <font color="#4E9A06">+    .line 527</font>
│      :goto_9
│      throw v0
│  
│ <font color="#CC0000">-    .line 442</font>
│ <font color="#4E9A06">+    .line 441</font>
│      :goto_a
│      throw v0
│  .end method
├── smali_classes2/com/samourai/wallet/SettingsActivity2$12$2$2$2.smali
│ <font color="#06989A">@@ -292,14 +292,13 @@</font>
│  
│      invoke-static {v1, p2, p1}, Landroid/widget/Toast;-&gt;makeText(Landroid/content/Context;II)Landroid/widget/Toast;
│  
│      move-result-object p1
│  
│      invoke-virtual {p1}, Landroid/widget/Toast;-&gt;show()V
│  
│ <font color="#CC0000">-    .line 354</font>
│      throw v0
│  
│      :cond_0
│      :goto_2
│      return-void
│  .end method
├── smali_classes2/com/samourai/wallet/PinEntryActivity$1.smali
│ <font color="#06989A">@@ -156,15 +156,15 @@</font>
│      .line 410
│      invoke-virtual {v0}, Ljava/io/IOException;-&gt;printStackTrace()V
│      :try_end_1
│      .catchall {:try_start_1 .. :try_end_1} :catchall_0
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 415</font>
│ <font color="#4E9A06">+    .line 414</font>
│      :goto_0
│      throw v0
│  
│      .line 417
│      :cond_0
│      iget-object v0, p0, Lcom/samourai/wallet/PinEntryActivity$1;-&gt;val$seed:Ljava/lang/String;
│  
│ <font color="#06989A">@@ -643,15 +643,15 @@</font>
│  
│      move-result-object v3
│  
│      invoke-virtual {v1, v3}, Lcom/samourai/wallet/util/AppUtil;-&gt;restartApp(Landroid/os/Bundle;)V
│  
│      goto :goto_7
│  
│ <font color="#CC0000">-    .line 475</font>
│ <font color="#4E9A06">+    .line 474</font>
│      :goto_6
│      throw v0
│  
│      .line 508
│      :cond_6
│      iget-boolean v0, p0, Lcom/samourai/wallet/PinEntryActivity$1;-&gt;val$create:Z
│  
│ <font color="#06989A">@@ -729,15 +729,15 @@</font>
│      invoke-virtual {v0, v1}, Landroid/widget/ProgressBar;-&gt;setVisibility(I)V
│  
│      .line 527
│      invoke-static {}, Landroid/os/Looper;-&gt;loop()V
│  
│      return-void
│  
│ <font color="#CC0000">-    .line 523</font>
│ <font color="#4E9A06">+    .line 522</font>
│      :goto_9
│      throw v0
│  
│ <font color="#CC0000">-    .line 437</font>
│ <font color="#4E9A06">+    .line 436</font>
│      :goto_a
│      throw v0
│  .end method
├── smali_classes2/com/samourai/wallet/TxAnimUIActivity.smali
│ <font color="#06989A">@@ -1651,15 +1651,15 @@</font>
│      invoke-virtual {p1}, Landroid/widget/Toast;-&gt;show()V
│      :try_end_5
│      .catchall {:try_start_5 .. :try_end_5} :catchall_0
│  
│      :goto_9
│      return-void
│  
│ <font color="#CC0000">-    .line 469</font>
│ <font color="#4E9A06">+    .line 468</font>
│      :goto_a
│      throw p1
│  .end method
│  
│  .method public static synthetic lambda$failTx$0(Lcom/samourai/wallet/TxAnimUIActivity;I)V
│      .locals 2
├── smali_classes2/com/samourai/wallet/RestoreSeedWalletActivity$2.smali
│ <font color="#06989A">@@ -314,10 +314,9 @@</font>
│  
│      invoke-static {v1}, Lcom/samourai/wallet/util/AppUtil;-&gt;getInstance(Landroid/content/Context;)Lcom/samourai/wallet/util/AppUtil;
│  
│      move-result-object v1
│  
│      invoke-virtual {v1}, Lcom/samourai/wallet/util/AppUtil;-&gt;restartApp()V
│  
│ <font color="#CC0000">-    .line 390</font>
│      throw v0
│  .end method
├── smali_classes2/com/samourai/wallet/PinEntryActivity$3$1.smali
│ <font color="#06989A">@@ -975,10 +975,9 @@</font>
│      invoke-virtual {v2, v1, v3}, Landroid/app/AlertDialog$Builder;-&gt;setPositiveButton(ILandroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;
│  
│      move-result-object v1
│  
│      .line 632
│      invoke-virtual {v1}, Landroid/app/AlertDialog$Builder;-&gt;show()Landroid/app/AlertDialog;
│  
│ <font color="#CC0000">-    .line 634</font>
│      throw v0
│  .end method
├── smali_classes2/com/samourai/wallet/SettingsActivity2$26$2$2$2$2.smali
│ <font color="#06989A">@@ -367,14 +367,13 @@</font>
│  
│      invoke-static {v1, p2, p1}, Landroid/widget/Toast;-&gt;makeText(Landroid/content/Context;II)Landroid/widget/Toast;
│  
│      move-result-object p1
│  
│      invoke-virtual {p1}, Landroid/widget/Toast;-&gt;show()V
│  
│ <font color="#CC0000">-    .line 685</font>
│      throw v0
│  
│      :cond_1
│      :goto_2
│      return-void
│  .end method
├── smali_classes2/com/samourai/wallet/LandingActivity.smali
│ <font color="#06989A">@@ -530,15 +530,14 @@</font>
│      :goto_1
│      invoke-static {p0}, Lcom/samourai/wallet/util/AppUtil;-&gt;getInstance(Landroid/content/Context;)Lcom/samourai/wallet/util/AppUtil;
│  
│      move-result-object v0
│  
│      invoke-virtual {v0}, Lcom/samourai/wallet/util/AppUtil;-&gt;restartApp()V
│  
│ <font color="#CC0000">-    .line 356</font>
│      throw p1
│  .end method
│  
│  .method public static synthetic lambda$onCreate$0(Lcom/samourai/wallet/LandingActivity;Landroid/view/View;)V
│      .locals 0
│  
│      .line 93
├── smali_classes2/com/samourai/wallet/MainActivity2$3.smali
│ <font color="#06989A">@@ -295,11 +295,10 @@</font>
│      invoke-virtual {v2}, Landroid/app/ProgressDialog;-&gt;dismiss()V
│  
│      .line 323
│      iget-object v2, p0, Lcom/samourai/wallet/MainActivity2$3;-&gt;this$0:Lcom/samourai/wallet/MainActivity2;
│  
│      invoke-static {v2, v0}, Lcom/samourai/wallet/MainActivity2;-&gt;access$002(Lcom/samourai/wallet/MainActivity2;Landroid/app/ProgressDialog;)Landroid/app/ProgressDialog;
│  
│ <font color="#CC0000">-    .line 325</font>
│      :cond_2
│      throw v1
│  .end method
├── smali_classes2/com/samourai/wallet/payload/PayloadUtil.smali
│ <font color="#06989A">@@ -117,20 +117,20 @@</font>
│      move-result-object v0
│  
│      .line 829
│      new-instance v1, Ljava/io/File;
│  
│      if-eqz p2, :cond_0
│  
│ <font color="#CC0000">-    const-string p2, &quot;samourai.sav&quot;</font>
│ <font color="#4E9A06">+    sget-object p2, Lcom/samourai/wallet/payload/PayloadUtil;-&gt;strBackupFilename:Ljava/lang/String;</font>
│  
│      goto :goto_0
│  
│      :cond_0
│ <font color="#CC0000">-    const-string p2, &quot;samourai.dat&quot;</font>
│ <font color="#4E9A06">+    sget-object p2, Lcom/samourai/wallet/payload/PayloadUtil;-&gt;strFilename:Ljava/lang/String;</font>
│  
│      :goto_0
│      invoke-direct {v1, v0, p2}, Ljava/io/File;-&gt;&lt;init&gt;(Ljava/io/File;Ljava/lang/String;)V
│  
│      .line 831
│      new-instance p2, Ljava/lang/StringBuilder;
│  
│ <font color="#06989A">@@ -835,15 +835,14 @@</font>
│      goto :goto_1
│  
│      :catchall_0
│      move-exception p1
│  
│      invoke-virtual {v0}, Ljava/io/Writer;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 1037</font>
│      throw p1
│      :try_end_2
│      .catchall {:try_start_2 .. :try_end_2} :catchall_1
│  
│      .line 1044
│      :cond_2
│      :goto_1
│ <font color="#06989A">@@ -996,15 +995,14 @@</font>
│  
│      :catchall_0
│      move-exception p1
│  
│      .line 812
│      invoke-virtual {p2}, Ljava/io/Writer;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 813</font>
│      throw p1
│      :try_end_2
│      .catchall {:try_start_2 .. :try_end_2} :catchall_1
│  
│      .line 824
│      :cond_2
│      :goto_0
│ <font color="#06989A">@@ -1117,15 +1115,14 @@</font>
│      goto :goto_0
│  
│      :catchall_0
│      move-exception p1
│  
│      invoke-virtual {p2}, Ljava/io/Writer;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 904</font>
│      throw p1
│      :try_end_2
│      .catchall {:try_start_2 .. :try_end_2} :catchall_1
│  
│      .line 906
│      :cond_1
│      :goto_0
│ <font color="#06989A">@@ -1214,27 +1211,25 @@</font>
│      :catchall_0
│      move-exception p2
│  
│      .line 993
│      :try_start_5
│      invoke-virtual {p1}, Ljava/io/OutputStream;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 994</font>
│      throw p2
│      :try_end_5
│      .catchall {:try_start_5 .. :try_end_5} :catchall_1
│  
│      :catchall_1
│      move-exception p1
│  
│      .line 996
│      :try_start_6
│      invoke-virtual {v0}, Ljava/io/InputStream;-&gt;close()V
│  
│ <font color="#CC0000">-    .line 997</font>
│      throw p1
│      :try_end_6
│      .catchall {:try_start_6 .. :try_end_6} :catchall_2
│  
│      :catchall_2
│      move-exception p1
│  
│ <font color="#06989A">@@ -1716,15 +1711,14 @@</font>
│  
│      invoke-static {p2, v3, v2}, Landroid/widget/Toast;-&gt;makeText(Landroid/content/Context;II)Landroid/widget/Toast;
│  
│      move-result-object p2
│  
│      invoke-virtual {p2}, Landroid/widget/Toast;-&gt;show()V
│  
│ <font color="#CC0000">-    .line 1075</font>
│      throw p1
│  .end method
│  
│  .method public getPayload()Lorg/json/JSONObject;
│      .locals 8
│  
│      .line 305
│ <font color="#06989A">@@ -5151,28 +5145,26 @@</font>
│      :goto_0
│      if-nez v0, :cond_0
│  
│      monitor-exit p0
│  
│      return-void
│  
│ <font color="#CC0000">-    .line 466</font>
│      :cond_0
│      :try_start_3
│      throw p1
│      :try_end_3
│      .catchall {:try_start_3 .. :try_end_3} :catchall_2
│  
│      :catch_1
│      nop
│  
│      :goto_1
│      if-nez v0, :cond_1
│  
│ <font color="#CC0000">-    .line 464</font>
│      monitor-exit p0
│  
│      return-void
│  
│      .line 469
│      :cond_1
│      monitor-exit p0
├── smali_classes2/com/samourai/wallet/receivers/SMSReceiver$1.smali
│ <font color="#06989A">@@ -198,15 +198,15 @@</font>
│      .line 125
│      invoke-virtual {v0}, Lorg/bitcoinj/crypto/MnemonicException$MnemonicLengthException;-&gt;printStackTrace()V
│      :try_end_1
│      .catchall {:try_start_1 .. :try_end_1} :catchall_0
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 130</font>
│ <font color="#4E9A06">+    .line 129</font>
│      :goto_0
│      throw v0
│  
│      :cond_1
│      :goto_1
│      const/4 v0, 0x0
├── smali_classes2/com/samourai/wallet/util/RootUtil.smali
│ <font color="#06989A">@@ -199,25 +199,23 @@</font>
│      move-object v2, v1
│  
│      :goto_0
│      if-eqz v2, :cond_3
│  
│      invoke-virtual {v2}, Ljava/lang/Process;-&gt;destroy()V
│  
│ <font color="#CC0000">-    .line 73</font>
│      :cond_3
│      throw v0
│  
│      :catch_1
│      move-object v2, v1
│  
│      :goto_1
│      if-eqz v2, :cond_4
│  
│ <font color="#CC0000">-    .line 71</font>
│      invoke-virtual {v2}, Ljava/lang/Process;-&gt;destroy()V
│  
│      :cond_4
│      return v0
│  .end method
│  
│  .method public static getInstance()Lcom/samourai/wallet/util/RootUtil;
├── smali_classes2/com/samourai/wallet/util/WebUtil.smali
│ <font color="#06989A">@@ -189,15 +189,14 @@</font>
│      goto :goto_0
│  
│      :catchall_0
│      move-exception p1
│  
│      invoke-virtual {v2}, Ljava/net/HttpURLConnection;-&gt;disconnect()V
│  
│ <font color="#CC0000">-    .line 255</font>
│      throw p1
│  
│      :cond_1
│      return-object v2
│  .end method
│  
│  .method public static getAPIUrl(Landroid/content/Context;)Ljava/lang/String;
│ <font color="#06989A">@@ -718,15 +717,14 @@</font>
│      goto/16 :goto_0
│  
│      :catchall_0
│      move-exception p1
│  
│      invoke-virtual {v2}, Ljava/net/HttpURLConnection;-&gt;disconnect()V
│  
│ <font color="#CC0000">-    .line 202</font>
│      throw p1
│  
│      .line 205
│      :cond_1
│      new-instance p1, Ljava/lang/Exception;
│  
│      new-instance p2, Ljava/lang/StringBuilder;
│ <font color="#06989A">@@ -1164,15 +1162,14 @@</font>
│      goto/16 :goto_0
│  
│      :catchall_0
│      move-exception p1
│  
│      invoke-virtual {v2}, Ljava/net/HttpURLConnection;-&gt;disconnect()V
│  
│ <font color="#CC0000">-    .line 153</font>
│      throw p1
│  
│      .line 156
│      :cond_2
│      new-instance p1, Ljava/lang/Exception;
│  
│      new-instance p2, Ljava/lang/StringBuilder;
├── smali_classes2/com/samourai/wallet/send/boost/CPFPTask$3.smali
│ <font color="#06989A">@@ -472,15 +472,15 @@</font>
│  
│      invoke-virtual {p2, v0}, Landroid/os/Handler;-&gt;post(Ljava/lang/Runnable;)Z
│      :try_end_1
│      .catchall {:try_start_1 .. :try_end_1} :catchall_0
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 323</font>
│ <font color="#4E9A06">+    .line 322</font>
│      :goto_0
│      throw p1
│  
│      :cond_4
│      :goto_1
│      return-void
│  .end method
├── smali_classes2/com/samourai/wallet/send/boost/CPFPTask$2.smali
│ <font color="#06989A">@@ -283,10 +283,9 @@</font>
│      invoke-interface {p1}, Landroid/content/DialogInterface;-&gt;dismiss()V
│  
│      return-void
│  
│      :goto_1
│      invoke-interface {p1}, Landroid/content/DialogInterface;-&gt;dismiss()V
│  
│ <font color="#CC0000">-    .line 350</font>
│      throw p2
│  .end method
├── smali_classes2/com/samourai/wallet/send/boost/RBFTask$5.smali
│ <font color="#06989A">@@ -187,15 +187,15 @@</font>
│  
│      invoke-virtual {p2, v0}, Landroid/os/Handler;-&gt;post(Ljava/lang/Runnable;)Z
│      :try_end_1
│      .catchall {:try_start_1 .. :try_end_1} :catchall_0
│  
│      goto :goto_1
│  
│ <font color="#CC0000">-    .line 486</font>
│ <font color="#4E9A06">+    .line 485</font>
│      :goto_0
│      throw p1
│  
│      :cond_1
│      :goto_1
│      return-void
│  .end method
├── smali_classes2/com/samourai/wallet/paynym/paynymDetails/PayNymDetailsActivity.smali
│ <font color="#06989A">@@ -3412,15 +3412,15 @@</font>
│      invoke-static {}, Landroid/os/Looper;-&gt;loop()V
│  
│      .line 483
│      invoke-direct {p0, p1}, Lcom/samourai/wallet/paynym/paynymDetails/PayNymDetailsActivity;-&gt;doUpdatePayNymInfo(Ljava/lang/String;)V
│  
│      return-void
│  
│ <font color="#CC0000">-    .line 480</font>
│ <font color="#4E9A06">+    .line 479</font>
│      :goto_1
│      throw p1
│  .end method
│  
│  .method private loadTxes()V
│      .locals 2
├── smali_classes2/com/samourai/wallet/JSONRPC/JSONRPC.smali
│ <font color="#06989A">@@ -269,27 +269,28 @@</font>
│      .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_3
│      .catch Lorg/apache/http/ParseException; {:try_start_0 .. :try_end_0} :catch_2
│      .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_1
│      .catchall {:try_start_0 .. :try_end_0} :catchall_0
│  
│      const/16 p3, 0xc8
│  
│ <font color="#CC0000">-    if-eq p2, p3, :cond_1</font>
│ <font color="#4E9A06">+    if-eq p2, p3, :cond_2</font>
│  
│      .line 315
│ <font color="#4E9A06">+    :cond_1</font>
│      invoke-virtual {v0}, Lorg/apache/http/impl/client/DefaultHttpClient;-&gt;getConnectionManager()Lorg/apache/http/conn/ClientConnectionManager;
│  
│      move-result-object p1
│  
│      invoke-interface {p1}, Lorg/apache/http/conn/ClientConnectionManager;-&gt;shutdown()V
│  
│      return-object v1
│  
│      .line 283
│ <font color="#CC0000">-    :cond_1</font>
│ <font color="#4E9A06">+    :cond_2</font>
│      :try_start_1
│      new-instance p2, Ljava/lang/StringBuilder;
│  
│      invoke-direct {p2}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      .line 284
│      new-instance p3, Ljava/io/BufferedReader;
│ <font color="#06989A">@@ -317,23 +318,23 @@</font>
│      .line 286
│      :goto_0
│      :try_start_2
│      invoke-virtual {p3}, Ljava/io/BufferedReader;-&gt;readLine()Ljava/lang/String;
│  
│      move-result-object p1
│  
│ <font color="#CC0000">-    if-eqz p1, :cond_2</font>
│ <font color="#4E9A06">+    if-eqz p1, :cond_3</font>
│  
│      .line 287
│      invoke-virtual {p2, p1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      goto :goto_0
│  
│      .line 289
│ <font color="#CC0000">-    :cond_2</font>
│ <font color="#4E9A06">+    :cond_3</font>
│      invoke-virtual {p3}, Ljava/io/BufferedReader;-&gt;close()V
│      :try_end_2
│      .catch Ljava/io/IOException; {:try_start_2 .. :try_end_2} :catch_0
│      .catch Lorg/apache/http/client/ClientProtocolException; {:try_start_2 .. :try_end_2} :catch_4
│      .catch Lorg/apache/http/ParseException; {:try_start_2 .. :try_end_2} :catch_2
│      .catch Lorg/json/JSONException; {:try_start_2 .. :try_end_2} :catch_1
│      .catchall {:try_start_2 .. :try_end_2} :catchall_0
│ <font color="#06989A">@@ -349,15 +350,15 @@</font>
│  
│      .line 294
│      :goto_1
│      invoke-virtual {p2}, Ljava/lang/StringBuilder;-&gt;length()I
│  
│      move-result p1
│  
│ <font color="#CC0000">-    if-lez p1, :cond_3</font>
│ <font color="#4E9A06">+    if-lez p1, :cond_1</font>
│  
│      .line 295
│      new-instance p1, Lorg/json/JSONObject;
│  
│      invoke-virtual {p2}, Ljava/lang/StringBuilder;-&gt;toString()Ljava/lang/String;
│  
│      move-result-object p2
│ <font color="#06989A">@@ -375,23 +376,14 @@</font>
│  
│      move-result-object p2
│  
│      invoke-interface {p2}, Lorg/apache/http/conn/ClientConnectionManager;-&gt;shutdown()V
│  
│      goto :goto_3
│  
│ <font color="#CC0000">-    :cond_3</font>
│ <font color="#CC0000">-    invoke-virtual {v0}, Lorg/apache/http/impl/client/DefaultHttpClient;-&gt;getConnectionManager()Lorg/apache/http/conn/ClientConnectionManager;</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    move-result-object p1</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    invoke-interface {p1}, Lorg/apache/http/conn/ClientConnectionManager;-&gt;shutdown()V</font>
│ <font color="#CC0000">-</font>
│ <font color="#CC0000">-    return-object v1</font>
│ <font color="#CC0000">-</font>
│      :catchall_0
│      move-exception p1
│  
│      goto :goto_4
│  
│      :catch_1
│      move-exception p1
│ <font color="#06989A">@@ -442,15 +434,14 @@</font>
│      :goto_4
│      invoke-virtual {v0}, Lorg/apache/http/impl/client/DefaultHttpClient;-&gt;getConnectionManager()Lorg/apache/http/conn/ClientConnectionManager;
│  
│      move-result-object p2
│  
│      invoke-interface {p2}, Lorg/apache/http/conn/ClientConnectionManager;-&gt;shutdown()V
│  
│ <font color="#CC0000">-    .line 316</font>
│      throw p1
│  .end method
│  
│  
│  # virtual methods
│  .method public getBalance(Ljava/lang/String;)Ljava/lang/Double;
│      .locals 4
├── smali_classes2/com/samourai/wallet/home/BalanceActivity$PoWTask.smali
│ <font color="#06989A">@@ -265,15 +265,19 @@</font>
│      .line 1398
│      invoke-virtual {v1, v2}, Lcom/samourai/wallet/home/BalanceActivity;-&gt;getString(I)Ljava/lang/String;
│  
│      move-result-object v1
│  
│      invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    const-string v1, &quot;\nBlock hash:&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;\n&quot;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    const-string v1, &quot;Block hash:&quot;</font>
│  
│      invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      iget-object v1, p0, Lcom/samourai/wallet/home/BalanceActivity$PoWTask;-&gt;strBlockHash:Ljava/lang/String;
│  
│      invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
├── smali_classes2/com/samourai/wallet/prng/PRNGFixes$LinuxPRNGSecureRandom.smali
│ <font color="#06989A">@@ -405,10 +405,9 @@</font>
│      :goto_1
│      return-void
│  
│      .line 223
│      :goto_2
│      iput-boolean v0, p0, Lcom/samourai/wallet/prng/PRNGFixes$LinuxPRNGSecureRandom;-&gt;mSeeded:Z
│  
│ <font color="#CC0000">-    .line 224</font>
│      throw p1
│  .end method
├── smali_classes2/com/samourai/wallet/ricochet/RicochetMeta.smali
│ <font color="#06989A">@@ -314,20 +314,20 @@</font>
│  
│      invoke-virtual {v9}, Lcom/samourai/wallet/SamouraiWallet;-&gt;isTestNet()Z
│  
│      move-result v9
│  
│      if-eqz v9, :cond_3
│  
│ <font color="#CC0000">-    const-string v9, &quot;tb1qkymumss6zj0rxy9l3v5vqxqwwffy8jjsyhrkrg&quot;</font>
│ <font color="#4E9A06">+    sget-object v9, Lcom/samourai/wallet/ricochet/RicochetMeta;-&gt;TESTNET_NLOCKTIME_SAMOURAI_RICOCHET_TX_FEE_ADDRESS:Ljava/lang/String;</font>
│  
│      goto :goto_1
│  
│      :cond_3
│ <font color="#CC0000">-    const-string v9, &quot;bc1q7r5tq0ewfr9rux6n5kwau0085u3rme8g9gs9vr&quot;</font>
│ <font color="#4E9A06">+    sget-object v9, Lcom/samourai/wallet/ricochet/RicochetMeta;-&gt;SAMOURAI_NLOCKTIME_RICOCHET_TX_FEE_ADDRESS:Ljava/lang/String;</font>
│  
│      :goto_1
│      invoke-virtual {v11, v9, v6}, Ljava/util/HashMap;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
│  
│      goto :goto_3
│  
│      .line 588
│ <font color="#06989A">@@ -338,20 +338,20 @@</font>
│  
│      invoke-virtual {v9}, Lcom/samourai/wallet/SamouraiWallet;-&gt;isTestNet()Z
│  
│      move-result v9
│  
│      if-eqz v9, :cond_5
│  
│ <font color="#CC0000">-    const-string v9, &quot;tb1qkymumss6zj0rxy9l3v5vqxqwwffy8jjsyhrkrg&quot;</font>
│ <font color="#4E9A06">+    sget-object v9, Lcom/samourai/wallet/ricochet/RicochetMeta;-&gt;TESTNET_SAMOURAI_RICOCHET_TX_FEE_ADDRESS:Ljava/lang/String;</font>
│  
│      goto :goto_2
│  
│      :cond_5
│ <font color="#CC0000">-    const-string v9, &quot;bc1qvfguqt483c6v9apxh6e9y2q4k97nvymhn5p7pr&quot;</font>
│ <font color="#4E9A06">+    sget-object v9, Lcom/samourai/wallet/ricochet/RicochetMeta;-&gt;SAMOURAI_RICOCHET_TX_FEE_ADDRESS:Ljava/lang/String;</font>
│  
│      :goto_2
│      invoke-virtual {v11, v9, v6}, Ljava/util/HashMap;-&gt;put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
│  
│      .line 590
│      :goto_3
│      invoke-virtual {v6}, Ljava/math/BigInteger;-&gt;longValue()J
├── smali_classes2/com/samourai/wallet/bip47/BIP47Add$2.smali
│ <font color="#06989A">@@ -209,11 +209,11 @@</font>
│  
│      .line 157
│      :goto_0
│      invoke-static {}, Landroid/os/Looper;-&gt;loop()V
│  
│      return-void
│  
│ <font color="#CC0000">-    .line 155</font>
│ <font color="#4E9A06">+    .line 154</font>
│      :goto_1
│      throw v0
│  .end method
├── smali_classes2/com/samourai/wallet/api/APIFactory.smali
│ <font color="#06989A">@@ -8307,15 +8307,19 @@</font>
│  
│      new-instance v3, Ljava/lang/StringBuilder;
│  
│      invoke-direct {v3}, Ljava/lang/StringBuilder;-&gt;&lt;init&gt;()V
│  
│      invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│ <font color="#CC0000">-    const-string v1, &quot;fees?at=&quot;</font>
│ <font color="#4E9A06">+    const-string v1, &quot;fees&quot;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;</font>
│ <font color="#4E9A06">+</font>
│ <font color="#4E9A06">+    const-string v1, &quot;?at=&quot;</font>
│  
│      invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;-&gt;append(Ljava/lang/String;)Ljava/lang/StringBuilder;
│  
│      invoke-virtual {p0}, Lcom/samourai/wallet/api/APIFactory;-&gt;getAccessToken()Ljava/lang/String;
│  
│      move-result-object v1
│  
│ <font color="#06989A">@@ -8403,14 +8407,16 @@</font>
│  
│      .line 1472
│      :goto_3
│      monitor-exit p0
│  
│      throw v0
│  
│ <font color="#4E9A06">+    nop</font>
│ <font color="#4E9A06">+</font>
│      :array_0
│      .array-data 4
│          0x2
│          0x6
│          0x18
│      .end array-data
│  .end method
├── smali_classes2/com/samourai/codescanner/Utils.smali
│ <font color="#06989A">@@ -540,15 +540,14 @@</font>
│      invoke-virtual {p0}, Lcom/google/zxing/MultiFormatReader;-&gt;reset()V
│  
│      return-object p1
│  
│      :goto_0
│      invoke-virtual {p0}, Lcom/google/zxing/MultiFormatReader;-&gt;reset()V
│  
│ <font color="#CC0000">-    .line 348</font>
│      throw p1
│  .end method
│  
│  .method public static disableAutoFocus(Landroid/hardware/Camera$Parameters;)V
│      .locals 3
│      .param p0    # Landroid/hardware/Camera$Parameters;
│          .annotation build Landroidx/annotation/NonNull;
├── smali_classes2/com/samourai/codescanner/CodeScannerView.smali
│ <font color="#06989A">@@ -671,15 +671,14 @@</font>
│  
│      :goto_2
│      if-eqz v7, :cond_4
│  
│      .line 195
│      invoke-virtual {v7}, Landroid/content/res/TypedArray;-&gt;recycle()V
│  
│ <font color="#CC0000">-    .line 197</font>
│      :cond_4
│      throw v0
│  .end method
│  
│  .method private performLayout(II)V
│      .locals 6
├── smali_classes2/com/samourai/codescanner/Decoder$DecoderThread.smali
│ <font color="#06989A">@@ -189,10 +189,10 @@</font>
│      :try_end_5
│      .catch Lcom/google/zxing/ReaderException; {:try_start_5 .. :try_end_5} :catch_0
│      .catchall {:try_start_5 .. :try_end_5} :catchall_1
│  
│      :catchall_1
│      move-exception v0
│  
│ <font color="#CC0000">-    .line 145</font>
│ <font color="#4E9A06">+    .line 143</font>
│      throw v0
│  .end method
</pre>
</div>
</div>
