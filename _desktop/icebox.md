---
title: Icebox
appId: icebox
authors:
- danny
released: 2026-11-04
discontinued: 
updated: 2026-11-26
version: 0.4.1
binaries: https://github.com/amisatoshi/icebox/releases
provider: Blockchainology
providerWebsite: https://www.blockchainology.co.uk
website: https://github.com/amisatoshi/icebox
repository: https://github.com/amisatoshi/icebox
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-11-26
twitter: weareblockchain
social: 
builds: 
features:
- companion
- customNode
- foss
- taproot

---

{% include featureEvidence.html feature="companion" source="[README](https://github.com/amisatoshi/icebox#readme)" quote="Icebox is a third-party coordinator: it does the job the official Frostsnap app does (talking to the devices over USB, running the FROST key generation and signing protocol, keeping track of your Bitcoin wallet)" %}

{% include featureEvidence.html feature="customNode" source="[User guide](https://github.com/amisatoshi/icebox/blob/v0.4.1/docs/guide/10-settings.md#use-your-own-node-recommended-for-mainnet)" quote="Use your own node (recommended for mainnet)" %}

{% include featureEvidence.html feature="foss" source="[LICENSE](https://github.com/amisatoshi/icebox/blob/v0.4.1/LICENSE)" quote="MIT License" %}

## App Description

Icebox is a desktop wallet for Windows, macOS and Linux that works with
{% include walletLink.html wallet='hardware/frostsnap' verdict='true' %} devices. It does the job
of Frostsnap's own app: it talks to the devices over USB, runs the FROST key generation and
signing, and tracks the wallet's balance and history over Electrum. Underneath it uses Frostsnap's
own open-source Rust crates, pinned to a fixed commit
([Cargo.toml](https://github.com/amisatoshi/icebox/blob/v0.4.1/Cargo.toml)).

It is not made by Frostsnap. The [GitHub account](https://github.com/amisatoshi) behind it names
Blockchainology as its company, and Blockchainology posted the
[0.4.1 announcement](https://x.com/weareblockchain/status/2125746536789512298). On the same
[X account](https://x.com/weareblockchain) it also announced that it is a paid affiliate partner
of Frostsnap.

The project is young. The repository was created in October 2026, the first release came out on
2026-11-04, and every release so far is marked as a pre-release. The README says "early and
unaudited" and asks users to try it with test coins first.

## The keys

Icebox never holds a private key. Each Frostsnap device holds one share, spending needs the
threshold number of devices, and each device shows the payment on its own screen before it signs
([README](https://github.com/amisatoshi/icebox#security-model-briefly)). Receive addresses can be
checked on a device too.

The wallet database on the computer holds no keys, but it shows the wallet's addresses, balances
and history. Like Frostsnap's own desktop app, Icebox stores it with a fixed, all-zero encryption
key, so the README tells users to protect the file with disk encryption.

## Release integrity

The installers are built by GitHub Actions
([release.yml](https://github.com/amisatoshi/icebox/blob/v0.4.1/.github/workflows/release.yml)),
which publishes a `SHA256SUMS` file and a GitHub build provenance attestation, checked with
`gh attestation verify`. The releases carry no PGP signature.

## Analysis

The full source is public under the MIT license, so this desktop wallet is
{% include verdictBadge.html verdict="sourceavailable" type='short' %}. We can look into
reproducibility next.
