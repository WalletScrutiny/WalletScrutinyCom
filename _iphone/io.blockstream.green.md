---
wsId: GreenBitcoinWallet
title: 'Green: Bitcoin Wallet'
altTitle: 
authors:
- leo
appId: io.blockstream.green
appCountry: 
idd: 1402243590
released: 2019-03-22
updated: 2022-10-13
version: 3.8.9
stars: 4.8
reviews: 78
size: '52890624'
website: https://blockstream.com/green/
repository: 
issue: 
icon: io.blockstream.green.jpg
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2020-12-19
signer: 
reviewArchive: 
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream

---

The description in the App Store is not explicit about the app being
non-custodial and on their website we read:

> **Unmatched Security**<br>
  Our innovative multisignature model uses dual private keys - one held by the
  user, and one by our servers. This allows us to enforce Two-Factor
  Authentication to protect your funds, while timelock smart contracts guarantee
  that users always retain full control of their coins.

This model never puts the provider in a position of being able to spend the
user's coins but the user cannot spend the coins neither until a predefined
time elapsed, should their servers not cooperate.

While not uncontroversial, this is not custodial
but so far nobody reproduced the build, so claims about security are
**not verifiable**.
