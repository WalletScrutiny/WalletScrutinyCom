const appStore = require('./scripts/helperAppStore.js')
const playStore = require('./scripts/helperPlayStore.js')
const fs = require('fs')
const dateFormat = require('dateformat')

fs.appendFileSync('_data/defunct.yaml', `${dateFormat(new Date(), "yyyy-mm-dd")}:\n`)
appStore.refreshAll()
playStore.refreshAll()
setInterval(() => {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(`🤖: defunct ${playStore.stats.defunct}, updated ${playStore.stats.updated}, badReply ${playStore.stats.badReply}, 🍎: defunct ${appStore.stats.defunct}, updated ${appStore.stats.updated}`)
  process.stdout.cursorTo(0) // other console.out stuff should write over this.
}, 200)