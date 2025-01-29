---
title: GridPlus Lattice1
appId: io.gridplus.lattice1
authors:
- danny
released: 2020-12-07
discontinued: 
updated: 2023-03-21
version: 0.17.2
binaries: 
dimensions: 
weight: 
provider: GridPlus
providerWebsite: 
website: https://gridplus.io
shop: https://gridplus.io/cart
country: US
price: 397USD
repository: https://github.com/GridPlus/lattice-software-releases
issue: 
icon: io.gridplus.lattice1.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2023-06-22
signer: 
reviewArchive: 
twitter: gridplus
social:
- https://www.youtube.com/channel/UCJ4yuWlSb0ZbknadhsjjrlQ
features: 

---

- Has 5-inch touchscreen to confirm transactions
- Source of Firmware (HSM, GCE) to be released Q3-2023. [Source: tweet](https://twitter.com/gridplus/status/1659001392910983171)

## Product Description from Provider

> - Your assets are safe on a dedicated Hardware Security Module (HSM) caged inside a tamper-resistant wire security mesh. All important operations - from building transactions to drawing screens - are performed on the Lattice's Secure Computing Environment, also housed by the mesh. With tamper detection.  

> Private keys are stored and included in {% include walletLink.html wallet='hardware/safecard.gridplus' verdict='true' %}

> - The Onion system-on-module (SOM) or general computing environment provides a connected interface for the SCE to receive signing requests. The Onion also runs a distribution of Linux which is hardened against hacking but is always assumed to be insecure. The general compute environment (GCE) provides the ability of the Lattice1 to serve native distributed applications.

> - WiFi Antenna: Provides internet connectivity to the general computing environment. 

See: [Video](https://youtu.be/uEVhY1xu34Q?t=64) - Initial setup for the device requires wifi connection.

> - Zigbee Antenna: Allows the Lattice1 to connect to other IoT and smart devices such as a smart electricity meter or thermostat.

> - Ethernet Jack: Lattice1 can be connected to the Internet with a wired connection.

## Analysis 

- As far as we can tell from the video and the documentation, the private keys are generated while the device is connected to the Internet. We [tweeted](https://twitter.com/BitcoinWalletz/status/1671835326342373376) them to clarify.
- The [documentation](https://docs.gridplus.io/lattice1/security-features) attests that the device has two general computational components that have segregated functions - the GCE (General Compute Environment) and the SCE (Secure Compute Environment). 
- The GCE can connect to the Internet and the "private keys never go through there". 
- The SCE can communicate with the GCE, and is isolated physically with a tamper-proof mechanism. This is where transactions are signed and the control to generate screen images.
- The device has a screen that can allow the user to confirm transactions. 
- [Bitcoin](https://docs.gridplus.io/lattice1/supported-digital-assets) is supported.  
- Although the firmware (HSM) and (GCE) folders are available on GitHub, they have yet to include the actual source. Until then, this device is **not source-available**.




