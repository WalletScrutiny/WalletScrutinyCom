// run this via sh script via docker
const fs = require('fs')
const apple = require('app-store-scraper')
const newIdds = process.argv.slice(2)
const helper = require('./scripts/helperAppStore.js')

console.log(`Adding skeletons for ${newIdds} ...`)

newIdds.forEach( param => {
  var idd = undefined
  var appId = undefined
  var country = undefined
  if (param.includes("/")) {
    const parts = param.split("/")
    country = parts[0]
    param = parts[1]
  }
  if (isNaN(param)) {
    appId = param
  } else {
    idd = param
  }
  if (appId) {
    helper.refreshFile(`${appId}.md`)
  } else {
    apple.app({
        id: idd,
        lang: 'en',
        country: country || "cl",
        throttle: 20}).then( app => {
      const path = `_iphone/${app.appId}.md`
      fs.exists(path, fileExists => {
        if (!fileExists) {
          const file = fs.createWriteStream(path)
          file.write(`---
appId: ${app.appId}
idd: ${idd}
appCountry: ${country || "" }
verdict: wip
---
`,
          err => {
            if (err)
              console.error(`Error with id ${idd}: ${err}`)
            console.log(`Success: ${path}`)
            helper.refreshFile(`${app.appId}.md`)
          })
        } else {
          console.warn(`${path} / http://walletscrutiny.com/iphone/${app.appId} already exists. Refreshing ...`)
          helper.refreshFile(`${app.appId}.md`)
        }
      })
    }, err => {
      console.error(`Error with id ${idd}: ${err}`)
    })
  }
})
