---
layout: archive
title: "Donate"
permalink: /donate/
---


WalletScrutiny was launched by Leo Wandersleb with some contributions by
Kristina Tezieva, Matthew Lamb and others. All the work done can be followed in our
[public repository on GitLab](https://gitlab.com/walletscrutiny/walletScrutinyCom).

We all have other jobs and do this in our free time but we hope to be able to
work on this project full time, so we can expand it to more apps, app classes,
platforms and markets.

While we so far only cover the test for reproducibility of Play Store, App Store
and hardware Bitcoin wallets, we
hope to also look into

* incentives for actual code reviews
* Mac/Windows/Linux
* alt-coins/chat apps/privacy apps
* real time alerts

If you like what we are doing, you can donate below using traditional or
lightning Bitcoin wallets.

<style>
label {
  display: inline;
  margin-left: 10px;
}

form br {
  display: inline;
}
</style>
<script type="text/javascript">
function updateAspect(radioBtn) {
  document.getElementsByName('checkoutDesc')[0].value = 'Donation WalletScrutiny - ' + radioBtn.value
}

function update() {
  var amount = document.getElementById('btcpay-input-price_7826565').value
  if (!amount.match(/^[\.0-9]+$/)) {
    var showAlert = 'block'
  } else {
    var showAlert = 'none'
  }
  document.getElementById('enterAmount').style.display = showAlert
}
</script>
<form name="payForm" method="POST" action="https://pos.btcpay.nz/api/v1/invoices" class="btcpay-form btcpay-form--block" style="display:flex">
  <input type="hidden" name="storeId" value="7WhWPWK41yURwAUoY8SiAsrvVzkSXyndHfLJKX2aanAK" />
  <input type="hidden" name="orderId" value="" />
  <input type="hidden" name="checkoutDesc" value="Donation WalletScrutiny - Any" />
  <!-- input type="hidden" name="serverIpn" value="https://walletscrutiny.com/invoiceCB" -->
  <input type="hidden" name="browserRedirect" value="https://walletscrutiny.com/thanks/">
  <div>
    <p>Please select aspect you want to support with your donation!:</p>
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
    <input id='btcpay-input-price_7826565' name="price" type="text"
      style="width: 8em;" onInput="update()" placeholder="Amount" />
    <select name="currency" style="display:inline">
      <option value="USD" selected>USD</option>
      <option value="GBP">GBP</option>
      <option value="EUR">EUR</option>
      <option value="BTC">BTC</option>
    </select>
  </div>
  <div id="enterAmount" style="color:red;text-align:center">(please enter amount)</div>
  <input type="image" class="submit" name="submit" src="https://pos.btcpay.nz/img/paybutton/pay.svg" style="width:209px" alt="Pay with BtcPay, Self-Hosted Bitcoin Payment Processor">
</form>

The above donation form only allows anonymous donations. If you want to sponsor
the project or want personal recognition for your contribution, please
contact the developers via <a href="mailto:info@WalletScrutiny.com">mail</a>,
[GitLab](https://gitlab.com/walletscrutiny/walletScrutinyCom) or
[Reddit](https://www.reddit.com/r/WalletScrutiny/).

{% include donationSummary.html %}

* Due to [this bug](https://github.com/btcpayserver/btcpayserver/issues/1343) in
  BtcPay-Server, at least 5mBTC are missing from the list above. Sorry for that.
* 1BTC = 1 000mBTC = 1 000 000µBTC = 100 000 000sat
* Amounts are rounded and timestamps only dates, to not make it trivial for
  Blockchain analysis companies to identify donations on chain

<script src="/assets/js/review.js"></script>
