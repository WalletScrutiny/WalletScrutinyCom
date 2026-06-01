---
title: Sparrow Wallet
appId: sparrow
bitcoinOrgId: sparrow
authors:
- danny
released: 2020-09-02
discontinued: 
updated: 2026-05-22
version: 2.5.1
binaries: 
provider: Craig Raw
providerWebsite: 
website: https://www.sparrowwallet.com
repository: https://github.com/sparrowwallet/sparrow
icon: sparrow.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-06-10
twitter: SparrowWallet
social: 
builds:
- arch: x86_64-linux-gnu
  types:
    tarball:
    - '*-x86_64.tar.gz'
    deb:
    - '*_amd64.deb'
    rpm:
    - '*.x86_64.rpm'
- arch: x86_64-windows
  types:
    zip:
    - 'Sparrow-*.zip'
    msi:
    - 'Sparrow-*.msi'
features:
- airGapped
- companion
- TOR
- batching
- coinCtrl
- customNode
- foss
- mix
- multiSig
- ownFullNode
- segwit

---

{% include featureEvidence.html feature="airGapped" source="[Website](https://www.sparrowwallet.com)" quote="Support for all common hardware wallets in USB and airgapped modes" %}
{% include featureEvidence.html feature="companion" source="[Website](https://www.sparrowwallet.com)" quote="Support for all common hardware wallets in USB and airgapped modes" %}

## App Description

Lightweight, but fully featured, Sparrow is a source-available program that allows users a full-range of capabilities to connect to Bitcoin Core as well as ColdCard. However, there's an open issue regarding the [ability to export WIF private keys from addresses.](https://github.com/sparrowwallet/sparrow/issues/1445). The founder [notes](https://github.com/sparrowwallet/sparrow/issues/1445#issuecomment-2589806288):

> There is another risk - if the attacker knows the xpub at the derivation path of the parent (e.g. m/84'/0'/0'/0) all of the private keys for the receive or change chain can be derived.

Sparrow is not just an app, but a philosophy-methodology in itself. It recommends that users act in accordance to the level of their belief in bitcoin. The more belief they have over it - the more they should have it. The more they have of it, the higher their security posture. These tiers could be found [here.](https://sparrowwallet.com/docs/best-practices.html#summary).

The seed phrases can be accessed under "Settings" > "Keystores". Its self-custodial and source-available nature makes this app suitable for thorough reproducibility verification.

{% include featureEvidence.html feature="segwit" quote="Full support for single sig and multisig wallets on common script types" source="Website" comment="Combined with bech32 address support implied by 'common script types' — however this is not explicit enough alone" %}

{% include featureEvidence.html feature="multiSig" quote="Full support for single sig and multisig wallets on common script types" source="Website" %}

{% include featureEvidence.html feature="TOR" quote="Built in Tor" source="Website" %}

{% include featureEvidence.html feature="coinCtrl" quote="Full coin and fee control with comprehensive coin selection" source="Website" %}

{% include featureEvidence.html feature="mix" quote="Send and receive to PayNyms, both directly (BIP47) and collaboratively" source="Website" %}

{% include featureEvidence.html feature="customNode" quote="A range of connection options: Public servers, Bitcoin Core and private Electrum servers" source="Website" %}

{% include featureEvidence.html feature="ownFullNode" quote="A range of connection options: Public servers, Bitcoin Core and private Electrum servers" source="Website" %}

{% include featureEvidence.html feature="foss" quote="Sparrow is licensed under the Apache 2 software licence." source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="Sparrow is also unique in that it contains a fully featured transaction editor that also functions as a blockchain explorer. This feature not only allows editing of all of a transaction's fields, also easy inspection of the transaction bytes before broadcasting." source="Website" %}