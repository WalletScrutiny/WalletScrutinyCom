---
name: Investigate Wallet Template
about: This template is used to create issues that serve to investigate a new wallet
  we have not investigated before
title: Investigate wallet ""
labels: ''
assignees: ''

---

Check the following items.

- [ ] Determine if the wallet claims to be custodial or not.

If the wallet is custodial, we do not investigate further.

- [ ] Investigate if the wallet claims to be verifiable.

It might advertise it. It might have documentation on how to build and verify it. Absence of a claim does not mean it's not possible to verify the build but it's worth noting for our readers.

- [ ] Try to verify the build found on the playstore.

If the wallet claims to be verifiable, we are strict and test their instructions.

- [ ] Document further observations.

We do **not** provide deep code reviews at this stage but anything we notice to be relevant to the user's security, we will bring up in our reports.
