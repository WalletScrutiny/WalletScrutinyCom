const appStore = require('./scripts/helperAppStore.js')
const playStore = require('./scripts/helperPlayStore.js')
const fs = require('fs')
const dateFormat = require('dateformat')
const readline = require('readline')

async function refresh() {
  fs.appendFileSync('_data/defunct.yaml', `${dateFormat(new Date(), "yyyy-mm-dd")}:\n`)
  appStore.refreshAll()
  playStore.refreshAll()
  const updateMillis = 500
  const i = setInterval(() => {
    readline.clearLine(process.stdout)
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(`remaining: ${playStore.stats.remaining + appStore.stats.remaining}, 🤖: defunct ${playStore.stats.defunct}, updated ${playStore.stats.updated}, 🍎: defunct ${appStore.stats.defunct}, updated ${appStore.stats.updated}`)
    readline.cursorTo(process.stdout, 0) // other console.out stuff should write over this.
    if (playStore.stats.remaining + appStore.stats.remaining == 0) {
      console.log(`
        Finished.`)
      clearInterval(i)
    }
  }, updateMillis)
}

module.exports = {
  refresh
}
