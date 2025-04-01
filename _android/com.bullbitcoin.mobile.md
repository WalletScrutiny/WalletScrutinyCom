---
wsId: 
title: Bull Bitcoin (Beta)
altTitle: 
authors:
- danny
users: 5000
appId: com.bullbitcoin.mobile
appCountry: 
released: 2023-10-31
updated: 2025-03-22
version: 0.4.4
stars: 
ratings: 
reviews: 
website: http://bullbitcoin.com
repository: https://github.com/SatoshiPortal/bullbitcoin-mobile
issue: https://github.com/SatoshiPortal/bullbitcoin-mobile/issues/326
icon: com.bullbitcoin.mobile.png
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes: []
date: 2025-01-13
signer: 
reviewArchive:
- date: 2023-07-05
  version: 0.3.2
  appHashes: []
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

========================================

## Diff results 

*Excludes AndroidManifest.xml and other signing related diffs.

**armeabi_v7a.apk** - nonverifiable

6a6747180656be691839738a8c5c40528afc7820cb7355e1f7fde7515c99997f - Official
8329375919aa765b863b5be3655b6b193c85487bb67f752de67f49f4eedacd34 - Built 

```
  - libapp.so
  - libboltz_dart.so
  - libllwk_dart.so
  - libpayjoin_flutter.so
```

The **.so** files listed are shared object libraries commonly used in Android applications. 

- **libapp.so:** This is likely a core library for the application, containing essential native code used by the app.
- **libboltz_dart.so:** This library is probably related to the Boltz service, which is used for atomic swaps and other cryptocurrency-related operations. The dart suffix indicates it is used with Dart, the programming language behind Flutter.
- **libllwk_dart.so:** This library might be related to a specific functionality or service within the app, with llwk being an acronym or shorthand for that service. The dart suffix again indicates usage with Dart.
- **libpayjoin_flutter.so:** This library is likely related to the PayJoin protocol, a privacy-enhancing Bitcoin transaction method. The flutter suffix indicates it is used within a Flutter application.

**base.apk** - **nonverifiable**

eda2f8e832d5d07b2269ef444618f9d1b784e523d145243822680a8947d153b7 - Official
2adc1b2499a0a23816787328b002da200f4cccefc9749a2aeadc18bdce72a8e8 - Built

```
  - splits0.xml
```

**en.apk** - **reproducible**

ddaf3734e4510459ae5f0fbbf862532536bcac912e70945cd55e03be6019de93 - Official
a2a0341f6aff908007c27d733532d238f90016b81748b08d866d07e82864f4b9 - Built 

```
  - Only signing-related diffs
```

**xhdpi.apk** - **reproducible**

e1f06b911d85898bf1d9ca55064d2b586c55ea2ef4dafc71876fe4323e28198d - Official
65040fb889b99303f5fa7fe91ad5d58f996a19bbd16bdee711618b8c7e5b631a - Built

```
  - Only signing-related diffs
```

## Diffoscope results

**armeabi_v7a**

  {% include diffoscope-modal.html label='libapp.so' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-libapp.so.html' %}
  {% include diffoscope-modal.html label='libboltz_dart.so' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-libboltz_dart.so.html' %}
  {% include diffoscope-modal.html label='liblwk_dart.so' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-liblwk_dart.so.html' %}
  {% include diffoscope-modal.html label='libpayjoin_flutter.so' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/armeabi_v7a/diffo-com.bullbitcoin.mobile_v0.4.0-armeabi_v7a-libpayjoin_flutter.so.html' %}

**base** 

  {% include diffoscope-modal.html label='splits0.xml' url='/assets/diffoscope-results/android/com.bullbitcoin.mobile/0.4.0/base/diffo-com.bullbitcoin.mobile_v0.4.0-base-splits0.xml.html' %}

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


