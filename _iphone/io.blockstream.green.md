---
wsId: GreenBitcoinWallet
title: "Green: Bitcoin Wallet"
altTitle: 
authors:
- leo
appId: io.blockstream.green
appCountry: 
idd: 1402243590
released: 2019-03-22
updated: 2021-08-17
version: "3.6.6"
stars: 3.81
reviews: 100
size: 44669952
website: https://blockstream.green
repository: 
issue: 
icon: io.blockstream.green.jpg
bugbounty: 
verdict: nonverifiable
date: 2020-12-19
signer: 
reviewArchive:


providerTwitter: Blockstream
providerLinkedIn: blockstream
providerFacebook: Blockstream
providerReddit: 

redirect_from:

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
