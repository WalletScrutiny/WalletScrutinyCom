


## Why are there no reproducible apps on Apple App Store?

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

### Further considerations

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