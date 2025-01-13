---
wsId: 
title: Bull Bitcoin (Beta)
altTitle: 
authors:
- danny
users: 1000
appId: com.bullbitcoin.mobile
appCountry: 
released: 2023-10-31
updated: 2024-12-27
version: 0.4.0
stars: 
ratings: 
reviews: 
size: 
website: http://bullbitcoin.com
repository: https://github.com/SatoshiPortal/bullbitcoin-mobile
issue: https://github.com/SatoshiPortal/bullbitcoin-mobile/issues/326
icon: com.bullbitcoin.mobile.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2025-01-13
signer: 
reviewArchive:
- date: 2023-07-05
  version: 0.3.2
  appHash: 
  gitRevision: 3fadfe82d841cefe9dabe322d1422f8404c98484
  verdict: nonverifiable 
twitter: bullbitcoin_
social:
- https://www.facebook.com/bullbitcoindotcom
- https://t.me/bullbitcoinofficial
- https://www.linkedin.com/company/bull-bitcoin
redirect_from: 
developerName: Bull Bitcoin
features: 

---

# Verification 2025-01-12 for version 0.4.0

We have successfully integrated the bullbitcoin dockerfile with the testAAB.sh script, which now passes on the location of the device-spec.json file. 

`$ ./testAAB.sh -d /var/shared/apk/com.bullbitcoin.mobile/0.4.0/ -s /var/shared/device-spec/a11/device-spec.json` 

## Diff results 

```
Differences found between /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/armeabi_v7a and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/armeabi_v7a
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/armeabi_v7a/AndroidManifest.xml and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/armeabi_v7a/AndroidManifest.xml differ
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/armeabi_v7a/lib/armeabi-v7a/libapp.so and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/armeabi_v7a/lib/armeabi-v7a/libapp.so differ
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/armeabi_v7a/lib/armeabi-v7a/libboltz_dart.so and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/armeabi_v7a/lib/armeabi-v7a/libboltz_dart.so differ
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/armeabi_v7a/lib/armeabi-v7a/liblwk_dart.so and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/armeabi_v7a/lib/armeabi-v7a/liblwk_dart.so differ
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/armeabi_v7a/lib/armeabi-v7a/libpayjoin_flutter.so and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/armeabi_v7a/lib/armeabi-v7a/libpayjoin_flutter.so differ
Only in /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/armeabi_v7a: META-INF
Only in /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/armeabi_v7a: stamp-cert-sha256
Differences saved to /tmp/test_com.bullbitcoin.mobile_0.4.0/diff_armeabi_v7a.txt

Comparing base...
Differences found between /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/base and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/base
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/base/res/xml/splits0.xml and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/base/res/xml/splits0.xml differ
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/base/resources.arsc and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/base/resources.arsc differ
Only in /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/base: stamp-cert-sha256
Differences saved to /tmp/test_com.bullbitcoin.mobile_0.4.0/diff_base.txt

Comparing en...
Differences found between /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/en and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/en
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/en/AndroidManifest.xml and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/en/AndroidManifest.xml differ
Only in /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/en: META-INF
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/en/resources.arsc and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/en/resources.arsc differ
Only in /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/en: stamp-cert-sha256
Differences saved to /tmp/test_com.bullbitcoin.mobile_0.4.0/diff_en.txt

Comparing xhdpi...
Differences found between /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/xhdpi and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/xhdpi
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/xhdpi/AndroidManifest.xml and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/xhdpi/AndroidManifest.xml differ
Only in /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/xhdpi: META-INF
Binary files /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/xhdpi/resources.arsc and /tmp/test_com.bullbitcoin.mobile_0.4.0/fromBuild-unzipped/xhdpi/resources.arsc differ
Only in /tmp/test_com.bullbitcoin.mobile_0.4.0/fromPlay-unzipped/xhdpi: stamp-cert-sha256
Differences saved to /tmp/test_com.bullbitcoin.mobile_0.4.0/diff_xhdpi.txt
Built base.apk not found at /tmp/test_com.bullbitcoin.mobile_0.4.0/built-split_apks/base.apk

```

## Diffoscope results

**armeabi_v7a**
{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-AndroidManifest.xml.html' %}
{% include diffoscope-modal.html label='libapp.so' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-libapp.so.html' %}
{% include diffoscope-modal.html label='libboltz_dart.so' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-libboltz_dart.so.html' %}
{% include diffoscope-modal.html label='liblwk_dart.so' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-liblwk_dart.so.html' %}
{% include diffoscope-modal.html label='libpayjoin_flutter.so' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-libpayjoin_flutter.so.html' %}

**base**
{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/base/diffo-com.bullbitcoin.mobile_v0.4.0-base-AndroidManifest.xml.html' %}
{% include diffoscope-modal.html label='resources.arsc' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/base/diffo-com.bullbitcoin.mobile_v0.4.0-base-resources.arsc.html' %}
{% include diffoscope-modal.html label='splits0.xml' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/base/diffo-com.bullbitcoin.mobile_v0.4.0-base-splits0.xml.html' %}

**en**
{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/en/diffo-com.bullbitcoin.mobile_v0.4.0-en-AndroidManifest.xml.html' %}
{% include diffoscope-modal.html label='resources.arsc' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/en/diffo-com.bullbitcoin.mobile_v0.4.0-en-resources.arsc.html' %}

**xhdpi**
{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/xhdpi/diffo-com.bullbitcoin.mobile_v0.4.0-xhdpi-AndroidManifest.xml.html' %}
{% include diffoscope-modal.html label='resources.arsc' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/xhdpi/diffo-com.bullbitcoin.mobile_v0.4.0-xhdpi-resources.arsc.html' %}


## Asciicast 

{% include asciicast %}

## Conclusion

Even if we exclude the signing related diffs, the above results lead us to conclude that version 0.4.0 of the app is **nonverifiable**

# Previous Review 2024-08-30

## App Description from Google Play

> Bull Bitcoin Mobile is a self-custodial Bitcoin and Liquid Network which offers non-custodial atomic swaps across Bitcoin, Lightning and Liquid.

### General features

> - Non-custodial: private keys are generated on the device, and never leave the device.
> - Multiple wallets can be created. Users can switch easily from one wallet to the other on the wallet homepage.
> - Walets with BIP39 passphrases can be created.
> - Amounts can be viewed as Bitcoin or Sats.
> - Users can enable RBF for each transaction.
> - Users can send the full wallet balance (sweep a wallet).

## Analysis

1. We were given the 12-word phrase during the wallet creation stage

2. The app has lightning, Bitcoin and liquid wallets.


