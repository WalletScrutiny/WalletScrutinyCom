---
wsId: BRDBitcoin
title: "BRD Bitcoin Wallet, Buy BTC"
altTitle: 
authors:
- leo
appId: org.voisine.breadwallet
appCountry: 
idd: 885251393
released: 2014-06-22
updated: 2021-08-19
version: "4.12.1"
stars: 4.57645
reviews: 11458
size: 61320192
website: https://brd.com/
repository: https://github.com/breadwallet/brd-mobile
issue: https://github.com/breadwallet/brd-mobile/issues/1
icon: org.voisine.breadwallet.jpg
bugbounty: 
verdict: nonverifiable
date: 2021-06-29
signer: 
reviewArchive:
- date: 2021-06-27
  version: "4.10.0"
  appHash: 
  gitRevision: 5f9d3e8bf00be2ad8968b129c27258ea45ce2680
  verdict: nosource
- date: 2020-12-21
  version: "4.9.0.3"
  appHash: 
  gitRevision: a928ed573992e73ddec01d811a7fe81a3d5f62c2
  verdict: nonverifiable

providerTwitter: BRDHQ
providerLinkedIn: brdhq
providerFacebook: brdhq
providerReddit: brdapp

redirect_from:

---

**Update 2021-06-29**: The provider
[informed us](https://github.com/breadwallet/breadwallet-android/issues/117#issuecomment-869938323)
that the latest code can be found in a new repository. Apparently the
[new repository](https://github.com/breadwallet/brd-mobile)
is a fork of the
[old android repository](https://github.com/breadwallet/breadwallet-android)
where they
[changed the license](https://github.com/breadwallet/brd-mobile/commit/9c563ce83521bebee375641a65e965392fa7057a)
from open source to some look-dont-touch license. For us, both provide the same
degree of transparency so we have to revert the last change in verdict. This app
does indeed share up to date source code although the git tag and the App Store
version name [do differ](https://github.com/breadwallet/brd-mobile/issues/1).

**Update 2021-06-27**: As pointed out
[here](https://github.com/breadwallet/breadwallet-android/issues/117#issuecomment-869031603),
the provider stopped updating the public source repository and thus is to be
considered closed source. The current version on the App Store is 4.11 from
yesterday. The latest version available on their GitHub is 4.9.0.3 from
2021-03-16.

This provider claims

> Trusted by nearly 5 million users in over 170 countries. Nearly $7B USD in
  cryptocurrency under protection.

which is worrying for your privacy cause "how would they know?".

> **Total Bitcoin Cryptocurrency Wallet Privacy**<br>
  No signup is required and BRD connects directly to blockchain networks, not
  BRD’s servers. You are in total control of your privacy and bitcoin crypto
  wallet.

This is a claim which directly implies this app to be non-custodial and they say
it explicitly here:

> **Unhackable Cryptocurrency Security**<br>
  Store all your valuable cryptocurrency in a virtually unhackable environment,
  all for free! Your bitcoin crypto wallet is protected on your own device
  utilizing industry-leading hardware encryption and Apple's mobile security.

Terms like "Unhackable" and "total security" raise our suspicion though. Nothing
is totally secure. Nothing is absolutely unhackable.

But back to the protocol ... So the provider claims the app is non-custodial.
Can we test that? Where is the source code? No link on App Store ...

On their website we find a link to their GitHub and there a repository with
[a promising name](https://github.com/breadwallet/breadwallet-ios).

So is it reproducible? As all iPhone app, we don't see how to reproduce this one
and neither does the provider claim its reproducibility and we give it the
verdict **not verifiable**.
