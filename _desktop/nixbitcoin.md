---
title: Fort Nix Bitcoin
appId: nixbitcoin
authors:
- danny
released: 2020-04-08
discontinued: 
updated: 2026-05-12
version: 0.0.136
binaries: 
provider: Nix Bitcoin
providerWebsite: 
website: https://nixbitcoin.org/
repository: https://github.com/fort-nix/nix-bitcoin
icon: nixbitcoin.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-14
twitter: nixbitcoinorg
social: 
builds: 
features:
- TOR
- customNode
- liquid
- ln
- mix
- multiSig
- ownFullNode
- ownLN

---

{% include featureEvidence.html feature="ln" quote="lnd with support for announcing an onion service and static channel backups" source="GitHub README" %}

{% include featureEvidence.html feature="ownLN" quote="lndconnect: connect your wallet to lnd or clightning via WireGuard or Tor" source="GitHub README" %}

{% include featureEvidence.html feature="ownFullNode" quote="bitcoind" source="GitHub README" %}

{% include featureEvidence.html feature="TOR" quote="All applications use Tor for outbound connections and support accepting inbound connections via onion services." source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="The nix-bitcoin security fund is a 2 of 3 bitcoin multisig address open for donations" source="GitHub README" %}

{% include featureEvidence.html feature="mix" quote="JoinMarket" source="GitHub README" %}

{% include featureEvidence.html feature="liquid" quote="liquid: federated sidechain" source="GitHub README" %}

{% include featureEvidence.html feature="customNode" quote="electrs: Electrum server" source="GitHub README" %}