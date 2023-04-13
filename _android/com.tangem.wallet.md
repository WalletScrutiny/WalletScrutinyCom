---
wsId: tangem
title: Tangem - Crypto wallet
altTitle: 
authors:
- leo
- danny
users: 10000
appId: com.tangem.wallet
appCountry: 
released: 2018-10-24
updated: 2023-04-13
version: 4.3.2
stars: 4.6
ratings: 89
reviews: 27
size: 
website: https://tangem.com
repository: https://github.com/tangem/tangem-app-android
issue: 
icon: com.tangem.wallet.png
bugbounty: 
meta: ok
verdict: wip
date: 2021-04-10
signer: 
reviewArchive: 
twitter: tangem
social:
- https://www.linkedin.com/company/tangem
redirect_from: 
features: 

---

The repository for the Tangem Android app is [now available](https://github.com/tangem/tangem-app-android). 

The app is now for verification. 

**Update 2022-08-01**

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

The description on Google Play is not explaining much and talks more about
issues with NFC of some phones and neither does their website explain in clear
words what this app is but I found
[this demo video](https://www.youtube.com/watch?v=sTaQN2z7H_A) and it clearly
shows that the app is crucial for the security of your funds.

Ironically if the app works the same on Android and the "copy address" part is
actually copying the address to the clipboard which makes sense if one would
want to send coins from an exchange to the card for example, any other app on
the phone without any special permissions without even being apparently active
could swap the receive address and the user would have no way of knowing this
was happening.

Anyway, the next question would be: "Is the code public?" ... but as far as I
can see there is no source code available that one could inspect. That leaves us
with the verdict **not verifiable**.
