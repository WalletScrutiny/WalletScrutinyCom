const helper = require('./scripts/helperPlayStore.js')
const newAppIds = process.argv.slice(2)

helper.add(newAppIds)
