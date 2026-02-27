---
title: BitcoinComfy BitcoinMRE
appId: bitcoincomfy.bitcoinMRE
authors:
- danny
released: 2022-10-12
discontinued: 
updated: 2022-10-17
version: 0.0.2-alpha
binaries: https://github.com/BitcoinComfy/BitcoinMRE/tags
dimensions: 
weight: 
provider: BitcoinComfy
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/BitcoinComfy/BitcoinMRE
issue: 
icon: 
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2026-02-27
signer: 
twitter: BitcoinComfy
social: 
builds: 
features:
- airGapped
- camera
- foss
- hd
- segwit

---

## About 

Bitcoin wallet / PSBT signing app for Mediatek MRE RTOS (e.g. Nokia Series 30+)

## Product Description 

> Because it can run on cheap mass-market devices / feature-phones that do not require any assembling / firmware flashing or particular skills to install and run.
> 
> A Nokia 5310 2020 is sold for 15/20$, it has a keyboard, a screen, a SD card reader, a camera and it can run C code.

## Analysis 

This is an evolving DIY Project.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2022 Bitcoin Comfy Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="License" %}

{% include featureEvidence.html feature="airGapped" quote="Once you created for example the Unsigned Transaction from Specter wallet, you can scan it from the MRE app using: &quot;Sign PSBT (QR)&quot; If you don't want to use Camera / QR, you can export it to file, and move the PSBT inside the SD Card folder called: btc_mre_wallet/psbt/ Then you can sign it from the MRE app using &quot;Sign PSBT (file)&quot;." source="README" %}

{% include featureEvidence.html feature="camera" quote="Once you created for example the Unsigned Transaction from Specter wallet, you can scan it from the MRE app using: &quot;Sign PSBT (QR)&quot;" source="README" %}


{% include featureEvidence.html feature="segwit" quote="Open, recover or create a wallet, choose the derivation scheme, the optional passphrase and then Display Account Extended Public Key (QR). Then scan the QR with Specter wallet. Public keys will be saved in btc_mre_wallet/xpub/ (if using derivations) or btc_mre_wallet/pub/ (if using a single keypar)." source="README" comment="SegWit derivation paths (xpub, BIP49/84) implied by derivation scheme support and Specter integration; explicit taproot exclusion confirms SegWit is supported" %}

{% include featureEvidence.html feature="hd" quote="Open, recover or create a wallet, choose the derivation scheme, the optional passphrase and then Display Account Extended Public Key (QR). Public keys will be saved in btc_mre_wallet/xpub/ (if using derivations)" source="README" %}