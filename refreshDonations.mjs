process.env.TZ = 'UTC'; // fix timezone issues
import fs from 'fs';

const btcpayServerUrl = 'https://pos.btcpay.nz';
const storeId = 'EHan8qV5JseDSNWtTJeaNFeG3xes9CDSq3bMfmwehcJE';
const apiEndpoint = `/api/v1/stores/${storeId}/invoices?status=Settled`;
const apiKey = process.argv[2];
if (apiKey === undefined) {
  console.error('No API key provided. Skipping Donations update.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'token ' + apiKey
};

fetch(btcpayServerUrl + apiEndpoint, {
  method: 'GET',
  headers: headers
})
  .then(response => response.json())
  .then(data => {
    console.log('data', data);

    const path = '_includes/donationSummary.html';
    const file = fs.createWriteStream(path);
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
    };

    const historyCount = 20;
    file.write(`<h3>${historyCount} most recent donations</h3>
<table>
<tr><th>Date</th><th>Amount</th><th>Category</th></tr>
`);
    invoices.slice(0, historyCount).forEach(invoice => {
      const date = new Date(invoice.invoiceTime);
      file.write(`<tr><td><span title='${date.toLocaleDateString()
        }' class='calculate-time-elapsed' data='${date.valueOf() / 1000}'>${date.toLocaleDateString()}</span></td><td>${getPrettyAmount(
          getAmount(invoice))}</td><td>${getCategory(invoice.itemDesc)}</td></tr>\n`);
    });
    file.write('<tr><td>...</td><td>...</td><td>...</td></tr>\n</table>\n');
    invoices.forEach(invoice => {
      addToCategory(sum, invoice.itemDesc, getAmount(invoice));
    });
    file.write(`<h3>All donations by category</h3>
<table><tr><th>Category</th><th>Sum</th></tr>
`);
    var total = 0;
    const items = Object.keys(sum).map(key => {
      return [key, sum[key]];
    });
    items.sort((a, b) => { return b[1] - a[1]; });
    for (var i in items) {
      var item = items[i];
      var s = item[1];
      if (s > 0) {
        var cat = item[0];
        total += s;
        file.write(`<tr><td>${cat}</td><td>${getPrettyAmount(s)}</td></tr>\n`);
      }
    }
    file.write(`<tr><th>Total</th><th>${getPrettyAmount(total)}</th></tr>
</table>`);
  })
  .catch(console.error);


function addToCategory(sum, itemDesc, btc) {
  sum[getCategory(itemDesc)] += btc;
}

function getCategory(itemDesc) {
  var cat = 'Any';
  if (itemDesc !== undefined && itemDesc.indexOf(' - ') > 0) {
    const parts = itemDesc.split(' - ');
    cat = parts[parts.length - 1];
    if (sum[cat] === undefined) {
      cat = 'Any';
    }
  }
  return cat;
}

function getAmount(invoice) {
  var btc = 0;
  invoice.cryptoInfo.forEach(ci => {
    btc += Number(ci.cryptoPaid);
  });
  return btc;
}

function getPrettyAmount(amount) {
  var multiplier, symbol;
  amount = Number(amount.toPrecision(2));
  if (amount > 1) {
    multiplier = 1;
    symbol = 'BTC';
  } else if (amount > 0.001) {
    multiplier = 1_000;
    symbol = 'mBTC';
  } else if (amount > 0.000_001) {
    multiplier = 1_000_000;
    symbol = 'µBTC';
  } else {
    multiplier = 100_000_000;
    symbol = 'sat';
  }
  return `~${parseFloat((amount * multiplier).toFixed(1))}${symbol}`;
}
