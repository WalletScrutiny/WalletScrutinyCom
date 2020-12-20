// run this via sh script via docker

const fs = require('fs')

const newAppIds = process.argv.slice(2)

console.log(`Adding skeletons for ${newAppIds} ...`)

newAppIds.forEach(function(appId) {
    const path = `_android/${appId}.md`
    fs.exists(path, function(fileExists) {
      if (!fileExists) {
        const file = fs.createWriteStream(path)
        file.write(`---
appId: ${app.appId}
verdict: wip
---
`)
      }
    })
})
