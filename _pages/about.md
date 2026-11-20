---
layout: archive
title: "Transparency first, second, and third."
permalink: /about/
author_profile: true
---

<div class="info-landing-page guide-page about-page">

<div class="about-hero">
  <p class="about-tagline">We get to know wallets. Here's where you get to know us.</p>
  <p class="about-lead">
    The WalletScrutiny team is a small, non-profit collection of privacy and security-focused engineers helping everyone from bitcoin newcomers to full-fledged cypherpunks make informed decisions about how they store and send their bitcoin. So it's only fitting to be as transparent about ourselves as we encourage wallet developers to be.
  </p>
  <p class="about-lead">
    To better understand our methodology, check out our <a href="/methodology/?faq">FAQ</a> or the podcast appearances below.
  </p>
</div>

{% include press.html %}

<section class="about-section about-section--team" aria-labelledby="about-team-heading">
  <h2 id="about-team-heading" class="about-section__title">
    <span class="about-section__title-icon" aria-hidden="true">{% include icon.html name="user-group" %}</span>
    Meet our core team
  </h2>

  <div class="about-team">
    {% assign team = "lw,dg,ml,em,ts" | split: "," %}
    {% for a in team %}
      {% assign author = site.authors | find: 'short', a %}
      {% assign avatar = author.avatar %}
      {% if avatar contains '://' %}
        {% assign prefix = '' %}
      {% elsif avatar.size > 0 %}
        {% assign prefix = "/images/" %}
      {% else %}
        {% assign prefix = "/images/avatarPlaceholder.jpg" %}
      {% endif %}

      <a href="{{ author.url }}" class="about-team-member" style="--team-index: {{ forloop.index }};">
        <span class="about-team-member__avatar" style="background-image:url({{ prefix }}{{ author.avatar }});"></span>
        <span class="about-team-member__name">{{ author.name }}</span>
        <span class="about-team-member__role">{{ author.role }}</span>
      </a>
    {% endfor %}
  </div>
</section>
<section class="about-section about-section--sponsors" aria-labelledby="about-sponsors-heading">
  <h2 id="about-sponsors-heading" class="about-section__title">
    <span class="about-section__title-icon" aria-hidden="true">{% include icon.html name="handshake" %}</span>
    Proudly sponsored by
  </h2>

  <div class="about-sponsors">
    <a class="about-sponsor-card" href="https://spiral.xyz/#grants" target="_blank" rel="noopener noreferrer" title="Spiral">
      <span class="about-sponsor-card__logo about-sponsor-card__logo--spiral" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 -15 679 679">
          <defs>
            <linearGradient id="about-spiral-gradient" x1="81.36" y1="311.35" x2="541.35" y2="311.35" gradientUnits="userSpaceOnUse">
              <stop offset="0.18" stop-color="blue"></stop>
              <stop offset="1" stop-color="#f0f"></stop>
            </linearGradient>
          </defs>
          <path fill="url(#about-spiral-gradient)" d="M326.4,572.09C201.2,572.09,141,503,112.48,445,84.26,387.47,81.89,330.44,81.69,322.31c-4.85-77,41-231.78,249.58-271.2a28.05,28.05,0,0,1,10.41,55.13c-213.12,40.28-204.44,206-204,213,0,.53.06,1.06.07,1.6C137.9,328.74,142.85,516,326.4,516,394.74,516,443,486.6,470,428.63c24.48-52.74,19.29-112.45-13.52-155.83-22.89-30.27-52.46-45-90.38-45-34.46,0-63.47,9.88-86.21,29.37A91.5,91.5,0,0,0,248,322.3c-1.41,25.4,7.14,49.36,24.07,67.49C287.27,406,305,413.9,326.4,413.9c27.46,0,45.52-9,53.66-26.81,8.38-18.3,3.61-38.93-.19-43.33-9.11-10-18.69-13.68-22.48-13-2.53.43-5.78,4.61-8.48,10.92a28,28,0,0,1-51.58-22c14.28-33.44,37.94-42,50.76-44.2,24.78-4.18,52.17,7.3,73.34,30.65s25.51,68.55,10.15,103.22C421.54,432,394.52,470,326.4,470c-36.72,0-69.67-14.49-95.29-41.92C203.64,398.68,189.77,360,192,319.19a149.1,149.1,0,0,1,51.31-104.6c33.19-28.45,74.48-42.87,122.71-42.87,55.12,0,101.85,23.25,135.12,67.23,45.36,60,52.9,141.71,19.66,213.3C495.45,506.92,441.12,572.09,326.4,572.09Z"></path>
        </svg>
      </span>
      <span class="about-sponsor-card__name">Spiral</span>
    </a>
    <a class="about-sponsor-card" href="https://hrf.org/devfund2023q1" target="_blank" rel="noopener noreferrer" title="Human Rights Foundation">
      <span class="about-sponsor-card__logo">
        <img src="/images/sponsors/hrf.png" alt="" width="100" height="100" loading="lazy">
      </span>
      <span class="about-sponsor-card__name">Human Rights Foundation</span>
    </a>
  </div>

  <p class="about-sponsors__cta">
    <a href="mailto:info@WalletScrutiny.com">Contact us</a> for sponsorship opportunities.
    With your help, we can make bitcoin even more usable and secure.
  </p>
