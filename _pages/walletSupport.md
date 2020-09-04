---
permalink: /walletSupport/
title: "Wallet Support"
---

{% include base_path %}

The team behind WalletScrutiny knows a lot about wallets and as not all wallet
providers have good support teams, we thought we could offer our expertise to
help users that are stuck with their Bitcoins.

# Security

When accepting help from our or any other service, please be aware:

**Never ever ever share your backup** or any private key material. Wallet
Support will never ask you for your backup words or your passphrase or your
PIN or your private keys. If an agent does so, please report him immediately!
And if your case is special ... no, your case is not special. Leo Wandersleb
worked for a big wallet provider for five years and knows no case of ever any
user having shared a private key or backup with the support team.

<script type="text/javascript">
  var orderId = "c" + (100000000000 * Math.random()).toFixed();
  window.addEventListener("load", async function () {
    $("[name='orderId']")[0].value = orderId;
    function getOnlineTawk_API() {
      return new Promise(resolve => {
        if (window.Tawk_API && window.Tawk_API.getStatus() == "online") {
          resolve(window.Tawk_API)
        } else {
          setTimeout(function() {
            resolve(getOnlineTawk_API())
          }, 100)
        }
      })
    };
    var Tawk_API = await getOnlineTawk_API();
    if(Tawk_API.getStatus() == "online") {
      console.log("adding tag " + orderId)
      Tawk_API.addTags([orderId], function(e) {
        console.log("Error: " + e)
      });
      Tawk_API.setAttributes({
        orderId : 'new'
      }, function(e){
        console.log("Error: " + e)
      });
    } else alert("Tawk not loaded!")
  })
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
<input type="hidden" name="storeId" value="2KNSmcv9UpkYPmCnn4iR5McDR4kkNnhiFyC3grxPSZwx" />
<input type="hidden" name="orderId" value="" />
<input type="hidden" name="checkoutDesc" value="Wallet Support by WalletScrutiny.com" />
<!-- input type="hidden" name="serverIpn" value="https://walletscrutiny.com/invoiceCB" -->
<!-- input type="hidden" name="browserRedirect" value="https://walletscrutiny.com/thanks/" -->
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
