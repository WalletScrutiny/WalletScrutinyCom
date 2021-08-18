---
wsId: 
title: "CoinHub - Blockchain Crypto Wallet"
altTitle: 
authors:

users: 10000
appId: com.blockchain.btc.coinhub
released: 2021-05-13
updated: 2021-06-23
version: "1.0.1.4.5"
stars: 4.5
ratings: 598
reviews: 113
size: 43M
website: https://adslab-2b1c2.web.app
repository: https://github.com/hoanghiephui/unstoppable-wallet-android
issue: 
icon: com.blockchain.btc.coinhub.png
bugbounty: 
verdict: fake
date: 2021-07-26
signer: 
reviewArchive:
- date: 2021-06-04
  version: "1.0.1.4.5"
  appHash: 
  gitRevision: b994137e4f91927a8680b389b81bb5945d1ddf71
  verdict: obfuscated

providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

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

> CoinHub Wallet can store or send many types of mainstream cryptocurrencies
  such as Bitcoin, ...

> A non-custodial wallet without third party risk.

and

> Our source code is available at GitHub:<br>
  https://github.com/hoanghiephui/unstoppable-wallet-android

checks all the boxes for an app that might be self-custodial and reproducible
but:

* Their website [adslab-2b1c2.web.app](https://adslab-2b1c2.web.app) apart from
  looking randomly named is no more.
* [The repository](https://github.com/hoanghiephui/unstoppable-wallet-android)
  does not exist neither.
* The app is obfuscated

Looking into the app using jadx, we do still find traces of
"unstoppable-wallet-android" which is the currently reproducible wallet
{% include walletLink.html wallet='android/io.horizontalsystems.bankwallet' %}, only that this version
here is clearly obfuscated:

```
package f.b.a.c.e2;

import com.blockchain.btc.coinhub.R;
import f.b.a.c.o0;
import f.b.b.h;
import f.b.b.o;
import io.horizontalsystems.coinkit.models.CoinType;
import io.horizontalsystems.core.entities.Currency;
import java.util.List;
import kotlin.d0.p;
import kotlin.j;
import kotlin.j0.c.n;
import kotlin.jvm.functions.Function0;
import kotlin.m;
import kotlin.q0.w;

public final class a implements o0, o, h {
    private final String a = "https://horizontalsystems.io";

    /* renamed from: b  reason: collision with root package name */
    private final String f14479b = "https://play.google.com/store/apps/details?id=com.blockchain.btc.coinhub";

    /* renamed from: c  reason: collision with root package name */
    private final String f14480c = "https://github.com/horizontalsystems/unstoppable-wallet-android";

    /* renamed from: d  reason: collision with root package name */
    private final String f14481d = "living.solutions.vn@gmail.com";

    /* renamed from: e  reason: collision with root package name */
    private final String f14482e = "https://btc.horizontalsystems.xyz/rpc";

    /* renamed from: f  reason: collision with root package name */
    private final String f14483f = "https://pns-dev.horizontalsystems.xyz/api/v1/pns/";

    /* renamed from: g  reason: collision with root package name */
    private final String f14484g = "https://api.github.com/repos/horizontalsystems/unstoppable-wallet-android/releases/tags/";

    /* renamed from: h  reason: collision with root package name */
    private final j f14485h = m.b(b.a);

    /* renamed from: i  reason: collision with root package name */
    private final j f14486i = m.b(f.a);

    /* renamed from: j  reason: collision with root package name */
    private final j f14487j = m.b(g.a);

    /* renamed from: k  reason: collision with root package name */
    private final j f14488k = m.b(c.a);

    /* renamed from: l  reason: collision with root package name */
    private final j f14489l = m.b(C0329a.a);
    private final j m = m.b(e.a);
    private final j n = m.b(d.a);
    private final int o = 2;
    private final int p = 8;
    private final List<String> q = p.j("USD", "EUR");
    private final List<Currency> r = p.j(new Currency("AUD", "A$", 2), new Currency("BRL", "R$", 2), new Currency("CAD", "C$", 2), new Currency("CHF", "₣", 2), new Currency("CNY", "¥", 2), new Currency("EUR", "€", 2), new Currency("GBP", "£", 2), new Currency("HKD", "HK$", 2), new Currency("ILS", "₪", 2), new Currency("JPY", "¥", 2), new Currency("RUB", "₽", 2), new Currency("SGD", "S$", 2), new Currency("USD", "$", 2));
    private final List<CoinType> s = p.j(CoinType.Bitcoin.INSTANCE, CoinType.BitcoinCash.INSTANCE, CoinType.Ethereum.INSTANCE, CoinType.Zcash.INSTANCE, CoinType.BinanceSmartChain.INSTANCE);
    private final boolean t;

    /* renamed from: f.b.a.c.e2.a$a  reason: collision with other inner class name */
    static final class C0329a extends n implements Function0<String> {
        public static final C0329a a = new C0329a();

        C0329a() {
            super(0);
        }

        @Override // kotlin.jvm.functions.Function0
        public final String invoke() {
            return j.a.a(R.string.bscscanKey);
        }
    }

    static final class b extends n implements Function0<String> {
        public static final b a = new b();

        b() {
            super(0);
        }

        @Override // kotlin.jvm.functions.Function0
        public final String invoke() {
            return j.a.a(R.string.cryptoCompareApiKey);
        }
    }

    static final class c extends n implements Function0<String> {
        public static final c a = new c();

        c() {
            super(0);
        }

        @Override // kotlin.jvm.functions.Function0
        public final String invoke() {
            return j.a.a(R.string.etherscanKey);
        }
    }
```

Obfuscation in non-reproducible apps is a huge red flag and we strongly urge
people to not use this app! It certainly is **not verifiable**.
