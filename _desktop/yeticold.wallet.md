---
title: Yeti Cold Wallet
appId: yeticold.wallet
authors:
- danny
released: 2019-10-04
discontinued: 
updated: 2025-06-20
version: 
binaries: 
provider: JWWeatherman
providerWebsite: 
website: https://yeticold.com
repository: https://github.com/JWWeatherman/yeticold
icon: yeticold.wallet.webp
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-10-14
twitter: YetiWallet
social: 
builds: 
features:
- companion
- TOR
- airGapped
- hd
- multiSig
- ownFullNode

---

{% include featureEvidence.html feature="companion" source="[README](https://github.com/JWWeatherman/yeticold#readme)" quote="Private keys are never on any device with a channel to an Internet connected device except through USB drives." %}

## Description

It is self-described as a "self-custodial, source-available Bitcoin cold storage solution". So it's more of a methodology with its own scripts.

Yeti is a Bitcoin-only cold storage solution that prioritizes security through a 3-of-7 multisig approach. The software creates private keys in an offline fashion, ensuring they never exist on internet-connected devices except through controlled USB transfers. 

While users need to clone the repository and run the scripts themselves, the **source code is fully available** on GitHub and can be audited. This transparency allows users to verify the code's security before trusting it with their Bitcoin. The project emphasizes minimal dependencies beyond Bitcoin Core and focuses on counterfeit prevention through full node verification. However, it has no binaries to verify.

## Update 2026-10-14

We checked the [repository](https://github.com/JWWeatherman/yeticold) again:

- **No binaries.** There are still no GitHub releases or tags. Users clone the repository and run its Python
  scripts (`appyeticold.py`, `appyetihot.py`, `appyetiwarm.py`, `initialize.py`). The only binary involved is
  Bitcoin Core, which Yeti downloads from bitcoincore.org and checks with `verifySig.sh` (the `SHA256SUMS` hash and
  four Bitcoin Core builder keys). The setup guide is a separate repository,
  [yetihosted](https://github.com/JWWeatherman/yetihosted), last changed in June 2024.
- **Little development.** The last code change was a two-line fix on 2025-06-20. Earlier in 2025 the project added
  `deprecatedrpc=create_bdb` so Bitcoin Core still creates the older ("legacy") wallet type Yeti relies on; its
  commit message reads "Better solution required sooner than later".
- **Old Bitcoin Core.** Yeti still installs Bitcoin Core 27.0, which reached end of life on 2025-10-10 and no
  longer gets security fixes. The current release is 31.1. Since version 30.0, Bitcoin Core can no longer create or
  load legacy wallets and has removed `dumpprivkey`. Yeti's key generation uses both: it creates a legacy wallet,
  reads each new key with `dumpprivkey`, and mixes it with the user's dice rolls. Yeti Hot also needs a legacy
  wallet. The storage wallets are already the newer descriptor type. So Yeti cannot move to a supported Bitcoin
  Core version until its key generation changes. We reported this in
  [issue #187](https://github.com/JWWeatherman/yeticold/issues/187).

Nothing here changes our assessment: the source is available, and there is no binary for us to reproduce.

{% include featureEvidence.html feature="multiSig" quote="A 3 of 7 multisig addresses is used for bitcoin storage. This allows up to 4 keys to be lost without losing bitcoin and requires 3 locations to be compromised by an attacker to lose funds." source="GitHub README" %}

{% include featureEvidence.html feature="hd" quote="HD Multisig is used so that you can send funds to 1,000 addresses, but recover all funds using only 3 seed phrases." source="GitHub README" %}

{% include featureEvidence.html feature="ownFullNode" quote="Yeti uses a bitcoin core full node. This means nothing is shared beyond what is required to create a bitcoin transaction." source="GitHub README" %}

{% include featureEvidence.html feature="TOR" quote="Yeti also uses Tor." source="GitHub README" %}

{% include featureEvidence.html feature="airGapped" quote="Private keys are never on any device with a channel to an Internet connected device except through USB drives." source="GitHub README" %}