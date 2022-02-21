---
wsId: Hexa2
title: "Hexa 2.0 Bitcoin App"
altTitle: 
authors:
- danny
users: 1000
appId: io.hexawallet.hexa2
appCountry: in
released: 2021-09-30
updated: 2022-02-02
version: "2.0.69"
stars: 5.0
ratings: 29
reviews: 4
size: 57M
website: https://hexawallet.io/
repository: https://github.com/bithyve/hexa
issue: 
icon: io.hexawallet.hexa2.png
bugbounty: 
meta: ok
verdict: ftbfs
date: 2021-10-18
signer: 
reviewArchive:

providerTwitter: HexaWallet
providerLinkedIn: bithyve
providerFacebook: 
providerReddit: 

redirect_from:

---

## Updated Verdict 2021-12-21

While the app developers claim that it is self-custodial, this app has failed to build from source. This was addressed in [issue 2544](https://github.com/bithyve/hexa/issues/2544).

> I checked our build config the dev flavour of our app can be built in debug mode. The build script to create a release apk of our production version is not in the project.
>
> I will add this to the project and add instructions on how to build it. I can’t specify a ETA for this right now but it will be done soon.
>
> On a side note, I did 2 builds one after the other on AppCentre to see if they are the same. using Android APK analyser I could still see some differences; very tiny differences in a couple of auto generated files. I am keen to understand if you will be using APK analyser to verify builds or will it be a straight diff comparison of binaries, or something else.

This correspondence has been made in January 23, 2021. Since then, there has been no update.

## App Description

The app's Google play description claims that the app is non-custodial. It has partnered with Swan Bitcoin which is a custodial service that allows users to "DCA" (Dollar Cost Average) into bitcoin. The Swan service is built-in the Hexa app. Unlike most self-custodial wallets, Hexa splits the seed into recovery keys which are then spread out over multiple devices. We posted a [screenshot of this on twitter.](https://twitter.com/BitcoinWalletz/status/1472114001916010501)

## The Site
The first level of security is the cloud backup. As Hexawallet aptly points out in their [FAQ](https://hexawallet.io/faq/),

> A normal Bitcoin Wallet relies on you remembering a set of words (often called a “mnemonic”) or a secret number (your “private key”) and losing these renders your account unusable. Hexa aims to simplify this by allowing you to recover access to your funds by splitting your seed into multiple parts (called “Recovery Keys”) shared between you and your Keepers (trusted people whom you can rely on in the event of emergency, like your mother)

Seeds are split into Recovery Keys:

> Recovery Keys are encrypted parts of your seed that are split and shared with your Keepers. Hexa creates 5 Recovery Keys, and having access to any 3 enables you to recover your wallet. These Keys are encrypted, so no one can read them without you requesting for them in the event of an emergency.




