---
title: 'HOLD: Stablecoin Wallet'
date: 2026-09-16
authors:
- danny
website: https://www.hihodl.xyz
redirect_from:
- /android/com.sayhihodl.hihodlai/
- /iphone/com.sayhihodl.hihodlyes/
- /mobile/com.sayhihodl.hihodlyes/
android:
  appId: com.sayhihodl.hihodlai
  users: 10
  appCountry: us
  released: 2026-05-28
  updated: 2026-09-11
  version: 1.7.9
  icon: com.sayhihodl.hihodlai.webp
  meta: fewusers
  verdict: custodial
  developerName: HIHODL Technologies OU
iphone:
  appId: com.sayhihodl.hihodlyes
  idd: '6755203065'
  appCountry: us
  released: 2026-04-02
  updated: 2026-05-13
  version: 1.5.3
  reviews: 1
  icon: com.sayhihodl.hihodlyes.webp
  meta: ok
  verdict: custodial
  developerName: HIHODL Technologies OU

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6755203065" author="overtorment" severity="high" finding="Automatic seed backup is operator-decryptable, but every API base is leftover http://192.168.1.104:5001." note="Per overtorment’s analysis of the iPhone app, build 1.5.3: the app uploads the wallet’s recovery phrase to the developer’s own server during setup. It is encrypted, but the key that encrypts it is built from the user’s account id combined with a value the app downloads from that same server, so the developer can undo the encryption. He noted that in the build he read, the server address was a leftover local network address, so the upload might not have reached anything. HOLD confirms the design in its own terms of service. overtorment published the research in <a href='https://x.com/overtorment/status/2098739225105453192' style='color: white; text-decoration: underline;'>his X thread</a> on 2026-09-12." %}

## App Description

