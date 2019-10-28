---
layout: archive
title: "Methodology"
permalink: /methodology/
author_profile: true
---

We concentrate on a tiny aspect of wallet security and to better understand
what we do and do not do, this page explains the rough process of how we work.



What we do not do
=================

* We do not provide a security audit of the source code.
* We do not approve of the security of any wallet.
* We do not guarantee that your version of the wallet is verified to match the public code.



What we do
==========

To put it dramatic, we search for the obvious potential to empty all the wallets
of all the users at once. Could the provider of the wallet with enough criminal
energy defraud all its users at once, without this being detected before it is
too late?

This horror scenario is possible whenver the provider has a copy of your wallet
and thus access to your funds. He could at a certain date empty all the wallets.

Seeing that some wallets have millions of users it is plausible to assume that
some wallets manage billions of dollars. A huge incentive for criminally
inclined employees, even if the wallet was not set up to scam its users from the
start, which certainly is the case for some wallets.


Is the wallet custodial?
------------------------

A custodial wallet - a wallet where all the funds are in custody of the
provider - can at any point steal all the funds of all the users at the
provider's discretion. Our investigations stop there if the wallet is custodial
(and by our definition not a wallet).


Is the wallet open source?
--------------------------

A wallet that claims to not give the provider the means to steal the users'
funds might actually be lying. In the spirit of "Don't trust - verify!"
you don't want to take the provider by his word but trust that people hunting
for fame could actually find flaws and backdoors in the wallet so the provider
doesn't dare to put these in.

Backdoors and flaws are found in closed source products all the time but some
remain hidden for years, even in
[open source security software](https://www.cvedetails.com/vulnerability-list.php?vendor_id=97&product_id=585&version_id=&page=1&hasexp=0&opdos=0&opec=0&opov=0&opcsrf=0&opgpriv=0&opsqli=0&opxss=0&opdirt=0&opmemc=0&ophttprs=0&opbyp=0&opfileinc=0&opginf=0&cvssscoremin=0&cvssscoremax=0&year=0&month=0&cweid=0&order=3&trc=98&sha=cf091948bd7a20cd650cfc7fb718a5f4400a6d71).

An evil wallet provider would certainly prefer not to publish the code, as that
would make audits orders of magnitude easier.

For your security you thus want the code to be available for review.

If the wallet provider doesn't share up to date code, our analysis stops here.

We do not care about the license as long as it allows us to perform the further
analysis. For a security audit it is not necessary that the provider allows
others to use their code for a competing wallet.


Does the published app match the published code?
------------------------------------------------

Published code doesn't help much if it is not what the published app was
built from. At this point we review if the wallet provider claims that the
wallet can be verified to match the published code. We then go on and try to
verify the app. We

1. obtain the app from Google Play
2. compile the app from the published source code
3. compare the two apps

If the last step fails, we might search if other revisions match or if we can
deduct the source of the mismatch.


Wrap it up
----------

In the end we report our findings. All wallets that fail at any of the above
questions is considered high risk in our estimate. We might contact the wallet
provider and try to find out what went wrong. We will report on the respective
communication. We will list bug bounties and other observations that might
influence the wallet security.

In the end, even if we conclude not to trust a wallet this doesn't mean the
wallet was out to steal your coins. It just means that we are confident that
with enough criminal energy this wallet could theoretically steal all the funds
of all its users.






