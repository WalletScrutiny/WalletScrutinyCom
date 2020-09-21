---
layout: archive
title: "Methodology"
permalink: /methodology/
author_profile: true
---

We concentrate on a tiny aspect of wallet security and to better understand
what we do and do not do, this page explains the rough process of how we work.


What we do
==========

To put it dramatically, we search for the obvious potential to empty all the wallets
of all the users at once. Could the provider of the wallet, with enough criminal
energy, defraud all its users at once, without this being possible to be
detected before it is
too late? (If he could in theory, then a sufficiently motivated criminal could
also put him under duress to steal your funds or manipulate him into stealing
your coins with social engineering or with a software backdoor.)

This horror scenario is possible whenever the provider can obtain a copy of your wallet
backup and thus access all the users' funds at once. He could collect the
backups and once the amount of coins he could access stops growing, empty all
the wallets in one big transaction.

Seeing that some wallets have millions of users, it is plausible to assume that
some wallets manage billions of dollars. This would be a huge incentive for criminally
inclined employees, even if the wallet was not set up to scam its users from the
start, which probably is the case for some wallets, too.


What we do not do
=================

* **We do not** provide a security audit of the source code.
* **We do not** endorse the security of any wallet.
* **We do not** guarantee that your version of the wallet is verified to match
  the public code or the version that we investigated. A tool for that is under
  development. If version 3.4.5 of your wallet is reproducible according to us
  then you might still have received a different version 3.4.5 than the one we
  reviewed. Google lets the developers slice the market by country, device brand
  and even individual users. You would have to compare the fingerprint of the
  app on your device with the one reported here.


Our steps when reviewing a new app
==================================

Some of the information is collected automatically from Google Play. Apps tagged
{% include verdictBadge.html verdict="wip" type='short' %}
are work in progress and might have nothing to do with wallets. We have
not had the time to look into it yet.

If the app has less than 1000 downloads, we do not bother investigating it
further and keep tracking its downloads until it does. Those get tagged 
{% include verdictBadge.html verdict="fewusers" type='short' %}.

Our manual review goes as follows:

We take the perspective of a curious potential user of the respective app.
We take all information from publicly available sources as we do not assume that
potential users would sign NDAs prior to using a wallet. We also do not consider
hard to find information. Our verdict therefore is based on what we can find
within a *few clicks* from the Playstore description. We occasionally search
GitHub for the identifiers but without endorsement from the official website,
any repository we find this way is not very promising to provide reproducible
builds but we are happy to leave an issue on a source code repository about our
findings.

Once we find the wallet's website, we try to answer the following questions:


Is it a wallet?
---------------

If it's called "wallet" but is actually only a portfolio tracker, we don't look
any deeper, assuming it is not meant to control funds. What has no funds, can't
lose your coins. *It might still leak your financial history!*

If not, we tag it {% include verdictBadge.html verdict="nowallet" type='short' %}.


Is it for Bitcoins?
-------------------

At this point we only look into wallets that at least also support BTC. If this
is not the case, the wallet is tagged
{% include verdictBadge.html verdict="nobtc" type='short' %}.


Is it custodial?
------------------------

A custodial service is a service where the funds are held by a third party like the
provider. The custodial service can at any point steal all the funds of all the users at the
custodian's discretion. Our investigations stop there.

Some services might claim their setup is
super secure, that they don't actually have access to the funds, or that the
access is shared between multiple parties. For our evaluation of it being a wallet,
these details are irrelevant. They might be a trustworthy Bitcoin bank and they might
be a better fit for certain users than being your own bank but our investigation
still stops there as we are only interested in wallets.

Those apps get tagged {% include verdictBadge.html verdict="custodial" type='short' %}.

Apps that claim to be non-custodial but feature custodial accounts without very
clearly marking those as custodial are also considered "custodial" as a whole to
avoid trusting users following our assessment to fall for this important
limitation of said apps.


Is it the source code public?
--------------------------

A wallet that claims to not give the provider the means to steal the users'
funds might actually be lying. In the spirit of *"Don't trust - verify!"*
you don't want to take the provider at his word, but trust that people hunting
for fame and bug bounties could actually find flaws and back-doors in the wallet
so the provider
doesn't dare to put these in.

