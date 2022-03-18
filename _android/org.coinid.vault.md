---
wsId: COINiDVault
title: COINiD Vault
altTitle: 
authors:
- leo
users: 1000
appId: org.coinid.vault
appCountry: 
released: 2018-10-14
updated: 2021-02-20
version: 1.5.5
stars: 
ratings: 
reviews: 
size: 34M
website: https://coinid.org
repository: https://github.com/COINiD/COINiDVault
issue: https://github.com/COINiD/COINiDVault/issues/14
icon: org.coinid.vault.png
bugbounty: 
meta: stale
verdict: ftbfs
date: 2022-02-16
signer: 
reviewArchive: 
twitter: COINiDGroup
social: 
redirect_from:
- /org.coinid.vault/
- /posts/org.coinid.vault/

---

This app is the companion app for the
{% include walletLink.html wallet='android/org.coinid.wallet.btc' verdict='true' %}
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
