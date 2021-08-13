// this was not meant to be committed in that commit. I think it was just an experiment.

const request = require("request")
const fs = require('fs')

// scanning one more in each dimension
const url = "https://sheets.googleapis.com/v4/spreadsheets/134GQ4nvOpAFNKO5w0ZvbNGmfczj1PF18AI0BJwzVXx8/values/A1:ZZ999?key=AIzaSyAl0h0UwhE1y-Z6SYN4U8CVpLkdz1zycOM"
const models = {
  'Ledger Nano S': {id: 'ledgerNanoS'},
  'Ledger Nano X': {id: 'ledgerNanoX'},
  'Keepkey': {id: 'keepkey'},
  'Trezor One': {id: 'trezorone'},
  'Trezor Model T': {id: 'trezort'},
  'Coldcard Mk3': {id: 'coldcardmk3'},
  'Safepal S1': {id: 'safepals1'},
  'Cobo Vault Pro': {id: 'cobovaultpro'},
  'Bitbox02': {id: 'bitbox02'}
}
const headers = [
  'Model',
  'Score',
  'Black Friday Sale Price',
  'Black Friday Code',
  'Purchase Link (Some Affiliate)',
  'Normal Price (USD)',
  'Security Score',
  'Privacy Score',
  'Wallet Features',
  'Audit ability Score',
  'Coin Support',
  '"2 Factor" Device Pin Option',
  'Secure Element',
  'Device Verification',
  'Unique Device Identifier/Genuine Check',
  'Trusted Screen',
  'Send Verification',
  'Recieve Verification (Default Workflow)',
  'Default Seed Words Length',
  'Max Supported Seed Length',
  'BIP39 Passphrase Support',
  'On-Device BIP39 Passphrase Entry',
  'One-Time BIP39 Passphrase Entry',
  'Alpha-Numeric Device Pin Support',
  '"Hidden Wallet" PIN',
  'Duress Pin',
  'Fully On-Device Seed Recovery/Verification',
  'Offline TX Signing (By Default)',
  'Offline TX Signing (3rd Party Wallet)',
  'Can initialise/operate entirely with 3rd party tools',
  'Ability to add extra entropy at seed initialisation',
  'MultiSig Support',
  '3rd Party Wallet Support',
  'Full Node Support (Via 3rd Party Software)',
  'Default Software Automatically generates fresh address for each TX (For UTXO coins)',
  'Default Software: Basic Coin Control (Multiple Accounts, Select Send Address)',
  'Advanced Coin Control (Via 3rd Party Software)',
  'Physical Hardware Auditibility',
  'Hardware Software Auditability',
  'Signing Communication Auditability',
  'Default Wallet Software Auditability',
  'Detailed Documentation',
  '"n00b Friendly" default wallet',
  'Testnet Support',
  'Can Export XPUB keys',
  'Desktop Wallet Software Available',
  'Android Wallet Software Available',
  'iOS Wallet Software Available',
  'Good for Multi-Coin HODL',
  'Good for Regular Mutli-Coin Trading/Transactions',
  'U2F Support',
  'Current, reliable software and tools',
  'Proportion (%) of Seed Backup Verified at First Setup',
  'Ability to reset if device PIN is forgotten',
  'Supports Checking Recovery Phrase At Any Time',
  'Supports Segwit and Native Segwit',
  'Support for Multiple Accounts per Crypto',
  'Supports Signing Messages',
  'Unlock/Sign bia biometrics',
  'HSM Mode',
  'Review Details Last Updated (DD/MM/YYYY)'
]

request({
  url: url,
  json: true
}, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    const table = body.values
    remoteHeaders = table.shift()
    checkLabelsAndDimensions(table, remoteHeaders)
    table.forEach(row => {
      model = models[row[0]]
      row.forEach(col => {
        console.log(col)
      })
    })
    console.log(body.values)
  }
})

function checkLabelsAndDimensions(table, remoteHeaders) {
  // check if attributes changed
  if (remoteHeaders.length != headers.length) {
    console.log(remoteHeaders)
    console.error(`Manual intervention required. Attributes were added or removed!`)
    process.exit(1)
  }
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] != remoteHeaders[i]) {
      console.log(remoteHeaders)
      console.error(`Manual intervention required. Header #${i} changed from "${headers[i]}" to "${remoteHeaders[i]}".`)
      process.exit(1)
    }
  }
  // check if models changed
  if (Object.keys(models).length != table.length) {
    console.log(table)
    console.error(`Manual intervention required. Models were added or removed!`)
    process.exit(1)
  }
  for (var i = 0; i < table.length; i++) {
    if (models[table[i][0]] == undefined) {
      console.error(`Manual intervention required. Model ${table[i][0]} not managed yet.`)
      process.exit(1)
    }
  }
}