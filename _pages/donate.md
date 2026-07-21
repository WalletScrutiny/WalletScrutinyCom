---
layout: archive
title: "Help WalletScrutiny improve wallet security"
permalink: /donate/
---

<div class="info-landing-page guide-page donate-page">

<div class="contribute-hero">
  <p class="contribute-lead">
    Leo Wandersleb founded WalletScrutiny, along with contributions by Kristina Tezieva, Matthew Lamb, and others. While
    this is a free-time project for all of us, we hope to work on WalletScrutiny full-time to expand it to more apps, app
    classes, platforms, and markets.
  </p>
</div>

<section class="guide-section" id="about">
  <p>Currently, we only cover testing for reproducibility on the Google Play Store, Linux
  and Mac desktop apps, and bitcoin hardware wallets. In addition, we hope to add:</p>

  <ul>
    <li>incentives for actual code reviews</li>
    <li>App Store / Windows build verifications</li>
    <li>alt-coins/chat apps/privacy apps</li>
    <li>real time alerts</li>
  </ul>

  <p>Follow our <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom">public GitLab repository</a>. If you like what you see,
  please donate using traditional or Lightning bitcoin wallets below.</p>
</section>

<section class="donate-form-panel" id="donate">
  <h2>Make a donation</h2>

  <form name="payForm" method="POST" action="https://pos.btcpay.nz/api/v1/invoices"
    class="btcpay-form btcpay-form--block">
    <input type="hidden" name="storeId" value="7WhWPWK41yURwAUoY8SiAsrvVzkSXyndHfLJKX2aanAK" />
    <input type="hidden" name="orderId" value="" />
    <input type="hidden" name="checkoutDesc" value="Donation WalletScrutiny" />
    <input type="hidden" name="browserRedirect" value="https://walletscrutiny.com/thanks/">

    <div class="donate-form-fields">
      <div class="donate-form-row">
        <input id="btcpay-input-price_7826565" name="price" type="text" onInput="update()" placeholder="Enter an amount" />
        <select name="currency">
          <option value="USD" selected>USD</option>
          <option value="GBP">GBP</option>
          <option value="EUR">EUR</option>
          <option value="BTC">BTC</option>
        </select>
      </div>
      <button class="submit" name="submit" alt="Pay with BtcPay, Self-Hosted Bitcoin Payment Processor">Donate</button>
    </div>
  </form>
</section>

<section class="guide-section" id="sponsor">
  <p>The above donation form only allows anonymous donations. If you want to sponsor
  the project or receive recognition for your contribution, please
  contact the developers via <a href="mailto:info@WalletScrutiny.com">email</a>,
  <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom">GitLab</a>,
  <a href="https://discord.gg/yCNdcSJw9k" target="_blank" rel="noopener noreferrer">Discord</a>, or
  <a href="https://njump.me/npub1j9kttlc86w63emmldd4h74rekyqpksqup6p9trhp5gjsf374qlyszvuswx" target="_blank" rel="noopener noreferrer">Nostr</a>.</p>
</section>

<section class="guide-section" id="recent-donations">
  {% include donationSummary.html %}

  <p class="note">Timestamps aren't specific to the minute so that blockchain analysis companies can't easily identify on-chain transactions.</p>
</section>

</div>

<script type="text/javascript">
  function update() {
    let input = document.getElementById('btcpay-input-price_7826565');
    input.value = input.value.replace(/\D/g, '');
  }
</script>

<script src="/assets/js/review.js"></script>
