---
title: KeepKey
appId: keepKey
authors:
- leo
- Mohammad
- danny
released: 2014-08-01
discontinued: 
updated: 2025-02-12
version: 7.10.0
binaries: https://github.com/keepkey/keepkey-firmware/releases
dimensions:
- 38
- 94
- 12
weight: 54
provider: 
providerWebsite: 
website: https://shapeshift.com
shop: https://shapeshift.com/keepkey
country: US
price: 49USD
repository: https://github.com/keepkey/keepkey-firmware
issue: https://github.com/keepkey/keepkey-firmware/issues/342
icon: keepKey.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 518ad41643ee8a0aa6a6422f8534ac94f56cd65bc637aea4db7f3fdbb53255c3
date: 2024-05-10
signer: 
twitter: ShapeShift_io
social:
- https://www.facebook.com/ShapeShiftPlatform
builds: 
features: 

---

# Original Analysis with all our considerations

**Update 2021-07-31**: Reid Rankin, a contributor to the project
[replied](https://github.com/keepkey/keepkey-firmware/issues/283#issuecomment-888604838)
to our questions about reproducibility and provided instructions on how to
reproduce the firmware after all. Find it [at the end of the Analysis](#upd0731).

{{ page.title }} is a clone of the
{% include walletLink.html wallet='hardware/trezorOne' verdict='true' %}
and as such we will hopefully come to the same conclusions.

> **Stress-Free Security**<br>
  Generate and manage your private keys offline in cold storage, guarded from
  computer vulnerabilities and viruses, while utilizing wallet software for safe
  transactions.

> **Sleek and Simple Display**<br>
  The large display gives clarity to every digital asset sent and received on
  your device. Each transaction must be manually approved using the confirmation
  button, giving you control and visibility over your transactions.

That sounds like it's a hardware wallet by our standards.

On their [help page](https://shapeshift.zendesk.com/hc/en-us/articles/360060952231-Is-KeepKey-Open-Source-)
they also clarify:

> **Is KeepKey Open Source?**<br>
  KeepKey’s firmware is 100% open source.<br>
  Take a look at our source code on [GitHub](https://github.com/keepkey) page!

This device is **source available**.
