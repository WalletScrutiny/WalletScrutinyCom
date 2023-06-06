---
wsId: rWallet
title: RWallet
altTitle: 
authors:
- danny
- leo
- emanuel
users: 1000
appId: com.rsk.rwallet.v2
appCountry: us
released: 2021-04-27
updated: 2021-06-30
version: 2.0.1
stars: 
ratings: 
reviews: 
size: 
website: https://iovlabs.org/
repository: https://github.com/rsksmart/rwallet
issue: https://github.com/rsksmart/rwallet/issues/726
icon: com.rsk.rwallet.v2.png
bugbounty: 
meta: stale
verdict: ftbfs
date: 2022-07-01
signer: 
reviewArchive: 
twitter: rsksmart
social:
- https://www.facebook.com/RSKsmart
- https://www.reddit.com/r/rootstock
redirect_from: 
developerName: IoV Labs
features: 

---

## App Description

As described in
[this issue](https://github.com/rsksmart/rwallet/issues/662#issuecomment-827867539),
this app replaces
{% include walletLink.html wallet='android/com.rsk.rwallet.reactnative' verdict='true' %}
and as such had to start from zero with reviews, ratings and downloads.

RWallet is a multi-currency non-custodial wallet that supports Bitcoin. It
supports BTC, Bitcoin on RSK (RBTC), RIF Token (RIF), Dollar On Chain (DOC)

## The App

RWallet has three options:

- Create Basic Wallet
- Import Existing Wallet
- Add Read-only Wallet

Upon clicking "Create Basic Wallet", you are allowed to choose from Segwit or
Legacy crypto address. After this, you are given access to the 12-word recovery
phrase and asked to safeguard it.

You can send and receive like a normal wallet.

After confirming that the recovery phrase has a backup, the app asks you to set
a PIN. This PIN must be entered to access the recovery phrase again.

## Code and Reproducibility

We were able to find a related website even though RWallet's Google Page did not
have a website listed. The contact email address had a domain of
[iovlabs.org](https://iovlabs.org). We could not find any mention of RWallet's
open-source nature on that website. However, searching for the `appID`
'com.rsk.rwallet.v2' brought us to what could possibly be
[RWallet's GitHub repository](https://github.com/rsksmart/rwallet/). Although
this specific repository is not linked from the iovlabs.org, we feel that it
could be relevant as it mentions a lot of related items. 

A while ago
[Emanuel had already looked into this app](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/220#note_605180111)
but as it had only few users, he did not check for reproducibility.

Back then he already ran into the issue that several files are not being
provided in the source repository, making it hard to compile the project and
impossible to compile it in a reproducible way, as the missing files affect the
compiled app.

The [new build instructions](https://github.com/rsksmart/rwallet/wiki/Build-and-Deliver---Android-(Fastlane))
link to a non-existing section about an `.env` file and do not mention the
`google-services.json` Emanuel had to create back then. It is mentioned though
that a signing key is required, which for our purpose should not be the case, as
we intend to work with an unsigned app. How can we build an unsigned version of
the released app?

We conclude, this app is currently **not verifiable**.
