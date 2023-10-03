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