---
permalink: /walletSupport/
title: "Wallet Support"
---

{% include base_path %}

The team behind WalletScrutiny knows a lot about wallets and as not all wallet
providers have good support teams, we thought we could offer our expertise to
help users that are stuck with their Bitcoins.

<div style="border: solid 3px black; border-radius: 20px; background: #fdb5b5;
margin-bottom: 1em">
<div style="margin: 1em">
<h1>Security</h1>

<p>When accepting help from our or any other service, please be aware:</p>

<p><strong>Never ever share your backup</strong> or any private key
material with any third party. Our Wallet
Support will never ask you for your backup words or your passphrase or your
PIN or your private keys. If an agent does so, please report him immediately!
And if your case is special? No, your case is not special. We have many years of
experience with wallet support and not once was a user sharing a private key or
backup with the support team.</p>
</div>
</div>

# How we work

You can reach us via the chat here on this site and we will try our best to help
but we have our day jobs and families to support, too. Our dream is to grow this
offering so all can get quick, top quality support when they have trouble with
any Bitcoin wallet but for that, we have to charge a fee. At this time, we do
not charge a fixed fee or a percentage of funds recovered but we will attend to
those first, that paid us the most. Should we not get to help you, you will get
your payment reimbursed. The idea is that you make up your mind about what it
would be worth if we could help you with your issue. You then pay us 20% of that
up front to get our attention. Once your issue was resolved, you would be
expected to pay the remaining 80%.

Let's say you have a backup but the wallet stopped working. You think there is
$500 in the wallet, so you decide recovering that would be worth $200. You pay
20% or $40 via the form below. If we manage to help you restore your $500, you
do a second payment over $160. If we worked on your case but could not help you,
you do lose the $40. If we do not get to look into your case within 24h after
your payment confirmed, you get your $40 back.

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
  function update(id) {
    var amount = document.getElementById('btcpay-input-price_7826565_' + id).value
    if (!amount.match(/^[\.0-9]+$/)) {
      var showAlert = 'block'
    } else {
      var showAlert = 'none'
    }
    document.getElementById('enterAmount').style.display = showAlert
    switch (id) {
      case 1:
        document.getElementById('btcpay-input-price_7826565_2').value = amount * 4
        document.getElementById('btcpay-input-price_7826565_3').value = amount * 5
        break
      case 2:
        document.getElementById('btcpay-input-price_7826565_1').value = amount / 4
        document.getElementById('btcpay-input-price_7826565_3').value = amount / 4 * 5
        break
      case 3:
        document.getElementById('btcpay-input-price_7826565_1').value = amount / 5
        document.getElementById('btcpay-input-price_7826565_2').value = amount / 5 * 4
        break
    }
  }
</script>

<form name="payForm" method="POST" action="https://pos.btcpay.nz/api/v1/invoices" class="btcpay-form btcpay-form--block" style="display:flex">
  <input type="hidden" name="storeId" value="2KNSmcv9UpkYPmCnn4iR5McDR4kkNnhiFyC3grxPSZwx" />
  <input type="hidden" name="orderId" value="" />
  <input type="hidden" name="checkoutDesc" value="Wallet Support by WalletScrutiny.com" />
  <input type="hidden" name="serverIpn" value="{{ base_path }}/invoiceCB/">
  <input type="hidden" name="browserRedirect" value="{{ base_path }}/walletSupport/">
  <div style="text-align:center">
    <table>
      <tr><td>Upfront payment</td><td>Success payment</td><td>Value of support</td></tr>
      <tr><td>
        <input id='btcpay-input-price_7826565_1' name="price" type="text"
          style="width: 8em;" onInput="update(1)" placeholder="Amount" />
      </td><td>
        <input id='btcpay-input-price_7826565_2' type="text"
          style="width: 8em;" onInput="update(2)" placeholder="Amount" />
      </td><td>
        <input id='btcpay-input-price_7826565_3' type="text"
          style="width: 8em;" onInput="update(3)" placeholder="Amount" />
      </td></tr>
    </table>
    <div id="enterAmount" style="color:red;text-align:center">(please enter amount)</div>
    Currency:
    <select name="currency" style="display:inline">
      <option value="USD" selected>USD</option>
      <option value="GBP">GBP</option>
      <option value="EUR">EUR</option>
      <option value="BTC">BTC</option>
    </select>
  </div>
  <input type="image" class="submit" name="submit" src="https://pos.btcpay.nz/img/paybutton/pay.svg" style="width:209px" alt="Pay with BtcPay, Self-Hosted Bitcoin Payment Processor">
</form>
