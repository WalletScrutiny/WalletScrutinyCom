---
title: Freewallet Desktop
appId: freewallet
authors:
- danny
released: 2017-10-13
discontinued: 
updated: 2025-02-04
version: 2.0.4
binaries: 
provider: J-Dog
providerWebsite: 
website: https://freewallet.io/
repository: https://github.com/jdogresorg/freewallet-desktop
issue: 
icon: freewallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-08-01
twitter: FreeWallet
social:
- https://www.facebook.com/freewallet.io
builds: 
features:
- fingerprint
- foss
- batching
- segwit
- tradeAlts

---

{% include featureEvidence.html feature="fingerprint" source="[Website](https://freewallet.io/)" quote="Add an Password, PIN or thumbprint scan to give your wallet an additional layer of security." %}
{% include featureEvidence.html feature="foss" source="[Website](https://freewallet.io/)" quote="FreeWallet Desktop is also open-source, and available for anyone to fork or review." %}

## App Description

[DOCUMENTATION](https://davestaxcp.gitbook.io/freewallet.io-user-manual)

Once the app is downloaded, there are two options possible:

**Secure**

> All encryption is handled client-side. Neither your passphrase nor any of your private information ever leaves your browser, workstation, or mobile device.
>
> FreeWallet passphrases are highly secure, and protect your wallet from any brute force attacks. They are also rather easy to learn and hard to mistype.

**Simple**

> With FreeWallet, your passphrase is literally your wallet, and all of your addresses and keys are generated on-the-fly when you log in.
>
> There are no wallet files to backup or secure, and using your passphrase you can access your wallet from any trusted machine with a web browser.

Freewallet supports watch-only addresses, offline message signing and hardware wallet integration.

Some confusion in terminologies exist however, as the seedphrases are described as the BIP39 passphrase (12-words). Normally, the seed phrases are distinct from the passphrase, which acts like a singular word (or the 13th or 25th word).

It has a licensing agreement which states:

## Section 1.2

> Operators do not have access to the Bitcoins stored on the platform, instead Freewallet.io, FreeWallet Mobile, and FreeWallet Desktop simply provide a means to access Bitcoins, Counterparty (XCP), and other digital assets recorded on the Bitcoin blockchain. Bitcoin private keys are encrypted using the BIP32 Hierarchical Deterministic Wallet algorithm such that Freewallet.io, FreeWallet Mobile, and FreeWallet Desktop cannot access or recover Bitcoins, Counterparty (XCP), or other digital assets in the event of lost or stolen password.

The desktop app supports Bitcoin, is non-custodial, source-available, and therefore **for verification**.

{% include featureEvidence.html feature="segwit" quote="Supports multiple addresses as well as segwit, importing private keys, and watch-only addresses." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="Integrated exchange interface that allows peer-to-peer trading of counterparty tokens in a truly decentralized and trustless manner." source="Website" %}

{% include featureEvidence.html feature="batching" quote="MPMA Sends allow sending of many tokens to many addresses in a single transaction." source="Website" %}