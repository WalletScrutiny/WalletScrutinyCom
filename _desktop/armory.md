---
title: Armory Secure Wallet
appId: armory
bitcoinOrgId: armory
authors:
- danny
released: 2012-02-15
discontinued: 
updated: 2018-12-24
version: 0.96.5
binaries: 
provider: Armory Technologies
providerWebsite: 
website: https://www.bitcoinarmory.com
repository: https://github.com/goatpig/BitcoinArmory
icon: armory.png
bugbounty: 
meta: obsolete
verdict: sourceavailable
date: 2024-04-24
twitter: armory
social:
- mailto:contact@bitcoinarmory.com
builds: 
features:
- foss
- multiSig
- airGapped
- multiAccount
- ownFullNode
- companion

---

{% include featureEvidence.html feature="foss" source="[README](https://github.com/goatpig/BitcoinArmory#readme)" quote="GNU Affero General Public License (AGPL v3)" %}
{% include featureEvidence.html feature="multiSig" source="[Website](https://www.bitcoinarmory.com)" quote="multi-signature addresses are available using Lockboxes in a completely distributed way" %}
{% include featureEvidence.html feature="airGapped" source="[Website](https://www.bitcoinarmory.com)" quote="Bitcoin cold storage is a system for securely storing Bitcoins on a completely air-gapped offline computer." %}
{% include featureEvidence.html feature="multiAccount" source="[README](https://github.com/goatpig/BitcoinArmory#readme)" quote="Manage multiple wallets (deterministic and watching-only)" %}
{% include featureEvidence.html feature="ownFullNode" source="[README](https://github.com/goatpig/BitcoinArmory#readme)" quote="it relies on on the Satoshi client to securely connect to peers, validate blockchain data, and broadcast transactions" %}
{% include featureEvidence.html feature="companion" source="[Website](https://www.bitcoinarmory.com)" quote="Everything needed to create transactions can be managed from an online computer with a watching only wallet" %}

## App Description

Bitcoin Armory is a desktop-based Bitcoin wallet focused on advanced security and cold storage. It supports full Bitcoin wallet functionality. 

Described in its repository:

> Manage multiple wallets (deterministic and watching-only), print paper backups that work forever, import or sweep private keys, and keep your savings in a computer that never touches the internet, while still being able to manage incoming payments, and create outgoing payments with the help of a USB key.

The wallet is **source-available** but very obsolete. Armory is best known for enabling secure air-gapped setups, multi-signature wallets, and deterministic key generation. 