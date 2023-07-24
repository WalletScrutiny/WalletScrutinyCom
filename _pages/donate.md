---
layout: archive
title: "Help WalletScrutiny improve wallet security"
permalink: /donate/
---

Leo Wandersleb founded WalletScrutiny, along with contributions by Kristina Tezieva, Matthew Lamb, and others. While this is a free-time project for all of us, we hope to work on WalletScrutiny full-time to expand it to more apps, app classes, platforms, and markets. Currently, we only cover testing for reproducibility on the App Store, Google Play Store, and bitcoin hardware wallets. In addition, we hope to add: 

* incentives for actual code reviews
* Mac/Windows/Linux
* alt-coins/chat apps/privacy apps
* real time alerts

Follow our [public GitLab repository](https://gitlab.com/walletscrutiny/walletScrutinyCom). If you like what you see, please donate using traditional or Lightning bitcoin wallets below.

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
table, table *{border:0; }
@media (max-width:500px){
  tr {
  display: grid; 
  grid-template: 1fr auto / 1fr auto; 
  font-size: 1rem; 
  padding: 10px 0; 
  gap: 2px; 
  }
  td{
    padding: 0; 
  }
  td:first-of-type{
    grid-column: 1/3; 
    grid-row: 1/2; 
    font-weight: 500; 
  }
  td:nth-of-type(2){
    grid-column: 1/2; 
    grid-row: 2/3; 
    font-weight: 400; 
  }
  td:last-of-type{
    grid-column: 2/3; 
    grid-row: 2/3; 
    font-weight: 400; 
  }
  th{
    display:none; 
  }
}
</style>
<script type="text/javascript">
function updateAspect(radioBtn) {
  document.getElementsByName('checkoutDesc')[0].value = 'Donation WalletScrutiny - ' + radioBtn.value
}

function update() {
  var amount = document.getElementById('btcpay-input-price_7826565').value
  if (!amount.match(/^[\.0-9]+$/)) {return
  }
}
</script>
<form name="payForm" method="POST" action="https://pos.btcpay.nz/api/v1/invoices" class="btcpay-form btcpay-form--block" style="display:flex">
  <input type="hidden" name="storeId" value="7WhWPWK41yURwAUoY8SiAsrvVzkSXyndHfLJKX2aanAK" />
  <input type="hidden" name="orderId" value="" />
  <input type="hidden" name="checkoutDesc" value="Donation WalletScrutiny - Any" />
  <!-- input type="hidden" name="serverIpn" value="https://walletscrutiny.com/invoiceCB" -->
  <input type="hidden" name="browserRedirect" value="https://walletscrutiny.com/thanks/">
  <div>
<div class="spacer"></div>

  <h2>Make a donation</h2>

    <p>Help us understand your donation. Let us know what you want to see more of from us.</p>
    <input onChange="updateAspect(this)" type="radio" id="aspect0" name="aspect" value="Any"><label for="aspect0">Anything</label><br>
    <input onChange="updateAspect(this)" type="radio" id="aspect1" name="aspect" value="MoreWallets"><label for="aspect1">More Wallets</label><br>
    <input onChange="updateAspect(this)" type="radio" id="aspect2" name="aspect" value="FrequentUpdates"><label for="aspect2">More frequent updates</label><br>
    <input onChange="updateAspect(this)" type="radio" id="aspect4" name="aspect" value="MoreOS"><label for="aspect4">More operating systems (Windows, Mac)</label><br>
    <input onChange="updateAspect(this)" type="radio" id="aspect5" name="aspect" value="CodeReviews"><label for="aspect5">Actual code reviews</label><br>
    <input onChange="updateAspect(this)" type="radio" id="aspect6" name="aspect" value="NonBitcoinWallets"><label for="aspect6">Non-Bitcoin wallets</label><br>
    <input onChange="updateAspect(this)" type="radio" id="aspect7" name="aspect" value="Alerts"><label for="aspect7">Alerts when issues are found</label><br>
    <input onChange="updateAspect(this)" type="radio" id="aspect8" name="aspect" value="NonWalletApps"><label for="aspect8">Non-Wallet apps</label><br>

  </div>
  <div style="text-align:center">
  <h4>Enter an amount

    <select name="currency" style="display:inline">
      <option value="USD" selected>USD</option>
      <option value="GBP">GBP</option>
      <option value="EUR">EUR</option>
      <option value="BTC">BTC</option>
    </select></h4>
    <input id='btcpay-input-price_7826565' name="price" type="text"
     onInput="update()" placeholder="Choose amount" />

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

* Due to [this bug](https://github.com/btcpayserver/btcpayserver/issues/1343) in BtcPay-Server, at least 5mBTC are missing from the list above. Sorry for that.
* 1BTC = 1 000mBTC = 1 000 000µBTC = 100 000 000sat
* Amounts are rounded to the nearest zero. 
* Timestamps aren’t specific to the minute so that blockchain analysis companies can’t easily identify on-chain transactions.

<script src="/assets/js/review.js"></script>
