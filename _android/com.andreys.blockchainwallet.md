---
wsId: 
title: "Blockchain Wallet"
altTitle: 

users: 50000
appId: com.andreys.blockchainwallet
released: 
latestUpdate: 2020-08-30
version: "21"
stars: 4.6
ratings: 1374
reviews: 362
size: 12M
website: 
repository: 
issue: 
icon: com.andreys.blockchainwallet.png
bugbounty: 
verdict: defunct # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-02-17
reviewStale: false
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /com.andreys.blockchainwallet/
---


**Update:** This app is not on Google Play anymore

This app is ... a game ... turned into a tool to collect your blockchain.com
wallet credentials?

We decompiled the app and found no single mention of "bitcoin" or "wallet" but
we found "Level0" to "Level6", "globalgamemanagers", some obfuscated classes in
the "unity3d/player" folder and assume the form where it asks you for your
credentials is being loaded from a remote server upon app start as none of the
elements of the main screen can be found in the source code.

Some obfuscated code example:

```
public final class l {
    private static boolean a = false;
    private boolean b = (!h.c);
    private boolean c = false;
    private boolean d = false;
    private boolean e = true;

    l() {
    }

    static void a() {
        a = true;
    }

    static void b() {
        a = false;
    }

    static boolean c() {
        return a;
    }

    public final void a(boolean z) {
        this.c = z;
    }

    public final void b(boolean z) {
        this.e = z;
    }
```

That's typical minification. Lengthy, self-explanatory names get converted into
short symbols.

In summary: **Do not share your blockchain.com credentials with this app! You
will lose your funds! This app is 100% for sure not related to blockchain.com.**
