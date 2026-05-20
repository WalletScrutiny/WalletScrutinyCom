---
title: Wasabi Wallet
appId: wasabi
bitcoinOrgId: wasabi
authors:
- danny
released: 2018-08-01
discontinued: 
updated: 2025-11-17
version: 2.7.2
binaries: 
provider: zkSNACKs Ltd.
providerWebsite: https://zksnacks.com/
website: https://wasabiwallet.io
repository: https://github.com/WalletWasabi/WalletWasabi
icon: wasabi.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-28
twitter: wasabiwallet
social: 
builds:
- arch: x86_64-linux-gnu
  types:
    deb:
    - Wasabi-*.deb
    tarball:
    - Wasabi-*-linux-x64.tar.gz
- arch: win64
  types:
    zip:
    - Wasabi-*-win-x64.zip
    msi:
    - Wasabi-*.msi
features:
- TOR
- batching
- bip158spv
- coinCtrl
- foss
- mix

---

## App Description

This app is known for its strong privacy measures. It incorporates coinjoins which it describes as a "collaborative bitcoin transaction" that make it harder to track the owner of coins. It self describes succintly that it is self-custodial, source-available and privacy oriented. 

They have a guide on how to [build deterministically.](https://github.com/WalletWasabi/WalletWasabi/blob/master/WalletWasabi.Documentation/Guides/DeterministicBuildGuide.md). 

This should be **for verification.**

{% include featureEvidence.html feature="foss" quote="An open-source, non-custodial, privacy-focused Bitcoin wallet for desktop." source="GitHub README" %}

{% include featureEvidence.html feature="mix" quote="Wasabi integrates the WabiSabi Trustless Multi-Party Transaction Protocol, a cutting-edge mechanism for collaborative transactions." source="Website" %}

{% include featureEvidence.html feature="TOR" quote="All your traffic is routed through the Tor Network, ensuring privacy and anonymity." source="Website" %}

{% include featureEvidence.html feature="bip158spv" quote="Wasabi uses Compact Filters to synchronize with the blockchain privately." source="Website" %}

{% include featureEvidence.html feature="coinCtrl" quote="For users who want granular control over their transactions, Wasabi offers advanced Coin Control features. While Wasabi's engine automatically selects the best coins for your transactions, you can manually choose specific coins to use. This allows for precise management of your UTXOs, ensuring that the selection fits your most specific needs." source="Website" %}

{% include featureEvidence.html feature="batching" quote="Batch Payments: Combine multiple payments into a single transaction to save on mining fees and reduce change outputs." source="Website" %}