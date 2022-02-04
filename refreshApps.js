const appStore = require('./scripts/helperAppStore.js')
const playStore = require('./scripts/helperPlayStore.js')
const fs = require('fs')
const dateFormat = require('dateformat')
const readline = require('readline')

async function refresh() {
  fs.appendFileSync('_data/defunct.yaml', `${dateFormat(new Date(), "yyyy-mm-dd")}:\n`)
  appStore.refreshAll()
  playStore.refreshAll()
  var msg = ""
  var unchangedMillis = 0
  const updateMillis = 500
  const doneMillis = 10_000
  const i = setInterval(() => {
    const newMsg = `🤖: defunct ${playStore.stats.defunct}, updated ${playStore.stats.updated}, 🍎: defunct ${appStore.stats.defunct}, updated ${appStore.stats.updated}`
    readline.clearLine(process.stdout)
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(newMsg)
    readline.cursorTo(process.stdout, 0) // other console.out stuff should write over this.
    if (msg == newMsg) {
      unchangedMillis += updateMillis
    } else {
      msg = newMsg
      unchangedMillis = 0
    }
    if (unchangedMillis > doneMillis) {
      console.log(`
        Finished.`)
      clearInterval(i)
    }
  }, updateMillis)
}

module.exports = {
  refresh
}
