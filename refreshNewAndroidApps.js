// run this via sh script via docker

const fs = require('fs')
const helper = require('./scripts/helperPlayStore.js')

const newAppIds = process.argv.slice(2)

console.log(`Adding skeletons for ${newAppIds} ...`)

newAppIds.forEach(function(appId) {
    const path = `_android/${appId}.md`
    fs.exists(path, function(fileExists) {
      if (!fileExists) {
        const file = fs.createWriteStream(path)
        file.write(`---
appId: ${appId}
verdict: wip
---
`,
        function(err) {
          if (err)
            console.error(`Error with id ${idd}: ${err}`)
          console.log(`Success: ${path}`)
          helper.refreshFile(`${appId}.md`)
        })
      }
    })
})
