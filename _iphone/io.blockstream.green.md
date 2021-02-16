---
title: "Green: Bitcoin Wallet"
altTitle: 

appId: io.blockstream.green
idd: 1402243590
released: 2019-03-22
updated: 2021-02-07
version: "3.4.9"
score: 3.97674
reviews: 86
size: 31421440
developerWebsite: https://blockstream.green
repository: 
issue: 
icon: io.blockstream.green.jpg
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-12-19
reviewStale: true
signer: 
reviewArchive:


providerTwitter: Blockstream
providerLinkedIn: company/blockstream
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
