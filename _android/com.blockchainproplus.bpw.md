---
wsId: 
title: Blockchain Plus Wallet v2
altTitle: 
authors: 
users: 1000
appId: com.blockchainproplus.bpw
appCountry: 
released: 2021-04-02
updated: 2021-04-23
version: 1.1.1
stars: 3.8
ratings: 60
reviews: 29
website: 
repository: 
issue: 
icon: com.blockchainproplus.bpw.jpg
bugbounty: 
meta: removed
verdict: obfuscated
appHashes: 
date: 2021-07-02
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: 
features: 

---

This app claims to be a server-less and self-custodial Bitcoin wallet. We were
asked about funds disappearing on our Wallet Support chat and had a look:

There is no website.

The app is in the category "games/casino".

The app has no way of creating a new wallet but straight asks for an "introduction
or restore code" which probably is something in the original
{% include walletLink.html wallet='android/piuk.blockchain.android' %}
and entering it leaks it to the provider of this "wallet".

It turns out this wallet is not only weird with tons of negative feedback, it's
also closed source and upon closer inspection the binary is obfuscated:


For example it's really hard to guess what happens in this class:

```
public class b extends a {
    /* renamed from: c  reason: collision with root package name */
    static boolean f305c = false;

    /* renamed from: a  reason: collision with root package name */
    private final h f306a;

    /* renamed from: b  reason: collision with root package name */
    private final c f307b;

    public static class a<D> extends m<D> implements a.AbstractC0019a<D> {
        private final int j;
        private final Bundle k;
        private final a.h.b.a<D> l;
        private h m;
        private C0018b<D> n;
        private a.h.b.a<D> o;

        /* access modifiers changed from: package-private */
        public a.h.b.a<D> a(boolean z) {
            if (b.f305c) {
                Log.v("LoaderManager", "  Destroying: " + this);
            }
            this.l.a();
            throw null;
        }
```

With this many red flag this app is not only **not verifiable** but also better
avoided.