</section>

</div>

<style type="text/css">
.about-hero {
  text-align: center;
  margin-bottom: 2.5rem;
}
.about-page .about-tagline {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0 0 1rem;
}
.about-page .about-lead {
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.65;
  max-width: 720px;
  margin: 0 auto 1rem;
  color: var(--neutral-2);
}
.about-page .about-lead:last-child {
  margin-bottom: 0;
}
.about-page h2 {
  text-align: center;
  font-size: 24px;
}

.about-page .about-section {
  margin-bottom: 2.75rem;
}
.about-page .about-section--team {
  margin-top: 2rem;
}
.about-page .about-section--sponsors {
  text-align: center;
  padding: 2rem 1.5rem;
  border-radius: 16px;
  background: var(--accent-50);
}
.about-page .about-section__title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin: 0 0 0.65rem;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.3;
  text-align: center;
}
.about-page .about-section__title-icon {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--accent);
  color: var(--permanent-white);
  font-size: 0.95rem;
  flex-shrink: 0;
}
.about-page .about-team {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}
.about-page .about-team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  width: 168px;
  padding: 1.15rem 0.85rem;
  border-radius: 14px;
  box-shadow: 0 0 0 1px var(--shadow-3);
  background: var(--body);
  text-align: center;
  text-decoration: none;
  color: var(--text);
  animation: intro 0.5s both;
  animation-delay: calc(0.1s + (var(--team-index, 1) * 0.06s));
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.about-page .about-team-member:hover,
.about-page .about-team-member:focus-visible {
  box-shadow: 0 0 0 2px var(--accent), 0 12px 28px var(--shadow-1);
  transform: translateY(-4px);
  text-decoration: none;
  color: var(--text);
}
.about-page .about-team-member:hover .about-team-member__avatar,
.about-page .about-team-member:focus-visible .about-team-member__avatar {
  transform: scale(1.06);
}
.about-page .about-team-member:hover .about-team-member__name,
.about-page .about-team-member:focus-visible .about-team-member__name {
  color: var(--accent-text);
}
.about-page .about-team-member__avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(/images/avatarPlaceholder.jpg);
  box-shadow: 0 0 0 3px var(--accent-50), 0 0 0 4px var(--accent);
  transition: transform 0.25s ease;
}
.about-page .about-team-member__name {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  transition: color 0.15s ease;
}
.about-page .about-team-member__role {
  font-size: 0.88rem;
  line-height: 1.35;
  color: var(--neutral-3);
  font-weight: 400;
}
.about-page .about-sponsors {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 1.25rem;
}
.about-page .about-sponsor-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: min(100%, 220px);
  padding: 1.35rem 1rem;
  border-radius: 14px;
  box-shadow: 0 0 0 1px var(--shadow-3);
  background: var(--body);
  text-decoration: none;
  color: var(--text);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.about-page .about-sponsor-card:hover,
.about-page .about-sponsor-card:focus-visible {
  box-shadow: 0 0 0 1px var(--accent), 0 10px 24px var(--shadow-1);
  transform: translateY(-3px) scale(1.02);
  text-decoration: none;
  color: var(--text);
}
.about-page .about-sponsor-card__logo {
  display: grid;
  place-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
.about-page .about-sponsor-card__logo img,
.about-page .about-sponsor-card__logo svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.about-page .about-sponsor-card__logo--spiral {
  background-color: rgb(27, 20, 100);
  padding: 12px;
  box-sizing: border-box;
}
.about-page .about-sponsor-card__name {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
  text-align: center;
}
.about-page .about-sponsors__cta {
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.55;
  color: var(--neutral-2);
  font-weight: 400;
}

@media (prefers-reduced-motion: reduce) {
  .about-page .about-team-member,
  .about-page .about-sponsor-card {
    animation: none;
    transition: none;
  }
}
</style>
