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

{% include about/meetTheTeam.html %}
{% include about/sponsors.html %}

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
