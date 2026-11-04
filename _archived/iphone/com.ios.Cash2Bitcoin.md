---
title: Cash2Bitcoin ATM Locator
appId: com.ios.Cash2Bitcoin
meta: obsolete
verdict: nowallet
archivedFrom: _iphone/com.ios.Cash2Bitcoin.md
archivedCommit: 7a7d188cff669c2c4039b852db14f1bb432b664d

---

## App Description

Cash2Bitcoin’s primary Android app is an ATM locator that does not generate or store private keys and does not function as a cryptocurrency wallet. Their [FAQ](https://cash2bitcoin.com/faq) page explains that customers must scan their own wallet’s QR code at the ATM, confirming that users need an external wallet for custody. The company does, however, publish a separate Android application {% include walletLink.html wallet='android/org.c2bwallet.app' verdict='true' %}, which appears to serve as their actual wallet offering. 

No open-source repository or source code reference is provided for either app.

## Analysis

This is a bitcoin wallet ATM locator app and **does not have a wallet**.
