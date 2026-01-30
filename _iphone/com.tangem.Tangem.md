---
wsId: tangem
title: Tangem - Crypto wallet
altTitle: 
authors:
- leo
appId: com.tangem.Tangem
appCountry: 
idd: 1354868448
released: 2018-04-28
updated: 2026-01-27
version: '5.32'
reviews: 20107
website: 
repository: 
issue: 
icon: com.tangem.Tangem.jpg
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-10-28
signer: 
twitter: tangem
social:
- https://www.linkedin.com/company/tangem
features: 
developerName: Tangem AG

---

### Updated Analysis 2025-10-28

The Android version of the app {% include walletLink.html wallet='android/com.tangem.wallet' verdict='true' %} has been reclassified as **source-available**. So we decided to give a quick cursory check if the ios app merits the same change. Here's what we gathered:

**What Looks Solid**

- Real Xcode project and Swift sources are all there (TangemApp.xcodeproj/project.pbxproj:32560, Tangem/App/...).
- bootstrap.sh actually unwraps a giant SwiftPM bundle so you can build offline (bootstrap.sh:18-42).
- Schemes for Tangem/Tangem Alpha/Tangem Beta exist, so Xcode will open without hacking around.

**Where It Breaks Down**

- Every config JSON is stuffed with "PLACEHOLDER" values (tangem-app-config/config_prod.json:1-38), and the Firebase plist is literally empty (tangem-app-config/ios/GoogleService-Info-Production.plist:1-5). Without the real API keys you can’t reproduce the shipping binary.
- The packaged dependencies include a private SSH repo (Package.swift:24-33), but they sneak in a prebuilt archive at SPM_dependencies.part00*. It works, yet we can’t verify what’s inside, and there are no checksums given.
- I couldn’t find any CI scripts, fastlane lanes, or release automation—recent commits are bland “Updated on …” messages from a bot (git show --stat, README.md:9-44). Nothing links a tag to an App Store build we could match.

**Bottom Line**

So the source is technically there, but the missing keys plus opaque dependency blobs keep it from being “source available” in a WalletScrutiny sense. You can’t rebuild and compare against the App Store IPA without extra info.

**Previous Analysis 2021-04-10**

This app is the companion app to an NFC card that is promoted as something like
a hardware wallet but without a screen or a button it can only do what the
companion app - this app - tells it to do. As such, this app is very crucial if
you use these cards as your Bitcoin wallet. It has to be trustworthy and thus we
consider it a Bitcoin wallet. Our mission is to look for the potential of all
the users of an app lose all their funds at once which arguably cannot happen in
the given configuration. The app could not collect the private keys from the
cards *if the cards do what they claim* which cannot be publicly verified
neither but even if the card does as advertised, the app could still steal a lot
of funds of a lot of users if it would switch to evil-mode for all users at
once. It would still require users' interaction but the window of opportunity
could easily be days to weeks before Google would remote-wipe the app or the app
would get stopped from emptying wallets of unsuspecting users upon their next
use.

The description on the App Store is not explaining much and neither does their
website explain in clear words what this app is but I found
[this demo video](https://www.youtube.com/watch?v=sTaQN2z7H_A) and it clearly
shows that the app is crucial for the security of your funds.

The next question would be: "Is the code public?" ... but as far as I
can see there is no source code available that one could inspect. That leaves us
with the verdict **not verifiable**.
