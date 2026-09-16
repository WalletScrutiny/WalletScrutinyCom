---
title: TapDano
date: 2026-09-16
authors:
- danny
website: https://tapdano.com
redirect_from:
- /android/com.tapdano.app/
- /iphone/com.tapdano/
- /mobile/com.tapdano/
android:
  appId: com.tapdano.app
  users: 100
  appCountry: us
  released: 2025-09-15
  updated: 2026-03-05
  version: '1.42'
  icon: com.tapdano.app.png
  meta: fewusers
  verdict: nobtc
  developerName: TapDano
iphone:
  appId: com.tapdano
  idd: '6752780931'
  appCountry: us
  released: 2025-09-24
  updated: 2026-03-06
  version: '1.42'
  reviews: 0
  icon: com.tapdano.jpg
  meta: ok
  verdict: nobtc
  developerName: TAPDANO, LLC

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6752780931" author="overtorment" severity="high" finding="The server issues the Seed Vault AES key, later receives it back, and SET_SYNC uploads the full tag." note="Per overtorment&#8217;s analysis of the iPhone app, build 1.42: he found no hidden upload of recovery phrases, and what the card stores is encrypted on the device. His concern is where the password doing that encryption comes from: TapDano&#8217;s own cloud service issues it and later receives it back, so the company holds what is needed to unlock the card&#8217;s contents. Separately, the optional &#8220;Chrome Extension Sync&#8221; uploads the whole card object &#8212; that password together with the encrypted seed phrases &#8212; to the same service. He notes that sync is something the user chooses, not something the app does by itself. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

TapDano is published by TAPDANO, LLC and is not a wallet in the ordinary sense. It is a companion app for a physical product: a "Seed Vault" NFC card that stores a recovery phrase, which you write to and read back by tapping the card against your phone. The Google Play description says it "lets you store and restore Cardano wallet Seed Phrases quickly and intuitively." The project is open source and was funded by Cardano Catalyst Fund 10.

## Testing and Analysis

This assessment was recorded on 2026-09-16.

### We could not get past the app's first screen, and that limits what follows

The app installs and opens on a current Android phone with NFC switched on, but it stops immediately at a screen headed **Scan Card**, reading "Place your Seed Vault Card near your phone's NFC area" with a counter showing 0 / 1. Without one of the developer's physical cards there is no way forward, so we saw nothing of the app beyond that gate.

Everything below therefore comes from the developer's own published material rather than from using the product. We would rather say so than imply we tested more than we did.

### Everything the developer publishes says Cardano, and none of it says Bitcoin

The Google Play description names the chain outright:

> The TapDano NFC Seed Phrase Vault is a one tap peace of mind. With proprietary NFC cards, it lets you store and restore **Cardano wallet Seed Phrases** quickly and intuitively.

The source code agrees, and it is public. The [TapDano project](https://github.com/tapdano) publishes the card's firmware, its developer kit and a smart contract, and they describe a Cardano product throughout:

- The [Java Card applet](https://github.com/tapdano/applet) that runs on the card "integrates Cardano blockchain transactions with smart card technology" and signs using **Ed25519**, which is the signature scheme Cardano uses. Bitcoin does not use Ed25519.
- A separate repository, `cardano-tapdano-validation`, exists for verifying those signatures on Cardano.
- The project README describes it as "an open-source effort funded by Cardano Catalyst Fund 10".

Across the company's website, its store listing and its public code, Bitcoin and BTC do not appear at all, while Cardano appears throughout. There is no Bitcoin option to look for and no Bitcoin-named token standing in for one.

It is worth being precise about what the card is, since it is unusual. The applet offers two kinds of tag: "Soulbound", where the private key cannot be taken off the card, and "Extractable", where it can. Either way the key material it is built around is Cardano's.

### overtorment's finding was not tested

We could not reach any part of the app he describes. His finding concerns where the password protecting the card's contents comes from, and an optional sync feature — neither of which is visible before the card gate.

We note that his account and the developer's openness are not in conflict: TapDano publishes the card firmware and the developer kit, but the cloud service that issues the password is a service, not something a reader can check from the repositories. Nothing here confirms or contradicts him.

### Verdict: does not support Bitcoin (BTC)

TapDano is a storage card for Cardano recovery phrases. Its store listing says Cardano, its published firmware signs with Cardano's signature scheme, it has a Cardano smart contract for verification, and it was funded by a Cardano grant. Bitcoin appears nowhere in anything the developer publishes. Both entries on this page are the same product, so we conclude that both the Android and iPhone apps **do not support Bitcoin (BTC)**.

This verdict rests on the developer's published material and source code, not on a hands-on test, because the app cannot be used without a physical card we do not have. If that changes and the app's own screens show something different, the verdict should be revisited.

The review stops at the Bitcoin-support gate. The key-escrow material above is overtorment's research, recorded here so readers can weigh it; it is not a finding of ours. Custody and source availability are not assessed.
