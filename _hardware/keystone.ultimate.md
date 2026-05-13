---
title: Keystone Ultimate
appId: keystone.ultimate
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Yanssie HK Limited
providerWebsite: https://keyst.one/
website: https://keyst.one/
shop: https://shop.keyst.one/products/keystone-ultimate#deadLink
country: HK
price: 479USD
repository: https://github.com/KeystoneHQ/Keystone-cold-app
icon: keystone.ultimate.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-02-17
signer: 
twitter: KeystoneWallet
social: 
builds: 
features:
- airGapped
- camera
- foss
- secEl

---

This device is the same as {% include walletLink.html wallet='hardware/cobovaultessential' verdict='true' %} but with more durable casing. 

Here is the notice on its [product page](https://shop.keyst.one/products/keystone-ultimate#deadLink):
  
> Further manufacturing of it is currently pending and **might become available sometime in 2023/2024**.

This product is currently out of stock.

{% include featureEvidence.html feature="foss" quote="This project is licensed under the GPL License. See the LICENSE file for details." source="GitHub README" %}

{% include featureEvidence.html feature="secEl" quote="Interaction with the Secure Element (SE) via serial port, open source SE firmware can be found at keystone-se-firmware. Transaction data is signed by the Secure Element and the generated signature is sent back to the application." source="GitHub README" %}

{% include featureEvidence.html feature="camera" quote="Interaction with the mobile application Keystone companion app via QR code." source="GitHub README" %}

{% include featureEvidence.html feature="airGapped" quote="Keystone is an air-gapped, open source hardware wallet that uses completely transparent QR code data transmissions." source="GitHub README" %}

An issue has been opened at [https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/380](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/380)
