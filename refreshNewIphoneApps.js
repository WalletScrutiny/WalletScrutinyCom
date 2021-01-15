// run this via sh script via docker
const fs = require('fs')
const apple = require('app-store-scraper')
const newIdds = process.argv.slice(2)

console.log(`Adding skeletons for ${newIdds} ...`)

newIdds.forEach(function(idd) {
  apple.app({
      id: idd,
      lang: 'en',
      country: 'us',
      throttle: 5}).then(function(app){
        const path = `_iphone/${app.appId}.md`
        fs.exists(path, function(fileExists) {
          if (!fileExists) {
            const file = fs.createWriteStream(path)
            file.write(`---
appId: ${app.appId}
idd: ${idd}
verdict: wip
---
`)
          }
        })
      }, function(err){
        console.error(`Error with id ${idd}: ${err}`)
      });
})
