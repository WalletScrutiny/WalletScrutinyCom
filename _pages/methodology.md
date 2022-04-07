---
layout: archive
title: "Methodology"
permalink: /methodology/
author_profile: true
---

We concentrate on a tiny aspect of wallet security and to better understand
what we do and do not do, this page explains the rough process of how we work.

## What we do

To put it dramatically, we search for the obvious potential to empty all the wallets
of all the users at once. Could the provider of the wallet, with enough criminal
energy, defraud all its users at once, without this being possible to be
detected before it is
too late? (If he could in theory, then a sufficiently motivated criminal could
also put him under duress to steal your funds or manipulate him into stealing
your coins with social engineering or with a backdoor.)

This horror scenario is possible whenever the provider can obtain a copy of the wallet
backup and thus access all the users' funds at once. He could collect the
backups and once the amount of coins he could access stops growing, empty all
the wallets in one big transaction. This form of scam got known as ["retirement
attack"](https://medium.com/@michaelflaxman/how-should-i-store-my-bitcoin-43874ac208e4).

Seeing that some wallets have millions of users, it is plausible to assume that
some wallets manage billions of dollars. This would be a huge incentive for criminally
inclined employees, even if the wallet was not set up to scam its users from the
start, which probably is the case for some wallets, too.

## What we do not do

* **<span id="noAudit">We do not</span>** provide a security audit of the wallet.
  The empty row "Audited?" on [the landing page](/) is merely to emphasize
  this fact. As any public source wallet gets potentially audited all the time
  and paid audits certainly help the team to improve their product, those audits
  do not help prevent exit scams or most other ways where all users lose all
  their funds at once, which we are mainly focused on.
* **<span id="foss">We do not</span>** care about licenses as long as all the
  source is public.
  Advocates of [Free and Open Source Software (FOSS)](https://opensource.org/osd)
  argue that a permissive license has security benefits as it allows other
  projects to use the code, which then results in more developers caring about
  the auditability and security of that code. As we strongly agree with this
  view, we hope to expand to cover licenses in the future, too.
* **We do not** endorse the security of any wallet.
* **We do not** guarantee that your version of the wallet is verified to match
  the public code or the version that we investigated. A tool for that is under
  development. If version 3.4.5 of your wallet is reproducible according to us
  then you might still have received a different version 3.4.5 than the one we
  reviewed. For example Google lets the developers slice the market by country,
  device brand
  and even individual users. You would have to compare the fingerprint of the
  binary on your device with the one reported here. For hardware wallets it's even
  harder to make general statements about the device you hold in hands.

## Our manual review goes as follows:

We take the perspective of a **curious potential user** of the respective product.
We take all information from publicly available sources as we do not assume that
potential users would sign NDAs prior to using a wallet. We also do not consider
hard to find information. Our verdict therefore is based on what we can find
within a *few clicks* from the product's description. We occasionally search
GitHub for the identifiers but without endorsement from the official website,
any repository we find this way is not very promising to provide reproducible
builds but we are happy to leave an issue on a source code repository about our
findings.

We answer the following questions usually in this order:

{% include verdictMethodology.html verdict="wip" %}
{% include verdictMethodology.html verdict="fake" %}
{% include verdictMethodology.html verdict="vapor" %}
{% include verdictMethodology.html verdict="unreleased" %}
{% include verdictMethodology.html verdict="fewusers" %}
{% include verdictMethodology.html verdict="nowallet" %}
{% include verdictMethodology.html verdict="nobtc" %}
{% include verdictMethodology.html verdict="nosendreceive" %}
{% include verdictMethodology.html verdict="custodial" %}
{% include verdictMethodology.html verdict="nosource" %}
{% include verdictMethodology.html verdict="obfuscated" %}
{% include verdictMethodology.html verdict="ftbfs" %}
{% include verdictMethodology.html verdict="nonverifiable" %}
{% include verdictMethodology.html verdict="reproducible" %}
{% include verdictMethodology.html verdict="nobinary" %}

Independent of the detailed analysis, we might assign a meta-verdict based on a
project's availability:

{% include verdictMethodology.html verdict="defunct" %}
{% include verdictMethodology.html verdict="obsolete" %}
{% include verdictMethodology.html verdict="stale" %}

## What is a hardware wallet?

There is no globally accepted definition of a hardware wallet. Some consider a
paper with 12 words a hardware wallet - after all paper is a sort of hardware or
at least not software and the 12 words are arguably a wallet('s backup).

For the purpose of this project we adhere to higher standards in the hardware
wallet section. We only consider a hardware wallet if **dedicated hardware**
protects the private keys in a way that leaves the user in **full and exclusive
control** of what transactions he signs or not. That means:

* The device allows to create private keys offline
* The device never shares private key material apart from an offline backup
  mechanism
* The device displays receive addresses for confirmation
* The device shares signed transactions after informed approval on the device
  without reliance on insecure external hardware

## Our steps when reviewing a hardware wallet

We try to follow the
spirit of the software review process, looking at the firmware and its updates
for public source and reproducibility.

We also look at physical properties of the device and came up with these
additional verdicts:

{% include verdictMethodology.html verdict="diy" %}
{% include verdictMethodology.html verdict="prefilled" %}
{% include verdictMethodology.html verdict="plainkey" %}
{% include verdictMethodology.html verdict="noita" %}

{% include /review/whatIsBearer.html %}

## Priorities

We cannot re-evaluate all the wallets every hour and as this is a side-project
still, we might not be able to update anything for a month or three straight.

But when we update reviews, we try to proceed as follows:

1. Re-evaluate new releases of {%
   include verdictBadge.html verdict="reproducible" type='short' %}
   wallets as they become available. If
   users opt for a wallet because it is reproducible, they **should be waiting for
   this re-evaluation** before updating.
1. Check if any of the {% include verdictBadge.html verdict="nonverifiable" type='short' %} wallets updated their issues on their
   repositories.
1. Make general improvements of the platform
1. Evaluate the most relevant
   {% include verdictBadge.html verdict="wip" type='short' %} wallets

## Wrap it up

In the end we report our findings. All wallets that fail at any of the above
questions are considered high risk in our estimate. We might contact the wallet
provider, try to find out what went wrong and report on the respective
communication.

In the end, even if we conclude not to trust a wallet this doesn't mean the
wallet was out to steal your coins. It just means that we are confident that
with enough criminal energy this wallet could theoretically steal all the funds
of all its users.

## No reproducible apps on Apple App Store?

WalletScrutiny started out looking only into Android. Mobile wallets are the
most used wallets and Android the most used among mobile wallets but looking
into iPhone wallets was high on the list from the start.

For Android, the process of reproducing builds was relatively clear and some
apps did this before we started the project. For iPhone this was not the case.
Reproducibility of iPhone apps was an open question.

One year passed. We asked around. Nobody could reproduce any iPhone app.

At this point we shift the burden of proof onto the providers (or Apple). If you
want people to trust your app (or platform), explain how it can be audited. We
will move on in
the meantime and list iPhone apps with an empty reproducible section until
then.

Else, our methodology is the same as for Android wallets.

## Further considerations

We will list as we stumble into them things like

* Bug bounties
* External audits
* Past and present serious flaws
* Security relevant observations. While this might be comments on the code, this
  is not a complete code review. It's only what we see when looking at the code
  for some minutes. A full code review takes man-months.

## What could still go wrong?

The verdict {% include verdictBadge.html verdict="reproducible" type='short' %}
unfortunately means very little. It means that
at the random point in time that we decided to verify the code to match the
binary, the code actually did match the binary. It does not mean that the next update
will or that the prior one did and it does not mean that the reproducible code is
not doing evil things.

In fact, we believe the most likely scenario for an exit scam is that the wallet
would bait-and-switch. It would see to how many users it could grow the product or
even buy out a successful wallet in financial trouble to then introduce
code to leak the backups.

The evil code would not be present until the product is losing users (or funds under
management) for whatever other reason.

Any stamp of approval, any past security audit or build verification would be
obsolete. Therefore we don't see our mission as fulfilled when all wallets are
reproducible. There is a long road ahead from there. For users running reproducible
wallets, the wallets would need actual code audits – Before releasing the binary to
its users.

To put things into perspective, reviewing the code some 5 developers put out is
a full time job. Testing the reproducibility of a wallet is an hour of work the
first time and thanks to automation, 5 minutes for every update.

To achieve a situation where most users are running verified apps, the release
process would have to be massively decelerated and there would have to be strong
incentives in place for security researchers to find issues.

Often users are in a big hurry to get bug-fixes and wallet managers are in a big
hurry to roll out new features but this hurry is standing against the security
of all wallet users. Wallet developers "screw up" all the time and almost always
it's just some crash affecting some corner case they didn't anticipate when
writing the code and these crashes, while highly inconvenient for the users who
expected to use their wallet now, usually do not put at risk any funds in the
wallet. This hurry does, however, put reviewers in the uncomfortable position of
having to approve something that would need more review. Most reviewers are
reviewing the work of their colleagues and trusting them is kind of expected at
least by the colleagues themselves but all it takes is one slip up and the code
might be compromised. And compromising code in ways that go unnoticed by an
auditor is [kind of a sport](https://en.wikipedia.org/wiki/Underhanded_C_Contest).

{% include tee.md %}
