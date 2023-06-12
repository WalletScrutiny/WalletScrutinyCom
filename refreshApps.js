const appStore = require('./scripts/helperAppStore.js')
const playStore = require('./scripts/helperPlayStore.js')
const hardware = require('./scripts/helperHardware.js')
const fs = require('fs')
const dateFormat = require('dateformat')
const readline = require('readline')

async function refresh (markDefunct, apps, githubApi) {
  fs.appendFileSync('_data/defunct.yaml', `${dateFormat(new Date(), 'yyyy-mm-dd')}:\n`)
  if (apps) {
    const ids = apps.split(',')
    const appStoreIds = ids.filter(it => it.startsWith('iphone')).map(it => it.split('/')[1])
    const playStoreIds = ids.filter(it => it.startsWith('android')).map(it => it.split('/')[1])
    const hardwareIds = ids.filter(it => it.startsWith('hardware')).map(it => it.split('/')[1])
    appStore.refreshAll(appStoreIds, markDefunct, githubApi)
    playStore.refreshAll(playStoreIds, markDefunct, githubApi)
    hardware.refreshAll(hardwareIds, githubApi)
  } else {
    appStore.refreshAll(undefined, undefined, githubApi)
    playStore.refreshAll(undefined, undefined, githubApi)
    hardware.refreshAll(undefined, githubApi)
  }
  const updateMillis = 500
  var msg = ''
  var msgAgeMs = 0
  const i = setInterval(() => {
    const newMsg = `remaining: ${playStore.stats.remaining + appStore.stats.remaining + hardware.stats.remaining}, 🤖: defunct ${playStore.stats.defunct}, updated ${playStore.stats.updated}, 🍎: defunct ${appStore.stats.defunct}, updated ${appStore.stats.updated}, 🗃: defunct ${hardware.stats.defunct}, updated ${hardware.stats.updated}`
    readline.clearLine(process.stdout)
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(newMsg)
    readline.cursorTo(process.stdout, 0) // other console.out stuff should write over this.
    if (msg === newMsg) {
      msgAgeMs += updateMillis
    } else {
      msg = newMsg
      msgAgeMs = 0
    }
    if (playStore.stats.remaining + appStore.stats.remaining + hardware.stats.remaining === 0 || msgAgeMs > 30000) {
      console.log(`
        Finished.`)
      clearInterval(i)
    }
  }, updateMillis)
}

module.exports = {
  refresh
}
