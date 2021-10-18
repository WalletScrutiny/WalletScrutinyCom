const appStore = require('./scripts/helperAppStore.js')
const playStore = require('./scripts/helperPlayStore.js')
const fs = require('fs')
const dateFormat = require('dateformat')

fs.appendFileSync('_data/defunct.yaml', `${dateFormat(new Date(), "yyyy-mm-dd")}:\n`)
appStore.refreshAll()
playStore.refreshAll()