Back-doors and flaws are frequently found in closed source products but some
remain hidden for years. And even in open source security software there
might be
[catastrophic flaws](https://www.cvedetails.com/vulnerability-list.php?vendor_id=97&product_id=585&version_id=&page=1&hasexp=0&opdos=0&opec=0&opov=0&opcsrf=0&opgpriv=0&opsqli=0&opxss=0&opdirt=0&opmemc=0&ophttprs=0&opbyp=0&opfileinc=0&opginf=0&cvssscoremin=0&cvssscoremax=0&year=0&month=0&cweid=0&order=3&trc=98&sha=cf091948bd7a20cd650cfc7fb718a5f4400a6d71)
undiscovered for years.

An evil wallet provider would certainly prefer not to publish the code, as
hiding it makes audits orders of magnitude harder.

For your security, you thus want the code to be available for review.

If the wallet provider doesn't share up to date code, our analysis stops there.
The wallet could steal your funds at any time, and there is no protection except
the provider's word.

We are not concerned about the license as long as it allows us to perform our
analysis. For a security audit, it is not necessary that the provider allows
others to use their code for a competing wallet.

If no code is found or the code found is clearly outdated, the wallet is
classified as {% include verdictBadge.html verdict="nosource" type='short' %}.


Is the published app matching the published code?
------------------------------------------------

Published code doesn't help much if it is not what the published app was
built from. At this point we review if the wallet provider claims that the
wallet can be verified to match the published code. We then go on and try to
reproduce the app. We

1. obtain the app from Google Play
1. compile the app from the published source code using the published build
   instructions
1. compare the two apps
1. spend some time working around
   [issues that are easy to work around](https://issuetracker.google.com/issues/110237303)

If this fails, we might search if other revisions match or if we can
deduct the source of the mismatch but generally consider it on the provider to
provide the correct source code and build instructions to reproduce the build,
so we usually open a ticket in their git repository (all on GitHub so far) and
classify the wallet as
{% include verdictBadge.html verdict="nonverifiable" type='short' %}.

If we managed to reproduce the build, we classify it as 
{% include verdictBadge.html verdict="reproducible" type='short' %}.


Priorities
----------

We cannot re-evaluate all the +160 apps every hour and as this is a side-project
still, we might not be able to update anything for a month or three straight.

But when we update reviews, we try to proceed as follows:

1. Re-evaluate new releases of reproducible wallets as they become available. If
   users opt for a wallet because it is reproducible, they **should be waiting for
   this re-evaluation** before updating.
1. Check if any of the "Not verifiable!" wallets updated their issues on their
   repository.
1. Fix general issues with the platform
1. Evaluate "WIP" and "Few users" with +1000 downloads


Wrap it up
----------

In the end we report our findings. All wallets that fail at any of the above
questions are considered high risk in our estimate. We might contact the wallet
provider, try to find out what went wrong and report on the respective
communication.

In the end, even if we conclude not to trust a wallet this doesn't mean the
wallet was out to steal your coins. It just means that we are confident that
with enough criminal energy this wallet could theoretically steal all the funds
of all its users.


Further considerations
---------------------

We will list as we stumble into them things like

* Bug bounties
* External audits
* Past and present serious flaws
* Security relevant observations. While this might be comments on the code, this
  is not a complete code review. It's only what we see when looking at the code
  for some minutes. A full code review takes man-months.


What could still go wrong?
--------------------------

The classification "reproducible" unfortunately means very little. It means that
at the random point in time that we decided to verify the code to match the
app, the code actually did match the app. It does not mean that the next update
will or that the prior one did and it does not mean that the reproducible code is
not doing evil things.

In fact, we believe the most likely scenario for an exit scam is that the wallet
would bait-and-switch. It would see to how many users it could grow the app or
even buy out a successful wallet in financial trouble to then introduce a
code to leak the backups.

The evil code would not be present until the app is losing users (or funds under
management) for whatever other reason.

Any stamp of approval, any past security audit or build verification would be
obsolete. Therefore we don't see our mission as fulfilled when all wallets are
reproducible. There is a long road ahead from there. For users running reproducible
wallets, the wallets would need actual code audits – Before releasing the app to
its users.

To put things into perspective, reviewing the code some 5 developers put out is
a full time job. Testing the reproducibility of a wallet is an hour of work the
first time and can be automated.

To achieve a situation where most users are running verified apps, the release
process would have to be massively decelerated and there would have to be strong
incentives in place for security researchers to find issues.

Often users are in a big hurry to get bug-fixes and wallet managers are in a
hurry to roll out new features but this hurry is standing against the security
of all wallet users. Wallet developers "screw up" all the time and almost always
it's just some crash affecting some corner case they didn't anticipate when
writing the code and these crashes while highly inconvenient for the users who
expected to use their wallet today, usually do not put at risk any funds in the
wallet. This hurry does, however, put reviewers in the uncomfortable position of
having to approve something that would need more review. Most reviewers are
reviewing the work of their colleagues and trusting them is kind of expected at
least by the colleagues themselves but all it takes is one slip up and the code
might be compromised. And compromising code in ways that go unnoticed by an
auditor is [kind of a sport](https://en.wikipedia.org/wiki/Underhanded_C_Contest).
