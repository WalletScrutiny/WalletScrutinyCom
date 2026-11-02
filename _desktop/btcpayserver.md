---
title: BTCPay Server
appId: btcpayserver
authors:
- danny
released: 2017-09-29
discontinued: 
updated: 2026-10-29
version: 2.4.7
binaries: https://hub.docker.com/r/btcpayserver/btcpayserver
provider: BTCPay Server Foundation
providerWebsite: https://foundation.btcpayserver.org/
website: https://btcpayserver.org/
repository: https://github.com/btcpayserver/btcpayserver
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-11-02
twitter: BtcpayServer
social: 
builds: 
features:
- foss
- ln
- ownFullNode
- TOR

---

**⚠️ Warning:** On 2026-11-01, BTCPay Server told everyone running an instance to shut it down with `./btcpay-down.sh` after reports that attackers were sweeping hot wallets on BTCPay servers. Founder Nicolas Dorier linked the compromised servers to versions older than 2.4.2 and said public servers on 2.4.7 had not been attacked. The investigation was still open when we wrote this, with no loss total and no fix announced. Watch-only wallets, whose seed never touches the server, are not exposed. ([Bitcoin.com News](https://news.bitcoin.com/security/bitcoin-payment-processor-btcpay-hit-by-hot-wallet-theft-reports/), [TFTC](https://www.tftc.io/btcpay-server-hot-wallet-drained-emergency-shutdown)) This is the second theft in three months: in August 2026, version 2.4.2 fixed a flaw that let attackers take LND credentials and drain the Lightning nodes of BTCPay merchants. ([CoinDesk](https://www.coindesk.com/tech/2026/08/08/another-bitcoin-infrastructure-exploit-hits-this-time-draining-merchant-lightning-nodes))

## App Description

BTCPay Server is a self-hosted payment processor that merchants run on their own server, usually through the official Docker deployment, which also installs Bitcoin Core, Tor and optionally a Lightning node. It creates invoices, shows the checkout page to customers and tracks incoming payments. Payments go straight to the merchant's wallet; BTCPay "does not hold funds as a payment intermediary" ([user guide](https://github.com/btcpayserver/btcpayserver/blob/master/docs/users/README.md#overview)).

Each store gets its own wallet, set up in one of three ways ([user guide](https://github.com/btcpayserver/btcpayserver/blob/master/docs/users/README.md#set-up-a-wallet)):

- **Connect an existing wallet** by importing its public keys, for example from a hardware wallet. The private keys never reach the server.
- **Create a new watch-only wallet.** The server generates a seed, shows it once and erases the private key. Spending needs the seed or an external signer.
- **Create a new hot wallet.** The private key stays on the server, and the merchant can send coins from the BTCPay interface. BTCPay itself warns that this "exposes funds if either the account or server is compromised".

## Analysis

BTCPay Server receives and sends bitcoin, so it is a wallet. With a hot wallet, the seed and the spending happen on the server. With the other two setups, BTCPay is the receiving and watching half of a wallet whose keys live elsewhere.

On a server the merchant runs, nobody but the merchant holds the keys. A store on someone else's BTCPay instance is different: whoever runs that server controls a hot wallet on it, so only use a hot wallet on a server you run yourself.

The code is on [GitHub](https://github.com/btcpayserver/btcpayserver) under the MIT license, and releases ship as Docker images. That makes BTCPay Server {% include verdictBadge.html verdict="sourceavailable" type='short' %}, and we can look into reproducibility next. A reproducible build would not have stopped the attacks above: they abused flaws in the published code, not tampered binaries.

{% include featureEvidence.html feature="foss" quote="BTCPay Server is available under the MIT License." source="[GitHub README](https://github.com/btcpayserver/btcpayserver/blob/master/README.md)" comment="MIT is an OSI-approved license." %}

{% include featureEvidence.html feature="ln" quote="Lightning is a separate payment method with different liquidity and backup requirements." source="[User guide](https://github.com/btcpayserver/btcpayserver/blob/master/docs/users/README.md#set-up-a-wallet)" comment="Lightning payments are a built-in payment method next to on-chain." %}

{% include featureEvidence.html feature="ownFullNode" quote="The standard Bitcoin deployment includes: BTCPay Server, PostgreSQL, NBXplorer, Bitcoin Core" source="[btcpayserver-docker README](https://github.com/btcpayserver/btcpayserver-docker/blob/master/README.md)" comment="The official deployment runs its own Bitcoin Core node." %}

{% include featureEvidence.html feature="TOR" quote="Tor hidden services and selected Tor connectivity" source="[btcpayserver-docker README](https://github.com/btcpayserver/btcpayserver-docker/blob/master/README.md)" comment="The official deployment includes Tor." %}
