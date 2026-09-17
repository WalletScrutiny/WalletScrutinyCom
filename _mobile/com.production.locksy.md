---
title: Locksy Wallet
date: 2026-09-17
authors:
- danny
iphone:
  appId: com.production.locksy
  idd: '6751943201'
  appCountry: us
  released: 2025-09-17
  updated: 2026-04-03
  version: 1.9.0
  reviews: 0
  icon: com.production.locksy.jpg
  meta: ok
  verdict: nobtc
  developerName: 合同会社九計

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6751943201" author="overtorment" severity="critical" finding="Create/import uploads the recovery phrase to Firestore Users with a Math.random XOR key in the same document." %}

## App Description

Locksy Wallet's [App Store listing](https://apps.apple.com/us/app/locksy-wallet/id6751943201) describes "a secure, non-custodial multi-chain cryptocurrency wallet that lets you manage Bitcoin, Ethereum, Solana, Tron, BNB Chain, Polygon, and 20+ other chains — all in one app". Its feature list leads with "Multi-chain support: Bitcoin (BTC), Ethereum (ETH/ERC20), Solana (SOL), Tron (TRC10/TRC20), Binance Smart Chain (BEP20), Polygon, Avalanche, Arbitrum, Optimism, Base, and more". It also advertises a dApp browser, an NFT gallery and biometric authentication. There is no seller website on the listing. The seller of record is KYUKEI LLC (合同会社九計).

The listing's privacy policy is
[hosted on TermsFeed](https://www.termsfeed.com/live/71c476e7-d8ac-4147-abe6-4a99e9c3b380) and is
generic generator output, by its own admission: "This Privacy Policy has been created with the help
of the Privacy Policy Generator." It names the application as Locksy Wallet, but attributes it to
**"Lockst LLC., Japan"** — not the KYUKEI LLC that publishes the app. It is dated 2025-09-07, seven
months before the current release. It names no coin or chain, so it does not speak to the Bitcoin
question directly.

What it does not say is the notable part. The document describes only routine "Usage Data" — IP
address, device identifiers, operating system, diagnostic data — and names **no third-party service
at all**. There is no mention of a seed phrase, a recovery phrase, a private key, Firebase or
Firestore anywhere in it, although overtorment found the app uploading the recovery phrase to a
Firestore collection.

**This is the one app in this group whose listing claims Bitcoin support.** That claim is the subject of this review, and it is why this page is longer than its siblings.

## Testing and Analysis

This assessment was recorded on 2026-09-17.

### What we checked, and what we did not

We did not run this app. It is published only for iPhone, with no Android counterpart to install, and this review did not include an iOS runtime test. Three descriptions of which assets the app handles are available, and unlike every other app reviewed in this batch, **they do not agree**:

- **The store listing** claims Bitcoin (BTC) first among more than twenty chains.
- **The developer's own store screenshots**, which we examined ourselves, show an Assets list headed **ETH (Ethereum), TRX (TRON), BNB (Binance Smart Chain)**. Bitcoin does not appear in the visible portion.
- **overtorment's coin classification**, derived from the shipped binary, records **ETH, BNB, TRX, USDT, UNI** — no Bitcoin.

The two sources that look at the product rather than advertise it agree with each other. The listing stands alone.

### Why we did not simply take the listing's word

A marketing claim is normally the weakest evidence we use, and on this app there are specific reasons to weigh it lower still.

**The listing is demonstrably false on another checkable claim.** It states that private keys and seed phrases "stay on your device — never shared with any server". overtorment found that creating or importing a wallet uploads the recovery phrase to a Firebase Firestore collection, with the obfuscation key written into the same document. A listing that is wrong about the single property it most wants a reader to believe is not a listing we can rely on for an asset list.

**The privacy policy discloses none of it either.** The generated policy linked from the listing
describes only routine usage telemetry and names no third-party processor, while the app was found
writing the user's recovery phrase into a Firebase Firestore collection. So neither of the two
documents the developer publishes about this app — the listing or the policy — describes what the
shipped code actually does.

**The absence in the binary analysis is a positive finding, not a gap in method.** overtorment's coin classification does report Bitcoin where it exists — in the same research, Noctar Wallet is recorded as "BTC, ETH, TRX". His method therefore detects BTC when present, so its absence here says something about this app rather than about how the analysis was done.

**The app's own identity is an Ethereum address.** The Profile screen in the store screenshots shows a single wallet identified by an EVM address (`0x9937F3…1d64bE`), with no separate Bitcoin address, and overtorment found the backend records keyed by `evmWalletAddress`. A wallet that held Bitcoin would need a Bitcoin address, which is a different format derived from a different chain.

**The build is a white-label template.** overtorment identifies it as the R2Wallet template, the same one behind DROIB and Sparkle. The "20+ other chains" copy plausibly describes what that template can be configured to do rather than what this particular build ships.

### The limit of this finding

The screenshot Assets list is truncated by a "See All" link, so we cannot say from the images alone that no Bitcoin row exists further down. Our conclusion rests on the binary analysis, corroborated by what the screenshots and the wallet's EVM-only identity do show, and on the listing being unreliable. Installing the app and opening the full asset list would settle it directly, and that check has not been done.

### Verdict: does not support Bitcoin (BTC)

Both sources that examine the product — the shipped binary and the developer's own screenshots — show an Ethereum, TRON and BNB Chain wallet with no Bitcoin. The only source claiming otherwise is a store listing already shown to be false about where the user's seed phrase goes. We therefore record **does not support Bitcoin (BTC)**.

A reader deciding whether to install this app should weigh this alongside the seed-phrase finding above: the same listing that advertises Bitcoin also promises that the recovery phrase never leaves the device.

The review stops at the Bitcoin-support gate. If a released build exposes a Bitcoin address and a Bitcoin-network transaction flow, this verdict should be revisited.

### Source availability

No public source repository was found for this app. We searched by bundle identifier, checked the store text, and looked for a published organisation or project; the listing carries no website at all. Without published source there is nothing to build and nothing to compare the released binary against — and on this app in particular, the shipped code is the only place the Bitcoin question could have been answered from the developer's side.
