---
wsId: casaapp
title: 'Casa: Bitcoin & Crypto Wallet'
date: 2021-05-22
authors:
- leo
- danny
website: https://keys.casa
twitter: CasaHODL
features:
- buyWithCC
- multiSig
redirect_from:
- /casa.keymaster/
- /posts/casa.keymaster/
- /android/casa.keymaster/
- /iphone/com.casa.vault/
android:
  appId: casa.keymaster
  users: 10000
  appCountry: us
  released: 2019-03-01
  updated: 2026-07-23
  version: 5.21.0
  reviews: 28
  icon: casa.keymaster.png
  meta: ok
  verdict: nosource
  developerName: Casa, Inc
iphone:
  appId: com.casa.vault
  idd: 1314586706
  appCountry: us
  released: 2018-08-02
  updated: 2026-07-25
  version: 5.21.0
  reviews: 1222
  icon: com.casa.vault.jpg
  meta: ok
  verdict: nosource
  developerName: Casa Inc.

---

## Android

**Update 2026-08-15**: Following
[a discussion on Nostr](https://njump.me/note17fvthzcwgja4y5tqrylvrtpe6ku2enpqs92s8gh4f9hcytgu2eysgjw0tn#:~:text=the%20mobile%20key%20can%20technically%20be%20extracted)
we took another look at the Mobile Key backup. The Devil's Advocate section
below now cites Casa's own documentation on who can decrypt it.

**Update 2020-12-03**: This app is not obfuscated. Anybody can decompile at
least version `2.27.10` and inspect the code or modify it to compile it back
into an app. Clearly licensing stops honest people from publishing the result to
any users but we don't see any argument left to not publish the code under a
non-permissive license.

**Update 2019-12-20**: This app and its review here were also discussed in a
[great episode of the Unhashed Podcast](https://www.unhashedpodcast.com/episodes/jameson-lopp-shills-wallet-you-must-trust#deadLink).

This app follows an interesting concept with a multi-signature setup.

The app contains a single-signature wallet like most wallets discussed here but
it also allows to use 2-of-3, 3-of-5 and maybe other configurations.

So the client software is a wallet on its own but can we audit it? Neither on
Google Play nor on their website nor
[on GitHub](https://github.com/search?q=%22casa.keymaster%22&type=Code) can we
find a link to the source code.

Also on [Stephan Livera](https://twitter.com/stephanlivera)'s podcast we found
[episode 182](https://stephanlivera.com/episode/182/) with Casa's
[Jameson Lopp](https://twitter.com/lopp) and
[Nick Neuman](https://twitter.com/nneuman) where Lopp explains about Open
Source:

> Yeah. I mean, this is something that we’ve talked about, you know, ever since
  we started the company the various trade offs between what you can accomplish
  with free open source software versus, you know, a for profit company that may
  not open source all of the software that it’s writing. And when you’re looking
  at the multisig product that we’ve built, that is actually a very well
  diversified product because you end up using open source software, your
  firmware and hardware from a variety of different companies, which helps you
  both increase your level of security from a variety of different threats and
  decrease the likelihood that, you know, all of those different actors out
  there have been compromised and willing to coordinate, to work against you.
  It gets a little bit trickier, you know, when we’re talking about a closed
  source, single sig hot wallet, I mean, this is a riskier threat model.

fair points but ... there is a single signature part to the wallet which they
recommend to use like a checking account and as they recommend their
multi-signature "gold" product for wallets starting at $1000, we assume this
wallet is still meant for amounts up to $1000. And regardless of
recommendations, users tend to forget they have $700 in their wallet and next
time they check, Bitcion went up x20 ...

Lopp goes on to say:

> Now, when we’re talking about open source versus closed source in the context
  of mobile apps, then it gets even trickier because it is difficult if not
  impossible. And in fact, we have not yet really found a way to verify the
  build of a mobile app that is on the Apple store or the Google Play Store.

which is a direct hint to what we are doing at WalletScrutiny. Is he claiming we
are promoting something that cannot exist? Or that he has not yet figured out,
which given he is a professional in the space since before Bitcoin would be hard
to believe? He explains:

> The way that these mobile App Stores work is that they require the
  applications to be cryptographically signed by the developers in order to get
  pushed out to the store, but the actual build process for the app, the actual
  you know, attestation of what the code that’s that’s being run on the app is
  not really a part of the experience that Apple and Google provide.

What does he mean by that? Yes, the apps are signed. So what? For Reproducible
Builds, a missing signature on part of the re-builder is perfectly fine to proof
a match of the underlying code. Strip the signature from the Google Play version
and compare.

He further claims:

> The only real option, if you wanted to be sure of what the actual code was
  running as would end up having to build the mobile app yourself and load it
  onto your phone.
> 
> This is, theoretically possible, at least with Android, but it requires a fair
  amount of technical experience. It’s really not, the people who have the
  ability to do that. We are not really targeting them for this experience.

Reproducible Builds matter precisely so you can take advantage from public code
audits
without having to compile or audit the code for yourself. It is a complicated
and technical topic and it is our mission to educate users and providers on the
possibilities and limitations so users will demand reproducibility for peace of
mind while professionals call out those who don't follow best security practice
thanks to relevant projects being subject to public scrutiny.
  
> You
  know, this is meant to be for nontechnical people who are very early in their
  Bitcoin life cycle. **So it really seems like from a free open source software
  security side of things, that it’s more of a feel good idea** of having open
  source mobile apps, if you can’t actually verify.

Pardon? "open source software" is a "feel good idea"? This part of the interview
is really getting hard to read without jumping up from the chair!

> I mean, we are all familiar
  with the mantra of don’t trust verify, and if people could, you know, verify
  that the code we open sourced was the code that was out there on these stores.
  Then I think it would make a stronger argument for us to be open sourcing it.

Jameson Lopp we challenge you to show how WalletScrutiny is pointless. We close
shop if you can show that our work is futile.

WalletScrutiny.com is not perfect but for now provides an important building
block towards making wallets more secure by ensuring Build Reproducibility.

The missing parts of

* Actual code audits
* Release deceleration

depend on users and providers caring enough to appreciate the security
implications of rushed releases and incentives bug bounties to audit code.

Build Reproducibility is important and possible and you claiming
the exact opposite is an affront to those who hold up these pillars of
transparency.

> The other downside is that, like I said, these apps require a cryptographic
  signatures from the developers to be on the store. There’s also various
  functionality that we’re using such as some of the pieces of the seed backup
  that also require that. So even if you built the app on your own, you would
  not have a fully functioning Casa wallet, you know the user experience that we
  really intended. So there’s trade offs Yup.

With Build Reproducibility, the signature of the Google Play app can be applied
to the self-built app. Sure, modifications are not possible but our fight is for
transparency for the sake of security, not for the freedom to do modifications.

In defense of Lopp, he is talking about "Open Source", not "public source", so
some statements apply to Open Source that would just not make sense for public
source but let's take

# The Devil's Advocate's Perspective

Interestingly the FAQ section on their website states:

>  **Can Casa ever access my Bitcoin?**
> 
> Casa can **never** access your funds - even if we wanted to. With multisig,
  multiple keys are required to spend your Bitcoin, and Casa only ever has
  access to 1 key (for use in emergencies only). This also means that it’s
  impossible for Casa to ever stop you from accessing your Bitcoin. And that
  even if Casa were under attack, your funds would still be 100% safe from
  thieves or hackers. Casa was architected with a ‘Can’t Be Evil’ principle.

and

> **How does the setup process work?**
> 
> For Gold memberships, you can bring your own hardware device(s), download the
  Keymaster app, and get started immediately. For Platinum and Diamond, Casa’s
  team walks you through a simple, curated setup process:
> 
> 1. Receive your hardware devices in the mail
>    - Includes everything you need in one discreet package.
> 2. Book your Key Ceremony and graduate to multisig
>    - Your Client Advisor walks you through a personalized onboarding and OpSec
>      review.
> 3. Ongoing security and service
>    - We’ll keep you up to speed on all the security developments you need to
>      know about.
>    - Message us any time you have a question, need a free device replacement,
>      or just want to chat.

Back when we first wrote this review we had to assume that the client software
was responsible for one of the keys in each setup. By now we don't have to
assume anymore. Casa's
[Wealth Security Protocol](https://docs.casa.io/wealth-security-protocol/chosen-key-schemes/2-of-3-basic-multisig#:~:text=An%20encrypted%20copy%20of%20the%20mobile%20key,The%20decryption%20key%20is%20kept%20by%20Casa)
describes the default "3-Key Vault" (2-of-3: Mobile Key, hardware key, Casa
Recovery Key) like this:

> An encrypted copy of the mobile key is kept in the cloud storage offered by
  the client's mobile provider (iCloud or Google Drive). The decryption key is
  kept by Casa.

Their
[Mobile Key security overview](https://blog.casa.io/casa-keymaster-security-mobile-key-overview/#:~:text=At%20the%20time%20of%20seed%20phrase%20generation,store%20it%20in%20our%20database)
explains how those two pieces end up where they are:

> At the time of seed phrase generation on the mobile client, the client also
  generates a long, random secret key [...] It sends that secret key to Casa's
  server over https [...] then we securely store it in our database.

and
[where the ciphertext goes](https://blog.casa.io/casa-keymaster-security-mobile-key-overview/#:~:text=In%20the%20Android%20app,iCloud%20Key%20Value%20Store):

> In the Android app, we encrypt the seed phrase with this random secret key
  and send that ciphertext to Google Drive's App Private metadata storage [...]
  For our iOS app, the process is very similar, but the encrypted backup goes
  to the iCloud Key Value Store.

The Casa app writes and restores these backups automatically on any device
signed into the same Google or Apple account - that is how their seamless
recovery works.

To be clear about the threat model: this backup design is not what makes a
malicious Casa dangerous. The app holds the plaintext Mobile Key for everyday
signing, so a malicious update could exfiltrate it directly - the standard
risk of any closed source wallet and the reason for our verdict. Casa
co-founder Jameson Lopp
[conceded as much](https://njump.me/note1q6lx2t9hc0vh38t8zcx7h90m0h4pjphmjv6m7laajquy8yfytezqj9e2ta#:~:text=you%20can%20opt%20to%20use%20a%20second%20hardware%20key)
when a user on Nostr called the default setup "really a 1.5-1.5 key vault":

> If you're worried about a malicious Casa app stealing the mobile key then
  you can opt to use a second hardware key in lieu of the mobile key. What you
  lose is the automatic encrypted key backup.

That opt-out exists but Casa labels it
["for advanced users only"](https://support.casa.io/knowledge/mobile-key#:~:text=for%20advanced%20users%20only),
so the default is what most users run.

What the backup design does add is an attack path that needs no malicious
code and no access to your devices: the ciphertext sits with Google or Apple,
the decryption key sits with Casa. Casa plus your cloud provider - through
collusion or a legal order reaching both companies - can reconstruct the
Mobile Key, and together with the Casa Recovery Key that is two of three
keys, a spending quorum, without the user. Your hardware key protects
against either party alone, not against both together. Lesser variants of
the same path exist for outside attackers: whoever compromises both your
cloud account and your Casa account can restore your Mobile Key onto their
own device, as the blog post above openly discusses.

Casa makes sure to always have control over the majority of your keys:

* They obviously have control over the Casa Recovery Key which they promote as
  being under their control.
* The Mobile Key lives inside their closed source app and the key to decrypt
  its cloud backup lives on their server.
* Should you want to use more than one hardware wallets, they ask you to accept
  shipment through them, making you vulnerable to supply chain attacks.

Combined with this quote from the above interview:

> You know, this is meant to be for nontechnical people who are very early in
  their Bitcoin life cycle.

and this quote from their website:

> **How much Bitcoin can I store in Casa?**
> 
> Gold is built to secure $1,000 - $50,000 worth of Bitcoin. We recommend
  Platinum if you are protecting $50,000 - $500,000 in BTC. Diamond has no upper
  limit, and is optimized for $100,000 and above.

it gives the impression Casa targets rich, non-technical users and lures them
into using their products that are not auditable and thus leave room for
backdoors capable of emptying all clients' wallets at once.

# Our Perspective

The FAQ's "Casa can **never** access your funds - even if we wanted to" is a
promise, not an architecture. We don't assume that Casa is out to steal your
keys but we stand by the mantra "Don't Trust. Verify!" and consider this wallet
with or without multi-signature setup to be **not verifiable**.

{% include featureEvidence.html feature="multiSig" quote="Use multiple keys across devices and locations, with safe recovery if a phone or hardware wallet fails." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy and sell digital assets with low fees One tap to buy or sell. No switching apps, no pasting addresses." source="Website" %}

---

## iPhone

The following is the review of their Play Store app which equally applies to the
App Store version:

**Update 2020-12-03**: This app is not obfuscated. Anybody can decompile at
least version `2.27.10` and inspect the code or modify it to compile it back
into an app. Clearly licensing stops honest people from publishing the result to
any users but we don't see any argument left to not publish the code under a
non-permissive license.

**Update 2019-12-20**: This app and its review here were also discussed in a
[great episode of the Unhashed Podcast](https://www.unhashedpodcast.com/episodes/jameson-lopp-shills-wallet-you-must-trust#deadLink).

This app follows an interesting concept with a multi-signature setup.

The app contains a single-signature wallet like most wallets discussed here but
it also allows to use 2-of-3, 3-of-5 and maybe other configurations.

So the client software is a wallet on its own but can we audit it? Neither on
Google Play nor on their website nor
[on GitHub](https://github.com/search?q=%22casa.keymaster%22&type=Code) can we
find a link to the source code.

Also on [Stephan Livera](https://twitter.com/stephanlivera)'s podcast we found
[episode 182](https://stephanlivera.com/episode/182/) with Casa's
[Jameson Lopp](https://twitter.com/lopp) and
[Nick Neuman](https://twitter.com/nneuman) where Lopp explains about Open
Source:

> Yeah. I mean, this is something that we’ve talked about, you know, ever since
  we started the company the various trade offs between what you can accomplish
  with free open source software versus, you know, a for profit company that may
  not open source all of the software that it’s writing. And when you’re looking
  at the multisig product that we’ve built, that is actually a very well
  diversified product because you end up using open source software, your
  firmware and hardware from a variety of different companies, which helps you
  both increase your level of security from a variety of different threats and
  decrease the likelihood that, you know, all of those different actors out
  there have been compromised and willing to coordinate, to work against you.
  It gets a little bit trickier, you know, when we’re talking about a closed
  source, single sig hot wallet, I mean, this is a riskier threat model.

fair points but ... there is a single signature part to the wallet which they
recommend to use like a checking account and as they recommend their
multi-signature "gold" product for wallets starting at $1000, we assume this
wallet is still meant for amounts up to $1000. And regardless of
recommendations, users tend to forget they have $700 in their wallet and next
time they check, Bitcion went up x20 ...

Lopp goes on to say:

> Now, when we’re talking about open source versus closed source in the context
  of mobile apps, then it gets even trickier because it is difficult if not
  impossible. And in fact, we have not yet really found a way to verify the
  build of a mobile app that is on the Apple store or the Google Play Store.

which is a direct hint to what we are doing at WalletScrutiny. Is he claiming we
are promoting something that cannot exist? Or that he has not yet figured out,
which given he is a professional in the space since before Bitcoin would be hard
to believe? He explains:

> The way that these mobile App Stores work is that they require the
  applications to be cryptographically signed by the developers in order to get
  pushed out to the store, but the actual build process for the app, the actual
  you know, attestation of what the code that’s that’s being run on the app is
  not really a part of the experience that Apple and Google provide.

What does he mean by that? Yes, the apps are signed. So what? For Reproducible
Builds, a missing signature on part of the re-builder is perfectly fine to proof
a match of the underlying code. Strip the signature from the Google Play version
and compare.

He further claims:

> The only real option, if you wanted to be sure of what the actual code was
  running as would end up having to build the mobile app yourself and load it
  onto your phone.
> 
> This is, theoretically possible, at least with Android, but it requires a fair
  amount of technical experience. It’s really not, the people who have the
  ability to do that. We are not really targeting them for this experience.

Reproducible Builds matter precisely so you can take advantage from public code
audits
without having to compile or audit the code for yourself. It is a complicated
and technical topic and it is our mission to educate users and providers on the
possibilities and limitations so users will demand reproducibility for peace of
mind while professionals call out those who don't follow best security practice
thanks to relevant projects being subject to public scrutiny.
  
> You
  know, this is meant to be for nontechnical people who are very early in their
  Bitcoin life cycle. **So it really seems like from a free open source software
  security side of things, that it’s more of a feel good idea** of having open
  source mobile apps, if you can’t actually verify.

Pardon? "open source software" is a "feel good idea"? This part of the interview
is really getting hard to read without jumping up from the chair!

> I mean, we are all familiar
  with the mantra of don’t trust verify, and if people could, you know, verify
  that the code we open sourced was the code that was out there on these stores.
  Then I think it would make a stronger argument for us to be open sourcing it.

Jameson Lopp we challenge you to show how WalletScrutiny is pointless. We close
shop if you can show that our work is futile.

WalletScrutiny.com is not perfect but for now provides an important building
block towards making wallets more secure by ensuring Build Reproducibility.

The missing parts of

* Actual code audits
* Release deceleration

depend on users and providers caring enough to appreciate the security
implications of rushed releases and incentives bug bounties to audit code.

Build Reproducibility is important and possible and you claiming
the exact opposite is an affront to those who hold up these pillars of
transparency.

> The other downside is that, like I said, these apps require a cryptographic
  signatures from the developers to be on the store. There’s also various
  functionality that we’re using such as some of the pieces of the seed backup
  that also require that. So even if you built the app on your own, you would
  not have a fully functioning Casa wallet, you know the user experience that we
  really intended. So there’s trade offs Yup.

With Build Reproducibility, the signature of the Google Play app can be applied
to the self-built app. Sure, modifications are not possible but our fight is for
transparency for the sake of security, not for the freedom to do modifications.

In defense of Lopp, he is talking about "Open Source", not "public source", so
some statements apply to Open Source that would just not make sense for public
source but let's take

# The Devil's Advocate's Perspective

Interestingly the FAQ section on their website states:

>  **Can Casa ever access my Bitcoin?**
> 
> Casa can **never** access your funds - even if we wanted to. With multisig,
  multiple keys are required to spend your Bitcoin, and Casa only ever has
  access to 1 key (for use in emergencies only). This also means that it’s
  impossible for Casa to ever stop you from accessing your Bitcoin. And that
  even if Casa were under attack, your funds would still be 100% safe from
  thieves or hackers. Casa was architected with a ‘Can’t Be Evil’ principle.

and

> **How does the setup process work?**
> 
> For Gold memberships, you can bring your own hardware device(s), download the
  Keymaster app, and get started immediately. For Platinum and Diamond, Casa’s
  team walks you through a simple, curated setup process:
> 
> 1. Receive your hardware devices in the mail
>    - Includes everything you need in one discreet package.
> 2. Book your Key Ceremony and graduate to multisig
>    - Your Client Advisor walks you through a personalized onboarding and OpSec
>      review.
> 3. Ongoing security and service
>    - We’ll keep you up to speed on all the security developments you need to
>      know about.
>    - Message us any time you have a question, need a free device replacement,
>      or just want to chat.

Back when we first wrote this review we had to assume that the client software
was responsible for one of the keys in each setup. By now we don't have to
assume anymore. Casa's
[Wealth Security Protocol](https://docs.casa.io/wealth-security-protocol/chosen-key-schemes/2-of-3-basic-multisig#:~:text=An%20encrypted%20copy%20of%20the%20mobile%20key,The%20decryption%20key%20is%20kept%20by%20Casa)
describes the default "3-Key Vault" (2-of-3: Mobile Key, hardware key, Casa
Recovery Key) like this:

> An encrypted copy of the mobile key is kept in the cloud storage offered by
  the client's mobile provider (iCloud or Google Drive). The decryption key is
  kept by Casa.

Their
[Mobile Key security overview](https://blog.casa.io/casa-keymaster-security-mobile-key-overview/#:~:text=At%20the%20time%20of%20seed%20phrase%20generation,store%20it%20in%20our%20database)
explains how those two pieces end up where they are:

> At the time of seed phrase generation on the mobile client, the client also
  generates a long, random secret key [...] It sends that secret key to Casa's
  server over https [...] then we securely store it in our database.

and
[where the ciphertext goes](https://blog.casa.io/casa-keymaster-security-mobile-key-overview/#:~:text=In%20the%20Android%20app,iCloud%20Key%20Value%20Store):

> In the Android app, we encrypt the seed phrase with this random secret key
  and send that ciphertext to Google Drive's App Private metadata storage [...]
  For our iOS app, the process is very similar, but the encrypted backup goes
  to the iCloud Key Value Store.

The Casa app writes and restores these backups automatically on any device
signed into the same Google or Apple account - that is how their seamless
recovery works.

To be clear about the threat model: this backup design is not what makes a
malicious Casa dangerous. The app holds the plaintext Mobile Key for everyday
signing, so a malicious update could exfiltrate it directly - the standard
risk of any closed source wallet and the reason for our verdict. Casa
co-founder Jameson Lopp
[conceded as much](https://njump.me/note1q6lx2t9hc0vh38t8zcx7h90m0h4pjphmjv6m7laajquy8yfytezqj9e2ta#:~:text=you%20can%20opt%20to%20use%20a%20second%20hardware%20key)
when a user on Nostr called the default setup "really a 1.5-1.5 key vault":

> If you're worried about a malicious Casa app stealing the mobile key then
  you can opt to use a second hardware key in lieu of the mobile key. What you
  lose is the automatic encrypted key backup.

That opt-out exists but Casa labels it
["for advanced users only"](https://support.casa.io/knowledge/mobile-key#:~:text=for%20advanced%20users%20only),
so the default is what most users run.

What the backup design does add is an attack path that needs no malicious
code and no access to your devices: the ciphertext sits with Google or Apple,
the decryption key sits with Casa. Casa plus your cloud provider - through
collusion or a legal order reaching both companies - can reconstruct the
Mobile Key, and together with the Casa Recovery Key that is two of three
keys, a spending quorum, without the user. Your hardware key protects
against either party alone, not against both together. Lesser variants of
the same path exist for outside attackers: whoever compromises both your
cloud account and your Casa account can restore your Mobile Key onto their
own device, as the blog post above openly discusses.

Casa makes sure to always have control over the majority of your keys:

* They obviously have control over the Casa Recovery Key which they promote as
  being under their control.
* The Mobile Key lives inside their closed source app and the key to decrypt
  its cloud backup lives on their server.
* Should you want to use more than one hardware wallets, they ask you to accept
  shipment through them, making you vulnerable to supply chain attacks.

Combined with this quote from the above interview:

> You know, this is meant to be for nontechnical people who are very early in
  their Bitcoin life cycle.

and this quote from their website:

> **How much Bitcoin can I store in Casa?**
> 
> Gold is built to secure $1,000 - $50,000 worth of Bitcoin. We recommend
  Platinum if you are protecting $50,000 - $500,000 in BTC. Diamond has no upper
  limit, and is optimized for $100,000 and above.

it gives the impression Casa targets rich, non-technical users and lures them
into using their products that are not auditable and thus leave room for
backdoors capable of emptying all clients' wallets at once.

# Our Perspective

The FAQ's "Casa can **never** access your funds - even if we wanted to" is a
promise, not an architecture. We don't assume that Casa is out to steal your
keys but we stand by the mantra "Don't Trust. Verify!" and consider this wallet
with or without multi-signature setup to be **not verifiable**.

{% include featureEvidence.html feature="multiSig" quote="Casa uses multiple physical and digital keys (multisig) for greater protection than a single hardware device, browser extension or exchange." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy and sell digital assets with low fees One tap to buy or sell. No switching apps, no pasting addresses." source="Website" %}
