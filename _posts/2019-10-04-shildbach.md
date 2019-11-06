---
title: "Schildbach's Bitcoin Wallet"
date: 2019-10-31
permalink: /posts/2019/10/schildbach/
redirect_from:
  - /schildbach/
tags:
  - Android
  - FOSS
  - Security
---

Schildbach's
[Bitcoin Wallet](https://play.google.com/store/apps/details?id=de.schildbach.wallet)
was the first mobile bitcoin wallet and the first in this series to claim to be
verifiable. On [its website](https://wallet.schildbach.de/) we read:

> Bitcoin Wallet builds reproducibly. The binary (APK) is verified by F-Droid
> for each release, and it can be verified by anyone else e.g. by using
> `fdroid build --server de.schildbach.wallet`.

As mentioned in our [first post](/first-post/), [F-Droid](https://f-droid.org/)
was probably one of the earliest projects to work with
[reproducible builds](https://f-droid.org/docs/Reproducible_Builds/?title=Deterministic,_Reproducible_Builds)
for Android.

F-Droid has an active community of free and open source ([FOSS](/tags/#foss))
developers and there we also found the most useful tool [diffoscope](https://diffoscope.org/)
which is now available in most Linux distributions.

As of today, the version in Google Play is 7.23 and as it turns out,
[v7.23](https://github.com/bitcoin-wallet/bitcoin-wallet/tree/v7.23) on their
GitHub does not match but
[v7.23-prod](https://github.com/bitcoin-wallet/bitcoin-wallet/tree/v7.23-prod)
does:

We ran `gradle clean build` with all the dependencies installed and then

```
$ diffoscope wallet/build/outputs/apk/release/bitcoin-wallet-release-unsigned.apk ~/base.apk
W: Cant find 9patch chunk in file: "drawable-hdpi-v4/toast_frame.9.png". Renaming it to *.png.                                                                  |    0%                             ETA:  --:--:--
W: Cant find 9patch chunk in file: "drawable-hdpi-v4/toast_frame.9.png". Renaming it to *.png.
--- wallet/build/outputs/apk/release/bitcoin-wallet-release-unsigned.apk
+++ /home/leo/base.apk
├── zipinfo /dev/stdin
│ @@ -1,10 +1,9 @@
│ -Zip file size: 2990104 bytes, number of entries: 205
│ +Zip file size: 3010878 bytes, number of entries: 207
│  -rw----     2.0 fat    15456 bx defN 80-000-00 00:00 AndroidManifest.xml
│ --rw----     2.4 fat       87 b- defN 80-000-00 00:00 META-INF/MANIFEST.MF
│  -rw----     2.0 fat      112 b- defN 80-000-00 00:00 META-INF/services/java.security.Provider
│  -rw----     2.4 fat    13116 b- defN 80-000-00 00:00 assets/bip39-wordlist.txt
│  -rw----     2.4 fat   100773 b- defN 80-000-00 00:00 assets/checkpoints-testnet.txt
│  -rw----     2.4 fat    37821 b- defN 80-000-00 00:00 assets/checkpoints.txt
│  -rw----     2.4 fat      325 b- defN 80-000-00 00:00 assets/electrum-servers.txt
│  -rw----     2.4 fat       42 b- defN 80-000-00 00:00 assets/fees-testnet.txt
│  -rw----     2.4 fat       95 b- defN 80-000-00 00:00 assets/fees.txt
│ @@ -200,8 +199,11 @@
│  -rw----     2.0 fat     4116 b- defN 80-000-00 00:00 res/xml/preference_about.xml
│  -rw----     2.0 fat      592 b- defN 80-000-00 00:00 res/xml/preference_diagnostics.xml
│  -rw----     2.0 fat      764 b- defN 80-000-00 00:00 res/xml/preference_headers.xml
│  -rw----     2.0 fat     2308 b- defN 80-000-00 00:00 res/xml/preference_settings.xml
│  -rw----     2.0 fat     1152 b- defN 80-000-00 00:00 res/xml/shortcuts.xml
│  -rw----     2.0 fat      544 b- defN 80-000-00 00:00 res/xml/wallet_balance_widget.xml
│  -rw----     1.0 fat  1001356 bx stor 80-000-00 00:00 resources.arsc
│ -205 files, 5489790 bytes uncompressed, 2957584 bytes compressed:  46.1%
│ +-rw----     2.0 fat    23138 b- defN 80-000-00 00:00 META-INF/BITCOIN-.SF
│ +-rw----     2.0 fat     1335 b- defN 80-000-00 00:00 META-INF/BITCOIN-.RSA
│ +-rw----     2.0 fat    23076 b- defN 80-000-00 00:00 META-INF/MANIFEST.MF
│ +207 files, 5537252 bytes uncompressed, 2976358 bytes compressed:  46.3%
├── original/META-INF/MANIFEST.MF
│ @@ -1,4 +1,616 @@
│  Manifest-Version: 1.0
│  Built-By: Generated-by-ADT
│  Created-By: Android Gradle 3.1.0
│  
│ +Name: AndroidManifest.xml
│ +SHA-256-Digest: SNSZDGeJA8OW+pooYWJtGeJZ3o4gHcQuOgyR98hZL00=
│ +
│ +Name: META-INF/services/java.security.Provider
│ +SHA-256-Digest: tQoHBUCrFboIZe48gchWFvVN/Ox53Piv2CIFeI9FLaw=
│ +
│ +Name: assets/bip39-wordlist.txt
│ +SHA-256-Digest: L17tU6Rye0v4iA2PPxme/JDlhQNkbZ/47/Oi7Tsk29o=
│ +
│ +Name: assets/checkpoints-testnet.txt
│ +SHA-256-Digest: GKCG5t8AQ3iu7hEnNDnO4WoNHEJgPv61AbJO9IE2dTg=
│ +
│ +Name: assets/checkpoints.txt
│ +SHA-256-Digest: SkJAWThF1kn6PZiKQhUsH7bQYPETp1tccjH21bhC8A4=
│ +
```

(... 600 more lines from `original/META-INF/MANIFEST.MF`)


Interpretation
--------------

only the 3 files related to app signing `META-INF/BITCOIN-.SF`,
`META-INF/BITCOIN-.RSA` and `META-INF/MANIFEST.MF` differ.

Schildbach's
[Bitcoin Wallet](https://play.google.com/store/apps/details?id=de.schildbach.wallet)
is verifiable!
