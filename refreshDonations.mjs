process.env.TZ = 'UTC'; // fix timezone issues
import fs from 'fs';

const btcpayServerUrl = 'https://pos.btcpay.nz';
const storeId = '7WhWPWK41yURwAUoY8SiAsrvVzkSXyndHfLJKX2aanAK';
const historyCount = 10;
const apiEndpointInvoices = `/api/v1/stores/${storeId}/invoices?status=Settled&take=${historyCount}`;
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

    const file = fs.createWriteStream('_includes/donationSummary.html');

    file.write(`<h3>${historyCount} most recent donations</h3>
<table>
<tr><th>Date</th><th>Amount</th></tr>
`);

    for (const invoice of invoices) {
      const apiEndpointPaymentMethods = `/api/v1/stores/${storeId}/invoices/${invoice.id}/payment-methods`;
      await fetch(btcpayServerUrl + apiEndpointPaymentMethods, {
        method: 'GET',
        headers: headers
      })
        .then(response => response.json())
        .then(paymentMethods => {
          const date = new Date(invoice.createdTime * 1000);

          file.write(`<tr><td><span title='${date.toLocaleDateString()
            }' class='calculate-time-elapsed raw' data='${date.valueOf() / 1000}'>${date.toLocaleDateString()}</span></td><td>${getPrettyAmount(
              getAmount(paymentMethods))}</td></tr>\n`);
        })
        .catch(console.error);
    };

    file.write('<tr><td>...</td><td>...</td></tr>\n</table>\n');
  })
  .catch(console.error);

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
