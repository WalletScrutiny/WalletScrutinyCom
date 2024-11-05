---
layout: archive
title: "Help WalletScrutiny improve wallet security"
permalink: /donate/
---

<style>
  label {
    display: inline;
    margin-left: 10px;
  }

  form br {
    display: inline;
  }

  input[type="radio"] {
    appearance: none;
    background-color: var(--body);
    margin: 0;
    font: inherit;
    color: var(--accent-text);
    width: 1rem;
    height: 1rem;
    border: 0.15em solid var(--accent-text);
    border-radius: 50%;
    transform: translateY(2px);
    display: inline-grid;
    place-content: center;
    position: relative;
  }

  input[type="radio"]::before {
    content: "";
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--accent-text);
    background-color: var(--accent-text);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    transform-origin: center;
  }

  input[type="radio"]:checked::before {
    transform: scale(.65);
  }

  label {
    margin-bottom: 0;
    line-height: 1;
    display: inline-block;
    padding-bottom: 10px;
    color: var(--text);
    font-weight: 400;
  }

  h4 {
    font-size: 1rem;
    text-align: left;
    margin-top: 20px;
    margin-bottom: 0;
  }

  #btcpay-input-price_7826565 {
    font-size: 1rem;
    padding: 11px;
    border: 0;
    background: var(--neutral-5);
    box-shadow: 0 0 0 1px var(--neutral-6);
    font-weight: 400;
    border-radius: 3px;
    margin-right: 5px;
  }

  select[name="currency"] {
    font-size: 1rem;
    padding: 11px;
    border: 0;
    background: var(--neutral-5);
    box-shadow: 0 0 0 1px var(--neutral-6);
    font-weight: 400;
    border-radius: 3px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
  }

  .submit {
    padding: 10px;
    text-align: center;
    width: 100%;
    border-radius: 3px;
    background-color: var(--accent-text);
    color: var(--permanent-white);
    border: 0;
  }

  .submit::active {
    background-color: var(--accent);
  }

  table,
  table * {
    border: 0;
  }

  @media (max-width:500px) {
    tr {
      display: grid;
      grid-template: 1fr auto / 1fr auto;
      font-size: 1rem;
      padding: 10px 0;
      gap: 2px;
    }

    td {
      padding: 0;
    }

    td:first-of-type {
      grid-column: 1/3;
      grid-row: 1/2;
      font-weight: 500;
    }

    td:nth-of-type(2) {
      grid-column: 1/2;
      grid-row: 2/3;
      font-weight: 400;
    }

    td:last-of-type {
      grid-column: 2/3;
      grid-row: 2/3;
      font-weight: 400;
    }

    th {
      display: none;
    }
  }
</style>

<script type="text/javascript">
  function update() {
    let input = document.getElementById('btcpay-input-price_7826565');
    input.value = input.value.replace(/\D/g, '');
  }
</script>

Leo Wandersleb founded WalletScrutiny, along with contributions by Kristina Tezieva, Matthew Lamb, and others. While
this is a free-time project for all of us, we hope to work on WalletScrutiny full-time to expand it to more apps, app
classes, platforms, and markets. Currently, we only cover testing for reproducibility on the App Store, Google Play
Store, and bitcoin hardware wallets. In addition, we hope to add:

* incentives for actual code reviews
* Mac/Windows/Linux
* alt-coins/chat apps/privacy apps
* real time alerts

Follow our [public GitLab repository](https://gitlab.com/walletscrutiny/walletScrutinyCom). If you like what you see,
please donate using traditional or Lightning bitcoin wallets below.

<h2>Make a donation</h2>

<form name="payForm" method="POST" action="https://pos.btcpay.nz/api/v1/invoices"
  class="btcpay-form btcpay-form--block" style="display:flex">
  <input type="hidden" name="storeId" value="7WhWPWK41yURwAUoY8SiAsrvVzkSXyndHfLJKX2aanAK" />
  <input type="hidden" name="orderId" value="" />
  <input type="hidden" name="checkoutDesc" value="Donation WalletScrutiny" />
  <input type="hidden" name="browserRedirect" value="https://walletscrutiny.com/thanks/">

  <div style="text-align:center">
    <div class="spacer"></div>
    <div style="display: flex; justify-content: center; align-items: center; gap: 5px;">
      <input id='btcpay-input-price_7826565' name="price" type="text" onInput="update()" placeholder="Enter an amount" />
      <select name="currency">
        <option value="USD" selected>USD</option>
        <option value="GBP">GBP</option>
        <option value="EUR">EUR</option>
        <option value="BTC">BTC</option>
      </select>
    </div>
    <button class="submit" name="submit" alt="Pay with BtcPay, Self-Hosted Bitcoin Payment Processor">Pay</button>
  </div>
</form>

<div class="spacer"></div>

The above donation form only allows anonymous donations. If you want to sponsor
the project or receive recognition for your contribution, please
contact the developers via <a href="mailto:info@WalletScrutiny.com">email</a>,
[GitLab](https://gitlab.com/walletscrutiny/walletScrutinyCom) or
[Reddit](https://www.reddit.com/r/WalletScrutiny/).

{% include donationSummary.html %}

Timestamps aren’t specific to the minute so that blockchain analysis companies can’t easily identify on-chain transactions.

<script src="/assets/js/review.js"></script>