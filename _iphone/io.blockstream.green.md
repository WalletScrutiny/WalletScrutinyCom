---
wsId: GreenBitcoinWallet
title: Blockstream BTC Wallet (Green)
altTitle: 
authors:
- leo
appId: io.blockstream.green
bitcoinOrgId: green
appCountry: 
idd: 1402243590
released: 2019-03-22
updated: 2026-05-18
version: 5.4.1
reviews: 1156
website: https://blockstream.com/app
repository: https://github.com/Blockstream/green_ios
icon: io.blockstream.green.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2020-12-19
signer: 
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
features:
- companion
- TOR
- customNode
- foss
- liquid
- ln
developerName: Blockstream

---

{% include featureEvidence.html feature="companion" source="[App Store](https://apps.apple.com/app/io.blockstream.green)" quote="Pair with Blockstream Jade for ultimate security of your private keys." %}

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

{% include featureEvidence.html feature="ln" quote="Send and receive Lightning payments and manage Liquid Bitcoin (LBTC), Tether's USDt, and other Liquid assets with built-in Liquid wallet support." source="Store" %}

{% include featureEvidence.html feature="liquid" quote="Send and receive Lightning payments and manage Liquid Bitcoin (LBTC), Tether's USDt, and other Liquid assets with built-in Liquid wallet support." source="Store" %}

{% include featureEvidence.html feature="TOR" quote="Connect via Tor at the tap of a button." source="Store" %}

{% include featureEvidence.html feature="customNode" quote="CONNECT TO YOUR OWN NODE Verify transactions on your own full node with SPV support." source="Store" %}

{% include featureEvidence.html feature="foss" quote="Blockstream App is released under the terms of the GNU General Public License. See LICENSE for more information or see https://opensource.org/licenses/GPL-3.0" source="GitHub README" %}