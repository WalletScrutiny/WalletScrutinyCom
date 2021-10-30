---
wsId: kleverexchange
title: "Klever Exchange"
altTitle: 
authors:
- danny
users: 10000
appId: io.klever.secure.exchange
released: 2021-06-30
updated: 2021-10-01
version: "1.0.5"
stars: 4.0
ratings: 422
reviews: 259
size: 13M
website: https://klever.io/en/
repository: 
issue: 
icon: io.klever.secure.exchange.png
bugbounty: 
verdict: custodial
date: 2021-09-30
signer: 
reviewArchive:


providerTwitter: klever_io
providerLinkedIn: klever-app
providerFacebook: klever.io
providerReddit: 

redirect_from:

---


The Klever Exchange is distinct from  {% include walletLink.html wallet='android/cash.klever.blockchain.wallet' verdict='true' %}.

### From their Google Play description

> Klever Exchange will be a centralized crypto-to-crypto exchange (CEX) with a clear emphasis on iron-clad security...

### Whitepaper

It is apparent that the Klever Exchange component to the Klever 'ecosystem' is a custodial service. Proof of this could be found in page 12 of the [Klever Whitepaper](https://klever.io/downloads/Klever_Exchange_Whitepaper.pdf). This segment details the security arrangements for how the Klever apps interact with each other.

> **The Klever Exchange will offer custody to user funds in multiple Klever Security Modules (KSMs)**<br><br>
These KSMs will autonomously manage the funds between themselves based on
the balance that they are storing. The security architecture of the KSMs will follow
strong security patterns to encapsulate the access to them, and enable them to
only communicate with our services. The KSMs instances are using the already
consolidated Klever Core used in the Klever Wallet, all based on Klever OS 

It adds on page 23, of the same document:

> With the launch of Klever Exchange, the Klever ecosystem will give our users the option of holding their crypto in self-custody through the Klever app, as well as in the custody of Klever Exchange in order to trade at the fastest crypto exchange on the market, supporting over 3M transactions per second.

### The Klever Exchange app

We downloaded the Klever Exchange app and found that it has a BTC wallet which can send and receive bitcoin. However, unlike the Klever app, it does not provide as 12-word seed phrase and no indications of how to backup funds.

### Other information

Klever has engaged with a partnership with Jumio, an "Identity Verification Solutions" Provider. 

According to Section 3 of its Terms and Conditions, Klever also has the capability to freeze not just accounts, but also transactions:

> Additionally in the case of allegations that funds kept by you in your KIever Exchange account are stolen or otherwise are not lawfully possessed by you, **we may freeze your account or assets until evidence of the settle of any dispute has been presented.** In case of termination all amounts payable by you to Klever Exchange will immediately become due; all open orders and pending transactions will be canceled; 

### Verdict

Our verdict for the Klever Exchange is **custodial** and therefore **not verifiable**

