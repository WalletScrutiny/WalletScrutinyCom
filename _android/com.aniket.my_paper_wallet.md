---
wsId: 
title: "My Paper Wallet: Bitcoin Paper Wallet Generator"
altTitle: 
authors:
- danny
users: 1000
appId: com.aniket.my_paper_wallet
released: 2020-12-24
updated: 2020-12-24
version: "1.0.0"
stars: 0.0
ratings: 
reviews: 
size: 8.1M
website: 
repository: 
issue: https://github.com/AniketSindhu/My_Paper_Crypto_Wallet/issues/1
icon: com.aniket.my_paper_wallet.png
bugbounty: 
verdict: stale
date: 2021-12-28
signer: 
reviewArchive:
- date: 2021-03-08
  version: "1.0.0"
  appHash: 
  gitRevision: 6ebb740f957edd101e3adeeee5853307f7a2a16b
  verdict: ftbfs

providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


Building the apk with  `flutter build apk` results in errors.


```
../sdk/flutter/.pub-cache/hosted/pub.dartlang.org/velocity_x-2.0.0-nullsafety.1/lib/src/extensions/context_ext.dart:174:36: Error: No named parameter with the name 'nullOk'.

      Actions.invoke(this, intent, nullOk: nullOk) as bool?;

                                   ^^^^^^

../sdk/flutter/packages/flutter/lib/src/widgets/actions.dart:898:18: Context: Found this candidate, but the arguments don't match.

  static Object? invoke<T extends Intent>(

                 ^^^^^^

../sdk/flutter/.pub-cache/hosted/pub.dartlang.org/velocity_x-2.0.0-nullsafety.1/lib/src/flutter/theme.dart:27:9: Error: No named parameter with the name 'isMaterialAppTheme'.

        isMaterialAppTheme: isMaterialAppTheme,


        ^^^^^^^^^^^^^^^^^^

../sdk/flutter/packages/flutter/lib/src/material/theme.dart:40:9: Context: Found this candidate, but the arguments don't match.

  const Theme({

        ^^^^^
../sdk/flutter/.pub-cache/hosted/pub.dartlang.org/velocity_x-2.0.0-nullsafety.1/lib/src/flutter/theme.dart:36:9: Error: No named parameter with the name 'isMaterialAppTheme'.

        isMaterialAppTheme: isMaterialAppTheme,


        ^^^^^^^^^^^^^^^^^^
../sdk/flutter/packages/flutter/lib/src/material/theme.dart:40:9: Context: Found this candidate, but the arguments don't match.


  const Theme({
        ^^^^^

../sdk/flutter/.pub-cache/hosted/pub.dartlang.org/velocity_x-2.0.0-nullsafety.1/lib/src/flutter/theme.dart:47:9: Error: No named parameter with the name 'isMaterialAppTheme'.

        isMaterialAppTheme: isMaterialAppTheme,

        ^^^^^^^^^^^^^^^^^^

../sdk/flutter/packages/flutter/lib/src/material/theme.dart:40:9: Context: Found this candidate, but the arguments don't match.

  const Theme({

        ^^^^^





FAILURE: Build failed with an exception.



* Where:

Script '/home/appuser/app/sdk/flutter/packages/flutter_tools/gradle/flutter.gradle' line: 991



* What went wrong:

Execution failed for task ':app:compileFlutterBuildRelease'.

> Process 'command '/home/appuser/app/sdk/flutter/bin/flutter'' finished with non-zero exit value 1
```


