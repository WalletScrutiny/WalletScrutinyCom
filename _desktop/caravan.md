---
title: Unchained Capital - Caravan
appId: caravan
authors:
- danny
released: 2019-11-12
discontinued: 
updated: 2024-02-29
version: 1.0.3
binaries: 
provider: Unchained Capital
providerWebsite: https://unchained.com/
website: https://unchained-capital.github.io/caravan/
repository: https://github.com/unchained-capital/caravan
issue: 
icon: caravan.png
bugbounty: 
meta: deprecated
verdict: sourceavailable
date: 2026-01-20
twitter: unchainedcap
social: 
builds: 
features: 

---

## App Description

Caravan was originally an Unchained Capital branded multisig coordinator hosted on a static site and backed by the unchained-capital repository. The legacy site and repo reflect the older, hosted experience and are no longer actively maintained. It represents the former iteration of the app - that version is now deprecated.

The current Caravan is a stateless web app for Bitcoin multisig coordination under a new organization. It connects to hardware wallets and Bitcoin nodes to build and sign PSBTs rather than holding keys itself.

## Analysis

Caravan is a Bitcoin-only multisig coordinator rather than a standalone wallet. It is designed to avoid key custody: keys are generated and held externally (for example, on hardware wallets or offline devices), and signing happens with those external keys. Caravan assembles multisig wallets and transactions in the browser and can broadcast transactions when instructed, so the security model hinges on the user's key storage and signing devices.

The codebase is public. However, because it is primarily a web app with no independently verifiable desktop binaries, users either self-host or rely on the hosted instance, which prevents a full-verification verdict. 
