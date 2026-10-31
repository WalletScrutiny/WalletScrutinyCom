---
title: Ledger Nano S
appId: ledgerNanoS
bitcoinOrgId: ledgernanos
authors:
- leo
released: 
discontinued: 2022-09-16
updated: 
version: 
binaries: 
dimensions:
- 57
- 17
- 9.1
weight: 16.2
provider: 
providerWebsite: 
website: https://www.ledger.com/
shop: https://web.archive.org/web/20220808202636/https://shop.ledger.com/products/ledger-nano-s
country: FR
price: 45999CLP
repository: https://github.com/LedgerHQ/app-bitcoin
icon: ledgerNanoS.webp
bugbounty: 
meta: discontinued
verdict: nosource
date: 2026-10-30
signer: 
twitter: Ledger
social:
- https://www.linkedin.com/company/ledgerhq
- https://www.facebook.com/Ledger
- https://www.reddit.com/r/ledgerwallet
- https://www.instagram.com/ledger
- https://www.youtube.com/Ledger
- https://www.tiktok.com/@ledger
builds: 
features: 

---

**Update 2026-10-30:** Ledger stopped selling the Nano S in 2022; since at least September 2022 its shop page leads to the {% include walletLink.html wallet='hardware/ledger.nano.splus' verdict='true' %} ([Wayback](https://web.archive.org/web/20220916213919/https://shop.ledger.com/products/ledger-nano-s)). In mid 2025 Ledger also ended software updates and new apps for the Nano S, but existing devices still work ([Blockworks](https://blockworks.com/news/ledger-nano-s-support-ending), [Ledger](https://x.com/Ledger/status/1947301117571784847)).

**Update 2024-12-08:** Ledger has not changed their take on source availability.

Ledger has this to say about their technology:

> At Ledger we are developing hardware wallet technology that provides the
  highest level of security for crypto assets. Our products combine a Secure
  Element and a proprietary OS designed specifically to protect your assets.

"proprietary OS" does not sound good. As we learned when reviewing
{% include walletLink.html wallet='hardware/trezorOne' verdict='true' %},
"Secure" Elements and open source firmware do not go well together and that is
why Ledger's firmware (or OS) is proprietary and to our knowledge closed source.

Looking around we cannot find any pointers to the firmware's code but plenty of
claims for it being closed source.
[[1]](https://www.reddit.com/r/ledgerwallet/comments/m4crxn/closedsource_firmware_code_and_potential_of/)
[[2]](https://www.reddit.com/r/ledgerwallet/comments/drycu3/close_source_nature_of_ledger_dangers/)
[[3]](https://www.reddit.com/r/Bitcoin/comments/h8n3rt/ledger_closed_source/).

Ledger defends their stance on using this approach
[here](https://www.ledger.com/secure-hardware-and-open-source).

While arguably there is scenarios under which a "Secure" Element with a closed
source firmware could save a user from theft, it **opens the door for a provider
to steal all the funds of all the users at once**, which is our mission to call
out. This product is **not verifiable**.
