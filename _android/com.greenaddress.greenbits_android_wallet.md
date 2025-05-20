---
wsId: GreenBitcoinWallet
title: 'Green: Bitcoin Wallet'
altTitle: 
authors:
- leo
- danny
- keraliss
users: 100000
appId: com.greenaddress.greenbits_android_wallet
appCountry: 
released: 2015-01-01
updated: 2025-04-01
version: 4.1.8
stars: 4.4
ratings: 946
reviews: 141
website: https://blockstream.com/green
repository: https://github.com/Blockstream/green_android
issue: https://github.com/Blockstream/green_android/issues/253
icon: com.greenaddress.greenbits_android_wallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- c5f04cdba74164db04a2e036462846c97a01c80879a095b6883af84249cb2736
date: 2025-03-07
signer: 32f9cc00b13fbeace51e2fb51df482044e42ad34a9bd912f179fedb16a42970e
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
redirect_from:
- /greenwallet/
- /com.greenaddress.greenbits_android_wallet/
- /posts/2019/11/greenwallet/
- /posts/com.greenaddress.greenbits_android_wallet/
developerName: Blockstream Inc
features: 

---

For that latest version, our {% include testScript.html %} returned this:

```
===== Begin Results =====
appId:          com.greenaddress.greenbits_android_wallet
signer:         32f9cc00b13fbeace51e2fb51df482044e42ad34a9bd912f179fedb16a42970e
apkVersionName: 4.1.5
apkVersionCode: 22000444
verdict:        nonreproducible
appHash:        c5f04cdba74164db04a2e036462846c97a01c80879a095b6883af84249cb2736
commit:         71d8d7144aa5ff5ca118325c0d2a98885e7d69a8

Diff:
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000444/assets/dexopt/baseline.prof and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000444/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000444/classes3.dex and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000444/classes3.dex differ
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000444/META-INF: GREENADD.RSA
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000444/META-INF: GREENADD.SF
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000444/META-INF: MANIFEST.MF

Revision, tag (and its signature):
object 71d8d7144aa5ff5ca118325c0d2a98885e7d69a8
type commit
tag release_4.1.5
tagger Luca Vaccaro <me@lvaccaro.com> 1738762045 +0100

Release 4.1.5
===== End Results =====
```

We noticed a diff in `classes3.dex` file. Using diffoscope, we found the following detailed differences:

