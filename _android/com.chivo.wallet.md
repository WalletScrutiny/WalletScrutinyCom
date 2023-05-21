---
wsId: ChivoWallet
title: Chivo Wallet
altTitle: 
authors:
- danny
- leo
users: 1000000
appId: com.chivo.wallet
appCountry: sv
released: 2021-09-06
updated: 2023-04-21
version: 2.3.0
stars: 3.3
ratings: 27085
reviews: 13280
size: 
website: https://chivowallet.com
repository: 
issue: 
icon: com.chivo.wallet.png
bugbounty: 
meta: ok
verdict: obfuscated
date: 2021-10-29
signer: 
reviewArchive:
- date: 2021-10-10
  version: 1.1.0
  appHash: 
  gitRevision: fa227d42296cae666acec49c980629e0b2a71636
  verdict: custodial
twitter: chivowallet
social:
- https://www.facebook.com/ChivoWalletSLV
redirect_from: 
features: 

---

**Update 2021-10-29**: [This Tweet](https://twitter.com/structerer/status/1453793507777331204):

> **mke**<br>
  @structerer<br>
  No, it's around 200k of obfuscated JS code. So I limited my research to a
  simple text search in the project code and documented what URLs I found.
  Where possible, I tried to detect the purpose by looking at the code - here it
  wasn't, at least not with reasonable effort.

claims the app contains obfuscated code. We downloaded it from
[apk.support](https://apk.support/app/com.chivo.wallet#latest_version) ourselves
and threw it into jadx-gui and indeed, we get lots of code like this:

```
package n.b.b.p0;

import n.b.b.b0;
import n.b.b.i;
import n.b.b.r;
import n.b.b.t;
import n.b.b.u0.a1;
import n.b.b.u0.e1;

public class v extends b0 {
    private r a;
    private int b;

    /* renamed from: c  reason: collision with root package name */
    private int f16277c;

    public v(r rVar) {
        this.a = rVar;
        if (rVar instanceof t) {
            this.b = rVar.getDigestSize();
            this.f16277c = ((t) rVar).getByteLength();
            return;
        }
        throw new IllegalArgumentException("Digest " + rVar.getAlgorithmName() + " unsupported");
    }

    private void adjust(byte[] bArr, int i2, byte[] bArr2) {
        int i3 = (bArr2[bArr2.length - 1] & 255) + (bArr[(bArr2.length + i2) - 1] & 255) + 1;
        bArr[(bArr2.length + i2) - 1] = (byte) i3;
        int i4 = i3 >>> 8;
        for (int length = bArr2.length - 2; length >= 0; length--) {
            int i5 = i2 + length;
            int i6 = i4 + (bArr2[length] & 255) + (bArr[i5] & 255);
            bArr[i5] = (byte) i6;
            i4 = i6 >>> 8;
        }
    }

    private byte[] generateDerivedKey(int i2, int i3) {
        byte[] bArr;
        byte[] bArr2;
        int i4 = this.f16277c;
        byte[] bArr3 = new byte[i4];
        byte[] bArr4 = new byte[i3];
        int i5 = 0;
        for (int i6 = 0; i6 != i4; i6++) {
            bArr3[i6] = (byte) i2;
        }
        byte[] bArr5 = this.salt;
        if (bArr5 == null || bArr5.length == 0) {
            bArr = new byte[0];
        } else {
            int i7 = this.f16277c;
            int length = i7 * (((bArr5.length + i7) - 1) / i7);
            bArr = new byte[length];
            for (int i8 = 0; i8 != length; i8++) {
                byte[] bArr6 = this.salt;
                bArr[i8] = bArr6[i8 % bArr6.length];
            }
        }
        byte[] bArr7 = this.password;
        if (bArr7 == null || bArr7.length == 0) {
            bArr2 = new byte[0];
        } else {
            int i9 = this.f16277c;
            int length2 = i9 * (((bArr7.length + i9) - 1) / i9);
            bArr2 = new byte[length2];
            for (int i10 = 0; i10 != length2; i10++) {
                byte[] bArr8 = this.password;
                bArr2[i10] = bArr8[i10 % bArr8.length];
            }
        }
        int length3 = bArr.length + bArr2.length;
        byte[] bArr9 = new byte[length3];
        System.arraycopy(bArr, 0, bArr9, 0, bArr.length);
        System.arraycopy(bArr2, 0, bArr9, bArr.length, bArr2.length);
        int i11 = this.f16277c;
        byte[] bArr10 = new byte[i11];
        int i12 = this.b;
        int i13 = ((i3 + i12) - 1) / i12;
        byte[] bArr11 = new byte[i12];
        int i14 = 1;
        while (i14 <= i13) {
            this.a.update(bArr3, i5, i4);
            this.a.update(bArr9, i5, length3);
            this.a.doFinal(bArr11, i5);
            for (int i15 = 1; i15 < this.iterationCount; i15++) {
                this.a.update(bArr11, i5, i12);
                this.a.doFinal(bArr11, i5);
            }
            for (int i16 = 0; i16 != i11; i16++) {
                bArr10[i16] = bArr11[i16 % i12];
            }
            int i17 = 0;
            while (true) {
                int i18 = this.f16277c;
                if (i17 == length3 / i18) {
                    break;
                }
                adjust(bArr9, i18 * i17, bArr10);
                i17++;
            }
            if (i14 == i13) {
                int i19 = i14 - 1;
                int i20 = this.b;
                System.arraycopy(bArr11, 0, bArr4, i19 * i20, i3 - (i19 * i20));
            } else {
                System.arraycopy(bArr11, 0, bArr4, (i14 - 1) * this.b, i12);
            }
            i14++;
            i5 = 0;
        }
        return bArr4;
    }

    @Override // n.b.b.b0
    public i generateDerivedMacParameters(int i2) {
        int i3 = i2 / 8;
        return new a1(generateDerivedKey(3, i3), 0, i3);
    }

    @Override // n.b.b.b0
    public i generateDerivedParameters(int i2) {
        int i3 = i2 / 8;
        return new a1(generateDerivedKey(1, i3), 0, i3);
    }

    @Override // n.b.b.b0
    public i generateDerivedParameters(int i2, int i3) {
        int i4 = i2 / 8;
        int i5 = i3 / 8;
        byte[] generateDerivedKey = generateDerivedKey(1, i4);
        return new e1(new a1(generateDerivedKey, 0, i4), generateDerivedKey(2, i5), 0, i5);
    }
}
```

The same researcher found
[more reasons why not to use this app](https://btc21.de/bitcoin-app-permissions/).

## App Description

> Chivo Wallet is the official Bitcoin and Dollar wallet of the Government of El Salvador. Chivo Wallet allows you to send and receive Bitcoin and / or Dollar between Salvadorans without commission, in the same way it allows users to exchange Bitcoin for Dollar or vice versa without commission. Additionally Chivo is compatible with other Bitcoin on-chain and Lightning wallets. Finally, Chivo connects with the banking system of El Salvador to deposit or withdraw dollars from the platform, and with a network of Chivo ATMs to deposit and withdraw dollars in cash. Chivo has a company version that allows you to charge, assign payment terminals for employees, and pay taxes quickly and easily.

According to [Reuters](https://www.reuters.com/technology/crypto-platform-bitso-working-with-el-salvador-chivo-digital-wallet-2021-09-07/), Bitso is the core partner in the development of Chivo. In Google Play, [Gobierno de El Salvador](https://play.google.com/store/apps/developer?id=Gobierno+de+El+Salvador) (Government of El Salvador) is the listed developer.

### Google Play Reviews

> [KoolKid Tv](https://play.google.com/store/apps/details?id=com.chivo.wallet&hl=en&gl=US&reviewId=gp%3AAOqpTOHsdihFpbYxR7V1qhTd4P67DPn1MvtKaCWIsAPkF68ETvKWwIdKtFW6U4ihUlsSvLdVDehiPiiXM_ftktw)<br>
  ★☆☆☆☆ October 2, 2021 <br>
       "SUPER BAD" Registration was easy, unfortunately the app stop working (it keep logging but didn't logging)the second day. After a week I decided to Uninstall the app, thinking that it may solve the logging problems; now when I try to login, it tells me that the password is wrong; in other words I can't login. I was going to star sending money using this app, but I don't trust it at this point. 

> [David Llanes](https://play.google.com/store/apps/details?id=com.chivo.wallet&hl=en&gl=US&reviewId=gp%3AAOqpTOGx9Tl_CG40ARavmsrPUj3klJNUtjXS33I4fwkG-bEE9vuc4HfFegR4LVsz2hQZua57rVuNgJxnJkEvd8k)<br>
  ★☆☆☆☆ September 18, 2021 <br>
       Hard to register if your able to get to the registration process if it doesnt give an error or a conection problem, once your inside and you get the bonus Bitcoin you cant use them unless you put some money on it or someone sends you some. Aside from that its a government run wallet so no open source get what you will from it. There a better wallets out there.

**Note** The app is only downloadable in select locations which includes the US, El Salvador and some South American countries.

## The Site

The official website for the wallet cannot be accessed from certain locations. Using a VPN with a US location allowed us to glean some insight. 

**[Terms and Conditions](https://chivowallet.com/terminos-y-condiciones.html#item-6)**

> 4.2 When an Account is closed: (i) Your right to use it to gain access to the Services _immediately ceases_, (ii) the data or content associated with the Account is deleted and the User and the Account are disconnected (unless the applicable legislation requires them to be kept, returned or transmitted to the User) and (iii) if there is any value in the Account, they will be withdrawn from the destination that the user has informed, if never has informed an Account for this purpose, the _balance of your Account will remain blocked until the User proceeds to comply with the process of withdrawal of the balance of your Account._

We get a glimpse of what will happen when a government entity has custody and control over user's funds:

> Finally, the User accepts and agrees that CHIVO SA DE CV may, without prior notice, limit, suspend or terminate the Services and Accounts, prohibit access to the Site, its content, services and tools, restrict or remove stored content , and take technical and legal actions to keep Users out of Chivo Wallet if it considers that they are violating the T&C. Likewise, when creating an Account, the User accepts that the decision to cancel or block it may be based on confidential criteria essential for the Compliance and risk protocols of CHIVO SA DE CV, therefore, the User understands and accepts that the latter has no obligation to disclose details of these internal protocols.

## The App

The app can only be installed with the following requirements:

- El Salvadoran DUI (Documento Único de Identidad)
- US, El Salvadora and some South American phone numbers for verification

## Verdict

El Salvador's Chivo wallet is the tip of the spear in President Nayib Bukele's Bitcoin law recognizing Bitcoin as legal tender. By all indications it is certainly **custodial** and particularly concerning since a government has a lot of powers to control not just the wallet as the developer, but as an entity with the power to coerce intermediaries by force and by law. 

As a **custodial** app, it is **not verifiable.**

