---
title: Joy ID
appId: app.joy.id
authors:
- danny
icon: app.joy.id.jpg
date: 2025-01-17
website: https://app.joy.id
provider: Nervina Labs
country: SG
meta: ok
verdict: nosource

---

## Web App Description

**[DOCUMENTATION](https://docs.joyid.dev/guide)**

JOYID is a web app that supports Bitcoin, Bitcoin-lightning as well as other blockchains. It makes use of [FIDO Webauthn](https://webauthn.io/) and a blockchain called Nervos CKB. This allows easy registration, login and also allows the use of hardware authentication devices. 

Their documentation also includes pages-under-construction for native apps and progressive web applications. 

The private key for each chain can be exported. It also allows the backup of a 14-word recovery phrase, however the account must undergo a "Smart Contract Upgrade" payable in 150 $CKDs or roughly $1.68 USD. 

## Source Available?

They have 46 repositories in their **[organization page](https://github.com/nervina-labs/)**. 

Based on the available repositories, it appears that JoyID provides several Software Development Kits (SDKs) and integration examples to facilitate interaction with their platform. For instance, the joyid-sdk-js repository offers a JavaScript SDK for developers to integrate JoyID functionalities into their applications. 

However, the repositories primarily contain SDKs and integration tools rather than the complete source code of the JoyID web application itself. The core web app's source code does not seem to be publicly available in these repositories.

## Analysis 

Can JoyID be reproducibly verified? 

Reproducibility verification for web apps is inherently more complex than for mobile or desktop apps because web apps rely on dynamic environments, including servers, browsers, and external dependencies.

This makes it overly complicated and not as straightforward as verifying the reproducibility of apks. For now, our interim analysis points to its nonverifiability until such time procedures for reproducibly verifying web apps are discovered and made available. A more evident verdict, that we can prove is the absence of instructions or descriptions for the actual web app, making this project **not source-available**.