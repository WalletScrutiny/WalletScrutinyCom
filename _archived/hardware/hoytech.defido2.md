---
title: HoyTech Defido2
appId: hoytech.defido2
meta: stale
verdict: nobtc

---

From the GitHub [repository:](https://github.com/hoytech/defido2) 

> defido2 is a command-line contract-based Ethereum wallet intended for DeFi (decentralized finance) use-cases. The wallet's key material is stored on special-purpose tamper-resistant devices known as FIDO2 or U2F keys. All signature operations are performed on the key itself.
>
> FIDO2 keys are cheap and common, since they are being heavily promoted by Google/Twitter/GitHub/etc. for Webauth, second-factor logins. Additionally, OpenSSH now supports FIDO2 devices for password-free logins.
>
> defido2 uses libfido2, so it should support any CTAP2-capable FIDO2 device. We've tested with 2 models of YubiKey, Solo USB-C, and Solo SOMU. Solos can be purchased for $20 on their web store.

## Analysis 

The project uses Fido2 keys including the YubiKey series. This **do-it-yourself** project is **Ethereum-centric**. 

