---
wsId: 
title: "Bitcan Bitcoin Wallet - USDT ETH BCH TRON"
altTitle: 
authors:
- leo
users: 1000
appId: jb.tech.bitpiewallet
launchDate: 
latestUpdate: 2021-02-01
apkVersionName: "1.3"
stars: 4.0
ratings: 62
reviews: 61
size: 11M
website: 
repository: 
issue: 
icon: jb.tech.bitpiewallet.png
bugbounty: 
verdict: custodial # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-01-20
reviewStale: true
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


This wallet imitates [Bitpie Wallet](/android/com.bitpie). It's `appId` being
`jb.tech.bitpiewallet` was the first hint but there are many more similarities.
The description for example was also copied.

The provider has no website, so that's certainly also suspicious.

Nevertheless they claim:

> As a true decentralized wallet, your private key will never leave the device.

and unless we can proof that this is not the case, we will have to list it as
merely "no source"? We had a look at their app for smoking guns, cause reviews
like:

> AVOID AVOID AVOID.. BEWARE FAKE WALLET, ADDRESSES DISPLAYED ARE NOT YOURS, FUND ARE TRANSFERED BUT NOT TO YOU. CHECKED ON BLOCKCHAIN AND ADDRESSES WERE ALREADY LIVE WITH MULTIPLE TRANSACTIONS . LESSON LEARNT, YOU ABSOLUTE SCUM.

> Awful!! I sent $800 btc to Bitcan wallet and the money NEVER showed up! I copied Receive before I sent......then, after Receive is different and btc not found!!! Scam ‼️

> Fake app, you coins get deposited to someone else's wallet. DO NOT USE!

...

but that might just be haters, right? After all there is many 5 star ratings,
too, like [this one](https://play.google.com/store/apps/details?id=jb.tech.bitpiewallet&reviewId=gp%3AAOqpTOEV6Zl0NS6j6AHFQV7woTr9SJmXiFximwKNxE3j-Q2_RhiBsQTrNxcnCfQsCjM2q71gfTKWSXbWfad2Bg):

> Wow this is great just after sending my deposit 15Btc it appeared immediately even before confirm.

which sounds like the fake reviewers are not even trying to look serious. WTH?

We downloaded the apk and threw it at jadx and and there, we went straight for
the receive screen. `jb.tech.bitpiewallet.Receive` should be it, right? There
in `onCreate`, the starting point of the Activity/screen, `getWallet()` is
called. Here it is:

```
public void getWallet() {
  try {
    FirebaseDatabase.getInstance().getReference("Users").child(uid).addListenerForSingleValueEvent(new ValueEventListener() {
      /* class p009jb.tech.bitpiewallet.Receive.C13267 */

      @Override // com.google.firebase.database.ValueEventListener
      public void onCancelled(DatabaseError databaseError) {
      }

      @Override // com.google.firebase.database.ValueEventListener
      public void onDataChange(DataSnapshot dataSnapshot) {
        Receive.this.prd.show();
        Receive.walletid = (String) dataSnapshot.child("WalletId").getValue(String.class);
        Receive.walletname = (String) dataSnapshot.child("WalletName").getValue(String.class);
        TextView textView = Receive.this.tv48waltname;
        textView.setText(Receive.walletname + " Receiving Addresses");
        TextView textView2 = Receive.this.tv46name;
        textView2.setText("My " + Receive.walletname + " Addresses");
        FirebaseDatabase.getInstance().getReference("Wallets").child(Receive.walletid).addListenerForSingleValueEvent(new ValueEventListener() {
          /* class p009jb.tech.bitpiewallet.Receive.C13267.C13271 */

          @Override // com.google.firebase.database.ValueEventListener
          public void onCancelled(DatabaseError databaseError) {
          }

          @Override // com.google.firebase.database.ValueEventListener
          public void onDataChange(DataSnapshot dataSnapshot) {
            Receive.walletaddress = (String) dataSnapshot.child("Address").getValue(String.class);
            Receive.walletqr = (String) dataSnapshot.child("QrCode").getValue(String.class);
            Picasso.with(Receive.this).load(Receive.walletqr).into(Receive.this.iv8qr);
            Receive.this.tv49address.setText(Receive.walletaddress);
          }
        });
        Receive.this.prd.dismiss();
      }
    });
  } catch (Exception unused) {
  }
}
```

In the third line it calls `FirebaseDatabase` which according to
[the Firebase documentation](https://firebase.google.com/docs/database/) is:

> Store and sync data with our NoSQL cloud database.

So if the private keys never leave the device, why would the Receive Activity
have to ask a *cloud database* for the receive address?

Without creating a new category **very obvious obvious scam** we file it as
**custodial** (The "provider" holds the coins), assuming it's prompt removal but
either way it's certainly **not verifiable**.