HOLD, published by HIHODL Technologies OU, is a payments app aimed at people who earn in one country and live in another. It is built around stablecoins — digital tokens that track the value of the dollar and other currencies — and it settles on the Base, Solana, Polygon and Ethereum networks, as described on its [networks page](https://hihodl.xyz/how-it-works/networks). You send money to other users by username rather than by address. Alongside the wallet it advertises savings that earn interest, tokenised stock investing, a loyalty scheme, hotel booking and eSIM data. The Android app added Bitcoin after overtorment's research was published; his write-up and the company's own networks page both predate it and list no Bitcoin.

## Testing and Analysis

This assessment was recorded on 2026-09-16 using the Android app, version 1.7.9, installed from [Google Play](https://play.google.com/store/apps/details?id=com.sayhihodl.hihodlai). Screenshots and a screen recording are published in [this thread](https://x.com/BitcoinWalletz/status/2100061852122451968). Both entries on this page are the same product.

### The app does support Bitcoin

The receive screen offers BTC and shows an ordinary Bitcoin address beginning `bc1q`, under the warning "Only send BTC on Bitcoin. Sending on another network may lose your funds." This is real Bitcoin on the Bitcoin network, not a token standing in for it.

That is a change from what has been published elsewhere. overtorment's analysis of the iPhone build 1.5.3, from May 2026, lists only Solana, Polygon and USDC, and the company's own networks page still names four networks with Bitcoin among none of them. The Android app was updated on 2026-09-11. We tested what shipped, not what the documents say.

### The recovery phrase can be exported, and it really does control the bitcoin

A wallet's recovery phrase is the short list of words that can rebuild the wallet, and anything else, anywhere, from scratch. Whoever has it can spend the money.

We found the phrase, copied it into [Electrum](https://electrum.org/), an unrelated Bitcoin wallet, and let Electrum work out which addresses those words control. Electrum's first address came out identical to the address the HOLD app had shown us: `bc1q0y0gcp7fkec2d9wxp4d9ru564fp4ru6f29mhu0`. So the phrase is genuine, it is the real key to the money, and a user who takes it can walk away with their bitcoin and never open HOLD again.

Finding it took a detour. The app ships in a display mode that deliberately never offers the phrase. The company explains why on its [display modes page](https://hihodl.xyz/how-it-works/modes): "The plain-dollars view never shows you your recovery phrase … In the default one, we do not offer them and do not ask you to write them down." The same page adds, of which mode a user is on, "The first one, unless you went looking." Switching to either of the other two modes makes the phrase available.

### The provider keeps its own copy of that phrase, and can unlock it

This is the finding the verdict rests on.

HOLD stores an encrypted copy of every user's recovery phrase on its servers, so that a user who loses their phone can sign in and get their wallet back. The company states in its own [terms of service](https://hihodl.xyz/terms), section 5.1 "Encrypted cloud backup of your recovery phrase", last updated 2026-08-13:

> The key that encrypts this backup is currently derived from values held on our systems rather than from a secret only you know. That is what allows you to recover your wallet with nothing but your sign-in, and it also means that HOLD is technically capable of decrypting this backup. We do not do so … We are replacing this design with one in which no single party, HOLD included, holds enough material to decrypt the backup alone.

The [privacy policy](https://hihodl.xyz/privacy), section 8.1, repeats it: "HOLD is technically capable of decrypting that backup."

overtorment found the same thing by reading the app instead of the paperwork. His account of the mechanism is that the phrase is sent to the company's server, encrypted with a key derived from the user's account id and combined with a value the app downloads from that same server. Because both halves come from the company, the company can reassemble the key. Two people looking from opposite directions — one at the code, one at the legal text — arrived at the same place.

Put the two findings together. Those twelve words are the key to the bitcoin; we proved that in Electrum. The company keeps a copy of those twelve words that it can unlock. So the company can obtain the key to a user's bitcoin. What stops it doing so is its promise not to, which the terms state plainly and which we have no reason to doubt — but a promise is not the same as being unable.

That is what "custodial" means here, and it is why this verdict applies to the Bitcoin balance and not only to the money-transfer parts of the product.

### The app's own wording points the other way

The company describes itself as non-custodial throughout. Terms section 5 says "We do not hold, control, or take custody of your digital assets, we cannot sign a transaction on your behalf, and we cannot move, spend, freeze, or seize your funds." The account recovery screen inside the app says "HOLD is non-custodial — we cannot recover your funds if you lose access" and "There is no support team that can restore them." The marketing [self-custody page](https://hihodl.xyz/how-it-works/self-custody) goes further, calling the stored backup "a sealed blob. We store it, we back it up, and we cannot open it."

That last sentence cannot be squared with section 5.1 of the same company's terms. The terms are the honest version.

We are not calling the rest of it dishonest. Section 5 says the phrase never reaches the company "in readable form", and that is true — it arrives encrypted. The gap is that the company can undo the encryption, which section 5 does not mention and the self-custody page denies outright.

### Two smaller things worth knowing

The protection on the phrase is thinner than advertised. The display modes page says the phrase becomes available "behind your strongest security factor", but the [security page](https://hihodl.xyz/how-it-works/security) explains that revealing it "asks for your authenticator code, not your PIN. Without two-factor set up, that same request falls back to the PIN." The same page calls two-factor optional, so for a user who never enables it, the phrase sits behind a PIN.

Identity verification is already switched on. Account creation offers an identity check, run by Sumsub according to the privacy policy. The company's [providers page](https://hihodl.xyz/legal/providers) ties identity checks to its regulated features — the fiat account, the card, buying and selling — and marks every one of those providers "not yet enabled" in the public release. So the check is live while the things requiring it are not.

### What we did not test

We did not capture the app's network traffic and did not examine the code inside the Android package. That means we did not confirm, ourselves, that the upload described above happens in the shipped Android build; for that part we rely on overtorment's reading of the iPhone build and on HOLD's own description of its design. We did not test the savings, investing, card, hotel or eSIM features, several of which the company lists as not yet switched on. We did not verify the Solana or Ethereum side of the wallet.

### Verdict: the provider can obtain the keys

The wallet holds real bitcoin, and a determined user can export the recovery phrase and take that bitcoin elsewhere — we did exactly that. But the provider keeps a copy of the same phrase that it is able to decrypt, by its own written admission, which means the provider is in a position to spend a user's funds. Our assessment stops there, as it does for any product where someone other than the user can reach the keys. The app's non-custodial claims, and the fact that the export exists at all, do not change who is capable of what.

Source availability and reproducibility are not assessed.
