---
wsId: blockbank
title: "BlockBank"
altTitle: 
authors:
- danny
users: 10000
appId: com.aibb.wallet
released: 2019-04-04
updated: 2021-09-28
version: "2.3.13"
stars: 4.2
ratings: 307
reviews: 246
size: 15M
website: https://blockbank.ai/
repository: 
issue: 
icon: com.aibb.wallet.jpg
bugbounty: 
verdict: custodial
date: 2021-10-01
signer: 
reviewArchive:


providerTwitter: BLOCKBANKapp
providerLinkedIn: 
providerFacebook: blockbank
providerReddit: 

redirect_from:

---


### Google Play

Self described:

> BlockBank is a non-custodial utility wallet that combines the power of decentralized and centralized technology.

> **Buy Crypto**: A simple, secure and fast way to buy Bitcoin and crypto.

> **Keep your private key secure:** with simple features like PIN lock, fingerprint recognition, wallet backup and email verification.

The app has many other features related to DeFi and staking.

### The Site

Barely two minutes into [Blockbank's site](https://blockbank.ai/), we were contacted by support through the embedded chat's browser notification. We engaged with a conversation with them and they asserted that V2 will be non-custodial. We then asked for links to their source code if it was open source. They replied that they'd have to consult their developers for that. We were able to locate their github page, but it was not directly linked from their site.

#### Terms of Use

Many provisions in Blockbank's Terms seem to point to a custodial service.

Termination related clauses, under Section 4:

> We reserve the right to suspend, restrict or terminate your access to any or all of our Services and to deactivate your account, including without limitation

Furthermore:

> In the event that we decide to suspend, restrict or terminate your access to our Services in accordance with the provisions of this Clause 2, we will (to the extent that it is not unlawful for us to do so) provide you with adequate notice of such termination of Services. Suspensions from the use of our Services will be reversed only as soon as reasonably practicable once the reasons for refusal no longer exist. We are under no obligation to execute any suspended, reversed or terminated transactions at the same price or on the same terms.<br><br>
**We do not guarantee that any specific content, component and/or feature will always be available on the BlockBank.ai Wallet App Services**.

##### Concerning the App's Functions:

>The BlockBank.ai Application gives you interactive access to your Digital multi protocol Asset Wallet, including allowing you to perform one or more of the following actions:<br>
>   **(a)** view the balance and Transaction History of your Digital Asset Wallet;<br>
>   **(b)** send and receive digital assets within the app.<br><br>
> View the market cap of the top 100 tokens;<br>
>   **(c)** access news in one location;<br>
>   **(d)** view the market cap of the top 100 tokens.<br>

##### Concerning Open Source

> We may make (but are not obligated to make) the source code for the software we develop available for download as open source software. You agree to be bound by, and comply with, any license agreement that applies to this open source software. You will not indicate that you are associated with us in connection with your use, modifications or distributions of this open source software.

#### Blockbank's "Lightpaper"

Blockbank has a lightpaper which can be accessed [here](https://blockbank.ai/docs/blockbank_lightpaper.pdf). 

> BlockBank consists of 4 main components:<br><br>

> - a centralized custodial wallet,
> - a non-custodial web 3 wallet,
> - complete banking tech stack service,
> - banking and true AI (Robo Advisory).

### The App

We tried the Blockbank app. Upon installation, we were greeted by this message:

> **Welcome to blockBank**<br>
BlockBank is a multi-protocol utility wallet that combines the power of decentralized and centralized technology in a simple and secure application.<br><br>
BlockBank's vision is to create an all-in-one crypto application that simplifies the user experience without compromising security, privacy, or decentralization. We aim to combine the best of Defi and DeFi worlds in one place, incorporating AI technology to bring financial empowerment to clients.

Blockbank has the user **private keys** encrypted with a pin code and secured through biometrics.

#### Registration

1. Username
2. Email (Needed in case user forgets pin)
3. Pin
4. First Name
5. Last Name
6. Phone (for sms verification)

The next step is to backup the wallet accessible via the pin. Encryption used is AES 256-bit. Password for backup file. The backup is stored in a txt file locally.

Tapping on **'Settings'** opens a menu with the following sub-menus:

- Backup
- Restore
- Private Keys

Selecting 'Private Keys' opens a menu with a gallery of 12 coins. Bitcoin is included. Selecting Bitcoin opens a prompt for the Pin. Inputting the Pin gives access to the private key. We tried importing the Blockbank private key to a third-party bitcoin wallet and we've managed to create a "watching-only wallet"

### Contact

We reached out to Blockbank via their onpage chat support.

### Verdict

This was a difficult app to review and we would be open to correction and/or clarification, particularly if Blockbank would reply to our queries. On one hand, the app claims to be non-custodial, and provides the user with the private key, the ability to backup and restore the wallet. However, importing the private key to another wallet, we were only able to create a "watching only" wallet. Furthermore, the Blockbank wallet app backup can only be used with another Blockbank wallet app. Now this becomes problematic especially since it is stated in the terms of use that:

> **We do not guarantee that any specific content, component and/or feature will always be available on the BlockBank.ai Wallet App Services**

This clause falls under termination. You may have the backup or the private key, but if you don't have access to the app - because let's say, your account was suspended, then this is a **custodial** service and therefore **not verifiable**

Note: With that said, we are willing to change our verdict upon further guidance by the Blockbank team.

