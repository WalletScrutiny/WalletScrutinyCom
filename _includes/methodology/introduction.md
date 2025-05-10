We concentrate on a tiny aspect of wallet security and to better understand
what we do and do not do, this page explains the rough process of how the platform works.

## What we do

To put it dramatically, WalletScrutiny helps identify the obvious potential to empty all the wallets
of all the users at once. Could the provider of the wallet, with enough criminal
energy, defraud all its users at once, without this being possible to be
detected before it is
too late? (If he could in theory, then a sufficiently motivated criminal could
also put him under duress to steal your funds or manipulate him into stealing
your coins with social engineering or with a backdoor).

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

## How verifications work

Tests and verifications on WalletScrutiny are now primarily contributed by users through our [Verifications](/verifications/) functionality. This community-driven approach allows for:

1. Wider coverage of wallet releases
2. Faster verification of new versions
3. Multiple independent confirmations of the same wallet version

Users can contribute their own verification results, which are then displayed on the wallet's page. This distributed approach ensures that no single entity is responsible for all verifications, increasing trust in the results.

We encourage wallet users to [participate in the verification process](/verifications/) and contribute their findings to help the community.

## Review process:

The review process takes the perspective of a **curious potential user** of the respective product.
Information is taken from publicly available sources as we do not assume that
potential users would sign NDAs prior to using a wallet. Hard to find information is also not considered. The verdict therefore is based on what can be found
within a *few clicks* from the product's description. Occasionally, GitHub searches for identifiers may be performed, but without endorsement from the official website,
any repository found this way is not very promising to provide reproducible
builds.

## Priorities

Verifications cannot be performed on all wallets continuously, and as this is a community-driven platform, some wallets may not be updated for extended periods.

When users contribute verifications, we recommend they follow these priorities:

1. Verify new releases of {%
   include verdictBadge.html verdict="reproducible" type='short' %}
   wallets as they become available. If
   users opt for a wallet because it is reproducible, they **should be waiting for
   verification** of the new release before updating.
1. Check if any of the {% include verdictBadge.html verdict="nonverifiable" type='short' %} wallets updated their issues on their
   repositories.
1. Verify the most relevant {% include verdictBadge.html verdict="wip" type='short' %} wallets

## Wrap it up

In the end, verification findings are reported. All wallets that fail at any of the above
questions are considered high risk. The community may contact the wallet
provider, try to find out what went wrong and report on the respective
communication.

In the end, even if a wallet is concluded not to be trusted, this doesn't mean the
wallet was out to steal your coins. It just means that with enough criminal energy this wallet could theoretically steal all the funds
of all its users.