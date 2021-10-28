---
wsId: 
title: "Blixt Wallet"
altTitle: 
authors:
- leo
users: 500
appId: com.blixtwallet
released: 
updated: 2021-10-27
version: "Varies with device"
stars: 
ratings: 
reviews: 
size: Varies with device
website: https://blixtwallet.github.io
repository: https://github.com/hsjoberg/blixt-wallet
issue: 
icon: com.blixtwallet.png
bugbounty: 
verdict: fewusers
date: 2021-10-17
signer: 
reviewArchive:


providerTwitter: BlixtWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


So we got a support request from somebody who put money into this lightning wallet
and the channel instantly closed but days later he didn't have his money back.
Communications with the provider were not helpful neither.

The force-close transaction had a timelock as is normal in lightning - only weird
thing was the timelock allows to **spend after ... 1987**.

A lightning network force close is when one of the parties in a channel publishes
a channel state without crafting a closing transaction with the counter party
first. As this might happen in bad faith, the counter party is then supposed to
have time to publish a punishment transaction, so this timelock should lay in
the future, not some past at which there wasn't any bitcoin yet. In summary, this
transaction looks like a poorly implemented LN wallet. The transaction also had
five outputs which is indicative of affecting more than two parties like in a
**custodial wallet**?

On the Play Store description they claim (full description):

> Blixt Wallet is a non-custodial open-source Bitcoin Lightning Wallet for
  Android with focus on usability and user experience, powered by lnd and
  Neutrino SPV.

The app is also available for iPhone only via testflight though.

{{ page.title }}'s main developer is
[Hampus Sjöberg](https://twitter.com/hampus_s)
who is well connected in Bitcoin Twitter.

According to the website:

> Blixt Wallet is built as an MIT-licensed open-source project.

So next we would have to see if this app is reproducible. We will look into that
once the app gained some more traction.
