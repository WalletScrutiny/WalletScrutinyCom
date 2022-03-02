---
wsId: 
title: "ABC Wallet - Crypto, Bitcoin Wallet"
altTitle: 
authors:
- leo
users: 1000
appId: com.blockabc.abcwallet
appCountry: 
released: 
updated: 2020-06-17
version: "1.7.2"
stars: 
ratings: 
reviews: 
size: 13M
website: 
repository: 
issue: 
icon: com.blockabc.abcwallet.png
bugbounty: 
meta: defunct
verdict: obfuscated
date: 2021-04-13
signer: 
reviewArchive:
twitter: 
social:
redirect_from:
---

**Update 2021-04-13**: The app cannot be found on Google Play anymore. We assume
it was a scam as can be seen in our original review below:

This app supports Bitcoin:

> 4 mainstream blockchain BTC/BCH/ETH/EOS;

Is self-custodial:

> Private and sensitive information is encrypted using industry-standard
  algorithms and stored on and only on your device;

And they got reviewed:

> The source code of ABC Wallet has been audited by several world-leading
  companies;

Only problem: None of the above is verifiable or even further substantiated.
There is no website provided and thus it's anybody's guess which "world leading
companies" might have reviewed their code.

Also there is only four reviews, one of which complains about lost funds:

> M Safa<br>
  ★☆☆☆☆ 30 March 2021<br>
  Very bad I received cbk in my wallet address but to this app show 0

So ... I tried to look at the code myself and downloaded the app version 1.7.2
with sha256sum `08ecb2acb45c0176bbbb7efca25a31a9980dd025cadb390e5c59f599b372d9f7`
and decompiled it using [jadx](https://github.com/skylot/jadx). Unfortunately
the app does not contain the code in readable form as it was obfuscated. The
entry point to the app as defined in the `AndroidManifest.xml`:

```
<activity android:theme="@style/base_AppTheme.splash" android:name="com.blockabc.wallet.SplashActivity" android:screenOrientation="portrait" android:configChanges="keyboardHidden|orientation|screenSize">
    <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
    </intent-filter>
```

looks to me as follows:

```
public class SplashActivity extends BaseActivity {
    @Override // com.blockabc.base.BaseActivity
    public boolean E() {
        return false;
    }

    @Override // com.blockabc.base.BaseActivity
    public boolean F() {
        return false;
    }

    @Override // com.blockabc.base.BaseActivity
    public boolean H() {
        return false;
    }

    @Override // com.blockabc.base.BaseActivity
    public int a() {
        return R.layout.app_activity_splash;
    }

    @Override // com.blockabc.base.BaseActivity
    public boolean b() {
        return false;
    }

    @Override // com.blockabc.base.BaseActivity
    public void e() {
    }

    @Override // com.blockabc.base.BaseActivity
    public int j() {
        return R.color.base_app_bg;
    }

    @Override // com.blockabc.base.BaseActivity
    public int k() {
        return R.color.base_app_bg;
    }

    @Override // com.blockabc.base.BaseActivity
    public boolean n() {
        return true;
    }

    @Override // com.blockabc.base.BaseActivity
    public int z() {
        return 0;
    }

    @Override // com.blockabc.base.BaseActivity
    public void c() {
        if (!e.a().b()) {
        }
    }

    /* access modifiers changed from: private */
    /* access modifiers changed from: public */
    private void U() {
        a.a(this, "/home/home", (int) R.anim.app_fade_in);
        finish();
    }

    @Override // com.blockabc.base.BaseActivity, android.support.v4.app.FragmentActivity
    public void onResume() {
        super.onResume();
        if (e.a().b()) {
            finish();
        } else if (2 != b.a().b() && !com.blockabc.base.modules.config.a.a().a(this, new m() {
            /* class com.blockabc.wallet.SplashActivity.AnonymousClass1 */

            @Override // com.blockabc.base.widget.m
            public void a(View view) {
                SplashActivity.this.U();
            }
        })) {
            U();
        }
    }
}
```

The parent class `BaseActivity` has the following `onCreate` method which gets
executed at the start:

```
    /* access modifiers changed from: protected */
    @Override // android.support.v7.app.AppCompatActivity, android.support.v4.app.SupportActivity, android.support.v4.app.FragmentActivity
    public void onCreate(Bundle bundle) {
        Bundle extras;
        if (Build.VERSION.SDK_INT == 26 && U()) {
            boolean V = V();
            o.a("Android 8.0", "onCreate fixOrientation when Oreo, result = " + V);
        }
        o.a("Activity-onCreate", getClass().getName());
        try {
            super.onCreate(bundle);
            k.a().b();
            b.a(getResources(), 375);
            DisplayMetrics displayMetrics = new DisplayMetrics();
            getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
            f948a = displayMetrics.widthPixels;
            f949b = displayMetrics.heightPixels;
            d = displayMetrics.density;
            e = displayMetrics.scaledDensity;
            f950c = ImmersionBar.getStatusBarHeight(this);
            this.v = j.a(this, (float) this.v);
            this.w = j.a(this, 44.0f) + ImmersionBar.getStatusBarHeight(this);
            this.x = f948a / 4;
            this.y = f948a - (f948a / 6);
            Intent intent = getIntent();
            if (!(intent == null || (extras = intent.getExtras()) == null)) {
                this.q = extras.getString("chainType");
            }
            if (!h()) {
                finish();
                return;
            }
            i();
            g();
            x();
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }
```

All gibberish. System classes are visible in their original names but all the
business logic is turned into single-letter objects. Without readability this
app is definitely **not verifiable**.
