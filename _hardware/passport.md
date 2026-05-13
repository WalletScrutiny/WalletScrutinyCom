---
title: Foundation Passport - Founder's Edition
appId: passport
authors:
- kiwilamb
- '@sethforprivacy'
- leo
released: 2020-07-01
discontinued: 
updated: 2024-02-21
version: v2.3.0
binaries: https://github.com/Foundation-Devices/passport2/releases
dimensions:
- 38
- 100
- 23
weight: 138
provider: 
providerWebsite: 
website: https://foundationdevices.com/
shop: 
country: US
price: 
repository: https://github.com/Foundation-Devices/passport2
icon: passport.png
bugbounty: https://foundationdevices.com/security/
meta: discontinued
verdict: sourceavailable
date: 2024-04-18
signer: 
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://t.me/foundationdevices
- https://www.reddit.com/r/FoundationDevices/
builds: 
features:
- hd
- airGapped
- camera
- secEl

---

{% include featureEvidence.html feature="hd" source="[README](https://github.com/Foundation-Devices/passport2#readme)" quote="word_list_gen - Simple utility for creating optimized word lookup metadata for BIP-39 and bytewords." %}
{% include featureEvidence.html feature="airGapped" source="[README](https://github.com/Foundation-Devices/passport2#readme)" quote="This is the new standard air-gapped wallets are expected to adopt moving forward." %}
{% include featureEvidence.html feature="camera" source="[README](https://github.com/Foundation-Devices/passport2#readme)" quote="Quirc is a QR decoding library that offers an embedded-friendly interface to process images from a camera for QR codes." %}
{% include featureEvidence.html feature="secEl" source="[README](https://github.com/Foundation-Devices/passport2#readme)" quote="bootloader C-based code that handles secure element initialization, firmware validation and updates, and system startup." %}

{{ page.title }} is the original and now discontinued version of
{% include walletLink.html wallet='hardware/passportb2' verdict='true' %}.

It is still maintained with firmware updates.

## Reproducibility

Expected fingerprints aka hashes can be found on the
[release page](https://github.com/Foundation-Devices/passport2/releases).

With our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/passport.sh)
and the parameters `$version`, `mono`, `$buildHash`, `$releaseHash`:

