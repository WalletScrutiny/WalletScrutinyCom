const key = process.argv[2]
if (key == undefined) {
  console.error("No key provided. Skipping Donations update.")
  return
}

process.env.TZ = 'UTC' // fix timezone issues
const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from(key, 'hex'))
const client = new btcpay.BTCPayClient("https://pos.btcpay.nz", keypair, {merchant: 'EHan8qV5JseDSNWtTJeaNFeG3xes9CDSq3bMfmwehcJE'})
const path = "_includes/donationSummary.html"
const fs = require('fs')
const file = fs.createWriteStream(path)
const sum = {
  Any: 0,
  MoreWallets: 0,
  FrequentUpdates: 0,
  AdCampaign: 0,
  MoreOS: 0,
  CodeReviews: 0,
  NonBitcoinWallets: 0,
  Alerts: 0,
  NonWalletApps: 0
}

client.get_invoices({status: "complete"}).then( invoices => {
  const historyCount = 20
  file.write(`<h3>${historyCount} most recent donations</h3>\n<table>`)
  file.write(`<tr><th>Date</th><th>Amount</th><th>Category</th></tr>\n`)
  invoices.slice(0, historyCount).forEach(invoice => {
    file.write(`<tr><td>${new Date(invoice.invoiceTime).toLocaleDateString()}</td><td>${getPrettyAmount(getAmount(invoice))}</td><td>${getCategory(invoice.itemDesc)}</td></tr>\n`)
  })
  file.write(`<tr><td>...</td><td>...</td><td>...</td></tr>\n</table>\n`)
  invoices.forEach(invoice => {
    addToCategory(sum, invoice.itemDesc, getAmount(invoice))
  })
  file.write(`<h3>All donations by category</h3>\n<table><tr><th>Category</th><th>Sum</th></tr>\n`)
  var total = 0
  for (cat in sum) {
    total += sum[cat]
    file.write(`<tr><td>${cat}</td><td>${getPrettyAmount(sum[cat])}</td></tr>\n`)
  }
  file.write(`<tr><th>Total</th><th>${getPrettyAmount(total)}</th></tr></table>\n`)
}).catch(console.error)

function addToCategory(sum, itemDesc, btc) {
  sum[getCategory(itemDesc)] += btc
}

function getCategory(itemDesc) {
  var cat = "Any"
  if (itemDesc != undefined && itemDesc.indexOf(" - ") > 0) {
    const parts = itemDesc.split(" - ")
    cat = parts[parts.length - 1]
    if (sum[cat] == undefined) {
      cat = "Any"
    }
  }
  return cat
}

function getAmount(invoice) {
  var btc = 0
  invoice.cryptoInfo.forEach(ci =>
    btc += Number(ci.cryptoPaid)
  )
  return btc
}

function getPrettyAmount(amount) {
  return parseFloat((amount * 1000).toFixed(5)) + "mBTC"
}