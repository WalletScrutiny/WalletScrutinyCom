---
title: SeedSigner
appId: seedsigner
authors:
- danny
- leo
released: 2020-12-20
discontinued: 
updated: 2025-02-05
version: 0.8.6
binaries: https://github.com/SeedSigner/seedsigner/releases
dimensions: 
weight: 
provider: Seed Signer
providerWebsite: 
website: https://seedsigner.com/
shop: https://btc-hardware-solutions.square.site/product/orange_pill_kit/6?cs=true&cst=custom
country: US
price: 93USD
repository: https://github.com/SeedSigner/seedsigner
icon: seedsigner.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- bcb901e27d309d85f086dc80b49b153d6b1caab2247eba2811731384d58f2f3e
- 1e93a82e62d4a1defbdc777a6762a813f4cb5c3ef9090da0bd07542dfd6f62bf
- 398d9bf9cda0858fe97c0788b353194c1c902335a858b7dbf5d7b213bda75d96
- d298ffad3c765e11e48873efc6d1c65e4230528fde4d5bd4701bb507acbf493c
date: 2025-06-30
signer: 
twitter: SeedSigner
social:
- https://t.me/joinchat/GHNuc_nhNQjLPWsS
- https://snort.social/p/npub17tyke9lkgxd98ruyeul6wt3pj3s9uxzgp9hxu5tsenjmweue6sqq4y3mgl
builds: 
features:
- selfBuild
- airGapped
- camera
- foss
- hd
- multiSig
- segwit

---

**Update 2023-09-14**: Seedsigner
[announced reproducibility](https://twitter.com/SeedSigner/status/1701600348136436134)
with their latest release that they even gave the promising name
**The "It's reproducible forever, Laura" Release**. So we went and had a look
how reproducible it is. After some
[initial hurdles](https://twitter.com/LeoWandersleb/status/1702070495615611148),
we were
[pointed](https://twitter.com/KeithMukai/status/1702094039984595388) to the
[correct build instructions](https://github.com/SeedSigner/seedsigner-os/blob/main/docs/building.md).
That looks easy. Let's see how it goes ... crossing fingers the public wifi in
a café in the Bavarian countryside holds up ...

## Old Analysis

The Seed Signer is a truly Open Source project that lowers the barrier for entry for airgapped multi-signature cryptocurrency hardware wallets. The code is publicly available as are the instructions for assembly. 

It claims to [solve the following problems](https://seedsigner.com/faqs/):

> - Creates a secure, air-gapped environment for private key generation
> - Enforces strict separation between private key storage and protocol software / internet
> - Lowers the barrier cost of multi-sig security (from several hundred to < $50)

## Can the private keys be created offline? 

Yes. The seed signer is airgapped.

## Are the private keys shared? 

No. The companion apps only get signed transactions and no keys.

## Does the device display the receive address for confirmation?

Yes. 

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes. 

We had a little
[back-and-forth with the provider on Twitter](https://twitter.com/WalletScrutiny/status/1507201398735220736).

{% include featureEvidence.html feature="hd" quote="Calculate the final word (aka checksum) of a 12- or 24-word BIP39 seed phrase" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="The goal of SeedSigner is to lower the cost and complexity of Bitcoin multi-signature wallet use." source="GitHub README" %}

{% include featureEvidence.html feature="airGapped" quote="SeedSigner offers anyone the opportunity to build a verifiably air-gapped, stateless Bitcoin signing device using inexpensive, publicly available hardware components" source="GitHub README" %}

{% include featureEvidence.html feature="segwit" quote="Native Segwit Multisig XPUB generation" source="GitHub README" %}

{% include featureEvidence.html feature="camera" quote="Sign transactions & transfer XPUB data using animated QR codes" source="GitHub README" %}


{% include featureEvidence.html feature="foss" quote="Starting with v0.7.0, the images distributed via GitHub are reproducible. This means you and others can verify the released images are byte-for-byte the same when built from source." source="GitHub README" %}
{% include featureEvidence.html feature="selfBuild" quote="SeedSigner offers anyone the opportunity to build a verifiably air-gapped, stateless Bitcoin signing device using inexpensive, publicly available hardware components (Raspberry Pi Zero, a display HAT, and a camera module)." source="[GitHub README](https://github.com/SeedSigner/seedsigner)" comment="Hardware is entirely off-the-shelf (Raspberry Pi Zero, Waveshare display, camera module). Full assembly instructions published. No custom PCB required." %}
