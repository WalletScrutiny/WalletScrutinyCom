const appStore = require('./scripts/helperAppStore.js')
const playStore = require('./scripts/helperPlayStore.js')
const fs = require('fs')
const dateFormat = require('dateformat')

fs.appendFileSync('_data/defunct.yaml', `${dateFormat(new Date(), "yyyy-mm-dd")}:\n`)
appStore.refreshAll()
playStore.refreshAll()
var msg = ""
const i = setInterval(() => {
  const newMsg = `🤖: defunct ${playStore.stats.defunct}, updated ${playStore.stats.updated}, badReply ${playStore.stats.badReply}, 🍎: defunct ${appStore.stats.defunct}, updated ${appStore.stats.updated}`
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(newMsg)
  process.stdout.cursorTo(0) // other console.out stuff should write over this.
  if (msg == newMsg) {
    console.log(`
      Finished.`)
    clearInterval(i)
  } else {
    msg = newMsg
  }
}, 1000)