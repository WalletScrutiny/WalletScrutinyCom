---
title: GK8 Cold Vault
appId: gk8.coldvault
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: GK8
providerWebsite: 
website: https://www.gk8.io/
shop: 
country: IL
price: 
repository: 
issue: 
icon: gk8.coldvault.png
bugbounty: 
meta: ok
verdict: wip
appHashes: 
date: '2022-04-04'
signer: 
reviewArchive: 
twitter: gk8_security
social:
- https://www.linkedin.com/company/gk8/
- https://www.youtube.com/channel/UCGD5TAhTYij6JgVeZgc3QTA
features: 

---

## Updated Review 2023-04-28

As this is a B2B solution, we are marking the verdict as a work-in-progress.

## Product Description 2022-04-04

On its [front page](https://www.gk8.io/):

> An enterprise-grade custody platform that enables financial institutions to offer services over digital assets with 100% protection from cyber attacks

GK8 claims to have:

> PATENTED UNIDIRECTIONAL SOLUTION: CREATE, SIGN AND SEND BLOCKCHAIN TRANSACTIONS WITH NO INTERNET CONNECTION

GK8's commercial custodial solution involves a combination of a "true" airgapped storage solution in combination with a patented MPC (multi-party computation) wallet solution. 

> GK8’s innovation and cyber protection are rooted within the cryptographic layer itself: any hardware deployment is optional, used for added protection against physical and side-channel attacks.

Further material reads: 

> The vast majority of funds are stored in the unreachable airgapped vault, out of reach of hackers. Only a fraction of the assets are managed by a secured patented MPC network, used for high-frequency automatic transactions.

They previously held a [hacking bounty](https://hackernoon.com/takeaways-from-our-dollar250000-bounty-for-hacking-our-cold-wallet-cwr632j8) for their cold wallet. The prize was $250,000. Nobody won the prize. 

## Patents 

GK8, with Lior Lamesh (CEO) and Shahar Shamai (Co-founder and CTO) have several patent applications and patent under GK8: 

- Publication No.:20220051240 - TRANSFERRING CRYPTOCURRENCY FROM A REMOTE LIMITED ACCESS WALLET
- Patent No: 11251943 - Sharing a secret between an isolated device and a network connected device
- Publication No.:20220021521 - SECURE CONSENSUS OVER A LIMITED CONNECTION
- Publication No.:20210367793 - SYSTEMS AND METHODS FOR SIGNING OF A MESSAGE
- Patent No: 11088851 - Systems and methods for signing of a message
- Publication No.:20210049591 - CRYPTOCURRENCY WALLET AND CRYPTOCURRENCY ACCOUNT MANAGEMENT

Patent No: [11251943](https://patents.google.com/patent/US11251943B2/en?oq=11251943)'s abstract reads: 

> Methods, system and devices for sharing a secret between an isolated device connected to a network through a transmit-only unidirectional secure channel and a network connected user device, comprising generating a secret value divided to first and second components, transmitting the first component, via the unidirectional secure channel, to one or more computing nodes of a distributed system, and transferring the second component, via a tamper-resistant unidirectional insecure channel, to the network connected user device associated with the user to enable the network connected user device to reproduce the secret value by combining the first component received from one or more of the computing nodes with the second component.

## Verdict

Gk8's commercial service is directed towards enterprise-level and state-level customers. This means banks, cryptocurrency exchanges, governments, other custodians and other businesses. As they themselves have mentioned, their main selling point is the cryptographic layer itself and not on any specific hardware. There are however, renderings of their Cold Storage Vault, which looks like a secured laptop. There is also one possible video of the device from one of their customers, but the video was marketing oriented, and the device could only be a prop.

With no actual device specification sheets, no reference to the project as Open Source and with tacit claims that they are a custodial service, it is safe to assume that GK8 is a **custodial service**.
