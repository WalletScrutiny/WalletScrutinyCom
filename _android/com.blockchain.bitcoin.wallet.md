---
wsId: 
title: Bitcoin Cold Wallet
altTitle: (Fake) Bitcoin Cold Wallet
authors:
- leo
users: 10000
appId: com.blockchain.bitcoin.wallet
appCountry: 
released: 2021-01-19
updated: 2023-08-26
version: 2.0.2
stars: 4.5
ratings: 729
reviews: 65
website: https://coinhub8899.web.app
repository: 
issue: 
icon: com.blockchain.bitcoin.wallet.png
bugbounty: 
meta: removed
verdict: fake
appHashes: 
date: 2023-12-19
signer: 
twitter: 
social: 
redirect_from: 
developerName: InvoVN Solutions
features: 

---

**Update 2021-07-26**: The provider features several apps that either through
their logo or the name try to resemble trusted wallets like
{% include walletLink.html wallet='android/de.schildbach.wallet' %}
or
{% include walletLink.html wallet='android/piuk.blockchain.android' %}.
Given other issues with the products, we assume they are fakes.

We list the following apps of this provider:

* {% include walletLink.html wallet='android/com.bitcoin.wallet.btc' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.wallet.btc' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.bitcoin.wallet' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.explorer' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.btc.coinhub' verdict=true %}

As so far all others were obfuscated, we jump straight into jadx and sure
enough:

```
public static final a.EnumC0487a c;
public static final a.EnumC0487a d;
public static final z e = z.i("https://wallet.schildbach.de/fees");

/* renamed from: f  reason: collision with root package name */
public static final String f254f = (Character.toString(8776) + (char) 8201);
public static final MonetaryFormat g = new MonetaryFormat().e().d(2).f(new int[0]);
public static final f.g.c.d.b h = f.g.c.d.b.c.e();
public static final Coin i;
public static final d0 j;
public static final y1.f.b k = c.c(o.class);
```

This app appears to be based on
{% include walletLink.html wallet='android/de.schildbach.wallet' %}
and it is clearly obfuscated. Obfuscation is a huge red flag and we urge you not
to trust this app with your funds.
