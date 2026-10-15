---
layout: archive
title: "WalletScrutiny Android app"
permalink: /androidApp/
author_profile: false
# Same screenshots as the Zapstore listing (zapstore-assets/ in the app repo),
# resized to 720x1600 (images/androidApp/) and 180x400 (images/androidApp/thumbs/).
screenshots:
  - file: screenshot-1.webp
    alt: "Your wallets: the installed wallets with their verdicts, such as Reproducible or Not reproducible, and the number of verifiers"
    caption: "The wallets installed on your phone, each with the verdict for the exact version you run."
  - file: screenshot-2.webp
    alt: "Wallet details for ZEUS Wallet: the verifications for this version with their results, and the verdicts of every version"
    caption: "The verifications for the installed version, their results, and how older versions did."
  - file: screenshot-3.webp
    alt: "Settings: upload only over Wi-Fi, background monitoring, app language and share logs"
    caption: "Uploads can be limited to Wi-Fi; monitoring runs in the background."
  - file: screenshot-4.webp
    alt: "Info and FAQ: what the app does, what reproducible means and how the check works"
    caption: "What the app does, what reproducible means and how the check works."
  - file: screenshot-5.webp
    alt: "About: WalletScrutiny.com checks whether the wallet apps people actually run can be rebuilt from their public source code"
    caption: "Free software under the MIT licence, with links to the website and source code."
---

{% assign ws_app_repo = "https://gitlab.com/walletscrutiny/walletscrutinyandroid" %}
{% assign first_shot = page.screenshots | first %}

<div class="info-landing-page guide-page android-app-page">

<div class="guide-hero">
  <p class="guide-lead">
    The app hashes the wallets installed on your phone and matches them against
    the verifications on this site, so you know whether the exact build you run
    was reproduced from its source code.
  </p>
  <p class="guide-lead">
    A verified version number is not enough: the file on your phone can differ
    from the one we tested. Builds nobody has checked yet are sent to our build
    server, so your update becomes a verification for everyone.
  </p>
</div>

<div class="guide-actions">
  <a href="https://zapstore.dev/apps/com.walletscrutiny.ng_app" class="btn btn-medium btn-success" target="_blank" rel="noopener noreferrer">{% include icon.html name="mobile-screen" %} Get it on Zapstore</a>
  <a href="{{ ws_app_repo }}/-/releases/permalink/latest" class="btn btn-medium btn-success" target="_blank" rel="noopener noreferrer">{% include icon.html name="gitlab" %} Download from GitLab</a>
</div>

<p class="android-app-links">
  <a href="{{ ws_app_repo }}" target="_blank" rel="noopener noreferrer">Source code</a>
</p>

<div class="android-app-showcase">
  <figure class="android-app-showcase-main">
    <img id="android-app-shot" src="{{ site.baseurl }}/images/androidApp/{{ first_shot.file }}" width="720" height="1600" alt="{{ first_shot.alt }}">
    <figcaption id="android-app-shot-caption">{{ first_shot.caption }}</figcaption>
  </figure>
  <div class="android-app-showcase-thumbs" aria-label="Screenshots of the app">
    {% for shot in page.screenshots %}
    <a class="android-app-thumb{% if forloop.first %} is-active{% endif %}" href="{{ site.baseurl }}/images/androidApp/{{ shot.file }}" data-alt="{{ shot.alt }}" data-caption="{{ shot.caption }}"{% if forloop.first %} aria-current="true"{% endif %}>
      <img src="{{ site.baseurl }}/images/androidApp/thumbs/{{ shot.file }}" width="180" height="400" alt="{{ shot.alt }}">
    </a>
    {% endfor %}
  </div>
</div>

</div>

<script>
  (function () {
    const shot = document.getElementById('android-app-shot');
    const caption = document.getElementById('android-app-shot-caption');
    const thumbs = Array.from(document.querySelectorAll('.android-app-thumb'));
    if (!shot || !caption || !thumbs.length) return;

    thumbs.forEach(thumb => {
      // Without JavaScript the thumbnail links open the full-size image.
      thumb.addEventListener('click', event => {
        event.preventDefault();
        shot.src = thumb.href;
        shot.alt = thumb.dataset.alt;
        caption.textContent = thumb.dataset.caption;
        thumbs.forEach(other => {
          const active = other === thumb;
          other.classList.toggle('is-active', active);
          if (active) other.setAttribute('aria-current', 'true');
          else other.removeAttribute('aria-current');
        });
      });
      // Start fetching the big image before the click so the swap is instant.
      thumb.addEventListener('pointerenter', () => { new Image().src = thumb.href; }, { once: true });
    });
  })();
</script>
