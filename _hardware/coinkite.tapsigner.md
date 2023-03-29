---
title: CoinKite TAPSIGNER
appId: coinkite.tapsigner
authors:
- danny
released: 2022-08-05
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
price: 39.99USD
repository: https://github.com/coinkite/coinkite-tap-proto
issue: 
icon: coinkite.tapsigner.png
bugbounty: 
meta: ok
verdict: sealed-noita
date: 2023-02-13
signer: 
reviewArchive: 
- date: 2022-04-29
  version: 
  appHash: 
  gitRevision: 8762a3742
  verdict: wip
twitter: TAPSIGNER
social:
- https://www.facebook.com/CoinKite/
- https://www.linkedin.com/company/coinkite/
features: 

---

## Background 

{{ page.title }} is an NFC card from the same providers as {% include walletLink.html wallet='bearer/coinkite.satscard' verdict='true' %}. 

## The Site

From the product [FAQ:](https://tapsigner.com/faq)

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

Similar to our concerns about the SATSCARD, this still begs the question as to how much damage a malicious "sneaky RF reader" can cause.

According to the FAQ, the card can be used with {% include walletLink.html wallet='android/io.nunchuk.android' %}. Here is a link to a [tutorial](youtube.com/watch?v=wTX-wZGGDsE) on how to set it up.
 
## Analysis 

TAPSIGNER claims to not come with prefilled private keys, instead opting to use the user's "entropy" combined with the product's entropy to create a private key of its own during setup. Because TAPSIGNER used BIP-32 and not BIP-39, users can make an encrypted backup of the private key file rather than a 12 or 24 word seed phrase.

Unfortunately this card may fall victim to **blind transaction signing.** It is acknowledged in the site's FAQ:

**Can I use it on an untrusted computer?**
> The private key is generated inside and never leaves the TAPSIGNER, regardless of any malware and keyloggers that may be present on a connected computer.
>
> However, the wallet you paired with the TAPSIGNER can ask the TAPSIGNER to sign any transaction. You can't verify what you're signing since the TAPSIGNER does not have a screen and, therefore, cannot display transaction information. We recommend the COLDCARD if this is a concern.

