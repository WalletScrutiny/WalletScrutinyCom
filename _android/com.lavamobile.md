---
wsId: lavaXYZ
title: Lava
altTitle: 
authors:
- danny 
users: 1000
appId: com.lavamobile
appCountry: 
released: 2024-05-25
updated: 2025-05-23
version: 1.10.26
stars: 3.3
ratings: 
reviews: 4
website: https://lava.xyz
repository: 
issue: 
icon: com.lavamobile.jpg
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-05-22
signer: 
twitter: lava_xyz
social: 
redirect_from: 
developerName: Lava Global Inc.
features: 

---

## App Description from Google Play

> 1. Buy bitcoin directly
> 2. Borrow dollars against your bitcoin
> 3. Move money globally, instantly, and for free
> 4. Withdraw directly to your bank account
> 
> The Lava Vault is designed for individuals who refuse to compromise on security. Unlike custodial alternatives, your money stays completely within your control, protected by private keys only you can access, with industry-leading security and easy recovery options.

## Analysis 

Lava claims to be self-custodial, but it eloquently avoids seed-phrases - blaming them for over $400 billion of crypto losses.

Its security model hinges on what it calls the **[Lava Smart Key](https://www.lava.xyz/blog/lava-smart-key)**

> Unlike a seed phrase, which consists of a one-part backup that can be easily compromised, Lava Smart Key splits that backup into two parts, each of which can be recovered separately. Both parts of your Lava Smart Key are needed to access your funds— if one or the other is compromised individually, the attacker won't have access and you'll still be able to regain full control.

The first split is the iCloud or Google Drive backup - which we know could be subject to law enforcement seizure with a [subpoena.](https://www.apple.com/legal/privacy/law-enforcement-guidelines-us.pdf). 

The second split is in the phone, well, in a "Secure Enclave". 

> Lava PIN
>
> The second half your Lava Smart Key is tied to a separate encryption key that's unlocked by a four-digit PIN that you can set in the app. This encryption key is stored on a private key-server and can only be authenticated with your personal Lava PIN.

Where is that server? Who owns that server? Can some technician access it? 

So all that the attacker has to do is be the government, conjure up a subpoena, find and seize the server, or seize the mobile phone. 

Assuming we bend over backwards and accommodate the self-custodial tag, its [terms and conditions](https://www.lava.xyz/termsofservice) put a dent to this assertion:

> Termination. We may suspend or terminate your access to and use of the Services at our sole discretion, at any time and without notice to you. You may disconnect your digital wallet at any time. You acknowledge and agree that we shall have no liability or obligation to you in such event and that you will not be entitled to a refund of any amounts that you have already paid to us or any third party, to the fullest extent permitted by applicable law.

Yet, somehow, the seed phrases do make an entrance like an unwanted guest in this [page.](https://www.lava.xyz/blog/how-to-set-up-security)

> You can use seedphrases as well to recover your account. You can find your seedphrase by navigating to security through your profile and once you’ve set up a PIN, you will be able to view your seedphrase.

There is no mention of whether these seed phrases are compatible with other wallets and exportable.

The app is geo-restricted and thus we were not able to test it. The provider seems to want their app to be marked as self-custodial really badly. Despite disparaging seed phrases, and yet at the end offering to give it anyway, we'll mark it as they claim it: **self-custodial**. 

But still, it fails the next test: it's not **source available**. They do have an organization page on GitHub plus a fork of the [BDK library](https://github.com/lava-xyz/bdk) - but not enough to build and verify the actual app.