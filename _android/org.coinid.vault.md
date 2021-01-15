---
title: "COINiD Vault"
altTitle: 

users: 1000
appId: org.coinid.vault
launchDate: 2018-10-14
latestUpdate: 2020-05-21
apkVersionName: "1.5.5"
stars: 5.0
ratings: 8
reviews: 4
size: 34M
website: https://coinid.org
repository: https://github.com/COINiD/COINiDVault
issue: https://github.com/COINiD/COINiDVault/issues/14
icon: org.coinid.vault.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-04-06
reviewStale: true
signer: 
reviewArchive:


providerTwitter: COINiDGroup
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /org.coinid.vault/
  - /posts/org.coinid.vault/
---


This app is the companion app for the
[Bitcoin Wallet for COINiD](/org.coinid.wallet.btc/)
and allows a setup with this being the actual wallet that holds the private keys
without ever being online and the other app being the wallet interface that
knows balance and receiving addresses but that can't send coins without this
app.

This app recently reached 1000 downloads, which is the minimum for being
analyzed.

Unfortunately the GitHub repository has not much in terms of build instructions.
In fact, this is their complete
[Readme.md](https://github.com/COINiD/COINiDVault/blob/master/README.md):

> # COINiD Vault
> 
> Proper readme coming soon. If you have any questions you can contact us on our
> Telegram or via email.
> 
> **Secrets.js**
> 
> We are currently not including the secrets.js in the repo. If you want to
> compile the vault to test it you need to add the following to
> src/config/secrets.js.
> 
> ```
  export const p2pCommonSecret = '';
  export const encryptPrivateSalt = '';
  export const pinSecret = '';
```

So the app is not only lacking build instructions but also parts of the source
code (secrets.js). As such a `secrets.js` can't be kept very secret when
delivering the app to users, not including it in the repository does not achieve
much.

The FAQ is clear about this app being a wallet by our understanding:

> **Do my private key ever leave my device?** No, your private key never leaves
> your device. You are in full control of your private key.

Unfortunately it is also clear about not being reproducible:

> **Do you provide deterministic builds?** Since we need to distribute the app
> via the App Store that is not possible. The source is however available on our
> Github so that anyone can review and compile it.

This is the first time we hear this claim. Why would the Android app have to be
non-deterministic because of Apple?

For now we consider this app **not verifiable** and hope to see the issues
resolved soon.