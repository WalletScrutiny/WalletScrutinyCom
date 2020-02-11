---
layout: archive
title: "Donate"
permalink: /donate/
---


WalletScrutiny was launched by Leo Wandersleb with some contributions by
Kristina Tezieva and Matthew Lamb. All the work done can be followed in our
[public repository on GitLab](https://gitlab.com/walletscrutiny/walletScrutinyCom).

We all have other jobs and do this in our free time but we hope to be able to
work on this project full time, so we can expand it to more apps, app classes,
platforms and markets.

While we now started with the test for reproducibility of Android Bitcoin wallets, we
hope to also look into

* incentives for actual code reviews
* iPhone/Mac/Windows/Linux
* alt-coins/chat apps/privacy apps
* real time alerts

If you like what we are doing, you can donate below using traditional or
lightning Bitcoin wallets.

<script type="text/javascript">
var orderId = Math.random().toString(36).substring(7);

function update() {
  var aspect = document.getElementsByName('aspect')[0].value
  document.getElementsByName('checkoutDesc')[0].value = "Donation WalletScrutiny - " + aspect
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
  <input type="hidden" name="checkoutDesc" value="Donation WalletScrutiny - " />
  <input type="hidden" name="serverIpn" value="https://walletscrutiny.com/invoiceCB">
  <input type="hidden" name="browserRedirect" value="https://walletscrutiny.com/thanks/">
  <div>
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
    <select name="aspect" onChange="update()">
      <option value="Any" selected>Select aspect you want to support with your donation!</option>
      <option value="Wallets">More Android Wallets</option>
      <option value="FastUpdates">More frequent updates</option>
      <option value="Ads">Run Ad campaigns</option>
      <option value="OS">More operating systems (iPhone, Windows, Mac)</option>
      <option value="CodeReview">Actual code reviews</option>
      <option value="Coins">Non-Bitcoin wallets</option>
      <option value="Alerts">Alerts when issues are found</option>
      <option value="OtherApps">Non-Wallet apps</option>
    </select>
  </div>
  <input type="image" class="submit" name="submit" src="https://pos.btcpay.nz/img/paybutton/pay.svg" style="width:209px" alt="Pay with BtcPay, Self-Hosted Bitcoin Payment Processor">
</form>

The above donation form only allows anonymous donations. If you want to sponsor
the project or wan personal recognition for your contribution, please
contact the developers via <a href="mailto:info@WalletScrutiny.com">mail</a>, [GitLab](https://gitlab.com/walletscrutiny/walletScrutinyCom) or [Reddit](https://www.reddit.com/r/WalletScrutiny/).