```
--- /tmp/play_apk_extract/classes3.dex
+++ /tmp/built_apk_extract/classes3.dex
├── dexdump -a -d -f -h {}
│┄ Ignoring differences in offsets to keep diff size reasonable.
│ @@ -1,12 +1,12 @@
│  DEX version '037'
│  DEX file header:
│  magic               : 'dex\n037\0'
│ -checksum            : e6c4af2d
│ -signature           : c81e...2f58
│ +checksum            : 8a42af85
│ +signature           : c76f...1459
│  file_size           : 11073548
│  header_size         : 112
│  link_size           : 0
│  link_off            : 0 (0x000000)
│  string_ids_size     : 65833
│  string_ids_off      : 112 (0x000070)
│  type_ids_size       : 10554
│ @@ -18944,18 +18944,18 @@
│        registers     : 1
│        ins           : 0
│        outs          : 1
│        insns size    : 18 16-bit code units
│  16751c:                                        |[16751c] blockstream_green.common.generated.resources.ActualResourceCollectorsKt.allStringResources_delegate$lambda$1:()Ljava/util/Map;
│  16752c: 2200 9225                              |0000: new-instance v0, Ljava/util/LinkedHashMap; // type@2592
│  167530: 7010 eef4 0000                         |0002: invoke-direct {v0}, Ljava/util/LinkedHashMap;.<init>:()V // method@f4ee
│ -167536: 7110 142e 0000                         |0005: invoke-static {v0}, Lblockstream_green/common/generated/resources/String3_commonMainKt;._collectCommonMainString3Resources:(Ljava/util/Map;)V // method@2e14
│ -16753c: 7110 7e24 0000                         |0008: invoke-static {v0}, Lblockstream_green/common/generated/resources/String1_commonMainKt;._collectCommonMainString1Resources:(Ljava/util/Map;)V // method@247e
│ -167542: 7110 3e29 0000                         |000b: invoke-static {v0}, Lblockstream_green/common/generated/resources/String2_commonMainKt;._collectCommonMainString2Resources:(Ljava/util/Map;)V // method@293e
│ -167548: 7110 ca1f 0000                         |000e: invoke-static {v0}, Lblockstream_green/common/generated/resources/String0_commonMainKt;._collectCommonMainString0Resources:(Ljava/util/Map;)V // method@1fca
│ +167536: 7110 ca1f 0000                         |0005: invoke-static {v0}, Lblockstream_green/common/generated/resources/String0_commonMainKt;._collectCommonMainString0Resources:(Ljava/util/Map;)V // method@1fca
│ +16753c: 7110 3e29 0000                         |0008: invoke-static {v0}, Lblockstream_green/common/generated/resources/String2_commonMainKt;._collectCommonMainString2Resources:(Ljava/util/Map;)V // method@293e
│ +167542: 7110 142e 0000                         |000b: invoke-static {v0}, Lblockstream_green/common/generated/resources/String3_commonMainKt;._collectCommonMainString3Resources:(Ljava/util/Map;)V // method@2e14
│ +167548: 7110 7e24 0000                         |000e: invoke-static {v0}, Lblockstream_green/common/generated/resources/String1_commonMainKt;._collectCommonMainString1Resources:(Ljava/util/Map;)V // method@247e
│  16754e: 1100                                   |0011: return-object v0
│        catches       : (none)
│        positions     : 
│          0x0000 line=1
│          0x0001 line=2
│          0x0002 line=3
│          0x0003 line=4
│ @@ -4177511,8 +4177511,8 @@
│          0x02d0 line=721
│          0x02d1 line=722
│          0x02d2 line=723
│          0x02d3 line=724
│          0x02d4 line=725
│          0x02d5 line=726
│          0x02d6 line=727
│ -[ Too much input for diff (SHA256: e0b9541c53037292070f7a8058fde3b2a56b562487a8ccf5a7269e9391ddf111) ]
│ +[ Too much input for diff (SHA256: 3b855b8dc73f7cd034b9ad33ec77efc89e3ada3f03cd88cfcf70822d3ed2636e) ]
├── classes3.jar
│ ├── zipinfo -v {}
│ │ @@ -4338,15 +4338,15 @@
│ │    version of encoding software:                   2.0
│ │    minimum file system compatibility required:     MS-DOS, OS/2 or NT FAT
│ │    minimum software version required to extract:   2.0
│ │    compression method:                             none (stored)
│ │    file security status:                           not encrypted
│ │    extended local header:                          no
│ │    file last modified on (DOS date/time):          1980 Jan 1 00:00:00
│ │ -  32-bit CRC value (hex):                         6e1b581c
│ │ +  32-bit CRC value (hex):                         056bf9e4
│ │    compressed size:                                2433 bytes
│ │    uncompressed size:                              2433 bytes
│ │    length of filename:                             77 characters
│ │    length of extra field:                          0 bytes
│ │    length of file comment:                         0 characters
│ │    disk number on which file begins:               disk 1
│ │    apparent file type:                             binary
│ ├── blockstream_green/common/generated/resources/ActualResourceCollectorsKt.class
│ │ ├── procyon -ec {}
│ │ │ @@ -43,18 +43,18 @@
│ │ │      
│ │ │      private static final Map allStringArrayResources_delegate$lambda$2() {
│ │ │          return new LinkedHashMap();
│ │ │      }
│ │ │      
│ │ │      private static final Map allStringResources_delegate$lambda$1() {
│ │ │          final LinkedHashMap linkedHashMap = new LinkedHashMap();
│ │ │ +        String0_commonMainKt._collectCommonMainString0Resources((Map)linkedHashMap);
│ │ │ +        String2_commonMainKt._collectCommonMainString2Resources((Map)linkedHashMap);
│ │ │          String3_commonMainKt._collectCommonMainString3Resources((Map)linkedHashMap);
│ │ │          String1_commonMainKt._collectCommonMainString1Resources((Map)linkedHashMap);
│ │ │ -        String2_commonMainKt._collectCommonMainString2Resources((Map)linkedHashMap);
│ │ │ -        String0_commonMainKt._collectCommonMainString0Resources((Map)linkedHashMap);
│ │ │          return linkedHashMap;
│ │ │      }
│ │ │      
│ │ │      public static final Map getAllStringResources(final Res res) {
│ │ │          Intrinsics.checkNotNullParameter((Object)res, "<this>");
│ │ │          return (Map)ActualResourceCollectorsKt.allStringResources$delegate.getValue();
│ │ │      }
                               |0011: return-object v0
```

Decompilation of the class shows the same method ordering difference:

```java
private static final Map allStringResources_delegate$lambda$1() {
    final LinkedHashMap linkedHashMap = new LinkedHashMap();
+   String0_commonMainKt._collectCommonMainString0Resources((Map)linkedHashMap);
+   String2_commonMainKt._collectCommonMainString2Resources((Map)linkedHashMap);
    String3_commonMainKt._collectCommonMainString3Resources((Map)linkedHashMap);
    String1_commonMainKt._collectCommonMainString1Resources((Map)linkedHashMap);
-   String2_commonMainKt._collectCommonMainString2Resources((Map)linkedHashMap);
-   String0_commonMainKt._collectCommonMainString0Resources((Map)linkedHashMap);
    return linkedHashMap;
}
```

The differences are in the method call ordering during compilation. The Kotlin compiler has reordered these independent method calls differently between the Play Store and our built versions. While this difference appears benign (all methods are still called on the same map object), our strict policy requires a nonreproducible verdict for any binary differences.

Additional differences:
- Different checksum and signature values in the DEX header
- Different baseline.prof file (used for Android Runtime optimization)
- Missing signature files in our built version (expected)

Despite the differences being minor and likely having no functional impact, we must classify this as nonreproducible since the distributed app cannot be proven to be built exactly from the published source code.


Version 4.1.5 of {{ page.title }} is **nonverifiable**. 


{% include asciicast %}
