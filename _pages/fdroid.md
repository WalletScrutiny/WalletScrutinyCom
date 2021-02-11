---
permalink: /fdroid/
title: "F-Droid wallets"
author_profile: false
---

{% include base_path %}

<!-- div class="page-section">
<p>
  WalletScrutiny started out looking only into Google Play. Mobile wallets are the
  most used wallets and Android the most used among mobile wallets but looking
  into iPhone wallets was high on the list from the start.
</p><p>
  For Android, the process of reproducing builds was relatively clear and some
  apps did this before we started the project. For iPhone this was not the case.
  Reproducibility of iPhone apps was an open question.
</p><p>
  One year passed. We asked around. Nobody could reproduce any iPhone app.
</p><p>
  At this point we shift the burden of proof onto the providers. If you want
  people to trust your app, explain how it can be audited. We will move on in
  the meantime and list iPhone apps with an empty reproducible section until
  then.
</p><p>
  Else, <a title="our methodology"
  href="{{ base_path }}/methodology/">our methodology</a> is the same as for
  Android wallets.
</p>
</div -->


<h2 class="section-label">All wallets ordered by verifiability</h2>

{% assign platform = "fdroid" %}
{% assign verdicts = "reproducible,nonverifiable,custodial,wip,nobtc,obfuscated,defunct,nowallet" | split: "," %}
{% assign selectedVerdict = "reproducible" %}
{% assign showVerdictFilter = false %}
{% include list_of_wallets.html %}
