---
title: Arcbtc Baby Bowser
appId: arcbtc.baby.bowser
authors:
- danny
released: 2022-07-12
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: ArcBTC
providerWebsite: 
website: 
shop: 
country: UK
price: 
repository: https://github.com/arcbtc/hardware-wallet-babybowser
icon: arcbtc.baby.bowser.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2026-02-27
signer: 
twitter: arcbtc
social: 
builds: 
features:
- selfBuild
- foss

---

## Product Description 

> This very cheap off the shelf hardware wallet is designed to work with Lilygos Tdisplay, but you can easily make work with any ESP32.
> 
> Data is sent to/from BabyBowser over webdev Serial, not the most secure data transmission method, but fine for handling small-medium sized amounts of funds. You can use LNbits OnchainWallet extension, or any other serial monitor.

## Analysis 

Documentation is very sparse for this device. 

Not to be mistaken for its bigger counterpart {% include walletLink.html wallet='hardware/bowser' verdict='true' %}, this bitcoin hardware wallet is  a **do-it-yourself project**.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2022 Arc Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}