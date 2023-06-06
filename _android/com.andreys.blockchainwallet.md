---
wsId: 
title: Blockchain Wallet
altTitle: 
authors: 
users: 50000
appId: com.andreys.blockchainwallet
appCountry: 
released: 
updated: 2020-08-30
version: '21'
stars: 4.6
ratings: 1374
reviews: 362
size: 12M
website: 
repository: 
issue: 
icon: com.andreys.blockchainwallet.png
bugbounty: 
meta: defunct
verdict: wip
date: 2021-02-17
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from:
- /com.andreys.blockchainwallet/
developerName: 
features: 

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
