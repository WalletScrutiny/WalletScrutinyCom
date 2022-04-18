---
title: CoinKite TAPSIGNER
appId: coinkite.tapsigner
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
weight: 
provider: Coinkite
providerWebsite: https://coinkite.com/
website: https://tapsigner.com/
shop: https://store.coinkite.com/store/tapsigner
country: CA
price: 
repository: https://github.com/coinkite/coinkite-tap-proto
issue: 
icon: coinkite.tapsigner.png
bugbounty: 
meta: ok
verdict: unreleased
date: 2022-04-16
signer: 
reviewArchive: 
twitter: TAPSIGNER
social:
  - https://www.facebook.com/CoinKite/
  - https://www.linkedin.com/company/coinkite/
---

## Background 

{{ page.title }} is an unreleased product coming from the same providers as {% include walletLink.html wallet='bearer/coinkite.satscard' verdict=0 %}. Unlike the SATSCARD, which is a bearer token, the TAPSIGNER is a hardware wallet that holds the user's private keys.

## Product [FAQ](https://tapsigner.com/faq)

**What is TAPSIGNER™?**
> A simple Bitcoin wallet in your pocket. Think of it as a Bitcoin private key on a card! You can sign mobile wallet transactions by tapping the card on your phone. Your mobile wallet provides most of the wallet logic and TAPSIGNER holds the secrets. It's essentially a hardware wallet you can slip inside your regular wallet.

**Is the private key unique and secret?**
Yes. TAPSIGNER comes without a private key. The setup process combines your entropy (random bits) with secret entropy picked by the card.

**Could TAPSIGNER be generating private keys that look random but aren't?**
> No. Each customer provides their own chain code for entropy. Before making a deposit, a customer can verify TAPSIGNER incorporated the chain code entropy when it generated the keys.

One of the answers confirms that the TAPSIGNER is not a bearer token:

**Do I give the TAPSIGNER to other people as payment?**
> No. Keep the TAPSIGNER under your control at all times. You might be thinking of the SATSCARD™.

Like its aforementioned sibling, SATSCARD, this device features a **RF blocking sleeve.** 

**Do I need this paper envelope it came in?**
> Yes! That's a special radio frequency (RF) blocking sleeve. It prevents unwanted access by RF readers with bad intentions. Be sure to insert TAPSIGNER fully into the sleeve: even 5 mm sticking out can allow a sneaky reader to get a signal.
 
## Analysis 

Coinkite's official shop lists this product as "Coming Soon" with no official price listed. {{ page.title }} is **unreleased.**