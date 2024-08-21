---
wsId: swissBitcoinPay
title: Swiss Bitcoin Pay
altTitle: 
authors:
- danny
users: 1000
appId: ch.swissbitcoinpay.checkout
appCountry: 
released: 2022-11-15
updated: 2024-08-19
version: 2.1.1
stars: 4.7
ratings: 
reviews: 
size: 
website: https://swiss-bitcoin-pay.ch
repository: https://github.com/SwissBitcoinPay/app
issue: https://github.com/SwissBitcoinPay/app/issues/53
icon: ch.swissbitcoinpay.checkout.png
bugbounty: 
meta: ok
verdict: wip
date: 2024-08-21
signer: 
reviewArchive:
- date: 2024-06-04
  version: 
  appHash: 
  gitRevision: 49d9b9282cfd495e90fb6d839423ce6ad7b5d721
  verdict: ftbfs
twitter: SwissBitcoinPay
social:
- https://www.linkedin.com/company/swiss-bitcoin-pay
- https://www.youtube.com/@swissbitcoinpay
redirect_from: 
developerName: Swiss Bitcoin Pay
features:
- ln

---

## App Description from Google Play

> Accept Bitcoin in your business.
>
> Worldwide. Free to start. No hardware. Non-custodial.
>
> The simplest way to accept Bitcoin payments in your Business, restaurant, bar, and others.
>
> So simple to use:
> 1. You type the amount in your local currency.
> 2. Client scan the QR or tap a Lightning NFC Card.
> 3. Paid.
>
> Maximum compatibility:
>
> Through the same screen, receive in:
> Bitcoin On-chain
> Lightning
> Lightning-NFC standard
>
> Non-custodial
>
> After clients have paid through Onchain and/or Lightning, the Lightning-BTC will be converted to Onchain-BTC (free of charge) and will all be sent to your private wallet (free of charge), as configured in your account.

- All the bitcoins that you charge via Swiss Bitcoin Pay will be sent to the address you provide.
- Lightning to Onchain conversions and miner fees are always free of charge for you
- Payout is done every day at 0:00 UTC
- A cryptographic signature of your Bitcoin wallet is required to prove ownership.

## Analysis 

- Account creation was straight-forward. It only required an email address.
- The 12-word seed phrase were provided during wallet creation.
- They claim to have their app on [F-Droid](https://swiss-bitcoin-pay.ch/fdroid/repo/).
- They provided the fingerprint (SHA-256) of the repository signing key.

# 2024-08-19 Dockerfile Update

The providers of Swiss Bitcoin Pay accommodated our request and provided a Dockerfile to build the app.

As such we were able to make a modified copy of their project's Dockerfile and incorporated it with our <strong>test script <a href="/testScript">(?)</a></strong>. Here are the summarized results:

```
===== Begin Results =====
appId:          ch.swissbitcoinpay.checkout
signer:         17d9c0bf025008da16d5a146e1beaca6ddcfe3cb0cf063da23c847d3007eb621
apkVersionName: 2.1.1
apkVersionCode: 381
verdict:        
appHash:        62df7d225d6178688f451604552fb5d79525a257ac59e281f0c02f4c96e4d343
commit:         b350085a6f30027a83a8fdb18b73c5aed073cc97

Diff:
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/AndroidManifest.xml and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/AndroidManifest.xml differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/assets/index.android.bundle and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/assets/index.android.bundle differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_bitcoinwhiteborder.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_bitcoinwhiteborder.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_boltcardblack.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_boltcardblack.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_boltcard.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_boltcard.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_logosquarerounded.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/drawable-mdpi-v4/src_assets_images_logosquarerounded.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/res/mipmap-hdpi-v4/ic_launcher_adaptive_fore.png and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/res/mipmap-hdpi-v4/ic_launcher_adaptive_fore.png differ
Files /tmp/fromPlay_ch.swissbitcoinpay.checkout_381/resources.arsc and /tmp/fromBuild_ch.swissbitcoinpay.checkout_381/resources.arsc differ
Only in /tmp/fromPlay_ch.swissbitcoinpay.checkout_381: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====

Run a full
diff --recursive /tmp/fromPlay_ch.swissbitcoinpay.checkout_381 /tmp/fromBuild_ch.swissbitcoinpay.checkout_381
meld /tmp/fromPlay_ch.swissbitcoinpay.checkout_381 /tmp/fromBuild_ch.swissbitcoinpay.checkout_381
or
diffoscope "/var/shared/apk/ch.swissbitcoinpay.checkout/381/ch.swissbitcoinpay.checkout_v381.apk" /tmp/test_ch.swissbitcoinpay.checkout/base-master.apk
for more details.
```
The app built successfully although many of the differences consisted of timestamps and file permission codes.
[Link to full diffoscope here.](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/ch.swissbitcoinpay.checkout/diff-results.html)

For now, we leave this as a work-in-progress.

