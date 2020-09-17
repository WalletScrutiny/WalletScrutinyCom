---
permalink: /walletSupport/
title: "Wallet Support"
---

{% include base_path %}

The team behind WalletScrutiny knows a lot about wallets and as not all wallet
providers have good support teams, we thought we could offer our expertise to
help users that are stuck with their Bitcoins.

<div style="border: solid 3px black; border-radius: 20px; background: var(--red-notify-background);
margin-bottom: 1em">
<div style="margin: 1em">
<h1 id="security">Security</h1>

<p>When accepting help from our or any other service, please be aware:</p>

<p><strong>Never ever share your backup</strong> or any private key
material with any third party. Our Wallet
Support will never ask you for your backup words or your passphrase or your
PIN or your private keys. If an agent does so, please report him immediately!
And if your case is special? No, your case is not special. We have many years of
experience with wallet support and not once was a user sharing a private key or
backup with the support team.</p>

<p><strong>Be aware of impersonators!</strong> Every wallet is struggling with
scammers running "support groups". If you search your wallet's name on Telegram
you might find "support groups" with 10.000 members but the first thing you will
get asked for when sharing your problem there is your backup. Share your problem on
Reddit and you will get approached by scammers! Scammers will often use the
profile pictures and names of Bitcoiners but if you cannot find a link from the
service to the support channel, the support channel is probably not affiliated!</p>
</div>
</div>

# How we work

You can reach us via the chat here on this site and we will try our best to help,
but we have our day jobs and families to support also. Our dream is to grow this
offering so everybody can get quick, top quality support when they have trouble with
any Bitcoin wallet, but for that, we have to charge a fee. At this time, we do
not charge a fixed fee or a percentage of funds recovered but we will attend to
those first, those that pay the most. Should we not get to help you, you will get
your payment reimbursed. The idea is that you make up your mind about what it
would be worth if we could help you with your issue. You then pay us 20% of that
up front to get our attention. Once your issue is resolved, you pay the
remaining 80%.

Let's say you have a backup but the wallet stopped working. You think there is
$500 in the wallet, so you decide recovering that would be worth $200. You pay
20% or $40 via the form below. If we manage to help you restore your $500, you
do a second payment over $160. If we worked on your case but could not help you,
you do spend the $40. If we do not get to look into your case within 48h after
your payment confirmed, you get your $40 back.

**To get support:**

1. Fill in what you are willing to pay for our support below.
1. Click "Pay with BTCpay", following the instructions there. You will get sent
   back here.
1. Once the payment is confirmed, contact us here in the chat on this page.
1. An agent will get back with you depending on payment and availability.

<script type="text/javascript">
  var orderId = "c" + (100000000000 * Math.random()).toFixed();

  function getOnlineChatAPI() {
    return new Promise(resolve => {
      if (window.$chatwoot && window.$chatwoot.hasLoaded) {
        resolve(window.$chatwoot)
      } else {
        setTimeout(function() {
          resolve(getOnlineChatAPI())
        }, 100)
      }
    })
  }

  // intercept payment form submit. Validate if amount is provided and show
  // warning if not.
  // tag the chat with the orderId that also gets submitted to btcPayServer
  // treat failure to tag as warning. We have the user's email address and can
  // provide support either way.
  function addFormSubmitInterception() {
    $('#payForm').submit(async function(e) {
      // we have to prevent default before going async with "await"
      e.preventDefault()
      if (update(1)) {
        var amount = $("#btcpay-input-price_7826565_1")[0].value
        var chatAPI = await getOnlineChatAPI()
        console.log("adding orderId " + orderId)
        var v = {
          orderId: orderId,
          state: "invoiced",
          amount: amount
        }
        console.log(v)
        chatAPI.setLabel("paid")
        chatAPI.setCustomAttributes(v)
        setTimeout(function() {
          $('#payForm').off('submit')
          $('#payForm').submit()
        }, 300)
      }
      return false
    })
  }

  window.addEventListener("load", function() {
    $("[name='orderId']")[0].value = orderId;
    addFormSubmitInterception()
  })
  
  // The amount can be set in 3 inputs. Here, the input gets validated and the
  // other two inputs get updated accordingly.
  function update(id) {
    var amount = $('#btcpay-input-price_7826565_' + id).val()
    var validated = true
    if (!amount.match(/^[\.0-9]+$/) || amount <= 0) {
      validated = false
      $('#enterAmount').hide("fast", function() { $(this).show("fast")})
    } else {
      $('#enterAmount').hide("fast")
    }
    switch (id) {
      case 1:
        $('#btcpay-input-price_7826565_2').val(amount * 4)
        $('#btcpay-input-price_7826565_3').val(amount * 5)
        break
      case 2:
        $('#btcpay-input-price_7826565_1').val(amount / 4)
        $('#btcpay-input-price_7826565_3').val(amount / 4 * 5)
        break
      case 3:
        $('#btcpay-input-price_7826565_1').val(amount / 5)
        $('#btcpay-input-price_7826565_2').val(amount / 5 * 4)
        break
    }
    return validated
  }
