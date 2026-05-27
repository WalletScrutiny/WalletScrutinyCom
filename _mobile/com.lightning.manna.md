---
wsId: mannaBitcoin
title: Manna Bitcoin Wallet
date: 2026-05-09
authors:
- danny
website: http://mannabitcoin.com/
twitter: MannaBitcoin
social:
- https://t.me/MannaBitcoin
redirect_from:
- /android/com.lightning.manna/
- /iphone/com.lightning.manna/
android:
  appId: com.lightning.manna
  users: 500
  appCountry: us
  released: 2025-05-14
  updated: 2026-04-28
  version: 1.1.9
  reviews: 7
  icon: com.lightning.manna.png
  meta: fewusers
  verdict: custodial
  developerName: Manna Bitcoin
iphone:
  appId: com.lightning.manna
  idd: '6745337602'
  appCountry: us
  released: 2025-05-16
  updated: 2026-05-06
  version: 1.1.9
  reviews: 8
  icon: com.lightning.manna.jpg
  meta: ok
  verdict: custodial
  developerName: Manna Open Economy LLC

---

## Android

## App Description

Manna is a Liquid-based wallet that advertises support for on-chain Bitcoin, Lightning, and Liquid. The app generates a 12-word BIP39 seed phrase on-device. The seed controls L-BTC (Liquid Bitcoin) keys. On-chain Bitcoin and Lightning are accessed through swap and payment services rather than natively.

The [Play Store listing](https://play.google.com/store/apps/details?id=com.lightning.manna) says Manna is open source. We could not find a public source repository, including when searching GitHub for the app ID.

## Testing and Analysis

Testing screenshots: [https://x.com/BitcoinWalletz/status/2052938467437588936](https://x.com/BitcoinWalletz/status/2052938467437588936)

The verdict of `nosource` rather than `custodial` warrants explanation. The app does generate a 12-word seed on-device, and that seed controls the user's L-BTC keys directly. That is enough to clear the custodial gate in WalletScrutiny's methodology. However, this self-custody only holds at the Liquid layer. Manna's own [Terms of Service](https://mannabitcoin.com/terms/) say the app receives L-BTC through swaps facilitated by third-party services such as Boltz, and stores an address pool for receiving L-BTC in Supabase.

Our testing found that the Lightning receive flow defaults to a Lightning Address hosted on Manna's servers (`@mannabitcoin.com`), and the on-chain BTC receive flow routes through Boltz. The generated on-chain deposit address was not derived from the user's seed phrase when checked in Electrum.

The verdict is `custodial`. While the seed is generated on-device and technically controls L-BTC keys, this does not constitute practical self-custody for Bitcoin. For every payment rail the app presents as "Bitcoin," the user is dependent on third-party infrastructure that the seed cannot recover.

### Can You Recover Your Bitcoin With the Seed Phrase?

**Bitcoin sent to the "BTC" address Manna shows you:** That address belongs to [Boltz](https://boltz.exchange/), not you. Bitcoin sent there goes to Boltz first, which converts it to L-BTC and sends it to your Liquid address. If you import your seed into Electrum, those funds are invisible — the receiving address was never yours. If Boltz fails mid-swap, you would need to use Boltz's own refund mechanism within 24 hours. Your seed is useless for recovering that Bitcoin.

**Lightning payments sent to your `@mannabitcoin.com` address:** Those go to Manna's Lightning node. Manna credits your in-app L-BTC balance. Your seed has no Lightning channel state to recover. If Manna goes offline, incoming Lightning payments are lost.

**L-BTC (Liquid Bitcoin):** This is the only layer the seed actually controls. You could import the seed into a Liquid-compatible wallet such as Green Wallet and recover your L-BTC. But L-BTC is not Bitcoin — to exit to actual Bitcoin you still need either the Liquid Federation's peg-out process or a swap service like Boltz.

In short: the seed gives you custody of L-BTC only. For anything labeled "Bitcoin" or "Lightning" in Manna, you are depending on Boltz and Manna's servers respectively. Neither is recoverable with just your seed phrase.

---

## iPhone

{% include copyFromAndroid.html %}
