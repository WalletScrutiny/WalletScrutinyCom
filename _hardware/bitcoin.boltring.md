---
title: Bitcoin BoltRing
appId: bitcoin.boltring
authors:
- danny
released: '2023-07-22'
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: CoinCorner and Boltcard Contributors
providerWebsite: 
website: https://docs.bolt-ring.com/
shop: >-
  https://bitcoin-ring.com/products/bitcoin-boltring-contactless-nfc-lightning-payment
country: DE
price: 
repository: https://github.com/bitcoin-ring/boltlib
issue: 
icon: bitcoin.boltring.png
bugbounty: 
meta: ok
verdict: nowallet
appHashes: []
date: '2023-12-11'
signer: 
reviewArchive:
- date: '2023-02-07'
  version: 
  appHashes: []
  gitRevision: 77948be1370e50d2b79fdd154ace87768fbe27c1
  verdict: unreleased
twitter: bitcoin_ring
social:
- https://www.youtube.com/@BitcoinRing
features: 

---

## Product Description 

> The ring must be paired with a bolt service. Once set-up it generates unique and encrypted LNURL LUD-17 links with replay protection. Merchants with NFC support at their Point-of-Sales can read the ring and do a limited one time withdraw from your connected lightning wallet.[Source](https://bitcoin-ring.com)
> 
> The BoltRing is compatible with the open LUD-17 LNURLW standard
[Source](https://docs.bolt-ring.com/merchant-compatibility/)
> - Breez Mobile
> - BTCPay Server
> - CoinCorner Checkout
> - LNbits TPoS

The BoltRing currently has the BoltCard (NTAG 424 DNA) Read/Write library in its [repository](https://github.com/bitcoin-ring/boltlib).

## Analysis 

BoltRing's main selling point is that it allows users to quickly and easily sign contactless Bitcoin transaction payments. It does not hold bitcoin/your private keys, instead connecting to your wallet through a bolt service.

Source from the [FAQ:](https://bitcoin-ring.com/pages/faq)

> **What if I lose my BoltRing?**
> Your BoltRing does not hold bitcoin. Instead it is connected with an online lightning wallet through a bolt service. You can deactivate the connected bolt service if you lose your BoltRing.
>
> **How secure is the BoltRing?**
> The BoltRing uses a secure NFC chip that dynamically generates replay protected LNURL-Withdraw links. To improve security you should set reasonable limits and timeouts on the connected bolt service. Remember the BoltRing is not a hardware wallet. Use it responsibly with small amounts for daily spending only.

As the providers themselves state that BoltRing is **not a wallet,** there's no need to review it any further.