</script>

<form id="payForm" method="POST" action="https://pos.btcpay.nz/api/v1/invoices" class="btcpay-form btcpay-form--block" style="display:flex">
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
    <div id="enterAmount" style="color:red;text-align:center;display:none">(please enter amount)</div>
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

# What We Can Help You With

Feel free to ask us anything about Bitcoin wallets. If you are stuck and need
help interpreting a situation, we probably can help. 

* "Have I been paid?"
* "I sent the money but the merchant claims I haven't."
* "The transaction has not confirmed in days. Will it eventually?"
* "Why does my wallet suddenly charge excessive fees?"
* "How private is my wallet?"
* "What is coin-join?"
* "Lightning what?"

But we expect the most common question to be: **"Did I lose my coins?"**

If that is your question, you are probably panicking at least a bit right now.
**Don't panic!** There are many anonymous "helpful" people out there that will
try to make profit and you might lose your coins to them if you panic.

Usually one of the following situations applies:

* *Your wallet doesn't show your coins*: Your coins did not move to an address
  outside of your wallet but somehow your balance is zero. If your coins did not
  move, nothing major happened. Your coins are still protected by your backup.
  This might be a temporary or permanent failure of your wallet software but
  your funds are secure and **we can probably help you**. No hurry needed.
* *Your wallet/You sent your coins to an unknown address*: If your coins were
  sent to an address out of your control, the only way of recovering them is to
  convince the owner of that address to return them. If this happened because a
  virus swapped the receiving address of your payment with some hacker's
  address, there is no way of recovering the funds. You could report the
  incident to the police and it would certainly help to investigate which app
  introduced the virus but the funds are gone for good. *If your wallet supports
  RBF (replace-by-fee), you could in theory if you notice it right away and know
  how RBF works, undo the payment but this only works until the transaction has
  one confirmation.* If the thief is smart, he probably bumps the priority of
  RBF transactions so you have about 10 minutes to react. This is way too little
  for any support service to help you. Therefore: No hurry needed.
* *You restored from backup but your balance is zero*: Here, **we most likely
  can help you**. There are dozens of ways this can happen depending on the
  wallet of your choice. Again, there is no hurry needed. Don't panic.

In any case **do not delete or re-install anything**!

# Our agents are international

Our team is still small but we already can help you in:

* English
* Deutsch
* Español
* Česky

# Limitations

While we will try to help you with whatever you ask us, there are some things we
probably can't help you with.

## Custodial Services

If your money disappeared out of a custodial service, there is probably nothing
we can help you with. You stored your money in the wallet of a third party. You
will have to sort it out with them. We could advise in the process or help in
the communication but in the end your arrangement with them is that you have to
convince them to let you use "your" money.

## Lost Backup

It's in the nature of Bitcoin that if you lost your backup and wallet (Android
non-custodial wallet fell under the steam roller) there is
nothing that can bring back your funds. Knowing your addresses, remembering the
PIN etc. won't help. Those coins are probably
[lost for good](https://www.google.com/search?q=list+of+lost+bitcoins).

## Corrupted Backup

If you have a backup but it "doesn't work", **we probably can help**. That is if
you have 12 words or your backup is otherwise basically intact. We probably can
help you if you lost a tiny part of your backup but judging what constitutes
"tiny" is difficult. If you lost for example 6 of your 12 words, we can't help
you. There are other services we can refer you to if we can't help you in case
brute forcing the keys is feasible. We certainly can assist in feasibility
evaluations.

To re-iterate on the [Security Notice](#security), this "Wallet Support" will
never ask for your backup or part of your backup. If the feasibility evaluation
suggests that brute forcing on specialized hardware makes sense then we will
recommend experts that will assist with this. It is your responsibility to then
evaluate if the service of your choice is trustworthy and we recommend to make
clear contractual agreements and check the identity with whoever you are about
to share what you hope to be the keys to your Bitcoins. In doubt, involve a lawyer
and seek out an expert in your city or at least your country so legal recourse
becomes easier in case you are not satisfied with his work.
