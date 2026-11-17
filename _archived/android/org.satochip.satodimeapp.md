---
title: Satodime
appId: org.satochip.satodimeapp
meta: fewusers
verdict: nowallet
archivedFrom: _android/org.satochip.satodimeapp.md
archivedCommit: ca7b1c0925546c643bd116fa54651f2ded166c02

---

## App Description

Satodime is a companion mobile app for the Satodime NFC bearer card. The app is used to interact with the physical card, create and manage up to three vaults, and perform card flows such as seal, unseal, and reset. Official Satodime material describes it as a bearer-style cold storage product where private keys are generated and sealed in the card chip until unseal.

## Analysis

Official sources currently live on `satochip.io` and include product, software, FAQ, setup, assistance, privacy, and terms pages.

Bitcoin support is explicitly documented in the Play listing and official Satodime pages. 

However, this Android app is not a standalone wallet product. It is companion software that depends on the external Satodime hardware card to hold and control the vault keys.

This is **not a standalone wallet**.
