process.env.TZ = 'UTC'; // fix timezone issues
import fs from 'fs';

const btcpayServerUrl = 'https://pos.btcpay.nz';
const storeId = '7WhWPWK41yURwAUoY8SiAsrvVzkSXyndHfLJKX2aanAK';
const apiEndpointInvoices = `/api/v1/stores/${storeId}/invoices?status=Settled`;
const apiKey = process.argv[2];
if (apiKey === undefined) {
  console.error('No API key provided. Skipping Donations update.');
  process.exit(1);
}

console.log('Starting donations update...');

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'token ' + apiKey
};

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

fetch(btcpayServerUrl + apiEndpointInvoices, {
  method: 'GET',
  headers: headers
})
  .then(response => response.json())
  .then(async invoices => {
    if (!invoices.length) {
      console.error(invoices);
      process.exit(1);
    }

    const path = '_includes/donationSummary.html';
    const file = fs.createWriteStream(path);
    const historyCount = 20;
    let count = 0;

    file.write(`<h3>${historyCount} most recent donations</h3>
<table>
<tr><th>Date</th><th>Amount</th><th>Category</th></tr>
`);

    for (const invoice of invoices) {
      const apiEndpointPaymentMethods = `/api/v1/stores/${storeId}/invoices/${invoice.id}/payment-methods`;
      let amountPaidBTC = 0;

      await fetch(btcpayServerUrl + apiEndpointPaymentMethods, {
        method: 'GET',
        headers: headers
      })
        .then(response => response.json())
        .then(paymentMethods => {
          amountPaidBTC = getAmount(paymentMethods);

          addToCategory(invoice.metadata.itemDesc, amountPaidBTC);

          if (count < historyCount) {
            const date = new Date(invoice.createdTime * 1000);

            file.write(`<tr><td><span title='${date.toLocaleDateString()
              }' class='calculate-time-elapsed' data='${date.valueOf() / 1000}'>${date.toLocaleDateString()}</span></td><td>${getPrettyAmount(
                amountPaidBTC)}</td><td>${getCategory(invoice.metadata.itemDesc)}</td></tr>\n`);
            count++;
          }
        })
        .catch(console.error);
    };

    file.write('<tr><td>...</td><td>...</td><td>...</td></tr>\n</table>\n');

    file.write(`<h3>All donations by category</h3>
<table><tr><th>Category</th><th>Sum</th></tr>
`);

    let total = 0;

    const items = Object.keys(sum).map(key => {
      return [key, sum[key]];
    });

    items.sort((a, b) => { return b[1] - a[1]; });

    for (const i in items) {
      let item = items[i];
      let s = item[1];
      if (s > 0) {
        let cat = item[0];
        total += s;
        file.write(`<tr><td>${cat}</td><td>${getPrettyAmount(s)}</td></tr>\n`);
      }
    }
    file.write(`<tr><th>Total</th><th>${getPrettyAmount(total)}</th></tr>
</table>`);
  })
  .catch(console.error);

function addToCategory(itemDesc, btc) {
  sum[getCategory(itemDesc)] += btc;
}

function getCategory(itemDesc) {
  let cat = 'Any';
  if (itemDesc !== undefined && itemDesc.indexOf(' - ') > 0) {
    const parts = itemDesc.split(' - ');
    cat = parts[parts.length - 1];
    if (sum[cat] === undefined) {
      cat = 'Any';
    }
  }
  return cat;
}

function getAmount(paymentMethods) {
  let btcPaid = 0;

  paymentMethods.forEach(paymentMethod => {
    if (paymentMethod.paymentMethodPaid !== '0') {
      btcPaid += Number(paymentMethod.paymentMethodPaid);
    }
  });

  return btcPaid;
}

function getPrettyAmount(amount) {
  let multiplier, symbol;
  amount = Number(amount.toPrecision(2));
  if (amount >= 0.01) {
    multiplier = 1;
    symbol = 'BTC';
  } else {
    multiplier = 100_000_000;
    symbol = 'sat';
  }
  return `~${parseFloat((amount * multiplier).toFixed(3))} ${symbol}`;
}
